<template>
  <tree-table :data='cateList' :columns='columns' show-index index-text='#' border stripe :show-row-hover='false' :expand-type='false' :selection-type='false'></tree-table>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      columns: [{
        label: '分类',
        prop: 'cat_name',
      }],
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
      this.cateList = res.data
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style>
</style>