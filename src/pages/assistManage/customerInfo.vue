<template>
    <div class="customer-info-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="11" placeholder="请输入手机号"></el-input>
            <el-select v-model="searchData.type" :span="5" placeholder="请选择类型" clearable filterable >
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
              <el-table-column prop="identityNo" label="登录账号"> </el-table-column>
              <el-table-column prop="mobile" label="账户类型" width="130">
                <template slot-scope="scope">
                   {{scope.row.identityType == 1 ? '注册用户': '微信用户'}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    v-if="scope.row.status == 10"
                    type="success"
                    @click="handleUpdate(scope.row.id,1)">激活</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleUpdate(scope.row.id,3)">删除</el-button>
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
    </div>
</template>

<script>
  import { customerList } from '@/api/assist-api'
  export default {
    name: 'customerInfo',
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
        loading:true,
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        columnType:[{ label:'注册用户',value:1 },{ label:'微信用户',value:2 }],
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
          roleList:[]
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
    components: {},
    methods: {
      searchEvent(){
        this.list(10,1);
      },


      handleUpdate(id,status){
        this.$message({
          type: 'warning',
          message: '功能开发中，请等待...'
        });
        return false;
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

      //自定义事件

      list(pageSize,pageIndex){
        let _data={
          pageSize,
          pageIndex,
          identityNo:this.searchData.key,
          identityType:this.searchData.type
        };
        customerList(_data).then((data)=>{
          if(data.code==1){
            this.tableData=data.data;
            this.page.total=data.total;
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
        pageIndex: this.page.pageIndex
      };
      customerList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
        this.loading = false
      });
    }
  }
</script>

<style lang="scss">

</style>
