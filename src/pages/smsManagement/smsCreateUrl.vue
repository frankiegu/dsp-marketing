<template>
    <div class="sms-create-url-container">
      <div class="set-title">生成短链</div>
      <div class="set-form">
        <el-form :model="url.form" label-position="top" :rules="url.rules" ref="url">
          <el-form-item label="构建短链方式" label-width="100px" prop="builderType">
            <el-select v-model="url.form.builderType" clearable placeholder="请选择">
              <el-option
                v-for="item in url.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="构建短链手机号" label-width="100px" prop="mobile">
            <el-input
              class="wid_80"
              v-model="url.form.mobile"
              :maxlength="11"
              placeholder="请输入构建短链手机号"
              auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="构建原始Url" label-width="100px" prop="oriurl">
            <el-input
              class="wid_80"
              v-model="url.form.oriurl"
              placeholder="请输入构建原始Url"
              auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="set-form-button">
          <el-button type="pink" @click="handleSave('url')">提交</el-button>
          <el-button @click="resetForm('url')">重置</el-button>
        </div>
      </div>
      <div class="set-title" v-if="url.result">生成记录</div>
      <div class="link-txt" v-if="url.result">
        <span><label>原始短链:</label>{{ url.result.oriurl }}</span>
        <span><label>短链号码:</label>{{ url.result.mobile }}</span>
        <span><label>生成短链:</label>{{ url.result.toUrl }} <em @click="copyToClipboard(url.result.toUrl)">复制</em></span>
      </div>
    </div>
</template>

<script>
  import { smsLink } from '@/api/smsManagement/smsManage-api'
    export default {
        name: 'smsCreateUrl',
        data () {
            return {
                url:{
                    form:{
                      oriurl:'',
                      builderType:'',
                      mobile:''
                    },
                    result:'',
                    rules:{
                      oriurl: [
                        { required: true, message: '请输入短链url', trigger: 'blur' },//((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*(\?([\w]+\=[^\s]*)*[\&]?)
                        { pattern:/^((https?|ftp|file):\/\/)?[^\s]*$/ , message: '请正确的url(如http://www.baidu.com)', trigger: 'blur' }
                      ],
                      mobile: [
                        { required: true , pattern: /^1[34578]\d{9}$/, message: '请正确的11位手机号码', trigger: 'change' }
                      ],
                      builderType: [
                        {required: true, message: '请选择短链构建方式', trigger: 'blur' },
                      ]
                    },
                    options: [{
                      value: '11',
                      label: 'raiyi.cn'
                    },{
                      value: '12',
                      label: 'sina.com.cn'
                    }],
                }
            }
        },
        components: {},
        methods: {
          handleSave(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                smsLink(this.url.form).then( data => {
                  this.$message({
                    showClose: true,
                    message: '短链生成成功！',
                    type: 'success'
                  });
                  this.url.result = JSON.parse(JSON.stringify(this.url.form));
                  this.$set(this.url.result,"toUrl",data.data);
                  this.$refs[formName].resetFields();
                });
              } else {
                return false;
              }
            });
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
          }
        },
        computed: {},
        created() {

        }
    }
</script>

<style lang="scss">

</style>
