<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :total="dataLength"
      :pagination="dataLength > 0"
      @fetch="onTableEmit"
   >
      <template #filters>
         <div class="grid grid-cols-12 gap-4">
            <u-form-group
               class="col-span-3"
               label="Cari"
            >
               <u-button-group class="w-full">
                  <u-input
                     v-model="(filter.search as string)"
                     placeholder="Cari kategori data..."
                     class="flex-1"
                     input-class="focus:ring-inset"
                     @keyup.enter="fetchSubjects"
                  ></u-input>

                  <u-tooltip v-if="!!filter.search" text="Hapus filter">
                     <u-button
                        color="white"
                        icon="i-heroicons-x-mark"
                        class="rounded-none"
                        @click.stop="async () => {
                           filter.search = null
                           await fetchSubjects()
                        }"
                     ></u-button>
                  </u-tooltip>

                  <u-button
                     color="white"
                     icon="i-heroicons-magnifying-glass"
                     @click.stop="fetchSubjects()"
                  >
                     Cari
                  </u-button>
               </u-button-group>
            </u-form-group>

            <div class="col-span-1 flex items-end justify-end col-end-13">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('subject-create', 'Tambah Mata Pelajaran', null, () => fetchSubjects())"
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

store.setPageTitle('Mata Pelajaran')

const rows : Ref <Util.Subject[]> = ref([])
const columns = [
   { key: 'id', label: 'ID' },
   { key: 'name', label: 'Nama' },
   { key: 'abbreviation', label: 'Singkatan' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' },
]

const dataLength : Ref <number> = ref(0)
const loading : Ref <boolean> = ref(false)
const filter : Ref <API.Request.Query.Subject> = ref({
   search: null,
   page: 1,
   per_page: 10
})

const actionMenu = (row: Util.Subject) => ([
   [
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('subject-edit', 'Sunting Mata Pelajaran', row, () => fetchSubjects())
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('subject-delete', 'Hapus Mata Pelajaran', row, () => fetchSubjects())
      }
   ]
])

onBeforeMount(async () => {
   await fetchSubjects()
})

const fetchSubjects = async () => {
   loading.value = true
   await getSubjects(filter.value)
      .then(resp => {
         rows.value = (resp as Util.LaravelPagination <Util.Subject[]>).data || resp as Util.Subject[]
         dataLength.value = (resp as Util.LaravelPagination <Util.Subject[]>).data ? (resp as Util.LaravelPagination <Util.Subject[]>).total : 0
      })
      .finally(() => loading.value = false)
}

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchSubjects()
})
</script>