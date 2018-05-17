<template>
    <div class="assist-send-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="20" placeholder="请输入企业名或订单号"></el-input>
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
              <el-table-column prop="orderCode" label="订单号" width="140"> </el-table-column>
              <el-table-column prop="industryTxt" label="行业" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.industryTxt}}【{{scope.row.enterprise.name}} {{scope.row.enterprise.shopName}}】
                </template>
              </el-table-column>
              <el-table-column prop="areaNameTxt" label="区域" show-overflow-tooltip> </el-table-column>
              <!--<el-table-column prop="target" label="目标" width="70" show-overflow-tooltip> </el-table-column>-->
              <el-table-column prop="sendTime" label="发送时间" width="180"> </el-table-column>
              <el-table-column prop="sendCount" label="发送量" width="120"> </el-table-column>
              <el-table-column prop="feeOut" label="费用" width="120"> </el-table-column>
              <!--
              <el-table-column prop="detailAddr" label="地址" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.codeName + ' ' + scope.row.detailAddr}}</template>
              </el-table-column>-->
              <el-table-column label="任务状态" width="135">
                <template slot-scope="scope">
                  <el-tag :type="tempList.arrList[scope.row.status].type">{{ tempList.arrList[scope.row.status].value }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="success"
                    :disabled="scope.row.status == 10"
                    @click="handleSend(scope.row,1)">参数发送</el-button>
<!--                  <el-button
                    size="small"
                    type="danger"
                    :disabled="scope.row.status == 10"
                    @click="handleUpdate(scope.row.id,10)">停用</el-button>-->
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
      <el-dialog title="参数填写" size="tiny" :visible.sync="dialogFormVisible">
        <el-form :model="taskModel" :rules="rules" ref="taskModel">
          <el-form-item label="关联营销任务Id" :label-width="formLabelWidth" prop="marketingTask">
            <el-select
              v-model="taskModel.marketingTask"
              placeholder="请输入关联任务Id"
              class="wid_80"
              @change="handleChange">
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
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleInsert('taskModel')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { listTasks,executeTaskParams } from '@/api/marketingManage/marketTask-api'
  import { assTaskList,assTaskUpdate,assTaskConfirm,defaultParams,assiocateList } from '@/api/assist-api'
  import { templeteList } from '@/api/smsManagement/smsPassageway-api';
  import { descriptionList } from '@/api/smsManagement/smsChannel-api';
  import { templeteList as smsTemplateList }  from '@/api/smsManagement/smsTemplate-api';
  export default {
      name: 'assistTaskSend',
    data () {
      return {
        searchData:{
          key:'',
          areaCode:'',
          industryId:''
        },
        page:{
          pageSize:10,
          total:100,
          pageIndex: 1
        },
        loading:true,
        tableData: [],
        multipleSelection: [],
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
            {key:7,value:"发送成功",type:'success'},
            {key:8,value:"停用",type:'gray'},
            {key:9,value:"发送失败",type:'gray'},
            {key:10,value:"停用",type:'gray'},
            {key:11,value:"发送失败",type:'danger'}
          ]
        },
        rules: {
          sendTime: [
            { type: 'date', required: true, message: '请选择发送时间', trigger: 'blur' }
          ],
          marketingTask: [
            { required: true, message: '请输入关联营销任务id', trigger: 'blur' }
          ],
          smsChannelId: [
            { type: 'number',  required: true,  message: '请选择短信通道', trigger: 'change' },
          ],
          batchDescriptionId: [
            { type: 'number',  required: true,  message: '请选择业务描述', trigger: 'change' },
          ],
          limit: [
            {  required: true,  message: '请输入发送量', trigger: 'blur' },
          ],
          smsTemplateId: [
            { type: 'number',  required: true,  message: '请选短信模板', trigger: 'change' },
          ]
        },
        dialogFormVisible: false,
        taskModel: {
          marketingTask: '',
          sendTime: '',
          taskId: 0
        },
        formLabelWidth: '120px',
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
    mounted() {
      this.list = this.states.map(item => {
        return { value: item, label: item };
      });
    },
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
        this.$confirm('是否'+ (status != 10 ? '审核通过':'停用') +'此任务?', '提示', {
          confirmButtonText: status != 10 ?'审核通过':'任务停用',
          cancelButtonText: '取消',
          closeOnPressEscape:false,
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          this.listUpdate(id,status);
        }).catch(() => {});
      },

      handleReset(formName) {
        this.$refs[formName].resetFields();
      },
      listUpdate(id,status){
        let _data = {
          id,status
        };
        assTaskUpdate(_data).then(data =>{
          this.$message({
            type: 'success',
            message: '状态更新成功!'
          });
          this.list(this.page.pageSize,this.page.pageIndex);
        })
      },



      //关联营销任务Id
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
              this.dialogFormVisible = false;
              this.list(this.page.pageSize,this.page.pageIndex);
              this.handleReset(formName);
            });

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleSend(row){
        this.dialogFormVisible = true;
        this.taskModel.taskId = row.id;
        this.paramsItem.rowItems = row;
        this.taskModel.sendTime = new Date(row.sendTime);
        this.taskModel.marketingTask = '';
        this.paramsItem.items = [];
        this.handleAssociateTask(row.industryCode);
        defaultParams({taskId:row.id}).then(data => {
          this.paramsItem.defaultValue = data.data;
        })
      },
      handleChange(taskId){
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

      list(pageSize,pageIndex){
        let _data={
          pageSize,
          pageIndex,
          orderCode: isNaN(this.searchData.key) ? '' : this.searchData.key ,
          enterpriseName:isNaN(this.searchData.key) ? this.searchData.key : '' ,
          dataType:2,
          orgCode:this.$store.state.user.userInfo.orgCode
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
    mounted() {

    },
    computed: {},
    created() {
      let _data={
        pageSize:this.page.pageSize,
        pageIndex: this.page.pageIndex,
        dataType:2,
        orgCode:this.$store.state.user.userInfo.orgCode
      };
      assTaskList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
        this.loading = false
      });
      //this.taskList();
    }
  }
</script>
