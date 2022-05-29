const routes = [
  {
    path: "",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        path: "patient",
        component: () => import("src/pages/Patient.vue"),
      },
      {
        path: "drug",
        component: () => import("src/pages/Drug.vue"),
      },
      {
        path: "component",
        component: () => import("src/pages/Component.vue"),
      },
      {
        path: "set_drug/:patientId?",
        component: () => import("src/pages/SetDrug.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("src/pages/Auth/Login.vue"),
      },
      {
        path: "register",
        component: () => import("src/pages/Auth/Register.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
