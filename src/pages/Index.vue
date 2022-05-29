<template>
  <q-page>
    <q-img style="height: calc(100vh - 80px)" fit="cover" src="main.jpeg">
      <div align="center" class="absolute-full text-h1 flex flex-center">
        Анализ совместимости лекарственных средств с анамнезом пациента
      </div>
    </q-img>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
    };
  },
  created() {
    const user = this.$q.cookies.get("user");

    if (!user) this.$router.push("/auth/login");

    this.userName = [user?.last_name, user?.name, user?.middle_name].join(" ");
  },
};
</script>
