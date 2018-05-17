<template>
    <div class="raphael-component" id="RaphaelBox">
    </div>
</template>

<script>
    import Raphael from 'raphael';
    export default {
        name: 'Raphael',
        data () {
            return {

            }
        },
        components: {},
        methods: {},
        computed: {},
        mounted(){
           let paper=Raphael('RaphaelBox',1250,440);

           let dataItem=paper.rect(40,40,100,50,5);
           //paper.text(90, 65, '数据源');
           dataItem.attr({"fill":"#20a0ff","stroke":"#20a0ff","font-size":"30px","color":"#fff","title":"数据源"});

           let dataEvent=paper.rect(40,180,100,50,5)
           //paper.text(90, 205, '交集');
           dataEvent.attr({"fill":"#13ce66","stroke":"#13ce66","font-size":"30px","text":"aaaaa"}).data('outputs',1).data('inputs',2);

           let startY=40;
           let contentWidth=1000;
           let contentHeight=440;
           let boxItem=paper.rect(220,startY,contentWidth,contentHeight);
           boxItem.attr({"fill":"#f3f3f3","stroke":"#f3f3f3","font-size":"30px"}).data('type','content');


           var temp;
           dataItem.drag(function (dx,dy,x,y,event) {
             if(temp){
               temp.attr({"x":x,"y":y});
             }
           },function(x,y,event){
             console.log('start');
             temp=dataItem.clone();
           },function(event){
             var obj = paper.getElementByPoint(temp.attr('x'),temp.attr('y'));
             if(obj && obj.data('type')=='content'){
               var newY =  obj.attr('y')+(obj.attr('height')-temp.attr('height'))/2;
               temp.attr({'y':newY});
               var newEle = temp;
               var eles = obj.data('eles');
               if(!eles){
                   eles=new Array();
               }
               newEle.click(function(){
                 console.log(2);
               });
               eles.push(newEle);
               obj.data('eles',eles);
             }else{
               temp.remove();
             }
           });

        },
        created() {

        }
    }
</script>

<style lang="scss">
  .raphael-component{
    max-height: 550px;
    width:100%;
    overflow-y: auto;
  }
</style>
