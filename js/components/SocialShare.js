import React, { useState } from 'react';
import { motion } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const SocialShare = ({ achievement, stats }) => {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateShareText = () => {
        if (achievement) {
            return `¡Desbloqueé el logro "${achievement.name}" en mi Agenda Vital! 🎉 ${achievement.description}`;
        }
        if (stats) {
            return `Mi progreso en Agenda Vital:\n🔥 ${stats.streak} días de racha\n⭐ Nivel ${stats.level}\n✅ ${stats.tasksCompleted} tareas completadas\n¡Sigue tu propio camino! 💪`;
        }
        return '¡Estoy usando Agenda Vital para organizar mi vida y cuidar mi bienestar! 🌸';
    };

    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    const url = window.location.href;

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodedText}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodedText}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodedText}`
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return html`
        <div>
            <button
                onClick=${() => setShowModal(true)}
                style=${{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <span>📤</span>
                <span>Compartir</span>
            </button>

            ${showModal && html`
                <${motion.div}
                    initial=${{ opacity: 0 }}
                    animate=${{ opacity: 1 }}
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
                    onClick=${() => setShowModal(false)}
                >
                    <${motion.div}
                        initial=${{ scale: 0.8, y: 50 }}
                        animate=${{ scale: 1, y: 0 }}
                        onClick=${(e) => e.stopPropagation()}
                        style=${{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '100%'
                        }}
                    >
                        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style=${{ margin: 0 }}>📤 Compartir</h2>
                            <button
                                onClick=${() => setShowModal(false)}
                                style=${{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#999'
                                }}
                            >×</button>
                        </div>

                        <div style=${{
                            background: '#f9f9f9',
                            padding: '15px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            fontSize: '0.95rem',
                            lineHeight: '1.6'
                        }}>
                            ${shareText}
                        </div>

                        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <a
                                href=${shareLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                style=${{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    background: '#25D366',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <span>💬</span> WhatsApp
                            </a>

                            <a
                                href=${shareLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                style=${{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    background: '#1DA1F2',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <span>🐦</span> Twitter
                            </a>

                            <a
                                href=${shareLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                style=${{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    background: '#4267B2',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <span>📘</span> Facebook
                            </a>

                            <a
                                href=${shareLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                style=${{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    background: '#0088cc',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <span>✈️</span> Telegram
                            </a>
                        </div>

                        <button
                            onClick=${copyToClipboard}
                            style=${{
                                width: '100%',
                                padding: '12px',
                                background: copied ? '#4CAF50' : '#f0f0f0',
                                color: copied ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s'
                            }}
                        >
                            ${copied ? '✓ Copiado!' : '📋 Copiar texto'}
                        </button>
                    </${motion.div}>
                </${motion.div}>
            `}
        </div>
    `;
};

export default SocialShare;
