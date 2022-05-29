import { date } from "quasar";

export default [
  {
    name: "name",
    label: "Наименование",
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "actions",
    label: "",
    align: "left",
    style: "width: 160px",
  },
];
