<template>
<main class="h-screen">
   <div class="h-full flex justify-center items-center">
      <u-card class="w-1/3">
         <div class="grid grid-cols-1 gap-4">
            <p class="font-bold">Login</p>

            <u-form
               :schema="validator"
               :state="state"
               :validate-on="['submit']"
               @submit="submit"
            >
            <div class="grid grid-cols-1 gap-4">
                  <u-form-group
                     label="Email"
                     name="email"
                  >
                     <u-input
                        v-model="state.email"
                        name="email"
                        type="email"
                        icon="i-heroicons-envelope"
                     ></u-input>
                  </u-form-group>

                  <u-form-group
                     label="Password"
                     name="password"
                  >
                     <u-input
                        v-model="state.password"
                        name="password"
                        icon="i-heroicons-lock-closed"
                        autocomplete
                        :type="showPassword ? 'text' : 'password'"
                     ></u-input>
                  </u-form-group>

                  <div class="flex justify-between items-center gap-2">
                     <u-checkbox
                        v-model="showPassword"
                        label="Show password?"
                     ></u-checkbox>
                     <u-button
                        icon="i-heroicons-arrow-right-on-rectangle"
                        type="submit"
                        :loading="loading"
                     >
                        Log In
                     </u-button>
                  </div>
               </div>
            </u-form>
         </div>
      </u-card>
   </div>
</main>
</template>

<script setup lang="ts">
import * as yup from 'yup'

const authStore = useAuthStore()
const store = useAppStore()

definePageMeta({
   layout: false
})

const validator = yup.object({
   email: yup.string().email('Invalid email format').required('Email is required'),
   password: yup.string().required('Password is required')
})

const state : Ref <API.Request.Login> = ref({
   email: '',
   password: ''
})
const showPassword : Ref <boolean> = ref(false)
const loading : Ref <boolean> = ref(false)

const submit = async () => {
   loading.value = true

   await authStore.login(state.value)
      .then(resp => {
         store.notify('success', 'Log in success', 'login')
         navigateTo('/')
      })
      .catch((error: API.Error) => {
         store.notify('error', error.response._data.message!)
         state.value.password = ''
      })
      .finally(() => loading.value = false)
}
</script>