<template>
  <div id="orders">
    <div style="text-align: left">
      <el-input
        v-model="name"
        placeholder="请输入影片名"
        style="width: 20%"
      >

      </el-input>

      <el-input
        v-model="username"
        placeholder="请输入用户名"
        style="width: 20%;margin-left: 20px"
      >

      </el-input>

      <el-button
        type="info"
        @click="pageQueryOrders"
        style="margin-left: 20px"
      >查询</el-button>
      <el-button
        type="info"
        @click="reset"
        style="margin-left: 20px"
      >重置</el-button>

    </div>

    <el-table
      :data="ordersArr"
      style="width: 100%;margin-top: 10px"
    >

      <el-table-column
        prop="name"
        label="影片名"
        width="200"
      >
      </el-table-column>

      <el-table-column
        label="图片"
        width="150"
      >
        <template slot-scope="scope">
          <img
            :src="scope.row.image"
            height="140px"
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="screenRoomName"
        label="放映厅名"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="seatNumberStr"
        label="座位号"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="金额"
        width="100"
      >
        <template slot-scope="scope">
          <b>{{ scope.row.amount.toFixed(2) }} 元</b>
        </template>
      </el-table-column>
      <el-table-column
        label="支付状态"
        width="100px"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">已支付</el-tag>
          <el-tag v-if="scope.row.status == 0" type="error">已取消</el-tag>
          <el-tag v-if="scope.row.status == 2" type="success">已完成</el-tag>

        </template>
      </el-table-column>

      <el-table-column
        prop="startTime"
        label="影片开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="payTime"
        label="支付时间"
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
import { pageQueryOrders } from "@/api/orders";
export default {
  data() {
    return {
      ordersArr: [
        {
          name: "",
          image: "",
          username: "",
          amount: "",
          status: "",
          startTime: "",
          payTime: "",
        },
      ],
      name: "", // 影片名
      username: "",

      pageNo: 1,
      pageSize: 10,
      total: "",
    };
  },
  created() {
    this.pageQueryOrders();
  },
  methods: {
    async pageQueryOrders() {
      // this.$http
      //   .get("/orders/page", {
      //     params: {},
      //   })
      //   .then((res) => {
      //     if (res.data.code === 1) {
      //        = res.data.data.records;
      //        = res.data.data.total;
      //     }
      //   });
      const { records, total } = await pageQueryOrders({
        name: this.name,
        username: this.username,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      });
      this.ordersArr = records
      this.total = total
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageQueryOrders();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.pageQueryOrders();
    },

    reset() {
      this.name = "";
      this.username = "";
      this.pageQueryOrders();
    },

    // 底部
  },
};
</script>



  <style scoped>
</style>

