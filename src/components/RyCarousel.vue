<template>
  <div
    class="el-carousel"
    :class="{ 'el-carousel--card': type === 'card' }"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave">
    <div
      class="el-carousel__container"
      :style="{ height: height }"
    >
      <transition name="carousel-arrow-left">
        <button
          v-if="arrow !== 'never'"
          v-show="arrow === 'always' || hover"
          @mouseenter="handleButtonEnter('left')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex - 1)"
          class="el-carousel__arrow el-carousel__arrow--left">
          <i class="el-icon-arrow-left"></i>
        </button>
      </transition>
      <transition name="carousel-arrow-right">
        <button
          v-if="arrow !== 'never'"
          v-show="arrow === 'always' || hover"
          @mouseenter="handleButtonEnter('right')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex + 1)"
          class="el-carousel__arrow el-carousel__arrow--right">
          <i class="el-icon-arrow-right"></i>
        </button>
      </transition>
      <slot></slot>
    </div>
    <div class="turn__wrap">
      <div class="el-icon-arrow-down turn-arrow" @click="turn(true)"></div>
      <div class="el-icon-arrow-up turn-arrow" @click="turn(false)"></div>
      <div class="el-carousel__indicators2__wrap">
        <ul
          :style="'margin-top:' +marginTop+'px'"
          class="el-carousel__indicators2"
          v-if="indicatorPosition !== 'none'">
          <li
            v-for="(item, index) in items"
            class="el-carousel__indicator2"
            :class="{ 'is-active': index === activeIndex }"
            @mouseenter="throttledIndicatorHover(index)"
            @click.stop="handleIndicatorClick(index)">
            <div class="el-carousel__button2">{{item.$options.propsData.name}}</div>
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>

<script>
  import throttle from '@/util/throttle';
  import { addResizeListener, removeResizeListener } from '@/util/resize-event';
  export default {
    name: 'ElCarousel',

    props: {
      initialIndex: {
        type: Number,
        default: 0
      },
      height: String,
      trigger: {
        type: String,
        default: 'hover'
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      },
      indicatorPosition: String,
      indicator: {
        type: Boolean,
        default: true
      },
      arrow: {
        type: String,
        default: 'hover'
      },
      type: String
    },

    data() {
      return {
        marginTop:0,
        items: [],
        activeIndex: -1,
        containerWidth: 0,
        timer: null,
        hover: false
      };
    },

    computed: {
      hasLabel() {
        return this.items.some(item => item.label.toString().length > 0);
      }
    },

    watch: {
      items(val) {
        if (val.length > 0) this.setActiveItem(this.initialIndex);
      },

      activeIndex(val, oldVal) {
        this.resetItemPosition(oldVal);
        this.$emit('change', val, oldVal);
        this.marginTop= -parseInt((val)/8)*240
      },

      autoplay(val) {
        val ? this.startTimer() : this.pauseTimer();
      }
    },

    methods: {
      turn(bol){
        let alength = this.items.length;
        let allPage = Math.ceil(alength/8); //总共多少页
        if(bol){
          if(-(this.marginTop)/240>=allPage-1){
            return false
          }else{
            this.marginTop= this.marginTop-240;

          }
        }else{
          if(this.marginTop>=0){
            return false
          }else{
            this.marginTop= this.marginTop+240;

          }
        }


      },
      handleMouseEnter() {
        this.hover = true;
        this.pauseTimer();
      },

      handleMouseLeave() {
        this.hover = false;
        this.startTimer();
      },

      itemInStage(item, index) {
        const length = this.items.length;
        if (index === length - 1 && item.inStage && this.items[0].active ||
          (item.inStage && this.items[index + 1] && this.items[index + 1].active)) {
          return 'left';
        } else if (index === 0 && item.inStage && this.items[length - 1].active ||
          (item.inStage && this.items[index - 1] && this.items[index - 1].active)) {
          return 'right';
        }
        return false;
      },

      handleButtonEnter(arrow) {
        this.items.forEach((item, index) => {
          if (arrow === this.itemInStage(item, index)) {
            item.hover = true;
          }
        });
      },

      handleButtonLeave() {
        this.items.forEach(item => {
          item.hover = false;
        });
      },

      updateItems() {
        this.items = this.$children.filter(child => child.$options.name === 'ElCarouselItem');
      },

      resetItemPosition(oldIndex) {
        this.items.forEach((item, index) => {
          item.translateItem(index, this.activeIndex, oldIndex);
        });
      },

      playSlides() {
        if (this.activeIndex < this.items.length - 1) {
          this.activeIndex++;
        } else {
          this.activeIndex = 0;
        }
      },

      pauseTimer() {
        clearInterval(this.timer);
      },

      startTimer() {
        if (this.interval <= 0 || !this.autoplay) return;
        this.timer = setInterval(this.playSlides, this.interval);
      },

      setActiveItem(index) {
        if (typeof index === 'string') {
          const filteredItems = this.items.filter(item => item.name === index);
          if (filteredItems.length > 0) {
            index = this.items.indexOf(filteredItems[0]);
          }
        }
        index = Number(index);
        if (isNaN(index) || index !== Math.floor(index)) {
          process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][Carousel]index must be an integer.');
          return;
        }
        let length = this.items.length;
        if (index < 0) {
          this.activeIndex = length - 1;
        } else if (index >= length) {
          this.activeIndex = 0;
        } else {
          this.activeIndex = index;
        }
      },

      prev() {
        this.setActiveItem(this.activeIndex - 1);
      },

      next() {
        this.setActiveItem(this.activeIndex + 1);
      },

      handleIndicatorClick(index) {
        this.activeIndex = index;
      },

      handleIndicatorHover(index) {
        if (this.trigger === 'hover' && index !== this.activeIndex) {
          this.activeIndex = index;
        }
      }
    },

    created() {
      this.throttledArrowClick = throttle(300, true, index => {
        this.setActiveItem(index);
      });
      this.throttledIndicatorHover = throttle(300, index => {
        this.handleIndicatorHover(index);
      });
    },

    mounted() {
      this.updateItems();
      this.$nextTick(() => {
        addResizeListener(this.$el, this.resetItemPosition);
        if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
          this.activeIndex = this.initialIndex;
        }
        this.startTimer();
      });
    },

    beforeDestroy() {
      if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
    }
  };
</script>
<style lang="scss">
  .home-container1{
    #card1{
      .el-carousel__container{
        margin-left:100px;
        background-color: #0F1935;
        .el-carousel__item{
          background-color: #0F1935;
        }
      }
      .turn__wrap{
        box-sizing: initial;
        border-right: 5px solid #FF0E1B;
        background-color: #EEEFF3;
        position: absolute;
        top:0;
        left:0;
        z-index:20;
        height:300px;
        width:100px;
        .el-icon-arrow-down{
          top:270px;
          left: 0;
        }
        .el-icon-arrow-up{
          left:0;
          top:0;

        }
        .turn-arrow{
          background-color: #EEEFF3;
          position: absolute;
          width:100px;
          height:30px;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
          color:#9FA8B7;
        }
        .el-carousel__indicators2__wrap{
          height:240px;
          overflow: hidden;
          position:absolute;
          left:0;
          top: 30px;
          width:100px;
          .el-carousel__indicators2{
            display: block;
            transition: .5s all;
            .el-carousel__indicator2{
              width:100px;
              height:30px;
              background-color: #EEEEF2;
              /*border-bottom: 1px #aaa solid;*/

              &.is-active{
                background-color: #FF0E1B;
                color:#fff;
              }
              .el-carousel__button2{
                width:100%;
                height:100%;
                cursor: pointer;
                text-align: center;
                line-height: 30px;
              }
            }
          }
        }
      }
    }

  }



</style>
