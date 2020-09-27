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
  </div>
</template>

<script>
import ColSplit from "./components/ColSplit.vue";
import RuleEditor from "./views/RuleEditor.vue";
import Sider from "./views/Sider.vue";

export default {
  name: "App",
  components: {
    ColSplit,
    Sider,
    RuleEditor,
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
