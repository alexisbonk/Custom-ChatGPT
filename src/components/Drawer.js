import React, { useState, useEffect, useRef } from 'react';
import { setInitPrompt } from '../api/openai';
import './Drawer.css';

export const voices = [
  { language: 'FR', languageCode: 'fr-FR', name: 'Français', value: 'fr-FR-Standard-D', genre: 'Male' },
  { language: 'FR', languageCode: 'fr-FR', name: 'Français', value: 'fr-FR-Wavenet-C', genre: 'Female' },
  { language: 'FR', languageCode: 'fr-FR', name: 'Québécois', value: 'fr-CA-Wavenet-B', genre: 'Male' },
  { language: 'EN', languageCode: 'en-US', name: 'Anglais', value: 'en-US-Standard-D', genre: 'Male' },
  { language: 'DE', languageCode: 'de-DE', name: 'Allemand', value: 'de-DE-Polyglot-1', genre: 'Male' },
];

const Drawer = ({ onVoiceSelect, selfDiscussEnabled, setSelfDiscussedEnabled }) => {
  const [value, setValue] = useState(localStorage.getItem('initPrompt') || '');
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('initPrompt')) {
      setInitPrompt(localStorage.getItem('initPrompt'));
    }

    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleVoiceChange = (event) => {
    const selectedVoiceName = event.target.value;
    const selectedVoiceObject = voices.find(voice => voice.name === selectedVoiceName);
    setSelectedVoice(selectedVoiceObject);
    onVoiceSelect(selectedVoiceObject);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`drawer-container ${isOpen ? 'open' : ''}`} ref={drawerRef}>
        <h3 className="drawer-title">ChatPéTé</h3>
        <div className="drawer-title-divider"></div>
        <div className="voice-select-container">
          <h5 className="voice-select-label">Voice model</h5>
          <select className="voice-select" value={selectedVoice.name} onChange={handleVoiceChange}>
            {voices.map(voice => (
              <option key={voice.value} value={voice.name}>
                ({voice.language}) {voice.name} - {voice.genre}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <h5 className="input-label">Custom prompt</h5>
          <textarea
            className="input-textarea"
            value={value}
            onChange={(event) => {
              setInitPrompt(event.target.value);
              setValue(event.target.value);
              localStorage.setItem('initPrompt', event.target.value);
            }}
            style={{ width: '100%', height: 200 }}
          ></textarea>
        </div>
        <div className="checkbox-container">
          <label className="checkbox-label">
            Loop:&nbsp;
            <input
              className="checkbox-input"
              type="checkbox"
              checked={selfDiscussEnabled}
              onChange={() => setSelfDiscussedEnabled(!selfDiscussEnabled)}
            />
          </label>
        </div>
      </div>
      {!isOpen &&
        <div className="drawer-toggle" onClick={toggleDrawer}>
          {isOpen ? '\u2190' : '\u2192'}
        </div>
      }
    </>
  );
};

export default Drawer;
