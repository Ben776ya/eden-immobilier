'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass =
    'w-full bg-eden-surface border border-eden-border text-eden-cream px-4 py-3.5 focus:outline-none focus:border-eden-gold/70 transition-colors duration-300 placeholder:text-eden-muted/50'

  return (
    <div className="pt-20">
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs tracking-label uppercase text-eden-gold mb-4">Contact</p>
          <h1 className="font-serif text-5xl text-eden-cream mb-5">Contactez-nous</h1>
          <div className="w-10 h-px bg-eden-gold/40 mx-auto mb-6" />
          <p className="text-eden-muted leading-relaxed">Notre équipe vous répondra dans les 24 heures ouvrées.</p>
        </div>

        {submitted ? (
          <div className="text-center bg-eden-surface border border-eden-border p-16 animate-scale-reveal">
            <p className="font-serif text-3xl text-eden-gold mb-4">Merci</p>
            <div className="w-10 h-px bg-eden-gold/40 mx-auto mb-5" />
            <p className="text-eden-muted leading-relaxed">Votre message a bien été envoyé. Nous vous contacterons dans les meilleurs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-label uppercase text-eden-muted mb-3">Nom *</label>
                <input required type="text" className={inputClass} placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-xs tracking-label uppercase text-eden-muted mb-3">Email *</label>
                <input required type="email" className={inputClass} placeholder="votre@email.fr" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-label uppercase text-eden-muted mb-3">Téléphone</label>
              <input type="tel" className={inputClass} placeholder="+33 6 00 00 00 00" />
            </div>
            <div>
              <label className="block text-xs tracking-label uppercase text-eden-muted mb-3">Bien souhaité</label>
              <select className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="">Sélectionner un type</option>
                <option>Villa</option>
                <option>Appartement</option>
                <option>Penthouse</option>
                <option>Maison / Château</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-label uppercase text-eden-muted mb-3">Message *</label>
              <textarea required rows={6} className={`${inputClass} resize-none`} placeholder="Décrivez votre projet immobilier..." />
            </div>
            <button type="submit" className="w-full py-4 bg-eden-gold text-eden-bg text-sm tracking-widest uppercase hover:bg-eden-gold-light transition-colors duration-500">
              Envoyer le message
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-eden-border text-center">
          {[
            { label: 'Adresse', value: '12 Avenue Montaigne\nParis 8e' },
            { label: 'Téléphone', value: '+33 1 42 00 00 00' },
            { label: 'Email', value: 'contact@eden-immobilier.fr' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs tracking-label uppercase text-eden-gold mb-3">{item.label}</p>
              <p className="text-eden-muted text-sm whitespace-pre-line">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
