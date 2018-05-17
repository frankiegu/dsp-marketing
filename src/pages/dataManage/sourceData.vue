<template>
    <div class="source-data-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <el-input class="search-key" v-model="searchData.key" :maxlength="150" placeholder="请输入关键字"></el-input>
            <el-button type="button" class="search-btn" @click="handleSearch">查询</el-button>
            <el-button type="success" class="search-add"  @click="handleAdd(1)">新增</el-button>
          </div>
          <div class="search-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              height="400"
              border
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="编号" width="70"> </el-table-column>
              <el-table-column prop="name" label="数据源名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="text-main" @click="showDialogTable(scope.row.dataSources,scope.row.id,1)">{{ scope.row.displayName }}【{{scope.row.sourceName}}】</span>
                  </template>
              </el-table-column>
              <el-table-column prop="protocolType" label="协议" width="120"> </el-table-column>
              <el-table-column prop="statusStr" label="ip/port" width="180">
                <template slot-scope="scope">
                  {{ scope.row.ip }}:{{scope.row.port}}
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="账号" width="120"> </el-table-column>
              <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row ,1)">编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row ,'DATASOURCE')">删除</el-button>
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
      <el-dialog :title='isEdit?"编辑数据":"新增数据"' size="tiny" :visible.sync="dialogFormVisible">
        <el-form :model="editData" :rules="rules" ref="editData">
          <el-form-item label="编号" :label-width="formLabelWidth" v-show="isEdit">
            <el-input v-model="editData.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="displayName" :label-width="formLabelWidth" required prop="" >
            <el-input v-model="editData.displayName" class="wid_80" auto-complete="off" placeholder="请输入displayName中文显示名"></el-input>
          </el-form-item>
          <el-form-item label="name" :label-width="formLabelWidth" required prop="" >
            <el-input v-model="editData.sourceName" class="wid_80" auto-complete="off" placeholder="请输入数据name名"></el-input>
          </el-form-item>
          <template v-if="editData.type==1">
            <el-form-item label="数据源ip" :label-width="formLabelWidth"  prop="">
              <el-input v-model="editData.ip" class="wid_80" auto-complete="off" placeholder="请输入数据源ip"></el-input>
            </el-form-item>
            <el-form-item label="数据源port" :label-width="formLabelWidth"  prop="">
              <el-input v-model="editData.port" class="wid_80" auto-complete="off" placeholder="请输入数据源port"></el-input>
            </el-form-item>
            <el-form-item label="账号名" :label-width="formLabelWidth"  prop="">
              <el-input v-model="editData.user" class="wid_80" auto-complete="off" placeholder="请输入数据源账号名称"></el-input>
            </el-form-item>
            <el-form-item label="账号密码" :label-width="formLabelWidth"  prop="">
              <el-input type="password" v-model="editData.pwd" class="wid_80" auto-complete="off" placeholder="请输入数据源账号密码"></el-input>
            </el-form-item>
          </template>
          <template v-else-if="editData.type==2">
            <el-form-item label="目录" :label-width="formLabelWidth"  prop="catalog">
              <el-input v-model="editData.catalog" class="wid_80" auto-complete="off" placeholder="请输入目录名"></el-input>
            </el-form-item>
            <el-form-item label="表空间" :label-width="formLabelWidth"  prop="schema">
              <el-input v-model="editData.schema" class="wid_80" auto-complete="off" placeholder="请输入表空间"></el-input>
            </el-form-item>
            <el-form-item label="表前缀" :label-width="formLabelWidth"  prop="namePrefix">
              <el-input v-model="editData.namePrefix" class="wid_80" auto-complete="off" placeholder="请输入表前缀"></el-input>
            </el-form-item>

          </template>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="pink" @click="handleSaveData()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title='数据库操作' size="large"  :visible.sync="dialogDataSec" :before-close="handleClose">
        <el-table
          ref="multipleTable"
          :data="tabletDataSec"
          height="400"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="编号" width="70"> </el-table-column>
          <el-table-column prop="name" label="数据库名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-main"  @click="showDialogTable(scope.row.dataSources,scope.row.id,2)">{{ scope.row.displayName }}【{{scope.row.name}}】</span>
            </template>
          </el-table-column>
          <el-table-column prop="schema" label="表空间" width="180"> </el-table-column>
          <el-table-column prop="catalog" label="目录" width="140">
          </el-table-column>
          <el-table-column label="操作" width="230">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row, 2)">编辑</el-button>
              <el-button
                size="small"
                @click="handleCheck(scope.row.id)">检测</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row,'CATLOG')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="search-page" style="margin-top: 20px">
          <el-pagination
            @size-change="handleSizeChangeSec"
            @current-change="handleCurrentChangeSec"
            :current-page="pageSec.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSec.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageSec.total">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="pink" @click="handleAdd(2)">添加</el-button>
        </div>
      </el-dialog>
      <el-dialog title='数据表操作' size="small"  :visible.sync="dialogDataThr" :before-close="handleCancel">
        <div class="search-container" style="margin-top: -30px;">
          <el-input class="search-key" v-model="searchDataThr.key" :maxlength="150" placeholder="请输入关键字" @keyup.native.enter="handleSearchThr"></el-input>
          <el-button type="button" class="search-btn" @click="handleSearchThr">查询</el-button>
          <el-button type="success" @click="handleAdd(3)">添加</el-button>
          <!--<el-button type="warning" @click="importExcelData()">导入</el-button>-->
        </div>
        <el-table
          ref="multipleTable"
          :data="tabletDataThr"
          height="400"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column prop="id" label="编号" width="70"> </el-table-column>
          <el-table-column prop="name" label="数据表名称"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-main" @click="handlePreview('' ,scope.row.name )">{{ scope.row.displayName }}【{{scope.row.tableName}}】</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row, 3)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row,'TABLE')">删除</el-button>
              <el-button
                size="small"
                type="success"
                @click="testTable(scope.row.id)">检测</el-button>
              <el-button
                size="small"
                type="warning"
                @click="exportData(searchData.parentSourceId, scope.row.tableName )">导出</el-button>
              <div style="display: inline-block; margin-left:10px;cursor: pointer;">
                <upload-component
                  @changeFile="changeFile"
                  name-type="upload"
                  button-type="warning"
                  :select-table="scope.row.tableName"
                  :input-txt="exportExcel.txtName"
                  :visible-flag="false"
                  button-size="small"
                >

                  <em slot="txtFileName">导入</em>
                </upload-component>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="search-page"  style="margin-top: 20px">
          <el-pagination
            @size-change="handleSizeChangeThr"
            @current-change="handleCurrentChangeThr"
            :current-page="pageThr.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageThr.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageThr.total">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">

        </div>
      </el-dialog>

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
     import { dataSourceList,dataSourceDetail,dataSourceDelete,addTable,addDataSource,addCatalog,importExcel ,tableExists , batchExists } from '@/api/dataManage/sourceData-api'
     import { previewData } from '@/api/marketingManage/marketTask-api'
     import UploadComponent from  '@/components/upload'
     export default {
      name: 'sourceData',
      components: {
        UploadComponent
      },
      data() {
        return {
          searchData:{
            key:'',
            querySourceType:'DATASOURCE',
            parentSourceId:''
          },
          searchDataThr:{
            key:'',
            querySourceType:'TABLE',
            parentSourceId:''
          },
          page:{
            pageSize:10,
            total:100,
            currentPage: 1
          },
          pageSec:{
            pageSize:10,
            total:100,
            currentPage: 1
          },
          pageThr:{
            pageSize:10,
            total:100,
            currentPage: 1
          },
          tableData: [],
          tabletDataSec:[],
          tabletDataThr:[],
          defaultProps: {
            children: 'child',
            label: 'name'
          },
          multipleSelection: [],
          dialogFormVisible: false,
          dialogTreedVisible:false,
          dialogDataSec:false,
          dialogDataThr:false,
          sourceId:{
             secId:'',
             thrId:''
          },
          isEdit:false,
          editData: {
            id:'',
            displayName: '',
            sourceName: '',
            ip:'',
            port:'',
            user:'',
            pwd:'',
            catalog:'',
            schema:'',
            namePrefix:'',
            parentSourceId:'',
            type:1
          },
          formLabelWidth: '100px',
          preview:{
            tempData:[],
            flag:false,
            num:0
          },
          exportExcel:{
            txtName:''
          },
          rules: {
            name: [
              { required: true, message: '请输入权限名称', trigger: 'blur' },
              { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
            ]
          }
        }
      },
      methods: {
        handleCheck(id){
          batchExists({catalogId:id}).then((res)=>{
            this.listSec(this.pageSec.pageSize,this.pageSec.currentPage)
            this.$message({
              type:'success',
              message:res.msg
            })
          })
        },
        testTable(id){
          tableExists({tableId:id}).then((res)=>{
          this.listThr(this.pageThr.pageSize,this.pageThr.currentPage)
              this.$message({
                type:'success',
                message:res.msg
              })
          })
        },
         //弹窗列表
         showDialogTable(item,pid,index){
           if(index===1){
             this.sourceId.secId=pid;
             this.searchData.parentSourceId=this.sourceId.secId;
             this.searchData.querySourceType='CATLOG';
             this.searchData.key = '';
             this.searchDataThr.key = '';
             this.listSec(10,1);
             this.dialogDataSec=true;

           }else if(index===2){
             this.sourceId.thrId=pid;
             this.searchData.parentSourceId=this.sourceId.thrId;
             this.searchData.querySourceType='TABLE';
             this.searchData.key = '';
             this.searchDataThr.key = '';
             this.listThr(10,1);
             this.dialogDataThr=true;

           }
         },
         //自定义事件
         handleSearch(){
           let _data={
             pageSize:this.page.pageSize,
             currentPage: 1,
             displayName:this.searchData.key,
             parentSourceId:this.searchData.parentSourceId,
             querySourceType: this.searchData.querySourceType,
             sortOrder: "ASC",
           };
           dataSourceList(_data).then((data)=>{
             if(data.code==1){
               this.tableData=data.data;
               this.page.total=data.total;
               this.loading = false
             }
           })
         },
         handleSearchThr(){
          let _data={
            pageSize:this.pageThr.pageSize,
            currentPage: 1,
            displayName:this.searchDataThr.key,
            parentSourceId:this.searchData.parentSourceId,
            querySourceType: this.searchData.querySourceType,
            sortOrder: "ASC",
          };
          dataSourceList(_data).then((data)=>{
            if(data.code==1){
              this.tabletDataThr=data.data;
              this.pageThr.total=data.total;
              this.loading = false
            }
          })
        },
         handleEdit(index, row, type) {
           let _self=this;
           _self.isEdit=true;
           _self.editData.id=row.id;
           _self.editData.displayName=row.displayName;
           _self.editData.ip=row.ip;
           _self.editData.port=row.port;
           _self.editData.user=row.userName;
           _self.editData.pwd=row.pwd;
           _self.editData.catalog=row.catalog;
           _self.editData.schema=row.schema;
           _self.editData.namePrefix=row.namePrefix;
           if(type==1){
             _self.searchData.parentSourceId='';
             _self.editData.sourceName=row.sourceName;
           }else if(type==2){
             _self.searchData.parentSourceId=_self.sourceId.secId;
             _self.editData.sourceName=row.name;
           }else{
             _self.searchData.parentSourceId=_self.sourceId.thrId;
             _self.editData.sourceName=row.tableName;
           }
           _self.editData.parentSourceId=_self.searchData.parentSourceId;
           _self.editData.type=type;
           this.dialogFormVisible=true;
         },
         handleDelete(index, row, sourceType) {
           this.$confirm('此操作将删除【'+row.displayName+'】源吗, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           }).then(() => {
               let _data={};
             dataSourceDelete(_data,sourceType,row.id).then(data=>{
               this.$message({
                 type: 'success',
                 message: '删除成功!'
               });
               if(sourceType=='CATLOG'){
                 this.listSec(10,1);
               }else if(sourceType=='TABLE'){
                 this.listThr(10,1);
               }else{
                 this.list(10,1);
               }

             });
           }).catch(() => {
             console.log('删除取消');
           });
         },
         handleAdd(type){
           let _self=this;
           _self.editData.id='';
           _self.editData.displayName='';
           _self.editData.sourceName='';
           _self.editData.ip='';
           _self.editData.port='';
           _self.editData.user='';
           _self.editData.pwd='';
           _self.editData.catalog='';
           _self.editData.schema='';
           _self.editData.namePrefix='';
           _self.editData.type=type;
           if(type==1){
             _self.searchData.parentSourceId='';
           }else if(type==2){
             _self.searchData.parentSourceId=_self.sourceId.secId;
           }else{
             _self.searchData.parentSourceId=_self.sourceId.thrId;
           }
           _self.editData.parentSourceId=_self.searchData.parentSourceId;
           _self.dialogFormVisible = true;
           _self.isEdit=false;
         },
         handleSaveData(){
           if(this.editData.type==1){
             addDataSource(this.editData).then((data)=>{
               if(data.code==1){
                 this.$message({
                   showClose: true,
                   message: '数据添加成功',
                   type: 'success'
                 });
                 this.dialogFormVisible = false;
                 this.list(10,1);
               }
             });
           }else if(this.editData.type==2){
             addCatalog(this.editData).then((data)=>{
               if(data.code==1){
                 this.$message({
                   showClose: true,
                   message: '数据添加成功',
                   type: 'success'
                 });
                 this.dialogFormVisible = false;
                 this.listSec(10,1);
               }
             });
           }else{
             addTable(this.editData).then((data)=>{
                if(data.code==1){
                    this.$message({
                        showClose: true,
                        message: '数据添加成功',
                        type: 'success'
                    });
                   this.dialogFormVisible = false;
                  this.listThr(10,1);
                }
              })
           }
         },
         handleClose(done) {
           this.searchData.parentSourceId='';
           this.searchData.querySourceType='DATASOURCE';
           done();
             //console.log('都关闭了')
         },
         handleCancel(done) {
           this.searchData.parentSourceId=this.sourceId.secId;
           this.searchData.querySourceType='CATLOG';
           done();
            //console.log('都关闭了2')
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

         //统计表导出
         exportData(parentSourceId,tableName){
           if (!window.location.origin) {
             window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
           }
           window.open(window.location.origin+'/datasource/export?tableName='+ tableName +'&parentSourceId='+ ( parentSourceId || 0 ) + ' &Authorization='+ sessionStorage.getItem('userToken'));
         },

          //上传表文件
          changeFile(...args){
            console.log(args);
            let _data = new FormData();
            _data.append('tableName', args[2]);
            _data.append('parentSourceId', this.searchData.parentSourceId);
            _data.append('orgId', 0);
            _data.append('file', args[0]);
            importExcel(_data).then(data=>{
              this.$message({
                showClose: true,
                message: this.$createElement('p',null, [
                  '数据任务导入成功',
                  this.$createElement('a', {
                    attrs:{
                      href:'#/home/markettask/0/taskdetail'
                    },
                    class:'common-link'
                  }, '去营销')
                ]),
                type: 'success'
              });
            })
          },

          importExcelData(){
              this.$message({
                showClose: true,
                message: '功能开发中...',
                type: 'warning'
              });
              return false;
          },

         list(pageSize,currentPage){
          let _data={
            pageSize,
            currentPage,
            parentSourceId:this.searchData.parentSourceId,
            displayName:this.searchData.key,
            querySourceType:this.searchData.querySourceType
          };
          dataSourceList(_data).then((data)=>{
            if(data.code==1){
              this.tableData=data.data;
              this.page.total=data.total;
              this.page.pageSize=pageSize;
              this.loading = false
            }
          });
        },
         listSec(pageSize,currentPage){
          let _data={
            pageSize,
            currentPage,
            parentSourceId:this.searchData.parentSourceId,
            displayName:'',
            querySourceType:this.searchData.querySourceType
          };
          dataSourceList(_data).then((data)=>{
            if(data.code==1){
              this.tabletDataSec=data.data;
              this.pageSec.total=data.total;
              this.pageSec.pageSize=pageSize;
              this.loading = false
            }
          });
        },
         listThr(pageSize,currentPage){
          let _data={
            pageSize,
            currentPage,
            parentSourceId:this.searchData.parentSourceId,
            displayName:this.searchDataThr.key,
            querySourceType:this.searchData.querySourceType
          };
          dataSourceList(_data).then((data)=>{
            if(data.code==1){
              this.tabletDataThr=data.data;
              this.pageThr.total=data.total;
              this.pageThr.pageSize=pageSize;
              this.loading = false
            }
          });
        },

          //分页模块
          handleSizeChange(pageSize) {
           this.page.pageSize=pageSize;
           this.list(pageSize,1);
         },
          handleCurrentChange(currentPage) {
           this.list(this.page.pageSize,currentPage);
         },
          //分页模块
          handleSizeChangeSec(pageSize) {
            this.pageSec.pageSize=pageSize;
            this.listSec(pageSize,1);
          },
          handleCurrentChangeSec(currentPage) {
            this.listSec(this.pageSec.pageSize,currentPage);
          },
          //分页模块
          handleSizeChangeThr(pageSize) {
            this.pageThr.pageSize = pageSize;
            this.listThr(pageSize,1);
          },
          handleCurrentChangeThr(currentPage) {
            this.pageThr.currentPage = currentPage;
            this.listThr(this.pageThr.pageSize,currentPage);
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
      created(){
          let _data={
            pageSize:this.page.pageSize,
            currentPage: this.page.currentPage,
            displayName:this.searchData.key,
            parentSourceId:this.searchData.parentSourceId,
            querySourceType: this.searchData.querySourceType,
            sortOrder: "ASC",
          };
          dataSourceList(_data).then((data)=>{
              if(data.code==1){
                  this.tableData=data.data;
                  this.page.total=data.total;
                  this.loading = false
              }
          })
      }
    };
</script>
