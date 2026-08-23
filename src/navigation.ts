import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Services',
      href: getPermalink('/#services'),
    },
    //    {
    //      text: 'Testimonials',
    //      href: getPermalink('/#testimonials'),
    //    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
  ],
  actions: [
    {
      text: 'Book a call',
      href: getPermalink('/book-exploratory-call'),
      // The booking page embeds a third-party scheduling widget whose scripts
      // are unreliable when swapped in via Astro's client-side view
      // transitions — force a full page load so they run cleanly every time.
      'data-astro-reload': true,
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Services',
      links: [{ text: 'Services', href: getPermalink('/#services') }],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '/blog' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    Made by Markus Smet · All rights reserved.
  `,
};
