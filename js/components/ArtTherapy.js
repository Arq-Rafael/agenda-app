import React, { useRef, useState, useEffect } from 'react';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

const colors = [
  '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', 
  '#955251', '#B565A7', '#009B77', '#DD4124', '#D65076',
  '#45B8AC', '#EFC050', '#5B5EA6', '#9B2335', '#DFCFBE'
];

const templates = [
  { id: 'blank', label: 'Lienzo Blanco', icon: '⬜' },
  { id: 'circle', label: 'Círculos Zen', icon: '🔘' },
  { id: 'flower', label: 'Flor Serena', icon: '🌸' },
  { id: 'star', label: 'Estrella Guía', icon: '⭐' }
];

const ArtTherapy = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#FF6F61');
  const [isDrawing, setIsDrawing] = useState(false);
  const [template, setTemplate] = useState('circle');

  useEffect(() => {
    drawTemplate(template);
  }, [template]);

  const drawTemplate = (type) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Resize checks
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;

    if (type === 'circle') {
      for (let r = 20; r <= 140; r += 20) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (type === 'flower') {
        const petals = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < petals; i++) {
            const angle = (i * 2 * Math.PI) / petals;
            const x = cx + Math.cos(angle) * 60;
            const y = cy + Math.sin(angle) * 60;
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else if (type === 'star') {
        const drawStar = (cx, cy, spikes, outerRadius, innerRadius) => {
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            let step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.stroke();
        };
        drawStar(cx, cy, 5, 100, 40);
        drawStar(cx, cy, 10, 140, 90);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const changeTemplate = (newTemplate) => {
      setTemplate(newTemplate);
  };

  return html`
    <div className="card" style=${{ display: 'flex', flexDirection: 'column', height: '650px', padding: '0', overflow: 'hidden' }}>
      
      <div style=${{ padding: '15px', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style=${{ margin: 0, color: '#555', fontSize: '1.2rem' }}>🎨 Lienzo de Calma</h3>
        <button className="btn-happy" style=${{ background: '#ff8a80', fontSize: '0.9rem', padding: '5px 15px' }} onClick=${() => drawTemplate(template)}>Borrar</button>
      </div>

      <div style=${{ display: 'flex', gap: '5px', padding: '10px', background: 'white', justifyContent: 'center', borderBottom: '1px solid #eee' }}>
        ${templates.map(t => html`
            <button 
                key=${t.id}
                onClick=${() => changeTemplate(t.id)}
                style=${{
                    background: template === t.id ? '#b2dfdb' : 'transparent',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: template === t.id ? '#00695c' : '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}
            >
                ${t.icon} ${t.label}
            </button>
        `)}
      </div>

      <div style=${{ flex: 1, position: 'relative', cursor: 'crosshair', touchAction: 'none' }}>
        <canvas 
          ref=${canvasRef} 
          style=${{ width: '100%', height: '100%', display: 'block' }}
          onMouseDown=${startDrawing}
          onMouseMove=${draw}
          onMouseUp=${stopDrawing}
          onMouseLeave=${stopDrawing}
          onTouchStart=${startDrawing}
          onTouchMove=${draw}
          onTouchEnd=${stopDrawing}
        />
      </div>

      <div style=${{ padding: '15px', background: 'white', borderTop: '1px solid #eee' }}>
        <p style=${{ marginTop: 0, marginBottom: '10px', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>Colores Pastel</p>
        <div style=${{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          ${colors.map(c => html`
            <div 
              key=${c}
              onClick=${() => setColor(c)}
              style=${{
                width: '35px',
                height: '35px',
                background: c,
                borderRadius: '50%',
                cursor: 'pointer',
                border: color === c ? '3px solid #555' : '2px solid white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transform: color === c ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s'
              }}
            />
          `)}
        </div>
      </div>
    </div>
  `;
};

export default ArtTherapy;
