<template>
  <q-layout view="hHh LpR lfr">
    <q-header elevated class="q-py-md bg-white text-grey-8" color="primary">
      <q-tabs align="center">
        <q-route-tab
          tag="a"
          :label="link.title"
          :to="link.link"
          v-for="link in essentialLinks"
          :key="link.title"
        />
        <q-btn flat class="q-mr-xl bg-light-blue-1" @click="logout"
          >Выйти</q-btn
        >
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      essentialLinks: [],
    };
  },
  methods: {
    async logout() {
      await this.$api.logout();
      this.$router.push("/auth/login");
    },
  },
  created() {
    const linksList = [];
    const userRoleId = +this.$q.cookies.get("user")?.role_id;

    if ([1, 2].includes(userRoleId))
      linksList.unshift({
        title: "Пациенты",
        caption: "пациенты",
        link: "/patient",
      });

    if ([1, 3, 2].includes(userRoleId)) {
      linksList.push({
        title: "Лекарства",
        caption: "лекарства",
        link: "/drug",
      });
    }
    if ([1, 3].includes(userRoleId)) {
      linksList.push({
        title: "Компоненты",
        caption: "компоненты",
        link: "/component",
      });
    }

    linksList.push({
      title: "Сопоставить лекарство",
      caption: "сопоставить лекарство",
      link: "/set_drug",
    });

    this.essentialLinks = linksList;
  },
};
</script>

<style>
.q-tab:first-child,
.q-tabs .q-btn {
  margin-left: auto;
}
</style>
