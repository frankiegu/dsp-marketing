/**
 * Created by szatpig on 2017/11/1.
 */
import { fetch } from '../../util/api'

import api from './../api-config'

//数据源列表
export const dataSourceList= (data)=> fetch(api.data +'/datasource/list',{
  data
});

//数据源列表详情
export const dataSourceDetail= (data,sourceType,sourceId)=> fetch(api.data +'/datasource/get/'+sourceType+'/'+sourceId,{
  data,
  'type':'get'
});

//数据源删除
export const dataSourceDelete= (data,sourceType,sourceId)=> fetch(api.data +'/datasource/delete/'+sourceType+'/'+sourceId,{
  data,
  'type':'get'
});


//数据表添加
export const addTable= (data)=> fetch(api.data +'/datasource/addTable',{
  data
});

//数据源添加
export const addDataSource= (data)=> fetch(api.data +'/datasource/addDataSource',{
  data
});

//数据库添加
export const addCatalog= (data)=> fetch(api.data +'/datasource/addCatalog',{
  data
});

//文件上传到hdfs
export const hdfsUpload= (data)=> fetch(api.hdfs+'/dsp/hdfs/file/upload',{
  data,
  headers: {
    'Content-Type': 'multipart/form-data; charset=UTF-8'
  },
  timeout:60000
});

//删除hdfs上文件
export const hdfsDelete= (data)=> fetch(api.hdfs+'/dsp/hdfs/file/delete',{
  data
});

//创建一个HIVE表
export const hiveTable= (data)=> fetch(api.hdfs+'/dsp/hive/create/table',{
  data
});

//导入hdfs数据到Hive表中
export const loadAvroData= (data)=> fetch(api.hdfs+'/dsp/hive/load/avro/data',{
  data
});


//hdfs文件列表

export const fileList= (data)=> fetch(api.hdfs+'/dsp/hdfs/file/list',{
  data
});

//excel文件上传
export const uploadExcel= (data)=> fetch(api.hdfs+'/dsp/hive/upload/excel',{
  data,
  headers: {
    'Content-Type': 'multipart/form-data; charset=UTF-8'
  },
  timeout:60000
});

//导入hdfs中一个数据文件到HIVE表中
export const loadHdfsData= (data)=> fetch(api.hdfs+'/dsp/hive/load/hdfs/data',{
  data
});

//查看hive表创建状态
export const hiveList= (data)=> fetch(api.hdfs+'/dsp/hive/list',{
  data
});

//数据源管理表文件导入
export const importExcel= (data)=> fetch(api.data+'/datasource/import',{
  data,
  headers: {
    'Content-Type': 'multipart/form-data; charset=UTF-8'
  },
  timeout:60000
});

//查看hive表创建状态
export const tableExists= (data)=> fetch(api.hdfs+'/datasource/table/exists',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//查看hive表创建状态
export const batchExists= (data)=> fetch(api.hdfs+'/datasource/batch/exists',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});
