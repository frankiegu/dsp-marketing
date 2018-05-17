<template>
  <div class="statistical-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
              <el-input :span="5" v-model="searchData.key"  placeholder="请输入业务编号"></el-input>
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
            <el-table-column prop="id" label="#"  show-overflow-tooltip  width="60"> </el-table-column>
            <el-table-column prop="bizNo" label="业务编号"  show-overflow-tooltip> </el-table-column>
            <!--<el-table-column prop="type" label="类型"  show-overflow-tooltip> </el-table-column>-->
            <el-table-column prop="accessUrl" label="入资链接" show-overflow-tooltip> </el-table-column>//infoId
            <el-table-column prop="infoId" label="统计表ID" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="partner" label="合作方" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="partnerId" label="合作方ID" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="accessFlag" label="访问开关" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  :type="scope.row.accessFlag === 0 ? 'gray' : 'success'">
                  {{scope.row.accessFlag === 1 ? '开启' : '关闭'}}

                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="callbackFlag" label="回一开关" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  :type="scope.row.callbackFlag === 0 ? 'gray' : 'success'">
                  {{scope.row.callbackFlag === 1 ? '开启' : '关闭'}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="classpath" label="操作类" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createTimeStr" label="创建时间" show-overflow-tooltip> </el-table-column>
            <el-table-column label="操作"  show-overflow-tooltip width="140">
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
    <!--选择业务-->
    <el-dialog :title="'选择业务'" :visible.sync="addDialogParamVisible2">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请输入参数名称" v-model="searchParamItemData"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem">搜索</el-button>
        </el-col>
      </el-row>
      <el-button  class="selctParams" type="primary" v-for="(item , index) in smsParamsList" :key="item.id" @click.stop="addParamItem(index,'editParam',$event)">
        {{ item.name }} {{ item.displayName?'：':'' }}<em style="color:chartreuse">{{ item.displayName }}</em>
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="14">
            <el-col :span="19" >
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChangeParam"
                :total="pageparam.total"
                :current-page="pageparam.currentPage"
                :page-size ="pageparam.pageSize">
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
    <el-dialog :title='isEdit?"编辑":"新增"' :visible.sync="dialogFormVisible">
      <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
        <el-form-item label="操作类" prop="classpath" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.classpath"  placeholder="请输入操作类"></el-input>
        </el-form-item>
        <el-form-item label="合作方ID" prop="partnerId" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.partnerId"  placeholder="请输入合作方ID"></el-input>
        </el-form-item>
        <el-form-item label="统计表ID" prop="infoId" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.infoId"  placeholder="请输入统计表ID"></el-input>
        </el-form-item>
        <el-form-item label="入资链接" prop="accessUrl" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.accessUrl"  placeholder="请输入入资链接"></el-input>
        </el-form-item>
        <el-form-item label="访问开关" prop="accessFlag" :label-width="formLabelWidth">
          <el-switch
            v-model="addEditDialogForm.accessFlag"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="回一开关" prop="callbackFlag" :label-width="formLabelWidth">
          <el-switch
            v-model="addEditDialogForm.callbackFlag"
            on-color="#13ce66"
            off-color="#ff4949">
          </el-switch>
        </el-form-item>
        <div class="editPbtnWrap">
          <el-button  :span="5" class="editPbtn" type="primary" icon="plus" @click="editPbtnParam">添加业务</el-button>
        </div>
        <div class="btn-wrap" id="btn-wrap">
          <draggable v-model="searchData.list" :options="{draggable:'.draggable'}" >
            <ry-button :type="item.id==0?'warning':'primary'"  :class="draggable?draggable:'ffdraggable'" v-for="(item,index) in searchData.list" :key="item.id">
              <em style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">{{item.name}}</em>
              <em style="color:chartreuse;-moz-user-select: none;-khtml-user-select: none;user-select: none;" @click.stop="">{{item.displayName?'：'+item.displayName:''}}</em>
              <i class="el-icon-edit el-icon--right" style="margin-right:5px;cursor: pointer"  @click.stop="EditPbthParm2(index)"></i>
              <i class="el-icon-close el-icon--right" style="cursor: pointer" @click.stop="deleteParam(index)"></i>
              <div class="ffdraggabletip">火狐浏览器暂时不支持拖拽哦！</div>
            </ry-button>
          </draggable>

        </div>
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
  import {descriptionDelete , descriptionList  } from '@/api/smsManagement/smsChannel-api'
  import { processList  , processGet , processSave , processDelete ,processRevoke } from '@/api/system-api'
  export default {
    components: {draggable , RyButton},
    name: 'app',
    data () {
      return {
        draggable:'draggable',
        loading2:true,
        searchParamItemData:'',
        addDialogParamVisible2:false,
        smsParamsList:'',
        pageparam:{},
        paramIndex:0,
        searchData:{
          key:'',
          type:'',
          status:'',
          list:[],
        },
        addEditDialogForm:{
          classpath:'',
          partnerId:'',
          infoId:'',
          accessUrl:'',
          accessFlag:'',
          callbackFlag:''
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
      searchParamItem(){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"uId":"admin","user":this.account,"pageIndex":1,"pageSize":10 };
        descriptionList(data2).then(function (res) {
          let newArr = [];
          if(res.data.length){
            for(let i = 0 ; i< res.data.length;i++){
              if(res.data[i].status===1){
                newArr.push(res.data[i]);
              }
            }
          }
          _self.smsParamsList = newArr;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 0
          }
        });
      },
      handleCurrentChangeParam(val){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"uId":"admin","user":this.account,"pageIndex":val,"pageSize":10 };
        descriptionList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //选择业务列
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
              message: '业务重复，添加失败!'
            });
          }

        }else{
          _self.searchData.list[_self.paramIndex] = _self.smsParamsList[index];
        }
      },
      EditPbthParm2(index){
        let _self = this;
        _self.paramIndex = index;
        _self.addDialogParamVisible2 = true;
        _self.searchParamItemData = '';
        let data2 = {"name":_self.searchParamItemData,"uId":"admin","user":this.account,"pageIndex":1,"pageSize":10};
        descriptionList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      submitForm(formName){
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){
              let oldArr = _self.searchData.list;
              let newArr = [];
              let UnnameCount = 0;
              if(oldArr.length){
                for (let i = 0 ;i<oldArr.length; i++){
                  if(oldArr[i].id !=0){
                    newArr.push(oldArr[i])
                  }else{
                    UnnameCount++;
                  }
                }
                if(UnnameCount){
                  _self.$message({
                    type:"warning",
                    message:"抱歉，有"+UnnameCount+"个Unnamed业务！"
                  })
                  return
                }
              }

              let s = '';
              let bizNo = '';
              for (let i = 0 ;i<newArr.length; i++){
                if(i===0){
                  s+=newArr[i].id
                  bizNo = newArr[i].bizNo;
                }else{
                  s+= ','+newArr[i].id
                }
              }

              let data = {
                classpath:_self.addEditDialogForm.classpath,
                partnerId:_self.addEditDialogForm.partnerId,
                infoId:_self.addEditDialogForm.infoId,
                accessUrl:_self.addEditDialogForm.accessUrl,
                accessFlag:Number(_self.addEditDialogForm.accessFlag),
                callbackFlag:Number(_self.addEditDialogForm.callbackFlag),
                bizNo:bizNo,
                "id":_self.tableData[_self.Editindex].id,
                "bizIds":s
              };
              processSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].classpath = _self.addEditDialogForm.classpath;
                _self.tableData[_self.Editindex].partnerId = _self.addEditDialogForm.partnerId;
                _self.tableData[_self.Editindex].infoId = _self.addEditDialogForm.infoId;
                _self.tableData[_self.Editindex].accessUrl = _self.addEditDialogForm.accessUrl;
                _self.tableData[_self.Editindex].accessFlag = Number(_self.addEditDialogForm.accessFlag);
                _self.tableData[_self.Editindex].callbackFlag = Number(_self.addEditDialogForm.callbackFlag);
                _self.tableData[_self.Editindex].bizNo = bizNo;

                _self.dialogFormVisible = false;

              })
            }else{
              let oldArr = _self.searchData.list;
              let newArr = [];
              if(oldArr.length){
                for (let i = 0 ;i<oldArr.length; i++){
                  if(oldArr[i].id !=0){
                    newArr.push(oldArr[i])
                  }
                }
              }

              let s = '';
              let bizNo ='';
              for (let i = 0 ;i<newArr.length; i++){
                if(i===0){
                  s+=newArr[i].id
                  bizNo = newArr[i].bizNo;
                }else{
                  s+= ','+newArr[i].id
                }
              }

              let data = {
                classpath:_self.addEditDialogForm.classpath,
                partnerId:_self.addEditDialogForm.partnerId,
                infoId:_self.addEditDialogForm.infoId,
                accessUrl:_self.addEditDialogForm.accessUrl,
                accessFlag:Number(_self.addEditDialogForm.accessFlag),
                callbackFlag:Number(_self.addEditDialogForm.callbackFlag),
                bizNo:bizNo,
                "bizIds":s
              };
              processSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].classpath = _self.addEditDialogForm.classpath;
                _self.tableData[_self.Editindex].partnerId = _self.addEditDialogForm.partnerId;
                _self.tableData[_self.Editindex].infoId = _self.addEditDialogForm.infoId;
                _self.tableData[_self.Editindex].accessUrl = _self.addEditDialogForm.accessUrl;
                _self.tableData[_self.Editindex].accessFlag = Number(_self.addEditDialogForm.accessFlag);
                _self.tableData[_self.Editindex].callbackFlag = Number(_self.addEditDialogForm.callbackFlag);
                _self.tableData[_self.Editindex].bizNo = bizNo;
                _self.dialogFormVisible = false;
                _self.loading2 = true;
                let data = {"bizNo":_self.searchData.key,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
                processList(data).then(function (res) {
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
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.classpath = _self.tableData[index].classpath;
        _self.addEditDialogForm.partnerId = _self.tableData[index].partnerId;
        _self.addEditDialogForm.infoId = _self.tableData[index].infoId;
        _self.addEditDialogForm.accessUrl = _self.tableData[index].accessUrl;
        _self.addEditDialogForm.accessFlag = Boolean(_self.tableData[index].accessFlag);
        _self.addEditDialogForm.callbackFlag = Boolean(_self.tableData[index].callbackFlag);
        _self.Editindex = index;
        let data = {"id":_self.tableData[index].id};
        processGet(data).then(function (res) {
          _self.searchData.list = res.data.bizs;
        });
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm.classpath = '';
          _self.addEditDialogForm.partnerId = '';
          _self.addEditDialogForm.infoId = '';
          _self.addEditDialogForm.accessUrl = '';
          _self.addEditDialogForm.accessFlag = false;
          _self.addEditDialogForm.callbackFlag = false
          _self.searchData.list.length=0;
        },20)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.bizNo + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            processDelete(data).then(function(res){
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
          this.$confirm('此操作将激活【' + row.bizNo + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            processRevoke(data).then(function(res){
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
        let data = {"bizNo":_self.searchData.key,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        processList(data).then(function (res) {
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
        let data = {"bizNo":_self.searchData.key,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        processList(data).then(function (res) {
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
        let data = {"bizNo":_self.searchData.key,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        processList(data).then(function (res) {
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
        this.$confirm('此操作将删除【' + _self.searchData.list[index].name + '】业务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.searchData.list.splice(index,1);
        }).catch((res)=>{
        })
      },
      editPbtnParam(){
        let _self = this;
        let data = {id: 0, name: "Unnamed", displayName: "请选择名称", categoryId: 0, status: 0};
        _self.searchData.list.push(data);
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
      if(myBrowser()==='FF'){
        _self.draggable =''
      }
      let data = {"bizNo":_self.searchData.key,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      processList(data).then(function (res) {
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
      let data2 = {"uId":"admin","user":this.account,"pageIndex":1,"pageSize":10000};
      descriptionList(data2).then(function(res){
        _self.columnCategoryList = res.data;
      })

    }

  }
</script>

<style lang="scss">
  .statistical-template-container{
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
