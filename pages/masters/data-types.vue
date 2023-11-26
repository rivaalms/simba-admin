<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :total="dataLength"
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
                  v-model="(filter.search as string)"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Cari kategori data..."
                  @keyup.enter="fetchTypes"
                  @focus="showSearchHint = true"
                  @blur="showSearchHint = false"
               ></u-input>
            </u-form-group>
            <u-form-group
               class="col-span-3"
               label="Kategori"
            >
               <u-select-menu
                  v-model="(filter.category as number)"
                  :options="categoryOptions"
                  value-attribute="value"
                  searchable
                  searchable-placeholder="Cari..."
                  :search-attributes="['label']"
                  @update:model-value="fetchTypes()"
               >
                  <template #label>
                     {{ categoryOptions.find(item => item.value === filter.category)?.label || 'Pilih kategori...' }}
                  </template>

                  <template #option="{ option: category }">
                     <span v-if="category.value === null" class="text-gray-500 font-light truncate">
                        {{ category.label }}
                     </span>
                     <span v-else class="truncate">
                        {{ category.label }}
                     </span>
                  </template>
               </u-select-menu>
            </u-form-group>
            <div class="col-span-1 flex items-end justify-end col-end-13">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('data-type-create', 'Tambah Tipe Data', null, () => fetchTypes())"
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

const rows : Ref <Model.Data.Type[]> = ref([])
const columns = [
   { key: 'id', label: 'ID' },
   { key: 'name', label: 'Nama' },
   { key: 'category.name', label: 'Kategori' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' }
]

const dataLength : Ref <number> = ref(0)
const loading : Ref <boolean> = ref(false)
const filter : Ref <API.Request.Query.DataType> = shallowRef({
   search: null,
   category: null,
   per_page: 10,
   page: 1
})
const showSearchHint : Ref <boolean> = ref(false)
const categoryOptions : Ref <Util.SelectOption[]> = ref([])

const actionMenu = (row: Model.Data.Category) => ([
   [
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('data-type-edit', 'Sunting Tipe Data', row, () => fetchTypes())
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('data-type-delete', 'Hapus Tipe Data', row, () => fetchTypes())
      }
   ]
])

onBeforeMount(async () => {
   await fetchTypes()

   await getDataCategoryOptions()
      .then(resp => {
         categoryOptions.value = resp
         categoryOptions.value.unshift({
            label: 'Pilih kategori...',
            value: null
         })
      })
})

const fetchTypes = async () => {
   loading.value = true
   await getDataTypes(filter.value)
      .then(resp => {
         rows.value = resp.data
         dataLength.value = resp.total
      })
      .catch((error: API.Error) => store.notify('error', error.response?._data.message || `${error}`))
      .finally(() => loading.value = false)
}

const onTableEmit = async (emitData: { [key: string]: number | string }) => {
   for (const [key, value] of Object.entries(emitData)) {
      filter.value[key] = value
   }
   await fetchTypes()
}
</script>