import { createStore } from "vuex";
import { auth, createUserWithEmailAndPassword, db, collection, addDoc } from "@/includes/firebase";

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

  actions: {
    async register({ commit }, payload) {
      await createUserWithEmailAndPassword(auth, payload.email, payload.password);
      await addDoc(collection(db, "users"), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });
      commit("toggleAuth");
    },
  },
});
