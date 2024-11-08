<template>
  <div id="set">
    <h2>基本设置</h2>
    <el-form
      :model="userForm"
      :rules="rules"
      ref="userForm"
      label-width="100px"
      class="demo-ruleForm"
      style="position: relative;"
    >
      <el-form-item
        label="用户名"
        prop="username"
        style="width: 30%"
      >
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>

      <el-form-item
        label="真实姓名"
        prop="name"
      >
        <el-input
          v-model="userForm.name"
          style="width: 30%"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="性别"
        prop="sex"
      >
        <el-radio-group v-model="userForm.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="手机号码"
        prop="phone"
      >
        <el-input
          v-model="userForm.phone"
          style="width: 30%"
        ></el-input>
      </el-form-item>
      <el-form-item label="余额">
        <span style="font-size: 20px;">{{ userForm.balance }} 元</span>
      </el-form-item>
      <el-form-item
        label="优惠"
        v-if="userForm.discount!=1"
      >
        <span style="font-size: 20px">{{ userForm.discount * 10 }}折</span>
      </el-form-item>
      <el-form-item
        label="优惠"
        v-else
      >
        暂无优惠
      </el-form-item>

      <el-form-item
        label="头像"
        prop="image"
        style="width: 30%;position: absolute;right: 20%;top: 0"
      >
        <upload-image
          show-type="user"
          v-model="userForm.image"
        ></upload-image>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('userForm')"
        >更新基本信息</el-button>
        <el-button
          type="warning"
          @click="passwordDialog"
        >修改密码</el-button>

      </el-form-item>
    </el-form>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogPasswordVisible"
      @close="resetPasswordForm"
    >

      <el-form
        :model="pwdForm"
        :rules="pwdRules"
        ref="pwdForm"
      >
        <el-form-item
          label="原密码"
          prop="oldPassword"
          style="width: 60%;"
        >
          <el-input
            v-model="pwdForm.oldPassword"
            placeholder="请输入原密码"
            autocomplete="off"
            style="width: 80%;"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="新密码"
          prop="newPassword"
          style="width: 60%;"
        >
          <el-input
            v-model="pwdForm.newPassword"
            autocomplete="off"
            placeholder="请输入新密码"
            style="width: 80%;"
          ></el-input>
        </el-form-item>

      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogPasswordVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateEmployeePassword('pwdForm')"
        >修改</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { getUserById, updateUserById } from "@/api/user";
import { updatePassword } from "@/api/common";
import UploadImage from "@/components/UploadImage.vue";
export default {
  components: { UploadImage },
  data() {
    return {
      userId: "",
      userForm: {
        username: "",
        image: "",
        name: "",
        sex: "",
        phone: "",
        balance: "",
        discount: "",
      },
      dialogPasswordVisible: false, // 修改密码弹框
      pwdForm: {
        oldPassword: "",
        newPassword: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
          { min: 4, max: 8, message: "长度在 4 到 8 个字符" },
        ],
        phone: [
          { required: true, message: "请输入电话号码" },
          { pattern: /^1[3-9]\d{9}$/, message: "手机号码格式不正确" },
        ],
      },
      pwdRules: {
        oldPassword: [
          { required: true, message: "请输入原密码" },
          { min: 3, max: 10, message: "原密码的位数在3到10之间" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码" },
          { min: 3, max: 10, message: "新密码的位数在3到10之间" },
        ],
      },
    };
  },
  created() {
    this.userId = localStorage.getItem("id");
    this.getSingleUser(); // 获取用户的基本信息
  },
  methods: {
    async getSingleUser() {
      this.userForm = await getUserById(this.userId);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const id = this.userId;
          this.updateUserById(id);
        }
      });
    },
    async updateUserById(id) {
      await updateUserById(id, this.userForm);
      this.$message.success("修改成功");
      this.getSingleUser();
      window.location.reload();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    passwordDialog() {
      this.dialogPasswordVisible = true;
    },
    updateEmployeePassword(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.pwdForm.roleId = localStorage.getItem("roleId");
          await updatePassword(this.pwdForm);
          this.$message.success("密码修改成功");
          this.dialogPasswordVisible = false;
        }
      });
    },
    resetPasswordForm() {
      this.$refs.pwdForm.resetFields();
    },

    // 底部
  },
};
</script>




.avatar-uploader .el-upload {
  border: 1px dashed black;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>