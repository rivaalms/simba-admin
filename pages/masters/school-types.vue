<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :pagination="false"
      :loading="loading"
      :total="0"
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
                  placeholder="Cari tipe sekolah..."
                  @keyup.enter="fetchTypes"
                  @focus="showSearchHint = true"
                  @blur="showSearchHint = false"
               ></u-input>
            </u-form-group>
            <div class="col-span-1 flex items-end justify-end col-end-13">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('school-type-create', 'Tambah Tipe Sekolah', null, () => fetchTypes())"
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

const rows : Ref <Model.School.Type[]> = ref([])
const columns = [
   { key: 'id', label: 'ID' },
   { key: 'name', label: 'Nama' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' },
]

const loading : Ref <boolean> = ref(false)
const filter : Ref <API.Request.Query.SchoolType> = shallowRef({
   search: null
})

const showSearchHint : Ref <boolean> = ref(false)

const actionMenu = (row: Model.School.Type) => ([
   [
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('school-type-edit', 'Sunting Tipe Sekolah', row, () => fetchTypes())
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('school-type-delete', 'Hapus Tipe Sekolah', row, () => fetchTypes())
      }
   ]
])

onBeforeMount(async () => {
   await fetchTypes()
})

const fetchTypes = async () => {
   loading.value = true
   await getSchoolTypes(filter.value)
      .then(resp => {
         rows.value = resp
      })
      .catch((e: API.Error) => store.notify('error', e.response?._data?.message || `${e}`))
      .finally(() => loading.value = false)
}
</script>