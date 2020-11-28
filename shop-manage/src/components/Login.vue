import '../../fonts/iconfont.css';
<template>
  <div class='login_container'>
    <div class="login-box">
      <div class="login-avatar"><img src="../assets/logo.png" alt=""></div>
      <el-form label-width="0px" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item label="" prop='username'>
          <el-input v-model='loginForm.username' prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop='password'>
          <el-input type='password' v-model='loginForm.password' prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮组 -->
        <el-form-item label="" class='btns'>
          <el-button type="primary" @click='login'>登录</el-button>
          <el-button type="info" @click='resetLogin'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [{ required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetLogin () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login-avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  border: 1px solid #eee;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  transform: translate(-50%, -50%);
  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    background-color: #eee;
  }
}
.el-form {
  padding: 100px 15px 0;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>