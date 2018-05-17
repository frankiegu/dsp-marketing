<template>
    <div class="params-container">
      <div class="params-list" v-show="paramsDataList.arr">
        <p class="params-title"><span>key名</span><span>key值</span><i class="el-icon-close"></i></p>
        <p class="params-cell"  v-for="(item,index) in paramsDataList.arr">
          <span>{{item.paramName}}</span>
          <span>
            <template v-if="item.paramType!=2">
               <template v-if="item.paramName=='smsChannelId'">
                  <el-autocomplete
                    v-model="item.value"
                    :fetch-suggestions="smsChannelSearch"
                    :props="propObj"
                    :placeholder="'请输入'+ item.displayName +'值'"
                    @select="handleSelect(true)"
                  ></el-autocomplete>
                </template>

               <template v-else-if="item.paramName=='smsTempleteId'">
                  <el-autocomplete
                      v-model="item.value"
                      :props="propObj"
                      :fetch-suggestions="smsTempleteSearch"
                      :placeholder="'请输入'+ item.displayName +'值'"
                      @select="handleSelect(true)"
                  ></el-autocomplete>
               </template>

                <template v-else-if="item.paramName=='batchDescriptionId'">
                  <el-autocomplete
                    v-model="item.value"
                    :props="propObj"
                    :fetch-suggestions="smsDescriptionSearch"
                    :placeholder="'请输入'+ item.displayName +'值'"
                    @select="handleSelect(true)"
                  ></el-autocomplete>
               </template>

               <template v-else>
                  <el-input
                     class="label"
                     @blur="saveParams(paramsDataList.arr,$event)"
                     v-model="item.value"
                     :placeholder="'请输入'+ item.displayName +'值'"
                  ></el-input>
               </template>
            </template>
            <template v-else>
                <ry-auto-complete
                    v-model="item.value"
                    :flag="true"
                    :fetch-suggestions="querySearchAsync"
                    :placeholder="'请输入'+ item.displayName +'值'"
                    @select="handleSelect(true)"
                ></ry-auto-complete>
            </template>
          </span>
        </p>
      </div>
    </div>
</template>

<script>
    import RyAutoComplete from  '@/components/autocomplete'
    import { templeteList } from '@/api/smsManagement/smsPassageway-api';
    import { descriptionList } from '@/api/smsManagement/smsChannel-api';
    import { templeteList as smsTemplateList }  from '@/api/smsManagement/smsTemplate-api';
    import { mapState } from  'vuex'
    export default {
        name: 'params',
        props:{
          dialogShowFlag:Boolean,
          paramsList:Object,
          conditionList:Object
        },
        data(){
            return {
              paramsDataList:'',
              conList:[],
              smsChannelList:[],
              smsTempleteList:[],
              smsDescriptionList:[],
              propObj:{
                label: 'name',
                value: 'id'
              }
            }
        },
        components: {
          RyAutoComplete
        },
        methods: {
          saveParams(arr,event){
             if (event) event.preventDefault();
             //this.$emit('saveParam',arr);
          },
          querySearchAsync(qstr, cb) {
            var _conList = [].concat.apply([],Object.values(this.conditionList));
            var queryString;
            let qsArr=[];
            if(qstr){
              let sign=qstr.match(/[\s+]/g) || [];
              if(sign.length){
                qsArr= qstr.split(sign[sign.length-1]) || [];
                queryString=qsArr[qsArr.length-1];
              }else {
                queryString=qstr;
              }
            }else{
              queryString=qstr;
            }
            var results = queryString ? _conList.filter(this.createStateFilter(queryString)) : _conList;
            cb(results);
          },
          createStateFilter(queryString) {
              return (state) => {
                  return (state.label.indexOf(queryString.toLowerCase()) >= 0);
              };
          },
          handleSelect(item) {
            console.log(item);
          },

          smsChannelSearch(queryString, cb) {
            var restaurants = this.smsChannelList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          smsTempleteSearch(queryString, cb) {
            var restaurants = this.smsTempleteList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          //调用短信渠道列表
          smsDescriptionSearch(queryString, cb) {
            var restaurants = this.smsDescriptionList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.name.indexOf(queryString.toLowerCase()) === 0);
            };
          }

        },
        watch: {
        },
       computed: {
         ...mapState({
           account:state=>state.user.userInfo.account
         })
       },
        mounted(){
            this.paramsDataList = this.paramsList;
            this.conList= [].concat.apply([],Object.values(this.conditionList));
        },
        created() {
          let _data = {
            "uId": "admin",
            user:this.account,
            status:1,
            pageIndex: 1,
            pageSize: 500
          };
          let _self=this;
          templeteList(_data).then(function (data) {
            _self.smsChannelList = data.data.map(item=>{
              return {
                value:item.name,
                id:item.id.toString(),
                name:item.name + '【' + item.id + '】'
              }
            });
          });
          smsTemplateList(_data).then(function (data) {
            _self.smsTempleteList = data.data.map(item=>{
              return {
                value:item.templateName,
                id:item.id.toString(),
                name:item.templateName + '【 id:' + item.id + '】'
              }
            })
          });
          descriptionList(_data).then(function (data) {
            _self.smsDescriptionList = data.data.map(item=>{
              return {
                value:item.name,
                id:item.id.toString(),
                name:item.name + '【 id:' + item.id + '】'
              }
            })
          });
        }
    }
</script>

<style lang="scss">
   .market-task-container .el-dialog__body{
     padding-top: 12px;
   }
   .params-container{
     .params-cell{
       display: flex;
       display: -webkit-flex;
       flex-flow: row nowrap;
       -webkit-flex-flow: row nowrap;
       line-height: 45px;
       position: relative;
       span{
         flex:2;
         -webkit-flex: 2;
         color: #555;
         padding-left: 8px;
         padding-right: 10px;
         &:nth-of-type(2){
           margin-left: 10px;
           flex:5;
           -webkit-flex: 5;
           padding-left: 0px;
         }
       }
     }
     .params-title{
       @extend .params-cell;
       .el-icon-close{
         color: #f0f0f0;
         cursor: default;
       }
       background: #f0f0f0;
       margin-bottom: 5px;
       span{
         background: #f0f0f0;
       }
     }
     .params-input{
       display: flex;
       display: -webkit-flex;
       flex-flow: row nowrap;
       -webkit-flex-flow: row nowrap;
       line-height: 35px;
       margin-top: 10px;
       .el-input{
         flex:3;
         -webkit-flex: 3;
         color: #555;
         &:nth-of-type(2){
           margin-left: 10px;
           flex:5;
           -webkit-flex: 5
         }
       }
       .el-icon-check{
         flex:1;
         -webkit-flex: 1;
         color:#13CE66 ;
         font-size: 12px;
         text-align: center;
         line-height: 35px;
         cursor: pointer;
       }
     }
   }
</style>
