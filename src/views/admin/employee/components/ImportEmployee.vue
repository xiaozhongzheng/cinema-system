<template>
  <div id="import">
    <el-dialog
      title="员工导入"
      :visible="dialogVisible"
      width="30%"
      @close="$emit('update:dialogVisible',false)"
      :close-on-click-modal="false"
      :list-type="['.xlsx','.txt']"
    >
      <el-upload
        class="upload-demo"
        drag
        action
        :http-request="uploadFile"
        multiple
        :before-upload="beforeUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

      </el-upload>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="$emit('update:dialogVisible',false)">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    importExcelApi: {
      type: Function,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    async uploadFile(event) {
      console.log(event, "event");
      const formData = new FormData();
      formData.append("file", event.file);
      this.$emit("handleSuccess");
      this.$emit("update:dialogVisible", false);
    },
    beforeUpload(file) {
      const name = file.name;
      const sufferName = name.substring(name.indexOf("."));
      if (sufferName !== ".xlsx") {
        this.$message.error("请上传以.xlsx结尾的文件");
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
