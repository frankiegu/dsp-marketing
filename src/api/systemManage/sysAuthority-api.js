/**
 * Created by szatpig on 2017/11/6.
 */
import { fetch } from '../../util/api'
import api from '../api-config'

// 权限列表信息
export const privilegeList= (data)=> fetch(api.user+'/dsp/privilege/list',{
  'params': data ,
  'type':'get'
});

// 创建权限信息
export const privilegeSave= (data)=> fetch(api.user+'/dsp/privilege/save',{
  data
});

// 删除权限
export const privilegeDelete= (data)=> fetch(api.user+'/dsp/privilege/delete',{
  'params': data ,
  'type':'get'
});

// 权限列表信息
export const privilegeInfor= (data)=> fetch(api.user+'/dsp/privilege/information',{
  'params': data ,
  'type':'get'
});
