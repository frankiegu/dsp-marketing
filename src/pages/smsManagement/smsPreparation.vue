<template>
  <div class="sms-check-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-input class="search-key" v-model="searchData.key" :maxlength="30" placeholder="请输入任务编号"></el-input>
          <el-date-picker
            class="search-key"
            v-model="searchData.time"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            format="yyyy-MM-dd"
            range-separator=" -- "
            :picker-options="pickerOptions" @change="handleChanges">
          </el-date-picker>
          <el-select v-model="searchData.status" width="120" placeholder="请选择状态">
            <el-option
              v-for="item in tempList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
          <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>
          <!-- <el-button type="success" class="search-add"  @click="dialogFormVisible = true;isEdit=false;">新增</el-button>-->
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
            <el-table-column prop="id" label="#" show-overflow-tooltip width="100"> </el-table-column>
            <el-table-column prop="jobNo" label="任务编号" show-overflow-tooltip width="120">
              <template slot-scope="scope">
                <router-link :to="'/home/smscheck'+'?jobNo='+scope.row.jobNo">{{scope.row.jobNo}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="templateId" label="模板ID" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="channelId" label="通道ID" show-overflow-tooltip></el-table-column>
            <el-table-column prop="params" label="参数" show-overflow-tooltip></el-table-column>
            <el-table-column label="执行状态" width="135">
              <template slot-scope="scope">
                <el-tag :type="tempList[scope.row.status].type">{{ tempList[scope.row.status].value }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="批次数量" width="250">
              <template slot-scope="scope">
                <el-tag type="warning">分离{{ scope.row.splitBatches}}</el-tag>
                <el-tag type="success">成功{{ scope.row.successBatches}}</el-tag>
                <el-tag type="danger">失败{{ scope.row.failBatches}}</el-tag>

              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="170" ></el-table-column>
            <el-table-column prop="datasourceName" label="数据源名称" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  :disabled="scope.row.status == 7 "
                  @click="showEdit(scope.row.id,scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
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
    <el-dialog :title="'编辑'"  :visible.sync="dialogParamVisibleItem">
      <el-form :model="editParam"  ref="editParam">
        <el-form-item label="通道" :label-width="formLabelWidth" prop="editParamName">
          <el-select v-model="editParam.channelId" filterable placeholder="请选择渠道">
            <el-option
              v-for="item in tableData1"
              :key="item.id"
              :label="item.id+':'+item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板" :label-width="formLabelWidth" prop="editParamKeyword">
          <el-select v-model="editParam.templateId" filterable placeholder="请选择模板">
            <el-option
              v-for="item in tableData2"
              :key="item.id"
              :label="item.id+':'+item.templateName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogParamVisibleItem = false">取 消</el-button>
        <el-button type="primary" @click="submitParamForm('editParam')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { preparationList, smsResend, smsReview, sendCancel , sendPreview , preparationRebuild } from '@/api/smsManagement/smsManage-api';
  import { templeteList} from '@/api/smsManagement/smsTemplate-api';
  import { templeteList as templeteListPassageway} from '@/api/smsManagement/smsPassageway-api';
  export default {
    name: 'smsCheck',
    data () {
      return {
        tableData1:[],
        tableData2:[],
        index1:0,
        editId:0,
        dialogParamVisibleItem:false,
        loadingDialog:true,
        checkCurId:'',
        searchData:{
          channel:'',
          key:'',
          status:'',
          time:'',
          startTime:'',
          endTime:''
        },
        editParam:{
          channelId:'',
          templateId:''
        },
        page:{
          pageSize:10,
          total:100,
          pageIndex: 1
        },
        loading:true,
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        isEdit:false,
        tempList:[
          {key:'',value:"全部",type:'success'},
          {key:1,value:"成功",type:'primary'},
          {key:2,value:"失败",type:'danger'},
          {key:3,value:"受理中",type:'warning'},
        ],
        preview:{
          tempData:[],
          num: 0,
          flag:false
        },
        checkData:{
          tempData:[],
          num: 0,
          flag:false
        },
        formLabelWidth: '100px',
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
    methods: {
      submitParamForm(){
        let _data = this.editParam;
        _data.id = this.editId;

        preparationRebuild(_data).then((res)=>{
          this.tableData[this.index1].templateId = this.editParam.templateId;
          this.tableData[this.index1].channelId = this.editParam.channelId;
          this.dialogParamVisibleItem = false;
        })
      },
      showEdit(a,b){

        this.dialogParamVisibleItem = true;
        this.editId =a;
        this.index1 = b;
        this.editParam.templateId = this.tableData[this.index1].templateId;
        this.editParam.channelId = this.tableData[this.index1].channelId;

      },
      handleCheck(id){
        this.checkCurId = id;
      },
      handleCommand(command) {
        let _self = this;
        let data = {
          "recordId": this.checkCurId,
          "type": command
        };
        _self.loadingDialog = true;
        _self.checkData.flag = true;
        sendPreview(data).then((res)=>{
          _self.loadingDialog = false;
          _self.checkData.tempData = res.data;
          _self.checkData.num = res.total;
        })


      },
      handleExport(id){
        window.location.href = window.location.origin + '/dspSms/send/export'+"?recordId="+id+"&Authorization="+sessionStorage.getItem("userToken");

      },
      searchEvent(){
        this.list(10,1) ;
      },
      handleChanges(val){
        this.searchData.startTime = val.split(' -- ')[0];
        this.searchData.endTime = val.split(' -- ')[1];
      },
      handleActive(id,index,jobNo){
        let _self = this;
        this.$confirm('此操作将禁用' + '任务编号【'+jobNo+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sendCancel({recordId:id}).then(function(res){
            _self.$message({
              type: 'success',
              message: '禁用成功!'
            });
            _self.tableData[index].status = 7;
          })
        }).catch(() => {
          console.log('禁用取消');
        });
      },
      //自定义事件
      handleEdit(index, row) {
        this.isEdit=true;
        this.addUser={
          id:row.id ,
          account: row.account,
          name: row.name,
          roles: row.roles.map(item=>item.id),
          mobile: row.mobile,
          email: row.email
        };
        this.dialogFormVisible=true;
      },
      handleStop(index, row){
        if(row.status==10){
          this.$message({
            type: 'error',
            message: '账号已被冻结，请24后进行操作!'
          });
          return false;
        }
        this.$confirm('此操作将'+ row.status == 1 ? '激活':'禁用' + '账户【'+row.account+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            account:row.account,
            status:row.status==1 ? 5 : 1
          };
          userModifyStatus(_data).then(data=>{
            this.$message({
              type: 'success',
              message: (row.status == 5 ? '激活':'禁用') + '成功!'
            });
            this.list(this.page.pageSize,1);
          });
        }).catch(() => {
          console.log('禁用取消');
        });
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除账户【'+row.account+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            account:row.account,
            status:6
          };
          userModifyStatus(_data).then(data=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list(this.page.pageSize,1);
          });
        }).catch(() => {
          console.log('删除取消');
        });
      },
      handleChange(row){
        this.dialogPassword = true;
        this.userPassword.account=row.account;
      },
      handleReview(recordId){
        let _data={
          recordId
        };
        smsReview(_data).then(data=>{
          this.preview.tempData=data.data;
          this.preview.flag = true;
          this.preview.num = data.total || this.preview.num;
        })
      },
      handleResend(recordId,status){
        let _data={
          recordId
        };
        this.$confirm(status== 2 ? '是否重发?':'是否发送?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '正在'+ (status== 2 ?'重发':'发送') + '中...'
          });
          smsResend(_data).then(data=>{
            this.$message({
              type: 'success',
              message:(status== 2 ?'重发':'发送') + '成功!'
            });
            this.list(10,1);
          })
        }).catch(() => {
          console.log('删除取消');
        });

      },
      //表单提交模块
      handleSubmit(formName) {
        let _self=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            userSave(this.addUser).then(data=>{
              _self.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.dialogParamVisibleItem=false;
              this.list(this.page.pageSize,1);
              _self.handleReset(formName);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleReset(formName) {
        this.$refs[formName].resetFields();
      },

      list(pageSize,pageIndex){
        let _data={
          pageSize,
          pageIndex,
          jobNo:this.searchData.key,
          status:this.searchData.status,
          startDate: this.searchData.startTime,
          endDate: this.searchData.endTime,
          channel:this.searchData.channel
        };
        preparationList(_data).then((data)=>{
          if(data.code==1){
            this.tableData=data.data;
            this.page.total=data.total;
            this.page.pageSize=pageSize;
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
    computed: {},
    created() {
      let _self = this;
      if(this.$route.query.jobNo){
        this.searchData.key = this.$route.query.jobNo;
      }
      let _data={
        pageSize:this.page.pageSize,
        pageIndex: this.page.pageIndex,
        jobNo:this.searchData.key,
        status:''
      };
      preparationList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
        this.loading = false
      });
      let _data1 = {"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10000};
      templeteListPassageway(_data1).then(function (res) {
        _self.tableData1 = res.data;
      }).catch(function (res) {
        console.log(res)
      })
      let data = {"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10000};
      templeteList(JSON.stringify(data)).then(function (res) {
        _self.tableData2 = res.data;
      }).catch(function (res) {
        console.log(res)
      })

    }
  }
</script>
