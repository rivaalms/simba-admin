<template>
<div class="grid grid-cols-1 gap-1">
   <template v-for="route in useRoutes">
      <template v-if="route.children">
         <u-accordion
            :items="[route]"
            :variant="route.children.includes(currentRoute!) ? 'soft' : 'ghost'"
            :color="route.children.includes(currentRoute!) ? 'primary' : 'gray'"
            :icon="route.icon"
         >
            <template #item="{ item }">
               <template v-for="child in item.children">
                  <div class="grid grid-cols-1 gap-1 ps-6">
                     <u-button
                        :to="child.to"
                        :variant="currentRoute?.to === child.to ? 'soft' : 'ghost'"
                        :color="currentRoute?.to === child.to ? 'primary' : 'gray'"
                        :icon="child.icon"
                     >
                        {{ child.label }}
                     </u-button>
                  </div>
               </template>
            </template>
         </u-accordion>
      </template>
      <template v-else>
         <u-button
            :to="route.to"
            :variant="currentRoute?.to === route.to ? 'soft' : 'ghost'"
            :color="currentRoute?.to === route.to ? 'primary' : 'gray'"
            :icon="route.icon"
         >
            {{ route.label }}
         </u-button>
      </template>
   </template>
</div>
</template>

<script setup lang="ts">
const currentRoute : ComputedRef <Util.Router | null> = computed(() => {
   const route = useRoutes.find(item => item.to === useRoute().path || item.children?.find(child => child.to === useRoute().path))
   if (!route) return null
   if (route.children) return route.children.find(child => child.to === useRoute().path) || null
   return route
})
</script>