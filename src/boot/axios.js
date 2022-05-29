import { boot } from "quasar/wrappers";
import axios from "axios";
import createClient from "../services/client";

const api = createClient(
  axios.create({ baseURL: "https://avicenna-medicamentum.herokuapp.com" })
);

export default boot(async ({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
