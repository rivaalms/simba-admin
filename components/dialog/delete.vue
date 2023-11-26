<template>
<div class="">
   Anda yakin ingin menghapus data?
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
      icon="i-heroicons-trash"
      :loading="loading"
      @click.stop="submit"
   >
      Hapus
   </u-button>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()
const loading : Ref <boolean> = ref(false)
const type : ComputedRef <string> = computed(() => store.dialog.id.split('-delete').shift() || '')

const submit = async () => {
   loading.value = true
   try {
      switch (type.value) {
         case 'data':
            await deleteData(store.dialog.data.id)
            break
         case 'school':
            await deleteSchool(store.dialog.data.id)
            break
         case 'supervisor':
            await deleteSupervisor(store.dialog.data.id)
            break
         case 'officer':
            await deleteOfficer(store.dialog.data.id)
            break
         case 'data-status':
            await deleteDataStatus(store.dialog.data.id)
            break
         case 'data-category':
            await deleteDataCategory(store.dialog.data.id)
            break
         case 'data-type':
            await deleteDataType(store.dialog.data.id)
            break
         case 'school-type':
            await deleteSchoolType(store.dialog.data.id)
            break
         default:
            throw new Error('Undefined delete type')
      }

   store.notify('info', 'Data berhasil dihapus', 'delete-success')
   if (store.dialog.callback) store.dialog.callback()
   store.clearDialog()
   } catch (e: unknown) {
      const error = e as API.Error
      store.notify('error', `${error.response?._data?.message || error}`, 'delete-error')
   } finally {
      loading.value = false
   }
}
</script>