<template>
  <div class="source-data-container">
    <el-row>
      <el-col>
        <div class="search-container">
        </div>
        <div class="search-table">
          <el-table :data="source_data" height="400" border tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="id" label="编号" width="70"/>
            <el-table-column prop="name" label="数据源名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="text-main" @click="showDialogTable(scope.row)">
                  {{ scope.row.displayName }}【{{scope.row.sourceName}}】
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="protocolType" label="协议" width="120"/>
            <el-table-column prop="statusStr" label="ip/port" width="180">
              <template slot-scope="scope">
                {{ scope.row.ip }}:{{scope.row.port}}
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="账号" width="120"/>
          </el-table>
        </div>
        <div class="search-page">
          <el-pagination
            @size-change="handleSourceTableSizeChange"
            @current-change="handleSourceTableCurrentChange"
            :current-page="source_page.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="source_page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="source_page.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog title='数据源' size="small" :visible.sync="catalog_show" :before-close="handleCatalogClose">
      <el-table :data="catalog_data" height="400" border tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="编号" width="70"/>
        <el-table-column prop="name" label="数据源名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="text-main">{{ scope.row.displayName }}【{{scope.row.name}}】</span>
          </template>
        </el-table-column>
        <el-table-column prop="schema" label="表空间" width="140"/>
        <el-table-column prop="catalog" label="目录" width="140">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="initSelect(scope.row)">分配</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="search-page" style="margin-top: 20px">
        <el-pagination
          @size-change="handleCatalogTableSizeChange"
          @current-change="handleCatalogTableCurrentChange"
          :current-page="catalog_page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="catalog_page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="catalog_page.total">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog title="数据源分配" :visible.sync="allocate_show" size="small">
      <el-transfer
        style="padding-left: 90px;"
        v-model="selected_catalog.orgList"
        :data="organizations"
        :titles="['组织列表', '已分配']"/>
      <div slot="footer" style="text-align: right">
        <el-button type="danger" class="search-add" @click="handleAllocate">确定</el-button>
        <el-button type="success" class="search-add" @click="allocate_show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { dataSourceList } from '@/api/dataManage/sourceData-api';
  import { orgList,allocateCatalog } from '@/api/system-api';

  export default {
    name: "allocate-catalog",
    data(){
      return {
        source_data: [],

        selected_source:{},

        search_data:{
          key:'',
          querySourceType:'DATASOURCE',
          parentSourceId:''
        },
        source_page:{
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        catalog_page:{
          currentPage: 1,
          pageSize:10,
          total:0
        },
        source_loading: true,

        catalog_data: [],

        catalog_loading: true,
        catalog_show: false,

        organization_data: [],
        organization_query:{
          pageSize: 1,
          pageIndex: 1
        },

        selected_data:{},
        allocate_show:false,
        selected_catalog:{
          catalogId: null,
          orgList: []
        }
      };
    },
    computed:{
      organizations: function () {
        let result = [];
        this.organization_data.forEach(item => {
          let disabled = false;
          this.selected_data.orgList.forEach(org => {
            if(org.isCreate === 1 && org.orgId === item.id){
              disabled = true;
            }
          });
          let temp = {
            key: item.id,
            label: item.name + "【" + item.code + "】",
            disabled: disabled
          };
          result.push(temp);
        });
        return result;
      }
    },
    methods: {
      handleSourceTableSizeChange(pageSize){
        this.source_loading = true;
        this.source_page.pageSize = pageSize;
        this.source_page.currentPage = 1;
        this.loadSourceData();
      },
      handleSourceTableCurrentChange(currentPage){
        this.source_loading = true;
        this.source_page.currentPage = currentPage;
        this.loadSourceData();
      },
      loadSourceData(){
        let _data={
          pageSize:this.source_page.pageSize,
          currentPage: this.source_page.currentPage,
          parentSourceId:this.search_data.parentSourceId,
          displayName:this.search_data.key,
          querySourceType:this.search_data.querySourceType,
          sortOrder: "ASC",
        };
        dataSourceList(_data).then((data)=>{
          if(data.code===1){
            this.source_data=data.data;
            this.source_page.total=data.total;
            this.source_loading = false;
          }
        });
      },
      showDialogTable(row){
        this.selected_source = row;
        this.search_data.parentSourceId=this.selected_source.id;
        this.search_data.querySourceType='CATLOG';
        this.search_data.key = '';
        this.loadCatalogData();
        this.catalog_show=true;
      },
      handleCatalogTableSizeChange(pageSize){
        this.catalog_loading = true;
        this.catalog_page.pageSize = pageSize;
        this.catalog_page.currentPage = 1;
        this.loadCatalogData();
      },
      handleCatalogTableCurrentChange(currentPage){
        this.catalog_loading = true;
        this.catalog_page.currentPage = currentPage;
        this.loadCatalogData();
      },
      loadCatalogData(){
        let _data = {
          pageSize: this.catalog_page.pageSize,
          currentPage: this.catalog_page.currentPage,
          parentSourceId:this.search_data.parentSourceId,
          displayName:'',
          querySourceType:this.search_data.querySourceType
        };
        dataSourceList(_data).then((data)=>{
          if(data.code === 1){
            this.catalog_data=data.data;
            this.catalog_page.total=data.total;
            this.catalog_loading = false;
          }
        });
      },
      handleCatalogClose(done){
        this.search_data.parentSourceId='';
        this.search_data.querySourceType='DATASOURCE';
        done();
      },
      loadOrganization(){
        orgList(this.organization_query).then((one)=>{
          if(one.code === 1){
            this.organization_query.pageSize = one.total;
            orgList(this.organization_query).then((data) => {
              if(one.code === 1){
                this.organization_data = data.data;
              }
            });
          }
        });
      },
      initSelect(row){
        this.selected_data = row;
        this.loadOrganization();
        this.selected_catalog.catalogId = row.id;
        this.selected_catalog.orgList = [];
        if(row.orgList){
          row.orgList.forEach(org => {
            this.selected_catalog.orgList.push(org.orgId);
          });
        }
        this.allocate_show = true;
      },
      handleAllocate(){
        allocateCatalog(this.selected_catalog).then(data => {
          if(data.code === 1){
            this.allocate_show = false;
            this.loadCatalogData();
            this.$message({
              showClose: true,
              message: '分配成功!',
              type: 'success'
            });
          }
        });
      }
    },
    created(){
      this.loadSourceData();
    },
  }
</script>

<style scoped>

</style>
