// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   devtools: {
      enabled: true
   },

   app: {
      head: {
         titleTemplate: "%s | SIMBA Admin",
         htmlAttrs: {
            lang: "id",
         },
         meta: [
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: "" },
            { name: "format-detection", content: "telephone=no" },
            { charset: "utf-8" },
         ],
         link: [
            { rel: 'preconnect', href: 'ttps://fonts.bunny.net' },
            { rel: 'stylesheet', href: 'https://fonts.bunny.net/css?family=lato:100,100i,300,300i,400,400i,700,700i,900,900i' }
         ]
      },
   },

   ssr: false,

   devServer: {
      port: 9200
   },

   runtimeConfig: {
      public: {
         apiBaseUrl: '',
         appName: ''
      }
   },

   css: [
      '~/assets/css/base.css'
   ],

   modules: [
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      '@nuxt/ui',
      'dayjs-nuxt'
   ],

   postcss: {
      plugins: {
         tailwindcss: {},
         autoprefixer: {},
      },
   },

   ui: {
      safelistColors: [
         'blue',
         'gray',
         'zinc',
         'red',
         'amber',
         'green',
         'cyan',
      ],
   },

   colorMode: {
      preference: 'light'
   },

   dayjs: {
      locales: ['id', 'en'],
      plugins: ['relativeTime', 'utc', 'timezone'],
      defaultLocale: 'id',
      defaultTimezone: 'Asia/Jakarta'
   }
})
