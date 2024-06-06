<template>
   <div class="flex flex-col gap-4">
      <div class="grid grid-cols-12 gap-4">
         <u-card class="col-span-4 overflow-visible">
            <p class="text-sm text-gray-500 font-medium">Jumlah Data</p>
            <p class="text-2xl">{{ dataCount?.total }}</p>
         </u-card>

         <u-card class="col-span-4 overflow-visible">
            <p class="text-sm text-gray-500 font-medium">Jumlah Sekolah</p>
            <p class="text-2xl">{{ schoolCount }}</p>
         </u-card>

         <u-card class="col-span-4 overflow-visible">
            <p class="text-sm text-gray-500 font-medium">Jumlah Pengawas</p>
            <p class="text-2xl">{{ supervisorCount }}</p>
         </u-card>

         <u-card class="col-span-6 overflow-visible">
            <p class="text-sm text-gray-500 font-medium">
               Data Berdasarkan Status
            </p>
            <apexchart
               :series="dataByStatusSeries"
               :options="dataByStatusOptions"
            ></apexchart>
         </u-card>

         <u-card class="col-span-6 overflow-visible">
            <p class="text-sm text-gray-500 font-medium">
               Data Berdasarkan Kategori
            </p>
            <apexchart
               :series="dataByCategorySeries"
               :options="dataByCategoryOptions"
            ></apexchart>
         </u-card>

         <u-card class="col-span-12 overflow-visible">
            <p class="text-sm text-gray-500 font-medium">
               Data Berdasarkan Tipe
            </p>
            <apexchart
               :series="dataByTypeSeries"
               :options="dataByTypeOptions"
            ></apexchart>
         </u-card>
      </div>
      <!-- <div class="grid grid-cols-2 gap-4">
      </div> -->
   </div>
</template>

<script setup lang="ts">
const store = useAppStore()
store.setPageTitle('Dashboard')
const dayjs = useDayjs()
const authStore = useAuthStore()

const countDataFilter = ref<API.Request.Query.YearRange>({
   start_year: dayjs().subtract(1, 'year').year(),
   end_year: dayjs().year()
})

const { data: dataCount, pending: dataCountLoading, refresh: fetchDataCount } = await useLazyAsyncData(
   'count-data',
   () => countData(countDataFilter.value),
   {
      watch: [() => countDataFilter.value.start_year, () => countDataFilter.value.end_year]
   }
)

const dataByStatusOptions = computed(() => {
   if (!dataCount.value) return {}

   const { data_by_status } = dataCount.value as Util.DataCount

   const labels = data_by_status.map(item => item.name)
   return {
      chart: {
         type: 'donut'
      },
      labels,
      dataLabels: {
         enabled: true,
         formatter: (val: number, { seriesIndex, w }: any) => {
            return w.config.series[seriesIndex]
         }
      },
      legend: {
         show: true,
         position: 'bottom'
      }
   }
})

const dataByStatusSeries = computed<number[]>(() => {
   if (!dataCount.value) return []
   const { data_by_status } = dataCount.value as Util.DataCount

   const values = data_by_status.map(item => item.count)
   return values
})

const dataByCategoryOptions = computed(() => {
   if (!dataCount.value) return {}

   const { data_by_category } = dataCount.value as Util.DataCount

   const labels = data_by_category.map(item => item.name)
   return {
      chart: {
         type: 'donut'
      },
      labels,
      dataLabels: {
         enabled: true,
         formatter: (val: number, { seriesIndex, w }: any) => {
            return w.config.series[seriesIndex]
         }
      },
      legend: {
         show: true,
         position: 'bottom'
      }
   }
})

const dataByCategorySeries = computed<number[]>(() => {
   if (!dataCount.value) return []
   const { data_by_category } = dataCount.value as Util.DataCount

   return data_by_category.map(item => item.count)
})

const dataByTypeOptions = computed(() => {
   if (!dataCount.value) return {}

   let labels: string[] = []
   const { data_by_category } = dataCount.value as Util.DataCount

   data_by_category.forEach(item => {
      labels.push(...item.data_by_type.map(item2 => item2.name))
   })

   return {
      chart: {
         type: 'bar'
      },
      labels,
      dataLabels: {
         enabled: false,
         formatter: (val: number, { seriesIndex, w }: any) => {
            return w.config.series[seriesIndex]
         }
      }
   }
})

const dataByTypeSeries = computed(() => {
   if (!dataCount.value) return []

   const { data_by_category } = dataCount.value as Util.DataCount

   let data: number[] = []
   data_by_category.forEach(item => {
      data.push(...item.data_by_type.map(item2 => item2.count))
   })

   return [
      {
         name: 'Data',
         data
      }
   ]
})

const { data: userCount } = await useLazyAsyncData(
   'count-user',
   () => countUser(),
)

const schoolCount = computed(() => userCount.value?.user_by_type.school || 0)

const supervisorCount = computed(() => userCount.value?.user_by_type.supervisor)
</script>