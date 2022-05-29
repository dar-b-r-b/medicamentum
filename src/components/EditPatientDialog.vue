<template>
  <q-dialog
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    ref="dialog"
  >
    <q-card class="q-dialog-plugin column no-wrap">
      <q-card-section class="flex row-reverse justify-end">
        <q-btn dense flat icon="close" @click="onCancelClick">
          <q-tooltip class="text-white" content-class="bg-white"
            >Закрыть</q-tooltip
          >
        </q-btn>
      </q-card-section>
      <q-card-section class="flex row">
        <span class="text-h4 q-pl-xl">{{
          id ? "Редактировать" : "Добавить нового пациента"
        }}</span>
      </q-card-section>
      <q-card-section class="content row justify-between">
        <div class="q-pl-xl">
          <q-input label="Фамилия" v-model="last_name" />
          <q-input label="Имя" v-model="name" />
          <q-input label="Отчество" v-model="middle_name" />
          <q-input label="СНИЛС" v-model="snils" />
          <q-select
            label="Пол"
            v-model="sex"
            :options="['Мужской', 'Женский']"
          />
          <q-card-section class="q-pl-none q-mb-md">
            <div class="text">Дата рождения</div>
            <q-input v-model="date_of_birth" type="date" />
          </q-card-section>
        </div>

        <div class="q-pr-xl">
          <contraindications
            :withAdditionalParameters="true"
            ref="contraindications"
          />
        </div>
      </q-card-section>
      <q-space />
      <q-card-actions align="right" class="q-pr-xl q-pb-xl">
        <q-btn
          class="text-grey-9"
          color="primary"
          label="Сохранить"
          @click="onOKClick"
        />
        <q-btn
          class="text-grey-9"
          color="primary"
          label="Отмена"
          @click="onCancelClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import Contraindications from "components/Contraindications.vue";
import { date } from "quasar";

const delay = (time) => new Promise((r) => setTimeout(r, time));

export default {
  data() {
    return {
      last_name: "",
      name: "",
      middle_name: "",
      snils: "",
      date_of_birth: "",
      sex: "",
      created_by: this.$q.cookies.get("user").id,

      allergies: [],
      specialInstructions: [],
      diseases: [],
    };
  },
  props: ["id"],
  methods: {
    async getUser() {
      if (!this.id) return;

      const user = await this.$api.getPatient(this.id);

      if (!user) return;

      this.last_name = user.last_name;
      this.name = user.name;
      this.middle_name = user.middle_name;
      this.snils = user.snils;
      this.sex = user.sex;
      this.date_of_birth = date.formatDate(user.date_of_birth, "YYYY-MM-DD");
      this.created_by = user.created_by;

      return user;
    },
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
    },

    async onOKClick() {
      await this.saveChanges();

      this.$emit("ok");
      this.hide();
    },

    onCancelClick() {
      this.hide();
    },

    async saveChanges() {
      await this.$api.insertPatient({
        id: this.id,
        last_name: this.last_name,
        name: this.name,
        middle_name: this.middle_name,
        snils: this.snils,
        date_of_birth: this.date_of_birth,
        sex: this.sex,
        created_by: this.created_by,

        allergies: this.$refs.contraindications.$refs.allergiesRef.model,
        specialInstructions:
          this.$refs.contraindications.$refs.specialInstructionsRef.model,
        diseases: this.$refs.contraindications.$refs.diseasesRef.model,
      });

      this.$q.notify({
        type: "positive",
        message: "Данные пациента успешно сохранены!",
        position: "top",
      });
    },
  },
  async created() {
    while (!this.$refs.contraindications) {
      await delay(50);
    }

    const user = await this.getUser();

    this.$refs.contraindications.mapOptions(
      user?.allergies ?? [],
      user?.diseases ?? [],
      user?.specialInstructions ?? []
    );
  },
  components: { Contraindications },
};
</script>

<style>
.content > div {
  width: 45%;
}
</style>
