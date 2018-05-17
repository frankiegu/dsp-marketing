<template>
  <div>
    <!-- 模板表格 -->
    <div class="search-table">
      <el-table border height="400" v-loading="template_loading" tooltip-effect="dark" style="width: 100%" :data="template_data">
        <el-table-column prop="id" label="编号" header-align="center" width="70"/>
        <el-table-column prop="dspTask.id" label="任务编号" header-align="center" width="100"/>
        <el-table-column prop="dspTask.taskName" label="任务名称" show-overflow-tooltip header-align="center"/>
        <el-table-column prop="name" label="模板名称" show-overflow-tooltip header-align="center" width="200"/>
        <el-table-column prop="type" :formatter="formatTemplateType" label="类型" header-align="center" width="70"/>
        <el-table-column prop="createTime" label="创建时间" header-align="center" width="170"/>
        <el-table-column prop="isActive" :formatter="formatActive" label="是否激活" header-align="center" width="100"/>
        <el-table-column label="操作" header-align="center" width="200">
          <template slot-scope="scope">
            <slot :row="scope.row"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

  import {queryTemplates,activeTemplate,forbiddenTemplate,deleteTemplate} from '@/api/marketingManage/subscribeTemplate-api';

  export default {
    name: "marketTaskTimerTemplate",
    computed: {
      template_query: function () {
        return {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          taskId: this.taskId,
        };
      },
    },
    data(){
      return {
        taskId: null,
        pageSize: 10,
        currentPage: 1,
        template_total: 0,
        template_loading: true,
        template_data:[],

      };
    },
    mounted(){
      this.$emit('created');
    },
    methods:{
      /**
       * 加载模板数据
       */
      loadTemplate(taskId){
        this.taskId = taskId;
        queryTemplates(this.template_query).then(data => {
          if(data.code === 1 && data.data){
            this.template_data = data.data;
            this.template_total = data.total;
          }else{
            this.template_data = [];
            this.template_total = 0;
          }
          this.template_loading = false;
        });
      },
      showDelete(templateId){
        this.$confirm('是否确认删除?','确认删除',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDelete(templateId);
        }).catch(() => {
        });
      },
      handleDelete(templateId){
        deleteTemplate(templateId).then(data => {
          if(data.code === 1){
            this.template_loading = true;
            this.$message({
              showClose: true,
              message: '删除成功!',
              type: 'success'
            });
            this.loadTemplate(this.taskId);
          }
        });
      },
      showActive(templateId){
        this.$confirm('是否确认激活?','确认激活',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleActive(templateId);
        }).catch(() => {
        });
      },
      handleActive(templateId){
        activeTemplate(templateId).then(data => {
          if(data.code === 1){
            this.template_loading = true;
            this.$message({
              showClose: true,
              message: '激活成功!',
              type: 'success'
            });
            this.loadTemplate(this.taskId);
          }
        });
      },
      showForbidden(templateId){
        this.$confirm('是否确认禁用?','确认禁用',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleForbidden(templateId);
        }).catch(() => {
        });
      },
      handleForbidden(templateId){
        forbiddenTemplate(templateId).then(data => {
          if(data.code === 1){
            this.template_loading = true;
            this.$message({
              showClose: true,
              message: '禁用成功!',
              type: 'success'
            });
            this.loadTemplate(this.taskId);
          }
        });
      },
      /**
       * 格式化模板类型
       */
      formatTemplateType(row, column, data){
        switch(data){
          case 'MOBILE':
            return '短信';
          case 'EMAIL':
            return '邮件';
          default:
            return '未知';
        }
      },
      formatActive(row, column, data){
        switch(data){
          case 1:
            return '已激活';
          case 0:
            return '未激活';
          default:
            return '未知';
        }
      }
    }
  }
</script>
