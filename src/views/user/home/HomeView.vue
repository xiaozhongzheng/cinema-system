<template>
  <div id="userHome">

    <el-carousel
      indicator-position="outside"
      :interval="3000"
      height="600px"
    >
      <el-carousel-item
        v-for="item in urlArr"
        :key="item"
      >
        <img
          :src="item"
          width="100%"
          height="100%"
        >
      </el-carousel-item>
    </el-carousel>

    <div class="mainHome">
      <div class="left">

        <user-home :filmArr="hotFilmArr" :status="2"></user-home>

        <user-home :filmArr="upcomingArr" :status="1"></user-home>

      </div>

      <div class="right">
        <h1>热门榜单Top{{ num }}</h1>
        <div
          style="width: 100%;height: 150px;position: relative;border: 1px solid pink"
          class="top01"
          v-if="topFilmArr.length!=0"
          @click="toShowFilmDetail(topFilmArr[0].id)"
        >
          <img
            :src="topFilmArr[0].image"
            height="100%"
            style="vertical-align: middle;float: left;"
          >
          <div style="width: 60%;height: 100%;
  float: left;padding-left: 20px;font-size: 20px">
            <p style="margin-top: 20%">{{ topFilmArr[0].title }}</p>
            <p>
              <span style="color: rgb(231, 189, 94);">
                {{ topFilmArr[0].averageScore * 2 }} 分
              </span>
            </p>
            <img
              :src="require('@/assets/top1.png')"
              style="position: absolute;top: 0;left: 0"
            >
          </div>
        </div>
        <p
          style="width: 100%;height: 50px;line-height: 50px;"
          v-for="(film,i) in topFilmArr"
          v-if="i!=0"
          class="filmTop6"
          @click="toShowFilmDetail(film.id)"
        >
          <i style="color: rgb(207, 207, 207);font-size: 22px;">{{ i + 1 }}</i>
          <span style="font-size: 16px;margin-left: 10px">{{ film.title }}</span>
          <span
            style="float: right;color: rgb(231, 189, 94);font-size: 18px"
            v-if="film.averageScore!=null"
          >
            {{ film.averageScore * 2 }} 分
          </span>
          <span
            style="float: right;color: rgb(231, 189, 94);font-size: 18px"
            v-else
          >
            暂无评分
          </span>
        </p>
      </div>
    </div>

  </div>

</template>

<script>
import film from "@/api/film";
import UserHome from '@/components/UserHome.vue';
export default {
  data() {
    return {
      urlArr: [
        require("@/assets/lun01.jpg"),
        require("@/assets/lun02.jpg"),
        require("@/assets/lun03.jpg"),
      ],
      hotFilmArr: [],
      upcomingArr: [],
      topFilmArr: [],
      num: 6,
    };
  },
  components: {
    UserHome
  },
  created() {
    this.getFilmes();
  },
  methods: {
    toShowAllFilm() {
      this.$router.push({
        name: "movies",
      });
    },

    // async getFilmListByScore() {
    // },
    async getFilmes() {
      // 获取正在上映的电影
      this.hotFilmArr = await film.getFilmesByStatus(2);
      // 获取即将上映的影片
      this.upcomingArr = await film.getFilmesByStatus(1);
      // 获取排名前几的影片（根据评分排名）
      this.topFilmArr = await film.getFilmListByScore(this.num);
    },
    toShowFilmDetail(filmId) {
      this.$router.push({
        name: "showDetail",
        path: `/user/showDetail`,
        params: {
          filmId,
        },
      });
      // this.$router.push({
      //   path: `/user/showDetail/${filmId}`
      // });
    },
    toBuyFilm(filmId) {
      this.$router.push({
        name: "buy",
        query: {
          filmId,
        },
      });
    },
  },
};
</script>



<style scoped>
#userHome {
  box-sizing: border-box;
  width: 1200px;
  margin: auto;
  /* background-color: pink; */
}

ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.mainHome {
  display: flex;
}
.mainHome .left {
  /* float: left; */
  width: 65%;
}


.mainHome .right {
  /* float: left; */
  width: 35%;
  text-align: left;
  padding: 20px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.bg-purple {
  background: #fff;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.filmTop6:hover {
  background-color: rgb(234, 238, 243);
  cursor: pointer;
}
.top01:hover {
  background-color: rgb(234, 238, 243);
  cursor: pointer;
}

</style>
