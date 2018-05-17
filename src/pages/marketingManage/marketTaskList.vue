<template>
  <div class="market-task-list">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-input class="search-key" v-model="searchData.key" :maxlength="20" placeholder="请输入任务名称" @keyup.native.enter="searchEvent"></el-input>
          <el-select v-model="searchData.type" placeholder="请选择">
            <el-option label="普通任务" value="NORMAL"/>
            <el-option label="模板任务" value="TEMPLATE"/>
          </el-select>
          <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>
          <el-button type="success" class="search-add"  @click="handleEdit(0,false)">新增任务</el-button>
          <el-button type="success" class="search-add"  @click="handleEdit(0,true)">新增模板</el-button>
        </div>
        <div class="search-table">
          <el-table
            ref="multipleTable"
            v-loading="loading"
            :data="tableData"
            height="400"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="taskId" label="编号" width="120"> </el-table-column>
            <el-table-column prop="taskName" label="规则任务名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="taskType"
                             :formatter="(row, column, cellValue) => {return cellValue === 'TEMPLATE' ? '模板任务':'普通任务';}"
                             label="任务类型"></el-table-column>
            <el-table-column label="操作" width="316">
              <template slot-scope="scope">
                <el-button
                  :disabled="!isCreate(scope.row)"
                  size="small"
                  @click="handleEdit(scope.row.taskId,scope.row.taskType === 'TEMPLATE')">编辑</el-button>
                <el-button
                  :disabled="!isCreate(scope.row)"
                  size="small"
                  type="danger"
                  v-if="scope.row.taskType !== 'TEMPLATE'"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button
                  size="small"
                  type="success"
                  @click="handleExecute(scope.$index, scope.row)">执行规则</el-button>
                <el-button
                  size="small"
                  type="warning"
                  @click="handleParamsExecute(scope.$index, scope.row)">参数化执行</el-button>
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
    <el-dialog top="12vh" title='参数化执行' :close-on-click-modal="false" size="medium" :visible.sync="paramsItem.flag">
      <div style="margin-bottom:5px;width:100%;text-align:center;">
        <span class="demonstration">执行规则</span>
        <el-radio-group v-model="paramsItem.timeConf.loopRule">
          <el-radio label="ONETIME">单次</el-radio>
          <el-radio label="HOUR">每小时</el-radio>
          <el-radio label="DAY">每天</el-radio>
          <el-radio label="WEEK">每周</el-radio>
          <el-radio label="MONTH">每月</el-radio>
        </el-radio-group>
      </div>
      <div style="width:100%;text-align:center;">
        <span v-if="paramsItem.timeConf.loopRule === 'ONETIME'" style="color: red;font-size: xx-small;">单次执行时，执行日期不填为立即执行</span>
        <span v-if="paramsItem.timeConf.loopRule !== 'ONETIME' && !paramsItem.timeConf.executeTime" style="color: red;font-size: xx-small;">非单次执行时，初次执行日期必填</span>
        <br/>
        <span style="color: red;font-size: xx-small;">执行模板任务时,单次执行不影响定时执行的计划,定时执行将会覆盖以前的定时执行计划.普通任务的执行不受影响.</span>
      </div>
      <div style="margin-bottom:15px;width:100%;text-align:center;">
        <span v-if="paramsItem.timeConf.loopRule === 'ONETIME'" class="demonstration">执行时间</span>
        <span v-else class="demonstration">初次执行时间</span>
        <el-date-picker
          v-model="paramsItem.timeConf.executeTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择执行执行时间">
        </el-date-picker>
      </div>

      <el-form :model="paramsItem" ref="paramsItem" class="param-item-form">
        <div v-for="(items, itemsIndex) in paramsItem.items" :key="itemsIndex" class="item-container" :style="itemsIndex % 3 === 0 ? '300px':'210px'">
          <el-form-item style="margin-bottom: 5px;text-align: center;" :style="itemsIndex % 3 === 0 ? 'margin-left: 50px;' : 'margin-left: 5px;'" v-if="!paramsItem.isTemplate">
            <el-tag :closable="paramsItem.items.length > 1" :close-transition="true" @close="handleDelParam(itemsIndex)">任务{{itemsIndex+1}}</el-tag>
          </el-form-item>
          <el-form-item style="margin-bottom: 5px;" :label="itemsIndex % 3 === 0 ? item.label:null" :key="index" :label-width="itemsIndex % 3 === 0 ? '100px':'10px'" v-for=" (item,index)  in  items">
            <template v-if="item.params === 'smsChannelId' || item.params === 'smsTemplateId' || item.params === 'batchDescriptionId' || item.params === 'catalog'">
              <el-select class="item" v-model="item.value" clearable  filterable :placeholder="'请选择' + item.label">
                <el-option
                  v-for="cell in paramsItem.defaultItems[item.params]"
                  :key="cell.value"
                  :label="cell.name"
                  :value="cell.id">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.params.startsWith('dataSource')">
              <el-select
                class="item"
                v-model="item.value"
                clearable
                filterable
                remote
                :placeholder="'请选择' + item.label"
                :remote-method="remoteMethod">
                <el-option
                  v-for="cell in paramsItem.filterData"
                  :key="cell.value"
                  :label="cell.name"
                  :value="cell.id">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-input class="item" type="text" v-model="item.value" auto-complete="off" :placeholder="'请输入' + item.label"/>
            </template>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!paramsItem.isTemplate" type="text" style="float:left;" @click="addItem()">新增列</el-button>
        <el-button @click="paramsItem.flag = false">取 消</el-button>
        <el-button type="pink" @click="paramsItemsExecute()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="定时执行" :close-on-click-modal="false" size="medium" :visible.sync="executeItem.flag">
      <div style="margin-bottom:5px;width:100%;text-align:center;">
        <span class="demonstration">执行规则</span>
        <el-radio-group v-model="executeItem.timeConf.loopRule">
          <el-radio label="ONETIME">单次</el-radio>
          <el-radio label="HOUR">每小时</el-radio>
          <el-radio label="DAY">每天</el-radio>
          <el-radio label="WEEK">每周</el-radio>
          <el-radio label="MONTH">每月</el-radio>
        </el-radio-group>
      </div>
      <div style="width:100%;text-align:center;">
        <span v-if="executeItem.timeConf.loopRule === 'ONETIME'" style="color: red;font-size: xx-small;">单次执行时，执行日期不填为立即执行</span>
        <span v-if="executeItem.timeConf.loopRule !== 'ONETIME' && !executeItem.timeConf.executeTime" style="color: red;font-size: xx-small;">非单次执行时，初次执行日期必填</span>
        <br/>
        <span style="color: red;font-size: xx-small;">执行模板任务时,单次执行不影响定时执行的计划,定时执行将会覆盖以前的定时执行计划.普通任务的执行不受影响.</span>      </div>
      <div style="margin-bottom:15px;width:100%;text-align:center;">
        <span v-if="executeItem.timeConf.loopRule === 'ONETIME'" class="demonstration">执行时间</span>
        <span v-else class="demonstration">初次执行时间</span>
        <el-date-picker
          v-model="executeItem.timeConf.executeTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择执行执行时间">
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="executeItem.flag = false">取 消</el-button>
        <el-button type="pink" @click="execute()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listTasks,executeTask,executeTaskAsync,executeTaskParams,dataSourceList } from '@/api/marketingManage/marketTask-api'
  import { templeteList } from '@/api/smsManagement/smsPassageway-api';
  import { descriptionList } from '@/api/smsManagement/smsChannel-api';
  import { templeteList as smsTemplateList }  from '@/api/smsManagement/smsTemplate-api';
  import store from '@/vuex/store'

  export default {
    name: 'marketBatch',
    data () {
      return {
        searchData:{
          key:'',
          type: 'NORMAL'
        },
        page:{
          pageSize:10,
          total:100,
          currentPage: 1
        },
        paramsItem:{
          flag:false,
          taskId:0,
          isTemplate: false,
          timeConf: {
            loopRule: 'ONETIME',
            executeTime: null
          },
          items:[],
          defaultItems:{},
          dataList:[],
          catalog:[],
          filterData:[],
          loading:false
        },
        executeItem:{
          taskId:0,
          flag: false,
          timeConf: {
            loopRule: 'ONETIME',
            executeTime: null
          },
        },
        loading:true,
        tableData: [],
      }
    },
    components: {
    },
    methods: {
      isCreate(row){
        return row.create || store.state.user.userInfo.admin;
      },
      searchEvent(){
        this.list(10,1)
      },
      list(pageSize,currentPage){
        let _data={
          pageSize,
          currentPage,
          taskName:this.searchData.key,
          taskType:this.searchData.type
        };
        listTasks(_data).then((data)=>{
          if(data.code===1){
            this.tableData=data.data;
            this.page.pageSize=pageSize;
            this.page.currentPage=data.currentPage;
            this.page.total=data.total;
            this.loading = false;
            this.$store.dispatch('saveCondition',{
              page:{
                pageSize,
                pageIndex:currentPage
              },
              key:this.searchData.key,
              type:this.searchData.type,
              url:this.$route.path
            })
          }
        });
      },

      //路由跳转到详情页
      handleEdit(id,isTemplate){
        this.$router.push({ name: 'markettaskdetail', params: { id,isTemplate }})
      },
      handleDelete(index, row){
        this.$message({
          showClose: true,
          message: '功能正在开发中，请等待...',
          type: 'warning'
        });
      },
      handleExecute(index,row){
        this.executeItem.taskId = row.taskId;
        this.executeItem.timeConf.loopRule = 'ONETIME';
        this.executeItem.timeConf.executeTime = null;
        this.executeItem.flag = true;
      },
      execute(){
        if(this.executeItem.timeConf.loopRule !== 'ONETIME' && !this.executeItem.timeConf.executeTime){
          this.$message({
            showClose: true,
            message: '非单次执行的初次执行时间为必填!',
            type: 'error'
          });
        }else if(this.executeItem.timeConf.executeTime && this.executeItem.timeConf.executeTime.getTime() < new Date().getTime()){
          this.$message({
            showClose: true,
            message: '执行时间需要在当前时间之后!',
            type: 'error'
          });
        }else{
          this.$message({
            showClose: true,
            message: '执行操作中,请稍等...',
            type: 'success'
          });

          const _map = new Map();
          _map.set('taskId',this.executeItem.taskId);
          _map.set('executeDate',this.executeItem.timeConf.executeTime);
          _map.set('executeTime',this.executeItem.timeConf.executeTime);

          let desc = '';
          if(this.executeItem.timeConf.loopRule !== 'ONETIME'){
            let cron = '';

            if(this.executeItem.timeConf.loopRule === 'HOUR'){
              cron += '0 '
                + this.executeItem.timeConf.executeTime.getMinutes()
                + ' * * * ?';
              desc = '每小时执行';
            }else if(this.executeItem.timeConf.loopRule === 'DAY'){
              cron += '0 '
                + this.executeItem.timeConf.executeTime.getMinutes()
                + ' ' + this.executeItem.timeConf.executeTime.getHours()
                + ' * * ?';
              desc = '每天执行';
            }else if(this.executeItem.timeConf.loopRule === 'WEEK'){
              cron += '0 '
                + this.executeItem.timeConf.executeTime.getMinutes()
                + ' ' + this.executeItem.timeConf.executeTime.getHours()
                + ' ? * ' + (this.executeItem.timeConf.executeTime.getDay() + 1);
              desc = '每周执行';
            }else if(this.executeItem.timeConf.loopRule === 'MONTH'){
              cron += '0 '
                + this.executeItem.timeConf.executeTime.getMinutes()
                + ' ' + this.executeItem.timeConf.executeTime.getHours()
                + ' ' + this.executeItem.timeConf.executeTime.getDate()
                + ' * ?';
              desc = '每月执行';
            }
            _map.set('executeCron',cron);
          }else{
            desc = '单次执行';
          }
          _map.set('executeDesc',desc);
          _map.set('executeParamArr',[{}]);
          let _data=this.strMapToObj(_map);

          executeTaskAsync(_data).then(data=>{
            if(data.code===1){
              this.commonMessage();
              this.batchMessage(data.data);
              this.executeItem.flag = false;
            }
          });
        }
      },
      buildItem(data){
        let newItem = [];
        let _data = {
          "uId": "admin",
          user:this.account,
          status:1,
          pageIndex: 1,
          pageSize: 500
        };
        for (let [key, value] of Object.entries(data.data)) {
          if(key == 'smsChannelId'){
            templeteList(_data).then(data => {
                this.$set(this.paramsItem.defaultItems,'smsChannelId',data.data.map(item=>{
                  return {
                    value:item.name,
                    id:item.id.toString(),
                    name:item.name + '【' + item.id + '】'
                  }
                }));
            });
          }else if(key == 'smsTemplateId'){
            smsTemplateList(_data).then(data => {
              this.$set(this.paramsItem.defaultItems,'smsTemplateId',data.data.map(item=>{
                return {
                  value:item.templateName,
                  id:item.id.toString(),
                  name:item.templateName + '【' + item.id + '】'
                }
              }));
            });
          }else if(key == 'batchDescriptionId'){
            descriptionList(_data).then(data => {
              this.$set(this.paramsItem.defaultItems,'batchDescriptionId',data.data.map(item=>{
                return {
                  value:item.name,
                  id:item.id.toString(),
                  name:item.name + '【' + item.id + '】'
                }
              }));
            });
          }else if(key == 'catalog'){
            if(!!!this.paramsItem.defaultItems[key]){
              this.$set(this.paramsItem.defaultItems,key,this.paramsItem.catalog);
            }
          }else if(key.startsWith('dataSource')){
              if(!!!this.paramsItem.defaultItems.dataSource){
                //this.$set(this.paramsItem.defaultItems,'dataSource',this.paramsItem.dataList);
              }
          }
          newItem.push({
            label:value,
            params:key,
            value:''
          });
        }
        this.paramsItem.items.push(newItem);
      },
      handleParamsExecute(index,row){
        this.paramsItem.items = [];
        this.paramsItem.timeConf.loopRule = 'ONETIME';
        this.paramsItem.timeConf.executeTime = null;
         executeTaskParams({},row.taskId).then(data =>{
          /* Object.defineProperties(data.data,{
               dataSource:{
                 value:'数据源表',
                 writable: true,
                 enumerable: true,
                 configurable: true
               },
               catalog:{
                 value:'catalogId',
                 writable: true,
                 enumerable: true,
                 configurable: true
               }
             }) 下次更新 */
             if(Object.keys(data.data).length){
               this.buildItem(data);
               this.paramsItem.flag = true;
               this.paramsItem.taskId = row.taskId
             }else{
               this.$message({
                 showClose: true,
                 message: '参数未配置，请先配置参数！',
                 type: 'error'
               });
             }
         });
      },
      handleDelParam(index){
        this.paramsItem.items.splice(index,1);
      },
      addItem(){
        executeTaskParams({},this.paramsItem.taskId).then(data =>{
/*            Object.defineProperties(data.data,{
              dataSource:{
                value:'数据源表',
                writable: true,
                enumerable: true,
                configurable: true
              },
              catalog:{
                value:'catalogId',
                writable: true,
                enumerable: true,
                configurable: true
              }
            })*/
            if(Object.keys(data.data).length){
              this.buildItem(data);
            }
        });
      },
      strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
          obj[k] = v;
        }
        return obj;
      },
      paramsItemsExecute(){
        if(this.paramsItem.timeConf.loopRule !== 'ONETIME' && !this.paramsItem.timeConf.executeTime){
          this.$message({
            showClose: true,
            message: '非单次执行的初次执行时间为必填!',
            type: 'error'
          });
        }else if(this.paramsItem.timeConf.executeTime && this.paramsItem.timeConf.executeTime.getTime() < new Date().getTime()){
          this.$message({
            showClose: true,
            message: '执行时间需要在当前时间之后!',
            type: 'error'
          });
        }else{
          this.$message({
            showClose: true,
            message: '参数化任务执行操作中,请稍等...',
            type: 'success'
          });
          const _map = new Map();
          _map.set('taskId',this.paramsItem.taskId);
          _map.set('executeDate',this.paramsItem.timeConf.executeTime);
          _map.set('executeTime',this.paramsItem.timeConf.executeTime);

          let desc = '';

          if(this.paramsItem.timeConf.loopRule !== 'ONETIME'){
            let cron = '';
            if(this.paramsItem.timeConf.loopRule === 'HOUR'){
              cron += '0 '
                + this.paramsItem.timeConf.executeTime.getMinutes()
                + ' * * * ?';
              desc = '每小时执行';
            }else if(this.paramsItem.timeConf.loopRule === 'DAY'){
              cron += '0 '
                + this.paramsItem.timeConf.executeTime.getMinutes()
                + ' ' + this.paramsItem.timeConf.executeTime.getHours()
                + ' * * ?';
              desc = '每天执行';
            }else if(this.paramsItem.timeConf.loopRule === 'WEEK'){
              cron += '0 '
                + this.paramsItem.timeConf.executeTime.getMinutes()
                + ' ' + this.paramsItem.timeConf.executeTime.getHours()
                + ' ? * ' + (this.paramsItem.timeConf.executeTime.getDay() + 1);
              desc = '每周执行';
            }else if(this.paramsItem.timeConf.loopRule === 'MONTH'){
              cron += '0 '
                + this.paramsItem.timeConf.executeTime.getMinutes()
                + ' ' + this.paramsItem.timeConf.executeTime.getHours()
                + ' ' +this.paramsItem.timeConf.executeTime.getDate()
                + ' * ?';
              desc = '每月执行';
            }
            _map.set('executeCron',cron);
          }else{
            desc = '单次执行';
          }

          _map.set('executeDesc',desc);

          let paraArr = [];
          this.paramsItem.items.forEach(
            (item) => {
              let paraMap = new Map();
              item.forEach((param) => {
                if(null !== param.value && undefined !== param.value && '' !== param.value){
                  paraMap.set(param.params,param.value);
                }
              });
              paraArr.push(this.strMapToObj(paraMap));
            }
          );
          _map.set('executeParamArr',paraArr);
          let _data=this.strMapToObj(_map);
          // console.log(_data);

          executeTaskAsync(_data).then(data=>{
            if(data.code===1){
              this.commonMessage();
              this.batchMessage(data.data);
              this.paramsItem.flag = false;
            }
          });
        }
      },
      remoteMethod(query) {
        if (query !== '') {
          this.paramsItem.loading = true;
          setTimeout(() => {
            this.paramsItem.loading = false;
            this.paramsItem.filterData = this.paramsItem.dataList.filter(item => {
              return item.name.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.paramsItem.filterData = [];
        }
      },
      dataSourcesSearch(name,data){
          this.dataSource = data;
          if(data){
            for (let items of data){
              if(items.dataSources.length === 0){
                continue;
              }
              if(name === 'catalog'){
                this.$set(this.paramsItem.defaultItems,name,items.dataSources.map( cell =>{
                  return {
                    value:cell.id,
                    id:cell.id,
                    name:cell.displayName + '【' + cell.id + '】'
                  }
                }));
              }
              if(name.startsWith('dataSource')){
                for (let item of items.dataSources){
                  if(item.dataSources.length===0){
                    continue;
                  }
                  let tableArr = item.dataSources.map( _item=>{
                    return {
                      value:JSON.stringify({
                        catalogId:item.id,
                        parentSourceId:item.id,
                        displayName: _item.displayName ,
                        identity:item.id +'_'+_item.tableName,
                        tableName:_item.tableName,
                      }),
                      id:JSON.stringify({
                        catalogId:item.id,
                        parentSourceId:item.id,
                        displayName: _item.displayName ,
                        identity:item.id +'_'+_item.tableName,
                        tableName:_item.tableName,
                      }) ,
                      name:_item.displayName + '【' + items.displayName + '-' + item.displayName + '】'
                    }
                  });
                  tableArr = Array.prototype.concat.apply(tableArr,this.paramsItem.defaultItems[name]);
                  this.$set(this.paramsItem.defaultItems,name,tableArr);
                }
              }
            }
          }else{
            console.log('数据没有加载完你就走了')
          }
      },
      batchMessage(batchId) {
        let _data = {
          type: "DATASOURCE_BATCH",
          data: {
            batchId:batchId
          }
        };
        this.$socket.emit('request',JSON.stringify(_data));
      },

      commonMessage(){
        this.$message({
          showClose: true,
          message: this.$createElement('p',null, [
            '任务提交成功'
          ]),
          type: 'success'
        });
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
      //分页模块
      handleSizeChange(pageSize) {
        this.list(pageSize,1);
      },
      handleCurrentChange(currentPage) {
        this.list(this.page.pageSize,currentPage);
      }
    },
    computed: {},
    created() {

      if(this.$store.state.search.routeUrl === this.$route.path){
        this.page.pageSize = this.$store.state.search.page.pageSize;
        this.page.currentPage = this.$store.state.search.page.pageIndex;
        this.searchData.key = this.$store.state.search.key;
        this.searchData.type= this.$store.state.search.type;
      }

      let _data={
        pageSize:this.page.pageSize,
        currentPage: this.page.currentPage,
        taskName:this.searchData.key,
        taskType: this.searchData.type
      };
      listTasks(_data).then((data)=>{
        if(data.code===1){
          this.tableData=data.data;
          this.page.total=data.total;
          this.loading = false
        }
        console.log(this.$route);
        this.$store.dispatch('saveCondition',{
            page:{
              pageSize:this.page.pageSize,
              pageIndex:this.page.currentPage
            },
            key:this.searchData.key,
            type:this.searchData.type,
            url:this.$route.path
        });
      });
      dataSourceList().then((data)=>{
        for (let items of data.data){
          if(items.dataSources.length == 0){
            continue;
          }
          for (let item of items.dataSources){
            if(item.dataSources.length==0){
              continue;
            }
            this.paramsItem.catalog.push({
              value:item.id,
              id:item.id,
              name:item.displayName + '【' + item.id + '】'
            });
            for (let _item of item.dataSources){
              this.paramsItem.dataList.push({
                value:_item.id ,
                id:JSON.stringify({
                  catalogId:item.id,
                  parentSourceId:item.id,
                  displayName: _item.displayName ,
                  identity:item.id +'_'+_item.tableName,
                  tableName:_item.tableName,
                }) ,
                name:_item.displayName + '【' + items.displayName + '-' + item.displayName + '】'
              })
            }
          }
        }
        console.log('done')
      });
    }
  }
</script>
