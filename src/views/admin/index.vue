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
                <side-bar-item v-for="route in routes" :key="route.path" :route="route"></side-bar-item>
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
              影院管理系统-{{ roleId === 2 ? '管理员' : '员工' }}
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

          <router-view ></router-view>

        </el-main>

      </el-container>

    </el-container>

    <MyCenterDialog v-if="visible" :visible.sync="visible"></MyCenterDialog>
  </div>
</template>




<script>
import MyCenterDialog from './components/MyCenterDialog.vue';
import SideBarItem from './components/SideBarItem.vue';

export default {
  components: {
    MyCenterDialog,
    SideBarItem
  },
  data() {
    return {
      indexPath: "",
      username: "",
      roleId: "",
      url: require("@/assets/logo.png"),
      visible: false
    };
  },
  created() {
    // 每次页面刷新时保持侧边栏选中的位置不变
    this.indexPath = this.$route.path
    this.roleId = this.$store.getters.roleId;
    this.username = this.$store.getters.username;
    console.log(this.routes,'***')
  },
  watch: {
    $route(to,from){
      // 当路由改变时，indexPath也需改变
      this.indexPath = to.path;
    }
  },
  computed: {
    // 获取所有的路由信息
    routes(){
      return this.$router.options.routes
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
      this.visible = true
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
