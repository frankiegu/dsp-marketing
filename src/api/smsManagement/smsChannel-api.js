/**
 * Created by szatpig on 2017/11/16.
 */

import { fetch } from './../../util/api'
import api from './../api-config'

//短信渠道列表
export const descriptionList= (data)=> fetch(api.sms+'/sms/batch/description/list',{
  data,
  'type':'post'
});
//新增修改短信渠道接口
export const descriptionAddOrModify= (data)=> fetch(api.sms+'/sms/batch/description/addOrModify',{
  data,
  'type':'post'
});
//禁用渠道通道
export const descriptionDelete= (data)=> fetch(api.sms+'/sms/batch/description/delete',{
  data,
  'type':'post'
});



