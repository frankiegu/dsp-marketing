<template>
    <div class="header-container">
      <el-row>
        <el-col :xs="24" :sm="4" :md="4" :lg="4"><div class="header-logo" v-text="sysTitle"></div></el-col>
        <el-col :xs="0" :sm="20" :md="20" :lg="20">
          <div class="header-info pull-right">
<!--            <div class="img-area pull-left">
              <img class="logo-img" alt="" :src="userAvatar">
            </div>-->
            <i class="icon-loginout pull-right" @click="loginOut">&#xe63a;</i>
<!--            <el-dropdown class="pull-right">
              <span class="el-dropdown-link">
                <el-badge is-dot class="item">通知</el-badge>
              </span>
              <el-dropdown-menu slot="dropdown" class="message-info-container">
                <el-dropdown-item> 还没有任何通知哟... </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
            <div class="information-show pull-right">
              <span @click.stop="closeDialog({ flag:true,time:1 })">{{userName }}<i>【{{ roleName }}】</i></span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-dialog
        title="选择角色"
        :visible="roleFlag"
        :close-on-click-modal="false"
        :before-close="closeModal"
        size="tiny"
        custom-class="role-dialog">
        <div class="role-dialog-container">
          <div class="role-list">
            <div class="role-cells" :key="item.id" v-for="item in roleList" @click="selectRoleList(item)">
              <span><img src="../../assets/role_01.png" /></span>
              <i>{{item.roleName}}</i>
            </div>
          </div>
          <p class="role-tips-button" @click="closeDialog({flag:false,time:0})">不再自动提示选择角色</p>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { mapState ,mapActions } from 'vuex'
    export default {
        name: 'head',
        data () {
          return {
            sysTitle:'精准营销平台',
            roleDialog:{
                flag:true,
                imgArr:[
                    './assets/role_01.png',
                    './assets/role_02.png',
                    './assets/role_03.png'
                ]
            }
          }
        },
        methods: {
          ...mapActions([
             'userLoginOut',
             'changeDialog',
             'selectRole'
          ]),
          loginOut(){
            this.$confirm('确定要退出吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '退出成功'
              });
              this.$socket.disconnect();
              this.userLoginOut();
              this.$router.push({path:'/login'});
            }).catch(() => {});
          },
          selectRoleList(items){
            if(this.roleFlag){
               this.selectRole( { menu:items,type:'active' });
               this.$router.push({ path:'/home/index'});
            }
          },
          closeDialog(flag){
              this.changeDialog(flag);
          },
          closeModal(){
            this.changeDialog({flag:false,time:1});
          }
        },
        computed: {
          ...mapState({
            userName:state => state.user.userInfo.name,
            userAvatar:state => state.user.userInfo.avatar,
            roleList:state => state.user.roleList,
            roleFlag:state => state.user.roleFlag,
            roleName:state => state.user.selectedRole.roleName
          })
        },
        mounted (){

        },
        created() {

        }
    }
</script>
