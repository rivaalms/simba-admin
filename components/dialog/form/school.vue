<template>
<u-form
   :schema="validator"
   :state="state"
   :validate-on="['submit']"
   @submit="submit"
>
   <div class="grid grid-cols-2 gap-4">
      <u-form-group
         label="Nama Sekolah"
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
         label="Tipe Sekolah"
         name="school_type_id"
         required
      >
         <u-select-menu
            v-model="(state.school_type_id as number)"
            :options="typeOptions"
            value-attribute="value"
            searchable
            :search-attributes="['label']"
            searchable-placeholder="Cari..."
            :disabled="loading"
         >
            <template #label>
               <template v-if="!state.school_type_id || typeOptions.length < 1">
                  <span class="text-gray-400">Pilih tipe sekolah...</span>
               </template>
               <template v-else>
                  {{ typeOptions.find(item => item.value === state.school_type_id)?.label }}
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Pengawas"
         name="supervisor_id"
         required
      >
         <u-select-menu
            v-model="(state.supervisor_id as number)"
            :options="supervisorOptions"
            value-attribute="value"
            searchable
            :search-attributes="['label']"
            searchable-placeholder="Cari..."
            :disabled="loading"
         >
            <template #label>
               <template v-if="!state.supervisor_id || supervisorOptions.length < 1">
                  <span class="text-gray-400">Pilih pengawas...</span>
               </template>
               <template v-else>
                  {{ supervisorOptions.find(item => item.value === state.supervisor_id)?.label }}
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Status"
         name="status"
      >
         <u-select-menu
            v-model="(state.status as string)"
            :options="useUserStatus"
            option-attribute="name"
            value-attribute="value"
            :disabled="loading"
         >
            <template #label>
               <template v-if="!state.status || useUserStatus.length < 1">
                  <span class="text-gray-400">Pilih status...</span>
               </template>
               <template v-else>
                  {{ useUserStatus.find(item => item.value === state.status)?.name }}
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Kepala Sekolah"
         name="principal"
      >
         <u-input
            v-model="(state.principal as string)"
            :disabled="loading"
         ></u-input>
      </u-form-group>

      <u-form-group
         label="Alamat"
         name="address"
         class="col-span-2"
      >
         <u-textarea
            v-model="(state.address as string)"
            :disabled="loading"
            :rows="3"
            autoresize
         ></u-textarea>
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
const state : Ref <API.Request.Form.School> = ref({
   name: store.dialog.data?.user.name || null,
   email: store.dialog.data?.user.email || null,
   password: null,
   school_type_id: store.dialog.data?.school_type_id || null,
   supervisor_id: store.dialog.data?.supervisor_id || null,
   status: store.dialog.data?.user.status || null,
   principal: store.dialog.data?.principal || null,
   address: store.dialog.data?.address || null,
   confirm_password: null
})

const validator = yup.object({
   isCreate: yup.boolean().default(store.dialog.id.includes('create')),
   name: yup.string().required('Nama sekolah harus diisi'),
   email: yup.string().email('Email tidak valid').required('Email harus diisi'),
   password: yup.string().when('isCreate', {
      is: true,
      then: (schema) => schema.required('Kata sandi harus diisi').min(8, 'Kata sandi harus berisi minimal ${min} karakter'),
      otherwise: (schema) => schema.notRequired()
   }),
   confirm_password: yup.string().required('Konfirmasi kata sandi harus diisi').when('isCreate', {
      is: true,
      then: (schema) => schema.required('Kata sandi harus diisi').test('is-match-password', () => 'Konfirmasi kata sandi tidak cocok', (value) => {
         if (value === state.value.password) return true
         return false
      }),
      otherwise: (schema) => schema.notRequired()
   }),
   school_type_id: yup.number().typeError('Tipe sekolah harus diisi').required('Tipe sekolah harus diisi'),
   supervisor_id: yup.number().typeError('Pengawas harus diisi').required('Pengawas harus diisi'),
   status: yup.string().required('Status harus diisi'),
   principal: yup.string().notRequired(),
   address: yup.string().notRequired(),
})

const typeOptions : Ref <Util.SelectOption[]> = ref([])
const supervisorOptions : Ref <Util.SelectOption[]> = ref([])

onBeforeMount(() => {
   getSchoolTypeOptions()
      .then(resp => typeOptions.value = resp)

   getSupervisorOptions()
      .then(resp => supervisorOptions.value = resp)
})

const submit = async () => {
   loading.value = true
   try {
      if (store.dialog.id.includes('create')) await createSchool(state.value)
      else if (store.dialog.id.includes('edit')) await updateSchool((store.dialog.data!.id as number), state.value)
      else return

      const message = store.dialog.id.includes('create') ? 'Sekolah baru berhasil disimpan' : 'Sekolah berhasil diperbarui'
      store.notify('success', message, 'school-form')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   } catch (e: unknown) {
      const error = e as API.Error
      store.notify('error', `${error.response._data.message || error}`, 'school-error')
   } finally {
      loading.value = false
   }
}
</script>