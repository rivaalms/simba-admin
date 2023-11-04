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
         >
            <template #label>
               <template v-if="!state.school_id">
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
         <app-date-picker
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
               readonly
            ></u-input>
         </app-date-picker>
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
            @update:model-value="onCategoryChanged"
         >
            <template #label>
               <template v-if="!category">
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
            :disabled="!category"
            searchable
            :search-attributes="['label']"
            searchable-placeholder="Cari..."
         >
            <template #label>
               <template v-if="!category">
                  <span class="text-gray-400">Kategori belum dipilih</span>
               </template>
               <template v-else>
                  <template v-if="!state.data_type_id">
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
         >
            <template #label>
               <template v-if="!state.data_status_id">
                  <span class="text-gray-400">Pilih status...</span>
               </template>
               <template v-else>
                  {{ statusOptions.find(item => item.value === state.data_status_id)?.label }}
               </template>
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Upload file"
         name="file"
         required
      >
         <u-input
            type="file"
            accept=".pdf, .doc, .docx, .xls, .xlsx, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.google-apps.document, application/vnd.google-apps.spreadsheet"
            placeholder="Upload file..."
            input-class="file:cursor-pointer file:mr-2 file:px-2 file:rounded file:bg-gray-200 file:text-gray-500 file:border-0 file:text-xs file:hover:bg-gray-300"
            @change="onFileChange"
         ></u-input>
      </u-form-group>
   </div>

   <div class="mt-6 flex items-center justify-end gap-2">
      <u-button
         color="gray"
         variant="ghost"
         icon="i-heroicons-arrow-uturn-left"
         @click.stop="store.clearDialog()"
      >
         Batal
      </u-button>
      <u-button
         color="emerald"
         icon="i-heroicons-check"
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
const state : Ref <{ [key: string]: string | number | null }> = ref({
   school_id: null,
   year: null,
   data_type_id: null,
   data_status_id: null,
   file: null
})

const validator = yup.object({
   school_id: yup.number().typeError('Sekolah harus diisi').required('Sekolah harus diisi'),
   year: yup.string().required('Tahun ajaran harus diisi'),
   data_type_id: yup.number().typeError('Tipe data harus diisi').required('Tipe data harus diisi'),
   data_status_id: yup.number().typeError('Status harus diisi').required('Status harus diisi'),
   file: yup.mixed().required('Data harus diisi')
})

const category : Ref <number | null> = ref(null)

const schoolOptions : Ref <Util.SelectOption[]> = ref([])
const categoryOptions : Ref <Util.SelectOption[]> = ref([])
const typeOptions : Ref <Util.SelectOption[]> = ref([])
const statusOptions : Ref <Util.SelectOption[]> = ref([])

onBeforeMount(async () => {
   await useGetSchoolOptions()
      .then(resp => {
         schoolOptions.value = resp
      })

   await useDataCategoryOptions()
      .then(resp => {
         categoryOptions.value = resp
      })

   await useDataStatusOptions()
      .then(resp => {
         statusOptions.value = resp
      })
})

const onCategoryChanged = async () => {
   if (!category.value) return
   state.value.data_type_id = null
   await useDataTypeOptions(category.value)
      .then(resp =>  {
         typeOptions.value = resp
      })
}

const onFileChange = (e: any) => {
   state.value.file = e.target.files[0]
}

const submit = async () => {
   console.log(state.value)
   await useCreateData(state.value)
}
</script>