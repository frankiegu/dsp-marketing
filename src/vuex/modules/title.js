/**
 * Created by szatpig on 2017/11/17.
 */

import { CHANGE_TITLE } from './../types' ;

const state ={
  titleObj:{
    mainMenu:'主页'
  }
};

const getters={

};

const mutations={
  [CHANGE_TITLE](state,res){
    state.titleObj=res;
  }
};

const actions={
  changeTitle({commit},res){
    commit(CHANGE_TITLE,res)
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
