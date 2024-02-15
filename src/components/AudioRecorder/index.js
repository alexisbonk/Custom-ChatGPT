import React, { useRef, useEffect, useCallback } from 'react';

import { sendPromptToChatGpt, selfDiscuss } from '../../api/openai';
import { sendAudioToGoogleSpeechToText, sendTextToGoogleTextToSpeech } from '../../api/gcloud/index'
import { useMainContext } from '../../hooks/useMainContext';
import Button from './Button';

import './AudioRecorder.css';

export const AudioRecorder = () => {
  const {
    isPlaying,
    isProcessing,
    setIsPlaying,
    setIsRecording,
    isRecording,
    setIsProcessing,
    selectedVoice,
    selectedVersion,
    selfDiscussEnabled,
  } = useMainContext();

  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const audioTagRef = useRef(null);

  const playAudioResponse = useCallback((base64Audio) => {
    const promise = new Promise((resolve) => {
      const audioSrc = 'data:audio/mp3;base64,' + base64Audio;
      
      if (audioRef.current) {
        if (!audioRef.current.paused) audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    
      audioRef.current = new Audio(audioSrc);
    
      audioRef.current.play();
    
      audioRef.current.onended = () => {
        setIsPlaying(false);
        resolve();
      };
    
      setIsPlaying(true);
    });
    return promise;
  }, [setIsPlaying]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => audioChunks.current.push(e.data);
        recorder.start();

        mediaRecorder.current = recorder;
        setIsRecording(true);
      });
  }, [setIsRecording]);

  const processTranscription = useCallback(async (transcript) => {
    setIsProcessing(true);
    const chatGptResponse = selfDiscussEnabled ? await selfDiscuss(transcript, selectedVersion) : await sendPromptToChatGpt(transcript, selectedVersion);
    const audioContent = await sendTextToGoogleTextToSpeech(chatGptResponse, selectedVoice);
    setIsProcessing(false);
    await playAudioResponse(audioContent);
    selfDiscussEnabled && processTranscription(chatGptResponse, selectedVoice);
  }, [playAudioResponse, selectedVoice, selfDiscussEnabled, setIsProcessing]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());

      mediaRecorder.current.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        if (audioTagRef.current.src) {
          audioTagRef.current.src = '';
          URL.revokeObjectURL(audioRef.src);
        }

        const audioBlob = new Blob(audioChunks.current, { 'type' : 'audio/webm' });
        const newAudioUrl = URL.createObjectURL(audioBlob);
        audioTagRef.current.src = newAudioUrl;

        audioChunks.current = [];

        const base64Audio = await blobToBase64(audioBlob);
        const transcript = await sendAudioToGoogleSpeechToText(base64Audio);
        if (transcript) processTranscription(transcript);
      };
    }
  }, [processTranscription, setIsProcessing, setIsRecording]);

  useEffect(() => {
    const handleKeydown = (event) => event.code === 'Space' && !isRecording && startRecording();
    const handleKeyup = (event) => event.code === 'Space' && isRecording && stopRecording();
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [isRecording, startRecording, stopRecording]);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  };
  
  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div
      className='audio-recorder-container'
      onTouchStart={() => !isRecording && !isProcessing && !isPlaying && startRecording()}
      onTouchEnd={() => isRecording && stopRecording()}
    >
      <Button stopAudioPlayback={stopAudioPlayback} startRecording={startRecording} stopRecording={stopRecording} />
      <audio controls ref={audioTagRef} style={{ display: 'none' }}/>
    </div>
  );
};

export default AudioRecorder;
