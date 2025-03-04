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
          <el-form-item :label="item.label" >
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
              >
                <el-option
                  v-for="(option,index) in item.options"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
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
          @click="pageQueryEmployee"
          style="margin-left: 20px"
        >查询</el-button>
        <el-button
          type="info"
          @click="reset"
          style="margin-left: 20px"
        >重置</el-button>
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
          v-else
          width="180"
          :label="item.label"
          :prop="item.prop"
        >
        </el-table-column>
      </template>

      <!-- <el-table-column label="身份">
        <template slot-scope="scope">
          {{ scope.row.roleId == 1 ? '员工' : '管理员' }}
        </template>
      </el-table-column>
      <el-table-column label="账号状态">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '启用' : '禁用' }}
        </template>
      </el-table-column> -->

      <el-table-column
        label="操作"
        width="300"
      >

        <template
          slot-scope="scope"
          v-if="scope.row.username!='admin'"
        >
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
    this.pageQueryEmployee();
  },
  methods: {
    async pageQueryEmployee() {
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
      this.pageQueryEmployee();
    },
    handleCurrentChange(val) {
      this.pageParams.pager.pageNo = val;
      this.pageQueryEmployee();
    },
    initSearchParams() {
      this.searchParamsList.forEach((item) => {
        this.$set(this.searchForm, item.prop, undefined);
      });
      console.log(this.searchForm);
    },
    reset(){
      this.$refs['searchFormRef'].resetFields();
    }
  },
};
</script>
