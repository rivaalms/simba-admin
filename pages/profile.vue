<template>
   <div v-if="user" class="grid grid-cols-3 gap-2">
      <u-card class="overflow-visible place-self-start">
         <div class="flex justify-center mb-4">
            <img :src="user.profile_picture || '/img/profile.webp'" class="w-2/3 rounded-full object-cover">
         </div>

         <div class="grid gap-4">
            <div class="text-center">
               <p class="font-bold text-lg">
                  {{ user.name }}
               </p>
               <p class="text-gray-500">
                  {{ user.email }}
               </p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Role</p>
               <p class="tracking-wide capitalize">{{ user.userable_type || 'Administrator' }}</p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Tanggal Bergabung</p>
               <p class="tracking-wide">{{ dayjs(user.created_at).format('DD MMMM YYYY HH:mm') }}</p>
            </div>

            <div class="text-sm">
               <p class="text-gray-500">Update Terakhir</p>
               <p class="tracking-wide">{{ dayjs(user.updated_at).format('DD MMMM YYYY HH:mm') }}</p>
            </div>
         </div>
      </u-card>
   </div>
</template>

<script setup lang="ts">
const user = useAuthStore().getUser
const store = useAppStore()
const dayjs = useDayjs()

store.setPageTitle('Profil')
</script>