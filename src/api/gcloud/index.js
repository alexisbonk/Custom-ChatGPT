const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export const sendAudioToGoogleSpeechToText = async (base64Audio) => {
    try {
      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            languageCode: 'fr-FR',
          },
          audio: {
            content: base64Audio,
          },
        }),
      });
  
      const data = await response.json();
      return data.results?.[0]?.alternatives?.[0]?.transcript || 'No transcript available';
    } catch (error) {
      console.error('Error converting audio to text:', error);
      return null;
    }
  };

 export const sendTextToGoogleTextToSpeech = async (text, selectedVoice) => {
    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            text: text,
          },
          voice: {
            languageCode: selectedVoice.languageCode,
            name: selectedVoice.value
          },
          audioConfig: {
            audioEncoding: 'MP3',
          },
        }),
      });
  
      const data = await response.json();
      return data.audioContent;
    } catch (error) {
      console.error('Erreur lors de la conversion texte en audio :', error);
      return "Une erreur s'est produite lors de la conversion texte en audio.";
    }
  };