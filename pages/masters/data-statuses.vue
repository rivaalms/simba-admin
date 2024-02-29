<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :pagination="dataLength > 0"
      :total="dataLength"
      :loading="loading"
      @fetch="onTableEmit"
   >
      <template #header>
         <div class="flex-1 flex justify-between items-center gap-4">
            <u-button-group>
               <u-input
                  v-model="(filter.search as string)"
                  placeholder="Cari kategori data..."
                  class="flex-1"
                  input-class="focus:ring-inset"
                  @keyup.enter="fetchStatus"
               ></u-input>

               <u-tooltip v-if="!!filter.search" text="Hapus filter">
                  <u-button
                     color="white"
                     icon="i-heroicons-x-mark"
                     class="rounded-none"
                     @click.stop="async () => {
                        filter.search = null
                        await fetchStatus()
                     }"
                  ></u-button>
               </u-tooltip>

               <u-button
                  color="white"
                  class="rounded-e-md"
                  icon="i-heroicons-magnifying-glass"
                  @click.stop="fetchStatus()"
               >
                  Cari
               </u-button>
            </u-button-group>

            <u-button
               icon="i-heroicons-plus"
               @click.stop="store.showDialog('data-status-create', 'Tambah Status Data', null, () => fetchStatus())"
            >
               Tambah
            </u-button>
         </div>
      </template>

      <template #actions="{ row }">
         <u-dropdown
            :items="actionMenu(row)"
         >
            <u-button
               color="gray"
               variant="ghost"
               icon="i-heroicons-ellipsis-vertical"
            ></u-button>

            <template #delete="{ item }">
               <u-icon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-red-400 dark:text-red-500"></u-icon>
               <span class="truncate text-red-400 dark:text-red-500">{{ item.label }}</span>
            </template>
         </u-dropdown>
      </template>
   </data-table>
</u-card>
</template>

<script setup lang="ts">
const store = useAppStore()

store.setPageTitle('Status Data')

const columns = [
   { key: 'id', label: 'ID' },
   { key: 'name', label: 'Nama' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' }
]

const dataLength : Ref <number> = ref(0)
const filter : Ref <API.Request.Query.DataStatus> = ref({
   search: null
})

const { data: rows, pending: loading, refresh: fetchStatus } = await useLazyAsyncData(
   'fetch-status',
   () => getDataStatus(filter.value),
   {
      transform: (resp) => {
         const data = resp as Util.LaravelPagination<Model.Data.Status[]>
         dataLength.value = data.total
         return data.data
      },
      default: () => [] as Model.Data.Status[]
   }
)

const actionMenu = (row: Model.Data.Status) => ([
   [
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('data-status-edit', 'Sunting Status Data', row, () => fetchStatus())
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('data-status-delete', 'Hapus Status Data', row, () => fetchStatus())
      }
   ]
])

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchStatus()
})
</script>