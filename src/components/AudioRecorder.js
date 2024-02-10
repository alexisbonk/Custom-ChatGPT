import React, { useState, useRef, useEffect } from 'react';

import { sendPromptToChatGpt, selfDiscuss } from '../api/openai';
import { sendAudioToGoogleSpeechToText, sendTextToGoogleTextToSpeech } from '../api/gcloud/index'

const isMobileDevice = () => {
  return (
    (typeof window.orientation !== "undefined") ||
    (navigator.userAgent.indexOf('IEMobile') !== -1) ||
    window.innerWidth <= 800
  );
};

export const AudioRecorder = ({
  onAudioPlaying,
  onAudioStop,
  selectedVoice,
  selfDiscussEnabled,
  isRecording,
  setIsRecording,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const audioTagRef = useRef(null);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const welcomeMessage = async () => {
      const audioContent = await sendTextToGoogleTextToSpeech('Hello! Que puis-je faire pour toi?', selectedVoice);
      await playAudioResponse(audioContent);
    };
    welcomeMessage()
  }, []);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.code === 'Space' && !isRecording) {
        setIsSpacePressed(true);
        startRecording();
      }
    };

    const handleKeyup = (event) => {
      if (event.code === 'Space' && isSpacePressed) {
        setIsSpacePressed(false);
        stopRecording();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [isRecording, isSpacePressed]);
  

  const startRecording =() => {
    setIsRecording(true);
    setIsProcessing(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => audioChunks.current.push(e.data);
        recorder.start();

        mediaRecorder.current = recorder;
        setIsRecording(true);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());

      mediaRecorder.current.onstop = async () => {
        setIsRecording(false);
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
  };

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

  const processTranscription = async (transcript) => {
    const chatGptResponse = selfDiscussEnabled ? await selfDiscuss(transcript) : await sendPromptToChatGpt(transcript);
    const audioContent = await sendTextToGoogleTextToSpeech(chatGptResponse, selectedVoice);
    await playAudioResponse(audioContent);
    selfDiscussEnabled && processTranscription(chatGptResponse, selectedVoice);
  };

  const playAudioResponse = (base64Audio) => {
    const promise = new Promise((resolve) => {
      const audioSrc = 'data:audio/mp3;base64,' + base64Audio;
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    
      audioRef.current = new Audio(audioSrc);
    
      audioRef.current.play();
    
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsProcessing(false);
        resolve();
      };
    
      setIsPlaying(true);
    });
    onAudioPlaying && onAudioPlaying(promise);
    return promise;
  };
  
  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsProcessing(false);
      onAudioStop && onAudioStop();
    }
  };

  return (
    <div
      className='audio-recorder-container'
      onTouchStart={() => {
        !isMobile && setIsSpacePressed(true);
        startRecording();
      }}
      onTouchEnd={() => {
        !isMobile && setIsSpacePressed(false);
        stopRecording();
      }}
    >
      {!isMobile && (isPlaying ? (
        <button onClick={stopAudioPlayback}>Stop Audio</button>
      ) : isRecording || isProcessing ? (
        <></>
      ) : (
        <h5>Hold Space bar to start recording</h5>
      ))}
      <audio controls ref={audioTagRef} style={{display: 'none'}}/>
    </div>
  );
};

export default AudioRecorder;
