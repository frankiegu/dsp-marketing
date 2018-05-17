<template>

  <div class="task-info-container statistical-template-container" style="overflow: hidden">
    <task-info-nav></task-info-nav>

    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <!--<el-col :span="5" :offset="5">-->
              <!--<el-input :span="5" v-model="searchData.areaCode"  placeholder="请输入地区编码"></el-input>-->
            <!--</el-col>-->
            <el-col :span="5" :offset="15">
              <el-input :span="5" v-model="searchData.industryCode"  placeholder="请输入行业编码"></el-input>
            </el-col>
            <!--<el-col :span="5">-->
              <!--<el-select v-model="searchData.status" style="width:100%;" placeholder="请选择状态" clearable filterable >-->
                <!--<el-option :label="'不可用'" :value="0"></el-option>-->
                <!--<el-option :label="'可用'" :value="1"></el-option>-->
              <!--</el-select>-->
            <!--</el-col>-->
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
            <el-table-column prop="dayCount" label="日数量"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="increment" label="增量"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="industryCodes" label="行业编码"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="maxCount" label="最大数量" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="minCount" label="最小数量" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="priceOut" label="单价" show-overflow-tooltip> </el-table-column>
            <!--<div class="btn-wrap" id="btn-wrap">-->
              <!--<el-button :type="item.id==0?'warning':'primary'"  :class="draggable?draggable:'ffdraggable'" v-for="(item,index) in searchData.list" :key="item.id">-->
                <!--<em style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">{{item.name}}</em>-->
                <!--<em style="color:chartreuse;-moz-user-select: none;-khtml-user-select: none;user-select: none;" @click.stop="">{{item.displayName?'：'+item.displayName:''}}</em>-->
                <!--<i class="el-icon-edit el-icon&#45;&#45;right" style="margin-right:5px;cursor: pointer"  @click.stop="EditPbthParm2(index)"></i>-->
                <!--<i class="el-icon-close el-icon&#45;&#45;right" style="cursor: pointer" @click.stop="deleteParam(index)"></i>-->
                <!--<div class="ffdraggabletip">火狐浏览器暂时不支持拖拽哦！</div>-->
              <!--</el-button>-->
            <!--</div>-->
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
        <el-form-item label="日数量" prop="dayCount" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.dayCount" placeholder="日数量"></el-input>
        </el-form-item>
        <!--<el-form-item label="行业编码" prop="industryCodes" :label-width="formLabelWidth">-->
          <!--<el-input v-model="addEditDialogForm.industryCodes" placeholder="所属行业编码，逗号分割"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="单价" prop="price" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.price" placeholder="日行业单价(元)"></el-input>
        </el-form-item>
        <el-form-item label="最小发送条数" prop="minCount" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.minCount" placeholder="最小发送条数"></el-input>
        </el-form-item>
        <el-form-item label="最大发送条数" prop="maxCount" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.maxCount" placeholder="最大发送条数"></el-input>
        </el-form-item>
        <el-form-item label="增量" prop="increment" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.increment" placeholder="发送条数递增量"></el-input>
        </el-form-item>
        <div class="editPbtnWrap">
          <el-button  :span="5" class="editPbtn" type="primary" icon="plus" @click="selectTemplate2">添加行业</el-button>
        </div>
        <div class="btn-wrap" id="btn-wrap">
            <el-button :type="'primary'" v-for="(item,index) in addEditDialogForm.list" :key="item" style="margin-left:0;margin-right:15px;margin-bottom: 15px;">
              <em style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">{{item}}</em>
              <i class="el-icon-edit el-icon--right" style="margin-right:5px;cursor: pointer"  @click.stop="EditPbthParm2(index)"></i>
              <i class="el-icon-close el-icon--right" style="cursor: pointer" @click.stop="deleteParam(index)"></i>
            </el-button>

        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editDialogForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--选择行业-->
    <el-dialog :title="'选择行业'"  :visible.sync="addDialogParamVisible2">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请输入行业名称" v-model="searchParamItemData2"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem2">搜索</el-button>
        </el-col>
      </el-row>
      <el-button  class="selctParams" type="primary" style="margin-bottom: 15px;margin-right:15px;margin-left: 0px;" v-for="(item,index) in smsParamsList2" :key="item.id" @click.stop="addParamItem2(index,'editParam',$event)">
        {{ item.insCode }}：<em style="color:chartreuse">{{ item.insName }}</em>
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
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { taskLimitList , tasklimitStatus  , tasklimitSave ,orgIndustryList} from '@/api/assist-api'
  import taskInfoNav from "@/components/taskInfoNav";

  export default {
    components: {taskInfoNav},
    name: 'app',
    data () {
      return {
        hasBefore:false,
       isReedit :false,
        pageparam2:{},
        smsParamsList2:[],
        searchParamItemData2:'',
        addDialogParamVisible2:false,
        value3:[new Date(2018, 1, 10, 8, 40), new Date(2018, 1, 10, 9, 40)],
        loading2: true,//加载菊花
        searchData:{
          interval:'',
          code:'',
          status:'',
          name:'',
          areaCode:'',
          industryId:'',
          industryCode:''
        },
        addEditDialogForm:{
          dayCount:'',
          increment:'',
          industryCodes:'',
          maxCount:'',
          minCount:'',
          price:'',
          list:[]
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:[{"type":1,"value":"具体IP"},{"type":2,"value":"范围IP"}],
        dataList:[],
        formLabelWidth:'110px',
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
      deleteParam(index){
        this.addEditDialogForm.list.splice(index,1);
      },
      handleCurrentChangeParam2(val){
        let _self = this;
        let data = {"orgCode":_self.orgCode,"insName":_self.searchParamItemData2,"status":1,"uId": "admin",user:this.account, "currPage": val, "prePageResult": 12};
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
        _self.isReedit = false;
        _self.addDialogParamVisible2 = true;
        let dataParam = {"orgCode":_self.orgCode,"insName":_self.searchParamItemData2,"status":1,"uId": "admin","user":_self.account, "currPage": 1, "prePageResult": 12};
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
          _self.hasBefore =false;
          let tIndex = index;
        new Promise((resolve, reject)=>{
          _self.addEditDialogForm.list.forEach((item,index)=>{
            if(item==_self.smsParamsList2[tIndex].insCode){
              _self.hasBefore = true;
            }
          });
          resolve(_self.hasBefore);
        }).then((a)=>{
          if(!a){
            if(_self.isReedit){
              _self.addEditDialogForm.list[_self.paramIndex] = _self.smsParamsList2[index].insCode;
            }else{
              _self.addEditDialogForm.list.push(_self.smsParamsList2[index].insCode);

            }
          }else{
            _self.$message({
              type:"warning",
              message:"对不起，已经有该行业了，请勿重复提交！"
            })
          }
        });

        this.addDialogParamVisible2 = false;
      },
      searchParamItem2(){
        let _self =this;
        let dataParam = {"orgCode":_self.orgCode,"name":_self.searchParamItemData2,"status":1,"uId": "admin","user":_self.account,  "currPage": 1, "prePageResult": 12};
        orgIndustryList(dataParam).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2 = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
        })
      },
      addParamItem(index){
        let _self = this;
        _self.addDialogParamVisible2 = false;
        _self.pageparam.currentPage = 0;

        if(_self.searchData.list.length){
          let hasId = 0;
          for(let i = 0 ; i<_self.searchData.list.length ; i++){
            if(_self.searchData.list[i].id==_self.smsParamsList[index].id){
              hasId = 1
            }
          }
          if(!hasId){
            _self.searchData.list[_self.paramIndex] = _self.smsParamsList[index];
          }else{
            _self.$message({
              type: 'warning',
              message: '数据列重复，添加失败!'
            });
          }

        }else{
          _self.searchData.list[_self.paramIndex] = _self.smsParamsList[index];
        }
      },
      EditPbthParm2(index){
        let _self = this;
        _self.paramIndex = index;
        _self.isReedit = true;
        _self.addDialogParamVisible2 = true;
        _self.searchParamItemData = '';
        let dataParam = {"orgCode":_self.orgCode,"name":_self.searchParamItemData2,"status":1,"uId": "admin","user":_self.account,  "currPage": 1, "prePageResult": 12};
        orgIndustryList(dataParam).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2 = {
            pageSize:12,
            total:res.total,
            currentPage:1
          }
        })
      },
      submitForm(formName){
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){
              let data = _self.addEditDialogForm;
              data.id=_self.tableData[_self.Editindex].id;
              _self.addEditDialogForm.industryCodes = _self.addEditDialogForm.list.join(",");
//              _self.addEditDialogForm.list = [];
              data.orgCode = _self.orgCode;
              tasklimitSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].dayCount = _self.addEditDialogForm.dayCount;
                _self.tableData[_self.Editindex].increment = _self.addEditDialogForm.increment;
                _self.tableData[_self.Editindex].industryCodes = _self.addEditDialogForm.industryCodes;
                _self.tableData[_self.Editindex].maxCount = res.data.maxCount;
                _self.tableData[_self.Editindex].minCount = res.data.minCount;
                _self.tableData[_self.Editindex].price = res.data.price;
                _self.dialogFormVisible = false;
              })
            }else{
              let data = _self.addEditDialogForm;
              data.orgCode = _self.orgCode;
              _self.addEditDialogForm.industryCodes = _self.addEditDialogForm.list.join(",");
//              delete _self.addEditDialogForm.list;
              tasklimitSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"areaCode":_self.searchData.areaCode,"orgCode":_self.orgCode,"industryCode":_self.searchData.industryCode,"status":_self.searchData.status,"pageIndex":1,"pageSize":_self.page.pageSize};
                taskLimitList(data).then(function (res) {
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
        _self.addEditDialogForm.dayCount =_self.tableData[index].dayCount;
        _self.addEditDialogForm.increment =_self.tableData[index].increment;
        _self.addEditDialogForm.industryCodes =_self.tableData[index].industryCodes;
        _self.addEditDialogForm.list =_self.tableData[index].industryCodes.split(",");
        _self.addEditDialogForm.maxCount =_self.tableData[index].maxCount;
        _self.addEditDialogForm.minCount =_self.tableData[index].minCount;
        _self.addEditDialogForm.price =_self.tableData[index].priceOut;

        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        _self.isReedit = false;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm={
            dayCount:'',
            increment:'',
            industryCodes:'',
            maxCount:'',
            minCount:'',
            price:'',
            list:[]
          }
        },200)
      },
      handleStop(index,row){
        let _self = this;
        if(_self.tableData[index].status===1){
          _self.$confirm('此操作将禁用【' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {"id":_self.tableData[index].id,"status":3};
            tasklimitStatus(data).then(function(res){
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
          _self.$confirm('此操作将激活【' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {"id":_self.tableData[index].id,"status":1};
            tasklimitStatus(data).then(function(res){
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
        let data = {"areaCode":_self.searchData.areaCode,"orgCode":_self.orgCode,"industryCode":_self.searchData.industryCode,"status":_self.searchData.status,"pageIndex":_self.page.currentPage,"pageSize":_self.page.pageSize};
        taskLimitList(data).then(function (res) {
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
        let data = {"areaCode":_self.searchData.areaCode,"orgCode":_self.orgCode,"industryCode":_self.searchData.industryCode,"status":_self.searchData.status,"pageIndex":_self.page.currentPage,"pageSize":val};
        taskLimitList(data).then(function (res) {
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
        let data = {"areaCode":_self.searchData.areaCode,"orgCode":_self.orgCode,"industryCode":_self.searchData.industryCode,"status":_self.searchData.status,"pageIndex":val,"pageSize":_self.page.pageSize};
        taskLimitList(data).then(function (res) {
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
      let data = {"areaCode":_self.searchData.areaCode,"orgCode":_self.orgCode,"industryCode":_self.searchData.industryCode,"status":_self.searchData.status,"pageIndex":1,"pageSize":10};
      taskLimitList(data).then(function (res) {
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
