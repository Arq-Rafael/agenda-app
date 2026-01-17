import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const SoundScapes = () => {
    const [activeSound, setActiveSound] = useState('off'); // off, rain, forest
    const [volume, setVolume] = useState(0.5);
    const [isOpen, setIsOpen] = useState(false);
    
    // Web Audio API refs
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);
    const sourceNodesRef = useRef([]);

    useEffect(() => {
        // Initialize Audio Context on first user interaction (or mount if allowed)
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination);
        }
    }, []);

    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        }
    }, [volume]);

    useEffect(() => {
        stopAllSounds();
        if (activeSound !== 'off') {
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
            if (activeSound === 'rain') playRain();
            if (activeSound === 'forest') playForest();
        }
    }, [activeSound]);

    const stopAllSounds = () => {
        sourceNodesRef.current.forEach(node => {
            try { node.stop(); } catch (e) {}
            try { node.disconnect(); } catch (e) {}
        });
        sourceNodesRef.current = [];
    };

    // --- Sound Generators ---

    const createNoiseBuffer = () => {
        const ctx = audioContextRef.current;
        const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise approx
            lastOut = output[i];
            output[i] *= 3.5; 
        }
        return buffer;
    };
    let lastOut = 0;

    const playRain = () => {
        const ctx = audioContextRef.current;
        const buffer = createNoiseBuffer();
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        // Filter to make it sound like rain (Lowpass)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        noise.connect(filter);
        filter.connect(gainNodeRef.current);
        noise.start();
        sourceNodesRef.current.push(noise);
    };

    const playForest = () => {
        const ctx = audioContextRef.current;
        // Simple "Wind" drone (Bandpass noise) + Occasional "Bird" (Sine)
        
        // Wind component
        const buffer = createNoiseBuffer();
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 1;

        // Modulate filter for wind gusts
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // Slow wind
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noise.connect(filter);
        filter.connect(gainNodeRef.current);
        noise.start();
        
        sourceNodesRef.current.push(noise);
        sourceNodesRef.current.push(lfo);

        // Birds (Random sine chirps) - Simplified interval
        const birdInterval = setInterval(() => {
            if (activeSound !== 'forest') {
                clearInterval(birdInterval);
                return;
            }
            if (Math.random() > 0.7) playBird();
        }, 2000);
        
        // Store interval clean up mechanism is tricky here without refs, 
        // relying on activeSound check inside interval.
    };

    const playBird = () => {
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.frequency.setValueAtTime(1500 + Math.random() * 500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000 + Math.random() * 500, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1 * volume, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(audioContextRef.current.destination); // Bypass main gain to keep birds distinct or connect to main?
        // Let's connect to main so volume controls them too
        gain.disconnect();
        gain.connect(gainNodeRef.current);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    };


    return html`
        <div style=${{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <${AnimatePresence}>
                ${isOpen && html`
                    <${motion.div}
                        initial=${{ opacity: 0, y: 20, scale: 0.8 }}
                        animate=${{ opacity: 1, y: 0, scale: 1 }}
                        exit=${{ opacity: 0, y: 20, scale: 0.8 }}
                        style=${{ 
                            background: 'white', 
                            padding: '15px', 
                            borderRadius: '20px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            width: '150px'
                        }}
                    >
                        <h4 style=${{ margin: 0, color: '#888', fontSize: '0.9rem' }}>Atmósfera</h4>
                        
                        <button 
                            onClick=${() => setActiveSound('rain')}
                            style=${{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: activeSound === 'rain' ? '#e0f7fa' : 'transparent',
                                border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer',
                                color: activeSound === 'rain' ? '#006064' : '#555'
                            }}
                        >
                            <span>Lluvia</span> <span>🌧️</span>
                        </button>

                        <button 
                            onClick=${() => setActiveSound('forest')}
                            style=${{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: activeSound === 'forest' ? '#f1f8e9' : 'transparent',
                                border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer',
                                color: activeSound === 'forest' ? '#33691e' : '#555'
                            }}
                        >
                            <span>Bosque</span> <span>🌲</span>
                        </button>

                        <button 
                            onClick=${() => setActiveSound('off')}
                            style=${{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: activeSound === 'off' ? '#ffebee' : 'transparent',
                                border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer',
                                color: activeSound === 'off' ? '#c62828' : '#555'
                            }}
                        >
                            <span>Silencio</span> <span>🔇</span>
                        </button>
                        
                        <div style=${{ marginTop: '5px' }}>
                            <input 
                                type="range" 
                                min="0" max="1" step="0.1" 
                                value=${volume} 
                                onChange=${(e) => setVolume(parseFloat(e.target.value))}
                                style=${{ width: '100%', accentColor: '#ffacc7' }}
                            />
                        </div>

                    </${motion.div}>
                `}
            </${AnimatePresence}>

            <${motion.button}
                whileHover=${{ scale: 1.1 }}
                whileTap=${{ scale: 0.9 }}
                onClick=${() => setIsOpen(!isOpen)}
                style=${{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: activeSound !== 'off' ? '#ffacc7' : 'white',
                    border: 'none',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeSound !== 'off' ? 'white' : '#555'
                }}
            >
                🎵
            </${motion.button}>
        </div>
    `;
};

export default SoundScapes;
