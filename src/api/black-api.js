/**
 * Created by szatpig on 2018/3/20.
 */
import { fetch } from './../util/api'
import api from './api-config'

//黑名单列表
export const blacklist =  (data) => fetch(api.hezh + '/blacklist/list',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});

//黑名单操作 1=增加；2=删除
export const blackOperate =  (data) => fetch(api.hezh + '/blacklist/operate/data',{
  data,
  headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
});
