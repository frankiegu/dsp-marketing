<template>
    <div class="config-container" style="overflow: hidden">
      <el-steps :space="150" :active="active" finish-status="success" style="margin-top: 50px;margin-left:80px;" align-center="true">
        <el-step title="合作方信息"></el-step>
        <el-step title="账户相关配置"></el-step>
        <el-step title="相关关联"></el-step>
        <el-step title="邮箱"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="partnerForm" :rules="rules" ref="partnerForm" style="width:670px;margin-top:20px;">

          <el-form-item label="名称" :label-width="formLabelWidth" prop="name" v-show="active===1">
            <el-input type="text" v-model="partnerForm.name" placeholder="请输入名称"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="mark" v-show="active===1">
            <el-input type="text" v-model="partnerForm.mark" placeholder="请输入备注"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username" v-show="active===2">
            <el-input type="text" v-model="partnerForm.username" placeholder="请输入用户名"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password" v-show="active===2">
            <el-input type="text" v-model="partnerForm.password" placeholder="请输入密码"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname" v-show="active===2">
            <el-input type="text" v-model="partnerForm.nickname" placeholder="请输入昵称"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否合并入资总账户" label-width="180px" prop="nickname" v-show="active===2">
            <el-switch
              v-model="partnerForm.isMain"
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="短信渠道" :label-width="formLabelWidth" prop="smsName" v-show="active===3">
            <el-input type="text" v-model="partnerForm.smsName" placeholder="请输入短信渠道"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="业务编码" :label-width="formLabelWidth" prop="bizNo" v-show="active===3">
            <el-input type="text" v-model="partnerForm.bizNo" placeholder="请输入业务编码"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="统计表名称" :label-width="formLabelWidth" prop="statName" v-show="active===3">
            <el-input type="text" v-model="partnerForm.statName" placeholder="请输入统计表名称"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email" v-show="active===4">
            <el-input type="text" v-model="partnerForm.email" placeholder="请输入邮箱"  auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="el-icon-circle-check" style="color:#13CE66;font-size: 20px;text-align: center;width:670px;margin-top:40px;margin-left:40px;" v-show="active===5">  {{submitStatus}}</div>
        <div slot="footer" class="dialog-footer" style="text-align: right;width:670px;">
          <el-button @click="resetForm('partnerForm')">{{active===5?'返回':'重置'}}</el-button>
          <el-button  @click="next('partnerForm')" v-show="active!==5">下一步</el-button>
        </div>
    </div>
</template>

<script>
  import { partnerEvent } from '@/api/assist-api'
  import { mapState } from "vuex"
  export default {
    name: 'partnerAssist',
    data () {
      return {
        submitStatus:"正在提交。。。",
        active: 1,
        formLabelWidth:"100px",
        partnerForm:{
          name:'',
          mark:'',
          isMain:false,
          username:'',
          passname:'',
          password:'',
          nickname:'',
          smsName:'',
          bizNo:'',
          statName:'',
          email:''
        },
        rules: {
          name: [
            { required: true, message: '请选择名称', trigger: 'blur' }
          ],
          mark: [
            { required: true, message: '请输入备注', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请选择用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '请选择昵称', trigger: 'blur' }
          ],
          smsName: [
            { required: true, message: '请输入短信渠道', trigger: 'blur' }
          ],
          bizNo: [
            { required: true, message: '请输入业务编码', trigger: 'blur' }
          ],
          statName: [
            { required: true, message: '请输入统计表名称', trigger: 'blur' }
          ]
        }
      }
    },
    components: {},
    methods: {
      next(formName) {

        switch (this.active){
          case 1:
              if(!(this.partnerForm.name&&this.partnerForm.mark)){
                this.$message({
                  type:"warning",
                  message:"请输入完整参数！"
                })
              }else{
                this.active++
              }
              break;
          case 2:
            if(!(this.partnerForm.username&&this.partnerForm.password&&this.partnerForm.nickname)){
              this.$message({
                type:"warning",
                message:"请输入完整参数！"
              })
            }else{
              this.active++
            }
            break;
          case 3:
            if(!(this.partnerForm.smsName&&this.partnerForm.bizNo&&this.partnerForm.statName)){
              this.$message({
                type:"warning",
                message:"请输入完整参数！"
              })
            }else{
              this.active++;
            }
            break;
          case 4:
            if(!(this.partnerForm.email)){
              this.$message({
                type:"warning",
                message:"请输入完整参数！"
              })
            }else{
              this.active++;
              this.submitStatus = "正在提交。。。";
              this.handleSubmit(formName)
            }
            break;

        }
        if (this.active> 5) this.active = 0;

      },
      resetForm(formName) {
        this.active = 1;
        this.$refs[formName].resetFields();
      },
      //表单提交模块
      handleSubmit(formName) {
        let _self=this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.partnerForm.orgId = _self.orgId;
            this.partnerForm.isMain = this.partnerForm.isMain?1:0;
            partnerEvent(this.partnerForm).then(data=>{
              _self.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.submitStatus = "提交成功！";

              this.$refs[formName].resetFields();
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

    },
    computed: {
      ...mapState({
        "orgId":state=>state.user.userInfo.orgId
      })
    },
    created() {
    }
  }
</script>

