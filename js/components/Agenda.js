import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const taskColors = ['#ffacc7', '#a8e6cf', '#ffd3b6', '#a2d2ff'];
const stickers = ['⭐', '❤️', '🔥', '🐾', '🌿', '✨', '🎂', '🧘‍♀️', '💊'];

const Agenda = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Tomar desayuno rico 🥞', done: false, color: '#ffacc7', stickers: [] },
    { id: 2, text: 'Revisar correos (20 min) 📧', done: false, color: '#a2d2ff', stickers: [] },
    { id: 3, text: 'Caminata corta 🌿', done: false, color: '#a8e6cf', stickers: [] }
  ]);
  const [newTask, setNewTask] = useState('');
  const [selectedSticker, setSelectedSticker] = useState(null);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const color = taskColors[Math.floor(Math.random() * taskColors.length)];
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false, color, stickers: [] }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addStickerToTask = (taskId) => {
    if (!selectedSticker) return;
    setTasks(tasks.map(t => {
        if (t.id === taskId) {
            // Avoid duplicates of the same sticker if desired, or allow multiple
            // Let's allow max 5 stickers
            if (t.stickers.length >= 5) return t;
            return { ...t, stickers: [...t.stickers, selectedSticker] };
        }
        return t;
    }));
    // Optional: deselect sticker after adding
    // setSelectedSticker(null); 
  };

  return html`
    <div className="agenda" style=${{ paddingBottom: '50px' }}>
      <h2 style=${{ color: '#ff8fab' }}>📅 Tu Agenda Visual</h2>
      
      <div className="card" style=${{ marginBottom: '20px', background: '#fff0f5' }}>
        <p style=${{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#888' }}>
          ${selectedSticker ? `¡Sticker ${selectedSticker} seleccionado! Toca una tarea para pegarlo.` : 'Elige un sticker para decorar tus tareas:'}
        </p>
        <div style=${{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '5px' }}>
          ${stickers.map(s => html`
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
    </div>
  `;
};

export default Agenda;
