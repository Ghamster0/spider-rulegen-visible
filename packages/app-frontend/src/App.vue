<template>
  <div id="app" style="height: 100vh; width: 100%">
    <col-split>
      <template v-slot:left>
        <sider></sider>
      </template>
      <template v-slot:right>
        <rule-editor></rule-editor>
      </template>
    </col-split>
    <div style="position: absolute; bottom: 10px; right: 20px">
      <!-- <button class="circle primary" title="保存">
        <i class="fas fa-save"></i>
      </button> -->
      <button class="circle primary" title="导出" @click="handleDownload">
        <i class="fas fa-download"></i>
      </button>
      <button class="circle primary" @click="logg">
        <i class="fas fa-bug"></i>
      </button>
      <!-- <button class="circle primary" @click="test">
        <i class="fas fa-bug"></i>
      </button> -->
    </div>
  </div>
</template>

<script>
import ColSplit from "./components/ColSplit.vue";
import RuleEditor from "./views/RuleEditor.vue";
import Sider from "./views/Sider.vue";
import { download } from "./utils";

export default {
  name: "App",
  components: {
    ColSplit,
    Sider,
    RuleEditor,
  },
  methods: {
    logg() {
      console.log("Store: ", this.$store, this.$store.state);
    },
    handleDownload() {
      download(
        "rules.json",
        JSON.stringify(this.$store.state.sites, null, 2)
      );
    },
    test() {
      chrome.tabs.query({ active: true }, function (tabs) {
        console.log(tabs);
      });
      chrome.tabs.query({}, function (tabs) {
        console.log(tabs);
        chrome.tabs.update(tabs[0].id, { active: true }, (tab) => {});
      });
    },
  },
};
</script>

<style>
.tab {
  height: 25px;
  font-size: 14px;
  background-color: #eee;
  border-bottom: 1px solid #bbb;
}
</style>
