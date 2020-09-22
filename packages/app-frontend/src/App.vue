<template>
  <div>
    <h1>Spider Rule Generator</h1>
    <el-input v-model="rule"></el-input>
    <el-button @click="handleConfirm">确认</el-button>
    <el-button @click="handleDeactive">取消</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rule: "",
    };
  },
  methods: {
    handleConfirm() {
      bridge.emit("msg-to-backend", {
        type: "selector:load",
        value: this.rule,
      });
    },
    handleDeactive() {
      bridge.emit("msg-to-backend", { type: "selector:deactive" });
    },
  },
  created() {
    bridge.on("msg-from-backend", (e) => {
      if (e.type === "selector:update") {
        this.rule = e.value;
      }
    });
  },
};
</script>

<style>
</style>