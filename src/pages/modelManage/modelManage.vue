<template>
  <div class="statistical-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
              <el-input :span="5" v-model="searchData.key"  placeholder="请输入名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.type" :span="5" placeholder="请选择类型" clearable filterable >
                <el-option :label="'测试'" :value="0"></el-option>
                <el-option :label="'正式'" :value="1"></el-option>
              </el-select>

            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="button" class="search-btn" @click="searchEvent">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="success" class="search-add"  @click="addListEvent('editDialogForm')">新增</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="search-table">
          <el-table
            ref="multipleTable"
            :data="tableData"
            v-loading="loading2"
            element-loading-text="拼命加载中"
            height="400"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="id" label="#"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="name" label="父类名称"  show-overflow-tooltip> </el-table-column>
            <!--<el-table-column prop="type" label="类型"  show-overflow-tooltip> </el-table-column>-->
            <el-table-column prop="categoryId" label="分类ID" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="childName" label="子类名称" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="params" label="参数" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="type" label="类型" show-overflow-tooltip> </el-table-column>
            <el-table-column label="操作"  show-overflow-tooltip width="250">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  :disabled= "scope.row.status==1?false:true"
                  @click="handleEdit('editDialogForm', scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  :type="scope.row.status === 1 ? 'gray' : 'success'"
                  @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                <el-button
                  size="small"
                  :disabled= "scope.row.status==1?false:true"
                  :type="'success'"
                  @click="EditPbthParm3(scope.$index, scope.row)">模型测试</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-col>
            <div class="search-page">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!--选择任务-->
    <el-dialog :title="'选择任务'" :visible.sync="addDialogParamVisible3">
      <!--<el-row style="margin-bottom: 15px;">-->
        <!--<el-col :span="12" :offset="4">-->
        <!--<el-input placeholder="请输入任务名称" v-model="searchParamItem2Data"></el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<el-button  class="selctParams" type="primary" icon="search" @click="searchParam2Item">搜索</el-button>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-button  class="selctParams" style="margin-left: 0;margin-right:15px;" type="primary" v-for="(item , index) in taskListData" :key="item.id" @click.stop="handleParamsExecute(item)">
        {{ item.id}}：<em style="color:chartreuse">{{ item.taskName }}</em>
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="14">
            <el-col :span="19" >
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChangeParam2"
                :total="taskPage.total"
                :current-page="taskPage.currentPage"
                :page-size ="taskPage.pageSize">
              </el-pagination>
            </el-col>
            <el-col :span="1">

            </el-col>
          </el-col>
          <el-col :span="10">
            <el-button @click="addDialogParamVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="addDialogParamVisible3 = false">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!--填写测试参数-->
    <el-dialog top="12vh" title='请填写测试参数' :close-on-click-modal="false" size="medium" :visible.sync="paramsItem2.flag">

      <!--<el-form ref="step2Form" :model="step2Form" class="fSelect" :rules="rules">-->
        <!--&lt;!&ndash;<el-form-item label="应用名称" prop="appName" :label-width="formLabelWidth">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-input v-model="step2Form.appName" placeholder="请输入应用名称"></el-input>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-form-item label="业务说明" :prop="topFormShow.batchDescriptionId?'batchDescriptionId':''" :label-width="formLabelWidth" v-show = 'topFormShow.batchDescriptionId'>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-select v-model="step2FormModel.batchDescriptionId" :span="5" value-key="id" placeholder="请选业务说明" clearable filterable @change="batchDescriptionFn">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-option :label="item.name" :value="item" v-for="(item,index) in paramsItem.defaultItems.batchDescriptionId" :key="item.id"></el-option>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--<el-form-item label="渠道号" :prop="topFormShow.channel?'channel':''" :label-width="formLabelWidth" v-show = 'topFormShow.channel'>-->
          <!--<el-input v-model="step2Form.channel" placeholder="请输入渠道号"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="城市名称" :prop="topFormShow.cityName?'cityName':''" :label-width="formLabelWidth" v-show = 'topFormShow.cityName'>-->
          <!--<el-input v-model="step2Form.cityName" placeholder="请输入城市名称"></el-input>-->
        <!--</el-form-item>-->
        <!--&lt;!&ndash;<el-form-item label="用户类型" prop="classType" :label-width="formLabelWidth">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-input v-model="step2Form.classType" placeholder="请输入用户类型"></el-input>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-form-item label="短信渠道" :prop="topFormShow.smsChannelId?'smsChannelId':''" :label-width="formLabelWidth" v-show = 'topFormShow.smsChannelId'>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-select v-model="step2FormModel.smsChannelId" :span="5" value-key="id" placeholder="请选择短信渠道" clearable filterable  @change="smsChannelFn">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-option  :label="item.name" :value="item"  v-for="(item,index) in paramsItem.defaultItems.smsChannelId" :key="item.id"></el-option>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-form-item label="短信模板" :prop="topFormShow.smsTemplateId?'smsTemplateId':''" :label-width="formLabelWidth" v-show = 'topFormShow.smsTemplateId'>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-select v-model="step2FormModel.smsTemplateId" :span="5" value-key="id" placeholder="请选择短信模板" clearable filterable  @change="smsTemplateFn">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-option  :label="item.name" :value="item"  v-for="(item,index) in paramsItem.defaultItems.smsTemplateId" :key="item.id"></el-option>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--<el-form-item label="发送量" :prop="topFormShow.limit?'limit':''" :label-width="formLabelWidth" v-show = 'topFormShow.limit'>-->
          <!--<el-input v-model="step2Form.limit" placeholder="请输入发送量"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="备注" :prop="topFormShow.note?'note':''" :label-width="formLabelWidth" v-show = 'topFormShow.note'>-->
          <!--<el-input v-model="step2Form.note" placeholder="请输入备注"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <el-form :model="paramsItem2" ref="paramsItem2" class="param-item-form">
        <div v-for="(items, itemsIndex) in paramsItem2.items" :key="itemsIndex" class="item-container" :style="itemsIndex % 3 === 0 ? '300px':'210px'" @click="confirmList(itemsIndex)">
          <el-form-item style="margin-bottom: 5px;text-align: center;" :style="itemsIndex % 3 === 0 ? 'margin-left: 50px;' : 'margin-left: 5px;'" v-if="!paramsItem2.isTemplate">
            <el-tag :closable="paramsItem2.items.length > 1" :close-transition="true" @close="handleDelParam(itemsIndex)">任务{{itemsIndex+1}}</el-tag>
          </el-form-item>
          <el-form-item style="margin-bottom: 5px;" :prop="(item.params === 'smsChannelId' || item.params === 'smsTemplateId' || item.params === 'batchDescriptionId')?item.params:''" :label="itemsIndex % 3 === 0 ? item.label:null" :key="index" :label-width="itemsIndex % 3 === 0 ? '100px':'10px'" v-for=" (item,index)  in  items">
            <template v-if="item.params === 'smsChannelId' || item.params === 'smsTemplateId' || item.params === 'batchDescriptionId' || item.params === 'catalog'">
              <el-select class="item" v-model="item.value" clearable value-key="id" filterable :placeholder="'请选择' + item.label" @change="(value) => normalFn(value, item.params)">
                <el-option
                  v-for="cell in paramsItem2.defaultItems[item.params]"
                  :key="cell.value"
                  :label="cell.name"
                  :value="cell">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.params.startsWith('dataSource')">
              <el-select
                class="item"
                v-model="item.value"
                clearable
                filterable
                remote
                :placeholder="'请选择' + item.label"
                :remote-method="remoteMethod">
                <el-option
                  v-for="cell in paramsItem2.filterData"
                  :key="cell.value"
                  :label="cell.name"
                  :value="cell.id">
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <el-input class="item" type="text" v-model="item.value" auto-complete="off" :placeholder="'请输入' + item.label"/>
            </template>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!paramsItem2.isTemplate" type="text" style="float:left;" @click="addItem()">新增列</el-button>
        <el-button @click="paramsItem2.flag = false">取 消</el-button>
        <el-button type="pink" @click="paramsItemsExecute()">确定</el-button>
      </div>
    </el-dialog>

    <!--<el-dialog :title="'请填写测试参数'" :visible.sync="addDialogParamVisible4">-->
      <!--<el-row style="margin-bottom: 15px;">-->
        <!--<el-form ref="step2Form" :model="step2Form" class="fSelect" :rules="rules">-->
          <!--&lt;!&ndash;<el-form-item label="应用名称" prop="appName" :label-width="formLabelWidth">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-input v-model="step2Form.appName" placeholder="请输入应用名称"></el-input>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--<el-form-item label="业务说明" prop="batchDescriptionId" :label-width="formLabelWidth">-->
            <!--<el-select v-model="step2FormModel.batchDescriptionId" :span="5" value-key="id" placeholder="请选业务说明" clearable filterable @change="batchDescriptionFn">-->
              <!--<el-option :label="item.name" :value="item" v-for="(item,index) in paramsItem.defaultItems.batchDescriptionId" :key="item.id"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="渠道号" prop="channel" :label-width="formLabelWidth">-->
            <!--<el-input v-model="step2Form.channel" placeholder="请输入渠道号"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="城市名称" prop="cityName" :label-width="formLabelWidth">-->
            <!--<el-input v-model="step2Form.cityName" placeholder="请输入城市名称"></el-input>-->
          <!--</el-form-item>-->
          <!--&lt;!&ndash;<el-form-item label="用户类型" prop="classType" :label-width="formLabelWidth">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-input v-model="step2Form.classType" placeholder="请输入用户类型"></el-input>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--<el-form-item label="短信渠道" prop="smsChannelId" :label-width="formLabelWidth">-->
            <!--<el-select v-model="step2FormModel.smsChannelId" :span="5" value-key="id" placeholder="请选择短信渠道" clearable filterable  @change="smsChannelFn">-->
              <!--<el-option  :label="item.name" :value="item"  v-for="(item,index) in paramsItem.defaultItems.smsChannelId" :key="item.id"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="短信模板" prop="smsTemplateId" :label-width="formLabelWidth">-->
            <!--<el-select v-model="step2FormModel.smsTemplateId" :span="5" value-key="id" placeholder="请选择短信模板" clearable filterable  @change="smsTemplateFn">-->
              <!--<el-option  :label="item.name" :value="item"  v-for="(item,index) in paramsItem.defaultItems.smsTemplateId" :key="item.id"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="发送量" prop="limit" :label-width="formLabelWidth">-->
            <!--<el-input v-model="step2Form.limit" placeholder="请输入发送量"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="备注" prop="note" :label-width="formLabelWidth">-->
            <!--<el-input v-model="step2Form.note" placeholder="请输入备注"></el-input>-->
          <!--</el-form-item>-->

          <!--<el-form-item :label="item" prop="childName" :label-width="formLabelWidth" v-for="(item,key) in otherFormModel" :key = key>-->
            <!--<el-input v-popover="'popover5'" v-model="step2Form[key]"  :placeholder="'请输入'+item" :disabled="assistantAlias==key||principalAlias==key?true:false"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
          <!--<el-row>-->
            <!--<el-col :span="14">-->
              <!--&nbsp-->
            <!--</el-col>-->

            <!--<el-col :span="10" style="text-align: right">-->
              <!--<el-button @click="addDialogParamVisible4 = false">取 消</el-button>-->
              <!--<el-button type="primary" @click="modelTestExe('step2Form')">确 定</el-button>-->
            <!--</el-col>-->
          <!--</el-row>-->

        <!--</el-row>-->
    <!--</el-dialog>-->
    <!--选择模型-->
    <el-dialog :title="'选择模型'" :visible.sync="addDialogParamVisible2">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请输入参数名称" v-model="searchParamItemData"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem">搜索</el-button>
        </el-col>
      </el-row>
      <el-button  class="selctParams" type="primary" v-for="(item , index) in smsParamsList" :key="item.id" @click.stop="addParamItem(index,'editParam',$event)">
        {{ item.name }} {{ item.displayName?'：':'' }}<em style="color:chartreuse">{{ item.displayName }}</em>
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="14">
            <el-col :span="19" >
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChangeParam"
                :total="pageparam.total"
                :current-page="pageparam.currentPage"
                :page-size ="pageparam.pageSize">
              </el-pagination>
            </el-col>
            <el-col :span="1">

            </el-col>
          </el-col>
          <el-col :span="10">
            <el-button @click="addDialogParamVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="addDialogParamVisible2 = false">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :title='isEdit?"编辑":"新增"' :visible.sync="dialogFormVisible">
      <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect" :rules="rules1">
        <el-form-item label="父类名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.name"  placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="子类名称" prop="childName" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.childName"  placeholder="请输入子类名称"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="params" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.params"  placeholder="请输入参数"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
          <el-select v-model="addEditDialogForm.type" placeholder="请选择类型">
            <el-option label="测试" :key="0" :value="0"></el-option>
            <el-option label="正式" :key="1" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId" :label-width="formLabelWidth">
          <el-select v-model="addEditDialogForm.categoryId" placeholder="请选择分类">
            <el-option :key="index" :value="item.id" :label="item.id+' : ' +item.name" v-for="(item,index) in columnCategoryList"></el-option>
          </el-select>
        </el-form-item>

        <el-row>
          <el-col :span="10">
            <el-button slot="append" icon="delete">选择元素</el-button>
          </el-col>
          <el-col :span="10">
            <el-button slot="append" icon="delete" type="danger">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editDialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import draggable from 'vuedraggable';
  import RyButton from '@/components/RyButton';
  import { myBrowser } from '@/util/util';
  import { modelList  , modelGet , categoryList , modelSave , modelDelete ,modelRevoke ,AnalysisSave,categoryGet} from '@/api/modelManage/modelManage-api';
  import { executeTask,executeTaskAsync,executeTaskParams,dataSourceList , listPartners } from '@/api/marketingManage/marketTask-api'
  import { descriptionList } from '@/api/smsManagement/smsChannel-api';
  import { templeteList } from '@/api/smsManagement/smsPassageway-api';
  import { templeteList as smsTemplateList }  from '@/api/smsManagement/smsTemplate-api';
  export default {
    components: {
      draggable , RyButton},
    name: 'app',
    data () {
      return {
        whichList:0,
        topFormShow:{
          batchDescriptionId:true,
          batchDescription:true,
          channel:true,
          cityName:true,
          classType:true,
          appName:true,
          smsChannelId:true,
          smsChannel:true,
          smsTemplateId:true,
          smsTemplate:true,
          limit:true,
          note:true
        },
        visible2:false,
        principalAlias:"",// 父类别名
        assistantAlias:'',// 子类别名
        thisEditIndex:'',
        otherFormModel:{

        },
        step2Form:{
          batchDescriptionId:'',
          batchDescription:'',
          channel:'',
          cityName:'',
          classType:'',
          appName:'',
          smsChannelId:'',
          smsChannel:'',
          smsTemplateId:'',
          smsTemplate:'',
          limit:'',
          note:''
        },
        step2FormModel:{
          batchDescriptionId:'',
          smsChannelId:'',
          smsTemplateId:'',
        },
        paramsItem:{
          defaultItems:{
            batchDescriptionId:'',
            batchDescription:'',
            channel:'',
            cityName:'',
            classType:'',
            appName:'',
            smsChannelId:'',
            smsChannel:'',
            smsTemplateId:'',
            smsTemplate:'',
            limit:'',
            note:''
          }
        },
        paramsItem2:{
          flag:false,
          taskId:0,
          isTemplate: false,
          timeConf: {
            loopRule: 'ONETIME',
            executeTime: null
          },
          items:[],
          defaultItems:{},
          dataList:[],
          catalog:[],
          filterData:[],
          loading:false
        },
        taskListData:[],//任务列表
        draggable:'draggable',
        loading2:true,
        searchParamItemData:'',
        addDialogParamVisible4:false,
        addDialogParamVisible3:false,
        addDialogParamVisible2:false,
        smsParamsList:'',
        pageparam:{},
        taskPage:{
          pageSize: 10,
          total: 10,
          currentPage: 1
        },
        paramIndex:0,
        searchData:{
          key:'',
          type:'',
          status:'',
          list:[],
        },
        addEditDialogForm:{
          name:'',
          childName:'',
          type:'',
          categoryId:'',
          params:''
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:null,
        formLabelWidth:'80px',
        editDialogForm:'',
        dialogFormVisible:false,
        page:{},
        tableData:[],
        rules1: {
          params:[
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
        },
        rules: {
          batchDescriptionId:[
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
          smsChannelId:[
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
          smsTemplateId:[
            {required: true, message: '请输入内容', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      confirmList(index){
          this.whichList = index;
      },
      strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
          obj[k] = v;
        }
        return obj;
      },
      addItem(){
          let _self = this;
        executeTaskParams({},this.thisTask).then(data =>{
          _self.buildItem(data);
        });
      },
      handleParamsExecute(item){
        let _self = this;
        _self.paramsItem2.flag = true;
        _self.thisTask = item.id;
        _self.paramsItem2.items = [];
        for(let key1 in _self.topFormShow){
          _self.topFormShow[key1] = true;
        }
        executeTaskParams({},this.thisTask).then(data =>{
          _self.otherFormModel = {};
          _self.paramsItem2.flag = true;
          _self.addParamItem2(item,data);
          _self.buildItem(data);

          if(data.data==null){
            _self.paramsItem2.isTemplate = true;

          }else{
            _self.paramsItem2.isTemplate = false;

            for(let key in data.data){
              if(key in this.paramsItem.defaultItems){
                _self.topFormShow[key] = false;
              }else{
                if(key!='classType'&&key!='appName'){
                  _self.otherFormModel[key] = data.data[key];
                  _self.step2Form[key] = '';
                }

              }
            }

          }
        });
      },
      paramsItemsExecute(){
          let _self = this;
        this.$refs['paramsItem2'].validate((valid) => {
            if (valid) {
              const _map = new Map();
              _map.set('taskId', this.thisTask);
              _map.set('modelId', this.thisModel);
              _map.set('appName', this.step2Form['appName']);
              _map.set('classType', this.step2Form['classType']);

              let paraArr = [];
              this.paramsItem2.items.forEach(
                (item) => {
                  let paraMap = new Map();
                  item.forEach((param) => {
                    if (null !== param.value && undefined !== param.value && '' !== param.value) {
                        if(param.params==='smsChannelId'){
                          paraMap.set('smsChannel', param.value.name);
                          paraMap.set('smsChannelId', param.value.id);
                        }else if(param.params==='batchDescriptionId'){
                          paraMap.set('batchDescription', param.value.name);
                          paraMap.set('batchDescriptionId', param.value.id);
                        }else if(param.params==='smsTemplateId'){
                          paraMap.set('smsTemplate', param.value.name);
                          paraMap.set('smsTemplateId', param.value.id);
                        }else{
                          paraMap.set(param.params, param.value);
                        }

                    }
                  });
                  paraArr.push(this.strMapToObj(paraMap));
                }
              );
              _map.set('params', paraArr);
              let _data = this.strMapToObj(_map);
              AnalysisSave(_data).then((res) => {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.addDialogParamVisible3 = false;
                _self.addDialogParamVisible4 = false;
                _self.paramsItem2.flag = false;
              })
            }
            })
      },
      handleDelParam(index){
        this.paramsItem2.items.splice(index,1);
      },
      buildItem(data){
        let newItem = [];
        let _data = {
          "uId": "admin",
          user:this.account,
          status:1,
          pageIndex: 1,
          pageSize: 500
        };
        if(data.data!=null){
          for (let [key, value] of Object.entries(data.data)) {

            if(key == 'smsChannelId'){

              templeteList(_data).then(data => {
                this.$set(this.paramsItem2.defaultItems,'smsChannelId',data.data.map(item=>{
                  return {
                    value:item.name,
                    id:item.id.toString(),
                    name:item.name + '【' + item.id + '】'
                  }
                }));
              });
            }else if(key == 'smsTemplateId'){
              smsTemplateList(_data).then(data => {
                this.$set(this.paramsItem2.defaultItems,'smsTemplateId',data.data.map(item=>{
                  return {
                    value:item.templateName,
                    id:item.id.toString(),
                    name:item.templateName + '【' + item.id + '】'
                  }
                }));
              });
            }else if(key == 'batchDescriptionId'){
              descriptionList(_data).then(data => {
                this.$set(this.paramsItem2.defaultItems,'batchDescriptionId',data.data.map(item=>{
                  return {
                    value:item.name,
                    id:item.id.toString(),
                    name:item.name + '【' + item.id + '】'
                  }
                }));
              });
            }else if(key == 'catalog'){
              if(!!!this.paramsItem2.defaultItems[key]){
                this.$set(this.paramsItem2.defaultItems,key,this.paramsItem2.catalog);
              }
            }else if(key.startsWith('dataSource')){
              if(!!!this.paramsItem2.defaultItems.dataSource){
                //this.$set(this.paramsItem2.defaultItems,'dataSource',this.paramsItem2.dataList);
              }
            }

            if(key == 'smsChannelId'||key == 'smsTemplateId'||key == 'batchDescriptionId'){
              var valuea = {
                id:''
              };

//              if(JSON.parse(this.tableData[this.thisEditIndex].params).hasOwnProperty(key)){
//                valuea ={
//                  id:JSON.parse(this.tableData[this.thisEditIndex].params)[key].toString()
//                };
//              }
            }else{
              var valuea = '';
              if(JSON.parse(this.tableData[this.thisEditIndex].params).hasOwnProperty(key)){
                valuea =JSON.parse(this.tableData[this.thisEditIndex].params)[key].toString();
              }
            }
            newItem.push({
              label:value,
              params:key,
              value:valuea
            });
          }

          if(!data.data.hasOwnProperty('cityName')){
            newItem.push({
              label:'城市名称',
              params:'cityName',
              value:JSON.parse(this.tableData[this.thisEditIndex].params).hasOwnProperty('cityName')?{id:JSON.parse(this.tableData[this.thisEditIndex].params)['batchDescriptionId'].toString()}:''
            });
          }
          if(!data.data.hasOwnProperty('batchDescriptionId')){
            newItem.push({
              label:'业务说明',
              params:'batchDescriptionId',
              value:valuea
            });
          }

          if(!data.data.hasOwnProperty('smsChannelId')){
            newItem.push({
              label:'短信渠道',
              params:'smsChannelId',
              value:valuea
            });
          }

          if(!data.data.hasOwnProperty('smsTemplateId')){
            newItem.push({
              label:'短信模板',
              params:'smsTemplateId',
              value:valuea
            });
          }
        }else{
            templeteList(_data).then(data => {
              this.$set(this.paramsItem2.defaultItems,'smsChannelId',data.data.map(item=>{
                return {
                  value:item.name,
                  id:item.id.toString(),
                  name:item.name + '【' + item.id + '】'
                }
              }));
            });

            smsTemplateList(_data).then(data => {
              this.$set(this.paramsItem2.defaultItems,'smsTemplateId',data.data.map(item=>{
                return {
                  value:item.templateName,
                  id:item.id.toString(),
                  name:item.templateName + '【' + item.id + '】'
                }
              }));
            });

            descriptionList(_data).then(data => {
              this.$set(this.paramsItem2.defaultItems,'batchDescriptionId',data.data.map(item=>{
                return {
                  value:item.name,
                  id:item.id.toString(),
                  name:item.name + '【' + item.id + '】'
                }
              }));
            });
          newItem.push({
            label:'业务说明',
            params:'batchDescriptionId',
            value:JSON.parse(this.tableData[this.thisEditIndex].params).hasOwnProperty('batchDescriptionId')?{id:JSON.parse(this.tableData[this.thisEditIndex].params)['batchDescriptionId'].toString()}:''
          });


          newItem.push({
            label:'短信渠道',
            params:'smsChannelId',
            value:JSON.parse(this.tableData[this.thisEditIndex].params).hasOwnProperty('smsChannelId')?{id:JSON.parse(this.tableData[this.thisEditIndex].params)['smsChannelId'].toString()}:''
          });
          newItem.push({
            label:'短信模板',
            params:'smsTemplateId',
            value:JSON.parse(this.tableData[this.thisEditIndex].params).hasOwnProperty('smsTemplateId')?{id:JSON.parse(this.tableData[this.thisEditIndex].params)['smsTemplateId'].toString()}:''
          });
          newItem.push({
            label:'城市名称',
            params:'cityName',
            value:JSON.parse(this.tableData[this.thisEditIndex].params).hasOwnProperty('cityName')?{id:JSON.parse(this.tableData[this.thisEditIndex].params)['batchDescriptionId'].toString()}:''
          });
        }



        this.paramsItem2.items.push(newItem);
      },
      normalFn(val,da){
//        console.log(this.paramsItem2)
//        console.log(da)
//
//        console.log(this.paramsItem2.items[this.whichList])
//        if(da==='batchDescriptionId'){
//            console.log(111111)
//          this.paramsItem2.items[this.whichList].batchDescriptionId = val.id;
//          this.paramsItem2.items[this.whichList].batchDescription = val.value;
//        }else if(da==='smsChannelId'){
//          console.log(222222)
//
//          this.paramsItem2.items[this.whichList].smsChannelId = val.id;
//          this.paramsItem2.items[this.whichList].smsChannel = val.value;
//        }else if(da==='smsTemplateId'){
//          console.log(3333333)
//
//          this.paramsItem2.items[this.whichList].smsTemplateId = val.id;
//          this.paramsItem2.items[this.whichList].smsTemplate = val.value;
//        }
//        console.log(this.paramsItem2)
      },
      batchDescriptionFn(val){
        this.step2Form.batchDescriptionId = val.id;
        this.step2Form.batchDescription = val.value;

      },
      smsChannelFn(val){
        this.step2Form.smsChannelId = val.id;
        this.step2Form.smsChannel = val.value;

      },
      smsTemplateFn(val){
        this.step2Form.smsTemplateId = val.id;
        this.step2Form.smsTemplate = val.value;

      },
      modelTestExe(formName){
        let _self  = this;

        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _data = this.step2Form;
            _data.taskId =this.thisTask;
            _data.modelId = this.thisModel;
            AnalysisSave(_data).then((res)=>{
              _self.$message({
                type: 'success',
                message: '编辑成功!'
              });
              _self.addDialogParamVisible3  = false;
              _self.addDialogParamVisible4  = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //选择任务搜索
      searchParam2Item(){
        let _self = this;
        let data2 = {"id":_self.thisCategoryId,"currentPage":1,"pageSize":10 };
        categoryGet(data2).then(function (res) {
          _self.assistantAlias = res.data.assistantAlias;
          _self.principalAlias = res.data.principalAlias;
          _self.taskListData = res.data.tasks;
          _self.taskPage={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //查看任务分页
      handleCurrentChangeParam2(val){
        let _self = this;
          let data2 = {"id":_self.thisCategoryId,"currentPage":val,"pageSize":10 };
        categoryGet(data2).then(function (res) {
          _self.assistantAlias = res.data.assistantAlias;
          _self.principalAlias = res.data.principalAlias;
          _self.taskListData = res.data.tasks;
          _self.taskPage={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //选择task
      addParamItem2(item,res){
        let _self = this;
        _self.thisTask = item.id;
        let _data = {
          "uId": "admin",
          user:this.account,
          status:1,
          pageIndex: 1,
          pageSize: 500
        };
          _self.step2Form.appName =_self.tableData[_self.thisEditIndex].childName;
          _self.step2Form.classType =_self.tableData[_self.thisEditIndex].name;
          if(JSON.parse(_self.tableData[_self.thisEditIndex].params).hasOwnProperty('limit')){
            _self.step2Form.limit =JSON.parse(_self.tableData[_self.thisEditIndex].params).limit.toString();
          }else{
            _self.step2Form.limit ='';
          }
          if(JSON.parse(_self.tableData[_self.thisEditIndex].params).hasOwnProperty('batchDescriptionId')){
            _self.step2Form.batchDescriptionId =JSON.parse(_self.tableData[_self.thisEditIndex].params).batchDescriptionId.toString();
            _self.step2FormModel.batchDescriptionId ={id:JSON.parse(_self.tableData[_self.thisEditIndex].params).batchDescriptionId.toString()};
          }else{
            _self.step2Form.batchDescriptionId ='';
            _self.step2FormModel.batchDescriptionId='';
          }
          if(JSON.parse(_self.tableData[_self.thisEditIndex].params).hasOwnProperty('smsChannelId')){
            _self.step2Form.smsChannelId =JSON.parse(_self.tableData[_self.thisEditIndex].params).smsChannelId.toString();
            _self.step2FormModel.smsChannelId ={id:JSON.parse(_self.tableData[_self.thisEditIndex].params).smsChannelId.toString()};
          }else{
            _self.step2Form.smsChannelId ='';
            _self.step2FormModel.smsChannelId ='';
          }
          if(JSON.parse(_self.tableData[_self.thisEditIndex].params).hasOwnProperty('smsTemplateId')){
            _self.step2Form.smsTemplateId =JSON.parse(_self.tableData[_self.thisEditIndex].params).smsTemplateId.toString();
            _self.step2FormModel.smsTemplateId ={id:JSON.parse(_self.tableData[_self.thisEditIndex].params).smsTemplateId.toString()};
          }else{
            _self.step2Form.smsTemplateId = '';
            _self.step2FormModel.smsTemplateId = '';
          }
          if(JSON.parse(_self.tableData[_self.thisEditIndex].params).hasOwnProperty('note')){
            _self.step2Form.note =JSON.parse(_self.tableData[_self.thisEditIndex].params).note.toString();
          }else{
            _self.step2Form.note = '';
          }
          if(JSON.parse(_self.tableData[_self.thisEditIndex].params).hasOwnProperty('channel')){
            _self.step2Form.channel =JSON.parse(_self.tableData[_self.thisEditIndex].params).channel.toString();
          }else{
            _self.step2Form.channel = '';
          }
          for(let key in _self.otherFormModel){
            if(JSON.parse(_self.tableData[_self.thisEditIndex].params).hasOwnProperty(key)){
              _self.step2Form[key] =JSON.parse(_self.tableData[_self.thisEditIndex].params)[key].toString();
            }
//            if(_self.assistantAlias==key){
//              _self.step2Form[key] =JSON.parse(_self.tableData[_self.thisEditIndex].params)[key].toString();
//            }
          }
          if(_self.step2Form.smsChannelId){
            const smsChannel = data.data;
            const index = smsChannel.findIndex(smsChannel => smsChannel.id == _self.step2Form.smsChannelId);
            _self.step2Form.smsChannel = smsTemplate[index].name;
          }
          templeteList(_data).then(data => {
            this.$set(this.paramsItem.defaultItems,'smsChannelId',data.data.map(item=>{
              return {
                value:item.name,
                id:item.id.toString(),
                name:item.name + '【' + item.id + '】'
              }
            }));
          });
//          listPartners(_data).then(data => {
//            this.$set(this.paramsItem.defaultItems,'partnerId',data.data.map(item=>{
//              return {
//                value:item.name,
//                id:item.id.toString(),
//                name:item.name + '【' + item.id + '】'
//              }
//            }));
//          });
          smsTemplateList(_data).then(data => {
            if(_self.step2Form.smsTemplateId){
              const smsTemplate = data.data;
              const index = smsTemplate.findIndex(smsTemplate => smsTemplate.id == _self.step2Form.smsTemplateId);
              _self.step2Form.smsTemplate = smsTemplate[index].name;
            }
            _self.step2Form.smsTemplate = _self.step2Form.smsTemplateId?data.data[data.data.findIndex(res => res.id === _self.step2Form.smsTemplateId)].name:'';

            this.$set(this.paramsItem.defaultItems,'smsTemplateId',data.data.map(item=>{
              return {
                value:item.templateName,
                id:item.id.toString(),
                name:item.templateName + '【' + item.id + '】'
              }
            }));
          });
          descriptionList(_data).then(data => {
              if(_self.step2Form.batchDescriptionId){
                const batchDescription = data.data;
                const index = batchDescription.findIndex(batchDescription => batchDescription.id == _self.step2Form.batchDescriptionId);
                _self.step2Form.batchDescription = batchDescription[index].name;
              }
            this.$set(this.paramsItem.defaultItems,'batchDescriptionId',data.data.map(item=>{
              return {
                value:item.name,
                id:item.id.toString(),
                name:item.name + '【' + item.id + '】'
              }
            }));
          });
          this.addDialogParamVisible4  = true;
      },
      //点击task选择按钮
      EditPbthParm3(index){
        let _self = this;
        _self.thisEditIndex = index;
        _self.thisModel = this.tableData[_self.thisEditIndex].id;
        _self.thisCategoryId = this.tableData[_self.thisEditIndex].categoryId;
        _self.addDialogParamVisible3 = true;
        let _data={
          id:_self.thisCategoryId,
          pageSize:this.taskPage.pageSize,
          currentPage: 1,
          taskName:this.searchData.key
        };
        categoryGet(_data).then((data)=>{
          if(data.code==1){
            _self.assistantAlias = data.data.assistantAlias;
            _self.principalAlias = data.data.principalAlias;
            _self.taskListData=data.data.tasks;
            _self.taskPage={
              pageSize: 10,
              total: data.total,
              currentPage: 0
            }
          }
        })
      },
      searchParamItem(){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"currPage":1,"prePageResult":10 };
        categoryList(data2).then(function (res) {
          let newArr = [];
          if(res.data.length){
            for(let i = 0 ; i< res.data.length;i++){
              if(res.data[i].status===1){
                newArr.push(res.data[i]);
              }
            }
          }
          _self.smsParamsList = newArr;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 0
          }
        });
      },
      handleCurrentChangeParam(val){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"currPage":val,"prePageResult":10 };
        categoryList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //选择模型
      addParamItem(index){
        let _self = this;
        _self.addDialogParamVisible2 = false;
        _self.pageparam.currentPage = 0;

        if(_self.searchData.list.length){
            let hasId = 0;
            for(let i = 0 ; i<_self.searchData.list.length ; i++){
              if(_self.searchData.list[i].id==_self.smsParamsList[index].id){
                hasId = 1
              }
            }
              if(!hasId){
                _self.searchData.list[_self.paramIndex] = _self.smsParamsList[index];
              }else{
                _self.$message({
                  type: 'warning',
                  message: '模型列重复，添加失败!'
                });
              }

        }else{
          _self.searchData.list[_self.paramIndex] = _self.smsParamsList[index];
        }
      },
      EditPbthParm2(index){
        let _self = this;
        _self.paramIndex = index;
        _self.addDialogParamVisible2 = true;
        _self.searchParamItemData = '';
        let data2 = {"name":_self.searchParamItemData,"currPage":1,"prePageResult":10};
        categoryList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      submitForm(formName){
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(_self.isEdit){

              let data = _self.addEditDialogForm;
              data.id = _self.tableData[_self.Editindex].id;
              modelSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].childName = _self.addEditDialogForm.childName;
                _self.tableData[_self.Editindex].name = _self.addEditDialogForm.name;
                _self.tableData[_self.Editindex].type = _self.addEditDialogForm.type;
                _self.tableData[_self.Editindex].categoryId = _self.addEditDialogForm.categoryId;
                _self.tableData[_self.Editindex].params = _self.addEditDialogForm.params;

                _self.dialogFormVisible = false;

              })
            }else{

              let data = _self.addEditDialogForm;
              modelSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].remark = _self.addEditDialogForm.name3;
                _self.tableData[_self.Editindex].type = _self.addEditDialogForm.name2;
                _self.dialogFormVisible = false;
                _self.loading2 = true;
                let data = {"name":_self.searchData.key,"type":_self.searchData.type,"currPage":1,"prePageResult":10};
                modelList(data).then(function (res) {
                  _self.loading2 = false;
                  _self.tableData = res.data;
                  _self.page={
                    pageSize: 10,
                    total: res.total,
                    currentPage: 1
                  }

                });
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      handleEdit(name,index,row){
        let _self = this;
        _self.isEdit = true;
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.childName = _self.tableData[index].childName;
        _self.addEditDialogForm.name = _self.tableData[index].name;
        _self.addEditDialogForm.type = _self.tableData[index].type;
        _self.addEditDialogForm.categoryId = _self.tableData[index].categoryId;
        _self.addEditDialogForm.params = _self.tableData[index].params;
        _self.Editindex = index;
//        let data = {"id":_self.tableData[index].id};
//            tableGet(data).then(function (res) {
//            _self.searchData.list = res.data.columns;
//        });
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm.childName = '';
          _self.addEditDialogForm.name = '';
          _self.addEditDialogForm.type = '';
          _self.addEditDialogForm.categoryId = '';
          _self.addEditDialogForm.params = '';
          _self.searchData.list.length=0;
//          _self.$refs[name].resetFields()
        },20)
      },
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.name + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            modelDelete(data).then(function(res){
              if (res.success) {
                _self.$message({
                  type: 'success',
                  message: '禁用成功!'
                });
                _self.tableData[index].status = 0
              }
            }).catch((res)=>{
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            });
          }).catch((res)=>{
          })

        }else{
          this.$confirm('此操作将激活【' + row.name + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            modelRevoke(data).then(function(res){
              _self.$message({
                type: 'success',
                message: '激活成功!'
              });
            }).catch((res)=>{
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            });
            _self.tableData[index].status = 1

          }).catch((res)=>{

          })
        }

      },
      searchEvent(){
        let _self = this;
        _self.loading2 = true;
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        modelList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: 1
          }
        });
      },
      handleSizeChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"currPage":_self.page.currentPage,"prePageResult":val};
        modelList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: val,
            total: res.total,
            currentPage: _self.page.currentPage
          }
        });
      },
      handleCurrentChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"currPage":val,"prePageResult":_self.page.pageSize};
        modelList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: val
          }

        });
      },
      deleteParam(index){
        let _self = this;
        this.$confirm('此操作将删除【' + _self.searchData.list[index].name + '】模型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.searchData.list.splice(index,1);
        }).catch((res)=>{
        })
      },
      editPbtnParam(){
        let _self = this;
        let data = {id: 0, name: "Unnamed", displayName: "请选择名称", categoryId: 0, status: 0};
        _self.searchData.list.push(data);
      },
      selectParam(){
        alert( '选择参数')
      },
    },
    computed: {
      ...mapState({
        account:state=>state.user.userInfo.account
      })
    },
    created() {
      let _self = this;
      if(myBrowser()==='FF'){
        _self.draggable =''
      }
      let data = {"name":_self.searchData.key,"type":_self.searchData.type,"currPage":1,"prePageResult":10};
      modelList(data).then(function (res) {
        _self.loading2 = false;
        _self.tableData = res.data;
        _self.page={
          pageSize: 10,
          total: res.total,
          currentPage: 1
        }
      }).catch(function(res){
        _self.$message({
          type: 'warning',
          message: res.msg
        });
      });
      let data2 = {"currPage":1,"prePageResult":1000};
      categoryList(data2).then(function(res){
        _self.columnCategoryList = res.data;
      })

    }

  }
</script>

<style lang="scss">
  .statistical-template-container{
    .param-item-form{
      overflow:auto;
      white-space: nowrap;
      max-width:900px;
      .item-container{
        display:inline-block;
        text-align:center;
        .item{
          width:200px;
        }
      }
    }
    #btn-wrap{
      background-color: #F9FAFC;
    }
    .draggable{
      margin-left: 0;margin-bottom: 15px;margin-right:15px;cursor: move
    }
    .ffdraggable{
      margin-left: 0;margin-bottom: 15px;margin-right:15px;cursor: not-allowed;
      position: relative;
      &:hover .ffdraggabletip{
        display: block;
      }
    }
    .ffdraggabletip{
      display:none ;
      position: absolute;
      top:-40px;
      left: 0;
      line-height: 20px;
      height:30px;
      text-align: center;
      color:#fff;
      z-index:99;
      font-size: 12px;
      background-color: #aaa;
      opacity: .7;
      padding:4px;
      border-radius: 4px;
      &:after{
        content: '';
        display: block;
        position: absolute;
        left:25px;
        bottom: -12px;
        border-color: transparent;
        border-style: solid;
        border-width: 6px;
        border-top-color:#aaa;
        height:0;
        width:0;
      }
    }

  }
</style>
