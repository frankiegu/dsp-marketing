<template>
  <div class="task-industry-scale-container statistical-template-container" style="overflow: hidden">
    <task-info-nav></task-info-nav>
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="5">
              <el-input :span="5" v-model="searchData.code" placeholder="请输入行业名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input :span="5" v-model="searchData.interval"  placeholder="请输入地区名称"></el-input>
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
            <el-table-column prop="areaName" label="地区"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="industryName" label="行业"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="amount" label="规模" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="showAmount" label="规模范围" show-overflow-tooltip> </el-table-column>
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
        <el-form-item label="地区" prop="dayInterval" :label-width="formLabelWidth">

          <el-cascader
            v-model="selectedOptions3"
            style="width:100%"
            placeholder="请选择地区"
            :props="props"
            :options="options"
            @change="areaChange"
            filterable
          ></el-cascader>

        </el-form-item>
        <el-form-item label="选择行业" :label-width="formLabelWidth">
          <el-button style="width:100%" @click="selectTemplate2">{{addSmsTemplate.industId?addSmsTemplate.industId+'：'+addSmsTemplate.industName:'请选择行业'}}</el-button>
        </el-form-item>
        <el-form-item label="行业规模" :label-width="formLabelWidth" >
          <el-input v-model="addEditDialogForm.amount" placeholder="请输入行业规模"></el-input>
        </el-form-item>
        <el-form-item label="规模范围" :label-width="formLabelWidth" >
          <el-input v-model="addEditDialogForm.showAmount" placeholder="请输入规模范围"></el-input>
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
          <el-input placeholder="请输入行业名称" v-model="searchParamItemData2"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem2">搜索</el-button>
        </el-col>
      </el-row>
      <el-button  class="selctParams" type="primary" style="margin-bottom: 15px;margin-right:15px;margin-left: 0px;" v-for="(item,index) in smsParamsList2" :key="item.id" @click.stop="addParamItem2(index,'editParam',$event)">
        {{ item.id }}：<em style="color:chartreuse">{{ item.insName }}</em>
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
  import { areaList , areaDelete , areaRevoke  , areaSave  ,orgIndustryList ,orgCityView , cityGet } from '@/api/assist-api'
  import taskInfoNav from "@/components/taskInfoNav";
  export default {
    components: {taskInfoNav},
    name: 'app',
    data () {
      return {
        selectedOptions3: [],
        props:{
          value: 'id',
          label:'name',
          children: 'child'
        },
        options:[],
        value3:[new Date(2018, 1, 10, 8, 40), new Date(2018, 1, 10, 9, 40)],
        loading2: true,//加载菊花
        searchData:{
          interval:'',
          code:'',
          status:'',
          insName:''

        },
        addEditDialogForm:{
          code:'',
          interval:'',
          industryId:'',
          areaId:'',
          industryName:'',
          areaName:[],
          amount:'',
          areaIds:'',
          showAmount:''
        },
        isEdit:true,
        Editindex:0,
        pageparam2:{},
        smsParamsList2:'',
        searchParamItemData2:'',
        addSmsTemplate: {
          industId: '',
          industName: '',
        },
        addDialogParamVisible2:false,
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
      areaChange(val){
          console.log(val);
          let _self = this;
          if(val.length>2){
            _self.addEditDialogForm.areaIds = val[0]+','+val[1]+','+val[2];
            _self.addEditDialogForm.areaId = val[2];
            cityGet({id:val[0]}).then((res)=>{
              _self.addEditDialogForm.areaName = res.data.name;
              cityGet({id:val[1]}).then((ress)=>{
                  if(ress.data.name!==res.data.name){
                    _self.addEditDialogForm.areaName += "-" +ress.data.name;
                  }
                cityGet({id:val[2]}).then((resss)=>{
                  if(resss.data.name!==ress.data.name) {
                    _self.addEditDialogForm.areaName += "-" + resss.data.name;
                  }
                })
              })
            });
          }
      },
      handleCurrentChangeParam2(val){
        let _self = this;
        let data = {"insName":_self.searchParamItemData2,"insCode":'',"orgCode":_self.orgCode,"status":1, "currPage": val, "prePageResult": 12};
        orgIndustryList(data).then(function (res) {
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
        let dataParam = {"insName":_self.searchParamItemData2,"insCode":'',"orgCode":_self.orgCode,"status":1, "currPage": 1, "prePageResult": 12};
        orgIndustryList(dataParam).then(function (res) {
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
        this.addSmsTemplate.industId = _self.smsParamsList2[index].insId;
        this.addSmsTemplate.industName = _self.smsParamsList2[index].insName;
        this.addDialogParamVisible2 = false;
      },
      searchParamItem2(){
        let _self =this;
        let dataParam = {"insName":_self.searchParamItemData2,"insCode":'',"orgCode":_self.orgCode,"status":1, "currPage": 1, "prePageResult": 12};
        orgIndustryList(dataParam).then(function (res) {
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
              let data = {"id":_self.tableData[_self.Editindex].id,"orgCode":_self.orgCode,"industryId":_self.addSmsTemplate.industId	,"industryName":_self.addSmsTemplate.industName	,"areaId":_self.addEditDialogForm.areaId	,"areaName":_self.addEditDialogForm.areaName	,"amount":_self.addEditDialogForm.amount	,"areaIds":_self.addEditDialogForm.areaIds,"showAmount":_self.addEditDialogForm.showAmount};
              areaSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].industryId = res.data.industryId;
                _self.tableData[_self.Editindex].industryName = res.data.industryName;
                _self.tableData[_self.Editindex].areaId = res.data.areaId;
                _self.tableData[_self.Editindex].areaName = res.data.areaName;
                _self.tableData[_self.Editindex].amount = res.data.amount;
                _self.dialogFormVisible = false;
              })
            }else{
              let data = {"industryId":_self.addSmsTemplate.industId	,"orgCode":_self.orgCode,"industryName":_self.addSmsTemplate.industName	,"areaId":_self.addEditDialogForm.areaId	,"areaName":_self.addEditDialogForm.areaName	,"amount":_self.addEditDialogForm.amount	,"areaIds":_self.addEditDialogForm.areaIds,"showAmount":_self.addEditDialogForm.showAmount};
              areaSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"industryName":_self.searchData.code,"orgCode":_self.orgCode,"areaName":_self.searchData.interval,"status":_self.searchData.status,"currPage":1,"prePageResult":_self.page.pageSize};
                areaList(data).then(function (res) {
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
        _self.addSmsTemplate.industId = _self.tableData[index].industryId;
        _self.addSmsTemplate.industName = _self.tableData[index].industryName;
        _self.addEditDialogForm.amount = _self.tableData[index].amount;
        _self.addEditDialogForm.showAmount = _self.tableData[index].showAmount;
        _self.addEditDialogForm.areaName =_self.tableData[index].areaName;
        _self.selectedOptions3 =_self.tableData[index].areaIds&&_self.tableData[index].areaIds.indexOf(",")>-1?_self.tableData[index].areaIds.split(",").map(function(data){
          return +data;
        }):[];
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.areaId =_self.tableData[index].areaId;
        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){

          _self.addEditDialogForm={
            code:'',
            interval:'',
            industryId:'',
            areaId:'',
            industryName:'',
            areaName:'',
            amount:'',
            areaIds:''
          };
          _self.selectedOptions3 =[];
          _self.addSmsTemplate = {
            industId: '',
            industName: '',
          }
          _self.isEdit = false;
          _self.dialogFormVisible = true;
        },200)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            areaDelete(data).then(function(res){
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
          this.$confirm('此操作将激活【' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            areaRevoke(data).then(function(res){
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
        let data = {"industryName":_self.searchData.code,"orgCode":_self.orgCode,"areaName":_self.searchData.interval,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        areaList(data).then(function (res) {
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
        let data = {"industryName":_self.searchData.code,"orgCode":_self.orgCode,"areaName":_self.searchData.interval,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        areaList(data).then(function (res) {
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
        let data = {"industryName":_self.searchData.code,"orgCode":_self.orgCode,"areaName":_self.searchData.interval,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        areaList(data).then(function (res) {
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
        orgCode:state=>state.user.userInfo.orgCode

      })
    },
    created() {
      let _self = this;
      _self.loading2 = true;
      let data = {"industryName":_self.searchData.code,"areaName":_self.searchData.interval,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      areaList(data).then(function (res) {
        _self.loading2 = false;
        _self.tableData = res.data;
        _self.page={
          pageSize: 10,
          total: res.total,
          currentPage: 1
        }
      });
      orgCityView({orgCode:_self.orgCode}).then((res)=>{
          _self.options = res.data;
      })
    }

  }
</script>

<style lang="scss">

</style>
