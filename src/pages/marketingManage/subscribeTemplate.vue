<template>
  <div class="subscribe-template-container">
    <el-row>
      <el-col>
        <!-- 搜索栏 -->
        <div class="search-container">
          <el-form :inline="true">
            <el-form-item label="任务编号">
              <el-input type="number" v-model="template_query.taskId" placeholder="任务编号"/>
            </el-form-item>
            <el-form-item label="模板名称">
              <el-input v-model="template_query.name" placeholder="模板名称"/>
            </el-form-item>
            <el-form-item label="模板类型">
              <el-select value="" v-model="template_query.type" clearable placeholder="模板类型">
                <el-option label="短信" value="MOBILE"/>
                <el-option label="邮件" value="EMAIL"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="button" class="search-btn" @click="loadTemplate">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="success" class="search-add" @click="initTask">新增</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 模板表格 -->
        <div class="search-table">
          <el-table border height="400" v-loading="template_loading" tooltip-effect="dark" style="width: 100%" :data="template_data">
            <el-table-column prop="id" label="编号" header-align="center" width="70"/>
            <el-table-column prop="dspTask.id" label="任务编号" header-align="center" width="100"/>
            <el-table-column prop="dspTask.taskName" label="任务名称" show-overflow-tooltip header-align="center"/>
            <el-table-column prop="name" label="模板名称" show-overflow-tooltip header-align="center" width="200"/>
            <el-table-column prop="type" :formatter="formatTemplateType" label="类型" header-align="center" width="70"/>
            <el-table-column prop="createTime" label="创建时间" header-align="center" width="170"/>
            <el-table-column prop="isActive" :formatter="formatActive" label="是否激活" header-align="center" width="100"/>
            <el-table-column label="操作" header-align="center" width="200">
              <template slot-scope="scope">
                <el-button size="small" @click="initEditTemplate(scope.row.dspTask.id,scope.row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="showDelete(scope.row.id)">删除</el-button>
                <el-button v-if="scope.row.isActive !== 1" size="small" type="success" @click="showActive(scope.row.id)">激活</el-button>
                <el-button v-if="scope.row.isActive === 1" size="small" type="warning" @click="showForbidden(scope.row.id)">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 查看任务 -->
    <el-dialog title="新增模板" :visible.sync="task_show" size="small" top="5vh" @open="showTask">
      <div class="search-container">
        <el-form :inline="true">
          <el-form-item label="任务名称">
            <el-input v-model="task_query.taskName" placeholder="任务名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="success" class="search-add" @click="loadTask">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-table">
        <el-table border height="360" v-loading="task_loading" tooltip-effect="dark" style="width: 100%" :data="task_data">
          <el-table-column prop="id" label="编号" header-align="center" width="70"/>
          <el-table-column prop="taskName" label="任务名称" header-align="center"/>
          <el-table-column label="操作" header-align="center" width="150">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="initEditTemplate(scope.row.id,0)">新增模板</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: right;">
        <el-pagination
          @size-change="taskSizeChange"
          @current-change="taskCurrentChange"
          :current-page="task_query.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="task_query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="task_total"/>
      </div>
    </el-dialog>

    <el-dialog title="编辑模板" :visible.sync="edit_template_show" size="small" top="5vh" @open="showEditTemplate">
      <div style="overflow-y: auto;overflow-x:hidden;height: 450px">
        <el-form label-width="70px">
          <el-form-item label="模板名称">
            <el-input v-model="template_save.template.name"/>
          </el-form-item>
          <el-form-item label="模板类型">
            <el-select v-model="template_save.template.type" style="width: 100%;">
              <el-option label="短信" value="MOBILE"/>
              <el-option label="邮件" value="EMAIL"/>
            </el-select>
          </el-form-item>
          <el-form-item label="批次参数">
            <table>
              <tr v-for="row in Math.ceil(batch_param.length/6)">
                <td v-for="column in 6">
                  <template v-if="(row - 1) * 6 + column <= batch_param.length">
                    <el-button @click="appendBatchParam(batch_param[(row - 1) * 6 + column - 1])"
                               :style="(column !== 1 ? 'margin-left:20px;' : '') + (row !== 1 ? 'margin-top:5px;' : '')">
                      {{batch_param[(row - 1) * 6 + column - 1].displayName}}
                    </el-button>
                  </template>
                </td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="批次文本">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="template_save.template.batchMessage"/>
          </el-form-item>

          <el-form-item label="任务参数">
            <table>
              <tr v-for="row in Math.ceil(task_param.length/6)">
                <td v-for="column in 6">
                  <template v-if="(row - 1) * 6 + column <= task_param.length">
                    <el-button @click="appendTaskParam(task_param[(row - 1) * 6 + column - 1])"
                               :style="(column !== 1 ? 'margin-left:20px;' : '') + (row !== 1 ? 'margin-top:5px;' : '')">
                      {{task_param[(row - 1) * 6 + column - 1].displayName}}
                    </el-button>
                  </template>
                </td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="任务文本">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="template_save.template.taskMessage"/>
          </el-form-item>

          <el-form-item label="选择步骤">
            <el-checkbox :key="step" v-for="step in task_step_data" v-model="step.checked" :label="step.displayName" border/>
          </el-form-item>
          <el-form-item label="步骤参数">
            <table>
              <tr v-for="row in Math.ceil(step_param.length/6)">
                <td v-for="column in 6">
                  <template v-if="(row - 1) * 6 + column <= step_param.length">
                    <el-button @click="appendStepParam(step_param[(row - 1) * 6 + column - 1])"
                               :style="(column !== 1 ? 'margin-left:20px;' : '') + (row !== 1 ? 'margin-top:5px;' : '')">
                      {{step_param[(row - 1) * 6 + column - 1].displayName}}
                    </el-button>
                  </template>
                </td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="步骤文本">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" v-model="template_save.template.stepMessage"/>
          </el-form-item>

          <el-form-item v-show="'EMAIL' === template_save.template.type" label="选择附件">
            <el-form inline v-for="(selected,index) in selected_source" :key="index">
              <el-form-item>
                <el-cascader style="width: 610px;" :options="source_data" v-model="selected_source[index]"
                             placeholder="请选择附件" clearable @change="sourceChange"/>
              </el-form-item>
              <i class="el-icon-plus" v-if="index === 0" @click="selected_source.push([])"></i>
              <i class="el-icon-minus" v-else @click="unSelectSource(index,selected)"></i>
            </el-form>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: right">
        <el-button type="danger" class="search-add" @click="handleSave">确定</el-button>
        <el-button type="success" class="search-add" @click="edit_template_show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {queryTemplates,queryTasks,queryActions,queryTaskSteps,
    queryBatchParam,queryTaskParam,queryStepParam,saveTemplate,
    activeTemplate,forbiddenTemplate,deleteTemplate,queryTemplate} from '@/api/marketingManage/subscribeTemplate-api';

  export default {
    name: "subscribeTemplate",
    data(){
      return {
        template_query:{
          pageSize: 10,
          currentPage: 1,
          taskId: null,
          name: null,
          type: null
        },
        template_total: 0,
        template_loading: true,
        template_data:[],

        task_query:{
          pageSize: 10,
          currentPage: 1,
          taskName: null
        },
        task_total: 0,
        task_show:false,
        task_loading: true,
        task_data: [],

        template_save:{
          taskId: null,
          template: {
            id: 0,
            name: null,
            type: 'MOBILE',
            batchMessage: '',
            taskMessage: '',
            stepMessage: '',
          },
          templateParamList:[],
          templateStepList:[],
          templateDataList:[]
        },
        action_data:null,
        task_step_data: [],
        source_data:[],
        selected_source:[[]],
        source_name:{},
        edit_template_show:false,
        edit_param_show:false,

        batch_param:[],
        task_param:[],
        step_param:[],
      };
    },
    computed:{
      selectedTaskSteps:function () {
        let result = [];
        this.task_step_data.forEach(step => {
          if(step.checked === true){
            let obj = {};
            obj.stepNo = step.stepNo;
            result.push(obj);
          }
        });
        return result;
      },
      selectedSources:function () {
        let result = [];
        this.selected_source.forEach(item => {
          if(item.length === 3){
            let identity = item[2];
            let name = this.source_name[item[2]];
            let obj = {
              identity: identity,
              type: item[1],
              name: name
            };
            result.push(obj);
          }
        });
        return result;
      }
    },
    methods:{
      /**
       * 加载模板数据
       */
      loadTemplate(){
        queryTemplates(this.template_query).then(data => {
          if(data.code === 1 && data.data){
            this.template_data = data.data;
            this.template_total = data.total;
          }else{
            this.template_data = [];
            this.template_total = 0;
          }
          this.template_loading = false;
        });
      },
      showDelete(templateId){
        this.$confirm('是否确认删除?','确认删除',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDelete(templateId);
        }).catch(() => {
        });
      },
      handleDelete(templateId){
        deleteTemplate(templateId).then(data => {
          if(data.code === 1){
            this.template_loading = true;
            this.$message({
              showClose: true,
              message: '删除成功!',
              type: 'success'
            });
            this.loadTemplate();
          }
        });
      },
      showActive(templateId){
        this.$confirm('是否确认激活?','确认激活',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleActive(templateId);
        }).catch(() => {
        });
      },
      handleActive(templateId){
        activeTemplate(templateId).then(data => {
          if(data.code === 1){
            this.template_loading = true;
            this.$message({
              showClose: true,
              message: '激活成功!',
              type: 'success'
            });
            this.loadTemplate();
          }
        });
      },
      showForbidden(templateId){
        this.$confirm('是否确认禁用?','确认禁用',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleForbidden(templateId);
        }).catch(() => {
        });
      },
      handleForbidden(templateId){
        forbiddenTemplate(templateId).then(data => {
          if(data.code === 1){
            this.template_loading = true;
            this.$message({
              showClose: true,
              message: '禁用成功!',
              type: 'success'
            });
            this.loadTemplate();
          }
        });
      },
      loadAction(){
        queryActions().then(data => {
          if(data.code === 1 && data.data){
            this.action_data = data.data;
          }else{
            this.action_data = null;
          }
        });
      },
      /**
       * 格式化模板类型
       */
      formatTemplateType(row, column, data){
        switch(data){
          case 'MOBILE':
            return '短信';
          case 'EMAIL':
            return '邮件';
          default:
            return '未知';
        }
      },
      formatActive(row, column, data){
        switch(data){
          case 1:
            return '已激活';
          case 0:
            return '未激活';
          default:
            return '未知';
        }
      },
      /**
       * 显示任务展示界面
       * 并重置任务数据
       */
      initTask(){
        this.task_query.pageSize = 10;
        this.task_query.currentPage = 1;
        this.task_query.taskName = null;
        this.task_total = 0;
        this.task_show = true;
        this.task_loading = true;
        this.task_data = [];
      },
      showTask(){
        this.loadTask();
      },
      /**
       * 加载任务数据
       */
      loadTask(){
        queryTasks(this.task_query).then(data => {
          if(data.code === 1 && data.data){
            this.task_data = data.data;
            this.task_total = data.total;
          }else{
            this.task_data = [];
            this.task_total = 0;
          }
          this.task_loading = false;
        });
      },
      /**
       * 任务表格每页数量改变
       */
      taskSizeChange(pageSize){
        this.task_query.pageSize = pageSize;
        this.task_query.currentPage = 1;
        this.task_loading = true;
        this.loadTask();
      },
      /**
       * 任务表格当前页改变
       */
      taskCurrentChange(currentPage){
        this.task_query.currentPage = currentPage;
        this.task_loading = true;
        this.loadTask();
      },

      initEditTemplate(taskId,templateId){
        this.template_save.taskId = taskId;
        this.template_save.template.id = templateId;

        this.task_step_data = [];
        this.source_data = [];
        this.source_name = {};
        this.selected_source = [[]];

        if(null !== templateId && templateId !== 0){
          queryTemplate(this.template_save.template.id).then(data => {
            if(data.code === 1 && data.data){
              let template = data.data;
              this.template_save.template.name = template.template.name;
              this.template_save.template.type = template.template.type;
              this.template_save.template.batchMessage = template.template.batchMessage;
              this.template_save.template.taskMessage = template.template.taskMessage;
              this.template_save.template.stepMessage = template.template.stepMessage;
              this.template_save.templateParamList = template.templateParamList;
              this.template_save.templateStepList = template.templateStepList;
              this.template_save.templateDataList = template.templateDataList;
              this.edit_template_show = true;
            }
          });
        }else{
          this.template_save.template.name = null;
          this.template_save.template.type = 'MOBILE';
          this.template_save.template.batchMessage = '';
          this.template_save.template.taskMessage = '';
          this.template_save.template.stepMessage = '';
          this.template_save.templateParamList = [];
          this.template_save.templateStepList = [];
          this.template_save.templateDataList = [];
          this.edit_template_show = true;
        }
      },
      showEditTemplate(){
        this.loadTaskStep();
        this.loadSources();
        this.loadCustomizeParam();
      },
      loadTaskStep(){
        queryTaskSteps(this.template_save.taskId).then(data => {
          if(data.code === 1 && data.data){
            data.data.forEach(step => {
              let obj = {};
              obj.stepNo = step.stepNo;
              obj.displayName = this.action_data[step.actionName]['displayName'];
              if(null !== this.template_save.template.id && this.template_save.template.id !== 0){
                obj.checked = false;
                this.template_save.templateStepList.forEach(item => {
                  if(obj.stepNo === item.stepNo){
                    obj.checked = true;
                  }
                });
              }else{
                obj.checked = true;
              }
              this.task_step_data.push(obj);
            });
          }else{
            this.task_step_data = [];
          }
        });
      },
      loadSources(){
        queryTaskSteps(this.template_save.taskId).then(data => {
          if(data.code === 1 && data.data){
            data.data.forEach(step => {
              let stepOption = {
                label: '第' + step.stepNo + '步:' + this.action_data[step.actionName]['displayName'],
                value: step.stepNo,
                disabled: false,
                children:[]
              };

              if(step.inputSources !== null && step.inputSources !== undefined){
                let typeOption = {
                  label: '输入源',
                  value: 'input',
                  disabled: false,
                  children:[]
                };
                step.inputSources.forEach(inputSource => {
                  let sourceOption = {
                    label: inputSource.displayName,
                    value: inputSource.identity,
                    disabled: false
                  };

                  if(null !== this.template_save.template.id && this.template_save.template.id !== 0){
                    this.template_save.templateDataList.forEach(source => {
                      if(source.type === 'input' && source.identity === inputSource.identity){
                        sourceOption.disabled = true;
                        if(this.selected_source[0].length === 0){
                          this.selected_source[0] = [step.stepNo,'input',inputSource.identity];
                        }else{
                          this.selected_source.push([step.stepNo,'input',inputSource.identity]);
                        }
                      }
                    });
                  }

                  this.source_name[inputSource.identity] = inputSource.displayName;
                  typeOption.children.push(sourceOption);
                });
                stepOption.children.push(typeOption);
              }
              if(step.outputSources !== null && step.outputSources !== undefined){
                let typeOption = {
                  label: '输出源',
                  value: 'output',
                  disabled: false,
                  children:[]
                };
                step.outputSources.forEach(outputSource => {
                  let sourceOption = {
                    label: outputSource.displayName,
                    value: outputSource.identity,
                    disabled: false
                  };

                  if(null !== this.template_save.template.id && this.template_save.template.id !== 0){
                    this.template_save.templateDataList.forEach(source => {
                      if(source.type === 'output' && source.identity === outputSource.identity){
                        sourceOption.disabled = true;
                        if(this.selected_source[0].length === 0){
                          this.selected_source[0] = [step.stepNo,'output',outputSource.identity];
                        }else{
                          this.selected_source.push([step.stepNo,'output',outputSource.identity]);
                        }
                      }
                    });
                  }

                  this.source_name[outputSource.identity] = outputSource.displayName;
                  typeOption.children.push(sourceOption);
                });
                stepOption.children.push(typeOption);
              }
              this.source_data.push(stepOption);
            });
          }else{
            this.source_data = [];
          }
        });
      },
      sourceChange(val){
        if(val.length === 3){
          this.source_data.forEach(step => {
            if(val[0] === step.value){
              step.children.forEach(type => {
                type.children.forEach(source => {
                  if(val[2] === source.value){
                    source.disabled = true;
                  }
                });
              });
            }
          });
        }
      },
      unSelectSource(index,selected){
        if(selected.length === 3){
          this.source_data.forEach(step => {
            if(selected[0] === step.value){
              step.children.forEach(type => {
                type.children.forEach(source => {
                  if(selected[2] === source.value){
                    source.disabled = false;
                  }
                });
              });
            }
          });
        }
        this.selected_source.splice(index,1);
      },
      loadStaticParam(){
        queryBatchParam().then(data => {
          if(data.code === 1 && data.data){
            this.batch_param = data.data;
          }
        });
        queryTaskParam().then(data => {
          if(data.code === 1 && data.data){
            this.task_param = data.data;
          }
        });
        queryStepParam().then(data => {
          if(data.code === 1 && data.data){
            this.step_param = data.data;
          }
        });
      },
      loadCustomizeParam(){

      },
      appendBatchParam(param){
        this.template_save.template.batchMessage += ('{#' + param.table + '.' + param.displayName + '}');
      },
      appendTaskParam(param){
        this.template_save.template.taskMessage += ('{#' + param.table + '.' + param.displayName + '}');
      },
      appendStepParam(param){
        this.template_save.template.stepMessage += ('{#' + param.table + '.' + param.displayName + '}');
      },
      handleSave(){
        this.template_save.templateStepList = this.selectedTaskSteps;
        this.template_save.templateDataList = this.selectedSources;
        saveTemplate(this.template_save).then(data => {
          if(data.code === 1){
            this.edit_template_show = false;
            this.task_show = false;
            this.template_loading = true;
            this.$message({
              showClose: true,
              message: '编辑成功!',
              type: 'success'
            });
            this.loadTemplate();
          }
        });
      }
    },
    created(){
      this.loadTemplate();
      this.loadAction();
      this.loadStaticParam();
    }
  }
</script>
