<template>
  <q-page padding>
    <q-table
      title="Пациенты"
      :rows="filteredPatients"
      :columns="columns"
      row-key="id"
      separator="cell"
      v-model:pagination="pagination"
      hide-pagination
    >
      <template v-slot:top-left
        ><div class="row">
          <q-expansion-item expand-separator label="ПАЦИЕНТЫ">
            <q-btn style="width: 100%" @click="create" flat>Добавить</q-btn>
          </q-expansion-item>
        </div>
      </template>
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="fullName"
          placeholder="Поиск"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="mode_edit" @click="update(props.row.id)" />
          <q-btn icon="delete" @click="confirmation(props.row.id)" />
          <q-btn icon="qr_code" @click="generateQrCode(props.row)" />
        </q-td>
      </template>
    </q-table>
    <div class="row justify-center q-mt-md">
      <q-pagination
        class="text-white"
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="md"
      />
    </div>

    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm"
            >Вы уверены, что хотите удалить данные пациента?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Да"
            @click="remove(selectedPatientId)"
            v-close-popup
          />
          <q-btn flat label="Нет" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="qrCodeDialog">
      <q-card style="min-width: 250px; max-width: 80%">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="row items-center justify-around">
          <div class="qr-code-header-size">{{ qrCodePatientName }}</div>
        </q-card-section>

        <q-card-section class="row items-center justify-around">
          <qrcode-vue id="qr-code" :value="qrCodeUrl" />
        </q-card-section>

        <q-card-section class="row justify-end justify-around">
          <q-btn @click="printQrCode" color="primary" label="Печать" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import EditPatientDialog from "components/EditPatientDialog.vue";
import QrcodeVue from "qrcode.vue";
import patientColumns from "../columns/patient";

export default {
  data() {
    return {
      columns: patientColumns,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 7,
      },
      patients: [],
      fullName: "",

      confirmDelete: false,

      qrCodeDialog: false,
      qrCodePatientName: "",
      qrCodeUrl: "",

      selectedPatientId: null,
    };
  },
  methods: {
    async reload() {
      this.patients = await this.$api.getPatients();
    },
    openPatientInfo(id) {
      this.$q
        .dialog({
          component: EditPatientDialog,
          parent: this,
          componentProps: {
            id,
          },
        })
        .onOk(() => {
          this.reload();
        });
    },
    create() {
      this.openPatientInfo(null);
    },
    update(id) {
      this.openPatientInfo(id);
    },
    async remove(id) {
      await this.$api.removePatient(id);
      this.reload();
    },

    confirmation(id) {
      this.selectedPatientId = id;
      this.confirmDelete = true;
    },

    generateQrCode(user) {
      this.qrCodePatientName = [
        user.last_name,
        user.name,
        user.middle_name,
      ].join(" ");

      this.qrCodeUrl = `${window.location.origin}/#/set_drug/${user.id}`;

      this.qrCodeDialog = true;
    },

    printQrCode() {
      const dataUrl = document.getElementById("qr-code").toDataURL();
      let windowContent = "<!DOCTYPE html>";
      windowContent += "<html>";
      windowContent += "<body>";
      windowContent += '<img src="' + dataUrl + '">';
      windowContent += "</body>";
      windowContent += "</html>";

      const printWin = window.open("", "", "width=680,height=520");
      printWin.document.open();
      printWin.document.write(windowContent);
      printWin.document.close();

      setTimeout(() => {
        printWin.focus();
        printWin.print();
        printWin.close();
      }, 30);
    },
  },
  computed: {
    filteredPatients() {
      return this.patients.filter((patient) => {
        return (
          !this.fullName ||
          this.fullName
            .split(" ")
            .filter((x) => x)
            .some((n) =>
              [patient.name, patient.middle_name, patient.last_name]
                .filter((x) => x)
                .some((p) => p?.toLowerCase().includes(n?.toLowerCase()))
            )
        );
      });
    },
    pagesNumber() {
      return Math.ceil(
        this.filteredPatients.length / this.pagination.rowsPerPage
      );
    },
  },
  async created() {
    await this.reload();
  },
  components: { QrcodeVue },
};
</script>

<style>
.qr-code-header-size {
  font-size: 1.2rem;
}
</style>
