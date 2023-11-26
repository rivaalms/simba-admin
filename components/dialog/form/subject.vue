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

      <u-form-group
         label="Singkatan"
         name="abbreviation"
         required
      >
         <u-input
            v-model="(state.abbreviation as string)"
            :disabled="loading"
         ></u-input>
      </u-form-group>
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
const state : Ref <API.Request.Form.Subject> = ref({
   name: store.dialog.data?.name || null,
   abbreviation: store.dialog.data?.abbreviation || null
})
const validator = yup.object({
   name: yup.string().required('Nama harus diisi'),
   abbreviation: yup.string().required('Singkatan harus diisi')
})

const submit = async () => {
   loading.value = true
   const isCreate = store.dialog.id.includes('create')
   try {
      if (isCreate) await createSubject(state.value)
      else await updateSubject(store.dialog.data.id, state.value)

      const message = isCreate ? 'Mata pelajaran baru berhasil disimpan' : 'Mata pelajaran berhasil diperbarui'
      store.notify('success', message, 'subject-form')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   } catch (_e: unknown) {
      const e = _e as API.Error
      store.notify('error', `${e.response?._data?.message || e}`)
   } finally {
      loading.value = false
   }
}
</script>