<template>
   <u-form
      :schema="validator"
      :state="state"
      :validate-on="['submit']"
      @submit="submit"
   >
      <div class="grid gap-4">
         <u-form-group
            label="Nama"
            name="name"
            required
         >
            <u-input
               v-model="(state.name as string)"
               :disabled="loading"
            ></u-input>
         </u-form-group>
      </div>

      <div class="flex items-center justify-end gap-2 mt-6">
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
            color="emerald"
            icon="i-heroicons-check"
            :loading="loading"
            type="submit"
         >
            Simpan
         </u-button>
      </div>
   </u-form>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const store = useAppStore()
const loading : Ref <boolean> = ref(false)
const state : Ref <API.Request.Form.DataStatus> = ref({
   name: store.dialog.data?.name || null
})

const validator = yup.object({
   name: yup.string().required('Nama harus diisi')
})

const submit = async () => {
   loading.value = true
   const isCreate = store.dialog.id.includes('create')
   try {
      if (isCreate) await createDataStatus(state.value)
      else await updateDataStatus((store.dialog.data!.id as number), state.value)

      const message = isCreate ? 'Status data baru berhasil disimpan' : 'Status data berhasil diperbarui'
      store.notify('success', message, 'data-status-form')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   } catch (e: unknown) {
      const error = e as API.Error
      store.notify('error', `${error.response?._data?.message || error}`, 'data-status-error')
   } finally {
      loading.value = false
   }
}
</script>