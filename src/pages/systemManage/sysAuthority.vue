<template>
    <div class="sys-authority-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent"  :maxlength="10" placeholder="请输入关键字"></el-input>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>
            <el-button type="success" class="search-add"  @click="handleAdd()">新增</el-button>
          </div>
          <div class="search-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              height="400"
              border
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="权限编号" width="120"> </el-table-column>
              <el-table-column prop="name" label="权限名称" show-overflow-tooltip> </el-table-column>
<!--              <el-table-column prop="statusStr" label="权限状态" width="120">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'gray'">{{ scope.row.statusStr }}</el-tag>
                </template>
              </el-table-column>-->
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
              :current-page="page.currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <el-dialog :title='isEdit?"编辑权限":"新增权限"' size="tiny" :visible.sync="dialogFormVisible">
        <el-form :model="privilegeData" :rules="rules" ref="privilegeData">
          <el-form-item label="权限编号" :label-width="formLabelWidth" v-show="isEdit">
            <el-input v-model="privilegeData.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限名称" :label-width="formLabelWidth" required prop="name">
            <el-input v-model="privilegeData.name" class="wid_80" auto-complete="off" placeholder="请选择权限名称"></el-input>
          </el-form-item>
          <el-form-item label="权限资源" :label-width="formLabelWidth" required  placeholder="请选择权限资源">
            <el-button @click="setCheckedKeys()">选择资源</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave('privilegeData')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title='资源列表' size="tiny" :visible.sync="dialogTreedVisible">
        <el-form>
          <el-tree
            :data="$store.state.user.userInfo.accountType == 1 ? sourceUrl : authorityList"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps" :default-checked-keys="privilegeData.resource"
            >
          </el-tree>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTreedVisible = false">取 消</el-button>
          <el-button type="primary" @click="getCheckedKeys()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { privilegeList,privilegeSave,privilegeDelete,resourceList } from '@/api/system-api'
  import { mapState } from 'vuex'
  export default {
    name: 'sysAuthority',
    data () {
      return {
        searchData:{
          name:'',
          startTime:'',
          endTime:''
        },
        page:{
          pageSize:10,
          total:100,
          pageIndex: 1
        },
        tableData: [],
        sourceUrl:[],
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        multipleSelection: [],
        dialogFormVisible: false,
        dialogTreedVisible:false,
        isEdit:false,
        privilegeData: {
          id:'',
          name: '',
          resource: []
        },
        formLabelWidth: '100px',
        rules: {
          name: [
            { required: true, message: '请输入权限名称', trigger: 'blur' },
            { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    components: {},
    methods: {
      searchEvent(){
        this.list(this.page.pageSize,1)
      },
      addEvent(){},
      //状态显示

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

      //自定义事件
      handleEdit(index, row) {
        this.privilegeData={
            id:row.id,
            name: row.name,
            resource: row.resources.reduce((arr,item)=>{
               return (Array.isArray(arr) ? arr : arr.child).concat(item.child);
            },[]).map(item=>item.id)
        };
        this.isEdit=true;
        this.dialogFormVisible=true;
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除【'+row.name+'】角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let _data={
                id: row.id
            };
            privilegeDelete(_data).then(data=>{
                if(data.code==1){
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.list(this.page.pageSize,1);
                }
            });

        }).catch(() => {
          console.log('删除取消');
        });
      },
      handleAdd(){
        this.dialogFormVisible = true;
        this.isEdit=false;
        this.privilegeData={
          id:'',
          name: '',
          resource: []
        }
      },
      list(pageSize,pageIndex){
        let _data={
          pageSize,
          pageIndex,
          name:this.searchData.key
        };
        privilegeList(_data).then(data=>{
          this.tableData=data.data;
        });
      },
      handleSave(formName) {
        let _self=this;
        if(formName==='privilegeData'){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              privilegeSave(this.privilegeData).then(data=>{
                  if(data.code==1){
                      this.$message({
                        type: 'success',
                        message: '操作成功!'
                      });
                      this.dialogFormVisible=false;
                      this.privilegeData={
                        id:'',
                        name: '',
                        resource: []
                      };
                      this.list(this.page.pageSize,1);

                  }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }else{
          this.dialogTreedVisible=false;
          this.addOrganize.resource=_self.$refs.tree.getCheckedKeys();
        }
      },
      //清空树
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      getCheckedKeys() {
          this.privilegeData.resource=this.$refs.tree.getCheckedKeys(true);
          this.dialogTreedVisible=false;
      },
      setCheckedKeys() {
          this.dialogTreedVisible=true;
          if(this.$refs.tree){
            this.$refs.tree.setCheckedKeys(this.privilegeData.resource);
          }
      },
      //分页模块
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

    },
    computed: {
      ...mapState({
        authorityList:state => state.user.selectedRole.menuList
      })
    },
    created() {
        let _data={
          pageSize:this.page.pageSize,
          pageIndex: this.page.pageIndex,
          name:this.searchData.key
        };
        privilegeList(_data).then(data=>{
           this.tableData=data.data;
           this.page.total=data.total;
        });
        if(this.$store.state.user.userInfo.accountType == 1){
          resourceList().then((data)=>{;
            this.sourceUrl=data.data
          });
        }
    }
  }
</script>
