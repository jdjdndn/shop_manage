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
        <el-table :data="rightList" style="width: 100%" border stripe>
          <el-table-column prop="authName" label="权限名称">
          </el-table-column>
          <el-table-column prop="path" label="路径">
          </el-table-column>
          <el-table-column label="权限等级">
            <template slot-scope='scope'>
              <el-tag v-if='scope.row.level === "0"'>一级</el-tag>
              <el-tag v-if='scope.row.level === "1"' type="success">二级</el-tag>
              <el-tag v-if='scope.row.level === "2"' type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList () {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightList = res.data
    }
  },
  created () {
    this.getRightList()
  }
}
</script>

<style>
</style>