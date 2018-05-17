<template>
  <div class="assist-task-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="任务审核" name="first">
        <div class="adfs-upload"></div>
      </el-tab-pane>
      <el-tab-pane label="任务发送" name="second">
        <div class="adfs-delete"></div>
      </el-tab-pane>
      <el-tab-pane label="短信审核" name="three">
        <div class="hive-table"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { periodList , periodDelete , periodRevoke  , periodSave ,getAllDay } from '@/api/assist-api'
  export default {
    name: 'assist-task',
    data () {
      return {
        activeName: 'first',
        searchData:{
          type:'',
          status:'',
          period:'',
        },
        addEditDialogForm:{
          type:'',
          period:'',
          beginTimeStr:'',
          endTimeStr:'',
          dayInterval:''
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:[{"type":1,"value":"具体IP"},{"type":2,"value":"范围IP"}],
        dataList:[],
        formLabelWidth:'80px',
        editDialogForm:'',
        dialogFormVisible:false,
        page:{},
        tableData:[],
        ruless: {
          name1:[
            {required: false, message: '请输入ip', trigger: 'blur'}
          ],
          name2:[
            {required: false, message: '请选择类型', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },

      turntype(val){
        this.searchData.type = val;
        this.addEditDialogForm.period = '';

      },
      changeTime(val){
        this.addEditDialogForm.beginTimeStr = val.split(" - ")[0].substring(0,5);
        this.addEditDialogForm.endTimeStr = val.split(" - ")[1].substring(0,5);
        this.addEditDialogForm.period = this.addEditDialogForm.beginTimeStr+'~'+this.addEditDialogForm.endTimeStr;
      },
      submitForm(formName){
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){

              let data = {"id":_self.tableData[_self.Editindex].id,"beginTimeStr":_self.addEditDialogForm.beginTimeStr,"endTimeStr":_self.addEditDialogForm.endTimeStr,"period":_self.addEditDialogForm.period,"type":_self.addEditDialogForm.type,"dayInterval":_self.addEditDialogForm.dayInterval};
              periodSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].dayInterval = _self.addEditDialogForm.dayInterval;
                _self.tableData[_self.Editindex].period = _self.addEditDialogForm.period;
                _self.tableData[_self.Editindex].createTimeStr = res.data.createTimeStr;
                _self.tableData[_self.Editindex].updateTimeStr = res.data.updateTimeStr;
                _self.dialogFormVisible = false;
              })
            }else{
              let data = {"beginTimeStr":_self.addEditDialogForm.beginTimeStr,"endTimeStr":_self.addEditDialogForm.endTimeStr,"period":_self.addEditDialogForm.period,"type":_self.addEditDialogForm.type,"dayInterval":_self.addEditDialogForm.dayInterval};
              periodSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":1,"prePageResult":_self.page.pageSize};
                periodList(data).then(function (res) {
                  _self.loading2 = false;
                  _self.tableData = res.data;
                  _self.page={
                    pageSize: _self.page.pageSize,
                    total: res.total,
                    currentPage: 1
                  }
                });
                _self.dialogFormVisible = false;
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleEdit(name,index,row){
        let _self = this;
        _self.isEdit = true;
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.type = _self.tableData[index].type;
        if(_self.addEditDialogForm.type==1){
          _self.addEditDialogForm.beginTimeStr = '';
          _self.addEditDialogForm.endTimeStr = '';
          _self.addEditDialogForm.period = _self.tableData[index].period;
          _self.addEditDialogForm.dayInterval = _self.tableData[index].dayInterval;
        }else{
          _self.addEditDialogForm.dayInterval = '';
          if(_self.tableData[index].period.indexOf("~")>-1){
            this.value3=[new Date(2018, 1, 10, _self.tableData[index].period.split("~")[0].split(":")[0],  _self.tableData[index].period.split("~")[0].split(":")[1]), new Date(2018, 1, 10,  _self.tableData[index].period.split("~")[1].split(":")[0],  _self.tableData[index].period.split("~")[1].split(":")[1])];
            _self.addEditDialogForm.beginTimeStr = _self.tableData[index].period.split("~")[0].substring(0,5);
            _self.addEditDialogForm.endTimeStr = _self.tableData[index].period.split("~")[1].substring(0,5);
            _self.addEditDialogForm.period = _self.addEditDialogForm.beginTimeStr+'~'+_self.addEditDialogForm.endTimeStr;

          }else{

          }
        }
        console.log(this.value)
        alert(this.value3)
        _self.Editindex = index;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm={
            type:'',
            period:''
          }
        },200)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.period + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            periodDelete(data).then(function(res){
              if (res.success) {
                _self.$message({
                  type: 'success',
                  message: '禁用成功!'
                }) ;
                _self.tableData[index].status = 0
              } else {
                _self.$message({
                  type: 'warning',
                  message: res.msg
                });
              }
            }).catch((res)=>{
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            });
          })

        }else{
          this.$confirm('此操作将激活【' + row.period + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            periodRevoke(data).then(function(res){
              _self.$message({
                type: 'success',
                message: '激活成功!'
              });
            }).catch((res)=>{
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            });
            _self.tableData[index].status = 1

          })
        }

      },
      searchEvent(){
        let _self = this;
        _self.loading2 = true;
        let data = {"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        periodList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: 1
          }
        });
      },
      handleSizeChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        periodList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: val,
            total: res.total,
            currentPage: _self.page.currentPage
          }
        });
      },
      handleCurrentChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        periodList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: val
          }

        });
      },

      editPbtnParam(){
        alert( '添加参数');

      },
      selectParam(){
        alert( '选择参数')
      },
    },
    computed: {
      ...mapState({
        account:state=>state.user.userInfo.account,
        orgCode:state=>state.user.userInfo.orgCode
      })
    },
    created() {
      let _self = this;
      _self.loading2 = true;
      let data = {"type":_self.searchData.type,"period":_self.searchData.period,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      periodList(data).then(function (res) {
        _self.loading2 = false;
        _self.tableData = res.data;
        _self.page={
          pageSize: 10,
          total: res.total,
          currentPage: 1
        }

      });
      getAllDay({orgCode:_self.orgCode}).then((res)=>{
        _self.dataList = res.data;
      })
    }

  }
</script>

<style lang="scss">

</style>
