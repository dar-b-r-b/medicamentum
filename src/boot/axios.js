import { boot } from "quasar/wrappers";
import axios from "axios";
import createClient from "../services/client";

const api = createClient(axios.create({ baseURL: "http://localhost:4001" }));

export default boot(async ({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
