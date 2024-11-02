<template>
  <div id="#employee">
    <div style="text-align: left">
      <el-input
        placeholder="请输入用户名"
        v-model="username"
        style="width: 20%;margin-bottom: 10px;"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
        ></i>
      </el-input>
      <el-select
        v-model="roleId"
        placeholder="请选择身份"
        style="margin-left: 20px"
      >
        <el-option
          label="管理员"
          value="2"
        ></el-option>
        <el-option
          label="员工"
          value="1"
        ></el-option>

      </el-select>
      <el-select
        v-model="status"
        placeholder="请选择账号状态"
        style="margin-left: 20px"
      >
        <el-option
          label="启用"
          value="1"
        ></el-option>
        <el-option
          label="禁用"
          value="0"
        ></el-option>

      </el-select>

      <el-button
        type="info"
        @click="pageQueryEmployee"
        style="margin-left: 20px"
      >查询</el-button>
      <el-button
        type="info"
        @click="reset"
        style="margin-left: 20px"
      >重置</el-button>

      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="dialogFormVisible = true"
      >新增员工</el-button>
    </div>
    <!-- 新增员工弹框 -->
    <el-dialog
      title="新增员工"
      :visible.sync="dialogFormVisible"
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

    <el-table
      :data="employeeArr"
      style="width: 100%"
    >

      <el-table-column
        prop="username"
        label="用户名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话号码"
      >
      </el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">
          {{ scope.row.roleId == 1 ? '员工' : '管理员' }}
        </template>
      </el-table-column>
      <el-table-column label="账号状态">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
      >

        <template slot-scope="scope" v-if="scope.row.username!='admin'">
          <el-button @click="updateAdmin(scope.row)" style="width: 120px" type="success">
            设为{{ scope.row.roleId == 2 ? '员工' : '管理员' }}
          </el-button>

          <el-button
            type="warning"
            @click="updateStatus(scope.row)"
          >
            {{ scope.row.status == 0 ? '启用' : '禁用' }}
          </el-button>
          <el-button
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div
      class="block"
      style="margin-top: 10px"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[2,5,10,20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>

import { updateEmployeeById } from "@/api/employee";
export default {
  data() {
    return {
      employeeArr: [
       
      ],
      username: '',
      roleId: "",
      status: "",
      empForm: {
        username: "",
        password: "",
        phone: ""
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
            { required: true, message: '请输入电话号码' },
            {pattern: /^1[3-9]\d{9}$/,message:"手机号码格式不正确"}
        ]
      },
      pageNo: 1,
      pageSize: 10,
      total: '',
    };
  },
  created() {
    this.pageQueryEmployee();
    
  },
  methods: {
    pageQueryEmployee() {
      this.$http
        .get("/employee/page", {
          params: {
            username: this.username,
            roleId: this.roleId,
            status: this.status,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          if (res.data.code === 1) {
            this.employeeArr = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
    reset() {
      (this.username = ""), 
      (this.roleId = ""), 
      (this.status = "");
      this.pageQueryEmployee();
    },
    addEmployee(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("/employee/save", this.empForm).then((res) => {
            if (res.data.code === 1) {
              this.$message.success("添加成功");
              this.resetForm();
              this.pageQueryEmployee();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.empForm.resetFields();
      this.dialogFormVisible = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageQueryEmployee();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.pageQueryEmployee();
    },
    handleDelete(row) {
      let name = (row.roleId == 2 ? '管理员' : '员工')
      this.$confirm(`此操作将永久删除${name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const id = row.id;
          this.$http.delete(`/employee/${id}`).then((res) => {
            if (res.data.code === 1) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.pageQueryEmployee();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    updateStatus(row) {
      if(row.roleId == 2){
        this.$message.error('不能禁用管理员账号')
        return ;
      }
      const data = {
        id: row.id,
        status: row.status == 1 ? 0 : 1,
      };
      this.handleUpdate(data);
    },
    handleUpdate(data) {
      updateEmployeeById(data).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("修改成功");
          this.pageQueryEmployee();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    updateAdmin(row) {
      if(row.status === 0){
        this.$message.error('账号被禁用了，请联系管理员解禁');
        return ;
      }
      if (row.username == 'admin') {
        this.$message.error("不能将admin管理员修改为员工");
        return;
      }
      let name1 = "",name2 = "";
      if(row.roleId === 2){
        name1 = '管理员';
        name2 = '员工';
      }else{
        name1 = '员工';
        name2 = '管理员'
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

