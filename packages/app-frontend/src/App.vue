<template>
  <div id="app" style="height: 100vh; width: 100%">
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
      <button class="circle primary" @click="loadFromDatabus">
        <i class="fas fa-search"></i>
      </button>
      <button class="circle primary" @click="setBackToDatabus">
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
import { sendToDatabus } from "./utils/backend";

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
    loadFromDatabus() {
      chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          if (tab.url.match(/crawl\/.+\/config/)) {
            this.opTabId = tab.id;
            sendToDatabus({ cmd: "query" }, tab.id);
            chrome.tabs.executeScript(tab.id, {
              code: `
              if(!window.RULEGEN_INITED){
                window.RULEGEN_INITED=true
                chrome.runtime.onMessage.addListener(function(request){
                  if(request.type==="rulegen-to-databus"){
                    window.postMessage(request)
                  }
                })
                window.addEventListener("message", e=>{
                  if(e.data.type==="databus-to-rulegen"){
                    chrome.runtime.sendMessage(e.data)
                  }
                })
              }
              `,
            });
            sendToDatabus({ type: "query" }, tab.id);
          }
        }
      });
    },
    setBackToDatabus() {
      sendToDatabus(
        { type: "set", data: this.$store.state.groups },
        this.opTabId
      );
      chrome.tabs.update(this.opTabId, { active: true });
    },
  },
  created() {
    window.addEventListener("message", (e) => console.log(e));
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
