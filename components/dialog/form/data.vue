<template>
<u-form
   :schema="validator"
   :state="state"
   :validate-on="['submit']"
   @submit="submit"
>
   <div class="grid grid-cols-2 gap-4">
      <u-form-group
         label="Sekolah"
         name="school_id"
         required
      >
         <u-select-menu
            v-model="(state.school_id as number)"
            :options="schoolOptions"
            value-attribute="value"
            searchable
            :search-attributes="['label']"
            searchable-placeholder="Cari..."
            :disabled="loading"
         >
            <template #label>
               <template v-if="!state.school_id || schoolOptions.length < 1">
                  <span class="text-gray-400">Pilih sekolah...</span>
               </template>
               <template v-else>
                  {{ schoolOptions.find(item => item.value === state.school_id)?.label }}
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Tahun ajaran"
         name="year"
         required
      >
         <date-picker
            v-model="yearPicker"
            :mode="['year-picker']"
            @update:model-value="(val) => {
               yearPicker = val
               state.year = `${parseInt(val)}-${parseInt(val) + 1}`
            }"
         >
            <u-input
               v-model="(state.year as string)"
               input-class="cursor-pointer"
               icon="i-heroicons-calendar-days"
               placeholder="Pilih tahun ajaran..."
               readonly
               :disabled="loading"
            ></u-input>
         </date-picker>
      </u-form-group>

      <u-form-group
         label="Kategori"
         required
      >
         <u-select-menu
            v-model="(category as number)"
            :options="categoryOptions"
            value-attribute="value"
            searchable
            :search-attributes="['label']"
            searchable-placeholder="Cari..."
            :disabled="loading"
            @update:model-value="onCategoryChanged"
         >
            <template #label>
               <template v-if="!category || categoryOptions.length < 1">
                  <span class="text-gray-400">Pilih kategori...</span>
               </template>
               <template v-else>
                  {{ categoryOptions.find(item => item.value === category)?.label }}
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Tipe"
         name="data_type_id"
         required
      >
         <u-select-menu
            v-model="(state.data_type_id as number)"
            :options="typeOptions"
            value-attribute="value"
            :disabled="!category || loading"
            searchable
            :search-attributes="['label']"
            searchable-placeholder="Cari..."
         >
            <template #label>
               <template v-if="!category">
                  <span class="text-gray-400">Kategori belum dipilih</span>
               </template>
               <template v-else>
                  <template v-if="!state.data_type_id || typeOptions.length < 1">
                     <span class="text-gray-400">Pilih tipe...</span>
                  </template>
                  <template v-else>
                     {{ typeOptions.find(item => item.value === state.data_type_id)?.label }}
                  </template>
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Status"
         name="data_status_id"
         required
      >
         <u-select-menu
            v-model="(state.data_status_id as number)"
            :options="statusOptions"
            value-attribute="value"
            searchable
            :search-attributes="['label']"
            searchable-placeholder="Cari..."
            :disabled="loading"
         >
            <template #label>
               <template v-if="!state.data_status_id || statusOptions.length < 1">
                  <span class="text-gray-400">Pilih status...</span>
               </template>
               <template v-else>
                  {{ statusOptions.find(item => item.value === state.data_status_id)?.label }}
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         v-if="store.dialog.id.includes('create')"
         label="Upload file"
         name="file"
         required
      >
         <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".pdf, .doc, .docx, .xls, .xlsx, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.google-apps.document, application/vnd.google-apps.spreadsheet"
            @change="onFileChange"
         >

         <u-button-group class="w-full">
            <u-button
            color="white"
            icon="i-heroicons-document-plus"
            :disabled="loading"
            @click.stop="fileInput.click()"
            ></u-button>

            <u-input
               :model-value="(fileInputName as string)"
               readonly
               class="flex-1"
               input-class="cursor-pointer focus:ring-inset"
               placeholder="Pilih file..."
               :disabled="loading"
               @click.stop="fileInput.click()"
            ></u-input>
         </u-button-group>
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
const dayjs = useDayjs()
const yearPicker : Ref <string> = ref(dayjs().format('YYYY'))
const loading : Ref <boolean> = ref(false)
const state : Ref <API.Request.Form.Data> = ref({
   school_id: store.dialog.data?.school_id || null,
   year: store.dialog.data?.year || null,
   data_type_id: store.dialog.data?.data_type_id || null,
   data_status_id: store.dialog.data?.data_status_id || null,
   file: null
})

const validator = yup.object({
   school_id: yup.number().typeError('Sekolah harus diisi').required('Sekolah harus diisi'),
   year: yup.string().required('Tahun ajaran harus diisi'),
   data_type_id: yup.number().typeError('Tipe data harus diisi').required('Tipe data harus diisi'),
   data_status_id: yup.number().typeError('Status harus diisi').required('Status harus diisi'),
   file: yup.mixed().nullable().test('is-file-required', () =>
   'File harus diisi', (value) => {
      if (store.dialog.id.includes('edit')) return true
      if (!!value) return true
      return false
   })
})

const category : Ref <number | null> = ref(store.dialog.data?.type?.category?.id || null)

const schoolOptions : Ref <Util.SelectOption[]> = ref([])
const categoryOptions : Ref <Util.SelectOption[]> = ref([])
const typeOptions : Ref <Util.SelectOption[]> = ref([])
const statusOptions : Ref <Util.SelectOption[]> = ref([])

const fileInput : Ref <any> = ref(null)
const fileInputName : ComputedRef <string | null> = computed(() => {
   return state.value.file?.name || null
})

onBeforeMount(() => {
   getSchoolOptions()
      .then(resp => {
         schoolOptions.value = resp
      })

   getDataCategoryOptions()
      .then((resp) => {
         categoryOptions.value = resp
      })

   if (category.value) {
      getDataTypeOptions(category.value)
         .then(resp => {
            typeOptions.value = resp
         })
   }

   getDataStatusOptions()
      .then(resp => {
         statusOptions.value = resp
      })
})

const onCategoryChanged = async () => {
   if (!category.value) return
   state.value.data_type_id = null
   await getDataTypeOptions(category.value)
      .then(resp =>  {
         typeOptions.value = resp
      })
}

const onFileChange = (e: any) => {
   state.value.file = e.target.files[0]
}

const submit = async () => {
   loading.value = true
   try {
      if (store.dialog.id.includes('create')) await createData(state.value)
      else if (store.dialog.id.includes('edit')) await updateData((store.dialog.data.id as number), state.value)
      else return

      const message = store.dialog.id.includes('create') ? 'Data baru berhasil disimpan' : 'Data berhasil diperbarui'
      store.notify('success', message, 'data-form')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   } catch (e: any) {
      const error = e as API.Error
      store.notify('error', `${error.response._data.message || error}`, 'data-error')
   } finally {
      loading.value = false
   }
}
</script>