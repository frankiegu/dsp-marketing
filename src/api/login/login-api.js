/**
 * Created by szatpig on 2017/9/27.
 */
import { fetch } from '../../util/api'
import api from './../api-config'

//用户登录
export const userLogin= (data)=> fetch(api.user+'/dsp/login/check',{
  data
});




