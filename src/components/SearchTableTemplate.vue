<template>
  <div id="tableTemplate">
    <div style="text-align: left;">
      <el-form
        ref="searchFormRef"
        v-if="showSearchForm"
        :model="searchForm"
        :inline="true"
        size="small"
      >
        <tamplate v-for="(item, index) in searchParamsList">
          <el-form-item :label="item.label" :prop="item.prop">
            <template v-if="item.type === 'input'">
              <el-input
                v-model="searchForm[item.prop]"
                :placeholder="item.placeholder"
                class="w190"
                clearable
              ></el-input>
            </template>

            <template v-if="item.type === 'select'">
              <el-select
                v-model.trim="searchForm[item.prop]"
                :filterable="item.filterable"
                :multiple="item.multiple"
                :collapse-tags="item.multiple"
                :placeholder="item.placeholder"
                class="w190"
                :style="item.style"
                :clearable="item.clearable === undefined || item.clearable"
                :prop="item.prop"
              >
                <el-option
                  v-for="(option,index) in item.options"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                  :prop="item.prop"
                ></el-option>
              </el-select>
            </template>

            <template v-if="item.type === 'datetime'">
              <el-date-picker
                v-model="searchForm[item.prop]"
                style="width: 190px"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </template>
            <template v-if="item.type === 'date'">
              <el-date-picker
                v-model="searchForm[item.prop]"
                style="width: 190px"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </template>
            <template v-if="item.type === 'searchSlot'">
              <slot
                name="searchSlot"
                :searchForm="searchForm"
                :itemProp="item.prop"
              ></slot>
            </template>
          </el-form-item>

        </tamplate>

        <el-button
          type="info"
          @click="pageQueryData"
          style="margin-left: 20px"
        >查询</el-button>
        <el-button
          type="info"
          @click="reset"
          style="margin-left: 20px"
        >重置</el-button>
        <!-- 具名插槽，用于插入新增等功能的按钮 -->
        <slot name="handle"></slot>
      </el-form>
    </div>
    <el-table
      :data="resultList"
      style="width: 100%"
    >
      <template v-for="item in tableParamsList">
        <el-table-column
          v-if="item.text"
          width="180"
          :label="item.label"
          :prop="item.prop"
        >
          <template slot-scope="scope">
            {{ item.text[scope.row[item.prop]] }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.isImage"
          width="180"
          :label="item.label"
          :prop="item.prop"
        >
          <template slot-scope="scope">
            <img
            :src="scope.row.image"
            height="120px"
          >
          </template>
        </el-table-column>
        <el-table-column
          v-else
          width="180"
          :label="item.label"
          :prop="item.prop"
        >
        </el-table-column>
      </template>

      <el-table-column
        label="操作"
        width="300"
      >

        <template
          slot-scope="scope"
          v-if="scope.row.username!='admin'"
        >
        <!-- 采用作用域插槽，存放查看，修改，删除等功能的按钮 -->
          <slot
            name="columnHandle"
            :row="scope.row"
            :index="scope.$index"
          ></slot>
        </template>
      </el-table-column>

    </el-table>
    <Pager
      :pageNo="pageParams.pager.pageNo"
      :pageSize="pageParams.pager.pageSize"
      :total="pageParams.total"
      @changePageSize="handleSizeChange"
      @changePageNo="handleCurrentChange"
    ></Pager>
  </div>
</template>

<script>
export default {
  name: 'SearchTableTemplate',
  components: {
    Pager: () => import("@/components/Pager.vue"),
  },
  props: {
    tableParamsList: {
      // 绑定表格的columns
      type: Array,
      default: () => [],
    },
    extraParams: {
      type: Object,
      default: () => {},
    },
    tableListApi: {
      // 分页查询api
      type: Function,
      default: null,
    },
    searchParamsList: {
      // 绑定条件查询
      type: Array,
      default: () => [],
    },
    showSearchForm: {
      // 是否展示条件查询表单
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pageParams: {
        pager: {
          pageNo: 1,
          pageSize: 5,
        },
        total: 0,
      },
      resultList: [],
      searchForm: {},
    };
  },
  created() {
    this.initSearchParams();
    this.pageQueryData();
  },
  methods: {
    async pageQueryData() {
      const res = await this.tableListApi({
        ...this.extraParams,
        ...this.pageParams.pager,
        ...this.searchForm
      });
      this.resultList = res.records;
      this.pageParams.total = res.total;
    },
    handleSizeChange(val) {
      this.pageParams.pager.pageSize = val;
      this.pageQueryData();
    },
    handleCurrentChange(val) {
      this.pageParams.pager.pageNo = val;
      this.pageQueryData();
    },
    initSearchParams() {
      this.searchParamsList.forEach((item) => {
        this.$set(this.searchForm, item.prop, undefined);
      });
      console.log(this.searchForm);
    },
    reset(){
      this.$refs['searchFormRef'].resetFields();
      this.pageParams.pager['pageNo'] = 1
      this.pageParams.pager['pageSize'] = 5

      this.pageQueryData()
    }
  },
};
</script>
