<template>
  <div id="film">
    <div style="height: 50px;text-align: left">
      <el-input
        placeholder="请输入电影名"
        v-model="title"
        style="width: 20%;margin-bottom: 30px;"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
        ></i>
      </el-input>
      <el-select
        v-model="type"
        placeholder="请选择类型"
        style="margin-left: 20px"
      >
        <el-option
          v-for="(item,i) in typeArr"
          :key="i"
          :label="item"
          :value="i"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="region"
        placeholder="请选择地区"
        style="margin-left: 20px"
      >
        <el-option
          v-for="(item,i) in regionArr"
          :key="i"
          :label="item"
          :value="i"
        >
        </el-option>
      </el-select>
      <el-button
        type="info"
        style="margin-left: 20px"
        @click="pageQueryFilm"
      >查询</el-button>
      <el-button
        type="info"
        style="margin-left: 20px"
        @click="reset"
      >重置</el-button>
      <el-button
        type="primary"
        style="margin-left: 20px"
        v-if="roleId == 2"
        @click="toAddFilm"
      >新增影片</el-button>
    </div>
    <el-table
      :data="filmArr"
      style="width: 100%;"
      
    >
      <el-table-column
        prop="title"
        label="名称"
        width="200"
      >
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.image"
            height="120px"
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="releaseDate"
        width="150"
        label="上映日期"
      >
      </el-table-column>
      <el-table-column
        label="价格"
        width="100"
      >
      <template slot-scope="scope">
          {{scope.row.price}} 元
        </template>
      </el-table-column>
      
      <el-table-column
        prop="type"
        label="类型"
        width="100"
      >
        <template slot-scope="scope">
          {{ typeArr[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="region"
        label="地区"
        width="100"
      >
        <template slot-scope="scope">
          {{ regionArr[scope.row.region]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="duration"
        label="时长"
      >
        <template slot-scope="scope">
          {{ scope.row.duration + " 分钟" }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
            @click="showAddSchduleForm(scope.row)"
            v-if="roleId == 1"
          >排片</el-button>
          <el-button
            type="warning"
            @click="handleEdit(scope.row)"
            v-if="roleId == 2"
          >编辑</el-button>
          

          <el-button
            type="danger"
            @click="handleDelete(scope.row)"
            v-if="roleId == 2"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 4, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 新增排片弹框 -->
    <el-dialog
      title="新增电影排片"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="scheduleForm"
        :rules="rules"
        ref="scheduleForm"
      >
        <el-form-item
          label="影片名"
          :label-width="formLabelWidth"
          style="width: 60%"
          prop="filmTitle"
        >
          <el-input
            v-model="scheduleForm.filmTitle"
            autocomplete="off"
            readonly
          ></el-input>
        </el-form-item>

        <el-form-item
          label="放映厅"
          :label-width="formLabelWidth"
          style="width: 60%"
          prop="screenRoomName"
        >
          <el-select
            v-model="scheduleForm.screenRoomName"
            placeholder="请选择放映厅"
            style="width: 100%"
          >
            <el-option
              v-for="item in screenRoomList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="语言"
          :label-width="formLabelWidth"
          style="width: 60%"
          prop="language"
        >
          <el-select
            v-model="scheduleForm.language"
            placeholder="请选择语言类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in languageArr"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="日期"
          :label-width="formLabelWidth"
          style="width: 60%"
          prop="time"
        >
          <el-date-picker
            v-model="scheduleForm.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddSchedule('scheduleForm')"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addSchedule } from "@/api/schedule.js";
import { getScreenRoomList } from "@/api/screen";
export default {
  data() {
    return {
      filmArr: [],
      pageNo: 1,
      pageSize: 4,
      title: "",
      type: "",
      region: "",
      total: 3,
      typeArr: this.global.filmTypeArr,
      regionArr: this.global.regionArr,
      dialogFormVisible: false,
      scheduleForm: {
        filmId: "",
        filmTitle: "",
        screenRoomName: "",
        language: "",
        startTime: "",
        endTime: "",
        time: [], // 保存开始时间和结束时间的数组
      },
      formLabelWidth: "120px",
      screenRoomList: ["1号厅", "2号厅", "3号厅"],
      languageArr: ["国语", "英语", "粤语", "其他"],
      
      rules: {
        screenRoomName: [{ required: true, message: "请选择放映厅" }],
        language: [{ required: true, message: "请选择语言" }],
        time: [{ required: true, message: "请选择时间" }],
      },
      roleId: "",
      releaseDate: '',
      duration: ''
    };
  },
  created() {
    this.pageQueryFilm();
    this.roleId = localStorage.getItem("roleId");
  },
  methods: {
    reset() {
      this.title = "";
      this.pageNo = 1;
      this.pageSize = 10;
      this.type = "";
      this.region = "";
      this.pageQueryFilm();
    },
    pageQueryFilm() {
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        title: this.title,
        type: this.type,
        region: this.region,
      };
      this.$http
        .get("/film/page", {
          params: data,
        })
        .then((res) => {
          if (res.data.code === 1) {
            this.filmArr = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
    toAddFilm() {
      this.$router.push("/admin/addFilm");
    },
    handleEdit(row) {
      this.$router.push({
        name: "addFilm",
        query: { id: row.id },
      });
    },

    handleDelete(row) {
      this.$confirm("此操作将永久删除该影片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const id = row.id;
          this.$http.delete(`/film/${id}`).then((res) => {
            if (res.data.code === 1) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.pageQueryFilm();
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

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageQueryFilm();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.pageQueryFilm();
    },
    showAddSchduleForm(row) {
      this.dialogFormVisible = true;
      this.scheduleForm.filmId = row.id;
      this.scheduleForm.filmTitle = row.title;
      this.releaseDate = row.releaseDate;
      this.duration = row.duration;
      this.getScreenRoomListName();
    },
    resetForm() {
      this.$refs.scheduleForm.resetFields();
    },
    handleAddSchedule(formName) {
      let form = this.scheduleForm;
      let startTime = form.time[0];
      let minute = (new Date(form.time[1]) - new Date(startTime)) / (60*1000);
      
      if(startTime < this.releaseDate){
        this.$message.error('影片的开始时间不能早于上映时间');
        return ;
      }
      if(new Date(startTime) <= new Date()){
        this.$message.error('影片的开始时间不能早于当前时间');
        return ;
      }
      if(minute != this.duration){
        this.$message.error('影片的时长和选择的时间不一致');
        return ;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          form.startTime = form.time[0];
          form.endTime = form.time[1];
          addSchedule(form).then((res) => {
            if (res.data.code === 1) {
              this.$message.success("排片成功");
              this.cancel();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    getScreenRoomListName() {
      getScreenRoomList().then((res) => {
        if (res.data.code === 1) {
          this.screenRoomList = res.data.data;
        }
      });
    },
    cancel() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
  },
};
</script>

<style scoped>
</style>