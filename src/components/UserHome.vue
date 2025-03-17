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

    <ul class="box">
      <li
        v-for="item in handleFilmArr"
        :key="item.id"
        class="buyFilmes"
      >
        <img
          :src="item.image"
          width="100%"
          height="246"
          @click="toShowFilmDetail(item.id)"
        >
        <!-- <span style="position: absolute;bottom: 50px;left: 10px;color: white;font-weight: bold;">{{ item.title }}</span> -->
        <div
          class="buyBtn"
          @click="toBuyFilm(item.id)"
        >购票</div>
      </li>
      <!--产生空盒子，用于解决flex布局问题 -->
      <!-- <div
        v-if="filmArr.length<7 "
        style="display: flex;"
      >
        <li v-for="k in (8-filmArr.length)%4">
        </li>
      </div> -->
    </ul>
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
export default {
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

    toShowFilmDetail(id) {
      this.$router.push({
        name: "showDetail",
        params: {
          filmId: id,
        },
      });
    },
    toBuyFilm(id) {
      this.$router.push({
        name: "buy",
        params: {
          filmId: id,
        },
      });
    },
    toShowAllFilm() {
      this.$router.push({
        name: "movies",
      });
    },
  },
};
</script>


<style scoped lang="less">
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
#filmHome {
  margin-top: 20px;
  .head {
    text-align: left;
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
  }
  ul {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 20px;
  }

  ul li img {
    /* 去掉图片下面的空白 */
    display: block;
  }
  .buyFilmes:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transform: scale(1.1);
  }
  ul li .buyBtn {
    color: red;
    width: 100%;
    height: 35px;
    line-height: 35px;
    background-color: #fff;
    border: 1px solid pink;
    border-top: 0;
  }
  ul li .buyBtn:hover {
    background-color: red;
    color: white;
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
