<template>
    <div class="config-container">
      <el-row>
        <el-col>
          <div class="search-container">
<!--            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="10" placeholder="请输入姓名"></el-input>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>-->
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
              <el-table-column prop="type" label="类型" width="120"> </el-table-column>
              <el-table-column label="配置项<key:value>" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.key }}:<span class="text-main">{{ scope.row.value }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="small"
                    :type="scope.row.status === 1 ? 'warning' : 'success'"
                    @click="handleStop(scope.$index, scope.row)">{{scope.row.status == 1 ? '禁用' : '激活'}}</el-button>
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
      <el-dialog :title='configForm.isEdit?"编辑配置":"新增配置"'  size="tiny" :visible.sync="configForm.dialogFormVisible">
        <el-form :model="configItem" :rules="rules" ref="configItem">
          <el-form-item label="类型" :label-width="configForm.formLabelWidth" prop="label">
            <el-select v-model="configItem.label" class="wid_80"  placeholder="请选择类型" >
              <el-option :key="index" v-for="(item,index) in configForm.list" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置值" :label-width="configForm.formLabelWidth" prop="value">
            <el-input type="textarea" v-model="configItem.value" class="wid_80" placeholder="请输入配置值"  auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="configForm.dialogFormVisible = false">取 消</el-button>
          <el-button type="pink" @click="handleSubmit('configItem')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { configList,configSave,listItems,configUpdate } from '@/api/assist-api'
  export default {
    name: 'configAssist',
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

        configItem: {
          id:0,
          label:'',
          key:'',
          value:'',
          type:''
        },
        configForm:{
          dialogFormVisible: false,
          isEdit:false,
          list:[],
          formLabelWidth: '100px'
        },
        rules: {
          label: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          values: [
            { required: true, message: '请输入配置值', trigger: 'blur' }
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
        this.configForm.isEdit=true;
        this.configItem={
          id:row.id,
          label:row.key + '_' + row.type,
          key:row.key,
          value:row.value ,
          type:row.type
        };
        this.configForm.dialogFormVisible=true;
      },
      handleStop(index, row){
        if(row.status==10){
          this.$message({
            type: 'error',
            message: '账号已被冻结，请24小时后进行操作!'
          });
          return false;
        }
        this.$confirm('此操作将'+ (row.status == 2 ? '激活':'禁用') + '配置【'+ row.type +'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            id:row.id,
            status:row.status==2 ? 1 : 2
          };
          configUpdate(_data).then(data=>{
            this.$message({
              type: 'success',
              message: (row.status == 2 ? '激活':'禁用') + '成功!'
            });
            this.list(this.page.pageSize,1);
          });
        }).catch(() => {
          console.log('禁用取消');
        });
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除配置【'+row.type+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            id:row.id,
            status:3
          };
          configUpdate(_data).then(data=>{
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
      handleChange(item){
          console.log(item)
      },
      handleAdd(){
        this.configForm.dialogFormVisible = true;
        this.configForm.isEdit=false;
        this.configItem={
          id:0,
          label:'',
          key:'',
          value:'',
          type:''
        };
      },
      //表单提交模块
      handleSubmit(formName) {
        let _self=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.configItem.type = this.configItem.label.split('_')[1];
            this.configItem.key = this.configItem.label.split('_')[0];
            configSave(this.configItem).then(data=>{
              _self.$message({
                type: 'success',
                message: '保存成功!'
              });
              this.configForm.dialogFormVisible=false;
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
        configList(_data).then((data)=>{
          if(data.code==1){
            this.tableData=data.data;
            this.page.total=data.total;
            this.page.pageSize = pageSize;
            this.page.currentPage = data.currentPage;
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
      configList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
        this.loading = false
      });
      listItems().then(data => {
        this.configForm.list = data.data.map( item => {
            return {
                name:item.name,
                key:item.key + '_' + item.type,
            }
        })
      });
    }
  }
</script>

