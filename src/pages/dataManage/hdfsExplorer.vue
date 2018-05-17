<template>
    <div class="hdfs-explorer-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="上传HDFS文件" name="first">
              <div class="adfs-upload">
                  <el-form :model="hdfs.upload" ref="hdfs_upload" label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
                    <el-form-item
                      label="文件名称"
                      prop="fileName"
                      :rules="[
                      { required: true, message: '文件名不能为空'}
                    ]"
                    >
                    <el-input placeholder="请输入hdfs文件名" style="width:100%" type="fileName" v-model="hdfs.upload.fileName"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="选择文件">
                      <upload-component
                        @changeFile="changeFile"
                        name-type="upload"
                        :input-txt="hdfs.upload.txtName"
                      ></upload-component>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="pink" :disabled="hdfs.disabled" @click="submitForm('hdfs_upload')">提交</el-button>
                      <el-button @click="resetForm('hdfs_upload')">重置</el-button>
                    </el-form-item>
                  </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="删除HDFS文件" name="second">
              <div class="adfs-delete">
                <el-form :model="hdfs.deleteObject" :rules="rules" ref="deleteObject" label-width="120px" class="demo-ruleForm">
                  <el-form-item label="文件名称" prop="fileName">
                    <el-autocomplete placeholder="请输入hdfs文件名"  style="width:100%" :fetch-suggestions="querySearchAsync" @select="handleSelect" v-model="hdfs.deleteObject.fileName"></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="是否级联删除">
                    <el-radio-group v-model="hdfs.deleteObject.recursive">
                      <el-radio :label="false"></el-radio>
                      <el-radio :label="true"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="pink" :disabled="hdfs.disabled" @click="submitForm('deleteObject')">删除文件</el-button>
                    <el-button @click="resetForm('deleteObject')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="数据源建表" name="three">
               <div class="hive-table">
                 <el-form :model="hdfs.DSPHive" :rules="rules" ref="DSPHive" label-width="120px" class="demo-ruleForm">
                   <el-form-item label="HDFS文件名">
                     <el-autocomplete  style="width:100%" :fetch-suggestions="querySearchAsync" @select="handleSelect"  v-model="hdfs.DSPHive.fileName" placeholder="请输入hdfs文件名"></el-autocomplete>
                   </el-form-item>
                   <el-form-item label="数据源名">
                     <el-input v-model="hdfs.DSPHive.dataSourceName" placeholder="请输入数据源名"></el-input>
                   </el-form-item>

                   <el-form-item label="数据源保存类型" v-if="!!!hdfs.DSPHive.tableName">
                     <el-select
                       clearable
                       :style="{'width': hdfs.DSPHive.tableStrategy == 5 ? 'auto' : '100%'}"
                       v-model="hdfs.DSPHive.tableStrategy"
                       placeholder="请选择数据源保存类型">
                       <el-option
                         v-for="item in hdfs.defaultTableType"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
                     </el-select>
                     <el-input v-if="hdfs.DSPHive.tableStrategy==5"
                               v-model="hdfs.DSPHive.retainDay"
                               style="width:33%"
                               max="90"
                               placeholder="自定义天数"></el-input>
                   </el-form-item>
                   <el-form-item label="Hive表名"  v-if="!!!hdfs.DSPHive.tableStrategy">
                     <el-input v-model="hdfs.DSPHive.tableName" placeholder="请输入Hive表名"></el-input>
                   </el-form-item>

                   <el-form-item label="列值分隔符" prop="_delimited">
                     <el-input ref="delimit" v-model="hdfs.DSPHive._delimited" placeholder="列值分隔符" @change="convertData"></el-input>
                   </el-form-item>

                   <el-form-item label="数据表列">
                     <div class="hive-table-list" v-for=" (value , index) in hdfs.DSPHive.columns_key">
                         <el-input v-model="value.name" placeholder="列字段名"></el-input>
                         <el-select v-model="value.type" placeholder="列字段类型">
                           <el-option :key="index" v-for="(item ,index) in hdfs.defaultType" :label="item.toLowerCase()" :value="item.toLowerCase()"></el-option>
                         </el-select>
                         <el-button type="default" icon="plus" v-show="hdfs.DSPHive.columns_key.length == index+1" @click="addDomain"></el-button>
                         <el-button type="default" icon="minus" v-show="hdfs.DSPHive.columns_key.length != index+1 && hdfs.DSPHive.columns_key.length > 1" @click.prevent="removeDomain(domain,index)"></el-button>
                     </div>
                   </el-form-item>
                   <el-form-item>
                     <el-button type="pink" :disabled="hdfs.disabled" @click="submitForm('DSPHive')">立即创建</el-button>
                     <el-button @click="resetForm('DSPHive')">重置</el-button>
                   </el-form-item>
                 </el-form>
               </div>
            </el-tab-pane>
            <el-tab-pane label="导入或上传文件到HIVE表" name="four">
              <div class="hive-import">

                  <el-form :model="hdfs.importHive" ref="importHive" label-width="120px" class="demo-ruleForm"  enctype="multipart/form-data">

                    <el-form-item label="导入/上传" prop="resource">
                      <el-radio-group v-model="hdfs.importHive.isType" @change="changeRadio">
                        <el-radio :label="1">Excel上传</el-radio>
                        <el-radio :label="2">Avro导入</el-radio>
                        <el-radio :label="3">hdfs数据追加</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="数据源名" v-if="hdfs.importHive.isType!=3">
                      <el-input v-model="hdfs.importHive.dataSourceName" placeholder="请输入数据源名"></el-input>
                    </el-form-item>

                    <el-form-item label="是否追加" prop="resource" v-if="hdfs.importHive.isType == 1">
                      <el-radio-group v-model="hdfs.importHive.isAppend">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="数据源保存类型" v-if="!!!hdfs.importHive.tableName && hdfs.importHive.isType!=3 && hdfs.importHive.isAppend == 0">
                      <el-select
                        clearable
                        :style="{'width': hdfs.importHive.tableStrategy == 5 ? 'auto' : '100%'}"
                        v-model="hdfs.importHive.tableStrategy"
                        placeholder="请选择数据源保存类型">
                        <el-option
                          v-for="item in hdfs.defaultTableType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-input v-if="hdfs.importHive.tableStrategy==5"
                                v-model="hdfs.importHive.retainDay"
                                style="width:33%"
                                max="90"
                                placeholder="自定义天数"></el-input>
                    </el-form-item>

                    <el-form-item
                      label="Hive表名"
                      prop="tableName"
                      v-if="(!!!hdfs.importHive.tableStrategy || hdfs.importHive.isType == 3) && hdfs.importHive.isAppend == 0"
                      :rules="[
                        { required: true, message: '文件表名不能为空'}
                      ]"
                    >
                      <el-input placeholder="请输入hive表名" v-model="hdfs.importHive.tableName" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item
                      label="avor文件"
                      prop="avroFile"
                      :rules="[
                        { required: true, message: 'Avor文件名不能为空'}
                      ]"
                      v-if="hdfs.importHive.isType==2"
                    >
                      <el-input placeholder="请输入Avor文件名" v-model="hdfs.importHive.avroFile" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="hdfs文件名"
                      prop="fileName"
                      :rules="[
                        { required: true, message: 'hdfs文件名不能为空'}
                      ]"
                      v-else-if="hdfs.importHive.isType==3"
                    >
                      <el-autocomplete style="width:100%" :fetch-suggestions="querySearchAsync" @select="handleSelect"  placeholder="请输入hdfs文件名" v-model="hdfs.importHive.fileName" auto-complete="off"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="选择文件"  v-else-if="hdfs.importHive.isType==1">
                      <upload-component
                        @changeFile="changeFile"
                        name-type="importHive"
                        :input-txt="hdfs.importHive.txtName"
                        accept-type=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      ></upload-component>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="pink" :disabled="hdfs.disabled" @click="submitForm('importHive')">提交</el-button>
                      <el-button @click="resetForm('importHive')">重置</el-button>
                    </el-form-item>
                  </el-form>
              </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { hdfsUpload ,hdfsDelete,hiveTable,loadAvroData,uploadExcel,loadHdfsData,fileList } from '@/api/dataManage/sourceData-api'
    import UploadComponent from  '@/components/upload'
    import * as _ from '@/util/util'
    export default {
        name: 'hdfsExplorer',
        data () {
            return {
                activeName: 'first',
                hdfs: {
                    upload:{
                        fileName:'',
                        uploadFile:{},
                        orgId :1,
                        txtName:''
                    },
                    deleteObject:{
                        fileName: '',
                        recursive:false,
                        orgId :1,
                    },
                    DSPHive:{
                        columns_key :[{
                            name:'',
                            type:''
                        }],
                        columns :[],
                        _delimited :'',
                        delimited :'',
                        isExternal :false,
                        orgId :1,
                        fileName:'',
                        dataSourceName:'',
                        tableName :'',
                        tableStrategy:'',
                        retainDay:''
                    },
                    importHive:{
                      tableName:'',
                      fileName:'',
                      orgId:1,
                      avroFile:'',
                      uploadFile:{},
                      isType:1,
                      isExternal:false,
                      isAppend: 0,
                      txtName:'',
                      dataSourceName:'',
                      tableStrategy:'',
                      retainDay:''
                    },
                    defaultType:["TINYINT","SMALLINT","INT","BIGINT","BOOLEAN","FLOAT","DOUBLE","STRING","BINARY","TIMESTAMP","DECIMAL","CHAR","VARCHAR","DATE"],
                    defaultTableType:[
                      {value:'1',label:'永久表< 永久有效，人工定期巡检维护 >'},
                      {value:'2',label:'短期表< 最长保留 7天 >'},
                      {value:'3',label:'中期表< 最长保留30天 >'},
                      {value:'4',label:'长期表< 最长保留90天 >'},
                      {value:'5',label:'自定义表< 最长天数不超过90 >'}],
                    disabled:false,
                    fileList:[],
                    loading: false,
                },
                rules: {
                  fileName: [
                    { required: true, message: '请输入文件名称', trigger: 'change' },
                  ],
                  tableName: [
                    { required: true, message: '请输入hive表名', trigger: 'change' }
                  ],
                  _delimited: [
                    { required: true, message: '列值分隔符', trigger: 'change' }
                  ]
              }
            }
        },
        components: {
          UploadComponent
        },

        methods: {
          handleClick(tab, event) {
            console.log(tab, event);
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(formName=='hdfs_upload'){
                  let _data = new FormData();
                  _data.append('fileName', this.hdfs.upload.fileName);
                  _data.append('orgId', this.hdfs.upload.orgId);
                  _data.append('uploadFile', this.hdfs.upload.uploadFile);
                  this.hdfs.disabled=true;
                  hdfsUpload(_data).then(data=>{
                    this.$message({
                      showClose: true,
                      message: this.$createElement('p',null, [
                        data.msg,
                        this.$createElement('a', {
                          attrs:{
                            href:'#/home/taskProgress'
                          },
                          class:'common-link'
                        }, '去查看')
                      ]),
                      type: 'success'
                    });
                    this.hdfs.disabled=false;
                    this.resetForm(formName);
                  }).catch(()=>{
                    this.hdfs.disabled=false;
                  });
                }else if(formName=='deleteObject'){
                  this.hdfs.disabled=true;
                  hdfsDelete(this.hdfs.deleteObject).then(data=>{
                    this.$message({
                      showClose: true,
                      message: '文件删除成功！',
                      type: 'success'

                    });
                    this.hdfs.disabled=false;
                  }).catch(()=>{
                    this.hdfs.disabled=false;
                  });
                }else if(formName=='DSPHive'){

                  this.hdfs.DSPHive.columns=this.hdfs.DSPHive.columns_key.map(item=>{
                      let _item=[];
                      _item.push(item.name);
                      _item.push(item.type)
                      return _item;
                  }) || [];
                  this.hdfs.disabled=true;
                  if(this.hdfs.DSPHive.tableName){
                      this.hdfs.DSPHive.tableStrategy = '';
                      this.hdfs.DSPHive.retainDay = '';
                  }
                  hiveTable(this.hdfs.DSPHive).then(data=>{
                    this.$message({
                      showClose: true,
                      message: '表创建成功！',
                      type: 'success'
                    });
                    this.hdfs.disabled=false;
                  }).catch(()=>{
                    this.hdfs.disabled=false;
                  });
                }else if(formName=='importHive'){
                  this.hdfs.disabled=true;
                  if(this.hdfs.importHive.isType==3){
                    loadHdfsData(this.hdfs.importHive).then(data=>{
                      this.$message({
                        showClose: true,
                        message: 'hdfs数据追加成功！',
                        type: 'success'
                      });
                      this.hdfs.disabled=false;
                    }).catch(()=>{
                      this.hdfs.disabled=false;
                    });
                  }else if(this.hdfs.importHive.isType==2){
                      loadAvroData(this.hdfs.importHive).then(data=>{
                        this.$message({
                          showClose: true,
                          message: 'Avro表导入成功！',
                          type: 'success'
                        });
                        this.hdfs.disabled=false;
                      }).catch(()=>{
                        this.hdfs.disabled=false;
                      });
                    }else{
                      let _data = new FormData();
                      _data.append('tableName', this.hdfs.importHive.tableName);
                      _data.append('tableStrategy', this.hdfs.importHive.tableStrategy);
                      _data.append('retainDay', this.hdfs.importHive.retainDay);
                      _data.append('dataSourceName', this.hdfs.importHive.dataSourceName);
                      _data.append('isAppend', this.hdfs.importHive.isAppend);
                      _data.append('orgId', this.hdfs.importHive.orgId);
                      _data.append('uploadFile', this.hdfs.importHive.uploadFile);
                      uploadExcel(_data).then(data=>{
                        let _data_ = {
                          type: "HIVE_UPLOAD",
                          data: data.data
                        };
                        this.sendMessage(_data_); //下次上线更新
                        this.$message({
                          showClose: true,
                          message: 'Excel表提交成功！',
                          type: 'success'
                        });
                        this.hdfs.disabled=false;
                      }).catch(()=>{
                        this.hdfs.disabled=false;
                      });
                    }
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          resetForm(formName) {
            if(formName=='hdfs_upload'){
              this.hdfs.upload.txtName='';
            }else if(formName=='importHive'){
              this.hdfs.importHive={
                tableName:'',
                fileName:'',
                orgId:1,
                avroFile:'',
                uploadFile:{},
                isType:1,
                isExternal:false,
                txtName:'',
                isAppend: 0,
                dataSourceName:'',
                tableStrategy:'',
                retainDay:''

              }
            }else if(formName=='DSPHive'){
              //this._delimited = '';
              this.hdfs.DSPHive={
                columns_key :[{
                  name:'',
                  type:''
                }],
                  columns :[],
                  _delimited :'',
                  delimited :'',
                  dataSourceName:'',
                  isExternal :false,
                  orgId :1,
                  tableName :'',
                  tableStrategy:'',
                  retainDay:''
              };

            }
            this.$refs[formName].resetFields();
            this.getFileList();
          },

          changeRadio(val){
              console.log(1111);
              this.hdfs.importHive.isAppend = 0
              this.hdfs.importHive.tableName = '';
              this.hdfs.importHive.dataSourceName = '';
              this.hdfs.importHive.tableStrategy = '';
              this.hdfs.importHive.retainDay = ''
          },

          convertData(val){
              console.log('convert:'+ val);
             this.hdfs.DSPHive.delimited = _.encodeUnicode(val)
          },

          sendMessage(data) {
            this.$socket.emit('request',JSON.stringify(data));
          },

          //上传HDFS
          changeFile(...args){
             if(args[1]=='upload'){
               this.hdfs.upload.uploadFile = args[0];
               this.hdfs.upload.txtName = args[0].name;
               if(!!!this.hdfs.upload.fileName){
                 this.hdfs.upload.fileName = args[0].name.split('.')[0]
               }
             }else{
               this.hdfs.importHive.uploadFile = args[0];
               this.hdfs.importHive.txtName = args[0].name;
             }

          },
          //Hive建表部分
          removeDomain(item,index) {
            if (index !== -1) {
              this.hdfs.DSPHive.columns_key.splice(index, 1)
            }
          },
          addDomain() {
            this.hdfs.DSPHive.columns_key.push({
              name: '',
              type: ''
            });
          },
          getFileList(){
            let _data={
              orgId:0,
              fileName:''
            };
            fileList(_data).then(data=>{
              this.$nextTick(()=>{
                this.hdfs.fileList=data.data.map(item=>{
                  return { value:item }
                });
              });
            });
          },

          //搜索提示
          querySearchAsync(queryString, cb) {
            let _list = this.hdfs.fileList;
            let _results = queryString ? _list.filter(this.createStateFilter(queryString)) : _list;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(_results);
            }, 3000 * Math.random());
          },
          createStateFilter(queryString) {
            return (state) => {
              return (state.value.indexOf(queryString.toLowerCase()) >= 0);
            };
          },
          handleSelect(item) {
            console.log(item);
          }
        },
        computed: {
            _delimited:{
              get: function() {
                  console.log('vue：'+ this.hdfs.DSPHive.delimited);
                  //return (this.hdfs.DSPHive.delimited);
                /*return this.hdfs.DSPHive.delimited ?
                  if(this.hdfs.DSPHive.delimited){
                    return this._delimited ;
                  }else{
                    return this.hdfs.DSPHive.delimited
                  }*/
              },
              set: function(value) {
                //  console.log(value);
                if(value!=''){
                  //this.hdfs.DSPHive.delimited = _.encodeUnicode(value);
                }else{
                  // this.hdfs.DSPHive.delimited = '';
                }
              }
            }
        },
        mounted() {
          let _data={
            orgId:0,
            fileName:''
          };
          fileList(_data).then(data=>{
              this.hdfs.fileList=data.data.map(item=>{
                  return { value:item }
              });
          });
        },
        created() {

        }
    }
</script>

<style lang="scss">

</style>
