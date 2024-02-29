<template>
<div v-if="school" class="grid grid-cols-3 gap-2">
   <u-card class="place-self-start w-full overflow-visible">
      <loading-state v-if="loading"></loading-state>
      <template v-else>
         <div class="flex justify-center mb-4">
            <img :src="school.user?.profile_picture || '/img/profile.webp'" class="w-2/3 rounded-full object-cover">
         </div>

         <div class="grid gap-4">
            <div class="text-center">
               <p class="font-bold text-lg">{{ school.user?.name }}</p>
               <p class="text-gray-500">{{ school.user?.email }}</p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Jenis Sekolah</p>
               <p class="tracking-wide">{{ school.type?.name }}</p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Kepala Sekolah</p>
               <p class="tracking-wide">{{ school.principal || '-' }}</p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Alamat</p>
               <p class="tracking-wide">{{ school.address || '-' }}</p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Pengawas</p>
               <nuxt-link :to="`/users/supervisors/${school.supervisor_id}`" class="tracking-wide hover:text-primary transition-colors">{{ school.supervisor?.user?.name }} <u-icon name="i-heroicons-arrow-top-right-on-square-20-solid"></u-icon></nuxt-link>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Status</p>
               <u-badge
                  :color="school.user?.status == 'ACTIVE' ? 'emerald' : 'red'"
                  variant="subtle"
               >
                  {{ school.user?.status }}
               </u-badge>
            </div>
         </div>
      </template>

      <template #footer v-if="!loading">
         <div class="flex flex-col gap-2">
            <u-button
               block
               :icon="school.user?.status === 'ACTIVE' ? 'i-heroicons-no-symbol' : 'i-heroicons-check'"
               :color="school.user?.status === 'ACTIVE' ? 'red' : 'emerald'"
               @click.stop="store.showDialog(school.user?.status == 'ACTIVE' ? 'deactivate-user' : 'activate-user', 'Ubah Status User', school, () => fetchSchool())"
            >
               <template v-if="school.user?.status === 'ACTIVE'">Nonaktifkan Pengguna</template>
               <template v-else>Aktifkan Pengguna</template>
            </u-button>

            <u-button
               block
               icon="i-heroicons-pencil-square"
               color="amber"
               @click.stop="store.showDialog('school-edit', 'Sunting Sekolah', school, () => fetchSchool())"
            >
               Sunting Pengguna
            </u-button>
         </div>
      </template>
   </u-card>

   <div class="col-span-2 place-self-start w-full grid gap-2">
      <div class="grid grid-cols-2 gap-2">
         <u-card class="overflow visible">
            <p class="text-sm">Jumlah Siswa</p>
            <p class="text-2xl">{{ totalStudents }}</p>
         </u-card>
         <u-card class="overflow visible">
            <p class="text-sm">Jumlah Guru</p>
            <p class="text-2xl">{{ totalTeachers }}</p>
         </u-card>
      </div>

      <u-card class="overflow-visible">
         <template #header>
            <div class="flex items-center justify-between">
               <p>Data Siswa</p>
               <u-button
                  variant="outline"
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('student-create', 'Perbarui Data Siswa', school, () => fetchStudents())"
               >
                  Perbarui data siswa
               </u-button>
            </div>
         </template>
         <div class="grid gap-4">
            <div class="grid grid-cols-12 gap-2">
               <date-picker
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
               </date-picker>
            </div>
            <data-table
               :columns="studentColumns"
               :rows="students"
               :loading="false"
               :total="0"
               :pagination="false"
            ></data-table>
         </div>
      </u-card>

      <u-card class="overflow-visible">
         <template #header>
            <div class="flex items-center justify-between">
               <p>Data Guru</p>
               <u-button
                  variant="outline"
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('teacher-create', 'Perbarui Data Guru', school, () => fetchTeachers())"
               >
                  Perbarui data guru
               </u-button>
            </div>
         </template>

         <div class="grid gap-4">
            <div class="grid grid-cols-12 gap-2">
               <date-picker
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
               </date-picker>
            </div>

            <data-table
               :columns="teacherColumns"
               :rows="teachers"
               :loading="false"
               :total="0"
               :pagination="false"
            ></data-table>
         </div>
      </u-card>
   </div>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()
const dayjs = useDayjs()
const schoolId : unknown = useRoute().params.id

store.setPageTitle('Detail Sekolah', '/users/schools')

const { data: school, pending: loading, refresh: fetchSchool } = await useLazyAsyncData(
   'fetch-data',
   () => getSchoolDetails(schoolId as number),
)

const religions = await getReligions() as Util.Religion[]

const studentFilter = shallowRef <API.Request.Query.SchoolStudent> ({
   school_id: useRoute().params.id as string,
   year: `${dayjs().format('YYYY')}-${dayjs().add(1, 'year').format('YYYY')}`
})

const { data: students, refresh: fetchStudents } = await useLazyAsyncData(
   'fetch-students',
   () => getSchoolStudents(studentFilter.value).then(async (resp) => await mapStudents(resp, religions)),
   {
      default: () => [] as Util.MapStudent[]
   }
)

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

const totalStudents : ComputedRef <number> = computed(() => {
   return students.value.reduce((prev, curr) => {
      return prev + curr.total
   }, 0)
})

const subjects = await getSubjects() as Util.Subject[]

const teacherFilter = shallowRef <API.Request.Query.SchoolTeacher> ({
   school_id: useRoute().params.id as string,
   year: `${dayjs().format('YYYY')}-${dayjs().add(1, 'year').format('YYYY')}`
})

const { data: teachers, refresh: fetchTeachers } = await useLazyAsyncData(
   'fetch-teachers',
   () => getSchoolTeachers(teacherFilter.value).then(async (resp) => await mapTeachers(resp, subjects)),
   {
      default: () => [] as Util.MapTeacher[]
   }
)

const teacherColumns : ComputedRef <any> = computed(() => [
   { key: 'subject', label: 'Subjek' },
   { key: 'value', label: 'Jumlah' },
])

const totalTeachers : ComputedRef <number> = computed(() => {
   return teachers.value.reduce((prev, curr) => {
      return prev + parseInt(curr.value as string)
   }, 0)
})

const yearPicker = ref <{ [key: string]: string }> ({
   student: dayjs().format('YYYY'),
   teacher: dayjs().format('YYYY')
})
</script>