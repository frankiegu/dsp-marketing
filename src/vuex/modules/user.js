/**
 * Created by szatpig on 2017/10/9.
 */
import * as _ from '@/util/util'
import { choseRole } from '@/api/system-api'
import { USER_INFO, USER_TOKEN, USER_LOGIN_OUT, USER_ROLE_LIST, SELECTED_ROLE, CHANGE_DIALOG_FLAG , SAVE_SMS_S} from '../types';

const state={
    userInfo:JSON.parse(sessionStorage.getItem('userInfo')) || {},
    userToken:sessionStorage.getItem('userToken') || null,
    userAvatar:'',
    roleFlag:false,
    onceTime:1,
    roleList:{},
    selectedRole:{},
    smsStatisticsData:{}
};

const getters={

};


const mutations={
  [USER_INFO](state,res){
    state.userInfo=res;
    state.userAvatar=res.avatar;
  },
  [USER_TOKEN](state,token){
    state.userToken=token;
  },
  [USER_LOGIN_OUT](state){
    state.userToken=null;
    state.userInfo=[];
  },

  [USER_ROLE_LIST](state,roleList){
    state.onceTime = sessionStorage.getItem('onceTime') || state.onceTime;
    if( roleList.length > 1 && state.onceTime != '0' ){
      state.roleFlag=true;
    }else{
      state.roleFlag=false;
    }
    state.roleList = roleList;
    //this.$router.push({ path:'home/index'});
  },
  [SELECTED_ROLE](state,item){
    if(item.type === 'active'){
      sessionStorage.setItem('selectedRole', '');
    }
    state.selectedRole = sessionStorage.getItem('selectedRole') ? JSON.parse(sessionStorage.getItem('selectedRole')) : item.menu ;
    sessionStorage.setItem('selectedRole', JSON.stringify(state.selectedRole));
    state.roleFlag=false;

    choseRole({account:state.userInfo.account,roleId:state.selectedRole.id}).then(data =>{
      this.commit(USER_INFO,data.data);
    });

  },
  [CHANGE_DIALOG_FLAG](state,item){
    state.roleFlag = item.flag;
    if(!item.flag && item.time == 0){
      state.onceTime=false;
      sessionStorage.setItem('onceTime',0);
    }
  },
  [SAVE_SMS_S](state,item){
    state.smsStatisticsData = item;
    sessionStorage.setItem('smsStatisticsData',JSON.stringify(item));
  }
};

const actions={
  //保存用户信息
  userInfo({ commit }, res) {
    sessionStorage.setItem('userInfo',JSON.stringify(res));
    commit(USER_INFO, res);
  },
  //保存用户token
  userToken({ commit }, token) {
    //_.setCookie('userToken',token);
    sessionStorage.setItem('userToken',token);
    commit(USER_TOKEN,token)
  },
  //用户退出
  userLoginOut({commit}){
    //_.setCookie('userToken',null);
    sessionStorage.setItem('userToken',null);
    sessionStorage.setItem('userInfo',{});
    sessionStorage.setItem('selectedRole','')
    commit(USER_LOGIN_OUT)
  },
  //合并角色
  userRoleList({commit},roleList){
    commit(USER_ROLE_LIST,roleList)
  },
  //选择角色
  selectRole({commit},item){
    commit(SELECTED_ROLE,item)
  },
  //控制显示/隐藏
  changeDialog({commit},flag){
    commit(CHANGE_DIALOG_FLAG,flag)
  },
  setSmsStatisticsData({commit},item){
    commit(SAVE_SMS_S,item)
  }
};



export default {
  state,
  getters,
  mutations,
  actions
}


