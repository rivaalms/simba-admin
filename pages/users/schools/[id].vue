<template>
<div v-if="school" class="grid grid-cols-3 gap-2">
   <u-card class="place-self-start overflow-visible">
      <template #header>
         <u-button
            variant="ghost"
            color="gray"
            icon="i-heroicons-arrow-left-on-rectangle-20-solid"
            @click.stop="useRouter().push('/users/schools')"
         >
            Kembali
         </u-button>
      </template>
      <div class="flex justify-center mb-4">
         <img src="https://avatars.githubusercontent.com/u/739984?v=4" class="w-2/3 rounded-full object-cover">
      </div>

      <div class="grid gap-4">
         <div class="text-center">
            <p class="font-bold text-lg">{{ school.user?.name }}</p>
            <p class="text-gray-500">{{ school.user?.email }}</p>
         </div>

         <div class="text-sm">
            <p class="text-gray-500">Kepala Sekolah</p>
            <p class="tracking-wide">{{ school.principal }}</p>
         </div>

         <div class="text-sm">
            <p class="text-gray-500">Alamat</p>
            <p class="tracking-wide">{{ school.address }}</p>
         </div>

         <div class="text-sm">
            <p class="text-gray-500">Pengawas</p>
            <nuxt-link :to="`/users/supervisors/${school.supervisor_id}`" class="tracking-wide hover:text-primary transition-colors">{{ school.supervisor?.user?.name }} <u-icon name="i-heroicons-arrow-top-right-on-square-20-solid"></u-icon></nuxt-link>
         </div>
      </div>
   </u-card>

   <div class="col-span-2 place-self-start w-full grid gap-2">
      <u-card class="overflow-visible">
         <template #header>
            <div class="flex items-center justify-between">
               <p>Data Siswa</p>
               <u-button
                  variant="outline"
                  icon="i-heroicons-plus"
               >
                  Perbarui data siswa
               </u-button>
            </div>
         </template>
         <div class="grid gap-4">
            <div class="grid grid-cols-12 gap-2">
               <app-date-picker
                  v-model="yearPicker.student"
                  class="col-span-2"
                  :mode="['year-picker']"
                  @update:model-value="async (val) => {
                     yearPicker.student = val
                     studentFilter.year = `${parseInt(val)}-${parseInt(val) + 1}`
                     await fetchStudents()
                  }"
               >
                  <u-input
                     v-model="(studentFilter.year as string)"
                     input-class="cursor-pointer"
                     icon="i-heroicons-calendar-days"
                     readonly
                     :disabled="loading"
                  ></u-input>
               </app-date-picker>
            </div>
            <app-data-table
               :columns="studentColumns"
               :rows="students"
               :loading="false"
               :total="0"
               :pagination="false"
            ></app-data-table>
         </div>
      </u-card>

      <u-card class="overflow-visible">
         <template #header>
            <div class="flex items-center justify-between">
               <p>Data Guru</p>
               <u-button
                  variant="outline"
                  icon="i-heroicons-plus"
               >
                  Perbarui data guru
               </u-button>
            </div>
         </template>

         <div class="grid gap-4">
            <div class="grid grid-cols-12 gap-2">
               <app-date-picker
                  v-model="yearPicker.teacher"
                  class="col-span-2"
                  :mode="['year-picker']"
                  @update:model-value="async (val) => {
                     yearPicker.teacher = val
                     teacherFilter.year = `${parseInt(val)}-${parseInt(val) + 1}`
                     await fetchTeachers()
                  }"
               >
                  <u-input
                     v-model="(teacherFilter.year as string)"
                     input-class="cursor-pointer"
                     icon="i-heroicons-calendar-days"
                     readonly
                     :disabled="loading"
                  ></u-input>
               </app-date-picker>
            </div>

            <app-data-table
               :columns="teacherColumns"
               :rows="teachers"
               :loading="false"
               :total="0"
               :pagination="false"
            ></app-data-table>
         </div>
      </u-card>
   </div>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()
const dayjs = useDayjs()

const loading : Ref <boolean> = ref(false)
const school : Ref <Model.School | null> = ref(null)

const religions = await getReligions() as Util.Religion[]
const subjects = await getSubjects() as Util.Subject[]

const studentColumns : ComputedRef <Util.TableColumns[]> = computed(() => {
   const religionColumns = religions.map(item => ({
      key: item.name.toLowerCase().replaceAll(' ', '_'),
      label: item.name
   }))

   return [
   { key: 'grade', label: 'Kelas' },
   ...religionColumns,
   { key: 'total', label: 'Total' },
]
})
const students : Ref <Util.MapStudent[]> = ref([])
const studentFilter = shallowRef <API.Request.Query.SchoolStudent> ({
   school_id: useRoute().params.id as string,
   year: `${dayjs().format('YYYY')}-${dayjs().add(1, 'year').format('YYYY')}`
})
// const totalStudents : ComputedRef <any> = computed(() => {
//    let total = 0
//    if (students.value.length > 0) {
//       students.value.forEach((item: any) => total += item.total)
//    }
//    return total
// })

const teacherColumns : ComputedRef <any> = computed(() => [
   { key: 'subject', label: 'Subjek' },
   { key: 'value', label: 'Jumlah' },
])
const teachers : Ref <Util.MapTeacher[]> = ref([])
const teacherFilter = shallowRef <API.Request.Query.SchoolTeacher> ({
   school_id: useRoute().params.id as string,
   year: `${dayjs().format('YYYY')}-${dayjs().add(1, 'year').format('YYYY')}`
})

const yearPicker = ref <{ [key: string]: string }> ({
   student: dayjs().format('YYYY'),
   teacher: dayjs().format('YYYY')
})

onBeforeMount(async () => {
   await fetchSchool()

   await fetchStudents()

   await fetchTeachers()
})

const fetchSchool = async () => {
   const schoolId : unknown = useRoute().params.id
   loading.value = true
   await getSchoolDetails(schoolId as number)
      .then(resp => {
         school.value = resp
      })
      .catch((e: API.Error) => store.notify('error', e.response?._data?.message || 'Error fetching school'))
      .finally(() => loading.value = false)
}

const fetchStudents = async () => {
   await getSchoolStudents(studentFilter.value)
      .then(async (resp) => {
         students.value = await mapStudents(resp, religions)
      })
      .catch((error: API.Error) => store.notify('error', error.response?._data.message || `${error}`))
}

const fetchTeachers = async () => {
   await getSchoolTeachers(teacherFilter.value)
      .then(async (resp) => {
         teachers.value = await mapTeachers(resp, subjects)
      })
      .catch((error: API.Error) => store.notify('error', error.response?._data.message || `${error}`))
}
</script>