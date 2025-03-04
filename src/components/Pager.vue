<template>
   <div
      class="block"
      style="margin-top: 10px"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
</template>

<script>
export default {
  props: {
    pageNo: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    pageSizes: {
      type: Array,
      default: () => [2,5,10,20]
    }
  },
  data(){
    return {

    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(val);

      this.$emit('changePageSize',val)
    },
    handleCurrentChange(val) {
      console.log(val);

      this.$emit('changePageNo',val)
    },
  }
}
</script>
