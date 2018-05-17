/**
 * Created by szatpig on 2017/11/6.
 */

import { fetch } from './../util/api'
import api from './api-config'


//*************************资源列表*************************//
// 资源列表
export const resourceList= (data)=> fetch(api.user + '/dsp/privilege/resource/list',{
  'params': data ,
  'type':'get'
});

// 创建资源信息
export const resourceSave= (data)=> fetch(api.user + '/dsp/privilege/resource/save',{
  data
});

// 创建资源信息
export const resourceDelete= (data)=> fetch(api.user + '/dsp/privilege/resource/delete',{
  'params':data ,
  'type':'get'
});


//*************************权限列表*************************//
// 权限列表信息
export const privilegeList= (data)=> fetch(api.user + '/dsp/privilege/list',{
  'params': data ,
  'type':'get'
});

// 创建权限信息
export const privilegeSave= (data)=> fetch(api.user + '/dsp/privilege/save',{
  data
});

// 删除权限
export const privilegeDelete= (data)=> fetch(api.user + '/dsp/privilege/delete',{
  'params': data ,
  'type':'get'
});

// 权限列表信息
export const privilegeInfor= (data)=> fetch( api.user + '/dsp/privilege/information',{
  'params': data ,
  'type':'get'
});


//*************************组织列表*************************//
// 组织列表
export const partnerList= (data)=> fetch(api.user + '/dsp/org/listPartners',{
  'params': data ,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

// 组织详情
export const orgInfo= (data)=> fetch(api.user + '/dsp/org/information',{
  'params': data ,
  'type':'get'
});

// 组织列表
export const orgList= (data)=> fetch(api.user + '/dsp/org/list',{
  'params': data ,
  'type':'get'
});

// 存储/编辑组织信息
export const orgSave= (data)=> fetch(api.user + '/dsp/org/save',{
  data
});

// 组织状态修改
export const orgModifyStatus= (data)=> fetch( api.user + '/dsp/org/modify/status',{
  'params': data ,
  'type':'get'
});


//*************************角色列表*************************//
// 角色列表
export const roleList= (data)=> fetch(api.user + '/dsp/role/list',{
  'params': data ,
  'type':'get'
});

// 存储/编辑角色信息
export const roleSave= (data)=> fetch(api.user + '/dsp/role/save',{
  data
});

// 角色状态修改
export const roleModifyStatus= (data)=> fetch( api.user + '/dsp/role/modify/status',{
  'params': data ,
  'type':'get'
});

// 角色列表
export const roleInformation= (data)=> fetch(api.user + '/dsp/role/information',{
  'params': data ,
  'type':'get'
});


//*************************用户接口*************************//
// 用户列表
export const userList= (data)=> fetch(api.user + '/dsp/user/list',{
  'params': data ,
  'type':'get'
});

// 选择用户R
export const choseRole= (data)=> fetch(api.user + '/dsp/login/chose/role',{
  data
});

// 存储/编辑用户信息
export const userSave= (data)=> fetch(api.user + '/dsp/user/save',{
  data
});

// 用户状态修改
export const userModifyStatus= (data)=> fetch( api.user + '/dsp/user/modify/status',{
  'params': data ,
  'type':'get'
});

// 用户基本信息
export const userInformation= (data)=> fetch(api.user + '/dsp/user/information',{
  'params': data ,
  'type':'get'
});

//修改账号密码
export const userPassword= (data)=> fetch(api.user + '/dsp/user/modify/passwd',{
  data
});



//*************************回调管理*************************//

// 增加修改
export const classAddOrModify= (data)=> fetch(api.sms+'/notify/class/addOrModify',{
  data ,
  'type':'post'
});

// 删除
export const classDelete= (data)=> fetch(api.sms+'/notify/class/delete',{
  data,
  'type':'post'
});

// 取单个数据
export const classGet= (data)=> fetch(api.sms+'/notify/class/get',{
  'params': data ,
  'type':'post'
});

// 列表
export const classList= (data)=> fetch(api.sms+'/notify/class/list',{
  data ,
  'type':'post'
});


//*************************ip管理*************************//


// 增加修改
export const ipSave= (data)=> fetch(api.stati+'/dsp/ip/save',{
  data ,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
// 删除
export const ipDelete= (data)=> fetch(api.stati+'/dsp/ip/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

// 激活
export const ipRevoke= (data)=> fetch(api.stati+'/dsp/ip/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

// 取单个数据
export const ipGet= (data)=> fetch(api.stati+'/dsp/ip/get',{
  'params': data ,
  'type':'post'
});

// 列表
export const ipList= (data)=> fetch(api.stati+'/dsp/ip/list',{
  data ,
  'type':'post'
});

//excel文件上传
export const uploadExcel= (data)=> fetch(api.stati+'/dsp/ip/upload/excel',{
  data,
  headers: {
    'Content-Type': 'multipart/form-data; charset=UTF-8'
  },
  timeout:60000
});


//*************************业务管理*************************//


// 增加修改
export const processSave= (data)=> fetch(api.stati+'/dsp/process/save',{
  data ,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
// 删除
export const processDelete= (data)=> fetch(api.stati+'/dsp/process/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

// 激活
export const processRevoke= (data)=> fetch(api.stati+'/dsp/process/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

// 取单个数据
export const processGet= (data)=> fetch(api.stati+'/dsp/process/get',{
   data ,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

// 列表
export const processList= (data)=> fetch(api.stati+'/dsp/process/list',{
  data ,
  'type':'post'
});

//*************************任务分配*************************//
export const allocateTask = (data) => fetch(api.data + '/dspTask/task/allocate',{
  data
});

//*************************数据源分配*************************//
export const allocateCatalog = (data) => fetch(api.data + '/datasource/catalog/allocate',{
  data
});

