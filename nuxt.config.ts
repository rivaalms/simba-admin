// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   devtools: {
      enabled: true
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
      locales: [ 'id', 'en' ],
      defaultLocale: 'id',
      defaultTimezone: 'Asia/Jakarta'
   }
})
