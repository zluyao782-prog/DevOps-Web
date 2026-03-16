<template>
  <div>
    <h3 style="margin-bottom:16px">仪表盘</h3>
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <el-card shadow="hover" style="text-align:center">
          <div style="font-size:32px;font-weight:bold;color:#409eff">{{ item.value }}</div>
          <div style="color:#666;margin-top:8px">{{ item.label }}</div>
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

onMounted(async () => {
  try {
    const res = await getSystemInfo()
    sysInfo.value = res?.data || res
  } catch {}
  try {
    const res = await getProducts()
    stats.value[0].value = (res?.data || res || []).length
  } catch {}
  try {
    const res = await getUsers()
    stats.value[1].value = (res?.data || res || []).length
  } catch {}
  try {
    const res = await getRepositories()
    stats.value[2].value = (res?.data || res || []).length
  } catch {}
})
</script>
