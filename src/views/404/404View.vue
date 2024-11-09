<template>
  <div id="app">
    <el-button type="primary" style="height: 50px" @click="toHome">
      回到首页
    </el-button>
  </div>
</template>

<script>
export default{
  methods: {
    toHome(){
      this.$store.getters.roleId == 0 ? this.$router.push('/user') : this.$router.push('/admin')
    }
  }
}
</script>


<style scoped>
    #app {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-image: url('@/assets/404.png') ;
        background-size: cover;
        position: fixed;
    }
</style>