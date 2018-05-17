import { fetch } from '../../util/api'
import api from './../api-config'

//短信模板列表
export const templeteList= (data)=> fetch(api.sms+'/sms/templete/list',{
  data,
  'type':'post'
});
//新增修改短信模板接口
export const addOrModify= (data)=> fetch(api.sms+'/sms/templete/addOrModify',{
  data,
  'type':'post'
});
  //禁用短信模板
export const deleteTemplate= (data)=> fetch(api.sms+'/sms/templete/delete',{
  data,
  'type':'post'
});
//获取模板参数列表
export const  smsParamsList = (data)=>fetch(api.sms+'/sms/templete/params/list',{
  data,
  'type':'post'
});
//获取添加模板参数
export const  paramsAddOrModify = (data)=>fetch(api.sms+'/sms/templete/params/addOrModify',{
  data,
  'type':'post'
});
//删除添加模板参数
export const  paramsDelete = (data)=>fetch(api.sms+'/sms/templete/params/delete',{
  data,
  'type':'post'
});
