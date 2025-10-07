import { Metadata } from 'next'
import { PERSONAL } from './data'

export const siteConfig = {
  name: PERSONAL.name,
  description:
    'Computer Science student at Carleton University specializing in AI & Machine Learning. Passionate about building modern web applications, machine learning, and cybersecurity.',
  url: 'https://mohamedazab.com', // Update with your actual domain
  ogImage: '/og-image.jpg', // Create this image
  links: {
    github: PERSONAL.github,
    linkedin: PERSONAL.linkedin,
  },
}

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
} = {}): Metadata {
  const metaTitle = title ? `${title} | ${PERSONAL.name}` : PERSONAL.name
  const metaDescription = description || siteConfig.description
  const metaImage = image || siteConfig.ogImage

  return {
    title: metaTitle,
    description: metaDescription,
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.svg', sizes: 'any' }
      ],
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
    keywords: [
      'Mohamed Azab',
      'Web Developer',
      'Full Stack Developer',
      'AI',
      'Machine Learning',
      'Cybersecurity',
      'Next.js',
      'React',
      'TypeScript',
      'Carleton University',
    ],
    authors: [{ name: PERSONAL.name }],
    creator: PERSONAL.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSONAL.name,
    email: PERSONAL.email,
    url: siteConfig.url,
    jobTitle: 'Computer Science Student & Web Developer',
    affiliation: {
      '@type': 'EducationalOrganization',
      name: PERSONAL.university,
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: PERSONAL.university,
    },
    sameAs: [PERSONAL.github, PERSONAL.linkedin],
  }
}

export function generateProjectSchema(project: {
  name: string
  description: string
  url?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description,
    url: project.url,
    image: project.image,
    author: {
      '@type': 'Person',
      name: PERSONAL.name,
    },
  }
}

