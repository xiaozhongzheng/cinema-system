<template>
  <div id="schedule">
    <div style="text-align: left">
      <el-input
        v-model="title"
        placeholder="请输入影片名"
        style="width: 20%"
      >

      </el-input>

      <el-select
        v-model="screenRoomName"
        placeholder="请选择放映厅"
        style="width: 20%;margin: 0 20px"
      >
        <el-option
          v-for="item in screenRoomList"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="language"
        placeholder="请选择语言类型"
      >
        <el-option
          v-for="item in languageArr"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>

      <el-button
        type="info"
        @click="pageQuerySchedule"
        style="margin-left: 20px"
      >查询</el-button>
      <el-button
        type="info"
        @click="reset"
        style="margin-left: 20px"
      >重置</el-button>

    </div>

    <el-table
      :data="scheduleArr"
      style="width: 100%;margin-top: 10px"
    >

      <el-table-column
        prop="filmTitle"
        label="影片名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="screenRoomName"
        label="放映厅"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="language"
        label="语言"
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="duration"
        label="时长(分钟)"
        width="100"
      >
      </el-table-column>

      <el-table-column
        prop="startTime"
        label="开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
      >
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="排片时间"
        width="180"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button
            type="warning"
            @click="showEditSchduleForm(scope.row)"
          >编辑</el-button>

          
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

    <!-- 新增排片弹框 -->
    <el-dialog
      title="修改电影排片"
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditSchedule('scheduleForm')"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
    
<script>
import { getScreenRoomList } from "@/api/screen";

export default {
  data() {
    return {
      scheduleArr: [],
      title: "",
      language: "",
      screenRoomName: "",
      pageNo: 1,
      pageSize: 10,
      total: 0,
      languageArr: ["国语", "英语", "粤语", "其他"],
      screenRoomList: [],
      dialogFormVisible: false,
      scheduleForm: {},
      rules: {
        screenRoomName: [{ required: true, message: "请选择放映厅" }],
        language: [{ required: true, message: "请选择语言" }],
        time: [{ required: true, message: "请选择时间" }],
      },
      formLabelWidth: "120px",
      duration: ''
    };
  },
  created() {
    this.pageQuerySchedule();
    this.getScreenRoomListName();
  },
  methods: {
    
    pageQuerySchedule() {
      this.$http
        .get("/schedule/page", {
          params: {
            employeeId: localStorage.getItem("id"),
            title: this.title,
            language: this.language,
            screenRoomName: this.screenRoomName,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          if (res.data.code === 1) {
            this.scheduleArr = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageQuerySchedule();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.pageQuerySchedule();
    },

    reset() {
      this.screenRoomName = "";
      this.title = "";
      this.language = "";
      this.pageQuerySchedule();
    },
    getScreenRoomListName() {
      getScreenRoomList().then((res) => {
        if (res.data.code === 1) {
          this.screenRoomList = res.data.data;
        }
      });
    },
    showEditSchduleForm(row) {
      this.dialogFormVisible = true;
      this.getSingleScheduleById(row);
      this.getScreenRoomListName();
      this.duration = row.duration;
    },
    getSingleScheduleById(row) {
      this.$http
        .get("/schedule/single", {
          params: {
            id: row.id,
          },
        })
        .then((res) => {
          if (res.data.code === 1) {
            this.scheduleForm = res.data.data;
            this.scheduleForm.filmTitle = row.filmTitle;
            let arr = new Array();
            if (this.scheduleForm) {
              arr.push(this.scheduleForm.startTime);
              arr.push(this.scheduleForm.endTime);
            }
            this.scheduleForm.time = arr;
          }
        });
    },
    handleEditSchedule(formName) {
      let form = this.scheduleForm;
      let startTime = form.time[0];
      let minute = (new Date(form.time[1]) - new Date(startTime)) / (60 * 1000);

      if (startTime < this.releaseDate) {
        this.$message.error("影片的开始时间不能早于上映时间");
        return;
      }
      
      if (minute != this.duration) {
        this.$message.error("影片的时长和选择的时间不一致");
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          form.startTime = form.time[0];
          form.endTime = form.time[1];
          this.editSchedule(form);
        } else {
          return false;
        }
      });
    },
    editSchedule(data) {
      this.$http.put("/schedule", data).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("修改成功");
          this.dialogFormVisible = false;
          this.pageQuerySchedule();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 底部
  },
};
</script>
    
    
    
<style scoped>
</style>
    
    