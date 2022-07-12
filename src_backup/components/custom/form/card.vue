<template>
  <lk-field
    :required="items.required"
    :label="items.label"
    type="idcard"
    placeholder="請輸入身份證"
    v-model="items.value"
  />
</template>

<script>
import form from "../../mixin/form";
export default {
  data() {
    return {};
  },
  mixins: [form]
};
</script>

<style scoped lang="scss"></style>
