<template>
  <div id="movies">
    <header>
      <div class="nav">
        <span class="label">类型：</span>
        <span class="commonStyle" :class="{ selecting: activeType < 0 }" @click="selectTypeAll">全部</span>
        <template v-for="(item, index) in typeArr">
          <span :key="item" class="commonStyle" :class="{ selecting: activeType === index }"
            @click="updateTypeColor(index)">
            {{ item }}
          </span>

        </template>

      </div>
      <div class="nav">
        <span class="label">地区：</span>
        <span class="commonStyle" :class="{ selecting: activeRegion < 0 }" @click="selectRegionAll">全部</span>
        <template v-for="(item, index) in regionArr">
          <span :key="item" class="commonStyle" :class="{ selecting: activeRegion === index }"
            @click="updateRegionColor(index)">
            {{ item }}
          </span>
        </template>
      </div>
    </header>

    <div v-if="filmArr.length">
      <div class="showFilm">
        <template v-for="film in filmArr">
          <FilmItem :item="film"></FilmItem>
        </template>
      </div>
      <div class="page">
        <Pager :pageNo="pageNo" :pageSize="pageSize" :total="total" :pageSizes="[18]"
          @changePageNo="handleCurrentChange">
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


<style scoped lang="scss">
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
  padding: 20px;

  &>header {
    width: 100%;
    height: 100px;
    padding: 0;

    .label {
      color: #999999;
    }

    .nav {
      height: 50%;
      display: flex;
      gap: 20px;

    }

    .selecting {
      color: white;
      background-color: red;
      border-radius: 15px;
    }

    .commonStyle {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;

      &:hover {
        cursor: pointer;
      }
    }

  }

  .showFilm {
    margin: 20px 0;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    /* grid-template-rows: repeat(6,260px); */
    grid-gap: 20px;
  }

  .page {
    margin: auto;
  }

}
</style>
