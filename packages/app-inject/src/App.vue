<template>
  <div>Hello world</div>
</template>

<script>
import { SelectorGadget } from "@spider-rulegen/vendor";

export default {
  created() {
    SelectorGadget.toggle();
  },
};
</script>

<style>
</style>