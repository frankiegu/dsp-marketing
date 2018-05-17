<template>
  <div class="upload-container" @click="handleClick">
      <input type="file" name="uploadFile" ref="input" :disabled="disabled" :accept="acceptType" @change="change($event)" class="upload-file">
      <div class="upload-group">
          <el-button :type="buttonType" :size="buttonSize" :class="{ border_ra_4:!visibleFlag }">
            <slot name="txtFileName">选择文件</slot>
          </el-button>
          <el-input class="input-large form-control" placeholder="请选择文件" v-show="visibleFlag" v-model="inputTxt"></el-input>
      </div>
  </div>
</template>

<script>
    export default {
        name: 'uploadFiles',
        data () {
            return {
               uploadFile:{},
               fileName:''
            }
        },
        props:{
            acceptType:String,
            nameType:String,
            inputTxt:String,
            visibleFlag:{
                default:true,
                type:Boolean
            },
            disabled:{
              default:false,
              type:Boolean
            },
            buttonSize:{
                default:'',
                type:String
            },
            buttonType:{
              default:'default',
              type:String
            },
            selectTable:{
              default:'',
              type:String
            },
        },
        components: {},
        methods: {
          change(e){
               this.uploadFile=e.target.files[0];
               //this.fileName = e.target.files[0].name;
             this.$emit('changeFile',this.uploadFile,this.nameType,this.selectTable);
          },
          handleClick(){
            if (!this.disabled) {
              this.$refs.input.value = null; //重新选择相同一个文件
            }
          }
        },
        computed: {},
        created() {

        }
    }
</script>
