'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github, X } from 'lucide-react'
import type { Project } from '@/data/projects'

interface ProjectWindowModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectWindowModal({ project, onClose }: ProjectWindowModalProps) {
  const [imageIdx, setImageIdx] = useState(0)

  useEffect(() => {
    setImageIdx(0)
  }, [project?.id])

  useEffect(() => {
    if (!project) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [project, onClose])

  const gallery = project?.images?.length ? project.images : project ? [project.image] : []
  const currentImg = gallery[imageIdx] ?? project?.image

  return (
    <AnimatePresence>
      {project && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-900/55 backdrop-blur-xs"
          />

          {/* Retro OS Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-ink-900 bg-cream-100 shadow-pop-lg"
          >
            {/* Retro Window Titlebar */}
            <div className="flex items-center justify-between border-b-2 border-ink-900 bg-cobalt-600 px-4 py-3 text-cream-50">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-coral-500" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-sunny-500" />
                <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-cream-100" />
                <span className="ml-2 font-display text-sm font-bold tracking-wide sm:text-base">
                  {project.shortTitle}.app — {project.category}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project window"
                className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-ink-900 bg-cream-100 text-ink-900 hover:bg-sunny-500"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-5 sm:p-6">
              {/* Screenshot Stage */}
              {currentImg && (
                <div className="overflow-hidden rounded-2xl border-2 border-ink-900 bg-ink-900 shadow-pop-sm">
                  <img
                    src={currentImg}
                    alt={`${project.shortTitle} screenshot`}
                    className="aspect-video w-full object-cover"
                  />
                </div>
              )}

              {gallery.length > 1 && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  {gallery.map((src, idx) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setImageIdx(idx)}
                      className={`h-2.5 rounded-full border border-ink-900 transition-all ${
                        idx === imageIdx ? 'w-7 bg-cobalt-600' : 'w-2.5 bg-cream-200'
                      }`}
                      aria-label={`View screenshot ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-start justify-between gap-2">
                <h2
                  id="project-modal-title"
                  className="font-display text-2xl font-bold text-cobalt-600 sm:text-3xl"
                >
                  {project.title}
                </h2>
                <span className="rounded-full border-2 border-ink-900 bg-sunny-500 px-3 py-0.5 text-xs font-extrabold text-ink-900">
                  {project.period}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-ink-800 sm:text-base">
                {project.longDescription}
              </p>

              {/* Tech Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border-2 border-ink-900 bg-cream-50 px-3 py-1 text-xs font-bold text-ink-900"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pop-btn inline-flex items-center gap-2 rounded-full bg-sunny-500 px-5 py-2.5 font-display text-sm font-bold text-ink-900 sm:text-base"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span>Launch Live Website</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pop-btn inline-flex items-center gap-2 rounded-full bg-cream-50 px-5 py-2.5 font-display text-sm font-bold text-cobalt-600 sm:text-base"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    <span>View Source Code</span>
                  </a>
                )}
              </div>
            </div>

            {/* Playful Checkered Footer Ribbon */}
            <div className="checker-ribbon h-3.5 w-full border-t-2 border-ink-900" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
