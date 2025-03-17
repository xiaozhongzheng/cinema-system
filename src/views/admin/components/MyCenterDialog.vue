<template>
  <div class="my-center">
    <el-dialog
      title="个人中心"
      :visible="visible"
      @close="handleClose"
    >
      <el-descriptions
        class="margin-top"
        :column="2"
        title="个人信息"
        border
      >

        <template slot="extra">
          <el-button
            type="warning"
            @click="passwordDialog"
          >修改密码</el-button>
          <el-button
            type="info"
            @click="edit"
          >修改个人信息</el-button>
        </template>

        <!-- 显示用户信息模块 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ employee.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ employee.phone }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            身份
          </template>
          {{ employee.roleId === 2 ? '管理员':'员工' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            状态
          </template>
          {{ employee.status === 1 ? '启用':'禁用' }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            创建时间
          </template>
          {{ employee.createTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            更新时间
          </template>
          {{ employee.updateTime }}
        </el-descriptions-item>

      </el-descriptions>
      <el-dialog
        title="修改个人信息"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          :model="empForm"
          :rules="rules"
          ref="empForm"
        >
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
            style="width: 60%;"
          >
            <el-input
              v-model="empForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="电话号码"
            :label-width="formLabelWidth"
            prop="phone"
            style="width: 60%;"
          >
            <el-input
              v-model="empForm.phone"
              autocomplete="off"
            ></el-input>
          </el-form-item>

        </el-form>

        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editEmployee('empForm')"
          >修改</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="修改密码"
        :visible.sync="dialogPasswordVisible"
        @close="resetForm"
      >

        <el-form
          :model="pwdForm"
          :rules="pwdRules"
          ref="pwdForm"
        >
          <el-form-item
            label="原密码"
            :label-width="formLabelWidth"
            prop="oldPassword"
            style="width: 60%;"
          >
            <el-input
              v-model="pwdForm.oldPassword"
              placeholder="请输入原密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="新密码"
            :label-width="formLabelWidth"
            prop="newPassword"
            style="width: 60%;"
          >
            <el-input
              v-model="pwdForm.newPassword"
              autocomplete="off"
              placeholder="请输入新密码"
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
    </el-dialog>
  </div>
</template>
<script>
import { updateEmployeeById } from "@/api/employee";
import { updatePassword } from "@/api/common";
export default {
  name: "",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      employee: {
        id: "",
        username: "",
        roleId: "",
        phone: "",
        status: "",
        createTime: "",
        updateTime: "",
      },
      dialogFormVisible: false, // 修改个人信息弹框
      dialogPasswordVisible: false, // 修改密码弹框
      empForm: {
        id: "",
        username: "",
        phone: "",
      },
      pwdForm: {
        oldPassword: "",
        newPassword: "",
      },
      id: "",
      formLabelWidth: "120px",
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
          { min: 4, max: 8, message: "长度在 4 到 8 个字符" },
        ],
        phone: [
          { required: true, message: "请输入电话号码" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号码格式不正确",
          },
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
    this.id = localStorage.getItem("id");
    this.employee = this.$store.getters.userInfo;
  },
  mounted() {

  },

  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    edit() {
      this.dialogFormVisible = true;
      const emp = this.employee;
      this.empForm = {
        id: emp.id,
        username: emp.username,
        phone: emp.phone,
      };
    },
    editEmployee(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await updateEmployeeById(this.empForm);
          this.$message.success("修改成功");
          this.dialogFormVisible = false;
          this.getEmployeeById();
        }
      });
    },

    passwordDialog() {
      this.dialogPasswordVisible = true;
    },
    updateEmployeePassword(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const roleId = this.$store.getters.roleId;
          this.pwdForm = { ...this.pwdForm, roleId: roleId };
          await updatePassword(this.pwdForm);
          this.$message.success("密码修改成功");
          this.dialogPasswordVisible = false;
        }
      });
    },
    resetForm() {
      this.$refs.pwdForm.resetFields();
    },


  },
};
</script>
<style lang="scss" scoped>
</style>
