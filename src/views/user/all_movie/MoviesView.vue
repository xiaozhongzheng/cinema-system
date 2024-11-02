<template>
  <div
    id="movies"
    style="margin-top: 3%"
  >
    <div
      class="head"
    >

      <div style="height: 50%;height: 50px;padding-top: 20px;margin-left: 20px;">
        <div style="width: 120px;float: left">
          <span>类型：</span>
          <span
            v-if="isAllType"
            class="selecting"
          >
            全部
          </span>
          <span
            v-else
            class="commonStyle"
            @click="selectTypeAll"
          >全部</span>
        </div>
        <span v-for="(item,i) in typeObjArr">
          <div style="width: 60px;float: left">
            <span
              v-if="!item.isSelect"
              class="commonStyle"
              @click="updateTypeColor(i)"
              :key="i"
            >
              {{ item.value }}
            </span>
            <span
              v-else
              class="selecting"
              :key="i"
            >
              {{ item.value }}
            </span>
          </div>

        </span>
      </div>
      <div style="height: 50%;height: 50px;margin-left: 20px">
        <div style="width: 120px;float: left">
          <span>地区：</span>
          <span
            v-if="isAllRegion"
            class="selecting"
          >
            全部
          </span>
          <span
            v-else
            class="commonStyle"
            @click="selectRegionAll"
          >全部</span>
        </div>
        <span v-for="(item,i) in regionObjArr">
          <div style="width: 60px;float: left">
            <span
              v-if="!item.isSelect"
              class="commonStyle"
              @click="updateRegionColor(i)"
              :key="i"
            >
              {{ item.value }}
            </span>
            <span
              v-else
              class="selecting"
              :key="i"
            >
              {{ item.value }}
            </span>
          </div>
        </span>
      </div>
    </div>
    <div v-if="filmArr.length!=0">
      <ul class="showFilm">
        <li
          v-for="film in filmArr"
          style="margin-top: 20px"
          @click="toShowFilmDetail(film.id)"
        >
          <img
            :src="film.image"
            width="100%;"
            height="250px"
            style="display: flex"
          >
          <div class="name">
            {{film.title}}
          </div>
        </li>
      </ul>
      <div
        class="block"
        style="text-align: center"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div v-else>
      <el-empty
          :image-size="400"
          description="这里空空如也"
        ></el-empty>
    </div>

  </div>
</template> 

<script>
import { pageQueryFilmes } from "@/api/film";
export default {
  data() {
    return {
      pageSize: 18, // 每页展示18条数据
      pageNo: 1, // 默认展示第一页的数据
      title: "",
      total: "",
      isAllType: true,
      isAllRegion: true,
      typeArr: this.global.filmTypeArr,
      regionArr: this.global.regionArr,
      typeObjArr: [],
      regionObjArr: [],
      type: "",
      region: "",
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
    };
  },
  created() {
    this.init();
    this.title = localStorage.getItem('title');
    this.pageQueryFilmList();
    
  },
  methods: {
    pageQueryFilmList() {
      pageQueryFilmes(
        this.pageNo,
        this.pageSize,
        this.type,
        this.region,
        this.title
      ).then((res) => {
        if (res.data.code === 1) {
          this.filmArr = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
    init() {
      const a = new Array();
      for (let k in this.typeArr) {
        const form = {
          value: this.typeArr[k],
          isSelect: false,
        };
        a.push(form);
      }

      const b = new Array();
      for (let k in this.regionArr) {
        const form = {
          value: this.regionArr[k],
          isSelect: false,
        };
        b.push(form);
      }
      this.typeObjArr = a;
      this.regionObjArr = b;
    },
    updateTypeColor(index) {
      this.clearTypeArr();
      this.isAllType = false;
      this.typeObjArr[index].isSelect = true;
      this.type = index;
      this.pageQueryFilmList();
    },
    selectTypeAll() {
      this.isAllType = true;
      this.clearTypeArr();
      this.type = "";
      this.pageQueryFilmList();
    },
    clearTypeArr() {
      for (let k in this.typeObjArr) {
        this.typeObjArr[k].isSelect = false;
      }
    },
    updateRegionColor(index) {
      this.clearRegionArr();
      this.isAllRegion = false;
      this.regionObjArr[index].isSelect = true;
      this.region = index;
      this.pageQueryFilmList();
    },
    selectRegionAll() {
      this.isAllRegion = true;
      this.clearRegionArr();
      this.region = "";
      this.pageQueryFilmList();
    },
    clearRegionArr() {
      for (let k in this.regionObjArr) {
        this.regionObjArr[k].isSelect = false;
      }
    },
    toShowFilmDetail(id) {
      this.$router.push({
        name: "showDetail",
        query: {
          filmId: id,
        },
      });
    },
    handleCurrentChange(val){
      this.pageNo = val;
      this.pageQueryFilmList();
      document.documentElement.scrollTop = 0;
    }
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
  box-sizing: border-box;
}
#movies .head {
  width: 100%;
  height: 100px;
  margin: auto;
  border: 1px solid rgb(229, 229, 229);
}
.selecting {
  color: white;
  background-color: red;
  border-radius: 15px;
  padding: 2px;
}
.commonStyle:hover {
  color: red;
  cursor: pointer;
}
p {
  margin: 0;
  padding: 0;
}

.showFilm {
  height: 960px;
  margin: 0;
  padding: 0;
  width: 100%;
  margin-top: 3%;
}
.showFilm li {
  width: 180px;
  height: 290px;
  float: left;
  margin-left: 20px;
  cursor: pointer;
}
.showFilm li:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  transform: scale(1.1);
}
.name {
  width: 100%;
  height: 40px;
  background-color: #fff;
  line-height: 40px;
  text-align: center;
  color: orange;
  /* 文字溢出时隐藏文字并加上省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.name:hover {
  background-color: red;
  color: white;
}
</style>