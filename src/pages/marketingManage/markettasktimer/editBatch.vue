<template>
  <div>
    <div style="margin-bottom:5px;width:100%;text-align:center;">
      <span class="demonstration">执行规则</span>
      <el-radio-group v-model="timeConf.loopRule">
        <el-radio label="ONETIME">单次</el-radio>
        <el-radio label="HOUR">每小时</el-radio>
        <el-radio label="DAY">每天</el-radio>
        <el-radio label="WEEK">每周</el-radio>
        <el-radio label="MONTH">每月</el-radio>
      </el-radio-group>
    </div>
    <div style="width:100%;text-align:center;">
      <span v-if="timeConf.loopRule === 'ONETIME'" style="color: red;font-size: xx-small;">单次执行时，执行日期不填为立即执行</span>
      <span v-if="timeConf.loopRule !== 'ONETIME' && !timeConf.executeTime" style="color: red;font-size: xx-small;">非单次执行时，初次执行日期必填</span>
    </div>
    <div style="margin-bottom:15px;width:100%;text-align:center;">
      <span v-if="timeConf.loopRule === 'ONETIME'" class="demonstration">执行时间</span>
      <span v-else class="demonstration">初次执行时间</span>
      <el-date-picker
        v-model="timeConf.executeTime"
        type="datetime"
        format="yyyy-MM-dd HH:mm"
        placeholder="选择执行执行时间">
      </el-date-picker>
    </div>

    <el-form class="param-item-form">
      <div v-for="(item, itemIndex) in items" :key="itemIndex" class="item-container" :style="itemIndex % 3 === 0 ? '300px':'210px'">
        <el-form-item style="margin-bottom: 5px;text-align: center;" :style="itemIndex % 3 === 0 ? 'margin-left: 50px;' : 'margin-left: 5px;'">
          <el-tag :closable="items.length > 1" :close-transition="true" @close="handleDelParam(itemIndex)">任务{{itemIndex+1}}</el-tag>
        </el-form-item>
        <el-form-item v-for="(rowItem,index) in item" style="margin-bottom: 5px;" :label="itemIndex % 3 === 0 ? rowItem.label:null" :key="index" :label-width="itemIndex % 3 === 0 ? '100px':'10px'">
          <template v-if="rowItem.params === 'smsChannelId' || rowItem.params === 'smsTemplateId' || rowItem.params === 'batchDescriptionId' || rowItem.params === 'catalog'">
            <el-select class="item" v-model="rowItem.value" clearable filterable :placeholder="'请选择' + rowItem.label">
              <el-option v-for="cell in defaultItems[rowItem.params]" :key="cell.value" :label="cell.name" :value="cell.id"/>
            </el-select>
          </template>
          <template v-else>
            <el-input class="item" type="text" v-model="rowItem.value" auto-complete="off" :placeholder="'请输入' + rowItem.label"/>
          </template>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { executeTaskParams,executeTask,updateBatch } from '@/api/marketingManage/marketTask-api';
  import { templeteList as smsTemplateList }  from '@/api/smsManagement/smsTemplate-api';
  import { templeteList } from '@/api/smsManagement/smsPassageway-api';
  import { descriptionList } from '@/api/smsManagement/smsChannel-api';

  export default {
    name: "editBatch",
    data(){
      return {
        batchId: null,
        taskId: null,
        needParam: false,
        defaultItems: {},
        items:[],
        itemTemplates: [],
        timeConf: {
          loopRule: 'ONETIME',
          executeTime: null
        },
        loading:false
      };
    },
    mounted(){
      this.$emit('created');
    },
    methods: {
      initItem(batchId,taskId,needParam){
        this.batchId = batchId;
        this.taskId = taskId;
        this.needParam = needParam;
        this.defaultItems = {};
        this.items=[];
        this.itemTemplates = [];
        if(this.needParam && this.taskId !== 0){
          executeTaskParams({},this.taskId).then(data =>{
            if(Object.keys(data.data).length){
              this.buildItem(data);
              this.addItem();
            }else{
              this.$message({
                showClose: true,
                message: '参数未配置，请先配置参数！',
                type: 'error'
              });
              this.$emit('error');
            }
          });
        }
      },
      buildItem(data){
        let _data = {
          "uId": "admin",
          user:this.account,
          status:1,
          pageIndex: 1,
          pageSize: 500
        };
        for (let [key,value] of Object.entries(data.data)) {
          let defaultItem;
          if (key === 'smsChannelId') {
            templeteList(_data).then(data => {
              defaultItem = data.data.map(item=>{
                return {
                  value: item.name,
                  id: item.id.toString(),
                  name: item.name + '【' + item.id + '】'
                }
              });
              this.$set(this.defaultItems,key,defaultItem);
            });
          } else if (key === 'smsTemplateId') {
            smsTemplateList(_data).then(data => {
              defaultItem = data.data.map(item=>{
                return {
                  value: item.templateName,
                  id: item.id.toString(),
                  name: item.templateName + '【' + item.id + '】'
                }
              });
              this.$set(this.defaultItems,key,defaultItem);
            });
          } else if (key === 'batchDescriptionId') {
            descriptionList(_data).then(data => {
              defaultItem = data.data.map(item=>{
                return {
                  value: item.name,
                  id: item.id.toString(),
                  name: item.name + '【' + item.id + '】'
                }
              });
              this.$set(this.defaultItems,key,defaultItem);
            });
          }
          this.itemTemplates.push({
            label: value,
            params: key
          });
        }
      },
      addItem(){
        let newItem = [];
        for(let itemTemplate of this.itemTemplates){
          newItem.push({
            label: itemTemplate.label,
            params: itemTemplate.params,
            value: ''
          });
        }
        this.items.push(newItem);
      },
      handleDelParam(index){
        this.items.splice(index,1);
      },
      executeTask(){
        if(this.timeConf.loopRule !== 'ONETIME' && !this.timeConf.executeTime){
          this.$message({
            showClose: true,
            message: '非单次执行的初次执行时间为必填!',
            type: 'error'
          });
        }else if(this.timeConf.executeTime && this.timeConf.executeTime.getTime() < new Date().getTime()){
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
          _map.set('taskId',this.taskId);
          _map.set('executeDate',this.timeConf.executeTime);
          _map.set('executeTime',this.timeConf.executeTime);

          let desc = '';

          if(this.timeConf.loopRule !== 'ONETIME'){
            let cron = '';
            if(this.timeConf.loopRule === 'HOUR'){
              cron += '0 '
                + this.timeConf.executeTime.getMinutes()
                + ' * * * ?';
              desc = '每小时执行';
            }else if(this.timeConf.loopRule === 'DAY'){
              cron += '0 '
                + this.timeConf.executeTime.getMinutes()
                + ' ' + this.timeConf.executeTime.getHours()
                + ' * * ?';
              desc = '每天执行';
            }else if(this.loopRule === 'WEEK'){
              cron += '0 '
                + this.timeConf.executeTime.getMinutes()
                + ' ' + this.timeConf.executeTime.getHours()
                + ' ? * ' + (this.timeConf.executeTime.getDay() + 1);
              desc = '每周执行';
            }else if(this.timeConf.loopRule === 'MONTH'){
              cron += '0 '
                + this.timeConf.executeTime.getMinutes()
                + ' ' + this.timeConf.executeTime.getHours()
                + ' ' +this.timeConf.executeTime.getDate()
                + ' * ?';
              desc = '每月执行';
            }
            _map.set('executeCron',cron);
          }else{
            desc = '单次执行';
          }

          _map.set('executeDesc',desc);

          _map.set('executeParamArr',[{}]);
          if(this.items.length > 0){
            let paraArr = [];
            this.items.forEach(
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
          }

          let _data=this.strMapToObj(_map);

          updateBatch(this.batchId,_data).then(data=>{
            if(data.code===1){
              this.$emit('done');
            }
          });
        }
      },
      strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
          obj[k] = v;
        }
        return obj;
      }
    }
  }
</script>
