<template>
<div v-if="officer" class="grid grid-cols-3 gap-2">
   <u-card class="overflow-visible place-self-start">
      <div class="flex justify-center mb-4">
         <img src="https://avatars.githubusercontent.com/u/739984?v=4" class="w-2/3 rounded-full object-cover">
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
      </div>
   </u-card>
</div>
</template>

<script setup lang="ts">
const store = useAppStore()

store.setPageTitle('Detail Officer', '/users/officers')

const officer : Ref <Model.Officer | null> = ref(null)

onBeforeMount(async () => {
   await fetchOfficer()
})

const fetchOfficer = async () => {
   const id: unknown = useRoute().params.id
   await getOfficerDetails(id as number)
      .then(resp => {
         officer.value = resp
      })
}
</script>