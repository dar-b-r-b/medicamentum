<template>
  <div>
    <tags
      title="Болезни"
      :tags="diseasesReference"
      :withEditor="withAdditionalParameters"
      ref="diseasesRef"
    >
      <template #editor="editorProps">
        <q-card-section class="q-pl-none">
          <div class="text">Дата диагностирования</div>
          <q-input v-model="editorProps.tag.date_of_diagnosis" type="date" />
        </q-card-section>
        <q-card-section class="q-pl-none">
          <div class="text">Дата закрытия</div>
          <q-input v-model="editorProps.tag.close_date" type="date" />
        </q-card-section>
        <q-checkbox label="Хроническое" v-model="editorProps.tag.is_chronic" />
      </template>
    </tags>

    <tags
      title="Аллергии"
      :tags="allergiesReference"
      :withEditor="withAdditionalParameters"
      ref="allergiesRef"
    >
      <template #editor="editorProps">
        <q-card-section class="q-pl-none">
          <div class="text">Дата диагностирования</div>
          <q-input v-model="editorProps.tag.date_of_diagnosis" type="date" />
        </q-card-section>
        <q-card-section class="q-pl-none">
          <div class="text">Дата закрытия</div>
          <q-input v-model="editorProps.tag.close_date" type="date" />
        </q-card-section>
        <q-checkbox label="Хроническое" v-model="editorProps.tag.is_chronic" />
      </template>
    </tags>

    <tags
      title="Особые указания"
      :tags="specialInstructionsReference"
      :withEditor="withAdditionalParameters"
      ref="specialInstructionsRef"
    >
      <template #editor="editorProps">
        <q-card-section class="q-pl-none">
          <div class="text">Дата диагностирования</div>
          <q-input v-model="editorProps.tag.date_of_diagnosis" type="date" />
        </q-card-section>
        <q-card-section class="q-pl-none">
          <div class="text">Дата закрытия</div>
          <q-input v-model="editorProps.tag.close_date" type="date" />
        </q-card-section>
        <q-checkbox label="Хроническое" v-model="editorProps.tag.is_chronic" />
      </template>
    </tags>
  </div>
</template>

<script>
import Tags from "components/Tags.vue";
import { date } from "quasar";

export default {
  data() {
    return {
      specialInstructionsReference: [],
      allergiesReference: [],
      diseasesReference: [],
    };
  },
  props: ["withAdditionalParameters"],
  methods: {
    async mapOptions(allergies, diseases, specialInstructions) {
      [allergies, diseases, specialInstructions].forEach((array) =>
        array.forEach((c) => {
          if (c.date_of_diagnosis)
            c.date_of_diagnosis = date.formatDate(
              c.date_of_diagnosis,
              "YYYY-MM-DD"
            );
          if (c.close_date)
            c.close_date = date.formatDate(c.close_date, "YYYY-MM-DD");
        })
      );

      const getAllergies = this.$api.getAllergies();
      const getSpecialInstructions = this.$api.getSpecialInstructions();
      const getDiseases = this.$api.getDiseases();

      this.allergiesReference = await getAllergies;
      this.specialInstructionsReference = await getSpecialInstructions;
      this.diseasesReference = await getDiseases;

      this.$refs.allergiesRef.mapOptions(allergies, this.allergiesReference);
      this.$refs.diseasesRef.mapOptions(diseases, this.diseasesReference);
      this.$refs.specialInstructionsRef.mapOptions(
        specialInstructions,
        this.specialInstructionsReference
      );
    },
  },
  components: {
    Tags,
  },
};
</script>
