import { login as $login, logout as $logout } from '@/utils/apis/auth'

type State = {
   user: Model.User | null
   token: string | null
}

export const useAuthStore = defineStore('auth', {
   persist: true,

   state: () : State => ({
      user: null,
      token: null
   }),

   getters: {
      getUser: (state) => state.user,
      getToken: (state) => state.token,
      isLoggedIn: (state) => state.token ? true : false
   },

   actions: {
      async login(payload: API.Request.Login) {
         await $login(payload)
            .then(resp => {
               this.user = resp.user
               this.token = resp.token
               localStorage.setItem('user', JSON.stringify(resp.user))
               localStorage.setItem('token', JSON.stringify(resp.token))
            })
      },

      async logout() {
         await $logout()
            .then(() => {
               localStorage.removeItem('user')
               localStorage.removeItem('token')
            })
      }
   }
})