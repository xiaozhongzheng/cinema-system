<template>

  <div id="#app">

    <el-container style="height: 100vh; border: 1px solid #eee">
      <div style="width: 15%">
        <el-aside
          width="200px"
          style="background-color: rgb(68, 74, 79);height: 100%"
        >
          <el-row class="tac">
            <el-col :span="12">
              <el-menu
                :default-active="indexPath"
                class="adminAside"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                style="width: 199px"
                router
              >
                <!-- 路径跳转 -->
                <el-menu-item index="/admin/home">
                  <i class="el-icon-s-home"></i>
                  <span slot="title">个人中心</span>
                </el-menu-item>
                <el-menu-item
                  index="/admin/employee"
                  v-if="roleId == 2"
                >
                  <i class="el-icon-user-solid"></i>
                  <span slot="title">员工管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/screen">
                  <i class="el-icon-c-scale-to-original"></i>
                  <span slot="title">{{ roleId == 2 ? '放映厅管理' : '放映厅信息' }}</span>
                </el-menu-item>
                <el-menu-item index="/admin/film">
                  <i class="el-icon-bangzhu"></i>
                  <span slot="title">{{ roleId == 2 ? '影片管理' : '影片排片' }}</span>
                </el-menu-item>
                <el-menu-item
                  index="/employee/schedule"
                  v-if="roleId == 1"
                >
                  <i class="el-icon-s-help"></i>
                  <span slot="title">我的排片</span>
                </el-menu-item>

                <el-menu-item index="/employee/query/allSchedule">
                  <i class="el-icon-s-data"></i>
                  <span slot="title">查看所有排片</span>
                </el-menu-item>

                <el-menu-item
                  index="/admin/orders/show"
                  v-if="roleId == 2"
                >
                  <i class="el-icon-tickets"></i>
                  <span slot="title">查看所有订单</span>
                </el-menu-item>

              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
      </div>

      <el-container>

        <el-header style="height: 80px;padding: 0;background-color: #fff;">
          <div  class="head">
            <el-avatar
              shape="square"
              :size="50"
              fit="fill"
              :src="url"
              style="margin-top: 15px;"
            ></el-avatar>

            <span style="font-size: 24px;position: absolute;margin-left: 10px">
              影院管理系统-{{ roleId == 2 ? '管理员' : '员工' }}
            </span>

            <el-dropdown
              @command="handleCommand"
              style="font-size: 16px;float: right;"
            >
              <span class="el-dropdown-link">
                {{ username }}
              </span>

              <i class="el-icon-arrow-down"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="home_page"
                  icon="el-icon-user-solid"
                >

                  个人中心

                </el-dropdown-item>

                <el-dropdown-item
                  command="out"
                  icon="el-icon-switch-button"
                >退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

        </el-header>

        <el-main style="text-align: center;background-color: rgb(244, 246, 248);">

          <router-view :key="key"></router-view>

        </el-main>

      </el-container>

    </el-container>

  </div>
</template>
    
    


<script>
export default {
  data() {
    return {
      indexPath: "",
      username: "",
      roleId: "",
      url: require("@/assets/logo.png"),
    };
  },
  created() {

    // 每次页面刷新时保持侧边栏选中的位置不变
    this.indexPath = this.$route.path;
    this.roleId = this.$store.getters.roleId;
    this.username = this.$store.getters.username;
    const path = localStorage.getItem("indexPath");
    if (path && this.$route.path == "/admin/addFilm") {
      // 用于处理新增电影时页面刷新后侧边栏不显示某个模块的背景颜色
      this.indexPath = path;
    }
  },
  watch: {
    $route(to,from){
      // 当路由发生变化时刷新页面
      window.location.reload();
    }
  },

  methods: {
    // 实现退出登录
    async logout(data) {
      await this.$store.dispatch('logout',data)
      this.$message.success('退出成功')
      this.$router.push("/login");
      
    },

    handleCommand(command) {
      if (command === "out") {
        // 退出登录
        this.logout({
          roleId: this.$store.getters.roleId,
          userId: this.$store.getters.userId
        });
        return;
      }
      if (this.$route.path != "/admin/home") {
        this.$router.push('/admin')
      }
    },

    // 方法底部
  },
};
</script>
    
    
<style scoped>
.el-aside {
  color: #333;
  position: fixed;
}

.el-main {
  overflow: visible;
}
.el-table--scrollable-y .el-table__body-wrapper {
  overflow-y: visible;
}
.head {
  background-color: #fff;
  height: 100% !important;
  line-height: 80px;
  text-align: center;
  margin-right: 1%;
}
</style>