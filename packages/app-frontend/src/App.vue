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
  methods: {
    handleRuleChange(rule) {
      console.log(rule);
    },
  },
};
</script>

<style>
.d-flex {
  display: flex;
  flex-wrap: wrap;
}
.ml-5 {
  margin-left: 5px;
}
.h-100 {
  height: 100%;
}
button {
  cursor: pointer;
}
.text-btn {
  background-color: inherit;
  border: none;
}
.tab {
  height: 25px;
  font-size: 14px;
  background-color: #eee;
  border-bottom: 1px solid #bbb;
}

form.form {
  display: table;
}

.form-item {
  display: table-row;
}

.form-item > label,
.form-item > input,
.form-item > textarea {
  display: table-cell;
  margin-bottom: 10px;
}
.form-item > textarea {
  min-width: 171px;
}

.form-item > label {
  vertical-align: top;
  padding-right: 10px;
}
</style>
