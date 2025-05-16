<template>
  <div id="show">
    <div class="top">
      <header>
        <img :src="film.image" width="100%">
        <div class="filmItem">
          <div class="title">
            <span class="name">{{ film.title }}</span>
            <div class="averageScore">
              <template v-if="film.averageScore">
                <el-rate v-model="film.averageScore" disabled text-color="#ff9900" score-template="{value}">
                </el-rate>
                <span class="score">{{ film.averageScore * 2 }}</span>
              </template>
              <template v-else>
                <span class="emptyText">暂无评分</span>
              </template>
            </div>
          </div>
          <div>
            导演：{{ film.director }}
          </div>
          <div>
            主演：{{ film.actors }}
          </div>
          <div>
            电影类型：{{ typeArr[film.type] }}
          </div>
          <div>
            上映地区：{{ regionArr[film.region] }}
          </div>
          <div>
            时长：{{ film.duration }} 分钟
          </div>
          <div>
            上映日期：{{ film.releaseDate }} 上映
          </div>
          <div class="btnBox">
            <el-button type="danger" class="btn" icon="el-icon-shopping-cart-2" @click="toBuyFilm()">特惠购票</el-button>
            <!--  正在热映的电影才可以评论 -->
            <el-button type="danger" class="btn" v-if="film.status == 2" @click="dialogVisible = true"
              icon="el-icon-star-on">评分</el-button>
          </div>

          <el-dialog title="评分" :visible.sync="dialogVisible" width="30%" style="text-align: center" @close="cancel()">
            <div style="color: rgb(238, 188, 74);height: 30px;font-size: 20px"><span v-if="value != 0"
                style="text-align: center">
                {{ value * 2 }} 分
              </span>
            </div>
            <div style="height: 40px">
              <el-rate v-model="value" show-text @change="show()" :texts="textArr" allow-half="true"
                text-color="rgb(238, 188, 74)">
              </el-rate>
            </div>
            <el-form :model="commentForm">

              <el-form-item label="">
                <el-input type="textarea" :rows="2" placeholder="说说你的看法" v-model="commentForm.content">
                </el-input>
              </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="cancel()">取 消</el-button>
              <el-button type="primary" @click="saveComment()">提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </header>

    </div>

    <div class="main">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>电影详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="desc">
        <h3>剧情简介</h3>
        <p class="plot">
          {{ film.plot }}
        </p>
      </div>
      <h3>电影评论</h3>
      <template v-if="userList?.length">
        <div class="userContent" v-for="user in userList">
          <div class="left">
            <el-avatar v-if="user.image" :src="user.image" class="avater"></el-avatar>
            <el-avatar icon="el-icon-user-solid" v-else :size="50"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" class="avater"></el-avatar>
            <div>
              <span class="username">{{ user.username }}</span>
              <el-rate v-model="user.score" disabled text-color="#ff9900" score-template="{value}">
              </el-rate>
            </div>
          </div>
          <div class="right">
            <p>{{ user.content }}</p>
            <p>评论时间：{{ user.createTime }}</p>
          </div>
        </div>

      </template>
      <template v-else>
        <el-empty :image-size="200" description="暂无用户评论"></el-empty>
      </template>
    </div>

  </div>
</template>

<script>
import { addComment, getCommentByFilmId } from "@/api/comment";
import { getFilmById } from "@/api/film";

export default {
  data() {
    return {
      id: "", // 用于存放影片的id
      film: {},
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
      avgScore: 3.7,
      userList: [
        {
          username: "xzz",
          image:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          content: "非常好看的电影",
          score: 4.35,
          createTime: "2024-09-23 02:02:02",
        },
        {
          username: "lyt",
          image:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          content: "非常好看的电影",
          score: 5,
          createTime: "2024-09-23 02:02:02",
        },
      ],

    };
  },
  created() {
    this.id = this.$route.params.filmId; // 获取影片的id
    this.getFilmAndComment();
  },
  methods: {
    async getFilmAndComment() {
      this.film = await getFilmById(this.id);
      this.userList = await getCommentByFilmId(this.id);
    },
    async saveComment() {
      if (this.value == 0) {
        this.$message.error("请选择评分");
        return;
      }
      this.commentForm.score = this.value;
      this.commentForm.filmId = this.id;
      await addComment(this.commentForm);
      this.$message.success("评价成功");
      this.cancel();
      this.getFilmAndComment();
    },
    cancel() {
      this.value = 0;
      this.commentForm.content = "";
      this.dialogVisible = false;
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


<style scoped lang="scss">
#show {
  .top {
    width: 100%;
    height: 280px;
    background: rgb(99, 134, 247);

    header {
      width: 1200px;
      height: 100%;
      margin: auto;
      /* background-color: pink; */
      display: flex;
      padding-top: 30px;

      &>img {
        width: 200px;
        height: 260px;
      }
    }

    .filmItem {
      height: 200px;
      margin-left: 30px;
      text-align: left;
      color: white;
      display: flex;
      flex-direction: column;
      gap: 3px;

      .title {
        display: flex;
        height: 40px;
        align-items: center;
        gap: 20px;

        .name {
          font-size: 24px;
          font-weight: 600;
        }

        .averageScore {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 20px;

          :deep(.el-rate__icon) {
            // 样式穿透
            font-size: 26px;
          }

          .score {
            color: rgb(238, 188, 74);
          }
        }


        .emptyText {
          margin-left: 40px;
          color: rgb(201, 199, 199);
          font-weight: 400;
          font-size: 20px
        }
      }

      .btnBox {
        display: flex;
        margin-top: 10px;

        .btn {
          width: 140px;
          border-radius: 20px;
        }
      }

    }
  }



  .main {
    text-align: left;
    width: 1200px;
    margin: 30px auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 18px;

    .breadcrumb {
      font-size: 22px;
    }

    .desc {

      .plot {
        width: 80%;
        margin-top: 10px;
        line-height: 1.5em;
        font-size: 16px;
      }
    }

    .userContent {
      color: rgb(199, 199, 199);
      display: flex;
      justify-content: space-between;

      .left {
        flex: 1;
        .avater {
          float: left;
          width: 60px;
          height: 60px;
          margin-right: 10px;
        }

        .username {
          font-size: 24px;
        }
      }
    }
  }

  // /deep/ .el-rate__icon {
  //     font-size: 30px;
  // }


}
</style>
