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
            style="width: 100%;height: 120px;
          background-color: #fff;
          border: 1px solid rgb(234, 238, 243);
          font-size: 20px"
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
              style="vertical-align: middle;float: left"
            >
            <div
              style="width: 60%;height: 90%;float: left;margin: 0 20px;"
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
            <div style="width: 20%;height: 100%;float: left;line-height: 120px;color: red">
              <span style="width: 100px;display: inline-block">
                ￥ {{ cart.price }}
              </span>
              <el-button
                type="danger"
                icon="el-icon-delete"
                style="margin-left: 10%;"
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
      countPrice: 0,
      selectCartArr: [],
      ordersArr: [],
      discount: 1,
      discountPrice: 0,
    };
  },
  created() {
    this.getCartesByUserId();
    this.getUserDiscount();
  },
  methods: {
    getUserDiscount() {
      const id = localStorage.getItem("id");
      getUserById(id).then((res) => {
        if (res.data.code === 1) {
          this.discount = res.data.data.discount;
        }
      });
    },
    getCartesByUserId() {
      this.$http.get("/cart/list").then((res) => {
        if (res.data.code === 1) {
          this.cartArr = res.data.data;
        }
      });
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
      for (let k in arr) {
        count += arr[k].price;
      }
      return count;
    },
    deleteCartById(id) {
      this.$http.delete(`/cart/${id}`).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("删除成功");
          this.getCartesByUserId();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    open() {
      if (this.countPrice == 0) {
        this.$message.error("结算的金额不能是0");
        return;
      }
      
      this.$confirm(`请您确认订单的金额为${this.discountPrice}元, 是否支付?`, "提示", {
        confirmButtonText: "确认支付",
        cancelButtonText: "取消支付",
        type: "warning",
      })
        .then(() => {
          this.saveOrders();
        })
        .catch(() => {
          this.$message.info("取消支付");
        });
    },
    saveOrders() {
      this.handleOrdersArr();
      this.$http.post("/order/save", this.ordersArr).then((res) => {
        if (res.data.code === 1) {
          this.$message.success("支付成功");
          this.getCartesByUserId();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleOrdersArr() {
      let arr = [],
        cartArr = this.selectCartArr;
      for (let k in cartArr) {
        let cart = cartArr[k];
        let orders = {
          cartId: cart.id,
          name: cart.title,
          image: cart.image,
          scheduleId: cart.scheduleId,
          seatNumber: cart.seatNumber,
          amount: cart.price,
          startTime: cart.startTime
        };
        arr.push(orders);
      }
      this.ordersArr = arr;
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
  /* color: rgb(194, 194, 196); */
}
</style>