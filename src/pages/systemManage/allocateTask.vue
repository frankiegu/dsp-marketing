<template>
  <div class="subscribe-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
            <el-input class="search-key" v-model="task_query.taskName" :maxlength="20" placeholder="任务名称"/>
            <el-button class="search-add" type="success" @click="loadTask">查询</el-button>
        </div>
        <div class="search-table">
          <el-table border height="400" v-loading="task_loading" tooltip-effect="dark" style="width: 100%" :data="task_data">
            <el-table-column prop="id" label="编号" header-align="center" width="70"/>
            <el-table-column prop="taskName" label="任务名称" header-align="center"/>
            <el-table-column label="操作" header-align="center" width="150">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="initSelect(scope.row)">分配任务</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="search-page">
          <el-pagination
            @size-change="taskSizeChange"
            @current-change="taskCurrentChange"
            :current-page="task_query.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="task_query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="task_total"/>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="任务分配" :visible.sync="allocate_show" size="small">
      <el-transfer
        style="padding-left: 90px;"
        v-model="selected_task.orgList"
        :data="organizations"
        :titles="['组织列表', '已分配']"/>
      <div slot="footer" style="text-align: right">
        <el-button type="danger" class="search-add" @click="handleAllocate">确定</el-button>
        <el-button type="success" class="search-add" @click="allocate_show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryTasks } from '@/api/marketingManage/subscribeTemplate-api';
  import { orgList,allocateTask } from '@/api/system-api';

  export default {
    name: "allocate-task",
    data() {
      return {
        task_data: [],
        selected_data: {},
        task_query:{
          pageSize: 10,
          currentPage: 1,
          taskName: null
        },
        task_total: 0,
        task_loading: true,

        organization_data: [],
        organization_query:{
          pageSize: 1,
          pageIndex: 1
        },
        allocate_show:false,
        selected_task:{
          taskId: null,
          orgList: []
        }
      };
    },
    computed:{
      organizations: function () {
        let result = [];
        this.organization_data.forEach(item => {
          let disabled = false;
          this.selected_data.orgList.forEach(org => {
            if(org.isCreate && org.orgId === item.id){
              disabled = true;
            }
          });
          let temp = {
            key: item.id,
            label: item.name + "【" + item.code + "】",
            disabled: disabled
          };
          result.push(temp);
        });
        return result;
      },
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
      /**
       * 任务表格每页数量改变
       */
      taskSizeChange(pageSize){
        this.task_query.pageSize = pageSize;
        this.task_query.currentPage = 1;
        this.task_loading = true;
        this.loadTask();
      },
      /**
       * 任务表格当前页改变
       */
      taskCurrentChange(currentPage){
        this.task_query.currentPage = currentPage;
        this.task_loading = true;
        this.loadTask();
      },
      loadOrganization(){
        orgList(this.organization_query).then((one)=>{
          if(one.code === 1){
            this.organization_query.pageSize = one.total;
            orgList(this.organization_query).then((data) => {
              if(one.code === 1){
                this.organization_data = data.data;
              }
            });
          }
        });
      },
      initSelect(row){
        this.selected_data = row;
        this.loadOrganization();
        this.selected_task.taskId = row.id;
        this.selected_task.orgList = [];
        if(row.orgList){
          row.orgList.forEach(org => {
            this.selected_task.orgList.push(org.orgId);
          });
        }
        this.allocate_show = true;
      },
      handleAllocate(){
        allocateTask(this.selected_task).then(data => {
          if(data.code === 1){
            this.allocate_show = false;
            this.loadTask();
            this.$message({
              showClose: true,
              message: '分配成功!',
              type: 'success'
            });
          }
        });
      },
    },
    created(){
      this.loadTask();
    }
  }
</script>
