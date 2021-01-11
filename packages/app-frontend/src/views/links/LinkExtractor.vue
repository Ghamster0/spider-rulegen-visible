<template>
  <div style="height: 100%; padding: 5px; overflow: scroll">
    <span style="margin-bottom: 5px; display: block">Link Rules</span>
    <div class="rules">
      <item
        v-for="lx in linksConf"
        :key="lx.id"
        :lx="lx"
        :activeId.sync="activeId"
        :handlerOptions="handlerOptions"
      ></item>
      <button @click="handleAdd">+ Add</button>
    </div>
    <div style="margin-bottom: 30px"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clearSelector, loadUrlsSelector } from "../../utils/backend";
import { getDefaultLx } from "../../utils/defaultValues";
import Item from "./Item.vue";

export default {
  components: {
    Item,
  },
  props: {
    linksConf: Array,
  },
  data() {
    return { activeId: "" };
  },
  computed: {
    ...mapState(["group", "groupId", "ruleId"]),
    handlerOptions() {
      return this.group.rules.map((r) => ({ name: r.name, id: r.id }));
    },
  },
  methods: {
    loadSelector(row) {
      loadUrlsSelector({
        indicator: { groupId: this.groupId, ruleId: this.ruleId, id: row.id },
        selector: row.selector,
      });
    },
    handleAdd() {
      this.linksConf.push(getDefaultLx());
    },
  },
  watch: {
    activeId(newVal) {
      if (newVal) {
        const lx = this.linksConf.find((i) => i.id === newVal);
        if (lx) {
          this.loadSelector(lx);
        }
      } else {
        clearSelector();
      }
    },
  },
  beforeDestroy() {
    clearSelector();
  },
};
</script>

<style scoped>
</style>