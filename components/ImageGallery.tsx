'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const prev = useCallback(() => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1)), [images.length])
  const next = useCallback(() => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1)), [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, prev, next])

  return (
    <>
      <div className="relative">
        <div
          className="relative h-[60vh] md:h-[75vh] cursor-pointer overflow-hidden bg-eden-surface"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} — image ${activeIndex + 1}`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-eden-bg/50" />
          <div className="absolute bottom-4 right-4 bg-eden-bg/70 backdrop-blur-sm px-3 py-1.5 text-eden-cream text-xs tracking-wider">
            {activeIndex + 1} / {images.length}
          </div>
          <div className="absolute bottom-4 left-4 text-eden-cream/50 text-xs tracking-wider">
            Cliquer pour agrandir
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-eden-bg/60 backdrop-blur-sm flex items-center justify-center text-eden-cream hover:bg-eden-gold hover:text-eden-bg transition-all duration-300"
              aria-label="Image précédente"
            >
              &larr;
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-eden-bg/60 backdrop-blur-sm flex items-center justify-center text-eden-cream hover:bg-eden-gold hover:text-eden-bg transition-all duration-300"
              aria-label="Image suivante"
            >
              &rarr;
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-24 h-16 overflow-hidden border transition-all duration-300 ${
                  i === activeIndex ? 'border-eden-gold opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <Image
                  src={src}
                  alt={`Miniature ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-label={`Galerie photos — ${title}`}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 text-2xl w-10 h-10 flex items-center justify-center hover:text-eden-gold transition-colors duration-300"
            onClick={() => setLightboxOpen(false)}
          >
            &times;
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-eden-gold hover:text-eden-bg transition-all duration-300"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            &larr;
          </button>
          <div
            className="relative w-[90vw] h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} — image ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-eden-gold hover:text-eden-bg transition-all duration-300"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            &rarr;
          </button>
        </div>
      )}
    </>
  )
}
