import { createApp } from "vue";
import { auth, onAuthStateChanged } from "@/includes/firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VeeValidationPlugin from "./includes/validation";

import "./assets/tailwind.css";
import "./assets/main.css";

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidationPlugin);

    app.mount("#app");
  }
});
