import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const moods = [
  { id: 'happy', label: 'Feliz', emoji: '😊', color: '#ffacc7' },
  { id: 'calm', label: 'Tranquila', emoji: '😌', color: '#dcedc1' },
  { id: 'anxious', label: 'Ansiosa', emoji: '😰', color: '#ffd3b6' },
  { id: 'tired', label: 'Cansada', emoji: '😴', color: '#e6dada' },
  { id: 'sad', label: 'Triste', emoji: '😢', color: '#a2d2ff' }
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSelect = (mood) => {
    setSelectedMood(mood);
  };

  return html`
    <div className="card">
      <h3>¿Cómo te sientes ahora?</h3>
      <div style=${{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '10px' }}>
        ${moods.map(mood => html`
          <${motion.button}
            key=${mood.id}
            whileHover=${{ scale: 1.2, rotate: 5 }}
            whileTap=${{ scale: 0.9 }}
            onClick=${() => handleSelect(mood)}
            style=${{
              background: selectedMood?.id === mood.id ? mood.color : 'transparent',
              border: selectedMood?.id === mood.id ? '2px solid white' : '1px solid #eee',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '2rem',
              cursor: 'pointer',
              boxShadow: selectedMood?.id === mood.id ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
              transition: 'background 0.3s'
            }}
          >
            ${mood.emoji}
          </${motion.button}>
        `)}
      </div>
      
      <${AnimatePresence}>
        ${selectedMood && html`
          <${motion.div}
            initial=${{ opacity: 0, height: 0 }}
            animate=${{ opacity: 1, height: 'auto' }}
            exit=${{ opacity: 0, height: 0 }}
            style=${{ marginTop: '20px', p: { margin: 0 } }}
          >
            <div style=${{ background: selectedMood.color, padding: '25px', borderRadius: '20px', color: '#555', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
              <span style=${{ fontSize: '4rem', display: 'block', marginBottom: '10px' }}>${selectedMood.emoji}</span>
              <h3 style=${{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#444' }}>Estás ${selectedMood.label}</h3>
              <p style=${{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                ${selectedMood.id === 'anxious' ? 'Tomémonos un momento para respirar en la zona de Calma. 🍃' : ''}
                ${selectedMood.id === 'sad' ? 'Está bien no estar bien. Aquí estoy contigo. 🫂' : ''}
                ${selectedMood.id === 'tired' ? 'Quizás es momento de una siesta o un té relajante. ☕' : ''}
                ${(['happy', 'calm'].includes(selectedMood.id)) ? '¡Qué alegría! Aprovéchalo para avanzar en tu agenda. ✨' : ''}
              </p>
            </div>
          </${motion.div}>
        `}
      </${AnimatePresence}>
    </div>
  `;
};

export default MoodTracker;
