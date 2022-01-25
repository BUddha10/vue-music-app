import { createStore } from "vuex";

export default createStore({
  state: {
    authModelShow: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModelShow = !state.authModelShow;
    },
  },
  getters: {
    // authModelShow: (state) => state.authModelShow,
  },
});
