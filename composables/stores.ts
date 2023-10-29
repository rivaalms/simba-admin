import type { NotificationColor } from "@nuxt/ui/dist/runtime/types"

export const useAppStore = defineStore('app', {
   persist: true,

   state: () : State.App => ({
      pageTitle: ''
   }),

   getters: {
      getPageTitle: (state) => state.pageTitle
   },

   actions: {
      notify(type: 'success' | 'error' | 'info', message: string, id?: string) {
         const typeConfig = {
            success: { title: 'Success', color: 'green', icon: 'i-heroicons-check-circle' },
            error: { title: 'Error', color: 'red', icon: 'i-heroicons-exclamation-circle' },
            info: { title: 'Info', color: 'sky', icon: 'i-heroicons-information-circle' },
         };

         const { title, color, icon } = typeConfig[type] || {};

         if (title) {
            useToast().add({
               id,
               title,
               description: message,
               color: color as NotificationColor,
               icon,
            });
         }
      }
   }
})

export const useAuthStore = defineStore('auth', {
   persist: true,

   state: () : State.Auth => ({
      user: null,
      token: null
   }),

   getters: {
      getUser: (state) => state.user,
      getToken: (state) : string | null => state.token,
      isLoggedIn: (state) : boolean => state.token ? true : false
   },

   actions: {
      async login(payload: API.Request.Login) {
         await useLogin(payload)
            .then(resp => {
               this.user = resp.user
               this.token = resp.token
               localStorage.setItem('user', JSON.stringify(resp.user))
               localStorage.setItem('token', JSON.stringify(resp.token))
            })
      },

      async logout() {
         await useLogout()
            .then(() => {
               localStorage.removeItem('user')
               localStorage.removeItem('token')
            })
      }
   }
})

namespace State {
   export type App = {
      pageTitle: string
   }

   export type Auth = {
      user: Model.User | null
      token: string | null
   }
}