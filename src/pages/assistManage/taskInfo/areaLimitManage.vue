<template>

  <div class="task-info-container statistical-template-container" style="overflow: hidden">
    <task-info-nav></task-info-nav>
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
              <el-input :span="5" v-model="searchData.cityName"  placeholder="请输入名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.status" style="width:100%;" placeholder="请选择状态" clearable filterable >
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
            <el-table-column prop="cityName" label="名称"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="cityId" label="城市ID"  show-overflow-tooltip> </el-table-column>
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
            <div>&nbsp</div>

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
        <el-form-item label="选择省份" :label-width="formLabelWidth">
          <el-button style="width:100%" @click="selectTemplate2">{{addSmsTemplate.cityId?addSmsTemplate.cityId+'：'+addSmsTemplate.cityName:'请选择省份'}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editDialogForm')">确 定</el-button>
      </div>
    </el-dialog>



    <!--选择行业-->
    <el-dialog :title="'添加参数'"  :visible.sync="addDialogParamVisible2">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请地区名称" v-model="searchParamItemData2"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem2">搜索</el-button>
        </el-col>
      </el-row>
      <el-button  class="selctParams" type="primary" style="margin-bottom: 15px;margin-right:15px;margin-left: 0px;" v-for="(item,index) in smsParamsList2" :key="item.id" @click.stop="addParamItem2(index,'editParam',$event)">
        {{ item.id }}：<em style="color:chartreuse">{{ item.name }}</em>
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="14">
            <el-col :span="19" >
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChangeParam2"
                :total="pageparam2.total"
                :current-page="pageparam2.currentPage"
                :page-size ="pageparam2.pageSize">
              </el-pagination>
            </el-col>
            <el-col :span="1">

            </el-col>
          </el-col>
          <el-col :span="10">
            <el-button @click="addDialogParamVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogParamVisible = false">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--选择行业-->
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { orgCityList , orgCityDelete , orgCityRevoke  , orgCitySave ,cityList } from '@/api/assist-api'
  import taskInfoNav from "@/components/taskInfoNav";
  export default {
    components: {taskInfoNav},
    name: 'app',
    data () {
      return {
        pageparam2:{},
        smsParamsList2:'',
        searchParamItemData2:'',
        addDialogParamVisible2:false,
        value3:[new Date(2018, 1, 10, 8, 40), new Date(2018, 1, 10, 9, 40)],
        loading2: true,//加载菊花
        searchData:{
          status:'',
          cityName:''
        },
        addSmsTemplate: {
          cityName: '',
          cityId: ''
        },
        addEditDialogForm:{
          code:'',
          interval:'',
          name:''
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:[{"type":1,"value":"具体IP"},{"type":2,"value":"范围IP"}],
        dataList:[],
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
      handleCurrentChangeParam2(val){
        let _self = this;
        let data = {"name":_self.searchParamItemData2,"depth":2,"orgCode":_self.orgCode,"status":1, "currPage": val, "prePageResult": 12};
        cityList(data).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2 = {
            pageSize:12,
            total:res.total,
            currentPage:1
          }
        })
      },

      selectTemplate2(){
        let _self= this;
        _self.addDialogParamVisible2 = true;
        let dataParam = {"name":_self.searchParamItemData2,"depth":2,"orgCode":_self.orgCode,"status":1, "currPage": 1, "prePageResult": 12};
        cityList(dataParam).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2 = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
        })
      },
      addParamItem2(index,formName,ev){
        let _self = this;
        _self.addSmsTemplate.cityName = _self.smsParamsList2[index].name;
        _self.addSmsTemplate.cityId = _self.smsParamsList2[index].id;
        _self.addDialogParamVisible2 = false;
      },
      searchParamItem2(){
        let _self =this;
        let dataParam = {"name":_self.searchParamItemData2,"depth":2,"orgCode":_self.orgCode,"status":1, "currPage": 1, "prePageResult": 12};
        cityList(dataParam).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2 = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
        })
      },
      submitForm(formName){
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){
              let data = {"id":_self.tableData[_self.Editindex].id,"orgCode":_self.orgCode,"cityId":_self.addSmsTemplate.cityId	,"cityName":_self.addSmsTemplate.cityName	};
              orgCitySave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].cityId = _self.addSmsTemplate.cityId;
                _self.tableData[_self.Editindex].cityName = _self.addSmsTemplate.cityName;
                _self.dialogFormVisible = false;
              })
            }else{
              let data = {"orgCode":_self.orgCode,"cityId":_self.addSmsTemplate.cityId	,"cityName":_self.addSmsTemplate.cityName};
              orgCitySave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"cityName":_self.searchData.cityName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":1,"prePageResult":_self.page.pageSize};
                orgCityList(data).then(function (res) {
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
        _self.addSmsTemplate.cityName =_self.tableData[index].cityName;
        _self.addSmsTemplate.cityId =_self.tableData[index].cityId;
        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addSmsTemplate={
            cityName:'',
            cityId:''
          }
        },200)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.cityName + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            orgCityDelete(data).then(function(res){
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
          this.$confirm('此操作将激活【' + row.cityName + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            orgCityRevoke(data).then(function(res){
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
        let data = {"cityName":_self.searchData.cityName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        orgCityList(data).then(function (res) {
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
        let data = {"cityName":_self.searchData.cityName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        orgCityList(data).then(function (res) {
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
        let data = {"cityName":_self.searchData.cityName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        orgCityList(data).then(function (res) {
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
        account:state=>state.user.userInfo.account,
        orgCode:state=>state.user.userInfo.orgCode,
      })
    },
    created() {
      let _self = this;
      _self.loading2 = true;
      let data = {"cityName":_self.searchData.cityName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      orgCityList(data).then(function (res) {
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
