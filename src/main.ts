import { createApp } from "vue";

// Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "./style.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

// Components
import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
});

createApp(App).use(vuetify).mount("#app");
