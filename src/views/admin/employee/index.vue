<template>
  <div id="#employee">
    <!-- 新增员工弹框 -->
    <el-dialog
      title="新增员工"
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      modal
      :close-on-click-modal="false"
    >
      <el-form
        :model="empForm"
        :rules="rules"
        ref="empForm"
      >
        <el-form-item
          label="账号"
          :label-width="formLabelWidth"
          prop="username"
          style="width: 60%"
        >
          <el-input
            v-model="empForm.username"
            autocomplete="off"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
          style="width: 60%"
        >
          <el-input
            v-model="empForm.password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="电话号码"
          :label-width="formLabelWidth"
          prop="phone"
          style="width: 60%"
        >
          <el-input
            v-model="empForm.phone"
            autocomplete="off"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetForm">取 消</el-button>
        <el-button
          type="primary"
          @click="addEmployee('empForm')"
        >添 加</el-button>
      </div>
    </el-dialog>

    <SearchTableTemplate
      ref="searchTableTemplateRef"
      v-if="pageQueryApi"
      :table-list-api="pageQueryApi"
      :extra-params="extraParams"
      :table-params-list="tableParamsList"
      :search-params-list="searchParamsList"
      :show-search-form="showSearchForm"
    >
      <template slot="handle">
        <div style="margin-bottom: 20px;">
          <el-button
          type="primary"
          style="margin-left: 20px"
          @click="showDialog"
        >新增员工</el-button>
        <el-button
          type=""
          @click="exportExcel"
        >导出文件</el-button>
        <el-button
          type=""
          @click="dialogVisible = true"
        >导入文件</el-button>
        </div>
      </template>
      <template
        slot="columnHandle"
        slot-scope="{row}"
      >
        <el-button
          @click="updateAdmin(row)"
          style="width: 100px"
          type="success"
          size="small"
        >
          设为{{ row.roleId == 2 ? '员工' : '管理员' }}
        </el-button>
        <el-button
          type="warning"
          @click="updateStatus(row)"
          size="small"
        >
          {{ row.status == 0 ? '启用' : '禁用' }}
        </el-button>
        <el-button
          type="danger"
          @click="handleDelete(row)"
          size="small"
        >删除</el-button>
      </template>
    </SearchTableTemplate>
    <ImportEmployee
      @handleSuccess="handleSuccess"
      :dialogVisible.sync="dialogVisible"
      :importExcelApi="importExcelApi"
      v-if="dialogVisible"
    ></ImportEmployee>
  </div>
</template>

<script>
// import {
//   updateEmployeeById,
//   pageQueryEmployee,
//   addEmployee,
//   deleteEmployee
// } from "@/api/employee";
/**
 * 一次性导入所有方法
 */
import * as emp from "@/api/employee";
import FileSaver from "file-saver";
import ImportEmployee from "./components/ImportEmployee.vue";
export default {
  name: 'employee',
  components: {
    ImportEmployee,
  },
  data() {
    return {
      importExcelApi: null,
      dialogVisible: false,
      employeeArr: [],
      username: "",
      roleId: "",
      status: "",
      empForm: {
        username: "",
        password: "",
        phone: "",
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
          { min: 4, max: 8, message: "账号的位数在4到8之间" },
        ],
        password: [
          { required: true, message: "请输入密码" },
          { min: 3, max: 10, message: "密码的位数在3到10之间" },
        ],
        phone: [
          { required: true, message: "请输入电话号码" },
          { pattern: /^1[3-9]\d{9}$/, message: "手机号码格式不正确" },
        ],
      },
      pageNo: 1,
      pageSize: 10,
      total: 0,
      // 表格中columns的值
      tableParamsList: [
        {
          label: "用户名",
          prop: "username",
        },
        {
          label: "电话号码",
          prop: "phone",
        },
        {
          label: "身份",
          prop: "roleId",
          text: this.$constant.userRoleArr,
        },
        {
          label: "账号状态",
          prop: "status",
          text: this.$constant.buttonStatusArr,
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
      ],
      extraParams: {}, // 分页查询的额外参数
      pageQueryApi: "", // 发送接口请求的函数（分页查询）
      searchParamsList: [
        {
          label: "用户名",
          prop: "username",
          type: "input",
          placeholder: "请输入用户名",
        },
        {
          label: "身份",
          prop: "roleId",
          type: "select",
          placeholder: "请选择身份",
          options: [
            {
              label: "管理员",
              value: 2,
            },
            {
              label: "员工",
              value: 1,
            },
          ],
        },
        {
          label: "状态",
          prop: "status",
          type: "select",
          placeholder: "请选择账号状态",
          options: [
            {
              label: "启用",
              value: 1,
            },
            {
              label: "禁用",
              value: 0,
            },
          ],
        },
      ], // 绑定条件查询的参数
    };
  },
  created() {
    this.pageQueryApi = emp.pageQueryEmployee;
    this.showSearchForm = true;
    this.importExcelApi = emp.importExcel;
  },

  methods: {

    handleSuccess() {
      this.$message.success("上传成功");
      this.$refs.searchTableTemplateRef.pageQueryData();
    },
    async exportExcel() {
      const res = await emp.exportExcel();
      console.log(res, "export");
      FileSaver.saveAs(res.data, "员工信息表.xlsx");
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    reset() {
      (this.username = ""), (this.roleId = ""), (this.status = "");
      // this.pageQueryEmployee();
    },
    addEmployee(formName) {
      this.$refs[formName].validate(async (valid) => {
        await emp.addEmployee(this.empForm);
        this.$message.success("添加员工成功");
        this.resetForm();
        // 调用子组件的分页查询方法
        this.$refs["searchTableTemplateRef"].pageQueryData();
      });
    },
    resetForm() {
      this.$refs.empForm.resetFields();
      this.dialogFormVisible = false;
    },

    handleDelete(row) {
      let name = row.roleId == 2 ? "管理员" : "员工";
      this.$confirm(`此操作将永久删除${name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const id = row.id;
          await emp.deleteEmployee(id);
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.$refs["searchTableTemplateRef"].pageQueryData();

          // this.pageQueryEmployee();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    updateStatus(row) {
      if (row.roleId == 2) {
        this.$message.error("不能禁用管理员账号");
        return;
      }
      const data = {
        id: row.id,
        status: row.status == 1 ? 0 : 1,
      };
      this.handleUpdate(data);
    },
    async handleUpdate(data) {
      await emp.updateEmployeeById(data);
      this.$message.success("修改状态成功");
      this.$refs["searchTableTemplateRef"].pageQueryData();
      // this.pageQueryEmployee();
    },
    updateAdmin(row) {
      if (row.status === 0) {
        this.$message.error("账号被禁用了，请联系管理员解禁");
        return;
      }
      if (row.username == "admin") {
        this.$message.error("不能将admin管理员修改为员工");
        return;
      }
      let name1 = "",
        name2 = "";
      if (row.roleId === 2) {
        name1 = "管理员";
        name2 = "员工";
      } else {
        name1 = "员工";
        name2 = "管理员";
      }
      this.$confirm(`此操作将${name1}设置为${name2}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            id: row.id,
            roleId: row.roleId == 2 ? 1 : 2,
          };
          this.handleUpdate(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更改",
          });
        });
    },

    // 底部
  },
};
</script>



<style scoped>
</style>

