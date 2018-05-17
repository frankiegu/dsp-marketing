<template>
    <div class="menu-container">
      <el-scrollbar
        tag="div"
        wrap-class="el-menu__wrap"
        view-class="el-menu__list"
      >
        <el-menu class="el-menu-vertical-demo" :default-active="$route.path.match(/\/home\/[a-zA-Z]+/g)[0]"   router :unique-opened="true" :collapse="isCollapse" theme="dark">
          <el-menu-item index="/home/index">
            <i class="el-icon-my-menu font-18">&#xe626;</i>
            <span slot="title">主页</span>
          </el-menu-item>

          <template v-for="item in menuList">
            <el-submenu :index="item.id.toString()">
              <template slot="title">
                <i :class="'el-icon-my-'+ item.icon "></i>
                <span slot="title">{{ item.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :key="_item.id" v-for="_item in item.child" :index="_item.url">{{ _item.name }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </template>
        </el-menu>
      </el-scrollbar>

    </div>
</template>

<script>
  import { mapState,mapActions } from 'vuex'
  import { userInformation } from '@/api/system-api'
  export default {
        name: 'menu',
        data () {
            return {
              roles:[]
            }
        },
        components: {},
        methods: {
          ...mapActions([
             'menuCollapse',
             'userRoleList',
             'selectRole'
          ]),
          isMenuCollapse(){
            window.onresize=(()=>{
              let clientWidth=document.body.clientHeight;
              if(clientWidth<1024){
                this.isCollapse=true;
              }
            });
          },
          getMenuHeight(){
            //let availableHeight = document.body.clientHeight  - document.querySelector('.header-container').offsetHeight;
            //document.querySelector('.content-container').style.height=availableHeight+'px';
            //document.querySelector('.el-menu__wrap').style.height=availableHeight+'px';
          },
          compare(prop,num) { // 排序
            return function (obj1, obj2) {
              var val1 = obj1[prop];
              var val2 = obj2[prop];
              if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
              }
              if (val1 < val2) {
                return num;
              } else if (val1 > val2) {
                return - num;
              } else {
                return 0;
              }
            }
          },

        },
        computed: {
          ...mapState({
            isCollapse: state=>state.menu.isCollapse,
            menuList:state => state.user.selectedRole.menuList
          })
        },
        mounted (){
          /*this.getMenuHeight();
          window.onresize=(()=>{
            (!!document.querySelector('.content-container'))?this.getMenuHeight():null;
          });*/
        },
        created() {
          let _data={
            account:this.$store.state.user.userInfo.account
          };
          userInformation(_data).then(data => {
            sessionStorage.setItem('userMobile',data.data.mobile);
            sessionStorage.setItem('userEmail',data.data.email);
            this.roles=data.data.roles;
            let _menuList = this.roles.map(item=>{
              let hashArr={};
              let _menu = item.privileges.reduce((arr,_item)=>{
                return (Array.isArray(arr) ? arr : arr.resources).concat(_item.resources);
              },[]).reduce((_item, next) => {
                  if(hashArr[next.id]){
                      _item.forEach(cell => {
                          if(cell.id == next.id){
                            let hashCell={};
                            cell.child = cell.child.concat(next.child).reduce((_cell,child) => {
                              hashCell[child.id] ? '' : hashCell[child.id] = true && _cell.push(child);
                              return _cell;
                            }, []);
                          }
                      });
                  }else{
                     hashArr[next.id] = true ;
                     _item.push(next);
                  }
                  return _item;
              }, []);
              return{
                  id:item.id,
                  roleName:item.roleName,
                  menuList:_menu.sort(this.compare('level',-1))
              }
            }).sort(this.compare('id',-1));
            _menuList.forEach(item => {
                 item.menuList.forEach(cell => {
                     cell.child.sort(this.compare('level',-1));
                     return cell;
                 });
                 return item;
            });
            this.selectRole({ menu:_menuList[0],type:'default' });
            this.userRoleList(_menuList);
          });
        }
    }
</script>
