<template>
  <div class="app-container">
    <!-- 主布局容器（Flex 容器） -->
    <div class="main-layout">
      <!-- 侧边栏（Flex 项目） -->
      <aside
        class="sidebar"
        :class="{
          'sidebar-collapsed': isCollapse,
          'sidebar-hidden': !showSidebar && isMobile
        }"
      >
        <!-- 折叠按钮 -->
        <div class="collapse-trigger" @click="toggleCollapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>

        <!-- 侧边栏菜单 -->
        <el-menu
          :default-active="indexPath"
          class="sidebar-menu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :collapse="isCollapse"
        >
          <side-bar-item
            v-for="route in routes"
            :key="route.path"
            :route="route"
          ></side-bar-item>
        </el-menu>
      </aside>

      <!-- 主内容区（Flex 项目，占剩余空间） -->
      <div class="main-content">
        <!-- 头部导航（Flex 容器） -->
        <header class="header">
          <div class="header-inner">
            <!-- 移动端菜单按钮 -->
            <el-button
              icon="el-icon-menu"
              class="mobile-menu-btn"
              @click="showSidebar = !showSidebar"
              v-if="isMobile"
            ></el-button>

            <!-- 系统信息（Flex 项目） -->
            <div class="system-info">
              <el-avatar
                shape="square"
                :size="50"
                fit="fill"
                :src="url"
              ></el-avatar>
              <span class="system-name">
                影院管理系统-{{ roleId === 2 ? '管理员' : '员工' }}
              </span>
            </div>

            <!-- 用户操作区（Flex 项目，靠右） -->
            <div class="user-actions">
              <el-dropdown @command="handleCommand">
                <span class="user-name">
                  {{ username }}
                </span>
                <i class="el-icon-arrow-down"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="home_page" icon="el-icon-user-solid">
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="out" icon="el-icon-switch-button">
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </header>

        <!-- 页面内容区 -->
        <main class="page-content">
          <router-view></router-view>
        </main>
      </div>
    </div>

    <!-- 个人中心弹窗 -->
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
      url: require("@/assets/images/logo.png"),
      visible: false,
      isCollapse: false, // 侧边栏是否折叠
      showSidebar: true, // 移动端是否显示侧边栏
      screenWidth: 0, // 屏幕宽度
      mobileBreakpoint: 768 // 移动端断点
    };
  },
  created() {
    // 初始化数据
    this.indexPath = this.$route.path;
    this.roleId = this.$store.getters.roleId;
    this.username = this.$store.getters.username;

    // 初始化屏幕宽度并监听变化
    this.screenWidth = window.innerWidth;
    this.handleResponsive();
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    $route(to) {
      this.indexPath = to.path;
    },
    screenWidth() {
      this.handleResponsive();
    }
  },
  computed: {
    routes() {
      return this.$router.options.routes;
    },
    // 判断是否为移动端
    isMobile() {
      return this.screenWidth < this.mobileBreakpoint;
    }
  },
  methods: {
    // 监听窗口大小变化
    handleResize() {
      this.screenWidth = window.innerWidth;
    },
    // 响应式处理
    handleResponsive() {
      // 移动端默认隐藏侧边栏
      if (this.isMobile) {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
        this.isCollapse = false; // 非移动端默认展开
      }
    },
    // 切换侧边栏折叠状态
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 退出登录
    async logout(data) {
      await this.$store.dispatch('logout', data);
      this.$message.success('退出成功');
      this.$router.push("/login");
    },
    // 处理下拉菜单命令
    handleCommand(command) {
      if (command === "out") {
        this.logout({
          roleId: this.$store.getters.roleId,
          userId: this.$store.getters.userId
        });
        return;
      }
      this.visible = true;
    }
  }
};
</script>

<style scoped lang="scss">
// 变量定义
$sidebar-width: 200px;
$sidebar-collapsed-width: 64px;
$header-height: 80px;
$bg-color: #f4f6f8;
$sidebar-bg: #545c64;

// 根容器
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

// 主布局（Flex 容器：横向排列）
.main-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

// 侧边栏（Flex 项目）
.sidebar {
  width: $sidebar-width;
  height: 100%;
  background-color: $sidebar-bg;
  transition: all 0.3s ease;
  flex-shrink: 0; // 不收缩
  position: relative;
  z-index: 10;

  // 折叠状态
  &.sidebar-collapsed {
    width: $sidebar-collapsed-width;
  }

  // 移动端隐藏状态
  &.sidebar-hidden {
    width: 0;
    overflow: hidden;
  }

  // 折叠触发器
  .collapse-trigger {
    position: absolute;
    top: 10px;
    right: -10px;
    width: 20px;
    height: 20px;
    background-color: $sidebar-bg;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  // 侧边栏菜单
  .sidebar-menu {
    width: 100%;
    height: 100%;
    padding-top: 40px; // 给折叠按钮留空间
  }
}

// 主内容区（Flex 项目：占满剩余空间）
.main-content {
  flex: 1; // 占满剩余宽度
  display: flex;
  flex-direction: column; // 纵向排列（头部 + 内容）
  height: 100%;
  overflow: hidden;
}

// 头部（Flex 容器：横向排列）
.header {
  height: $header-height;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; // 不收缩

  .header-inner {
    display: flex;
    align-items: center; // 垂直居中
    justify-content: space-between; // 两端对齐
    height: 100%;
    padding: 0 20px;
  }

  // 移动端菜单按钮
  .mobile-menu-btn {
    position: absolute;
    left: 15px;
    z-index: 20;
  }

  // 系统信息（Flex 容器：横向排列）
  .system-info {
    display: flex;
    align-items: center;
    margin-left: 50%; // 给移动端按钮留空间
    background-color: pink;
    .system-name {
      font-size: 20px;
      font-weight: 600;
      margin-left: 10px;
      @media (max-width: 768px) {
        font-size: 14px;
      }
    }
  }

  // 用户操作区
  .user-actions {
    .user-name {
      font-size: 16px;
      cursor: pointer;
    }
  }
}

// 页面内容区（Flex 项目：占满剩余高度）
.page-content {
  flex: 1; // 占满剩余高度
  background-color: $bg-color;
  padding: 20px;
  overflow-y: auto; // 内容超出时滚动
}

// 响应式调整
@media (max-width: 768px) {
  .sidebar {
    position: absolute; // 移动端侧边栏悬浮
    height: 100%;
  }

  .main-content {
    width: 100%;
  }
}
</style>
