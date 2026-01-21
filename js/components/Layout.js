import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import Assistant from './Assistant.js';
import SoundScapes from './SoundScapes.js';
import ThemeSelector from './ThemeSelector.js';
import { NotificationSettings, Toast } from './NotificationManager.js';

const html = htm.bind(React.createElement);

const Layout = ({ children, currentView, setView }) => {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const toast = { ...event.detail, id: Date.now() };
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration || 3000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return html`
    <div style=${{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style=${{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
        <h2 style=${{ margin: 0, fontSize: '1.5rem', color: '#ff8fab' }}>Agenda Vital</h2>
        
        <div style=${{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <!-- Settings buttons -->
          <button 
            onClick=${() => setShowThemeSelector(true)}
            style=${{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            title="Temas"
          >🎨</button>
          
          <button 
            onClick=${() => setShowNotificationSettings(true)}
            style=${{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            title="Notificaciones"
          >🔔</button>
        </div>
      </header>
      
      <!-- Navigation -->
      <nav style=${{ 
        padding: '10px 20px', 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto',
        background: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(5px)'
      }}>
        <button className=${`btn-happy ${currentView === 'dashboard' ? 'active' : ''}`} onClick=${() => setView('dashboard')}>🏠 Inicio</button>
        <button className=${`btn-happy ${currentView === 'agenda' ? 'active' : ''}`} onClick=${() => setView('agenda')}>📅 Agenda</button>
        <button className=${`btn-happy ${currentView === 'garden' ? 'active' : ''}`} style=${{ background: '#b2dfdb', color: '#00695c' }} onClick=${() => setView('garden')}>🌳 Jardín</button>
        <button className=${`btn-happy ${currentView === 'art' ? 'active' : ''}`} style=${{ background: '#ffccbc', color: '#bf360c' }} onClick=${() => setView('art')}>🎨 Arte</button>
        <button className=${`btn-happy ${currentView === 'calm' ? 'active' : ''}`} style=${{ background: '#a8e6cf', color: '#3b6b55' }} onClick=${() => setView('calm')}>🍃 Calma</button>
        <button className=${`btn-happy ${currentView === 'gratitude' ? 'active' : ''}`} style=${{ background: '#ffecd2', color: '#8b6914' }} onClick=${() => setView('gratitude')}>📖 Gratitud</button>
        <button className=${`btn-happy ${currentView === 'quotes' ? 'active' : ''}`} style=${{ background: '#667eea', color: 'white' }} onClick=${() => setView('quotes')}>⭐ Frases</button>
      </nav>
      
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
      
      <!-- Floating components -->
      <${Assistant} />
      <${SoundScapes} />
      
      <!-- Modals -->
      <${AnimatePresence}>
        ${showThemeSelector && html`
          <${ThemeSelector} onClose=${() => setShowThemeSelector(false)} />
        `}
        ${showNotificationSettings && html`
          <${NotificationSettings} onClose=${() => setShowNotificationSettings(false)} />
        `}
      </${AnimatePresence}>
      
      <!-- Toast notifications -->
      <${AnimatePresence}>
        ${toasts.map(toast => html`
          <${Toast}
            key=${toast.id}
            message=${toast.message}
            type=${toast.type}
            icon=${toast.icon}
            onClose=${() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        `)}
      </${AnimatePresence}>

      <footer style=${{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.8rem' }}>
        Hecho con amor para ti ❤️
      </footer>
    </div>
  `;
};

export default Layout;
