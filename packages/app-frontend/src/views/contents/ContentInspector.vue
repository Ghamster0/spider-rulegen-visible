<template>
  <div v-if="template" class="h-100">
    <div
      style="padding: 5px; padding-left: 10px; border-bottom: 1px solid #eee"
    >
      <span>{{ template.isRoot ? "Root" : template.listName }}</span>
    </div>
    <div style="border-bottom: 1px solid #eee">
      <div
        class="conf d-flex"
        :class="{ active: editing }"
        @click="editing = true"
        v-click-outside="
          () => {
            editing = false;
          }
        "
      >
        <template v-if="template.isRoot">
          <div class="template-setting">
            <span>抽取类型</span>
            <select :value="template.method" @change="handleMethodChange">
              <option v-for="method in ['table', 'object']" :key="method">
                {{ method }}
              </option>
            </select>
          </div>
        </template>
        <template v-else>
          <div class="template-setting">
            <span>字段名</span>
            <input v-model="template.listName" />
          </div>
          <div class="template-setting">
            <span>类型</span>
            <select :value="template.method" @change="handleMethodChange">
              <option
                v-for="method in ['table', 'object', 'text']"
                :key="method"
              >
                {{ method }}
              </option>
            </select>
          </div>
          <div
            class="template-setting"
            v-if="
              !(template.method === 'table' || template.method === 'object')
            "
          >
            <span>CSS Selector</span>
            <input
              style="width: 300px"
              id="rawSelectorInput"
              v-model="template.rawSelector"
              @keyup.enter="loadSelector"
            />
          </div>
        </template>
      </div>
    </div>
    <div
      style="
        padding: 5px;
        overflow-y: scroll;
        height: calc(100% - 88px);
        box-sizing: border-box;
      "
    >
      <div>
        <span>抽取结果</span>
      </div>
      <pre style="white-space: pre-wrap">{{ contents }}</pre>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  clearSelector,
  extractContent,
  loadContentsSelector,
} from "../../utils/backend";
import normalizeTemplate from "../../utils/normalizeTemplate";
import { isExpandable } from "../../utils/utils";
export default {
  props: {
    active: String,
    rootTemplate: Object,
  },
  data() {
    return { editing: false };
  },
  computed: {
    ...mapState(["groupId", "ruleId", "predictVersion"]),
    template() {
      const find = (t, id) => {
        if (!t) {
          return null;
        }
        if (t.id === id) {
          return t;
        }
        if (isExpandable(t)) {
          for (const ct of t.listData) {
            const r = find(ct, id);
            if (r) {
              return r;
            }
          }
        }
        return null;
      };
      return find(this.rootTemplate, this.active);
    },
    rawSelector() {
      if (this.template) {
        return this.template.rawSelector;
      } else {
        return "";
      }
    },
    contents() {
      return this.template
        ? JSON.stringify(this.template.contents, null, 2)
        : "";
    },
  },
  watch: {
    template() {
      this.editing = false;
      if (this.template) {
        this.template.contents = "";
      }
      this.$nextTick(() => {
        if (this.template) {
          this.refreshContent();
          this.editing = true;
        }
      });
    },
    editing(newVal) {
      if (newVal) {
        if (!isExpandable(this.template)) {
          this.loadSelector();
        }
      } else {
        clearSelector();
      }
    },
    predictVersion() {
      // refreshContent on rawSelector changed by SG
      this.refreshContent();
    },
  },
  methods: {
    handleMethodChange(e) {
      const newMethod = e.target.value;
      if (isExpandable(newMethod)) {
        if (this.template.listData === undefined) {
          this.$set(this.template, "listData", []);
          clearSelector();
        }
      } else {
        this.$delete(this.template, "listData");
        this.loadSelector();
      }
      this.template.method = newMethod;
      this.refreshContent();
    },
    loadSelector() {
      loadContentsSelector({
        indicator: {
          groupId: this.groupId,
          ruleId: this.ruleId,
          id: this.template.id,
        },
        selector: this.template.rawSelector,
      });
    },
    refreshContent() {
      extractContent({
        indicator: {
          groupId: this.groupId,
          ruleId: this.ruleId,
          id: this.template.id,
        },
        template: normalizeTemplate(this.template),
      });
    },
  },
};
</script>

<style scoped>
.conf {
  margin: 10px;
  padding: 10px;
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #eee;
}
.conf.active {
  border-color: rgb(120, 178, 255);
}
.template-setting {
  margin-right: 10px;
}
.template-setting > span {
  display: inline-block;
  margin-right: 5px;
}
</style>