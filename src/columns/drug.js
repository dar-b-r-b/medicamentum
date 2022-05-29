import { date } from "quasar";

export default [
  {
    name: "trade_name",
    label: "Наименование",
    align: "left",
    field: (row) => row.trade_name,
    sortable: true,
  },
  {
    name: "mnn",
    label: "МНН",
    align: "left",
    field: (row) => row.mnn,
    sortable: true,
  },
  {
    name: "pharmacological_group_name",
    label: "Фармакологическая группа",
    align: "left",
    field: (row) => row.pharmacological_group_name,
    sortable: true,
  },
  {
    name: "dosage_form_name",
    label: "Форма выпуска",
    align: "left",
    field: (row) => row.dosage_form_name,
    sortable: true,
  },
  {
    name: "is_recipe",
    label: "По рецепту",
    align: "left",
    field: (row) => row.is_recipe,
    format: (val) => (val ? "Да" : "Нет"),
    sortable: true,
  },
  {
    name: "actions",
    label: "",
    align: "left",
    style: "width: 160px",
  },
];
