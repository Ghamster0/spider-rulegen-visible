<template>
  <div class="h-100" v-if="Object.keys(rule).length">
    <div class="navigator d-flex">
      <div style="padding: 2px">
        <span>URL</span>
        <select
          v-if="exampleMode === 'select'"
          v-model="rule.example"
          class="ml-5"
          style="min-width: 180px; max-width: 360px"
        >
          <option v-for="link in links" :key="link">{{ link }}</option>
        </select>
        <input
          v-if="exampleMode === 'edit'"
          v-model="rule.example"
          class="ml-5"
        />
        <button
          class="text-btn"
          v-if="exampleMode === 'select'"
          @click="exampleMode = 'edit'"
        >
          <i class="far fa-edit"></i>
        </button>
        <button
          class="text-btn"
          v-if="exampleMode === 'edit'"
          @click="exampleMode = 'select'"
        >
          <i class="fas fa-list"></i>
        </button>
        <button class="ml-5" @click="handleNavgation">Go!</button>
      </div>
      <app-tab
        :options="['提链', '抽取']"
        :active.sync="active"
        style="margin-left: 10px"
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
select {
  padding: 1px;
}
.navigator {
  font-size: 14px;
  background-color: #eee;
  border-bottom: 1px solid #bbb;
}
button:focus {
  outline: none;
}
</style>