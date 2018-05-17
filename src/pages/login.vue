<template>
    <div class="login-container">
      <div class="login-from">
        <p class="login-system-name" v-text="sysTitle"></p>
        <el-form :label-position="labelPosition"  label-width="80px" :model="userForm">
          <el-form-item label="">
            <i class="my-account">&#xe634;</i>
            <el-input  v-model="userForm.userName" placeholder="请输入用户名" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="">
            <i class="my-password">&#xe606;</i>
            <el-input type="password" :maxlength="16" v-model="userForm.userPassword" placeholder="请输入密码" @keyup.native.enter="Login"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Login"  @keyup.enter="Login">登录</el-button>
            <!--<el-button type="primary" @click="mock">验证码</el-button>-->
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import { userLogin } from '@/api/login/login-api'
  import{ mapActions } from 'vuex'
  export default {
    data () {
      return {
        sysTitle:'精准营销平台',
        labelPosition: 'top',
        userForm:{
          userName:'',
          userPassword:''
        }
      }
    },
    components: {},
    methods: {
      ...mapActions([
        'userInfo',
        'userToken',
        'userLoginOut'
      ]),
      Login(){
        if(!(this.userForm.userName&&this.userForm.userPassword)){
          this.$message({
            showClose: true,
            message: '用户名或密码不能空哟 >_<',
            type: 'error'
          });
          return false;
        }
        let _data = {
          account: this.userForm.userName,
          passwd: this.userForm.userPassword
        };

        userLogin(_data).then((data)=>{
          this.userInfo(data.data);
          this.userToken(data.data.token);
          if(data.code===1){
              console.log(this.$route);
            if(this.$route.query.redirect && !this.$route.query.redirect.startsWith('/login')){
              this.$router.push({ path: this.$route.query.redirect});
            }else{
              this.$router.push({ path:'home/index'});
            }
            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            });
          }
        })
      }
    },
    computed: {},
    created() {
      this.userInfo({});
      this.userToken(null);
      sessionStorage.clear();
    }
  }
</script>
