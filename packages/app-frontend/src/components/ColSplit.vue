<template>
  <div class="column">
    <div class="column-left">
      <div class="resize-bar"></div>
      <div class="resize-line" :style="borderColor"></div>
      <div class="resize-save">
        <slot name="left"></slot>
      </div>
    </div>
    <div class="column-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "",
    },
  },
  computed: {
    borderColor() {
      const res = {};
      if (this.color) {
        res["border-color"] = this.color;
      }
      return res;
    },
  },
};
</script>

<style scoped>
.column {
  height: 100%;
  overflow: hidden;
}
.column-left {
  height: 100vh;
  background-color: #eee;
  position: relative;
  float: left;
}
.column-right {
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  overflow: hidden;
}
.resize-save {
  position: absolute;
  top: 0;
  right: 2px;
  bottom: 0;
  left: 0;
  overflow-x: hidden;
}
.resize-bar {
  width: 200px;
  height: inherit;
  resize: horizontal;
  cursor: ew-resize;
  cursor: col-resize;
  opacity: 0;
  overflow: scroll;
}
/* 拖拽线 */
.resize-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border-left: 2px solid rgba(255, 255, 255, 0);
  border-right: 1px solid #bbb;
  pointer-events: none;
}
.resize-bar:hover ~ .resize-line,
.resize-bar:active ~ .resize-line {
  border-right: 1px dashed skyblue;
}
.resize-bar::-webkit-scrollbar {
  width: 200px;
  height: inherit;
}
</style>