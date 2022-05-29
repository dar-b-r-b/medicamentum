<template>
  <br />
  <label>Логин</label>
  <input v-model="login" />

  <label>Пароль</label>
  <input type="password" v-model="password" />
  <br />

  <label>Фамилия</label>
  <input v-model="last_name" />

  <label>Имя</label>
  <input v-model="name" />

  <label>Отчество</label>
  <input v-model="middle_name" />
  <br />

  <label>Должность</label>
  <input v-model="position" />
  <br />

  <button @click="send">Отправить</button>
</template>

<script>
export default {
  data() {
    return {
      login: "admin",
      password: "123",
      last_name: "Иванов",
      name: "Иван",
      middle_name: "Иванович",
      role_id: 0,
    };
  },
  methods: {
    async send() {
      const response = await this.$api.register({
        login: this.login,
        password: this.password,
        last_name: this.last_name,
        name: this.name,
        middle_name: this.middle_name,
        role_id: this.role_id,
      });

      if (response?.status && response?.status < 400) {
        this.$router.push("/");
      }
    },
  },
};
</script>
