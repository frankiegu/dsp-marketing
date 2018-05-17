<template>
  <div>
    <div class="search-table">
      <el-table border height="400" v-loading="task_loading" tooltip-effect="dark" style="width: 100%" :data="task_data">
        <el-table-column prop="id" label="编号" width="120"/>
        <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip/>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <slot :taskId="scope.row.id"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="search-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="task_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { queryTasks } from '@/api/marketingManage/subscribeTemplate-api';

  export default {
    name: "market-task-timer-task",
    props: ['taskName'],
    computed: {
      task_query: function () {
        return {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          taskName: this.taskName
        };
      }
    },
    watch:{
      taskName: function () {
        this.loadTask();
      }
    },
    data(){
      return {
        task_data: [],
        task_total: 0,
        task_loading: true,
        pageSize: 10,
        currentPage: 1
      };
    },
    created(){
      this.task_loading = true;
      this.loadTask();
    },
    methods: {
      loadTask(){
        queryTasks(this.task_query).then(data => {
          if(data.code === 1 && data.data){
            this.task_data = data.data;
            this.task_total = data.total;
          }else{
            this.task_data = [];
            this.task_total = 0;
          }
          this.task_loading = false;
        });
      },
      handleSizeChange(pageSize){
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.loadTask();
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.task_loading = true;
        this.loadTask();
      }
    }
  }
</script>
