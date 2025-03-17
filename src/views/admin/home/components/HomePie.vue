<template>
  <div
    class="pie"
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
          text: "饼状图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "好好好",
            type: "pie",
            radius: "60%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
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
