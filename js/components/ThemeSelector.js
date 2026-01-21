import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const themes = {
    light: {
        name: 'Claro',
        icon: '☀️',
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        cardBg: '#ffffff',
        textColor: '#333333',
        accentColor: '#ffacc7',
        secondaryBg: '#f9f9f9'
    },
    dark: {
        name: 'Oscuro',
        icon: '🌙',
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        cardBg: '#34495e',
        textColor: '#ecf0f1',
        accentColor: '#9b59b6',
        secondaryBg: '#2c3e50'
    },
    sunset: {
        name: 'Atardecer',
        icon: '🌅',
        background: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 50%, #a960ee 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#333333',
        accentColor: '#ff6a88',
        secondaryBg: 'rgba(255, 255, 255, 0.8)'
    },
    ocean: {
        name: 'Océano',
        icon: '🌊',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#333333',
        accentColor: '#667eea',
        secondaryBg: 'rgba(255, 255, 255, 0.8)'
    },
    forest: {
        name: 'Bosque',
        icon: '🌲',
        background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#2d5016',
        accentColor: '#56ab2f',
        secondaryBg: 'rgba(255, 255, 255, 0.8)'
    },
    lavender: {
        name: 'Lavanda',
        icon: '💜',
        background: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        textColor: '#333333',
        accentColor: '#c471f5',
        secondaryBg: 'rgba(255, 255, 255, 0.8)'
    }
};

const ThemeSelector = ({ onClose }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('app_theme') || 'light';
    });
    const [animatedBg, setAnimatedBg] = useState(() => {
        return localStorage.getItem('animated_bg') === 'true';
    });

    const applyTheme = (themeName) => {
        const theme = themes[themeName];
        const root = document.documentElement;

        root.style.setProperty('--bg-gradient', theme.background);
        root.style.setProperty('--card-bg', theme.cardBg);
        root.style.setProperty('--text-color', theme.textColor);
        root.style.setProperty('--accent-color', theme.accentColor);
        root.style.setProperty('--secondary-bg', theme.secondaryBg);

        // Aplicar al body
        document.body.style.background = theme.background;
        document.body.style.color = theme.textColor;

        if (animatedBg) {
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'gradientShift 15s ease infinite';
        } else {
            document.body.style.backgroundSize = '100% 100%';
            document.body.style.animation = 'none';
        }

        setCurrentTheme(themeName);
        localStorage.setItem('app_theme', themeName);
    };

    const toggleAnimatedBg = () => {
        const newValue = !animatedBg;
        setAnimatedBg(newValue);
        localStorage.setItem('animated_bg', newValue.toString());
        
        if (newValue) {
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'gradientShift 15s ease infinite';
        } else {
            document.body.style.backgroundSize = '100% 100%';
            document.body.style.animation = 'none';
        }
    };

    useEffect(() => {
        applyTheme(currentTheme);
    }, []);

    return html`
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
            onClick=${onClose}
        >
            <${motion.div}
                initial=${{ scale: 0.8, y: 50 }}
                animate=${{ scale: 1, y: 0 }}
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
                    <h2 style=${{ margin: 0, color: '#333' }}>🎨 Personalización</h2>
                    <button
                        onClick=${onClose}
                        style=${{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#999'
                        }}
                    >×</button>
                </div>

                <h3 style=${{ color: '#667eea', marginBottom: '15px' }}>Temas</h3>
                <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                    ${Object.entries(themes).map(([key, theme]) => html`
                        <${motion.div}
                            key=${key}
                            whileHover=${{ scale: 1.05 }}
                            whileTap=${{ scale: 0.95 }}
                            onClick=${() => applyTheme(key)}
                            style=${{
                                padding: '20px',
                                borderRadius: '15px',
                                background: theme.background,
                                cursor: 'pointer',
                                textAlign: 'center',
                                border: currentTheme === key ? '3px solid #333' : '3px solid transparent',
                                position: 'relative'
                            }}
                        >
                            <div style=${{ fontSize: '2rem', marginBottom: '8px' }}>${theme.icon}</div>
                            <div style=${{ 
                                fontWeight: 'bold', 
                                color: key === 'dark' ? '#ecf0f1' : '#333',
                                fontSize: '0.9rem'
                            }}>${theme.name}</div>
                            ${currentTheme === key && html`
                                <div style=${{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: '#4CAF50',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem'
                                }}>✓</div>
                            `}
                        </${motion.div}>
                    `)}
                </div>

                <h3 style=${{ color: '#667eea', marginBottom: '15px' }}>Efectos</h3>
                <div style=${{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#f9f9f9',
                    borderRadius: '10px'
                }}>
                    <div>
                        <div style=${{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>✨ Fondo Animado</div>
                        <div style=${{ fontSize: '0.85rem', color: '#666' }}>Gradiente en movimiento</div>
                    </div>
                    <label style=${{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                        <input
                            type="checkbox"
                            checked=${animatedBg}
                            onChange=${toggleAnimatedBg}
                            style=${{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style=${{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: animatedBg ? '#4CAF50' : '#ccc',
                            transition: '0.4s',
                            borderRadius: '24px'
                        }}>
                            <span style=${{
                                position: 'absolute',
                                content: '""',
                                height: '18px',
                                width: '18px',
                                left: animatedBg ? '29px' : '3px',
                                bottom: '3px',
                                background: 'white',
                                transition: '0.4s',
                                borderRadius: '50%'
                            }}></span>
                        </span>
                    </label>
                </div>
            </${motion.div}>
        </${motion.div}>
    `;
};

// Función para inicializar el tema al cargar la app
const initializeTheme = () => {
    const savedTheme = localStorage.getItem('app_theme') || 'light';
    const animatedBg = localStorage.getItem('animated_bg') === 'true';
    const theme = themes[savedTheme];

    // Agregar estilos de animación si no existen
    if (!document.getElementById('theme-animations')) {
        const style = document.createElement('style');
        style.id = 'theme-animations';
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
    }

    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', theme.background);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--secondary-bg', theme.secondaryBg);

    document.body.style.background = theme.background;
    document.body.style.color = theme.textColor;
    document.body.style.minHeight = '100vh';
    document.body.style.transition = 'all 0.3s ease';

    if (animatedBg) {
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradientShift 15s ease infinite';
    }
};

export { ThemeSelector, initializeTheme, themes };
export default ThemeSelector;
