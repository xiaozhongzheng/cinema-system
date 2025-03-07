<template>
  <div id="addSchedule">
    <!-- 新增或修改排片弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      @close="cancel"
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
            @input="changeDate"
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
import { getScreenRoomList } from "@/api/screen";
import { addSchedule, updateSchedule } from "@/api/schedule.js";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    film: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: "add",
    },
    schedule: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
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
      screenRoomList: [],
      languageArr: ["国语", "英语", "粤语", "其他"],
      releaseDate: "",
      rules: {
        screenRoomName: [{ required: true, message: "请选择放映厅" }],
        language: [{ required: true, message: "请选择语言" }],
        time: [{ required: true, message: "请选择时间" }],
      },
      dialogTitle: "",
      duration: "",
    };
  },
  created() {
    this.getScreenRoomListName();
  },
  methods: {
    async getScreenRoomListName() {
      this.screenRoomList = await getScreenRoomList();
    },
    changeDate(){
      this.$forceUpdate(); // 强制更新时间（使vue重新渲染）
    },
    init() {
      if (this.film) {
        this.scheduleForm.filmId = this.film.id;
        this.scheduleForm.filmTitle = this.film.title;
        this.releaseDate = this.film.releaseDate;
        this.duration = this.film.duration;
        this.dialogTitle = "新增排片";
      }
      if (this.schedule) {
        this.scheduleForm = this.schedule;
        this.releaseDate = this.schedule.releaseDate;
        this.duration = this.schedule.duration;
        this.dialogTitle = "修改排片";
      }
    },
    handleAddSchedule(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let form = this.scheduleForm;
          console.log(form.time);
          let startTime = form.time[0];
          let minute = (new Date(form.time[1]) - new Date(startTime)) / (60 * 1000);

          if (startTime < this.releaseDate) {
            this.$message.error("影片的开始时间不能早于上映时间");
            return;
          }
          if (new Date(startTime) <= new Date()) {
            this.$message.error("影片的开始时间不能早于当前时间");
            return;
          }

          if (minute != this.duration) {
            this.$message.error("影片的时长和选择的时间不一致");
            return;
          }
          form.startTime = form.time[0];
          form.endTime = form.time[1];
          if (this.type === "add") {
            await addSchedule(form);
            this.$message.success("添加排片成功");
          } else {
            await updateSchedule(form);
            this.$message.success("修改排片成功");
          }

          this.cancel();
        }
      });
    },

    cancel() {
      // this.showDialog = false; // 因为不能修改props中的属性值，所以这样写会报错
      // 应该是修改父组件的值来实现对话框消失
      this.$emit("cancel", false);
      this.$refs.scheduleForm.resetFields();
    },
  },
};
</script>
