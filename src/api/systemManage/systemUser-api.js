/**
 * Created by szatpig on 2017/10/11.
 */
import { fetch } from '../../util/api'
import api from './../api-config'

//查询账号基本信息
// _data={"account":13511604618}
export const userInfo= (data)=> fetch(api.user+'/information',{
  data,
  'type':'get'
});

//账号列表信息
// _data={"startTime":""}
export const userList= (data)=> fetch(api.user+'/user/list',{
  data,
  'type':'get'
});

export const orgList= (data)=> fetch(api.user+'/dsp/org/list',{
  data,
  'type':'get'
});
