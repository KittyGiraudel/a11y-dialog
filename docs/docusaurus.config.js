module.exports = {
  title: 'a11y-dialog',
  tagline:
    'A tiny script to make dialog windows accessible to assistive technology users.',
  organizationName: 'HugoGiraudel',
  projectName: 'a11y-dialog',
  url: 'https://a11y-dialog.netlify.app',
  baseUrl: '/',
  favicon: 'img/faviron.png',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  themeConfig: {
    navbar: {
      title: 'a11y-dialog',
      items: [
        {
          href: 'https://twitter.com/HugoGiraudel',
          label: 'Twitter',
          position: 'right',
        },
        {
          href: 'https://github.com/HugoGiraudel/a11y-dialog',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Kitty Giraudel. Built with Docusaurus.`,
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/HugoGiraudel/a11y-dialog/edit/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
