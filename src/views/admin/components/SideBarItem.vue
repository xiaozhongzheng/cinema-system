<template>
  <div v-if="!route.hidden">
    <!-- 路径跳转 -->
    <template v-if="route.name === 'admin' && $store.getters.roleId === 2">
      <div
        v-for="item in route.children"
        :key="item.path"
      >
        <el-menu-item
         :index="item.path"
       >
         <i :class="item.meta?.icon"></i>
         <span slot="title">{{ item.meta?.title }}</span>
       </el-menu-item>
      </div>
    </template>
    <template v-if="route.name === 'employee' && $store.getters.roleId === 1">
      <div
        v-for="item in route.children"
        :key="item.path"
      >
        <el-menu-item
         :index="item.path"
       >
         <i :class="item.meta?.icon"></i>
         <span slot="title">{{ item.meta?.title }}</span>
       </el-menu-item>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    route: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  created() {

  },
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
