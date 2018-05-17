<template>
  <div class="task-info-container statistical-template-container" style="overflow: hidden">
    <task-info-nav></task-info-nav>
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="5">
              <el-input :span="5" v-model="searchData.period"  placeholder="请输入时间"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.type" style="width:100%;" placeholder="类型" clearable filterable >
                <el-option :label="'日期'" :value="1"></el-option>
                <el-option :label="'时间'" :value="2"></el-option>
              </el-select>
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
            <el-table-column prop="period" label="时间"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="dayInterval" label="天数"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="type" label="类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag type="success">
                  {{scope.row.type==1?'日期':'时间'}}
                </el-tag>
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
        <el-form-item label="类型" prop="period" :label-width="formLabelWidth">
          <el-select v-model="addEditDialogForm.type" style="width:100%;" placeholder="请选择类型" clearable filterable @change="turntype">
            <el-option label="日期" :value="1"></el-option>
            <el-option label="时间" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="addEditDialogForm.type==1">
          <!--<el-form-item label="日期" prop="period" :label-width="formLabelWidth">-->
            <!--<el-select v-model="addEditDialogForm.period" style="width:100%;" placeholder="请选择日期" clearable filterable >-->
              <!--<el-option :label="item" :value="item" v-for="item in dataList" :key="item"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="日期" prop="period" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.period"></el-input>
          </el-form-item>
          <el-form-item label="天数" prop="dayInterval" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.dayInterval"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="时间" :label-width="formLabelWidth">
            <el-time-picker
              is-range
              @change="changeTime"
              :picker-options="{selectableRange:['00:00 - 23:59'],format:'HH:mm'}"
              v-model="value3"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
        </div>

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
  import { periodList , periodDelete , periodRevoke  , periodSave ,getAllDay } from '@/api/assist-api'
  import taskInfoNav from "@/components/taskInfoNav";
  export default {
    components: {taskInfoNav},
    name: 'app',
    data () {
      return {
        value3:[new Date(2018, 1, 10, 8, 40), new Date(2018, 1, 10, 9, 40)],
        loading2: true,//加载菊花
        searchData:{
          type:'',
          status:'',
          period:'',

        },
        addEditDialogForm:{
          type:2,
          period:'',
          beginTimeStr:'',
          endTimeStr:'',
          dayInterval:''
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
      jumpTo(a){
        this.$router.push(a)
      },
      turntype(val){
        this.addEditDialogForm.type = val;
        this.addEditDialogForm.period = '';

      },
      changeTime(val){
        this.addEditDialogForm.beginTimeStr = val.split(" - ")[0].substring(0,5);
        this.addEditDialogForm.endTimeStr = val.split(" - ")[1].substring(0,5);
        this.addEditDialogForm.period = this.addEditDialogForm.beginTimeStr+'~'+this.addEditDialogForm.endTimeStr;
      },
      submitForm(formName){

        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){

              let data = {"orgCode":_self.orgCode,"id":_self.tableData[_self.Editindex].id,"beginTimeStr":_self.addEditDialogForm.beginTimeStr,"endTimeStr":_self.addEditDialogForm.endTimeStr,"period":_self.addEditDialogForm.period,"type":_self.addEditDialogForm.type,"dayInterval":_self.addEditDialogForm.dayInterval};
              periodSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].dayInterval = _self.addEditDialogForm.dayInterval;
                _self.tableData[_self.Editindex].period = _self.addEditDialogForm.period;
                _self.tableData[_self.Editindex].type = _self.addEditDialogForm.type;
                _self.tableData[_self.Editindex].createTimeStr = res.data.createTimeStr;
                _self.tableData[_self.Editindex].updateTimeStr = res.data.updateTimeStr;
                _self.dialogFormVisible = false;
              })
            }else{
              let data = {"orgCode":_self.orgCode,"beginTimeStr":_self.addEditDialogForm.beginTimeStr,"endTimeStr":_self.addEditDialogForm.endTimeStr,"period":_self.addEditDialogForm.period,"type":_self.addEditDialogForm.type,"dayInterval":_self.addEditDialogForm.dayInterval};

              periodSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"orgCode":_self.orgCode,"type":'',"period":_self.searchData.period,"status":_self.searchData.status,"currPage":1,"prePageResult":_self.page.pageSize};
                periodList(data).then(function (res) {
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
        _self.addEditDialogForm.type = _self.tableData[index].type;
        if(_self.addEditDialogForm.type==1){
          _self.addEditDialogForm.beginTimeStr = '';
          _self.addEditDialogForm.endTimeStr = '';
          _self.addEditDialogForm.period = _self.tableData[index].period;
          _self.addEditDialogForm.dayInterval = _self.tableData[index].dayInterval;
        }else{
          _self.addEditDialogForm.dayInterval = '';
          if(_self.tableData[index].period.indexOf("~")>-1){
            this.value3=[new Date(2018, 1, 10, _self.tableData[index].period.split("~")[0].split(":")[0],  _self.tableData[index].period.split("~")[0].split(":")[1]), new Date(2018, 1, 10,  _self.tableData[index].period.split("~")[1].split(":")[0],  _self.tableData[index].period.split("~")[1].split(":")[1])];
            _self.addEditDialogForm.beginTimeStr = _self.tableData[index].period.split("~")[0].substring(0,5);
            _self.addEditDialogForm.endTimeStr = _self.tableData[index].period.split("~")[1].substring(0,5);
            _self.addEditDialogForm.period = _self.addEditDialogForm.beginTimeStr+'~'+_self.addEditDialogForm.endTimeStr;

          }else{

          }
        }
        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.value3 = [];
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm={
            type:2,
            period:''
          }
        },200)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.period + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            periodDelete(data).then(function(res){
              if (res.success) {
                _self.$message({
                  type: 'success',
                  message: '禁用成功!'
                }) ;
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
          this.$confirm('此操作将激活【' + row.period + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            periodRevoke(data).then(function(res){
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
        let data = {"orgCode":_self.orgCode,"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        periodList(data).then(function (res) {
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
        let data = {"orgCode":_self.orgCode,"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        periodList(data).then(function (res) {
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
        let data = {"orgCode":_self.orgCode,"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        periodList(data).then(function (res) {
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
      let data = {"orgCode":_self.orgCode,"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      periodList(data).then(function (res) {
        _self.loading2 = false;
        _self.tableData = res.data;
        _self.page={
          pageSize: 10,
          total: res.total,
          currentPage: 1
        }

      });
      getAllDay({"orgCode":_self.orgCode}).then((res)=>{
        _self.dataList = res.data;
      })
    }

  }
</script>

<style lang="scss">

</style>
