import { ofetch } from 'ofetch'

export default defineNuxtPlugin(nuxtApp => {
   const authStore = useAuthStore()
   const apiUrl = useRuntimeConfig().public.apiBaseUrl

   globalThis.$fetch = ofetch.create({
      baseURL: `${apiUrl}`,

      async onRequest({ options, error }) {
         const headers : { [key: string] : any } = {
            ...options.headers,
            Accept: 'application/json',
            UserableType: null,
         }

         if (authStore.isLoggedIn) {
            headers.Authorization = `Bearer ${authStore.getToken}`
         }

         options.headers = headers

         if (error) throw error
      },

      async onRequestError({ error }) {
         throw error
      },

      async onResponse({ response, error }) {
         if (error) throw error
         return response._data
      },

      async onResponseError({ response }) {
         if (response.status == 401) {
            authStore.$reset()
            if (localStorage.getItem('user')) localStorage.removeItem('user')
            navigateTo('/login')
         }
      }
   })
})