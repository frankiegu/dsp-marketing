<template>
  <div style="height:40px;margin-left: 10px;margin-top:10px;">
    <ul class="clearfix" style="border-bottom:3px solid #50BFFF">
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('industryLimitManage')===-1" @click="$router.push('/home/taskInfo/industryLimitManage')">任务限制</el-button>
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('taskTimeManage')===-1" @click="$router.push('/home/taskInfo/taskTimeManage')">发送时间</el-button>
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('taskLimitManage')===-1" @click="$router.push('/home/taskInfo/taskLimitManage')">发送限制</el-button>
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('taskIndustryScale')===-1" @click="$router.push('/home/taskInfo/taskIndustryScale')">行业规模</el-button>
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('orgAndIndustryManage')===-1" @click="$router.push('/home/taskInfo/orgAndIndustryManage')">关联行业</el-button>
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('areaLimitManage')===-1" @click="$router.push('/home/taskInfo/areaLimitManage')">关联地区</el-button>
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('publicOrgManage')===-1" @click="$router.push('/home/taskInfo/publicOrgManage')">关联公众号</el-button>
      <el-button class="task-nav-buttun" type="info" :plain="$route.name.indexOf('setReason')===-1" @click="$router.push('/home/taskInfo/setReason')">原因设置</el-button>
    </ul>
  </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        components: {},
        methods: {},
        computed: {},
        created() {

        }
    }
</script>

<style lang="scss">

</style>
