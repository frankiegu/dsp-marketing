<template>
    <div class="task-progress-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" :maxlength="25" placeholder="请输入关键字"></el-input>
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              format="yyyy-MM-dd"
              range-separator=" -- "
              :picker-options="pickerOptions" @change="handleChange">
            </el-date-picker>
            <el-button type="button" class="search-btn" @click="handleSearch">查询</el-button>
          </div>
          <div class="search-table">
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              :data="tableData"
              height="400"
              border
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="dsname" label="数据源名" width="220" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="hiveName" label="表名" width="200" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="operator" label="创建人" width="120"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
              <el-table-column prop="result" label="结果" show-overflow-tooltip></el-table-column>

            </el-table>
          </div>
          <div class="search-page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import { hiveList } from '@/api/dataManage/sourceData-api'
    export default {
        name: 'taskProgress',
        data () {
            return {
              searchData:{
                key:'',
                time:'',
                startTime:'',
                endTime:''
              },
              page:{
                pageSize:10,
                total:100,
                pageIndex: 1
              },
              loading:true,
              tableData: [],
              //日期处理
              pickerOptions: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }]
              }
            }
        },
        components: {},
        methods: {

          handleSearch(){
            this.list(10,1)
          },
          handleChange(val){
            this.searchData.startTime = val.split(' -- ')[0];
            this.searchData.endTime = val.split(' -- ')[1];
          },

          //表格模块
          list(pageSize,pageIndex){
            let _data={
              pageSize,
              pageIndex,
              startTime:this.searchData.startTime,
              endTime:this.searchData.endTime,
              dataSourceName:this.searchData.key
            };
            hiveList(_data).then((data)=>{
              if(data.code==1){
                this.tableData = data.data;
                this.page.total = data.total;
                this.page.pageIndex = data.currPage;
                this.loading = false
              }
            });
          },
          //分页模块
          handleSizeChange(pageSize) {
            this.list(pageSize,1);
          },
          handleCurrentChange(pageIndex) {
            this.list(this.page.pageSize,pageIndex);
          },
          //表格处理模块
          toggleSelection(rows) {
            if (rows) {
              rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
              });
            } else {
              this.$refs.multipleTable.clearSelection();
            }
          },
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },
        },
        computed: {

        },
        created() {
            this.list(10,1);
            this.$message.closeAll();
        }
    }
</script>

<style lang="scss">

</style>
