<template>
  <div
    class="bar"
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
  },
  data() {
    return {};
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      const echartsInstance = this.$echarts.init(this.$refs.barRef);
      // console.log(echartsInstance, "***");
      const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: this.type,
          },
        ],
        tooltip: {
          trigger: "item",
        },
      };
      echartsInstance.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.bar {
  width: 500px;
  height: 500px;
  border: 1px solid black;
}
</style>
