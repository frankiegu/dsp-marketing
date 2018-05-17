<template>
  <div class="statistical-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="7">
              <el-input v-model="searchData.channel"  placeholder="请输入渠道名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="searchData.modelName"  placeholder="请输入模型"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.status" :span="5" placeholder="请选择状态" clearable filterable style="width:100%;">
                <el-option :label="'可用'" :value="1"></el-option>
                <el-option :label="'不可用'" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="button" class="search-btn" @click="searchEvent">查询</el-button>
            </el-col>
            <!--<el-col :span="2">-->
              <!--<el-button :span="2" type="success" class="search-add"  @click="addListEvent('editDialogForm')">新增</el-button>-->
            <!--</el-col>-->
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
            row-key="id"
            @selection-change="selectionChange"
            tooltip-effect="dark"
            style="width: 100%">

            <el-table-column type="selection" width="45" ></el-table-column>
            <el-table-column prop="id" label="#"  show-overflow-tooltip> </el-table-column>
            <el-table-column label="操作"  show-overflow-tooltip width="280">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  :disabled= "scope.row.status==1?false:true"
                  @click="handleEdit('editDialogForm', scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  :type="scope.row.status === 1 ? 'gray' : 'success'"
                  @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                <el-button
                  size="small"
                  type="success"
                  :disabled= "scope.row.status==1?false:true"
                  @click="ExcuteStatistic( scope.row)">执行统计</el-button>
                <el-button
                  size="small"
                  type="warning"
                  :disabled= "scope.row.status==1?false:true"
                  @click="ExcuteAnalysis(scope.row, scope.$index)">分析</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="identity" label="批次"  show-overflow-tooltip width="160"> </el-table-column>
            <el-table-column prop="channel" label="渠道"  show-overflow-tooltip width="160"> </el-table-column>
            <el-table-column prop="smsTemplateId" label="短信模板ID" show-overflow-tooltip width="90"> </el-table-column>
            <el-table-column prop="smsTemplate" label="短信模板" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="modelId" label="模型ID" show-overflow-tooltip width="90"> </el-table-column>
            <el-table-column prop="modelName" label="模型" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="childName" label="子类名称" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="partnerId" label="合作商ID" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="partnerName" label="合作商" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="cityName" label="城市名称" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="supplierId" label="供应商ID" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="sendNum" label="发送量" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="sendSuccNum" label="发送成功量" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="submitNum" label="提交成功量" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="sendFailNum" label="发送失败量" show-overflow-tooltip width="120"> </el-table-column>
            <!--<el-table-column prop="arrivalNum" label="到达量" show-overflow-tooltip width="120"> </el-table-column>-->
            <el-table-column prop="arrivalPer" label="到达率" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="uv" label="UV" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="clickPer" label="点击率" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="expectFillNum" label="预计填单数" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="actualFillNum" label="实际填单数" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="lostPer" label="损失率" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="fillSendPer" label="填单/发送成功" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="expectFillPer" label="预计填单率" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="fillPer" label="填单率" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="income" label="收入" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="smsCost" label="短信成本" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="cpaCost" label="cpa成本" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="costIncomePer" label="成本占收比" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="expectProfit" label="预计利润" show-overflow-tooltip width="120"> </el-table-column>
            <!--<el-table-column prop="executeParams" label="填单率" show-overflow-tooltip> </el-table-column>-->
          </el-table>
        </div>
        <el-row>
          <el-col :span="8" style="text-align:left;margin-left: 15px;">
            <el-button type="primary" style="text-align: left" @click="batchExe"  :disabled="tableData.length===0?true:false">批量执行统计</el-button>

            <el-button type="primary" style="text-align: left" @click="exportData"  :disabled="tableData.length===0?true:false">导出 Excel 文件</el-button>
          </el-col>
          <el-col>
            <div class="search-page" style="text-align: right;">
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
    <!--详情分析-->
    <el-dialog :title="'详情分析'" :visible.sync="addDialogParamVisible2">
      <div class="search-container">
        <el-row :gutter="15">
          <el-col :span="10" :offset="10">
            <el-select v-model="searchDetail.type" :span="10" placeholder="请选择类型" clearable filterable >
              <el-option :label="'省份'" value="province"></el-option>
              <el-option :label="'城市'" value="city"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button :span="2" type="button" class="search-btn" @click="searchAnalysis">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="detailData"
                v-loading="loading3"
                element-loading-text="拼命加载中"
                height="400"
                border
                row-key="id"
                tooltip-effect="dark"
                style="width: 100%">
        <el-table-column property="province" label="省份" width="150"></el-table-column>
        <el-table-column property="city" label="城市" width="200"></el-table-column>
        <el-table-column property="sendSucc" label="发送成功"></el-table-column>
        <el-table-column property="uv" label="UV"></el-table-column>
        <el-table-column property="expectFill" label="预计填单数"></el-table-column>
        <el-table-column property="clickPer" label="点击率">
          <template slot-scope="scope">
            <div :class="'type'+scope.row.clickType">{{scope.row.clickPer}}</div>
          </template>
        </el-table-column>
        <el-table-column property="expectFillPer" label="预计填单率">
          <template slot-scope="scope">
            <div :class="'type'+scope.row.expectFillType">{{scope.row.expectFillPer}}</div>
          </template>

        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogParamVisible2 = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :title='isEdit?"编辑":"新增"' :visible.sync="dialogFormVisible">
      <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
        <el-form-item label="发送量" prop="sendNum" :label-width="formLabelWidth" v-show="formShow">
          <el-input v-model="addEditDialogForm.sendNum"  placeholder="请输入发送量"></el-input>
        </el-form-item>
        <el-form-item label="发送成功量" prop="sendSuccNum" :label-width="formLabelWidth" v-show="formShow">
          <el-input v-model="addEditDialogForm.sendSuccNum"  placeholder="请输入发送成功量"></el-input>
        </el-form-item>
        <el-form-item label="提交成功量" prop="submitNum" :label-width="formLabelWidth" v-show="formShow">
          <el-input v-model="addEditDialogForm.submitNum"  placeholder="请输入提交成功量"></el-input>
        </el-form-item>
        <el-form-item label="发送失败量" prop="sendFailNum" :label-width="formLabelWidth" v-show="formShow">
          <el-input v-model="addEditDialogForm.sendFailNum"  placeholder="请输入发送失败量"></el-input>
        </el-form-item>
        <!--<el-form-item label="到达量" prop="arrivalNum" :label-width="formLabelWidth">-->
          <!--<el-input v-model="addEditDialogForm.arrivalNum"  placeholder="请输入到达量"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="UV" prop="uv" :label-width="formLabelWidth" v-show="formShow">
          <el-input v-model="addEditDialogForm.uv"  placeholder="请输入UV"></el-input>
        </el-form-item>
        <el-form-item label="预计填单数" prop="expectFillNum" :label-width="formLabelWidth" v-show="formShow">
          <el-input v-model="addEditDialogForm.expectFillNum"  placeholder="请输入预计填单数"></el-input>
        </el-form-item>
        <el-form-item label="实际填单数" prop="actualFillNum" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.actualFillNum"  placeholder="请输入实际填单数"></el-input>
        </el-form-item>
        <el-form-item label="收入" prop="income" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.income"  placeholder="请输入收入"></el-input>
        </el-form-item>
        <el-form-item label="短信成本" prop="smsCost" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.smsCost"  placeholder="请输入短信成本"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-button slot="append" icon="delete">选择元素</el-button>
          </el-col>
          <el-col :span="10">
            <el-button slot="append" icon="delete" type="danger">删除</el-button>
          </el-col>
        </el-row>
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
  import draggable from 'vuedraggable';
  import RyButton from '@/components/RyButton';
  import { myBrowser } from '@/util/util';
  import { AnalysisList  , AnalysisGet , categoryList , AnalysisEdit , AnalysisDelete , AnalysisRevoke , analysisExecute, AnalysisExport, uvAnalysis } from '@/api/modelManage/modelManage-api'
  export default {
    components: {
      draggable , RyButton},
    name: 'app',
    data () {
      return {
        selectdata:'',
        formShow:true,
        draggable:'draggable',
        loading2:true,
        loading3:false,
        searchParamItemData:'',
        addDialogParamVisible2:false,
        smsParamsList:'',
        pageparam:{},
        paramIndex:0,
        searchData:{
          modelName:'',
          channel:'',
          status:'',
          list:[]
        },
        searchDetail:{
          type:''
        },
        addEditDialogForm:{
          sendNum:'',
          sendSuccNum:'',
          submitNum:'',
          sendFailNum:'',
//          arrivalNum:'',
          uv:'',
          expectFillNum:'',
          actualFillNum:'',
          income:'',
          smsCost:'',
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:null,
        formLabelWidth:'120px',
        editDialogForm:'',
        dialogFormVisible:false,
        page:{},
        tableData:[],
        detailData:[],
        // clickType:'',
        // expectFillType:'',
        rules: {
          name1:[
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          name3:[
            {required: true, message: '请输入描述', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      selectionChange(val){
        if(val.length){
            let idList = val.map((item)=>{
                return item.id
            }).join(',');
            this.selectdata = idList;
        }else{
          this.selectdata = '';
        }
      },
      batchExe(){
        if(this.selectdata){
          let _data = {analysisId:this.selectdata};
          this.analysisExecuteFoo(_data)
        }else{
          this.$message({
            type:'warning',
            message:'请选择一个批次'
          })
        }
      },
      analysisExecuteFoo(_data){
        let _self = this;
        analysisExecute(_data).then((res)=>{
          _self.$message({
            message:'执行成功',
            type:'success'
          })
          _self.loading2 = true;
          let data = {"modelName":_self.searchData.modelName,"channelName":_self.searchData.channel,"status":_self.searchData.status===''?null:_self.searchData.status,"currPage":1,"prePageResult":10};
          AnalysisList(data).then(function (res) {
            _self.loading2 = false;
            _self.tableData = res.data;
            _self.page={
              pageSize: 10,
              total: res.total,
              currentPage: 1
            }

          });
        }).catch(()=>{
          _self.$message({
            message:'执行失败',
            type:'warning'
          })
        })
      },
      ExcuteStatistic(row){
          let _self = this;
          let _data = {analysisId:row.id};
          if(row.actualFillNum!==null&&row.income!==null&&row.smsCost!==null){
            _self.formShow = true;
            _self.analysisExecuteFoo(_data)
          }else{
            _self.formShow = false;
            _self.addEditDialogForm.actualFillNum = row.actualFillNum;
            _self.addEditDialogForm.income = row.income;
            _self.addEditDialogForm.smsCost = row.smsCost;
            _self.dialogFormVisible = true;
          }
      },
      ExcuteAnalysis(row, index){
        this.addDialogParamVisible2 = true;
        this.detailData = [];
        this.searchDetail.type = '';
        this.Editindex = index;
      },
      submitForm(formName){
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){
              let data = _self.addEditDialogForm;
              data.id = _self.tableData[_self.Editindex].id
              AnalysisEdit(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].sendNum = _self.addEditDialogForm.sendNum;
                _self.tableData[_self.Editindex].sendSuccNum = _self.addEditDialogForm.sendSuccNum;
                _self.tableData[_self.Editindex].submitNum = _self.addEditDialogForm.submitNum;
                _self.tableData[_self.Editindex].sendFailNum = _self.addEditDialogForm.sendFailNum;
//                _self.tableData[_self.Editindex].arrivalNum = _self.addEditDialogForm.arrivalNum;
                _self.tableData[_self.Editindex].uv = _self.addEditDialogForm.uv;
                _self.tableData[_self.Editindex].expectFillNum = _self.addEditDialogForm.expectFillNum;
                _self.tableData[_self.Editindex].actualFillNum = _self.addEditDialogForm.actualFillNum;
                _self.tableData[_self.Editindex].income = _self.addEditDialogForm.income;
                _self.tableData[_self.Editindex].smsCost = _self.addEditDialogForm.smsCost;
                _self.dialogFormVisible = false;
                if(!_self.formShow){
                  let _data = {analysisId:_self.tableData[_self.Editindex].id};
                  _self.analysisExecuteFoo(_data)
                }
              })
            }else{

              let data = _self.addEditDialogForm;
              AnalysisEdit(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].remark = _self.addEditDialogForm.name3;
                _self.tableData[_self.Editindex].type = _self.addEditDialogForm.name2;
                _self.dialogFormVisible = false;
                _self.loading2 = true;
                let data = {"modelName":_self.searchData.modelName,"channel":_self.searchData.channel,"status":_self.searchData.status===''?null:_self.searchData.status,"currPage":1,"prePageResult":10};
                AnalysisList(data).then(function (res) {
                  _self.loading2 = false;
                  _self.tableData = res.data;
                  _self.page={
                    pageSize: 10,
                    total: res.total,
                    currentPage: 1
                  }

                });
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
        _self.formShow = true;
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.sendNum = _self.tableData[index].sendNum;
        _self.addEditDialogForm.sendSuccNum = _self.tableData[index].sendSuccNum;
        _self.addEditDialogForm.submitNum = _self.tableData[index].submitNum;
        _self.addEditDialogForm.sendFailNum = _self.tableData[index].sendFailNum;
//        _self.addEditDialogForm.arrivalNum = _self.tableData[index].arrivalNum;
        _self.addEditDialogForm.uv = _self.tableData[index].uv;
        _self.addEditDialogForm.expectFillNum = _self.tableData[index].expectFillNum;
        _self.addEditDialogForm.actualFillNum = _self.tableData[index].actualFillNum;
        _self.addEditDialogForm.income = _self.tableData[index].income;
        _self.addEditDialogForm.smsCost = _self.tableData[index].smsCost;
        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm.sendNum = '';
          _self.addEditDialogForm.sendSuccNum = '';
          _self.addEditDialogForm.submitNum = '';
          _self.addEditDialogForm.sendFailNum = '';
//          _self.addEditDialogForm.arrivalNum = '';
          _self.addEditDialogForm.uv = '';
          _self.addEditDialogForm.expectFillNum = '';
          _self.addEditDialogForm.actualFillNum = '';
          _self.addEditDialogForm.income = '';
          _self.addEditDialogForm.smsCost = '';
          _self.searchData.list.length=0;
//          _self.$refs[name].resetFields()
        },20)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【 ID：' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            AnalysisDelete(data).then(function(res){
              if (res.success) {
                _self.$message({
                  type: 'success',
                  message: '禁用成功!'
                });
                _self.tableData[index].status = 0
              }
            }).catch((res)=>{
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            });
          }).catch((res)=>{
          })

        }else{
          this.$confirm('此操作将激活【 ID：' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            AnalysisRevoke(data).then(function(res){
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

          }).catch((res)=>{

          })
        }

      },
      searchEvent(){
        let _self = this;
        _self.loading2 = true;
        let data = {"modelName":_self.searchData.modelName,"channel":_self.searchData.channel,"status":_self.searchData.status===''?null:_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        AnalysisList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: 1
          }
        });
      },
      searchAnalysis(){
        let _self = this;
        _self.loading3 = true;
        // return false;
        let data = {"analysisId":_self.tableData[_self.Editindex].id,"type":_self.searchDetail.type};
        uvAnalysis(data).then(function (res) {
          _self.loading3 = false;
          _self.detailData = res.data;
        }).catch(function(res){
          _self.$message({
            type: 'warning',
            message: res.msg
          });
        });
      },
      handleSizeChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"modelName":_self.searchData.modelName,"channel":_self.searchData.channel,"status":_self.searchData.status===''?null:_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        AnalysisList(data).then(function (res) {
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
        let data = {"modelName":_self.searchData.modelName,"channel":_self.searchData.channel,"status":_self.searchData.status===''?null:_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        AnalysisList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: val
          }

        });
      },
      deleteParam(index){
        let _self = this;
        this.$confirm('此操作将删除【' + _self.searchData.list[index].name + '】模型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.searchData.list.splice(index,1);
        }).catch((res)=>{
        })
      },
      exportData(){
          if(this.searchData.status===null){
            window.location.href = window.location.origin + '/statistic/model/analysis/export'+"?orgCode="+this.orgCode+"&modelName="+this.searchData.modelName+"&channel="+this.searchData.channel+"&Authorization="+sessionStorage.getItem("userToken")
          }else{
            window.location.href = window.location.origin + '/statistic/model/analysis/export'+"?orgCode="+this.orgCode+"&modelName="+this.searchData.modelName+"&channel="+this.searchData.channel+"&status="+this.searchData.status+"&Authorization="+sessionStorage.getItem("userToken")
          }
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
      if(myBrowser()==='FF'){
        _self.draggable =''
      }
      let data = {"modelName":_self.searchData.modelName,"channel":_self.searchData.channel,"status":_self.searchData.status===''?null:_self.searchData.status,"currPage":1,"prePageResult":10};
      AnalysisList(data).then(function (res) {
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
      categoryList(data2).then(function(res){
        _self.columnCategoryList = res.data;
      })
    }
  }
</script>

<style lang="scss">
  .statistical-template-container{
    /*.type-1{*/
      /*background-color: grey;*/
    /*}*/
    .type0{
      background-color: lightcoral;
    }
    /*.type1{*/
      /*background-color: green;*/
    /*}*/
    .type2{
      background-color: lightgreen;
    }
    #btn-wrap{
      background-color: #F9FAFC;
    }
    .draggable{
      margin-left: 0;margin-bottom: 15px;margin-right:15px;cursor: move
    }
    .ffdraggable{
      margin-left: 0;margin-bottom: 15px;margin-right:15px;cursor: not-allowed;
      position: relative;
      &:hover .ffdraggabletip{
        display: block;
      }
    }
    .ffdraggabletip{
      display:none ;
      position: absolute;
      top:-40px;
      left: 0;
      line-height: 20px;
      height:30px;
      text-align: center;
      color:#fff;
      z-index:99;
      font-size: 12px;
      background-color: #aaa;
      opacity: .7;
      padding:4px;
      border-radius: 4px;
      &:after{
        content: '';
        display: block;
        position: absolute;
        left:25px;
        bottom: -12px;
        border-color: transparent;
        border-style: solid;
        border-width: 6px;
        border-top-color:#aaa;
        height:0;
        width:0;
      }
    }

  }
</style>
