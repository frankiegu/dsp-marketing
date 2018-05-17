<template>
  <div class="sms-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="15">
              <el-input :span="5" v-model="searchData.key" @keyup.native.enter="searchEvent"  placeholder="请输入渠道名称"></el-input>
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
            <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="createUser" label="创建者" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="bizNo" label="业务编码" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip> </el-table-column>
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

      </el-col>
    </el-row>
    <el-dialog :title='isEdit?"新增渠道":"编辑渠道"'  :visible.sync="dialogFormVisible">
      <el-form :model="addSmsTemplate" :rules="rules" ref="addSmsTemplate">
        <el-form-item label="渠道名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addSmsTemplate.name" placeholder="请输入渠道名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="addSmsTemplate.remark" placeholder="请输入渠道备注"></el-input>
        </el-form-item>
        <el-form-item label="业务编码" prop="bizNo" :label-width="formLabelWidth" class="smsContent">
          <el-input :rows="5" placeholder="操作类" v-model="addSmsTemplate.bizNo" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addSmsTemplate')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { descriptionList,descriptionAddOrModify,descriptionDelete } from '@/api/smsManagement/smsChannel-api';
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
        page: {},
        editindex:0,
        smsType:[{"indexd":"1","value2":"验证码短信"},{"indexd":"2","value2":"通知短信"},{"indexd":"3","value2":"营销短信"}],
        templateTypeList: ['营销模板', '订购通知', '二次验证模板', '失败通知', '成功通知'],
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        isEdit: false,
        addSmsTemplate: {
          name: '',
          remark: '',
          bizNo:''
        },

        formLabelWidth: '100px',
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
          remark: [
            {required: true, message: '请输入备注', trigger: 'blur'}
          ],
          bizNo: [
            {required: true, message: '请输入业务编码', trigger: 'blur'}
          ],

        }
      }
    },
    components: {},
    methods: {
      searchEvent(){
        let _self = this;
        let key = this.searchData.key;
        let data = {"name":key,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10};
        _self.loading2 = true;
        descriptionList(data).then(function (res) {
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
          name: '',
          region: ["zhinan", "shejiyuanze", "fankui"],
          remark: '',
          pwd: '',
          priority: '',
          userId:'',
          channelId:'',
          type2:''
        };
        setTimeout(function(){
          this.dialogFormVisible = true;
          this.isEdit=false;
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
        this.addSmsTemplate.remark = this.tableData[index].remark;
        this.addSmsTemplate.bizNo = this.tableData[index].bizNo;
        this.addSmsTemplate.name = this.tableData[index].name;
      },
      handleStop(index, row){
        let _self =this;
        if(row.status){
          this.$confirm('此操作将禁用【' + row.name + '】渠道, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              id:_self.tableData[index].id,
              user:this.account,
              uId:"admin"//此处写死 admin
            }
            descriptionDelete(data).then(function (res) {
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
          this.$confirm('此操作将激活【' + row.name + '】渠道, 是否继续?', '提示', {
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
            descriptionDelete(data).then(function (res) {
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
        this.$confirm('此操作将删除【' + row.name + '】渠道, 是否继续?', '提示', {
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
                name:_self.addSmsTemplate.name,
                remark:_self.addSmsTemplate.remark,
                bizNo:_self.addSmsTemplate.bizNo,
                user:this.account,
                createUser:_self.tableData[_self.editindex].createUser,
                updateUser:_self.tableData[_self.editindex].updateUser,
                uId:"admin"//此处写死 admin
              };
              descriptionAddOrModify(data).then(function(res){
                _self.tableData[_self.editindex].name = _self.addSmsTemplate.name;
                _self.tableData[_self.editindex].remark = _self.addSmsTemplate.remark;
                _self.tableData[_self.editindex].bizNo = _self.addSmsTemplate.bizNo;
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });

              })

            }else{
              let data = {
                name:_self.addSmsTemplate.name,
                remark:_self.addSmsTemplate.remark,
                bizNo:_self.addSmsTemplate.bizNo,
                user:this.account,
                createUser:this.account,
                updateUser:this.account,
                uId:"admin"//此处写死 admin
              }
              descriptionAddOrModify(data).then(function(res){
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                let data = {"uId": "admin",user:_self.account, "pageIndex": 1, "pageSize": _self.page.pageSize};
                _self.loading2 = true;
                descriptionList(JSON.stringify(data)).then(function (res) {
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
        let data = {"name":key,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": val};
        _self.loading2 = true;
        descriptionList(JSON.stringify(data)).then(function (res) {
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
        let data = {"name":key,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": this.page.pageSize};
        _self.loading2 = true;
        descriptionList(JSON.stringify(data)).then(function (res) {
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
        account:state=>state.user.userInfo.account
      })
    },
    created() {

      let data = {"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10};
      let _self = this;
      _self.loading2 = true;
      descriptionList(data).then(function (res) {
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
