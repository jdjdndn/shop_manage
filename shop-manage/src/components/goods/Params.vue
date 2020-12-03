<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="警告提示的文案" type="warning">
      </el-alert>
      <el-row>
        <el-col :span='2'><span>商品分类: </span></el-col>
        <el-col :span='15'>
          <el-cascader v-model="selectedKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type='primary' :disabled='selectedKeys.length !== 3' @click='showAddDialog'>添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData" style="width: 100%" border stripe>
            <el-table-column type='expand'>
              <template slot-scope='scope'>
                <el-tag v-for='(item,i) in scope.row.attr_vals' :key='i' closable @close='tagClose(scope.row, i)'>{{item}}</el-tag>
                <!-- 编辑文本框 -->
                <el-input style='width: 200px' class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 编辑按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index'>
            </el-table-column>
            <el-table-column label="参数" prop='attr_name'>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope='scope'>
                <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row)'>编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini' @click='removeNum(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type='primary' :disabled='selectedKeys.length !== 3' @click='showAddDialog'>添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" style="width: 100%" border stripe>
            <el-table-column type='expand'>
              <template slot-scope='scope'>
                <el-tag v-for='(item,i) in scope.row.attr_vals' :key='i' closable @close='tagClose(scope.row, i)'>{{item}}</el-tag>
                <!-- 编辑文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <!-- 编辑按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type='index'>
            </el-table-column>
            <el-table-column label="参数" prop='attr_name'>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope='scope'>
                <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row)'>编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size='mini' @click='removeNum(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>
    <!-- 添加参数或属性的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addFormDialogVisible" width="30%" @close='resetDialog'>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数或属性的对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editFormDialogVisible" width="30%" @close='resetEditDialog'>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      activeName: 'many',
      onlyData: [],
      manyData: [],
      addFormDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      editFormDialogVisible: false,
      editForm: {

      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      attrId: ''
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.cateList = res.data
    },
    async handleChange () {
      this.getTableData()
    },
    handleTabClick () {
      this.getTableData()
    },
    async getTableData () {
      if (this.selectedKeys.length !== 3) {
        this.onlyData = []
        this.manyData = []
        return this.selectedKeys = []
      }
      const { data: res } = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes`, {
        params: { sel: this.activeName }
      })
      // res.data.attr_vals = res.data.attr_vals ? res.data.attr_vals.split(' ') : []
      // console.log(res.data);
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      if (this.activeName === 'only') {
        this.onlyData = res.data
        this.manyData = []
      } else {
        this.onlyData = []
        this.manyData = res.data
      }
      // console.log(res.data);
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm (row) {
      // console.log(row);
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        return row.inputVisible = false
      }
      row.attr_vals.push(row.inputValue)
      this.addORrmove(row)
    },
    async addORrmove (row) {   //el-tag添加参数或者删除参数
      const { data: res } = await this.$http.put(`categories/${this.selectedKeys[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      row.inputValue = ''
      return row.inputVisible = false
    },
    tagClose (row, i) {
      row.attr_vals.splice(i, 1)
      this.addORrmove(row)
    },
    showAddDialog () {
      this.addFormDialogVisible = true
    },
    resetDialog () {
      this.$refs.addFormRef.resetFields()
    },
    submitAddForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.selectedKeys[2]}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.getTableData()
        this.addFormDialogVisible = false
      })
    },
    resetEditDialog () {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog (row) {
      const { data: res } = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes/${row.attr_id}`, {
        params: { attr_sel: this.activeName }
      })
      this.editForm = res.data
      this.editFormDialogVisible = true
    },
    submitEditForm () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('有问题')  //categories/:id/attributes/:attrId
        const { data: res } = await this.$http.put(
          `categories/${this.selectedKeys[2]}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getTableData()
        this.editFormDialogVisible = false
      })
    },
    async removeNum (row) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info("取消操作")
      const { data: res } = await this.$http.delete(`categories/${this.selectedKeys[2]}/attributes/${row.attr_id}`, { attr_sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error("删除失败")
      this.$message.success("删除成功")
      this.getTableData()
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    titleText () {
      if (this.activeName === 'only') {
        return '静态属性'
      } else {
        return '动态参数'
      }
    },
  }
}
</script>

<style lang='less' scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
</style>