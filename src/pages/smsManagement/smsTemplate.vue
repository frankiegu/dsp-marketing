<template>
  <div class="sms-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
                <el-input :span="5" v-model="searchData.key"  placeholder="请输入模板名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.type" :span="5" placeholder="请选择模板类型" clearable filterable >
                <el-option :label="templateTypeList.item" :value="item"  v-for="item in templateTypeList" :key="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="button" class="search-btn" @click="searchEvent">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="success" class="search-add"  @click="addListEvent('addSmsTemplate')">新增</el-button>
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
            :default-sort = "{prop: 'id', order: 'descending'}"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="id" label="#" width="70" show-overflow-tooltip> </el-table-column>
            <!--<el-table-column prop="vendor" label="运营商" width="80" show-overflow-tooltip> </el-table-column>-->
            <el-table-column prop="templateType" label="类型" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag :type="'success'">{{ templateTypeList[scope.row.templateType] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="templateName" label="名称" width="120" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="templateContent" label="内容" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="wordNumber" label="字数" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createUser" label="创建者" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="updateTime" label="最后更新" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-icon name="time"></el-icon>
                {{ scope.row.updateTime }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'gray'">{{ scope.row.status === 1 ? '可用' : '不可用' }}</el-tag>
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
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-col>
            <!--<el-button id="dataExport" type="primary">数据导出<i class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->

          </el-col>
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
    <el-dialog :title="'编辑参数'"  :visible.sync="dialogParamVisibleItem">
      <el-form :model="editParam" :rules="rulesParam" ref="editParam">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="editParamName">
          <el-input v-model="editParam.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="关键字" :label-width="formLabelWidth" prop="editParamKeyword">
          <el-input v-model="editParam.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth">
          <el-input  :disabled="true" placeholder="值" :value="'{#'+editParam.keyword+'}'"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="editParamRemark">
          <el-input v-model="editParam.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogParamVisibleItem = false">取 消</el-button>
            <el-button type="primary" @click="submitParamForm('editParam')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'参数管理'"  :visible.sync="dialogParamVisible">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请输入参数名称" v-model="searchParamItemData"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem">搜索</el-button>
        </el-col>
      </el-row>
      <el-button class="addParamsCom" type="primary" icon="plus" @click="addParams">添加参数</el-button>
        <el-button  class="selctParams" type="primary" v-for="(item,index) in smsParamsList" :key="item.id" @click.stop="editParamItem(index,'editParam',$event)">
          {{ item.name }}：<em style="color:chartreuse">{{ item.value }}</em>
          <i class="el-icon-close el-icon--right" @click.stop="deleteParam(index)"></i>
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
              <el-button @click="dialogParamVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogParamVisible = false">确 定</el-button>
            </el-col>
          </el-row>
        </div>
    </el-dialog>
    <el-dialog :title="'添加参数'"  :visible.sync="addDialogParamVisible">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请输入参数名称" v-model="searchParamItemData"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem">搜索</el-button>
        </el-col>
      </el-row>
      <el-button  class="selctParams" type="primary" v-for="(item,index) in smsParamsList" :key="item.id" @click.stop="addParamItem(index,'editParam',$event)">
        {{ item.name }}：<em style="color:chartreuse">{{ item.value }}</em>
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
            <el-button @click="addDialogParamVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogParamVisible = false">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :title='isEdit?"新增模板":"编辑模板"'  :visible.sync="dialogFormVisible">
      <el-form :model="addSmsTemplate" :rules="rules" ref="addSmsTemplate">
        <el-form-item label="模板名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addSmsTemplate.name" placeholder="请输入模板名称"></el-input>
        </el-form-item>

        <el-form-item label="模板类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="addSmsTemplate.type"  placeholder="请选择模板类型" clearable filterable >
            <el-option :label="templateTypeList.item" :value="item"  v-for="item in templateTypeList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-row :rows="5">
          <el-col :span="24">
            <el-form-item label="模板内容" prop="content" :label-width="formLabelWidth" class="smsContent">
              <el-input type="textarea" style="padding-right:120px;" :autosize="{ minRows: 4, maxRows: 4}"   placeholder="请输入模板内容" v-model="addSmsTemplate.content" ></el-input>
            </el-form-item>
            <el-button class="editPbtn" type="primary" icon="plus" @click="editPbtnParam">添加参数</el-button>
            <el-button class="addPbtn" type="primary" icon="edit" @click="selectParam">参数管理</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addSmsTemplate')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { templeteList,addOrModify,deleteTemplate,smsParamsList,paramsAddOrModify,paramsDelete } from '@/api/smsManagement/smsTemplate-api';
  import { mapState } from 'vuex';
  export default {
    name: 'smsTemplate',
    data () {
      return {
        loading2:true,
        searchData: {
          key: '',
          type:''
        },
        editParam:{
          name:'',
          keyword:'',
          value:'',
          remark:''
        },
        searchParamItemData:"",
        editParamIndex:0,
        page: {},
        dialogParamVisibleItem:false,
        pageparam:{},
        editindex:0,
        smsParamsList:[],
        regionOptions: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }],

        templateTypeList: ['营销模板', '订购通知', '二次验证模板', '失败通知', '成功通知'],
        tableData: [],
        multipleSelection: [],
        dialogParamVisible:false,
        dialogFormVisible: false,
        addDialogParamVisible:false,
        isEdit: false,
        addSmsTemplate: {
          name: '',
          region: ["zhinan", "shejiyuanze", "fankui"],
          operator: '',
          type: '',
          content: '',
          smsParams:''
        },
        formLabelWidth: '100px',
        rulesParam:{
          editParamName:[
            {required: false, message: '请输入名称', trigger: 'blur'}
          ],
          editParamKeyword:[
            {required: false, message: '请输入关键字', trigger: 'blur'}
          ],
          editParamRemark:[
            {required: false, message: '请输入备注', trigger: 'blur'}
          ]
      },
        rules: {
          name: [
            {required: true, message: '请输入模板名称', trigger: 'blur'},
          ],
          content: [
            {required: true, message: '请输入模板内容', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请输入模板类型', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      searchParamItem(){
        let _self =this;
        let dataParam = {"name":_self.searchParamItemData,"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        smsParamsList(dataParam).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam = {
            pageSize:12,
            total:res.total,
            currentPage:0
          };
          console.log(_self.pageparam)
        })
      },
      addParamItem(index,formName,ev){
        let _self = this;
        this.addSmsTemplate.content += "{#"+_self.smsParamsList[index].keyword+"}"
        this.addDialogParamVisible = false;
      },
      submitParamForm(formName){

        let _self = this;
        let data = {"id":_self.smsParamsList[_self.editParamIndex].id,"uId": "admin","user":_self.account,"name":_self.editParam.name,"keyword":_self.editParam.keyword,"value":'{#'+_self.editParam.keyword+'}',"remark":_self.editParam.remark};
        paramsAddOrModify(data).then(function(res){
          _self.dialogParamVisibleItem = false;
          _self.smsParamsList[_self.editParamIndex].keyword = _self.editParam.keyword;
          _self.smsParamsList[_self.editParamIndex].remark = _self.editParam.remark;
          _self.smsParamsList[_self.editParamIndex].name = _self.editParam.name;
          _self.smsParamsList[_self.editParamIndex].value = "{#"+ _self.editParam.keyword +"}";
          _self.$message({
            type: 'success',
            message: '编辑成功!'
          });
        })
      },
      editParamItem(index,formName,ev){
        let _self = this;
        _self.dialogParamVisibleItem = true;
        _self.editParam.keyword = _self.smsParamsList[index].keyword;
        _self.editParam.remark = _self.smsParamsList[index].remark;
        _self.editParam.name = _self.smsParamsList[index].name;
        _self.editParam.value = "{#"+_self.smsParamsList[index].keyword+"}";
        _self.editParamIndex =index;
        setTimeout(function(){
          _self.$refs[formName].resetFields()
        },20)
      },
      deleteParam(index){
        let _self = this;
        let data = {
          id:_self.smsParamsList[index].id,
          user:this.account,
          uId:"admin"//此处写死 admin
        };
        paramsDelete(data).then(function (res) {
          _self.$message({
            type: 'success',
            message: '删除成功!'
          });
          _self.smsParamsList[index].status = 0;
          let dataParam = {"name":_self.searchParamItemData,"status":1,"uId": "admin","user":_self.account, "pageIndex": _self.pageparam.currentPage, "pageSize": 12};
          smsParamsList(dataParam).then(function (res) {
            _self.smsParamsList = res.data;
            _self.pageparam = {
              pageSize:12,
              total:res.total,
              currentPage:_self.pageparam.currentPage
            };
          })
        }).catch(function(res){
          console.log(res)
        })
      },
      editPbtnParam(){
        this.addDialogParamVisible = true;
        let _self = this;
        _self.searchParamItemData ='';
        let dataParam = {"name":_self.searchParamItemData,"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        smsParamsList(dataParam).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam = {
            pageSize:12,
            total:res.total,
            currentPage:1
          };
        })
      },
      addParams(){
        let _self = this;
        let data = {"uId": "admin","user":this.account,"name":"未命名","keyword":"未命名","value":"{#未命名}","remark":"未命名"};
        paramsAddOrModify(data).then(function(res){
          let dataParam = {"name":_self.searchParamItemData,"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
          smsParamsList(dataParam).then(function (res) {
            console.log(res);
            _self.smsParamsList = res.data;
            _self.pageparam = {
              pageSize:12,
              total:res.total,
              currentPage:0
            };
            console.log(_self.pageparam)
          })
        })
      },
      selectParam(){
        this.dialogParamVisible = true;
        let _self = this;
        _self.searchParamItemData ='';
        let data = {"name":_self.searchParamItemData,"status":1,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 12};
        smsParamsList(data).then(function (res) {
          console.log(res);
          _self.smsParamsList = res.data;
          _self.pageparam = {
            pageSize:12,
            total:res.total,
            currentPage:1
          };
          console.log(_self.pageparam)
        }).catch(function (res) {
          console.log(res)
        });
      },
      searchEvent(){
        let _self = this;
        let key = this.searchData.key;
        let type = this.searchData.type;
        let data = {"templateName":key,"templateType":_self.findTemIndex(_self.templateTypeList,type),"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10};
        _self.loading2 = true;
        templeteList(data).then(function (res) {
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
      addEvent(){
      },
      addListEvent(formName){
        let _self =this;
        this.dialogFormVisible = true;
        this.isEdit=false;

        setTimeout(function(){
          _self.addSmsTemplate  = {
            name: '',
            region: ["zhinan", "shejiyuanze", "fankui"],
            operator: '',
            type: '',
            content: ''
          };
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
        this.addSmsTemplate.name = this.tableData[index].templateName;
        this.addSmsTemplate.content = this.tableData[index].templateContent;
        this.addSmsTemplate.type = this.templateTypeList[this.tableData[index].templateType]
      },
      handleStop(index, row){
        let _self =this;
        if(row.status){
          this.$confirm('此操作将禁用【' + row.templateName + '】短信模板, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              id:_self.tableData[index].id,
              user:this.account,
              uId:"admin"//此处写死 admin
            }
            deleteTemplate(data).then(function (res) {
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
          this.$confirm('此操作将激活【' + row.templateName + '】短信模板, 是否继续?', '提示', {
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
            deleteTemplate(data).then(function (res) {
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
        this.$confirm('此操作将删除【' + row.templateName + '】短信模板, 是否继续?', '提示', {
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
        let _self = this;
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
                  templeteName:_self.addSmsTemplate.name,
                  templateContent:_self.addSmsTemplate.content,
                  templateType:_self.findTemIndex(_self.templateTypeList,_self.addSmsTemplate.type),
                  user:_self.account,
                  uId:"admin"//此处写死 admin
                }
              addOrModify(data).then(function(res){
                console.log(res);
                _self.tableData[_self.editindex].templateName = _self.addSmsTemplate.name;
                _self.tableData[_self.editindex].templateContent = _self.addSmsTemplate.content;
                _self.tableData[_self.editindex].templateType = _self.findTemIndex(_self.templateTypeList,_self.addSmsTemplate.type);

                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
              })

            }else{
              let data = {
                templeteName:_self.addSmsTemplate.name,
                templateContent:_self.addSmsTemplate.content,
                templateType:_self.findTemIndex(_self.templateTypeList,_self.addSmsTemplate.type),
                user:_self.account,
                uId:"admin"//此处写死 admin
              }
              addOrModify(data).then(function(res){
                console.log(res);
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                let data = {"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": _self.page.pageSize};
                _self.loading2 = true;
                templeteList(JSON.stringify(data)).then(function (res) {
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
        let type = this.searchData.type;
        let data = {"templateName":key,"templateType":_self.findTemIndex(_self.templateTypeList,type),"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": val};
        _self.loading2 = true;
        templeteList(JSON.stringify(data)).then(function (res) {
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
        let type = this.searchData.type;
        let data = {"templateName":key,"templateType":_self.findTemIndex(_self.templateTypeList,type),"uId": "admin",user:this.account, "pageIndex": val, "pageSize": this.page.pageSize};
        _self.loading2 = true;
        templeteList(JSON.stringify(data)).then(function (res) {
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
      handleCurrentChangeParam(val){
        let _self = this;
        let data = {"name":_self.searchParamItemData,"status":1,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": 12};
        smsParamsList(data).then(function (res) {
            _self.smsParamsList = res.data;
            _self.pageparam = {
              pageSize:12,
              total:res.total,
              currentPage:1
            }
        })
      },

      handleChange(val){
        console.log(val)
      },
    },
      computed: {
        ...mapState({
          account:state=>state.user.userInfo.account,

        })
      },
      created() {
        let data = {"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10};
        let _self = this;
        _self.loading2 = true;
        templeteList(JSON.stringify(data)).then(function (res) {
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
