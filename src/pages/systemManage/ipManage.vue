<template>
    <div class="statistical-template-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-row :gutter="15">
              <el-col :span="5" :offset="5">
                <el-input :span="5" v-model="searchData.key"  placeholder="请输入IP"></el-input>
              </el-col>
              <el-col :span="5">
                <el-select v-model="searchData.categoryId" :span="5" placeholder="请选择类型" clearable filterable >
                  <el-option :label ="item.value" :value="item.type" v-for="item in columnCategoryList" :key="item.type"></el-option>
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
              <el-table-column prop="originalIp" label="IP"  show-overflow-tooltip> </el-table-column>
              <el-table-column prop="type" label="类型"  show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag :type="'success'" v-if="scope.row.type == 1">具体IP</el-tag>
                  <el-tag :type="'success'" v-else-if="scope.row.type == 2">范围IP</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTimeStr" label="创建时间" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="updateTimeStr" label="更新时间" show-overflow-tooltip> </el-table-column>
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
            <el-col :span="8">

                <el-button type="primary" style="margin-left:20px;position: relative">导入 Excel 文件
                  <input type="file" @change="handleFile"  style="cursor:pointer;opacity: 0;width:100%;height:100%;position: absolute;top:0;left:0;" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ref="inputfile" @click="inputFileClick('inputfile')">
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
            </el-col>
            <el-col :span="16" style="text-align: right">
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
      <el-dialog :title='isEdit?"编辑":"新增"' :visible.sync="dialogFormVisible">
        <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
          <el-row :rows="5">
          </el-row>
            <el-form-item label="IP" prop="name1" :label-width="formLabelWidth">
              <el-input v-model="addEditDialogForm.name1"  placeholder="请输入IP"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth">
              <el-select v-model="addEditDialogForm.name2"  placeholder="请选择类型" clearable filterable >
                <el-option :label="item.value" :value="item.type" v-for="item in columnCategoryList" :key="item.type"></el-option>
              </el-select>
            </el-form-item>
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
  import { ipList , ipDelete , ipRevoke  , ipSave  ,uploadExcel} from '@/api/system-api'
  export default {
    name: 'app',
        data () {
            return {
              loading2: true,//加载菊花
              searchData:{
                key:'',
                categoryId:'',
                status:''
              },
              addEditDialogForm:{
                name1:'',
                name2:'',
                name3:''
              },
              isEdit:true,
              Editindex:0,
              columnCategoryList:[{"type":1,"value":"具体IP"},{"type":2,"value":"范围IP"}],
              formLabelWidth:'80px',
              editDialogForm:'',
              dialogFormVisible:false,
              page:{},
              tableData:[],
              ruless: {
                name1:[
                  {required: false, message: '请输入ip', trigger: 'blur'}
                ],
                name2:[
                  {required: false, message: '请选择类型', trigger: 'blur'}
                ]
              },
            }
        },
        methods: {
          handleFile(e){
            let _data = new FormData();
            _data.append('uploadFile', e.target.files[0]);
            _data.append('tableName', e.target.files[0].name+"?hash="+parseInt(Math.random()*10000));
            let _self = this;
            uploadExcel(_data).then((data)=>{
              _self.loading2 = true;
              let data2 = {"ip":_self.searchData.key,"status":_self.searchData.status,"type":_self.searchData.categoryId,"currPage":1,"prePageResult":10};
              ipList(data2).then(function (res) {
                _self.loading2 = false;
                _self.tableData = res.data;
                _self.page={
                  pageSize: 10,
                  total: res.total,
                  currentPage: 1
                }

              });
              this.$message({
                showClose: true,
                message: 'Excel表上传成功！',
                type: 'success'
              });
            }).catch((res)=>{
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'warning'
              });
            });
          },
          submitForm(formName){
              let _self = this;
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  if(_self.isEdit){
                    let data = {"id":_self.tableData[_self.Editindex].id,"ip":_self.addEditDialogForm.name1,"type":_self.addEditDialogForm.name2};
                    ipSave(data).then(function (res) {
                      _self.$message({
                        type: 'success',
                        message: '编辑成功!'
                      });
                      _self.tableData[_self.Editindex].ip = res.data.ip;
                      _self.tableData[_self.Editindex].type = _self.addEditDialogForm.name2;
                      _self.tableData[_self.Editindex].createTimeStr = res.data.createTimeStr;
                      _self.tableData[_self.Editindex].updateTimeStr = res.data.updateTimeStr;

                      _self.dialogFormVisible = false;
                    })
                  }else{
                    let data = {"ip":_self.addEditDialogForm.name1,"type":_self.addEditDialogForm.name2};
                    ipSave(data).then(function (res) {
                      _self.$message({
                        type: 'success',
                        message: '新增成功!'
                      });
                      _self.loading2 = true;
                      let data = {"ip":_self.searchData.key,"status":_self.searchData.status,"type":_self.searchData.categoryId,"currPage":1,"prePageResult":_self.page.pageSize};
                      ipList(data).then(function (res) {
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
            _self.addEditDialogForm.name1 = _self.tableData[index].ip;
            _self.addEditDialogForm.name2 = _self.tableData[index].type;
            _self.Editindex = index;
          },
          addListEvent(name){
            let _self = this;
            setTimeout(function(){
              _self.isEdit = false;
              _self.dialogFormVisible = true;
              _self.addEditDialogForm.name1 = '';
              _self.addEditDialogForm.name2 = '';
            },200)
          },
          handleStop(index,row){
            let _self = this;
            let data = {"id":_self.tableData[index].id};
            if(_self.tableData[index].status===1){
              this.$confirm('此操作将禁用【' + row.ip + '】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                ipDelete(data).then(function(res){
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
              this.$confirm('此操作将激活【' + row.ip + '】, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                ipRevoke(data).then(function(res){
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
            _self.loading2 = true;
            let data = {"ip":_self.searchData.key,"status":_self.searchData.status,"type":_self.searchData.categoryId,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
            ipList(data).then(function (res) {
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
            let data = {"ip":_self.searchData.key,"status":_self.searchData.status,"type":_self.searchData.categoryId,"currPage":_self.page.currentPage,"prePageResult":val};
            ipList(data).then(function (res) {
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
            let data = {"ip":_self.searchData.key,"status":_self.searchData.status,"type":_self.searchData.categoryId,"currPage":val,"prePageResult":_self.page.pageSize};
            ipList(data).then(function (res) {
              _self.loading2 = false;
              _self.tableData = res.data;
              _self.page={
                pageSize: _self.page.pageSize,
                total: res.total,
                currentPage: val
              }

            });
          },
          //重置input file文件
          inputFileClick(inputFile){
              if(this.$refs[inputFile].value){
                 this.$refs[inputFile].value ='';
              }
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
          _self.loading2 = true;
          let data = {"ip":_self.searchData.key,"status":_self.searchData.status,"type":_self.searchData.categoryId,"currPage":1,"prePageResult":10};
            ipList(data).then(function (res) {
              _self.loading2 = false;
              _self.tableData = res.data;
              _self.page={
                pageSize: 10,
                total: res.total,
                currentPage: 1
              }

            });

        }

    }
</script>

<style lang="scss">

</style>
