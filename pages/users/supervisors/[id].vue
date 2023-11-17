<template>
<div v-if="supervisor" class="grid grid-cols-3 gap-2">
   <u-card class="overflow-visible place-self-start">
      <template #header>
         <u-button
            variant="ghost"
            color="gray"
            icon="i-heroicons-arrow-left-on-rectangle-20-solid"
            @click.stop="useRouter().push('/users/supervisors')"
         >
            Kembali
         </u-button>
      </template>

      <div class="flex justify-center mb-4">
         <img src="https://avatars.githubusercontent.com/u/739984?v=4" class="w-2/3 rounded-full object-cover">
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
      </div>
   </u-card>

   <div class="col-span-2 place-self-start w-full grid gap-2">
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
   </div>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()
const supervisor : Ref <Model.Supervisor | null> = ref(null)

onBeforeMount(async () => {
   await fetchSupervisor()
})

const fetchSupervisor = async () => {
   const id: unknown = useRoute().params.id
   await getSupervisorDetails(id as number)
      .then(resp => {
         supervisor.value = resp
      })
      .catch((error: API.Error) => store.notify('error', error.response?._data.message || `${error}`))
}
</script>