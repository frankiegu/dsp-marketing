<template>
  <div class="market-task-timer-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-input class="search-key" v-model="taskName" :maxlength="20" placeholder="请输入查询"/>
        </div>

        <!-- 任务查询组件 -->
        <marketTaskTimerTask :task-name="taskName">
          <!-- 自定义操作 -->
          <template slot-scope="scope">
            <el-button size="small" @click="showTimer(scope.taskId)">查看批次</el-button>
            <el-button size="small" @click="showTemplate(scope.taskId)">查看模板</el-button>
            <el-button size="small" type="success" @click="showExecute(scope.taskId,false)">执行规则</el-button>
            <el-button size="small" type="warning" @click="showExecute(scope.taskId,true)">参数化执行</el-button>
          </template>
        </marketTaskTimerTask>
      </el-col>
    </el-row>

    <el-dialog title='查看批次' :close-on-click-modal="false" size="large" :visible.sync="timerShow">
      <!-- 批量执行维护组件 -->
      <marketTaskTimerTimer ref="marketTaskTimerTimer" @created="timerCreated">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status !== '4'" size="small" type="danger"
            @click="$refs.marketTaskTimerTimer.showCancel(scope.row.id)">取消</el-button>
          <el-button
            :disabled="scope.row.status !== '4' && scope.row.status !== '3'"
            size="small" type="danger" plain @click="$refs.marketTaskTimerTimer.subscribe(scope.row.id)">订阅</el-button>
          <el-button size="small" @click="showBatch(scope.row)">查看</el-button>
          <el-button size="small" @click="showResetBatch(scope.row.id,scope.row.taskId,true)">带参重设</el-button>
          <el-button size="small" @click="showResetBatch(scope.row.id,scope.row.taskId,false)">无参重设</el-button>
        </template>
      </marketTaskTimerTimer>
    </el-dialog>

    <el-dialog title='查看参数' :close-on-click-modal="false" size="medium" :visible.sync="paramShow">
      <showBatch :row="batchRow">

      </showBatch>
    </el-dialog>


    <el-dialog title='重设' :close-on-click-modal="false" size="medium" :visible.sync="resetShow">
      <editBatch ref="editBatch" @created="resetCreated" @done="resetDone()" @error="resetShow = false">

      </editBatch>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="resetNeedParam" type="text" style="float:left;" @click="$refs.editBatch.addItem()">新增列</el-button>
        <el-button @click="resetShow = false">取 消</el-button>
        <el-button type="pink" @click="$refs.editBatch.executeTask()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看模板" :close-on-click-modal="false" size="large" :visible.sync="templateShow">
      <!-- 订阅模板组件 -->
      <marketTaskTimerTemplate ref="marketTaskTimerTemplate" @created="templateCreated">
        <template slot-scope="scope">
          <el-button size="small" @click="showEditTemplate(scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="$refs.marketTaskTimerTemplate.showDelete(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.isActive !== 1" size="small" type="success" @click="$refs.marketTaskTimerTemplate.showActive(scope.row.id)">激活</el-button>
          <el-button v-if="scope.row.isActive === 1" size="small" type="warning" @click="$refs.marketTaskTimerTemplate.showForbidden(scope.row.id)">禁用</el-button>
        </template>
      </marketTaskTimerTemplate>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateShow = false">取 消</el-button>
        <el-button type="pink" @click="showEditTemplate(0)">新增模板</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="templateId === 0 ? '新增模板' : '编辑模板'" :close-on-click-modal="false" size="large" :visible.sync="editTemplateShow">
      <editTemplate ref="editTemplate" @created="editTemplateCreated" @done="editTemplateDone()" @error="editTemplateShow = false">

      </editTemplate>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTemplateShow = false">取 消</el-button>
        <el-button type="pink" @click="$refs.editTemplate.handleSave()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title='executeParam ? "参数化执行": "执行规则"' :close-on-click-modal="false" size="medium" :visible.sync="executeShow">
      <taskExecute ref="taskExecute" @created="executeCreated" @done="executeDone()" @error="executeShow = false"/>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="executeParam" type="text" style="float:left;" @click="$refs.taskExecute.addItem()">新增列</el-button>
        <el-button @click="executeShow = false">取 消</el-button>
        <el-button type="pink" @click="$refs.taskExecute.executeTask()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import marketTaskTimerTask from '@/pages/marketingManage/markettasktimer/marketTaskTimerTask.vue';
  import marketTaskTimerTimer from '@/pages/marketingManage/markettasktimer/marketTaskTimerTimer.vue';
  import marketTaskTimerTemplate from '@/pages/marketingManage/markettasktimer/marketTaskTimerTemplate.vue';
  import editTemplate from '@/pages/marketingManage/markettasktimer/editTemplate.vue';
  import showBatch from '@/pages/marketingManage/markettasktimer/showBatch.vue';
  import editBatch from '@/pages/marketingManage/markettasktimer/editBatch.vue';
  import taskExecute from '@/pages/marketingManage/markettasktimer/taskExecute.vue';

  export default {
    name: "marketTaskTimer",
    data() {
      return {
        taskName: null,
        taskId: null,
        template_taskId: null,
        templateId: null,
        timer_taskId: null,
        timer_created: false,
        timerShow: false,
        template_created: false,
        templateShow: false,
        execute_taskId: null,
        execute_created:false,
        executeShow: false,
        executeParam: false,
        edit_template_created:false,
        editTemplateShow: false,
        paramShow:false,
        batchRow: null,
        reset_batchId: null,
        reset_taskId: null,
        reset_created: false,
        resetShow:false,
        resetNeedParam: false
      };
    },
    components: {
      marketTaskTimerTask,
      marketTaskTimerTimer,
      marketTaskTimerTemplate,
      editTemplate,
      showBatch,
      editBatch,
      taskExecute
    },
    methods: {
      timerCreated(){
        this.timer_created = true;
        this.$refs.marketTaskTimerTimer.loadTimer(this.timer_taskId);
      },
      showTimer(taskId){
        this.timer_taskId = taskId;
        if(this.timer_created){
          this.$refs.marketTaskTimerTimer.loadTimer(this.timer_taskId);
        }
        this.timerShow = true;
      },
      templateCreated(){
        this.template_created = true;
        this.$refs.marketTaskTimerTemplate.loadTemplate(this.template_taskId);
      },
      showTemplate(taskId){
        this.template_taskId = taskId;
        if(this.template_created){
          this.$refs.marketTaskTimerTemplate.loadTemplate(this.template_taskId);
        }
        this.templateShow = true;
      },
      editTemplateCreated(){
        this.edit_template_created = true;
        this.$refs.editTemplate.initEdit(this.template_taskId,this.templateId);
      },
      showEditTemplate(templateId){
        this.templateId = templateId;
        if(this.edit_template_created){
          this.$refs.editTemplate.initEdit(this.template_taskId,this.templateId);
        }
        this.editTemplateShow = true;
      },
      editTemplateDone(){
        this.$refs.marketTaskTimerTemplate.loadTemplate();
        this.editTemplateShow = false
      },
      showBatch(row){
        this.batchRow = row;
        this.paramShow = true;
      },
      resetCreated(){
        this.reset_created = true;
        this.$refs.editBatch.initItem(this.reset_batchId,this.reset_taskId,this.resetNeedParam);
      },
      showResetBatch(batchId,taskId,needParam){
        this.reset_batchId = batchId;
        this.reset_taskId = taskId;
        this.resetNeedParam = needParam;
        if(this.reset_created){
          this.$refs.editBatch.initItem(this.reset_batchId,this.reset_taskId,this.resetNeedParam);
        }
        this.resetShow = true;
      },
      resetDone(){
        this.$refs.marketTaskTimerTimer.loadTimer(this.reset_taskId);
        this.resetShow = false;
      },
      executeCreated(){
        this.execute_created = true;
        this.$refs.taskExecute.initItem(this.execute_taskId,this.executeParam);
      },
      showExecute(taskId,needParam){
        this.execute_taskId = taskId;
        this.executeParam = needParam;
        if(this.execute_created){
          this.$refs.taskExecute.initItem(this.execute_taskId,this.executeParam);
        }
        this.executeShow = true;
      },
      executeDone(){
        this.executeShow = false;
      }
    }
  };
</script>
