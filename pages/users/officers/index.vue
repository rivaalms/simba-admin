<template>
<u-card>
   <app-data-table
      :columns="columns"
      :rows="rows"
      :total="dataLength"
      :loading="loading"
      @fetch="onTableEmit"
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
                  v-model="(filters.search as string)"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Cari nama/email/NIP..."
                  @keydown.enter="fetchOfficers(filters)"
                  @focus="showSearchHint = true"
                  @blur="showSearchHint = false"
               ></u-input>
            </u-form-group>

            <div class="col-span-2 col-end-13 flex items-end justify-end">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('officer-create', 'Tambah Diknas', null, () => fetchOfficers(filters))"
               >
                  Tambah Diknas
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
   </app-data-table>
</u-card>
</template>

<script setup lang="ts">
const store = useAppStore()

const columns : ComputedRef <Util.TableColumns[]> = computed(() => [
   { key: 'employee_number', label: 'NIP'},
   { key: 'user.name', label: 'Nama' },
   { key: 'user.email', label: 'Email' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' },
])

const rows : Ref <Model.Officer[]> = ref([])
const dataLength : Ref <number> = ref(0)
const loading : Ref <boolean> = ref(false)
const showSearchHint : Ref <boolean> = ref(false)
const filters = shallowRef <API.Request.Query.Officer> ({
   search: null,
   page: 1,
   per_page: 10
})

const actionMenu = (row: Model.Supervisor) => ([
   [
      {
         label: 'Lihat detail',
         icon: 'i-heroicons-document-magnifying-glass',
         click: () => { console.log(row) }
      },
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('officer-edit', 'Sunting Diknas', row, () => fetchOfficers(filters.value))
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('officer-delete', 'Hapus Diknas', row, () => fetchOfficers(filters.value))
      }
   ]
])

onBeforeMount(async () => {
   await fetchOfficers(filters.value)
})

const fetchOfficers = async (payload: API.Request.Query.Officer) => {
   loading.value = true
   await useGetOfficers(payload)
      .then(resp => {
         rows.value = resp.data
         dataLength.value = resp.total
      })
      .catch((error: API.Error) => store.notify('error', error.response?._data?.message || 'Error fetching officers'))
      .finally(() => loading.value = false)
}

const onTableEmit = async (emitData: { [key: string]: number | string }) => {
   for (const [key, value] of Object.entries(emitData)) {
      filters.value[key] = value
   }

   await fetchOfficers(filters.value)
}
</script>