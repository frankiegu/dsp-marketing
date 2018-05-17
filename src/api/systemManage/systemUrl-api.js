/**
 * Created by szatpig on 2017/10/30.
 */
import { fetch } from '../../util/api'
import api from './../api-config'

// 资源基本信息
// _data={"account":13511604618}
export const resourceList= (data)=> fetch(api.user+'/dsp/privilege/resource/list',{
  'params': data ,
  'type':'get'
});


// 创建资源信息
// _data={"account":13511604618}
export const resourceSave= (data)=> fetch(api.user+'/dsp/privilege/resource/save',{
  data
});


// 创建资源信息
// _data={"account":13511604618}
export const resourceDelete= (data)=> fetch(api.user+'/dsp/privilege/resource/delete',{
  'params':data ,
  'type':'get'
});
