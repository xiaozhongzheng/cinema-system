<template>
  <div id="#cart">

    <div style="width: 85%;margin: auto">
      <h2>我的订单</h2>
      <el-checkbox-group
        v-model="checkedCartes"
        @change="handleCheckedCitiesChange"
        v-if="orderArr.length!=0"
      >
        <div
          class="ordersStyle"
          v-for="order in orderArr"
        >

          <img
            :src="order.image"
            height="100%"
            style="vertical-align: middle"
          >
          <div class="main">
            <p>{{ order.name }}</p>
            <span style="margin-right: 20px">
              放映厅：{{ order.screenRoomName }}
            </span>

            <span>
              座位：{{ order.seatNumberStr }} 号
            </span>
            <br>
            <span>开场时间：</span>
            <span style="color: red">
              {{ order.startTime }}
            </span>
            <br>
            <span>
              支付时间：{{ order.payTime }}
            </span>

          </div>
          <div class="btn">
            <span class="amount">
              {{ order.amount.toFixed(2) }} 元
            </span>
            <el-tag :type="typeArr[order.status]" >{{ $constant.payStatus[order.status] }}</el-tag>
            <el-button
              :disabled="order.status !== 1"
              type="danger"
              style="height: 40px"
              @click="cancelOrders(order)"
            >取消订单</el-button>
          </div>
        </div>
      </el-checkbox-group>
      <div v-else>
        <el-empty
          :image-size="200"
          description="这里空空如也"
        ></el-empty>
      </div>

    </div>

  </div>

</template>

<script>
import { getOrdersList, cancelOrders } from "@/api/orders";
export default {
  data() {
    return {
      // orderArr: [
      //   {
      //     id: 2,
      //     name: "机器人",
      //     image: require("E:\\img\\电影管理系统图片\\2.jpg"),
      //     screenName: "1号厅",
      //     seatNumber: 1,
      //     startTime: "2024-09-26 12:00:05",
      //     payTime: '2024-09-27 12:00:00',
      //     amount: 1220,
      //     scheduleId: 2,
      //   },

      //   },
      // ],
      orderArr: "",
      typeArr: ['danger','','success']
    };
  },
  created() {
    this.getOrdersByUserId();
  },
  methods: {
    async getOrdersByUserId() {
      this.orderArr = await getOrdersList();
    },
    cancelOrders(order) {
      if(new Date(order.startTime) < new Date()){
        // 等影片开始播放了，就不能取消订单了
        this.$message.error("取消失败,请在影片播放前取消订单！")
        return
      }
      this.$confirm("此操作将删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await cancelOrders(order.id);
          this.getOrdersByUserId();

          this.$message({
            type: "success",
            message: "取消成功!",
          });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
  },
};
</script>


<style scoped lang="scss">
#cart {
  text-align: left;
}
p {
  margin: 0;
  padding: 0;
}
.main span {
  font-size: 14px;
  color: rgb(194, 194, 196);
}
.ordersStyle {
  display: flex;
  // justify-content: space-between;
  width: 100%;
  height: 120px;
  background-color: #fff;
  border: 1px solid rgb(234, 238, 243);
  margin-bottom: 20px;
  font-size: 20px;
  .main {
    width: 40%;
    margin-left: 20px;
  }
  .btn {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .amount {
      color: red;
    }
  }
}
</style>
