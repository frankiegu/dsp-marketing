import { fetch } from '../../util/api'

import api from './../api-config'

//列出模板
export const queryTemplates = (data) => fetch(api.data +'/sub_template/list',{
  data
});

//列出任务
export const queryTasks = (data) => fetch(api.data + '/sub_template/task/list',{
  data
});

//获取action
export const queryActions = () => fetch(api.data + '/sub_template/action/list',{
  'type':'get'
});

//获取工作步骤
export const queryTaskSteps = (taskId) => fetch(api.data + '/sub_template/step/list/'+taskId,{
  'type':'get'
});

//获取批次参数
export const queryBatchParam = () => fetch(api.data + '/sub_template/param/batch/',{
  'type':'get'
});

//获取任务参数
export const queryTaskParam = () => fetch(api.data + '/sub_template/param/task/',{
  'type':'get'
});


//获取步骤参数
export const queryStepParam = () => fetch(api.data + '/sub_template/param/step/',{
  'type':'get'
});

export const saveTemplate = (data) => fetch(api.data + '/sub_template/save/',{
  data
});

export const activeTemplate = (templateId) => fetch(api.data + '/sub_template/active/' + templateId);

export const forbiddenTemplate = (templateId) => fetch(api.data + '/sub_template/forbidden/' + templateId);

export const deleteTemplate = (templateId) => fetch(api.data + '/sub_template/delete/' + templateId,{
  'type':'delete'
});

export const queryTemplate = (templateId) => fetch(api.data + '/sub_template/one/' + templateId,{
  'type':'get'
});


