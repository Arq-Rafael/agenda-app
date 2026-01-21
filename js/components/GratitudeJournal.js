import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import gamification from './GamificationSystem.js';

const html = htm.bind(React.createElement);

const GratitudeJournal = () => {
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('gratitude_entries');
        return saved ? JSON.parse(saved) : [];
    });
    const [newEntry, setNewEntry] = useState('');
    const [showPrompts, setShowPrompts] = useState(false);

    const prompts = [
        "¿Qué persona te hizo sonreír hoy?",
        "¿Qué logro pequeño tuviste hoy?",
        "¿Qué cosa simple te trajo alegría?",
        "¿Qué aprendiste hoy?",
        "¿Qué parte de tu cuerpo agradeces hoy?",
        "¿Qué momento de paz tuviste hoy?",
        "¿Qué comida disfrutaste hoy?",
        "¿Qué sonido hermoso escuchaste?",
        "¿Qué te hace sentir segura?",
        "¿Qué talento tuyo aprecias?"
    ];

    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    const saveEntry = () => {
        if (newEntry.trim()) {
            const entry = {
                id: Date.now(),
                text: newEntry,
                date: new Date().toISOString()
            };
            const updated = [entry, ...entries];
            setEntries(updated);
            localStorage.setItem('gratitude_entries', JSON.stringify(updated));
            setNewEntry('');
            
            // Otorgar puntos
            gamification.journalEntryAdded();
        }
    };

    const deleteEntry = (id) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        localStorage.setItem('gratitude_entries', JSON.stringify(updated));
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return html`
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <!-- Header -->
            <${motion.div}
                className="card"
                style=${{
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    textAlign: 'center',
                    padding: '30px'
                }}
                initial=${{ opacity: 0, y: -20 }}
                animate=${{ opacity: 1, y: 0 }}
            >
                <h1 style=${{ margin: '0 0 10px 0', fontSize: '2rem' }}>📖 Diario de Gratitud</h1>
                <p style=${{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
                    Escribe algo por lo que estés agradecida hoy
                </p>
            </${motion.div}>

            <!-- Nueva entrada -->
            <div className="card">
                <div style=${{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style=${{ margin: 0 }}>✍️ Nueva Entrada</h3>
                    <button
                        onClick=${() => setShowPrompts(!showPrompts)}
                        style=${{
                            background: 'none',
                            border: '1px solid #ffacc7',
                            color: '#ffacc7',
                            padding: '8px 15px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        💡 ${showPrompts ? 'Ocultar' : 'Ideas'}
                    </button>
                </div>

                <${AnimatePresence}>
                    ${showPrompts && html`
                        <${motion.div}
                            initial=${{ opacity: 0, height: 0 }}
                            animate=${{ opacity: 1, height: 'auto' }}
                            exit=${{ opacity: 0, height: 0 }}
                            style=${{
                                background: '#fff5f8',
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '15px',
                                fontStyle: 'italic',
                                color: '#666'
                            }}
                        >
                            ${randomPrompt}
                        </${motion.div}>
                    `}
                </${AnimatePresence}>

                <textarea
                    value=${newEntry}
                    onChange=${(e) => setNewEntry(e.target.value)}
                    placeholder="Hoy estoy agradecida por..."
                    style=${{
                        width: '100%',
                        minHeight: '120px',
                        padding: '15px',
                        borderRadius: '15px',
                        border: '2px solid #f0f0f0',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        marginBottom: '15px'
                    }}
                />

                <button
                    onClick=${saveEntry}
                    disabled=${!newEntry.trim()}
                    style=${{
                        width: '100%',
                        padding: '15px',
                        background: newEntry.trim() ? 'linear-gradient(135deg, #ffacc7 0%, #ff6b9d 100%)' : '#ddd',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: newEntry.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease'
                    }}
                >
                    💝 Guardar Gratitud
                </button>
            </div>

            <!-- Entradas anteriores -->
            ${entries.length > 0 && html`
                <div>
                    <h3 style=${{ marginBottom: '15px' }}>🌸 Tus Gratitudes (${entries.length})</h3>
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        ${entries.map((entry, index) => html`
                            <${motion.div}
                                key=${entry.id}
                                className="card"
                                initial=${{ opacity: 0, x: -20 }}
                                animate=${{ opacity: 1, x: 0 }}
                                transition=${{ delay: index * 0.05 }}
                                style=${{
                                    borderLeft: '4px solid #ffacc7',
                                    position: 'relative'
                                }}
                            >
                                <div style=${{ 
                                    fontSize: '0.85rem', 
                                    color: '#999', 
                                    marginBottom: '10px',
                                    textTransform: 'capitalize'
                                }}>
                                    ${formatDate(entry.date)}
                                </div>
                                <p style=${{ 
                                    margin: 0, 
                                    fontSize: '1.05rem',
                                    lineHeight: '1.6',
                                    paddingRight: '40px'
                                }}>
                                    ${entry.text}
                                </p>
                                <button
                                    onClick=${() => deleteEntry(entry.id)}
                                    style=${{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#ccc',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseOver=${(e) => e.target.style.color = '#ff6b9d'}
                                    onMouseOut=${(e) => e.target.style.color = '#ccc'}
                                >
                                    🗑️
                                </button>
                            </${motion.div}>
                        `)}
                    </div>
                </div>
            `}

            ${entries.length === 0 && html`
                <div className="card" style=${{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <div style=${{ fontSize: '3rem', marginBottom: '15px' }}>🌱</div>
                    <p>Aún no tienes entradas. ¡Empieza tu práctica de gratitud hoy!</p>
                </div>
            `}
        </div>
    `;
};

export default GratitudeJournal;
