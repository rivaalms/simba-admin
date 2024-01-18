export default defineNuxtRouteMiddleware((to, from) => {
   const authStore = useAuthStore()
   const excludedRoute = [
      'login',
      'forgot-password',
      'reset-password'
   ]

   if (!excludedRoute.includes(to.name as string) && !authStore.isLoggedIn)
   {
      authStore.$reset()
      if (localStorage.getItem('user')) localStorage.removeItem('user')
      if (localStorage.getItem('token')) localStorage.removeItem('token')
      return navigateTo('/login')
   }
   else if (excludedRoute.includes(to.name as string) && authStore.isLoggedIn) return navigateTo('/')
})