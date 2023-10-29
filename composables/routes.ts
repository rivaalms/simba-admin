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
      label: 'Users',
      icon: 'i-heroicons-users',
      children: [
         {
            label: 'Schools',
            to: '/users/schools'
         },
         {
            label: 'Supervisors',
            to: '/users/supervisors'
         },
         {
            label: 'Officers',
            to: '/users/officers'
         }
      ]
   },
   {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      children: [
         {
            label: 'Data Statuses',
            to: '/settings/data-statuses'
         },
         {
            label: 'Data Categories',
            to: '/settings/data-categories'
         },
         {
            label: 'Data Types',
            to: '/settings/data-types'
         },
         {
            label: 'School Types',
            to: '/settings/school-types'
         }
      ]
   }
]