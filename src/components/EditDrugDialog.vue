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
          id ? "Редактировать" : "Добавить новое лекарство"
        }}</span>
      </q-card-section>
      <q-card-section class="content row justify-between">
        <div class="q-pl-xl">
          <q-input label="Название" v-model="trade_name" />
          <q-input label="МНН" v-model="mnn" />

          <q-checkbox label="По рецепту" type="checkbox" v-model="is_recipe" />

          <q-select
            label="Фармакологическая группа"
            v-model="id_pharmacological_group"
            :options="pharmacologicalGroups"
            option-value="id"
            option-label="name"
            emit-value
            map-options
          />
          <q-select
            label="Форма выпуска"
            v-model="id_dosage_form"
            :options="dosageForms"
            emit-value
            map-options
            option-value="id"
            option-label="name"
          />
        </div>
        <div class="q-pr-xl">
          <tags title="Компоненты" :withEditor="true" ref="componentsRef">
            <template #editor="editorProps">
              <q-input
                type="number"
                label="Дозировка (мг)"
                min="0"
                v-model="editorProps.tag.dosage"
              />
              <q-checkbox
                label="Активное вещество"
                v-model="editorProps.tag.is_active"
              />
            </template>
          </tags>
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
import Tags from "components/Tags.vue";

const delay = (time) => new Promise((r) => setTimeout(r, time));

export default {
  data() {
    return {
      trade_name: "",
      mnn: "",
      is_recipe: false,
      id_pharmacological_group: null,
      id_dosage_form: null,
      drugComponents: [],

      pharmacologicalGroups: [],
      dosageForms: [],
      components: [],
    };
  },
  props: ["id"],
  methods: {
    async getDrug() {
      let getDrug = null;
      let drug = null;

      const getDosageForms = this.$api.getDosageForms();
      const getPharmacologicalGroups = this.$api.getPharmacologicalGroups();
      if (this.id) getDrug = this.$api.getDrug(this.id);

      this.dosageForms = await getDosageForms;
      this.pharmacologicalGroups = await getPharmacologicalGroups;

      if (getDrug) drug = await getDrug;

      if (!drug) return;

      this.trade_name = drug.trade_name;
      this.mnn = drug.mnn;
      this.is_recipe = drug.is_recipe;
      this.id_pharmacological_group = drug.id_pharmacological_group;
      this.id_dosage_form = drug.id_dosage_form;
      this.drugComponents = drug.drugComponents;

      return drug;
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
      await this.$api.insertDrug({
        id: this.id,
        trade_name: this.trade_name,
        mnn: this.mnn,
        is_recipe: this.is_recipe,
        id_pharmacological_group: this.id_pharmacological_group,
        id_dosage_form: this.id_dosage_form,
        drugComponents: this.$refs.componentsRef.model,
      });

      this.$q.notify({
        type: "positive",
        message: "Данные лекарства успешно сохранены!",
        position: "top",
      });
    },
  },
  async created() {
    while (!this.$refs.componentsRef) {
      await delay(50);
    }

    const getDrug = this.getDrug();
    const components = await this.$api.getComponents();
    const drug = await getDrug;

    this.$refs.componentsRef.mapOptions(drug?.drugComponents ?? [], components);
  },
  components: { Tags },
};
</script>

<style>
.content > div {
  width: 45%;
}
</style>
