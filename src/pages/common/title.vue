<template>
    <div class="title-container">
      <span class="collapse-icon" @click="collapseEvent">&#xe61a;</span>
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/home/index' }">主页</el-breadcrumb-item>
        <el-breadcrumb-item :key="_item" v-for="_item in titleArr">{{ _item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
  import { mapActions ,mapState } from 'vuex'
  export default {
      name: 'title',
      data () {
          return {
              msg: ''
          }
      },
      components: {},
      methods: {
        ...mapActions([
          'menuCollapse'
        ]),
        collapseEvent(){
            this.menuCollapse();
        }
      },
      computed: {
        titleArr(){
          return Object.values(this.$store.state.title.titleObj)
        }
      },
      created() {

      }
  }
</script>

<style lang="scss">
  .breadcrumb{
    display: inline-block;
    overflow: hidden;
    font-size: 13px;
    margin-left: 15px;
    vertical-align: text-top;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__item__inner, .el-breadcrumb__item:last-child .el-breadcrumb__item__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__item__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__item__inner:hover{
    color: #e76b5f;
  }
</style>
