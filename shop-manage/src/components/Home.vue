import '../../fonts/iconfont.css';
<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class='toggleCollapse' @click='isCollapse = !isCollapse'>|||</div>
        <!-- 侧边栏包裹容器 激活文本颜色active-text-color  background-color菜单背景色-->
        <el-menu :collapse-transition='false' router :collapse='isCollapse' :default-active="'/'+activePath" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened>
          <!-- 一级子菜单 -->
          <!-- 唯一的index值保证只打开自己那一项菜单 -->
          <el-submenu :index="item.id + ''" v-for='item in menulist' :key="item.id">
            <!-- 一级模板 -->
            <template slot="title">
              <!-- 一级模板的图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 一级模板的文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级模板 -->
            <el-menu-item :index="'/' + subItem.path" v-for='subItem in item.children' :key='subItem.id' @click='savaActivePath( subItem.path)'>
              <template slot="title">
                <!-- 二级模板图标 -->
                <i class="el-icon-location"></i>
                <!-- 二级图标文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>

      </el-aside>
      <el-container>
        <el-main>
          <!-- 子组件占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      menulist: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getUserList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    savaActivePath (activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      // console.log(activePath);
    }
  },
  created () {
    this.getUserList()
    this.activePath = sessionStorage.getItem('activePath')
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    div {
      display: flex;
      align-items: center;
      span {
        font-size: 25px;
        color: #fff;
        margin-left: 15px;
      }
    }
  }
  .el-header {
    background-color: #373d41;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-menu {
    border-right: none;
  }
}
.iconfont {
  margin-right: 5px;
}
.toggleCollapse {
  height: 20px;
  text-align: center;
  background-color: #eee;
  letter-spacing: 0.2em;
}
.el-container {
  overflow: hidden;
}
</style>
