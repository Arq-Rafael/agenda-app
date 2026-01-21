import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

// Toast de notificaciones
const Toast = ({ message, type, icon, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    const backgrounds = {
        points: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        levelup: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        achievement: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        reminder: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    };

    return html`
        <${motion.div}
            initial=${{ opacity: 0, y: -50, scale: 0.8 }}
            animate=${{ opacity: 1, y: 0, scale: 1 }}
            exit=${{ opacity: 0, y: -50, scale: 0.8 }}
            style=${{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: backgrounds[type] || backgrounds.reminder,
                color: type === 'achievement' ? '#333' : 'white',
                padding: '15px 25px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '250px',
                cursor: 'pointer'
            }}
            onClick=${onClose}
        >
            ${icon && html`<span style=${{ fontSize: '1.5rem' }}>${icon}</span>`}
            <span style=${{ fontWeight: 'bold' }}>${message}</span>
        </${motion.div}>
    `;
};

class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.reminders = this.loadReminders();
        this.checkPermission();
    }

    async checkPermission() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
    }

    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        }
        return this.permission === 'granted';
    }

    loadReminders() {
        const saved = localStorage.getItem('notification_reminders');
        return saved ? JSON.parse(saved) : {
            tasks: true,
            wellness: true,
            wellnessInterval: 60, // minutos
            lastWellnessReminder: null
        };
    }

    saveReminders() {
        localStorage.setItem('notification_reminders', JSON.stringify(this.reminders));
    }

    updateSettings(settings) {
        this.reminders = { ...this.reminders, ...settings };
        this.saveReminders();
    }

    async sendNotification(title, body, icon = '🌸') {
        if (this.permission !== 'granted') {
            return false;
        }

        try {
            const notification = new Notification(title, {
                body,
                icon: '/img/icon.png',
                badge: '/img/icon.png',
                tag: 'agenda-app',
                requireInteraction: false
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return true;
        } catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    }

    scheduleTaskReminder(taskName, time) {
        if (!this.reminders.tasks) return;

        const now = new Date();
        const reminderTime = new Date(time);
        const timeDiff = reminderTime - now;

        if (timeDiff > 0) {
            setTimeout(() => {
                this.sendNotification(
                    '📅 Recordatorio de Tarea',
                    taskName
                );
            }, timeDiff);
        }
    }

    startWellnessReminders() {
        if (!this.reminders.wellness) return;

        const interval = this.reminders.wellnessInterval * 60 * 1000; // Convertir a ms

        setInterval(() => {
            const messages = [
                { title: '🍃 Momento de Respirar', body: 'Toma un descanso y respira profundo' },
                { title: '💧 Hidrátate', body: 'Recuerda tomar agua' },
                { title: '🧘 Estira tu cuerpo', body: 'Un pequeño estiramiento te hará bien' },
                { title: '😊 ¿Cómo te sientes?', body: 'Registra tu estado de ánimo' },
                { title: '🌸 Pausa consciente', body: 'Observa tu respiración por un momento' }
            ];

            const random = messages[Math.floor(Math.random() * messages.length)];
            this.sendNotification(random.title, random.body);
            
            this.reminders.lastWellnessReminder = new Date().toISOString();
            this.saveReminders();
        }, interval);
    }
}

const notificationManager = new NotificationManager();

// Componente de configuración de notificaciones
const NotificationSettings = ({ onClose }) => {
    const [settings, setSettings] = useState(notificationManager.reminders);
    const [permission, setPermission] = useState(notificationManager.permission);

    const handleRequestPermission = async () => {
        const granted = await notificationManager.requestPermission();
        setPermission(granted ? 'granted' : 'denied');
    };

    const handleToggle = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        notificationManager.updateSettings(newSettings);
    };

    const handleIntervalChange = (value) => {
        const newSettings = { ...settings, wellnessInterval: parseInt(value) };
        setSettings(newSettings);
        notificationManager.updateSettings(newSettings);
    };

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
                    maxWidth: '500px',
                    width: '100%'
                }}
            >
                <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style=${{ margin: 0 }}>🔔 Notificaciones</h2>
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

                ${permission !== 'granted' && html`
                    <div style=${{
                        background: '#fff3cd',
                        padding: '15px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        border: '1px solid #ffc107'
                    }}>
                        <p style=${{ margin: '0 0 10px 0' }}>Para recibir recordatorios, necesitas activar las notificaciones.</p>
                        <button
                            onClick=${handleRequestPermission}
                            style=${{
                                background: '#ffc107',
                                color: '#333',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Activar Notificaciones
                        </button>
                    </div>
                `}

                <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <!-- Recordatorios de tareas -->
                    <div style=${{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        background: '#f9f9f9',
                        borderRadius: '10px'
                    }}>
                        <div>
                            <div style=${{ fontWeight: 'bold', marginBottom: '5px' }}>📅 Recordatorios de Tareas</div>
                            <div style=${{ fontSize: '0.85rem', color: '#666' }}>Notificaciones para tus tareas pendientes</div>
                        </div>
                        <label style=${{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                checked=${settings.tasks}
                                onChange=${() => handleToggle('tasks')}
                                style=${{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style=${{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: settings.tasks ? '#4CAF50' : '#ccc',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style=${{
                                    position: 'absolute',
                                    content: '""',
                                    height: '18px',
                                    width: '18px',
                                    left: settings.tasks ? '29px' : '3px',
                                    bottom: '3px',
                                    background: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <!-- Recordatorios de bienestar -->
                    <div style=${{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        background: '#f9f9f9',
                        borderRadius: '10px'
                    }}>
                        <div>
                            <div style=${{ fontWeight: 'bold', marginBottom: '5px' }}>🍃 Recordatorios de Bienestar</div>
                            <div style=${{ fontSize: '0.85rem', color: '#666' }}>Pausas para respirar y relajarte</div>
                        </div>
                        <label style=${{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input
                                type="checkbox"
                                checked=${settings.wellness}
                                onChange=${() => handleToggle('wellness')}
                                style=${{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style=${{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: settings.wellness ? '#4CAF50' : '#ccc',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style=${{
                                    position: 'absolute',
                                    content: '""',
                                    height: '18px',
                                    width: '18px',
                                    left: settings.wellness ? '29px' : '3px',
                                    bottom: '3px',
                                    background: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    ${settings.wellness && html`
                        <div style=${{ padding: '15px', background: '#f0f9ff', borderRadius: '10px' }}>
                            <label style=${{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                                Frecuencia de recordatorios
                            </label>
                            <select
                                value=${settings.wellnessInterval}
                                onChange=${(e) => handleIntervalChange(e.target.value)}
                                style=${{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="30">Cada 30 minutos</option>
                                <option value="60">Cada hora</option>
                                <option value="90">Cada 90 minutos</option>
                                <option value="120">Cada 2 horas</option>
                            </select>
                        </div>
                    `}
                </div>
            </${motion.div}>
        </${motion.div}>
    `;
};

export { notificationManager, NotificationSettings, Toast };
export default notificationManager;
