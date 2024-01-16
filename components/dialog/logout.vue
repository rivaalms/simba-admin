<template>
   <div class="">
      Anda yakin ingin log out?
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
         color="red"
         icon="i-heroicons-arrow-left-on-rectangle"
         :loading="loading"
         @click.stop="logout"
      >
         Log Out
      </u-button>
   </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const store = useAppStore()
const loading : Ref <boolean> = ref(false)

const logout = async () => {
   loading.value = true
   await authStore.logout()
      .then(() => {
         store.notify('info', 'Log out berhasil')
         store.clearDialog()
         navigateTo('/login')
      })
      .catch((e: any) => {
         store.notify('error', e)
      })
      .finally(() => loading.value = false)
}
</script>