import React from 'react';
import { motion } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import Assistant from './Assistant.js';

const html = htm.bind(React.createElement);

const Layout = ({ children, currentView, setView }) => {
  return html`
    <div style=${{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style=${{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
        <h2 style=${{ margin: 0, fontSize: '1.5rem', color: '#ff8fab' }}>Agenda Vital</h2>
        <nav style=${{ display: 'flex', gap: '10px' }}>
             <button className=${`btn-happy ${currentView === 'dashboard' ? 'active' : ''}`} onClick=${() => setView('dashboard')}>Inicio</button>
             <button className=${`btn-happy ${currentView === 'agenda' ? 'active' : ''}`} onClick=${() => setView('agenda')}>Agenda</button>
             <button className=${`btn-happy ${currentView === 'garden' ? 'active' : ''}`} style=${{ background: '#b2dfdb', color: '#00695c' }} onClick=${() => setView('garden')}>Jardín</button>
             <button className=${`btn-happy ${currentView === 'art' ? 'active' : ''}`} style=${{ background: '#ffccbc', color: '#bf360c' }} onClick=${() => setView('art')}>Arte</button>
             <button className=${`btn-happy ${currentView === 'calm' ? 'active' : ''}`} style=${{ background: '#a8e6cf', color: '#3b6b55' }} onClick=${() => setView('calm')}>Calma</button>
        </nav>
      </header>
      
      <main style=${{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <${motion.div}
          key=${currentView}
          initial=${{ opacity: 0, y: 20 }}
          animate=${{ opacity: 1, y: 0 }}
          exit=${{ opacity: 0, y: -20 }}
          transition=${{ duration: 0.3 }}
        >
          ${children}
        </${motion.div}>
      </main>
      
      <${Assistant} />

      <footer style=${{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.8rem' }}>
        Hecho con amor para ti ❤️
      </footer>
    </div>
  `;
};

export default Layout;
