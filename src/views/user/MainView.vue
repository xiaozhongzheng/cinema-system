<template>
  <div id="main">
    <el-container>
      <el-header class="navBar">
        <div class="head">
          <div class="title">
            <el-avatar shape="square" :size="50" fit="fill" :src="url"></el-avatar>
            <span> 影院购票界面</span>
          </div>
          <el-menu :default-active="indexPath" class="el-menu-demo" mode="horizontal" router>
            <el-menu-item index="/user/home">首页</el-menu-item>
            <el-menu-item index="/user/movies">电影</el-menu-item>
          </el-menu>
          <el-input v-model="title" placeholder="请输入要查询的电影名" style="width: 20%;"></el-input>

          <el-button type="success" @click="dialogVisible = true">充值</el-button>

          <div class="right">
            <el-avatar v-if="user && user.image" :src="user.image"></el-avatar>
            <el-avatar icon="el-icon-user-solid" v-else></el-avatar>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ user.username }}
                <i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="/user/me/cart" icon="el-icon-shopping-cart-2">我的购物车</el-dropdown-item>
                <el-dropdown-item command="/user/me/order" icon="el-icon-s-order">我的订单</el-dropdown-item>
                <el-dropdown-item command="/user/me/detail" icon="el-icon-user-solid">个人详情</el-dropdown-item>
                <el-dropdown-item command="out" icon="el-icon-switch-button">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-dialog title="充值" :visible.sync="dialogVisible" width="30%" @close="resetMoney">
        <div>
          <el-radio-group v-model="money">
            <el-radio :label="item" border v-for="item in moneyArr" style="width: 150px;margin: 20px">{{
              item }}
              元</el-radio>
          </el-radio-group>
          优惠：
          <span style="color: rgb(194, 199, 213)">一次性充值1000元的用户享八折优惠，充值400元以上的享九折优惠，充值200元以上的享九五折优惠</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="recharge()">充 值</el-button>
        </span>

      </el-dialog>
      <div class="emptyBox"></div>
      <el-main>
        <router-view v-if="showView" :titleName="title"></router-view>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import { recharge } from "@/api/user";
import store from "@/store";
export default {
  data() {
    return {
      url: require("@/assets/images/logo.png"),
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
      showView: false, // 请求成功后展示router-view
    };
  },
  created() {
    this.indexPath = this.$route.path;
    this.user = store.getters.userInfo;
    this.showView = true;
  },
  watch: {
    // 监听路由的变化
    $route(to, from) {
      this.indexPath = to.path;
      document.documentElement.scrollTop = 0; // 使页面回到顶部
    },
    title() {
      this.toShowMovies();
    },
  },
  computed: {
    getDiscount() {
      let userDiscount = this.user.discount; // 折扣
      let discount = 1;
      const m = this.money;
      if (m >= 1000) {
        discount = 0.8;
      } else if (m >= 400) {
        discount = 0.9;
      } else if (m >= 200) {
        discount = 0.95;
      }
      return discount < userDiscount ? discount : userDiscount;
    },
  },
  methods: {
    handleCommand(command) {
      if (command == "out") {
        // 用户退出登录
        this.logout({
          roleId: store.getters.roleId,
          userId: store.getters.userId,
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
      await store.dispatch("logout", data);
      // 清空本地存储的数据
      this.$message.success("退出成功");
      this.$router.push("/login");
    },

    async recharge() {
      await recharge({
        money: this.money,
        discount: this.getDiscount,
      });
      this.$message.success("充值成功");
      this.resetMoney();
    },
    resetMoney() {
      this.money = "";
      this.dialogVisible = false;
    },
    toShowMovies() {
      if (this.indexPath !== "/user/movies") {
        this.$router.push({
          name: "movies",
        });
      }
    },
  },
};
</script>


<style scoped lang="scss">
$height: 80px;
#main {
  width: 100vw;
  height: 100vh;
  font-size: 14px;
  position: relative;

  .navBar {
    width: 100%;
    height: $height !important;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: #fff;
    border-bottom: 1px solid pink;

    .head {
      width: 1200px;
      height: $height;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 20px;
        font-weight: 600;
      }

      .el-menu-demo {
        height: 100%;
        width: 200px;
        border: 0;
        margin-left: 250px;
        background: transparent;
      }

      .right {
        display: flex;
        align-items: center;
        gap: 5px;
      }

    }
  }

  .emptyBox {
    height: $height + 20px;
  }

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
