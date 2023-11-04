<template>
<div class="relative h-[100dvh] overflow-y-hidden">
   <app-header
      class=" left-0 top-0"
   />

   <div class="flex h-[calc(100dvh-57px)] overflow-hidden">
      <aside class="absolute left-0 top-0 z-50 h-[calc(100dvh-57px)] hidden lg:block lg:static lg:translate-x-0 w-60 px-2 py-2 border-r-[1px] overflow-y-auto">
         <app-sidebar/>
      </aside>

      <div ref="main" class="relative flex-1 overflow-y-auto bg-gray-100 flex flex-col">
         <main class="flex-grow p-2">
            <slot/>
         </main>
      </div>
   </div>
</div>

<lazy-app-dialog></lazy-app-dialog>
</template>