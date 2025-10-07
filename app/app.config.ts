export default defineAppConfig({
  global: {
    picture: {
      dark: '/images/IMG_0499.jpeg',
      light: '/images/IMG_0499.jpeg',
      alt: 'My profile picture'
    },
    meetingLink: 'https://calendly.com/viana-kalversberg-7y0/30min',
    email: 'viana@kalversberg.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Built with Nuxt • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [ {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/viana-kalversberg/',
      'target': '_blank',
      'aria-label': 'Viana on LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/viana-codes',
      'target': '_blank',
      'aria-label': 'Viana on GitHub'
    }]
  }
})
