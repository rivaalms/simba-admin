<template>
<header class="px-4 py-2 flex justify-between border-b-[1px]">
   <u-link
      to="/"
      class="py-2 px-2"
   >
      SIMBA
   </u-link>

   <u-dropdown :items="dropdownItems">
      <u-button
         variant="ghost"
         color="gray"
         trailing-icon="i-heroicons-chevron-down-20-solid"
      >
         {{ user?.name }}
      </u-button>

      <template #logout="{ item }">
         <u-icon :name="item.icon" class="text-red-500"></u-icon>
         <span class="truncate text-red-500">{{ item.label }}</span>
      </template>
   </u-dropdown>
</header>
</template>

<script setup lang="ts">
const store = useAppStore()
const authStore = useAuthStore()
const user = authStore.getUser

const dropdownItems = computed(() => [
   [
      {
         label: 'Profil',
         avatar: {
            src: 'https://avatars.githubusercontent.com/u/739984?v=4'
         }
      }
   ],
   [
      {
         label: 'Log Out',
         slot: 'logout',
         icon: 'i-heroicons-arrow-left-on-rectangle',
         click: () => {
            store.showDialog('logout', 'Konfirmasi Log Out', null)
         }
      }
   ]
])
</script>