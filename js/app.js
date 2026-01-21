import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'https://esm.sh/htm';
import Layout from './components/Layout.js';
import Dashboard from './components/Dashboard.js';
import Agenda from './components/Agenda.js';
import CalmCenter from './components/CalmCenter.js';
import ReflectiveGarden from './components/ReflectiveGarden.js';
import ArtTherapy from './components/ArtTherapy.js';
import GratitudeJournal from './components/GratitudeJournal.js';
import MotivationalQuotes from './components/MotivationalQuotes.js';
import { initializeTheme } from './components/ThemeSelector.js';
import notificationManager from './components/NotificationManager.js';

const html = htm.bind(React.createElement);

const App = () => {
    const [view, setView] = useState('dashboard');

    useEffect(() => {
        // Initialize theme on app load
        initializeTheme();
        
        // Start wellness reminders if enabled
        notificationManager.startWellnessReminders();
    }, []);

    return html`
        <${Layout} currentView=${view} setView=${setView}>
            ${view === 'dashboard' && html`<${Dashboard} setView=${setView} />`}
            ${view === 'agenda' && html`<${Agenda} />`}
            ${view === 'garden' && html`<${ReflectiveGarden} />`}
            ${view === 'art' && html`<${ArtTherapy} />`}
            ${view === 'calm' && html`<${CalmCenter} />`}
            ${view === 'gratitude' && html`<${GratitudeJournal} />`}
            ${view === 'quotes' && html`<${MotivationalQuotes} />`}
        </${Layout}>
    `;
};

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));
