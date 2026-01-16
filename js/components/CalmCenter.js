import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const BreathingBubble = () => {
  return html`
    <div style=${{ textAlign: 'center', padding: '20px' }}>
      <h4>Inhala... Exhala...</h4>
      <${motion.div}
        animate=${{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition=${{
          duration: 8, // 4s in, 4s out
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style=${{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #a8e6cf 0%, #dcedc1 100%)',
          margin: '0 auto',
          boxShadow: '0 0 30px rgba(168, 230, 207, 0.5)'
        }}
      />
      <p style=${{ marginTop: '20px', color: '#888' }}>Sigue al círculo con tu respiración.</p>
    </div>
  `;
};

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return html`
    <div style=${{ textAlign: 'center' }}>
      <div style=${{ fontSize: '3rem', fontFamily: 'monospace', color: '#ff8fab', margin: '20px 0' }}>
        ${formatTime(timeLeft)}
      </div>
      <div style=${{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button className="btn-happy" onClick=${toggleTimer}>${isActive ? 'Pausa' : 'Iniciar'}</button>
        <button className="btn-happy" style=${{ background: '#e6dada', color: '#555' }} onClick=${resetTimer}>Reiniciar</button>
      </div>
    </div>
  `;
};

const CalmCenter = () => {
  const [activeTool, setActiveTool] = useState('menu');

  return html`
    <div className="calm-center">
      <h2 style=${{ textAlign: 'center', color: '#3b6b55' }}>🍃 Centro de Calma</h2>
      
      ${activeTool === 'menu' && html`
        <div style=${{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          <div className="card" onClick=${() => setActiveTool('breathing')} style=${{ cursor: 'pointer', borderLeft: '5px solid #a8e6cf' }}>
            <h3>🌬️ Respiración Guiada</h3>
            <p>Burbuja de respiración para calmar la ansiedad al instante.</p>
          </div>
          <div className="card" onClick=${() => setActiveTool('focus')} style=${{ cursor: 'pointer', borderLeft: '5px solid #ffd3b6' }}>
            <h3>🍅 Timer de Enfoque</h3>
            <p>Técnica Pomodoro suave para concentrarte sin presión.</p>
          </div>
        </div>
      `}

      ${activeTool === 'breathing' && html`
        <div className="card">
          <button onClick=${() => setActiveTool('menu')} style=${{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>⬅️ Volver</button>
          <${BreathingBubble} />
        </div>
      `}

      ${activeTool === 'focus' && html`
        <div className="card">
          <button onClick=${() => setActiveTool('menu')} style=${{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>⬅️ Volver</button>
          <${FocusTimer} />
        </div>
      `}
    </div>
  `;
};

export default CalmCenter;
