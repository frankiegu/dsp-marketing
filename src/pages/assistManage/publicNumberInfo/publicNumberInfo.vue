<template>

  <div class="public-number-info-container statistical-template-container" style="overflow: hidden">
    <div style="height:40px;margin-left: 10px;margin-top:10px;">
      <ul class="clearfix" style="border-bottom:3px solid #50BFFF">
        <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('publicNumberInfo')===-1" @click="$router.push('/home/publicNumberInfo/publicNumberInfo')">公众号配置</el-button>
      </ul>
    </div>
      <el-row>
        <el-col>
          <div class="search-container">
            <el-row :gutter="15">
              <el-col :span="2" :offset="22">
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
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item>
                      <div :key="item" v-for="(item,key) in props.row">
                          <div class="preview-list">
                            <span>{{key}}:{{item}}</span>

                          </div>

                      </div>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column type="selection" width="45"></el-table-column>
              <el-table-column prop="id" label="#"  show-overflow-tooltip> </el-table-column>
              <!--<el-table-column prop="aliAppId" label="aliAppId"  show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="aliPrikey" label="aliPrikey"  show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="aliPubkey" label="aliPubkey"  show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="appPayAccount" label="appPayAccount" show-overflow-tooltip width="200px"> </el-table-column>-->
              <el-table-column prop="pubName" label="名称" show-overflow-tooltip> </el-table-column>
              <!--<el-table-column prop="appSecret" label="appSecret" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="isAuth" label="isAuth" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="mchId" label="mchId" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="partner" label="partner" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="pkcsUrl" label="pkcsUrl" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="pubName" label="pubName" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="publicId" label="publicId" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="qrCodeImg" label="qrCodeImg" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="sellerId" label="sellerId" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="status" label="status" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="token" label="token" show-overflow-tooltip width="120px"> </el-table-column>-->
              <el-table-column prop="url" label="链接地址" show-overflow-tooltip> </el-table-column>
              <!--<el-table-column prop="wxAppId" label="wxAppId" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="wxAppSecret" label="wxAppSecret" show-overflow-tooltip width="200px"> </el-table-column>-->
              <!--<el-table-column prop="wxCodeType" label="wxCodeType" show-overflow-tooltip width="200px"> </el-table-column>-->
              <!--<el-table-column prop="wxKey" label="wxKey" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="wxNumber" label="wxNumber" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="wxOpenId" label="wxOpenId" show-overflow-tooltip width="120px"> </el-table-column>-->
              <!--<el-table-column prop="wxPrivateKey" label="wxPrivateKey" show-overflow-tooltip width="200px"> </el-table-column>-->
              <el-table-column prop="createTimeStr" label="创建时间" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="updateTimeStr" label="更新时间" show-overflow-tooltip> </el-table-column>
              <el-table-column label="操作"  show-overflow-tooltip  width="250px">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    :disabled= "scope.row.status==1?false:true"
                    @click="handleEdit('editDialogForm', scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="small"
                    type="success"
                    :disabled= "scope.row.status==1?false:true"
                    @click="$router.push({name:'publicNumberTemplate',path:'/publicNumberInfo/publicNumberTemplate',query:{id:scope.row.id}})">查看模板</el-button>
                  <el-button
                    size="small"
                    :type="scope.row.status === 1 ? 'gray' : 'success'"
                    @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-dialog :title='isEdit?"编辑":"新增"' :visible.sync="dialogFormVisible">
        <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
          <el-row :rows="5">
          </el-row>
          <el-form-item label="名称" prop="pubName" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.pubName"></el-input>
          </el-form-item>
          <el-form-item label="aliAppId" prop="aliAppId" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.aliAppId"></el-input>
          </el-form-item>
          <el-form-item label="aliPrikey" prop="aliPrikey" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.aliPrikey"></el-input>
          </el-form-item>
          <el-form-item label="aliPubkey" prop="aliPubkey" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.aliPubkey"></el-input>
          </el-form-item>
          <el-form-item label="appPayAccount" prop="appPayAccount" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.appPayAccount"></el-input>
          </el-form-item>
          <el-form-item label="appSecret" prop="appSecret" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.appSecret"></el-input>
          </el-form-item>
          <el-form-item label="isAuth" prop="isAuth" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.isAuth"></el-input>
          </el-form-item>
          <el-form-item label="mchId" prop="mchId" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.mchId"></el-input>
          </el-form-item>
          <el-form-item label="partner" prop="partner" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.partner"></el-input>
          </el-form-item>
          <el-form-item label="pkcsUrl" prop="pkcsUrl" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.pkcsUrl"></el-input>
          </el-form-item>
          <el-form-item label="pubName" prop="pubName" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.custName"></el-input>
          </el-form-item>
          <el-form-item label="publicId" prop="publicId" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.publicId"></el-input>
          </el-form-item>
          <el-form-item label="qrCodeImg" prop="qrCodeImg" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.qrCodeImg"></el-input>
          </el-form-item>
          <el-form-item label="sellerId" prop="sellerId" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.sellerId"></el-input>
          </el-form-item>
          <el-form-item label="status" prop="status" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.status"></el-input>
          </el-form-item>
          <el-form-item label="token" prop="token" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.token"></el-input>
          </el-form-item>
          <el-form-item label="url" prop="url" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.url"></el-input>
          </el-form-item>
          <el-form-item label="wxAppId" prop="wxAppId" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.wxAppId"></el-input>
          </el-form-item>
          <el-form-item label="wxAppSecret" prop="wxAppSecret" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.wxAppSecret"></el-input>
          </el-form-item>
          <el-form-item label="wxCodeType" prop="wxCodeType" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.wxCodeType"></el-input>
          </el-form-item>
          <el-form-item label="wxKey" prop="wxKey" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.wxKey"></el-input>
          </el-form-item>
          <el-form-item label="wxNumber" prop="wxNumber" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.wxNumber"></el-input>
          </el-form-item>
          <el-form-item label="wxOpenId" prop="wxOpenId" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.wxOpenId"></el-input>
          </el-form-item>
          <el-form-item label="wxPrivateKey" prop="wxPrivateKey" :label-width="formLabelWidth">
            <el-input v-model="addEditDialogForm.wxPrivateKey"></el-input>
          </el-form-item>
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
    import { wxListInfos , deleteBindingInfo , revokeBindingInfo  , wxSaveBindingInfo } from '@/api/assist-api'
    export default {
      name: 'app',
      data () {
        return {
          value3:[new Date(2018, 1, 10, 8, 40), new Date(2018, 1, 10, 9, 40)],
          loading2: true,//加载菊花
          searchData:{
            interval:'',
            code:'',
            status:'',
            name:''
          },
          addEditDialogForm:{
            aliAppId:'',
            aliPrikey:'',
            aliPubkey:'',
            appId:'',
            appPayAccount:'',
            appSecret:'',
            custName:'',
            isAuth:'',
            mchId:'',
            partner:'',
            pkcsUrl:'',
            pubName:'',
            publicId:'',
            qrCodeImg:'',
            sellerId:'',
            status:'',
            token:'',
            url:'',
            wxAppId:'',
            wxAppSecret:'',
            wxCodeType:'',
            wxKey:'',
            wxNumber:'',
            wxOpenId:'',
            wxPrivateKey:'',
          },
          isEdit:true,
          Editindex:0,
          columnCategoryList:[{"type":1,"value":"具体IP"},{"type":2,"value":"范围IP"}],
          dataList:[],
          formLabelWidth:'100px',
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
        submitForm(formName){
          let _self = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(_self.isEdit){
                  let data = _self.addEditDialogForm;
                  data.id = _self.tableData[_self.Editindex].id;
                wxSaveBindingInfo(data).then(function (res) {
                  _self.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });
                  _self.tableData[_self.Editindex].aliAppId = _self.addEditDialogForm.aliAppId;
                  _self.tableData[_self.Editindex].aliPrikey = _self.addEditDialogForm.aliPrikey;
                  _self.tableData[_self.Editindex].aliPubkey = _self.addEditDialogForm.aliPubkey;
                  _self.tableData[_self.Editindex].appId = _self.addEditDialogForm.appId;
                  _self.tableData[_self.Editindex].appPayAccount = _self.addEditDialogForm.appPayAccount;
                  _self.tableData[_self.Editindex].appSecret = _self.addEditDialogForm.appSecret;
                  _self.tableData[_self.Editindex].custName = _self.addEditDialogForm.custName;
                  _self.tableData[_self.Editindex].isAuth = _self.addEditDialogForm.isAuth;
                  _self.tableData[_self.Editindex].mchId = _self.addEditDialogForm.mchId;
                  _self.tableData[_self.Editindex].partner = _self.addEditDialogForm.partner;
                  _self.tableData[_self.Editindex].pkcsUrl = _self.addEditDialogForm.pkcsUrl;
                  _self.tableData[_self.Editindex].pubName = _self.addEditDialogForm.pubName;
                  _self.tableData[_self.Editindex].qrCodeImg = _self.addEditDialogForm.qrCodeImg;
                  _self.tableData[_self.Editindex].sellerId = _self.addEditDialogForm.sellerId;
                  _self.tableData[_self.Editindex].status = _self.addEditDialogForm.status;
                  _self.tableData[_self.Editindex].token = _self.addEditDialogForm.token;
                  _self.tableData[_self.Editindex].url = _self.addEditDialogForm.url;
                  _self.tableData[_self.Editindex].wxAppId = _self.addEditDialogForm.wxAppId;
                  _self.tableData[_self.Editindex].wxAppSecret = _self.addEditDialogForm.wxAppSecret;
                  _self.tableData[_self.Editindex].wxCodeType = _self.addEditDialogForm.wxCodeType;
                  _self.tableData[_self.Editindex].wxKey = _self.addEditDialogForm.wxKey;
                  _self.tableData[_self.Editindex].wxNumber = _self.addEditDialogForm.wxNumber;
                  _self.tableData[_self.Editindex].wxOpenId = _self.addEditDialogForm.wxOpenId;
                  _self.tableData[_self.Editindex].wxPrivateKey = _self.addEditDialogForm.wxPrivateKey;
                  _self.dialogFormVisible = false;
                })
              }else{
                  let data = _self.addEditDialogForm;
                wxSaveBindingInfo(data).then(function (res) {
                  _self.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                  _self.loading2 = true;
                  wxListInfos().then(function (res) {
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
          _self.addEditDialogForm.aliAppId =_self.tableData[index].aliAppId;
          _self.addEditDialogForm.aliPrikey =_self.tableData[index].aliPrikey;
          _self.addEditDialogForm.aliPubkey =_self.tableData[index].aliPubkey;
          _self.addEditDialogForm.appId =_self.tableData[index].appId;
          _self.addEditDialogForm.appPayAccount =_self.tableData[index].appPayAccount;
          _self.addEditDialogForm.appSecret =_self.tableData[index].appSecret;
          _self.addEditDialogForm.custName =_self.tableData[index].custName;
          _self.addEditDialogForm.isAuth =_self.tableData[index].isAuth;
          _self.addEditDialogForm.mchId =_self.tableData[index].mchId;
          _self.addEditDialogForm.partner =_self.tableData[index].partner;
          _self.addEditDialogForm.pkcsUrl =_self.tableData[index].pkcsUrl;
          _self.addEditDialogForm.pubName =_self.tableData[index].pubName;
          _self.addEditDialogForm.qrCodeImg =_self.tableData[index].qrCodeImg;
          _self.addEditDialogForm.sellerId =_self.tableData[index].sellerId;
          _self.addEditDialogForm.status =_self.tableData[index].status;
          _self.addEditDialogForm.token =_self.tableData[index].token;
          _self.addEditDialogForm.url =_self.tableData[index].url;
          _self.addEditDialogForm.wxAppId =_self.tableData[index].wxAppId;
          _self.addEditDialogForm.wxAppSecret =_self.tableData[index].wxAppSecret;
          _self.addEditDialogForm.wxCodeType =_self.tableData[index].wxCodeType;
          _self.addEditDialogForm.wxKey =_self.tableData[index].wxKey;
          _self.addEditDialogForm.wxNumber =_self.tableData[index].wxNumber;
          _self.addEditDialogForm.wxOpenId =_self.tableData[index].wxOpenId;
          _self.addEditDialogForm.wxPrivateKey =_self.tableData[index].wxPrivateKey;
          _self.Editindex = index;
        },
        addListEvent(name){
          let _self = this;
          setTimeout(function(){
            _self.isEdit = false;
            _self.dialogFormVisible = true;
            _self.addEditDialogForm={
              aliAppId:'',
              aliPrikey:'',
              aliPubkey:'',
              appId:'',
              appPayAccount:'',
              appSecret:'',
              custName:'',
              isAuth:'',
              mchId:'',
              partner:'',
              pkcsUrl:'',
              pubName:'',
              publicId:'',
              qrCodeImg:'',
              sellerId:'',
              status:'',
              token:'',
              url:'',
              wxAppId:'',
              wxAppSecret:'',
              wxCodeType:'',
              wxKey:'',
              wxNumber:'',
              wxOpenId:'',
              wxPrivateKey:'',
            }
          },200)
        },
        handleStop(index,row){
          let _self = this;
          let data = {"id":_self.tableData[index].id};
          if(_self.tableData[index].status===1){
            this.$confirm('此操作将禁用【' + row.pubName + '】, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              deleteBindingInfo(data).then(function(res){
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
            this.$confirm('此操作将激活【' + row.pubName + '】, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              revokeBindingInfo(data).then(function(res){
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
          wxListInfos().then(function (res) {
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
          wxListInfos().then(function (res) {
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
          wxListInfos().then(function (res) {
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
        })
      },
      created() {
        let _self = this;
        _self.loading2 = true;
        wxListInfos().then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
        });

      }

    }
  </script>

  <style lang="scss">

  </style>



