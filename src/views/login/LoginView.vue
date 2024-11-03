<template>
  <div id="login">
    <el-form
      :model="userForm"
      :rules="rules"
      ref="userForm"
      label-width="auto"
      class="form"
      style="text-align: center;"
    >
      <div style="width: 100%;height: 100px;line-height: 100px">
        <el-avatar
          shape="square"
          :size="50"
          fit="fill"
          :src="url"
          style="vertical-align: middle;"
        ></el-avatar>
        <span style="font-size: 24px;margin-left: 10px"> 影院管理系统</span>

      </div>

      <el-form-item
        label="账号"
        prop="username"
        style="width: 50%;margin-left: 25%"
      >
        <el-input
          v-model="userForm.username"
          class="input"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        style="width: 50%;margin-left: 25%"
      >
        <el-input
          v-model="userForm.password"
          class="input"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="身份"
        style="width: 50%;margin-left: 25%"
      >
        <el-radio-group v-model="userForm.roleId">
          <el-radio :label="0">用户</el-radio>
          <el-radio :label="1">员工</el-radio>
          <el-radio :label="2">管理员</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="userLogin('userForm')"
          style="width: 100px;"
        >登录</el-button>
        <el-button
          type="info"
          @click="toRegisterView"
          style="width: 100px;margin-top: 30px"
        >注册</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
  
<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      userForm: {
        username: "",
        password: "",
        roleId: 0,
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
          { min: 4, max: 8, message: "账号的位数在4到8之间" },
        ],
        password: [
          { required: true, message: "请输入密码" },
          { min: 3, max: 10, message: "密码的位数在3到10之间" },
        ],
      },
      url: require("@/assets/logo.png"),
    };
  },
  created() {},
  methods: {
    userLogin(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = this.userForm;
          // this.$http.post("/login", data).then((res) => {

          // });

          const res = await request({
            url: "/login",
            method: "post",
            data,
          });
          
          this.$message.success("登录成功");
          const id = res.id;
          localStorage.setItem(`token`, res.token);
          // 判断角色类型（管理员，员工，用户）
          const roleId = res.roleId;
          localStorage.setItem("roleId", roleId);
          localStorage.setItem("id", id);
          localStorage.setItem("username", res.username);
          let toPath = "/admin";
          if (roleId == 0) {
            toPath = "/user";
          }
          this.$router.push({
            path: toPath,
          });
        }
      });
    },
    toRegisterView() {
      this.$router.push("/register");
    },
  },
};
</script>
  
<style scoped>
#login {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/login.jpg");
  background-color: black;
  background-size: cover;
  position: fixed;
}

.form {
  width: 40%;
  margin: 100px auto;
  height: 60%;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.5);
}
h1 {
  margin: 50px 0;
}
</style>