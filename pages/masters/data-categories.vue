<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :pagination="dataLength > 0"
      :loading="loading"
      :total="dataLength"
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
                  @keyup.enter="fetchCategories"
               ></u-input>

               <u-tooltip v-if="!!filter.search" text="Hapus filter">
                  <u-button
                     color="white"
                     icon="i-heroicons-x-mark"
                     class="rounded-none"
                     @click.stop="async () => {
                        filter.search = null
                        await fetchCategories()
                     }"
                  ></u-button>
               </u-tooltip>

               <u-button
                  color="white"
                  class="rounded-e-md"
                  icon="i-heroicons-magnifying-glass"
                  @click.stop="fetchCategories()"
               >
                  Cari
               </u-button>
            </u-button-group>

            <u-button
               icon="i-heroicons-plus"
               @click.stop="store.showDialog('data-category-create', 'Tambah Kategori Data', null, () => fetchCategories())"
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

store.setPageTitle('Kategori Data')

const columns = [
   { key: 'id', label: 'ID' },
   { key: 'name', label: 'Nama' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' }
]

const dataLength : Ref <number> = ref(0)
const filter : Ref <API.Request.Query.DataCategory> = ref({
   search: null
})
const { data: rows, pending: loading, refresh: fetchCategories } = await useLazyAsyncData(
   'fetch-categories',
   () => getDataCategories(filter.value),
   {
      transform: (resp) => {
         const data = resp as Util.LaravelPagination <Model.Data.Category[]>
         dataLength.value = data.total
         return data.data
      },
      default: () => [] as Model.Data.Category[]
   }
)

const actionMenu = (row: Model.Data.Category) => ([
   [
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('data-category-edit', 'Sunting Kategori Data', row, () => fetchCategories())
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('data-category-delete', 'Hapus Kategori Data', row, () => fetchCategories())
      }
   ]
])

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchCategories()
})
</script>