import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';
import confetti from 'https://esm.sh/canvas-confetti';

const html = htm.bind(React.createElement);

const taskColors = ['#ffacc7', '#a8e6cf', '#ffd3b6', '#a2d2ff'];
const initialStickers = ['⭐', '❤️', '🔥', '🐾'];
const unlockableStickers = ['🦄', '🌈', '🍦', '🎨', '🚀', '🐱', '🌺', '💎', '🧘‍♀️', '💊', '🦋', '🚲'];

const Agenda = () => {
  // State
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [points, setPoints] = useState(0);
  const [unlockedStickers, setUnlockedStickers] = useState(initialStickers);
  const [rewardClaimedDate, setRewardClaimedDate] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);
  const [stickerHistory, setStickerHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
        const savedTasks = localStorage.getItem('agenda_tasks');
        const savedPoints = localStorage.getItem('agenda_points');
        const savedStickers = localStorage.getItem('agenda_stickers');
        const savedRewardDate = localStorage.getItem('agenda_reward_date');
        const savedHistory = localStorage.getItem('agenda_sticker_history');

        if (savedTasks) setTasks(JSON.parse(savedTasks));
        else {
             setTasks([
                { id: 1, text: 'Tomar desayuno rico 🥞', done: false, color: '#ffacc7', stickers: [] },
                { id: 2, text: 'Revisar correos (20 min) 📧', done: false, color: '#a2d2ff', stickers: [] },
                { id: 3, text: 'Caminata corta 🌿', done: false, color: '#a8e6cf', stickers: [] }
             ]);
        }
        if (savedPoints) setPoints(parseInt(savedPoints, 10));
        if (savedStickers) setUnlockedStickers(JSON.parse(savedStickers));
        if (savedRewardDate) setRewardClaimedDate(savedRewardDate);
        if (savedHistory) setStickerHistory(JSON.parse(savedHistory));
    } catch (e) {
        console.error("Error loading data", e);
    } finally {
        setLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes (only after initial load)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('agenda_tasks', JSON.stringify(tasks));
    localStorage.setItem('agenda_points', points.toString());
    localStorage.setItem('agenda_stickers', JSON.stringify(unlockedStickers));
    localStorage.setItem('agenda_sticker_history', JSON.stringify(stickerHistory));
    if (rewardClaimedDate) localStorage.setItem('agenda_reward_date', rewardClaimedDate);
  }, [tasks, points, unlockedStickers, rewardClaimedDate, stickerHistory, loaded]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const color = taskColors[Math.floor(Math.random() * taskColors.length)];
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false, color, stickers: [] }]);
    setNewTask('');
  };

  const checkDailyCompletion = (currentTasks) => {
      const allDone = currentTasks.length > 0 && currentTasks.every(t => t.done);
      const today = new Date().toLocaleDateString(); // Localized date string for history
      
      // Check if reward claimed for THIS specific date string to be safe
      if (allDone && rewardClaimedDate !== today) {
          triggerReward(today);
      }
  };

  const triggerReward = (today) => {
      // Filter stickers that are NOT yet unlocked
      const locked = unlockableStickers.filter(s => !unlockedStickers.includes(s));
      
      if (locked.length > 0) {
          const randomSticker = locked[Math.floor(Math.random() * locked.length)];
          setUnlockedStickers(prev => [...prev, randomSticker]);
          
          // Add to history
          setStickerHistory(prev => [...prev, { date: today, sticker: randomSticker }]);

          setNewlyUnlocked(randomSticker);
          setShowRewardModal(true);
          setRewardClaimedDate(today);
          
          confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ffacc7', '#a8e6cf', '#ffd3b6']
          });
      }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => {
        if (t.id === id) {
            const isNowDone = !t.done;
            // Update points
            setPoints(prev => isNowDone ? prev + 10 : Math.max(0, prev - 10));
            return { ...t, done: isNowDone };
        }
        return t;
    });
    setTasks(updatedTasks);
    checkDailyCompletion(updatedTasks);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addStickerToTask = (taskId) => {
    if (!selectedSticker) return;
    setTasks(tasks.map(t => {
        if (t.id === taskId) {
            if (t.stickers.length >= 5) return t;
            return { ...t, stickers: [...t.stickers, selectedSticker] };
        }
        return t;
    }));
  };

  return html`
    <div className="agenda" style=${{ paddingBottom: '50px', position: 'relative' }}>
        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style=${{ color: '#ff8fab', margin: 0 }}>📅 Agenda</h2>
            <div style=${{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick=${() => setShowHistoryModal(true)}
                    style=${{ background: '#e0f7fa', color: '#006064', border: 'none', padding: '5px 12px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                    📖 Mi Álbum
                </button>
                <div style=${{ background: 'white', padding: '5px 15px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', color: '#555', fontWeight: 'bold' }}>
                    💎 ${points} pts
                </div>
            </div>
        </div>
      
      <div className="card" style=${{ marginBottom: '20px', background: '#fff0f5' }}>
        <p style=${{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#888' }}>
          ${selectedSticker ? `¡Sticker ${selectedSticker} seleccionado!` : 'Colección de Stickers:'}
        </p>
        <div style=${{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '5px' }}>
          ${unlockedStickers.map(s => html`
            <${motion.button}
              key=${s}
              whileHover=${{ scale: 1.2 }}
              whileTap=${{ scale: 0.9 }}
              onClick=${() => setSelectedSticker(selectedSticker === s ? null : s)}
              style=${{
                fontSize: '1.5rem',
                background: selectedSticker === s ? '#ffacc7' : 'white',
                border: '1px solid #ffacc7',
                borderRadius: '50%',
                width: '45px', 
                height: '45px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              ${s}
            </${motion.button}>
          `)}
           ${// Placeholder for locked stickers
             Array(Math.max(0, unlockableStickers.length + initialStickers.length - unlockedStickers.length)).fill(0).map((_, i) => html`
                <div style=${{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', opacity: 0.5, flexShrink: 0 }}>🔒</div>
           `).slice(0, 3)} 
        </div>
      </div>

      <form onSubmit=${addTask} style=${{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value=${newTask}
          onChange=${(e) => setNewTask(e.target.value)}
          placeholder="¿Qué haremos hoy?"
          style=${{ 
            flex: 1, 
            padding: '15px', 
            borderRadius: '50px', 
            border: '2px solid #ffacc7', 
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <button type="submit" className="btn-happy">➕</button>
      </form>

      <div style=${{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        ${tasks.map(task => html`
          <${motion.div}
            key=${task.id}
            initial=${{ opacity: 0, x: -20 }}
            animate=${{ opacity: 1, x: 0 }}
            exit=${{ opacity: 0, x: 20 }}
            layout
            onClick=${() => selectedSticker ? addStickerToTask(task.id) : null}
            style=${{
              background: task.done ? '#f0f0f0' : task.color,
              padding: '15px 20px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              opacity: task.done ? 0.6 : 1,
              position: 'relative',
              cursor: selectedSticker ? 'copy' : 'default',
              border: selectedSticker ? '2px dashed #ff8fab' : 'none'
            }}
          >
            <div style=${{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
               
               <div onClick=${(e) => { e.stopPropagation(); toggleTask(task.id); }} style=${{ cursor: 'pointer', fontSize: '1.2rem' }}>
                  ${task.done ? '✅' : '⬜'}
               </div>
               
               <div style=${{ display: 'flex', flexDirection: 'column' }}>
                  <span style=${{ fontWeight: 'bold', textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#999' : '#5d5458' }}>
                    ${task.text}
                  </span>
                  
                  ${task.stickers && task.stickers.length > 0 && html`
                    <div style=${{ position: 'absolute', top: '-10px', right: '-5px', display: 'flex', gap: '-5px' }}>
                        ${task.stickers.map((s, i) => html`
                            <${motion.span} 
                                key=${i}
                                initial=${{ scale: 0, rotate: -20 }}
                                animate=${{ scale: 1.2, rotate: 0 }}
                                style=${{ fontSize: '1.5rem', background: 'white', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >${s}</${motion.span}>
                        `)}
                    </div>
                  `}
               </div>
            </div>

            <button 
              onClick=${(e) => { e.stopPropagation(); deleteTask(task.id); }}
              style=${{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: '1.2rem' }}
            >
              ❌
            </button>
          </${motion.div}>
        `)}
        
        ${tasks.length === 0 && html`
          <p style=${{ textAlign: 'center', color: '#ccc', marginTop: '20px' }}>¡Todo limpio! Tómate un descanso. 🌟</p>
        `}
      </div>

    <${AnimatePresence}>
      ${showRewardModal && html`
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
                zIndex: 1000
            }}
            onClick=${() => setShowRewardModal(false)}
        >
            <${motion.div}
                initial=${{ scale: 0.5, y: 50 }}
                animate=${{ scale: 1, y: 0 }}
                exit=${{ scale: 0.5, y: 50 }}
                style=${{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '25px',
                    textAlign: 'center',
                    maxWidth: '80%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
                onClick=${(e) => e.stopPropagation()}
            >
                <div style=${{ fontSize: '4rem', marginBottom: '10px' }}>🎉</div>
                <h2 style=${{ color: '#ff8fab', margin: '0 0 10px 0' }}>¡Misión Cumplida!</h2>
                <p style=${{ fontSize: '1.1rem', color: '#555' }}>Has completado todo por hoy. 🌟</p>
                
                <div style=${{ background: '#f0f8ff', padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
                    <p style=${{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#888' }}>Nuevo Sticker Desbloqueado:</p>
                    <div style=${{ fontSize: '5rem' }}>${newlyUnlocked}</div>
                </div>
                
                <button 
                    onClick=${() => setShowRewardModal(false)}
                    className="btn-happy" 
                    style=${{ marginTop: '20px', width: '100%', fontSize: '1.1rem' }}
                >
                    ¡Genial!
                </button>
            </${motion.div}>
        </${motion.div}>
      `}

      ${showHistoryModal && html`
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
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
            onClick=${() => setShowHistoryModal(false)}
        >
            <${motion.div}
                initial=${{ scale: 0.9, opacity: 0 }}
                animate=${{ scale: 1, opacity: 1 }}
                exit=${{ scale: 0.9, opacity: 0 }}
                style=${{
                    background: 'white',
                    width: '90%',
                    maxWidth: '400px',
                    maxHeight: '80vh',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick=${(e) => e.stopPropagation()}
            >
                <div style=${{ padding: '20px', background: '#e0f7fa', borderBottom: '1px solid #b2ebf2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style=${{ margin: 0, color: '#006064' }}>📖 Mi Álbum de Logros</h3>
                    <button onClick=${() => setShowHistoryModal(false)} style=${{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✖️</button>
                </div>
                
                <div style=${{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    ${stickerHistory.length === 0 ? html`
                        <div style=${{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                            <div style=${{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }}>🏺</div>
                            <p>Aún no hay historia escrita.</p>
                            <p style=${{ fontSize: '0.9rem' }}>Completa tus tareas diarias para llenar tu álbum.</p>
                        </div>
                    ` : html`
                        <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
                            ${stickerHistory.map((item, index) => html`
                                <div key=${index} style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '10px' }}>
                                    <div style=${{ fontSize: '2.5rem', marginBottom: '5px' }}>${item.sticker}</div>
                                    <div style=${{ fontSize: '0.7rem', color: '#999', textAlign: 'center' }}>${item.date}</div>
                                </div>
                            `)}
                        </div>
                    `}
                </div>
                
                <div style=${{ padding: '15px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '0.8rem', color: '#aaa' }}>
                    ¡Sigue así! 🌟
                </div>
            </${motion.div}>
        </${motion.div}>
      `}
    </${AnimatePresence}>

    </div>
  `;
};

export default Agenda;
