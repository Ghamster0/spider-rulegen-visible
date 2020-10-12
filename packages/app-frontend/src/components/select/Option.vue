<template>
  <label @click="handleClick">
    <slot></slot>
  </label>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log("click");
    },
  },
};
</script>

<style scoped>
</style>