<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :pagination="dataLength > 0"
      :total="dataLength"
      @fetch="onTableEmit"
   >
      <template #header>
         <div class="flex-1 flex justify-between items-center gap-4">
            <div class="flex items-center gap-4">
               <u-button-group>
                  <u-input
                     v-model="(filter.search as string)"
                     placeholder="Cari kategori data..."
                     class="flex-1"
                     input-class="focus:ring-inset"
                     @keyup.enter="fetchTypes"
                  ></u-input>

                  <u-tooltip v-if="!!filter.search" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-none"
                        @click.stop="async () => {
                           filter.search = null
                           await fetchTypes()
                        }"
                     ></u-button>
                  </u-tooltip>

                  <u-button
                     color="white"
                     icon="i-heroicons-magnifying-glass"
                     @click.stop="fetchTypes()"
                  >
                     Cari
                  </u-button>
               </u-button-group>

               <u-button-group>
                  <u-select-menu
                     v-model="(filter.category as number)"
                     :options="categoryOptions"
                     value-attribute="value"
                     class="flex-1"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     @update:model-value="fetchTypes()"
                  >
                     <template #label>
                        {{ categoryOptions.find(item => item.value === filter.category)?.label || 'Pilih kategori...' }}
                     </template>
                  </u-select-menu>

                  <u-tooltip v-if="!!filter.category" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-s-none"
                        @click.stop="async () => {
                           filter.category = null
                           await fetchTypes()
                        }"
                     ></u-button>
                  </u-tooltip>
               </u-button-group>
            </div>

            <u-button
               icon="i-heroicons-plus"
               @click.stop="store.showDialog('data-type-create', 'Tambah Tipe Data', null, () => fetchTypes())"
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

store.setPageTitle('Tipe Data')

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
const filter : Ref <API.Request.Query.DataType> = ref({
   search: null,
   category: null,
   per_page: 10,
   page: 1
})
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
      })
})

const fetchTypes = async () => {
   loading.value = true
   await getDataTypes(filter.value)
      .then(resp => {
         rows.value = (resp as Util.LaravelPagination<Model.Data.Type[]>).data || resp as Model.Data.Type[]
         dataLength.value = (resp as Util.LaravelPagination<Model.Data.Type[]>).total || 0
      })
      .finally(() => loading.value = false)
}

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchTypes()
})
</script>