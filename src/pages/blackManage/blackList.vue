<template>
    <div class="black-list-container">
      <el-row>
        <el-col>
          <div class="search-container">
           <el-input class="search-key" v-model="searchData.key" :maxlength="11" placeholder="请输入手机号"></el-input>
<!--            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              format="yyyy-MM-dd"
              range-separator=" &#45;&#45; "
              :picker-options="pickerOptions" @change="handleTimeChange">
            </el-date-picker>-->
            <el-button type="button" class="search-btn ml-10" @click="handleSearch">查询</el-button>
            <el-button type="success" class="search-add"  @click="handleAdd()">新增</el-button>
          </div>
          <div class="search-table"
               v-loading="blackDialog.loading" element-loading-text="拼命加载中">
            <el-scrollbar
              tag="div"
              wrap-class="el-container__wrap"
              view-class="el-container__list"
            >
              <el-tag
                v-for="item in tableData"
                :key="item.mobile"
                closable
                @close="handleClose(item.mobile)"
                type="primary">{{item.mobile}}</el-tag>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
      <el-dialog title='黑名单操作' :visible.sync="blackDialog.show">
        <el-form :model="blackDialog.black" :rules="rules" ref="black">
          <!--          <el-form-item
            label="选择文件"
            :label-width="blackDialog.width">
            <upload-component
              @changeFile="changeFile"

              :input-txt="blackDialog.black.fileName"
              class="wid_80"
            ></upload-component>
          </el-form-item>-->
          <el-form-item label="手机号码" :label-width="blackDialog.width" prop="mobile">
            <el-input placeholder="请输入单个手机号码" :maxlength="11" class="wid_80"  v-model="blackDialog.black.mobile"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="blackDialog.width">
            <el-input placeholder="备注信息" :rows="4" class="wid_80" type="textarea" v-model="blackDialog.black.mark"  auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="blackDialog.show = false">取 消</el-button>
          <el-button type="primary" :disabled="blackDialog.disabled"  @click="handleSubmit('black')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { blackOperate,blacklist } from '@/api/black-api'
    import UploadComponent from  '@/components/upload'
    export default {
        name: 'blackList',
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
              blackDialog:{
                  loading:true,
                  show:false,
                  width:'110px',
                  black:{
                      uploadFile:'',
                      fileName:'',
                      mobile:'',
                      handleType:1,
                      mark:''
                  },
                  disabled:false
              },
              loading:false,
              tableData:[],
              multipleSelection: [],
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
                mobile: [
                  { required: true , pattern: /^1[34578]\d{9}$/, message: '请正确的11位手机号码', trigger: 'change' }
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
        components: {
          UploadComponent
        },
        methods: {
          handleSearch(){
            this.list(10,1)
          },

          handleTimeChange(val){
            this.searchData.startTime = val.split(' -- ')[0];
            this.searchData.endTime = val.split(' -- ')[1];
          },

          handleAdd(){
            this.blackDialog.show = true;
            this.blackDialog.black = {
              uploadFile:'',
              fileName:'',
              mobile:'',
              handleType:1,
              mark:''
            }
          },

          handleClose(mobile) {
            this.$message({
              message: '暂时不支持删除功能',
              type: 'error'
            });
            return false;
            let _data ={
              mobile,
              handleType:2
            };
            blackOperate(_data).then(()=>{
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.list(10,1);
            })
          },

          //上传文件
          changeFile(...args){
              this.blackDialog.black.uploadFile = args[0];
              this.blackDialog.black.fileName = args[0].name;
          },

          handleSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.blackDialog.disabled = true;
                  blackOperate(this.blackDialog.black).then(()=>{
                    this.$message({
                      message: '收录成功',
                      type: 'success'
                    });
                    this.blackDialog.disabled = false;
                    this.blackDialog.show = false
                  }).catch(()=>{
                    this.blackDialog.disabled = false;
                  });
                }else {
                  console.log('error submit!!');
                  return false;
                }
            });

          },
          list(pageSize,pageIndex){
            this.blackDialog.loading = true;
            let _data={
              pageSize,
              pageIndex,
              mobile:this.searchData.key
            };
            blacklist(_data).then((data)=>{
              this.tableData = data.data.details;
              this.blackDialog.loading = false;
            }).catch(() => {
              this.blackDialog.loading = false;
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
        computed: {},
        created() {
          this.list(10,1);
        }
    }
</script>
