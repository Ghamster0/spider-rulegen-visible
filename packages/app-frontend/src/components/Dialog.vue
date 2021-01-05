<template>
  <dialog :id="dialogId">
    <div class="dialog-title">
      <span>{{ title }}</span>
      <button class="close-btn" @click="onClose">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="dialog-body">
      <slot></slot>
    </div>
  </dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: "",
    },
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
  top: 50%;
  transform: translate(0, -50%);
  background-color: #ddd;
  border-radius: 5px;
  padding: 0;
}
.dialog-title {
  position: relative;
  padding: 15px 15px 15px;
}
.dialog-body {
  padding: 25px 15px;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>