const pkg = require('./package')

module.exports = {
  mode: 'spa',
  head: {
    
    title: 'Kompis App',
    // meta: [{
    //     charset: 'utf-8'
    //   },
    //   {
    //     hid: 'viewport',
    //     name: 'viewport',
    //     content: 'width=device-width, initial-scale=1'
    //   },
    //
    //   {
    //     hid: 'description',
    //     name: 'description',
    //     content: pkg.description
    //   },
    //
    // ],
  },

  /*
   ** Customize the progress-bar color
   */

  loading: {
    color: '#1dca7f',
    height: '5px'
  },

  /*
   ** Global CSS
   */
  /*
    css: [
      '~assets/css/landing.css',
      '~assets/css/app.css'
    ],

  */
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/amplify',
    '~plugins/mixpanel',
    '~plugins/functions',
    '~plugins/bugsnag',
    '~plugins/vue-awesome',
    '~plugins/vue2-notify',
    '~/plugins/sw.js'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    ['nuxt-i18n', {
      locales: [{
          code: 'en',
          file: 'en-US.js'
        },
        {
          code: 'no',
          file: 'no-NO.js'
        }
      ],
      lazy: true,
      langDir: 'lang/',
      defaultLocale: 'no',
      detectBrowserLanguage: false,
      seo: false

    }],
    '@nuxtjs/pwa',
    '@nuxtjs/component-cache',
    'nuxt-device-detect',
    // '@nuxtjs/onesignal',

  ],

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  env: {
    stage: 'dev', // set 'prod' for production
    cdn: {
      URL: 'https://cdn.kompis.app/public/'
    },
    s3: {
      REGION: "eu-central-1",
      BUCKET: "kompis-app-uploads"
    },
    apiGateway: {
      REGION: "eu-central-1",
      PROD_URL: "https://api.kompis.app",
      DEV_URL: "https://devapi.kompis.app"
    },
    cognito: {
      PROD_USER_POOL_ID: "eu-central-1_E1nLfop0C",
      PROD_APP_CLIENT_ID: "7ddj4d97lb470a08e88skqs5h9",
      PROD_REGION: 'eu-central-1',
      PROD_IDENTITY_POOL_ID: "eu-central-1:141ab8a7-0c79-4ff9-97de-f00d98b63951",
      DEV_USER_POOL_ID: "eu-central-1_o36r1nMGj",
      DEV_APP_CLIENT_ID: "2mrcjrkfm6lpbche4vo3j45psj",
      DEV_REGION: 'eu-central-1',
      DEV_IDENTITY_POOL_ID: "eu-central-1:19c56d86-9419-4f33-93ac-18de6803d4a4"
    },
    mixpanel: {
      DEV_API_KEY: '165522265841f5a9416c958c05003970',
      PROD_API_KEY: 'c141fdcf262b3c12bfd7a6946f203fab',
    },
    bugsnag: {
      API_KEY: 'fd490dc0489374329842ddd3b0b568d7'
    }
  },

  // only for prod mode = npm run build && npm run start
  /*
   ** Build configuration
   */
  build: {
    vendor: [
      'aws-amplify'
    ],
    hardSource: process.env.NODE_ENV === 'development',
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            enforce: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
  },

  workbox: {
    globPatterns: ['**/*.{js,css}', '**/img/*'],
    offline: true,
    cachingExtensions: '@/plugins/workbox-range-request.js',
    offlinePage: '/404.html',
    offlineAssets: ['/index.html'],
    runtimeCaching: [
      {
        urlPattern: 'https://api.kompis.app/.*',
        handler: 'staleWhileRevalidate',
        strategyOptions: {
          cacheName: 'data_kompips',
          cacheExpiration: {
            maxEntries: 200,
            maxAgeSeconds: 3600 * 24 * 3
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: 'https://devapi.kompis.app/.*',
        handler: 'staleWhileRevalidate',
        strategyOptions: {
          cacheName: 'data_dev_kompis',
          cacheExpiration: {
            maxEntries: 200,
            maxAgeSeconds: 3600 * 24 * 3
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: 'https://cdn.kompis.app/public/.*',
        handler: 'staleWhileRevalidate',
        strategyOptions: {
          cacheName: 'data_kompis_app',
          cacheExpiration: {
            maxEntries: 200,
            maxAgeSeconds: 3600 * 24 * 3
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
    ]
  },

  generate: {
    fallback: true
  },

  manifest: {
    // name: 'Kompis Shop App',
    // short_name: 'Shop App',
    display: "standalone",
    theme_color: "#673ab6",
    background_color: "#111111",
    prefer_related_applications: true,
  },


}
