import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-plugin-persistedstate";

const app = createApp(App)
const pinia = createPinia()
const persist = createPersistedState()


app.use(router)
app.use(ElementPlus)
app.use(pinia)
pinia.use(persist)
app.mount('#app')
