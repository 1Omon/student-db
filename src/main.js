import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Initialize auth state before mounting the app
store.dispatch('auth/initAuth').finally(() => {
  createApp(App)
    .use(store)
    .use(router)
    .mount('#app')
})