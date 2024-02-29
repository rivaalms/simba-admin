<script setup lang="ts">
type Props = {
   rows: Wildcard[]
   columns?: Util.TableColumns[]
   page?: number
   perPage?: number | string
   loading: boolean
   total: number
   pagination?: boolean
   filterable?: boolean
   filterCount?: number
}

type Emit = {
   (
      e: 'update',
      value: {
         page: number
         per_page: string | number
      }
   ) : void
}

const dayjs = useDayjs()

const props = withDefaults(defineProps<Props>(), {
   rows: () => [] as Wildcard[],
   total: 0,
   pagination: true,
   filterCount: 0,
   filterable: false,
})

const emit = defineEmits<Emit>()

const data = computed(() => props.rows || [])
const pageCount = computed(() => (props.perPage as number) * 1 || 0)
const total = computed(() => props.total || 0)

const page = computed({
   get() {
      return props.page
   },
   set(value) {
      emit('update', { page: value!, per_page: perPage.value! })
   }
})

const perPage = computed({
   get() {
      return props.perPage?.toString()
   },
   set(value) {
      emit('update', { page: page.value!, per_page: value! })
   }
})

const perPageOptions = computed(() => ['10', '25', '50', '100'])

const mapStatusColor = (id: number) => {
   switch (id) {
      case 1:
         return 'gray'
      case 2:
         return 'emerald'
      case 3:
         return 'amber'
      case 4:
         return 'cyan'
      default:
         return 'primary'
   }
}

const popperUi = computed(() => ({
   base: "overflow-visible",
   overlay: {
      background: 'bg-gray-100/75'
   }
}))
</script>

<template>
   <div class="grid gap-4 text-sm">
      <div class="flex justify-between items-center gap-4">
         <u-popover v-if="filterable" :ui="popperUi" :popper="{ placement: 'bottom-start' }" overlay>
            <u-chip :show="filterCount > 0" size="xl" :text="filterCount || ''">
               <u-button
                  color="white"
                  label="Filter"
               >
                  <template #leading>
                     <u-icon name="i-heroicons-funnel"></u-icon>
                  </template>
               </u-button>
            </u-chip>

            <template #panel>
               <slot name="filter"/>
            </template>
         </u-popover>

         <div class="flex-1">
            <slot name="header"/>
         </div>
      </div>

      <u-table
         :rows="data"
         :columns="props.columns"
         :loading="props.loading"
      >
         <template #empty-state>
            <div class="flex flex-col items-center justify-center py-6 gap-3">
               <u-icon name="i-heroicons-circle-stack-20-solid"></u-icon>
               <span class="text-sm">
                  Data tidak tersedia
               </span>
            </div>
         </template>

         <template #created_at-data="{ row }">
            {{ dayjs(row.created_at).format('DD MMM YYYY | HH:mm') }}
         </template>

         <template #updated_at-data="{ row }">
            {{ dayjs(row.updated_at).format('DD MMM YYYY | HH:mm') }}
         </template>

         <template #status.name-data="{ row }">
            <slot name="status" :row="row">
               <u-badge
                  :color="mapStatusColor(row.status?.id || 0)"
                  variant="subtle"
               >
                  {{ row.status?.name }}
               </u-badge>
            </slot>
         </template>

         <template #user.status-data="{ row }">
            <slot name="user-status" :row="row"></slot>
         </template>

         <template #actions-data="{ row }">
            <slot name="actions" :row="row"></slot>
         </template>
      </u-table>

      <div v-if="pagination" class="flex items-center justify-between gap-4">
         <div class="flex items-center gap-3">
            <span>Tampilkan</span>

            <u-select-menu
               v-model="perPage"
               :options="perPageOptions"
            ></u-select-menu>

            <span>entri</span>
         </div>

         <u-pagination
            v-model="(page as number)"
            :page-count="pageCount"
            :total="total"
         ></u-pagination>
      </div>
   </div>
</template>