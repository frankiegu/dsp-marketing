<template>
  <div class="org-and-industry-container statistical-template-container" style="overflow: hidden">
    <task-info-nav></task-info-nav>
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="5">
              <el-input :span="5" v-model="searchData.insName" placeholder="请输入行业名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input :span="5" v-model="searchData.insCode"  placeholder="请输入行业编码"></el-input>
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
            <el-table-column prop="insId" label="行业ID"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="insName" label="行业名称"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="insCode" label="行业编码"  show-overflow-tooltip> </el-table-column>
            <el-table-column label="操作" width="225">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="pink"
                  @click="handleAssociateTask(scope.row)">关联任务</el-button>
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
        <el-form-item label="选择行业" :label-width="formLabelWidth">
          <el-button style="width:100%" @click="selectTemplate2">{{addSmsTemplate.insId?addSmsTemplate.insId+'：'+addSmsTemplate.insName:'请选择行业'}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editDialogForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title='关联任务' :visible.sync="assistTask.show" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="assistTask" label-position="top"  :model="assistTask.saveData" class="fSelect">
        <el-form-item label="" label-width="140px" prop="assistTask">
          <el-select
            v-model="assistTask.saveData.task"
            filterable
            multiple
            remote
            placeholder="请输入关联任务名称"
            :remote-method="remoteMethod"
            :loading="assistTask.select.loading"
            class="wid_80"
            @change="handleChange">
            <el-option
              v-for="item in assistTask.select.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
            <el-button @click="addDialogParamVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="addDialogParamVisible2 = false">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--选择行业-->
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { orgIndustryList , orgIndustryDelete , orgIndustryRevoke  , orgIndustrySave  ,industryList ,cityView , cityGet, assiocateTask, assiocateList } from '@/api/assist-api'
  import taskInfoNav from "@/components/taskInfoNav";
  import { listTasks } from '@/api/marketingManage/marketTask-api'
  export default {
    components: {taskInfoNav},
    name: 'app',
    data () {
      return {
        props:{
          value: 'id',
          label:'name',
          children: 'child'
        },
        options:[],
        value3:[new Date(2018, 1, 10, 8, 40), new Date(2018, 1, 10, 9, 40)],
        loading2: true,//加载菊花
        searchData:{
          insCode:'',
          insName:'',
          status:''
        },
        addEditDialogForm:{
          orgCode	:'',
          insId	:'',
          insCode:'',
          insName:'',
          industryName:'',
          areaName:'',
          amount:''
        },
        isEdit:true,
        Editindex:0,
        pageparam2:{},
        smsParamsList2:[],
        searchParamItemData2:'',
        addSmsTemplate: {
          insId	:'',
          insCode:'',
          insName:'',
          industId: '',
          industName: '',
        },
        addDialogParamVisible2:false,
        columnCategoryList:[{"type":1,"value":"具体IP"},{"type":2,"value":"范围IP"}],
        dataList:[],
        formLabelWidth:'80px',
        editDialogForm:'',
        dialogFormVisible:false,
        assistTask:{
          show:false,
          select:{
            options: [],
            list: [],
            loading: false,
            states: []
          },
          saveData:{
            id:0,
            industryCode:'',
            industryName:'',
            task:[]
          }
        },
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
      handleItemChange(val) {
        console.log('active item:', val);
      },
      areaChange(val){
        console.log(val);
        let _self = this;
        if(val.length>2){
          _self.addEditDialogForm.areaId = val[2];
          cityGet({id:val[2]}).then((res)=>{
            _self.addEditDialogForm.areaName = res.data.name;
          })
        }
      },
      handleCurrentChangeParam2(val){
        let _self = this;
        let data = {"name":_self.searchParamItemData2,"status":1,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": 12};
        industryList(data).then(function (res) {
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
        let dataParam = {"name":_self.searchParamItemData2,"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        industryList(dataParam).then(function (res) {
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
        this.addSmsTemplate.insId = _self.smsParamsList2[index].id;
        this.addSmsTemplate.insName = _self.smsParamsList2[index].name;
        this.addSmsTemplate.insCode = _self.smsParamsList2[index].code;
        this.addDialogParamVisible2 = false;
      },
      searchParamItem2(){
        let _self =this;
        let dataParam = {"name":_self.searchParamItemData2,"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        industryList(dataParam).then(function (res) {
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
              let data = {"id":_self.tableData[_self.Editindex].id,"insId":_self.addSmsTemplate.insId	,"insName":_self.addSmsTemplate.insName	,"insCode":_self.addSmsTemplate.insCode	,"orgCode":_self.orgCode};
              orgIndustrySave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].insId = res.data.insId;
                _self.tableData[_self.Editindex].insName = res.data.insName;
                _self.tableData[_self.Editindex].insCode = res.data.insCode;
                _self.dialogFormVisible = false;
              })
            }else{
              let data = {"insId":_self.addSmsTemplate.insId	,"insName":_self.addSmsTemplate.insName	,"insCode":_self.addSmsTemplate.insCode,"orgCode":_self.orgCode};
              orgIndustrySave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"insCode":_self.searchData.insCode,"insName":_self.searchData.insName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":1,"prePageResult":_self.page.pageSize};
                orgIndustryList(data).then(function (res) {
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
        _self.addSmsTemplate.insId = _self.tableData[index].insId;
        _self.addSmsTemplate.insName = _self.tableData[index].insName;
        _self.addEditDialogForm.insId = _self.tableData[index].insId;
        _self.addEditDialogForm.insName = _self.tableData[index].insName;
        _self.addEditDialogForm.insCode = _self.tableData[index].insCode;
        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.addSmsTemplate={
            insId	:'',
            insCode:'',
            insName:'',
            industId: '',
            industName: '',
          };
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
            orgIndustryDelete(data).then(function(res){
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
            orgIndustryRevoke(data).then(function(res){
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
        let data = {"insCode":_self.searchData.insCode,"insName":_self.searchData.insName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        orgIndustryList(data).then(function (res) {
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
        let data = {"insCode":_self.searchData.insCode,"insName":_self.searchData.insName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        orgIndustryList(data).then(function (res) {
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
        let data = {"insCode":_self.searchData.insCode,"insName":_self.searchData.insName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        orgIndustryList(data).then(function (res) {
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

      handleAssociateTask(row){
        this.assistTask.select.options = [];
        let _data = {
          industryCode:row.insCode,
          pageIndex: 1,
          pageSize: 10
        };
        assiocateList(_data).then(data =>{
          if(data.data.length){
            this.assistTask.saveData.id = data.data[0].id;
            let _name = data.data[0].taskName && data.data[0].taskName.split(',');
            if(_name){
              this.assistTask.saveData.task = data.data[0].taskId && data.data[0].taskId.split(',').map((item,index) =>{
                 return  item + ',' + _name[index]
              });
              this.assistTask.select.options = this.assistTask.saveData.task.map( (item,index) =>{
                return { value: item , label: _name[index] }
              })
            }else{
              this.assistTask.saveData.task= [];
            }
          }else{
            this.assistTask.saveData.task= [];
          }
          this.assistTask.saveData.industryCode = row.insCode;
          this.assistTask.saveData.industryName = row.insName;
          this.assistTask.show = true;
        })
      },
      taskList(){
        let _data={
          pageSize:100,
          pageIndex:1,
          taskName:''
        };
        listTasks(_data).then(data=>{
          this.assistTask.select.list = data.data.map(item=>{
            return { value: item.taskId + ',' +item.taskName, label: item.taskName }
          });
        });
      },
      remoteMethod(query) {
        if (query !== '') {
          this.assistTask.select.loading = true;
          setTimeout(() => {
            this.assistTask.select.loading = false;
            this.assistTask.select.options = this.assistTask.select.list.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.assistTask.select.options = [];
        }
      },
      handleChange(taskId){
        assiocateTask(this.assistTask.saveData).then(data => {
          this.assistTask.saveData.id = data.data.id
        });
      }
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
      let data = {"insCode":_self.searchData.insCode,"insName":_self.searchData.insName,"orgCode":_self.orgCode,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      orgIndustryList(data).then(function (res) {
        _self.loading2 = false;
        _self.tableData = res.data;
        _self.page={
          pageSize: 10,
          total: res.total,
          currentPage: 1
        }
      });
      this.taskList();
    }

  }
</script>

<style lang="scss">

</style>
