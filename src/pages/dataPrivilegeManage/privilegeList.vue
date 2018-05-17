<template>
    <div class="privilege-list-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-button type="warning" class="search-add pull-left"  @click="handleAdd">分配数据权限</el-button>
            <el-button type="success" class="search-add pull-left"  @click="$router.push({path: '/home/privilegelist/allotlist'})">配给列表</el-button>
            <el-input class="search-key" v-model="searchData.key" :maxlength="25" placeholder="请输入关键字"></el-input>
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              format="yyyy-MM-dd"
              range-separator=" -- "
              :picker-options="pickerOptions" @change="handleTimeChange">
            </el-date-picker>
            <el-button type="button" class="search-btn ml-10" @click="handleSearch">查询</el-button>

          </div>
          <div class="search-table">
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              :data="tableData"
              height="400"
              border
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="dsname" label="表名【数据源】" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="text-blue" @click="handleView('' ,scope.row.name)">{{ scope.row.catalog }}【{{scope.row.dsname}}】</span>
                </template>
              </el-table-column>
              <el-table-column prop="startValidTime" label="生效时间" width="180"></el-table-column>
              <el-table-column prop="endValidTime" label="失效时间" width="180"></el-table-column>

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

      <el-dialog :title='privilegeDialog.isEdit?"编辑数据权限":"分配数据权限"'  size="tiny" :visible.sync="privilegeDialog.flag">
        <el-form :model="privilege" :rules="rules" ref="privilege">
          <el-form-item label="权限编号" :label-width="privilegeDialog.formLabelWidth" v-show="privilegeDialog.isEdit">
            <el-input v-model="privilege.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="赋权记录组" :label-width="privilegeDialog.formLabelWidth">
            <el-input v-model="privilege.belongDataId" readonly :disabled="true"   placeholder="请输入数据归属表ID" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限项" :label-width="privilegeDialog.formLabelWidth"  prop="privilegeArr">
            <el-select
              v-model="privilege.privilegeArr"
              multiple
              class="wid_80"
              @change="handleConvert"
              placeholder="请选择权限项">
              <el-option :key="item.index" v-for="item in privilegeDialog.privilegeList" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="权限主体类型" :label-width="privilegeDialog.formLabelWidth"  required  prop="ownerType">
            <el-select v-model="privilege.ownerType" class="wid_80"  placeholder="请选择权限主体类型" @change="handleOwnerList">
              <el-option :key="item.value" v-for="item in privilegeDialog.ownerTypeList" :disabled="item.disabled" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限主体" :label-width="privilegeDialog.formLabelWidth" required >
            <el-select
              v-model="privilege.privilegeOwners"
              multiple
              :disabled="privilegeDialog.ownerList.length == 0"
              class="wid_80"
              placeholder="请选择权限主体">
              <el-option
                v-for="item in privilegeDialog.ownerList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="privilegeDialog.flag = false">取 消</el-button>
          <el-button type="pink" @click="handleSave('privilege')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { privilegeSave,privilegeList } from '@/api/dataPrivilege-api'
  import { userList,roleList,orgList } from '@/api/system-api'
  export default {
      name: 'privilegeList',
      data () {
          return {
            searchData:{
              key:'',
              time:'',
              startTime:'',
              endTime:''
            },
            page:{
              pageSize:10,
              total:100,
              pageIndex: 1
            },
            loading:false,
            privilege:{
              id : '',
              belongDataId : '',
              privilegeArr : [],
              privilege:0,
              privilegeOwners : '',
              ownerType : ''
            },
            tableData:[],
            multipleSelection: [],
            privilegeDialog:{
              flag:false,
              formLabelWidth: '120px',
              privilegeList:[{
                label:'赋权',
                value:1
              },{
                label:'增加',
                value:2
              },{
                label:'修改',
                value:4
              },{
                label:'删除',
                value:8
              },{
                label:'查询',
                value:16
              },{
                label:'导出',
                value:32
              }],
              ownerTypeList:[{
                label:'组织',
                value:1,
                disabled: true
              },{
                label:'角色',
                value:2
              },{
                label:'账号',
                value:3,
                disabled: true
              }],
              ownerList:[],
              orgArrList:[],
              roleArrList:[],
              userArrList:[],
              isEdit:false
            },
            //日期处理
            pickerOptions: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            },
            rules: {
              roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' },
                { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
              ],
              privilegeArr: [
                {type: 'array', required: true, message: '请选择角色权限', trigger: 'blur' }
              ],
              organizationId: [
                { type: 'number',  required: true,  message: '请选择角色组织', trigger: 'blur' },
              ]
            }
          }
      },
      components: {},
      methods: {
        handleSearch(){
          this.list(10,1)
        },

        handleTimeChange(val){
          this.searchData.startTime = val.split(' -- ')[0];
          this.searchData.endTime = val.split(' -- ')[1];
        },

        handleView(){},

        handleAdd(){
          if(this.multipleSelection.length !=1){
            this.$message({
              showClose: true,
              message: '暂时不支持多数据处理，请选择其中一条！',
              type: 'error'
            });
            return false;
          }
          this.privilegeDialog.flag = true;
          this.privilege.belongDataId = Number(this.multipleSelection[0].belongDataId)
        },
        handleSave(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              privilegeSave(this.privilege).then( data => {
                this.$message({
                  showClose: true,
                  message: '权限分配成功！',
                  type: 'success'
                });
                this.privilegeDialog.flag = false;
                this.list(this.page.pageSize,1);
                this.$refs[formName].resetFields();
              });
            } else {
              return false;
            }
          });
        },
        handleOwnerList(val){
            let _data={
              pageSize:10000,
              pageIndex: 1,
            };
            this.privilege.privilegeOwners = [];
            this.privilegeDialog.ownerList = [];
            if(val == 1 && orgList){
              orgList(_data).then(data => {
                data.data.forEach(item => {
                  this.privilegeDialog.ownerList.push({
                    label: item.roleName,
                    value: item.id
                  })
                });
              })
            }else if(val == 2){
              roleList(_data).then(data => {
                data.data.forEach(item => {
                  this.privilegeDialog.ownerList.push({
                    label: item.roleName,
                    value: item.id
                  })
                });
              })
            }else if(val == 3){
              userList(_data).then(data => {
                data.data.forEach(item => {
                  this.privilegeDialog.ownerList.push({
                    label: item.account + '【' + item.name + '】',
                    value: item.id
                  })
                });
              })
            }
        },
        handleConvert(val){
          if(Array.isArray(val) && val.length > 0){
            this.privilege.privilege = val.reduce((sum,next) => {
              return  sum + next;
            })
          }else{
            console.log('data error!')
          }
        },

        list(pageSize,pageIndex){
          let _data={
            pageSize,
            pageIndex,
            dsname:this.searchData.key,
            time:this.searchData.time,
          };
          privilegeList(_data).then((data)=>{
            if(data.code==1){
              this.tableData = data.data;
              this.page.total = data.total;
              this.page.pageIndex = data.currPage;
              this.loading = false
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

      },
      computed: {
          _privilege:{
            get(){
                return this.privilege.privilege
            },
            set: function (val){
              if(Array.isArray(val) && val.length > 0){
                this.privilege.privilegeSum = val.reduce( (sum,next) => {
                   return  sum + next;
                })
              }else{
                  console.log('data error!')
              }
            }
          }
      },
      created() {
        this.list(10,1)
      }
  }
</script>
