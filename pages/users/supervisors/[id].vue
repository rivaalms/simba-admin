<template>
<div v-if="supervisor" class="grid grid-cols-3 gap-2">
   <u-card class="overflow-visible place-self-start">
      <loading-state v-if="loading"></loading-state>
      <template v-else>
         <div class="flex justify-center mb-4">
            <img :src="supervisor.user?.profile_picture || '/img/profile.webp'" class="w-2/3 rounded-full object-cover">
         </div>

         <div class="grid gap-4">
            <div class="text-center">
               <p class="font-bold text-lg">{{ supervisor.user?.name }}</p>
               <p class="text-gray-500">{{ supervisor.user?.email }}</p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">NIP</p>
               <p class="tracking-wide">{{ supervisor.employee_number }}</p>
            </div>
            <div class="text-sm">
               <p class="text-gray-500">Status</p>
               <u-badge
                  :color="supervisor.user?.status == 'ACTIVE' ? 'emerald' : 'red'"
                  variant="subtle"
               >
                  {{ supervisor.user?.status }}
               </u-badge>
            </div>
         </div>
      </template>

      <template #footer v-if="!loading">
         <div class="flex flex-col gap-2">
            <u-button
               block
               :icon="supervisor.user?.status === 'ACTIVE' ? 'i-heroicons-no-symbol' : 'i-heroicons-check'"
               :color="supervisor.user?.status === 'ACTIVE' ? 'red' : 'emerald'"
               @click.stop="store.showDialog(supervisor.user?.status == 'ACTIVE' ? 'deactivate-user' : 'activate-user', 'Ubah Status User', supervisor, () => fetchSupervisor())"
            >
               <template v-if="supervisor.user?.status === 'ACTIVE'">Nonaktifkan Pengguna</template>
               <template v-else>Aktifkan Pengguna</template>
            </u-button>

            <u-button
               block
               icon="i-heroicons-pencil-square"
               color="amber"
               @click.stop="store.showDialog('supervisor-edit', 'Sunting Pengawas', supervisor, () => fetchSupervisor())"
            >
               Sunting Pengguna
            </u-button>
         </div>
      </template>
   </u-card>

   <div class="col-span-2 place-self-start w-full grid gap-2">
      <u-card v-if="loading" class="overflow-visible">
         <loading-state></loading-state>
      </u-card>

      <template v-else>
         <u-card class="overflow-visible">
            <template #header>
               <div class="flex items-center justify-between">
                  <p>Sekolah Binaan</p>
                  <u-button
                     variant="outline"
                     icon="i-heroicons-plus"
                  >
                     Tambah sekolah binaan
                  </u-button>
               </div>
            </template>
            <div v-if="supervisor.schools!.length > 0" class="grid grid-cols-3 gap-2">
               <nuxt-link
                  v-for="school in supervisor.schools"
                  :to="`/users/schools/${school.id}`"
                  target="_blank"
               >
                  <u-card class="shadow-none hover:shadow-md hover:shadow-primary/25 hover:ring-primary/50 overflow-visible transition-all duration-300">
                     <div class="flex items-center justify-between">
                        <p>{{ school.user?.name }}</p>
                        <u-icon
                           name="i-heroicons-arrow-top-right-on-square"
                        ></u-icon>
                     </div>
                  </u-card>
               </nuxt-link>
            </div>
            <div v-else class="flex text-gray-500 flex-col items-center justify-center gap-2 py-4">
               <u-icon
                  name="i-heroicons-circle-stack-20-solid"
               ></u-icon>
               <p>Data tidak tersedia</p>
            </div>
         </u-card>
      </template>
   </div>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()
const supervisorId = useRoute().params.id as unknown
store.setPageTitle('Detail Pengawas', '/users/supervisors')

const { data: supervisor, pending: loading, refresh: fetchSupervisor } = useLazyAsyncData(
   'fetch-supervisor',
   () => getSupervisorDetails(supervisorId as number)
)
</script>