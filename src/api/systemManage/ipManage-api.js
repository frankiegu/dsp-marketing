
import { fetch } from '../../util/api'
import api from '../api-config'

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
