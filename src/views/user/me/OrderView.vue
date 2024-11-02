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
          style="width: 100%;height: 120px;
            background-color: #fff;
            border: 1px solid rgb(234, 238, 243);
            margin-bottom: 20px;
            font-size: 20px"
          v-for="order in orderArr"
        >

          <img
            :src="order.image"
            height="100%"
            style="vertical-align: middle;float: left"
          >
          <div
            style="width: 60%;height: 90%;float: left;margin: 0 20px;"
            class="main"
          >
            <p>{{ order.name }}</p>
            <span style="margin-right: 20px">
              放映厅：{{ order.screenName }}
            </span>

            <span>
              座位：{{ order.seatNumber }}号
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
          <div style="width: 20%;height: 100%;float: left;line-height: 120px;">
            <span style="width: 100px;display: inline-block">
              {{ order.amount }} 元
            </span>
            <span style="color: red">支付成功</span>

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
    };
  },
  created() {
    this.getOrdersByUserId();
  },
  methods: {
    getOrdersByUserId() {
      this.$http.get("/order/list").then((res) => {
        if (res.data.code === 1) {
          this.orderArr = res.data.data;
        }
      });
    },
  },
};
</script>
  
  
  <style scoped>
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
</style>