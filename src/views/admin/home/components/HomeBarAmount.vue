<template>
  <div
    class="common-echarts "
    ref="barRef"
  >
  </div>
</template>
<script>
export default {
  name: "",
  props: {
    type: {
      type: String,
      default: "bar",
    },
    itemArr: {
      type: Array,
      default: () => [],
    },
    echartsOption: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      echartsInstance: "",
      timer: {},
      startValue: 0,
    };
  },

  mounted() {
    this.initEcharts();
    this.updateCharts();
    this.startInterval();
  },
  computed: {},
  beforeDestroy() {
    // 在页面销毁的时候，清除定时器
    clearInterval(this.timer);
  },
  methods: {
    initEcharts() {
      // 初始化图表对象
      this.echartsInstance = this.$echarts.init(this.$refs.barRef, "light");
      const initOption = {
        title: {...this.echartsOption.title,text: '每月销售额统计'},
        grid: this.echartsOption.grid,
        xAxis: this.echartsOption.yAxis,
        yAxis: this.echartsOption.xAxis,
        series: [
          {
            type: "bar",
            barWidth: 66,
            label: {
              show: true, // 展示每根柱子的value值
              position: "right", // 调整value值的方向
              textStyle: {
                color: "black", // 设置颜色
              },
            },
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0], // 设置柱子的圆角（左上角、右上角、右下角、左下角）
            },

          },
        ],
        tooltip: {
          // 当鼠标移动到柱子时显示文字
          trigger: "item",
          formatter: (arg) => {
            return `月份：${arg.name}<br />金额：${arg.data}元`;
          },
          axisPointer: {
            type: "shadow",
          },
        },
      };
      this.echartsInstance.setOption(initOption);
      // 当鼠标移入该图标，需要清除定时器
      this.echartsInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      // 当鼠标离开时，又重新开启定时器
      this.echartsInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    updateCharts() {
      const arr = this.itemArr.slice(this.startValue*4,this.startValue*4+4)
      const xAxisData = arr.map((item) => item.name);
      const yAxisData = arr.map((item) => item.value);
      const option = {
        yAxis: {
          data: xAxisData,
        },
        // dataZoom: [
        //   // 滑动条，实现平移效果
        //   {
        //     show: false, // 不展示滑动条
        //     startValue: this.startValue, // 区域起始点（0）
        //     endValue: this.endValue, // 区域终止点
        //   },
        // ],
        series: [
          {
            data: yAxisData,
          },
        ],
      };
      this.echartsInstance.setOption(option);
    },
    startInterval() {
      // 在启动定时器之前，先判断有没有定时器
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.startValue++;
        if (this.startValue * 4 >= this.itemArr.length) {
          this.startValue = 0;
        }
        this.updateCharts();
      }, 3000);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
