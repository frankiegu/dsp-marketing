<template>
  <div class="market-batch-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-input class="search-key" v-model="searchData.key" :maxlength="20" placeholder="请输入关键字" @keyup.native.enter="searchEvent"></el-input>
          <el-input class="search-key" v-model="searchData.execKey" :maxlength="20" placeholder="请输入参数" @keyup.native.enter="searchEvent"></el-input>
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
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="">
                    <span>任务编号【{{ props.row.jobNo }}】</span>
                  </el-form-item>
                  <el-form-item label="">
                    <span>任务名称【{{ props.row.dspTask.taskName }}】</span>
                  </el-form-item>
                  <el-form-item label="">
                    <div :key="item.id" v-for="item in props.row.dspTaskStepJobList">
                      <template v-for="cell in item.dspTaskStep.outputSources" v-if="item.status == 1">
                        <div class="preview-list">
                          <span>Step_{{ ('0' + item.dspTaskStep.stepNo ).slice(-2) }} - {{cell.displayName}}【{{ ( props.row.tmpDataSource[cell.identity].name && props.row.tmpDataSource[cell.identity].name.length > 48 ? props.row.tmpDataSource[cell.identity].name.slice(0,48) + '...' : props.row.tmpDataSource[cell.identity].name )}}】</span>
                          <el-button
                            type="text"
                            @click="handlePreview( cell.catalogId , props.row.tmpDataSource[cell.identity].name )">预览</el-button>
                          <el-button
                            type="text"
                            class="export-action"
                            v-show="props.row.tmpDataSource[cell.identity].name"
                            @click="exportData( cell.catalogId , props.row.tmpDataSource[cell.identity].name )">导出</el-button>
                        </div>
                      </template>

                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="selection" width="50"/>
            <el-table-column label="任务编号" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="text-main" v-if="isCreate(scope.row)" @click="handleLink(scope.row.dspTask.id)">{{ scope.row.jobNo }}</span>
                <span v-else>{{ scope.row.jobNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dspTask.taskName" label="任务名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="dspTask.taskName" label="参数列" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-for="(value, key) in JSON.parse(scope.row.executeParams)"> {{ key }}:{{ value }}  </span>
                </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="170"> </el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="170"> </el-table-column>
            <el-table-column prop="jobNo" align="center" label="总步骤/成功/当前" width="145">
              <template slot-scope="scope">
                <span>{{ scope.row.totalStep }}  </span> / <span class="text-success">{{ scope.row.successStep }}  </span> / <span class="text-current">  {{ scope.row.currentStep }}  </span>
              </template>
            </el-table-column>
            <el-table-column label="执行状态" width="98">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" type="gray"> 初始化 </el-tag>
                <el-tag v-else-if="scope.row.status === 1" type="success"> 完成 </el-tag>
                <el-tag v-else-if="scope.row.status === 2" type="danger"> 失败 </el-tag>
                <el-tag v-else-if="scope.row.status === 4" type="primary"> 进行中 </el-tag>
                <el-tag v-else="scope.row.status === 12" type="warning"> 待审核 </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="msg" label="备注" show-overflow-tooltip/>

            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
               <!-- <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)" disabled>编辑</el-button>
                <el-button
                  size="small"
                  :type="scope.row.status === 1 ? 'gray' : 'success'"
                  @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)" disabled>删除</el-button>-->

                <el-button
                  size="small"
                  type="warning"
                  @click="handleSubscribe(scope.row.jobNo)">订阅</el-button>
                <el-button v-if="scope.row.status === 2"
                           size="small" type="danger"
                           @click="initEditParams(scope.row.dspTask.id,scope.row.id,scope.row.currentStep)">继续</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="search-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title='isEdit?"编辑角色":"新增角色"'  size="tiny" :visible.sync="dialogFormVisible">
      <el-form :model="addUser" :rules="rules" ref="addUser">
        <el-form-item label="角色编号" :label-width="formLabelWidth" v-show="isEdit">
          <el-input v-model="addUser.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号名称" :label-width="formLabelWidth" required prop="account">
          <el-input v-model="addUser.account" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth"  prop="roles">
          <el-select v-model="addUser.roles" multiple class="wid_80"  placeholder="请选择用户角色">
            <el-option :key="item.id" v-for="item in tempList.roleList" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号密码" v-if="!isEdit" :label-width="formLabelWidth"  prop="passwd">
          <el-input type="password" v-model="addUser.passwd" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="addUser.name" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addUser.mobile" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addUser.email" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="pink" @click="handleSubmit('addUser')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title='修改密码'  size="tiny" :visible.sync="dialogPassword">
      <el-form :model="userPassword" :rules="rules" ref="userPassword">
        <el-form-item label="账号旧密码"  :label-width="formLabelWidth"  prop="oldpasswd">
          <el-input type="password" v-model="userPassword.oldpasswd" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号密码" :label-width="formLabelWidth"  prop="passwd">
          <el-input type="password" v-model="userPassword.passwd" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"  :label-width="formLabelWidth"  prop="identityPasswd">
          <el-input type="password" v-model="userPassword.identityPasswd" class="wid_80" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPassword = false">取 消</el-button>
        <el-button type="pink" @click="handleResetPassword('userPassword')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'预览调试< 共'+ preview.num +'条记录 >'" custom-class="pb_30"  size="large" :visible.sync="preview.flag">
      <div class="view-container">
        <el-table
          ref="previewTable"
          :data="preview.tempData.details"
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
             :key="items"
             v-for=" items in preview.tempData.columns"
             :prop="items"
             :label="items"
             :width="preview.tempData.columns && preview.tempData.columns.length > 7 ? items.length*25 : 'auto'"
             show-overflow-tooltip
             resizable
             align="center"> </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="编辑参数" :visible.sync="continueParam.show">
      <el-form class="param-item-form">
        <el-form-item v-for="(rowItem,index) in continueParam.item" style="margin-bottom: 5px;" :label="rowItem.label" :key="index" label-width="100px">
          <template v-if="rowItem.params === 'smsChannelId' || rowItem.params === 'smsTemplateId' || rowItem.params === 'batchDescriptionId' || rowItem.params === 'catalog'">
            <el-input v-if="isEditDisabled(rowItem.steps)" readonly class="item" type="text" v-model="rowItem.value" auto-complete="off" :placeholder="'请输入' + rowItem.label"/>
            <el-select v-else class="item" v-model="rowItem.value" clearable filterable :placeholder="'请选择' + rowItem.label">
              <el-option v-for="cell in continueParam.defaultItems[rowItem.params]" :key="cell.value" :label="cell.name" :value="cell.id"/>
            </el-select>
          </template>
          <template v-else>
            <el-input :readonly="isEditDisabled(rowItem.steps)" class="item" type="text" v-model="rowItem.value" auto-complete="off" :placeholder="'请输入' + rowItem.label"/>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="continueParam.show = false">取 消</el-button>
        <el-button type="pink" @click="continueTask">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { jobList,jobParam, previewData, subscribeMobile,executeTaskParams,continueTask } from '@/api/marketingManage/marketTask-api'
    import { mapState } from 'vuex'
    import { templeteList as smsTemplateList }  from '@/api/smsManagement/smsTemplate-api';
    import { templeteList } from '@/api/smsManagement/smsPassageway-api';
    import { descriptionList } from '@/api/smsManagement/smsChannel-api';
    import store from '@/vuex/store'

    export default {
      name: 'marketBatch',
      data () {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.userPassword.passwd) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };

        return {
          searchData:{
            key:'',
            execKey:''
          },
          page:{
            pageSize:10,
            total:100,
            currentPage: 1
          },
          continueParam:{
            jobId: null,
            taskId: null,
            curstep: null,
            show:false,
            defaultItems:[],
            itemTemplates: null,
            item: null
          },
          loading:true,
          tableData: [],
          multipleSelection: [],
          dialogFormVisible: false,
          dialogPassword:false,
          addUser: {
            id:'',
            account: '',
            passwd: '',
            name: '',
            roles: '',
            mobile: '',
            email: ''
          },
          userPassword:{
            account:'',
            oldpasswd:'',
            passwd:'',
            identityPasswd:''
          },
          isEdit:false,
          tempList:{
            roleList:[]
          },
          preview:{
            tempData:[],
            num: 0,
            flag:false
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
              { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
              { validator: validatePass, trigger: 'blur' }
            ],
            mobile: [
              { required: false , pattern: /^1[34578]\d{9}$/, message: '请正确的11位手机号码', trigger: 'change' }
            ],
            email: [
              { required: false, type: 'email', message: '请正确的邮箱地址', trigger: 'change' }
            ]
          }
        }
      },
      components: {},
      methods: {
        isCreate(row){
          let result = false;
          for(let item of row.dspTask.orgList){
            if(item.isCreate === 1 && item.orgId === row.orgId){
              result = true;
            }
          }
          if(store.state.user.userInfo.admin){
            result = true;
          }
          return result;
        },
        searchEvent(){
          this.list(10,1);
        },
        //自定义事件
        handleLink(id){
          this.$router.push({ name: 'markettaskdetail', params: { id }})
        },
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
              message: '账号已被冻结，请24小时后进行操作!'
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
        handleResetPassword(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              userPassword(this.userPassword).then(data=>{
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.list(this.page.pageSize,1);
                this.dialogPassword = false;
                _self.handleReset(formName);
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });


        },
        handlePreview(parentSourceId,tableName){
          let _data={
            parentSourceId,
            tableName
          };
          previewData(_data).then(data=>{
            this.preview.tempData = data.data;
            this.preview.flag = true;
            this.preview.num = data.total;
          });
        },
        handleSocketData(data){
          if(data.code == 1){
            this.tableData.forEach((item,index) => {
                if(item.id == data.data.data.id){
                  this.tableData.splice(index,1,data.data.data)
                }
            });
          }else{
            this.$nextTick(()=>{
              this.$message({
                showClose: true,
                message: data.message,
                type: 'error'
              });
            })
          }
        },
        handleSubscribe(taskNo){
            if(!(sessionStorage.getItem('userMobile')&&sessionStorage.getItem('userMobile').length == 11)){
                this.$message({
                  type: 'error',
                  message: '请联系管理员关联账户手机号!'
                });
                return false;
            }
          let _data = {
            type:"DATASOURCE_ACTION",
            data:{
              orgId: store.state.user.userInfo.orgId,
              taskNo
            }
          };
          subscribeMobile(_data,sessionStorage.getItem('userMobile')).then(data => {
            this.$message({
              type: 'success',
              message: '订阅成功!'
            });
          })
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
                this.dialogFormVisible=false;
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
        showParamsList(obj){
            let _str = '';
            for(let [key, value] of Object.entries(obj)){
              _str += ',' + key + ':' + value;
            }
            return _str.slice(1);
        },
        initEditParams(taskId,jobId,curstep){
          this.continueParam.defaultItems = [];
          this.continueParam.itemTemplates = {};
          this.continueParam.curstep = curstep;
          this.continueParam.item = [];
          this.continueParam.jobId = jobId;
          this.continueParam.taskId = taskId;
          executeTaskParams({},taskId).then(data =>{
            if(data.data && Object.keys(data.data).length){
              this.buildItem(data);
              this.reformValue();
              this.continueParam.show = true;
            }else{
              this.$confirm('无参数设置，确认继续任务?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.continueTask();
              }).catch(() => {
              });
            }
          });
        },
        isEditDisabled(steps){
          for(let item of steps){
            if(item < this.continueParam.curstep){
              return true;
            }
          }
          return false;
        },
        buildItem(data){
          let _data = {
            "uId": "admin",
            user:this.account,
            status:1,
            pageIndex: 1,
            pageSize: 500
          };
          for (let [key,value] of Object.entries(data.data)) {
            let defaultItem;
            if (key === 'smsChannelId') {
              templeteList(_data).then(data => {
                defaultItem = data.data.map(item=>{
                  return {
                    value: item.name,
                    id: item.id.toString(),
                    name: item.name + '【' + item.id + '】'
                  }
                });
                this.$set(this.continueParam.defaultItems,key,defaultItem);
              });
            } else if (key === 'smsTemplateId') {
              smsTemplateList(_data).then(data => {
                defaultItem = data.data.map(item=>{
                  return {
                    value: item.templateName,
                    id: item.id.toString(),
                    name: item.templateName + '【' + item.id + '】'
                  }
                });
                this.$set(this.continueParam.defaultItems,key,defaultItem);
              });
            } else if (key === 'batchDescriptionId') {
              descriptionList(_data).then(data => {
                defaultItem = data.data.map(item=>{
                  return {
                    value: item.name,
                    id: item.id.toString(),
                    name: item.name + '【' + item.id + '】'
                  }
                });
                this.$set(this.continueParam.defaultItems,key,defaultItem);
              });
            }
            this.continueParam.itemTemplates[key] = {
              label: value,
              params: key
            };
          }
        },
        reformValue(){
          jobParam(this.continueParam.jobId).then(data => {
            this.continueParam.item = data.data.map(item => {
              return {
                label: this.continueParam.itemTemplates[item.key].label,
                params: this.continueParam.itemTemplates[item.key].params,
                value: item.value,
                steps: item.stepList
              };
            });
          });
        },
        continueTask(){
          let obj = {};
          if(this.continueParam.item && this.continueParam.item.length > 0){
            for(let temp of this.continueParam.item){
              obj[temp.params] = temp.value;
            }
          }
          continueTask(this.continueParam.jobId,obj).then(data => {
            if(data.code===1){
              this.$message({
                showClose: true,
                message: '继续任务成功!',
                type: 'success'
              });
              this.continueParam.show = false;
            }
          });
        },
        //统计表导出
        exportData(parentSourceId,tableName){
          if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
          }
          window.open(window.location.origin+'/datasource/export?tableName='+ tableName +'&parentSourceId='+ ( parentSourceId || 0 ) + ' &Authorization='+ sessionStorage.getItem('userToken'));
        },

        list(pageSize,currentPage){
          let _data={
            pageSize,
            currentPage,
            taskName:this.searchData.key,
            executeParams:this.searchData.execKey
          };
          jobList(_data).then((data)=>{
            if(data.code==1){
              if(data.data){
                data.data.forEach((item) => {
                  item.dspTaskStepJobList.sort((job_pre,job_after) => {
                    return job_after.dspTaskStep.stepNo - job_pre.dspTaskStep.stepNo;
                  });
                });
              }
              this.tableData=data.data;
              this.page.total=data.total;
              this.page.pageSize=pageSize;
              this.page.currentPage=data.currentPage;
              this.loading = false
            }
          });
        },
        //分页模块
        handleSizeChange(pageSize) {
          this.list(pageSize,1);
        },
        handleCurrentChange(currentPage) {
          this.list(this.page.pageSize,currentPage);
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
        ...mapState({
          socketData: state=>state.socket.message,
        })
      },
      watch:{
        socketData(val,old){
          if(val){
              if(val.type == 'DATASOURCE_ACTION'){
                this.handleSocketData(val);
              }
          }
        }
      },
      created() {
        let _data={
          pageSize:this.page.pageSize,
          currentPage: this.page.currentPage,
          name:this.searchData.key,
          executeParams:this.searchData.execKey
        };
        jobList(_data).then(data=>{
          if(data.data){
            data.data.forEach((item) => {
              item.dspTaskStepJobList.sort((job_pre,job_after) => {
                return job_after.dspTaskStep.stepNo - job_pre.dspTaskStep.stepNo;
              });
            });
          }
          this.tableData=data.data;
          this.page.total=data.total;
          this.loading = false;
          let _data_ = {
            "type": "DATASOURCE_ACTION",
            "data": {
              orgId: store.state.user.userInfo.orgId
            }
          };
          this.$socket.emit('request',JSON.stringify(_data_));
        });
      }
    }
</script>
