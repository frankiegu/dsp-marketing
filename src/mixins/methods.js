/**
 * Created by szatpig on 2018/1/16.
 */
export default {
  methods: {
    handleSocketMessage(data){
      this.$message.closeAll();
      if(data.code == 1){
        if(data.type == 'DATASOURCE_RESULT'){
          if(data.data.code == 1){
            this.$message({
              showClose: true,
              message: this.$createElement('p',null, [
                '【' + data.data.data.dspTask.taskName + '】任务执行成功',
                this.$createElement('a', {
                  attrs:{
                    href:'#/home/marketbatch'
                  },
                  class:'common-link'
                }, '去查看'),
                this.$createElement('a', {
                  attrs:{
                    href:'#/home/smscheck'
                  },
                  class:'common-link'
                }, '去审核')
              ]),
              duration:0,
              type: 'success'
            });
          }else {
            this.$message({
              showClose: true,
              message: data.data.msg ,
              type: 'error'
            });
          }
        }
        else if(data.type == 'HIVE_UPLOAD'){
          if(data.data.code == 1){
            this.$message({
              showClose: true,
              message: this.$createElement('p',null, [
                '【' + data.data.data.DSName + '】任务执行成功',
                this.$createElement('a', {
                  attrs:{
                    href:'#/home/datacatalog/' + data.data.data.parentSourceId + '/'+ data.data.data.hiveName
                  },
                  class:'common-link'
                }, '去查看'),
                this.$createElement('a', {
                  attrs:{
                    href:'#/home/markettask/0/taskdetail'
                  },
                  class:'common-link'
                }, '去营销')
              ]),
              duration:5000,
              type: 'success'
            });
          }else {
            this.$message({
              showClose: true,
              message: data.data.msg ,
              type: 'error'
            });
          }
        }
        else if(data.type == 'DATASOURCE_BATCH'){
          this.$message({
            showClose: true,
            message: this.$createElement('p',null, [
              '【' + data.data.taskManageDto.taskName + '】任务执行完成',
              this.$createElement('a', {
                attrs:{
                  href:'#/home/marketbatch'
                },
                class:'common-link'
              }, '去查看'),
              this.$createElement('a', {
                attrs:{
                  href:'#/home/smscheck'
                },
                class:'common-link'
              }, '去审核')
            ]),
            duration:5000,
            type: 'success'
          });
        }
      }else{
        this.$nextTick(()=>{
          this.$message({
            showClose: true,
            message: data.message,
            type: 'error'
          });
        })
      }
    },
    getCityDataWithoutXian(res){
      let a = {
        id:0,
        name:'全国',
        child:[]
      };
      a.child.push({id:0,name:'全部',child:[{id:0,name:'全部'}]});
      for(let i=0 ; i<res.data.length ; i++){
        let b = [];
        if(res.data[i].child){
          for(let j=0 ; j<res.data[i].child.length ; j++){

            if(!j){
              b.push({id:res.data[i].id,name:'全部'})
            }
            b.push({id:res.data[i].child[j].id,name:res.data[i].child[j].name});


          }
        }
        a.child.push({id:res.data[i].id,name:res.data[i].name,child:b})

      }
      return [a]
    }
  }
}
