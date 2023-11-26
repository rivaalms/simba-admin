<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const dayjs = useDayjs()
const props = withDefaults(defineProps<{
   modelValue?: Date | string | null,
   mode?: string[]
   autoApply?: boolean
}>(), {
   modelValue: (useDayjs())().format('YYYY'),
   mode: undefined,
   autoApply: true
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
   get: () => props.modelValue,
   set: (value) => {
      emit('update:model-value', value)
      emit('close')
   }
})
</script>

<template>
<vue-date-picker
   v-model="date"
   :year-picker="props.mode?.includes('year-picker')"
   :auto-apply="props.autoApply"
>
   <template #trigger>
      <slot></slot>
   </template>
</vue-date-picker>
</template>
