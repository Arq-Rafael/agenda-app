import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const tips = [
  "¡Lo estás haciendo genial!",
  "Recuerda tomar agua 💧",
  "Respira profundo, eres fuerte.",
  "Un paso a la vez, hermosa.",
  "Aquí estoy contigo ✨"
];

const Assistant = () => {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(tips[0]);

  const toggleTip = () => {
    if (!showTip) {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }
    setShowTip(!showTip);
  };

  // Auto show tip occasionally
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
      setShowTip(true);
      setTimeout(() => setShowTip(false), 5000);
    }, 60000); // Every minute
    return () => clearInterval(timer);
  }, []);

  return html`
    <div style=${{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <${AnimatePresence}>
        ${showTip && html`
          <${motion.div}
            initial=${{ opacity: 0, y: 20, scale: 0.8 }}
            animate=${{ opacity: 1, y: 0, scale: 1 }}
            exit=${{ opacity: 0, scale: 0.8 }}
            style=${{ 
              background: 'white', 
              padding: '15px', 
              borderRadius: '20px 20px 5px 20px', 
              marginBottom: '10px', 
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              maxWidth: '200px',
              color: '#5d5458',
              fontSize: '0.9rem'
            }}
          >
            ${currentTip}
          </${motion.div}>
        `}
      </${AnimatePresence}>

      <${motion.button}
        whileHover=${{ scale: 1.1 }}
        whileTap=${{ scale: 0.9 }}
        onClick=${toggleTip}
        style=${{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          border: 'none', 
          background: '#ffacc7', 
          fontSize: '2rem', 
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(255, 172, 199, 0.4)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}
      >
        🦊
      </${motion.button}>
    </div>
  `;
};

export default Assistant;
