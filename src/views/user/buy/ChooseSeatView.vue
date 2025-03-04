<template>
  <div
    id="seat"
    style="text-align: left;"
  >
    <el-steps
      :active="2"
      style="margin: auto;width: 80%;margin-top: 30px;"
    >
      <el-step
        title="步骤 1"
        description="选择电影场次"
      ></el-step>
      <el-step
        title="步骤 2"
        description="选择座位号"
      ></el-step>
      <el-step
        title="步骤 3"
        description="加入购物车并在15分钟内付款"
      ></el-step>
      <el-step
        title="步骤 4"
        description="结算付款"
      ></el-step>
    </el-steps>

    <div class="left">
      <div style="width: 100%;">
        <img
          :src="filmSchedule.image"
          width="150px"
          style="float: left;"
        >
        <div style="width: 55%;float: left;padding-left: 20px;">
          <h2>{{ filmSchedule.title }}</h2>
          <p>
            <span>类型：</span>{{ typeArr[filmSchedule.filmType] }}
          </p>
          <p>
            <span>地区：</span>{{ regionArr[filmSchedule.region] }}
          </p>
          <p>
            <span>时长：</span>{{ filmSchedule.duration }} 分钟
          </p>
          <p>
            <span>放映：</span>{{ filmSchedule.scheduleType }}D 放映
          </p>
        </div>
      </div>

      <p style="color: red">
        <span>开场：</span>
        {{ filmSchedule.startTime }}
      </p>
      <p>
        <span>散场：</span>{{ filmSchedule.endTime }}
      </p>
      <p>
        <span>票价：</span>￥{{ filmSchedule.price }}/张
      </p>
      <hr>
      <p>
        <span style="color: black">已选座位：</span>
        <el-tag
          type="success"
          style="color: red;width: 50px;margin-left: 10px;margin-top: 10px"
          v-for="item in seatNumberArr"
        >
          {{ item }}号
        </el-tag>
      </p>
      <p style="color: red;font-size: 24px">
        <span style="color: black;font-size: 14px">总计：</span>￥{{ countPrice }}
      </p>
      <hr>
      <el-input
        v-model="phone"
        autocomplete="off"
        placeholder="请输入手机号"
        style="width: 200px;margin: 10px 0"
      ></el-input>
      <br>
      <el-button
        type="danger"
        @click="saveCart()"
        style="width: 200px;margin-right: 20px;border-radius: 40px;"
      >
        加入购物车
      </el-button>

    </div>

    <div
      class="right"
      style="text-align: center;"
    >
      <div style="width: 90%;margin: auto">
        <div style="height: 60px;line-height: 60px;">
          <span style="display: inline-block;width: 35px;height: 35px;
              line-height: 35px;text-align: center;
              background-color:white;vertical-align: middle;">
          </span>
          可选
          <span style="display: inline-block;width: 35px;height: 35px;
              background: orange;line-height: 35px;text-align: center;
              vertical-align: middle;margin-left: 20px;">
          </span>
          其他用户已选
          <span style="display: inline-block;width: 35px;height: 35px;
              background: green;line-height: 35px;text-align: center;
              vertical-align: middle;margin-left: 20px;">
          </span>
          当前用户已选
          <span class="common cartSeat">
          </span>
          已加入购物车
          <span class="common selledSeat">
          </span>
          已售
        </div>
        <div style="width: 100%;height: 30px;">
          <img
            :src="require('@/assets/screen.png')"
            width="100%"
          >
        </div>
        <p style="margin-top: 30px">银幕中央</p>

        <el-row style="margin-top: 50px;margin-left: 40px">
          <el-col
            v-for="(row, rowIndex) in seats"
            :key="rowIndex"
          >
            <el-col
              v-for="(seat, seatIndex) in row"
              :key="seatIndex"
              style="width: 60px;float: left;margin-bottom: 20px;"
            >
              <span
                v-if="seat.status===3"
                @click="$message.error('不能选择已售座位')"
                class="common selledSeat"
              >
                {{ seat.number }}
              </span>
              <span
                v-else-if="seat.status===2 && seat.isCurrentUser === 1"
                @click="$message.error('不能选择已加入购物车的座位')"
                class="common cartSeat"
              >
                {{ seat.number }}
              </span>
              <span
                v-else-if="seat.status===1 && seat.isCurrentUser === 1"
                @click="cancelSeat(rowIndex,seatIndex)"
                class="common isSelected"
              >
                {{ seat.number }}
              </span>

              <span
                v-else-if="(seat.status===1 || seat.status===2) && seat.isCurrentUser === 0"
                @click="$message.error('不能选择其他用户已选择的座位')"
                class="common isOtherUserSelected"
              >
                {{ seat.number }}
              </span>

              <span
                v-else-if="seat.status === 0"
                @click="selectSeat(rowIndex, seatIndex)"
                class="common noSelected"
              >

                {{ seat.number }}

              </span>

              <!-- <span
                v-if="seat.selected"
                @click="cancelSelectSeat(rowIndex, seatIndex)"
                class="common isSelected"
              >

                {{ seat.number }}

              </span> -->

            </el-col>
          </el-col>
        </el-row>

      </div>

    </div>
  </div>
</template>

<script>
import { getFilmAndScheduleById } from "@/api/schedule";
import { getSeatsByScheduleId, deleteSeatById } from "@/api/seat";
import { addCart } from "@/api/cart";
export default {
  data() {
    return {
      id: "", // 排片的id
      userId: "",
      filmSchedule: {
        // filmId: 3,
        // scheduleId: 2,
        // title: "荒野机器人",
        // image: require("E:\\img\\电影管理系统图片\\2.jpg"),
        // filmType: 0,
        // region: 0,
        // duration: 120,
        // scheduleType: 2,
        // startTime: "2024-09-24 08:00:00",
        // endTime: "2024-09-24 10:00:00",
        // price: 33,
        // seatCount: 40, // 座位数
      },
      typeArr: this.$constant.filmTypeArr,
      regionArr: this.$constant.regionArr,
      countPrice: 0, // 总价
      seats: [[]], // 存放初始化时的座位数组
      seatNumberArr: [], // 存放当前用户已选的座位信息
      phone: "",
      // path: "ws://47.96.128.212:8080/chooseSeat",
      path: "ws://localhost:8080/chooseSeat",
      seatArr: [], // 存放的是服务器传递过来的座位信息
    };
  },
  created() {
    this.id = this.$route.query.id; // 获取排片的id
    this.userId = this.$store.getters.userId; // 获取用户的id
    this.path += `/${this.id}`; // 用于将排片id传到服务器端
    this.init(); // 初始化影片排片信息和座位数
  },
  watch: {
    phone(newVal,oldVal){
      console.log(newVal,oldVal)
    }
  },
  methods: {
    initSeats() {
      let j = 0,
        i = 0;
      let a = [];
      a[0] = new Array();
      for (let k = 1; k <= this.filmSchedule.seatCount; k++) {
        let seat = {
          number: k,
          status: 0, // 0表示座位未选中,1表示已选中，2表示已售卖
          isCurrentUser: 0, // 1表示是当前用户，0表示不是当前用户
        };

        a[j][i] = seat;
        i++;
        if (k % 12 == 0) {
          // 12个座位为一行
          j++;
          i = 0;
          a[j] = new Array();
        }
      }
      this.seats = a;
    },
    initWebSocket() {
      // 实例化socket，这里的实例化直接赋值给this.ws是为了后面可以在其它的函数中也能调用websocket方法，例如：this.ws.close(); 完成通信后关闭WebSocket连接
      this.ws = new WebSocket(this.path);

      //监听是否连接成功
      this.ws.onopen = () => {
        if (this.ws.readyState == 1) {
          console.log("ws连接成功");
        }
        //连接成功则发送一个数据
      };
      //接听服务器发回的信息并处理展示
      this.ws.onmessage = (res) => {
        this.seatArr = JSON.parse(res.data); // 传递的是字符串对象，需要转换成js对象
        console.log(`接收到自服务器传递的数据长度:${this.seatArr.length}`);
        this.initSeats();
        this.updateSeatStatus();
      };
      //监听连接关闭事件
      this.ws.onclose = () => {
        //监听整个过程中websocket的状态
        // console.log("ws连接状态：" + this.ws.readyState);
      };

      //监听并处理error事件
      this.ws.onerror = function (error) {
        console.log(error);
      };
    },
    sendMessage(data) {
      // 将数据传递给服务器
      this.ws.send(data);
    },
    updateSeatStatus() {
      // 更新座位的状态和计算选中的座位
      this.seats.forEach((arr) => {
        arr.forEach((item) => {
          this.seatArr.forEach((seat) => {
            // 修改座位的状态
            if (item.number === seat.number) {
              item.status = seat.status;
              if (seat.userId == this.userId) {
                item.isCurrentUser = 1;
              }
              return; // 跳出本次循环
            }
          });
        });
      });
      // 将选中的座位存入到选中座位数组中
      this.calculateSeats();
    },
    async init() {
      this.initWebSocket(); // 初始化websocket
      this.filmSchedule = await getFilmAndScheduleById({
        scheduleId: this.id,
      });
      this.initSeats(); // 初始化座位数
      this.updateSeatArr();
    },
    // 获取用户已选的座位并进行状态更新
    async updateSeatArr(){
      this.seatArr = await getSeatsByScheduleId({
        scheduleId: this.id,
      });
      this.updateSeatStatus();
    },
    async saveCart() {
      if (this.seatNumberArr.length == 0) {
        this.$message.error("请选择座位");
        return;
      }
      if (!this.phone || this.phone.length != 11) {
        this.$message.error("请输入11位的电话号码");
        return;
      }
      const film = this.filmSchedule;
      const cart = {
        scheduleId: this.id,
        title: film.title,
        image: film.image,
        price: film.price,
        seatNumber: this.seatNumberArr,
        phone: this.phone,
        startTime: film.startTime,
      };
      await addCart(cart);
      this.$message.success("加入购物车成功");
      this.updateSeatArr();
      setTimeout(() => {
        this.$message.info("请在15分钟内完成付款哦");
      }, 1000); // 延迟1秒
    },
    // 用户选择座位时执行该方法
    selectSeat(rowIndex, seatIndex) {
      this.seats[rowIndex][seatIndex].status = 1;
      const seat = {
        number: this.seats[rowIndex][seatIndex].number,
        scheduleId: this.id,
        status: 1, // 表示座位已选中
        userId: this.userId,
      };
      this.sendMessage(JSON.stringify(seat)); // 传递json格式的字符串
    },
    // 用户取消座位时执行该方法
    async cancelSeat(rowIndex, seatIndex) {
      this.seats[rowIndex][seatIndex].status = 0;
      await deleteSeatById({
        scheduleId: this.id,
        number: this.seats[rowIndex][seatIndex].number,
      });
    },

    calculateSeats() {
      let selectingArr = [];
      this.seats.forEach((arr) => {
        arr.forEach((item) => {
          if (item.status == 1 && item.isCurrentUser == 1) {
            // 当前用户正在选择的座位
            selectingArr.push(item.number);
          }
        });
      });
      this.seatNumberArr = selectingArr;
      // 计算总的价格
      this.countPrice = selectingArr.length * this.filmSchedule.price;
    },
  },
};
</script>



<style scoped>
#seat {
  width: 1400px;
  height: 100vh;
  margin: auto;
  background-color: rgb(234, 238, 243);
}
.left {
  width: 28%;
  /* height: 600px; */
  background-color: rgb(250, 248, 251);
  float: left;
  margin-left: 3%;
  padding: 20px;
}
.right {
  width: 65%;
  height: 600px;
  float: left;
}
.left p span {
  color: rgb(185, 183, 186);
}
/deep/ .el-input__inner {
  border-radius: 40px;
}

.common {
  display: inline-block;
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  vertical-align: middle;
}
.noSelected {
  background: #fff;
  color: rgb(184, 183, 186);
}
.isSelected {
  background: green;
  color: white;
}
.isOtherUserSelected {
  background: orange;
  color: white;
}
.cartSeat {
  background: #409eff;
  color: white;
}
.selledSeat {
  background: red;
  color: white;
}
</style>
