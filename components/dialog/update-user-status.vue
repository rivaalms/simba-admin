<template>
   <div class="">
      {{ isActivate ? 'Aktifkan' : 'Nonaktfikan' }} Pengguna?
   </div>
   <div class="mt-6 flex items-center justify-end gap-2">
      <u-button
         color="gray"
         variant="ghost"
         icon="i-heroicons-arrow-uturn-left"
         :disabled="loading"
         @click.stop="store.clearDialog()"
      >
         Batal
      </u-button>
      <u-button
         :color="isActivate ? 'emerald' : 'red'"
         :icon="isActivate ? 'i-heroicons-check' : 'i-heroicons-no-symbol'"
         :loading="loading"
         @click.stop="submit"
      >
         {{ isActivate ? 'Aktifkan' : 'Nonaktfikan'}}
      </u-button>
   </div>
</template>

<script setup lang="ts">
const store = useAppStore()
const loading : Ref <boolean> = ref(false)
const isActivate : ComputedRef <boolean> = computed(() => !store.dialog.id.includes('deactivate'))
const user : ComputedRef <Model.School | Model.Supervisor | Model.Officer> = computed(() => store.dialog.data)

const submit = async () => {
   loading.value = true
   const userId = user.value.user?.id as number

   try {
      const message = isActivate.value ? await activateUser(userId) : await deactivateUser(userId)

      store.notify('info', message, 'update-user-status')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   } catch (error: unknown) {
      return
   } finally {
      loading.value = false
   }
}
</script>