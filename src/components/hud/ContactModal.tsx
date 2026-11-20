'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Github, Linkedin, Mail, MapPin, Phone, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { personalInfo } from '@/data/personal'

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email)
      setCopied(true)
      toast.success('Email copied to clipboard!')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy automatically.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/55"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border-2 border-ink-900 bg-cream-100 shadow-pop-lg"
          >
            <div className="flex items-center justify-between border-b-2 border-ink-900 bg-coral-500 px-5 py-3 text-cream-50">
              <span className="font-display text-base font-bold">
                Contact Pit-Stop
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact dialog"
                className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink-900 bg-cream-100 text-ink-900 hover:bg-sunny-500"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              <h2
                id="contact-modal-title"
                className="font-display text-3xl font-bold text-cobalt-600"
              >
                Let&apos;s Build Something Fun!
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                {personalInfo.availability.status}. Reach out for Software Development,
                Full-Stack Web, or Data Centre Operations roles.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-ink-900 bg-cream-50 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-cobalt-600" aria-hidden="true" />
                    <span className="truncate text-sm font-bold text-ink-900">
                      {personalInfo.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="pop-btn inline-flex shrink-0 items-center gap-1 rounded-full bg-sunny-500 px-3 py-1 text-xs font-extrabold text-ink-900"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border-2 border-ink-900 bg-cream-50 px-4 py-3 text-sm font-bold text-ink-900">
                  <Phone className="h-5 w-5 shrink-0 text-coral-500" aria-hidden="true" />
                  <a href={`tel:${personalInfo.phone.replace(/[^+\d]/g, '')}`} className="hover:underline">
                    {personalInfo.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border-2 border-ink-900 bg-cream-50 px-4 py-3 text-sm font-bold text-ink-900">
                  <MapPin className="h-5 w-5 shrink-0 text-cobalt-600" aria-hidden="true" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="pop-btn inline-flex items-center gap-2 rounded-full bg-sunny-500 px-5 py-2.5 font-display text-sm font-bold text-ink-900"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Send Email</span>
                </a>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop-btn inline-flex items-center gap-2 rounded-full bg-cream-50 px-5 py-2.5 font-display text-sm font-bold text-ink-900"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  <span>GitHub</span>
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop-btn inline-flex items-center gap-2 rounded-full bg-cobalt-600 px-5 py-2.5 font-display text-sm font-bold text-cream-50"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="checker-ribbon h-3.5 w-full border-t-2 border-ink-900" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
