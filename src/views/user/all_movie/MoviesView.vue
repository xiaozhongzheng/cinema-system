<template>
  <div id="movies" style="margin-top: 3%">
    <div class="head">

      <div class="nav">
        <div>
          <span>类型：</span>
          <span class="commonStyle" :class="{ selecting: activeType < 0 }" @click="selectTypeAll">全部</span>
        </div>
        <template v-for="(item, index) in typeArr">
          <div class="item">
            <span class="commonStyle" :class="{ selecting: activeType === index }" @click="updateTypeColor(index)"
              :key="item">
              {{ item }}
            </span>
          </div>

        </template>
      </div>
      <div class="nav">
        <div>
          <span>地区：</span>
          <span class="commonStyle" :class="{ selecting: activeRegion < 0 }" @click="selectRegionAll">全部</span>

        </div>
        <template v-for="(item, index) in regionArr">
          <div class="item">
            <span class="commonStyle" :class="{ selecting: activeRegion === index }" @click="updateRegionColor(index)"
              :key="item">
              {{ item }}
            </span>
          </div>
        </template>
      </div>
    </div>
    <div v-if="filmArr.length">
      <div class="showFilm">
        <template v-for="film in filmArr">
          <FilmItem :item="film"></FilmItem>
        </template>
      </div>
      <div class="page">
        <Pager :pageNo="pageNo" :pageSize="pageSize" :total="total" :pageSizes="[18]" @changePageNo="handleCurrentChange">
        </Pager>
      </div>
    </div>


    <div v-else>
      <el-empty :image-size="400" description="这里空空如也"></el-empty>
    </div>
  </div>
</template>

<script>
import { pageQueryFilm } from "@/api/film";
import { throttle } from '@/utils/optimization'
import FilmItem from "../components/FilmItem.vue";
import Pager from "@/components/Pager.vue";
export default {
  name: "MoviesView",
  components: {
    FilmItem,
    Pager
  },
  props: {
    titleName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pageSize: 18, // 每页展示18条数据
      pageNo: 1, // 默认展示第一页的数据
      title: "",
      total: "",
      isAllType: true,
      isAllRegion: true,
      typeArr: this.$constant.filmTypeArr,
      regionArr: this.$constant.regionArr,
      filmArr: [
        // {
        //   id: 12,
        //   title: "变形金刚",
        //   image: require("E:\\img\\电影管理系统图片\\1.jpg"),
        // },
        // {
        //   id: 3,
        //   title: "飞驰人生2",
        //   image: require("E:\\img\\电影管理系统图片\\2.jpg"),
        // },
      ],
      activeType: -1,
      activeRegion: -1
    };
  },
  created() {
    // this.init();
    this.pageQueryFilmList();
    // 使用节流的方法在每隔1秒发一次查询影片的请求
    this.throttlePageQueryFilm = throttle(this.pageQueryFilmList, 1000)
  },
  watch: {
    titleName() {
      this.throttlePageQueryFilm()
    },
    $route(to, from) {
      if (to.path !== '/user/movies') {
        this.filmArr = []
      }
    }
  },
  methods: {
    async pageQueryFilmList() {
      const res = await pageQueryFilm({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        type: this.activeType < 0 ? '' : this.activeType,
        region: this.activeRegion < 0 ? '' : this.activeRegion,
        title: this.titleName,
      });
      this.filmArr = res.records;
      this.total = res.total;
    },

    updateTypeColor(index) {
      this.activeType = index
      this.pageQueryFilmList();
    },
    selectTypeAll() {
      this.activeType = -1;
      this.pageQueryFilmList();
    },
    updateRegionColor(index) {
      this.activeRegion = index;
      this.pageQueryFilmList();
    },
    selectRegionAll() {
      this.activeRegion = -1;
      this.pageQueryFilmList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.pageQueryFilmList();
      document.documentElement.scrollTop = 0;
    },
  },
};
</script>


<style scoped>
ul li {
  list-style: none;
}

#movies {
  width: 1200px;
  /* height: 100vh; */
  margin: auto;
  text-align: left;
  background-color: rgb(244, 246, 248);
  /* box-sizing: border-box; */
  padding: 0 20px;

}

#movies .head {
  width: 100%;
  height: 100px;
  /* background-color: #fff; */
  border: 1px solid rgb(229, 229, 229);
  padding: 0;
  margin-left: 0;
}

.head .nav {
  height: 50%;
  /* margin-left: 20px; */
  display: flex;
}

.head .nav:first-child {
  margin-top: 20px;
}

.head .item {
  margin-left: 30px;
}

.selecting {
  color: white;
  background-color: red;
  border-radius: 15px;
  padding: 2px;
}

.commonStyle:hover {
  cursor: pointer;
}

p {
  margin: 0;
  padding: 0;
}

.showFilm {
  height: 960px;
  margin-top: 3%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  /* grid-template-rows: repeat(6,260px); */
  grid-gap: 20px;
}
.page {
  margin: auto;
}
</style>
