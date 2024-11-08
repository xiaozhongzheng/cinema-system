<template>
  <div id="#cart">

    <div style="width: 90%;margin: auto">
      <h2>购物车</h2>
      <div v-if="cartArr.length!=0">
        <el-checkbox-group
          v-model="checkedCartes"
          @change="handleCheckedCitiesChange"
        >
          <div
            class="cartStyle"
            v-for="cart in cartArr"
          >

            <div style="float: left;align-content: center;height: 100%;width: 5%;text-align: center">
              <el-checkbox
                :label="cart"
                :key="cart"
                style="margin-left: 7px"
              >
                <!-- br的作用是使复选框不显示label的内容 -->
                <br>
              </el-checkbox>
            </div>
            <img
              :src="cart.image"
              height="100%"
              style="vertical-align: middle;"
            >
            <div
              style="width: 55%;height: 90%;margin: 0 20px;"
              class="main"
            >
              <p style="font-weight: bold;margin-top:5px">{{ cart.title }}</p>
              <span style="margin-right: 20px">
                放映厅：{{ cart.screenName }}
              </span>

              <span>
                座位：{{ cart.seatNumber }}号
              </span>
              <br>
              <span>
                手机号码：{{ cart.phone }}
              </span>
              <br>
              <span>开场时间：</span>
              <span style="color: red">
                {{ cart.startTime }}
              </span>

            </div>
            <div style="height: 100%;line-height: 120px;color: red">
              <span style="width: 100px;display: inline-block">
                ￥ {{ cart.price }}
              </span>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteCartById(cart.id)"
              ></el-button>
            </div>
          </div>
        </el-checkbox-group>

        <div style="width: 100%;height: 80px;background-color: rgb(144, 148, 156);line-height: 80px;">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            style="margin-left: 2%"
          >全选</el-checkbox>
          <el-button
            type="success"
            style="float: right;
        margin-top: 20px;margin-right: 20px"
            @click="open"
          >
            结算
          </el-button>
          <span style="float: right;">优惠价：
            <span style="color: white;font-size: 20px;width: 150px;display: inline-block">￥{{ discountPrice }}</span>
          </span>
          <span style="float: right;">总价：
            <span style="color: white;font-size: 20px;width: 150px;display: inline-block">￥{{ countPrice }}</span>
          </span>
        </div>
      </div>

      <div v-else>
        <el-empty
          :image-size="200"
          description="这里空空如也"
        ></el-empty>
      </div>

      <!-- <div style="width: 100%;height: 80px;background-color: #fff;">

      </div> -->
    </div>

  </div>

</template>

<script>
import { getUserById } from "@/api/user";
import { getCartes, deleteCartById } from "@/api/cart";
import { saveOrders } from "@/api/orders";
export default {
  data() {
    return {
      checkAll: false,
      checkedCartes: [],
      isIndeterminate: false,
      cartArr: [
        // {
        //   id: 2,
        //   name: "机器人",
        //   image: require("E:\\img\\电影管理系统图片\\2.jpg"),
        //   screenName: "1号厅",
        //   seatNumber: 1,
        //   startTime: "2024-09-26 12:00:05",
        //   price: 1220,
        //   phone: "12345678911",
        //   scheduleId: 2,
        // },
      ],
      // cartArr: "",
      countPrice: 0, // 总价格
      selectCartArr: [],
      discount: 1,
      discountPrice: 0, // 折扣后的总价格
    };
  },
  created() {
    this.getCartesByUserId();
    this.getUserDiscount();
  },
  methods: {
    async getUserDiscount() {
      const id = localStorage.getItem("id");
      const res = await getUserById(id);
      this.discount = res.discount;
    },
    async getCartesByUserId() {
      this.cartArr = await getCartes();
    },
    handleCheckAllChange(val) {
      // val 为bool值
      this.checkedCartes = val ? this.cartArr : [];
      this.isIndeterminate = false;
      if (val) {
        this.countPrice = this.computeCartCountPrice(this.cartArr);
        this.discountPrice = (this.countPrice * this.discount).toFixed(2);
        this.selectCartArr = this.cartArr;
      } else {
        this.countPrice = 0;
        this.discountPrice = 0;
      }
    },
    handleCheckedCitiesChange(value) {
      this.countPrice = this.computeCartCountPrice(value);
      this.discountPrice = (this.countPrice * this.discount).toFixed(2);
      this.selectCartArr = value;

      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cartArr.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cartArr.length;
    },
    computeCartCountPrice(arr) {
      let count = 0;
      arr.forEach((item) => {
        count += item.price;
      });
      return count;
    },
    async deleteCartById(id) {
      await deleteCartById(id);
      this.$message.success("删除成功");
      this.getCartesByUserId();
    },
    open() {
      if (this.countPrice == 0) {
        this.$message.error("结算的金额不能是0");
        return;
      }

      this.$confirm(
        `请您确认订单的金额为${this.discountPrice}元, 是否支付?`,
        "提示",
        {
          confirmButtonText: "确认支付",
          cancelButtonText: "取消支付",
          type: "warning",
        }
      )
        .then(() => {
          this.saveOrders();
        })
        .catch(() => {
          this.$message.info("取消支付");
        });
    },
    async saveOrders() {
      const ordersArr = this.getHandleOrdersArr;
      await saveOrders(ordersArr);
      this.$message.success("支付成功");
      this.getCartesByUserId();
    },
  },
  computed: {
    // 将购物车的数据转变为订单的数据
    getHandleOrdersArr() {
      const arr = this.selectCartArr.map(item => {
        return {
          cartId: item.id,
          name: item.title,
          image: item.image,
          scheduleId: item.scheduleId,
          seatNumber: item.seatNumber,
          amount: item.price,
          startTime: item.startTime,
        }
      })
      return arr;
    },
  }
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
  /* color: rgb(194, 194, 196); */
}
.cartStyle {
  width: 100%;
  height: 120px;
  background-color: #fff;
  border: 1px solid rgb(234, 238, 243);
  font-size: 20px;
  display: flex;
}
</style>