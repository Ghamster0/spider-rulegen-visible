<template>
  <ul>
    <li
      v-for="item in coptions"
      :key="item.key"
      :class="{'is-active': active===item.key}"
      @click="handleClick(item)"
    >
      <a>{{item.value}}</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    options: Array,
    active: String,
  },
  computed: {
    coptions() {
      return this.options.map((item) => {
        return typeof item === "string" ? { key: item, value: item } : item;
      });
    },
  },
  methods: {
    handleClick(item) {
      this.$emit("update:active", item.key);
    },
  },
};
</script>

<style scoped>
ul {
  margin: 0 0 -1px;
  padding: 0;
  list-style: none;
}
ul > li {
  cursor: pointer;
  padding: 0 5px;
  display: inline-block;
  height: 100%;
  box-sizing: border-box;
}
ul > li.is-active {
  border-bottom: 2px rgb(26, 115, 232) solid;
}
li > a {
  vertical-align: middle;
}
</style>