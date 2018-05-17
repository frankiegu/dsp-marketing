<template>
    <div class="sys-role-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="10" placeholder="请输入关键字"></el-input>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>
            <el-button type="success" class="search-add"  @click="handleAdd()">新增</el-button>
          </div>
          <div class="search-table">
            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="tableData"
              height="400"
              border
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="角色编号" width="180"> </el-table-column>
              <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="statusStr" label="角色状态" width="120">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'gray'">{{ scope.row.statusStr  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="210">
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
      <el-dialog :title='isEdit?"编辑角色":"新增角色"' size="tiny" :visible.sync="dialogFormVisible">
        <el-form :model="addRole" :rules="rules" ref="addRole">
          <el-form-item label="角色编号" :label-width="formLabelWidth" v-show="isEdit">
            <el-input v-model="addRole.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" :label-width="formLabelWidth" required prop="roleName" >
            <el-input v-model="addRole.roleName" class="wid_80" auto-complete="off" placeholder="请选择角色名称"></el-input>
          </el-form-item>
          <el-form-item label="所属组织" :label-width="formLabelWidth" required  prop="organizationId">
            <el-select v-model="addRole.organizationId"  filterable class="wid_80"  placeholder="请选择所属组织">
              <el-option :key="item.id" v-for="item in tempList.organization" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色权限" :label-width="formLabelWidth"  prop="privilege">
            <el-select v-model="addRole.privilege" filterable class="wid_80" :class="{ 'hei36' : !isEdit && addRole.privilege.length == 0 }" multiple  placeholder="请选择角色权限">
              <el-option :key="item.id" v-for="item in tempList.privilege" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('addRole')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { roleList,roleSave,roleModifyStatus,orgList,privilegeList } from '@/api/system-api'
  export default {
    name: 'sysRole',
    data () {
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
        isEdit:false,
        tempList:{
          privilege: '',
          organization: ''
        },
        addRole: {
          id:'',
          roleName: '',
          privilege: [],
          organizationId: ''
        },
        formLabelWidth: '100px',
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
          ],
          privilege: [
            {type: 'array', required: true, message: '请选择角色权限', trigger: 'blur' }
          ],
          organizationId: [
            { type: 'number',  required: true,  message: '请选择角色组织', trigger: 'blur' },
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
        this.addRole={
            id:row.id,
            roleName: row.roleName,
            privilege: row.privileges.map(item=>item.id),
            organizationId:row.organization.id
        };
        this.dialogFormVisible=true;
      },
      handleStop(index, row){
        this.$confirm('此操作将'+ (row.status == 5 ? '激活':'禁用') + '【'+row.roleName+'】角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            id:row.id,
            status:row.status==1 ? 5 : 1
          };
          roleModifyStatus(_data).then(data=>{
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
        this.$confirm('此操作将删除【'+row.roleName+'】角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            id:row.id,
            status:6
          };
          roleModifyStatus(_data).then(data=>{
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
        this.addRole={
          id:'',
          roleName: '',
          privilege: [],
          organizationId: ''
        }
      },

      //表单提交模块
      handleSubmit(formName) {
        let _self=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            roleSave(this.addRole).then(data=>{
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
        roleList(_data).then((data)=>{
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
      roleList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
        this.loading = false
      });

      let _params={
        pageSize:10000,
        pageIndex: 1,
        name:''
      };
      orgList(_params).then(data=>{
          this.tempList.organization= data.data && data.data.map(item=>{
              return{
                  id:item.id,
                  name:item.name
              }
          });
      });
      privilegeList(_params).then(data=>{
         this.tempList.privilege =  data.data && data.data.map(item=>{
           return{
             id:item.id,
             name:item.name
           }
         });
      })
    }
  }
</script>
