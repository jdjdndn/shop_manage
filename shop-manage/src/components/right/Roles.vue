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
      <el-button type='primary'>添加用户</el-button>
      <template>
        <el-table :data="roleList" style="width: 100%" border stripe>
          <el-table-column type='expand' label="">
            <template slot-scope='scope'>
              <!-- 一级权限 -->
              <el-row v-for='(item1, i1) in scope.row.children' :class='["bdbottom", i1 === 0 ? "bdtop": ""]' :key='item1.id'>
                <el-col :span='5'>
                  <el-tag closable @close='removeRoles(scope.row, item1.id)'>{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span='19'>
                  <!-- 二级权限 -->
                  <el-row v-for='(item2, i2) in item1.children' :key='item2.id' :class="[i2 === 0 ? '' : 'bdtop']">
                    <el-col :span='6'>
                      <el-tag type='success' closable @close='removeRoles(scope.row, item2.id)'>{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span='18'>
                      <el-tag type='warning' closable v-for='(item3, i3) in item2.children' :key='item3.id' @close='removeRoles(scope.row, item3.id)'>{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type='index' label="#">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称">
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope='scope'>
              <el-button type="primary" icon="el-icon-search">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" @click='setRights(scope.row)'>分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close='removeDefKeys'>
      <el-tree ref='TreeRef' show-checkbox node-key='id' default-expand-all :default-checked-keys='defKeys' :data="rightsList" :props="defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeKeys">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'role',
  data () {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],//权限树数据
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],//默认勾选子节点数组,
      rowID: '',//要分配权限的角色id
    }
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取左侧菜单权限失败')
      this.roleList = res.data
    },
    async removeRoles (role, itemID) {
      const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('取消删除角色')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${itemID}`)
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
    },
    async setRights (row) {
      this.rowID = row.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error("获取树型列表失败")
      this.rightsList = res.data
      this.getDefKeys(row, this.defKeys)
      this.setRightDialogVisible = true
    },
    getDefKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getDefKeys(item, arr)
      });
    },
    async submitChangeKeys () {
      const keysList = [...this.$refs.TreeRef.getCheckedKeys(), ...this.$refs.TreeRef.getHalfCheckedKeys()]
      // roles/:roleId/rights
      const dataStr = keysList.join(',')
      const { data: res } = await this.$http.post(`roles/${this.rowID}/rights`, {
        rids: dataStr
      })
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("分配角色权限失败")
      this.$message.success("分配角色权限成功")
      this.getRoleList()
      this.setRightDialogVisible = false
    },
    removeDefKeys () {
      this.defKeys = []
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
</style>