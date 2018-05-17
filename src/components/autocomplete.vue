<template>
  <div class="auto-complete-container" v-clickoutside="close">
     <el-input
       type="textarea"
       ref="el_input"
       v-bind="$props"
       v-focus="focusFlag && activated"
       @change="handleChange"
       @focus="handleFocus"
       @keydown.native.tab="close"
       ></el-input> <!--@keydown.native.delete="deleteStr"-->
     <transition name="el-zoom-in-top">
        <ul v-show="activated"
            class="auto-complete-suggestion">
            <template v-for="(item, index) in suggestions">
               <li @click="select(item)">{{item.label}}</li>
            </template>
        </ul>
     </transition>
  </div>
</template>

<script>
  import clickoutside from '@/directive/clickoutside';
  export default {
    name: 'ElAutocomplete',
    props:{
      fetchSuggestions:Function,
      placeholder:String,
      value: String,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      flag:{
         type:Boolean,
         default:true
      }
    },
    directives: {
      clickoutside,
      focus: {
        update(el,{ value },vnode){
          if (value) {
            vnode.context.$children[0].$refs.textarea.focus();
          }
        },
      }
    },
    data() {
      return {
        activated: false,
        isOnComposition: false,
        suggestions: [],
        loading: false,
        focusFlag:false
      };
    },
    methods: {
      getData(queryString) {
        this.loading = true;
        this.fetchSuggestions(queryString, (suggestions) => {
          this.loading = false;
          if (Array.isArray(suggestions)) {
            this.suggestions = suggestions;
          } else {
            console.error('autocomplete suggestions must be an array');
          }
        });
      },
      handleChange(value) {
        this.$emit('input', value);
        this.activated = true;
        if ((!this.triggerOnFocus && !value)) {
          this.suggestions = [];
          return;
        }
        this.getData(value);
      },
      handleFocus() {
        this.activated = true;
        if (this.triggerOnFocus) {
          this.getData(this.value);
        }
      },
      close(e) {
        this.activated = false;
      },
      deleteStr(e){
        e.preventDefault();
        if(this.value){
          console.log(this.value);
            let _temp=this.value.split(/\s+/g);
            _temp.splice(_temp.length - 1,1);
            let _str=_temp.join(' ');
           this.$emit('input', _str);
        }
        if (this.triggerOnFocus) {
          this.getData(this.value);
        }
      },
      select(item) { // flag  true-支持多参数 false-支持唯一参数
          let _key=item.value;
          if(this.flag){
            _key=item.multi_value;
          }
          if(this.value&&this.flag){
              let sign=this.value.match(/[\s+]/g) || [];
              if(sign.length){
                  let qsArr = this.value.split(sign[sign.length-1]) || [];
                  qsArr[qsArr.length-1]=item.multi_value;
                  _key=qsArr.join(sign[sign.length-1]);
              }
          }
          this.focusFlag=true;
          //console.log(this.$refs["el_input"]);
          this.$emit('input', _key);
          this.$emit('select', item);
          this.$nextTick(_ => {
            this.suggestions = [];
          });
      }
    },
    mounted() {
      this.$on('item-click', item => {
        this.select(item);
      });
    }
  };
</script>

<style lang="scss">
 .auto-complete-container{
   position: relative;
   padding-bottom: 10px;
   .auto-complete-suggestion{
     position: absolute;
     width:100%;
     top:55px;
     left: 0;
     max-height: 280px;
     overflow: auto;
     background-color: #fff;
     border: 1px solid #d1dbe5;
     padding: 0 10px ;
     border-radius: 2px;
     box-sizing: border-box;
     z-index: 1;
     li{
       line-height: 34px;
       height: 34px;
     }
   }
 }
</style>
