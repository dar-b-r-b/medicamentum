<template>
  <q-page padding>
    <div class="q-gutter-md row justify-around">
      <div class="col-xs-4">
        <q-select
          label="Пациент"
          v-model="patient"
          use-input
          input-debounce="0"
          :options="filteredPatients"
          option-value="id"
          option-label="name"
          @filter="filterPatient"
        >
        </q-select>
      </div>
      <div class="col-xs-4">
        <q-select
          label="Лекарство"
          v-model="drug"
          use-input
          input-debounce="0"
          :options="filteredDrugs"
          option-value="id"
          option-label="name"
          @filter="filterDrug"
        >
        </q-select>
      </div>
    </div>

    <br />

    <div class="q-gutter-md row justify-around">
      <q-btn color="primary" @click="compare">Проверить</q-btn>
    </div>
    <div class="q-gutter-md row justify-around">
      <div class="col-xs-4">
        <br />

        <q-banner
          v-if="compareResult.diseases?.length"
          rounded
          class="bg-red-3"
        >
          Заболевания:
          <p v-for="x in compareResult.diseases" :key="x.id">
            - {{ x.contraindication_name }} ({{ x.name }})
          </p>
        </q-banner>
        <br />
        <q-banner
          v-if="compareResult.allergies?.length"
          rounded
          class="bg-blue-3"
        >
          Аллергии:
          <p v-for="x in compareResult.allergies" :key="x.id">
            - {{ x.contraindication_name }}
          </p>
        </q-banner>
        <br />
        <q-banner
          v-if="compareResult.specialInstructions?.length"
          rounded
          class="bg-yellow-3"
        >
          Заболевания:
          <p v-for="x in compareResult.specialInstructions" :key="x.id">
            - {{ x.contraindication_name }}
          </p>
        </q-banner>
      </div>
      <div class="col-xs-4">
        <q-btn
          v-if="drug"
          label="Подобрать аналоги"
          color="primary"
          class="float-right"
          @click="getAnalogs"
        />
        <br />
        <br />
        <q-banner v-if="analogs.length" rounded class="bg-grey-3">
          <p
            @click="setAnalog(x.id)"
            class="underline"
            v-for="x in analogs"
            :key="x.id"
          >
            - {{ x.trade_name }}
          </p>
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      patients: [],
      filteredPatients: [],
      patient: null,

      drugs: [],
      filteredDrugs: [],
      drug: null,

      compareResult: [],
      analogs: [],
    };
  },
  methods: {
    filterPatient(val, update) {
      return this.filter(val, update, "filteredPatients", "patients");
    },
    filterDrug(val, update) {
      return this.filter(val, update, "filteredDrugs", "drugs");
    },
    filter(val, update, optionsField, fullOptionsField) {
      if (val === "") {
        update(() => {
          this[optionsField] = this[fullOptionsField];
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this[optionsField] = this[fullOptionsField].filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async compare() {
      this.compareResult = await this.$api.compare(
        this.patient?.id,
        this.drug?.id
      );

      if (
        this.compareResult.diseases?.length ||
        this.compareResult.allergies?.length ||
        this.compareResult.specialInstructions?.length
      ) {
        this.$q.notify({
          position: "top",
          message:
            "Внимание, обнаружена несовместимость компонентов с пациентом!",
          type: "negative",
        });
      } else {
        this.$q.notify({
          position: "top",
          message: "Противопоказаний не обнаружено",
          type: "positive",
        });
      }
    },
    async getAnalogs() {
      this.analogs = await this.$api.analog(this.drug.id);

      if (!this.analogs.length) {
        this.$q.notify({
          position: "top",
          message:
            "К сожалению, не удалось подобрать аналогичное по составу средство",
          type: "warning",
        });
      }
    },
    setAnalog(id) {
      this.drug = this.drugs.find((x) => x.id == id);
    },
  },
  async created() {
    this.patients = await this.$api.getPatients();
    this.filteredPatients = this.patients;

    const patientId = this.$route.params.patientId;

    if (patientId) {
      this.patient = this.patients.find((p) => p.id == patientId);
    }

    const drugs = await this.$api.getDrugs();
    this.drugs = drugs.map((x) => ({
      id: x.id,
      name: `${x.mnn}/${x.trade_name}`,
    }));
    this.filteredDrugs = this.drugs;
  },
};
</script>

<style>
.underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
