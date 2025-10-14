<template>
  <div id="home">
    <div class="echarts">
      <!-- 展示每部影片的票房 -->
      <HomeBarTicket v-if="filmList.length" :itemArr="handleFilmArr" :echartsOption="echartsOption"></HomeBarTicket>
      <!-- 展示每个月的销量 -->
      <HomeLine v-if="monthTicketList.length" :echartsOption="echartsOption" :itemArr="handleMonthTicketList">
      </HomeLine>
      <!-- 展示不同类型的影片的票房数  -->
      <HomePie v-if="boxOfficeList.length" :itemArr="handleBoxOfficeList"></HomePie>
      <HomeBarAmount v-if="amountList.length" :itemArr="handleMonthAmountList" :echartsOption="echartsOption">
      </HomeBarAmount>

    </div>

  </div>
</template>


<script>
import { getFilmBoxOfficeApi, getMonthTicketApi, getMonthAmountApi } from "@/api/orders";
import { getBoxOfficeByTypeApi } from "@/api/film";
import HomeBarTicket from "./components/HomeBarTicket.vue";
import HomePie from "./components/HomePie.vue";
import HomeLine from "./components/HomeLine.vue";
import HomeBarAmount from "./components/HomeBarAmount.vue";
export default {
  components: {
    HomeBarTicket,
    HomePie,
    HomeLine,
    HomeBarAmount
  },
  data() {
    return {
      filmList: [],
      monthTicketList: [],
      boxOfficeList: [],
      amountList: [],
      echartsOption: {
        title: {
          // 调整标题样式
          textStyle: {
            fontSize: 30,
            color: "black",
          },
          left: 20, // 调整标题的位置
          top: 20,
        },
        grid: {
          // 调整坐标轴的位置
          top: "20%",
          left: "5%",
          right: "6%",
          bottom: "3%",
          containLabel: true, // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false, // 关闭横坐标的刻度标记
          },
          axisLabel: {
            show: true, // 是否展示x轴文字
            interval: 0, // 使x轴文字全部显示
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true, // 显示y轴背景线
          },
          axisLine: {
            show: true
          }
        },

      }
    };
    // data底部
  },

  mounted() { },
  computed: {
    handleFilmArr() {
      return this.filmList.map((item) => {
        return {
          name: item.name,
          value: item.boxOffice * 100,
        };
      });
    },
    handleMonthTicketList() {
      return this.monthTicketList.map((item) => {
        return {
          name: +item.month.split("-")[1] + "月",
          value: item.ticketCount * 100
        };
      });
    },
    handleBoxOfficeList() {
      const that = this
      console.log(that)
      return this.boxOfficeList.map((item) => {
        return {
          name: that.$constant.filmTypeArr[item.type],
          value: item.totalBoxOffice * 100,
        };
      });
    },
    handleMonthAmountList() {
      return this.amountList.map((item) => {
        return {
          name: +item.month.split("-")[1] + "月",
          value: item.totalAmount
        };
      });
    },

  },
  created() {
    this.getFilmBoxOffice();
    this.getMonthTicket();
    this.getBoxOfficeByType();
    this.getMonthAmount();
  },
  methods: {
    async getFilmBoxOffice() {
      this.filmList = await getFilmBoxOfficeApi();
      this.filmList.sort((a, b) => b.boxOffice - a.boxOffice)
      console.log(this.filmList);
    },
    async getMonthTicket() {
      this.monthTicketList = await getMonthTicketApi();
      console.log(this.monthTicketList);
    },
    async getBoxOfficeByType() {
      this.boxOfficeList = await getBoxOfficeByTypeApi();
      console.log(this.boxOfficeList);
    },
    async getMonthAmount() {
      this.amountList = await getMonthAmountApi();
      console.log(this.amountList);
    },
  },
};
</script>

<style scoped lang="scss">
#home {
  padding: 10px;

  .echarts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    place-items: center;
    gap: 40px;
    padding: 30px 0;
  }
}
</style>
