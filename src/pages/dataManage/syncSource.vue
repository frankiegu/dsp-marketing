<template>
  <div class="sync_source-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-input class="search-key" v-model="searchSourceData.searchKey" :maxlength="150" placeholder="请输入关键字"/>
          <el-select v-model="searchSourceData.syncSourceType" clearable class="search-key" placeholder="同步源类型">
            <el-option :key="index" v-for="(item,index) in syncSourceType" :label="item" :value="item"/>
          </el-select>
          <el-button type="button" class="search-btn" @click="querySource">查询</el-button>
          <el-button type="success" class="search-add"  @click="handleAddSourceShow">新增</el-button>
        </div>
        <div class="search-table">
          <el-table height="400" border tooltip-effect="dark" style="width: 100%" :data="sourceData">
            <el-table-column prop="id" label="编号" width="70"/>
            <el-table-column label="名称" width="100">
              <template slot-scope="scope">
                <span class="text-main" @click="handleTableShow(scope.row)">{{scope.row.sourceName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hdfsSourceConf" label="hdfs连接信息" show-overflow-tooltip/>
            <el-table-column prop="hiveSourceConf" label="hive连接信息" show-overflow-tooltip/>
            <el-table-column prop="createTime" label="创建日期" width="170"/>
            <el-table-column label="操作" width="170">
              <template slot-scope="scope">
                <el-button size="small"
                           @click="handleEditSourceShow(scope.row)">编辑</el-button>
                <el-button size="small"
                           @click="handleSourceDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="search-page">
          <el-pagination :current-page="searchSourceData.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="searchSourceData.pageSize"
                         :total="searchSourceData.total" layout="total, sizes, prev, pager, next, jumper"
                         @size-change="sourceSizeChange" @current-change="sourceCurrentChange"/>
        </div>
      </el-col>
    </el-row>

    <!-- 展示同步源下的同步表 -->
    <el-dialog title="同步表" size="large" :visible.sync="tableShow">
      <div class="search-container" style="margin-top: -30px;">
        <el-input class="search-key" v-model="searchTableData.searchKey" :maxlength="150" placeholder="请输入关键字"/>
        <el-button type="button" class="search-btn" @click="queryTable">查询</el-button>
        <el-button type="success" @click="handleAddTableShow">添加表</el-button>
      </div>

      <el-table height="400" border tooltip-effect="dark" style="width: 100%" :data="tableData">
        <el-table-column prop="id" label="编号" width="70"/>
        <el-table-column label="表名" width="200">
          <template slot-scope="scope">
            <span class="text-main" @click="handleRecordShow(scope.row)">{{scope.row.tableName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="partitionDefinition" label="分区定义" width="400"/>
        <el-table-column prop="executedQuery" label="建表语句" show-overflow-tooltip/>
        <el-table-column prop="createTime" label="创建日期" width="170"/>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="small"
                       @click="handleTableDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="search-page">
        <el-pagination :current-page="searchTableData.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="searchTableData.pageSize"
                       :total="searchTableData.total" layout="total, sizes, prev, pager, next, jumper"
                       @size-change="tableSizeChange" @current-change="tableCurrentChange"/>
      </div>
    </el-dialog>

    <!-- 展示同步表的历史同步任务 -->
    <el-dialog title="同步任务" size="large" :visible.sync="recordShow">
      <div class="search-container" style="margin-top: -30px;">
        <el-input class="search-key" v-model="searchRecordData.searchKey" :maxlength="150" placeholder="请输入关键字"/>
        <el-button type="button" class="search-btn" @click="queryRecord">查询</el-button>
        <el-button type="success" @click="handleAddRecordShow">添加任务</el-button>
      </div>

      <el-table height="400" border tooltip-effect="dark" style="width: 100%" :data="recordData">
        <el-table-column prop="id" label="编号" width="70"/>
        <el-table-column prop="sourceSource.sourceName" label="源名称" width="150" show-overflow-tooltip/>
        <el-table-column prop="sourcePath" label="源路径" width="150" show-overflow-tooltip/>
        <el-table-column prop="destPath" label="目标路径" width="150" show-overflow-tooltip/>
        <el-table-column prop="partitionCondition" label="分区条件" width="200" show-overflow-tooltip/>
        <el-table-column prop="createTime" label="创建日期" width="170"/>
        <el-table-column prop="endTime" label="结束日期" width="170"/>
        <el-table-column prop="message" label="消息" show-overflow-tooltip/>
        <el-table-column prop="status" label="状态" width="100" :formatter="recordStatusFormatter"/>
      </el-table>

      <div slot="footer" class="search-page">
        <el-pagination :current-page="searchRecordData.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="searchRecordData.pageSize"
                       :total="searchRecordData.total" layout="total, sizes, prev, pager, next, jumper"
                       @size-change="recordSizeChange" @current-change="recordCurrentChange"/>
      </div>
    </el-dialog>

    <!-- 修改或新增同步源 -->
    <el-dialog :title='!!editSourceData.id ? "修改同步源":"新增同步源"' size="tiny" :visible.sync="editSourceShow">
      <el-form :model="editSourceData" :rules="editSourceRules" ref="editSourceForm" label-width="120px">
        <el-form-item label="名称" prop="sourceName">
          <el-input v-model="editSourceData.sourceName" class="wid_80" placeholder="请输入同步源名称"/>
        </el-form-item>
        <el-form-item label="hdfs连接信息" prop="hdfsSourceConf">
          <el-input type="textarea" :rows="5" v-model="editSourceData.hdfsSourceConf" class="wid_80" placeholder="请输入hdfs连接信息"/>
        </el-form-item>
        <el-form-item label="hive连接信息" prop="hiveSourceConf">
          <el-input type="textarea" :rows="5" v-model="editSourceData.hiveSourceConf" class="wid_80" placeholder="请输入hive连接信息"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSourceShow = false">取 消</el-button>
        <el-button type="pink" @click="handleSourceSave">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增同步表,表定义不支持修改 -->
    <el-dialog title='新增同步表' size="tiny" :visible.sync="editTableShow">
      <el-form :model="editTableData" :rules="editTableRules" ref="editTableForm" label-width="100px">
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="editTableData.tableName" class="wid_80" placeholder="请输入表名"/>
        </el-form-item>
        <el-form-item label="分区定义" prop="partitionDefinition">
          <el-input v-model="editTableData.partitionDefinition" class="wid_80" placeholder="请输入分区定义"/>
        </el-form-item>
        <el-form-item label="表位置" prop="location">
          <el-input v-model="editTableData.location" class="wid_80" placeholder="请输入表位置"/>
        </el-form-item>
        <el-form-item label="表定义" prop="schemaLiteral">
          <el-input type="textarea" :rows="10" v-model="editTableData.schemaLiteral" class="wid_80" placeholder="请输入表定义"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTableShow = false">取 消</el-button>
        <el-button type="pink" @click="handleTableSave">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增同步任务,历史任务不支持修改 -->
    <el-dialog title='编辑同步任务' size="tiny" :visible.sync="editRecordShow">
      <el-form :model="editRecordData" :rules="editRecordRules" ref="editRecordForm" label-width="100px">
        <el-form-item label="来源名称" prop="sourceSourceId">
          <el-select v-model="editRecordData.sourceSourceId" class="wid_80" placeholder="来源名称">
            <el-option :key="item.id" v-for="item in sourceData" :label="item.sourceName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="源路径" prop="sourcePath">
          <el-input v-model="editRecordData.sourcePath" class="wid_80" placeholder="请输入源路径"/>
        </el-form-item>
        <el-form-item label="目标路径" prop="destPath">
          <el-input v-model="editRecordData.destPath" class="wid_80" placeholder="请输入目标路径"/>
        </el-form-item>
        <el-form-item label="分区条件" prop="partitionCondition">
          <el-input v-model="editRecordData.partitionCondition" class="wid_80" placeholder="请输入分区条件"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRecordShow = false">取 消</el-button>
        <el-button type="pink" @click="handleRecordSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {syncLocalSource,syncLocalTable,syncLocalRecord,
    saveSyncLocalSource,saveSyncLocalTable,saveSyncLocalRecord,
    deleteSyncLocalSource,deleteSyncLocalTable} from '@/api/dataManage/syncSource-api';

  export default {
    name: 'syncSource',
    data(){
      return {
        searchSourceData:{
          searchKey: null,
          syncSourceType: 'HDFS',
          pageSize: 10,
          total: 0,
          currentPage: 1
        },
        editSourceShow: false,
        editSourceData:{
          id: null,
          sourceName: null,
          hdfsSourceConf: null,
          hiveSourceConf: null
        },
        editSourceRules: {
          sourceName: [
            { required: true, message: '请输入数据源名称.', trigger: 'change,blur' }
          ],
          hdfsSourceConf: [
            { required: true, message: '请输入连接信息.', trigger:'change,blur' },
            { validator: this.jsonValidator, message: '不符合JSON格式', trigger:'change,blur' }
          ],
          hiveSourceConf: [
            { required: true, message: '请输入连接信息.', trigger:'change,blur'},
            { validator: this.hiveConfValidator, message: '需要JSON格式数据.且包含url,user和password字段.', trigger:'change,blur' }
          ]
        },
        sourceData:[],

        tableShow: false,
        searchTableData:{
          sourceId: null,
          searchKey: null,
          pageSize: 10,
          total: 0,
          currentPage: 1
        },
        editTableShow: false,
        editTableData:{
          sourceId: null,
          tableName: null,
          partitionDefinition: null,
          location: null,
          schemaLiteral: null
        },
        editTableRules: {
          tableName: [
            {required:true, message: '请输入表名.', trigger:'change,blur'}
          ],
          partitionDefinition:[
            {required:true, message: '请输入分区条件.', trigger:'change,blur'}
          ],
          location: [
            {required:true, message: '请输入表位置.', trigger:'change,blur'}
          ],
          schemaLiteral: [
            {required:true, message: '请输入表结构.', trigger:'change,blur'}
          ]
        },
        tableData:[],

        recordShow:false,
        searchRecordData: {
          tableId: null,
          searchKey: null,
          pageSize: 10,
          total: 0,
          currentPage: 1
        },
        editRecordShow: false,
        editRecordData: {
          tableId: null,
          sourceSourceId: null,
          sourcePath: null,
          destPath: null,
          partitionCondition: null
        },
        editRecordRules: {
          sourceSourceId: [
            {required:true, message: '请选择数据来源.', trigger:'change,blur'}
          ],
          sourcePath:[
            {required:true, message: '请输入源路径.', trigger:'change,blur'}
          ],
          destPath:[
            {required:true, message: '请输入目标路径.', trigger:'change,blur'}
          ],
          partitionCondition: [
            {required:true, message: '请输入分区条件.', trigger:'change,blur'}
          ]
        },
        recordData:[]
      };
    },
    methods:{
      jsonValidator(rule, value, callback){
        try{
          JSON.parse(value);
          callback();
        }catch (e) {
          callback(new Error('需要JSON格式数据.'));
        }
      },
      hiveConfValidator(rule, value, callback){
        try{
          let obj = JSON.parse(value);
          if(null === obj.url || undefined === obj.url
            || null === obj.user || undefined === obj.user
            || null === obj.password || undefined === obj.password){
            callback(new Error('需要有url,user和password字段.'));
          }else{
            callback();
          }
        }catch (e) {
          callback(new Error('需要JSON格式数据.且包含url,user和password字段.'));
        }
      },
      recordStatusFormatter (row, column, cellValue){
        if(null !== cellValue && undefined !== cellValue){
          switch (cellValue){
            case 'INIT':
              return '初始化';
            case 'START':
              return '开始';
            case 'SUCCESS':
              return '成功';
            case 'FAIL':
              return '失败';
            default :
              return '未知';
          }
        }else{
          return '未知';
        }
      },

      querySource(){
        syncLocalSource(this.searchSourceData).then(data => {
          if(data.code === 1){
            this.sourceData = data.data;
          }
        })
      },
      sourceSizeChange(pageSize){
        this.searchSourceData.pageSize=pageSize;
        this.querySource();
      },
      sourceCurrentChange(currentPage){
        this.searchSourceData.currentPage=currentPage;
        this.querySource();
      },
      handleAddSourceShow(){
        this.editSourceData.id = null;
        this.editSourceData.sourceName = null;
        this.editSourceData.hdfsSourceConf = null;
        this.editSourceData.hiveSourceConf = null;

        this.editSourceShow = true;
      },
      handleEditSourceShow(data){
        this.editSourceData.id = data.id;
        this.editSourceData.sourceName = data.sourceName;
        this.editSourceData.hdfsSourceConf = data.hdfsSourceConf;
        this.editSourceData.hiveSourceConf = data.hiveSourceConf;

        this.editSourceShow = true;
      },
      handleSourceSave() {
        this.$refs['editSourceForm'].validate((valid) => {
          if (valid) {
            saveSyncLocalSource(this.editSourceData).then(data => {
              if(data.code === 1){
                this.$message({
                  type:'success',
                  showClose: true,
                  message:'新增成功.'
                });
                this.editSourceShow = false;
                this.querySource();
              }
            });
          } else {
            this.$message({
              type:'error',
              showClose: true,
              message:'表单错误.'
            });
            return false;
          }
        });
      },
      handleSourceDelete(data){
        this.$confirm('确认删除该同步源?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId = data.id;
          deleteSyncLocalSource(deleteId).then(data => {
            if(data.code === 1){
              this.$message({
                type:'success',
                showClose: true,
                message:'删除成功.'
              });
              this.querySource();
            }
          });
        }).catch(() => {});
      },

      handleTableShow(data){
        this.searchTableData.sourceId = data.id;
        this.searchTableData.searchKey = null;
        this.searchTableData.pageSize = 10;
        this.searchTableData.total = 0;
        this.searchTableData.currentPage = 1;

        this.tableShow = true;

        this.queryTable();
      },
      queryTable(){
        syncLocalTable(this.searchTableData).then(data => {
          if(data.code === 1){
            this.tableData = data.data;
          }
        });
      },
      tableSizeChange(pageSize){
        this.searchTableData.pageSize=pageSize;
        this.queryTable();
      },
      tableCurrentChange(currentPage){
        this.searchTableData.currentPage=currentPage;
        this.queryTable();
      },
      handleAddTableShow(){
        this.editTableData.sourceId = this.searchTableData.sourceId;
        this.editTableData.tableName = null;
        this.editTableData.partitionDefinition = null;
        this.editTableData.location = null;
        this.editTableData.schemaLiteral = null;

        this.editTableShow = true;
      },
      handleTableSave() {
        this.$refs['editTableForm'].validate((valid) => {
          if (valid) {
            saveSyncLocalTable(this.editTableData).then(data => {
              if(data.code === 1){
                this.$message({
                  type:'success',
                  showClose: true,
                  message:'新增成功.'
                });
                this.editTableShow = false;
                this.queryTable();
              }
            });
          } else {
            this.$message({
              type:'error',
              showClose: true,
              message:'表单错误.'
            });
            return false;
          }
        });
      },
      handleTableDelete(data){
        this.$confirm('确认删除该表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteId = data.id;
          deleteSyncLocalTable(deleteId).then(data => {
            if(data.code === 1){
              this.$message({
                type:'success',
                showClose: true,
                message:'删除成功.'
              });
              this.queryTable();
            }
          });
        }).catch(() => {});
      },

      handleRecordShow(data){
        this.searchRecordData.tableId = data.id;
        this.searchRecordData.searchKey = null;
        this.searchRecordData.pageSize = 10;
        this.searchRecordData.total = 0;
        this.searchRecordData.currentPage = 1;

        this.recordShow = true;
        this.queryRecord();
      },
      queryRecord(){
        syncLocalRecord(this.searchRecordData).then(data => {
          if(data.code === 1){
            this.recordData = data.data;
          }
        });
      },
      recordSizeChange(pageSize){
        this.searchRecordData.pageSize=pageSize;
        this.queryRecord();
      },
      recordCurrentChange(currentPage){
        this.searchRecordData.currentPage=currentPage;
        this.queryRecord();
      },
      handleAddRecordShow(){
        this.editRecordData.tableId = this.searchRecordData.tableId;
        this.editRecordData.sourceSourceId = null;
        this.editRecordData.sourcePath = null;
        this.editRecordData.destPath = null;
        this.editRecordData.partitionCondition = null;

        this.editRecordShow = true;
      },
      handleRecordSave() {
        this.$refs.editRecordForm.validate((valid) => {
          if (valid) {
            saveSyncLocalRecord(this.editRecordData).then(data => {
              if(data.code === 1){
                this.$message({
                  type:'success',
                  showClose: true,
                  message:'新增成功.'
                });
                this.editRecordShow = false;
                this.queryRecord();
              }
            });
          } else {
            this.$message({
              type:'error',
              showClose: true,
              message:'表单错误.'
            });
            return false;
          }
        });
      }
    },
    created() {
      this.querySource();
    }
  }
</script>

<style scoped lang="scss">

</style>
