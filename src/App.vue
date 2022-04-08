<template>
  <div>
    <div id="navbar">
      <LoginForm @login="setupEditors()" @logout="destroyEditors()" />
      <h1>CodeSnippet Realtime</h1>
      <button
        v-for="(_, key) in projects"
        :key="key"
        @click="goTo('/#' + key)"
        class="btn"
      >
        Projet "{{ key }}"
      </button>
      <br />
      <button @click="goTo('/')" class="btn">+ Nouveau projet</button>
    </div>
    <div id="grid">
      <div id="html-tab">
        <h2>HTML</h2>
        <div class="editor"></div>
      </div>
      <div id="css-tab">
        <h2>CSS</h2>
        <div class="editor"></div>
      </div>
      <div id="js-tab">
        <h2>Javascript</h2>
        <div class="editor"></div>
      </div>
    </div>
    <div id="result">
      <h2>Résultat</h2>
      <iframe
        :srcdoc="`<html><body>${htmlCode}<style>${cssCode}</style><script>${jsCode}</script></body></html>`"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
import { fromMonaco } from "@sagarjain0907/firepad";
import { auth, db } from "@/plugins/firebase";
import { ref, get, push, child } from "firebase/database";
import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "App",
  components: {
    LoginForm,
  },
  data: () => ({
    projects: {},
    htmlEditor: null,
    cssEditor: null,
    jsEditor: null,
  }),
  computed: {
    htmlCode() {
      if (!this.htmlEditor?._ready) return "";
      return this.htmlEditor.getText();
    },
    cssCode() {
      if (!this.cssEditor?._ready) return "";
      return this.cssEditor.getText();
    },
    jsCode() {
      if (!this.jsEditor?._ready) return "";
      return this.jsEditor.getText();
    },
  },
  mounted() {
    if (auth.currentUser) this.setupEditors();
  },
  methods: {
    setupEditors() {
      get(ref(db, "projets")).then((s) => (this.projects = s.val()));

      const { html, css, js } = this.getCodes();

      this.htmlEditor = fromMonaco(
        html,
        monaco.editor.create(document.querySelector("#html-tab .editor"), {
          value: "<h1>Mon projet CodeSnippet</h1>",
          language: "html",
          theme: "vs-dark",
        }),
        {
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName,
          userColor: auth.currentUser.photoURL,
        }
      );

      this.cssEditor = fromMonaco(
        css,
        monaco.editor.create(document.querySelector("#css-tab .editor"), {
          value: `h1 {\ncolor: #F00;\n}`,
          language: "css",
          theme: "vs-dark",
        }),
        {
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName,
          userColor: auth.currentUser.photoURL,
        }
      );

      this.jsEditor = fromMonaco(
        js,
        monaco.editor.create(document.querySelector("#js-tab .editor"), {
          value: "console.log('Bonjour tout le monde !')",
          language: "typescript",
          theme: "vs-dark",
        }),
        {
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName,
          userColor: auth.currentUser.photoURL,
        }
      );
    },
    destroyEditors() {
      this.htmlEditor.dispose();
      this.cssEditor.dispose();
      this.jsEditor.dispose();
      this.goTo("/");
    },
    getCodes() {
      const projectId = window.location.hash.replace(/#/g, "");

      const projectsRef = ref(db, "projets");

      const projectRef = projectId
        ? child(projectsRef, projectId)
        : push(projectsRef);

      if (!projectId) window.location += "#" + projectRef.key;

      return {
        html: child(projectRef, "html"),
        css: child(projectRef, "css"),
        js: child(projectRef, "js"),
      };
    },
    goTo(url) {
      if (url === "/") {
        history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search
        );
      } else {
        window.location.replace(url);
      }
      window.location.reload();
    },
  },
};
</script>

<style>
#navbar {
  text-align: center;
}

#navbar h1 {
  color: #868bf4;
}

.btn {
  color: #fff;
  background-color: #64d87e;
  border: 2px solid #64d87e;
  border-radius: 10px;
  padding: 10px;
  margin: 5px;
  transition: all 0.3s ease-in-out;
}

.btn:hover {
  cursor: pointer;
  color: #64d87e;
  background-color: #fff;
  box-shadow: 5px 5px #64d87e;
}

#grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
  margin: 0 20px;
}

#grid .editor {
  min-height: 300px;
}

#html-tab {
  color: #dc582a;
}

#css-tab {
  color: #56ccf2;
}

#js-tab {
  color: #ffc845;
}

#result {
  margin: 20px;
}

#result iframe {
  width: 100%;
  border: 2px solid #000;
}
</style>
