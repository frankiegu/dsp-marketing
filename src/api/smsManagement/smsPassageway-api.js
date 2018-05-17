import { fetch } from '../../util/api'
import api from './../api-config'

//短信通道列表
export const templeteList= (data)=> fetch(api.sms+'/sms/channel/list',{
  data,
  'type':'post'
});
//新增修改短信通道接口
export const addOrModify= (data)=> fetch(api.sms+'/sms/channel/addOrModify',{
  data,
  'type':'post'
});
//禁用短信通道
export const deleteTemplate= (data)=> fetch(api.sms+'/sms/channel/delete',{
  data,
  'type':'post'
});
//检查短信通道
export const channelCheck= (data)=> fetch(api.assistsms+'/sms/channel/check',{
  data,
  'type':'post'
});
