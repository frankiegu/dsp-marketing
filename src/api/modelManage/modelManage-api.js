import { fetch } from '../../util/api'
import api from './../api-config'

//模型列表
export const modelList= (data)=> fetch(api.stati+'/dsp/model/list',{
  data,
  'type':'post'
});

//模型逻辑删除
export const modelDelete= (data)=> fetch(api.stati+'/dsp/model/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//模型取消删除
export const modelRevoke= (data)=> fetch(api.stati+'/dsp/model/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//模型取消删除
export const modelSave= (data)=> fetch(api.stati+'/dsp/model/save',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
//模型分类列表
export const categoryList= (data)=> fetch(api.hdfs+'/model/category/list',{
  data,
  'type':'post'
});

//模型分类逻辑删除
export const categoryDelete= (data)=> fetch(api.hdfs+'/model/category/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//模型分类取消删除
export const categoryRevoke= (data)=> fetch(api.hdfs+'/model/category/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//模型分类取消删除
export const categorySave= (data)=> fetch(api.hdfs+'/model/category/save',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
//模型分类
export const categoryGet= (data)=> fetch(api.hdfs+'/model/category/get',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//模型分析列表
export const AnalysisList= (data)=> fetch(api.stati+'/model/analysis/list',{
  data,
  'type':'post'
});

//模型分析逻辑删除
export const AnalysisDelete= (data)=> fetch(api.stati+'/model/analysis/delete',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//模型分析取消删除
export const AnalysisRevoke= (data)=> fetch(api.stati+'/model/analysis/revoke',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});

//模型分析取消删除
export const AnalysisSave= (data)=> fetch(api.stati+'/model/analysis/save',{
  data,
  'type':'post',

});
//模型分析执行统计
export const analysisExecute= (data)=> fetch(api.stati+'/model/analysis/execute',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
//模型编辑
export const AnalysisEdit= (data)=> fetch(api.stati+'/model/analysis/edit',{
  data,
  'type':'post',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
//模型分析导出
export const AnalysisExport= (data)=> fetch(api.stati+'/model/analysis/export',{
  data,
  'type':'get',
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
//UV分析
export const uvAnalysis= (data)=> fetch(api.stati+'/model/analysis/uvAnalysis',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

});
