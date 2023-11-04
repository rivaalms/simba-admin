<template>
<div class="grid grid-cols-1 gap-4">
   <slot name="filters"></slot>

   <u-table
      :columns="props.columns"
      :rows="props.rows"
      :loading="loading"
   >
      <template #actions-data="{ row }">
         <slot name="actions" :row="row"></slot>
      </template>

      <template #updated_at-data="{ row }">
         {{ dayjs(row.updated_at).format('DD MMM YY, HH:mm') }}
      </template>

      <template #created_at-data="{ row }">
         {{ dayjs(row.created_at).format('DD MMM YY, HH:mm') }}
      </template>

      <template #status.name-data="{ row }">
         <slot name="status" :row="row"></slot>
      </template>
   </u-table>

   <div class="flex justify-between items-center text-sm">
      <div class="flex items-center gap-3">
         Tampilkan
         <u-select-menu
            v-model="perPage"
            :options="perPageOptions"
            size="xs"
            @update:model-value="onEmit"
         ></u-select-menu>
         entri
      </div>

      <u-pagination
         v-model="page"
         :page-count="perPage"
         :total="props.total"
         :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', color: 'gray' }"
         :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, color: 'gray' }"
         @update:model-value="onEmit"
      ></u-pagination>
   </div>
</div>
</template>

<script setup lang="ts">
const dayjs = useDayjs()

const props = defineProps<{
   columns: Util.TableColumns[],
   rows: any
   total: number
   loading: boolean
}>()

const emit = defineEmits(['fetch'])

const page : Ref <number> = ref(1)
const perPage: Ref <number> = ref(10)
const perPageOptions: ComputedRef <string[]> = computed(() => ['5', '10', '25', '50', '100'])

const onEmit = () => {
   emit('fetch', {
      page: page.value,
      per_page: perPage.value
   })
}
</script>