<template>
  <div
    class="common-echarts"
    ref="pieRef"
  >
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    type: {
      type: String,
      default: "pie",
    },
    itemArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      const echartsInstance = this.$echarts.init(this.$refs.pieRef);
      // console.log(echartsInstance, "***");
      const option = {
        title: {
          text: "不同类型影片票房统计",
          // left: "left",
          textStyle: {
            fontSize: 30,
            color: "black",
          },
          left: 20, // 调整标题的位置
          top: 20,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
          padding: 20
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "60%",
            data: this.itemArr,
            top: '40',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      echartsInstance.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.pie {
  width: 500px;
  height: 500px;
  border: 1px solid black;
}
</style>
