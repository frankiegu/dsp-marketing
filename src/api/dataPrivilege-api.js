/**
 * Created by szatpig on 2018/1/2.
 */

import { fetch } from './../util/api'
import api from './api-config'

// 存储/编辑数据权限
export const privilegeSave= (data)=> fetch(api.privilege + '/dspdataauth/privilege/save',{
  data
});

// 数据权限列表
export const privilegeList= (data)=> fetch(api.privilege + '/dspdataauth/privilege/list',{
  data
});

// 数据给配权限列表
export const allotList= (data)=> fetch(api.privilege + '/dspdataauth/privilege/distribute/list',{
  data
});

// 数据权限检测接口配置
export const privilegeCheckSave= (data)=> fetch(api.privilege + '/dspdataauth/privilege/check/save',{
  data
});

// 数据权限检测接口配置状态修改
export const privilegeUpdateStatus= (data)=> fetch(api.privilege + '/dspdataauth/privilege/check/update/status',{
  data
});

/*
export const privilegeList= (data)=> fetch(api.privilege + '/dspdataauth/privilege/list',{
  'params': data ,
  'type':'get'
});*/
