// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fitness Tracker',
  tagline: 'React Native library for Google Fit and HealthKit integration via single API',
  url: 'https://kilohealth.github.io',
  baseUrl: '/rn-fitness-tracker/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kilohealth', // Usually your GitHub org/user name.
  projectName: 'rn-fitness-tracker', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',

      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-typedoc',

      {
        name: 'FitnessTracker',

        entryPoints: ['../src'],
        tsconfig: '../tsconfig.json',
        excludePrivate: true,
        excludeProtected: true,
        excludeExternals: true,
        excludeInternal: true,
        readme: 'none',
        sidebar: {
          indexLabel: 'Overview',
          categoryLabel: 'API Reference',
          position: 2,
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Fitness Tracker',
        logo: {
          alt: 'Fitness Tracker Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo_white.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'fundamentals/getting-started',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/kilohealth/rn-fitness-tracker',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/fundamentals/getting-started',
              },
            ],
          },
          {
            title: 'Built with',
            items: [
              {
                label: 'Docusaurus',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
