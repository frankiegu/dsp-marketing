<template>
   <el-dialog
     title="拒绝原因"
     size="tiny"
     :visible="show"
     :close-on-click-modal="false"
     :close-on-press-escape="false"
     :before-close="handleClose">
      <el-form :model="prompt" label-position="top" :rules="rules" ref="prompt">
        <el-form-item label="拒绝类型"  prop="reason">
          <el-select
            clearable
            @clear="cleanReason"
            v-model="prompt.reason"
            placeholder="请选择拒绝类型"
            @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拒绝原因"  prop="desc">
          <el-input type="textarea" v-model="prompt.desc" placeholder="请选择拒绝原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="pink"  @click="handleRefuse('prompt')">审核拒绝</el-button>
      </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'PromptSelect',
        data () {
            return {
                prompt:{
                  reason:'',
                  desc:''
                },
                rules: {
                  reason: [
                    { type: 'number', required: true, message: '请选择原因类型', trigger: 'blur' }
                  ],
                  desc: [
                    { required: true, message: '请输入具体描述', trigger: 'blur' }
                  ]
                }
            }
        },
        props:{
            show:{
                type:Boolean,
                default:true
            },
            options:{
               type:Array,
               default:[{
                  label:'',
                  value:0
               }]
            },
            params:{
               type:Object,
            }
        },
        watch:{
          show(value){
              if(value){
                this.prompt={
                  reason:'',
                  desc:''
                };
              }
          }
        },
        components: {},
        methods: {
          handleChange(value){
            let _obj = null;
            _obj = this.options.find(item=>{
              return item.value === value;
            });
            this.prompt.desc = _obj ? _obj.desc : '';
          },
          cleanReason(){
            this.prompt.desc = ''
          },
          handleRefuse(name){
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.$emit('refuse',this.prompt,this.params);
              } else {
                return false;
              }
            });

          },
          handleClose(){
            this.$emit('handleClose');
          }

        },
        computed: {

        },
        created() {

        }
    }
</script>

<style lang="scss">

</style>
