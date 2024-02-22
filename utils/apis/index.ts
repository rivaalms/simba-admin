type Options = {
   method: 'get' | 'post' | 'put' | 'delete' | 'GET' | 'POST' | 'PUT' | 'DELETE',
   headers?: Wildcard,
   params?: Wildcard,
   query?: Wildcard,
   body?: Wildcard
}

export const $api = async <T> (url: string, opts?: Options) : Promise <T> => {
   const data = await $fetch <T> (url, {
      baseURL: useRuntimeConfig().public.apiBaseUrl as string,
      ...opts,

      async onRequest({ options }) {
         const headers : Wildcard = {
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

      async onResponseError({ response }) {
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

         useAppStore().notify('error', `${status}: ${_data.message}`)
      }
   })

   return data
}