'use client'

import { motion } from 'framer-motion'
import { PERSONAL } from '@/lib/data'
import Section from './Section'

const contactMethods = [
  {
    name: 'Email',
    value: PERSONAL.email,
    href: `mailto:${PERSONAL.email}`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
    description: 'Send me an email',
  },
  {
    name: 'GitHub',
    value: 'mohazab2006',
    href: PERSONAL.github,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    description: 'Check out my code',
  },
  {
    name: 'LinkedIn',
    value: 'mohamedazabca',
    href: PERSONAL.linkedin,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-8 w-8"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    description: 'Connect with me',
  },
]

export default function Contact() {
  return (
    <Section
      id="contact"
      title="Get In Touch"
      subtitle="Let's connect and discuss opportunities"
      className="bg-light-bg-secondary dark:bg-transparent"
    >
      <div className="mx-auto max-w-4xl">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.name}
              href={method.href}
              target={method.name !== 'Email' ? '_blank' : undefined}
              rel={method.name !== 'Email' ? 'noopener noreferrer' : undefined}
              className="magnetic-button group relative overflow-hidden rounded-2xl bg-[#0F0F12]/80 backdrop-blur-xl p-8 text-center border border-white/5 transition-all duration-500 hover:border-dark-accent/40 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] light-highlight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              {/* Glossy sweep */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="mb-4 flex justify-center text-white transition-transform group-hover:scale-110 group-hover:text-dark-accent group-active:text-white">
                  {method.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-light-text dark:text-dark-text">
                  {method.name}
                </h3>
                <p className="mb-2 text-sm text-light-text/60 dark:text-dark-text/60">
                  {method.description}
                </p>
                <p className="font-mono text-sm text-white/70 group-hover:text-dark-accent">{method.value}</p>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/0 to-white/0 opacity-0 transition-all group-hover:from-dark-accent/10 group-hover:to-dark-accent/5 group-hover:opacity-100" />
            </motion.a>
          ))}
        </div>

        {/* Optional: Contact Form Placeholder */}
        {/* 
        <motion.div
          className="mt-16 rounded-2xl bg-light-bg p-8 dark:bg-dark-bg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="mb-6 text-2xl font-bold text-center text-light-text dark:text-dark-text">
            Send a Message
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-light-text dark:text-dark-text">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg bg-light-bg-secondary px-4 py-3 text-light-text dark:bg-dark-bg-secondary dark:text-dark-text"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-light-text dark:text-dark-text">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg bg-light-bg-secondary px-4 py-3 text-light-text dark:bg-dark-bg-secondary dark:text-dark-text"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-light-text dark:text-dark-text">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full rounded-lg bg-light-bg-secondary px-4 py-3 text-light-text dark:bg-dark-bg-secondary dark:text-dark-text"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              className="magnetic-button w-full rounded-lg bg-dark-accent px-6 py-3 font-medium text-black transition-all hover:bg-dark-accent/90"
            >
              Send Message
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-light-text/50 dark:text-dark-text/50">
            TODO: Connect to Supabase or email API
          </p>
        </motion.div>
        */}

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="mb-6 text-lg text-light-text/70 dark:text-dark-text/70">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part
            of your visions.
          </p>
          <motion.a
            href={`mailto:${PERSONAL.email}`}
            className="magnetic-button inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black shadow-lg shadow-white/10 transition-all hover:bg-dark-accent hover:text-black hover:shadow-dark-accent/20 active:bg-white active:text-black"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            Start a Conversation
          </motion.a>
        </motion.div>
      </div>
    </Section>
  )
}

