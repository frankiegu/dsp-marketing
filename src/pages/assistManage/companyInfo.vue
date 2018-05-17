<template>
    <div class="company-info-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="10" placeholder="请输入企业名称"></el-input>
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
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="企业名称" width="120" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="mobile" label="电话" width="160"> </el-table-column>
              <el-table-column prop="fax" label="传真" width="160"> </el-table-column>
              <el-table-column prop="detailAddr" label="地址" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.codeName + ' ' + scope.row.detailAddr}}</template>
              </el-table-column>
              <el-table-column label="企业状态" width="125" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tooltip :disabled="scope.row.status != 11" :content="scope.row.failedCause" placement="top">
                       <el-tag :type="tempList.arrList[scope.row.status].type">{{ tempList.arrList[scope.row.status].value }}</el-tag>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="165">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    :disabled="scope.row.status == 11"
                    :type=" scope.row.status == 10 || scope.row.status == 2 ? 'success': 'warning'"
                    @click="handleUpdate(scope.row.id,scope.row.status == 10 || scope.row.status == 2 ? 0 : 2)">{{ scope.row.status == 10 || scope.row.status == 2 ? '激活': '禁用' }}</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    :disabled="scope.row.status == 11 || scope.row.status == 1 || scope.row.status == 2"
                    @click="handleShowReject(scope.row.id,11)">拒绝通过</el-button>
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
      <el-dialog title="信息审核" size="tiny" :visible.sync="companyCheck.show">
        <div class="dialogInfo" v-if="companyCheck.info">
          <p v-for="[key,value] in Object.entries(companyCheck.info)" v-show=" companyCheck.info && companyCheck.name[key] && value">
            <span>{{ companyCheck.name[key] }}</span>
            <span>{{ value }}</span>
          </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="companyCheck.show = false">取消</el-button>
          <el-button type="success" :disabled="!!!companyCheck.info" @click="handleUpdate(companyCheck.info.id,1)">激活</el-button>
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
    import { companyList,companyStatus,entityInfo } from '@/api/assist-api'
    import PromptSelect from  '@/components/PromptSelect'
    export default {
      name: 'companyInfo',
      data () {
        return {
          searchData:{
            key:'',
            type:''
          },
          page:{
            pageSize:10,
            total:100,
            pageIndex: 1
          },
          columnType:[ //1=激活(审核通过)；2=黑名单; 3=删除标记; 10=未审核
            { label:'审核通过',value:1 },
            { label:'审核未通过',value:11 },
            { label:'禁用',value:2 },
            { label:'未审核',value:10 }
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
            arrList:[ //（1=激活(审核通过)；2=禁用; 3=删除标记; 10=未审核;11=审核未通过）    ，增加审核未通过
              {key:0,value:"初始",type:'gray'},
              {key:1,value:"已审核",type:'success'},
              {key:2,value:"禁用",type:'gray'},
              {key:3,value:"已审核",type:'success'},
              {key:4,value:"审核未通过",type:'danger'},
              {key:5,value:"待发送",type:'warning'},
              {key:6,value:"发送中",type:'primary'},
              {key:7,value:"发送成功",type:'success'},
              {key:8,value:"停用",type:'gray'},
              {key:9,value:"发送失败",type:'gray'},
              {key:10,value:"待审核",type:'warning'},
              {key:11,value:"审核未通过",type:'danger'}
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
          companyCheck:{
            show:false,
            info:null,
            name:{
              name:'企业名',
              shopName:'商户名',
              codeName:'地址',
              detailAddr:'详细地址',
              mobile:'联系电话',
              fax:'传真'
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
          this.dialogFormVisible=true;
        },
        handleUpdate(id,status,failedType,failedCause){
            if(status == 0){
              entityInfo({ enterpriseId:id }).then( data => {
                this.companyCheck.show = true;
                if(data.data){
                  this.companyCheck.info = data.data;
                }else{
                  this.companyCheck.info = null;
                }
              }).catch( err => {
                this.companyCheck.info = null;
              });
              return false;
            }
            let _data = {
                id,status,failedType,failedCause
            };
            companyStatus(_data).then(data =>{
              this.$message({
                type: 'success',
                message: '状态更新成功!'
              });
              this.companyCheck.show = false;
              this.list(this.page.pageSize,this.page.pageIndex);
            })
        },

        handleReject(...args){
          this.prompt.flag = false;
          this.handleUpdate(args[1].id,args[1].status,args[0].reason,args[0].desc);
        },

        handleShowReject(id,status){
          this.prompt.params={
            id,status
          };
          this.prompt.flag = true;
        },

        handleClose(){
          this.prompt.flag = false;
        },

        list(pageSize,pageIndex){
          let _data={
            pageSize,
            pageIndex,
            name:this.searchData.key,
            status:this.searchData.type
          };
          companyList(_data).then((data)=>{
            if(data.code==1){
              this.tableData=data.data;
              this.page.total=data.total;
              this.page.pageIndex = pageIndex;
              this.page.pageSize = pageSize;
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
          key:this.searchData.key
        };
        companyList(_data).then(data=>{
          this.tableData=data.data;
          this.page.total=data.total;
          this.loading = false
        });
      }
    }
</script>
