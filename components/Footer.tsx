'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      className="border-t border-light-bg-secondary bg-light-bg-secondary py-8 text-center dark:border-dark-bg-secondary dark:bg-dark-bg-secondary"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm text-light-text/60 dark:text-dark-text/60">
          © 2025 Mohamed Azab
        </p>
        <p className="mt-2 text-sm text-light-text/60 dark:text-dark-text/60">
          Designed and developed with passion 💜
        </p>
      </div>
    </motion.footer>
  )
}
