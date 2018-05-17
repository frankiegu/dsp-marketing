<template>
    <div class="sms-statistics-container">
      <el-row>
        <el-col>
          <div class="search-container">

            <el-select @change="selectBiz" v-model="searchData.orgSelect" width="120" placeholder="请选择组织">
              <el-option
                v-for="(item,key) in orgMapOrgain"
                :key="key"
                :label="item"
                :value="key"
                >
              </el-option>
            </el-select>

            <el-select v-model="searchData.biz" multiple filterable clearable placeholder="请选择业务" style="margin-left:15px;">
              <el-option
                v-for="item in bizList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>

            <el-date-picker
              class="search-key"
              v-model="searchData.time"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              format="yyyy-MM-dd"
              range-separator=" -- "
              style="margin-left:15px;"
              :picker-options="pickerOptions" @change="handleChanges">
            </el-date-picker>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>

          </div>
          <div class="" style="padding:15px;">
            <div id="tableBox" ref="tableBox">
              <div style="width:100%;" class="table-wrap">
                <div class="clearfix titlestyle" :style="tableDetailWidth?'width: auto':'width: '+titleWidth+'px'">
                  <div class="content" :style="'width:100px;height:110px;line-height:110px;font-size: 14px;border-right:1px solid #dfe6ec;'">
                    日期
                  </div>
                  <div v-for="(item,key) in bizMap" class="content">
                    <div style="border-bottom:1px solid #dfe6ec;border-right:1px solid #dfe6ec;font-size: 14px;">{{key}}</div>
                    <div style="" class="clearfix">
                      <div v-for="(item,key1) in item" style="font-size: 14px;" class="content2">
                        <div style="border-bottom:1px solid #dfe6ec;border-right:1px solid #dfe6ec;">{{key1}}</div>
                        <div v-for="item1 in item" style="width:100px;font-size: 14px;border-right:1px solid #dfe6ec;" class="content2">
                          {{item1}}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="content" :style="'width:100px;height:110px;line-height:110px;font-size: 14px;border-right:1px solid #dfe6ec;'">
                    每日小计
                  </div>
                </div>
              </div>
              <div class="tableWrap2" style="">
                <div style="">
                  <div v-for="(item,index) in detailSelect3" :key="item.value" class="bg-purple-dark" :style="tableDetailWidth?'width:auto':'width: '+titleWidth+'px;line-height:40px;text-align: center'">
                    <div class="table-wrap clearfix">
                      <div :class="index===0?'identityId content':'content'" style="border-right:1px solid #ddd;width:100px" v-for="(item,index) in item" :key="index" >
                        <div v-if="index===0" style="width:100px;color:#999;">
                          <div style="width:100px;font-size: 14px;" >{{item}}</div>
                        </div>
                        <div v-else>
                          <el-button type="text" style="color:#999;">{{item.amount?item.amount:'0'}}</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
          <!--<div class="search-page">-->
            <!--<el-pagination-->
              <!--@size-change="handleSizeChange"-->
              <!--@current-change="handleCurrentChange"-->
              <!--:current-page="page.pageIndex"-->
              <!--:page-sizes="[10, 20, 50, 100]"-->
              <!--:page-size="page.pageSize"-->
              <!--layout="total, sizes, prev, pager, next, jumper"-->
              <!--:total="page.total">-->
            <!--</el-pagination>-->
          <!--</div>-->
        </el-col>
      </el-row>
      <el-dialog :title="'预览发送信息< 共'+ preview.num +'条记录 >'"  size="large" :visible.sync="preview.flag">
        <div class="view-container">
          <el-table
            ref="multipleTable"
            :data="preview.tempData"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column type="index" label="发送编号" align="center" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="content" label="发送内容" show-overflow-tooltip> </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-dialog :title="'检查发送信息< 共'+ checkData.num +'条记录 >'"  size="large" :visible.sync="checkData.flag">
        <div class="view-container">
          <el-table
            ref="multipleTable"
            :data="checkData.tempData"
            border
            v-loading="loadingDialog"
            element-loading-text="拼命加载中"
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column prop="mobile" label="手机号码" align="center" show-overflow-tooltip width="120"> </el-table-column>
            <el-table-column prop="content" label="发送内容" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="url" label="发送链接" align="center" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="isopen" label="发送打开情况" align="center" show-overflow-toolti width="120">
              <template slot-scope="scope">
                <el-tag :type="scope.row.isopen==1?'success':'gray'">{{scope.row.isopen==1?'可打开':'不可打开'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="speed" label="连接响应速度 ( 毫秒 )" align="center" show-overflow-tooltip width="200"> </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { mapState ,mapActions} from 'vuex';
  import { smsStatistics, smsResend, smsReview, sendCancel , sendPreview} from '@/api/smsManagement/smsManage-api'
  import { descriptionList } from '@/api/smsManagement/smsChannel-api'

  export default {
    name: 'smsCheck',
    data () {
      return {
        bizList:null,
        bizList666:[],
        orgMapOrgain:{},
        bizMap:null,
        tableDetailWidth:0,
        titleWidth:0,
        detailTableTitleData :[],//单个数据title
        detailSelect3:[],
        loadingDialog:true,
        checkCurId:'',
        searchData:{
          biz:[],
          orgSelect:'全部',
          time:["2018-03-01 00:00:00", "2018-03-06 00:00:00"],
          beginDate:'2018-01-01',
          endDate:'2018-03-02'
        },
        page:{
          pageSize:10,
          total:100,
          pageIndex: 1
        },
        loading:true,
        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        isEdit:false,
        preview:{
          tempData:[],
          num: 0,
          flag:false
        },
        checkData:{
          tempData:[],
          num: 0,
          flag:false
        },
        formLabelWidth: '100px',
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
        }
      }
    },
    methods: {
      ...mapActions([
        'setSmsStatisticsData'
      ]),
      selectBiz(val){
          console.log(val)
        let _self = this;
        _self.searchData.biz.length=0;
        let newArr = [];
        if(val==='all'){
          for(let key in _self.smsStatisticsData){
            newArr = newArr.concat(_self.smsStatisticsData[key])
          }
        }else{
          for(let key in _self.smsStatisticsData){
              if(val===key){
                newArr = _self.smsStatisticsData[key]
              }
          }
        }
        _self.bizList =Array.from( new Set(newArr));

      },
      getNowFormatDate(date) {
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      //计算detail表长度，控制样式
      getTitleWidth(data){
        let lin = 0;
        for(let key in data){
            if(data[key]){
                for(let key1 in data[key]){
                  data[key][key1].forEach((item, index)=>{
                    if(index){
                      lin+=100;
                    }else{
                      lin+=100;
                    }
                  })
                }


            }
        }
        lin +=100;//日期
        lin += 100;//每日小计
        lin += lin/100;//边框
        return lin
      },
      searchEvent(){
          if(this.searchData.beginDate&&this.searchData.endDate){
            this.list((this.searchData.orgSelect=="all"||this.searchData.orgSelect=="全部")?false:this.searchData.orgSelect);
          }else{
              this.$message({
                type:"warning",
                message:"请务必筛选日期！"
              })
          }
      },
      handleChanges(val){
        this.searchData.beginDate = val.split(' -- ')[0];
        this.searchData.endDate = val.split(' -- ')[1];

      },
      //自定义事件
      handleEdit(index, row) {
        this.isEdit=true;
        this.addUser={
          id:row.id ,
          account: row.account,
          name: row.name,
          roles: row.roles.map(item=>item.id),
          mobile: row.mobile,
          email: row.email
        };
        this.dialogFormVisible=true;
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除账户【'+row.account+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _data={
            account:row.account,
            status:6
          };
          userModifyStatus(_data).then(data=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list(this.page.pageSize,1);
          });
        }).catch(() => {
          console.log('删除取消');
        });
      },
      handleChange(row){
        this.dialogPassword = true;
        this.userPassword.account=row.account;
      },

      list(orgSelect){
        console.log('mark',orgSelect)
        let _self  = this;
        let _data={
          admin: orgSelect?false:_self.superAdmin,
          orgCode:orgSelect||_self.orgCode,
          bizStr:_self.searchData.biz.join(','),
          beginDate:_self.searchData.beginDate,
          endDate:_self.searchData.endDate
        };

        smsStatistics(_data).then(data=>{
          _self.bizMapRel = data.data.bizMap;
          _self.loading = false;
          _self.bizMap  =_self.getBizList2(data,orgSelect);


          if(orgSelect===undefined){
            this.setSmsStatisticsData(data.data.bizMap);
            let newArr = [];
            for(let key in _self.smsStatisticsData){
              newArr = newArr.concat(_self.smsStatisticsData[key])
            }
            _self.bizList =Array.from( new Set(newArr));
          }else if(orgSelect===false){
            let newArr = [];
            for(let key in _self.smsStatisticsData){
              newArr = newArr.concat(_self.smsStatisticsData[key])
            }
            _self.bizList =Array.from( new Set(newArr));
          }else{
            let newArr = [];
            for(let key in _self.smsStatisticsData){
              if(orgSelect===key){
                newArr = _self.smsStatisticsData[key]
              }
            }
            _self.bizList =Array.from( new Set(newArr));
          }
          _self.orgMapOrgain.all = "全部";
          Object.assign(_self.orgMapOrgain,data.data.orgMap);
          _self.titleWidth = _self.getTitleWidth(_self.bizMap,orgSelect);
          if(_self.$refs.tableBox){
            _self.tableDetailWidth = _self.getDialogConWidth(_self.titleWidth,_self.$refs.tableBox.offsetWidth,_self.detailTableTitleData.length,orgSelect)
          }
          this.detailSelect3 = _self.initTableData(data,orgSelect)


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
      //得到表data
      initTableData(data,orgcode){
        let values = data.data.values;
        let newData = {};
        for(let key1 in values){
          //key1 日期 values[key1] userItem
          let itemArrr = [];
          for(let key2 in values[key1]){
            itemArrr[0] = key1;
            for(let key3 in values[key1][key2]) {
              //name 业务名称 amount数量 status 状态
              for(let key4 in values[key1][key2][key3]){
                itemArrr.push(values[key1][key2][key3][key4]==null?'0':{amount:values[key1][key2][key3][key4]});
                newData[key1] = itemArrr.concat([{amount:data.data.totalPerDays[key1]}]);

              }

            }
          }
        }
        let lastData = [];
        lastData.push('总计');
        for(let key in  data.data.totalPerBizs){
          for(let key2 in  data.data.totalPerBizs[key]){
            for(let key3 in data.data.totalPerBizs[key][key2]){
              lastData.push({amount:data.data.totalPerBizs[key][key2][key3]})
            }
          }
        }
        lastData.push({amount:data.data.totalPerDays['小计']})
        let newArr666 = [];
        for(let key in newData){
          newArr666.push(newData[key])
        }
        newArr666.reverse();
        newArr666.push(lastData);
        return newArr666
      },
      //取得所有业务，并且保证顺序
      getBizList2(data){

          if(JSON.stringify(data.data.values)!=='{}'){
            let newData = [];
            for(let key in data.data.values){

                newData.push(data.data.values[key]);
            }
            if(newData.length){
              let titleData = {};
              for(let key in newData[0]){
                  titleData[data.data.orgMap[key]] = {};

                for(let  key1 in  newData[0][key]){
                  titleData[data.data.orgMap[key]][key1] = [];
                      for(let key2 in newData[0][key][key1]){
                          switch (key2){
                            case "0":
                              titleData[data.data.orgMap[key]][key1].push("提交失败");
                              break;
                            case "1":
                              titleData[data.data.orgMap[key]][key1].push("提交成功");
                              break;
                            case "2":
                              titleData[data.data.orgMap[key]][key1].push("发送成功");
                              break;
                            case "3":
                              titleData[data.data.orgMap[key]][key1].push("发送失败");
                              break;
                          }
                      }
                  }
              }
              return titleData
            }else{
                return false
            }
          }else{

              return false
          }

      },
      getDialogConWidth(titleWidth,dialogConWidth,ColLength){
        if(titleWidth<dialogConWidth){
          return parseInt((dialogConWidth-300-200-20)/(ColLength-1))
        }
        return 0;
      },
      //得到所有的业务
      getBizList(data){
        let _self = this;
        let bizArr = [];
        for(let key in  data.data.bizMap){
          if(JSON.stringify(data.data.bizMap[key])!=='{}'){
            for(let key2 in data.data.bizMap[key]){
              bizArr.push(data.data.bizMap[key][key2])
            }
          }
        }
        return bizArr.map((item)=>{
          return item
        })
      },
      gettitleData2(data){

        let newBizMap = {};
        for(let key in data.data.bizMap){
          newBizMap[key] = [];

          for(let i = 0; i<data.data.bizMap[key].length;i++){
            newBizMap[key].push(data.data.bizMap[key][i]+"提交失败");
            newBizMap[key].push(data.data.bizMap[key][i]+"提交成功");
            newBizMap[key].push(data.data.bizMap[key][i]+"发送成功");
            newBizMap[key].push(data.data.bizMap[key][i]+"发送失败");
          }

        }
        return newBizMap;
      }


    },
    computed: {
      ...mapState({
        account:state=>state.user.userInfo.account,
        orgCode:state=>state.user.userInfo.orgCode,
        orgId:state=>state.user.userInfo.orgId,
        superAdmin:state=>state.user.userInfo.superAdmin,
        smsStatisticsData:state=>state.user.smsStatisticsData,
      })
    },
    mounted(){
    },
    created() {
      let _self  = this;
      let data2 = {"uId":"admin" , "user":this.account , "pageIndex": 1 ,"pageSize": 100 };
      this.searchData.beginDate = this.getNowFormatDate(new Date(new Date()-24*60*60*1000*10));
      this.searchData.endDate = this.getNowFormatDate(new Date());
      this.searchData.time = [this.searchData.beginDate+' 00:00:00',this.searchData.endDate +' 00:00:00'];
      _self.list();

    }
  }
</script>

<style lang="scss">
  .sms-statistics-container{
    background-color: #fff;
    max-height: 550px;
    overflow-y: auto;
    #tableBox{
      height:380px;
      overflow-y: scroll;
      overflow-x: scroll;
      max-width: 100%;
      background-color: #fff;
      border: 1px solid #dfe6ec;
      font-size: 14px;
      color: #1f2d3d;
      box-sizing: border-box;
      position: relative;
    }
    .table-wrap{
      .content{
        float: left;
        text-align: center;
        line-height:36px;
      }
    }
    .titlestyle{
      background-color: #EEF1F6;
      border-top:1px solid #dfe6ec;
      border-bottom:1px solid #dfe6ec;
      line-height:40px;
      text-align: center;
      color:#666;
      .content{
        /*box-shadow: 0 0 2px #fff;*/
      }
      .content2{
        float: left;
        font-size: 14px;
      }
    }
    .bg-purple-dark{
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      /*&:nth-child(2n+1){*/
        /*background-color: #EEF1F6;*/

      /*}*/
    }
    .dialog{
      .el-dialog__body{
        height:680px;
        .el-carousel{
          height:100%;
          .el-carousel__container{
            height:100%;
            .el-carousel__item{
              height:100%;
            }
          }
        }
      }
    }
    .download-img{
      position:absolute;
      left:25px;
      bottom:50px;
      z-index:9999;
      img{
        width:100%;
        height:100%;
        display:block;

      }
    }

  }
  #tableBox::-webkit-scrollbar{
    width: 12px;
    height: 12px;
  }
  #tableBox::-webkit-scrollbar-thumb {
    border-radius: 12px;
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.6);
  }
  .market-count-container::-webkit-scrollbar{
    width: 6px;
    height: 6px;
  }
  .market-count-container::-webkit-scrollbar-thumb{
    border-radius: 6px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.6);
  }
  .diycolor{
    background-color: #e76b5f;
    border-color: #e76b5f;
  }
</style>
