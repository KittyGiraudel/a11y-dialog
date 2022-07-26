module.exports = {
  title: 'a11y-dialog',
  tagline:
    'A tiny script to make dialog windows accessible to assistive technology users.',
  organizationName: 'KittyGiraudel',
  projectName: 'a11y-dialog',
  url: 'https://a11y-dialog.netlify.app',
  baseUrl: '/',
  favicon: 'img/favicon.jpg',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: 'a11y-dialog',
      items: [
        {
          href: 'https://codesandbox.io/s/a11y-dialog-v7-pnwqu',
          label: 'Demo',
          position: 'right',
        },
        {
          href: 'https://github.com/KittyGiraudel/a11y-dialog',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
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
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/KittyGiraudel/a11y-dialog/edit/documentation/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
