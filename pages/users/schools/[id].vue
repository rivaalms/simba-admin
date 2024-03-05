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
            <div class="flex items-center justify-between">
               <p class="text-sm">Jumlah Guru</p>

            </div>
            <p class="text-2xl">{{ totalTeachers }}</p>
         </u-card>
      </div>

      <u-card class="overflow-visible">
         <u-tabs :items="tabs">
            <template #item="{ item }">
               <div v-if="item.key == 'students'" class="py-4">
                  <div class="grid gap-4">
                     <div class="flex items-center justify-between">
                        <year-picker
                           v-model="(studentFilter.year as string)"
                           :callback="fetchStudents"
                        ></year-picker>

                        <u-button
                           variant="outline"
                           icon="i-heroicons-plus"
                           @click.stop="store.showDialog('student-create', 'Perbarui Data Siswa', school, () => fetchStudents().then(() => fetchStudentGrowth()))"
                        >
                           Perbarui data siswa
                        </u-button>
                     </div>

                     <div class="max-h-96 overflow-y-auto">
                        <data-table
                           :columns="studentColumns"
                           :rows="students"
                           :loading="studentsLoading"
                           :total="0"
                           :pagination="false"
                        ></data-table>
                     </div>

                     <div class="grid gap-4">
                        <div class="flex items-center justify-between">
                           <p class="text-sm font-medium">
                              Pertumbuhan Siswa
                           </p>

                           <div class="inline-flex gap-3">
                              <date-picker
                                 v-model="studentGrowthFilter.start_year"
                                 :mode="['year-picker']"
                                 class="!w-auto"
                              >
                                 <u-input
                                    v-model="studentGrowthFilter.start_year"
                                    input-class="cursor-pointer !w-auto"
                                    icon="i-heroicons-calendar-days"
                                    readonly
                                 ></u-input>
                              </date-picker>
                              <span>-</span>
                              <date-picker
                                 v-model="studentGrowthFilter.end_year"
                                 :mode="['year-picker']"
                                 class="!w-auto"
                              >
                                 <u-input
                                    v-model="studentGrowthFilter.end_year"
                                    input-class="cursor-pointer !w-auto"
                                    icon="i-heroicons-calendar-days"
                                    readonly
                                 ></u-input>
                              </date-picker>
                           </div>
                        </div>
                        <loading-state v-if="studentGrowthLoading"></loading-state>
                        <apexchart
                           v-else
                           :options="chartOptions"
                           :series="studentChartData"
                        />
                     </div>
                  </div>
               </div>

               <div v-if="item.key == 'teachers'" class="py-4">
                  <div class="grid gap-4">
                     <div class="flex items-center justify-between">
                        <year-picker
                           v-model="(teacherFilter.year as string)"
                           :callback="fetchTeachers"
                        ></year-picker>

                        <u-button
                           variant="outline"
                           icon="i-heroicons-plus"
                           @click.stop="store.showDialog('teacher-create', 'Perbarui Data Guru', teachers, () => fetchTeachers().then(() => fetchTeacherGrowth()))"
                        >
                           Perbarui data guru
                        </u-button>
                     </div>

                     <div class="max-h-96 overflow-y-auto">
                        <data-table
                           :columns="teacherColumns"
                           :rows="teachers"
                           :loading="teacherLoading"
                           :total="0"
                           :pagination="false"
                        ></data-table>
                     </div>

                     <div class="grid gap-4">
                        <div class="flex items-center justify-between">
                           <p class="text-sm font-medium">
                              Pertumbuhan Guru
                           </p>

                           <div class="inline-flex gap-3">
                              <date-picker
                                 v-model="teacherGrowthFilter.start_year"
                                 :mode="['year-picker']"
                                 class="!w-auto"
                              >
                                 <u-input
                                    v-model="teacherGrowthFilter.start_year"
                                    input-class="cursor-pointer !w-auto"
                                    icon="i-heroicons-calendar-days"
                                    readonly
                                 ></u-input>
                              </date-picker>
                              <span>-</span>
                              <date-picker
                                 v-model="teacherGrowthFilter.end_year"
                                 :mode="['year-picker']"
                                 class="!w-auto"
                              >
                                 <u-input
                                    v-model="teacherGrowthFilter.end_year"
                                    input-class="cursor-pointer !w-auto"
                                    icon="i-heroicons-calendar-days"
                                    readonly
                                 ></u-input>
                              </date-picker>
                           </div>
                        </div>
                        <loading-state v-if="teacherGrowthLoading"></loading-state>
                        <apexchart
                           v-else
                           :options="chartOptions"
                           :series="teacherChartData"
                        />
                     </div>
                  </div>
               </div>
            </template>
         </u-tabs>
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

const studentFilter = ref <API.Request.Query.SchoolStudent> ({
   school_id: useRoute().params.id as string,
   year: `${dayjs().format('YYYY')}-${dayjs().add(1, 'year').format('YYYY')}`
})

const { data: students, pending: studentsLoading, refresh: fetchStudents } = await useLazyAsyncData(
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

const teacherFilter = ref <API.Request.Query.SchoolTeacher> ({
   school_id: useRoute().params.id as string,
   year: `${dayjs().format('YYYY')}-${dayjs().add(1, 'year').format('YYYY')}`
})

const { data: teachers, pending: teacherLoading, refresh: fetchTeachers } = await useLazyAsyncData(
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

const tabs = [
   {
      key: 'students',
      label: 'Siswa',
   },
   {
      key: 'teachers',
      label: 'Guru'
   }
]

const studentGrowthFilter = ref<API.Request.Query.SchoolStudentGrowth>({
   start_year: `${dayjs().subtract(5, 'years').year()}`,
   end_year: `${dayjs().year()}`
})
const teacherGrowthFilter = ref<API.Request.Query.SchoolTeacherGrowth>({
   start_year: `${dayjs().subtract(5, 'years').year()}`,
   end_year: `${dayjs().year()}`
})

const { data: studentGrowth, pending: studentGrowthLoading, refresh: fetchStudentGrowth } = await useLazyAsyncData(
   'fetch-student-growth',
   () => getSchoolStudentsGrowth(schoolId as number, studentGrowthFilter.value),
   {
      watch: [() => studentGrowthFilter.value.start_year, () => studentGrowthFilter.value.end_year],
      default: () => [] as Util.StudentGrowth[]
   }
)

const { data: teacherGrowth, pending: teacherGrowthLoading, refresh: fetchTeacherGrowth } = await useLazyAsyncData(
   'fetch-teacher-growth',
   () => getSchoolTeachersGrowth(schoolId as number, teacherGrowthFilter.value),
   {
      watch: [() => teacherGrowthFilter.value.start_year, () => teacherGrowthFilter.value.end_year],
      default: () => [] as Util.TeacherGrowth[]
   }
)

const studentChartData = computed(() => {
   const value: any = []

   studentGrowth.value.forEach((item, index) => {
      value[index] = {
         x: item.year || '',
         y: item.total || 0
      }
   })

   return [{
      name: 'Jumlah siswa',
      data: value
   }]
})

const teacherChartData = computed(() => {
   const value: any = []

   teacherGrowth.value.forEach((item, index) => {
      value[index] = {
         x: item.year || '',
         y: item.total || 0
      }
   })

   return [{
      name: 'Jumlah guru',
      data: value
   }]
})

const chartOptions = computed(() => ({
   chart: {
      id: 'growthChart',
      type: 'line'
   },
   colors: ['#3b82f6'],
   dataLabels: {
      style: {
         fontSize: '12px',
         fontFamily: 'Lato'
      }
   },
   markers: {
      size: 4,
      hover: { sizeOffset: 2 }
   },
   stroke: { curve: 'smooth' }
}))
</script>