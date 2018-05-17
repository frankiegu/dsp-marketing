<template>
  <el-form :model="batchParam"  ref="batchParam" class="param-item-form">
    <div v-for="(items, itemsIndex) in batchParam.items" :key="itemsIndex" class="item-container" :style="itemsIndex % 3 === 0 ? '300px':'210px'">
      <el-form-item style="text-align: center;margin-bottom: 5px;" :style="itemsIndex % 3 === 0 ? 'margin-left: 50px;' : 'margin-left: 5px;'">
        <span>任务{{itemsIndex+1}}</span>
      </el-form-item>
      <el-form-item :label="itemsIndex % 3 === 0 ? item.label:null" :key="index" :label-width="itemsIndex % 3 === 0 ? '100px':'10px'" v-for=" (item, index)  in  items">
        <template>
          <el-input class="item" type="text" v-model="item.value" auto-complete="off" :placeholder="'请输入' + item.label" disabled/>
        </template>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
  import { executeTaskParams } from '@/api/marketingManage/marketTask-api';

  export default {
    name: "showBatch",
    props:{
      row:{
        type: Object,
        required:true
      },
    },
    data(){
      return {
        batchParam:{
          batchId:null,
          items:[],
          paramData:null
        }
      };
    },
    created(){
      this.initBatchParam();
    },
    watch:{
      row:function () {
        this.initBatchParam();
      }
    },
    methods:{
      initBatchParam(){
        this.batchParam.batchId = this.row.id;
        this.batchParam.items = [];

        executeTaskParams({},this.row.taskId).then(data =>{
          this.batchParam.paramData = data.data;
          this.buildItem();
        });
      },
      buildItem(){
        if(this.row.executeParams.length > 0){
          this.row.executeParams.forEach(param => {
            let newItem = [];
            if(Object.keys(this.batchParam.paramData).length){
              for (let [key, value] of Object.entries(this.batchParam.paramData)) {
                newItem.push({
                  label:value,
                  params:key,
                  value: param[key] ? param[key]: ''
                });
              }
            }
            this.batchParam.items.push(newItem);
          });
        }
      }
    }
  }
</script>
