<template>
  <div>
    <div id="navbar">
      <h1>CodeSnippet Realtime</h1>
      <button
        v-for="(_, key) in snippets"
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
  </div>
</template>

<script>
import * as monaco from "monaco-editor";
import { fromMonaco } from "@sagarjain0907/firepad";
import { firebaseApp } from "@/plugins/firebase";

export default {
  name: "App",
  data: () => ({
    snippets: {},
  }),
  mounted() {
    firebaseApp
      .database()
      .ref()
      .child("projets")
      .get()
      .then((snapshot) => (this.snippets = snapshot.val()));

    const { html, css, js } = this.getCodes();

    fromMonaco(
      html,
      monaco.editor.create(document.querySelector("#html-tab .editor"), {
        value: "<h1>Mon projet CodeSnippet</h1>",
        language: "html",
        theme: "vs-dark",
      })
    );

    fromMonaco(
      css,
      monaco.editor.create(document.querySelector("#css-tab .editor"), {
        value: `h1 {\ncolor: #F00;\n}`,
        language: "css",
        theme: "vs-dark",
      })
    );

    fromMonaco(
      js,
      monaco.editor.create(document.querySelector("#js-tab .editor"), {
        value: "console.log('Bonjour tout le monde !')",
        language: "typescript",
        theme: "vs-dark",
      })
    );
  },
  methods: {
    getCodes() {
      let html,
        css,
        js = "";

      let ref = firebaseApp.database().ref("projets");
      const hash = window.location.hash.replace(/#/g, "");

      if (hash) {
        html = ref.child(hash).child("html");
        css = ref.child(hash).child("css");
        js = ref.child(hash).child("js");
      } else {
        ref = ref.push();
        html = ref.child("html");
        css = ref.child("css");
        js = ref.child("js");
        window.location = window.location + "#" + ref.key;
      }

      return { html, css, js };
    },
    goTo(url) {
      location.replace(url);
      location.reload();
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
  margin: 0 100px;
}

#grid .editor {
  min-height: 500px;
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
</style>
