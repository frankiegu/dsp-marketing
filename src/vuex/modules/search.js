/**
 * Created by szatpig on 2018/2/28.
 */

import * as _ from '@/util/util'
import { SAVE_CONDITION } from '../types';

const state ={
  page:{
    pageSize:10,
    total:100,
    pageIndex: 1
  },
  key:'',
  type:'NORMAL',
  routeUrl:''
};

const getters = {};

const mutations = {
  [SAVE_CONDITION](state,res){
    state.page = res.page;
    state.key = res.key;
    state.type = res.type;
    state.routeUrl = res.url
  }
};

const actions ={
   saveCondition({commit},res){
     commit(SAVE_CONDITION,res)
   }
};

export default {
  state,
  getters,
  mutations,
  actions
}
