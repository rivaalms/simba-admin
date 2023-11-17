export const useRoutes : Util.Router[] = [
   {
      label: 'Dashboard',
      to: '/',
      icon: 'i-heroicons-rectangle-group'
   },
   {
      label: 'Data',
      to: '/data',
      icon: 'i-heroicons-circle-stack'
   },
   {
      label: 'Pengguna',
      icon: 'i-heroicons-users',
      children: [
         {
            label: 'Sekolah',
            to: '/users/schools'
         },
         {
            label: 'Pengawas',
            to: '/users/supervisors'
         },
         {
            label: 'Officers',
            to: '/users/officers'
         }
      ]
   },
   {
      label: 'Data Master',
      icon: 'i-heroicons-cog-8-tooth',
      children: [
         {
            label: 'Status Data',
            to: '/masters/data-statuses'
         },
         {
            label: 'Kategori Data',
            to: '/masters/data-categories'
         },
         {
            label: 'Tipe Data',
            to: '/masters/data-types'
         },
         {
            label: 'Tipe Sekolah',
            to: '/masters/school-types'
         },
         {
            label: 'Mata Pelajaran',
            to: '/masters/subjects'
         },
         {
            label: 'Agama',
            to: '/masters/religions'
         }
      ]
   }
]