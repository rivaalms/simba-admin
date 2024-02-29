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
                  @keydown.enter="fetchOfficers()"
               ></u-input>

               <u-tooltip v-if="!!filter.search" text="Hapus filter">
                  <u-button
                     color="white"
                     icon="i-heroicons-x-mark"
                     class="rounded-none"
                     @click.stop="async () => {
                        filter.search = null
                        await fetchOfficers()
                     }"
                  ></u-button>
               </u-tooltip>

               <u-button
                  color="white"
                  class="rounded-e-md"
                  icon="i-heroicons-magnifying-glass"
                  @click.stop="fetchOfficers()"
               >
                  Cari
               </u-button>
            </u-button-group>

            <u-button
               icon="i-heroicons-plus"
               @click.stop="store.showDialog('officer-create', 'Tambah Diknas', null, () => fetchOfficers())"
            >
               Tambah Diknas
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

store.setPageTitle('Daftar Officer')

const columns : ComputedRef <Util.TableColumns[]> = computed(() => [
   { key: 'employee_number', label: 'NIP'},
   { key: 'user.name', label: 'Nama' },
   { key: 'user.email', label: 'Email' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions', label: '' },
])

const dataLength : Ref <number> = ref(0)
const filter : Ref <API.Request.Query.Officer> = ref({
   search: null,
   page: 1,
   per_page: 10
})

const { data: rows, pending: loading, refresh: fetchOfficers } = await useLazyAsyncData(
   'fetch-officers',
   () => getOfficers(filter.value),
   {
      transform: (resp) => {
         dataLength.value = resp.total
         return resp.data
      },
      default: () => [] as Model.Officer[]
   }
)

const actionMenu = (row: Model.Supervisor) => ([
   [
      {
         label: 'Lihat detail',
         icon: 'i-heroicons-document-magnifying-glass',
         click: () => navigateTo(`/users/officers/${row.id}`)
      },
      {
         label: 'Sunting',
         icon: 'i-heroicons-pencil-square',
         click: () => store.showDialog('officer-edit', 'Sunting Diknas', row, () => fetchOfficers())
      },
   ],
   [
      {
         label: 'Hapus',
         icon: 'i-heroicons-trash',
         slot: 'delete',
         click: () => store.showDialog('officer-delete', 'Hapus Diknas', row, () => fetchOfficers())
      }
   ]
])

onBeforeMount(async () => {
   await fetchOfficers()
})

const onTableEmit = async (data: any) => await mapFilters(data, filter.value).then(async (resp) => {
   filter.value = resp
   await fetchOfficers()
})
</script>