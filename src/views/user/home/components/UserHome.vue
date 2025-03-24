<template>
  <div id="filmHome">
    <div class="head">
      <span style="color: rgb(231, 209, 121);font-size: 24px">
        {{status === 2 ? '正在热映' : '即将上映'}}
        ({{ filmArr.length }})
      </span>
      <el-link
        type="primary"
        style="float: right;"
        @click="toShowAllFilm()"
      >
        全部
        <i class="el-icon-arrow-right"></i>
      </el-link>
    </div>

    <div class="box">
      <template
        v-for="item in handleFilmArr"
      >
        <FilmItem :item="item" :key="item.id"></FilmItem>
      </template>

    </div>
    <!-- <el-row :gutter="10" style="background: pink">
      <el-col
        :span="6"
        v-for="item in filmArr.slice(0,4)"
        :key="item.id"
      >
      <img
          :src="item.image"
          width="100%"
          height="246"
          @click="toShowFilmDetail(item.id)"
        >
        <div
          class="buyBtn"
          @click="toBuyFilm(item.id)"
        >购票</div>
    </el-col>

    </el-row> -->
  </div>
</template>


<script>
import FilmItem from '@/views/user/components/FilmItem.vue';
export default {
  components: {
    FilmItem
  },
  data() {
    return {};
  },
  props: {
    filmArr: {
      type: Array,
      default: [],
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    handleFilmArr(){
      return this.filmArr.slice(0,8)
    }
  },
  methods: {
    toShowAllFilm() {
      this.$router.push({
        name: "movies",
      });
    },
  },
};
</script>


<style scoped lang="less">

#filmHome {
  margin-top: 20px;
  .head {
    text-align: left;
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
  }
  .box {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 20px;
  }

}
.lightgreen-box {
  background-color: lightgreen;
  height: 24px;
}
.orange-box {
  background-color: orange;
  height: 24px;
}
</style>
