
import { fetch } from '../../util/api'
import api from '../api-config'

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
