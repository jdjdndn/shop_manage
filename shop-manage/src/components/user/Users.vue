import logo from '../../assets/logo.png';
<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- // 卡片区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span='8' class='usergutter'>
            <el-input placeholder="请输入内容" clearable v-model='queryInfo.query' @clear='getUserList'>
              <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
            </el-input>
          </el-col>
          <el-col :span='4'>
            <el-button type='primary' @click='addDialogVisible = true'>添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 表格区域 -->
        <el-table :data="userlist" stripe border style="width: 100%">
          <el-table-column type='index'></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="mobile" label="手机"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope='scope'>
              <el-switch v-model="scope.row.mg_state" @change='stateChange(scope.row)'></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope='scope'>
              <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row.id)'></el-button>
              <el-button type="danger" icon="el-icon-delete" size='mini' @click=removeUser(scope.row.id)></el-button>
              <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable='false'>
                <el-button type="warning" icon="el-icon-setting" size='mini' @click='showSetRightDialog(scope.row)'></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部 -->
        <div class="block">
          <!-- <span class="demonstration">完整功能</span> -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close='resetAddDialog'>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%">
      <div>
        <p>当前角色: {{userInfo.username}}</p>
        <p>角色权限: {{userInfo.role_name}}</p>
        <p>
          <el-select v-model=" selectedID" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data () {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      userlist: [],
      queryInfo: {
        query: '',
        pagenum: 1, //页码
        pagesize: 2  //每页显示数据条数
      },
      total: 0,
      addDialogVisible: false,
      addForm: { //添加用户表单
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {  //修改用户表单的信息
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户信息的表单验证规则
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRightDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectedID: ''
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    async stateChange (data) {
      const { data: res } = await this.$http.put(`users/${data.id}/state/${data.mg_state}`,)
      console.log(res);
      if (res.meta.status !== 200) {
        data.mg_state = !data.mg_state //修改用户数据失败将按钮状态改回原来的状态
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    handleSizeChange (newSize) {  //更新页码值
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) { //更新每页显示数据条数
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }, //添加用户表单重置
    resetAddDialog () {
      this.$refs.addFormRef.resetFields()
    },//添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加用户表单数据有误')
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    // 展示修改用户表单框   获取id填充表单
    async showEditDialog (id) {
      // console.log(id);
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改用户表单信息   根据id发请求提交表单
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$mssage.error('请输入合法的表单数据')
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        this.$message.success('更新用户信息成功')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    //删除用户
    async removeUser (id) {
      // console.log(id);
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) //捕获错误,不影响后续操作
      if (confirmResult != 'confirm') return this.$message.info('取消操作')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      if (this.userlist.length == 1) { //当页面只有一条数据,并且页码大于1,就将页码-1
        this.queryInfo.pagenum >= 1 ? this.queryInfo.pagenum-- : 1
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    async showSetRightDialog (userInfo) {
      this.userInfo = userInfo
      //console.log(userInfo)
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
      // console.log(this.roleList);
      if (!this.selectedID) return this.$message.error('请选择角色')
      const { data: ress } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedID
      })
      this.setRightDialogVisible = true
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang='less' scoped>
.usergutter {
  margin-right: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>