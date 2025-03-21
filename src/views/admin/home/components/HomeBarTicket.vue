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
      startValue: 0, // 表示默认展示6条数据
      endValue: 3,
    };
  },

  created() {
    this.currentIndex = 3;
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
        title: {...this.echartsOption.title,text: '影片票房统计'},
        grid: this.echartsOption.grid,
        xAxis: this.echartsOption.xAxis,
        yAxis: this.echartsOption.yAxis,
        series: [
          {
            type: "bar",
            barWidth: 66,
            label: {
              show: true, // 展示每根柱子的value值
              position: "top", // 调整value值的方向
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
            return `影片名：${arg.name}<br />票房：${arg.data}`;
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
      const xAxisData = this.itemArr.map((item) => item.name);
      const yAxisData = this.itemArr.map((item) => item.value);

      const option = {
        xAxis: {
          data: xAxisData,
        },
        dataZoom: [
          // 滑动条，实现平移效果
          {
            show: false, // 不展示滑动条
            startValue: this.startValue, // 区域起始点（0）
            endValue: this.endValue, // 区域终止点
          },
        ],
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
        this.endValue++;
        if (this.endValue > this.itemArr.length - 1) {
          this.startValue = 0;
          this.endValue = 3;
        }
        this.updateCharts();
      }, 2000);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
