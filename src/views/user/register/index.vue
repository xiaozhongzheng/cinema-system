<template>
  <div id="register">
    <div class="form">
      <h1>注册页面</h1>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="el"
      >
        <el-form-item
          label="账号"
          prop="username"
          style="width: 70%"
        >
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          style="width: 70%"
        >
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="checkPass"
          style="width: 70%"
        >
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="电话号码"
          prop="phone"
          style="width: 70%"
        >
          <el-input
            v-model="ruleForm.phone"
            autocomplete="off"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin: 10%">
          <el-button
            type="primary"
            @click="register('ruleForm')"
            style="width: 100px;margin-right: 20px"
          >
            注册
          </el-button>
          <el-button
            type="info"
            style="width: 100px"
            @click="to_login"
          >
            取消
          </el-button>
          <!-- <el-button type="info" style="width: 100px" @click="resetForm">
            重置
          </el-button> -->

        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import { register } from "@/api/user";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        password: "",
        checkPass: "",
        username: "",
        phone: "",
      },
      rules: {
        password: [{ validator: validatePass }],
        checkPass: [{ validator: validatePass2 }],
        username: [
          { required: true, message: "请输入用户名" },
          { min: 4, max: 8, message: "长度在 4 到 8 个字符" },
        ],
        phone: [
          { required: true, message: "请输入电话号码" },
          { pattern: /^1[3-9]\d{9}$/, message: "手机号码格式不正确" },
        ],
      },
    };
  },

  methods: {
    register(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await register(this.ruleForm);
          this.$message.success("注册成功");
          this.to_login();
        }
      });
    },
    to_login() {
      this.$router.push("/login");
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>


<style scoped>
#register {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/register.png");
  background-size: contain;
  position: fixed;
  filter: blur();
}
#register h1 {
  text-align: center;
}
.form {
  width: 35%;
  background-color: rgb(237, 245, 254);
  margin-left: 55%;
  margin-top: 5%;
  padding: 10px 40px;
}
.form h1 {
  margin-bottom: 60px;
}
.el .el-form-item__label {
  color: white;
  font-size: 18px;
}
</style>
