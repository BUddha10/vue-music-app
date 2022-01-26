import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure } from "vee-validate";
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
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("minVal", minVal);
    defineRule("maxVal", maxVal);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("password_mismatch", confirmed);
    defineRule("confirmed", confirmed);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required`,
          min: `The field ${ctx.field} is too short`,
          max: `The field ${ctx.field} is to long`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces.`,
          email: `The field ${ctx.field} must be a valid email`,
          min_value: `The field ${ctx.field} is too low`,
          max_value: `The field ${ctx.field} is too big`,
          password_mismatch: "The password don't match.",
          tos: "You must accept the Terms of Service",
        };

        const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field ${ctx.field} is invalid.`;
        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
