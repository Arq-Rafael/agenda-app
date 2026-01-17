import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const UserProfile = ({ isOpen, onSave }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return html`
    <${AnimatePresence}>
      <${motion.div}
        initial=${{ opacity: 0 }}
        animate=${{ opacity: 1 }}
        exit=${{ opacity: 0 }}
        style=${{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 240, 245, 0.9)', // Pinkish overlay
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(5px)'
        }}
      >
        <${motion.div}
          initial=${{ scale: 0.8, y: 20 }}
          animate=${{ scale: 1, y: 0 }}
          style=${{
            background: 'white',
            padding: '40px',
            borderRadius: '30px',
            textAlign: 'center',
            maxWidth: '90%',
            width: '350px',
            boxShadow: '0 20px 50px rgba(255, 182, 193, 0.4)',
            border: '2px solid #fff0f5'
          }}
        >
          <div style=${{ fontSize: '4rem', marginBottom: '20px' }}>👋</div>
          <h2 style=${{ color: '#555', marginBottom: '10px' }}>¡Bienvenida!</h2>
          <p style=${{ color: '#888', marginBottom: '25px', lineHeight: '1.5' }}>
            Me gustaría dirigirme a ti con cariño.<br/>
            <strong>¿Cómo quieres que te llame?</strong>
          </p>
          
          <input
            type="text"
            value=${name}
            onChange=${(e) => setName(e.target.value)}
            placeholder="Tu nombre aquí..."
            autoFocus
            style=${{
              width: '100%',
              padding: '15px',
              borderRadius: '15px',
              border: '2px solid #eee',
              fontSize: '1.1rem',
              outline: 'none',
              textAlign: 'center',
              marginBottom: '20px',
              background: '#f9f9f9',
              color: '#333'
            }}
          />

          <button
            onClick=${() => { if(name.trim()) onSave(name); }}
            className="btn-happy"
            style=${{
                width: '100%',
                fontSize: '1.2rem',
                padding: '15px',
                opacity: name.trim() ? 1 : 0.5,
                cursor: name.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Comenzar mi Viaje ✨
          </button>

        </${motion.div}>
      </${motion.div}>
    </${AnimatePresence}>
  `;
};

export default UserProfile;
