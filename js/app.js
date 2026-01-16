import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'https://esm.sh/htm';
import Layout from './components/Layout.js';
import Dashboard from './components/Dashboard.js';
import Agenda from './components/Agenda.js';
import CalmCenter from './components/CalmCenter.js';

import ReflectiveGarden from './components/ReflectiveGarden.js';
import ArtTherapy from './components/ArtTherapy.js';

const html = htm.bind(React.createElement);

const App = () => {
    const [view, setView] = useState('dashboard');

    return html`
        <${Layout} currentView=${view} setView=${setView}>
            ${view === 'dashboard' && html`<${Dashboard} setView=${setView} />`}
            ${view === 'agenda' && html`<${Agenda} />`}
            ${view === 'garden' && html`<${ReflectiveGarden} />`}
            ${view === 'art' && html`<${ArtTherapy} />`}
            ${view === 'calm' && html`<${CalmCenter} />`}
        </${Layout}>
    `;
};

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));
