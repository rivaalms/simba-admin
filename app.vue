<template>
   <nuxt-layout>
      <nuxt-page/>

      <u-notifications>
         <template #title="{ title }">
            <p class="font-semibold">{{ title }}</p>
         </template>
      </u-notifications>
   </nuxt-layout>
</template>
