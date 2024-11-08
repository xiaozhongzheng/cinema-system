<template>
  <div id="main">
    <el-container>

      <el-header>

        <div class="head">
          <el-menu
            :default-active="indexPath"
            class="el-menu-demo"
            mode="horizontal"
            router
          >
            <div style="float: left;width: 250px;">
              <el-avatar
                shape="square"
                :size="50"
                fit="fill"
                :src="url"
                style="vertical-align: middle;margin-left: 10%"
              ></el-avatar>

              <span style="font-size: 22px;margin-left: 10px;font-weight: bold;"> 影院购票界面</span>
            </div>
            <el-menu-item
              index="/user/home"
              style="margin-left: 30px;"
            >首页</el-menu-item>

            <el-menu-item index="/user/movies">电影</el-menu-item>

            <el-input
              v-model="title"
              placeholder="请输入电影名"
              style="width: 20%;margin-left: 20px"
            ></el-input>
            <el-button
              icon="el-icon-search"
              circle
              style="margin-left: 10px"
              @click="pageQueryByTitle()"
            ></el-button>
            <el-button
              type="success"
              style="margin-left: 5%"
              @click="dialogVisible = true"
            >充值</el-button>

            <div style="float: right">
              <el-avatar
                v-if="user && user.image"
                :src="user.image"
                style="vertical-align: middle;"
              ></el-avatar>
              <el-avatar
                icon="el-icon-user-solid"
                v-else
                style="vertical-align: middle;"
              ></el-avatar>
              <el-dropdown
                @command="handleCommand"
                style="font-size: 16px;"
              >

                <span
                  class="el-dropdown-link"
                  style="width: 100px;display: inline-block;margin-left: 10px"
                >
                  {{ user.username }}
                  <i class="el-icon-arrow-down"></i>

                </span>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="/user/me/cart"
                    icon="el-icon-shopping-cart-2"
                  >我的购物车</el-dropdown-item>
                  <el-dropdown-item
                    command="/user/me/order"
                    icon="el-icon-s-order"
                  >我的订单</el-dropdown-item>
                  <el-dropdown-item
                    command="/user/me/detail"
                    icon="el-icon-user-solid"
                  >个人详情</el-dropdown-item>
                  <el-dropdown-item
                    command="out"
                    icon="el-icon-switch-button"
                  >退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </el-menu>

        </div>
      </el-header>

      <el-dialog
        title="充值"
        :visible.sync="dialogVisible"
        width="30%"
        @close="resetMoney"
      >
        <div>
          <el-radio-group v-model="money">
            <el-radio
              :label="item"
              border
              v-for="item in moneyArr"
              style="width: 150px;margin: 20px"
            >{{ item }} 元</el-radio>
          </el-radio-group>
          优惠：
          <span style="color: rgb(194, 199, 213)">一次性充值1000元的用户享八折优惠，充值400元以上的享九折优惠，充值200元以上的享九五折优惠</span>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="recharge()"
          >充 值</el-button>
        </span>
      </el-dialog>

      <el-main>
        <router-view v-if="showView"></router-view>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import { getUserById } from "@/api/user";
import {logout} from '@/api/common'
export default {
  data() {
    return {
      url: require("@/assets/logo.png"),
      title: "",
      indexPath: "",
      dialogVisible: false,
      money: "",
      moneyArr: [50, 100, 200, 300, 400, 500, 1000],
      user: {
        username: "",
        image: "",
        discount: "",
      },
      roleId: "",
      showView: false // 请求成功后展示router-view

    };
  },
  created() {
    this.roleId = localStorage.getItem("roleId");
    this.user.username = localStorage.getItem("username");
    this.indexPath = this.$route.path;
    this.getSingleUserById();
    let name = localStorage.getItem("title");
    if (name) {
      this.title = name;
    }
  },
  watch: {
    $route(to, from) {
      this.indexPath = to.path;
      if (to.path != "/user/movies") {
        window.location.reload(); //监测到路由发生跳转时刷新一次页面
        localStorage.removeItem("title"); // 将查询时绑定的title值除去
      }
      document.documentElement.scrollTop = 0; // 使页面回到顶部
    },
  },
  methods: {
    async getSingleUserById() {
      const id = localStorage.getItem("id");
      this.user = await getUserById(id)
      this.showView = true;
    },
    handleCommand(command) {
      if (command == "out") {
        // 用户退出登录
        this.logout({
          roleId: localStorage.getItem('roleId'),
          userId: localStorage.getItem('id')
        });
        return;
      }
      if (command != this.indexPath) {
        // 只有原路径和目标路径不同才可以跳转
        this.$router.push(command);
      }
    },
    // 实现退出登录
    async logout(data) {
      await logout(data)
      // 清空本地存储的数据
      this.$message.success('退出成功')
      localStorage.clear();
      this.$router.push("/login");
      
    },

    recharge() {
      const m = this.money;
      let userDiscount = this.user.discount; // 折扣
      let discount = 1;
      if (m >= 1000) {
        discount = 0.8;
      } else if (m >= 400) {
        discount = 0.9;
      } else if (m >= 200) {
        discount = 0.95;
      }
      if (discount < userDiscount) {
        userDiscount = discount;
      }
      const form = {
        money: this.money,
        discount: discount,
      };
      this.$http.put("/recharge", form).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("充值成功");
          this.resetMoney();
        }
      });
    },
    resetMoney() {
      this.money = "";
      this.dialogVisible = false;
    },
    pageQueryByTitle() {
      let curPath = this.$route.path;
      localStorage.setItem("title", this.title);
      if (curPath == "/user/movies") {
        location.reload();
        return;
      }
      this.$router.push({
        name: "movies",
      });
    },
  },
};
</script>


<style scoped>
* {
  box-sizing: border-box;
  
}
#main {
  width: 100vw;
  height: 100vh;
}
#main .el-header {
  padding: 0;
}
#main .head {
  padding: 0;
  width: 100%;

  position: fixed;
  top: 0;
  line-height: 60px;
  z-index: 10;
  background-color: #FFF; 
  border-bottom: 1px solid pink;
}
.el-menu-demo {
  /* width: 100%; */
  width: 1300px;
  height: 60px;
  border: 0;
  margin: auto;
}

.el-main {
  background-color: #fff;
  color: #333;
  text-align: center;
  padding: 0;
  /* 去除滚轮条 */
  overflow: visible;
}
</style>