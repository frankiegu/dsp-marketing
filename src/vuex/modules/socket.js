/**
 * Created by szatpig on 2017/12/26.
 */
import { showNotification } from '@/util/util'
import img from '@/assets/logo2.png'
import mp3 from '@/assets/mp3/tmp.mp3'

const state ={
  connect: false,
  message: null
};

const getters={

};

const mutations={
  SOCKET_CONNECT(state,  status )  {
    console.log('socket connected');
    showNotification("尊敬的 "+JSON.parse(sessionStorage.getItem("userInfo")).name,"欢迎登陆精准营销平台" ,img,mp3);
    state.connect = true;
  },
  SOCKET_RESPONSE(state,  message) {
    state.message = message;
  },
  SOCKET_DISCONNECT(state){
    state.connect = false;
    console.log('socket disconnected');
  },
  SOCKET_RECONNECT_ATTEMPT(state){//失败了，进行重连中...
    //state.connect = false;
    console.log('socket reconnect_attempt');
  },
  SOCKET_RECONNECT(state){ //成功重连中
    //state.connect = false;
    console.log('socket reconnect');
  }
};

const actions={
  socket_response ({commit}, message) {
    commit('SOCKET_RESPONSE', message);
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
