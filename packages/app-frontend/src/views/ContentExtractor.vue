<template>
  <div style="padding: 10px; background-color: rgb(189, 208, 232)">
    <table
      v-click-outside="
        () => {
          editingKey = '';
        }
      "
    >
      <tr>
        <th style="width: 200px">名称</th>
        <th style="width: 100px">类型</th>
        <th>CSS选择器</th>
        <th style="width: 220px">
          <button v-if="hasTemplate" @click="handleRemoveTemplate">
            清空模板
          </button>
        </th>
      </tr>
      <template v-for="row in tableData">
        <template v-if="row.data.id === editingKey">
          <tr :key="row.data.id">
            <td>
              <span v-if="row.isRoot">根节点</span>
              <div
                v-else
                class="cell"
                :style="{ 'margin-left': (1 + row.depth) * 15 + 'px' }"
              >
                <input v-model="row.data.listName" />
              </div>
            </td>
            <td>
              <div class="cell">
                <select
                  :value="row.data.method"
                  @change="handleMethodChange(row, $event)"
                >
                  <option
                    v-for="opt in row.isRoot
                      ? ['table', 'object']
                      : ['table', 'object', 'text']"
                    :key="opt"
                    :value="opt"
                  >
                    {{ opt }}
                  </option>
                </select>
              </div>
            </td>
            <td>
              <div class="cell">
                <input
                  v-if="!isExpandable(row.data.method)"
                  v-model="row.data.rawSelector"
                  @keyup.enter="loadSelector(row.data)"
                />
              </div>
            </td>
            <td>
              <button @click="editingKey = ''">save</button>
              <button @click="extractContent(row)">test</button>
            </td>
          </tr>
          <tr :key="row.data.id + ' '">
            <td colspan="4">{{ row.data.contents }}</td>
          </tr>
        </template>
        <template v-else>
          <tr :key="row.data.id" @dblclick="handleEdit(row)">
            <td>
              <span v-if="row.isRoot">根节点</span>
              <span
                v-else
                :style="{ 'margin-left': (1 + row.depth) * 15 + 'px' }"
              >
                {{ row.data.listName }}
              </span>
            </td>
            <td>{{ row.data.method }}</td>
            <td>{{ row.data.rawSelector }}</td>
            <td>
              <button @click="handleEdit(row)">edit</button>
              <button v-if="!row.isRoot" @click="handleDelete(row)">
                delete
              </button>
              <button
                @click="handleAppendChild(row)"
                v-if="isExpandable(row.data.method)"
              >
                append
              </button>
            </td>
          </tr>
        </template>
      </template>
      <tr v-if="false"></tr>
    </table>
    <button v-if="!hasTemplate" @click="handleInitTemplate">+</button>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import {
  clearSelector,
  loadContentsSelector,
  extractContent,
} from "../utils/backend";
import normalizeTemplate from "../utils/normalizeTemplate";
import { mapState } from "vuex";

export const getPathToExtractor = () => {};

const flatNested = (rows, itemArray, depth = 0) => {
  for (const item of itemArray) {
    rows.push({ data: item, depth: depth, belong: itemArray });
    if (item.method === "table" || item.method === "object") {
      flatNested(rows, item.listData, depth + 1);
    }
  }
};

export default {
  props: {
    template: {},
  },
  computed: {
    ...mapState(["groupId", "ruleId"]),
    tableData() {
      const rows = [];
      if (this.template) {
        rows.push({ data: this.template, isRoot: true });
        flatNested(rows, this.template.listData);
      }
      return rows;
    },
    hasTemplate() {
      return !!this.template;
    },
  },
  data() {
    return {
      editingKey: "",
    };
  },
  methods: {
    isExpandable(t) {
      return t === "table" || t === "object";
    },
    loadSelector(rowData) {
      loadContentsSelector({
        indicator: {
          groupId: this.groupId,
          ruleId: this.ruleId,
          id: rowData.id,
        },
        selector: rowData.rawSelector,
      });
    },
    extractContent(row) {
      extractContent({
        indicator: {
          groupId: this.groupId,
          ruleId: this.ruleId,
          id: row.data.id,
        },
        template: normalizeTemplate(row.data),
      });
    },
    handleRemoveTemplate() {
      this.editingKey = "";
      this.$emit("update:template", null);
    },
    handleInitTemplate() {
      this.$emit("update:template", {
        id: uuidv4(),
        isRoot: true,
        method: "table",
        rawSelector: "",
        listData: [],
        contents: {},
      });
    },
    handleEdit(row) {
      this.editingKey = row.data.id;
    },
    setListData(rowData) {
      if (this.isExpandable(rowData.method)) {
        if (rowData.listData === undefined) {
          this.$set(rowData, "listData", []);
        }
      } else {
        this.$delete(rowData, "listData");
      }
    },
    handleMethodChange(row, e) {
      const newMethod = e.target.value;
      if (this.isExpandable(newMethod)) {
        if (row.data.listData === undefined) {
          this.$set(row.data, "listData", []);
        }
      } else {
        this.$delete(row.data, "listData");
      }
      row.data.method = newMethod;
    },
    handleDelete(row) {
      const idx = row.belong.findIndex((item) => item.id === row.data.id);
      if (idx >= 0) {
        row.belong.splice(idx, 1);
      }
    },
    handleAppendChild(row) {
      const tableItem = row.data;
      const newItem = {
        id: uuidv4(),
        listName: "key",
        method: "text",
        rawSelector: "",
        contents: {},
      };
      tableItem.listData.push(newItem);
      this.$nextTick(() => {
        for (const r of this.tableData) {
          if (r.data.id === newItem.id) {
            this.handleEdit(r);
            break;
          }
        }
      });
    },
  },
  watch: {
    editingKey(newVal) {
      if (newVal) {
        const row = this.tableData.find((i) => i.data.id === newVal);
        if (row) {
          this.loadSelector(row.data);
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
table,
th,
td {
  border: 1px solid black;
}
table {
  width: 100%;
  border-collapse: collapse;
}
.cell {
  box-sizing: border-box;
  padding: 5px;
}
.cell select,
.cell input {
  box-sizing: border-box;
  width: 100%;
}
</style>