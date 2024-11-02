<template>
  <div id="show">
    <div class="top">
      <div
        style=""
        class="box"
      >
        <div style="width: 200px;height: 260px;margin-top: 2%;">
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
              导演：
            </span>
            {{ film.director }}
          </div>
          <div>
            <span>
              主演：
            </span>
            {{ film.actors }}
          </div>
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
            type="danger"
            style="width: 140px;margin-top: 20px"
            icon="el-icon-shopping-cart-2"
            @click="toBuyFilm()"
          >特惠购票</el-button>
          <!--  正在热映的电影才可以评论 -->
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
                @click="saveComment()"
              >提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

    </div>

    <div
      class="middle"
      style=""
    >

      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="font-size: 20px"
      >

        <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>电影详情</el-breadcrumb-item>
      </el-breadcrumb>
      <h3>剧情简介</h3>
      <p style="width: 80%">
        {{ film.plot }}
      </p>
      <h3>电影评论</h3>
      <span v-if="userList && userList.length!=0">
        <div
          class="userContent"
          v-for="user in userList"
        >
          <div
            class="head"
            style="width: 100%;color: rgb(199, 199, 199)"
          >

            <el-avatar
              v-if="user.image"
              :src="user.image"
              style="float:left;width: 60px;height: 60px;margin-right: 10px;"
            ></el-avatar>
            <el-avatar
              icon="el-icon-user-solid"
              v-else
              :size="50"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              style="float:left;width: 60px;height: 60px;margin-right: 10px;"
            ></el-avatar>
            <span style="font-size: 24px;">{{ user.username }}</span>
            <el-rate
              v-model="user.score"
              disabled
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
            <p style="margin-left: 10%">{{ user.content }}</p>
            <p style="text-align: right">评论时间：{{ user.createTime }}</p>
          </div>
        </div>

      </span>

      <span v-else>
        <el-empty
          :image-size="200"
          description="暂无用户评论"
        ></el-empty>

      </span>
    </div>

  </div>
</template>

<script>
import { addComment, getCommentByFilmId } from "@/api/comment";
import { getById } from "@/api/film";

export default {
  data() {
    return {
      id: "", // 用于存放影片的id
      film: {},
      typeArr: this.global.filmTypeArr,
      regionArr: this.global.regionArr,
      value: 0,
      textArr: ["非常差", "比较差", "一般般", "比较好", "完美"],
      dialogVisible: false,
      commentForm: {
        content: "",
        score: "",
        filmId: "",
      },
      avgScore: 3.7,
      // userList: [
      //   // {
      //   //   username: "xzz",
      //   //   image:
      //   //     "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      //   //   content: "非常好看的电影",
      //   //   score: 4.35,
      //   //   createTime: "2024-09-23 02:02:02",
      //   // },
      //   // {
      //   //   username: "lyt",
      //   //   image:
      //   //     "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      //   //   content: "非常好看的电影",
      //   //   score: 5,
      //   //   createTime: "2024-09-23 02:02:02",
      //   // },
      // ],
      userList: "",
    };
  },
  created() {
    this.id = this.$route.query.filmId; // 获取影片的id
    this.getSingleFilmById();
    this.getUserContentByFilmId();
  },
  methods: {
    getSingleFilmById() {
      getById(this.id).then((res) => {
        if (res.data.code === 1) {
          this.film = res.data.data;
        }
      });
    },
    saveComment() {
      if (this.value == 0) {
        this.$message.error("请选择评分");
        return;
      }
      this.commentForm.score = this.value;
      this.commentForm.filmId = this.id;
      addComment(this.commentForm).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("评价成功");
          this.cancel();
          this.getUserContentByFilmId();
          this.getSingleFilmById();
        }
      });
    },
    cancel() {
      this.value = 0;
      this.commentForm.content = "";
      this.dialogVisible = false;
    },
    getUserContentByFilmId() {
      getCommentByFilmId(this.id).then((res) => {
        if (res.data.code === 1) {
          this.userList = res.data.data;
          console.log(this.userList);
        }
      });
    },
    toBuyFilm() {
      this.$router.push({
        name: "buy",
        query: {
          filmId: this.id,
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
  /* width: 500px; */
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
</style>