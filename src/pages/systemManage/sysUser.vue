<template>
    <div class="sys-user-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="10" placeholder="请输入姓名"></el-input>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>
            <el-button type="success" class="search-add"  @click="handleAdd()">新增</el-button>
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
              <el-table-column prop="account" label="账号" width="120"> </el-table-column>
              <el-table-column prop="mobile" label="手机号" width="130"> </el-table-column>
              <el-table-column prop="name" label="姓名" width="160"> </el-table-column>
              <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
              <el-table-column prop="statusStr" label="账号状态" width="120">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'gray'">{{ scope.row.statusStr }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="290">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="small"
                    :type="scope.row.status === 1 ? 'gray' : 'success'"
                    @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                  <el-button
                    size="small"
                    type="pink"
                    @click="handleChange(scope.row)">修改密码</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      <el-dialog :title='isEdit?"编辑角色":"新增角色"'  size="tiny" :visible.sync="dialogFormVisible">
        <el-form :model="addUser" :rules="rules" ref="addUser">
          <el-form-item label="角色编号" :label-width="formLabelWidth" v-show="isEdit">
            <el-input v-model="addUser.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="账号名称" :label-width="formLabelWidth" required prop="account">
            <el-input v-model="addUser.account" :readonly="isEdit" :disabled="isEdit"  placeholder="请输入账号名称" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" :label-width="formLabelWidth"  prop="roles">
            <el-select v-model="addUser.roles" multiple class="wid_80"  placeholder="请选择用户角色">
              <el-option :key="item.id" v-for="item in tempList.roleList" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号密码" v-if="!isEdit" :label-width="formLabelWidth"  prop="passwd">
            <el-input type="password" v-model="addUser.passwd" class="wid_80" placeholder="请输入账号密码"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" :label-width="formLabelWidth">
            <el-input v-model="addUser.name" class="wid_80" auto-complete="off" placeholder="请输入用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="用户手机号" :label-width="formLabelWidth"  required  prop="mobile">
            <el-input v-model="addUser.mobile" class="wid_80" :maxlength="11" placeholder="请输入用户手机号"   auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="addUser.email" class="wid_80" placeholder="请输入用户邮箱"   auto-complete="off"></el-input>
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

    </div>
</template>

<script>
  import { userInformation,userSave,userList,userPassword,userModifyStatus,roleList } from '@/api/system-api'
  export default {
    name: 'sysUser',
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
            key:''
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
        dialogPassword:false,
        addUser: {
          id:'',
          account: '',
          passwd: '',
          name: '',
          roles: [],
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
            message: '账号已被冻结，请24小时后进行操作!'
          });
          return false;
        }
        this.$confirm('此操作将'+ (row.status == 5 ? '激活':'禁用') + '账户【'+ row.account +'】, 是否继续?', '提示', {
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
      handleAdd(){
        this.dialogFormVisible = true;
        this.isEdit=false;
        this.addUser ={
          id:'',
          account: '',
          passwd: '',
          name: '',
          roles: [],
          mobile: '',
          email: ''
        }
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

      list(pageSize,pageIndex){
        let _data={
          pageSize,
          pageIndex,
          name:this.searchData.key
        };
        userList(_data).then((data)=>{
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
        name:this.searchData.key
      };
      userList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
        this.loading = false
      });

      let _params={
        pageSize:10000,
        pageIndex: 1,
        name:''
      };
      roleList(_params).then(data=>{
        this.tempList.roleList=data.data.map(item=>{
          return{
            id:item.id,
            name:item.roleName
          }
        });
      });
    }
  }
</script>
