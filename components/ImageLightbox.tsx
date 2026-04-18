'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

type ImageLightboxProps = {
  src: string;
  alt: string;
  children: React.ReactNode;
};

export default function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setZoomed(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label={`View ${alt} full size`}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className={`relative z-10 transition-transform duration-300 ease-out ${
              zoomed
                ? 'cursor-zoom-out scale-150 md:scale-[2]'
                : 'cursor-zoom-in'
            }`}
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={1920}
              height={1080}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
