<template>
  <q-page padding class="text-center flex flex-center">
    <div>
      <q-card-section>
        <div class="text-h4 q-mb-lg text-grey-10">Вход</div>
        <q-input class="q-pb-md" filled label="Логин" v-model="login" />
        <q-input
          class="q-pb-md"
          filled
          label="Пароль"
          v-model="password"
          type="password"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn class="bg-light-blue-1 text-grey-10" flat @click="send"
          >Войти</q-btn
        >
      </q-card-actions>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      login: "admin",
      password: "123",
    };
  },
  methods: {
    async send() {
      const response = await this.$api.login({
        login: this.login,
        password: this.password,
      });

      if (response?.status && response?.status < 400) {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style>
.q-field {
  width: 250px;
}

.big-card {
  /* min-height: 300px; */
}
</style>
