import React, { useRef, useEffect, useState } from 'react';
import { Pen, Eraser, RotateCcw, Save } from 'lucide-react';

interface HandwritingCanvasProps {
  onSave: (dataUrl: string) => void;
  initialData?: string;
}

const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({ onSave, initialData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [strokeWidth, setStrokeWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load initial data if provided
    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialData;
    } else {
      // Clear canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = strokeWidth;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 3;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Prise de notes manuscrites</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-lg transition-colors ${
              tool === 'pen' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Pen className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-colors ${
              tool === 'eraser' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eraser className="h-4 w-4" />
          </button>
          <input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-16"
          />
          <button
            onClick={clearCanvas}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={saveCanvas}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full border border-gray-300 rounded-lg bg-white cursor-crosshair"
        style={{ height: '300px' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <p className="text-sm text-gray-600">
        Utilisez votre souris, stylet ou doigt pour écrire des notes manuscrites. 
        Ces notes seront sauvegardées avec l'incident.
      </p>
    </div>
  );
};

export default HandwritingCanvas;