import type { NotificationColor } from "@nuxt/ui/dist/runtime/types"

type State = {
   pageTitle: string
   dialog: {
      id: string
      show: boolean
      title: string
      data?: any
      callback?: (() => any)
   }
}

export const useAppStore = defineStore('app', {
   persist: true,

   state: () : State => ({
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
      showDialog(id: string, title: string, data?: any, callback?: (() => any)) {
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