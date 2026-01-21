import React, { useState, useEffect } from 'react';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const quotes = [
    { text: "Eres más fuerte de lo que crees", category: "autoestima" },
    { text: "Cada día es una nueva oportunidad", category: "motivación" },
    { text: "Respira. Estás haciendo lo mejor que puedes", category: "ansiedad" },
    { text: "Tus sentimientos son válidos", category: "autoestima" },
    { text: "El progreso, no la perfección", category: "ansiedad" },
    { text: "Eres suficiente, tal como eres", category: "autoestima" },
    { text: "Un paso a la vez", category: "ansiedad" },
    { text: "Tu mente es poderosa. Cuando la llenas de pensamientos positivos, tu vida empieza a cambiar", category: "concentración" },
    { text: "No tienes que ser perfecta para ser increíble", category: "autoestima" },
    { text: "Está bien tomarse un descanso", category: "ansiedad" },
    { text: "Confía en el proceso", category: "motivación" },
    { text: "Eres capaz de cosas maravillosas", category: "autoestima" },
    { text: "La calma es un superpoder", category: "ansiedad" },
    { text: "Hoy elijo la paz", category: "ansiedad" },
    { text: "Mi concentración mejora cada día", category: "concentración" },
    { text: "Merezco amor y respeto", category: "autoestima" },
    { text: "Puedo manejar lo que venga", category: "ansiedad" },
    { text: "Soy dueña de mis pensamientos", category: "concentración" },
    { text: "Mi bienestar es una prioridad", category: "autoestima" },
    { text: "Celebro cada pequeño logro", category: "motivación" },
    { text: "La ansiedad no me define", category: "ansiedad" },
    { text: "Estoy presente en este momento", category: "concentración" },
    { text: "Merezco descansar sin culpa", category: "ansiedad" },
    { text: "Soy resiliente y adaptable", category: "autoestima" },
    { text: "Mi enfoque es claro y fuerte", category: "concentración" },
    { text: "Acepto mis imperfecciones con amor", category: "autoestima" },
    { text: "Cada respiración me trae calma", category: "ansiedad" },
    { text: "Confío en mi capacidad de aprender", category: "concentración" },
    { text: "Soy digna de cosas buenas", category: "autoestima" },
    { text: "Hoy es un buen día para empezar", category: "motivación" }
];

const MotivationalQuotes = ({ category = null, inline = false }) => {
    const [currentQuote, setCurrentQuote] = useState(() => {
        const saved = localStorage.getItem('daily_quote');
        const savedDate = localStorage.getItem('daily_quote_date');
        const today = new Date().toDateString();

        if (saved && savedDate === today) {
            return JSON.parse(saved);
        } else {
            const filtered = category ? quotes.filter(q => q.category === category) : quotes;
            const random = filtered[Math.floor(Math.random() * filtered.length)];
            localStorage.setItem('daily_quote', JSON.stringify(random));
            localStorage.setItem('daily_quote_date', today);
            return random;
        }
    });

    const getNewQuote = () => {
        const filtered = category ? quotes.filter(q => q.category === category) : quotes;
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        setCurrentQuote(random);
        localStorage.setItem('daily_quote', JSON.stringify(random));
        localStorage.setItem('daily_quote_date', new Date().toDateString());
    };

    const categoryIcons = {
        autoestima: '💖',
        ansiedad: '🍃',
        concentración: '🎯',
        motivación: '⭐'
    };

    if (inline) {
        return html`
            <div style=${{
                padding: '20px',
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                borderRadius: '15px',
                textAlign: 'center'
            }}>
                <p style=${{ 
                    margin: 0, 
                    fontSize: '1.2rem', 
                    fontStyle: 'italic',
                    color: '#333'
                }}>
                    "${currentQuote.text}"
                </p>
                <button
                    onClick=${getNewQuote}
                    style=${{
                        marginTop: '15px',
                        background: 'rgba(255,255,255,0.5)',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                    }}
                >
                    🔄 Nueva frase
                </button>
            </div>
        `;
    }

    return html`
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <!-- Frase del día -->
            <div className="card" style=${{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center',
                padding: '40px'
            }}>
                <div style=${{ fontSize: '3rem', marginBottom: '20px' }}>
                    ${categoryIcons[currentQuote.category]}
                </div>
                <h2 style=${{ 
                    margin: '0 0 20px 0', 
                    fontSize: '1.8rem',
                    fontStyle: 'italic',
                    lineHeight: '1.4'
                }}>
                    "${currentQuote.text}"
                </h2>
                <div style=${{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    marginBottom: '20px'
                }}>
                    ${currentQuote.category}
                </div>
                <br/>
                <button
                    onClick=${getNewQuote}
                    style=${{
                        background: 'white',
                        color: '#667eea',
                        border: 'none',
                        padding: '12px 25px',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        marginTop: '10px'
                    }}
                >
                    🔄 Nueva Inspiración
                </button>
            </div>

            <!-- Categorías -->
            <div>
                <h3 style=${{ marginBottom: '15px' }}>Explora por categoría</h3>
                <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                    ${Object.entries(categoryIcons).map(([cat, icon]) => {
                        const count = quotes.filter(q => q.category === cat).length;
                        return html`
                            <div
                                key=${cat}
                                className="card"
                                style=${{
                                    textAlign: 'center',
                                    padding: '20px',
                                    cursor: 'pointer',
                                    borderLeft: currentQuote.category === cat ? '4px solid #667eea' : 'none'
                                }}
                                onClick=${() => {
                                    const filtered = quotes.filter(q => q.category === cat);
                                    const random = filtered[Math.floor(Math.random() * filtered.length)];
                                    setCurrentQuote(random);
                                }}
                            >
                                <div style=${{ fontSize: '2rem', marginBottom: '10px' }}>${icon}</div>
                                <div style=${{ fontWeight: 'bold', marginBottom: '5px', textTransform: 'capitalize' }}>${cat}</div>
                                <div style=${{ fontSize: '0.85rem', color: '#999' }}>${count} frases</div>
                            </div>
                        `;
                    })}
                </div>
            </div>
        </div>
    `;
};

export default MotivationalQuotes;
