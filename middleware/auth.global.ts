export default defineNuxtRouteMiddleware((to, from) => {
   const authStore = useAuthStore()

   if (to.name !== 'login' && !authStore.isLoggedIn) return navigateTo('/login')
   else if (to.name === 'login' && authStore.isLoggedIn) return navigateTo('/')
})