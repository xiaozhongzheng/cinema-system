<template>
  <div
    style="padding: 20px 10px 100px 10px"
    id="home"
  >
    <div class="echarts">
      <!-- 展示每部影片的购票数 -->
      <HomeBar type="bar"></HomeBar>
      <!-- 展示每个月的销量 -->
      <HomeBar type="line"></HomeBar>
      <!-- 展示不同类型的影片的票房数  -->
      <home-pie></home-pie>
    </div>


  </div>
</template>


<script>

import HomeBar from "./components/HomeBar.vue";
import HomePie from './components/HomePie.vue';
export default {
  components: {
    HomeBar,
    HomePie,
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
