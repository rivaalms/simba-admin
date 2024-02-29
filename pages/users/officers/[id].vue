<template>
<div v-if="officer" class="grid grid-cols-3 gap-2">
   <u-card class="overflow-visible w-full place-self-start">
      <loading-state v-if="loading"></loading-state>
      <template v-else>
         <div class="flex justify-center mb-4">
            <img :src="officer.user?.profile_picture || '/img/profile.webp'" class="w-2/3 rounded-full object-cover">
         </div>

         <div class="grid gap-4">
            <div class="text-center">
               <p class="font-bold text-lg">
                  {{ officer.user?.name }}
               </p>
               <p class="text-gray-500">
                  {{ officer.user?.email }}
               </p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">NIP</p>
               <p class="tracking-wide">{{ officer.employee_number }}</p>
            </div>
            <div class="text-sm">
               <p class="text-gray-500">Status</p>
               <u-badge
                  :color="officer.user?.status == 'ACTIVE' ? 'emerald' : 'red'"
                  variant="subtle"
               >
                  {{ officer.user?.status }}
               </u-badge>
            </div>
         </div>
      </template>

      <template #footer v-if="!loading">
         <div class="flex flex-col gap-2">
            <u-button
               block
               :icon="officer.user?.status === 'ACTIVE' ? 'i-heroicons-no-symbol' : 'i-heroicons-check'"
               :color="officer.user?.status === 'ACTIVE' ? 'red' : 'emerald'"
               @click.stop="store.showDialog(officer.user?.status == 'ACTIVE' ? 'deactivate-user' : 'activate-user', 'Ubah Status User', officer, () => fetchOfficer())"
            >
               <template v-if="officer.user?.status === 'ACTIVE'">Nonaktifkan Pengguna</template>
               <template v-else>Aktifkan Pengguna</template>
            </u-button>

            <u-button
               block
               icon="i-heroicons-pencil-square"
               color="amber"
               @click.stop="store.showDialog('officer-edit', 'Sunting Officer', officer, () => fetchOfficer())"
            >
               Sunting Pengguna
            </u-button>
         </div>
      </template>
   </u-card>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()
const officerId = useRoute().params.id as unknown
store.setPageTitle('Detail Officer', '/users/officers')

const { data: officer, pending: loading, refresh: fetchOfficer } = await useLazyAsyncData(
   'fetch-officer',
   () => getOfficerDetails(officerId as number),
)
</script>