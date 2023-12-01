<template>
<u-form
   :schema="validator"
   :state="state"
   :validate-on="['submit']"
   @submit="submit"
>
   <div class="grid grid-cols-2 gap-4">
      <u-form-group
         label="Tahun"
         name="year"
         required
      >
         <date-picker
            v-model="yearPicker"
            :mode="['year-picker']"
            @update:model-value="(val) => {
               yearPicker = val
               state.year = `${val}-${parseInt(val) + 1}`
            }"
         >
            <u-input
               v-model="(state.year as string)"
               input-class="cursor-pointer"
               icon="i-heroicons-calendar-days"
               readonly
               :disabled="loading"
            ></u-input>
         </date-picker>
      </u-form-group>

      <u-form-group
         label="Mata pelajaran"
         name="subject_id"
         required
      >
         <u-select-menu
            v-model="(state.subject_id as number)"
            :options="subjectOptions"
            option-attribute="label"
            value-attribute="value"
            placeholder="Pilih mata pelajaran..."
            :disabled="loading"
         >
            <template #label>
               {{ subjectOptions.find(item => item.value === state.subject_id)?.label || 'Pilih mata pelajaran...' }}
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Jumlah"
         name="count"
         required
      >
         <u-input
            v-model="(state.count as number)"
            :disabled="loading"
            @keypress="validateNumber"
         ></u-input>
      </u-form-group>
   </div>

   <div class="mt-6 flex items-center justify-between gap-2">
      <u-button
         variant="ghost"
         color="gray"
         icon="i-heroicons-arrow-uturn-left"
         :disabled="loading"
         @click="store.clearDialog()"
      >
         Batal
      </u-button>

      <div class="flex gap-4">
         <u-button
            icon="i-heroicons-plus"
            :loading="loading"
            type="submit"
         >
            Simpan
         </u-button>

         <u-button
            color="emerald"
            icon="i-heroicons-check"
            :loading="loading"
            type="submit"
            @click.stop="isFinished = true"
         >
            Simpan & tutup
         </u-button>
      </div>
   </div>
</u-form>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { getSubjectOptions } from '~/utils/apis/select-options';

const store = useAppStore()
const dayjs = useDayjs()

const loading : Ref <boolean> = ref(false)
const yearPicker : Ref <string> = ref(dayjs().format('YYYY'))
const isFinished : Ref <boolean> = ref(false)

const subjectOptions : Ref <Util.SelectOption[]> = ref([])

const state : Ref <API.Request.Form.SchoolTeachers> = ref({
   school_id: store.dialog.data.id,
   year: `${dayjs().format('YYYY')}-${parseInt(dayjs().format('YYYY')) + 1}`,
   subject_id: null,
   count: null
})

const validator = yup.object({
   school_id: yup.number().typeError('Sekolah harus diisi').required('Sekolah harus diisi'),
   year: yup.string().typeError('Tahun harus diisi').required('Tahun harus diisi'),
   subject_id: yup.number().typeError('Mata pelajaran harus diisi').required('Mata pelajaran harus diisi'),
   count: yup.number().typeError('Jumlah guru harus diisi').required('Jumlah guru harus diisi')
})

onBeforeMount(async () => {
   await getSubjectOptions()
      .then(resp => subjectOptions.value = resp)
})

const submit = async () => {
   loading.value = true

   await updateSchoolTeachers(state.value)
      .then(resp => {
         store.notify('success', 'Data guru sekolah berhasil diperbarui', 'school-teachers-form')
         if (store.dialog.callback) store.dialog.callback()

         resetState()
         if (isFinished.value) store.clearDialog()
      })
      .finally(() => loading.value = false)
}

const resetState = () => {
   state.value = {
      school_id: store.dialog.data.id,
      year: `${dayjs().format('YYYY')}-${parseInt(dayjs().format('YYYY')) + 1}`,
      subject_id: null,
      count: null
   }
}
</script>