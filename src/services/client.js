import { Notify } from "quasar";

const negativeMessage = (message) =>
  Notify.create({
    type: "negative",
    message,
    position: "top",
    timeout: 2_500,
  });

let clientApi = {};

function actionDecorator(action, withData = false) {
  const config = { withCredentials: true };

  return function (url, data) {
    let actionPromise = null;

    if (withData) {
      actionPromise = action(url, data, config);
    } else {
      actionPromise = action(url, config);
    }

    return actionPromise.catch((err) => {
      if (err.response?.status === 403) {
        window.location.href = "/#/auth/login";
      } else {
        negativeMessage(err.response?.data);
      }

      throw err;
    });
  };
}

function create(api) {
  clientApi = api;

  const get = actionDecorator(clientApi.get);
  const post = actionDecorator(clientApi.post, true);
  const del = actionDecorator(clientApi.delete);

  return {
    async getPatients() {
      return (await get("api/patient")).data;
    },
    async getPatient(id) {
      return (await get("api/patient/" + id)).data;
    },
    async insertPatient(patient) {
      return await post("api/patient/", patient);
    },
    removePatient(id) {
      return del("api/patient?id=" + id);
    },

    async getDosageForms() {
      return (await get("api/dosage_form")).data;
    },
    async getPharmacologicalGroups() {
      return (await get("api/pharmacological_group")).data;
    },

    async getComponents() {
      return (await get("api/component")).data;
    },
    async getComponent(id) {
      return (await get("api/component/" + id)).data;
    },
    removeComponent(id) {
      return del("api/component?id=" + id);
    },
    async insertComponent(component) {
      return await post("api/component/", component);
    },

    async getAllergies() {
      return (await get("api/allergy")).data;
    },
    async getSpecialInstructions() {
      return (await get("api/special_instructions")).data;
    },
    async getDiseases() {
      return (await get("api/disease")).data;
    },

    async getDrugs() {
      return (await get("api/drug")).data;
    },
    async getDrug(id) {
      return (await get("api/drug/" + id)).data;
    },

    async insertDrug(drug) {
      return await post("api/drug/", drug);
    },
    removeDrug(id) {
      return del("api/drug?id=" + id);
    },

    getUser(id) {
      return get("api/user?id=" + id);
    },

    async compare(patientId, drugId) {
      return (await get(`api/compare?patientId=${patientId}&drugId=${drugId}`))
        .data;
    },
    async analog(drugId) {
      return (await get(`api/analog?drugId=${drugId}`)).data;
    },

    logout() {
      return get("api/logout");
    },
    login(loginForm) {
      return post("api/login", loginForm);
    },
    register(registerForm) {
      return post("api/register", registerForm);
    },
  };
}

export default create;
