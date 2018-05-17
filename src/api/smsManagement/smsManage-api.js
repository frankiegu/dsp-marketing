/**
 * Created by szatpig on 2017/11/16.
 */

import { fetch } from './../../util/api'
import api from './../api-config'


//*************************资源列表*************************//
// 短信审核
export const smsCheckList= (data)=> fetch(api.data + '/dspSms/send/list',{
  data ,
});

// 短信重发
export const smsResend= (data)=> fetch(api.data + '/dspSms/send/resend',{
  data ,
});

// 短信审核R
export const smsReview= (data)=> fetch(api.data + '/dspSms/send/review',{
  data ,
});

// 短信取消
export const sendCancel= (data)=> fetch(api.data + '/dspSms/send/cancel',{
  data ,
});

// 短信检查
export const sendPreview= (data)=> fetch(api.data + '/dspSms/send/preview',{
  data ,
});

// 短信检查
export const smsStatistics= (data)=> fetch(api.assistsms + '/sms/statistics/report',{
  data ,
});


//发送准备
export const preparationList= (data)=> fetch(api.data + '/dspSms/send/preparation/list',{
  data ,
});

//发送准备
export const preparationRebuild= (data)=> fetch(api.data + '/dspSms/send/data/preparation/rebuild',{
  data ,

});

// 短链生成
export const smsLink= (data)=> fetch(api.urlhzh + '/dspshorturl/sms/link/build',{
  data ,
});
// //外部导出
// export const sendHandMove = (data)=> fetch(api.data + '/dspSms/send/handMove',{
//   data ,
// });
