'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-20">
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] uppercase text-eden-gold mb-3">Contact</p>
          <h1 className="font-serif text-5xl text-eden-cream mb-4">Contactez-nous</h1>
          <p className="text-eden-muted leading-relaxed">Notre équipe vous répondra dans les 24 heures ouvrées.</p>
        </div>

        {submitted ? (
          <div className="text-center bg-eden-surface border border-eden-border p-16">
            <p className="font-serif text-3xl text-eden-gold mb-4">Merci</p>
            <p className="text-eden-muted leading-relaxed">Votre message a bien été envoyé. Nous vous contacterons dans les meilleurs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">Nom *</label>
                <input required type="text" className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">Email *</label>
                <input required type="email" className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors" placeholder="votre@email.fr" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">Téléphone</label>
              <input type="tel" className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors" placeholder="+33 6 00 00 00 00" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">Bien souhaité</label>
              <select className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors appearance-none">
                <option value="">Sélectionner un type</option>
                <option>Villa</option>
                <option>Appartement</option>
                <option>Penthouse</option>
                <option>Maison / Château</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-eden-muted mb-2">Message *</label>
              <textarea required rows={6} className="w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3 focus:outline-none focus:border-eden-gold transition-colors resize-none" placeholder="Décrivez votre projet immobilier..." />
            </div>
            <button type="submit" className="w-full py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-cream transition-colors duration-300">
              Envoyer le message
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-eden-border text-center">
          {[
            { label: 'Adresse', value: '12 Avenue Montaigne\nParis 8e' },
            { label: 'Téléphone', value: '+33 1 42 00 00 00' },
            { label: 'Email', value: 'contact@eden-immobilier.fr' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs tracking-widest uppercase text-eden-gold mb-3">{item.label}</p>
              <p className="text-eden-muted text-sm whitespace-pre-line">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
