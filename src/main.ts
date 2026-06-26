import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { useUserStore } from "./stores/user";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

router.beforeEach(async (to) => {
  const userStore = useUserStore(pinia);
  await userStore.initAuth();

  if (to.meta.requiresAuth && !userStore.user) {
    return { name: "Plans" };
  }
});

app.mount("#app");
