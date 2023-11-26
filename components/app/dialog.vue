<template>
<u-modal
   v-model="store.dialog.show"
   :ui="dialogUI"
>
   <u-card :ui="{ base: 'overflow-visible' }">
      <template #header>
         <div class="flex items-center justify-between">
            <p>{{ store.dialog.title }}</p>
            <u-button
               color="gray"
               variant="ghost"
               icon="i-heroicons-x-mark"
               @click.stop="store.clearDialog()"
            ></u-button>
         </div>
      </template>

      <component :is="dialogComponent"></component>
   </u-card>
</u-modal>
</template>

<script setup lang="ts">
import type { ConcreteComponent, ComputedOptions, MethodOptions } from 'vue'

namespace Dialog {
   export type ResolveComponent = string | ConcreteComponent<{}, any, any, ComputedOptions, MethodOptions>
}

const store = useAppStore()
const dialogComponent : Ref <string | Dialog.ResolveComponent> = ref(resolveComponent('DialogPlaceholder'))
const dialogWidth : Ref <string> = ref('sm:max-w-lg')

const componentMap : { [key: string]: () => Promise<any> } = {
   'data-create': () => import('@/components/dialog/form/data.vue'),
   'data-edit': () => import('@/components/dialog/form/data.vue'),
   'data-delete': () => import('@/components/dialog/delete.vue'),
   'file-upload': () => import('@/components/dialog/form/file-upload.vue'),

   'school-create': () => import('@/components/dialog/form/school.vue'),
   'school-edit': () => import('@/components/dialog/form/school.vue'),
   'school-delete': () => import('@/components/dialog/delete.vue'),

   'supervisor-create': () => import('@/components/dialog/form/supervisor.vue'),
   'supervisor-edit': () => import('@/components/dialog/form/supervisor.vue'),
   'supervisor-delete': () => import('@/components/dialog/delete.vue'),

   'officer-create': () => import('@/components/dialog/form/officer.vue'),
   'officer-edit': () => import('@/components/dialog/form/officer.vue'),
   'officer-delete': () => import('@/components/dialog/delete.vue'),

   'data-status-create': () => import('@/components/dialog/form/data-status.vue'),
   'data-status-edit': () => import('@/components/dialog/form/data-status.vue'),
   'data-status-delete': () => import ('@/components/dialog/delete.vue'),

   'data-category-create': () => import('@/components/dialog/form/data-category.vue'),
   'data-category-edit': () => import('@/components/dialog/form/data-category.vue'),
   'data-category-delete': () => import ('@/components/dialog/delete.vue'),

   'data-type-create': () => import('@/components/dialog/form/data-type.vue'),
   'data-type-edit': () => import('@/components/dialog/form/data-type.vue'),
   'data-type-delete': () => import('@/components/dialog/delete.vue'),

   'school-type-create': () => import('@/components/dialog/form/school-type.vue'),
   'school-type-edit': () => import('@/components/dialog/form/school-type.vue'),
   'school-type-delete': () => import('@/components/dialog/delete.vue'),

   'subject-create': () => import('@/components/dialog/form/subject.vue'),
   'subject-edit': () => import('@/components/dialog/form/subject.vue'),
   'subject-delete': () => import('@/components/dialog/delete.vue'),

   'religion-create': () => import('@/components/dialog/form/religion.vue'),
   'religion-edit': () => import('@/components/dialog/form/religion.vue'),
   'religion-delete': () => import('@/components/dialog/delete.vue'),
}
const widthMap : { [key: string]: string } = {
   'data-create': 'sm:max-w-2xl',
   'data-edit': 'sm:max-w-2xl',

   'school-create': 'sm:max-w-2xl',
   'school-edit': 'sm:max-w-2xl',

   'supervisor-create': 'sm:max-w-4xl',
   'supervisor-edit': 'sm:max-w-4xl',

   'officer-create': 'sm:max-w-4xl',
   'officer-edit': 'sm:max-w-4xl',
}

const dialogUI : ComputedRef <{ [key: string]: string }> = computed(() => ({
   base: 'relative text-left rtl:text-right overflow-visible flex flex-col',
   width: dialogWidth.value
}))

watch(() => store.dialog.show, async () => {
   if (!store.dialog.show) {
      store.clearDialog()
      setTimeout(() => {
         dialogWidth.value = 'sm:max-w-lg'
         dialogComponent.value = 'div'
      }, 300)
   } else {
      const component = componentMap[store.dialog.id]
      if (component) dialogComponent.value = (await component()).default
      else dialogComponent.value = resolveComponent('DialogPlaceholder')

      dialogWidth.value = widthMap[store.dialog.id] || 'sm:max-w-lg'
   }
})
</script>