<template>
  <div style="background: rgb(242, 246, 252);">
    <p style="font-size: 30px">
      {{ handelType == 'add' ? '新增影片' : '修改影片' }}
    </p>
    <el-form
      :model="filmForm"
      :rules="rules"
      ref="filmForm"
      label-width="150px"
      style="text-align: left"
    >
      <div style="width: 100%;height: 60px">
        <el-form-item
          label="影片标题"
          prop="title"
          style="width: 30%;float: left;"
        >
          <el-input
            v-model="filmForm.title"
            placeholder="请填写影片标题"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="导演名"
          prop="director"
          style="width: 30%;float: left"
        >
          <el-input
            v-model="filmForm.director"
            placeholder="请填写导演名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="主演名"
          prop="actors"
          style="width: 30%;float: left"
        >
          <el-input
            v-model="filmForm.actors"
            placeholder="请填写主演名(用逗号分隔)"
          ></el-input>
        </el-form-item>
      </div>

      <div style="width: 100%;height: 60px"><el-form-item
          label="上映日期"
          prop="releaseDate"
          style="width: 30%;float: left"
        >
          <el-date-picker
            v-model="filmForm.releaseDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="类型"
          prop="type"
          style="width: 30%;float: left"
        >
          <el-select
            v-model="filmForm.type"
            placeholder="请选择类型"
            style="width: 100%"
          >
            <el-option
              v-for="(item,i) in typeArr"
              :key="i"
              :label="item"
              :value="i"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="地区"
          prop="region"
          style="width: 30%;float: left"
        >
          <el-select
            v-model="filmForm.region"
            placeholder="请选择地区"
            style="width: 100%"
          >
            <el-option
              v-for="(item,i) in regionArr"
              :key="i"
              :label="item"
              :value="i"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="width: 100%;height: 60px">
        <el-form-item
          label="价格"
          style="width: 30%;float: left"
          prop="price"
        >
          <el-input
            v-model="filmForm.price"
            autocomplete="off"
            placeholder="请输入价格(单位：元)"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="时长"
          prop="duration"
          style="width: 30%;float: left"
        >
          <el-input
            v-model.number="filmForm.duration"
            placeholder="请填写影片时长(单位：分钟)"
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item
        label="图片"
        prop="image"
        style="width: 30%;"
      >
        <upload-image v-model="filmForm.image" showType = 'film'>
        </upload-image>
      </el-form-item>

      <el-form-item
        label="简介"
        prop="plot"
        style="width: 50%"
      >
        <el-input
          type="textarea"
          v-model="filmForm.plot"
          placeholder="请输入剧情简介"
          :autosize="{minRows:2,maxRows:30}"
          style="overflow: hidden;"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('filmForm')"
        >{{ handelType == 'add' ? '添加' : '修改' }}</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>

    </el-form>


  </div>

</template>

<script>
import { getFilmById, addFilm, updateFilm } from "@/api/film";
import UploadImage from '@/components/UploadImage.vue'
export default {
  components: {
    UploadImage
  },
  data() {
    let validatePrice = (rule, value, callback) => {
      if (value < 5) {
        callback(new Error("影片的价格不能低于5元"));
      } else if (value > 1000) {
        callback(new Error("影片的价格不能高于1000元"));
      } else {
        callback();
      }
    };
    let validateDate = (rule, value, callback) => {
      if (new Date(value) < new Date()) {
        callback(new Error("上映日期不能早于当前日期"));
      } else {
        callback();
      }
    };
    return {
      filmForm: {
        id: "",
        title: "",
        image: "",
        director: "", // 导演姓名
        actors: "", // 主演姓名
        releaseDate: "", // 上映日期
        type: "", // 影片类型
        region: "", // 地区
        duration: "", // 时长
        plot: "", // 简介
        price: "", // 价格
      },
      rules: {
        title: [{ required: true, message: "请填写影片标题" }],
        image: [
          {
            required: true,
            message: "请上传图片",
            trigger: "blur",
          },
        ],
        director: [{ required: true, message: "请填写导演姓名" }],
        actors: [{ required: true, message: "请填写主演姓名" }],
        releaseDate: [{ required: true, message: "请选择上映日期" }],
        type: [{ required: true, message: "请选择影片类型" }],
        region: [{ required: true, message: "请选择上映地区" }],
        duration: [
          { required: true, message: "请填写影片时长" },
          { type: "number", message: "时长必须为整数" },
          { pattern: /^[0-9]*$/, message: "只能输入正整数" },
        ],
        plot: [{ required: true, message: "请填写剧情简介" }],
        price: [
          { required: true, message: "请填写价格" },
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: "价格只能是整数或小数",
          },
          { validator: validatePrice },
        ],
      },
      handelType: "add",
      typeArr: this.$constant.filmTypeArr,
      regionArr: this.$constant.regionArr,
    };
  },
  created() {
    // localStorage.setItem("indexPath", "/admin/film");
    const id = this.$route.query.id;
    if (id) {
      // 表明这是新增操作
      this.handelType = "update";
      this.getFilmById(id);
    }
  },
  methods: {
    async getFilmById(id) {
      this.filmForm = await getFilmById(id);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.handelType == "add") {
            // 新增操作
            this.addFilm();
          } else {
            // 修改操作
            this.updateFilm();
          }
        }
      });
    },
    async addFilm() {
      const data = this.filmForm;
      await addFilm(data);
      this.$message.success("添加影片成功");
      this.$router.push("/admin/film");
    },
    async updateFilm() {
      await updateFilm(this.filmForm);
      this.$message.success("修改影片成功");
      this.$router.push("/admin/film");
    },
    cancel() {
      this.$router.push("/admin/film");
    },
  },
};
</script>


<style>


.el-textarea__inner {
  /* 去除文本框的滚动条 */
  overflow: hidden;
}
</style>
