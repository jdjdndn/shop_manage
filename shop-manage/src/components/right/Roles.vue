<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <template>
        <el-table :data="roleList" style="width: 100%" border stripe>
          <el-table-column prop="authName" label="权限名称">
          </el-table-column>
          <el-table-column prop="path" label="路径">
          </el-table-column>
          <el-table-column label="权限等级">
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: []
    }
  },
  methods: {
    async getRoleList() {
      const { data: res} = await this.$http.get('menus')
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取左侧菜单权限失败')
      this.roleList = res.data
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style>
</style>