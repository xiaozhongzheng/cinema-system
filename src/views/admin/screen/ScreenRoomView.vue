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
        v-if="roleId == 2"
        @click="showAddForm"
      >新增放映厅</el-button>
    </div>
    <!-- 新增放映厅弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
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
      <el-table-column label="操作" v-if="roleId == 2">

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

export default {
 
  data() {
    let validateValue = (rule, value, callback) => {
      if (value < 20) {
        callback(new Error("座位数不能低于20"));
      }else if(value>200){
        callback(new Error("座位数不能高于200"));
      } else {
       
        callback();
      }
    };
    return {
      screenArr: [
      ],
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
          {pattern: /^[0-9]*$/,message: "只能输入正整数"},
          { validator: validateValue},
          
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
      },
      pageNo: 1,
      pageSize: 5,
      total: '',
      handleType: "add", // 用于区分添加操作和修改操作
      title: "",
      roleId: ""
    };
  },
  created() {
    this.pageQueryScreen()
    this.roleId = localStorage.getItem('roleId')
  },
  methods: {
    pageQueryScreen() {
      this.$http
        .get("/screen/page", {
          params: {
            type: this.type,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          if (res.data.code === 1) {
            this.screenArr = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
    showAddForm() {
      this.dialogFormVisible = true;
      this.handleType = "add";
      this.title = "新增放映厅";
      // this.screenForm = {}
      this.resetForm();
      
      
    },
    showUpdateForm(row) {
      this.dialogFormVisible = true;
      this.handleType = "update";
      this.title = "修改放映厅";
      this.getScreenById(row.id);
      // this.screenForm = this.screenArr[0];

    },
    getScreenById(id) {
      this.$http.get(`/screen/single/${id}`).then((res) => {
        if (res.data.code === 1) {
          this.screenForm = res.data.data;
        }
      });
    },
    handleAddOrUpdate(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.handleType == "add") {
            this.handleAdd();
          } else {
            this.handleUpdate();
          }
        } else {
          return false;
        }
      });
    },
    handleAdd() {
      this.$http.post("/screen/save", this.screenForm).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("添加成功");
          this.pageQueryScreen();
          this.dialogFormVisible = false;

        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleUpdate() {
      this.$http.put("/screen/edit", this.screenForm).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("修改成功");
          this.pageQueryScreen();
          this.dialogFormVisible = false;

        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    resetForm() {
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
        .then(() => {
          const id = row.id;
          this.$http.delete(`/screen/${id}`).then((res) => {
            if (res.data.code === 1) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.pageQueryScreen();
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
    reset(){
      this.type = '';
      this.pageQueryScreen();
    }

    // 底部
  },
};
</script>
  
  
  
  <style scoped>
</style>
  
  