/**
 * Created by szatpig on 2017/10/11.
 */
import * as _ from '@/util/util'
import { MENU_COLLAPSE } from '../types';

const state={
  isCollapse:false
};

const getters={

};

const mutations={
  [MENU_COLLAPSE](state){
    state.isCollapse=!state.isCollapse;
  }
};

const actions={
  //菜单伸缩
  menuCollapse({ commit }) {
    commit(MENU_COLLAPSE);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}




