<template>
    <div class="privilege-set-container">
       <div class="set-title">权限初始化配置</div>
       <div class="set-form">
         <el-form :model="privilege.form" label-position="top" :rules="privilege.rules" ref="privilege">
           <el-form-item label="api接口Url" label-width="100px" prop="url">
             <el-input
               v-model="privilege.form.url"
               placeholder="请输入检测api接口Url"
               auto-complete="off"></el-input>
           </el-form-item>
           <div class="formList">
             <p class="formListTitle">
               <span>数据源名</span>
               <span>表空间名</span>
               <span>表/文件名</span>
               <span>表记录名</span>
               <el-button type="default" icon="plus"></el-button>
             </p>
             <div class="formInputList" v-for="(item,index) in  privilege.form.jsonBody">
               <el-form-item
                 label=""
               >
                 <el-input
                   v-model="item.dsname"
                   placeholder="数据源名"
                   auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item
                 label=""
               >
                 <el-input
                   v-model="item.catalog"
                   placeholder="表空间名"
                   auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item
                 label=""
               >
                 <el-input
                   v-model="item.business_id"
                   placeholder="表/文件名"
                   auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item
                 label=""
               >
                 <el-input
                   v-model="item.businessTable"
                   placeholder="表记录名"
                   auto-complete="off"></el-input>
               </el-form-item>
               <el-button type="default" icon="plus" v-show="privilege.form.jsonBody.length == index + 1" @click="addDomain(index)"></el-button>
               <el-button type="default" icon="minus" v-show="privilege.form.jsonBody.length != index + 1 && privilege.form.jsonBody.length > 1" @click.prevent="removeDomain(domain,index)"></el-button>
             </div>
           </div>
         </el-form>
         <div class="set-form-button">
           <el-button type="pink" @click="handleSave('privilege')">提交</el-button>
           <el-button >重置</el-button>
         </div>
       </div>
    </div>
</template>

<script>
    import { privilegeCheckSave,privilegeUpdateStatus } from '@/api/dataPrivilege-api'
    export default {
        name: 'privilegeSet',
        data () {
            return {
              privilege:{
                form:{
                  url:'',
                  jsonBody:[
                    {
                      dsname:'',
                      catalog:'',
                      business_id:'',
                      businessTable:''
                    }
                  ]
                },
                dataTypeList:[
                  {
                    label:'业务库',
                    value:"1"
                  },{
                    label:'hdfs文件',
                    value:"2"
                  },{
                    label:'PG数据',
                    value:"3"
                  }
                ],
                formLabelWidth:'120px',
                rules: {
                  url: [
                    { required: true, pattern: /^[A-Za-z0-9-_%&\?\/.=]+$/,  message: '请输入api接口合法Url', trigger: 'blur' },
                  ]
                }
              }
            }
        },
        components: {},
        methods: {
          handleSave(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                privilegeCheckSave(this.privilege.form).then( data => {
                  this.$message({
                    showClose: true,
                    message: '权限初始配置成功！',
                    type: 'success'
                  });
                  this.$refs[formName].resetFields();
                });
              } else {
                return false;
              }
            });
          },
          removeDomain(item,index) {
            if (index !== -1) {
              this.privilege.form.jsonBody.splice(index, 1)
            }
          },
          addDomain(index) {
            let _flag = true;
            for (let value of  Object.values(this.privilege.form.jsonBody[index])){
               if(!value){
                 _flag = false;
               }
               console.log(value);
            }
            console.log(_flag);
            _flag && this.privilege.form.jsonBody.push({
                dsname:'',
                catalog:'',
                business_id:'',
                businessTable:''
              });
          },
        },
        computed: {},
        created() {

        }
    }
</script>

<style lang="scss">

</style>
