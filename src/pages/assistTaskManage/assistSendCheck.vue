<template>
    <div class="send-check-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="20"  placeholder="请输入企业名或订单号"></el-input>
            <el-select v-model="searchData.type" :span="5" placeholder="请选择状态" clearable @change="searchEvent" >
              <el-option :label ="item.label" :value="item.value" v-for="item in columnType" :key="item.value"></el-option>
            </el-select>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>
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
              <!--<el-table-column type="selection" width="55"></el-table-column>-->
              <el-table-column prop="orderCode" label="订单号" width="140">
                <template slot-scope="scope">
                  <span class="text-main"  @click="handleRecord(scope.row.id)">{{ scope.row.orderCode }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="industryTxt" label="行业" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.industryTxt}}【{{scope.row.enterprise.name}} {{scope.row.enterprise.shopName}}】
                </template>
              </el-table-column>
              <el-table-column prop="areaNameTxt" label="区域" show-overflow-tooltip> </el-table-column>
         <!--     <el-table-column prop="target" label="目标" width="70" show-overflow-tooltip> </el-table-column>-->
              <el-table-column prop="sendTime" label="发送时间" width="170"> </el-table-column>
              <el-table-column prop="sendCount" label="发送量" width="80"> </el-table-column>
              <el-table-column prop="feeOut" label="费用" width="80"> </el-table-column><!--
              <el-table-column prop="detailAddr" label="地址" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.codeName + ' ' + scope.row.detailAddr}}</template>
              </el-table-column>-->
              <el-table-column label="任务状态" width="135">
                <template slot-scope="scope">
                  <el-tag :type="tempList.arrList[scope.row.status].type">{{ tempList.arrList[scope.row.status].value }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="任务执行状态" width="160">
                <template slot-scope="scope">
                  <el-tag :type="tempList.taskStatus[scope.row.batchStatus || 'UN_START'].type">{{ tempList.taskStatus[scope.row.batchStatus  || 'UN_START'].value }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    :type="scope.row.batchStatus == 'END_FAIL' && scope.row.status == 6 ? 'pink': 'success'"
                    :disabled="scope.row.status == 4 || scope.row.status == 10 || reSendBtn"
                    @click="handleCheck(scope.row)">{{ scope.row.batchStatus == 'END_FAIL' && scope.row.status == 6 ? '重新发送': '短信记录' }}</el-button>
                  <el-button
                    size="small"
                    :disabled=" scope.row.status == 4 || scope.row.status == 9  ||  scope.row.status == 7  || scope.row.status == 11 || scope.row.status == 10 || !scope.row.batchStatus || scope.row.batchStatus == 'UN_START' || scope.row.batchStatus == 'RUNNING' "
                    @click="handleEnter(scope.row)">补填</el-button>
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
      <el-dialog title="信息补录" size="tiny" :visible.sync="smsInfo.flag">
        <el-form :model="smsInfo.modal" :rules="smsInfo.rules" ref="smsInfo">
          <el-form-item label="发送状态" :label-width="smsInfo.formLabelWidth">
            <el-radio-group v-model="smsInfo.modal.flag" @change="handleRadio('smsInfo')">
              <el-radio :label="true">成功</el-radio>
              <el-radio :label="false">失败</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="smsInfo.modal.flag">
            <el-form-item label="发送成功数" :label-width="smsInfo.formLabelWidth" prop="fillSuccCount">
              <el-input class="wid_80" type="text" v-model="smsInfo.modal.fillSuccCount" auto-complete="off" placeholder="请输入发送成功数"></el-input>
            </el-form-item>
            <el-form-item label="发送失败数" :label-width="smsInfo.formLabelWidth" prop="fillFailedCount">
              <el-input class="wid_80" type="text" v-model="smsInfo.modal.fillFailedCount" auto-complete="off" placeholder="请输入发送失败数"></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="失败类型" :label-width="smsInfo.formLabelWidth"  prop="failedType">
              <el-select
                clearable
                @clear="cleanReason"
                v-model="smsInfo.modal.failedType"
                placeholder="请选择拒绝类型"
                @change="handleChange"  class="wid_80">
                <el-option
                  v-for="item in smsInfo.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="失败原因" :label-width="smsInfo.formLabelWidth" prop="failedCause">
              <el-input class="wid_80" type="textarea" v-model="smsInfo.modal.failedCause" auto-complete="off" placeholder="请输入发送失败原因"></el-input>
            </el-form-item>
          </template>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="smsInfo.flag = false">取 消</el-button>
          <el-button type="pink" @click="handleEnterConfirm('smsInfo')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog custom-class="dialog-record" title="任务记录" :visible.sync="record.flag">
         <p class="dialog-record-list"  v-for="item in record.list">
           <span class="t-gray">{{item.id}} :</span> <span class="t-gray">  {{item.createTime}}</span> <span :class="item.batchStatus == 'END_SUCCESS' ? 'txt-green':'text-red'">{{item.batchMsg}}</span>
         </p>
      </el-dialog>
      <el-dialog title="参数填写" size="tiny" :visible.sync="taskModel.flag">
        <el-form :model="taskModel" :rules="rules" ref="taskModel">
          <el-form-item label="关联营销任务" :label-width="formLabelWidth" prop="marketingTask">
            <el-select
              v-model="taskModel.marketingTask"
              placeholder="请输入关联任务"
              class="wid_80"
              @change="handleChangeTask">
              <el-option
                v-for="item in select.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务执行时间" :label-width="formLabelWidth">
            <el-date-picker
              v-model="taskModel.sendTime"
              type="datetime"
              class="wid_80"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            :label="item.label"
            :key="index"
            v-for=" (item,index)  in  paramsItem.items"
          >
            <template v-if="item.params === 'smsChannelId' || item.params === 'smsTemplateId' || item.params === 'batchDescriptionId' || item.params === 'catalog'">
              <el-select  class="wid_80"  v-model="item.value" clearable  filterable :placeholder="'请选择' + item.label">
                <el-option
                  v-for="cell in paramsItem.defaultItems[item.params]"
                  :key="cell.value"
                  :label="cell.name"
                  :value="cell.id">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.params.startsWith('dataSource')">
              <el-select
                v-model="item.value"
                clearable
                filterable
                remote
                class="wid_80"
                :placeholder="'请选择' + item.label"
                :remote-method="remoteMethod">
                <el-option
                  v-for="cell in paramsItem.filterData"
                  :key="cell.value"
                  :label="cell.name"
                  :value="cell.id">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-input class="wid_80" type="text" v-model="item.value" auto-complete="off" :placeholder="'请输入' + item.label"/>
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="taskModel.flag = false">取 消</el-button>
          <el-button type="primary" @click="handleInsert('taskModel')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { listTasks,executeTaskParams } from '@/api/marketingManage/marketTask-api'
  import { assTaskList,assTaskUpdate,assTaskFinish,confirmParam,confirmAgain,jobBatchList,assTaskConfirm,defaultParams,assiocateList } from '@/api/assist-api'
  import { smsCheckList, smsResend, smsReview, sendCancel , sendPreview} from '@/api/smsManagement/smsManage-api'
  import { templeteList } from '@/api/smsManagement/smsPassageway-api';
  import { descriptionList } from '@/api/smsManagement/smsChannel-api';
  import { templeteList as smsTemplateList }  from '@/api/smsManagement/smsTemplate-api';
  export default {
    name: 'assistSendCheck',
    data () {
      return {
        searchData:{
          key:'',
          areaCode:'',
          industryId:'',
          type:''
        },
        page:{
          pageSize:10,
          total:100,
          pageIndex: 1
        },
        columnType:[
          { label:'发送中',value:6 },
          { label:'发送失败',value:11 },
          { label:'发送完成',value:7 }
        ],
        loading:true,
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        addCompany: {
          id:'',
          account: '',
          name: '',
          roles: '',
          mobile: '',
          email: ''
        },
        isEdit:false,
        tempList:{
          roleList:[],
          arrList:[
            {key:0,value:"初始",type:'gray'},
            {key:1,value:"待审核",type:'warning'},
            {key:2,value:"发送失败",type:'danger'},
            {key:3,value:"已审核",type:'success'},
            {key:4,value:"审核未通过",type:'danger'},
            {key:5,value:"待发送",type:'warning'},
            {key:6,value:"发送中",type:'primary'},
            {key:7,value:"发送完成",type:'success'},
            {key:8,value:"停用",type:'gray'},
            {key:9,value:"发送未知",type:'gray'},
            {key:10,value:"停用",type:'gray'},
            {key:11,value:"发送失败",type:'danger'},
            {key:12,value:"状态未知",type:'danger'}
          ],
          taskStatus:{
            'UN_START':{value:"任务尚未开始执行",type:'gray'},
            'RUNNING':{value:"任务正在执行",type:'primary'},
            'END_SUCCESS':{value:"任务执行结束且成功",type:'success'},
            'END_FAIL':{value:"任务执行结束且失败",type:'danger'}
          }
        },
        formLabelWidth: '100px',
        rules: {
          roles: [
            {type: 'array', required: true, message: '请选择角色权限', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '请输入账户名称', trigger: 'blur' },
            { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
          ],
          oldpasswd: [
            { required: true, message: '请输入账户旧密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          passwd: [
            { required: true, message: '请输入账户新密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          ],
          identityPasswd: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          mobile: [
            { required: true , pattern: /^1[34578]\d{9}$/, message: '请正确的11位手机号码', trigger: 'change' }
          ],
          email: [
            { required: false, type: 'email', message: '请正确的邮箱地址', trigger: 'change' }
          ]
        },
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
        checkCurId:'',
        loading2:true,
        statusList:[
          {key:'',value:"全部",type:'success'},
          {key:0,value:"初始",type:'gray'},
          {key:1,value:"已发送",type:'primary'},
          {key:2,value:"发送失败",type:'danger'},
          {key:3,value:"上传中",type:'warning'},
          {key:4,value:"上传成功",type:'success'},
          {key:5,value:"发送中",type:'warning'},
          {key:6,value:"发送记录已生成",type:'success'},
          {key:7,value:"禁用",type:'gray'}
        ],
        reSendBtn:false,
        smsInfo:{
          flag:false,
          modal:{
            id:0,
            fillSuccCount:'',
            fillFailedCount:'',
            flag:true,
            status:0,
            failedType:'',
            failedCause:''
          },
          options:[
            {
              label:'参数错误',
              value:1,
              desc:'配置参数错误'
            },{
              label:'企业状态无效',
              value:2,
              desc:'企业状态审核状态可能为其他状态'
            },{
              label:'其他',
              value:10,
              desc:''
            }
          ],
          item:'',
          rules:{
            fillFailedCount: [
              { required: true, message: '请输入成功失败数', trigger: 'blur' }
            ],
            fillSuccCount: [
              { required: true, message: '请输入成功记录数', trigger: 'blur' }
            ],
            failedCause:[
              { required: true, message: '请输入失败原因', trigger: 'blur' }
            ],
            failedType: [
              { type: 'number', required: true, message: '请选择原因类型', trigger: 'blur' }
            ]
          },
          formLabelWidth:'100px'
        },
        record:{
          flag:false,
          list:[]
        },
        taskModel: {
          flag:false,
          marketingTask: '',
          sendTime: '',
          taskId: 0
        },
        smsList:[],
        businessList:[],
        select:{
          options: [],
          list: [],
          loading: false,
          states: []
        },
        paramsItem:{
          flag:false,
          taskId:0,
          executeDate:null,
          executeTime:null,
          items:[],
          defaultItems:{},
          dataList:[],
          catalog:[],
          filterData:[],
          loading:false,
          rowItems:[],
          defaultValue:''
        },
        executeItem:{
          taskId:0,
          flag: false,
          executeDate:null,
          executeTime:null
        },
      }
    },
    components: {},
    methods: {
      searchEvent(){
        this.list(10,1);
      },

      //自定义事件
      handleEdit(index, row) {
        this.isEdit=true;
        this.addCompany={
          id:row.id ,
          account: row.account,
          name: row.name,
          roles: row.roles.map(item=>item.id),
          mobile: row.mobile,
          email: row.email
        };
        this.dialogFormVisible=true;
      },
      handleUpdate(id,status){
        let _data = {
          id,status
        };
        companyStatus(_data).then(data =>{
          this.$message({
            type: 'success',
            message: '状态更新成功!'
          });
          this.list(this.page.pageSize,this.page.pageIndex);
        })
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
            this.list(this.page.pageSize,this.page.pageIndex);
          })
        }).catch(() => {
          console.log('删除取消');
        });

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
      handleExport(id){
        window.location.href = window.location.origin + '/dspSms/send/export'+"?recordId="+id+"&Authorization="+sessionStorage.getItem("userToken");
      },
      handleCheck(item){
        if(item.batchStatus == 'END_FAIL' && item.status == 6){
            this.handleSend(item);
            return false;
            this.reSendBtn = true;
            confirmAgain({taskId:item.id}).then(data => {
              this.$message({
                type: 'success',
                message: '重新发送成功!'
              });
              this.reSendBtn = false;
              this.list(this.page.pageSize,this.page.pageIndex);
            }).catch( err => {
              this.reSendBtn = false;
            });
            return false;
        }

        confirmParam({taskId:item.id}).then(data =>{
          !data.data.batchDescriptionId && this.$message({
            type: 'error',
            message: '业务描述等信息缺失!'
          });
          data.data.batchDescriptionId && data.data.channel && this.$router.push({path:'/home/assistsendcheck/' + data.data.batchDescriptionId + '/'+ data.data.channel })
        });
      },
      handleCommand(command) {
        let _self = this;
        let data = {
          "recordId": this.checkCurId,
          "type": command
        };
        _self.loading2 = true;
        _self.checkData.flag = true;
        sendPreview(data).then((res)=>{
          _self.loading2 = false;
          _self.checkData.tempData = res.data;
          _self.checkData.num = res.total;
        })
      },
      handleEnter(item){
        this.smsInfo.item = item;
        this.smsInfo.modal.id = item.id;
        this.smsInfo.flag = true;
      },
      handleEnterConfirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.smsInfo.modal.status = this.smsInfo.modal.flag ? 7 : 11;
            assTaskFinish(this.smsInfo.modal).then(data=>{
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.smsInfo.flag = false;
              this.list(this.page.pageSize,this.page.pageIndex);
              this.handleReset(formName);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      handleReset(formName) {
        this.$refs[formName].resetFields();
      },

      handleRadio(formName) {
        this.$refs[formName].resetFields();
      },


      handleChange(value){
        let _obj = null;
        _obj = this.smsInfo.options.find(item=>{
          return item.value === value;
        });
        this.smsInfo.modal.failedCause = _obj ? _obj.desc : '';
      },
      cleanReason(){
        this.smsInfo.modal.failedCause = ''
      },
      handleRecord(taskId){
        jobBatchList({taskId}).then(data =>{
          if(data.data.length){
            this.record.list = data.data;
            this.record.flag = true;
          }else{
            this.$message({
              showClose: true,
              message: '暂时无记录，请稍候操作',
              type: 'warning'
            });
          }

        })
      },

      //******参数执行列******
      handleInsert(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
              showClose: true,
              message: '参数化任务执行操作中,请稍等...',
              type: 'success'
            });
            //转换参数
            const _map = new Map();
            this.paramsItem.items.forEach(
              (item) => _map.set(item.params, item.value)
            );
            let _data=this.strMapToObj(_map);
            //合并参数
            this.taskModel = Object.assign(this.taskModel,_data);
            assTaskConfirm(this.taskModel).then(data=>{
              this.$message({
                type: 'success',
                message: '参数化任务提交成功!'
              });
              this.taskModel.flag = false;
              this.list(this.page.pageSize,this.page.pageIndex);
              this.handleReset(formName);
            });

          } else {
            return false;
          }
        });
      },
      handleSend(row){

        this.taskModel.taskId = row.id;
        this.paramsItem.rowItems = row;
        this.taskModel.sendTime = new Date(row.sendTime);
        this.taskModel.marketingTask = '';
        this.paramsItem.items = [];
        this.handleAssociateTask(row.industryCode);
        defaultParams({taskId:row.id}).then(data => {
          this.paramsItem.defaultValue = data.data;
          this.taskModel.flag = true;
        })
      },
      handleChangeTask(taskId){
        if(!!!taskId){
          return false;
        }
        executeTaskParams({},taskId).then(data =>{
          /* Object.defineProperties(data.data,{
           dataSource:{
           value:'数据源表',
           writable: true,
           enumerable: true,
           configurable: true
           },
           catalog:{
           value:'catalogId',
           writable: true,
           enumerable: true,
           configurable: true
           }
           }) 下次更新 */
          this.paramsItem.items = [];
          if(Object.keys(data.data).length){
            this.handleBuildItem(data);
            //this.paramsItem.flag = true;
            this.paramsItem.taskId = taskId ;
          }else{
            this.$message({
              showClose: true,
              message: '参数未配置，请先配置参数！',
              type: 'error'
            });
          }
        });
      },
      handleBuildItem(data){
        let _data = {
          "uId": "admin",
          user:this.account,
          status:1,
          pageIndex: 1,
          pageSize: 500
        };
        for (let [key, value] of Object.entries(data.data)) {
          if(key == 'smsChannelId'){
            templeteList(_data).then(data => {
              this.$set(this.paramsItem.defaultItems,'smsChannelId',data.data.map(item=>{
                return {
                  value:item.name,
                  id:item.id.toString(),
                  name:item.name + '【' + item.id + '】'
                }
              }));
            });
          }else if(key == 'smsTemplateId'){
            smsTemplateList(_data).then(data => {
              this.$set(this.paramsItem.defaultItems,'smsTemplateId',data.data.map(item=>{
                return {
                  value:item.templateName,
                  id:item.id.toString(),
                  name:item.templateName + '【' + item.id + '】'
                }
              }));
            });
          }else if(key == 'batchDescriptionId'){
            descriptionList(_data).then(data => {
              this.$set(this.paramsItem.defaultItems,'batchDescriptionId',data.data.map(item=>{
                return {
                  value:item.name,
                  id:item.id.toString(),
                  name:item.name + '【' + item.id + '】'
                }
              }));
            });
          }else if(key == 'catalog'){
            if(!!!this.paramsItem.defaultItems[key]){
              this.$set(this.paramsItem.defaultItems,key,this.paramsItem.catalog);
            }
          }else if(key.startsWith('dataSource')){
            if(!!!this.paramsItem.defaultItems.dataSource){
              //this.$set(this.paramsItem.defaultItems,'dataSource',this.paramsItem.dataList);
            }
          }

          this.paramsItem.items.push({
            label:value,
            params:key,
            value:this.paramsItem.defaultValue.hasOwnProperty(key) ? this.paramsItem.defaultValue[key] : ''
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
      remoteMethod(query) {
        if (query !== '') {
          this.select.loading = true;
          setTimeout(() => {
            this.select.loading = false;
            this.select.options = this.select.list.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.select.options = [];
        }
      },
      taskList(){
        let _data={
          pageSize:100,
          pageIndex:1,
          taskName:''
        };
        listTasks(_data).then(data=>{
          this.select.list = data.data.map(item=>{
            return { value: item.taskId, label: item.taskName }
          });
        });
      },

      handleAssociateTask(industryCode){
        let _data = {
          industryCode,
          pageIndex: 1,
          pageSize: 10
        };
        assiocateList(_data).then(data =>{
          if(data.data.length){
            let _name = data.data[0].taskName && data.data[0].taskName.split(',');
            this.select.options = data.data[0].taskId && data.data[0].taskId.split(',').map((item,index) =>{
                return { value: item, label: _name[index] }
              });
          }
        })
      },
      //******参数执行列******

      list(pageSize,pageIndex){
        let _data={
          pageSize,
          pageIndex,
          dataType:3,
          orderCode: isNaN(this.searchData.key) ? '' : this.searchData.key ,
          enterpriseName:isNaN(this.searchData.key) ? this.searchData.key : '' ,
          orgCode:this.$store.state.user.userInfo.orgCode,
          status:this.searchData.type
        };
        assTaskList(_data).then((data)=>{
          if(data.code==1){
            this.tableData=data.data;
            this.page.total=data.total;
            this.page.pageSize = pageSize;
            this.page.pageIndex = pageIndex;
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
      let _data={
        pageSize:this.page.pageSize,
        pageIndex: this.page.pageIndex,
        dataType:3,
        orgCode:this.$store.state.user.userInfo.orgCode
      };
      assTaskList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
        this.loading = false
      });
    }
  }
</script>

<style lang="scss">

</style>
