<template>
  <div v-if="rules.length > 0">
    <ul class="rules" style="margin-top: 1px">
      <li
        v-for="rule in rules"
        :key="rule.id"
        @click="$store.dispatch('selectRule', rule.id)"
        :class="{ 'is-active': rule.id === activeRuleId }"
      >
        {{ rule.name }}
        <button
          v-if="rule.id === activeRuleId"
          class="text-btn light"
          style="float: right"
          @click.stop="$store.dispatch('deleteRule', rule.id)"
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
        @click="handledialogOpen"
      >
        <i class="fas fa-plus-circle"></i>
      </button>
    </div>
    <app-dialog :visible.sync="dialog.visible">
      <form class="form">
        <div class="form-item">
          <label for="name">名称</label>
          <input
            v-model="dialog.name"
            style="width: 100%; box-sizing: border-box"
          />
        </div>
        <div class="form-item">
          <label>初始url</label>
          <textarea
            v-model="dialog.startUrls"
            style="width: 100%; box-sizing: border-box"
          ></textarea>
        </div>
        <div class="form-item">
          <label></label>
          <button type="submit" @click.prevent="handleAddRule">确认</button>
        </div>
      </form>
    </app-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { stringSplit } from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import AppDialog from "../components/Dialog.vue";

function getDefaultRule() {
  return {
    id: uuidv4(),
    name: "",
    example: "",
    links: [],
    extractors: [],
  };
}

export default {
  components: { AppDialog },
  data() {
    return {
      dialog: {
        visible: false,
        name: "",
        startUrls: "",
      },
    };
  },
  computed: {
    ...mapState({ rules: "rules", activeRuleId: "ruleId" }),
  },
  methods: {
    handledialogOpen() {
      this.dialog.visible = true;
      this.dialog.name = "start_urls";
      this.dialog.startUrls = window.location.href;
    },
    handleAddRule() {
      if (!this.dialog.name || !this.dialog.startUrls) {
        alert("Error, name and startUrls must not null");
        return;
      }
      const rule = Object.assign(getDefaultRule(), {
        name: this.dialog.name,
        startUrls: stringSplit(this.dialog.startUrls),
      });
      this.$store.commit("PUSH_RULE", rule);
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