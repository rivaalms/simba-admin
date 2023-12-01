export default defineNuxtRouteMiddleware((to, from) => {
   const authStore = useAuthStore()

   if (to.name !== 'login' && !authStore.isLoggedIn)
   {
      authStore.$reset()
      if (localStorage.getItem('user')) localStorage.removeItem('user')
      if (localStorage.getItem('token')) localStorage.removeItem('token')
      return navigateTo('/login')
   }
   else if (to.name === 'login' && authStore.isLoggedIn) return navigateTo('/')
})