<template>
  <div id="showSchedule">
    <div style="text-align: left">
      <el-input
        v-model="title"
        placeholder="请输入影片名"
        style="width: 20%;margin-right: 20px"
      >

      </el-input>

      <el-select
        v-model="screenRoomName"
        placeholder="请选择放映厅"
        style="width: 20%;margin-right: 20px"
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
        @click="pageQuery"
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
        label="放映类型"
        width="100px"
      >
        <template slot-scope="scope">
          {{ scope.row.type + 'D' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格(元)"
        width="100px"
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
        prop="scheduleUsername"
        label="排片人"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="排片时间"
        width="180"
      >
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
import { getScreenRoomList } from "@/api/screen";
import {pageQuerySchedule} from '@/api/schedule'
export default {
  data() {
    return {
      scheduleArr: [],
      title: "",
      language: "",
      screenRoomName: "",
      pageNo: 1,
      pageSize: 10,
      total: "",
      languageArr: ["国语", "英语", "粤语", "其他"],
      screenRoomList: [],
    };
  },
  created() {
    this.pageQuerySchedule();
    this.getScreenRoomListName();
  },
  methods: {
    pageQuery(){
      this.pageNo = 1;
      this.pageQuerySchedule();
    },
    async pageQuerySchedule() {
      const { records, total } = await pageQuerySchedule({
        title: this.title,
        language: this.language,
        screenRoomName: this.screenRoomName,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      });
      this.scheduleArr = records;
      this.total = total;
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
      this.pageNo = 1;
      this.pageSize = 10;
      this.pageQuerySchedule();
    },
    async getScreenRoomListName() {
      this.screenRoomList = await getScreenRoomList()
    },

    // 底部
  },
};
</script>
    
    
    
<style scoped>
</style>
    
    