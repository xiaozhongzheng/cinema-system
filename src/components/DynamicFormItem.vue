<template>
  <el-form-item :label="item.label">
    {{ item }}
    <template v-if="item.type === 'input'">
      <el-input
        v-model="formData[item.prop]"
        :placeholder="item.placeholder"
      ></el-input>
    </template>

    <template v-if="item.type === 'select'">
      <el-select
        v-model="formData[item.prop]"
        :placeholder="item.placeholder"
      >
        <el-option
          v-for="(option, index) in item.options"
          :key="index"
          :label="option.label"
          :value="option.value"
        ></el-option>
      </el-select>
    </template>
  </el-form-item>
</template>
<script>
export default {
  name: "DynamicFormItem",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  created(){
    console.log(this.item,'item')
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>
