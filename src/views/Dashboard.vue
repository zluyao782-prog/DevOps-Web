<template>
  <div>
    <h3 class="page-title">仪表盘</h3>
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top:16px" header="系统信息">
      <el-descriptions :column="2" border v-if="sysInfo">
        <el-descriptions-item v-for="(v, k) in sysInfo" :key="k" :label="k">{{ v }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="暂无系统信息" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSystemInfo, getProducts, getUsers, getRepositories } from '../api'

const sysInfo = ref(null)
const stats = ref([
  { label: '产品数量', value: 0 },
  { label: '用户数量', value: 0 },
  { label: '制品仓库', value: 0 },
  { label: '系统状态', value: '正常' }
])

async function safeCount(fn) {
  try {
    const res = await fn()
    const arr = Array.isArray(res) ? res
      : Array.isArray(res?.data) ? res.data
      : Array.isArray(res?.list) ? res.list
      : []
    return arr.length
  } catch {
    return 0
  }
}

onMounted(async () => {
  try {
    sysInfo.value = await getSystemInfo()
  } catch (e) {
    console.warn('获取系统信息失败', e)
  }

  const [productCount, userCount, repoCount] = await Promise.all([
    safeCount(getProducts),
    safeCount(getUsers),
    safeCount(getRepositories)
  ])
  stats.value[0].value = productCount
  stats.value[1].value = userCount
  stats.value[2].value = repoCount
})
</script>

<style scoped>
.page-title { margin-bottom: 16px; }
.stat-card { text-align: center; }
.stat-value { font-size: 32px; font-weight: bold; color: #409eff; }
.stat-label { color: #666; margin-top: 8px; }
</style>
