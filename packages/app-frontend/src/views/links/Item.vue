<template>
  <div
    class="lx-card d-flex"
    :class="{ 'is-active': lx.id === activeId }"
    @click.stop="$emit('update:activeId', lx.id)"
    v-click-outside="() => handleUnselect(lx)"
  >
    <div class="lx-column">
      <input v-model="lx.name" placeholder="name" />
    </div>
    <div class="lx-column">
      <input
        style="min-width: 400px"
        v-model="lx.selector"
        placeholder="css selector"
        @keydown.enter="loadSelector(lx)"
      />
    </div>
    <div class="lx-column">
      <span style="margin-right: 5px">handler</span>
      <select
        :value="lx.handler"
        @change="handleHandlerChange($event.target.value, lx)"
      >
        <option v-for="h in handlerOptions" :key="h.id" :value="h.id">
          {{ h.name }} - {{ h.id.substring(0, 8) }}
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
</template>

<script>
import { mapState } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { loadUrlsSelector } from "../../utils/backend";
import { getDefaultRule } from "../../utils/defaultValues";

export default {
  props: {
    lx: Object,
    activeId: String,
    handlerOptions: Array,
  },
  computed: {
    ...mapState(["groupId", "ruleId"]),
  },
  methods: {
    handleUnselect(lx) {
      if (lx.id === this.activeId) {
        this.$emit("update:activeId", "");
      }
    },
    loadSelector(row) {
      loadUrlsSelector({
        indicator: { groupId: this.groupId, ruleId: this.ruleId, id: row.id },
        selector: row.selector,
      });
    },
    handleAddHandler(lx) {
      const name = window.prompt("Rule Name:");
      if (name) {
        const rule = { ...getDefaultRule(), name: name };
        this.$store.commit("PUSH_RULE", rule);
        lx.handler = rule.id;
      }
    },
    handleHandlerChange(handler, lx) {
      this.$store.commit("SET_RULE_LINK", {
        indicate: { groupId: this.groupId, ruleId: this.ruleId, id: lx.id },
        linkConf: { handler: handler },
      });
    },
  },
  created() {
    if (this.lx.urls === undefined) {
      this.$set(this.lx, "urls", []);
    }
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