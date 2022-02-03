<template>
  <!-- eslint-disable max-len -->
  <div>
    <app-header />
    <router-view></router-view>

    <!-- Player -->
    <app-player />

    <app-auth />
  </div>
</template>

<script>
import AppHeader from "./components/Header.vue";
import AppAuth from "./components/Auth.vue";
import AppPlayer from "./components/Player.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  created() {
    this.$store.dispatch("init_login");
  },
};
</script>
