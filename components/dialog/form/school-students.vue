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
               state.year = `${parseInt(val)}-${parseInt(val) + 1}`
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
         label="Kelas"
         name="grade"
         required
      >
         <u-select-menu
            v-model="(state.grade as number)"
            :options="gradeOptions"
            placeholder="Pilih kelas..."
            :disabled="loading"
         ></u-select-menu>
      </u-form-group>

      <u-form-group
         label="Agama"
         name="religion_id"
         required
      >
         <u-select-menu
            v-model="(state.religion_id as number)"
            :options="religionOptions"
            placeholder="Pilih agama..."
            option-attribute="label"
            value-attribute="value"
            :disabled="loading"
         >
            <template #label>
               {{ religionOptions.find(item => item.value === state.religion_id)?.label || 'Pilih agama...' }}
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

const store = useAppStore()
const dayjs = useDayjs()

const loading : Ref <boolean> = ref(false)
const yearPicker : Ref <string> = ref(dayjs().format('YYYY'))
const isFinished : Ref <boolean> = ref(false)

const gradeOptions : ComputedRef <string[]> = computed(() => {
   if (store.dialog.data.school_type_id === 2) return [1, 2, 3, 4, 5, 6].map(String)
   else return [7, 8, 9].map(String)
})

const religionOptions : Ref <Util.SelectOption[]> = ref([])

const state : Ref <API.Request.Form.SchoolStudent> = ref({
   school_id: store.dialog.data.id,
   year: `${dayjs().format('YYYY')}-${parseInt(dayjs().format('YYYY')) + 1}`,
   grade: null,
   religion_id: null,
   count: null
})

const validator = yup.object({
   school_id: yup.number().typeError('Sekolah harus diisi').required('Sekolah harus diisi'),
   year: yup.string().required('Tahun harus diisi'),
   grade: yup.number().typeError('Kelas harus diisi').required('Kelas harus diisi'),
   religion_id: yup.number().typeError('Agama harus diisi').required('Agama harus diisi'),
   count: yup.number().typeError('Jumlah siswa harus diisi').required('Jumlah siswa harus diisi')
})

onBeforeMount(async () => {
   await getReligionOptions()
      .then(resp => religionOptions.value = resp)
})

const submit = async () => {
   loading.value = true

   await updateSchoolStudents(state.value)
      .then(resp => {
         store.notify('success', 'Data siswa sekolah berhasil diperbarui', 'school-students-form')
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
      grade: null,
      religion_id: null,
      count: null
   }
}
</script>