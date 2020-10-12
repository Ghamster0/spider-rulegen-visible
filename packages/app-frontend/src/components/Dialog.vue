<template>
  <dialog :id="dialogId">
    <button @click="onClose" style="margin-bottom: 10px">X</button>
    <slot></slot>
  </dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
  },
  data() {
    return {
      dialogId: "dialog_" + Math.random(),
    };
  },
  methods: {
    show() {
      document.getElementById(this.dialogId).show();
    },
    hide() {
      document.getElementById(this.dialogId).close();
    },
    onClose() {
      this.$emit("update:visible", false);
    },
  },
  created() {
    if (this.visible) {
      this.show();
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.show();
      } else {
        this.hide();
      }
    },
  },
};
</script>

<style scoped>
dialog {
  position: fixed;
  background-color: #ddd;
  border-radius: 5px;
}
</style>