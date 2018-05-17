<template>
  <div class="public-number-info-container statistical-template-container" style="overflow: hidden">
    <div style="height:40px;margin-left: 10px;margin-top:10px;">
      <ul class="clearfix" style="border-bottom:3px solid #50BFFF">
        <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('publicNumberInfo')===-1" @click="$router.push('/home/publicNumberInfo/publicNumberInfo')">公众号配置</el-button>
        <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('publicNumberTemplate')===-1" @click="$router.push('/home/publicNumberInfo/publicNumberTemplate')">模板配置</el-button>
      </ul>
    </div>
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="2" :offset="22">
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
            <el-table-column prop="remark" label="备注"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="scene" label="场景" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="template" label="模板" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="templateId" label="模板ID" show-overflow-tooltip> </el-table-column>
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
          &nbsp

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
        <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.remark"  placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="模板" prop="template" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.template"  placeholder="请输入模板"></el-input>
        </el-form-item>
        <el-form-item label="模板ID" prop="templateId" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.templateId"  placeholder="请输入模板ID"></el-input>
        </el-form-item>
        <el-form-item label="场景" prop="scene" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.scene"  placeholder="请输入场景"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="url" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.url"  placeholder="请输入跳转地址"></el-input>
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
  import { wxlistTemplates , wxRevokeTemplate , wxDeleteTemplate  , wxSaveTemplate } from '@/api/assist-api'
  export default {
    name: 'app',
    data () {
      return {
        loading2: true,//加载菊花
        searchData:{
          key:'',
          categoryId:'',
          status:'',
          infoId:'',
          scene:''
        },
        addEditDialogForm:{
          infoId:this.$route.query.id,
          remark:'',
          scene:'',
          status:1,
          template:'',
          templateId:'',
          url:''
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:[{"type":1,"value":"具体IP"},{"type":2,"value":"范围IP"}],
        formLabelWidth:'120px',
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
      submitForm(formName){
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){

              let data = _self.addEditDialogForm;
              data.id = _self.tableData[_self.Editindex].id;
              wxSaveTemplate(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].remark = _self.addEditDialogForm.remark;
                _self.tableData[_self.Editindex].scene = _self.addEditDialogForm.scene;
                _self.tableData[_self.Editindex].template = _self.addEditDialogForm.template;
                _self.tableData[_self.Editindex].templateId = _self.addEditDialogForm.templateId;
                _self.tableData[_self.Editindex].url = _self.addEditDialogForm.url;

                _self.dialogFormVisible = false;
              })
            }else{
              let data = _self.addEditDialogForm;
              wxSaveTemplate(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"infoId":_self.searchData.infoId,"currPage":0,"pageSize":_self.page.pageSize};
                wxlistTemplates(data).then(function (res) {
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
        _self.addEditDialogForm.remark = _self.tableData[index].remark;
        _self.addEditDialogForm.scene = _self.tableData[index].scene;
        _self.addEditDialogForm.template = _self.tableData[index].template;
        _self.addEditDialogForm.templateId = _self.tableData[index].templateId;
        _self.addEditDialogForm.url = _self.tableData[index].url;
        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm.name1 = {
            infoId:this.$route.query.id,
            remark:'',
            scene:'',
            status:1,
            template:'',
            templateId:'',
            url:''
          };
        },200)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.remark + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            wxDeleteTemplate(data).then(function(res){
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
          this.$confirm('此操作将激活【' + row.remark + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            wxRevokeTemplate(data).then(function(res){
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
        let data = {"infoId":_self.searchData.infoId,"currPage":_self.page.currentPage-1,"pageSize":_self.page.pageSize};
        wxlistTemplates(data).then(function (res) {
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
        let data = {"infoId":_self.searchData.infoId,"currPage":_self.page.currentPage-1,"pageSize":val};
        wxlistTemplates(data).then(function (res) {
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
        let data = {"infoId":_self.searchData.infoId,"currPage":val-1,"pageSize":_self.page.pageSize};
        wxlistTemplates(data).then(function (res) {
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
      _self.searchData.infoId =this.$route.query.id;
      let data = {"infoId":_self.searchData.infoId,"currPage":0,"pageSize":10};
      wxlistTemplates(data).then(function (res) {
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




