import { createStore } from "vuex";

export default createStore({
  state: {
    authModelShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModelShow = !state.authModelShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  getters: {
    // authModelShow: (state) => state.authModelShow,
  },
});
