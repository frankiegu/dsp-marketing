<template>
    <div class="statistical-template-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-row :gutter="15">
              <el-col :span="5" :offset="5">
                <el-input :span="5" v-model="searchData.key"  placeholder="请输入名称"></el-input>
              </el-col>
              <el-col :span="5">
                <el-select v-model="searchData.categoryId" :span="5" placeholder="请选择分类" clearable filterable >
                  <el-option :label ="item.remark" :value="item.id" v-for="item in columnCategoryList" :key="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select v-model="searchData.status" :span="5" placeholder="请选择状态" clearable filterable >
                  <el-option :label="'不可用'" :value="0"></el-option>
                  <el-option :label="'可用'" :value="1"></el-option>
                </el-select>
              </el-col>
              <el-col :span="2">
                <el-button :span="2" type="button" class="search-btn" @click="searchEvent">查询</el-button>
              </el-col>
              <el-col :span="2">
                <el-button :span="2" type="success" class="search-add"  @click="addListEvent('editDialogForm')">新增</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="search-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              v-loading="loading2"
              element-loading-text="拼命加载中"
              height="400"
              border
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column type="selection" width="45"></el-table-column>
              <el-table-column prop="id" label="#"  show-overflow-tooltip> </el-table-column>
              <el-table-column prop="name" label="名称"  show-overflow-tooltip> </el-table-column>
              <el-table-column prop="categoryName" label="分类"  show-overflow-tooltip> </el-table-column>
              <el-table-column prop="displayName" label="描述" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="remark" label="默认值" show-overflow-tooltip> </el-table-column>
              <el-table-column label="操作"  show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    :disabled= "scope.row.status==1?false:true"
                    @click="handleEdit('editDialogForm', scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="small"
                    :type="scope.row.status === 1 ? 'gray' : 'success'"
                    @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-row>
            <el-col>
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
        </el-col>
      </el-row>
      <el-dialog :title='isEdit?"新增":"编辑"' :visible.sync="dialogFormVisible">
        <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
          <el-row :rows="5">
            <!--<el-col :span="19">-->
              <!--<div style="height:2px"></div>-->
            <!--</el-col>-->
            <!--<el-col :span="5">-->
              <!--<el-button  :span="5" class="editPbtn" type="primary" icon="plus" @click="editPbtnParam">添加分列</el-button>-->
              <!--&lt;!&ndash;<el-button class="addPbtn" type="primary" icon="edit" @click="selectParam">编辑分列</el-button>&ndash;&gt;-->
            <!--</el-col>-->
          </el-row>
            <el-form-item label="名称" prop="name1" :label-width="formLabelWidth">
              <el-input v-model="addEditDialogForm.name1"  placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="分类" :label-width="formLabelWidth">
              <el-select v-model="addEditDialogForm.name2"  placeholder="请选择分类" clearable filterable >
                <el-option :label="item.remark" :value="item.id" v-for="item in columnCategoryList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="描述" prop="name3" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.name3"  placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="默认值" prop="name4" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.name4"  placeholder="请输入描述"></el-input>
          </el-form-item>
            <!--<el-input placeholder="请输入内容" v-model="addEditDialogForm.key">-->
              <!--<el-select v-model="addEditDialogForm.type" slot="prepend" placeholder="请选择" clearable filterable >-->
                <!--<el-option label="餐厅名" value="1"></el-option>-->
                <!--<el-option label="订单号" value="2"></el-option>-->
                <!--<el-option label="用户电话" value="3"></el-option>-->
              <!--</el-select>-->
              <!--<el-button slot="append" icon="delete">删除</el-button>-->
            <!--</el-input>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('editDialogForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { columnList , columnDelete , columnRevoke , columnCategoryList , columnSave  } from '@/api/statisticalManage/statisticalManage-api'

  export default {
        name: 'app',
        data () {
            return {
              loading2:true,
              searchData:{
                key:'',
                categoryId:'',
                status:''
              },
              addEditDialogForm:{
                name1:'',
                name2:'',
                name3:'',
                name4:''
              },
              isEdit:true,
              Editindex:0,
              columnCategoryList:{},
              formLabelWidth:'80px',
              editDialogForm:'',
              dialogFormVisible:false,
              page:{},
              templateTypeList: ['营销模板', '订购通知', '二次验证模板', '失败通知', '成功通知'],
              tableData:[],
              ruless: {
                name1:[
                  {required: false, message: '请输入名称', trigger: 'blur'}
                ],
                name2:[
                  {required: false, message: '请输入分类', trigger: 'blur'}
                ],
                name3:[
                  {required: false, message: '请输入描述', trigger: 'blur'}
                ]
              },
            }
        },
        methods: {
          submitForm(formName){
              let _self = this;
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  if(_self.isEdit){
                    let data = {"id":_self.tableData[_self.Editindex].id,"remark":_self.addEditDialogForm.name4,"name":_self.addEditDialogForm.name1,"displayName":_self.addEditDialogForm.name3,"categoryId":_self.addEditDialogForm.name2};
                    columnSave(data).then(function (res) {
                      _self.$message({
                        type: 'success',
                        message: '编辑成功!'
                      });
                      _self.tableData[_self.Editindex].categoryName = res.data.categoryName;
                      _self.tableData[_self.Editindex].displayName = _self.addEditDialogForm.name3;
                      _self.tableData[_self.Editindex].name = _self.addEditDialogForm.name1;
                      _self.tableData[_self.Editindex].categoryId = _self.addEditDialogForm.name2;
                      _self.tableData[_self.Editindex].remark= _self.addEditDialogForm.name4;
                      _self.dialogFormVisible = false;

                    })
                  }else{
                    let data = {"name":_self.addEditDialogForm.name1,"remark":_self.addEditDialogForm.name4,"displayName":_self.addEditDialogForm.name3,"categoryId":_self.addEditDialogForm.name2};
                    columnSave(data).then(function (res) {
                      _self.$message({
                        type: 'success',
                        message: '新增成功!'
                      });
                      _self.loading2 = true;
                      let data = {"name":_self.searchData.key,"categoryId":_self.searchData.categoryId,"status":_self.searchData.status,"currPage":1,"prePageResult":_self.page.pageSize};
                      columnList(data).then(function (res) {
                        _self.loading2 = false;
                        _self.tableData = res.data;
                        _self.page={
                          pageSize: _self.page.pageSize,
                          total: res.total,
                          currentPage: 1
                        }
                      });
                      _self.dialogFormVisible = false;
                    })
                  }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          handleEdit(name,index,row){
            let _self = this;
            _self.isEdit = true;
            _self.dialogFormVisible = true;
            _self.addEditDialogForm.name1 = _self.tableData[index].name;
            _self.addEditDialogForm.name3 = _self.tableData[index].displayName;
            _self.addEditDialogForm.name2 = _self.tableData[index].categoryId;
            _self.addEditDialogForm.name4 = _self.tableData[index].remark;

            _self.Editindex = index;
          },
          addListEvent(name){
            let _self = this;
            setTimeout(function(){
              _self.isEdit = false;
              _self.dialogFormVisible = true;
              _self.addEditDialogForm.name1 = '';
              _self.addEditDialogForm.name2 = '';
              _self.addEditDialogForm.name3 = '';
              _self.addEditDialogForm.name4 = '';
//              _self.$refs[name].resetFields()
            },200)
          },
          handleStop(index,row){
            let _self = this;
            let data = {"id":_self.tableData[index].id};
            if(_self.tableData[index].status===1){
              this.$confirm('此操作将禁用【' + row.name + '】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                columnDelete(data).then(function(res){
                  if (res.success) {
                    _self.$message({
                      type: 'success',
                      message: '禁用成功!'
                    });
                    _self.tableData[index].status = 0
                  } else {
                    _self.$message({
                      type: 'warning',
                      message: res.msg
                    });
                  }
                }).catch((res)=>{
                  _self.$message({
                    type: 'warning',
                    message: res.msg
                  });
                });
              })

            }else{
              this.$confirm('此操作将激活【' + row.name + '】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                columnRevoke(data).then(function(res){
                  _self.$message({
                    type: 'success',
                    message: '激活成功!'
                  });
                }).catch((res)=>{
                  _self.$message({
                    type: 'warning',
                    message: res.msg
                  });
                });
                _self.tableData[index].status = 1

              })
            }

          },
          searchEvent(){
            let _self = this;
            let data = {"name":_self.searchData.key,"categoryId":_self.searchData.categoryId,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
            _self.loading2 = true;
            columnList(data).then(function (res) {
              _self.loading2 = false;
              _self.tableData = res.data;
              _self.page={
                pageSize: _self.page.pageSize,
                total: res.total,
                currentPage: 1
              }
            });
          },
          handleSizeChange(val){
            let _self = this;
            _self.loading2 = true;
            let data = {"name":_self.searchData.key,"categoryId":_self.searchData.categoryId,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
            columnList(data).then(function (res) {
              _self.loading2 = false;
              _self.tableData = res.data;
              _self.page={
                pageSize: val,
                total: res.total,
                currentPage: _self.page.currentPage
              }
            });
          },
          handleCurrentChange(val){
            let _self = this;
            _self.loading2 = true;
            let data = {"name":_self.searchData.key,"categoryId":_self.searchData.categoryId,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
            columnList(data).then(function (res) {
              _self.loading2 = false;
              _self.tableData = res.data;
              _self.page={
                pageSize: _self.page.pageSize,
                total: res.total,
                currentPage: val
              }

            });
          },
          editPbtnParam(){
              alert( '添加参数');

          },
          selectParam(){
            alert( '选择参数')
          },
        },
        computed: {
          ...mapState({
            account:state=>state.user.userInfo.account
          })
        },
        created() {
          let _self = this;
          let data = {"name":_self.searchData.key,"categoryId":_self.searchData.categoryId,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
            columnList(data).then(function (res) {
              _self.loading2 = false;
              _self.tableData = res.data;
              _self.page={
                pageSize: 10,
                total: res.total,
                currentPage: 1
              }

            }).catch(function(res){
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            });
          let data2 = {"currPage":1,"prePageResult":1000};
          columnCategoryList(data2).then(function(res){
            _self.columnCategoryList = res.data;
          })

        }

    }
</script>

<style lang="scss">

</style>
