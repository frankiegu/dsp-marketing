<template>
    <div class="sys-organiza-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="10" placeholder="请输入关键字"></el-input>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>
            <el-button type="success" class="search-add"  @click="handleAdd()">新增</el-button>
          </div>
          <div class="search-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              height="400"
              border
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="组织编号" width="120"> </el-table-column>
              <el-table-column prop="name" label="组织名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.name }}  <span class="text-red">【{{ scope.row.code }}】</span>
                </template>
              </el-table-column>
              <el-table-column prop="statusStr" label="组织状态" width="120">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === 1 ? 'success' : 'gray'">{{ scope.row.statusStr }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="210">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="small"
                    :type="scope.row.status === 1 ? 'gray' : 'success'"
                    @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="search-page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>

      <!--选择合作方-->
      <el-dialog :title="'选择合作方'" :visible.sync="addDialogParamVisible2">
        <el-row style="margin-bottom: 15px;">
          <el-col :span="12" :offset="4">
            <el-input placeholder="请输入参数名称" v-model="searchParamItemData"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem">搜索</el-button>
          </el-col>
        </el-row>
        <el-button  class="selctParams" type="primary" v-for="(item , index) in smsParamsList" :key="item.id" @click.stop="addParamItem(index,'editParam',$event)">
          {{ item.id }} {{ item.id?'：':'' }}<em style="color:chartreuse">{{ item.name }}</em>
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

      <el-dialog :title='isEdit?"编辑组织":"新增组织"' size="tiny" :visible.sync="dialogFormVisible">
        <el-form :model="addOrganize" :rules="rules" ref="addOrganize">
          <el-form-item label="组织编号" :label-width="formLabelWidth" v-show="isEdit">
            <el-input v-model="addOrganize.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="组织code" :label-width="formLabelWidth" required prop="code">
            <el-input v-model="addOrganize.code" :readonly="isEdit" :disabled="isEdit" class="wid_80" auto-complete="off"  placeholder="请填写code"></el-input>
          </el-form-item>
          <el-form-item label="组织名称" :label-width="formLabelWidth" required prop="name">
            <el-input v-model="addOrganize.name" class="wid_80" auto-complete="off"  placeholder="请选择角色名称"></el-input>
          </el-form-item>
          <el-form-item label="组织主体手机" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="addOrganize.mobile" :maxlength="11" class="wid_80" auto-complete="off"  placeholder="请选择组织主体手机"></el-input>
          </el-form-item>
          <el-form-item label="组织主体邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="addOrganize.email" class="wid_80" auto-complete="off" placeholder="请选择组织主体邮箱"></el-input>
          </el-form-item>
          <div class="editPbtnWrap">
            <el-button  :span="5" class="editPbtn" type="primary" icon="plus" @click="editPbtnParam">添加合作方</el-button>
          </div>
          <div class="btn-wrap" id="btn-wrap">
            <div v-show="draggable&&searchData.list.length?true:false">
              <el-alert
                title="这里可以拖拽按钮改变合作方的顺序"
                type="warning"
                close-text="知道了"
                style="margin-bottom: 15px;"
              >
              </el-alert>
            </div>
            <draggable v-model="searchData.list" :options="{draggable:'.draggable'}" >
              <ry-button :type="item.id==0?'warning':'primary'"  :class="draggable?draggable:'ffdraggable'" v-for="(item,index) in searchData.list" :key="item.id">
                <em style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">{{item.id}}</em>
                <em style="color:chartreuse;-moz-user-select: none;-khtml-user-select: none;user-select: none;" @click.stop="">{{item.name?'：'+item.name:''}}</em>
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
          <el-button type="primary" @click="handleSubmit('addOrganize')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import RyButton from '@/components/RyButton';
  import { myBrowser } from '@/util/util';
  import { orgList,orgInfo,orgSave,orgModifyStatus,partnerList } from '@/api/system-api'
  export default {
    name: 'sysOrganization',
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
          list:[]
        },
        page:{
          pageSize:10,
          total:0,
          pageIndex: 1
        },
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        isEdit:false,
        addOrganize: {
          id:'',
          name: '',
          mobile: '',
          code:'',
          email: '',
          parts:''
        },
        formLabelWidth: '100px',
        rules: {
          code: [
            { required: true, message: '请输入组织code',  pattern: /^[_a-zA-Z0-9]+$/,  trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入组织名称', trigger: 'blur' },
            { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
          ],
          mobile: [
            { required: false , pattern: /^1[34578]\d{9}$/, message: '请正确的11位手机号码', trigger: 'change' }
          ],
          email: [
            { required: false, type: 'email', message: '请正确的邮箱地址', trigger: 'change' }
          ]
        }
      }
    },
    components: {draggable , RyButton},
    methods: {
      searchEvent(){
        this.list(10,1);
      },
      //自定义事件
      handleEdit(index, row) {
        this.isEdit=true;
        this.addOrganize= {
            id:row.id,
            code:row.code,
            name: row.name,
            mobile:row.mobile,
            email: row.email,
            parts:row.sortParts
        };
        this.dialogFormVisible=true;
        let data = {"id":this.tableData[index].id};
        let _self = this;
        orgInfo(data).then(function (res) {
          _self.searchData.list = res.data.partners;
        });
      },
      handleStop(index, row){
        this.$confirm('此操作将'+ (row.status == 5 ? '激活':'禁用') + '【'+row.name+'】组织, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let _data={
                id:row.id,
                status:row.status==1 ? 5 : 1
            };
           orgModifyStatus(_data).then(data=>{
              this.$message({
                type: 'success',
                message: (row.status == 5 ? '激活':'禁用') + '成功!'
              });
              this.list(this.page.pageSize,1);
          });
        }).catch(() => {
          console.log('禁用取消');
        });
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除【'+row.name+'】组织, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            id:row.id,
            status:6
          };
          orgModifyStatus(_data).then(data=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list(this.page.pageSize,1);
          });
        }).catch(() => {
          console.log('删除取消');
        });
      },
      handleAdd(){
        this.dialogFormVisible = true;
        this.isEdit=false;
        this.addOrganize={
          id:'',
          name: '',
          code:'',
          mobile: '',
          email: '',
          parts:''
        }
      },
      //表单提交模块
      handleSubmit(formName) {
        let _self=this;
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
                    message:"抱歉，有"+UnnameCount+"个Unnamed合作方！"
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
              this.addOrganize.parts = s;
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
              this.addOrganize.parts = s;
            }
            console.log(this.addOrganize);
            orgSave(this.addOrganize).then(data=>{
                _self.$message({
                  type: 'success',
                  message: '保存成功!'
                });
                this.dialogFormVisible=false;
                this.list(this.page.pageSize,1);
                _self.handleReset(formName);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleReset(formName) {
        this.$refs[formName].resetFields();
      },

      list(pageSize,pageIndex){
        let _data={
          pageSize,
          pageIndex,
          name:this.searchData.key
        };
        orgList(_data).then((data)=>{
          if(data.code==1){
            this.tableData=data.data;
            this.page.total=data.total;
          }
        });
      },
      //分页模块
      handleSizeChange(pageSize) {
        this.list(pageSize,1);
      },
      handleCurrentChange(pageIndex) {
        this.list(this.page.pageSize,pageIndex);
      },
      //表格处理模块
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleCurrentChangeParam(val){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"pageIndex":val,"pageSize":10 };
        partnerList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      searchParamItem(){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"pageIndex":1,"pageSize":10 };
        partnerList(data2).then(function (res) {
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
              message: '合作方重复，添加失败!'
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
        let data2 = {"name":_self.searchParamItemData,"pageIndex":1,"pageSize":10};
        partnerList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      deleteParam(index){
        let _self = this;
        this.$confirm('此操作将删除【' + _self.searchData.list[index].name + '】合作方, 是否继续?', '提示', {
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
        let data = {id: 0, name: "Unnamed"};
        _self.searchData.list.push(data);
      },
    },

    computed: {},
    created() {
      if(myBrowser()==='FF'){
        this.draggable =''
      }
      let _data={
        pageSize:this.page.pageSize,
        pageIndex: this.page.pageIndex,
        name:this.searchData.key
      };
      orgList(_data).then(data=>{
        this.tableData=data.data;
        this.page.total=data.total;
      });
    }
  }
</script>

<style lang="scss">
  .sys-organiza-container{
    .editPbtn{

    }
    .el-select{

    }
    .el-input-group__prepend{width:30%;}
    .fSelect .el-select{
      width:100%;
    }
    .selctParams{
      margin-bottom: 10px;
    }
    .selctParams:nth-child(1){
      margin-left: 10px;
    }
    .editPbtnWrap{
      border-top: 1px solid #ddd;
      position: relative;
      height:61px;

      .editPbtn{
        position:absolute;
        right:0;
        top:15px;
        em{
          color:chartreuse;
        }
      }
    }
    .btn-wrap{box-shadow: 0 0 1px #ddd;padding:15px;}

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
