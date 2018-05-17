<template>
  <div>
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
          <el-checkbox :key="stepIndex" v-for="(step,stepIndex) in task_step_data" v-model="step.checked" :label="step.displayName" border/>
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
  </div>
</template>

<script>

  import {queryActions,queryTaskSteps,
    queryBatchParam,queryTaskParam,queryStepParam,saveTemplate,queryTemplate} from '@/api/marketingManage/subscribeTemplate-api';

  export default {
    name: "editTemplate",
    data(){
      return {
        taskId: null,
        templateId: null,
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
        task_step_data: [],
        source_data:[],
        action_data:null,
        source_name:{},
        selected_source:[[]],
        edit_template_show:false,
        edit_param_show:false,
        batch_param:[],
        task_param:[],
        step_param:[]
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
    mounted(){
      this.$emit('created');
    },
    methods: {
      initEdit(taskId,templateId){
        this.taskId = taskId;
        this.templateId = templateId;
        this.loadAction();
        this.initEditTemplate();
        this.showEditTemplate();
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
      initEditTemplate(){
        this.template_save.taskId = this.taskId;
        this.template_save.template.id = this.templateId;

        this.task_step_data = [];
        this.source_data = [];
        this.source_name = {};
        this.selected_source = [[]];

        if(null !== this.templateId && this.templateId !== 0){
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
        this.loadStaticParam();
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
            this.$emit('done');
          }
        });
      }
    }
  }
</script>
