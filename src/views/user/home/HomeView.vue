<template>
  <div
    id="userHome"
  >

    <el-carousel
      indicator-position="outside"
      interval="3000"
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

        <div style="text-align: left;height: 30px;line-height: 30px;margin-bottom: 20px;">
          <span style="color: rgb(231, 209, 121);font-size: 24px">正在热映（{{ hotFilmArr.length }}）</span>

          <el-link
            type="primary"
            style="float: right;"
            @click="toShowAllFilm()"
          >
            全部
            <i class="el-icon-arrow-right"></i>
          </el-link>
        </div>

        <ul>
          <li
            v-for="(item,i) in hotFilmArr"
            v-if="i<=7"
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

        </ul>
        
        <div style="text-align: left;height: 30px;line-height: 30px;margin: 20px 0px">
          <span style="color: rgb(231, 209, 121);font-size: 24px">即将上映（{{ upcomingArr.length }}）</span>

          <el-link
            type="primary"
            style="float: right;"
            @click="toShowAllFilm()"
          >
            全部
            <i class="el-icon-arrow-right"></i>
          </el-link>
        </div>
        <ul>
          <li
            v-for="(item,i) in upcomingArr"
            v-if="i<=7"
            class="buyFilmes"
          >
            <img
              :src="item.image"
              width="100%"
              height="246"
              @click="toShowFilmDetail(item.id)"
            >
            <span style="position: absolute;bottom: 50px;left: 10px;color: white;font-weight: bold;">{{ item.title }}</span>
            <div
              style=""
              class="buyBtn"
              @click="toBuyFilm(item.id)"
            >购票</div>
          </li>
          <li v-if="upcomingArr.length<7" v-for="n in (8-upcomingArr.length)%4" >
             
          </li>

        </ul>
       
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
import { getRecentFilmImage, getFilmListByScore } from "@/api/film";
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
  created() {
    // this.getRecentImages();
    this.getFilmes(2);
    this.getFilmes(1);
    this.getFilmListByScore();
  },
  methods: {
    toShowAllFilm() {
      this.$router.push({
        name: "movies",
      });
    },
    getRecentImages() {
      getRecentFilmImage(this.num).then((res) => {
        if (res.data.code === 1) {
          this.urlArr = res.data.data;
        }
      });
    },
    getFilmListByScore() {
      getFilmListByScore(this.num).then((res) => {
        if (res.data.code === 1) {
          this.topFilmArr = res.data.data;
        }
      });
    },
    getFilmes(status) {
      this.$http.get(`/film/list/${status}`).then((res) => {
        if (res.data.code === 1) {
          if (status == 2) {
            this.hotFilmArr = res.data.data;
          } else {
            this.upcomingArr = res.data.data;
          }
        }
      });
    },
    toShowFilmDetail(id) {
      this.$router.push({
        name: "showDetail",
        query: {
          filmId: id,
        },
      });
    },
    toBuyFilm(id) {
      this.$router.push({
        name: "buy",
        query: {
          filmId: id,
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
.mainHome .left ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.mainHome .left ul li {
  width: 177px;
  position: relative;
}
.mainHome .left ul li img {
  /* 去掉图片下面的空白 */
  display: block;
}

/* .mainHome .left ul .buyFilmes {

} */
.mainHome .left ul .buyFilmes:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transform: scale(1.1);
  
}
.mainHome .left ul li .buyBtn {
  color: red;
  width: 100%;
  height: 35px;
  line-height: 35px;
  background-color: #fff;
  border: 1px solid pink;
  border-top: 0;
}
.mainHome .left ul li .buyBtn:hover {
  background-color: red;
  color: white;
}
.mainHome .left ul li:nth-child(n + 5) {
  margin-top: 20px;
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
.btn:hover {
  background: red;
  color: white !important;
}
</style>