<!--suppress ALL -->
<template>
  <div class="rules-container">
    <div class="rules-left">
      <el-input v-model="searchDisplayName"
                class="searchInput"
                placeholder="请输入表名"
                icon="upload"
                :on-icon-click="handleReload">
      </el-input>
      <el-scrollbar class="rules-data"
                    tag="div"
                    wrap-class="el-container-data__wrap"
                    view-class="el-container-data__list">
        <el-collapse v-model="activeName" accordion @change="changeCollapse">
          <template  v-for="( item , index) in dataFilterArray">
              <el-collapse-item
                v-if="item.dataSources.length"
                v-for="( _item , _index) in item.dataSources"
                :title="item.displayName + '--' + _item.displayName"
                :name="index + '_' + _index"
                :key="_item.id" >
                <ry-button size="small"
                           v-if="tempDataSourceList.length"
                           v-for="( _item_ , _index_) in  tempDataSourceList"
                           :key="_item_.id"> {{ _item_.displayName && _item_.displayName.length > 17 ? _item_.displayName.slice(0,17) + '...' : _item_.displayName }} <i @click.stop="addData(_item_,_item.id)" class="el-icon-plus el-icon--right"></i></ry-button>
              </el-collapse-item>
          </template>
        </el-collapse>
      </el-scrollbar>

      <el-scrollbar
        class="rules-contact"
        tag="div"
        wrap-class="el-container-rules__wrap"
        view-class="el-container-rules__list">
          <ry-button
            size="small"
            :disabled="buttonDisabled"
            v-for="( item , index) in contactArray"
            :key="item.id">{{ item.displayName }} <i v-show="!buttonDisabled"
                                                     @click="addContactShow(item)"
                                                     class="el-icon-plus el-icon--right"></i></ry-button>
      </el-scrollbar>

      <el-scrollbar
        class="rules-event"
        tag="div"
        wrap-class="el-container-event__wrap"
        view-class="el-container-event__list"
      >
         <ry-button size="small" :disabled="buttonDisabled" v-for="( item , index) in actionArray" :key="item.id">{{ item.displayName }} <i v-show="!buttonDisabled" @click="addContactShow(item)" class="el-icon-plus el-icon--right"></i></ry-button>
      </el-scrollbar>

    </div>
    <div class="rules-right" v-if="!isTemplate">
      <el-scrollbar class="el-scrollbar" tag="div"
        wrap-class="el-container__wrap"
        view-class="el-container__list">
        <ry-button v-for="item in templateArray" size="small" class="ry-button" :key="item.id">
          {{item.taskName}}
          <i @click="addTemplate(item)" class="el-icon-plus el-icon--right"></i>
        </ry-button>
      </el-scrollbar>

    </div>
    <div class="rules-middle" :style="isTemplate ? 'padding-right:0':''">
      <el-scrollbar tag="div" wrap-class="el-container__wrap" view-class="el-container__list">
        <div class="market-rules-box">
          <template v-for="(item,index) in executeStep">
            <div v-if="item.templateId === null" :class="{active:selectedIndex==index}" class="market-rules-cells" @click="selectedArea(item,index)">
              <div class="cell-data">
                <ry-button :key="_index" v-for="(_item,_index) in item.inputSources">
                  <!--@click.stop="changeInputSource(index,_index,_item)"  下次更新-->
                  {{_item.displayName}}
                  <span class="text-red table-edit"
                        v-show="item.actionName && selectedIndex==index"
                        @click.stop="editInputSource(item.inputSources,index,_index)"> < 替换源 <em class="el-icon-edit"></em> > </span>

                  <i @click.stop="remove($event,_index)"
                     v-show="(!item.actionName || (item.actionName && _item.tempInputSource)) && selectedIndex==index"
                     class="el-icon-close el-icon--right"></i>
                </ry-button>
              </div>
              <div class="cell-arrow" v-show="item.actionName">&#xe60d;</div>
              <div class="cell-action" v-show="item.actionName">
                <el-tooltip placement="top" :disabled="!(showParams(item.params))">
                  <div slot="content">
                    <template v-for="n in item.params">
                      <span style="display: block;line-height: 22px;" v-show="n.value">{{ n.paramName }}:{{ n.value }}</span>
                    </template>
                  </div>
                  <ry-button>
                    {{contactName(item.actionName)}}
                    <span class="text-red" v-show="showParams(item.params)" @click="handleEditParams(item.actionName,item.params,index)">< 参数 <i class="el-icon-edit" ></i> ></span>
                  </ry-button>
                </el-tooltip>
              </div>
              <div class="cell-arrow" v-show="item.actionName && item.outputSources.length">&#xe60d;</div>
              <div class="cell-data" v-show="item.outputSources">
                <el-tooltip placement="top" :key="_index"  v-for="(_item,_index) in item.outputSources">
                  <div class="actionList" slot="content">
                    <p v-show="selectedIndex!=index && !!!executeStep[selectedIndex].actionName"  @click="addNewSource(_item,index,true)">合并新源至已选择操作区中？</p>
                    <p @click="addNewSource(_item,index,false)">作为新源进行操作?</p>
                    <p @click="executeAction(item,_index,index,false)">调试新源数据?</p>
                    <p v-show="_item.sourceNo==2"  @click="handleFilter(item,_item,index)">再次拆分?</p>
                  </div>
                  <ry-button @click="renameDialogShow(_item);">
                    {{_item.displayName}}
                    <em class="el-icon-loading" v-show="_item.totalCount===null"></em>
                    <em class="text-red" v-show="_item.totalCount || _item.totalCount ==0"  @click.stop="handlePreview('',_item.tableName)">< 共 {{_item.totalCount}} 条记录></em>
                    <i @click.stop="remove($event,_index,'action',_item.sourceNo,_item,item.outputSources)" v-show="selectedIndex == index" class="el-icon-close el-icon--right"></i>
                  </ry-button>

                </el-tooltip>
              </div>
              <div class="fixed-button">
                <span class="el-icon-delete" @click.stop="remove($event,index,'cell')"></span>
              </div>
            </div>

            <div v-else :class="{active:selectedIndex==index}" class="template_div" @click="selectedArea(item,index)">
              <div v-for="template_item in templateData[item.templateId].taskSteps" class="market-rules-cells">
                <div class="cell-data">
                  <ry-button :key="_index" v-for="(_item,_index) in template_item.inputSources">
                    <!--@click.stop="changeInputSource(index,_index,_item)"  下次更新-->
                    {{_item.displayName}}
                  </ry-button>
                </div>
                <div class="cell-arrow">&#xe60d;</div>
                <div class="cell-action">
                    <ry-button>{{contactName(template_item.actionName)}}</ry-button>
                </div>
                <div class="cell-arrow">&#xe60d;</div>
                <div class="cell-data">
                  <el-tooltip placement="top" :key="_index"  v-for="(_item,_index) in template_item.outputSources">
                    <div class="actionList" slot="content">
                      <p v-show="selectedIndex!=index && !!!executeStep[selectedIndex].actionName"  @click="addNewSource(_item,index,true)">合并新源至已选择操作区中？</p>
                      <p @click="addNewSource(_item,index,false)">作为新源进行操作?</p>
                    </div>
                    <ry-button>
                      {{_item.displayName}}
                    </ry-button>
                  </el-tooltip>
                </div>
              </div>
              <div class="fixed-button">
                <span class="el-icon-delete" @click.stop="remove($event,index,'cell')"></span>
              </div>
            </div>
          </template>
          <div class="rules-btns" v-show="executeStep.length">
            <el-button type="default" @click="$router.back()">返回列表</el-button>
            <el-button :disabled="apiButton" type="success" @click="saveTaskAction($route.params.id)">保存{{isTemplate ? '模板':'规则'}}</el-button>
            <el-button v-if="!isTemplate" :disabled="apiButton" type="warning" @click="saveTaskAction(0,'saveAs')">另存为规则</el-button>
            <el-button :disabled="apiButton" type="pink" @click="saveTaskExcute">执行{{isTemplate ? '模板':'规则'}}</el-button>
          </div>
        </div>
        <div class="rules-box"></div>
      </el-scrollbar>
    </div>

    <el-dialog title="选填参数"
               :visible.sync="dialogShowFlag">
      <params-component :params-list="params"
                        :condition-list="loadConditon"
                        @saveParam="savePara"></params-component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="pink" @click="handleConfirm(params.isEdit)">{{params.isEdit ? '修 改': '确 定'}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改数据源名及tableName"
               custom-class="editTableName"
               :visible.sync="outputSourcesDialog.flag">
      <el-form :model="outputSourcesDialog.form">
        <el-form-item label="数据源显示名" label-width="160px">
          <el-input v-model="outputSourcesDialog.form.name"
                    auto-complete="off"
                    style="width:80%"
                    placeholder="请修改数据源中文显示名"></el-input>
        </el-form-item>
        <el-form-item label="catalogId" label-width="160px">
          <el-autocomplete
            style="width:80%"
            v-model="outputSourcesDialog.form.catalogId"
            :fetch-suggestions="catalogIdSearch"
            placeholder="请修改数据源catalogId"
            :props="outputSourcesDialog.catalogObj"
            :readonly="!!(outputSourcesDialog.form.tableName)"
            @select="handleSelectCatalogId"
          ></el-autocomplete>

        </el-form-item>
        <el-form-item label="数据源追加tableName" label-width="160px">
          <el-autocomplete
            style="width:80%"
            v-model="outputSourcesDialog.form.tableName"
            :fetch-suggestions="tableNameSearch"
            placeholder="请输入数据源追加tableName"
            :props="outputSourcesDialog.propObj"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outputSourcesDialog.flag = false">取 消</el-button>
        <el-button type="pink" @click="renameConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="参数化占位符"
               custom-class="editTableName"
               :visible.sync="inputSourcesDialog.changeFlag">
      <el-form :model="inputSourcesDialog.changeForm" :rules="inputSourcesDialog.rules" ref="changeForm">
        <el-form-item label="catalogId占位符" label-width="160px" required  prop="catalogId">
          <el-input
            style="width:80%"
            v-model="inputSourcesDialog.changeForm.catalogId"
            placeholder="请输入catalogId占位符 eg:{#name:说明}"
          ></el-input>

        </el-form-item>
        <el-form-item label="tableName占位符" label-width="160px" required  prop="tableName">
          <el-input
            style="width:80%"
            v-model="inputSourcesDialog.changeForm.tableName"
            placeholder="请输入tableName占位符 eg:{#name:说明}"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inputSourcesDialog.changeFlag = false">取 消</el-button>
        <el-button type="pink" @click="changeDataConfirm('changeForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title='预览调试' custom-class="pb_30"  size="large" :visible.sync="preview.flag">
      <div class="view-container">
        <el-table
          ref="previewTable"
          :data="preview.tempData.details"
          border
          tooltip-effect="dark"
          style="width: 100%">
              <el-table-column :key="items"
                               v-for=" items in preview.tempData.columns"
                               :prop="items"
                               :label="items"
                               :width="preview.tempData.columns && preview.tempData.columns.length >7 ? items.length*25 : 'auto'"
                               show-overflow-tooltip
                               resizable
                               align="center"> </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="替换输入数据源名" custom-class="editTableName" :visible.sync="inputSourcesDialog.flag">
      <el-form :model="inputSourcesDialog.form">
        <el-form-item label="现数据源名" label-width="160px">
           <el-tag type="danger" v-text="inputSourcesDialog.oldDisplayName"></el-tag>
           <span class="text-red" style="font-size: 10px;margin-left: 5px;">< 替换有风险，操作需谨慎 > </span>
        </el-form-item>
        <el-form-item label="数据源替换" label-width="160px">
          <el-autocomplete
            style="width:80%"
            v-model="inputSourcesDialog.form.displayName"
            :fetch-suggestions="inputSourcesSearch"
            placeholder="请选择数据源数据源替换名"
            :props="inputSourcesDialog.propObj"
            @select="handleInputSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inputSourcesDialog.flag = false">取 消</el-button>
        <el-button type="pink" @click="inputSourcesConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="定时执行" :close-on-click-modal="false" size="medium" :visible.sync="executeItem.flag">
      <div style="margin-bottom:5px;width:100%;text-align:center;">
        <span class="demonstration">执行规则</span>
        <el-radio-group v-model="executeItem.timeConf.loopRule">
          <el-radio label="ONETIME">单次</el-radio>
          <el-radio label="HOUR">每小时</el-radio>
          <el-radio label="DAY">每天</el-radio>
          <el-radio label="WEEK">每周</el-radio>
          <el-radio label="MONTH">每月</el-radio>
        </el-radio-group>
      </div>
      <div style="width:100%;text-align:center;">
        <span v-if="executeItem.timeConf.loopRule === 'ONETIME'" style="color: red;font-size: xx-small;">单次执行时，执行日期不填为立即执行</span>
        <span v-if="executeItem.timeConf.loopRule !== 'ONETIME' && !executeItem.timeConf.executeTime" style="color: red;font-size: xx-small;">非单次执行时，初次执行日期必填</span>
        <br/>
        <span style="color: red;font-size: xx-small;">执行模板任务时,单次执行不影响定时执行的计划,定时执行将会覆盖以前的定时执行计划.普通任务的执行不受影响.</span>
      </div>
      <div style="margin-bottom:15px;width:100%;text-align:center;">
        <span v-if="executeItem.timeConf.loopRule === 'ONETIME'" class="demonstration">执行时间</span>
        <span v-else class="demonstration">初次执行时间</span>
        <el-date-picker
          v-model="executeItem.timeConf.executeTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择执行执行时间">
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="executeItem.flag = false">取 消</el-button>
        <el-button type="pink" @click="execute()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import ParamsComponent from '@/components/Params'
  import RyButton from '@/components/RyButton'
  import {dataSourceList,dtActionExecute,dtActionExecuteAsync,dtActionDebugTask,dtActionList,getColumns,saveTask,executeTask,executeTaskAsync,getTask,previewData,templateList} from '@/api/marketingManage/marketTask-api'
  import { mapState } from 'vuex'

  export default {
    name: 'rules',
    data () {
      return {
        dataArray:[],
        contactArray:[],
        actionArray:[],
        templateArray:{},
        listArray:[],
        searchDisplayName:'',
        selectedIndex:0,
        rulesArray:[],
        tempArray:[],
        templateData:{},
        tempButton:[],
        tempDataSourceList:[],
        tempParams:'',
        temp_el:'',
        buttonDisabled:false,
        dialogShowFlag:false,
        params:{
          type:'',
          label:'',
          key:'',
          isEdit:false,
          arr:[]
        },
        activeName: '',
        refreshFlag:false,
        tempConditon:{},
        loadConditon:{},
        tempConditionList:[],
        executeStep:[],
        taskId:'',
        isTemplate: false,
        taskName:'',
        apiButton:false,
        outputSourcesDialog:{
          flag:false,
          form:{
              id:'',
              catalogId:'',
              name:'',
              tableName:''
          },
          tableNameList:[],
          catalogIdList:[],
          propObj:{
              label: 'label',
              value: 'value'
          },
          catalogObj:{
            label: 'label',
            value: 'value'
          },
          timeout:  null
        },
        inputSourcesDialog:{
          flag:false,
          propObj:{
            label: 'txtFullName',
            value: 'displayName'
          },
          catalogObj:{
            label: 'label',
            value: 'value'
          },
          oldDisplayName:'',
          selectedIndex:0,
          tableNameList:[],
          form:{
            appendType:null,
            catalogId:120,
            parentSourceId:'',
            displayName:"测试号码",
            txtFullName:'',
            fullName:false,
            id:5686,
            identity:"120_testmobiles",
            paramName:null,
            tableName:"testmobiles",
            sourceType:null,
            takeCount:null,
            /*id:'',
            tableName:'',//_el.tableName
            parentSourceId:'',//parentSourceId
            displayName:'',//_el.displayName
            identity:'' //pid +'_'+_el.tableName*/
          },
          timeout:  null,
          changeFlag:false,
          changeForm:{
            tableName:'',
            catalogId:'',
          },
          rules:{
            catalogId: [
              { pattern: /^{#[a-zA-Z0-9]+:[\u4e00-\u9fa5_a-zA-Z0-9]+}$/ ,   required: true, message: '请输入正确占位符', trigger: 'blur' }
            ],
            tableName: [
              { pattern: /^{#[a-zA-Z0-9]+:[\u4e00-\u9fa5_a-zA-Z0-9]+}$/ ,   required: true,  message: '请输入正确占位符', trigger: 'blur' },
            ]
          },
        },
        preview:{
          tempData:[],
          flag:false
        },
        debugTask:{
          websock: null,
          jobId:0,
          timeOut:'',
          selectIndex:0,
          itemIndex:0
        },
        executeItem:{
          flag: false,
          timeConf: {
            loopRule: 'ONETIME',
            executeTime: null
          },
        },

      }
    },
    components: {
      ParamsComponent,
      RyButton
    },
    methods: {
        addData(_el,pid){
            _el.parentSourceId=pid;
            if(this.executeStep.length==0){
              let tempButton=[];
              tempButton.push({
                tableName:_el.tableName,
                parentSourceId:pid,
                displayName:_el.displayName,
                identity:pid+'_'+_el.tableName
              });
              let tempArray={
                actionName: "",
                stepNo: this.executeStep.length + 1,
                inputSources: tempButton,
                outputSources:[],
                params:[],
                templateId:null
              };
              this.executeStep.push(tempArray);
            }else{
              if(!!!this.executeStep[this.selectedIndex].outputSources.length){
                let tempArray=this.executeStep[this.selectedIndex];
                let tempButton=tempArray.inputSources;
                let obj={
                  tableName:_el.tableName,
                  parentSourceId:pid,
                  displayName:_el.displayName,
                  identity:pid+'_'+_el.tableName
                }
                if(tempArray){
                  let filArr = tempButton.filter(item=>{
                    if(item.identity == pid+'_'+_el.tableName){
                      return item
                    }
                  });
                  if(filArr.length){
                    this.$message({
                      showClose: true,
                      message: '已经添加了该数据源，不可重复添加',
                      type: 'error'
                    });
                    return false;
                  };
                  tempButton.push(obj);
                  tempArray.inputSources=tempButton;
                  this.executeStep[this.selectedIndex]=tempArray;
                }
              }else{

                let _frontArr=this.executeStep.slice( 0,this.selectedIndex + 1 );
                let _backArr=this.executeStep.slice( this.selectedIndex + 1 );

                let _tempconFront = this.tempConditionList.slice( 0,this.selectedIndex + 1 );
                let _tempconBack =  this.tempConditionList.slice( this.selectedIndex + 1 );

                let tempButton=[];
                tempButton.push({
                  tableName:_el.tableName,
                  parentSourceId:pid,
                  displayName:_el.displayName,
                  identity:pid+'_'+_el.tableName
                });
                let tempArray={
                  actionName: "",
                  stepNo: _frontArr.length + 1,
                  inputSources: tempButton,
                  outputSources:[],
                  params:[],
                  templateId: null
                };
                _frontArr.push(tempArray);

                _backArr.forEach(item=>{
                    item.stepNo +=1;
                });

                _tempconFront.push({});

                this.selectedIndex= _frontArr.length - 1;

                //合并
                this.executeStep=_frontArr.concat(_backArr);
                this.tempConditionList=_tempconFront.concat(_tempconBack);


                this.buttonDisabled=false;
              }
            }
            let _data={
              parentSourceId:_el.parentSourceId,
              tableName:_el.tableName
            }

            getColumns(_data).then(data=>{
                let tempCondition={};

                if(this.tempConditionList.length>0){
                  tempCondition=this.tempConditionList[this.selectedIndex] || {};
                }

                this.$set(tempCondition,(_el.parentSourceId ? _el.parentSourceId +'_' : '') + _el.tableName,data.data.map((item,index)=>{
                  return {
                    label:item.columnName+'('+_el.displayName+')',
                    value:item.columnName,
                    multi_value:_el.displayName+'.'+item.columnName
                  }
                }));

                this.tempConditionList[this.selectedIndex]=tempCondition;
            });
        },

        addContactShow(_el){
            this.params.arr=[];
            if(this.executeStep.length==0){
                this.$message({
                    showClose: true,
                    message: '请先选择数据源',
                    type: 'error'
                });
                return false;
            }
            let tempArray=this.executeStep[this.selectedIndex];
            let tempButton=tempArray.inputSources;
            if(tempButton.length != _el.inputNo){
                this.$message({
                    showClose: true,
                    message: '请选择仅且'+ _el.inputNo +'种数据源',
                    type: 'error'
                });
                return false;
            }
            this.temp_el=JSON.parse(JSON.stringify(_el));
            this.params.arr=this.temp_el.params.concat();
            this.params.type='contact';
            this.params.isEdit=false;
            this.dialogShowFlag=true;
            this.loadConditon=this.tempConditionList[this.selectedIndex];
        },

        addContact(_el){
          if(this.executeStep.length>0){
            let tempArray=this.executeStep[this.selectedIndex];
            let tempButton=tempArray.inputSources;
            let requireArr = _el.params.filter(item=>{
                if(item.require==1){
                    return !!!item.value
                }
            }) || [];
            if(requireArr.length>0){
              this.$message({
                showClose: true,
                message: '【' + requireArr[0].displayName + '】是必填参数',
                type: 'error'
              });
              return false;
            }
            let tempArr=[];
            tempArray.actionName=_el.actionName
            tempArray.params=JSON.parse(JSON.stringify(_el.params));
            this.executeStep[this.selectedIndex]=tempArray;

            let _tempArr=[]
            if(_el.actionName==='split'){
              _tempArr = _el.params.filter(item=>{
                  return item.paramName==='sourceNo'//后期可能更改参数为'sourceNum'
                }) || [];
            }
            //_el.outputsourceParams.sort(this.compare(''))

            let _tempLength= _tempArr.length ? _tempArr[0].value : 0
            let _length = _tempLength > _el.outputsourceParams.length ? _tempLength : _el.outputsourceParams.length ;
            let i=0;
            while (i < _length){
              let _obj={};
              let _random= Date.parse(new Date());
              let _i = i < _el.outputsourceParams.length-1 ? i :  _el.outputsourceParams.length-1
              _obj={
                displayName: _el.outputsourceParams[_i].displayName + ( i > _el.outputsourceParams.length-1 ? i : ''),
                paramName: _el.outputsourceParams[_i].paramName + ( i > _el.outputsourceParams.length-1 ? i : ''),
                parentSourceId:'',
                identity: _el.outputsourceParams[_i].paramName + _random + i ,
                sourceNo: ( i > _el.outputsourceParams.length-1 ? 2 :  _el.outputsourceParams[_i].paramType)
              }
              tempArr.push(_obj);
              i++;
            }

            tempArray.outputSources = tempArr;

            this.executeStep[this.selectedIndex]=tempArray;
            this.dialogShowFlag = false;
            this.buttonDisabled=true;
            this.params.arr=[];

          }else{
            this.$message({
              showClose: true,
              message: '请先选择数据源',
              type: 'error'
            });
          }
        },

        contactName(name){
            if(name){
              let _name = this.listArray.filter(item=>name==item.actionName);
              return _name[0].displayName;
            }
        },

        addTemplate(template){
          let tempArray={
            actionName: "",
            stepNo: this.executeStep.length + 1,
            inputSources: [],
            outputSources:[],
            params:[],
            templateId: template.id
          };
          this.executeStep.push(tempArray);
        },
        addNewSource(_el,index,flag){ //flag true-合并新源 false-添加新列源
          console.log(_el)
            let addFlag=false;
            let tempArray=this.executeStep[this.selectedIndex];
            let tempButton=tempArray.inputSources;
            let _temp = this.executeStep[this.selectedIndex].params.filter(item=>item.paramName == 'selectfields') || [];
            if(_temp.length){
              _temp = _temp[0].value.split(',').map(item=>{
                if(item){
                  return item.split('.')[1]
                }
              });
            }
            if(flag && this.executeStep.length >1){
              if(index==this.selectedIndex){
                this.$message({
                  showClose: true,
                  message: '请选择其他操作区后再合并源至其他操作区',
                  type: 'error'
                });
                return false;
              }

              if(tempArray.templateId !== null){
                this.$message({
                  showClose: true,
                  message: '不得向模板中添加！',
                  type: 'error'
                });
                return false;
              }

              if(tempArray.outputSources.length>0){
                this.$message({
                  showClose: true,
                  message: '不得向已输出源进行源添加！',
                  type: 'error'
                });
                return false;
              }

              let filArr = tempButton.filter(item=>{
                if(item.identity == _el.identity){
                  return item
                }
              });

              if(filArr.length){
                this.$message({
                  showClose: true,
                  message: '已经添加了该数据源，不可重复添加',
                  type: 'error'
                });
                return false;
              }

              tempButton.push(_el);
              tempArray.inputSources=tempButton;
              this.executeStep[this.selectedIndex]=tempArray;
              this.buttonDisabled=false;
            }else{
              if(tempArray.length<=1 && flag){
                  this.$message({
                      showClose: true,
                      message: '无目标操作区，已自动为您创建新源',
                      type: 'warning'
                  });
              }

              let _frontArr=this.executeStep.slice( 0,this.selectedIndex + 1 );
              let _backArr=this.executeStep.slice( this.selectedIndex + 1 );


              let _tempconFront = this.tempConditionList.slice( 0,this.selectedIndex + 1 );
              let _tempconBack =  this.tempConditionList.slice( this.selectedIndex + 1 );

              tempButton=[];
              tempButton.push(_el);

              tempArray={
                actionName: "",
                stepNo: _frontArr.length + 1,
                inputSources: tempButton,
                outputSources:[],
                params:[],
                templateId: null
              };

              _frontArr.push(tempArray);
              _backArr.forEach(item=>{
                item.stepNo +=1;
              });

              _tempconFront.push({});

              this.selectedIndex= _frontArr.length - 1;

              //合并
              this.executeStep=_frontArr.concat(_backArr);
              this.tempConditionList=_tempconFront.concat(_tempconBack);

              this.buttonDisabled=false;
              addFlag=true;
            }

            let _data={
              parentSourceId:_el.parentSourceId || 0,
              tableName:_el.tableName
            }
            if(!!!_data.tableName){
                console.log('没有表名');
                let tempCondition={};
                if(this.tempConditionList.length>0){
                  if(addFlag){
                    this.tempConditionList.push({});
                  }else{
                    tempCondition=this.tempConditionList[this.selectedIndex];
                  }
                }
                this.$set(tempCondition,_el.parentSourceId+'_'+_el.identity,_temp.map((item,index)=>{
                  return {
                    label:item+'('+_el.displayName+')',
                    value:item,
                    multi_value:_el.displayName+'.'+ item
                  }
                }));
                this.tempConditionList[this.selectedIndex]=tempCondition;
                return false;
            }
            getColumns(_data).then(data=>{
                let tempCondition={};
                if(this.tempConditionList.length>0){
                    if(addFlag){
                      this.tempConditionList.push({});
                    }else{
                      tempCondition=this.tempConditionList[this.selectedIndex];
                    }
                }
                this.$set(tempCondition,(_el.parentSourceId ? _el.parentSourceId +'_' : '')+_el.tableName,data.data.map((item,index)=>{
                    return {
                      label:item.columnName+'('+_el.displayName+')',
                      value:item.columnName,
                      multi_value:_el.displayName+'.'+item.columnName
                    }
                }));
                this.tempConditionList[this.selectedIndex]=tempCondition;
            });
         },

        removeInputSource(index){
          this.executeStep[this.selectedIndex].inputSources.splice(index ,1);
        },

        handleSocketDebug(data){
            if(data.type != 'DEBUG_NEW_SOURCE_DATA'){
                return false;
            }
            if(data.code == 1){
              //let _ele = this.executeStep[data.data.stepNo];
              let _ele = this.executeStep[this.debugTask.selectIndex];
              let _itemIndex = this.debugTask.itemIndex;
              if(data.data.code != 1){
                this.$message.closeAll();
                this.$notify({
                  title: '错误',
                  showClose: true,
                  message: data.data.msg || data.data.message  || '什么都没有,程序员得去祭天了',
                  type: 'error'
                });
                this.$set(_ele.outputSources[_itemIndex],'totalCount',0);
                return false;
              }
              data.data.data.forEach((item,index)=>{
                this.$set(_ele.outputSources[index],'totalCount',item.totalCount);
                this.$set(_ele.outputSources[index],'tableName',item.name);
                console.log(_ele.outputSources[index]);
                this.outputSourcesDialog.form={
                  id : _ele.outputSources[index].identity ,
                  name:_ele.outputSources[index].displayName,
                  tableName:item.name,
                  catalogId:''
                };
                this.renameConfirm();
              });
              this.$message({
                showClose: true,
                message: '调试数据命令执行成功',
                type: 'success'
              });
            }else{
              this.$nextTick(()=>{
                this.$set(_ele.outputSources[_itemIndex],'totalCount',0);
                this.$message({
                  showClose: true,
                  message: data.message,
                  type: 'error'
                });
              })
            }
        },

        handleDebugTask(id,_el,index){
          dtActionDebugTask('',id).then(data=>{
              clearInterval(this.debugTask.timeOut);
              data.data.forEach((item,index)=>{
                this.$set(_el.outputSources[index],'totalCount',item.totalCount);
                this.$set(_el.outputSources[index],'tableName',item.name);
                console.log(_el.outputSources[index]);
                this.outputSourcesDialog.form={
                  id : _el.outputSources[index].identity ,
                  name:_el.outputSources[index].displayName,
                  tableName:item.name,
                  catalogId:''
                };
                this.renameConfirm();
              });
              this.$message({
                showClose: true,
                message: '调试数据命令执行成功',
                type: 'success'
              });
          }).catch((res) =>{
            if(res.code == 1000){
              this.$message({
                showClose: true,
                message: '调试数据中，请等待...',
                type: 'success'
              });
            }else{
              clearInterval(this.debugTask.timeOut);
              this.$nextTick(()=>{
                this.$set(_el.outputSources[index],'totalCount',0);
              })
            }

          });
        },

        executeAction(_el,_index,index){
            this.$set(_el.outputSources[_index],'totalCount',null);
            let _self = this;
            dtActionExecuteAsync(_el).then((data)=>{
              this.$message({
               showClose: true,
               message: '调试数据中，请等待...',
               type: 'success'
              });
              this.debugTask.jobId = data.data;
              this.debugTask.selectIndex = index;
              this.debugTask.itemIndex = _index;
              let _data = {
                type:"DEBUG_NEW_SOURCE_DATA",
                data:{
                  jobId: data.data //,
                  //stepNo: _el.stepNo
                }
              }
              this.sendMessage(_data)
            }).catch((res) =>{
                this.$nextTick(()=>{
                  this.$set(_el.outputSources[_index],'totalCount',0);
                })
            });
        },

        handlePreview(parentSourceId,tableName){
          let _data={
            parentSourceId,
            tableName
          };
          previewData(_data).then(data=>{
            this.preview.tempData = data.data;
            this.preview.flag = true;
          });
        },

        handleFilter(_el,_item,index){
          let _index=0;
          let _tempArr = _el.params.filter((item,index)=>{
            if(item.paramName==='sourceNo'){ //后期可能更改参数为'sourceNo'
                _index=index;
                return item;
            }
          }) || [];

          let _length = _el.outputSources.length;

          let _displayName = _item.displayName.replace(/\d+/g,'');
          let _paramName = _item.paramName.replace(/\d+/g,'');

          let _comArr = _el.outputSources.filter(item => {
              return item.paramName.indexOf(_paramName) > -1
          }) || [];

          let _random= Date.parse(new Date());

          let _obj={
            displayName: _displayName + _comArr.length  ,
            paramName: _paramName + _comArr.length,
            parentSourceId:'',
            identity: _paramName + _random ,
            sourceNo: 2
          }

          _el.outputSources.push(_obj);
          _el.params[_index].value= _length + 1;
          this.executeStep[index]=_el;

        },

        remove(e,index,type,flag,_item,_el){
          e.preventDefault();
          e.stopPropagation();
          if(type=='action'){
            if(flag==2){
              let _index= 0 ;
              let _paramName = _item.paramName.replace(/\d+/g,'');
              let _comArr = _el.filter(item => {
                return item.paramName.indexOf(_paramName) > -1
              }) || [];

              this.executeStep[this.selectedIndex].outputSources.splice(_el.indexOf(_comArr[_comArr.length-1]),1);

              this.executeStep[this.selectedIndex].params.map((item,index)=>{
                  if(item.paramName=='sourceNo'){
                      _index = index;
                  }
              });
              this.executeStep[this.selectedIndex].params[_index].value=this.executeStep[this.selectedIndex].outputSources.length
            }else{
               this.executeStep[this.selectedIndex].outputSources.splice(index,1);
            }
          }else if(type=='cell'){

            let _frontArr=this.executeStep.slice(0,index + 1 );
            let _backArr=this.executeStep.slice( index + 1 );

            let _tempconFront = this.tempConditionList.slice( 0,this.selectedIndex + 1 );
            let _tempconBack =  this.tempConditionList.slice( this.selectedIndex + 1 );

            _frontArr.splice(index,1);
            _tempconFront.splice(index,1);

            _backArr.forEach(item=>{
              item.stepNo -= 1;
            });

            //合并
            this.executeStep=_frontArr.concat(_backArr);
            this.tempConditionList=_tempconFront.concat(_tempconBack);


            this.selectedIndex=0;
            if(this.executeStep.length>0 && this.executeStep[this.selectedIndex].inputSources.length>0 && this.executeStep[this.selectedIndex].actionName){
              this.buttonDisabled=true;
            }else{
              this.buttonDisabled=false;
            }
            return false;
          }else{
            this.executeStep[this.selectedIndex].inputSources.splice(index,1);
          }

          if(this.executeStep[this.selectedIndex].outputSources.length ==0){
            this.executeStep[this.selectedIndex].actionName='';
            this.executeStep[this.selectedIndex].params=[];
            this.buttonDisabled=false;
          }

          if(this.executeStep[this.selectedIndex].inputSources.length==0){

            let _index = this.selectedIndex;

            let _frontArr=this.executeStep.slice(0,this.selectedIndex + 1 );
            let _backArr=this.executeStep.slice(this.selectedIndex + 1 );

            let _tempconFront = this.tempConditionList.slice( 0,this.selectedIndex + 1 );
            let _tempconBack =  this.tempConditionList.slice( this.selectedIndex + 1 );

            _frontArr.splice(this.selectedIndex,1);
            _tempconFront.splice(this.selectedIndex,1);

            _backArr.forEach(item=>{
              item.stepNo -= 1;
            });

            //合并
            this.executeStep=_frontArr.concat(_backArr);
            this.tempConditionList=_tempconFront.concat(_tempconBack);


            this.selectedIndex=0;
            if(this.executeStep[this.selectedIndex] && this.executeStep[this.selectedIndex].inputSources.length>0){
              this.buttonDisabled=true;
            }
          }

        },

        showCancle(_el,_index,index){
          if(index==this.selectedIndex && _index==this.rulesArray[this.selectedIndex].items.length-1 ){
            /*if(_el.type=='temp' && this.rulesArray[this.selectedIndex].items[this.rulesArray[this.selectedIndex].items.length-1].child.length>1){
              return false;
            }*/
            return true;
          }
          return false;
        },

        showParams(_el){
           let flag = _el.some(function(item,key,arr){
                return item.value
            });
           return flag;
        },

      computeTemplateData(){
        this.templateData = {};
        if(!this.isTemplate && this.templateArray){
          let templateDataTemp = {};
          this.templateArray.forEach((item) => {
            templateDataTemp[item.id] = item;
          });
          this.templateData = templateDataTemp;
        }
      },

        handleEditParams(_actionName, _el, _index){
            console.log(_el)
          this.params.arr = JSON.parse(JSON.stringify(_el));
          this.params.type = 'contact';
          this.params.isEdit = true;
          this.dialogShowFlag = true;
          this.selectedIndex = _index;

          this.loadConditon=this.tempConditionList[_index]; //编辑【缺少提示】-- Bug
        },

        selectedArea(_el,index){
            this.selectedIndex=index;
            if(this.executeStep[this.selectedIndex].outputSources.length || this.executeStep[this.selectedIndex].templateId){
                this.buttonDisabled=true;
            }else{
                this.buttonDisabled=false;
            }
        },

        removePara(...arg){
          this.params.arr.splice(arg[0],1);
        },

        savePara(...arg){
          this.temp_el.arr=arg[0];
          this.params.label='';
          this.params.key='';
        },

        handleCancle(){
          this.dialogShowFlag = false;
        },

        handleConfirm(flag){
            if(flag){ // flag true-修改 false-新增
              let tempArray=this.executeStep[this.selectedIndex];
              let requireArr = this.params.arr.filter(item=>{
                  if(item.require==1){
                    return !!!item.value
                  }
                }) || [];
              if(requireArr.length>0){
                this.$message({
                  showClose: true,
                  message: '【' + requireArr[0].displayName + '】是必填参数',
                  type: 'error'
                });
                return false;
              }
              tempArray.params=JSON.parse(JSON.stringify(this.params.arr));
              this.executeStep[this.selectedIndex]=tempArray;
              this.dialogShowFlag = false;
              this.params.arr=[];
            }else{
                if(this.params.type=='action'){
                  this.addAction(this.temp_el);
                }else{
                  this.addContact(this.temp_el);
                }
            }

        },

        renameDialogShow(item){
          item=JSON.parse(JSON.stringify(item));
          this.outputSourcesDialog.flag = true;
          this.outputSourcesDialog.form={
            id : item.identity ,
            name:item.displayName,
            tableName:item.tableName,
            catalogId:item.catalogId
          };
        },

        renameConfirm(){
          var _self=this;
          let _obj=JSON.parse(JSON.stringify(_self.outputSourcesDialog.form))
          _self.executeStep.forEach( (item,index)=>{
            item.inputSources.forEach(_item=>{
              if( _item.identity == _obj.id ){
                _item.displayName = _obj.name || _item.displayName ;
                _item.tableName = _obj.tableName ;
                _item.catalogId = _obj.catalogId ;


                let _data={
                  parentSourceId:_item.catalogId || '',
                  tableName:_item.tableName
                }

                getColumns(_data).then(data=>{
                  let tempCondition={};

                  if(this.tempConditionList.length>0){
                    tempCondition=this.tempConditionList[index] || {};
                  }

                  this.$set(tempCondition,( _item.parentSourceId ? _item.parentSourceId +'_' : '') +_item.tableName,data.data.map( cell=>{
                    return {
                      label:cell.columnName+'(' + _item.displayName+')',
                      value:cell.columnName,
                      multi_value:_item.displayName+'.'+ cell.columnName
                    }
                  }));

                  this.tempConditionList[index]=tempCondition;
                });

              }
            });
            item.outputSources.forEach(_item=>{
              if( _item.identity == _obj.id ){
                _item.displayName = _obj.name || _item.displayName;
                _item.tableName = _obj.tableName ;
                _item.catalogId = _obj.catalogId
              }
            })
          });
          this.outputSourcesDialog.flag = false,
          this.outputSourcesDialog.form ={
              id:'',
              catalogId:'',
              name:'',
              tableName:''
            }

        },

        handleReload(){
            this.refreshFlag=true;
            dataSourceList().then((data)=>{
                this.dataArray=data.data;
                this.$message({
                    showClose: true,
                    message: '数据刷新成功',
                    type: 'success'
                });
                this.refreshFlag=false;
            });
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

        saveTaskAction(id, type){
          if(this.executeStep.length==0){
            this.$message({
              showClose: true,
              message: '请先操作数据再保存！',
              type: 'error'
            });
            return false;
          };
          this.apiButton=true;

          let date = new Date();

          var _taskName= this.taskName || '测试任务' + date.getFullYear() + ('0'+ (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2) + ('0' + date.getSeconds()).slice(-2)
          this.$prompt('是否自定义【规则任务名】？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            inputPattern: /[A-Za-z0-9\u4e00-\u9fa5]+/,
            inputErrorMessage: '规则任务名不能为空',
            inputValue:_taskName,
            inputPlaceholder:'请输入规则任务名'
          }).then(({ value }) => {

            let _data={
              id: type ? '' : parseInt(id) || (this.taskId || '') ,
              taskName:value,
              isTemplate:this.isTemplate,
              executeStep:this.executeStep
            }
            saveTask(_data).then(data=>{
              if(data.code==1){
                this.$message({
                  showClose: true,
                  message: '保存成功！',
                  type: 'success'
                });
                this.taskName = value ;
                this.taskId = data.data;
                this.apiButton=false;
              }
            }).catch(()=>{
              this.apiButton=false;
            });
          }).catch(() => {
            this.apiButton=false;
          });
        },

        saveTaskExcute(){
          this.executeItem.timeConf.loopRule = 'ONETIME';
          this.executeItem.timeConf.executeTime = null;
          this.executeItem.flag = true;
        },
        execute(){
          if(this.executeItem.timeConf.loopRule !== 'ONETIME' && !this.executeItem.timeConf.executeTime){
            this.$message({
              showClose: true,
              message: '非单次执行的初次执行时间为必填!',
              type: 'error'
            });
          }else if(this.executeItem.timeConf.executeTime && this.executeItem.timeConf.executeTime.getTime() < new Date().getTime()){
            this.$message({
              showClose: true,
              message: '执行时间需要在当前时间之后!',
              type: 'error'
            });
          }else{
            this.$message({
              showClose: true,
              message: '执行操作中,请稍等...',
              type: 'success'
            });

            const _map = new Map();
            _map.set('taskId',this.taskId);
            _map.set('executeDate',this.executeItem.timeConf.executeTime);
            _map.set('executeTime',this.executeItem.timeConf.executeTime);

            let desc = '';
            if(this.executeItem.timeConf.loopRule !== 'ONETIME'){
              let cron = '';

              if(this.executeItem.timeConf.loopRule === 'HOUR'){
                cron += '0 '
                  + this.executeItem.timeConf.executeTime.getMinutes()
                  + ' * * * ?';
                desc = '每小时执行';
              }else if(this.executeItem.timeConf.loopRule === 'DAY'){
                cron += '0 '
                  + this.executeItem.timeConf.executeTime.getMinutes()
                  + ' ' + this.executeItem.timeConf.executeTime.getHours()
                  + ' * * ?';
                desc = '每天执行';
              }else if(this.executeItem.timeConf.loopRule === 'WEEK'){
                cron += '0 '
                  + this.executeItem.timeConf.executeTime.getMinutes()
                  + ' ' + this.executeItem.timeConf.executeTime.getHours()
                  + ' ? * ' + (this.executeItem.timeConf.executeTime.getDay() + 1);
                desc = '每周执行';
              }else if(this.executeItem.timeConf.loopRule === 'MONTH'){
                cron += '0 '
                  + this.executeItem.timeConf.executeTime.getMinutes()
                  + ' ' + this.executeItem.timeConf.executeTime.getHours()
                  + ' ' + this.executeItem.timeConf.executeTime.getDate()
                  + ' * ?';
                desc = '每月执行';
              }
              _map.set('executeCron',cron);
            }else{
              desc = '单次执行';
            }
            _map.set('executeDesc',desc);

            _map.set('executeParamArr',[[]]);
            let _data=this.strMapToObj(_map);

            executeTaskAsync(_data).then(data=>{
              if(data.code==1){
                this.commonMessage();
                let batchId = data.data;
                let _data = {
                  type: "DATASOURCE_BATCH",
                  data: {
                    batchId:batchId
                  }
                };
                this.sendMessage(_data);
                this.executeItem.flag = false;
              }
            });
          }
        },
        strMapToObj(strMap) {
          let obj = Object.create(null);
          for (let [k,v] of strMap) {
            obj[k] = v;
          }
          return obj;
        },
        isEmpty(obj){
          for (var name in obj){
            return false;
          }
          return true;
        },

        //鼠标悬浮效果
        toggleShow(){

        },

        conditonGetColumns(parentSourceId,tableName,displayName,selectedIndex){
          let _data={
            parentSourceId,
            tableName
          }

          getColumns(_data).then(data=>{

            let tempCondition = this.tempConditionList.length ? this.tempConditionList[selectedIndex] : { };



            this.$set(tempCondition,(parentSourceId ? parentSourceId + '_' : '') + tableName,data.data.map((item,index)=>{
              return {
                label:item.columnName+'('+ displayName +')',
                value:item.columnName,
                multi_value:displayName+'.'+item.columnName
              }
            }));

            this.$nextTick(function () {
              this.tempConditionList[selectedIndex] = tempCondition ;
            })

            console.log(this.tempConditionList);

          });


        },

        //追加tableName 提示
        tableNameSearch(queryString, cb){
          if(this.outputSourcesDialog.tableNameList.length == 0){
            for (let items of this.dataArray){
              if(items.dataSources.length == 0){
                continue;
              }
              for (let item of items.dataSources){
                if(item.dataSources.length==0){
                  continue;
                }
                for (let _item of item.dataSources){
                  this.outputSourcesDialog.tableNameList.push({
                    value:_item.tableName ,
                    label:_item.displayName + '【' + items.displayName + '-' + item.displayName + '】',
                    name:_item.displayName,
                    catalogId:item.id
                  })
                }
              }
            }
          }

          let _list = this.outputSourcesDialog.tableNameList
          let _results = queryString ? _list.filter(this.createFilter(queryString)) : _list;
          // 调用 callback 返回建议列表的数据
          clearTimeout(this.outputSourcesDialog.timeout);
          this.outputSourcesDialog.timeout = setTimeout(() => {
            cb(_results);
          }, 3000 * Math.random());

        },
        createFilter(queryString) {
          return (item) => {
            return (item.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
          };
        },
        handleSelect(item) {
            this.outputSourcesDialog.form.tableName = item.value;
            this.outputSourcesDialog.form.name = item.name;
            this.outputSourcesDialog.form.catalogId = item.catalogId;
        },

        editInputSource(_el,index,_index){
          this.inputSourcesDialog.flag = true;
          this.inputSourcesDialog.oldDisplayName=_el[_index].displayName
          this.inputSourcesDialog.selectedIndex = _index;
          this.inputSourcesDialog.form={
            appendType:null,
            catalogId:'',
            displayName:"",
            txtFullName:'',
            fullName:false,
            id:'',
            identity:"",
            paramName:null,
            tableName:"",
            sourceType:null,
            takeCount:null,
          }
        },
        inputSourcesConfirm(){
            if(!!!this.inputSourcesDialog.form.displayName){
              this.$message({
                showClose: true,
                message: '请选择要修改的源名',
                type: 'error'
              });
              return false;
            };

            let _obj = this.executeStep[this.selectedIndex].inputSources.some(item =>{
                return item.identity == this.inputSourcesDialog.form.identity
            });

            if(_obj){
                this.$message({
                  showClose: true,
                  message: '已存在的源，请选择其他源',
                  type: 'error'
                });
                return false;
            }

            //替换数据源
            this.executeStep[this.selectedIndex].inputSources.splice(this.inputSourcesDialog.selectedIndex,1,this.inputSourcesDialog.form);

            //获取提示信息参数
            this.conditonGetColumns(
                this.inputSourcesDialog.form.catalogId,
                this.inputSourcesDialog.form.tableName,
                this.inputSourcesDialog.form.displayName,
                this.selectedIndex);

            this.inputSourcesDialog.flag = false;
            //修改参数
            this.handleEditParams(this.executeStep[this.selectedIndex].actionName,
              this.executeStep[this.selectedIndex].params,
              this.selectedIndex)
        },

        inputSourcesSearch(queryString, cb){
          if(this.inputSourcesDialog.tableNameList.length == 0){
            for (let items of this.dataArray){
              if(items.dataSources.length == 0){
                continue;
              }
              for (let item of items.dataSources){
                if(item.dataSources.length==0){
                  continue;
                }
                for (let _item of item.dataSources){
                  this.inputSourcesDialog.tableNameList.push({
                    appendType:null,
                    catalogId:item.id,
                    parentSourceId:item.id,
                    displayName: _item.displayName ,
                    txtFullName:_item.displayName + '【' + items.displayName + '-' + item.displayName + '】',
                    fullName:false,
                    id: _item.id ,
                    identity:item.id +'_'+_item.tableName,
                    paramName:null,
                    tableName:_item.tableName,
                    sourceType:null,
                    takeCount:null
                  })
                }
              }
            }
          }
          let _list = this.inputSourcesDialog.tableNameList;

          if( queryString.indexOf('temp') > -1 ){
            let _executeStep = JSON.parse(JSON.stringify(this.executeStep))
            _executeStep.forEach((cell,index) => {
              if(index != this.selectedIndex){
                cell.outputSources.forEach(_cell =>{
                  return  this.$set(_cell,'txtFullName', _cell.displayName + ' - temp【新增第 ' + (index + 1) + '列输出源】' )
                })
                _list = Array.prototype.concat.apply(_list,cell.outputSources);
              }
            });
          }

          let _results = queryString ? _list.filter(this.createInputFilter(queryString)) : _list;
          // 调用 callback 返回建议列表的数据
          clearTimeout(this.inputSourcesDialog.timeout);
          this.inputSourcesDialog.timeout = setTimeout(() => {
            cb(_results);
          }, 3000 * Math.random());

        },
        createInputFilter(queryString) {
          return (item) => {
            return (item.txtFullName.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
          };
        },
        handleInputSelect(item){
          this.inputSourcesDialog.form = item;
          //this.inputSourcesDialog.form
        },

        changeInputSource(index,_index,_el){
          this.selectedIndex = index;
          this.inputSourcesDialog.changeFlag = true;
          this.inputSourcesDialog.changeForm = {
            tableName:'',
            catalogId:'',
            _index:_index
          }
        },
        changeDataConfirm(formName){
          let _self=this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.executeStep[this.selectedIndex].inputSources[this.inputSourcesDialog.changeForm._index].tableName = this.inputSourcesDialog.changeForm.tableName
              this.executeStep[this.selectedIndex].inputSources[this.inputSourcesDialog.changeForm._index].catalogId = this.inputSourcesDialog.changeForm.catalogId
              this.executeStep[this.selectedIndex].inputSources[this.inputSourcesDialog.changeForm._index].parentSourceId = this.inputSourcesDialog.changeForm.catalogId
              this.inputSourcesDialog.changeFlag = false;
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },

        catalogIdSearch(queryString, cb){
          if(this.outputSourcesDialog.catalogIdList.length == 0){
            for (let items of this.dataArray){
              if(items.dataSources.length == 0){
                continue;
              }
              for (let item of items.dataSources){
                if(item.dataSources.length==0){
                  continue;
                }
                this.outputSourcesDialog.catalogIdList.push({
                  id:item.id.toString() ,
                  label:item.displayName + '【' + item.id + '】',
                  value:item.displayName + '【' + item.id + '】'
                })
              }
            }
          }
          let _list = this.outputSourcesDialog.catalogIdList;

          let _results = queryString ? _list.filter(this.createCatalogFilter(queryString)) : _list;
          // 调用 callback 返回建议列表的数据
          clearTimeout(this.outputSourcesDialog.timeout);
          this.outputSourcesDialog.timeout = setTimeout(() => {
            cb(_results);
          }, 3000 * Math.random());
        },
        handleSelectCatalogId(item){
          this.outputSourcesDialog.form.catalogId = item.id;
        },

        createCatalogFilter(queryString) {
          return (item) => {
            return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
          };
        },

        sendMessage(data) {
            this.$socket.emit('request',JSON.stringify(data));
        },
        commonMessage(){
           this.$message({
          showClose: true,
          message: this.$createElement('p',null, [
            '任务提交成功',
            this.$createElement('a', {
              attrs:{
                href:'#/home/marketbatch'
              },
              class:'common-link'
            }, '去查看')
          ]),
          type: 'success'
        });
        },

      loadTask(){
        if(this.$route.params.id>0){
          getTask('',this.$route.params.id).then(data=>{
            if (Array.isArray(data.data.taskSteps)) {
              if(data.data.taskSteps.length>0){

                this.executeStep = data.data.taskSteps;
                this.buttonDisabled=true;
                this.selectedIndex=data.data.taskSteps.length-1;
                this.taskId=this.$route.params.id;
                this.taskName=data.data.taskName;
                this.isTemplate = data.data.taskType === 'TEMPLATE' ? true:false;
                this.tempConditionList.length = this.executeStep.length;

                this.executeStep.forEach((items,index) => {
                  items.inputSources.forEach( _item => {
                    let _data={
                      parentSourceId:_item.parentSourceId,
                      tableName:_item.tableName
                    }

                    let tempCondition={};

                    if(this.tempConditionList.length>0){
                      tempCondition=this.tempConditionList[index] || {};
                    }

                    if(!_item.tableName){
                      this.tempConditionList[index]=tempCondition;
                      return false;
                    }

                    getColumns(_data).then(data=>{
                      this.$set(tempCondition,(_item.parentSourceId ? _item.parentSourceId +'_' : '') + _item.tableName,data.data.map((item,_index)=>{
                        return {
                          label:item.columnName+'('+_item.displayName+')',
                          value:item.columnName,
                          multi_value:_item.displayName +'.'+ item.columnName
                        }
                      }));
                      this.tempConditionList[index]=tempCondition;
                    });

                  })
                })

              }
            } else {
              console.error('taskSteps must be an array');
            }
          });
        };
      },

        changeCollapse(item){
          if(item){
            let _arr = item.split('_');
            this.tempDataSourceList = this.dataFilterArray[_arr[0]].dataSources[_arr[1]].dataSources;
          }

        }

  },
    computed: {
        dataFilterArray(){
            let _key = this.searchDisplayName ;
            let _data = JSON.parse(JSON.stringify(this.dataArray));
            let _newData;
            _newData = _data.filter(item=>{
              item.dataSources = item.dataSources.filter(cell => {
                  cell.dataSources = cell.dataSources.filter(_cell=>{
                    return _cell.displayName.toLowerCase().indexOf(_key.toLowerCase()) > -1
                  });
                  return cell.dataSources.length;
                });
                return item.dataSources.length;
            });
            return _newData;
        },
        ...mapState({
          socketMessage: state=>state.socket.message
        })
    },
    watch:{
      socketMessage(val,old){
          if(val){
             this.handleSocketDebug(val);
          }
      }
    },
    created() {
      dataSourceList().then((data)=>{
          this.dataArray=data.data;
      });

      dtActionList().then((data)=>{
          this.listArray=data.data.map(item=>{
              item.params.sort(this.compare('require',1));
              item.outputsourceParams.sort(this.compare('paramType',-1));
              return item;
          });
          this.actionArray=this.listArray.filter(item=>item.type=='action');
          this.contactArray=this.listArray.filter(item=>item.type=='contact');
      });

      if(this.$route.params.isTemplate){
        this.isTemplate = this.$route.params.isTemplate;
        this.loadTask();
      }else{
        this.isTemplate = false;
        templateList().then((data) => {
          this.templateArray = data.data;
          this.computeTemplateData();
          this.loadTask();
        });
      }
    }
  }
</script>

<style lang="scss">
  .rules-container{
    .rules-left{
      float: left;
      height: 550px;
      width:240px;
      border-right: 1px solid #eee;
      div[class^="rules-"]{
        border-bottom: 1px solid #eee;
        padding: 15px;
        &:last-child{
          border-bottom: 0;
        }
      }
      .rules-data{
        height: 210px;
        padding: 0px !important;
        position:relative;
        .el-container-data__wrap{
          padding: 0;
          height: 100%;
          overflow-x: hidden;
        }
      }
      .el-scrollbar.rules-contact{
        height: 190px;
        padding:0 !important;
        .el-container-rules__wrap{
          padding: 10px 15px 0px 15px;
          height: 100%;
          overflow-x: hidden;
        }
      }
      .el-scrollbar.rules-event{
        padding:0 !important;
        height: calc(100% - 436px);
        .el-container-event__wrap{
          padding: 10px 15px 0px 15px;
          height: 100%;
          overflow-x: hidden;
        }
      }
      .el-button{
        display: table;
        margin-bottom: 10px;
        margin-left: 0px;
        i{
          font-size: 11px;
        }
      }
    }

    .rules-right {
      float: right;
      height: 550px;
      width: 240px;
      border-right: 1px solid #eee;
      .ry-button{
        margin-top: 5px;
      }
      .el-scrollbar{
        height: calc(100%);
        padding: 0px !important;
        position:relative;
        .el-container__wrap{
          max-height: 550px;
        }
      }
      .el-button{
        display: table;
        margin-bottom: 10px;
        margin-left: 0px;
        i{
          font-size: 11px;
        }
      }
    }

    .rules-middle{
      width: 100%;
      height: 550px;
      padding: 0 240px 0 240px;
      box-sizing: border-box;
      .el-scrollbar{
        .el-container__wrap{
          max-height: 550px;
        }
      }

      .market-rules-box{
        width:100%;
        height: 100%;
        padding: 20px;
        .market-rules-cells{
          box-sizing: border-box;
          overflow: hidden;
          padding: 15px 15px 5px 15px;
          margin-top: 19px;
          margin-bottom: 0;
          border: 1px dashed #D3DCE6;
          display: flex;
          display: -webkit-flex;
          -webkit-flex-flow: row nowrap;
          flex-flow:row nowrap ;
          -webkit-justify-content: flex-start;
          justify-content:flex-start;
          -webkit-align-items:center;
          align-items:center;
          position: relative;
          &:first-child{
            margin-top: 0;
          }
          &.active{
            border: 1px dashed #13CE66;
            box-sizing: border-box;
            &:before{
              content: '';
              display: block;
              position:absolute;
              top:0;
              left: 0;
              width:0;
              height: 0;
              border-top:27px solid #13CE66;
              border-right:27px solid transparent;
            }
          }
        }
        .template_div{
          position: relative;
          margin-top: 19px;
          border: 1px dashed #D3DCE6;
          background-color: #eff2f7;
          &:first-child{
            margin-top: 0;
          }
          &.active{
            border: 1px dashed #8146C2;
            box-sizing: border-box;
            &:before{
              content: '';
              display: block;
              position:absolute;
              top:0;
              left: 0;
              width:0;
              height: 0;
              border-top:27px solid #8146C2;
              border-right:27px solid transparent;
            }
          }
        }
        .fixed-button{
          width: 50px;
          height: 100%;
          position: absolute;
          right: 0;
          top:0;
          bottom:0;
          font-size: 12px;
          color: #fff;
          text-align: center;
          //border-left: 1px dashed #13CE66;
          display: flex;
          display: -webkit-flex;
          flex-flow: column nowrap;
          -webkit-flex-flow: column nowrap;
          justify-content: center;
          -webkit-justify-content: center;
          span{
            box-sizing: border-box;
            width: 25px;
            height: 25px;
            margin: 0 auto;
            line-height: 25px;
            //border: 1px solid #E76B5F;
            border-radius: 50%;
            color: #E76B5F;
            font-size: 18px;
            cursor: pointer;
          }
        }
        [class^='cell-']{
          float: left;
          width:auto;

        }
      }

      .market-rules-cells{
        .el-button{
          display: table;
          margin-bottom: 10px;
          margin-left: 0px;
          margin-right: 10px;
          position: relative;
          i{
            font-size: 11px;
          }
          &:hover{
            color: #1f2d3d;
            border-color: #c4c4c4;
          }
        }
      }
      .task-save{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 120px;
        height: 45px;
        line-height: 45px;
        color: #fff;
        background-color: #E76B5F;
        text-align: center;
        cursor: pointer;
      }
      .table-edit{
        em{
          font-size: 11px;
        }
      }
    }
    .el-collapse{
      border: 0px;
      .el-collapse-item__header{
         border-bottom: 0px solid #f1f1f1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-collapse-item__wrap{
        border-bottom: 0px
      }
    }
    .icon-refresh{
      position: absolute;
      top: 7px;
      right: 4px;
      color: #e76b5f;
      background-color: #fff;
      display: block;
      height: 22px;
      width: 22px;
      line-height: 22px;
      text-align: center;
    }
    .searchInput input[type=text]{
      border-radius: 0;
      border: 0;
      border-bottom: 1px solid #ccc;
      padding-left: 15px;
      font-size: 13px;
    }
    .searchInput .el-input__icon{
      color: #e76b5f;
    }
  }
  .actionList{
    p{
      line-height: 25px;
      cursor: pointer;
    }
  }
  .editTableName{
    input[readonly = readonly]{
      background-color: #fbfbfb !important;
      color: #b2afaf;
      cursor: not-allowed;
      &::-webkit-input-placeholder{
        //color: #aaa;
      }
    }
  }
</style>
