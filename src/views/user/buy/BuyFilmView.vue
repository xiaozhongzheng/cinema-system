<template>
  <div
    id="show"
    style="background-color: #fff;"
  >
    <div class="top">
      <div class="box">
        <div style="width: 200px;height: 260px;margin-top: 2%;float: left;">
          <img
            :src="film.image"
            width="100%"
          >
        </div>
        <div class="film">
          <h2 style="color: white;width: 100%;height: 20px">
            <span style="float: left">{{ film.title }}</span>
            <span v-if="film.averageScore">
              <el-rate
                v-model="film.averageScore"
                disabled
                text-color="#ff9900"
                score-template="{value}"
                style="float: left;margin-left: 40px"
              >
              </el-rate>
              <span style="color: rgb(238, 188, 74)">{{ film.averageScore * 2 }}</span>
            </span>
            <span
              v-else
              style="margin-left: 40px;color: rgb(201, 199, 199);font-weight: 400;font-size: 20px"
            >
              暂无评分
            </span>
          </h2>

          <div>
            <span>
              电影类型：
            </span>
            {{ typeArr[film.type] }}
          </div>
          <div>
            <span>
              上映地区：
            </span>
            {{ regionArr[film.region] }}

          </div>
          <div>
            <span>
              时长：
            </span>
            {{ film.duration }} 分钟
          </div>
          <div>
            <span>
              上映日期：
            </span>
            {{ film.releaseDate }} 上映
          </div>
          <el-button
            type="info"
            style="width: 140px;margin-top: 20px"
            icon="el-icon-s-help"
            @click="toFilmDetail"
          >查看影片详情</el-button>
          <el-button
            type="danger"
            style="width: 140px;margin-top: 20px"
            v-if="film.status == 2"
            @click="dialogVisible = true"
            icon="el-icon-star-on"
          >评分</el-button>

          <el-dialog
            title="评分"
            :visible.sync="dialogVisible"
            width="30%"
            style="text-align: center"
            @close="cancel()"
          >
            <div style="color: rgb(238, 188, 74);height: 30px;font-size: 20px"><span
                v-if="value!=0"
                style="text-align: center"
              >
                {{ value * 2 }} 分
              </span>
            </div>
            <div style="height: 40px">
              <el-rate
                v-model="value"
                show-text
                @change="show()"
                :texts="textArr"
                allow-half="true"
                text-color="rgb(238, 188, 74)"
              >
              </el-rate>
            </div>
            <el-form :model="commentForm">

              <el-form-item label="">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="说说你的看法"
                  v-model="commentForm.content"
                >
                </el-input>
              </el-form-item>

            </el-form>

            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="cancel()">取 消</el-button>
              <el-button
                type="primary"
                @click="addComment()"
              >提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

    </div>

    <div class="middle">

      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="font-size: 20px"
      >

        <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>选座购票</el-breadcrumb-item>
      </el-breadcrumb>

      <div
        class="date"
        style="margin-top: 50px"
        v-if="filmDateList && filmDateList.length!=0"
      >
        <span style="color: rgb(156, 155, 154);font-size: 20px">排片列表：</span>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            :index="item"
            v-for="(item) in filmDateList"
          >
            {{ getHandleDate(item) }}
          </el-menu-item>
        </el-menu>

        <el-table
          :data="scheduleList"
          style="width: 100%;margin-top: 30px;"
          stripe
          header-cell-style="background-color: rgb(247, 247, 247);color: black"
        >
          <el-table-column
            prop="startTime"
            label="放映时间"
            width="180"
          >
            <template slot-scope="scope">
              <div style="color: black;font-size: 20px">{{getHandleTime(scope.row.startTime)}}</div>
              {{getHandleTime(scope.row.endTime)}} 散场
            </template>
          </el-table-column>
          <el-table-column
            prop="language"
            label="语言版本"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="放映类型"
          >
            <template slot-scope="scope">
              {{ scope.row.type }}D
            </template>
          </el-table-column>
          <el-table-column
            prop="screenRoomName"
            label="放映厅"
          >
          </el-table-column>
          <el-table-column label="售价（元）">
            <template slot-scope="scope">
              <span style="color: red;font-size: 18px">￥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="选座购票">
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="toShowChooseSeat(scope.row)"
                :disabled="scope.row.status == 1"
              >
                选座购票
              </el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>

      <div v-else>
        <el-empty
          :image-size="200"
          description="暂无排片"
        ></el-empty>
      </div>

    </div>

  </div>
</template>

  <script>
import { getScheduleDateList, getScheduleListByDate } from "@/api/schedule";
import { getFilmById } from "@/api/film";
import { addComment } from "@/api/comment";
export default {
  data() {
    return {
      id: "", // 用于存放影片的id
      film: {},
      filmDateList: "",
      typeArr: this.$constant.filmTypeArr,
      regionArr: this.$constant.regionArr,
      value: 0,
      textArr: ["非常差", "比较差", "一般般", "比较好", "完美"],
      dialogVisible: false,
      commentForm: {
        content: "",
        score: "",
        filmId: "",
      },
      activeIndex: "",
      scheduleList: [
        // {
        //   id: 3,
        //   startTime: "2024-09-24 12:00:00",
        //   endTime: "2024-09-24 14:00:00",
        //   language: "国语",
        //   type: 2,
        //   screenRoomName: "1号厅",
        //   price: 38,
        // },
        // {
        //   id: 4,
        //   startTime: "2024-09-24 14:30:00",
        //   endTime: "2024-09-24 16:30:00",
        //   language: "国语",
        //   type: 2,
        //   screenRoomName: "2号厅",
        //   price: 38.5,
        // },
      ],
    };
  },
  created() {
    this.id = this.$route.params.filmId;
    // this.getUserContentByFilmId()
    this.getSingleFilmById();
    this.getDateArr();

    // this.handleSelect(this.activeIndex)
  },
  methods: {
    async getSingleFilmById() {
      this.film = await getFilmById(this.id);
    },
    async addComment() {
      if (this.value == 0) {
        this.$message.error("请选择评分");
        return;
      }
      this.commentForm.score = this.value;
      this.commentForm.filmId = this.id;
      await addComment(this.commentForm);
      this.$message.success("评价成功");
      this.cancel();
      this.getSingleFilmById();
    },
    cancel() {
      this.value = 0;
      this.commentForm.content = "";
      this.dialogVisible = false;
    },

    toFilmDetail() {
      this.$router.push({
        name: "showDetail",
        query: {
          filmId: this.id,
        },
      });
    },
    async getDateArr() {
      this.filmDateList = await getScheduleDateList(this.id);
      if (this.filmDateList.length != 0) {
        this.activeIndex = this.filmDateList[0]; // 默认选中数组中的第一个日期
        this.handleSelect(this.filmDateList[0]);
      }
    },
    getHandleDate(time) {
      return new Date(time[0], time[1] - 1, time[2]).toLocaleDateString();
    },
    async handleSelect(scheduleDate) {
      let selectDate = this.getHandleDate(scheduleDate);
      // 日期值
      this.scheduleList = await getScheduleListByDate(selectDate, this.id)
      this.isDisableButton();

    },
    isDisableButton() {
      let now = new Date();
      // for (let k in this.scheduleList) {
      //   let startTime = new Date(this.scheduleList[k].startTime);
      //   if (now >= startTime) {
      //     // 当前时间比开始时间晚，则禁用按钮
      //     this.scheduleList[k].status = 1;
      //   }
      // }
      this.scheduleList.forEach(item => {
        if (now >= item.startTime) {
          // 当前时间比开始时间晚，则禁用按钮
          this.scheduleList[k].status = 1;
        }
      })
    },
    getHandleTime(time) {
      let d = new Date(time);
      let h = d.getHours();
      let m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      return h + ":" + m;
    },
    toShowChooseSeat(row) {
      if (new Date() >= new Date(row.startTime)) {
        this.$message.error("该影片已经开始啦，请选择下一时间段的影片把");
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 延迟1秒刷新页面

        return;
      }
      this.$router.push({
        name: "chooseSeat",
        query: {
          id: row.id,
        },
      });
    },
  },
};
</script>


  <style scoped>
.top {
  width: 100%;
  height: 280px;
  background: rgb(99, 134, 247);
}
.top .box {
  width: 1200px;
  height: 100%;
  margin: auto;
  /* background-color: pink; */
  display: flex;
}
.film {
  width: 500px;
  height: 200px;
  /* background-color: pink; */
  float: left;
  margin-top: 2%;
  margin-left: 30px;
  text-align: left;
  color: white;
}
.film div span {
  text-align: right;
  display: inline-block;
  width: 80px;
}
.middle {
  text-align: left;
  width: 1200px;
  margin: 2% auto;
  /* background-color: skyblue; */
}
/deep/ .el-rate__icon {
  font-size: 30px;
}
.userContent {
  width: 80%;
  /* background-color: pink; */
}
.filmDate {
  display: inline-block;
  width: 100px;
  /* background-color: red; */
  margin: 20px;
  text-align: center;
}
.filmDate:active {
  background: white;
}
</style>
