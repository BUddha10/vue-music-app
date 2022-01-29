import { createStore } from "vuex";
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, db, doc, setDoc } from "@/includes/firebase";

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
    // register user
    async register({ commit }, payload) {
      const userCred = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

      console.log(userCred.user);
      console.log(userCred);

      await setDoc(doc(db, "users", userCred.user.uid), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      userCred.user.displayName = payload.name;

      commit("toggleAuth");
    },

    // user login
    async logInUser({ commit }, payload) {
      const user = await signInWithEmailAndPassword(auth, payload.email, payload.password);
      console.log(user);
      commit("toggleAuth");
    },

    init_login({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit("toggleAuth");
      }
    },

    // user logOut
    async logOut({ commit }) {
      await signOut(auth);

      commit("toggleAuth");
    },
  },
});
