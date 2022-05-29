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
          id ? "Редактировать" : "Добавить новый компонент"
        }}</span>
      </q-card-section>
      <q-card-section class="content row justify-between">
        <div class="q-pl-xl">
          <q-input label="Название" v-model="name" />
        </div>
        <div class="q-pr-xl">
          <contraindications
            :withAdditionalParameters="false"
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

const delay = (time) => new Promise((r) => setTimeout(r, time));

export default {
  data() {
    return {
      name: "",
      allergies: [],
      specialInstructions: [],
      diseases: [],
    };
  },
  props: ["id"],
  methods: {
    async getComponent() {
      if (!this.id) return;

      const component = await this.$api.getComponent(this.id);
      if (!component) return;

      this.name = component.name;

      return component;
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
      await this.$api.insertComponent({
        id: this.id,
        name: this.name,

        allergies: this.$refs.contraindications.$refs.allergiesRef.model,
        specialInstructions:
          this.$refs.contraindications.$refs.specialInstructionsRef.model,
        diseases: this.$refs.contraindications.$refs.diseasesRef.model,
      });

      this.$q.notify({
        type: "positive",
        message: "Данные компонента успешно сохранены!",
        position: "top",
      });
    },
  },
  async created() {
    while (!this.$refs.contraindications) {
      await delay(50);
    }

    const component = await this.getComponent();

    this.$refs.contraindications.mapOptions(
      component?.allergies ?? [],
      component?.diseases ?? [],
      component?.specialInstructions ?? []
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
