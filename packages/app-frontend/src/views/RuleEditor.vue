<template>
  <div class="h-100" v-if="Object.keys(rule).length">
    <div class="tab d-flex a-center">
      <button
        class="text-btn"
        @click="exampleMode = exampleMode === 'edit' ? 'select' : 'edit'"
        style="color: #888"
        title="Toggle select or input"
      >
        <i class="fas fa-exchange-alt"></i>
      </button>
      <select
        v-if="exampleMode === 'select'"
        v-model="rule.example"
        class="ml-5"
        style="width: 360px; box-sizing: content-box"
      >
        <option v-for="link in links" :key="link">{{ link }}</option>
      </select>
      <input
        v-if="exampleMode === 'edit'"
        v-model="rule.example"
        class="ml-5"
        style="width: 360px"
      />
      <button
        class="text-btn nav-btn"
        @click="handleNavgation"
        title="Navigate to the target url"
      >
        <i class="fas fa-location-arrow"></i>
      </button>
      <app-tab
        :options="['提链', '抽取']"
        :active.sync="active"
        style="margin-left: 10px; align-self: stretch"
      ></app-tab>
    </div>
    <link-extractor
      v-if="active === '提链'"
      :linksRule="rule.links"
    ></link-extractor>
    <content-extractor v-if="active === '抽取'"></content-extractor>
  </div>
</template>

<script>
import AppTab from "../components/Tab.vue";
import LinkExtractor from "./LinkExtractor.vue";
import ContentExtractor from "./ContentExtractor.vue";

import { mapState } from "vuex";
import BackendMixin from "./backend-mixin";

export default {
  components: {
    AppTab,
    LinkExtractor,
    ContentExtractor,
  },
  mixins: [BackendMixin],
  data() {
    return {
      exampleMode: "select",
      active: "提链",
    };
  },
  computed: {
    ...mapState(["rule"]),
    links() {
      if (this.rule.startUrls) {
        return this.rule.startUrls;
      } else if (this.rule.extendUrls) {
        let urls = [];
        for (const key in this.rule.extendUrls) {
          urls = urls.concat(this.rule.extendUrls[key]);
        }
        return urls;
      } else {
        return [];
      }
    },
  },
  methods: {
    handleNavgation() {
      if (this.rule.example) {
        this.goto(this.rule.example);
      }
    },
  },
};
</script>

<style scoped>
.nav-btn {
  transition: color 0.5s;
  color: #222;
  margin-left: 3px;
}
.nav-btn:active,
.nav-btn:focus {
  color: rgb(26, 115, 232);
  outline: none;
}
</style>