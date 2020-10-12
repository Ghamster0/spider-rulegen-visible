<template>
  <div>
    <div class="select" @click="optionVisible = !optionVisible">
      <div class="select-content">{{ value[prop] }}</div>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="options" v-show="optionVisible">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppSelect",
  props: {
    value: {},
    prop: String,
  },
  data() {
    return {
      optionVisible: false,
    };
  },
};
</script>

<style scoped>
.select {
  padding-left: 3px;
  background-color: white;
  border: 1px solid white;
}
.select-content {
  display: inline-block;
}
.select:hover {
  border-color: rgb(224, 224, 224);
}
.options {
  position: absolute;
}
</style>