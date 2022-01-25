import { Form as VeeForm, Field as VeeField } from "vee-validate";

export default {
  install(app) {
    // app is the reference to the vue application
    // have access to different methods and properties

    // registering veeform and veevalidae
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
  },
};
