<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :pagination="false"
      :total="rows.length"
      :loading="loading"
   >
      <template #filters>
         <div class="grid grid-cols-12 gap-4">
            <u-form-group
               class="col-span-3"
               label="Cari"
            >
               <template #hint>
                  <span v-if="showSearchHint" class="text-xs">
                     <u-kbd size="xs">Enter</u-kbd> untuk mencari
                  </span>
               </template>
               <u-input
                  v-model="(filter.search as string)"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Cari status data..."
                  @keyup.enter="fetchStatus"
                  @focus="showSearchHint = true"
                  @blur="showSearchHint = false"
               ></u-input>
            </u-form-group>
            <div class="col-span-2 flex items-end justify-end col-end-13">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('data-status-create', 'Tambah Status Data', null, () => fetchStatus())"
               >
                  Tambah
               </u-button>
            </div>
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

const rows : Ref <Model.Data.Status[]> = ref([])
const columns = [
   { key: 'id', label: 'ID' },
   { key: 'name', label: 'Nama' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' }
]
const loading : Ref <boolean> = ref(false)
const filter : Ref <API.Request.Query.DataStatus> = shallowRef({
   search: null
})
const showSearchHint : Ref <boolean> = ref(false)

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

onBeforeMount(async () => {
   await fetchStatus()
})

const fetchStatus = async () => {
   loading.value = true
   await getDataStatus(filter.value)
      .then(resp => {
         rows.value = resp
      })
      .catch((error: API.Error) => store.notify('error', error.response?._data?.message! || `${error}`))
      .finally(() => loading.value = false)
}
</script>