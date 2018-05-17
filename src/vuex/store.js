/**
 * Created by szatpig on 2017/9/26.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/api'
import user from './modules/user'
import menu from './modules/menu'
import title from './modules/title'
import socket from './modules/socket'
import search from './modules/search'

Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    api,user,menu,title,socket,search
  }
})
