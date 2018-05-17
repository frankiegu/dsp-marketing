<template>
  <div class="region-info-container statistical-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
              <el-input :span="5" v-model="searchData.name"  placeholder="请输入名称"></el-input>
            </el-col>
            <el-col :span="5" >
              <el-input :span="5" v-model="searchData.pid"  placeholder="请输入上级ID"></el-input>
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
            <el-table-column prop="pid" label="上级ID"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="name" label="行业名称"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="code" label="编码"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="spell" label="拼音"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作"  show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="handleEdit('editDialogForm', scope.$index, scope.row)">编辑</el-button>
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
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.name"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="拼音" prop="spell" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.spell"  placeholder=""></el-input>
        </el-form-item>
        <!--<el-form-item label="上级ID" prop="pid" :label-width="formLabelWidth">-->
          <!--<el-input v-model="addEditDialogForm.pid"  placeholder=""></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="选择上级ID" :label-width="formLabelWidth">
          <el-button style="width:100%" @click="selectTemplate2">{{addSmsTemplate2.industId?addSmsTemplate2.industId:'请选择行业'}}</el-button>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.orderNum"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.code"  placeholder="" :disabled="isEdit?true:false"></el-input>
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
  import { industryList , industrySave ,orgIndustryList } from '@/api/assist-api'
  export default {
    name: 'regionInfo',
    data () {
      return {
        pageparam2:{},
        smsParamsList2:'',
        searchParamItemData2:'',
        addSmsTemplate: {
          industId: '',
          industName: '',
        },
        addSmsTemplate2: {
          industId: '',
          industName: '',
        },
        addDialogParamVisible2:false,
        loading2: true,//加载菊花
        searchData:{
          pid:'',
          name:''
        },
        addEditDialogForm:{
          name:'',
          spell:'',
          pid:'',
          orderNum:'',
          code:''
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:[{"type":1,"value":"全国"},{"type":2,"value":"省、自治区"},{"type":3,"value":"市"},{"type":4,"value":"区、县"},{"type":5,"value":"街道"}],
        formLabelWidth:'100px',
        editDialogForm:'',
        dialogFormVisible:false,
        page:{},
        tableData:[],
        ruless: {
//          name1:[
//            {required: false, message: '请输入ip', trigger: 'blur'}
//          ],
//          name2:[
//            {required: false, message: '请选择类型', trigger: 'blur'}
//          ]
        },
      }
    },
    methods: {
      handleCurrentChangeParam2(val){
        let _self = this;
        let data = {"name":_self.searchParamItemData2,"insCode":'',"orgCode":_self.orgCode,"status":1, "currPage": val, "prePageResult": 12};
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
        let dataParam = {"name":_self.searchParamItemData2,"insCode":'',"orgCode":_self.orgCode,"status":1, "currPage": 1, "prePageResult": 12};
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
        this.addSmsTemplate2.industId = _self.smsParamsList2[index].id;
        this.addEditDialogForm.pid = _self.smsParamsList2[index].id;
        this.addDialogParamVisible2 = false;
      },
      searchParamItem2(){
        let _self =this;
        let dataParam = {"name":_self.searchParamItemData2,"insCode":'',"orgCode":_self.orgCode,"status":1, "currPage": 1, "prePageResult": 12};
        industryList(dataParam).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2 = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
        })
      },
      submitForm(){
        let _self = this;
        if(_self.isEdit){
          let data = _self.addEditDialogForm;
          data.id = _self.tableData[_self.Editindex].id;
          industrySave(data).then(function (res) {
            _self.$message({
              type: 'success',
              message: '编辑成功!'
            });
            _self.tableData[_self.Editindex].name = _self.addEditDialogForm.name;
            _self.tableData[_self.Editindex].spell = _self.addEditDialogForm.spell;
            _self.tableData[_self.Editindex].pid = _self.addSmsTemplate2.industId;
            _self.tableData[_self.Editindex].code = res.data.code;
            _self.tableData[_self.Editindex].orderNum = _self.addEditDialogForm.orderNum;
            _self.tableData[_self.Editindex].code = _self.addEditDialogForm.code;
            _self.dialogFormVisible = false;
          })
        }else{
          let data = _self.addEditDialogForm;
          industrySave(data).then(function (res) {
            _self.$message({
              type: 'success',
              message: '新增成功!'
            });
            _self.loading2 = true;
            let data = {"pid":_self.searchData.pid,"name":_self.searchData.name,"currPage":1,"prePageResult":_self.page.pageSize};
            industryList(data).then(function (res) {
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
      },
      handleEdit(name,index,row){
        let _self = this;
        _self.isEdit = true;
        _self.Editindex = index;
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.name= _self.tableData[index].name ;
        _self.addEditDialogForm.spell = _self.tableData[index].spell;
        _self.addSmsTemplate2.industId = _self.tableData[index].pid;
        _self.addEditDialogForm.orderNum = _self.tableData[index].orderNum;
        _self.addEditDialogForm.code = _self.tableData[index].code;

      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.addEditDialogForm = {
            name:'',
            spell:'',
            pid:'',
            orderNum:'',
            code:''
          };
          _self.addSmsTemplate2.industId ='';
          _self.isEdit = false;
          _self.dialogFormVisible = true;
        },200)
      },
      searchEvent(){
        let _self = this;
        _self.loading2 = true;
        let data = {"pid":_self.searchData.pid,"name":_self.searchData.name,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        industryList(data).then(function (res) {
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
        let data = {"pid":_self.searchData.pid,"name":_self.searchData.name,"currPage":_self.page.currentPage,"prePageResult":val};
        industryList(data).then(function (res) {
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
        let data = {"pid":_self.searchData.pid,"name":_self.searchData.name,"currPage":val,"prePageResult":_self.page.pageSize};
        industryList(data).then(function (res) {
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
      let data = {"pid":_self.searchData.pid,"name":_self.searchData.name,"currPage":1,"prePageResult":10};
      industryList(data).then(function (res) {
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


