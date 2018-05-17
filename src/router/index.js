import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'


//const Home = r => require.ensure([], () => r(require('@/pages/home')), 'group-foo')
const Home = () => import(/* webpackChunkName: "group-home" */ '@/pages/home');
const Login = () => import(/* webpackChunkName: "group-login" */ '@/pages/login');
const Register = () => import(/* webpackChunkName: "group-login" */ '@/pages/register');
const Index = () => import(/* webpackChunkName: "group-index" */ '@/pages/index');

const MarketTask = () => import(/* webpackChunkName: "group-marketing-manage" */ '@/pages/marketingManage/marketTask');
const MarketTaskDetail = () => import(/* webpackChunkName: "group-marketing-manage" */ '@/pages/marketingManage/marketTaskDetail');
const MarketTaskList = () => import(/* webpackChunkName: "group-marketing-manage" */ '@/pages/marketingManage/marketTaskList');
const MarketBatch = () => import(/* webpackChunkName: "group-marketing-manage" */ '@/pages/marketingManage/marketBatch');
const MarketTaskTimer = () => import(/* webpackChunkName: "group-marketing-manage" */ '@/pages/marketingManage/marketTaskTimer');
const SubscribeTemplate = () => import(/* webpackChunkName: "group-marketing-manage" */'@/pages/marketingManage/subscribeTemplate');

const blackList = () => import(/* webpackChunkName: "group-black-manage" */'@/pages/blackManage/blackList');

const sourceManage = () => import(/* webpackChunkName: "group-dataManage" */ '@/pages/dataManage/sourceData');
const hdfsExplorer = () => import(/* webpackChunkName: "group-dataManage" */ '@/pages/dataManage/hdfsExplorer');
const taskProgress = () => import(/* webpackChunkName: "group-dataManage" */ '@/pages/dataManage/taskProgress');
const syncSource = () => import(/* webpackChunkName: "group-dataManage" */ '@/pages/dataManage/syncSource');

const sysUser = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/sysUser');
const sysRole = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/sysRole');
const allocateTask = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/allocateTask');
const allocateCatalog = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/allocateCatalog');
const ipManage = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/ipManage');
const bizManage = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/bizManage');

const sysAuthority = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/sysAuthority');
const sysSetting = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/sysSetting');
const sysOrganiza = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/sysOrganiza');
const sysUrl = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/sysUrl');
const callBack = () => import(/* webpackChunkName: "group-systemManage" */ '@/pages/systemManage/callBack');

const smsPassageway = () => import(/* webpackChunkName: "group-smsManagement" */ '@/pages/smsManagement/smsPassageway');
const smsSendOut = () => import(/* webpackChunkName: "group-smsManagement" */ '@/pages/smsManagement/smsSendOut');
const smsTemplate = () => import(/* webpackChunkName: "group-smsManagement" */ '@/pages/smsManagement/smsTemplate');
const smsCheck = () => import(/* webpackChunkName: "group-smsManagement" */ '@/pages/smsManagement/smsCheck');
const smsStatistics = () => import(/* webpackChunkName: "group-smsManagement" */ '@/pages/smsManagement/smsStatistics');
const smsCreateUrl = () => import(/* webpackChunkName: "group-smsManagement" */ '@/pages/smsManagement/smsCreateUrl');
const smsChannel = () => import(/* webpackChunkName: "group-statisticalManage" */ '@/pages/smsManagement/smsChannel');
const smsPreparation = () => import(/* webpackChunkName: "group-statisticalManage" */ '@/pages/smsManagement/smsPreparation');

const privilegeList = ()=> import(/* webpackChunkName: "group-dataPrivilegeManage" */ '@/pages/dataPrivilegeManage/privilegeList');
const dataCatalog = ()=> import(/* webpackChunkName: "group-dataPrivilegeManage" */ '@/pages/dataPrivilegeManage/dataCatalog');
const allotList = ()=> import(/* webpackChunkName: "group-dataPrivilegeManage" */ '@/pages/dataPrivilegeManage/allotPriviList');
const privilegeSet = ()=> import(/* webpackChunkName: "group-dataPrivilegeManage" */ '@/pages/dataPrivilegeManage/privilegeSet');

const companyInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/companyInfo');
const customerInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/customerInfo');
const industryInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/industryInfo');
const regionInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/regionInfo');
const industryDataInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/industryDataInfo');
const passagewayInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/passagewayInfo');
const publicNumberInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/publicNumberInfo/publicNumberInfo');
const publicNumberTemplate = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/publicNumberInfo/publicNumberTemplate');
const rechargeInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/rechargeInfo');
const taskManageInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskManageInfo');
const templateInfo = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/templateInfo');
const partnerManage = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/partnerManage');


const taskIndustryScale = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/taskIndustryScale');
const taskLimitManage = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/taskLimitManage');
const taskTimeManage = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/taskTimeManage');
const orgAndIndustryManage = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/orgAndIndustryManage');
const industryLimitManage = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/industryLimitManage');
const areaLimitManage = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/areaLimitManage');
const publicOrgManage = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/publicOrgManage');
const setReason = ()=> import(/* webpackChunkName: "group-assistManage" */ '@/pages/assistManage/taskInfo/setReason');


const assistSendCheck = ()=> import(/* webpackChunkName: "group-assistTaskManage" */ '@/pages/assistTaskManage/assistSendCheck');
const assistTaskCheck = ()=> import(/* webpackChunkName: "group-assistTaskManage" */ '@/pages/assistTaskManage/assistTaskCheck');
const assistTaskSend = ()=> import(/* webpackChunkName: "group-assistTaskManage" */ '@/pages/assistTaskManage/assistTaskSend');
const assistSmsCheck = () => import(/* webpackChunkName: "group-assistTaskManage" */ '@/pages/assistTaskManage/smsCheck');

const statisticalTemplateManage = () => import(/* webpackChunkName: "group-statisticalManage" */ '@/pages/statisticalManage/statisticalTemplateManage');
const statisticalTableManage = () => import(/* webpackChunkName: "group-statisticalManage" */ '@/pages/statisticalManage/statisticalTableManage');
const statisticalManage = () => import(/* webpackChunkName: "group-statisticalManage" */ '@/pages/statisticalManage/statisticalManage');

const modelManage = () => import(/* webpackChunkName: "group-modelManage" */ '@/pages/modelManage/modelManage');
const modelCategoryManage = () => import(/* webpackChunkName: "group-modelManage" */ '@/pages/modelManage/modelCategoryManage');
const modelAnalysisManage = () => import(/* webpackChunkName: "group-modelManage" */ '@/pages/modelManage/modelAnalysisManage');

const capitalManage = () => import(/* webpackChunkName: "group-capitalManage" */ '@/pages/capitalManage/capitalClassManage');
const relationInfo = () => import(/* webpackChunkName: "group-capitalManage" */ '@/pages/capitalManage/relationInfo');
const ruleManage = () => import(/* webpackChunkName: "group-capitalManage" */ '@/pages/capitalManage/ruleManage');

Vue.use(Router);

const routes=[{
  path: '/home',
  name: 'Home',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: Home,
  children: [
    {
      path: 'index',
      component: Index,
      name:'Index',
      meta: {
        title:{
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'markettask',
      component:MarketTask,
      children:[{
        path:':id/taskdetail',
        component:MarketTaskDetail,
        name:'markettaskdetail',
        meta: {
          title:{
            mainMenu:'营销管理',
            secondMenu:'营销任务',
            threeMenu:'营销详情'
          },  // 添加该字段，导航面包屑名称
        }
      },{
        path:'',
        component:MarketTaskList,
        name:'MarketTaskList',
        meta: {
          title:{
            mainMenu:'营销管理',
            secondMenu:'营销任务'
          },  // 添加该字段，导航面包屑名称
        }
      }]
    },{
      path:'markettasktimer',
      component:MarketTaskTimer,
      name:'MarketTaskTimer',
      meta: {
        title:{
          mainMenu:'营销管理',
          secondMenu:'任务管理'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'marketbatch',
      component:MarketBatch,
      name:'MarketBatch',
      meta: {
        title:{
          mainMenu:'营销管理',
          secondMenu:'营销批次'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'subscribetemplate',
      component:SubscribeTemplate,
      name:'SubscribeTemplate',
      meta: {
        title:{
          mainMenu:'营销管理',
          secondMenu:'订阅模板'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'privilegelist',
      component:privilegeList,
      name:'privilegeList',
      meta: {
        title:{
          mainMenu:'数据权限管理',
          secondMenu:'权限列表'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'privilegelist/allotlist',
      component:allotList,
      name:'allotList',
      meta: {
        title:{
          mainMenu:'数据权限管理',
          secondMenu:'权限配给列表'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'datacatalog',
      component:dataCatalog,
      name:'dataCatalog',
      meta: {
        title:{
          mainMenu:'数据权限管理',
          secondMenu:'导入库列表'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'privilegeset',
      component:privilegeSet,
      name:'privilegeSet',
      meta: {
        title:{
          mainMenu:'数据权限管理',
          secondMenu:'权限初始化'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'datacatalog/:parentSourceId/:tableName',
      component:dataCatalog,
      name:'dataCatalogAdd',
      meta: {
        title:{
          mainMenu:'数据权限管理',
          secondMenu:'导入库列表'
        }, // 添加该字段，导航面包屑名称
      }
    },{
      path:'sourcemanage',
      component:sourceManage,
      name:'sourceManage',
      meta: {
        title:{
          mainMenu:'数据源管理',
          secondMenu:'数据源管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'hdfsexplorer',
      component:hdfsExplorer,
      name:'hdfsExplorer',
      meta: {
        title:{
          mainMenu:'数据源管理',
          secondMenu:'HDFS文件管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'taskprogress',
      component:taskProgress,
      name:'taskProgress',
      meta: {
        title:{
          mainMenu:'数据源管理',
          secondMenu:'数据处理进度'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'syncSource',
      component:syncSource,
      name:'syncSource',
      meta: {
        title:{
          mainMenu:'数据源管理',
          secondMenu:'同步源管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'blacklist',
      component:blackList,
      name:'blackList',
      meta: {
        title:{
          mainMenu:'黑名单管理',
          secondMenu:'黑名单'
        }, // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'assisttaskcheck',
      component:assistTaskCheck,
      name:'assistTaskCheck',
      meta: {
        title:{
          mainMenu:'营销任务管理',
          secondMenu:'任务审核'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'assisttasksend',
      component:assistTaskSend,
      name:'assistTaskSend',
      meta: {
        title:{
          mainMenu:'营销任务管理',
          secondMenu:'短信发送'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'assistsendcheck',
      component:assistSendCheck,
      name:'assistSendCheck',
      meta: {
        title:{
          mainMenu:'营销任务管理',
          secondMenu:'短信审核'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'assistsendcheck/:bizid/:channel',
      component:assistSmsCheck,
      name:'assistSendDetail',
      meta: {
        title:{
          mainMenu:'营销任务管理',
          secondMenu:'短信审核详情'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'company',
      component:companyInfo,
      name:'companyInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'企业信息管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'customer',
      component:customerInfo,
      name:'customerInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'客户信息管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'industry',
      component:industryInfo,
      name:'industryInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'关联行业'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'region',
      component:regionInfo,
      name:'regionInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'地区管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'industryDataInfo',
      component:industryDataInfo,
      name:'industryDataInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'行业数据管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'passagewayInfo',
      component:passagewayInfo,
      name:'passagewayInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'通道管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'publicNumberInfo',
      redirect:'publicNumberInfo/publicNumberInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'公众号管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'publicNumberInfo/publicNumberInfo',
      component:publicNumberInfo,
      name:'publicNumberInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'公众号管理',
          threeMenu:'公众号配置',

        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'publicNumberInfo/publicNumberTemplate',
      component:publicNumberTemplate,
      name:'publicNumberTemplate',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'公众号管理',
          threeMenu:'模板配置'

        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'rechargeInfo',
      component:rechargeInfo,
      name:'rechargeInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'充值管理'
        },  // 添加该字段，导航面包屑名称
      }
    }, {//营销助手
      path: 'taskInfo',
      name: 'taskInfo',
      redirect:'taskInfo/industryLimitManage',
      meta: {
        title: {
          mainMenu: '营销助手',
          secondMenu: '任务信息配置'
        },  // 添加该字段，导航面包屑名称
      },
    },//industryLimitManage
    {//营销助手
      path: 'taskInfo/industryLimitManage',
      name: 'industryLimitManage',
      component:industryLimitManage,
      meta: {
        title: {
          mainMenu: '营销助手',
          secondMenu: '任务信息配置',
          threeMenu:'任务限制'
        },  // 添加该字段，导航面包屑名称
      },
    },{//营销助手
      path: 'taskInfo/areaLimitManage',
      name: 'areaLimitManage',
      component:areaLimitManage,
      meta: {
        title: {
          mainMenu: '营销助手',
          secondMenu: '任务信息配置',
          threeMenu:'关联地区'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path: 'taskInfo/publicOrgManage',
      name: 'publicOrgManage',
      component:publicOrgManage,
      meta: {
        title: {
          mainMenu: '营销助手',
          secondMenu: '任务信息配置',
          threeMenu:'关联公众号'
        },  // 添加该字段，导航面包屑名称
      }
    },
    {//营销助手
      path:'taskInfo/taskIndustryScale',
      component:taskIndustryScale,
      name:'taskIndustryScale',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'任务信息配置',
          threeMenu:'行业规模',

        },  // 添加该字段，导航面包屑名称
      }
    },
    {//营销助手
      path:'taskInfo/orgAndIndustryManage',
      component:orgAndIndustryManage,
      name:'orgAndIndustryManage',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'任务信息配置',
          threeMenu:'关联行业',

        },  // 添加该字段，导航面包屑名称
      }
    },
    {//营销助手
      path:'taskInfo/setReason',
      component:setReason,
      name:'setReason',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'任务信息配置',
          threeMenu:'理由配置',
        },  // 添加该字段，导航面包屑名称
      }
    },
    {//营销助手
      path:'taskInfo/taskLimitManage',
      component:taskLimitManage,
      name:'taskLimitManage',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'任务信息配置',
          threeMenu:'发送限制'
        },  // 添加该字段，导航面包屑名称
      }
    },
    {//营销助手
      path:'taskInfo/taskTimeManage',
      component:taskTimeManage,
      name:'taskTimeManage',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'任务信息配置',
          threeMenu:'发送时间'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'taskManageInfo',
      component:taskManageInfo,
      name:'taskManageInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'任务管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'templateInfo',
      component:templateInfo,
      name:'templateInfo',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'模板管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//营销助手
      path:'partnerManage',
      component:partnerManage,
      name:'partnerManage',
      meta: {
        title:{
          mainMenu:'营销助手',
          secondMenu:'合作商管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{//系统管理
      path:'sysuser',
      component:sysUser,
      name:'sysUser',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'用户管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'sysrole',
      component:sysRole,
      name:'sysRole',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'角色管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'sysorganiza',
      component:sysOrganiza,
      name:'sysOrganiza',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'组织管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'sysauthority',
      component:sysAuthority,
      name:'sysAuthority',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'权限管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'sysurl',
      component:sysUrl,
      name:'sysUrl',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'资源管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'callBack',
      component:callBack,
      name:'callBack',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'回调管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'ipManage',
      component:ipManage,
      name:'ipManage',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'ip管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'allocateTask',
      component:allocateTask,
      name:'allocateTask',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'任务分配'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'allocateCatalog',
      component:allocateCatalog,
      name:'allocateCatalog',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'数据源分配'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'bizManage',
      component:bizManage,
      name:'bizManage',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'业务编号管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'syssetting',
      component:sysSetting,
      name:'sysSetting',
      meta: {
        title:{
          mainMenu:'系统管理',
          secondMenu:'系统配置'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'smsPassageway',
      component:smsPassageway,
      name:'smsPassageway',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'通道管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'smsSendOut',
      component:smsSendOut,
      name:'smsSendOut',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'发送管理'
        },  // 添加该字段，导航面包屑名称
      }
    },//smsStatistics
    {
      path:'smsStatistics',
      component:smsStatistics,
      name:'smsStatistics',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'发送统计'
        },  // 添加该字段，导航面包屑名称
      }
    },
    {
      path:'smsTemplate',
      component:smsTemplate,
      name:'smsTemplate',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'模板管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'smscheck',
      component:smsCheck,
      name:'smsCheck',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'短信审核'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'smscreateurl',
      component:smsCreateUrl,
      name:'smsCreateUrl',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'短链管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'smschannel',
      component:smsChannel,
      name:'smsChannel',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'短信渠道'
        },  // 添加该字段，导航面包屑名称
      }
    },
    {
      path:'smsPreparation',
      component:smsPreparation,
      name:'smsPreparation',
      meta: {
        title:{
          mainMenu:'短信管理',
          secondMenu:'发送准备'
        },  // 添加该字段，导航面包屑名称
      }
    },
    {
      path:'statisticalTemplateManage',
      component:statisticalTemplateManage,
      name:'statisticalTemplateManage',
      meta: {
        title:{
          mainMenu:'统计管理',
          secondMenu:'数据列管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'statisticalTableManage',
      component:statisticalTableManage,
      name:'statisticalTableManage',
      meta: {
        title:{
          mainMenu:'统计管理',
          secondMenu:'数据模板管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'statisticalManage',
      component:statisticalManage,
      name:'statisticalManage',
      meta: {
        title:{
          mainMenu:'统计管理',
          secondMenu:'统计表管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'modelManage',
      component:modelManage,
      name:'modelManage',
      meta: {
        title:{
          mainMenu:'模型管理',
          secondMenu:'模型管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'modelAnalysisManage',
      component:modelAnalysisManage,
      name:'modelAnalysisManage',
      meta: {
        title:{
          mainMenu:'模型分析管理',
          secondMenu:'模型分析管理'
        },  // 添加该字段，导航面包屑名称
      }
    },{
      path:'modelCategoryManage',
      component:modelCategoryManage,
      name:'modelCategoryManage',
      meta: {
        title:{
          mainMenu:'模型管理',
          secondMenu:'模型分类'
        },  // 添加该字段，导航面包屑名称
      }
    },//modelcategoryManage
    {
      path:'capitalManage',
      component:capitalManage,
      name:'capitalManage',
      meta: {
        title:{
          mainMenu:'入资管理',
          secondMenu:'入资操作类'
        },  // 添加该字段，导航面包屑名称
      }
    },//modelcategoryManage
    {
      path:'relationInfo',
      component:relationInfo,
      name:'relationInfo',
      meta: {
        title:{
          mainMenu:'入资管理',
          secondMenu:'入资关联信息'
        },  // 添加该字段，导航面包屑名称
      }
    },//modelcategoryManage
    {
      path:'ruleManage',
      component:ruleManage,
      name:'ruleManage',
      meta: {
        title:{
          mainMenu:'入资管理',
          secondMenu:'入资规则'
        },  // 添加该字段，导航面包屑名称
      }
    }
]
},{
  path: '*',
  component: ()=>{
    router.push({
      path: '/login'
    })
  }
},{
  path: '/',
  component: Login
},{
  path: '/login',
  name: 'Login',
  component: Login
},{
  path: '/register',
  name: 'Register',
  component: Register
}
];

const router = new Router({
  //mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if(to.meta.title){
    store.dispatch('changeTitle',to.meta.title);
  }
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.user.userToken) {
      next();
    }else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      });
    }
  }else {
    next();
  }
});

export default router;
