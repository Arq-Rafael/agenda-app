import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import gamification from './GamificationSystem.js';

const html = htm.bind(React.createElement);

const BreathingBubble = ({ onComplete }) => {
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState('inhale');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => {
        if (prev === 'inhale') {
          return 'exhale';
        } else {
          setCycles(c => c + 1);
          return 'inhale';
        }
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cycles >= 5 && onComplete) {
      onComplete();
    }
  }, [cycles]);

  return html`
    <div style=${{ textAlign: 'center', padding: '20px' }}>
      <h4>${phase === 'inhale' ? 'Inhala...' : 'Exhala...'}</h4>
      <${motion.div}
        animate=${{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition=${{
          duration: 8,
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
      <p style=${{ fontSize: '0.9rem', color: '#999' }}>Ciclos completados: ${cycles}/5</p>
    </div>
  `;
};

const Breathing478 = ({ onComplete }) => {
  const [phase, setPhase] = useState('inhale');
  const [cycles, setCycles] = useState(0);
  const [count, setCount] = useState(4);

  useEffect(() => {
    const phases = [
      { name: 'inhale', duration: 4, next: 'hold' },
      { name: 'hold', duration: 7, next: 'exhale' },
      { name: 'exhale', duration: 8, next: 'inhale' }
    ];

    const currentPhase = phases.find(p => p.name === phase);
    
    const countInterval = setInterval(() => {
      setCount(c => {
        if (c > 1) return c - 1;
        return currentPhase.duration;
      });
    }, 1000);

    const phaseTimeout = setTimeout(() => {
      setPhase(currentPhase.next);
      if (currentPhase.next === 'inhale') {
        setCycles(c => c + 1);
      }
    }, currentPhase.duration * 1000);

    return () => {
      clearInterval(countInterval);
      clearTimeout(phaseTimeout);
    };
  }, [phase]);

  useEffect(() => {
    if (cycles >= 4 && onComplete) {
      onComplete();
    }
  }, [cycles]);

  const phaseText = {
    inhale: 'Inhala',
    hold: 'Sostén',
    exhale: 'Exhala'
  };

  return html`
    <div style=${{ textAlign: 'center', padding: '20px' }}>
      <h3>Técnica 4-7-8</h3>
      <p style=${{ color: '#666', marginBottom: '30px' }}>Ideal para reducir ansiedad y conciliar el sueño</p>
      
      <div style=${{ fontSize: '1.2rem', marginBottom: '20px', color: '#667eea', fontWeight: 'bold' }}>
        ${phaseText[phase]}
      </div>
      
      <${motion.div}
        key=${phase}
        animate=${{
          scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
          opacity: phase === 'hold' ? 1 : 0.7
        }}
        transition=${{ duration: 1 }}
        style=${{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: phase === 'hold' 
            ? 'radial-gradient(circle, #ffd89b 0%, #19547b 100%)'
            : 'radial-gradient(circle, #a8e6cf 0%, #dcedc1 100%)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 0 30px rgba(168, 230, 207, 0.5)'
        }}
      >
        ${count}
      </${motion.div}>
      
      <p style=${{ marginTop: '20px', fontSize: '0.9rem', color: '#999' }}>
        Ciclos: ${cycles}/4
      </p>
    </div>
  `;
};

const BoxBreathing = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [count, setCount] = useState(4);

  const phases = ['Inhala', 'Sostén', 'Exhala', 'Sostén'];

  useEffect(() => {
    const countInterval = setInterval(() => {
      setCount(c => {
        if (c > 1) return c - 1;
        return 4;
      });
    }, 1000);

    const phaseTimeout = setTimeout(() => {
      setPhase(p => {
        const next = (p + 1) % 4;
        if (next === 0) setCycles(c => c + 1);
        return next;
      });
    }, 4000);

    return () => {
      clearInterval(countInterval);
      clearTimeout(phaseTimeout);
    };
  }, [phase]);

  useEffect(() => {
    if (cycles >= 4 && onComplete) {
      onComplete();
    }
  }, [cycles]);

  return html`
    <div style=${{ textAlign: 'center', padding: '20px' }}>
      <h3>Box Breathing</h3>
      <p style=${{ color: '#666', marginBottom: '30px' }}>Técnica usada por Navy SEALs para mantener la calma</p>
      
      <div style=${{ fontSize: '1.2rem', marginBottom: '20px', color: '#667eea', fontWeight: 'bold' }}>
        ${phases[phase]}
      </div>
      
      <div style=${{ 
        width: '200px', 
        height: '200px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        <${motion.div}
          animate=${{
            rotate: phase * 90
          }}
          transition=${{ duration: 1 }}
          style=${{
            width: '150px',
            height: '150px',
            border: '4px solid #667eea',
            margin: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: '#667eea',
            fontWeight: 'bold'
          }}
        >
          ${count}
        </${motion.div}>
      </div>
      
      <p style=${{ marginTop: '20px', fontSize: '0.9rem', color: '#999' }}>
        Ciclos: ${cycles}/4
      </p>
    </div>
  `;
};

const CoherenciaCardiaca = ({ onComplete }) => {
  const [phase, setPhase] = useState('inhale');
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => {
        if (prev === 'inhale') {
          return 'exhale';
        } else {
          setCycles(c => c + 1);
          return 'inhale';
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cycles >= 6 && onComplete) {
      onComplete();
    }
  }, [cycles]);

  return html`
    <div style=${{ textAlign: 'center', padding: '20px' }}>
      <h3>Coherencia Cardíaca</h3>
      <p style=${{ color: '#666', marginBottom: '30px' }}>5 segundos inhalar, 5 segundos exhalar</p>
      
      <div style=${{ fontSize: '1.2rem', marginBottom: '20px', color: '#667eea', fontWeight: 'bold' }}>
        ${phase === 'inhale' ? 'Inhala (5s)' : 'Exhala (5s)'}
      </div>
      
      <${motion.div}
        animate=${{
          scale: phase === 'inhale' ? [1, 1.5] : [1.5, 1],
          backgroundColor: phase === 'inhale' ? '#a8e6cf' : '#ffacc7'
        }}
        transition=${{ duration: 5, ease: 'linear' }}
        style=${{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          margin: '0 auto',
          boxShadow: '0 0 30px rgba(168, 230, 207, 0.5)'
        }}
      />
      
      <p style=${{ marginTop: '20px', fontSize: '0.9rem', color: '#999' }}>
        Ciclos: ${cycles}/6
      </p>
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
  const [completedSession, setCompletedSession] = useState(false);

  const handleSessionComplete = () => {
    gamification.breathingSessionCompleted();
    setCompletedSession(true);
    setTimeout(() => {
      setCompletedSession(false);
      setActiveTool('menu');
    }, 3000);
  };

  return html`
    <div className="calm-center">
      <h2 style=${{ textAlign: 'center', color: '#3b6b55' }}>🍃 Centro de Calma</h2>
      
      ${activeTool === 'menu' && html`
        <div style=${{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          <div className="card" onClick=${() => setActiveTool('breathing')} style=${{ cursor: 'pointer', borderLeft: '5px solid #a8e6cf' }}>
            <h3>🌬️ Respiración Simple</h3>
            <p>Burbuja de respiración para calmar la ansiedad al instante.</p>
          </div>
          
          <div className="card" onClick=${() => setActiveTool('478')} style=${{ cursor: 'pointer', borderLeft: '5px solid #667eea' }}>
            <h3>😴 Técnica 4-7-8</h3>
            <p>Ideal para reducir ansiedad y conciliar el sueño.</p>
          </div>
          
          <div className="card" onClick=${() => setActiveTool('box')} style=${{ cursor: 'pointer', borderLeft: '5px solid #764ba2' }}>
            <h3>📦 Box Breathing</h3>
            <p>Técnica usada por Navy SEALs para mantener la calma.</p>
          </div>
          
          <div className="card" onClick=${() => setActiveTool('coherencia')} style=${{ cursor: 'pointer', borderLeft: '5px solid #ffacc7' }}>
            <h3>💓 Coherencia Cardíaca</h3>
            <p>Equilibra tu sistema nervioso en 6 respiraciones.</p>
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
          ${completedSession ? html`
            <div style=${{ textAlign: 'center', padding: '40px' }}>
              <div style=${{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
              <h2>¡Sesión Completada!</h2>
              <p>+5 puntos de experiencia</p>
            </div>
          ` : html`<${BreathingBubble} onComplete=${handleSessionComplete} />`}
        </div>
      `}
      
      ${activeTool === '478' && html`
        <div className="card">
          <button onClick=${() => setActiveTool('menu')} style=${{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>⬅️ Volver</button>
          ${completedSession ? html`
            <div style=${{ textAlign: 'center', padding: '40px' }}>
              <div style=${{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
              <h2>¡Sesión Completada!</h2>
              <p>+5 puntos de experiencia</p>
            </div>
          ` : html`<${Breathing478} onComplete=${handleSessionComplete} />`}
        </div>
      `}
      
      ${activeTool === 'box' && html`
        <div className="card">
          <button onClick=${() => setActiveTool('menu')} style=${{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>⬅️ Volver</button>
          ${completedSession ? html`
            <div style=${{ textAlign: 'center', padding: '40px' }}>
              <div style=${{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
              <h2>¡Sesión Completada!</h2>
              <p>+5 puntos de experiencia</p>
            </div>
          ` : html`<${BoxBreathing} onComplete=${handleSessionComplete} />`}
        </div>
      `}
      
      ${activeTool === 'coherencia' && html`
        <div className="card">
          <button onClick=${() => setActiveTool('menu')} style=${{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>⬅️ Volver</button>
          ${completedSession ? html`
            <div style=${{ textAlign: 'center', padding: '40px' }}>
              <div style=${{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
              <h2>¡Sesión Completada!</h2>
              <p>+5 puntos de experiencia</p>
            </div>
          ` : html`<${CoherenciaCardiaca} onComplete=${handleSessionComplete} />`}
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
