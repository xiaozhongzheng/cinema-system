<template>
  <div
    style="padding: 20px 10px 100px 10px"
    id="home"
  >
    <div class="echarts">
      <HomeBar type="bar"></HomeBar>
      <HomeBar type="line"></HomeBar>
    </div>


  </div>
</template>


<script>

import HomeBar from "./components/HomeBar.vue";
export default {
  components: {
    HomeBar,
  },
  data() {
    return {

    };
    // data底部
  },

  created() {

  },
  mounted() {

  },


  methods: {


  },
};
</script>

<style scoped lang="scss">
#home {
  padding: 10px;
  .echarts {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
