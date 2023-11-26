<template>
<u-form
   :schema="validator"
   :state="state"
   :validate-on="['submit']"
   @submit="submit"
>
   <div class="grid grid-cols-3 gap-4">
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
         label="Email"
         name="email"
         required
      >
         <u-input
            v-model="(state.email as string)"
            :disabled="loading"
            type="email"
         ></u-input>
      </u-form-group>

      <u-form-group
         label="NIP"
         name="employee_number"
         required
      >
         <u-input
            v-model="(state.employee_number as string)"
            :disabled="loading"
            @keypress="validateNumber"
         ></u-input>
      </u-form-group>

      <template v-if="store.dialog.id.includes('create')">
         <u-form-group
            label="Kata Sandi"
            name="password"
            required
         >
            <u-input
               v-model="(state.password as string)"
               :disabled="loading"
               :type="showPassword ? 'text' : 'password'"
            ></u-input>
         </u-form-group>

         <u-form-group
            label="Konfirmasi Kata Sandi"
            name="confirm_password"
            required
         >
            <u-input
               v-model="(state.confirm_password as string)"
               :disabled="loading"
               :type="showPassword ? 'text' : 'password'"
            ></u-input>
         </u-form-group>
      </template>
   </div>

   <div
      :class="{
         'justify-end': store.dialog.id.includes('edit'),
         'justify-between': store.dialog.id.includes('create')
      }"
      class="mt-6 flex items-center gap-2"
   >
      <div
         v-if="store.dialog.id.includes('create')"
         class="flex items-center"
      >
         <u-checkbox
            v-model="showPassword"
            label="Tampilkan kata sandi"
         ></u-checkbox>
      </div>

      <div class="flex items-center justify-end gap-2">
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
   </div>
</u-form>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const store = useAppStore()
const loading : Ref <boolean> = ref(false)
const showPassword : Ref <boolean> = ref(false)
const state : Ref <API.Request.Form.Officer> = ref({
   name: store.dialog.data?.user.name || null,
   email: store.dialog.data?.user.email || null,
   employee_number: store.dialog.data?.employee_number || null,
   password: null,
   confirm_password: null,
})

const validator = yup.object({
   isCreate: yup.boolean().default(store.dialog.id.includes('create')),
   name: yup.string().required('Nama harus diisi'),
   email: yup.string().email('Email tidak valid').required('Email harus diisi'),
   employee_number: yup.number().typeError('NIP harus berupa angka').required('NIP harus diisi'),
   password: yup.string().when('isCreate', {
      is: true,
      then: (schema) => schema.required('Kata sandi harus diisi').min(8, 'Kata sandi harus berisi minimal ${min} karakter'),
      otherwise: (schema) => schema.notRequired()
   }),
   confirm_password: yup.string().when('isCreate', {
      is: true,
      then: (schema) => schema.required('Konfirmasi kata sandi harus diisi').test('is-match-password', () => 'Konfirmasi kata sandi tidak cocok', (value) => {
         if (value === state.value.password) return true
         return false
      }),
      otherwise: (schema) => schema.notRequired()
   }),
})

const submit = async () => {
   loading.value = false
   try {
      const createMode = store.dialog.id.includes('create')
      const editMode = store.dialog.id.includes('edit')

      if (createMode) await createOfficer(state.value)
      else if (editMode) await updateOfficer(store.dialog.data.id, state.value)
      else return

      const message = createMode ? 'Diknas baru berhasil disimpan' : 'Diknas berhasil diperbarui'
      store.notify('success', message, 'officer-form')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   } catch (e: unknown) {
      const error = e as API.Error
      store.notify('error', `${error.response?._data?.message || error}`, 'officer-error')
   } finally {
      loading.value = false
   }
}
</script>