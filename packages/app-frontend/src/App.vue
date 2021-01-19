<template>
  <div id="app" style="height: 100vh; width: 100%">
    <template v-if="mode === 'multi'">
      <col-split>
        <template v-slot:left>
          <!-- sider -->
          <groups></groups>
          <rules></rules>
        </template>
        <template v-slot:right>
          <rule-editor></rule-editor>
        </template>
      </col-split>
    </template>
    <rule-editor v-else></rule-editor>

    <div
      v-if="currentEdit"
      style="
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgb(26, 115, 232);
        padding: 5px;
        color: white;
      "
    >
      {{ currentEdit + " (Databus)" }}
    </div>

    <div style="position: absolute; bottom: 10px; right: 20px">
      <div></div>
      <button class="circle primary" @click="logg">
        <i class="fas fa-bug"></i>
      </button>
      <button class="circle primary" @click="handleDownload">
        <i class="fas fa-download"></i>
      </button>
      <button
        class="circle primary"
        title="从Databus导入配置"
        @click="loadFromDatabus"
      >
        <i class="fas fa-file-import"></i>
      </button>
      <button
        class="circle primary"
        title="导出到Databus"
        @click="setBackToDatabus"
      >
        <i class="fas fa-file-export"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";

import ColSplit from "./components/ColSplit.vue";
import RuleEditor from "./views/RuleEditor.vue";
import Groups from "./views/Groups.vue";
import Rules from "./views/Rules.vue";
import { download } from "./utils/utils";
import {
  configPageReg,
  databusTabUrl,
  getDatabusTabId,
  getNetlocName,
  normalizeTemplatesNamed,
  sendToDatabus,
} from "./utils/databus";
import normalizeTemplate from "./utils/normalizeTemplate";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    ColSplit,
    Groups,
    Rules,
    RuleEditor,
  },
  data() {
    return {
      opTabId: "",
    };
  },
  computed: {
    ...mapState(["mode", "indicator"]),
    currentEdit() {
      switch (this.indicator.type) {
        case "default":
          return "全局配置";
        case "named":
          return "命名配置";
        case "path":
          return "路径 " + this.indicator.name;
        case "netloc":
          return "域名 " + this.indicator.name;
        default:
          return "";
      }
    },
  },
  methods: {
    logg() {
      console.log("Store: ", this.$store, this.$store.state);
    },
    handleDownload() {
      // filter urls too long
      const sites = cloneDeep(this.$store.state.groups);
      for (const site of sites) {
        for (const rule of site.rules) {
          if (rule.extendUrls) {
            for (const key in rule.extendUrls) {
              rule.extendUrls[key] = rule.extendUrls[key].slice(0, 3);
              rule.extendUrls[key].push("...");
            }
          }
          for (const link of rule.linksConf) {
            if (link.urls && link.urls.length > 5) {
              link.urls = link.urls.slice(0, 5);
              link.urls.push("...");
            }
          }
        }
      }
      download("rules.json", JSON.stringify(sites, null, 2));
    },
    async loadFromDatabus() {
      this.opTabId = await getDatabusTabId();
      if (this.opTabId) {
        sendToDatabus({ type: "query" }, this.opTabId);
      }
    },
    async setBackToDatabus() {
      if (!this.opTabId) {
        this.opTabId = await getDatabusTabId();
        return;
      }
      const dbUrl = await databusTabUrl(this.opTabId);
      if (!dbUrl) {
        window.alert("目标选项卡已关闭");
        return;
      } else if (!dbUrl.match(configPageReg)) {
        window.alert("请确保Databus打开“配置中心”页面，并选中“种子相关”选项卡");
        return;
      }
      const payload = { type: "set", mode: this.mode };
      if (this.mode === "multi") {
        const groups = this.$store.state.groups;
        for (const group of groups) {
          for (const rule of group.rules) {
            if (rule.contentsConf) {
              rule.contentsConf = normalizeTemplate(rule.contentsConf);
            }
          }
        }
        payload.data = groups;
      } else {
        const rule = this.$store.state.rule;
        if (rule.contentsConf) {
          rule.contentsConf = normalizeTemplate(rule.contentsConf);
        }
        payload.data = rule;
        payload.indicator = this.$store.state.indicator;
      }
      const opId = this.opTabId;
      sendToDatabus(payload, opId);
      /* global chrome*/
      chrome.tabs.update(opId, { active: true });
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
