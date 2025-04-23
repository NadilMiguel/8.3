import React from 'react';
import { X, Copy, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function ShareModal({ isOpen, onClose, url }: ShareModalProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copiada al portapapeles');
    } catch (err) {
      console.error('Error al copiar URL:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Compartir tabla',
          text: 'Mira esta tabla de productos',
          url: url
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error al compartir:', err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in duration-200">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-amazon-brown">
                Compartir tabla
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 bg-transparent border-none focus:outline-none text-amazon-brown"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-full hover:bg-gray-200 text-amazon-brown"
                  title="Copiar URL"
                >
                  <Copy size={20} />
                </button>
              </div>
              
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amazon-orange text-white hover:bg-amazon-orange/90 transition-colors"
                >
                  <Share2 size={20} />
                  Compartir
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}