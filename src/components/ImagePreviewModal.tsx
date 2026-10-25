'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  caption?: string;
  onClose: () => void;
}

export function ImagePreviewModal({ isOpen, imageUrl, caption, onClose }: ImagePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
          <span className="text-xs font-medium text-slate-700 truncate max-w-md">
            {caption || 'Media Attachment Preview'}
          </span>
          <div className="flex items-center gap-1.5">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200 transition"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-100/70 overflow-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Post media preview"
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
