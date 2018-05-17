<template>
  <div class="market-task-timer-container">
    <div class="search-table">
      <el-table border height="400" v-loading="timer_loading" tooltip-effect="dark" style="width: 100%" :data="tableData">
        <el-table-column prop="id" label="编号" header-align="center" width="80"/>
        <el-table-column prop="commitTime" label="提交时间" header-align="center" width="150"/>
        <el-table-column prop="executeDesc" label="循环规则" header-align="center"/>
        <el-table-column prop="executeDate" header-align="center" label="初次执行日期" width="130"/>
        <el-table-column prop="executeTime" header-align="center" label="初次执行时间" width="130"/>
        <el-table-column prop="lastExecuteTime" header-align="center" label="最后执行时间" width="150"/>
        <el-table-column prop="statusDesc" header-align="center" label="执行状态" width="100"/>
        <el-table-column label="操作" header-align="center" width="380">
          <template slot-scope="scope">
            <slot :row="scope.row"/>
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
        :total="timer_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { manageList,executeTaskParams,cancelBatch,updateBatch,subscribeMobile,subscribeMail } from '@/api/marketingManage/marketTask-api';
  import { templeteList } from '@/api/smsManagement/smsPassageway-api';
  import { descriptionList } from '@/api/smsManagement/smsChannel-api';
  import { mapState } from 'vuex';
  import store from '@/vuex/store';

  export default {
    name: "market-task-timer-timer",
    computed:{
      timer_query: function () {
        return {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          taskId: this.taskId
        };
      },
      ...mapState({
        socketData: state=>state.socket.message
      })
    },
    data() {
      return {
        taskId: null,
        pageSize: 10,
        timer_total: 0,
        currentPage: 1,
        timer_loading: true,
        tableData:[]
      };
    },
    created() {
      this.websocketSubscribe();
    },
    mounted(){
      this.$emit('created');
    },
    watch:{
      socketData(val,old){
        if(val){
          if(val.type === 'DATASOURCE_BATCH'){
            if(val.code === 1){
              this.tableData.forEach((item,index) => {
                if(item.id === val.data.taskManageDto.id){
                  let newData = val.data.taskManageDto;
                  newData.statusDesc = this.convertDesc(newData.status);
                  this.tableData.splice(index,1,newData);
                }
              });
            }else{
              this.$nextTick(()=>{
                this.$message({
                  showClose: true,
                  message: val.msg,
                  type: 'error'
                });
              });
            }
          }
        }
      }
    },
    methods: {
      websocketSubscribe(){
        let _data_ = {
          "type": "DATASOURCE_BATCH",
          "data": {
            orgId: store.state.user.userInfo.orgId
          }
        };
        this.$socket.emit('request',JSON.stringify(_data_));
      },
      loadTimer(taskId){
        this.taskId = taskId;
        manageList(this.timer_query).then((data)=>{
          if(data.code === 1){
            data.data.forEach(element => {
              element.statusDesc = this.convertDesc(element.status);
            });
            this.tableData = data.data;
            this.timer_total = data.total;
            this.timer_loading = false
          }
        });
      },
      convertDesc(status){
        let statusDesc;
        switch(status){
          case '4':
            statusDesc='未执行';
            break;
          case '3':
            statusDesc='执行中';
            break;
          case '1':
            statusDesc='已完成';
            break;
          case '2':
            statusDesc='已取消';
            break;
          default:
            statusDesc='未知';
            break;
        }
        return statusDesc;
      },
      handleSizeChange(pageSize){
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.timer_loading = true;
        this.loadTimer(this.taskId);
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.timer_loading = true;
        this.loadTimer(this.taskId);
      },
      showCancel(id){
        this.$confirm('是否确认取消?','确认取消',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleCancel(id);
        }).catch(() => {
        });
      },
      handleCancel(id){
        this.$message({
          showClose: true,
          message: '执行操作中,请稍等...',
          type: 'success'
        });
        cancelBatch(id).then(data=>{
          if(data.code===1){
            this.$message({
              showClose: true,
              message: '任务取消成功!',
              type: 'success'
            });
            this.loadTimer(this.taskId);
          }
        });
      },
      subscribe(batchId){
        if(!(sessionStorage.getItem('userMobile')&&sessionStorage.getItem('userMobile').length === 11)){
          this.$message({
            type: 'error',
            message: '请联系管理员关联账户手机号!'
          });
        }else{
          let mobile = sessionStorage.getItem('userMobile');

          let _data = {
            type:"DATASOURCE_BATCH",
            data:{
              orgId: store.state.user.userInfo.orgId,
              batchId
            }
          };
          subscribeMobile(_data,mobile).then(data => {
            this.$message({
              type: 'success',
              message: '订阅成功!'
            });
          });
        }

        if(!sessionStorage.getItem('userEmail')){
          this.$message({
            type: 'error',
            message: '请联系管理员关联账户邮箱!'
          });
        }else{
          let mail = sessionStorage.getItem('userEmail');

          let _data = {
            type:"DATASOURCE_BATCH",
            data:{
              orgId: store.state.user.userInfo.orgId,
              batchId
            }
          };

          subscribeMail(_data,mail).then(data => {
            this.$message({
              type: 'success',
              message: '订阅成功!'
            });
          });
        }
      },
      strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
          obj[k] = v;
        }
        return obj;
      },
    }
  };
</script>
