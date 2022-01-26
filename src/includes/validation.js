import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage } from "vee-validate";
import { required, min, max, alpha_spaces as alphaSpaces, email, min_value as minVal, max_value as maxVal, confirmed } from "@vee-validate/rules";

export default {
  install(app) {
    // app is the reference to the vue application
    // have access to different methods and properties

    // registering veeform and veevalidate
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("minVal", minVal);
    defineRule("maxVal", maxVal);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("confirmed", confirmed);
  },
};
