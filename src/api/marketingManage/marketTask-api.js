/**
 * Created by szatpig on 2017/11/1.
 */
import { fetch } from '../../util/api'

import api from './../api-config'

//数据源列表
export const dataSourceList= (data)=> fetch(api.data +'/datasource/list',{
  data,
  'type':'get'
});

//数据规则调试
export const dtActionExecute= (data)=> fetch(api.data +'/dtAction/execute',{
  data
});

//数据规则异步调试
export const dtActionExecuteAsync= (data)=> fetch(api.data +'/dtAction/executeAsync',{
  data
});

//
export const dtActionDebugTask= (data,jobId)=> fetch(api.data +'/dtAction/task/'+jobId,{
  data,
  'type':'get'
});


//数据动作操作
export const dtActionList= (data)=> fetch(api.data +'/dtAction/list',{
  data,
  'type':'get'
});

export const templateList = ()=> fetch(api.data + '/dtAction/task/template',{
  'type':'get'
});

//数据动作操作
export const getColumns= (data)=> fetch(api.data +'/datasource/getColumns',{
  data
});

//数据动作操作
export const previewData= (data)=> fetch(api.data +'/datasource/previewValues',{
  data
});


//获取任务规则
export const getTask= (data,taskId)=> fetch(api.data +'/dtAction/task/get/'+taskId,{
  data,
  'type':'get'
});

//获取任务规则列表
export const listTasks= (data)=> fetch(api.data +'/dtAction/task/list',{
  data
});

//保存任务规则
export const saveTask= (data,taskId)=> fetch(api.data +'/dtAction/task/save',{
  data
});

//任务规则执行
export const executeTask= (data,taskId)=> fetch(api.data +'/dtAction/task/execute/'+taskId,{
  data
});

//任务规则异步执行
export const executeTaskAsync= (data)=> fetch(api.data +'/dtAction/task/executeAsync/',{
  data
});

//参数化任务执行
export const executeTaskParams= (data,taskId)=> fetch(api.data +'/dspTask/task/params/'+taskId,{
  'params':data,
  'type':'get',
  timeout:60000
});

//参数化批量、定时执行
export const executeTaskParamsBatch = (data)=> fetch(api.data + '/dtAction/task/executeAsync/batch',{
  data
});

//营销批次列表
export const jobList= (data)=> fetch(api.data +'/dspTask/job/list',{
  data
});

export const continueTask= (jobId,data)=>fetch(api.data + '/dtAction/continue/' + jobId,{
  data
});

//任务管理列表
export const manageList = (data)=> fetch(api.data + '/dtAction/task/manage/list',{
  data
});

export const updateBatch = (batchId,data)=> fetch(api.data + '/dtAction/task/manage/' + batchId,{
  data
});

export const cancelBatch = (batchId)=> fetch(api.data + '/dtAction/task/manage/' + batchId,{
  'type':'delete'
});

export const jobParam = (jobId) => fetch(api.data + '/dtAction/continue/' + jobId,{
  'type': 'get'
});

//营销批次信息订阅
export const subscribeMobile= (data,mobile)=> fetch(api.socket +'/subscribe/mobile/' + mobile,{
  data
});

//营销批次信息订阅
export const subscribeMail= (data,mail)=> fetch(api.socket +'/subscribe/mail/' + mail,{
  data
});
//partner列表
export const listPartners= (data)=> fetch(api.partner+'/dsp/org/listPartners',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});


