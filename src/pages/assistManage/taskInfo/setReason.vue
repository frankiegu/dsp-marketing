<template>
    <div class="set-reason-container">
      <task-info-nav></task-info-nav>
      <el-row>
        <el-col>
          <div class="reason-list">
            <el-form :model="reason" label-position="top"  ref="reason">
            <div class="formList">
              <p class="formListTitle">
                <span>类型</span>
                <span class="flex-3">描述</span>
                <el-button type="default" icon="plus"></el-button>
              </p>
              <div class="formInputList" v-for="(item,index) in  reason.list">
                <el-form-item
                  label=""
                >
                  <el-input
                    v-model="item.type"
                    placeholder="输入类型"
                    auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item
                  label=""
                  class="flex-3"
                >
                  <el-input
                    v-model="item.des"
                    placeholder="类型描述"
                    auto-complete="off"></el-input>
                </el-form-item>
                <el-button type="default" icon="plus" v-show="reason.list.length == index + 1" @click="addDomain(index)"></el-button>
                <el-button type="default" icon="minus" v-show="reason.list.length != index + 1 && reason.list.length > 1" @click.prevent="removeDomain(domain,index)"></el-button>
              </div>
            </div>
            <div class="set-form-button">
              <el-button type="pink" @click="handleSave()">提交</el-button>
            </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import taskInfoNav from "@/components/taskInfoNav";
  export default {
      name: 'setReason',
      data () {
          return {
            reason:{
              list:[
                {
                  type:'企业信息不全',
                  des:'企业信息填写不完整，请重试'
                }
              ],
            }
          }
      },
      components: {taskInfoNav},
      methods: {
        removeDomain(item,index) {
          if (index !== -1) {
            this.reason.list.splice(index, 1)
          }
        },
        addDomain(index) {
          let _flag = true;
          for (let value of  Object.values(this.reason.list[index])){
            if(!value){
              _flag = false;
            }
          }
          if(!_flag){
            this.$message({
              type: 'error',
              message: '请先完善列信息'
            });
            return false;
          }
          _flag && this.reason.list.push({
            type:'',
            des:''
          });
        },
        handleSave(formName){
          let _flag = true;
          for (let item of  Object.values(this.reason.list)){
            if(!(item.type&&item.des)){
              _flag = false;
            }
          }
          if(!_flag){
            this.$message({
              type: 'error',
              message: '请先完善增列信息'
            });
            return false;
          }
            //privilegeCheckSave(this.privilege.form).then( data => {
              this.$message({
                showClose: true,
                message: '权限初始配置成功！',
                type: 'success'
              });
              //this.$refs[formName].resetFields();
            //});
        }
      },
      computed: {},
      created() {

      }
  }
</script>

<style lang="scss">

</style>
