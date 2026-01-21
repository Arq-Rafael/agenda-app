import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import gamification from './GamificationSystem.js';

const html = htm.bind(React.createElement);

const ProgressStats = () => {
    const [progress, setProgress] = useState(gamification.getProgress());
    const [showAchievements, setShowAchievements] = useState(false);

    useEffect(() => {
        const handleUpdate = () => {
            setProgress(gamification.getProgress());
        };

        window.addEventListener('gamification-update', handleUpdate);
        return () => window.removeEventListener('gamification-update', handleUpdate);
    }, []);

    const achievements = gamification.getAllAchievements();
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return html`
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <!-- Nivel y Puntos -->
            <${motion.div}
                className="card"
                style=${{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                whileHover=${{ scale: 1.02 }}
            >
                <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div>
                        <h2 style=${{ margin: 0, fontSize: '2rem' }}>Nivel ${progress.level}</h2>
                        <p style=${{ margin: '5px 0 0 0', opacity: 0.9 }}>${progress.points} puntos totales</p>
                    </div>
                    <div style=${{ fontSize: '3rem' }}>⭐</div>
                </div>

                <!-- Barra de progreso -->
                <div style=${{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    height: '12px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <${motion.div}
                        initial=${{ width: 0 }}
                        animate=${{ width: `${progress.progress}%` }}
                        transition=${{ duration: 1, ease: 'easeOut' }}
                        style=${{
                            background: 'linear-gradient(90deg, #ffd89b 0%, #19547b 100%)',
                            height: '100%',
                            borderRadius: '10px'
                        }}
                    />
                </div>
                <p style=${{ margin: '8px 0 0 0', fontSize: '0.85rem', opacity: 0.9, textAlign: 'right' }}>
                    ${Math.round(progress.progress)}% hacia nivel ${progress.level + 1}
                </p>
            </${motion.div}>

            <!-- Racha y Logros -->
            <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <!-- Racha -->
                <${motion.div}
                    className="card"
                    style=${{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        textAlign: 'center',
                        padding: '20px'
                    }}
                    whileHover=${{ scale: 1.05 }}
                >
                    <div style=${{ fontSize: '2.5rem' }}>🔥</div>
                    <h3 style=${{ margin: '10px 0 5px 0', fontSize: '2rem' }}>${progress.streak}</h3>
                    <p style=${{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>días seguidos</p>
                </${motion.div}>

                <!-- Logros -->
                <${motion.div}
                    className="card"
                    style=${{
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        color: '#333',
                        textAlign: 'center',
                        padding: '20px',
                        cursor: 'pointer'
                    }}
                    whileHover=${{ scale: 1.05 }}
                    onClick=${() => setShowAchievements(!showAchievements)}
                >
                    <div style=${{ fontSize: '2.5rem' }}>🏆</div>
                    <h3 style=${{ margin: '10px 0 5px 0', fontSize: '2rem' }}>${unlockedCount}/${achievements.length}</h3>
                    <p style=${{ margin: 0, fontSize: '0.9rem' }}>logros</p>
                </${motion.div}>
            </div>

            <!-- Modal de Logros -->
            <${AnimatePresence}>
                ${showAchievements && html`
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
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px'
                        }}
                        onClick=${() => setShowAchievements(false)}
                    >
                        <${motion.div}
                            initial=${{ scale: 0.8, y: 50 }}
                            animate=${{ scale: 1, y: 0 }}
                            exit=${{ scale: 0.8, y: 50 }}
                            onClick=${(e) => e.stopPropagation()}
                            style=${{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '30px',
                                maxWidth: '600px',
                                width: '100%',
                                maxHeight: '80vh',
                                overflow: 'auto'
                            }}
                        >
                            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style=${{ margin: 0 }}>🏆 Tus Logros</h2>
                                <button
                                    onClick=${() => setShowAchievements(false)}
                                    style=${{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        color: '#999'
                                    }}
                                >×</button>
                            </div>

                            ${Object.entries(
                                achievements.reduce((acc, ach) => {
                                    if (!acc[ach.category]) acc[ach.category] = [];
                                    acc[ach.category].push(ach);
                                    return acc;
                                }, {})
                            ).map(([category, items]) => html`
                                <div key=${category} style=${{ marginBottom: '25px' }}>
                                    <h3 style=${{ color: '#667eea', marginBottom: '15px', fontSize: '1.1rem' }}>${category}</h3>
                                    <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                                        ${items.map(ach => html`
                                            <${motion.div}
                                                key=${ach.id}
                                                whileHover=${{ scale: ach.unlocked ? 1.05 : 1 }}
                                                style=${{
                                                    padding: '15px',
                                                    borderRadius: '15px',
                                                    background: ach.unlocked ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' : '#f5f5f5',
                                                    textAlign: 'center',
                                                    opacity: ach.unlocked ? 1 : 0.4,
                                                    border: ach.unlocked ? '2px solid #fcb69f' : '2px solid #ddd'
                                                }}
                                            >
                                                <div style=${{ fontSize: '2rem', marginBottom: '8px' }}>${ach.icon}</div>
                                                <div style=${{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>${ach.name}</div>
                                                <div style=${{ fontSize: '0.7rem', color: '#666' }}>${ach.description}</div>
                                            </${motion.div}>
                                        `)}
                                    </div>
                                </div>
                            `)}
                        </${motion.div}>
                    </${motion.div}>
                `}
            </${AnimatePresence}>
        </div>
    `;
};

export default ProgressStats;
