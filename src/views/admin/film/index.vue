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
        @click="pageQuery"
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
        :current-page.sync="pageNo"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <add-schedule-dialog
      :showDialog="dialogFormVisible"
      :film="film"
      ref="addSchedule"
      @cancel="cancel"
    ></add-schedule-dialog>

  </div>
</template>

<script>
import { pageQueryFilm, deleteFilmById } from "@/api/film";
import AddScheduleDialog from '../schedule/components/AddScheduleDialog.vue';
export default {
  components: {
    AddScheduleDialog,
  },
  data() {
    return {
      filmArr: [],
      pageNo: 1,
      pageSize: 4,
      title: "",
      type: "",
      region: "",
      total: 0,
      typeArr: this.global.filmTypeArr,
      regionArr: this.global.regionArr,
      dialogFormVisible: false,
      film: {},
      roleId: "",
    };
  },
  created() {
    this.roleId = localStorage.getItem("roleId");
    this.pageQueryFilm();
  },
  methods: {
    pageQuery(){
      this.pageNo = 1;
      this.pageSize = 4;
      this.pageQueryFilm();
    },
    reset() {
      this.title = "";
      this.pageNo = 1;
      this.pageSize = 4;
      this.type = "";
      this.region = "";
      this.pageQueryFilm();
    },
    async pageQueryFilm() {
      console.log(this.pageNo);
      const params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        title: this.title,
        type: this.type,
        region: this.region,
      };
      const res = await pageQueryFilm(params);
      this.filmArr = res.records;
      this.total = res.total;
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
        .then(async () => {
          const id = row.id;
          await deleteFilmById(id);
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.pageQueryFilm();
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
      this.film = row;
      // 因为前次赋值都是异步操作，执行此函数，可以使更改方法在数据更新后执
      this.$nextTick(() => {
        // 父组件调用子组件的方法
        this.$refs.addSchedule.init();
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