/**
 * Created by szatpig on 2018/1/23.
 */
import { fetch } from './../util/api'
import api from './api-config'

// 企业信息列表
export const companyList = (data)=> fetch(api.companyapi + '/assenterprise/entity/list',{
  data
});

// 企业信息申请详情
export const entityInfo = (data)=> fetch(api.companyapi + '/assenterprise/entity/info',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

// 公司状态
export const companyStatus = (data)=> fetch(api.companyapi + '/assenterprise/entity/update/status',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});



//注册用户列表
export const customerList = (data)=> fetch(api.companyapi + '/assenterprise/userinfo/list',{
  data
});

//配置项列表
export const configList = (data)=> fetch(api.companyapi + '/assenterprise/config/list',{
  data
});

//配置信息保存
export const configSave = (data)=> fetch(api.companyapi + '/assenterprise/config/save',{
  data
});

//配置项列表
export const listItems = (data)=> fetch(api.companyapi + '/assenterprise/config/list/items',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//配置状态
export const configUpdate = (data)=> fetch(api.companyapi + '/assenterprise/config/update/status',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});


// 省市区列表
export const cityList = (data)=> fetch(api.city + '/dsp/city/list',{
  data
});

// 省市区保存
export const citySave = (data)=> fetch(api.city + '/dsp/city/save',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
// 单个省市区数据
export const cityGet = (data)=> fetch(api.city + '/dsp/city/get',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
// 省市区获取
export const cityView = (data)=> fetch(api.city + '/dsp/city/view',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});


// 省市区获取
export const orgCityView = (data)=> fetch(api.assenterprise + '/org/city/view',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

// 行业列表
export const industryList = (data)=> fetch(api.city + '/dsp/industry/list',{
  data
});

// 行业保存
export const industrySave = (data)=> fetch(api.city + '/dsp/industry/save',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});




//任务管理列表
export const periodList = (data)=> fetch(api.assenterprise + '/period/list',{
  data,
});

//任务管理保存
export const periodSave = (data)=> fetch(api.assenterprise + '/period/save',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//任务管理激活
export const periodRevoke = (data)=> fetch(api.assenterprise + '/period/revoke',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//任务管理激活
export const periodDelete = (data)=> fetch(api.assenterprise + '/period/delete',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//获取日期类型
export const getAllDay = (data)=> fetch(api.assenterprise + '/period/getAllDay',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//获取日期类型
export const getAllPeriod = (data)=> fetch(api.assenterprise + '/period/getAllPeriod',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});


//行业规模列表
export const areaList = (data)=> fetch(api.assenterprise + '/area/limit/list',{
  data,
});

//行业规模保存
export const areaSave = (data)=> fetch(api.assenterprise + '/area/limit/save',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//行业规模激活
export const areaRevoke = (data)=> fetch(api.assenterprise + '/area/limit/revoke',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//行业规模删除
export const areaDelete = (data)=> fetch(api.assenterprise + '/area/limit/delete',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});





//行业通道列表
export const relationList= (data)=> fetch(api.assenterprise+'/sms/channel/relation/list',{
  data,
  'type':'post'
});

//行业通道删除
export const relationDelete= (data)=> fetch(api.assenterprise+'/sms/channel/relation/delete',{
  data,
  'type':'post',
});

//行业通道
export const relationGet= (data)=> fetch(api.assenterprise+'/sms/channel/relation/get',{
  data,
  'type':'post',

});

//行业通道新增
export const relationAddOrModify= (data)=> fetch(api.assenterprise+'/sms/channel/relation/addOrModify',{
  data,
  'type':'post',
});




//行业模板列表
export const cRelationList= (data)=> fetch(api.assenterprise+'/template/relation/list',{
  data,
  'type':'post',

});

//行业模板删除
export const cRelationDelete= (data)=> fetch(api.assenterprise+'/template/relation/delete',{
  data,
  'type':'post',

});

//行业模板
export const cRelationGet= (data)=> fetch(api.assenterprise+'/template/relation/get',{
  data,
  'type':'post',

});

//行业通道新增
export const cRelationAddOrModify= (data)=> fetch(api.assenterprise+'/template/relation/addOrModify',{
  data,
  'type':'post',
});

//行业通道列表
export const ccRelationList= (data)=> fetch(api.assenterprise+'/channel/relation/list',{
  data,
  'type':'post',

});

//行业通道删除
export const ccRelationDelete= (data)=> fetch(api.assenterprise+'/channel/relation/delete',{
  data,
  'type':'post',

});

//行业通道
export const ccRelationGet= (data)=> fetch(api.assenterprise+'/channel/relation/get',{
  data,
  'type':'post',

});

//行业通道新增
export const ccRelationAddOrModify= (data)=> fetch(api.assenterprise+'/channel/relation/addOrModify',{
  data,
  'type':'post',
});



//任务信息配置列表
export const lPeriodList = (data)=> fetch(api.assenterprise + '/limit/period/list',{
  data,
});

//任务信息配置保存
export const lPeriodSave = (data)=> fetch(api.assenterprise + '/limit/period/save',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//任务信息配置激活
export const lPeriodRevoke = (data)=> fetch(api.assenterprise + '/limit/period/revoke',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//任务信息配置激活
export const lPeriodDelete = (data)=> fetch(api.assenterprise + '/limit/period/delete',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});


//行业限制列表
export const taskLimitList = (data)=> fetch(api.assenterprise + '/tasklimit/list',{
  data,
});

//行业限制保存
export const tasklimitSave = (data)=> fetch(api.assenterprise + '/tasklimit/save',{
  data
});

//行业限制状态
export const tasklimitStatus = (data)=> fetch(api.assenterprise + '/tasklimit/update/status',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});


//组织行业列表
export const orgIndustryList = (data)=> fetch(api.assenterprise + '/org/industry/list',{
  data,

});

//组织行业保存
export const orgIndustrySave = (data)=> fetch(api.assenterprise + '/org/industry/save',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//组织行业激活
export const orgIndustryRevoke = (data)=> fetch(api.assenterprise + '/org/industry/revoke',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//组织行业删除
export const orgIndustryDelete = (data)=> fetch(api.assenterprise + '/org/industry/delete',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//组织行业列表
export const orgCityList = (data)=> fetch(api.assenterprise + '/org/city/list',{
  data,

});

//组织行业保存
export const orgCitySave = (data)=> fetch(api.assenterprise + '/org/city/save',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//组织行业激活
export const orgCityRevoke = (data)=> fetch(api.assenterprise + '/org/city/revoke',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//组织行业激活
export const orgCityDelete = (data)=> fetch(api.assenterprise + '/org/city/delete',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//所有公众号列表
export const wxListInfos = (data)=> fetch(api.wxconfigapi + '/wx/listInfos',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//按组织查询公众号列表1
export const wxListInfosById = (data)=> fetch(api.wxconfigapi + '/wx/listInfosById',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//按组织查询公众号列表2
export const wxListOrgInfos = (data)=> fetch(api.wxconfigapi + '/wx/listOrgInfos',{
  data
});

//按组织关联公众号
export const addOrgBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/addOrgBindingInfo',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
//按组织删除公众号
export const deleteOrgBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/deleteOrgBindingInfo',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
//按组织激活公众号
export const revokeOrgBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/revokeOrgBindingInfo',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//公众号增加
export const wxSaveBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/saveBindingInfo',{
  data,

});
//公众号激活
export const revokeBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/revokeBindingInfo',{
  data,

});

//公众号删除
export const deleteBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/deleteBindingInfo',{
  data,

});
//公众号模板列表
export const wxlistTemplates = (data)=> fetch(api.wxconfigapi + '/wx/listTemplates',{
  data,
});

//公众号模板增加
export const wxSaveTemplate = (data)=> fetch(api.wxconfigapi + '/wx/saveTemplate',{
  data,
});

//公众号模板激活
export const wxDeleteTemplate = (data)=> fetch(api.wxconfigapi + '/wx/deleteTemplate',{
  data,

});

//公众号模板删除
export const wxRevokeTemplate = (data)=> fetch(api.wxconfigapi + '/wx/revokeTemplate',{
  data,

});


//组织行业激活
export const wxRevokeBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/deleteBindingInfo',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//组织行业激活
export const wxDeleteBindingInfo = (data)=> fetch(api.wxconfigapi + '/wx/deleteBindingInfo',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//营销任务列表
export const assTaskList = (data)=> fetch(api.companyapi + '/assenterprise/task/list',{
  data
});

//营销任务列表状态详情
export const assTaskDetail = (data)=> fetch(api.companyapi + '/assenterprise/task/infomation',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//营销任务状态
export const assTaskUpdate = (data)=> fetch(api.companyapi + '/assenterprise/task/update/status',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//营销任务确认发送
export const assTaskSend = (data)=> fetch(api.companyapi + '/assenterprise/task/confirm',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//营销任务确认发送
export const assTaskConfirm = (data)=> fetch(api.companyapi + '/assenterprise/task/confirm',{
  data
});

//营销任务信息补录
export const assTaskFinish = (data)=> fetch(api.companyapi + '/assenterprise/task/finish/task',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});


//短信默认参数
export const defaultParams= (data)=> fetch(api.companyapi + '/assenterprise/task/default/params',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});


//营销短信发送参数
export const confirmParam = (data)=> fetch(api.companyapi + '/assenterprise/task/confirm/params',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//营销短信重新发送
export const confirmAgain = (data)=> fetch(api.companyapi + '/assenterprise/task/confirm/again',{
  data,
  'type':'post',
});

//营销任务记录
export const jobBatchList = (data)=> fetch(api.companyapi + '/assenterprise/task/jobbatch/list',{
  data,
  'type':'post',
});

//短信发送列表
export const sendList= (data)=> fetch(api.data + '/dspSms/send/record/list',{
  data
});

//营销任务关联任务
export const assiocateTask= (data)=> fetch(api.companyapi + '/assenterprise/industry/task/save',{
  data
});

//组织行业和营销任务关系查询列表
export const assiocateList= (data)=> fetch(api.companyapi + '/assenterprise/industry/task/list',{
  data
});

//组织行业和营销任务关系查询列表
export const partnerEvent= (data)=> fetch(api.stati + '/dsp/process/partnerEvent',{
  data
});

