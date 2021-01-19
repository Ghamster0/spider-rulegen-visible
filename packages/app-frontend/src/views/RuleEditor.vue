<template>
  <div class="h-100" style="overflow: hidden" v-if="Object.keys(rule).length">
    <div class="tab d-flex a-center">
      <template v-if="mode === 'multi'">
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
          <option v-for="url in extendUrls" :key="url">{{ url }}</option>
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
      </template>
      <app-tab
        :options="['提链', '抽取']"
        :active.sync="active"
        style="margin-left: 10px; align-self: stretch"
      ></app-tab>
    </div>
    <div style="height: calc(100% - 26px)">
      <link-extractor
        v-if="active === '提链'"
        :linksConf="rule.linksConf"
      ></link-extractor>
      <content-extractor
        v-if="active === '抽取'"
        :template.sync="rule.contentsConf"
      ></content-extractor>
    </div>
  </div>
</template>

<script>
import AppTab from "../components/Tab.vue";
import LinkExtractor from "./links/LinkExtractor.vue";
import ContentExtractor from "./contents/ContentsTab.vue";

import { mapState } from "vuex";
import { gotoPage } from "../utils/backend";

export default {
  components: {
    AppTab,
    LinkExtractor,
    ContentExtractor,
  },
  data() {
    return {
      exampleMode: "select",
      active: "提链",
    };
  },
  computed: {
    ...mapState(["rule", "ruleId", "rules", "mode"]),
    extendUrls() {
      let urls = [];
      for (const r of this.rules) {
        for (const lx of r.linksConf) {
          if (lx.handler === this.ruleId && lx.urls) {
            urls = urls.concat(lx.urls);
          }
        }
      }
      return urls;
    },
  },
  methods: {
    handleNavgation() {
      if (this.rule.example) {
        gotoPage(this.rule.example);
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