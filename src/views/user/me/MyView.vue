<template>
  <div id="me">

    <el-container>
      <div style="height: 100vh;width: 200px">
        <el-aside style="width: 200px">

          <h2 style="margin-left: 30px;margin-top: 50px">个人中心</h2>
          <el-menu
            :default-active="indexPath"
            class="el-menu-vertical-demo"
            router
          >
            <el-menu-item index="/user/me/cart">
              <i class="el-icon-shopping-cart-2"></i>
              <span slot="title">购物车</span>
            </el-menu-item>
            <el-menu-item index="/user/me/order">
              <i class="el-icon-s-order"></i>
              <span slot="title">我的订单</span>
            </el-menu-item>

            <el-menu-item index="/user/me/detail">
              <i class="el-icon-setting"></i>
              <span slot="title">基本设置</span>
            </el-menu-item>
          </el-menu>

        </el-aside>
      </div>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      indexPath: "",
    };
  },
  created() {
    this.indexPath = this.$route.path;
  },
};
</script>


<style scoped>
#me {
  height: 100vh;
  /* width: 90%; */
  width: 1200px;
  margin: auto;
  text-align: left;
}

.el-aside {
  color: #333;
  text-align: center;
  background-color: #fff;
  position: fixed;
  
  z-index: 0;
  height: 100vh;
  width: 100%;
  border: 1px solid pink;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>