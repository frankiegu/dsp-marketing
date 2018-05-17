/**
 * Created by szatpig on 2017/11/14.
 */

console.log('当前开发环境：'+ process.env.NODE_ENV);

let api_config={};

if(process.env.NODE_ENV === 'production'){
  api_config={
    user:'/account',
    data:'',
    api:'',
    hdfs:'',
    sms:'',
    city:'/baseInfo',
    stati:'/statistic',
    socket:'',
    privilege:'',
    industry:'',
    companyapi:'',
    assenterprise:'/assenterprise',
    wxconfigapi:'',
    assistsms:'',
    wsUrl: location.hostname == '10.99.1.134' ? 'ws://10.99.1.134:12122/' : 'ws://61.155.178.245:12122/',
    catalogId: location.hostname == '10.99.1.134' ? 120 : 21,
    hezh:'',
    urlhzh:'',
    partner:'',
    capital:''
  }
}else{
  api_config={
    stati:'/statistics',
    user:'/user/account',
    data:'/data',
    api:'/api',
    hdfs:'/hdfs',
    sms:'/sms',
    city:'/city',
    industry:'/industry',
    companyapi:'/companyapi',
    assenterprise:'/assenterprise/assenterprise',
    assistsms:'/assist_sms',
    socket:'/socket',
    privilege:'/privilege',
    wxconfigapi:'/wxconfigapi',
    wsUrl:'ws://10.99.1.134:12122/',
    catalogId:120,
    hezh:'/hezh',
    urlhzh:'/urlhzh',
    partner:'/partner',
    capital:'/capital'

  }
}

export  default api_config;
