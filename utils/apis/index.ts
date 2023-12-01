export const $api = async (url: string, opts?: any) : Promise <unknown> => {
   const data = await $fetch (url, {
      baseURL: useRuntimeConfig().public.apiBaseUrl as string,
      ...opts,

      async onRequest({ options }: any) {
         const headers : { [key: string]: any } = {
            ...options.headers,
            Accept: 'application/json',
         }
         if (useAuthStore().isLoggedIn) {
            headers.Authorization = `Bearer ${useAuthStore().getToken}`
         }
         options.headers = headers
      },

      async onRequestError({ error }: any) {
         useAppStore().notify('error', `${error.message}`, 'api-request-error')
      },

      async onResponse({ response }: any) {
         return response._data
      },

      async onResponseError({ response }: any) {
         const { status, _data } = response

         if (status === 403) {
            useAppStore().notify('error', 'Akses tidak diizinkan', 'api-response-error')
            throw Error(`${status}: Forbidden`)
         }

         const message = `${status}: ${_data?.message}`
         useAppStore().notify('error', message, 'api-response-error')

         if (status === 401) {
            useAuthStore().$reset()
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            navigateTo('/login')
         }

         throw Error(message)
      }
   })

   return data
}