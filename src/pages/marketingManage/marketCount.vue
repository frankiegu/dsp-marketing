<template>
  <section class="market-count-container">
    <el-row class="market-count-container-cen">

      <el-col :span="12" v-for="(index,item) in chartList" :key="item">
        <div :id="item" class="chartItem" @click="showDialog(item)"></div>
      </el-col>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      size="full"
      class="dialog"
      :before-close="handleClose">
      <el-carousel trigger="click" :initial-index="chartDialogIndex" :autoplay="false"  ref="carouselD" arrow="never">
        <el-carousel-item v-for="(index,item) in chartDialogList"  :key="item">
          <div :id="item+'dialog'" style="height:600px"></div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

  </section>
</template>

<script>

  import echarts from "echarts";
    export default {
        name: 'marketCount',
        data () {
          return {
            chartList: {
              chartColumn: null,
              chartBar: null,
              chartLine: null,
              chartPie: null,
              chartLoophole: null,
            },
            chartDialogList: {
              chartColumn: null,
              chartBar: null,
              chartLine: null,
              chartPie: null,
              chartLoophole: null,
            },
            chartDialogIndex :0,
            dialogVisible:false
          }
        },
        components: {},
        methods: {
          showDialog(item){
            let _self = this;
            _self.dialogVisible=true
//            _self.$refs["carouselD"].setActiveItem = index;
//            _self.chartDialogIndex = index;
            setTimeout(function(){
              _self.drawDCharts();
              console.log(item);
              if(item=='chartColumn'){
                _self.$refs["carouselD"].setActiveItem(0)
              }else if(item=='chartBar'){
                _self.$refs["carouselD"].setActiveItem(1)
              }else if(item=='chartLine'){
                _self.$refs["carouselD"].setActiveItem(2)
              }else if(item=='chartPie'){
                _self.$refs["carouselD"].setActiveItem(3)
              }else if(item=='chartLoophole'){
                _self.$refs["carouselD"].setActiveItem(4)
              }
            },20)

          },
          handleClose(){

            this.dialogVisible=false
          },
        drawColumnChart() {
          this.chartList.chartColumn = echarts.init(document.getElementById('chartColumn'));
          this.chartList.chartColumn.setOption({
            title: { text: 'Column Chart' },
            tooltip: {},
            xAxis: {
              data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          });
        },
        drawBarChart() {
          this.chartList.chartBar =  echarts.init(document.getElementById('chartBar'));
          this.chartList.chartBar.setOption({
            title: {
              text: 'Bar Chart',
              subtext: '数据来自网络'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['2011年', '2012年']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
            },
            series: [
              {
                name: '2011年',
                type: 'bar',
                data: [18203, 23489, 29034, 104970, 131744, 630230]
              },
              {
                name: '2012年',
                type: 'bar',
                data: [19325, 23438, 31000, 121594, 134141, 681807]
              }
            ]
          });
        },
        drawLineChart() {
          this.chartList.chartLine = echarts.init(document.getElementById('chartLine'));
          this.chartList.chartLine.setOption({
            title: {
              text: 'Line Chart'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['邮件营销', '联盟广告', '搜索引擎']
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
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '邮件营销',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: '联盟广告',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                name: '搜索引擎',
                type: 'line',
                stack: '总量',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
              }
            ]
          });
        },
        drawPieChart() {
          this.chartList.chartPie = echarts.init(document.getElementById('chartPie'));
          this.chartList.chartPie.setOption({
            title: {
              text: 'Pie Chart',
              subtext: '纯属虚构',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                  { value: 335, name: '直接访问' },
                  { value: 310, name: '邮件营销' },
                  { value: 234, name: '联盟广告' },
                  { value: 135, name: '视频广告' },
                  { value: 1548, name: '搜索引擎' }
                ],
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
        },

        drawLoophole(){
          this.chartList.chartLoophole  = echarts.init(document.getElementById('chartLoophole'));
          this.chartList.chartLoophole.setOption({
            title: {
              text: '漏斗分析图',
              subtext: '网站用户行为统计－纯属虚构',
              x:'center',
              textStyle: {
                color: '#fff'
              }

            },
            backgroundColor: '#fff',
            color: ['#efbb1a', '#d77169', '#c14f60', '#953f61', '#72355f', ],

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

                data:[
                  {value:60, name:'访问'},
                  {value:40, name:'咨询'},
                  {value:20, name:'订单'},
                  {value:80, name:'点击'},
                  {value:100, name:'展现'}


                ].sort(function (a, b) { return a.value - b.value}),
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
        },
          drawColumnDChart() {
            this.chartDialogList.chartColumn= echarts.init(document.getElementById('chartColumndialog'))
            this.chartDialogList.chartColumn.setOption({
              title: { text: 'Column Chart' },
              tooltip: {},
              xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
              },
              yAxis: {},
              series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
              }]
            });
          },
          drawBarDChart() {
            this.chartDialogList.chartBar= echarts.init(document.getElementById('chartBardialog'))
            this.chartDialogList.chartBar.setOption({
              title: {
                text: 'Bar Chart',
                subtext: '数据来自网络'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['2011年', '2012年']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: 'category',
                data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
              },
              series: [
                {
                  name: '2011年',
                  type: 'bar',
                  data: [18203, 23489, 29034, 104970, 131744, 630230]
                },
                {
                  name: '2012年',
                  type: 'bar',
                  data: [19325, 23438, 31000, 121594, 134141, 681807]
                }
              ]
            });
          },
          drawLineDChart() {
            this.chartDialogList.chartLine= echarts.init(document.getElementById('chartLinedialog'))
            this.chartDialogList.chartLine.setOption({
              title: {
                text: 'Line Chart'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['邮件营销', '联盟广告', '搜索引擎']
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
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: '邮件营销',
                  type: 'line',
                  stack: '总量',
                  data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                  name: '联盟广告',
                  type: 'line',
                  stack: '总量',
                  data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                  name: '搜索引擎',
                  type: 'line',
                  stack: '总量',
                  data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
              ]
            });
          },
          drawPieDChart() {
            this.chartDialogList.chartPie= echarts.init(document.getElementById('chartPiedialog'));
            this.chartDialogList.chartPie.setOption({
              title: {
                text: 'Pie Chart',
                subtext: '纯属虚构',
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: [
                    { value: 335, name: '直接访问' },
                    { value: 310, name: '邮件营销' },
                    { value: 234, name: '联盟广告' },
                    { value: 135, name: '视频广告' },
                    { value: 1548, name: '搜索引擎' }
                  ],
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
          },

          drawLoopholeD(){
            this.chartDialogList.chartLoophole= echarts.init(document.getElementById('chartLoopholedialog'))
            this.chartDialogList.chartLoophole.setOption({
              title: {
                text: '漏斗分析图',
                subtext: '网站用户行为统计－纯属虚构',
                x:'center',
                textStyle: {
                  color: '#fff'
                }

              },
              backgroundColor: '#fff',
              color: ['#efbb1a', '#d77169', '#c14f60', '#953f61', '#72355f', ],

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

                  data:[
                    {value:60, name:'访问'},
                    {value:40, name:'咨询'},
                    {value:20, name:'订单'},
                    {value:80, name:'点击'},
                    {value:100, name:'展现'}


                  ].sort(function (a, b) { return a.value - b.value}),
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
          },
        drawCharts() {
          this.drawColumnChart()
          this.drawBarChart()
          this.drawLineChart()
          this.drawPieChart()
          this.drawLoophole()
        },
        drawDCharts() {
          this.drawColumnDChart()
          this.drawBarDChart()
          this.drawLineDChart()
          this.drawPieDChart()
          this.drawLoopholeD()
        },
      },
        computed: {},
        mounted: function () {
            let _self = this;
              _self.drawCharts()

        },
        updated: function () {
          this.drawCharts()
        },
        created() {

        }
    }
</script>

<style lang="scss">

</style>
