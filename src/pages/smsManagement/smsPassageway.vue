<template>
  <div class="sms-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="15">
              <el-input :span="5" v-model="searchData.key" @keyup.native.enter="searchEvent"  placeholder="请输入通道名称"></el-input>
            </el-col>
            <!--<el-col :span="5">-->
              <!--<el-input :span="5" v-model="searchData.type"  placeholder="请输入拥有着名称"></el-input>-->
            <!--</el-col>-->
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
            <el-table-column prop="channelId" label="通道ID" width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="type" label="类型" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag :type="'success'" v-if="scope.row.type == 1">验证码短信</el-tag>
                <el-tag :type="'success'" v-else-if="scope.row.type == 2">通知短信</el-tag>
                <el-tag :type="'success'" v-else>营销短信</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="uId" label="拥有者" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="userId" label="通道用户ID" show-overflow-tooltip> </el-table-column>

            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-icon name="time"></el-icon>
                {{ scope.row.createTime }}
              </template>
            </el-table-column>
            <!--<el-table-column prop="status" label="状态" width="90" show-overflow-tooltip>-->
              <!--<template slot-scope="scope">-->
                <!--<el-tag :type="scope.row.status === 1 ? 'success' : 'gray'">{{ scope.row.status === 1 ? '可用' : '不可用' }}</el-tag>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="192" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  :disabled= "scope.row.status==1?false:true"
                  @click="handleEdit('addSmsTemplate', scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  :disabled= "scope.row.status==1?false:true"
                  type="success"
                  @click="checkOut('addSmsTemplate', scope.$index, scope.row)">检查</el-button>
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
    <!--编辑通道-->
    <el-dialog :title='isEdit?"新增通道":"编辑通道"'  :visible.sync="dialogFormVisible">
      <el-form :model="addSmsTemplate" :rules="rules" ref="addSmsTemplate">
        <el-form-item label="通道名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addSmsTemplate.name" placeholder="请输入通道名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="addSmsTemplate.remark" placeholder="请输入通道备注"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd" :label-width="formLabelWidth" class="smsContent">
          <el-input :rows="5" placeholder="请输入密码" v-model="addSmsTemplate.pwd" ></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority" :label-width="formLabelWidth" class="smsContent">
          <el-input :rows="5" placeholder="请输入优先级" v-model="addSmsTemplate.priority" ></el-input>
        </el-form-item>
        <el-form-item label="渠道 ID" :label-width="formLabelWidth" class="smsContent">
          <el-input :rows="5" placeholder="请输入渠道 ID" v-model="addSmsTemplate.channelId" ></el-input>
        </el-form-item>
        <el-form-item  label="类型" prop="type2" :label-width="formLabelWidth" class="smsContent">
          <el-select v-model="addSmsTemplate.type2" clearable placeholder="请选择类型">
            <el-option
              v-for="item in smsType"
              :key="item.indexd"
              :label="item.value2"
              :value="item.indexd">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道用户ID" prop="userId" :label-width="formLabelWidth" class="smsContent">
          <el-input :rows="5" placeholder="请输入用户 ID" v-model="addSmsTemplate.userId" ></el-input>
        </el-form-item>

        <el-form-item  label="运营商" prop="operator" :label-width="formLabelWidth" class="smsContent">
          <el-select v-model="addSmsTemplate.operator" clearable placeholder="请选择运营商">
            <el-option
              v-for="item in operator"
              :key="item.indexd"
              :label="item.value2"
              :value="item.indexd">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addSmsTemplate')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑通道-->
    <!--检查-->
    <el-dialog title='检查通道'  :visible.sync="dialogFormVisible2">
      <el-form :model="addSmsTemplate2" :rules="rules" ref="addSmsTemplate">
        <el-form-item label="短信内容" :label-width="formLabelWidth">
          <el-input v-model="addSmsTemplate2.content" placeholder="请输入短信内容"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="addSmsTemplate2.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm2('addSmsTemplate')">确 定</el-button>
      </div>
    </el-dialog>
    <!--检查-->
  </div>
</template>

<script>


  import { templeteList,addOrModify,deleteTemplate ,channelCheck} from '@/api/smsManagement/smsPassageway-api';
  import { mapState } from 'vuex';
  export default {
    name: 'smsTemplate',
    data () {
      return {
        checkId:'',
        dialogFormVisible2:false,
        loading2:true,
        searchData: {
          key: '',
          type:''
        },
        page: {},
        editindex:0,
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
        smsType:[{"indexd":"1","value2":"验证码短信"},{"indexd":"2","value2":"通知短信"},{"indexd":"3","value2":"营销短信"}],
        operator:[{"indexd":"0","value2":"电信"},{"indexd":"1","value2":"移动"},{"indexd":"2","value2":"联通"},{"indexd":"3","value2":"全部"}],
        templateTypeList: ['营销模板', '订购通知', '二次验证模板', '失败通知', '成功通知'],
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        isEdit: false,
        addSmsTemplate2:{
          content:'',
          mobile:'',
        },
        addSmsTemplate: {
          name: '',
          region: ["zhinan", "shejiyuanze", "fankui"],
          remark: '',
          pwd: '',
          priority: '',
          type2:'',
          operator:''
        },

        formLabelWidth: '100px',
        rules: {
          type2: [
            {required: true, message: '请选择类型', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入通道名称', trigger: 'blur'},
          ],
          remark: [
            {required: true, message: '请输入备注', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          priority: [
            {required: true, message: '请输入优先级', trigger: 'blur'}
          ],
          channelId: [
            {required: true, message: '请输入通道优先级', trigger: 'blur'}
          ],
          userId: [
            {required: true, message: '请输入通道用户ID', trigger: 'blur'}
          ]
        }
      }
    },
    components: {},
    methods: {
      checkOut(a,b,c){
        let _self = this;
        _self.dialogFormVisible2 = true;
        _self.checkId = c.id;
      },
      submitForm2(){
          let  _self = this;
          let  _data = {
            mobile:_self.addSmsTemplate2.mobile,
            content:_self.addSmsTemplate2.content,
            id:_self.checkId,
            uId:"admin"
          };
        _self.dialogFormVisible2 = false;
        channelCheck(_data).then((res)=>{
          this.$message({
            showClose: true,
            message: '处理成功：'+res.data,
            type: 'success',
            duration:15000
          });
        })
      },
      searchEvent(){
        let _self = this;
        let key = this.searchData.key;
        let type = this.searchData.type;
        _self.loading2 = true;
        let data = {"name":key,"userId":type,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": 10};
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
        _self.addSmsTemplate  = {
          name: '',
          region: ["zhinan", "shejiyuanze", "fankui"],
          remark: '',
          pwd: '',
          priority: '',
          userId:'',
          channelId:'',
          type2:'',
          opetator:''
        };

        setTimeout(function(){
          _self.dialogFormVisible = true;
          _self.isEdit = false;
        },200)
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
        this.addSmsTemplate.priority = this.tableData[index].priority;
        this.addSmsTemplate.pwd = this.tableData[index].pwd;
        this.addSmsTemplate.name = this.tableData[index].name;
        this.addSmsTemplate.userId = this.tableData[index].userId;
        this.addSmsTemplate.channelId = this.tableData[index].channelId;
        this.addSmsTemplate.type2 = this.tableData[index].type;
        this.addSmsTemplate.operator = String(this.tableData[index].operator);
      },
      handleStop(index, row){
        let _self =this;
        if(row.status){
          this.$confirm('此操作将禁用【' + row.name + '】短信模板, 是否继续?', '提示', {
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
          this.$confirm('此操作将激活【' + row.name + '】短信模板, 是否继续?', '提示', {
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
        this.$confirm('此操作将删除【' + row.name + '】短信模板, 是否继续?', '提示', {
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
                pwd:_self.addSmsTemplate.pwd,
                priority:_self.addSmsTemplate.priority,
                userId:_self.addSmsTemplate.userId,
                channelId:_self.addSmsTemplate.channelId,
                type:_self.addSmsTemplate.type2,
                user:this.account,
                createUser:_self.tableData[_self.editindex].createUser,
                updateUser:_self.tableData[_self.editindex].updateUser,
                operator:_self.addSmsTemplate.operator,
                uId:"admin"//此处写死 admin
              };
              addOrModify(data).then(function(res){
                console.log(res);
                _self.tableData[_self.editindex].name = _self.addSmsTemplate.name;
                _self.tableData[_self.editindex].remark = _self.addSmsTemplate.remark;
                _self.tableData[_self.editindex].pwd = _self.addSmsTemplate.pwd;
                _self.tableData[_self.editindex].priority = _self.addSmsTemplate.priority;
                _self.tableData[_self.editindex].userId = _self.addSmsTemplate.userId;
                _self.tableData[_self.editindex].channelId = _self.addSmsTemplate.channelId;
                _self.tableData[_self.editindex].type = _self.addSmsTemplate.type2;
                _self.tableData[_self.editindex].operator = _self.addSmsTemplate.operator;

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
                pwd:_self.addSmsTemplate.pwd,
                priority:_self.addSmsTemplate.priority,
                userId:_self.addSmsTemplate.userId,
                channelId:_self.addSmsTemplate.channelId,
                type:_self.addSmsTemplate.type2,
                operator:_self.addSmsTemplate.operator,
                user:this.account,
                createUser:this.account,
                updateUser:this.account,
                uId:"admin"//此处写死 admin
              }
              addOrModify(data).then(function(res){
                console.log(res);
                _self.dialogFormVisible = false;
                _self.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                let data = {"uId": "admin",user:_self.account, "pageIndex": 1, "pageSize": _self.page.pageSize};
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
        let data = {"name":key,"userId":type,"uId": "admin",user:this.account, "pageIndex": 1, "pageSize": val};
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
        let data = {"name":key,"userId":type,"uId": "admin",user:this.account, "pageIndex": val, "pageSize": this.page.pageSize};
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
