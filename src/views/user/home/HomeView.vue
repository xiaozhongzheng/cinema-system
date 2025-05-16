<template>
  <div id="userHome">
    <el-carousel indicator-position="outside" :interval="3000" class="carousel" height="500px">
      <el-carousel-item v-for="url in urlArr" :key="item">
        <el-image class="img" :src="url" :fit="cover"></el-image>
      </el-carousel-item>
    </el-carousel>

    <div class="mainHome">
      <div class="left">
        <user-home :filmArr="hotFilmArr" :status="2"></user-home>
        <user-home :filmArr="upcomingArr" :status="1"></user-home>
      </div>

      <article>
        <div class="title">热门榜单Top{{ num }}</div>
        <div v-if="topFilmArr.length" class="rankList">
          <div class="top01" @click="toShowFilmDetail(topFilmArr[0].id)">
            <img :src="topFilmArr[0].image">
            <div class="box">
              <span>{{ topFilmArr[0].title }}</span>
              <span class="score">
                {{ topFilmArr[0].averageScore * 2 }} 分
              </span>
              <img class="top1-icon" :src="require('@/assets/images/top1.png')">
            </div>
          </div>
          <div v-for="(film, i) in topFilmArr.slice(1)" class="filmTop6" @click="toShowFilmDetail(film.id)">
              <div>
                <span class="rank">{{ i + 2 }}</span>
                <span class="name"> {{ film.title }}</span>
              </div>
              <span class="score" v-if="film.averageScore != null">
                {{ film.averageScore * 2 }} 分
              </span>
              <span v-else>
                暂无评分
              </span>
          </div>
        </div>

      </article>
    </div>

  </div>

</template>

<script>
import film from "@/api/film";
import UserHome from './components/UserHome.vue';
export default {
  data() {
    return {
      urlArr: [
        require("@/assets/images/lun01.jpg"),
        require("@/assets/images/lun02.jpg"),
        require("@/assets/images/lun03.jpg"),
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



<style scoped lang="scss">
#userHome {
  box-sizing: border-box;
  width: 1200px;
  margin: auto;
}

.mainHome {
  display: flex;

  .left {
    width: 65%;
  }

  article {
    // width: 35%;
    flex: 1;
    text-align: left;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 25px;

    .title {
      color: rgb(226, 107, 64);
      font-size: 24px;
      font-weight: 500;
    }

    .rankList {
      display: flex;
      gap: 20px;
      flex-direction: column;

      .score {
        font-size: 18px;
        color: rgb(226, 190, 108);
      }

      .top01 {
        display: flex;
        gap: 20px;
        position: relative;
        border: 1px solid pink;

        &>img {
          width: 120px;
        }

        .top1-icon {
          position: absolute;
          left: 0;
          top: 0;
        }

        .box {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          font-size: 18px;
        }

        &:hover {
          background-color: rgb(234, 238, 243);
          cursor: pointer;
        }
      }

      .filmTop6 {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .rank {
          color: rgb(207, 207, 207);
          font-size: 22px;
        }

        .name {
          font-size: 16px;
          margin-left: 10px
        }

        &:hover {
          background-color: rgb(234, 238, 243);
          cursor: pointer;
        }
      }
    }


  }
}

.mainHome .el-carousel__item h3 {
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
</style>
