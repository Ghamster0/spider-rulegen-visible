<template>
  <div>
    <div class="tab d-flex a-center">
      <span>Project</span>
      <select class="ml-5" v-model="project">
        <option v-for="p in projects" :key="p.id" :value="p">
          {{ p.name }}
        </option>
      </select>
    </div>
    <div v-if="project && project.rules">
      <ul class="rules">
        <li
          v-for="rule in project.rules"
          :key="rule.id"
          @click="handleRuleClick(rule)"
          :class="{ 'is-active': rule === activeRule }"
        >
          {{ rule.name }}
        </li>
      </ul>
      <div
        style="
          display: flex;
          justify-content: center;
          position: absolute;
          bottom: 0;
          width: 100%;
        "
      >
        <button class="text-btn" @click="dialog.visible = true">+ Add</button>
      </div>
      <app-dialog :visible.sync="dialog.visible">
        <form class="form">
          <div class="form-item">
            <label for="name">名称</label>
            <input v-model="dialog.name" />
          </div>
          <div class="form-item">
            <label>初始url</label>
            <textarea v-model="dialog.startUrls"></textarea>
          </div>
          <div class="form-item">
            <label></label>
            <button @click.prevent="handleAddRule">确认</button>
          </div>
        </form>
      </app-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { stringSplit } from "../utils";
import AppDialog from "../components/Dialog.vue";

export default {
  data() {
    return {
      dialog: {
        visible: false,
        name: "",
        startUrls: "",
      },
    };
  },
  components: {
    AppDialog,
  },
  computed: {
    ...mapState(["projects"]),
    ...mapState({ activeRule: "rule" }),
    project: {
      get() {
        return this.$store.state.project;
      },
      set(val) {
        this.$store.commit("LOAD_PROJECT", val);
      },
    },
  },
  methods: {
    handleRuleClick(r) {
      this.$store.commit("LOAD_RULE", r);
    },
    handleAddRule() {
      if (!this.dialog.name || !this.dialog.startUrls) {
        console.log("Error, name and startUrls must not null");
        return;
      }
      const rule = {
        id: "rule_" + Math.random(),
        name: this.dialog.name,
        example: "",
        startUrls: stringSplit(this.dialog.startUrls),
      };
      this.$store.dispatch("ADD_RULE", rule);
      this.dialog.visible = false;
    },
  },
};
</script>

<style scoped>
.rules {
  margin: 0;
  padding: 0;
  list-style: none;
}
ul.rules > li {
  cursor: pointer;
  padding: 3px 10px;
}
ul.rules > li:hover {
  background-color: #ddd;
}
ul.rules > li.is-active {
  color: white;
  background-color: rgb(26, 115, 232);
}
</style>