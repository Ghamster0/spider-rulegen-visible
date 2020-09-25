<template>
  <div
    style="height: 100%; overflow: scroll; padding: 5px"
    @click="handleUnselectLx"
  >
    <span style="margin-bottom: 5px; display: block">Link Rules</span>
    <div class="rules">
      <div
        v-for="lx in linksRule"
        :key="lx.id"
        class="lx-card d-flex"
        :class="{ 'is-active': lx === activelx }"
        @click.stop="handleSelectLx(lx)"
      >
        <div class="lx-column">
          <input v-model="lx.name" placeholder="name" />
        </div>
        <div class="lx-column">
          <input
            v-model="lx.selector"
            placeholder="css selector"
            @keydown.enter="handleConfirmSelector(lx)"
          />
        </div>
        <div class="lx-column">
          <span style="margin-right: 5px">handler</span>
          <select v-model="lx.handler" @change="handleHandlerChange(lx)">
            <option v-for="h in handlerMapping" :key="h.id" :value="h.id">
              {{ h.name }}({{ h.id }})
            </option>
          </select>
          <button class="text-btn" @click="handleAddHandler(lx)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div style="width: 100%"></div>
        <div v-if="lx.urls && lx.urls.length" class="lx-urls">
          <pre style="margin: 0">{{ lx.urls.join("\n") }}</pre>
        </div>
      </div>
      <button @click="handleAddLx">+ Add</button>
    </div>
    <div style="height: 30px"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BackendMixin from "./backend-mixin";

export default {
  mixins: [BackendMixin],
  props: {
    linksRule: {},
  },
  computed: {
    ...mapState({ activelx: "ruleLink", project: "project" }),
    handlerMapping() {
      const rules = this.project.rules;
      return rules.map((r) => ({ name: r.name, id: r.id }));
    },
  },
  methods: {
    handleSelectLx(lx) {
      if (lx === this.activelx) {
        return;
      }
      this.$store.commit("LOAD_RULE_LINK", lx);
      this.loadSelector(lx.selector);
    },
    handleUnselectLx() {
      if (this.activelx === null) {
        return;
      }
      this.$store.commit("LOAD_RULE_LINK", null);
      this.unLoadSelector();
    },
    handleAddLx() {
      this.$store.commit("ADD_RULE_LINK", {
        id: "rule_link_" + Math.random(),
        name: "",
        selector: "",
        urls: [],
        handler: "",
      });
    },
    handleConfirmSelector(lx) {
      this.loadSelector(lx);
    },
    handleAddHandler(lx) {
      const name = window.prompt("Rule Name:");
      if (name) {
        const rule = {
          id: "rule_" + Math.random(),
          name: name,
          example: "",
          extendUrls: { [lx.id]: lx.urls },
          links: [],
          contents: [],
        };
        this.$store.commit("ADD_RULE", rule);
        lx.handler = rule.id;
      }
    },
    handleHandlerChange(lx) {
      console.log("handler change:", lx);
      this.$store.dispatch("CHANGE_RULE_LINK_HANDLER", {
        ruleLinkId: lx.id,
        handlerId: lx.handler,
        urls: lx.urls,
      });
    },
  },
};
</script>

<style scoped>
.lx-card {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 4px;
  background-color: #eee;
}
.lx-card.is-active {
  background-color: rgba(26, 115, 232, 0.2);
}
.lx-column + .lx-column {
  margin-left: 10px;
}
.lx-urls {
  width: 100%;
  margin-top: 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: rgb(245, 245, 245);
}
.lx-card.is-active > .lx-urls {
  background-color: rgba(255, 255, 255, 0.4);
}
</style>