import { fetch } from '../../util/api'
import api from './../api-config'

//数据列列表
export const columnList= (data)=> fetch(api.stati+'/dsp/column/list',{
  data,
  'type':'post'
});

//数据列逻辑删除
export const columnDelete= (data)=> fetch(api.stati+'/dsp/column/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//数据列取消删除
export const columnRevoke= (data)=> fetch(api.stati+'/dsp/column/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//数据列新增
export const columnSave= (data)=> fetch(api.stati+'/dsp/column/save',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//数据列查询
export const columnQuery= (data)=> fetch(api.stati+'/dsp/column/query',{
  data,
  'type':'post'
});

//数据列分类列表
export const columnCategoryList = (data)=> fetch(api.stati+'/dsp/columnCategory/list',{
  data,
  'type':'post'
});

//统计表列表
export const tableList = (data)=> fetch(api.stati+'/dsp/table/list',{
  data,
  'type':'post'
});

//统计表新增删除
export const tableSave= (data)=> fetch(api.stati+'/dsp/table/save',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//统计表查询
export const tableQuery = (data)=> fetch(api.stati+'/dsp/table/query',{
  data,
  'type':'post'
});

//统计表删除
export const tableDelete = (data)=> fetch(api.stati+'/dsp/table/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//统计表新增编辑
export const tableRevoke = (data)=> fetch(api.stati+'/dsp/table/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//统计表新增编辑
export const tableGet = (data)=> fetch(api.stati+'/dsp/table/get',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});


//统计新增接口
export const statisticsSave = (data)=> fetch(api.stati+'/dsp/statistics/save',{
  data,
  'type':'post',
  // headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//统计列表
export const statisticsList = (data)=> fetch(api.stati+'/dsp/statistics/list',{
  data,
  'type':'post',
});

//统计删除
export const statisticsDelete = (data)=> fetch(api.stati+'/dsp/statistics/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//统计激活
export const statisticsRevoke = (data)=> fetch(api.stati+'/dsp/statistics/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//获取单个统计
export const statisticsGet = (data)=> fetch(api.stati+'/dsp/statistics/get'+"?id="+data.id,{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/json; charset=UTF-8'}
});

//单个明细列表
export const detailView = (data)=> fetch(api.stati+'/dsp/statistics/detail/view',{
  data,
  'type':'post',
  // headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//单个明细保存
export const detailSave = (data)=> fetch(api.stati+'/dsp/statistics/detail/save',{
  data,
  'type':'post',
  // headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//任务列表
export const taskList = (data)=> fetch(api.data+'/dtAction/task/list',{
  data,
  'type':'post',
});

//获取单个任务
export const taskGet = (data)=> fetch(api.data+'/dtAction/task/get/'+data.id,{
  data,
  'type':'get',
});

//修改任务
export const saveTask= (data)=> fetch(api.data +'/dtAction/task/save',{
  data,
  'type':'post',
});
///dspTask/job/list
//根据task查看job
export const jobList= (data)=> fetch(api.data +'/dspTask/job/list',{
  data,
  'type':'post',
});
//执行统计
export const statisticsExecute= (data)=> fetch(api.stati +'/dsp/statistics/execute',{
  data,
  'type':'post',
});
//执行统计
export const statisticsBuildParam= (data)=> fetch(api.stati +'/dsp/statistics/buildParam',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//修改具体明细的值
export const detailModify= (data)=> fetch(api.stati +'/dsp/statistics/detail/modify',{
  data,
  'type':'post',
});


//修改具体明细的值
export const channelList= (data)=> fetch(api.stati +'/dsp/statistics/channel/list',{
  data,
  'type':'post',
});
