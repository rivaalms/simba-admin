import type { UseFetchOptions } from "nuxt/app"

export const useAPI = async (url: string, opts?: UseFetchOptions<any>) : Promise <unknown> => {
   const { data } = await useFetch(url, {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      ...opts,
      async onRequest({ options, error }) {
         const headers : { [key: string]: any } = {
            ...options.headers,
            Accept: 'application/json',
            UserableType: null,
         }
         if (useAuthStore().isLoggedIn) {
            headers.Authorization = `Bearer ${useAuthStore().getToken}`
         }
         options.headers = headers
         if (error) throw error
      },
      async onRequestError({ error }) { throw error },
      async onResponse({ response, error }) {
         if (error) throw error
         return response._data
      },
      async onResponseError({ response }) {
         if (response.status === 401) {
            useAuthStore().$reset()
            if (localStorage.getItem('user')) localStorage.removeItem('user')
            if (localStorage.getItem('token')) localStorage.removeItem('token')
            navigateTo('/login')
         }
      }
   })
   return data.value
}