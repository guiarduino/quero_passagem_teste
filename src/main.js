import './assets/main.css'
import 'vue-toast-notification/dist/theme-sugar.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
