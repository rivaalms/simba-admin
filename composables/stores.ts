export const useAppStore = defineStore('app', {
   persist: true,

   state: () : State.App => ({
      pageTitle: ''
   }),

   getters: {
      getPageTitle: (state) => state.pageTitle
   },

   actions: {

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