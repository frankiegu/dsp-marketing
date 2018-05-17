<template>
  <div class="statistical-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
              <el-input :span="5" v-model="searchData.key"  placeholder="请输入名称"></el-input>
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
            <el-table-column prop="name" label="名称"  show-overflow-tooltip> </el-table-column>
            <!--<el-table-column prop="type" label="类型"  show-overflow-tooltip> </el-table-column>-->
            <el-table-column prop="remark" label="描述" show-overflow-tooltip> </el-table-column>
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
    <!--选择数据列-->
    <el-dialog :title="'选择数据列'" :visible.sync="addDialogParamVisible2">
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
        <el-form-item label="名称" prop="name1" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.name1"  placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="name3" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.name3"  placeholder="请输入描述"></el-input>
        </el-form-item>
        <div class="editPbtnWrap">
          <el-button  :span="5" class="editPbtn" type="primary" icon="plus" @click="editPbtnParam">添加数据列</el-button>
        </div>
        <div class="btn-wrap" id="btn-wrap">
          <div v-show="draggable&&searchData.list.length?true:false">
            <el-alert
              title="这里可以拖拽按钮改变列的顺序，可在 统计管理 -> 统计明细 中看到效果哦"
              type="warning"
              close-text="知道了"
              style="margin-bottom: 15px;"
            >
            </el-alert>
          </div>
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
  import { tableList , columnQuery , tableGet , columnRevoke , columnList , tableSave , tableDelete ,tableRevoke } from '@/api/statisticalManage/statisticalManage-api'
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
          name1:'',
          name2:'',
          name3:''
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
        let data2 = {"name":_self.searchParamItemData,"currPage":1,"prePageResult":10 };
        columnList(data2).then(function (res) {
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
        let data2 = {"name":_self.searchParamItemData,"currPage":val,"prePageResult":10 };
        columnList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //选择数据列
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
        _self.addDialogParamVisible2 = true;
        _self.searchParamItemData = '';
        let data2 = {"name":_self.searchParamItemData,"currPage":1,"prePageResult":10};
        columnList(data2).then(function (res) {
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
                      message:"抱歉，有"+UnnameCount+"个Unnamed数据列！"
                    })
                    return
                  }
              }

              let s = '';
              for (let i = 0 ;i<newArr.length; i++){
                  if(i===0){
                    s+=newArr[i].id
                  }else{
                    s+= ','+newArr[i].id
                  }
              }

              let data = {"id":_self.tableData[_self.Editindex].id,"name":_self.addEditDialogForm.name1,"remark":_self.addEditDialogForm.name3,"type":_self.addEditDialogForm.name2,"cols":s};
              tableSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].remark = _self.addEditDialogForm.name3;
                _self.tableData[_self.Editindex].name = _self.addEditDialogForm.name1;
                _self.tableData[_self.Editindex].type = _self.addEditDialogForm.name2;
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
              for (let i = 0 ;i<newArr.length; i++){
                if(i===0){
                  s+=newArr[i].id
                }else{
                  s+= ','+newArr[i].id
                }
              }

              let data = {"name":_self.addEditDialogForm.name1,"remark":_self.addEditDialogForm.name3,"cols":s};
              tableSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].remark = _self.addEditDialogForm.name3;
                _self.tableData[_self.Editindex].type = _self.addEditDialogForm.name2;
                _self.dialogFormVisible = false;
                _self.loading2 = true;
                let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
                tableList(data).then(function (res) {
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
        _self.addEditDialogForm.name1 = _self.tableData[index].name;
        _self.addEditDialogForm.name3 = _self.tableData[index].remark;
        _self.addEditDialogForm.name2 = _self.tableData[index].type;
        _self.Editindex = index;
        let data = {"id":_self.tableData[index].id};
            tableGet(data).then(function (res) {
            _self.searchData.list = res.data.columns;
        });
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm.name1 = '';
          _self.addEditDialogForm.name2 = '';
          _self.addEditDialogForm.name3 = '';
          _self.searchData.list.length=0;
//          _self.$refs[name].resetFields()
        },20)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.name + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            tableDelete(data).then(function(res){
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
          this.$confirm('此操作将激活【' + row.name + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            tableRevoke(data).then(function(res){
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
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        tableList(data).then(function (res) {
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
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        tableList(data).then(function (res) {
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
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        tableList(data).then(function (res) {
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
        this.$confirm('此操作将删除【' + _self.searchData.list[index].name + '】数据列, 是否继续?', '提示', {
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
      let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      tableList(data).then(function (res) {
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
      columnQuery(data2).then(function(res){
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
