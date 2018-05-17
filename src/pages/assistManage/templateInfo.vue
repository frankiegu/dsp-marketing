<template>
  <div class="passageway-info-container" style="background-color: #fff">
    <el-row>
      <el-col>
        <!--搜索-->
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
              <el-input :span="5" v-model="searchData.industCode" @keyup.native.enter="searchEvent"  placeholder="请输入行业编码"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input :span="5" v-model="searchData.type" @keyup.native.enter="searchEvent"  placeholder="请输入类型"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="button" class="search-btn" @click="searchEvent">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="success" class="search-add"  @click="addListEvent('addSmsTemplate')">新增</el-button>
            </el-col>
          </el-row>
        </div>
        <!--搜索-->

        <!--主要表格-->
        <div class="search-table">
          <el-table
            ref="multipleTable"
            :data="tableData"
            v-loading="loading2"
            element-loading-text="拼命加载中"
            height="400"
            border
            :default-sort = "{prop: 'id', order: 'descending'}"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="id" label="#" width="70" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="industId" label="行业ID" width="120" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="industCode" label="行业编码" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="industName" label="行业名称" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="templateId" label="模板ID" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="templateContent" label="模板内容" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="templateType" label="模板类型" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="uId" label="拥有者" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-icon name="time"></el-icon>
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="138" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  :disabled= "scope.row.status==1?false:true"
                  @click="handleEdit('addSmsTemplate', scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  :type="scope.row.status === 1 ? 'gray' : 'success'"
                  @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                <!--<el-button-->
                <!--size="small"-->
                <!--type="danger"-->
                <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
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
        <!--主要表格-->

      </el-col>
    </el-row>

    <!--编辑-->
    <el-dialog :title='isEdit?"新增":"编辑"'  :visible.sync="dialogFormVisible">
      <el-form :model="addSmsTemplate" ref="addSmsTemplate">
        <el-form-item label="选择行业" :label-width="formLabelWidth">
          <el-button @click="selectTemplate2"  style="width:100%;">{{addSmsTemplate.industId?addSmsTemplate.industId+'：'+addSmsTemplate.industName:'请选择行业'}}</el-button>
        </el-form-item>
        <el-form-item label="选择模板" :label-width="formLabelWidth">
          <el-tooltip class="item" effect="dark" :content="addSmsTemplate.templateContent" placement="top" :disabled="addSmsTemplate.templateContent?false:true">
            <el-button @click="selectTemplate"  style="width:100%;">{{addSmsTemplate.templateId?addSmsTemplate.templateId:'请选择短信模板'}}</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="选择类型" :label-width="formLabelWidth">
          <el-input :span="5" v-model="addSmsTemplate.type"  placeholder="请输入类型"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addSmsTemplate')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑-->

    <!--选择短信模板-->
    <el-dialog :title="'添加参数'"  :visible.sync="addDialogParamVisible">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请输入短信模板名称" v-model="searchParamItemData"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem">搜索</el-button>
        </el-col>
      </el-row>
      <el-tooltip class="item" effect="dark" :content="item.templateContent" placement="top" v-for="(item,index) in smsParamsList" :key="item.id" :disabled="item.templateContent?false:true">
      <el-button  class="selctParams" type="primary" style="margin-bottom: 15px;margin-right:15px;margin-left: 0px;" @click.stop="addParamItem(index,'editParam',$event)">
        {{ item.id }}：<em style="color:chartreuse">{{ item.templateName }}</em>
      </el-button>
      </el-tooltip>
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
            <el-button @click="addDialogParamVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogParamVisible = false">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--选择短信模板-->


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
        {{ item.insId }}：<em style="color:chartreuse">{{ item.insName }}</em>
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

  import { templeteList} from '@/api/smsManagement/smsTemplate-api';
  import { cRelationList , cRelationAddOrModify , cRelationDelete , orgIndustryList} from '@/api/assist-api';
  import { mapState } from 'vuex';
  export default {
    name: 'passagewayInfo',
    data () {
      return {
        loading2:true,
        searchData: {
          key: '',
          type:'',
          insCode:'',
          industId:'',
          industCode:''
        },
        templateTypeList:[{
          "key": "1",
          "value": "通知类"
        }, {
          "key": "2",
          "value": "营销回复类"
        }],
        page: {},
        editindex:0,
        pageparam2:{},
        smsParamsList2:'',
        searchParamItemData2:'',
        addDialogParamVisible2:false,
        pageparam:{},
        smsParamsList:'',
        searchParamItemData:'',
        addDialogParamVisible:false,
        smsType:[{"indexd":"1","value2":"验证码短信"},{"indexd":"2","value2":"通知短信"},{"indexd":"3","value2":"营销短信"}],
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        isEdit: false,
        addSmsTemplate: {
          templateId: '',
          templateName:'',
          templateContent: '',
          industId: '',
          industName: '',
          industCode:'',
          type:''
        },

        formLabelWidth: '100px',
        rules: {

        }
      }
    },
    methods: {
      handleCurrentChangeParam2(val){
        let _self = this;
        let data = {"insCode":_self.searchData.insCode,"insName":_self.searchParamItemData2,"orgCode":_self.orgCode,"status":1,"uId": "admin",user:this.account, "currPage": val, "prePageResult": 12};
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
        let dataParam = {"insCode":_self.searchData.insCode,"insName":_self.searchParamItemData2,"orgCode":_self.orgCode,"status":1,"uId": "admin","user":_self.account, "currPage": 1, "prePageResult": 12};
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
        this.addSmsTemplate.industCode = _self.smsParamsList2[index].insCode;
        this.addSmsTemplate.industName = _self.smsParamsList2[index].insName;
        this.addDialogParamVisible2 = false;
      },
      searchParamItem2(){
        let _self =this;
        let dataParam = {"insCode":_self.searchData.insCode,"insName":_self.searchParamItemData2,"orgCode":_self.orgCode,"status":1,"uId": "admin","user":_self.account, "currPage": 1, "prePageResult": 12};
        orgIndustryList(dataParam).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2 = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
        })
      },
      handleCurrentChangeParam(val){
        let _self = this;
        let data = {"name":_self.searchParamItemData,"status":1,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": 12};
        templeteList(data).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam = {
            pageSize:12,
            total:res.total,
            currentPage:1
          }
        })
      },
      selectTemplate(){
        let _self= this;
        _self.addDialogParamVisible = true;
        let dataParam = {"name":_self.searchParamItemData,"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        templeteList(dataParam).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
        })
      },
      addParamItem(index,formName,ev){
        let _self = this;
        this.addSmsTemplate.templateId = _self.smsParamsList[index].id;
        this.addSmsTemplate.templateName = _self.smsParamsList[index].templateName;
        this.addSmsTemplate.templateContent = _self.smsParamsList[index].templateContent;
        this.addDialogParamVisible = false;
      },
      searchParamItem(){
        let _self =this;
        let dataParam = {"name":_self.searchParamItemData,"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        templeteList(dataParam).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
        })
      },
      searchEvent(){
        let _self = this;
        let key = this.searchData.key;
        let data = {"industCode":_self.searchData.industCode,"templateType":_self.searchData.type,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10};
        _self.loading2 = true;
        cRelationList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page = {
            pageSize: 10,
            total: res.total,
            currentPage: 1
          };
        }).catch(function (res) {
          console.log(res)
        })
      },
      addListEvent(formName){
        let _self =this;
        this.dialogFormVisible = true;
        this.isEdit=false;
        this.addSmsTemplate  = {
          templateId: '',
          templateName:'',
          templateContent: '',
          industCode: '',
          industName: '',
        };
        setTimeout(function(){
          _self.$refs[formName].resetFields()
        },20)
      },
      //状态显示
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

      handleEdit(formName, index, row) {
        this.isEdit = true;
        this.dialogFormVisible = true;
        this.editindex = index;
        this.addSmsTemplate.industId = this.tableData[index].industId;
        this.addSmsTemplate.industCode = this.tableData[index].industCode;
        this.addSmsTemplate.industName = this.tableData[index].industName;
        this.addSmsTemplate.templateContent = this.tableData[index].templateContent;
        this.addSmsTemplate.templateId = this.tableData[index].templateId;
        this.addSmsTemplate.type = this.tableData[index].templateType;

      },
      handleStop(index, row){
        let _self =this;
        if(row.status){
          this.$confirm('此操作将禁用【' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              id:_self.tableData[index].id,
              user:this.account,
              uId:"admin"//此处写死 admin
            }
            cRelationDelete(data).then(function (res) {
              _self.$message({
                type: 'success',
                message: '禁用成功!'
              });
              _self.tableData[index].status = 0;

            }).catch(function(res){
              console.log(res)

            })

          }).catch(() => {
            console.log('禁用取消');
          });
        }else{
          this.$confirm('此操作将激活【' + row.id + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              id:_self.tableData[index].id,
              user:this.account,
              status:1,
              uId:"admin"//此处写死 admin
            };
            cRelationDelete(data).then(function (res) {
              _self.$message({
                type: 'success',
                message: '激活成功!'
              });
              _self.tableData[index].status = 1;
            }).catch(function(res){
              console.log(res)

            })

          }).catch(() => {
            console.log('禁用取消');
          });
        }

      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除【' + row.name + '】回调, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.tableData.splice(index, 1);
        }).catch(() => {
          console.log('删除取消');
        });
      },
      findTemIndex(a,b){
        for(let i = 0 ; i<a.length; i++){
          if(a[i]==b){
            return i;
          }
        }
      },
      //表单提交模块
      submitForm(formName) {
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //编辑
            if(_self.isEdit){
              let data = {
                id:_self.tableData[_self.editindex].id,
                industId:_self.addSmsTemplate.industId,
                industCode:_self.addSmsTemplate.industCode,
                industName:_self.addSmsTemplate.industName,
                templateContent:_self.addSmsTemplate.templateContent,
                templateType:_self.addSmsTemplate.type,
                templateId:_self.addSmsTemplate.templateId,
                updateUser:_self.tableData[_self.editindex].updateUser,
                user:this.account,
                uId:"admin"//此处写死 admin
              };
              cRelationAddOrModify(data).then(function(res){
                _self.tableData[_self.editindex].industId = _self.addSmsTemplate.industId;
                _self.tableData[_self.editindex].industCode = _self.addSmsTemplate.industCode;
                _self.tableData[_self.editindex].industName = _self.addSmsTemplate.industName;
                _self.tableData[_self.editindex].templateContent = _self.addSmsTemplate.templateContent;
                _self.tableData[_self.editindex].templateId = _self.addSmsTemplate.templateId;
                _self.tableData[_self.editindex].templateType = _self.addSmsTemplate.type;
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });

              })

            }else{
              let data = {
                industId:_self.addSmsTemplate.industId,
                industCode:_self.addSmsTemplate.industCode,
                industName:_self.addSmsTemplate.industName,
                templateType:_self.addSmsTemplate.type,
                templateContent:_self.addSmsTemplate.templateContent,
                templateId:_self.addSmsTemplate.templateId,
                user:this.account,
                uId:"admin"//此处写死 admin
              }
              cRelationAddOrModify(data).then(function(res){
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                let data = {"industCode":_self.searchData.industCode,"templateType":_self.searchData.type,"uId": "admin",user:_self.account, "pageIndex": 1, "pageSize": _self.page.pageSize};
                _self.loading2 = true;
                cRelationList(JSON.stringify(data)).then(function (res) {
                  _self.loading2 = false;
                  _self.tableData = res.data;
                  _self.page = {
                    pageSize: _self.page.pageSize,
                    total: res.total,
                    currentPage: 1
                  };
                }).catch(function (res) {
                  console.log(res)
                })
              })
            }
          } else {
            return false;
          }
        });
      },
      //分页模块
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        let _self = this;
        let key = this.searchData.key;
        let data = {"industCode":_self.searchData.industCode,"templateType":_self.searchData.type,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": val};
        _self.loading2 = true;
        cRelationList(JSON.stringify(data)).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page = {
            pageSize: val,
            total: res.total,
            currentPage: 1
          };
        }).catch(function (res) {
          console.log(res)
        })
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        let _self = this;
        let key = this.searchData.key;
        let data = {"industCode":_self.searchData.industCode,"templateType":_self.searchData.type,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": this.page.pageSize};
        _self.loading2 = true;
        cRelationList(JSON.stringify(data)).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page = {
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: 1
          };
        }).catch(function (res) {
          console.log(res)
        })
      },
      handleChange(val){
        console.log(val)
      },
    },
    computed: {
      ...mapState({
        account:state=>state.user.userInfo.account,
        orgId:state=>state.user.userInfo.orgId,
        orgCode:state=>state.user.userInfo.orgCode

      })
    },
    created() {
      let _self = this;
      let data = {"industCode":_self.searchData.industCode,"templateType":_self.searchData.type,"uId": "admin", user:this.account, "pageIndex": 1, "pageSize": 10};
      _self.loading2 = true;
      cRelationList(data).then(function (res) {
        _self.loading2 = false;
        _self.tableData = res.data;
        _self.page = {
          pageSize: 10,
          total: res.total,
          currentPage: 1
        };
      }).catch(function (res) {
        console.log(res)
      })
    }
  }
</script>
