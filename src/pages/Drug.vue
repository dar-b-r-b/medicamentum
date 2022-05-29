<template>
  <q-page padding>
    <q-table
      :rows="filteredDrugs"
      :columns="columns"
      row-key="id"
      separator="cell"
      v-model:pagination="pagination"
      hide-pagination
    >
      <template v-slot:top-left
        ><div class="row">
          <q-expansion-item expand-separator label="ЛЕКАРСТВА">
            <q-btn style="width: 100%" @click="create" flat>Добавить</q-btn>
          </q-expansion-item>
        </div>
      </template>
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="name"
          placeholder="Поиск"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="mode_edit" @click="update(props.row.id)"></q-btn>
          <q-btn icon="delete" @click="confirmation(props.row.id)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <div class="row justify-center q-mt-md">
      <q-pagination
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
            >Вы уверены, что хотите удалить лекарственный препарат?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Да"
            @click="remove(selectedDrugId)"
            v-close-popup
          />
          <q-btn flat label="Нет" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import drugColumns from "../columns/drug";
import EditDrugDialog from "components/EditDrugDialog.vue";

export default {
  data() {
    return {
      columns: drugColumns,
      drugs: [],
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 7,
      },
      name: "",

      confirmDelete: false,
      selectedDrugId: null,
    };
  },
  methods: {
    async reload() {
      this.drugs = await this.$api.getDrugs();
    },
    openDrugInfo(id) {
      this.$q
        .dialog({
          component: EditDrugDialog,
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
      this.openDrugInfo(null);
    },
    update(id) {
      this.openDrugInfo(id);
    },
    async remove(id) {
      await this.$api.removeDrug(id);
      this.reload();
    },
    confirmation(id) {
      this.selectedDrugId = id;
      this.confirmDelete = true;
    },
  },
  computed: {
    filteredDrugs() {
      return this.drugs.filter(
        (drug) =>
          !this.name ||
          this.name
            .split(" ")
            .filter((x) => x)
            .some((n) =>
              [drug.trade_name, drug.mnn]
                .filter((x) => x)
                .some((p) => p?.toLowerCase().includes(n?.toLowerCase()))
            )
      );
    },
    pagesNumber() {
      return Math.ceil(this.filteredDrugs.length / this.pagination.rowsPerPage);
    },
  },
  async created() {
    await this.reload();
  },
};
</script>
