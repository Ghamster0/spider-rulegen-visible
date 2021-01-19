<template>
  <div class="tab d-flex a-center">
    <i class="fas fa-spider" style="color: #333; padding-left: 5px"></i>
    <select
      class="ml-5"
      v-model="activeGroupId"
      style="flex: auto; min-width: 1px"
    >
      <option v-for="group in groups" :key="group.id" :value="group.id">
        {{ group.name }}
      </option>
    </select>
    <button
      class="text-btn"
      v-if="groupId"
      style="padding: 2px 4px"
      @click="$store.dispatch('deleteGroup', groupId)"
    >
      <i class="far fa-trash-alt"></i>
    </button>
    <button
      class="text-btn"
      style="padding: 2px 4px"
      @click="groupDialog.visible = true"
    >
      <i class="fas fa-plus-circle"></i>
    </button>
    <app-dialog :visible.sync="groupDialog.visible">
      <form class="form">
        <div class="form-item">
          <label for="name">名称</label>
          <input
            v-model="groupDialog.name"
            style="width: 100%; box-sizing: border-box"
          />
        </div>
        <div class="form-item">
          <label></label>
          <button @click.prevent="handleAddSite">确认</button>
        </div>
      </form>
    </app-dialog>
  </div>
</template>

<script>
import AppDialog from "../components/Dialog.vue";
import { mapState } from "vuex";
import { getDefaultGroup } from '../utils/defaultValues';

export default {
  components: {
    AppDialog,
  },
  computed: {
    ...mapState(["groups", "groupId"]),
    activeGroupId: {
      get() {
        return this.$store.state.groupId;
      },
      set(val) {
        this.$store.dispatch("selectGroup", val);
      },
    },
  },
  data() {
    return {
      groupDialog: {
        visible: false,
        name: "",
      },
    };
  },
  methods: {
    handleAddSite() {
      const group = Object.assign(getDefaultGroup(), {
        name: this.groupDialog.name,
      });
      this.$store.commit("PUSH_GROUP", group);
      this.groupDialog.visible = false;
      this.groupDialog.name = "";
    },
  },
};
</script>

<style>
</style>