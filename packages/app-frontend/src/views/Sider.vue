<template>
  <div>
    <div class="tab d-flex a-center">
      <i class="fas fa-spider" style="color: #333; padding-left: 5px"></i>
      <select class="ml-5" v-model="project" style="flex: auto; min-width: 1px">
        <option v-for="p in projects" :key="p.id" :value="p">
          {{ p.name }}
        </option>
      </select>
      <button
        class="text-btn"
        v-if="project && Object.keys(project).length"
        style="padding: 2px 4px"
        @click="handleDeleteProject(project)"
      >
        <i class="far fa-trash-alt"></i>
      </button>
      <button
        class="text-btn"
        style="padding: 2px 4px"
        @click="projectDialog.visible = true"
      >
        <i class="fas fa-plus-circle"></i>
      </button>
    </div>
    <app-dialog :visible.sync="projectDialog.visible">
      <form class="form">
        <div class="form-item">
          <label for="name">名称</label>
          <input
            v-model="projectDialog.name"
            style="width: 100%; box-sizing: border-box"
          />
        </div>
        <div class="form-item">
          <label></label>
          <button @click.prevent="handleAddProject">确认</button>
        </div>
      </form>
    </app-dialog>
    <div v-if="project && project.rules">
      <ul class="rules" style="margin-top: 1px">
        <li
          v-for="rule in project.rules"
          :key="rule.id"
          @click="handleRuleClick(rule)"
          :class="{ 'is-active': rule === activeRule }"
        >
          {{ rule.name }}
          <button
            v-if="rule === activeRule"
            class="text-btn light"
            style="float: right"
            @click.stop="handleDeleteRule(rule)"
          >
            <i class="fas fa-times-circle"></i>
          </button>
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
        <button
          class="text-btn"
          style="width: 100%; font-size: large"
          @click="ruleDialog.visible = true"
        >
          <i class="fas fa-plus-circle"></i>
        </button>
      </div>
      <app-dialog :visible.sync="ruleDialog.visible">
        <form class="form">
          <div class="form-item">
            <label for="name">名称</label>
            <input
              v-model="ruleDialog.name"
              style="width: 100%; box-sizing: border-box"
            />
          </div>
          <div class="form-item">
            <label>初始url</label>
            <textarea
              v-model="ruleDialog.startUrls"
              style="width: 100%; box-sizing: border-box"
            ></textarea>
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
import ModelMixin from "./model-mixin";

export default {
  components: {
    AppDialog,
  },
  mixins: [ModelMixin],
  data() {
    return {
      ruleDialog: {
        visible: false,
        name: "",
        startUrls: "",
      },
      projectDialog: {
        visible: false,
        name: "",
      },
    };
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
      if (!this.ruleDialog.name || !this.ruleDialog.startUrls) {
        console.log("Error, name and startUrls must not null");
        return;
      }
      const rule = Object.assign(this.getBaseRule(), {
        name: this.ruleDialog.name,
        startUrls: stringSplit(this.ruleDialog.startUrls),
      });
      this.$store.dispatch("ADD_RULE", rule);
      this.ruleDialog.visible = false;
    },
    handleDeleteRule(rule) {
      this.$store.dispatch("REMOVE_RULE", rule);
    },
    handleDeleteProject(project) {
      this.$store.dispatch("REMOVE_PROJECT", project);
    },
    handleAddProject() {
      const project = Object.assign(this.getBaseProject(), {
        name: this.projectDialog.name,
      });
      this.$store.dispatch("ADD_PROJECT", project);
      this.projectDialog.visible = false;
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