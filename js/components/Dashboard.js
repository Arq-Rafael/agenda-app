import React, { useState } from 'react';
import { motion } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import MoodTracker from './MoodTracker.js';

const html = htm.bind(React.createElement);

const Dashboard = ({ setView }) => {
  const [quote, setQuote] = useState("Eres capaz de cosas increíbles, respira.");

  return html`
    <div style=${{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <section className="card" style=${{ textAlign: 'center', background: 'linear-gradient(135deg, #fff5f8 0%, #ffffff 100%)' }}>
        <${motion.h1} 
          initial=${{ scale: 0.9 }} 
          animate=${{ scale: 1 }} 
          transition=${{ type: 'spring', stiffness: 200 }}
        >
          ¡Hola, hermosa!
        </${motion.h1}>
        <p style=${{ fontSize: '1.2rem', color: '#7a7a7a', fontStyle: 'italic' }}>"${quote}"</p>
      </section>

      <${MoodTracker} />

      <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <${motion.div} 
          className="card" 
          whileHover=${{ scale: 1.03 }}
          onClick=${() => setView('agenda')}
          style=${{ cursor: 'pointer', borderLeft: '5px solid #ffacc7' }}
        >
          <h3>📅 Tu Día</h3>
          <p>Mira lo que tienes planeado hoy. ¡Paso a pasito!</p>
        </${motion.div}>

        <${motion.div} 
          className="card" 
          whileHover=${{ scale: 1.03 }}
          onClick=${() => setView('garden')}
          style=${{ cursor: 'pointer', borderLeft: '5px solid #b2dfdb', background: '#e0f2f1' }}
        >
          <h3>🌳 Jardín</h3>
          <p>Riega tu plantita y mira cómo crece contigo.</p>
        </${motion.div}>

        <${motion.div} 
          className="card" 
          whileHover=${{ scale: 1.03 }}
          onClick=${() => setView('art')}
          style=${{ cursor: 'pointer', borderLeft: '5px solid #ffccbc', background: '#fbe9e7' }}
        >
          <h3>🎨 Arte</h3>
          <p>Colorea y dibuja para soltar lo que sientes.</p>
        </${motion.div}>

        <${motion.div} 
          className="card" 
          whileHover=${{ scale: 1.03 }}
          onClick=${() => setView('calm')}
          style=${{ cursor: 'pointer', borderLeft: '5px solid #a8e6cf', background: '#f0fff4' }}
        >
          <h3>🍃 Respira</h3>
          <p>Un espacio seguro para relajarte y soltar la ansiedad.</p>
        </${motion.div}>
      </div>

    </div>
  `;
};

export default Dashboard;
