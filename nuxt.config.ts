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

   imports: {
      dirs: [
         'composables',
         'composables/**',
         'utils',
         'utils/**'
      ]
   },

   css: [
      '~/assets/css/base.css'
   ],

   modules: [
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      '@nuxt/ui',
      'dayjs-nuxt',
   ],

   build: {
      transpile: [
         '@vuepic/vue-datepicker'
      ]
   },

   postcss: {
      plugins: {
         'postcss-import': {},
         'tailwindcss/nesting': {},
         tailwindcss: {},
         autoprefixer: {},
      },
   },

   ui: {
      global: true,
      safelistColors: [
         'blue',
         'gray',
         'zinc',
         'red',
         'amber',
         'green',
         'emerald',
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
   },

   vite: {
      define: {
         'process.env.DEBUG': false
      }
   }
})
