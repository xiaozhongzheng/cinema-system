<template>
  <div id="film">
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
        <el-button
          type="primary"
          style="margin-left: 20px"
          v-if="roleId === 2"
          @click="showEditDialog()"
        >新增影片</el-button>
      </template>
      <template
        slot-scope="scope"
        slot="columnHandle"
      >
        <el-button
          type="success"
          @click="showAddSchduleForm(scope.row)"
          v-if="roleId === 1"
        >排片</el-button>

        <el-button
          type="warning"
          @click="showEditDialog(scope.row)"
          v-if="roleId === 2"
        >编辑</el-button>

        <el-button
          type="danger"
          @click="handleDelete(scope.row)"
          v-if="roleId === 2"
        >删除</el-button>
      </template>
    </SearchTableTemplate>

    <add-schedule-dialog
      :showDialog="dialogFormVisible"
      :film="film"
      ref="addScheduleRef"
      @cancel="cancel"
    ></add-schedule-dialog>
    <AddFilmDialog v-if="visible" :item="item" :visible.sync="visible" @handleSuccess="handleSuccess"></AddFilmDialog>
  </div>
</template>

<script>
import { pageQueryFilm, deleteFilmById } from "@/api/film";
import AddScheduleDialog from "../schedule/components/AddScheduleDialog.vue";
import AddFilmDialog from "./component/AddFilmDialog.vue";
export default {
  components: {
    AddScheduleDialog,
    SearchTableTemplate: () => import("@/components/SearchTableTemplate.vue"),
    AddFilmDialog
  },
  data() {
    return {
      visible: false,
      item: {},
      typeArr: this.$constant.filmTypeArr,
      regionArr: this.$constant.regionArr,
      dialogFormVisible: false,
      film: {},
      roleId: this.$store.getters.roleId,
      pageQueryApi: "",
      extraParams: {},
      tableParamsList: [
        {
          label: "名称",
          prop: "title",
        },
        {
          label: "图片",
          prop: "image",
          isImage: true,
        },
        {
          label: "上映日期",
          prop: "releaseDate",
        },
        {
          label: "价格",
          prop: "price",
          width: 80
        },
        {
          label: "类型",
          prop: "type",
          text: this.$constant.filmTypeArr,
          width: 80
        },
        {
          label: "地区",
          prop: "region",
          text: this.$constant.regionArr,
          width: 80
        },
        {
          label: "时长",
          prop: "duration",
          width: 100
        },
      ],
      searchParamsList: [
        {
          label: "影片名",
          prop: "title",
          type: "input",
          placeholder: "请输入影片名",
        },
        {
          label: "类型",
          prop: "type",
          type: "select",
          placeholder: "请选择类型",
          options: this.$constant.filmTypeArr.map((item,index) => ({value: index,label: item}))
        },
        {
          label: "地区",
          prop: "region",
          type: "select",
          placeholder: "请选择地区",
          options: this.$constant.regionArr.map((item,index) => ({value: index,label: item}))
        },
      ], // 绑定条件查询的参数
      showSearchForm: false,
    };
  },
  computed: {

  },
  created() {

    // this.pageQuery();
    this.pageQueryApi = pageQueryFilm;
    this.showSearchForm = true
    console.log(this.getTypeArr,'***')
  },
  methods: {
    handleSuccess(){
      this.$refs.searchTableTemplateRef.pageQueryData()
    },

    // toAddFilm() {
    //   this.$router.push("/admin/addFilm");
    // },
    showEditDialog(row = {}) {
      // this.$router.push({
      //   name: "addFilm",
      //   query: { id: row.id },
      // });
      this.item = row
      this.visible = true
    },

    handleDelete(row) {
      this.$confirm("此操作将永久删除该影片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const id = row.id;
          await deleteFilmById(id);
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.$refs.searchTableTemplateRef.pageQueryData()
        })
        .catch((error) => {
          if (error == "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },

    showAddSchduleForm(row) {
      this.dialogFormVisible = true;
      this.film = row;
      // 因为前次赋值都是异步操作，执行此函数，可以使更改方法在数据更新后执
      this.$nextTick(() => {
        // 父组件调用子组件的方法
        this.$refs.addScheduleRef.init();
      });

      // this.releaseDate = row.releaseDate;
      // this.getScreenRoomListName();
    },
    cancel(val) {
      this.dialogFormVisible = val;
    },
  },
};
</script>

<style scoped>
</style>
