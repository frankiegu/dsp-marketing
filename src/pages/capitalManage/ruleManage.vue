<template>
  <div class="passageway-info-container" style=" background-color: #fff">
    <el-row>
      <el-col>
        <!--搜索-->
        <div class="search-container">
          <el-row :gutter="20">
            <el-col :span="4" :offset="16">
              <el-select v-model="searchData.status" :span="5" placeholder="是否可用" clearable filterable >
                <el-option :label="'是'" :value="1"></el-option>
                <el-option :label="'不是'" :value="0"></el-option>
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
            <el-table-column prop="amount" label="金额" width="120" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="amountScope" label="金额范围" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="classId" label="类ID" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="partnerName" label="合作商" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="partnerId" label="合作商ID" show-overflow-tooltip> </el-table-column>
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
        <el-form-item label="金额" :label-width="formLabelWidth" >
          <el-input v-model="addSmsTemplate.amount"  auto-complete="off"  placeholder="请填写金额"></el-input>
        </el-form-item>
        <el-form-item label="金额范围" :label-width="formLabelWidth">
          <el-input v-model="addSmsTemplate.amountScope"  auto-complete="off"  placeholder="请填写金额范围"></el-input>
        </el-form-item>
        <el-form-item label="限额" :label-width="formLabelWidth">
          <el-input v-model="addSmsTemplate.low"  auto-complete="off"  placeholder="请填写限额范围"></el-input>
        </el-form-item>
        <el-form-item label="合作商ID" :label-width="formLabelWidth">
          <el-button @click="selectTemplate2"  style="width:100%;">{{addSmsTemplate.partnerId?addSmsTemplate.partnerId:'请选择合作商'}}</el-button>
        </el-form-item>
        <el-form-item label="类ID" :label-width="formLabelWidth">
          <el-button @click="selectTemplate"  style="width:100%;">{{addSmsTemplate.classId?addSmsTemplate.classId:'请选择类ID'}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addSmsTemplate')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑-->

    <!--选择类-->
    <el-dialog :title="'添加参数'"  :visible.sync="addDialogParamVisible">
      <el-tooltip class="item" effect="dark" :content="item.remark" placement="top" v-for="(item,index) in smsParamsList" :key="item.id" :disabled="item.remark?false:true">
        <el-button  class="selctParams" type="primary" style="margin-bottom: 15px;margin-right:15px;margin-left: 0px;" @click.stop="addParamItem(index,'editParam',$event)">
          {{ item.id }} ：<em style="color:chartreuse">{{ item.name }}</em>
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
    <!--选择类-->


    <!--选择合作商-->
    <el-dialog :title="'添加参数'"  :visible.sync="addDialogParamVisible2">
      <!--<el-row style="margin-bottom: 15px;">-->
        <!--<el-col :span="12" :offset="4">-->
          <!--<el-input placeholder="请输入合作商名称" v-model="searchParamItemData3"></el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
          <!--<el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem2">搜索</el-button>-->
        <!--</el-col>-->
      <!--</el-row>-->
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
            <el-button @click="addDialogParamVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="addDialogParamVisible2 = false">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { partnerList } from '@/api/system-api'
  import { ruleList , ruleAddOrModify , ruleDelete , capitalClassList , listPartners} from '@/api/capital-api';
  import { cityView , cityGet , orgCityView } from '@/api/assist-api'
  import { mapState } from 'vuex';
  export default {
    name: 'passagewayInfo',
    data () {
      return {
        props:{
          value: 'id',
          label:'name',
          children: 'child'
        },
        selectedOptions3: [],
        options:[],
        loading2:true,
        searchData: {
          status:'',
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
        searchParamItemData3:'',
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
        addEditDialogForm:{
          areaIds:'',
          areaId:'',
          areaName:''
        },
        addSmsTemplate: {
          amount:'',
          amountScope:'',
          partnerId: '',
          classId:'',
          partnerName:'',
          low:'',
        },

        formLabelWidth: '100px',
        rules: {

        }
      }
    },
    methods: {

      handleCurrentChangeParam2(val){
        let _self = this;
        let data2 = {isAdmin:0,"currPage":val,"prePageResult":10 };
        listPartners(data2).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2={
            pageSize: 10,
            total: res.totalPage*10,
            currentPage: 1
          }
        });
      },
      selectTemplate2(){
        let _self= this;
        _self.addDialogParamVisible2 = true;
        let data2 = {isAdmin:0,"currPage":0,"prePageResult":10 };
        listPartners(data2).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2={
            pageSize: 10,
            total: res.totalPage*10,
            currentPage: 1
          }
        });
      },

      addParamItem2(index,formName,ev){
        let _self = this;
        this.addSmsTemplate.partnerId = _self.smsParamsList2[index].id;
        this.addSmsTemplate.partnerName = _self.smsParamsList2[index].name;
        this.addDialogParamVisible2 = false;
      },
      searchParamItem2(){
        let _self =this;
        let data2 = {isAdmin:0,"currPage":0,"prePageResult":10 };
        listPartners(data2).then(function (res) {
          _self.smsParamsList2 = res.data;
          _self.pageparam2={
            pageSize: 10,
            total: res.totalPage*10,
            currentPage: 1
          }
        });
      },
      handleCurrentChangeParam(val){
        let _self = this;
        let data = {"status":1,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": 12};
        capitalClassList(data).then(function (res) {
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
        let dataParam = {"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        capitalClassList(dataParam).then(function (res) {
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
        this.addSmsTemplate.classId = _self.smsParamsList[index].id;
        this.addDialogParamVisible = false;
      },
      searchParamItem(){
        let _self =this;
        let dataParam = {"status":1,"uId": "admin","user":_self.account, "pageIndex": 1, "pageSize": 12};
        capitalClassList(dataParam).then(function (res) {
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
        let data = {status:_self.searchData.status,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10};
        _self.loading2 = true;
        ruleList(data).then(function (res) {
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
          amount:'',
          amountScope:'',
          partnerId: '',
          classId:'',
          partnerName:'',
          low:'',

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
        this.addSmsTemplate.partnerId = this.tableData[index].partnerId;
        this.addSmsTemplate.classId = this.tableData[index].classId;
        this.addSmsTemplate.amount = this.tableData[index].amount;
        this.addSmsTemplate.amountScope = this.tableData[index].amountScope;
        this.addSmsTemplate.low = this.tableData[index].low;

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
            ruleDelete(data).then(function (res) {
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
            ruleDelete(data).then(function (res) {
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
                partnerId:_self.addSmsTemplate.partnerId,
                partnerName:_self.addSmsTemplate.partnerName,
                classId:_self.addSmsTemplate.classId,
                amount:_self.addSmsTemplate.amount,
                amountScope:_self.addSmsTemplate.amountScope,
                low:_self.addSmsTemplate.low,
                user:this.account,
                uId:"admin"//此处写死 admin
              };
              ruleAddOrModify(data).then(function(res){
                _self.tableData[_self.editindex].partnerName = _self.addSmsTemplate.partnerName;
                _self.tableData[_self.editindex].partnerId = _self.addSmsTemplate.partnerId;
                _self.tableData[_self.editindex].amount = _self.addSmsTemplate.amount;
                _self.tableData[_self.editindex].amountScope = _self.addSmsTemplate.amountScope;
                _self.tableData[_self.editindex].classId = _self.addSmsTemplate.classId;
                _self.tableData[_self.editindex].low = _self.addSmsTemplate.low;
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });

              })

            }else{
              let data = {
                partnerId:_self.addSmsTemplate.partnerId,
                partnerName:_self.addSmsTemplate.partnerName,
                classId:_self.addSmsTemplate.classId,
                amount:_self.addSmsTemplate.amount,
                amountScope:_self.addSmsTemplate.amountScope,
                low:_self.addSmsTemplate.low,
                user:this.account,
                uId:"admin"//此处写死 admin
              };
              ruleAddOrModify(data).then(function(res){
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                let data = {status:_self.searchData.status,"uId": "admin",user:_self.account, "pageIndex": 1, "pageSize": _self.page.pageSize};
                _self.loading2 = true;
                ruleList(JSON.stringify(data)).then(function (res) {
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
        let data = {status:_self.searchData.status,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": val};
        _self.loading2 = true;
        ruleList(JSON.stringify(data)).then(function (res) {
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
        let data = {status:_self.searchData.status,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": this.page.pageSize};
        _self.loading2 = true;
        ruleList(JSON.stringify(data)).then(function (res) {
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
      let data = {status:_self.searchData.status,"uId": "admin",user:this.account,"pageIndex": 1, "pageSize": 10};
      _self.loading2 = true;
      orgCityView({orgCode:_self.orgCode}).then((res)=>{
        _self.options = res.data;
      })
      ruleList(data).then(function (res) {
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
