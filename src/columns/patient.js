import { date } from "quasar";
export default [
  {
    name: "last_name",
    label: "Фамилия",
    align: "left",
    field: (row) => row.last_name,
    sortable: true,
  },
  {
    name: "name",
    label: "Имя",
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "middle_name",
    label: "Отчество",
    align: "left",
    field: (row) => row.middle_name,
    sortable: true,
  },
  {
    name: "date_of_birth",
    label: "Дата рождения",
    align: "left",
    field: (row) => row.date_of_birth,
    format: (val) => date.formatDate(val, "DD.MM.YYYY"),
    sortable: true,
  },
  {
    name: "sex",
    label: "Пол",
    align: "left",
    field: (row) => row.sex,
    sortable: true,
  },
  {
    name: "snils",
    label: "СНИЛС",
    align: "left",
    field: (row) => row.snils,
    sortable: true,
  },
  {
    name: "actions",
    label: "",
    style: "width: 160px",
    align: "left",
  },
];
