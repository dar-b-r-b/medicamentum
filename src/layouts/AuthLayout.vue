<template>
  <q-layout view="hHh LpR lfr">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      loginUrl: "/auth/login",
      registerUrl: "/auth/register",
    };
  },

  mounted() {},
};
</script>

<style>
.router-link-active {
  background-color: rgba(33, 33, 189, 0.486);
}
</style>
