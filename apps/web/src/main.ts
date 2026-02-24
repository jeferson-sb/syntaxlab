import { createApp } from "vue";
import { createPinia } from "pinia";
import { createPiniaPluginStorage } from "@erlihs/pinia-plugin-storage";

import "./style.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
pinia.use(createPiniaPluginStorage);
app.mount("#app");
