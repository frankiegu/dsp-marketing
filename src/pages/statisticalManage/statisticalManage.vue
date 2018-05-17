<template>
  <div class="statistical-template-container">

    <!--主界面-->
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="10">
              <el-input :span="5" v-model="searchData.key"  placeholder="请输入名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.status" :span="5" placeholder="请选择状态" clearable filterable >
                <el-option :label="'不可用'" :value="0"></el-option>
                <el-option :label="'可用'" :value="1"></el-option>
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
            <el-table-column prop="name" label="名称"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="tableId" label="关联表ID"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="tableName" label="关联表"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="remark" label="描述" show-overflow-tooltip> </el-table-column>
            <el-table-column label="操作" width="320" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  :disabled= "scope.row.status==0||scope.row.status==4?true:false"
                  @click="handleEdit('editDialogForm', scope.$index, scope.row)" >编辑</el-button>
                <el-button
                  size="small"
                  :type="scope.row.status === 1 ? 'gray' : 'success'"
                  :disabled= "scope.row.status==4?true:false"
                  @click="handleStop(scope.$index, scope.row)">{{scope.row.status==1 ? '禁用' : '激活'}}</el-button>
                <!--<el-button size="small" type="primary" @click="showDetails('editDialogForm', scope.$index, scope.row)">插入</el-button>-->
                <el-button size="small" type="danger" class="diycolor" @click="showDetails2('editDialogForm', scope.$index, scope.row,true)" :disabled= "scope.row.status==0||scope.row.status==4?true:false">统计明细</el-button>
                <el-button  size="small" type="success" @click="executes( scope.$index)" :disabled= "scope.row.status==0||scope.row.status==4?true:false">执行统计</el-button>

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
    <!--主界面--end-->

    <!--选择模板-->
    <el-dialog :title="'选择模板'" :visible.sync="addDialogParamVisible2">
      <el-row style="margin-bottom: 15px;">
        <el-col :span="12" :offset="4">
          <el-input placeholder="请输入模板名称" v-model="searchParamItemData"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button  class="selctParams" type="primary" icon="search" @click="searchParamItem">搜索</el-button>
        </el-col>
      </el-row>
      <el-button  class="selctParams" style="margin-left: 0;margin-right:15px;" type="primary" v-for="(item , index) in smsParamsList" :key="item.id" @click.stop="addParamItem(index,'editParam',$event)">
        {{ item.name }}{{item.remark?'：':''}}<em style="color:chartreuse">{{ item.remark }}</em>
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
    <!--选择数据表--end-->

    <!--执行统计选择任务编号-->
    <el-dialog :title="'请选择一个任务编号'" :visible.sync="addDialogParamVisible4">
      <el-row style="margin-bottom: 15px;"></el-row>
      <el-tooltip class="item" effect="dark" :content="item.dspTask.taskName?'任务名称：'+item.dspTask.taskName:''" placement="top" v-for="(item , index) in jobListData" :key="item.id">
        <div slot="content">{{item.dspTask.taskName?'任务名称：'+item.dspTask.taskName:''}}<br/>{{item.id?'编号ID：'+item.id:''}}<br/>{{item.dspTask.id?'任务ID：'+item.dspTask.id:''}}<br/>{{item.executeParams?'参数：'+item.executeParams:''}}<br/></div>
        <el-button  class="selctParams" style="margin-left: 0;margin-right:15px;" type="primary" @click.stop="addParamItem3(index,item.executeParams?item.executeParams:'')">
          {{ item.jobNo}}
        </el-button>
      </el-tooltip>

      <div v-show="jobTipIsShow">
        <el-alert
          title="对不起，暂无数据。"
          type="warning"
          description="请在“营销管理 -> 营销任务”页面点击编辑任务，然后点击“执行规则”才能有任务编号哦"
          show-icon>
        </el-alert>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="24">
            <el-col :span="24" >
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChangeParam4"
                :total="doPage.total"
                :current-page="doPage.currentPage"
                :page-size ="doPage.pageSize">
              </el-pagination>
            </el-col>
          </el-col>
          <!--<el-col :span="10">-->
            <!--<el-button @click="addDialogParamVisible4 = false">取 消</el-button>-->
            <!--<el-button type="primary" @click="addDialogParamVisible4 = false">确 定</el-button>-->
          <!--</el-col>-->
        </el-row>
      </div>
    </el-dialog>
    <!--执行统计选择任务编号--end-->

    <!--执行统计渠道号-->
    <el-dialog :title="'请选择一个渠道号'" :visible.sync="addDialogParamVisible5">
      <el-row style="margin-bottom: 15px;"></el-row>
        <el-button  class="selctParams" style="margin-left: 0;margin-right:15px;" type="primary" v-for="(item,index) in channelListData" :key="item" @click.stop="addParamItem4(index,item)">
          {{ item}}
        </el-button>

      <div v-show="jobTipIsShow">
        <el-alert
          title="对不起，暂无数据。"
          type="warning"
          description="请在“营销管理 -> 营销任务”页面点击编辑任务，然后点击“执行规则”才能有任务编号哦"
          show-icon>
        </el-alert>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="24">
            <el-col :span="24" >
              <el-pagination
                layout="prev, pager, next"
                @current-change="handleCurrentChangeParam5"
                :total="channelPage.total"
                :current-page="channelPage.currentPage"
                :page-size ="channelPage.pageSize">
              </el-pagination>
            </el-col>
          </el-col>
          <!--<el-col :span="10">-->
          <!--<el-button @click="addDialogParamVisible5 = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="addDialogParamVisible5 = false">确 定</el-button>-->
          <!--</el-col>-->
        </el-row>
      </div>
    </el-dialog>
    <!--执行统计渠道号--end-->

    <!--选择taskId-->
    <el-dialog :title="'选择任务'" :visible.sync="addDialogParamVisible3">
      <el-row style="margin-bottom: 15px;">
        <!--<el-col :span="12" :offset="4">-->
          <!--<el-input placeholder="请输入任务名称" v-model="searchParamItem2Data"></el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
          <!--<el-button  class="selctParams" type="primary" icon="search" @click="searchParam2Item">搜索</el-button>-->
        <!--</el-col>-->
      </el-row>
      <el-button  class="selctParams" style="margin-left: 0;margin-right:15px;" type="primary" v-for="(item , index) in taskListData" :key="item.id" @click.stop="addParamItem2(index,'editParam',$event)">
        {{ item.taskId}}：<em style="color:chartreuse">{{ item.taskName }}</em>
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
    <!--选择taskId--end-->

    <!--统计编辑-->
    <el-dialog :title='isEdit?"编辑":"新增"' :visible.sync="dialogFormVisible" size="full">
      <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
        <el-form-item label="名称" prop="name1" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.name1"  placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="name3" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.name3"  placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="模板" :label-width="formLabelWidth">
          <el-button :plain="true" type="info" style="width:100%;" @click.stop="EditPbthParm2"  :disabled="dataSelectDisable">{{ searchData.tableName?searchData.tableName:'请选择模板' }}</el-button>
        </el-form-item>
        <el-form-item label="任务" :label-width="formLabelWidth">
          <el-button :plain="true" type="info" style="width:100%;" @click.stop="EditPbthParm3"  :disabled="searchData.tableName?false:true">{{ searchData.taskNameTop?searchData.taskNameTop:'请选择任务' }}</el-button>
        </el-form-item>
        <div class="editPbtnWrap">
          <el-button  :span="5" class="editPbtn" type="text" :disabled="true">关联关系设置</el-button>
        </div>
        <div class="btn-wrap">
            <el-form-item :label="item.displayName" :label-width="formLabelWidth" v-for="(item , index) in taskSelect" :key="item.taskId" style="border-bottom: 1px solid #ddd;padding-bottom: 15px;">
              <div @click.stop="turnIndex(index)">
                <el-button :plain="true" style="width:160px;margin-left: 15px;height:30px;" type="info" @click.stop="EditPbthParm3(index)" size="small">{{ item.taskName?item.taskName:'请选择任务' }}</el-button>
                <div style="margin-left:15px;color:#1d90e6" class="el-icon-d-arrow-right" v-show="item.step1"></div>
                <el-select v-model="item.name2" style="width: 160px;margin-left:15px;" placeholder="请选择步骤" clearable filterable v-show="item.step1" @change="selectData1" @clear="selectclear(index)" size="small">
                  <el-option  :value="item.stepNo +'：'+ item.actionName" v-for="(item ,index) in  item.step1Data" :key="item.stepNo"></el-option>
                </el-select>
                <div style="margin-left:15px;color:#1d90e6" class="el-icon-d-arrow-right" v-show="item.step2"></div>
                <el-select v-model="item.name3" style="width: 160px;margin-left:15px;" placeholder="请选择输入方式" clearable filterable @change="selectData2" v-show="item.step2" @clear="selectclear(index)" size="small">
                  <el-option :label="item" :value="item" v-for="(item ,index) in  item.step2Data" :key="item"></el-option>
                </el-select>
                <div style="margin-left:15px;color:#1d90e6" class="el-icon-d-arrow-right" v-show="item.step3"></div>
                <el-select v-model="item.name4" style="width: 160px;margin-left:15px;" placeholder="请选择数据源" clearable filterable @change="selectData3" v-show="item.step3" @clear="selectclear(index)" size="small">
                  <el-option :label="item.sourceName" :value="item.sourceName" v-for="(item ,index) in  item.step3Data" :key="item.identity"></el-option>
                </el-select>
                <div style="margin-top:10px;position: relative;">
                  <span v-show="(item.step3||(item.name4===''&&item.sourceName===''))?false:true" style="padding-left:15px;display: inline-block;color:#999;"> <em class="el-icon-circle-check" style="display: inline-block;padding-right:10px;" v-show="item.name4||item.sourceName?true:false"></em>{{item.name4||item.sourceName?'已选择数据源： ':''}} {{item.name4?item.name4:item.sourceName}}</span>
                  <div style="margin-top:10px;position: absolute;right:20px;bottom: 5px;">
                    <el-tooltip class="item" effect="dark" content="目标列名（可不填）" placement="top-start">
                      <el-input  v-model="item.name5" style="width: 120px;margin-left:5px;" placeholder="请输入目标列名" size="mini"></el-input>
                    </el-tooltip>
                    <!--<el-button type="primary" size="mini" style="margin-left:15px;" @click="executes(item)">执行统计</el-button>-->
                  </div>
                </div>
              </div>

            </el-form-item>
        </div>
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!--统计编辑--end-->

    <!--执行统计填写参数-->
    <el-dialog title="请填写参数" :visible.sync="dialogFormVisible4" size="tiny">
      <el-form >
        <el-form-item :label="item.displayName" label-width="80px" v-for="(item,index) in executesColList" :key="item.colId">
          <el-input type="textarea" placeholder="请填写参数"  v-model="item.executeColModel" @focus="inputFocus(item,index)"></el-input>
        </el-form-item>
        <div v-show="executesColList.length&&executesColList2.length" style="border-bottom:1px solid #ddd;margin-bottom: 20px;"></div>
        <el-form-item :label="item.displayName" label-width="80px" v-for="(item,index) in executesColList2" :key="item.colId">
          <el-input type="textarea" placeholder="请填写参数"  v-model="item.executeColModel" @focus="inputFocus(item,index)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm3">确 定</el-button>
      </div>
    </el-dialog>
    <!--执行统计填写参数--end-->

    <!--执行统计填写参数辅助1-->
    <el-dialog title="请填写参数" :visible.sync="dialogFormVisible5" size="tiny">
      <el-form :model="paramFormList">
        <el-form-item label="手机" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="paramFormList.mobile"  placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
          <el-input v-model="paramFormList.type"  placeholder="请输入类型"></el-input>
        </el-form-item>
        <el-form-item label="目标" prop="target" :label-width="formLabelWidth">
          <el-input v-model="paramFormList.target"  placeholder="请输入目标"></el-input>
        </el-form-item>
        <el-form-item label="渠道" prop="channel" :label-width="formLabelWidth">
          <el-input v-model="paramFormList.channel"  placeholder="请输入渠道"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" prop="createTime" :label-width="formLabelWidth">
        <!--<el-input v-model="paramFormList.createTime"  placeholder="请输入创建时间"></el-input>-->
          <el-date-picker
            v-model="createTimeModel"
            align="right"
            type="date"
            :editable="false"
            placeholder="选择创建日期"
            format="yyyy-MM-dd"
            @change="datePickerChange"
            :picker-options="pickerOptions1" style="width:100%;">
          </el-date-picker>
      </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible5 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm4">确 定</el-button>
      </div>
    </el-dialog>
    <!--执行统计填写参数辅助1--end-->

    <!--执行统计填写参数辅助2-->
    <el-dialog title="请填写参数" :visible.sync="dialogFormVisible6" size="tiny">
      <el-form :model="paramFormList">
        <el-form-item label="特征" prop="feature" :label-width="formLabelWidth">
          <el-input v-model="paramFormList.feature"  placeholder="请输入特征"></el-input>
        </el-form-item>
        <el-form-item label="渠道" prop="channel" :label-width="formLabelWidth">
          <el-input v-model="paramFormList.channel"  placeholder="请输入渠道"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" prop="createTime" :label-width="formLabelWidth">
          <el-date-picker
            v-model="createTimeModel"
            align="right"
            type="date"
            :editable="false"
            placeholder="选择创建日期"
            format="yyyy-MM-dd"
            @change="datePickerChange"
            :picker-options="pickerOptions1" style="width:100%;">
          </el-date-picker>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible6 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm5">确 定</el-button>
      </div>
    </el-dialog>
    <!--执行统计填写参数辅助2--end-->

    <!--编辑插入明细-->
    <el-dialog :title='"插入"' :visible.sync="dialogFormVisible2" size="small">
      <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
        <div class="btn-wrap">
          <el-input type="text" placeholder="请输入批次号" style="margin-top:5px;margin-bottom:20px;" v-model="identityInput" :disabled="detailSelect.length===0?true:false"></el-input>
          <div style="border-bottom: 1px solid #ddd;"></div>
          <el-form-item :label="item.displayName" :label-width="formLabelWidth" v-for="(item , index) in detailSelect" :key="item.colName" style="padding-top: 15px;">
            <el-input type="text" placeholder="请输入数值"  v-model="item.colValue" :disabled="item.isShow"></el-input>
          </el-form-item>
        </div>
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
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm2">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑插入明细--end-->

    <!--统计明细-->
    <el-dialog :title='detailDialogTitle' :visible.sync="dialogFormVisible3" size="large">
      <el-form ref="editDialogForm"  class="fSelect">
        <div class="btn-wrap">
          <div style="position: absolute;left:30px;width:600px;" v-show="detailSelect2.length===0?false:true">
            <el-row>
              <el-col style="width:100px;padding-left:10px;">
              数据完整度：
              </el-col>
              <el-col style="padding-left:10px;">
                <div class="el-progress-bar">
                  <div class="el-progress-bar__outer" :style="'height:6px;'">
                    <div class="el-progress-bar__inner" :style="'width: ' + dataper + '%' +';background-color:#20A0FF;height:6px;'">
                    </div>
                  </div>
                </div>
                <div
                  class="el-progress__text"
                  :style="{fontSize: 12 + 'px'}"
                >
                  {{dataper}}%
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="btn-wrap-item" style="position: absolute;right:30px;">
            <el-button type="primary"  @click="showDetails" icon="plus" style="margin-right: 10px;">插入明细</el-button>
            <el-dropdown split-button type="primary" :plain="true" @click="viewStatistics" trigger="click" @command="handleCommand">
              查看统计图
              <el-dropdown-menu slot="dropdown">
                <div v-if="detailSelect2.length===0||dataper!=100">
                  <el-dropdown-item disabled>堆叠折线图</el-dropdown-item>
                  <el-dropdown-item disabled>堆叠柱状图</el-dropdown-item>
                </div>
                <div v-else>
                  <el-dropdown-item  @click="viewStatistics" command="a">堆叠折线图</el-dropdown-item>
                  <el-dropdown-item  @click="viewStack" command="b">堆叠柱状图</el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
              <!--<el-button type="info" :plain="true" @click="viewStatistics"  :disabled="(detailSelect2.length===0||!statiIsshow)?true:false">查看统计图</el-button>-->
              <!--<el-button type="info" :plain="true" @click="viewStack"  :disabled="(detailSelect2.length===0||!statiIsshow)?true:false">堆叠柱状图</el-button>-->
          </div>
          <div style="height:40px"></div>
          <div id="tableBox" ref="tableBox">
            <div style="margin-top:15px;" class="table-wrap" v-show="detailSelect2.length===0?false:true">
              <div class="clearfix titlestyle" :style="tableDetailWidth?'width: auto':'width: '+titleWidth+'px'">
                <div :class="item==='identityId'?'content identityId':'content'" v-for="(item , key , index) in detailTableTitleData" :key ="index" :style="item==='identityId'?'width:300px':(tableDetailWidth?'width:'+tableDetailWidth+'px':(item.length>3?'width:'+item.length*25+'px':'width:150px'))">
                  {{item==='identityId'?'批次号':item}}
                </div>
                <div class="content" :style="'width:200px;'" v-show="detailSelect2.length===0?false:true">
                  操作
                </div>
              </div>
            </div>
            <div v-for="(item,index) in detailSelect3" :key="item.value" class="bg-purple-dark" @click="getValueIndex(index,item)" :style="tableDetailWidth?'width:auto':'width: '+titleWidth+'px;line-height:40px;text-align: center'">
              <div class="table-wrap clearfix">
                <div :class="index===0?'identityId content':'content'" style="border-right:1px solid #ddd;" v-for="(item,index) in item" :key="index" :style="item.jskey==='identityId'?'width:300px':(tableDetailWidth?'width:'+tableDetailWidth+'px':(item.jskey.length>3?'width:'+item.jskey.length*25+'px':'width:150px'))">
                  <div v-if="index===0">
                    <div style="">{{item.jsvalue}}</div>
                  </div>
                  <div v-else>
                    <el-button type="text" @click="editValue(index,item.jsvalue)">{{item.jsvalue}}</el-button>
                  </div>
                </div>
                <div class="content" :style="'width:200px;'">
                  <el-button type="text" @click="singleStatistics(item,detailTableTitleData)">查看统计图</el-button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="detailSelect2.length===0?true:false">
            <el-alert
              title="对不起，暂无数据。"
              type="warning"
              description="请在“统计管理”页面点击“执行统计”或者点击右上方“插入明细”手动添加统计哦"
              show-icon>
            </el-alert>
          </div>
        </div>
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
        <el-row>
          <el-col :span="8" style="text-align:left;">
            <el-button type="primary" style="text-align: left" @click="exportData"  :disabled="detailSelect2.length===0?true:false">导出 Excel 文件</el-button>
          </el-col>
          <el-col :span="16" style="text-align: right">
            <el-pagination
              layout="prev, pager, next"
              @current-change="handleCurrentChangeParam3"
              :total="detailPage.total"
              :current-page="detailPage.currentPage"
              :page-size ="detailPage.pageSize">
            </el-pagination>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-button @click="dialogFormVisible3 = false">取 消</el-button>-->
            <!--<el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>-->
          <!--</el-col>-->
        </el-row>

      </div>
    </el-dialog>
    <!--统计明细--end-->

    <!--展示统计图-->
    <el-dialog
      :title="detailDialogTitle"
      :visible.sync="viewStatisticsShow"
      size="full"
      class="dialog"
      :before-close="handleClose">
      <!--<a  class="download-img" :herf="getDataURLImg">下载统计图</a>-->
      <el-carousel trigger="click" :initial-index="chartDialogIndex" :autoplay="false"  ref="carouselD" arrow="never">
        <el-carousel-item v-for="(index,item) in chartList" :key="item">
          <div :id="item" style="height:600px"></div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!--展示统计图--end-->

    <!--编辑明细具体的值-->
    <el-dialog title="请填写数值" :visible.sync="dialogFormVisible7" size="tiny">
      <el-form :model="paramFormList2">
        <el-form-item label="数值" prop="feature" :label-width="formLabelWidth">
          <el-input v-model="paramFormList2.value"  placeholder="请输入数值"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible7 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm6">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑明细具体的值--end-->

  </div>
</template>
<script>

  import echarts from "echarts";
  import { mapState } from 'vuex';
  import { statisticsList , columnQuery , statisticsGet , columnRevoke , tableList , tableGet, statisticsSave , statisticsDelete , statisticsRevoke , taskList , taskGet , saveTask , detailView , detailSave , statisticsExecute , jobList , statisticsBuildParam , detailModify ,channelList } from '@/api/statisticalManage/statisticalManage-api'
  export default {
    name: 'app',
    data () {
      return {
        channelListData:[],
        jobChannel:'',
        jobTipIsShow:false,
        tableDetailWidth:0,
        titleWidth:0,
        getDataURLImg:"",//base64统计图片
        detailDialogTitle:"统计明细",
        loading2: true,//加载菊花
        createTimeModel:'',
        pickerOptions1: {//日期选择器相关配置
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        detailTemplate:{},//明细模板
        focusIndex:0,
        paramFormList2:{//编辑明细具体的值
          value:''
        },
        paramFormList:{
          mobile:'',
          type:'',
          target:'',
          channel:'',
          createTime:'',
          feature:''
        },//填写参数辅助表单
        collects:[],
        dataper:0,//进度条进度
        executesColList:[],//采集统计列表
        executesColList2:[],//短信统计列表
        jobSelectindex:0,
        statiIsshow :true,//判断统计趋势图是否显示
        jobListIndex:0,//job分页
        executesInfoId:0,//当前的执行统计的InfoId
        jobListData:[],//job任务列表
        detailTableData :[],//单个数据统计Data
        detailTableTitleData :[],//单个数据统计Data的title
        chartDialogIndex:0,//当前的轮播序列号
        chartList: {//各种图标相关的dom
          chartColumn: null,
          chartBar: null,
          chartLine: null,
          chartPie: null,
          chartLoophole: null
        },
        viewStatisticsShow:false,//是否展示图表
        detailPage:{//统计明细分页
          pageSize:10,
          total:100,
          currentPage: 1
        },
        dataSelectDisable:false,//控制选择模板的按钮可不可选
        identityInput:'',//新增明细的批次号model
        taskListData:[],//任务列表
        dialogTable:[],//当前的统计列相关数据
        taskPage:{//任务分页
          pageSize:10,
          total:100,
          currentPage: 1
        },
        detailSelect:[],//明细列表数据格式1
        detailSelect2:[],//明细列表数据格式2
        detailSelect3:[],//明细列表数据格式3
        taskSelect:[],//选择task相关Data
        details:[],
        relations:[],//当前的关系
        taskColIndex:0,//局土选择了哪个task
        searchParamItemData:'',//选择模板时模板名称model
        searchParamItem2Data:'',//task按名称查询，暂时没有这功能
        addDialogParamVisible5:false,//控制选择渠道ID弹窗
        addDialogParamVisible4:false,//控制选择task弹窗
        addDialogParamVisible3:false,//控制选择任务弹窗
        addDialogParamVisible2:false,//控制选择模板弹窗
        smsParamsList:{},//模板列表Data
        pageparam:{},//模板弹窗列表的分页
        paramIndex:0,//当前选择了哪个模板
        searchData:{//表单model相关
          key:'',
          type:'',
          status:'',
          tableId:'',
          tableName:'',
          list:[],
          taskId:'',
          taskName:"",
          step:'',
          actionName:'',
          taskNameTop:'',
          taskIdTop:''
        },
        stepList:[],//选择任务步骤相关数据
        addEditDialogForm:{//选择task相关model
          name1:'',
          name2:'',
          name3:''
        },
        isEdit:true,//控制单个编辑弹窗是否显示
        Editindex:0,//记录当前点击了哪条标记
        columnCategoryList:{},//统计方式列表方式
        formLabelWidth:'100px',//控制labal的长度
        editDialogForm:'',
        dialogFormVisible:false,//控制选择task弹窗
        dialogFormVisible2:false,//控制插入明细弹窗
        dialogFormVisible3:false,//
        dialogFormVisible4:false,//执行统计时填写参数弹窗
        dialogFormVisible5:false,//参数弹窗辅助表单显示1
        dialogFormVisible6:false,//参数弹窗辅助表单显示2
        dialogFormVisible7:false,//编辑明细具体的值弹窗
        page:{},
        doPage:{},
        channelPage:{},
        tableData:[],
        rules: {
          name1:[
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          name2:[
            {required: true, message: '请输入类型', trigger: 'blur'}
          ],
          name3:[
            {required: true, message: '请输入描述', trigger: 'blur'}
          ]
        },
        editValueData:{//编辑统计明细的具体数值要提交的参数
          "colId": 0,
          "colValue": "",
          "identityId": "",
          "infoId": 0
        }
      }
    },
    methods: {
      getValueIndex(index,item){
        this.editValueData.identityId = item[0].jsvalue;
        this.editValueData.infoId= this.tableData[this.infoIndex].id;
      },
      //打开统计明细编辑具体数值弹窗
      editValue(index,item){
        let _self = this;
        for(let key in this.detailTemplate){
            if(key==this.detailTableTitleData[index]){
              this.editValueData.colId = this.detailTemplate[key]
            }
        }
        _self.dialogFormVisible7 = true;
        _self.paramFormList2.value = item;

      },
      //编辑统计明细的具体数值
      submitForm6(){
        let _self = this;
        this.editValueData.colValue = this.paramFormList2.value;
          detailModify(this.editValueData).then((res)=>{
            _self.$message({
              type: 'success',
              message: '编辑成功!'
            });
            _self.dialogFormVisible7 = false;
            let data = {"infoId":""+this.tableData[this.infoIndex].id,"currPage":_self.detailPage.currentPage,"prePageResult":10};
              detailView(data).then(function (ressss) {
                _self.detailPage={
                  pageSize: 10,
                  total: ressss.total,
                  currentPage: _self.detailPage.currentPage
                };
                _self.detailSelect2 = _self.getComputesData(ressss.data.details);
                _self.detailTemplate = ressss.data.template;
                _self.detailSelect3 = _self.getComputesDataStep2(_self.detailSelect2);
                _self.detailTableData = _self.getTableData(_self.detailSelect3);
                _self.detailTableTitleData =_self.getTableTitleData(_self.detailSelect3);
                _self.statiIsshow = _self.getIsShow(_self.detailSelect2);
                _self.dataper = _self.getDataIntegrity(_self.detailTableData);
              })
          })
      },
      //日期选择器变化时
      datePickerChange(val){
          this.paramFormList.createTime = val;
      },
      //选择任务步骤
      getTaskStep(res){
        let taskStepsArr = [];
        for(let i=0;i< res.data.taskSteps.length;i++){
          taskStepsArr.push({
            actionName:res.data.taskSteps[i].actionName,
            stepNo:res.data.taskSteps[i].stepNo
          })
        }
        return taskStepsArr
      },
      // 选择步骤下面的输入输出
      getTaskWhichPut(res,stepNo){
        for(let i=0;i< res.data.taskSteps.length;i++){
            if(res.data.taskSteps[i].stepNo ==stepNo){
              if(res.data.taskSteps[i].outputSources&&res.data.taskSteps[i].outputSources.length&&res.data.taskSteps[i].inputSources&&res.data.taskSteps[i].inputSources.length){
                return ["inputSources","outputSources"]
              }else if(res.data.taskSteps[i].outputSources&&res.data.taskSteps[i].outputSources.length){
                return ["outputSources"]
              }else if(res.data.taskSteps[i].inputSources&&res.data.taskSteps[i].inputSources.length){
                return ["inputSources"]
              }else{
                return []
              }
            }
        }
      },
      //选择输入输出之后的具体的identity
      getTaskWhichIdentity(res,stepNo,putSources){
        let taskStepsArr = [];
        for(let i=0;i< res.data.taskSteps.length;i++){
          if(res.data.taskSteps[i].stepNo ==stepNo){
            for(let j=0;j< res.data.taskSteps[i][putSources].length;j++){
              taskStepsArr.push({
                identity:res.data.taskSteps[i][putSources][j].identity,
                sourceName:res.data.taskSteps[i][putSources][j].identity//改成了identity
              })
            }
          }
        }
        return taskStepsArr
      },
      //detail明细数据处理
      getComputesData(data){
        let datailNewSelect = [];
        for(let i=0;i<data.length;i++){
          let arr= [];
          for(let key in this.detailTemplate) {
            if(!arr.length){
                arr.push({jskey:"identityId",jsvalue:data[i]["identityId"]})
            }
            if(this.filterTemplateData(this.detailTemplate).indexOf(key)>-1) {
                if(data[i][key]){
                  arr.push({jskey:key,jsvalue:data[i][key]});
                }else{
                  arr.push({jskey:key,jsvalue:"无数据"});
                }
            }
          }
          datailNewSelect.push({list:arr})
        }
        return datailNewSelect
      },
      //过滤删除之后的key
      filterTemplateData(data){
          let s = '';
        for(let key in data){
          s+=key+',';
        }
        return s
      },
      //过滤key没有值，把没有值置空，已经完成*********
      getComputesDataStep2(data){
        let newData = [];
        if(data.length){
            let maxDataList = [];
            let maxLengthIndex =0;
            //取得最大的list的序列号，

            for (let i=0;i<data.length;i++){
              if(maxLengthIndex<data[i].list.length){
                maxLengthIndex =i;
              }
            }
            maxDataList = data[maxLengthIndex].list;
            //取得最大的list
            for (let i=0;i<data.length;i++) {
              let arr2 =[];
              for (let j=0;j<maxDataList.length;j++){
                let index = '';
                if(data[i]&&data[i].list){
                  for (let k=0;k<data[i].list.length;k++){
                    if(data[i].list[k].jskey==maxDataList[j].jskey){
                      index=k;
                    }
                  }
                  arr2.push({
                    jskey:maxDataList[j].jskey,
                    jsvalue:data[i].list[index]?data[i].list[index].jsvalue:'无数据'
                  })
                }
              }
              newData.push(arr2)
            }
          }
          return newData
      },
      //计算数据完整度
      getDataIntegrity(data){
        let allCount = 0;
        let perCount = 0;
        if(data.length){
          for(let i=0;i<data.length;i++){
            for(let j=0 ; j<data[i].length ; j++){
                if(j){
                  allCount++;
                }
              if(data[i][j]&&data[i][j]==="无数据"){
                perCount++
              }
            }
          }
        }else{
            return 0
        }
        return ((allCount-perCount)*100/allCount).toFixed(0)
      },
      //判断生成什么图表列数
      getTypeOfView(data){
          return data[0].list.length;
      },
      //判断每列是否相等，是否可展示统计
      getIsShow(data){
          for(let i = 0 ;i<data.length;i++){
              if(!data[i].list){
                  return false
              }else{
                if(data[i].list.length!=data[0].list.length){
                  return false;
                }
              }

          }
        return true;
      },
      //行数
      getLengthOfView(data){
        return data.length;
      },
      //得到批次数组
      getxAxisData(data){
          let arr = [];
        for(let i=0;i<data.length;i++){
            if(data[i].list&&data[i].list.length){
              if(data[i].list[0].jsvalue){
                arr.push(data[i].list[0].jsvalue)
              }else{
                arr.push('未命名')
              }
            }
        }
          return arr
      },
      //插入明细获取table的data
      getTableData(data){
          let arr = [];
        for(let i=0;i<data.length;i++){
            let arr2 = [];
            for(let j=0;j<data[i].length;j++){
                  arr2.push(data[i][j].jsvalue)
            }
            arr.push(arr2)
        }
        return arr
      },
      //插入明细获取table表头
      getTableTitleData(data){
        let arr2 = [];
          if(data[0]&&data[0].length) {
            for (let j = 0; j < data[0].length; j++) {
                arr2.push(data[0][j].jskey)
            }
          }
        return arr2
      },
      //得到列value数组
      getxValueData(data){
        let arr = [];
        for(let i=0;i<data.length;i++){
            let arr2 = [];
          if(data[i].list&&data[i].list.length) {
            for (let j = 0; j < data[i].list.length; j++) {
              if (j) {
                arr2.push(data[i].list[j].jsvalue)
              }
            }
          }
          arr.push(arr2)
        }
        return arr
      },
      //得到列key数组
      getxKeyData(data){
          let arr2 = [];
          if(data[0]){
            if(data[0].list&&data[0].list.length) {
              for (let j = 0; j < data[0].list.length; j++) {
                if (j) {
                  arr2.push(data[0].list[j].jskey)
                }
              }
            }
          }
        return arr2
      },
      //得到折线图或者堆叠柱状图相关数据
      getLineSeries(data,type){
        let arr2 = [];
          if (data[0].list && data[0].list.length) {
            for (let j = 0; j < data[0].list.length; j++) {
              if (j) {
                let arr3 = [];
                for (let i = 0; i < data.length; i++) {
                  arr3.push(data[i].list[j].jsvalue);
                }
                arr2.push({
                  name: this.getxKeyData(data)[j - 1],
                  type: type,
                  areaStyle: {normal: {}},
                  stack: '总量',
                  data: arr3
                })
              }
            }
        }
        return arr2
      },
      //得到饼图相关数据
      getPieData(data){
        let arr2 = [];
        if(data[0]&&data[0].list&&data[0].list.length){
          for(let j=0 ;j<data[0].list.length ; j++){
            if(j){
              for (let i =0;i< data.length;i++){
                arr2.push({
                  name:this.getxAxisData(data)[i],
                  value:data[i].list[j].jsvalue
                })
              }
            }
          }
        }
        return arr2
      },
      //计算最大值
      getMaxData(data){
        let maxValue = parseInt(data[0].value);
        for(let i=0 ;i<data.length;i++){
            if(maxValue<data[i].value){
              maxValue = parseInt(data[i].value)
            }
        }
        return maxValue
      },
      // 得到漏斗相关数据
      getLoopholeData(data,maxData){
        let newData = [];
        for(let i=0 ;i<data.length;i++) {
          newData.push({
            name:data[i].name,
            value:(parseFloat(data[i].value*100/maxData)).toFixed(2)
          })
        }
        return newData
      },
      //选择步骤
      selectData1(val){
        let _self =this;
          //每一个task
          if(val){
            let data2 = {"id":_self.taskSelect[_self.taskColIndex].taskId};
            _self.taskSelect[_self.taskColIndex].stepName = val.split("：")[1];
            _self.taskSelect[_self.taskColIndex].stepNo = val.split("：")[0];
            _self.taskSelect[_self.taskColIndex].step2 = true;
            _self.taskSelect[_self.taskColIndex].step3 = false;
            _self.taskSelect[_self.taskColIndex].name3 = '';
            taskGet(data2).then(function (res) {
              if(res.data.taskSteps.length){
                for(let i=0 ;i<res.data.taskSteps.length;i++){
                  if(res.data.taskSteps[i].stepNo==parseInt(val.split("：")[0])){
                    _self.taskSelect[_self.taskColIndex].stepNo = res.data.taskSteps[i].stepNo;
                    _self.taskSelect[_self.taskColIndex].stepId = res.data.taskSteps[i].stepId;
                  }
                }
              }
              _self.taskSelect[_self.taskColIndex].step2Data = _self.getTaskWhichPut(res,val.split("：")[0]);
            });
          }else{
            _self.taskSelect[_self.taskColIndex].step2 = false;
            _self.taskSelect[_self.taskColIndex].step3 = false;
          }
      },
      //选择输入输出方式
      selectData2(val){
        let _self =this;
        if(val){
            let data2 = {"id":_self.taskSelect[_self.taskColIndex].taskId};
            let witchName3 = _self.taskSelect[_self.taskColIndex].name2.split("：")[0];
            _self.taskSelect[_self.taskColIndex].name4 = '';
            taskGet(data2).then(function (res) {
                _self.searchData.stepList = res.data.taskSteps;
                _self.stepList = res.data.taskSteps;
                _self.taskSelect[_self.taskColIndex].step3Data = _self.getTaskWhichIdentity(res,witchName3,val)
                _self.taskSelect[_self.taskColIndex].step3 = true;
              });
          }else{
            _self.taskSelect[_self.taskColIndex].step3 = false;
          }
      },
      //选择数据源
      selectData3(val){
          let _self =this;
          let data2 = {"id":_self.taskSelect[_self.taskColIndex].taskId};
          taskGet(data2).then(function (res) {
            _self.searchData.stepList = res.data.taskSteps;
            _self.stepList = res.data.taskSteps;
          });
      },
      //插入明细提交按钮
      submitForm2(){
        let _self =this;
        let newArr=[];
        for(let i=0 ;i<_self.detailSelect.length;i++){
          newArr.push({
            colId:_self.detailSelect[i].colId,
            colValue:_self.detailSelect[i].colValue?_self.detailSelect[i].colValue.trim():_self.detailSelect[i].colValue,
            identityId:_self.detailSelect[i].identityId?_self.detailSelect[i].identityId.trim():_self.detailSelect[i].identityId,
            infoId:_self.detailSelect[i].infoId
          })
        }
        let data = {
          "details": newArr,
          "orgId": _self.tableData[_self.detailIndex].orgId,
          "tableId":_self.detailTableId,
          "id":_self.tableData[_self.detailIndex].id,
          "taskId": _self.detailTaskId,
          "identityId":_self.identityInput?_self.identityInput.trim():_self.identityInput
        };
        detailSave(data).then(function(res){
          _self.$message({
            type: 'success',
            message: '编辑成功!'
          });
          _self.dialogFormVisible2 = false;
        }).catch(function(res){
          _self.$message({
            type: 'warning',
            message: res.msg
          });
        });
        _self.showDetails2(undefined,_self.infoIndex,undefined,false)
      },
      //执行统计任务
      executes(index){
        let _self = this;
        _self.executesInfoId = _self.tableData[index].id;
        //如果统计表名称是访问量统计
        if(_self.tableData[index].tableName&&_self.tableData[index].tableName=='访问量统计'){
          _self.addDialogParamVisible5 = true;
          let data1 = {
            "currPage": 1,
            "prePageResult": 10,
            "infoId":  _self.executesInfoId,
          };
          channelList(data1).then(function(res){
            _self.channelListData=res.data;
            _self.channelPage={
              currentPage:0,
              total:res.total,
              pageSize:10
            }
          });
          return false
        }
        _self.addDialogParamVisible4 = true;
        _self.jobListIndex = index;
        _self.jobTipIsShow =  false;
        let data1 = {
          "currentPage": 1,
          "pageSize": 10,
          "sortField": "id",
          "sortOrder": "DESC",
          "taskId":  _self.tableData[index].taskId,
        };
        jobList(data1).then(function(res){
          _self.jobListData=res.data;
          if(res.data.length===0){
            _self.jobTipIsShow =  true
          }else{
            _self.jobTipIsShow =  false

          }
          _self.doPage={
            currentPage:0,
            total:res.total,
            pageSize:10
          }
        });
      },
      //插入明细
      showDetails(){
          let _self = this;
          _self.dialogFormVisible2 = true;
          _self.identityInput = '';
          _self.addEditDialogForm.name1 = _self.tableData[_self.infoIndex].name;
          _self.addEditDialogForm.name3 = _self.tableData[_self.infoIndex].remark;
          _self.addEditDialogForm.name2 = _self.tableData[_self.infoIndex].type;
            let data1 = {"id":_self.tableData[_self.infoIndex].id};
            statisticsGet(data1).then(function (ress) {
              let data2 = {"id":ress.data.tableId};
              tableGet(data2).then(function(res){
                let oldData = [];
                for(let i = 0;i<res.data.columns.length;i++){
                  let colValue = '';
                  let identityId = '';
                    oldData.push({
                      name:res.data.columns[i].name,
                      displayName:res.data.columns[i].displayName,
                      colId:res.data.columns[i].id,
                      colValue:colValue,
                      identityId:identityId,
                      isShow:false,
                      infoId:_self.tableData[_self.infoIndex].id
                    })
                  }
                _self.detailIndex = _self.infoIndex;
                _self.detailTableId = ress.data.tableId;
                _self.detailTaskId= ress.taskId;
                _self.detailSelect = oldData;
              })
            });
      },
      //查看明细
      showDetails2(name,index,row,isRe){
        let _self = this;
        _self.dialogFormVisible3 = true;
        _self.infoIdCurr=_self.tableData[index].id;
        _self.infoIndex = index;
        _self.detailDialogTitle = _self.tableData[index].name;
//        _self.detailPage.currentPage = 1;
        let data = {"infoId":""+_self.tableData[index].id,"currPage":_self.detailPage.currentPage,"prePageResult":10};
        if(isRe){
          detailView(data).then(function (ressss) {
            _self.detailPage.total = ressss.total;
            _self.detailTemplate = ressss.data.template;
            _self.detailSelect2 = _self.getComputesData(ressss.data.details);
            _self.detailSelect3 = _self.getComputesDataStep2(_self.detailSelect2);
            _self.detailTableData = _self.getTableData(_self.detailSelect3);
            _self.detailTableTitleData =_self.getTableTitleData(_self.detailSelect3);
            _self.statiIsshow = _self.getIsShow(_self.detailSelect2);
            _self.dataper = _self.getDataIntegrity(_self.detailTableData);
            _self.titleWidth = _self.getTitleWidth(_self.detailTableTitleData);
            if(_self.$refs.tableBox){
              _self.tableDetailWidth = _self.getDialogConWidth(_self.titleWidth,_self.$refs.tableBox.offsetWidth,_self.detailTableTitleData.length)
            }
          })
        }else{
          //编辑之后延时显示，因为接口会延时
          setTimeout(function () {
            detailView(data).then(function (ressss) {
              _self.detailPage.total = ressss.total;
              _self.detailTemplate = ressss.data.template;
              _self.detailSelect2 = _self.getComputesData(ressss.data.details);
              _self.detailSelect3 = _self.getComputesDataStep2(_self.detailSelect2);
              _self.detailTableData = _self.getTableData(_self.detailSelect3);
              _self.detailTableTitleData =_self.getTableTitleData(_self.detailSelect3);
              _self.statiIsshow = _self.getIsShow(_self.detailSelect2);
              _self.dataper = _self.getDataIntegrity(_self.detailTableData);
              _self.titleWidth = _self.getTitleWidth(_self.detailTableTitleData);
              if(_self.$refs.tableBox){
                _self.tableDetailWidth = _self.getDialogConWidth(_self.titleWidth,_self.$refs.tableBox.offsetWidth,_self.detailTableTitleData.length)
              }
            })
          },1000)
        }
      },
      //选择模板--搜索
      searchParamItem(){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"currPage":1,"status":1,"prePageResult":10 };
        tableList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 0
          }
        });
      },
      //选择任务搜索
      searchParam2Item(){
        let _self = this;
        let data2 = {"taskName":_self.searchParamItem2Data,"currentPage":1,"pageSize":10 };
        taskList(data2).then(function (res) {
          _self.taskListData = res.data;
          _self.taskPage={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //detail单个统计
      singleStatistics(item,detailTableTitleData){
        if(window.location.hash.indexOf("?is_dia=1")<0){
          window.location.hash = window.location.hash+"?is_dia=1";
        }
        let _self = this;
        let titles = detailTableTitleData.slice(1);
        let details = item.slice(1);
        _self.viewStatisticsShow=true;
        let maxValue = isNaN(parseFloat(details[0].jsvalue))?0:parseFloat(details[0].jsvalue);
        for(let i=0;i<details.length;i++){
          if(maxValue<(isNaN(parseFloat(details[i].jsvalue))?0:parseFloat(details[i].jsvalue))){
            maxValue = isNaN(parseFloat(details[i].jsvalue))?0:parseFloat(details[i].jsvalue);
          }
        }
        setTimeout(function () {
          _self.$refs["carouselD"].setActiveItem(4);
          let valueData=[];
          for(let j=0;j<details.length;j++){
            valueData.push({
              value:parseFloat(isNaN(parseFloat(details[j].jsvalue))?0:parseFloat(details[j].jsvalue)*100/maxValue).toFixed(2),name:titles[j]
            })
          }
          _self.drawLoophole(titles,undefined,valueData,item[0].jsvalue?item[0].jsvalue:'')
        },20);
      },
      //显示图表
      viewStatistics(){
        let _self = this;
        if(_self.detailSelect2.length===0||_self.dataper!=100){
              _self.$message({
                type:"warning",
                message:"对不起，数据完整度不够，无法查看统计！"
              });
            return false
          }
        if(window.location.hash.indexOf("?is_dia=1")<0){
          window.location.hash = window.location.hash+"?is_dia=1";
        }
        _self.viewStatisticsShow=true;
          let getxAxisData,LineSeriesData,LineKeyData,BarSeriesData;
          switch (_self.getTypeOfView( _self.detailSelect2 )){
            case 0:
              _self.$message({
                type:'warning',
                message:'统计表中没有选择列！'
              });
              break;
            case 1:
              _self.$message({
                type:'warning',
                message:'统计表中没有选择列！'
              });
              break;
            case 2:
              if(_self.getLengthOfView(_self.detailSelect2)<4){
                getxAxisData = _self.getxAxisData(_self.detailSelect2);
                LineSeriesData = _self.getLineSeries(_self.detailSelect2,'line');
                LineKeyData = _self.getxKeyData(_self.detailSelect2);
                BarSeriesData = _self.getLineSeries(_self.detailSelect2,'bar');
                setTimeout(function () {
                  _self.$refs["carouselD"].setActiveItem(0);
                  _self.drawColumnChart(getxAxisData,LineKeyData,BarSeriesData)
                },20);
              }else if(_self.getLengthOfView(_self.detailSelect2)<9){
                  console.log("漏斗图");
                setTimeout(function () {
                  _self.$refs["carouselD"].setActiveItem(4);
                  let maxData = _self.getMaxData(_self.getPieData(_self.detailSelect2));
                  let valueData = _self.getLoopholeData(_self.getPieData(_self.detailSelect2),maxData)
                  _self.drawLoophole(getxAxisData,LineKeyData,valueData)
                },20);

              }else{
                  console.log("饼图");
                setTimeout(function () {
                  _self.$refs["carouselD"].setActiveItem(3);
                  _self.drawPieChart(getxAxisData,LineKeyData,_self.getPieData(_self.detailSelect2))
                },20);
              }

              break;
            case 3:
              getxAxisData = _self.getxAxisData(_self.detailSelect2);
              LineSeriesData = _self.getLineSeries(_self.detailSelect2,'line');
              LineKeyData = _self.getxKeyData(_self.detailSelect2);
              BarSeriesData = _self.getLineSeries(_self.detailSelect2,'bar');

              setTimeout(function () {
                _self.$refs["carouselD"].setActiveItem(1);
                _self.drawBarChart(getxAxisData,LineKeyData,BarSeriesData)
              },20);
              break;
            default :
              getxAxisData = _self.getxAxisData(_self.detailSelect2);
              LineSeriesData = _self.getLineSeries(_self.detailSelect2,'line');
              LineKeyData = _self.getxKeyData(_self.detailSelect2);
              BarSeriesData = _self.getLineSeries(_self.detailSelect2,'bar');

              setTimeout(function () {
                _self.$refs["carouselD"].setActiveItem(2);
                _self.drawLineChart(getxAxisData,LineKeyData,LineSeriesData)
              },20);
          }

      },
      //显示堆叠柱状图
      viewStack(){
        if(window.location.hash.indexOf("?is_dia=1")<0){
          window.location.hash = window.location.hash+"?is_dia=1";
        }
        let _self = this;
        _self.viewStatisticsShow=true;
        let getxAxisData,LineSeriesData,LineKeyData,BarSeriesData;
        getxAxisData = _self.getxAxisData(_self.detailSelect2);
        LineSeriesData = _self.getLineSeries(_self.detailSelect2,'line');
        LineKeyData = _self.getxKeyData(_self.detailSelect2);
        BarSeriesData = _self.getLineSeries(_self.detailSelect2,'bar');
        setTimeout(function () {
          _self.$refs["carouselD"].setActiveItem(0);
          _self.drawColumnChart(getxAxisData,LineKeyData,BarSeriesData)
        },20);
      },
      //显示堆叠折线图
      viewStackedFoldLine(){
        if(window.location.hash.indexOf("?is_dia=1")<0){
          window.location.hash = window.location.hash+"?is_dia=1";
        }
        let _self = this;
        _self.viewStatisticsShow=true;
        let getxAxisData,LineSeriesData,LineKeyData,BarSeriesData;
        getxAxisData = _self.getxAxisData(_self.detailSelect2);
        LineSeriesData = _self.getLineSeries(_self.detailSelect2,'line');
        LineKeyData = _self.getxKeyData(_self.detailSelect2);
        BarSeriesData = _self.getLineSeries(_self.detailSelect2,'bar');

        setTimeout(function () {
          _self.$refs["carouselD"].setActiveItem(2);
          _self.drawLineChart(getxAxisData,LineKeyData,LineSeriesData)
        },20);
      },
      //画柱状图
      drawColumnChart(identityList,keyList,ValueList,title) {
        this.chartList.chartColumn = echarts.init(document.getElementById('chartColumn'));
        this.chartList.chartColumn.setOption({
          title: { text: title },
          tooltip: {},
          toolbox: {
            show: true,
            orient: 'vertical',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            data: identityList
          },
          yAxis: {},
          series: ValueList
        });
        this.getDataURLImg = this.chartList.chartColumn.getDataURL();
      },
      //画堆叠柱状图
      drawBarChart(identityList,keyList,ValueList,title) {
        this.chartList.chartBar =  echarts.init(document.getElementById('chartBar'));
        this.chartList.chartBar.setOption({
          title: {
            text: title
          },
          tooltip : {
            trigger: 'axis',
            axisPointer : {
              type : 'shadow'
            }
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          legend: {
            data: keyList,
            top:"3%",

          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: identityList
          },
          yAxis: {
            type: 'value',
          },
          series: ValueList
        });
        this.getDataURLImg = this.chartList.chartBar.getDataURL();
      },
      //画折线图
      drawLineChart(identityList,keyList,ValueList,title) {
        this.chartList.chartLine = echarts.init(document.getElementById('chartLine'));
        this.chartList.chartLine.setOption({
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: keyList,
            top:"3%",
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: identityList
          },
          yAxis: {
            type: 'value'
          },
          series: ValueList
        });
        this.getDataURLImg = this.chartList.chartLine.getDataURL();
      },
      //画饼图
      drawPieChart(identityList,keyList,ValueList,title) {
        this.chartList.chartPie = echarts.init(document.getElementById('chartPie'));
        this.chartList.chartPie.setOption({
          title: {
            text: title,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: identityList
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: ValueList,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
        this.getDataURLImg = this.chartList.chartPie.getDataURL();
      },
      //画漏斗图
      drawLoophole(identityList,keyList,ValueList,title){
        this.chartList.chartLoophole  = echarts.init(document.getElementById('chartLoophole'));
        this.chartList.chartLoophole.setOption({
          title: {
            text:title?"批次号："+title:'',
            left: 'left',
            top: 'bottom',
            textStyle: {
              color: '#999'
            }

          },
          backgroundColor: '#fff',
          color: ['#efbb1a', '#d77169', '#c14f60', '#953f61', '#72355f', ],
          legend: {
            data: identityList,
            top:"3%",
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          series : [
            {
              name:'漏斗图',
              type:'funnel',
              x: '10%',
              y: 60,
              //x2: 80,
              y2: 60,
              width: '80%',
              // height: {totalHeight} - y - y2,
              min: 0,
              max: 100,
              minSize: '0%',
              maxSize: '100%',
              sort : 'descending', // 'ascending', 'descending'
              gap :0,

              data:ValueList.sort(function (a, b) { return a.value - b.value}),
              roseType: true,
              label: {
                normal: {
                  formatter: function (params) {
                    return params.name + ' ' + params.value + '%';
                  },
                  position: 'center'
                }
              },
              itemStyle: {
                normal: {
                  borderWidth: 0,
                  shadowBlur: 30,
                  shadowOffsetX: 0,
                  shadowOffsetY: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }

            }

          ]
        });
        this.getDataURLImg = this.chartList.chartLoophole.getDataURL();
      },
       //选择模板分页
      handleCurrentChangeParam(val){
        let _self = this;
        let data2 = {"name":_self.searchParamItemData,"currPage":val,"status":1,"prePageResult":10 };
        tableList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //查看明细分页
      handleCurrentChangeParam3(val){
        let _self = this;
        _self.statiIsshow = _self.getIsShow(_self.detailSelect2);
        let data2 = {"infoId":""+_self.infoIdCurr,"currPage":val,"prePageResult":10 };
        detailView(data2).then(function (res) {
          _self.detailPage={
            pageSize: 10,
            total: res.total,
            currentPage: val
          };

            _self.detailTemplate = res.data.template;
            _self.detailSelect2 = _self.getComputesData(res.data.details);
            _self.detailSelect3 = _self.getComputesDataStep2(_self.detailSelect2);
            _self.detailTableData = _self.getTableData(_self.detailSelect3);
            _self.detailTableTitleData =_self.getTableTitleData(_self.detailSelect3);
            _self.statiIsshow = _self.getIsShow(_self.detailSelect2);
            _self.dataper = _self.getDataIntegrity(_self.detailTableData);
          _self.titleWidth = _self.getTitleWidth(_self.detailTableTitleData);
          if(_self.$refs.tableBox){
            _self.tableDetailWidth = _self.getDialogConWidth(_self.titleWidth,_self.$refs.tableBox.offsetWidth,_self.detailTableTitleData.length)
          }
        });
      },
      //查看任务分页
      handleCurrentChangeParam2(val){
        let _self = this;
        let data2 = {"taskName":_self.searchParamItem2Data,"currentPage":val,"pageSize":10 };
        taskList(data2).then(function (res) {
          _self.taskListData = res.data;
          _self.taskPage={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      //选择任务编号分页
      handleCurrentChangeParam4(val){
        let _self = this;
        let data1 = {
          "currentPage": val,
          "pageSize": 10,
          "sortField": "id",
          "sortOrder": "DESC",
          "taskId":  _self.tableData[_self.jobListIndex].taskId,
        };
        jobList(data1).then(function(res){
          _self.jobListData=res.data;
          _self.doPage={
            currentPage:1,
            total:res.total,
            pageSize:10
          }
        })
      },
      //选择渠道分页
      handleCurrentChangeParam5(val){
        let _self = this;
        let data1 = {
          "currPage": val,
          "prePageResult": 10,
          "infoId":  _self.executesInfoId,
        };
        channelList(data1).then(function(res){
          _self.channelListData=res.data;
          _self.channelPage={
            currentPage:val,
            total:res.total,
            pageSize:10
          }
        })
      },
      //选择渠道ID执行统计
      addParamItem4(index,channel){
        let _self =this;
        _self.$confirm('确认执行统计？')
          .then(function () {
            let jobId = 0;
            let infoId = _self.executesInfoId;
            _self.addDialogParamVisible5 = false;
            _self.dialogFormVisible5 =false;
            let data = {infoId:infoId,jobId:jobId,jobNo:channel};
            statisticsExecute(data).then(function (res) {
              _self.$message({
                type: 'success',
                message: '执行成功!'
              });
            }).catch(function(res){
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            })
          })
          .catch(function(res){
            console.log(JSON.stringify(res))
          });

      },

      //选择任务编号执行统计
      addParamItem3(index,executeParams){
        let _self =this;
          if(executeParams&&JSON.parse(executeParams).hasOwnProperty("channel")){
              _self.jobChannel = JSON.parse(executeParams).channel
          }else{
            _self.jobChannel = '';
          }
        _self.jobSelectindex = index;
        _self.executeCol().then((res)=>{
          if(res){
            _self.dialogFormVisible4 =true;
          }else{
            _self.$confirm('确认执行统计？')
              .then(function () {
                let jobId = _self.jobListData[_self.jobSelectindex].id;
                let jobNo = _self.jobListData[_self.jobSelectindex].jobNo;
                let infoId = _self.executesInfoId;
                _self.addDialogParamVisible4 = false;
                _self.dialogFormVisible4 =false;
                let data = {infoId:infoId,jobId:jobId,jobNo:jobNo};
                _self.tableData[_self.jobListIndex].status = 4;
                statisticsExecute(data).then(function (res) {
                  _self.tableData[_self.jobListIndex].status = 1;
                  _self.$message({
                    type: 'success',
                    message: '执行成功!'
                  });
                }).catch(function(res){
                  _self.tableData[_self.jobListIndex].status = 4;
                  _self.$message({
                    type: 'warning',
                    message: res.msg
                  });
                })
              })
              .catch(function(res){
                console.log(JSON.stringify(res))
              });
          }
        })

      },
      //选择task
      addParamItem2(index){
        let _self = this;
        if(_self.taskColIndex===-1){
            if(_self.taskListData[index].taskId===_self.searchData.taskId){
              _self.addDialogParamVisible3 = false;
              return
            }
          //总的task
          _self.searchData.taskNameTop = _self.taskListData[index].taskName;
          _self.searchData.taskIdTop = _self.taskListData[index].taskId;
          _self.addDialogParamVisible3 = false;
          for(let i=0;i<_self.colLength ; i++){
            _self.taskPage.currentPage = 0;
            _self.taskSelect[i].step2 = false;
            _self.taskSelect[i].step3 = false;
            _self.taskSelect[i].step1Data = '';
            _self.taskSelect[i].name2 = '';
            _self.taskSelect[i].sourceName='';
            _self.taskSelect[i].name4='';
            _self.taskSelect[i].taskId = _self.taskListData[index].taskId;
            _self.taskSelect[i].taskName = _self.taskListData[index].taskName;
            _self.taskSelect[i].actionName = _self.taskListData[index].taskName;
            _self.taskSelect[i].step1 = true;
            //查看详情
            let data2 = {"id":_self.taskListData[index].taskId};
            taskGet(data2).then(function (res) {
              _self.searchData.stepList = res.data.taskSteps;
              _self.stepList = res.data.taskSteps;
              _self.taskSelect[i].step1Data = _self.getTaskStep(res);
            })
          }
        }else{
          _self.addDialogParamVisible3 = false;
          _self.taskPage.currentPage = 0;
          _self.taskSelect[_self.taskColIndex].step2 = false;
          _self.taskSelect[_self.taskColIndex].step3 = false;
          _self.taskSelect[_self.taskColIndex].step1Data = '';
          _self.taskSelect[_self.taskColIndex].name2 = '';
          _self.taskSelect[_self.taskColIndex].name4 = '';
          _self.taskSelect[_self.taskColIndex].sourceName = '';
          _self.taskSelect[_self.taskColIndex].taskId = _self.taskListData[index].taskId;
          _self.taskSelect[_self.taskColIndex].taskName = _self.taskListData[index].taskName;
          _self.taskSelect[_self.taskColIndex].actionName = _self.taskListData[index].taskName;
          _self.taskSelect[_self.taskColIndex].step1 = true;
          //查看详情
          let data2 = {"id":_self.taskListData[index].taskId};
          taskGet(data2).then(function (res) {
            _self.searchData.stepList = res.data.taskSteps;
            _self.stepList = res.data.taskSteps;
            _self.taskSelect[_self.taskColIndex].step1Data = _self.getTaskStep(res);
          })
        }

        },
      //选择数据表
      addParamItem(index){
        let _self = this;
        _self.addDialogParamVisible2 = false;
        _self.pageparam.currentPage = 0;
        _self.searchData.tableName = _self.smsParamsList[index].name;
        _self.searchData.tableId = _self.smsParamsList[index].id;
        _self.taskSelect.length=0;
        let data = {"id":_self.searchData.tableId};
        tableGet(data).then(function(res){
          _self.dialogTable = res.data.columns;
          let oldData = [];
          _self.colLength = res.data.columns.length;
          for(let i = 0;i<res.data.columns.length;i++){
            oldData.push({
              name2:'',
              name3:'',
              name4:'',
              name5:res.data.columns[i].remark,
              colId:res.data.columns[i].id,
              colName:res.data.columns[i].name,
              displayName:res.data.columns[i].displayName,
              taskName:'',
              taskId:'',
              step1Data:[],
              step2Data:[],
              step3Data:[],
              step1:false,
              step2:false,
              step3:false,
            })
          }

          _self.taskSelect = oldData;
        })
      },
      //选择模板
      EditPbthParm2(index){
        let _self = this;
        _self.paramIndex = index;
        _self.addDialogParamVisible2 = true;
        _self.searchParamItemData = '';
        let data2 = {"name":_self.searchParamItemData,"currPage":1,"status":1,"prePageResult":10};
        tableList(data2).then(function (res) {
          _self.smsParamsList = res.data;
          _self.pageparam={
            pageSize: 10,
            total: res.total,
            currentPage: 1
          }
        });
      },
      inputFocus(item,index){
        let _self = this;
        _self.focusIndex = index;
        _self.paramFormList = {
          mobile:'',
          type:'',
          target:'',
          channel:'',
          createTime:'',
          feature:''
        };
        if(item.categoryId==3){
            _self.dialogFormVisible5 = true;
          }else if (item.categoryId==5){
          _self.dialogFormVisible6 = true;
          }
        _self.createTimeModel='';
      },
      //找到缓存的JSON
      findBeforeJson(beforeJson,colId){
          let colTarget = "";
        for(let i=0 ; i < beforeJson.length ; i++){
          if(beforeJson[i].colId==colId){
            colTarget =  beforeJson[i].colTarget;
          }
        }
        return colTarget
      },
      //执行统计添加参数初始化
      executeCol(){
        let _self = this;
        return new Promise((resolve, reject) => {
          let data = {"id":_self.tableData[_self.jobListIndex].id};
          statisticsGet(data).then(function(res){
            let oldData = [];
            let oldData2 = [];
            let beforeJson = window.localStorage.getItem("ParamsJsonInfoIdIs_"+_self.tableData[_self.jobListIndex].id)?JSON.parse(window.localStorage.getItem("ParamsJsonInfoIdIs_"+_self.tableData[_self.jobListIndex].id)):'';
            let newArr = [];
            if(beforeJson){
              beforeJson.forEach((item,index)=>{
                let colTargetl = JSON.parse(item.colTarget)
                if(colTargetl.hasOwnProperty('channel')){
                  colTargetl.channel = _self.jobChannel;
                }
                newArr.push({
                  colId:item.colId,
                  colTarget:JSON.stringify(colTargetl)
                })
              })
            }
            if(res.data.collects&&res.data.collects.length){
              for(let i = 0;i<res.data.collects.length;i++){
                oldData.push({
                  displayName:res.data.collects[i].displayName,
                  colId:res.data.collects[i].id,
                  colName:res.data.collects[i].name,
                  categoryId:res.data.collects[i].categoryId,
                  executeColModel:beforeJson?_self.findBeforeJson(newArr,res.data.collects[i].id):(_self.jobChannel?JSON.stringify({'channel':_self.jobChannel}):'')
                })

              }
            }
            if(res.data.gathers&&res.data.gathers.length){
              for(let i = 0;i<res.data.gathers.length;i++){
                oldData2.push({
                  displayName:res.data.gathers[i].displayName,
                  colId:res.data.gathers[i].id,
                  colName:res.data.gathers[i].name,
                  categoryId:res.data.gathers[i].categoryId,
                  executeColModel:beforeJson?_self.findBeforeJson(newArr,res.data.gathers[i].id):(_self.jobChannel?JSON.stringify({'channel':_self.jobChannel}):'')
                })
              }
            }
            _self.executesColList = oldData;
            _self.executesColList2 = oldData2;
            resolve((_self.executesColList&&_self.executesColList.length)||(_self.executesColList2&&_self.executesColList2.length));
          })
        })

      },
      //最后一步，提交参数，执行统计
      submitForm3(){
          let  _self = this;
          let postArr = [];
          if(_self.executesColList.length){
            for(let i=0;i<_self.executesColList.length;i++){
              if(!_self.executesColList[i].executeColModel){
                _self.$message({
                  type:'warning',
                  message:'对不起，参数不全！'
                });
                return false
              }else{
                postArr.push({
                  colId:_self.executesColList[i].colId,
                  colTarget:_self.executesColList[i].executeColModel
                });
              }
            }
          }

          if(_self.executesColList2.length){
            for(let i=0;i<_self.executesColList2.length;i++){
              if(!_self.executesColList2[i].executeColModel){
                _self.$message({
                  type:'warning',
                  message:'对不起，参数不全！'
                });
                return false
              }else{
                postArr.push({
                  colId:_self.executesColList2[i].colId,
                  colTarget:_self.executesColList2[i].executeColModel
                });
              }
            }
          }

          _self.$confirm('确认执行统计？').then(function () {
            let jobId = _self.jobListData[_self.jobSelectindex].id;
            let jobNo = _self.jobListData[_self.jobSelectindex].jobNo;
            let infoId = _self.executesInfoId;
            _self.addDialogParamVisible4 = false;
            _self.dialogFormVisible4 =false;
            let data = {infoId:infoId,jobId:jobId,jobNo:jobNo,params:postArr};
            _self.tableData[_self.jobListIndex].status = 4;
            window.localStorage.setItem("ParamsJsonInfoIdIs_"+infoId,JSON.stringify(postArr));
            statisticsExecute(data).then(function (res) {
                _self.tableData[_self.jobListIndex].status = 1;
                _self.$message({
                  type: 'success',
                  message: '执行成功!'
                });
              }).catch(function(res){
              _self.tableData[_self.jobListIndex].status = 4;
              _self.$message({
                  type: 'warning',
                  message: res.msg
                });
              })
          })
          .catch(function(res){
              console.log(JSON.stringify(res))
          });
      },
      //提交参数时表单辅助提交
      submitForm4(){
        let _self = this;
        let newObj ={};
        for(let key in _self.paramFormList){
          if(_self.paramFormList[key]){
            newObj[key] = _self.paramFormList[key];
          }
        }
        statisticsBuildParam(newObj).then(function(res){
          _self.executesColList[_self.focusIndex].executeColModel = res.data;
          _self.dialogFormVisible5 =false;
        });
      },
      //提交参数时表单辅助提交
      submitForm5(){
        let _self = this;
        let newObj ={};
        for(let key in _self.paramFormList){
          if(_self.paramFormList[key]){
            newObj[key] = _self.paramFormList[key];
          }
        }
        statisticsBuildParam(newObj).then(function(res){
          _self.executesColList2[_self.focusIndex].executeColModel = res.data;
          _self.dialogFormVisible6 =false;
        });
      },
      //点击task选择按钮
      EditPbthParm3(index){
        let _self = this;
        if(typeof index==='object'){
            _self.taskColIndex = -1;
        }else{
          _self.taskColIndex = index;
        }
        _self.addDialogParamVisible3 = true;
        let _data={
          pageSize:this.taskPage.pageSize,
          currentPage: 1,
          taskName:this.searchData.key
        };
        taskList(_data).then((data)=>{
          if(data.code==1){
            this.taskListData=data.data;
            _self.taskPage={
              pageSize: 10,
              total: data.total,
              currentPage: 0
            }
          }
        })
      },
      //冒泡获取index，锁定那一行
      turnIndex(index){
        this.taskColIndex = index;
      },
      //清空select时获取index，锁定那一行
      selectclear(index){
        this.taskColIndex = index;
      },
      //单个数据管理编辑提交
      submitForm(){
        let _self = this;
            let relations  = [];
            for(let i = 0;i<_self.taskSelect.length;i++){
                if(_self.taskSelect[i].relationItemId){
                  relations.push({
                    id:_self.taskSelect[i].relationItemId,
                    sourceName:_self.taskSelect[i].name4||_self.taskSelect[i].sourceName,
                    colId:_self.taskSelect[i].colId,
                    stepName:_self.taskSelect[i].stepName,
                    stepNo:parseInt(_self.taskSelect[i].stepNo),
                    stepId:parseInt(_self.taskSelect[i].stepId),
                    ioName:_self.taskSelect[i].name3,
                    taskId:_self.taskSelect[i].taskId,
                    colTarget:_self.taskSelect[i].name5,
                    actionName:_self.taskSelect[i].actionName,
                  })
                }else{
                  relations.push({
                    sourceName:_self.taskSelect[i].name4,
                    colId:_self.taskSelect[i].colId,
                    stepName:_self.taskSelect[i].stepName,
                    stepNo:parseInt(_self.taskSelect[i].stepNo),
                    stepId:parseInt(_self.taskSelect[i].stepId),
                    ioName:_self.taskSelect[i].name3,
                    taskId:_self.taskSelect[i].taskId,
                    colTarget:_self.taskSelect[i].name5,
                    actionName:_self.taskSelect[i].actionName
                  })
                }
            }

            if(_self.isEdit){
              let data = {"relations":relations,"id":_self.tableData[_self.Editindex].id,"name":_self.addEditDialogForm.name1,"remark":_self.addEditDialogForm.name3,"tableId":_self.searchData.tableId,"orgId": _self.tableData[_self.Editindex].orgId,taskId:_self.searchData.taskIdTop||_self.tableData[_self.Editindex].taskId,actionName:_self.searchData.taskNameTop};
              statisticsSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].tableId = _self.searchData.tableId;
                _self.tableData[_self.Editindex].remark = _self.addEditDialogForm.name3;
                _self.tableData[_self.Editindex].name = _self.addEditDialogForm.name1;
                _self.tableData[_self.Editindex].tableName = _self.searchData.tableName;
                _self.tableData[_self.Editindex].taskId = _self.searchData.taskIdTop?_self.searchData.taskIdTop:_self.tableData[_self.Editindex].tableId;
                _self.tableData[_self.Editindex].actionName = _self.searchData.taskNameTop;
                _self.dialogFormVisible = false;
              })
            }else{
              let data = {"relations":relations,"name":_self.addEditDialogForm.name1,"remark":_self.addEditDialogForm.name3,"tableId":_self.searchData.tableId,"orgId": '1',taskId:_self.searchData.taskIdTop,actionName:_self.searchData.taskNameTop};
              statisticsSave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.dialogFormVisible = false;
                _self.loading2 = true;
                let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":1,"prePageResult":_self.page.pageSize};
                statisticsList(data).then(function (res) {
                  _self.loading2 = false;
                  _self.tableData = res.data;
                  _self.page={
                    pageSize: _self.page.pageSize,
                    total: res.total,
                    currentPage: 1
                  }

                }).catch(function(res){
                  _self.$message({
                    type: 'warning',
                    message: res.msg
                  });
                });
              }).catch(function(res){
                _self.$message({
                  type: 'warning',
                  message: res.msg
                });
              })

            }
      },
      //单个数据管理编辑的编辑
      handleEdit(name,index,row){
        let _self = this;
        _self.isEdit = true;
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.name1 = _self.tableData[index].name;
        _self.addEditDialogForm.name3 = _self.tableData[index].remark;
        _self.addEditDialogForm.name2 = _self.tableData[index].type;
        _self.searchData.taskNameTop = _self.tableData[index].actionName;
        _self.Editindex = index;
        let data = {"id":_self.tableData[index].id};
        statisticsGet(data).then(function (res) {
          _self.searchData.list = res.data.details;
          _self.searchData.tableId = res.data.tableId;
          _self.searchData.tableName = res.data.tableName;
          _self.searchData.taskId = res.data.taskId;
          _self.relations = res.data.relations;
          if(res.data.relations){
              if(res.data.relations.length||res.data.taskId){
                _self.dataSelectDisable = true;
              }else{
                _self.dataSelectDisable = false;
              }
          }

          let data = {"id":_self.searchData.tableId};
          tableGet(data).then(function(res){
            _self.dialogTable = res.data.columns;
            let oldData = [];
            _self.colLength = res.data.columns.length;
            for(let i = 0;i<res.data.columns.length;i++){
              let  id = '';
              let  sourceName = '';
              let  taskId = '';
              let  actionName ='';
              let  colTarget ='';
              let  ioName = '';
              let  stepName = '';
              let stepNo = '';
              let stepId = '';

              if(_self.relations){
                  for (let j=0;j<_self.relations.length;j++){
                    if (_self.relations[j].columnId==res.data.columns[i].id){
                      id = _self.relations[j].id;
                      sourceName = _self.relations[j].sourceName;
                      taskId = _self.relations[j].taskId;
                      actionName = _self.relations[j].actionName;
                      colTarget = _self.relations[j].colTarget;
                      ioName = _self.relations[j].ioName;
                      stepNo = _self.relations[j].stepNo;
                      stepName = _self.relations[j].stepName;
                      stepId = _self.relations[j].stepId;
                    }
                  }
                }
                if(actionName){
                  oldData.push({
                    name2:stepNo+'：'+stepName,
                    name3:ioName,
                    name4:sourceName,
                    name5:colTarget||res.data.columns[i].remark,
                    taskName:actionName,
                    actionName:actionName,
                    taskId:taskId,
                    relationItemId:id,
                    colId:res.data.columns[i].id,
                    colName:res.data.columns[i].name,
                    displayName:res.data.columns[i].displayName,
                    step1Data:[],
                    step2Data:[],
                    step3Data:[],
                    step1:true,
                    step2:false,
                    step3:false,
                    identity:"",
                    sourceName:sourceName,
                    colTarget:colTarget,
                    stepName : stepName,
                    stepNo : stepNo,
                    stepId : stepId

                })

                }else{
                  oldData.push({
                    name2:stepNo+'：'+stepName,
                    name3:ioName,
                    name4:sourceName,
                    name5:colTarget||res.data.columns[i].remark,
                    taskName:actionName,
                    actionName:actionName,
                    taskId:taskId,
                    relationItemId:id,
                    colId:res.data.columns[i].id,
                    colName:res.data.columns[i].name,
                    displayName:res.data.columns[i].displayName,
                    step1Data:[],
                    step2Data:[],
                    step3Data:[],
                    step1:false,
                    step2:false,
                    step3:false,
                    identity:"",
                    sourceName:sourceName,
                    colTarget:colTarget,
                    stepName : stepName,
                    stepNo : stepNo,
                    stepId : stepId
                  })
                }
                if(taskId){
                  let data2 = {"id":taskId};
                  taskGet(data2).then(function (res) {
                    //第一步
                    _self.searchData.stepList = res.data.taskSteps;
                    _self.stepList = res.data.taskSteps;
                    _self.taskSelect[i].step1Data = _self.getTaskStep(res);
                    if(stepName){
                      //第二步
                      _self.taskSelect[i].step2Data = _self.getTaskWhichPut(res,stepNo);
                      _self.taskSelect[i].step2 = true;
                      if(ioName){
                        // 第三步
                        _self.taskSelect[i].step3Data = _self.getTaskWhichIdentity(res,stepNo,ioName);
                        _self.taskSelect[i].step3 = true;
                      }
                    }

                  })
                }

            }

            setTimeout(function(){
              _self.taskSelect = oldData;
            },1)
          })
        }).catch(function(res){
          _self.$message({
            type: 'warning',
            message: res.msg
          });
        });
      },
      //新增数据管理
      addListEvent(name){
        let _self = this;
        _self.isEdit = false;
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.name1 = '';
        _self.addEditDialogForm.name2 = '';
        _self.addEditDialogForm.name3 = '';
        _self.searchData.tableId = '';
        _self.searchData.tableName = '';
        _self.taskSelect = [];
        _self.dataSelectDisable =  false;
        _self.searchData.taskNameTop ='';//taskIdTop
        _self.searchData.taskIdTop ='';
        _self.searchData.list?_self.searchData.list.length=0:'';
        setTimeout(function(){
          _self.$refs[name].resetFields()
        },200)
      },
      //禁用或者激活当前数据管理
      handleStop(index,row){
        let _self = this;
        let data = {"id":_self.tableData[index].id};
        if(_self.tableData[index].status===1){
          this.$confirm('此操作将禁用【' + row.name + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            statisticsDelete(data).then(function (res) {
              if (res.success) {
                _self.$message({
                  type: 'success',
                  message: '禁用成功!'
                });
                _self.tableData[index].status = 0
              } else {
                _self.$message({
                  type: 'warning',
                  message: res.msg
                });
              }
            }).catch((res)=>{
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            })
          }).catch(function(){
              console.log("cancel")
          })
        }else{
          this.$confirm('此操作将激活【' + row.name + '】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            statisticsRevoke(data).then(function(res){
              _self.$message({
                type: 'success',
                message: '激活成功!'
              });
            }).catch(function(res){
              _self.$message({
                type: 'warning',
                message: res.msg
              });
            });
            _self.tableData[index].status = 1

          }).catch(function(){
            console.log("cancel")
          })
        }
      },
      //总的查询
      searchEvent(){
        let _self = this;
        _self.loading2 = true;
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        statisticsList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: 1
          }
        }).catch(function(res){
          _self.$message({
            type: 'warning',
            message: res.msg
          });
        });
      },
      //数据管理选择一页展示多少个
      handleSizeChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":_self.page.currentPage,"prePageResult":val};
        statisticsList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: val,
            total: res.total,
            currentPage: _self.page.currentPage
          }
        }).catch(function(res){
          _self.$message({
            type: 'warning',
            message: res.msg
          });
        });
      },
      //数据管理点击第几页---分页
      handleCurrentChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":val,"prePageResult":_self.page.pageSize};
        statisticsList(data).then(function (res) {
          _self.loading2 = false;

          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: val
          }

        }).catch(function(res){
          _self.$message({
            type: 'warning',
            message: res.msg
          });
        });
      },
      //关闭统计回调
      handleClose(){
        this.viewStatisticsShow=false
      },
      //下拉菜单触发统计
      handleCommand(commond){
        let _self =this;
        if(commond=="a") {
          _self.viewStackedFoldLine();
        }else if(commond=="b"){
          _self.viewStack();

        }
      },
      //统计表导出
      exportData(){
        window.location.href = window.location.origin + '/statistic/dsp/statistics/detail/export'+"?infoId="+this.tableData[this.infoIndex].id+"&Authorization="+sessionStorage.getItem("userToken");
      },
      //计算detail表长度，控制样式
      getTitleWidth(data){
        let lin = 0;
        data.forEach((item,index)=>{
          if(index){
            if(item.length>3){
              lin += item.length*25;
            }else{
              lin += 150;
            }
          }
        });
        lin +=300;// 批次号
        lin += 200;//查看统计
        lin += 2;//边框
        return lin
      },
      //计算dialog宽度
      getDialogConWidth(titleWidth,dialogConWidth,ColLength){
        if(titleWidth<dialogConWidth){
          return parseInt((dialogConWidth-300-200-20)/(ColLength-1))
        }
        return 0;
      },
      handleResize (event) {
        let _self =this;
          if(_self.$refs.tableBox){
              _self.tableDetailWidth = _self.getDialogConWidth(_self.titleWidth,_self.$refs.tableBox.offsetWidth,_self.detailTableTitleData.length)
          }
      }
    },
    computed: {
      ...mapState({
        account:state=>state.user.userInfo.account
      })
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.handleResize)
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      let _self = this;
      window.onhashchange=function () {
        if(window.location.hash.indexOf("?is_dia=1")<0){
          _self.viewStatisticsShow=false;
        }
      };
      let data = {"name":_self.searchData.key,"type":_self.searchData.type,"status":_self.searchData.status,"currPage":1,"prePageResult":10};
      statisticsList(data).then(function (res) {
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
      columnQuery(data2).then(function(res){
        _self.columnCategoryList = res.data;
      }).catch(function(res){
        _self.$message({
          type: 'warning',
          message: res.msg
        });
      })
    }
  }
</script>

<style lang="scss">
  .statistical-template-container{

    max-height: 550px;
    overflow-y: auto;
    #tableBox{
      overflow-x: scroll;
    }
    .table-wrap{
      .content{
        float: left;
        text-align: center;
        line-height:36px;
      }
    }
    .titlestyle{
      background-color: #000;
      border:1px solid #dfe6ec;
      line-height:40px;
      text-align: center;
      color:#fff;
      .content{
        box-shadow: 0 0 2px #fff;
      }
    }
    .bg-purple-dark{
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      &:nth-child(2n+1){
        background-color: #EEF1F6;

      }
    }
    .dialog{
      .el-dialog__body{
        height:680px;
        .el-carousel{
          height:100%;
          .el-carousel__container{
            height:100%;
            .el-carousel__item{
              height:100%;
            }
          }
        }
      }
    }
    .download-img{
      position:absolute;
      left:25px;
      bottom:50px;
      z-index:9999;
      img{
        width:100%;
        height:100%;
        display:block;

      }
    }

  }
  #tableBox::-webkit-scrollbar{
     width: 12px;
     height: 12px;
   }
  #tableBox::-webkit-scrollbar-thumb {
     border-radius: 12px;
     -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
     background: rgba(0,0,0,0.6);
   }
  .market-count-container::-webkit-scrollbar{
    width: 6px;
    height: 6px;
  }
  .market-count-container::-webkit-scrollbar-thumb{
    border-radius: 6px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.6);
  }
  .diycolor{
     background-color: #e76b5f;
     border-color: #e76b5f;
   }
</style>
