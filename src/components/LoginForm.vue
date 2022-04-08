<template>
  <div id="login-container">
    <h3>Connexion</h3>
    <template v-if="user">
      <p>Connecté en tant que {{ user.email }}</p>
      <button @click="logout()">Déconnexion</button>
    </template>
    <template v-else>
      <button @click="newUser = false" :disabled="!newUser">Connexion</button>
      <button @click="newUser = true" :disabled="newUser">Inscription</button>
      <form @submit.prevent="login()" id="login-form">
        <template v-if="newUser">
          <div>
            <label
              >Couleur
              <input v-model="loginForm.color" type="color" />
            </label>
          </div>
          <div>
            <label
              >Nom d'utilisateur
              <input v-model="loginForm.username" type="text" />
            </label>
          </div>
        </template>
        <div>
          <label
            >Adresse e-mail
            <input v-model="loginForm.email" type="email" />
          </label>
        </div>
        <div>
          <label
            >Mot de passe
            <input v-model="loginForm.password" type="password" />
          </label>
        </div>
        <div>
          <button type="submit">Valider</button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import { auth } from "@/plugins/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

export default {
  data: () => ({
    user: {},
    newUser: true,
    loginForm: {
      color: "",
      username: "",
      email: "",
      password: "",
    },
  }),
  mounted() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  },
  methods: {
    login() {
      if (this.newUser) {
        createUserWithEmailAndPassword(
          auth,
          this.loginForm.email,
          this.loginForm.password
        ).then(() => {
          updateProfile(auth.currentUser, {
            displayName: this.loginForm.username,
            photoURL: this.loginForm.color,
          }).then(() => {
            this.$emit("login");
          });
        });
      } else {
        signInWithEmailAndPassword(
          auth,
          this.loginForm.email,
          this.loginForm.password
        ).then(() => this.$emit("login"));
      }
    },
    logout() {
      signOut(auth).then(() => this.$emit("logout"));
    },
  },
};
</script>

<style>
#login-container {
  position: fixed;
  top: 0;
  right: 0;
  text-align: right;
}

#login-form div {
  margin: 10px 0;
}
</style>
