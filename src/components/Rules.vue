<template>
    <div class="rules-container">
      <div class="rules-left">
        <div class="rules-data">
            <el-button :disabled="buttonDisabled"  v-for="( item , index) in dataArray" :key="item.id">{{ item.name }} <i v-show="!buttonDisabled" @click="add(item)" class="el-icon-plus el-icon--right"></i></el-button>
        </div>
        <div class="rules-contact">
            <el-button :disabled="buttonDisabled" v-for="( item , index) in contactArray" :key="item.id">{{ item.name }} <i v-show="!buttonDisabled" @click="addContact(item)" class="el-icon-plus el-icon--right"></i></el-button>
        </div>
        <div class="rules-event">
            <el-button v-for="( item , index) in eventArray" :key="item.id">{{ item.name }} <i @click="addEvent(item)" class="el-icon-plus el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="rules-right">
        <div class="rules-box">
          <div class="rules-cells" :class="{}" :id="'cell-'+item.id" v-for="( item , index) in rulesArray">
            <p class="rules-arrow" v-show="item.child[0].type=='event'">&#xe603;</p>
            <el-button :key="ele.id"  v-for="( ele , _index) in item.child">{{ ele.name }} <em class="text-red" v-show="item.paramas">< 参数:{{ item.paramas }} ></em> <i v-show="showCancle(ele,index,ele.type)" @click="remove(ele,_index,ele.type)" class="el-icon-close el-icon--right"></i></el-button>
            <p class="rules-para"></p>
            <p class="rules-arrow" v-show="item.child[0].type=='contact'">&#xe603;</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'rules',
        data () {
          return {
            dataArray:[{
              id:1,
              name:'远程数据源',
              type:'data',
              child:[{
                id:11,
                name:"用户库",
                pid:1
              },{
                id:12,
                name:"黑名单",
                pid:1,
              },{
                id:13,
                name:"知识库",
                pid:1
              }]
            },{
              id:2,
              name:'本地数据源',
              type:'data',
              child:[{
                id:21,
                name:"本地用户库"
              },{
                id:22,
                name:"本地黑名单"
              },{
                id:23,
                name:"本地归属地"
              }]
            }],
            contactArray:[
              {id:1,name:"连接",sortFlag:true,type:'contact'},
              {id:2,name:"交集",sortFlag:true,type:'contact'},
              {id:3,name:"并集",sortFlag:true,type:'contact'},
              {id:4,name:"差集",sortFlag:true,type:'contact'},
              {id:5,name:"过滤",sortFlag:true,type:'contact'}],
            eventArray:[
              {id:1,name:"持久化",type:'event',exportType:[]},
              {id:2,name:"短信发送",type:'event',exportType:["success","fail"]},
              {id:3,name:"微信发送",type:'event',exportType:["fail","success"]}],
            rulesArray:[],
            tempArray:[],
            tempParams:'',
            buttonDisabled:false
          }
        },
        components: {},
        methods: {
            add(el){
                if(this.rulesArray.length==0){
                  this.tempArray.push(el);
                  this.rulesArray.push({
                    child:this.tempArray,
                    id:'cell-'+ this.rulesArray.length
                  });
                }else{
                  this.tempArray=this.rulesArray[this.rulesArray.length-1].child;
                  if(this.tempArray.includes(el)){
                      this.$message({
                        showClose: true,
                        message: '已经添加了该数据源，不可重复添加',
                        type: 'error'
                      });
                      return false;
                  }
                  this.tempArray.push(el);
                  this.rulesArray[this.rulesArray.length-1].child=this.tempArray
                }
            },
            addContact(el){
                if(this.rulesArray.length>0){
                    if(this.rulesArray[this.rulesArray.length-1].child.length<=1){
                      this.$message({
                        showClose: true,
                        message: '请至少选择两种数据源',
                        type: 'error'
                      });
                      return false;
                    }
                    this.$prompt('请输入参数', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    }).then(({ value }) => {
                      this.tempArray=[];
                      this.tempArray.push(el);
                      this.rulesArray.push({
                        child:this.tempArray,
                        id:'cell-'+ this.rulesArray.length,
                        paramas:value
                      });
                      let temData=[{
                        id:444,
                        name:'tempNewData'+Math.random().toFixed(5)*100000,
                        type:'temp'
                      }];
                      this.rulesArray.push({
                        child:temData,
                        id:'cell-'+ this.rulesArray.length
                      });
                    }).catch(() => {
                      this.tempArray=[];
                      this.tempArray.push(el);
                      this.rulesArray.push({
                        child:this.tempArray,
                        id:'cell-'+ this.rulesArray.length,
                        paramas:''
                      });
                      let temData=[{
                        id:444,
                        name:'tempNewData'+Math.random().toFixed(5)*100000,
                        type:'temp'
                      }];
                      this.rulesArray.push({
                        child:temData,
                        id:'cell-'+ this.rulesArray.length
                      });
                    });

                }else{
                    this.$message({
                      showClose: true,
                      message: '请先选择数据源',
                      type: 'error'
                    });
                }
            },
            remove(_el,index,type){
                if(type=='temp'){
                  this.rulesArray.splice(this.rulesArray.length-2,2);
                }else if(type=='event'){
                  this.rulesArray.splice(this.rulesArray.length-1,1);
                  this.buttonDisabled=false;
                }else{
                   this.rulesArray[this.rulesArray.length-1].child.splice(index,1);
                }
            },
            showCancle(_el,index,type){
              if(index==this.rulesArray.length-1){
                return true;
                if(type=='temp'){
                    return false;
                }
              }
              if(index==this.rulesArray.length-2 && _el.exportType &&  _el.exportType.length>0){
                  return true;
              }
              return false;
            },
            addEvent(_el){
                if(this.rulesArray[this.rulesArray.length-1].child.length==1){
                    this.tempArray=[];
                    this.tempArray.push(_el);
                    this.rulesArray.push({
                      child:this.tempArray,
                      id:'cell-'+ this.rulesArray.length
                    });
                    let eventTemp={
                      child:this.tempArray,
                      id:'cell-'+ this.rulesArray.length
                    };
                    var _self=this;
                    _self.tempArray=[];
                    _el.exportType.forEach((item,_in)=>{
                        _self.tempArray.push({
                          id:"ch-"+ _in,
                          name:item,
                          type:"event",
                          pid:_el.id
                        })
                    });
                    if(_self.tempArray.length>0){
                      this.rulesArray.push({
                        child:this.tempArray,
                        id:'cell-'+ this.rulesArray.length
                      });
                    }

                    this.buttonDisabled=true;
                }else{
                  this.$message({
                    showClose: true,
                    message: '数据源操作只能唯一，请先合并数据源或删除多余数据源',
                    type: 'error'
                  });
                }
                console.log(JSON.stringify(this.rulesArray));
            }
        },
        computed: {
        },
        created() {

        }
    }
</script>

<style lang="scss">
  .rules-container{
    .rules-left{
      float: left;
      height: 550px;
      width:240px;
      border-right: 1px solid #eee;
      div[class^="rules-"]{
        border-bottom: 1px solid #eee;
        padding: 15px;
        &:last-child{
          border-bottom: 0;
        }
      }
      button{
        display: block;
        margin-bottom: 10px;
        margin-left: 0px;
        i{
          font-size: 11px;
        }
      }
    }
    .rules-right{
      width: 100%;
      height: 550px;
      padding: 0px 0px 0px 240px;
      box-sizing: border-box;
      text-align: center;
      .rules-box{
        width:100%;
        height: 100%;
        padding: 20px;
        overflow-y: auto;
      }
      button{
        margin-bottom: 10px;
        margin-left: 0px;
        margin-right: 10px;
        position: relative;
        i{
          font-size: 11px;
        }
        &:hover{
            color: #1f2d3d;
            border-color: #c4c4c4;
        }
      }
    }
  }
</style>
