<template>
  <div
    class="common-echarts"
    ref="lineRef"
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
    return {
      echartsInstance: {}
    };
  },
  mounted() {
    this.initEcharts();
    this.updateCharts()
  },
  methods: {
    initEcharts() {
      this.echartsInstance = this.$echarts.init(this.$refs.lineRef);
      // console.log(echartsInstance, "***");
      const option = {
        title: {
          text: '每月售票量统计',
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
            interval: 0 // 使x轴文字全部显示
          }
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "line",
            label: {
              show: true
            }
          },
        ],
        tooltip: {
          // 当鼠标移动到柱子时显示文字
          trigger: "item",
          formatter: (arg) => {
            return `月份：${arg.name}<br />售票量：${arg.data}`;
          },
        },
      };
      this.echartsInstance.setOption(option);
    },
    updateCharts(){
      const xAxisData = this.itemArr.map((item) => item.name);
      const yAxisData = this.itemArr.map((item) => item.value);
      const option = {
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            data: yAxisData,
          },
        ],
      };
      this.echartsInstance.setOption(option)
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
