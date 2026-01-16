import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const plants = [
  { stage: 0, icon: '🌰', label: 'Semilla', quote: 'Todo comienza con un pequeño paso.' },
  { stage: 1, icon: '🌱', label: 'Brote', quote: 'Estás creciendo, poco a poco.' },
  { stage: 2, icon: '🌿', label: 'Planta', quote: 'Tus esfuerzos están dando frutos.' },
  { stage: 3, icon: '🌳', label: 'Árbol', quote: 'Eres fuerte y das sombra a otros.' },
  { stage: 4, icon: '🌸', label: 'Floreciendo', quote: '¡Mira qué hermoso has florecido!' }
];

const ReflectiveGarden = () => {
  const [stage, setStage] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [message, setMessage] = useState('');

  // Simular persistencia simple
  useEffect(() => {
    const savedStage = localStorage.getItem('gardenStage');
    const savedWater = localStorage.getItem('gardenWater');
    if (savedStage) setStage(parseInt(savedStage));
    if (savedWater) setWaterCount(parseInt(savedWater));
  }, []);

  useEffect(() => {
    localStorage.setItem('gardenStage', stage);
    localStorage.setItem('gardenWater', waterCount);
  }, [stage, waterCount]);

  const handleWater = () => {
    setMessage('💧 Glup, glup... ¡Qué rico!');
    setTimeout(() => setMessage(''), 2000);
    
    if (waterCount < 5) {
      setWaterCount(prev => prev + 1);
    } else {
      if (stage < plants.length - 1) {
        setStage(prev => prev + 1);
        setWaterCount(0);
        setMessage('✨ ¡He crecido! Gracias por cuidarme.');
      } else {
        setMessage('💖 ¡Estoy radiante! Gracias.');
      }
    }
  };

  const resetGarden = () => {
    if (confirm('¿Quieres plantar una nueva semilla? Tu árbol actual se guardará en tu corazón.')) {
        setStage(0);
        setWaterCount(0);
        setMessage('🌱 Una nueva vida comienza.');
    }
  }

  const currentPlant = plants[stage];

  return html`
    <div className="card" style=${{ background: 'linear-gradient(180deg, #e0f7fa 0%, #ffffff 100%)', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2 style=${{ color: '#00695c' }}>🌳 Jardín Reflexivo</h2>
      <p style=${{ color: '#555', marginBottom: '20px' }}>Cuida tu planta cuidándote a ti misma.</p>

      <div style=${{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '20px' }}>
        <${AnimatePresence} mode='wait'>
            <${motion.div}
            key=${stage}
            initial=${{ scale: 0.5, opacity: 0 }}
            animate=${{ scale: 1, opacity: 1 }}
            exit=${{ scale: 1.2, opacity: 0 }}
            transition=${{ type: 'spring', stiffness: 100 }}
            style=${{ fontSize: '8rem', lineHeight: 1 }}
            >
            ${currentPlant.icon}
            </${motion.div}>
        </${AnimatePresence}>
      </div>

      <p style=${{ fontStyle: 'italic', color: '#00796b', height: '30px' }}>"${currentPlant.quote}"</p>
      
      <${AnimatePresence}>
        ${message && html`
            <${motion.div}
                initial=${{ opacity: 0, y: 10 }}
                animate=${{ opacity: 1, y: 0 }}
                exit=${{ opacity: 0 }}
                style=${{ color: '#ff6f00', fontWeight: 'bold', marginBottom: '10px', height: '20px' }}
            >
                ${message}
            </${motion.div}>
        `}
      </${AnimatePresence}>

      <div style=${{ display: 'flex', gap: '15px' }}>
        <${motion.button}
          className="btn-happy"
          whileHover=${{ scale: 1.1 }}
          whileTap=${{ scale: 0.9 }}
          onClick=${handleWater}
          style=${{ background: '#29b6f6', color: 'white', border: 'none' }}
        >
          💧 Regar (Respirar)
        </${motion.button}>
        
        ${stage === plants.length - 1 && html`
            <${motion.button}
                className="btn-happy"
                whileHover=${{ scale: 1.1 }}
                whileTap=${{ scale: 0.9 }}
                onClick=${resetGarden}
                style=${{ background: '#a1887f', color: 'white', border: 'none' }}
            >
                🌰 Plantar Nueva
            </${motion.button}>
        `}
      </div>

      <div style=${{ marginTop: '20px', width: '100%', background: '#eee', height: '10px', borderRadius: '5px', overflow: 'hidden', maxWidth: '300px' }}>
        <div style=${{ 
            width: `${(waterCount / 5) * 100}%`, 
            background: '#4fc3f7', 
            height: '100%', 
            transition: 'width 0.5s ease' 
        }}></div>
      </div>
      <p style=${{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>Agua necesaria para crecer</p>

    </div>
  `;
};

export default ReflectiveGarden;
