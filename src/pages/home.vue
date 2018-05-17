<template>
    <div class="home-container">
      <header-component></header-component>
      <div class="content-container" :class="{hidenav:isCollapse}">
        <menu-component></menu-component>
        <el-row class="el-content">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="content-right">
              <title-component></title-component>
              <div class="content-component">
                <router-view></router-view>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <footer-component></footer-component>
    </div>
</template>

<script>

    import Vue from 'vue';
    import store from '@/vuex/store';
    import VueSocketio from 'vue-socket.io';
    import io from 'socket.io-client';
    import api_config from '@/api/api-config'

    import headerComponent from './common/header.vue';
    import menuComponent from './common/menu.vue';
    import footerComponent from './common/footer.vue';
    import titleComponent from './common/title.vue'
    import methodAction from '@/mixins/methods'
    import { mapState } from 'vuex'

    Vue.use(VueSocketio, io(api_config.wsUrl,{
      transports: ['websocket'],
      query:{ token: store.state.user.userToken }
    }),store);

    export default {
        name: 'home',
        data () {
            return {
                msg: ''
            }
        },
        mixins: [methodAction],
        components: {
          headerComponent,menuComponent,titleComponent,footerComponent
        },
        methods: { },
        computed: {
          ...mapState({
            isCollapse: state=>state.menu.isCollapse,
            globalMessage: state=>state.socket.message
          })
        },
        watch:{
          globalMessage(val,old){
            if(val){
              this.handleSocketMessage(val);
            }
          }
        },
        created() {
            this.$socket.query = 'token=' + this.$store.state.user.userToken;
            this.$socket.io.opts.query = 'token=' + this.$store.state.user.userToken;
            this.$socket.open();
        }
    }
</script>
