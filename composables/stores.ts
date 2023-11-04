import type { NotificationColor } from "@nuxt/ui/dist/runtime/types"

namespace State {
   export type Callback = (() => void) | (() => Promise <void>)
   export type App = {
      pageTitle: string,
      dialog: {
         id: string
         show: boolean
         title: string
         data?: any
         callback?: Callback
      }
   }

   export type Auth = {
      user: Model.User | null
      token: string | null
   }
}

export const useAppStore = defineStore('app', {
   persist: true,

   state: () : State.App => ({
      pageTitle: '',
      dialog: {
         id: '',
         show: false,
         title: '',
         data: null,
         callback: () => {}
      }
   }),

   getters: {
      getPageTitle: (state) => state.pageTitle
   },

   actions: {
      showDialog(id: string, title: string, data?: any, callback?: State.Callback) {
         this.dialog = {
            id,
            title,
            data,
            callback,
            show: true
         }
      },

      clearDialog() {
         this.dialog.show = false
         setTimeout(() => {
            this.dialog = {
               id: '',
               show: false,
               title: '',
               data: null,
               callback: () => {}
            }
         }, 300)
      },

      notify(type: 'success' | 'error' | 'info', message: string, id?: string) {
         const typeConfig = {
            success: { title: 'Success', color: 'emerald', icon: 'i-heroicons-check-circle' },
            error: { title: 'Error', color: 'red', icon: 'i-heroicons-exclamation-circle' },
            info: { title: 'Info', color: 'cyan', icon: 'i-heroicons-information-circle' },
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