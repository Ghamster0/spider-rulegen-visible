<template>
  <div>
    <div
      class="row"
      :class="{ active: active === template.id }"
      :style="{ 'padding-left': 3 + depth * 10 + 'px' }"
      @click.stop="activeSync = template.id"
    >
      <div style="padding-left: 20px; position: relative">
        <i
          v-if="isExpandable"
          class="fas fa-caret-down caret-down"
          :class="{ expanded }"
          @click.stop="expanded = !expanded"
        ></i>
        <div class="d-flex">
          <span style="margin-right: auto">
            {{ template.isRoot ? "Root" : template.listName }}
          </span>
          <button
            class="text-btn light"
            v-if="isExpandable"
            @click.stop="handleAdd"
          >
            <i class="far fa-plus-square"></i>
          </button>
          <button class="text-btn light" @click.stop="$emit('remove')">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
    <template v-if="expanded && template.listData">
      <content-tree
        v-for="ct in template.listData"
        :key="ct.id"
        :template="ct"
        :depth="depth + 1"
        :active.sync="activeSync"
        @remove="handleRemove(ct.id)"
      ></content-tree>
    </template>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "ContentTree",
  props: {
    active: String,
    template: Object,
    depth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    activeSync: {
      get() {
        return this.active;
      },
      set(val) {
        this.$emit("update:active", val);
      },
    },
    isExpandable() {
      return (
        this.template.method === "table" || this.template.method === "object"
      );
    },
  },
  methods: {
    handleAdd() {
      const newId = uuidv4();
      this.template.listData.push({
        id: newId,
        listName: "new",
        method: "text",
        rawSelector: "",
        contents: "",
      });
      this.expanded = true;
      this.$emit("update:active", newId);
    },
    handleRemove(id) {
      const idx = this.template.listData.findIndex((i) => i.id === id);
      if (idx >= 0) {
        this.template.listData.splice(idx, 1);
      }
    },
  },
};
</script>

<style scoped>
.row {
  border-radius: 3px;
  padding: 3px;
  margin: 3px;
}
.row:hover {
  background-color: rgb(188, 217, 255);
}
.row.active {
  background-color: rgb(26, 115, 232);
  color: #fff;
}
.caret-down {
  position: absolute;
  left: 4px;
  top: 4px;
  transform: rotate(-90deg);
}
.caret-down.expanded {
  transform: none;
}
</style>