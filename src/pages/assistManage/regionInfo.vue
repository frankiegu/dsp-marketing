<template>
  <div class="region-info-container statistical-template-container">
    <el-row>
      <el-col>
        <div class="search-container">
          <el-row :gutter="15">
            <el-col :span="5" :offset="5">
              <el-input :span="5" v-model="searchData.name"  placeholder="请输入名称"></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.depth" :span="5" placeholder="请选择级别" clearable filterable >
                <el-option :label ="item.value" :value="item.type" v-for="item in columnCategoryList" :key="item.type"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select v-model="searchData.isCity" :span="5" placeholder="是否城市" clearable filterable >
                <el-option :label="'是'" :value="1"></el-option>
                <el-option :label="'不是'" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="button" class="search-btn" @click="searchEvent">查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button :span="2" type="success" class="search-add"  @click="addListEvent('editDialogForm')" :disabled="true">新增</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="search-table">
          <el-table
            ref="multipleTable"
            :data="tableData"
            v-loading="loading2"
            element-loading-text="拼命加载中"
            height="400"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="id" label="#"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="cityCode" label="城市编号"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="name" label="城市名称"  show-overflow-tooltip> </el-table-column>
            <el-table-column prop="depth" label="级别"  show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag :type="'success'">{{columnCategoryList[scope.row.depth-1].value}}</el-tag>

              </template>
            </el-table-column>
            <el-table-column prop="isCity" label="是否城市"  show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag :type="scope.row.isCity==0?'gray':'success'">{{scope.row.isCity==0?'否':'是'}}</el-tag>
              </template>
            </el-table-column>
            <!--<el-table-column prop="createTimeStr" label="创建时间" show-overflow-tooltip> </el-table-column>-->
            <!--<el-table-column prop="updateTimeStr" label="更新时间" show-overflow-tooltip> </el-table-column>-->
            <el-table-column label="操作"  show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  @click="handleEdit('editDialogForm', scope.$index, scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-col :span="8">
            <div>&nbsp</div>
          </el-col>
          <el-col :span="16" style="text-align: right">
            <div class="search-page">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog :title='isEdit?"编辑":"新增"' :visible.sync="dialogFormVisible">
      <el-form ref="editDialogForm" :model="addEditDialogForm" class="fSelect">
        <el-row :rows="5">
        </el-row>
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.name"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="上一级ID" prop="pId" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.pId"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortName" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.shortName"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="地区编码" prop="areaCode" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.areaCode"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="城市编码" prop="cityCode" :label-width="formLabelWidth">
          <el-input v-model="addEditDialogForm.cityCode"  placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="级别" :label-width="formLabelWidth">
          <el-select v-model="addEditDialogForm.depth"  placeholder="请选择级别" clearable filterable>
            <el-option :label="item.value" :value="item.type" v-for="item in columnCategoryList" :key="item.type"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editDialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import { mapState } from 'vuex';
  import { cityList , citySave} from '@/api/assist-api'
  export default {
    name: 'regionInfo',
    data () {
      return {
        loading2: true,//加载菊花
        searchData:{
          cityCode:'',
          depth:'',
          isCity:'',
          name:''
        },
        addEditDialogForm:{
          name:'',
          spell:'',
          pId:'',
          ddId:'',
          isCity:'',
          isHot:'',
          shortName:'',
          areaCode:'',
          depth:'',
          weatherId:'',
          lngLat:'',
          level:'',
          wlId:'',
          cdmaId:'',
          allorder:'',
          letorder:'',
          allletorder:'',
          cityCode:'',
        },
        isEdit:true,
        Editindex:0,
        columnCategoryList:[{"type":1,"value":"全国"},{"type":2,"value":"省、自治区"},{"type":3,"value":"市"},{"type":4,"value":"区、县"},{"type":5,"value":"街道"}],
        formLabelWidth:'100px',
        editDialogForm:'',
        dialogFormVisible:false,
        page:{},
        tableData:[],
        ruless: {
//          name1:[
//            {required: false, message: '请输入ip', trigger: 'blur'}
//          ],
//          name2:[
//            {required: false, message: '请选择类型', trigger: 'blur'}
//          ]
        },
      }
    },
    methods: {
      submitForm(){
        let _self = this;
            if(_self.isEdit){
              let data = _self.addEditDialogForm;
              data.id = _self.tableData[_self.Editindex].id;
              citySave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                _self.tableData[_self.Editindex].name = _self.addEditDialogForm.name;
                _self.tableData[_self.Editindex].spell = _self.addEditDialogForm.spell;
                _self.tableData[_self.Editindex].pId = _self.addEditDialogForm.pId;
                _self.tableData[_self.Editindex].ddId = _self.addEditDialogForm.ddId;
                _self.tableData[_self.Editindex].isCity = _self.addEditDialogForm.isCity;
                _self.tableData[_self.Editindex].isHot = _self.addEditDialogForm.isHot;
                _self.tableData[_self.Editindex].shortName = _self.addEditDialogForm.shortName;
                _self.tableData[_self.Editindex].areaCode = _self.addEditDialogForm.areaCode;
                _self.tableData[_self.Editindex].depth = _self.addEditDialogForm.depth;
                _self.tableData[_self.Editindex].weatherId = _self.addEditDialogForm.weatherId;
                _self.tableData[_self.Editindex].lngLat = _self.addEditDialogForm.lngLat;
                _self.tableData[_self.Editindex].level = _self.addEditDialogForm.level;
                _self.tableData[_self.Editindex].wlId = _self.addEditDialogForm.wlId;
                _self.tableData[_self.Editindex].cdmaId = _self.addEditDialogForm.cdmaId;
                _self.tableData[_self.Editindex].allorder = _self.addEditDialogForm.allorder;
                _self.tableData[_self.Editindex].letorder = _self.addEditDialogForm.letorder;
                _self.tableData[_self.Editindex].allletorder = _self.addEditDialogForm.allletorder;
                _self.tableData[_self.Editindex].cityCode = _self.addEditDialogForm.cityCode;


                _self.dialogFormVisible = false;
              })
            }else{
              let data = _self.addEditDialogForm;
              citySave(data).then(function (res) {
                _self.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                _self.loading2 = true;
                let data = {"cityCode":_self.searchData.cityCode,"depth":_self.searchData.depth,"isCity":_self.searchData.isCity,"name":_self.searchData.name,"currPage":1,"prePageResult":_self.page.pageSize};
                cityList(data).then(function (res) {
                  _self.loading2 = false;
                  _self.tableData = res.data;
                  _self.page={
                    pageSize: _self.page.pageSize,
                    total: res.total,
                    currentPage: 1
                  }
                });
                _self.dialogFormVisible = false;
              })
            }
      },
      handleEdit(name,index,row){
        let _self = this;
        _self.isEdit = true;
        _self.Editindex = index;
        _self.dialogFormVisible = true;
        _self.addEditDialogForm.name= _self.tableData[index].name ;
        _self.addEditDialogForm.spell = _self.tableData[index].spell;
        _self.addEditDialogForm.pId = _self.tableData[index].pId;
        _self.addEditDialogForm.ddId = _self.tableData[index].ddId;
        _self.addEditDialogForm.isCity = _self.tableData[index].isCity;
        _self.addEditDialogForm.isHot = _self.tableData[index].isHot;
        _self.addEditDialogForm.shortName = _self.tableData[index].shortName;
        _self.addEditDialogForm.areaCode = _self.tableData[index].areaCode;
        _self.addEditDialogForm.depth = _self.tableData[index].depth;
        _self.addEditDialogForm.weatherId = _self.tableData[index].weatherId;
        _self.addEditDialogForm.lngLat = _self.tableData[index].lngLat;
        _self.addEditDialogForm.level = _self.tableData[index].level;
        _self.addEditDialogForm.wlId = _self.tableData[index].wlId;
        _self.addEditDialogForm.cdmaId = _self.tableData[index].cdmaId;
        _self.addEditDialogForm.allorder = _self.tableData[index].allorder;
        _self.addEditDialogForm.letorder = _self.tableData[index].letorder;
        _self.addEditDialogForm.allletorder = _self.tableData[index].allletorder;
        _self.addEditDialogForm.cityCode = _self.tableData[index].cityCode;
      },
      addListEvent(name){
        let _self = this;
        setTimeout(function(){
          _self.isEdit = false;
          _self.dialogFormVisible = true;
          _self.addEditDialogForm = {
            name:'',
              spell:'',
              pId:'',
              ddId:'',
              isCity:'',
              isHot:'',
              shortName:'',
              areaCode:'',
              depth:'',
              weatherId:'',
              lngLat:'',
              level:'',
              wlId:'',
              cdmaId:'',
              allorder:'',
              letorder:'',
              allletorder:'',
              cityCode:'',
          };
        },200)
      },
      searchEvent(){
        let _self = this;
        _self.loading2 = true;
        let data = {"cityCode":_self.searchData.cityCode,"depth":_self.searchData.depth,"isCity":_self.searchData.isCity,"name":_self.searchData.name,"currPage":_self.page.currentPage,"prePageResult":_self.page.pageSize};
        cityList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: 1
          }
        });
      },
      handleSizeChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"cityCode":_self.searchData.cityCode,"depth":_self.searchData.depth,"isCity":_self.searchData.isCity,"name":_self.searchData.name,"currPage":_self.page.currentPage,"prePageResult":val};
        cityList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: val,
            total: res.total,
            currentPage: _self.page.currentPage
          }
        });
      },
      handleCurrentChange(val){
        let _self = this;
        _self.loading2 = true;
        let data = {"cityCode":_self.searchData.cityCode,"depth":_self.searchData.depth,"isCity":_self.searchData.isCity,"name":_self.searchData.name,"currPage":val,"prePageResult":_self.page.pageSize};
        cityList(data).then(function (res) {
          _self.loading2 = false;
          _self.tableData = res.data;
          _self.page={
            pageSize: _self.page.pageSize,
            total: res.total,
            currentPage: val
          }

        });
      },
      //重置input file文件
      inputFileClick(inputFile){
        if(this.$refs[inputFile].value){
          this.$refs[inputFile].value ='';
        }
      },
      editPbtnParam(){
        alert( '添加参数');

      },
      selectParam(){
        alert( '选择参数')
      },
    },
    computed: {
      ...mapState({
        account:state=>state.user.userInfo.account
      })
    },
    created() {
      let _self = this;
      _self.loading2 = true;
      let data = {"cityCode":_self.searchData.cityCode,"depth":_self.searchData.depth,"isCity":_self.searchData.isCity,"name":_self.searchData.name,"currPage":1,"prePageResult":10};
      cityList(data).then(function (res) {
        _self.loading2 = false;
        _self.tableData = res.data;
        _self.page={
          pageSize: 10,
          total: res.total,
          currentPage: 1
        }

      });

    }

  }
</script>

<style lang="scss">

</style>


