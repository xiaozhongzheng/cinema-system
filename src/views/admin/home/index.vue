<template>
  <div
    style="padding: 20px 10px 100px 10px"
    id="home"
  >
    <div class="echarts">
      <!-- 展示每部影片的票房 -->
      <HomeBar
        v-if="filmArr.length"
        :itemArr="handleFilmArr"
        type="bar"
      ></HomeBar>
      <!-- 展示每个月的销量 -->
      <HomeLine v-if="monthTicketList.length" :itemArr="handleMonthTicketList"></HomeLine>
      <!-- 展示不同类型的影片的票房数  -->
      <HomePie v-if="boxOfficeList.length" :itemArr="handleBoxOfficeList"></HomePie>
    </div>

  </div>
</template>


<script>
import { getFilmBoxOfficeApi,getMonthTicketApi } from "@/api/orders";
import { getBoxOfficeByTypeApi } from "@/api/film";
import HomeBar from "./components/HomeBar.vue";
import HomePie from "./components/HomePie.vue";
import HomeLine from "./components/HomeLine.vue";

export default {
  components: {
    HomeBar,
    HomePie,
    HomeLine
  },
  data() {
    return {
      filmArr: [],
      monthTicketList: [],
      boxOfficeList: []
    };
    // data底部
  },

  mounted() {},
  computed: {
    handleFilmArr() {
      return this.filmArr.map((item) => {
        return {
          name: item.name,
          value: item.boxOffice * 100,
        };
      });
    },
    handleMonthTicketList(){
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
  },
  created() {
    this.getFilmBoxOffice();
    this.getMonthTicket();
    this.getBoxOfficeByType()
  },
  methods: {
    async getFilmBoxOffice() {
      this.filmArr = await getFilmBoxOfficeApi();
      console.log(this.filmArr);
    },
    async getMonthTicket() {
      this.monthTicketList = await getMonthTicketApi();
      console.log(this.monthTicketList);
    },
    async getBoxOfficeByType() {
      this.boxOfficeList = await getBoxOfficeByTypeApi();
      console.log(this.boxOfficeList);
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
