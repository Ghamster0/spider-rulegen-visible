<template>
  <col-split :color="'#eee'">
    <template v-slot:left>
      <div class="h-100" style="overflow: hidden; background-color: #fff">
        <div style="padding: 5px; border-bottom: 1px solid #eee">
          <span>抽取内容</span>
        </div>
        <button v-if="!template" @click="handleInit">+</button>
        <content-tree
          v-else
          :template="template"
          :active.sync="active"
          @remove="$emit('update:template', null)"
        ></content-tree>
      </div>
    </template>
    <template v-slot:right>
      <content-inspector
        :rootTemplate="template"
        :active="active"
      ></content-inspector>
    </template>
  </col-split>
</template>

<script>
import ColSplit from "../../components/ColSplit.vue";
import ContentTree from "./ContentTree.vue";
import { v4 as uuidv4 } from "uuid";
import ContentInspector from "./ContentInspector.vue";

export default {
  components: {
    ColSplit,
    ContentTree,
    ContentInspector,
  },
  props: {
    template: {},
  },
  data() {
    return {
      hasTemplate: true,
      active: "",
    };
  },
  methods: {
    handleInit() {
      this.$emit("update:template", {
        id: uuidv4(),
        isRoot: true,
        method: "object",
        rawSelector: "",
        listData: [],
        contents: "",
      });
    },
  },
};
</script>

<style>
</style>