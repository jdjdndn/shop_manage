<template>
  <div>
    <el-button type='primary' @click='showAddDialog'>添加分类</el-button>
    <tree-table :data='cateList' :columns='columns' show-index index-text='#' border stripe :show-row-hover='false' :expand-type='false' :selection-type='false'>
      <template slot='isok' slot-scope="scope">
        <i class="el-icon-success" style='color:lightgreen' v-if='scope.row.cat_deleted === false'></i>
        <i class="el-icon-error" style='color: red' v-else></i>
      </template>
      <template slot='oder' slot-scope="scope">
        <el-tag type='primary' v-if='scope.row.cat_level === 0'>一级</el-tag>
        <el-tag type='success' v-else-if='scope.row.cat_level === 1'>二级</el-tag>
        <el-tag type='warning' v-else-if='scope.row.cat_level === 2'>三级</el-tag>
      </template>
      <template slot='opreat' slot-scope="scope">
        <el-button type='primary' size='mini'>编辑</el-button>
        <el-button type='danger' size='mini'>删除</el-button>
      </template>
    </tree-table>

    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加分类的对话框 -->
    <el-dialog title="提示" :visible.sync="addCateDialogVisible" width="30%" @close='resetAddForm'>
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="cateList" :props="props" clearable @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      cateList: [],
      columns: [{
        label: '分类',
        prop: 'cat_name',
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'oder'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opreat'
      }],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: '',
      },
      addCateFormRules: {
        cateName: [{ require: true, trigger: 'blur' }]
      },
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      // options: [],
      selectedKeys: [],
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.cateList);
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddDialog () {
      this.addCateDialogVisible = true
    },
    handleChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      console.log(this.addCateForm);
    },
    resetAddForm () {
      this.addCateForm = {
        cat_pid: '',
        cat_name: '',
        cat_level: '',
      }
      this.selectedKeys = []
    },
    submitAddform() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return this.$message.error('请输入有效的表单值')
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        console.log(res);
        if(res.meta.status !== 201) return this.$message.error('创建分类失败')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style>
</style>