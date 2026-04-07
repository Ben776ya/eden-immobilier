'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-eden-bg/40" />
          <div className="absolute bottom-4 right-4 bg-eden-bg/70 px-3 py-1 text-eden-cream text-xs">
            {activeIndex + 1} / {images.length}
          </div>
          <div className="absolute bottom-4 left-4 text-eden-cream text-xs tracking-wider opacity-60">
            Cliquer pour agrandir
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-eden-bg/70 flex items-center justify-center text-eden-cream hover:bg-eden-gold hover:text-eden-bg transition-colors"
              aria-label="Image précédente"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-eden-bg/70 flex items-center justify-center text-eden-cream hover:bg-eden-gold hover:text-eden-bg transition-colors"
              aria-label="Image suivante"
            >
              →
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide px-0">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-24 h-16 overflow-hidden border-2 transition-colors ${
                  i === activeIndex ? 'border-eden-gold' : 'border-transparent opacity-60 hover:opacity-100'
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
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white text-2xl w-10 h-10 flex items-center justify-center hover:text-eden-gold"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 flex items-center justify-center text-white hover:bg-eden-gold hover:text-eden-bg transition-colors"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            ←
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
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 flex items-center justify-center text-white hover:bg-eden-gold hover:text-eden-bg transition-colors"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            →
          </button>
        </div>
      )}
    </>
  )
}
