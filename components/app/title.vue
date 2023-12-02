<template>
<div
   class="flex gap-2 pt-6 py-4 px-3"
>
   <u-button
      v-if="!!backUrl"
      variant="ghost"
      icon="i-heroicons-arrow-left-20-solid"
      color="gray"
      square
      @click.stop="useRouter().push(backUrl)"
   ></u-button>

   <h1 class="text-lg font-medium capitalize text-gray-800">
      {{ title }}
   </h1>
</div>
</template>

<script setup lang="ts">
const route = useRoute()
const store = useAppStore()

const backUrl = computed(() => {
   return store.getPageBackUrl
})

const title : ComputedRef <string> = computed(() => {
   return store.getPageTitle
})
</script>