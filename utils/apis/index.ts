import type { UseFetchOptions } from "nuxt/app"

export const $api = async (url: string, opts?: UseFetchOptions<any>) : Promise <unknown> => {
   const { data, error } = await useFetch(url, {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      ...opts,

      async onRequest({ options }) {
         const headers : { [key: string]: any } = {
            ...options.headers,
            Accept: 'application/json',
         }
         if (useAuthStore().isLoggedIn) {
            headers.Authorization = `Bearer ${useAuthStore().getToken}`
         }
         options.headers = headers
      },

      async onRequestError({ error }) {
         useAppStore().notify('error', `${error.message}`, 'api-request-error')
      },

      async onResponse({ response }) {
         return response._data
      },
   })

   if (error.value) {
      const { statusCode, data } = error.value

      if (statusCode === 403) {
         useAppStore().notify('error', 'Akses tidak diizinkan', 'api-response-error')
         return
      }

      const message = `${statusCode}: ${data?.message}`
      useAppStore().notify('error', message, 'api-response-error')

      if (statusCode === 401) {
         useAuthStore().$reset()
         localStorage.removeItem('user')
         localStorage.removeItem('token')
         return navigateTo('/login')
      }
   }

   return data.value
}