<template>
<u-card>
   <data-table
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
                  v-model="(filter.search as string)"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Cari nama/email/NIP..."
                  @keydown.enter="fetchSupervisors()"
                  @focus="showSearchHint = true"
                  @blur="showSearchHint = false"
               ></u-input>
            </u-form-group>

            <div class="col-span-2 col-end-13 flex items-end justify-end">
               <u-button
                  icon="i-heroicons-plus"
                  @click.stop="store.showDialog('supervisor-create', 'Tambah Pengawas', null, () => fetchSupervisors())"
               >
                  Tambah Pengawas
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

const columns : ComputedRef <Util.TableColumns[]> = computed(() => [
   { key: 'employee_number', label: 'NIP'},
   { key: 'user.name', label: 'Nama' },
   { key: 'user.email', label: 'Email' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' },
])

const rows : Ref <Model.Supervisor[]> = ref([])
const dataLength : Ref <number> = ref(0)
const loading : Ref <boolean> = ref(false)
const showSearchHint : Ref <boolean> = ref(false)
const filter = shallowRef <API.Request.Query.Supervisor> ({
   search: null,
   page: 1,
   per_page: 10
})

const actionMenu = (row: Model.Supervisor) => ([
   [
      {
         label: 'Lihat detail',
         icon: 'i-heroicons-document-magnifying-glass',
         click: () => useRouter().push(`/users/supervisors/${row.id}`)
      },
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('supervisor-edit', 'Sunting Pengawas', row, () => fetchSupervisors())
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('supervisor-delete', 'Hapus Pengawas', row, () => fetchSupervisors())
      }
   ]
])

onBeforeMount(async () => {
   await fetchSupervisors()
})

const fetchSupervisors = async () => {
   loading.value = true
   await getSupervisors(filter.value)
      .then(resp => {
         rows.value = resp.data
         dataLength.value = resp.total
      })
      .finally(() => loading.value = false)
}

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchSupervisors()
})
</script>