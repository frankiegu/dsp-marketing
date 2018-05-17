<template>
    <div class="data-catalog-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" :maxlength="25" placeholder="请输入关键字"></el-input>
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
              <el-table-column prop="id" label="编号" width="80"></el-table-column>
              <el-table-column prop="tableName" label="表名" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="text-main" @click="handlePreview('' ,scope.row.name)">{{ scope.row.displayName }}【{{scope.row.tableName}}】</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="success"
                    size="small"
                    @click="handlePreview('' ,scope.row.name)">查看</el-button>
                </template>
              </el-table-column>

            </el-table>
          </div>
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

      <el-dialog :title="'预览调试< 共'+ preview.num +'条记录 >'" custom-class="pb_30"  size="large" :visible.sync="preview.flag">
        <div class="view-container">
          <el-table
            ref="previewTable"
            :data="preview.tempData.details"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              :key="items"
              v-for=" items in preview.tempData.columns"
              :prop="items"
              :label="items"
              :width="preview.tempData.columns && preview.tempData.columns.length >7 ? items.length*25 : 'auto'"
              show-overflow-tooltip
              resizable
              align="center"> </el-table-column>
          </el-table>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import { dataSourceList,dataSourceDetail } from '@/api/dataManage/sourceData-api'
    import { previewData } from '@/api/marketingManage/marketTask-api'
    import api_config from '@/api/api-config'
    export default {
        name: 'dataCatalog',
        data () {
          return {
            searchData:{
              key:''
            },
            page:{
              pageSize:10,
              total:100,
              pageIndex: 1
            },
            loading:true,
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
            preview:{
              tempData:[],
              flag:false,
              num:0
            },
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
              privilege: [
                {type: 'array', required: true, message: '请选择角色权限', trigger: 'blur' }
              ],
              organizationId: [
                { type: 'number',  required: true,  message: '请选择角色组织', trigger: 'blur' },
              ]
            }
          }
        },
        components: {},
        watch:{
          '$route' (to, from) { //监听路由是否变化
            console.log(to);
            if(this.$route.params.parentSourceId){// 判断条件1  判断传递值的变化
              //获取文章数据
              console.log(11);
              this.list(10,1,this.$route.params.parentSourceId,this.$route.params.tableName)
            }
          }
        },
        methods: {
          handleSearch(){
            this.$router.push({ path: '/home/datacatalog'});
            this.list(10,1,api_config.catalogId)
          },
          handlePreview(parentSourceId,tableName){
            let _data={
              parentSourceId,
              tableName
            };
            previewData(_data).then(data=>{
              this.preview.tempData = data.data;
              this.preview.flag = true;
              this.preview.num = data.total;
            });
          },

          list(pageSize,currentPage,parentSourceId,sourceName){
            let _data={
              pageSize,
              currentPage,
              displayName:this.searchData.key,
              parentSourceId, // Number(this.$route.params.parentSourceId) || api_config.catalogId ,
              sourceName, // Number(this.$route.params.parentSourceId)  ?  this.$route.params.tableName : (tableName || '') ,
              querySourceType:'TABLE'
            };
            dataSourceList(_data).then((data)=>{
              if(data.code==1){
                this.tableData=data.data;
                this.page.total=data.total;
                this.page.pageSize=pageSize;
                this.page.currentPage = data.currentPage;
                this.loading = false;
              }
            });
          },
          //分页模块
          handleSizeChange(pageSize) {
            let _sourceName = Number(this.$route.params.parentSourceId)  ?  this.$route.params.tableName : '',
                _parentSourceId = Number(this.$route.params.parentSourceId) || api_config.catalogId ;
            this.page.pageSize=pageSize;
            this.list(pageSize,1,_parentSourceId,_sourceName);
          },
          handleCurrentChange(currentPage) {
            this.list(this.page.pageSize,currentPage,api_config.catalogId);
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
            this.$message.closeAll();
            let _sourceName = Number(this.$route.params.parentSourceId)  ?  this.$route.params.tableName : '',
                _parentSourceId = Number(this.$route.params.parentSourceId) || api_config.catalogId ;
            this.list(10,1,_parentSourceId,_sourceName)
        }
    }
</script>
