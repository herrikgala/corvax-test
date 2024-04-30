import { createApp } from "vue";
import "./style.css";
import { createWebHistory, createRouter } from "vue-router";
import App from "./App.vue";

import Client from "./components/Client.vue";
import Admin from "./components/Admin.vue";

const routes = [
  { path: "/", redirect: "/client" },
  { path: "/client", component: Client },
  { path: "/admin", component: Admin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.mount("#app");
