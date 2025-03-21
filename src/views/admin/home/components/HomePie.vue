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
      default: () => [],
    },
  },
  data() {
    return {
      echartsInstance: {},
    };
  },
  mounted() {
    this.initEcharts();
    this.updateCharts();
  },
  methods: {
    initEcharts() {
      this.echartsInstance = this.$echarts.init(this.$refs.pieRef);
      // console.log(echartsInstance, "***");
      const option = {
        title: {
          text: "不同类型影片票房占比",
          // left: "left",
          textStyle: {
            fontSize: 30,
            color: "black",
          },
          left: 20, // 调整标题的位置
          top: 20,
        },
        tooltip: {},
        legend: {
          orient: "vertical",
          left: "right",
          padding: 20,
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "60%",
            top: "40",
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              show: true,
              formatter: (data) =>
                `${data.name} ${data.value}\n(${data.percent.toFixed(1)}%)`,
            },
          },
        ],
      };
      this.echartsInstance.setOption(option);
    },
    updateCharts() {
      const option = {
        series: [
          {
            data: this.itemArr,
          },
        ],
      };
      this.echartsInstance.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
