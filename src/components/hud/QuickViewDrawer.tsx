'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github, Linkedin, Mail, MapPin, X } from 'lucide-react'
import { personalInfo } from '@/data/personal'
import { projects, type Project } from '@/data/projects'
import { skillCategories } from '@/data/skills'
import { timelineEntries } from '@/data/timeline'

export type QuickViewTab = 'projects' | 'skills' | 'journey' | 'about'

interface QuickViewDrawerProps {
  open: boolean
  initialTab: QuickViewTab
  onClose: () => void
  onInspectProject: (project: Project) => void
}

export function QuickViewDrawer({
  open,
  initialTab,
  onClose,
  onInspectProject,
}: QuickViewDrawerProps) {
  const [tab, setTab] = useState<QuickViewTab>(initialTab)

  useEffect(() => {
    if (open) setTab(initialTab)
  }, [open, initialTab])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio Quick View"
          className="fixed inset-0 z-50 flex justify-end"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/50"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l-2 border-ink-900 bg-cream-100 text-ink-900 shadow-pop-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-ink-900 bg-cobalt-600 px-5 py-4 text-cream-50">
              <div>
                <h2 className="font-display text-xl font-bold sm:text-2xl">
                  {personalInfo.name}
                </h2>
                <p className="text-xs font-semibold text-cream-100/90">
                  {personalInfo.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Quick View"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink-900 bg-sunny-500 text-ink-900 hover:bg-cream-50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto border-b-2 border-ink-900 bg-cream-200 px-5 py-3">
              {(
                [
                  { id: 'projects', label: `Projects (${projects.length})` },
                  { id: 'skills', label: 'Skills' },
                  { id: 'journey', label: 'Journey' },
                  { id: 'about', label: 'About & Contact' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`pop-btn shrink-0 rounded-full px-4 py-1.5 text-xs font-extrabold sm:text-sm ${
                    tab === t.id
                      ? 'bg-sunny-500 text-ink-900'
                      : 'bg-cream-50 text-ink-800 hover:bg-cream-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'projects' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <article
                      key={p.id}
                      className="flex flex-col overflow-hidden rounded-2xl border-2 border-ink-900 bg-cream-50 shadow-pop-sm"
                    >
                      <button
                        type="button"
                        onClick={() => onInspectProject(p)}
                        className="group relative aspect-video w-full overflow-hidden border-b-2 border-ink-900 bg-ink-900 text-left"
                      >
                        <img
                          src={p.image}
                          alt={p.shortTitle}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {p.driveInFeatured && (
                          <span className="absolute left-2 top-2 rounded-full border border-ink-900 bg-sunny-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-ink-900">
                            In 3D World
                          </span>
                        )}
                      </button>

                      <div className="flex flex-1 flex-col p-3.5">
                        <h3 className="font-display text-lg font-bold text-cobalt-600">
                          {p.shortTitle}
                        </h3>
                        <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-800">
                          {p.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-ink-900 bg-cream-200 px-2 py-0.5 text-[10px] font-bold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2 pt-2">
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pop-btn inline-flex items-center gap-1 rounded-full bg-sunny-500 px-3 py-1 text-xs font-extrabold text-ink-900"
                            >
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              <span>Live</span>
                            </a>
                          )}
                          {p.githubUrl && (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pop-btn inline-flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1 text-xs font-extrabold text-cobalt-600"
                            >
                              <Github className="h-3 w-3" aria-hidden="true" />
                              <span>Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {tab === 'skills' && (
                <div className="space-y-4">
                  {skillCategories.map((cat) => (
                    <section
                      key={cat.title}
                      className="rounded-2xl border-2 border-ink-900 bg-cream-50 p-4 shadow-pop-sm"
                    >
                      <h3 className="font-display text-lg font-bold text-cobalt-600">
                        {cat.title}
                      </h3>
                      <p className="text-xs font-medium text-ink-800/80">{cat.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-full border-2 border-ink-900 bg-cream-100 px-3 py-1 text-xs font-extrabold text-ink-900"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {tab === 'journey' && (
                <div className="space-y-4">
                  {timelineEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border-2 border-ink-900 bg-cream-50 p-4 shadow-pop-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full border border-ink-900 bg-sunny-500 px-2.5 py-0.5 text-[11px] font-extrabold">
                          {entry.startDate}
                          {entry.endDate ? ` – ${entry.endDate}` : ''}
                        </span>
                        <span className="text-xs font-bold text-ink-800/75">
                          {entry.location}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold text-cobalt-600">
                        {entry.title}
                      </h3>
                      <p className="text-xs font-extrabold text-coral-500">
                        {entry.organization}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-ink-800 sm:text-sm">
                        {entry.description}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              {tab === 'about' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-ink-900 bg-cream-50 p-5 shadow-pop-sm">
                    <h3 className="font-display text-2xl font-bold text-cobalt-600">
                      About Haris
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-800">
                      {personalInfo.bio}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-ink-900">
                      <span className="inline-flex items-center gap-1 rounded-full border border-ink-900 bg-sunny-500 px-3 py-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {personalInfo.location}
                      </span>
                      <span className="rounded-full border border-ink-900 bg-cream-200 px-3 py-1">
                        {personalInfo.university.name} · CGPA {personalInfo.university.cgpa}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="pop-btn inline-flex items-center gap-2 rounded-full bg-sunny-500 px-5 py-2.5 font-display text-sm font-bold text-ink-900"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span>{personalInfo.email}</span>
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
              )}
            </div>

            <div className="checker-ribbon h-3.5 w-full border-t-2 border-ink-900" />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
