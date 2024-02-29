<template>
<u-card>
   <data-table
      :columns="columns"
      :rows="rows"
      :total="dataLength"
      :loading="loading"
      @fetch="onTableEmit"
   >
      <template #header>
         <div class="flex-1 flex justify-between items-center gap-4">
            <u-button-group>
               <u-input
                  v-model="(filter.search as string)"
                  placeholder="Cari nama/email/NIP..."
                  class="flex-1"
                  input-class="focus:ring-inset"
                  @keydown.enter="fetchSupervisors()"
               ></u-input>

               <u-tooltip v-if="!!filter.search" text="Hapus filter">
                  <u-button
                     color="white"
                     icon="i-heroicons-x-mark"
                     class="rounded-none"
                     @click.stop="async () => {
                        filter.search = null
                        await fetchSupervisors()
                     }"
                  ></u-button>
               </u-tooltip>

               <u-button
                  color="white"
                  class="rounded-e-md"
                  icon="i-heroicons-magnifying-glass"
                  @click.stop="fetchSupervisors()"
               >
                  Cari
               </u-button>
            </u-button-group>

            <u-button
               icon="i-heroicons-plus"
               @click.stop="store.showDialog('supervisor-create', 'Tambah Pengawas', null, () => fetchSupervisors())"
            >
               Tambah Pengawas
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

store.setPageTitle('Daftar Pengawas')

const columns : ComputedRef <Util.TableColumns[]> = computed(() => [
   { key: 'employee_number', label: 'NIP'},
   { key: 'user.name', label: 'Nama' },
   { key: 'user.email', label: 'Email' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' },
])

const dataLength : Ref <number> = ref(0)
const filter : Ref <API.Request.Query.Supervisor> = ref({
   search: null,
   page: 1,
   per_page: 10
})

const { data: rows, pending: loading, refresh: fetchSupervisors } = await useLazyAsyncData(
   'fetch-supervisor',
   () => getSupervisors(filter.value),
   {
      transform: (resp) => {
         dataLength.value = resp.total
         return resp.data
      },
      default: () => [] as Model.Supervisor[]
   }
)

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

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchSupervisors()
})
</script>