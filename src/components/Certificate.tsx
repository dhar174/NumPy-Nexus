import React, { useEffect, useRef } from 'react';
import { Download, X } from 'lucide-react';

export function Certificate({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw certificate
    canvas.width = 800;
    canvas.height = 500;

    // Background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid background effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = '#10b981'; // emerald-500
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner border
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Text
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 40px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 120);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '30px "Courier New", Courier, monospace';
    ctx.fillText('NEXUS ML_OPS MASTER', canvas.width / 2, 200);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px "Courier New", Courier, monospace';
    ctx.fillText('Has successfully completed all data processing missions.', canvas.width / 2, 260);
    ctx.fillText('Demonstrating proficiency in NumPy operations.', canvas.width / 2, 300);

    ctx.fillStyle = '#3b82f6';
    ctx.font = '16px "Courier New", Courier, monospace';
    const date = new Date().toLocaleDateString();
    ctx.fillText(`Date: ${date}`, canvas.width / 2, 380);
    ctx.fillText(`ID: NX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, canvas.width / 2, 410);

    // Add some "tech" decorations
    ctx.fillStyle = '#10b981';
    ctx.fillRect(40, 40, 20, 20);
    ctx.fillRect(canvas.width - 60, 40, 20, 20);
    ctx.fillRect(40, canvas.height - 60, 20, 20);
    ctx.fillRect(canvas.width - 60, canvas.height - 60, 20, 20);

  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'nexus-ml-ops-certificate.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 max-w-4xl w-full flex flex-col items-center relative shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-3xl font-bold text-emerald-400 mb-2 font-mono tracking-wider">MISSION ACCOMPLISHED</h2>
        <p className="text-slate-400 mb-8 font-mono text-sm">You have mastered the core operations.</p>
        
        <div className="relative shadow-2xl shadow-emerald-900/50 mb-8 w-full overflow-hidden rounded-lg border border-slate-700 flex justify-center bg-slate-950">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ width: '800px' }}
          />
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-mono font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
        >
          <Download size={20} />
          DOWNLOAD CERTIFICATE
        </button>
      </div>
    </div>
  );
}
