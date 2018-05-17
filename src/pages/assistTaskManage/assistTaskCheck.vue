<template>
    <div class="assist-check-container">
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
              <el-table-column prop="orderCode" label="订单号" width="140"> </el-table-column>
              <el-table-column prop="industryTxt" label="行业" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.industryTxt}}【{{scope.row.enterprise.name}} {{scope.row.enterprise.shopName}}】
                </template>
              </el-table-column>
              <el-table-column prop="areaNameTxt" label="区域" show-overflow-tooltip> </el-table-column>
              <!--<el-table-column prop="target" label="目标" width="70" show-overflow-tooltip> </el-table-column>-->
              <el-table-column prop="sendTime" label="发送时间" width="180"> </el-table-column>
              <el-table-column prop="sendCount" label="发送量" width="160"> </el-table-column>
              <el-table-column prop="feeOut" label="费用" width="160"> </el-table-column><!--
              <el-table-column prop="detailAddr" label="地址" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.codeName + ' ' + scope.row.detailAddr}}</template>
              </el-table-column>-->
              <el-table-column label="任务状态" width="135">
                <template slot-scope="scope">
                  <el-tag :type="tempList.arrList[scope.row.status].type">{{ tempList.arrList[scope.row.status].value }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    :type=" scope.row.status == 1 ? 'warning': 'success'"
                    @click="handleShow(scope.row)">{{ scope.row.status == 1 ? '审核':'查看'}}</el-button>
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
      <el-dialog :title="'信息' + (dialogInfo.info && dialogInfo.info.status == 1 ?'审核' : '查看')" size="tiny" :visible.sync="dialogInfo.show">
        <div class="dialogInfo">
          <p><span>行业</span><span>{{ dialogInfo.info && dialogInfo.info.industryTxt}}</span></p>
          <p><span>区域</span><span>{{dialogInfo.info && dialogInfo.info.areaNameTxt}}</span></p>
          <p><span>目标</span><span>{{dialogInfo.info && dialogInfo.info.target}}</span></p>
          <p><span>任务时间</span><span>{{dialogInfo.info && dialogInfo.info.sendTime}}</span></p>
          <p><span>模板</span><span>{{ dialogInfo.info && dialogInfo.info.templateTxt}}</span></p>
          <p><span>投放量</span><span>{{ dialogInfo.info && dialogInfo.info.sendCount}}</span></p>
          <p><span>费用</span><span>{{ dialogInfo.info && dialogInfo.info.feeOut}}</span></p>
          <p v-show="dialogInfo.info && dialogInfo.info.failedCause"><span>拒绝原因</span><span>{{ dialogInfo.info && dialogInfo.info.failedCause}}</span></p>
        </div>
        <div slot="footer" class="dialog-footer" v-show="dialogInfo.info && dialogInfo.info.status == 1">
          <el-button type="pink"  @click="handleShowReject(dialogInfo.info.id,4)">审核拒绝</el-button>
          <el-button type="success" @click="handleUpdate(dialogInfo.info.id,3)">审核通过</el-button>
        </div>
      </el-dialog>
      <prompt-select
        :show="prompt.flag"
        :options="prompt.options"
        :params = "prompt.params"
        @refuse="handleReject"
        @handleClose="handleClose"></prompt-select>
    </div>
</template>

<script>
    import { assTaskList,assTaskUpdate,assTaskDetail } from '@/api/assist-api'
    import PromptSelect from  '@/components/PromptSelect'
    export default {
        name: 'assistTaskCheck',
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
                { label:'待审核',value:1 },
                { label:'审核未通过',value:4 }
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
                  {key:7,value:"发送成功",type:'success'},
                  {key:8,value:"停用",type:'gray'},
                  {key:9,value:"发送失败",type:'gray'},
                  {key:10,value:"停用",type:'gray'},
                  {key:11,value:"发送失败",type:'danger'}
                ]
              },
              prompt:{
                flag:false,
                options:[
                  {
                    label:'企业信息不全',
                    value:1,
                    desc:'企业信息不全'
                  },{
                    label:'任务信息不全',
                    value:2,
                    desc:'任务信息不全'
                  },{
                    label:'余额不足',
                    value:3,
                    desc:'余额不足'
                  },{
                    label:'其他',
                    value:4,
                    desc:''
                  }
                ],
                params:null
              },
              dialogInfo:{
                show:false,
                info:null
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
              }
            }
        },
        components: {
          PromptSelect
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
            this.dialogFormVisible = true;
          },
          handleUpdate(id,status){
            this.$confirm('是否'+ (status == 3 ? '审核通过':'拒绝通过') +'此任务?', '提示', {
              confirmButtonText: status == 3 ?'审核通过':'拒绝通过',
              cancelButtonText: '取消',
              closeOnPressEscape:false,
              closeOnClickModal:false,
              type: 'warning'
            }).then(() => {
              this.listUpdate(id,status);
            }).catch(() => {});
          },

          handleReject(...args){
            this.prompt.flag = false;
            this.listUpdate(args[1].id,args[1].status,args[0].reason,args[0].desc);
          },

          handleShowReject(id,status){
            this.prompt.params={
              id,status
            };
            this.prompt.flag = true;
          },

          handleShow(item){
            let _data_ = {
              taskId:item.id
            };
            assTaskDetail(_data_).then( data =>{
              this.dialogInfo.info = item;
              this.$set(this.dialogInfo.info,'templateTxt','【'+ item.templateTxt +'】' + data.data.tempContent);
              this.dialogInfo.show = true;
            });
          },

          handleClose(){
            this.prompt.flag = false;
          },

          listUpdate(id,status,failedType,failedCause){
            let _data = {
              id,status,failedType,failedCause
            };
            assTaskUpdate(_data).then(data =>{
              this.$message({
                type: 'success',
                message: '状态更新成功'
              });
              this.dialogInfo.show = false;
              this.list(this.page.pageSize,this.page.pageIndex);
            })
          },

          list(pageSize,pageIndex){
            let _data={
              pageSize,
              pageIndex,
              dataType:1,
              orderCode: isNaN(this.searchData.key) ? '' : this.searchData.key ,
              enterpriseName:isNaN(this.searchData.key) ? this.searchData.key : '' ,
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
            dataType:1,
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
