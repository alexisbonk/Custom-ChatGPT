import React, { useState, useEffect, useRef } from 'react';
import Lottie from "lottie-react";
import { setPrimarySystemPrompt, setSecondarySystemPrompt, setInitialHistory } from '../../api/openai';
import { useMount } from '../../hooks/useMount';
import { voices, versions } from '../../utils/constants';
import { useMainContext } from '../../hooks/useMainContext';

import CussingEmojiChecked from '../../assets/cussing.json';
import CussingEmojiUnchecked from '../../assets/cussing-d.json';
import KissEmojiChecked from '../../assets/kiss.json';
import KissEmojiUnchecked from '../../assets/kiss-d.json';
import CoolEmojiChecked from '../../assets/cool.json';
import CoolEmojiUnchecked from '../../assets/cool-d.json';
import SadEmojiChecked from '../../assets/sad.json';
import SadEmojiUnchecked from '../../assets/sad-d.json';

import './Drawer.css';

const Drawer = () => {
  const isMounted = useMount();
  const [isHovering, setIsHovering] = useState('');
  const [customPrompt, setCustomPrompt] = useState(localStorage.getItem('customPrompt') || '');
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);
  const {
    isCursorDisabled,
    setIsCursorDisabled,
    selectedVoice,
    setSelectedVoice,
    selectedVersion,
    setSelectedVersion,
    selfDiscussEnabled,
    setSelfDiscussedEnabled,
    selectedEmoji,
    setSelectedEmoji,
  } = useMainContext();

  useEffect(() => {
    customPrompt && setSecondarySystemPrompt(customPrompt);
  }, [customPrompt]);

  useEffect(() => {
    selectedEmoji && setPrimarySystemPrompt(selectedEmoji)
  }, [selectedEmoji])

  const handleVoiceChange = (event) => {
    const selectedVoice = event.target.value;
    const selectedVoiceObject = voices.find(voice => voice.value === selectedVoice);
    selectedVoiceObject && setSelectedVoice(selectedVoiceObject);
  };

  const handleVersionChange = (event) => {
    const selectedVersion = event.target.value;
    const selectedVersionObject = versions.find(version => version.value === selectedVersion);
    selectedVersionObject && setSelectedVersion(selectedVersionObject);
  };

  const handleEmojiChange = (emoji) => {
    setSelectedEmoji(selectedEmoji === emoji ? '' : emoji)
  }

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = (emoji) => {
    setIsHovering(emoji);
  };

  const handleMouseLeave = () => {
    setIsHovering('');
  };

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`drawer-container ${isOpen ? 'open' : ''}`} ref={drawerRef}>
        <h3 className="drawer-title">ChatPéTé</h3>
        <div className="drawer-title-divider"></div>
        <div className="reset-select-container">
          <button
            className="reset-history-button"
            onClick={() => {
              setInitialHistory();
              alert('L\'historique de conversation a été réinitialisé avec succés');
            }}
          >
            Réinitialiser l'historique
          </button>
        </div>
        <br/>
        <div className="checkbox-container">
          <label className="checkbox-label">
            Cursor animation:&nbsp;
            <input
              className="checkbox-input"
              type="checkbox"
              checked={isCursorDisabled}
              onChange={() => setIsCursorDisabled(!isCursorDisabled)}
            />
          </label>
        </div>
        <div className="voice-history-container">
          <select className="voice-select" value={selectedVoice.value} onChange={handleVoiceChange}>
            {voices.map(voice => (
              <option key={voice.value} value={voice.value}>
                ({voice.language}) {voice.name} - {voice.genre}
              </option>
            ))}
          </select>
        </div>
        <div className="version-select-container">
          <select className="version-select" value={selectedVersion.value} onChange={handleVersionChange}>
            {versions.map(voice => (
              <option key={voice.value} value={voice.value}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <p className="input-label">Custom prompt</p>
          <textarea
            className="input-textarea"
            value={customPrompt}
            onChange={(event) => {
              setCustomPrompt(event.target.value);
              localStorage.setItem('customPrompt', event.target.value);
            }}
            style={{ width: '100%', height: 200 }}
            onKeyDown={(event) => event.stopPropagation()}
            onKeyUp={(event) => event.stopPropagation()}
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
        <br/><br/><br/>
        <div className='emoji-container'>
          <Lottie 
            className={`lottie-emoji heartbeat`}
            animationData={selectedEmoji === 'cussing' ? CussingEmojiChecked : CussingEmojiUnchecked}
            onClick={() => handleEmojiChange('cussing')}
            loop={isHovering === 'cussing'}
            onMouseEnter={() => handleMouseEnter('cussing')}
            onMouseLeave={handleMouseLeave}
          />
          <Lottie 
            className={`lottie-emoji heartbeat`}
            animationData={selectedEmoji === 'kiss' ? KissEmojiChecked : KissEmojiUnchecked}
            onClick={() => handleEmojiChange('kiss')}
            loop={isHovering === 'kiss'}
            onMouseEnter={() => handleMouseEnter('kiss')}
            onMouseLeave={handleMouseLeave}
          />
          <Lottie 
            className={`lottie-emoji heartbeat`}
            animationData={selectedEmoji === 'cool' ? CoolEmojiChecked : CoolEmojiUnchecked}
            onClick={() => handleEmojiChange('cool')}
            loop={isHovering === 'cool'}
            onMouseEnter={() => handleMouseEnter('cool')}
            onMouseLeave={handleMouseLeave}
          />
          <Lottie 
            className={`lottie-emoji heartbeat`}
            animationData={selectedEmoji === 'sad' ? SadEmojiChecked : SadEmojiUnchecked}
            onClick={() => handleEmojiChange('sad')}
            loop={isHovering === 'sad'}
            onMouseEnter={() => handleMouseEnter('sad')}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
      <div className={`drawer-toggle button-animations ${isOpen || !isMounted ? 'hidden' : ''}`} onClick={toggleDrawer}>
        <div className='chevron-icon' />
      </div>
    </>
  );
};

export default Drawer;
