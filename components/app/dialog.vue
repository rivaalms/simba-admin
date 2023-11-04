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

const componentMap : { [key: string]: string | Dialog.ResolveComponent } = {
   'data-create': resolveComponent('LazyDialogDataForm')
}
const widthMap : { [key: string]: string } = {
   'data-create': 'sm:max-w-2xl'
}

const dialogUI : ComputedRef <{ [key: string]: string }> = computed(() => ({
   base: 'relative text-left rtl:text-right overflow-visible flex flex-col',
   width: dialogWidth.value
}))

watch(() => store.dialog.show, () => {
   if (!store.dialog.show) {
      store.clearDialog()
      setTimeout(() => {
         dialogWidth.value = 'sm:max-w-lg'
         dialogComponent.value = 'div'
      }, 300)
   } else {
      const component = componentMap[store.dialog.id]
      if (component) dialogComponent.value = component
      else dialogComponent.value = resolveComponent('DialogPlaceholder')

      dialogWidth.value = widthMap[store.dialog.id] || 'sm:max-w-lg'
   }
})
</script>