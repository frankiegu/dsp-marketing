/**
 * Created by liuli on 2018/5/11.
 */
import { fetch } from '../util/api'
import api from './api-config'

//列表
export const relationList= (data)=> fetch(api.capital+'/capital/relation/list',{
  data,
  'type':'post',

});
//新增
export const relationAddOrModify= (data)=> fetch(api.capital+'/capital/relation/addOrModify',{
  data,
  'type':'post'
});
//禁用
export const relationDelete= (data)=> fetch(api.capital+'/capital/relation/delete',{
  data,
  'type':'post'
});


//列表
export const ruleList= (data)=> fetch(api.capital+'/capital/rule/list',{
  data,
  'type':'post'
});
//新增
export const ruleAddOrModify= (data)=> fetch(api.capital+'/capital/rule/addOrModify',{
  data,
  'type':'post'
});
//禁用
export const ruleDelete= (data)=> fetch(api.capital+'/capital/rule/delete',{
  data,
  'type':'post'
});

//列表
export const capitalClassList= (data)=> fetch(api.capital+'/capital/class/list',{
  data,
  'type':'post'
});
//新增
export const capitalClassAddOrModify= (data)=> fetch(api.capital+'/capital/class/addOrModify',{

  data,
  'type':'post'
});
//禁用

export const capitalClassDelete= (data)=> fetch(api.capital+'/capital/class/delete',{
  data,
  'type':'post'
});

//跨域问题，无效
export const listPartners= (data)=> fetch(api.capital+'/capital/list/partners',{
  data,
  'type':'post'
});
