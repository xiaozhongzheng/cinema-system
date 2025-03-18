<template>
  <div id="#screen_room">
    <div style="text-align: left">

      <el-select
        v-model="type"
        placeholder="请选择放映类型"
      >
        <el-option
          label="2D"
          value="2"
        ></el-option>
        <el-option
          label="3D"
          value="3"
        ></el-option>
        <el-option
          label="4D"
          value="4"
        ></el-option>
      </el-select>

      <el-button
        type="info"
        @click="pageQueryScreen"
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
        v-if="roleId === 2"
        @click="showAddForm"
      >新增放映厅</el-button>
    </div>
    <!-- 新增放映厅弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="resetForm"
    >
      <el-form
        :model="screenForm"
        :rules="rules"
        ref="screenForm"
      >
        <el-form-item
          label="名称"
          :label-width="formLabelWidth"
          style="width: 60%"
          prop="name"
        >
          <el-input
            v-model="screenForm.name"
            autocomplete="off"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="座位数"
          :label-width="formLabelWidth"
          prop="seatCount"
          style="width: 60%"
        >
          <el-input
            v-model.number="screenForm.seatCount"
            autocomplete="off"
            placeholder="请填写座位数"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          :label-width="formLabelWidth"
          style="width: 60%"
          prop="type"
        >
          <el-select
            v-model="screenForm.type"
            placeholder="请选择放映类型"
            style="width: 100%"
          >
            <el-option
              label="2D"
              :value="2"
            ></el-option>
            <el-option
              label="3D"
              :value="3"
            ></el-option>
            <el-option
              label="4D"
              :value="4"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="简介"
          :label-width="formLabelWidth"
          style="width: 60%"
          prop="description"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="screenForm.description"
          >
          </el-input>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddOrUpdate('screenForm')"
        >{{ handleType == 'add' ? '添 加' : '修 改' }}</el-button>
      </div>
    </el-dialog>

    <el-table
      :data="screenArr"
      style="width: 100%;margin-top: 10px"
    >

      <el-table-column
        prop="name"
        label="名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="seatCount"
        label="座位数"
      >
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.type + 'D' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="介绍"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新日期"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        v-if="roleId === 2"
      >

        <template slot-scope="scope">
          <el-button
            type="warning"
            @click="showUpdateForm(scope.row)"
          >
            修改
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
import * as screen from "@/api/screen";
export default {
  data() {
    let validateValue = (rule, value, callback) => {
      if (value < 20) {
        callback(new Error("座位数不能低于20"));
      } else if (value > 200) {
        callback(new Error("座位数不能高于200"));
      } else {
        callback();
      }
    };
    return {
      screenArr: [],
      type: "", // 表示放映厅的类型
      screenForm: {
        id: "",
        name: "",
        seatCount: "",
        type: "",
        description: "",
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,

      rules: {
        name: [{ required: true, message: "请填写名称" }],
        seatCount: [
          { required: true, message: "请填写座位数" },
          { type: "number", message: "座位数必须为整数" },
          { pattern: /^[0-9]*$/, message: "只能输入正整数" },
          { validator: validateValue },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
      },
      pageNo: 1,
      pageSize: 10,
      total: 0,
      handleType: "add", // 用于区分添加操作和修改操作
      title: "",
      roleId: this.$store.getters.roleId,
    };
  },
  created() {
    this.pageQueryScreen();
  },
  methods: {
    async pageQueryScreen() {
      const res = await screen.pageQueryScreen({
        type: this.type,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      });
      this.screenArr = res.records;
      this.total = res.total;
    },
    showAddForm() {
      this.dialogFormVisible = true;
      this.handleType = "add";
      this.title = "新增放映厅";
    },
    showUpdateForm(row) {
      this.dialogFormVisible = true;
      this.handleType = "update";
      this.title = "修改放映厅";
      this.getScreenById(row.id);
      // this.screenForm = this.screenArr[0];
    },
    async getScreenById(id) {
      const res = await screen.getScreenById(id);
      this.screenForm = res;
    },
    handleAddOrUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.handleType == "add") {
            this.handleAdd();
          } else {
            this.handleUpdate();
          }
        }
      });
    },
    async handleAdd() {
      await screen.addScreen(this.screenForm);
      this.$message.success("添加放映厅成功");
      this.pageQueryScreen();
      this.resetForm();
    },
    async handleUpdate() {
      await screen.updateScreen(this.screenForm);
      this.$message.success("修改放映厅成功");
      this.pageQueryScreen();
      this.resetForm();
    },
    resetForm() {
      this.dialogFormVisible = false;
      this.$refs.screenForm.resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageQueryScreen();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.pageQueryScreen();
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除放映厅, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const id = row.id;
          await screen.deleteScreen(id);
          this.$message({
            type: "success",
            message: "删除放映厅成功",
          });
          this.pageQueryScreen();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    reset() {
      this.type = "";
      this.pageQueryScreen();
    },

    // 底部
  },
};
</script>



<style scoped>
</style>

