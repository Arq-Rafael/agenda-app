import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import SoundScapes from './SoundScapes.js';

const html = htm.bind(React.createElement);

const tips = [
  "¡Lo estás haciendo genial!",
  "Recuerda tomar agua 💧",
  "Respira profundo, eres fuerte.",
  "Un paso a la vez, hermosa.",
  "Aquí estoy contigo ✨",
  "¡Qué linda sonrisa tienes!",
  "Tómate un minuto para ti.",
  "Eres magia ✨",
  "Hoy es un buen día."
];

const Assistant = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [assistantMode, setAssistantMode] = useState('idle'); // idle, tip, music
  const [currentTip, setCurrentTip] = useState(tips[0]);

  // Mascot interaction
  const toggleMenu = () => {
      setShowMenu(!showMenu);
      if (!showMenu) setAssistantMode('idle');
  };

  const showRandomTip = () => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      setAssistantMode('tip');
  };

  const showMusic = () => {
      setAssistantMode('music');
  };

  // Auto show tip occasionally (less frequent now)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!showMenu) {
        showRandomTip();
        setShowMenu(true);
        setTimeout(() => setShowMenu(false), 6000);
      }
    }, 120000); // Every 2 minutes
    return () => clearInterval(timer);
  }, [showMenu]);

  return html`
    <div style=${{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <${AnimatePresence}>
        ${showMenu && html`
          <${motion.div}
            initial=${{ opacity: 0, y: 20, scale: 0.8 }}
            animate=${{ opacity: 1, y: 0, scale: 1 }}
            exit=${{ opacity: 0, scale: 0.8, y: 20 }}
            style=${{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '25px', 
              marginBottom: '15px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              maxWidth: '250px',
              minWidth: '200px',
              color: '#5d5458',
              position: 'relative',
              border: '2px solid #fff0f5'
            }}
          >
            ${assistantMode === 'idle' && html`
                <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style=${{ margin: '0 0 10px 0', textAlign: 'center', fontWeight: 'bold', color: '#ff8fab' }}>¿En qué te ayudo?</p>
                    <button onClick=${showRandomTip} style=${{ background: '#fff0f5', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
                        <span>🦴</span> Dame un consejo
                    </button>
                    <button onClick=${showMusic} style=${{ background: '#e0f2f1', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
                        <span>🎵</span> Poner música
                    </button>
                </div>
            `}

            ${assistantMode === 'tip' && html`
                <div style=${{ textAlign: 'center' }}>
                    <p style=${{ fontSize: '1.1rem', margin: '10px 0', lineHeight: '1.5' }}>${currentTip}</p>
                    <button onClick=${() => setAssistantMode('idle')} style=${{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginTop: '10px' }}>🔙</button>
                </div>
            `}

            ${assistantMode === 'music' && html`
                <div>
                     <div style=${{ marginBottom: '10px', cursor: 'pointer' }} onClick=${() => setAssistantMode('idle')}>🔙 Volver</div>
                     <${SoundScapes} embedded=${true} />
                </div>
            `}
            
            <div style=${{ 
                position: 'absolute', 
                bottom: '-10px', 
                right: '30px', 
                width: '20px', 
                height: '20px', 
                background: 'white', 
                transform: 'rotate(45deg)',
                borderRight: '2px solid #fff0f5',
                borderBottom: '2px solid #fff0f5'
            }}></div>
          </${motion.div}>
        `}
      </${AnimatePresence}>

      <${motion.button}
        whileHover=${{ scale: 1.1, rotate: 5 }}
        whileTap=${{ scale: 0.9 }}
        onClick=${toggleMenu}
        style=${{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          border: 'none', 
          background: 'none', // Transparent to show image clearly
          cursor: 'pointer',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 0,
          filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))'
        }}
      >
        <img src="./img/mascot.png" alt="Mascota" style=${{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </${motion.button}>
    </div>
  `;
};

export default Assistant;
