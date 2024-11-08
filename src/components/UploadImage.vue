<template>
  <div>
    <el-upload
      v-if="showType == 'film' "
      class="avatar-uploader"
      action=""
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
    >
      <img
        v-if="value"
        :src="value"
        class="avatar1"
      >
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon1"
      ></i>
    </el-upload>
    <el-upload
      v-else
      class="avatar-uploader"
      action=""
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
    >
      <img
        v-if="value"
        :src="value"
        class="avatar"
      >
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
      ></i>
    </el-upload>
  </div>
</template>

<script>
import { upload } from "@/api/common";

export default {
  props: {
    // 当使用v-model时，子组件的要用value接收
    value: {
      type: String,
      default: "",
    },
    showType: {
      type: String,
      default: "film",
    },
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片的大小不能超过 2MB!");
        return;
      }
      const formData = {
        file: file,
      };
      this.upload(formData);
      return true;
    },
    async upload(formData) {
      const res = await upload(formData);
      // 上传成功后，显示图片
      this.$message.success("上传成功");
      // 当父组件使用v-model绑定时，可以用input事件提交数据并给v-model绑定的属性赋值
      this.$emit("input", res);
    },
  },
};
</script>


<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon1 {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 220px;
  line-height: 220px;
  text-align: center;
}
.avatar1 {
  width: 160px;
  height: 220px;
  display: block;
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