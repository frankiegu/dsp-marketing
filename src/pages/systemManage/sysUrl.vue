<template>
    <div class="sys-url-container">
      <el-row>
        <el-col>
          <div class="search-container">
            <!--<el-input class="search-key" v-model="searchData.key" @keyup.native.enter="searchEvent" :maxlength="10" placeholder="请输入关键字"></el-input>
            <el-button type="button" class="search-btn" @click="searchEvent">查询</el-button>-->
            <el-button type="success" class="search-add"  @click="dialogFormVisible = true">新增</el-button>
          </div>
        </el-col>
        <el-col>
          <div class="url-list">
            <!--<p class="url-title"><span>资源ID</span><span>资源名称</span><span>资源标志</span><span>节点</span><span>操作</span></p>
            <div class="url-list-cells"></div>-->
            <div class="menu-manage">
              <div class="url-cells">
                <p class="url-title">一级菜单 <span @click="addMenuTree(1)">&#xe629;</span></p>
                <ul>
                  <li @click="selectSource(index,$event)" :class="{active:style.O_index===index}" v-show="sourceUrl&&sourceUrl.length" v-for="(item,index) in sourceUrl"><p>{{item.name}}</p>
                    <span class="url-cell-edit" @click.stop="urlEdit(item.id,item.name,item.url,1,0,item.level,item.icon)">&#xe640;</span>
                    <span class="url-cell-delete"  @click.stop="urlDelete(item.id,item.name,index)">&#xe731;</span>
                  </li>
                  <li v-show="sourceUrl.length==0"><em>还未添加资源</em></li>
                </ul>
              </div>
              <div class="url-cells">
                <p class="url-title">二级菜单<span @click="addMenuTree(2)">&#xe629;</span></p>
                <ul><!--urlEdit(id,name,url,type,pid,level,icon)-->
                  <li @click="selectTwoSource(index,$event)" :class="{active:style.T_index===index}" v-show="sourceTwoUrl&&sourceTwoUrl.length" v-for="(item,index) in sourceTwoUrl"><p>{{item.name}}</p>
                    <span class="url-cell-edit" @click.stop="urlEdit(item.id,item.name,item.url,2,0,item.level)">&#xe640;</span>
                    <span class="url-cell-delete"  @click.stop="urlDelete(item.id,item.name,index)">&#xe731;</span>
                  </li>
                  <li v-show="sourceTwoUrl.length==0"><em>还未添加资源</em></li>
                </ul>
              </div>
              <div class="url-cells">
                <p class="url-title">菜单按钮</p>
                <ul>
                  <li><em>还未添加资源</em></li>
                </ul>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-dialog :title='isEdit?"编辑资源":"新增资源"' size="tiny" :visible.sync="dialogFormVisible">
        <el-form :model="addMenu" :rules="rules" ref="addMenu">
          <el-form-item label="资源编号" :label-width="formLabelWidth" v-show="isEdit">
            <el-input v-model="addMenu.id" readonly :disabled="true" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序编号" :label-width="formLabelWidth"  placeholder="请输入排序编号">
            <el-input v-model="addMenu.level" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源名称" :label-width="formLabelWidth" required prop="name" placeholder="请输入资源名称">
            <el-input v-model="addMenu.name" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源icon" :label-width="formLabelWidth" placeholder="请输入资源名称" v-if="addMenu.type==1">
            <el-input v-model="addMenu.icon" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源url" :label-width="formLabelWidth"  placeholder="请输入资源url" v-if="addMenu.type==2">
            <el-input v-model="addMenu.url" class="wid_80" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="urlAdd('addMenu')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { resourceList,resourceSave,resourceDelete } from '@/api/system-api'
    export default {
        name: 'sysUrl',
        data () {
            return {
              searchData:{
                key:''
              },
              isEdit:false,
              dialogFormVisible: false,
              formLabelWidth: '100px',
              addMenu:{
                id:'',
                name:'',
                url:'',
                type:'',
                pid:'',
                level:'',
                icon:''
              },
              rules: {
                name: [
                  { required: true, message: '请输入资源名称', trigger: 'change' }
                ],
                url: [
                  { required: true, message: '请输入资源路径', trigger: 'change' }
                ]
              },
              style:{
                O_index:0,
                T_index:0,
                Th_index:0
              },
              sourceUrl:[],
              sourceTwoUrl:'',
              sourceThreeUrl:'',
            }
        },
        components: {},
        methods: {
          searchEvent(){},
          addMenuTree(type){
            this.resetAddMenu();
            this.isEdit=false;
            this.dialogFormVisible=true;
            this.addMenu.type=type;
            if(type==1){
              this.addMenu.level = this.sourceUrl.length + 1;
              this.addMenu.pid = '';
            }else{
              this.addMenu.pid = this.sourceUrl[this.style.O_index].id;
              this.addMenu.level = this.sourceTwoUrl.length + 1;
            }
          },
          urlEdit(id,name,url,type,pid,level,icon){
            this.isEdit=true;
            this.dialogFormVisible=true;
            this.addMenu.id=id;
            this.addMenu.name=name;
            this.addMenu.url=url;
            this.addMenu.type=type;
            this.addMenu.level=level;
            if(type==1){
              this.addMenu.pid='';
            }else{
              this.addMenu.pid=this.sourceUrl[this.style.O_index].id;
            }
            this.addMenu.icon=icon;
          },
          urlDelete(id,name,index){
            this.$confirm('此操作将删除【'+ name +'】资源, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                let _data={
                  id:id
                };
              resourceDelete(_data).then((data)=>{
                    if(data.code==1){
                        this.$message({
                          type: 'success',
                          message: '删除成功!'
                        });
                        this.resourceListFun();
                    }
                });
            }).catch(() => {
              console.log('删除取消');
            });
          },
          urlAdd(formName) {
            let _self=this;
            this.$refs[formName].validate((valid) => {
              if (valid) {
                resourceSave(_self.addMenu).then((data) => {
                    if(data.code==1){
                      _self.resourceListFun();
                      this.dialogFormVisible=false;
                      this.resetAddMenu();
                    }
                }).catch((err)=>{

                })
              } else {
                return false;
              }
            });
          },
          selectSource(index,event){
            this.sourceTwoUrl=this.sourceUrl[index].child;
            this.addMenu.pid=this.sourceUrl[index].id;
            this.style.O_index=index;
            this.style.T_index=0;
          },
          selectTwoSource(index,event){
            this.sourceThreeUrl= this.sourceTwoUrl ? this.sourceTwoUrl[index].child : [];
            this.style.T_index=index;
          },
          resetAddMenu(){
            this.addMenu.type='';
            this.addMenu.level='';
            this.addMenu.name='';
            this.addMenu.url='';
            this.addMenu.pid='';
            this.addMenu.id='';
            this.addMenu.icon='';
          },
          resourceListFun(){
            let _data = {
              pageSize:100,
              pageIndex:1
            };
            resourceList(_data).then((data)=>{
              if(data.code===1){
                this.sourceUrl=data.data;
                this.sourceTwoUrl=this.sourceUrl[0].child;
                this.sourceThreeUrl=this.sourceTwoUrl.child;
                this.selectSource(0);
              }
            });
          }
        },
        computed: {},
        created (){
          let _data = {
            pageSize:100,
            pageIndex:1
          };
          resourceList(_data).then((data)=>{
            if(data.code===1){
              this.sourceUrl=data.data;
              this.sourceTwoUrl=this.sourceUrl[0].child;
              this.sourceThreeUrl=this.sourceTwoUrl.child;
            }
          });
        }
    }
</script>
