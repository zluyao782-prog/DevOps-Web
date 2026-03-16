<template>
  <el-card>
    <template #header>CI/CD 管理</template>
    <el-form :model="query" inline style="margin-bottom:16px">
      <el-form-item label="Owner">
        <el-input v-model="query.owner" placeholder="GitHub Owner" style="width:180px" />
      </el-form-item>
      <el-form-item label="Repo">
        <el-input v-model="query.repo" placeholder="仓库名称" style="width:180px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadWorkflows" :loading="loading">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="workflows" v-loading="loading" border style="margin-bottom:16px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="工作流名称" />
      <el-table-column prop="state" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.state === 'active' ? 'success' : 'info'">{{ row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" show-overflow-tooltip />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openTrigger(row)">触发</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="triggerVisible" title="触发工作流" width="500px">
      <el-form :model="triggerForm" label-width="100px">
        <el-form-item label="工作流">
          <el-input :value="triggerForm.workflowName" disabled />
        </el-form-item>
        <el-form-item label="分支">
          <el-select v-model="triggerForm.ref" style="width:100%" filterable>
            <el-option v-for="b in branches" :key="b.name" :label="b.name" :value="b.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="输入参数">
          <div v-for="(input, idx) in triggerForm.inputs" :key="idx" style="display:flex;gap:8px;margin-bottom:8px">
            <el-input v-model="input.key" placeholder="参数名" style="width:40%" />
            <el-input v-model="input.value" placeholder="参数值" style="width:50%" />
            <el-button type="danger" :icon="Delete" circle size="small" @click="triggerForm.inputs.splice(idx,1)" />
          </div>
          <el-button size="small" @click="triggerForm.inputs.push({key:'',value:''})">添加参数</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="triggerVisible = false">取消</el-button>
        <el-button type="primary" :loading="triggering" @click="handleTrigger">触发</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { getWorkflows, getBranches, triggerWorkflow } from '../api'

const query = ref({ owner: '', repo: '' })
const workflows = ref([])
const branches = ref([])
const loading = ref(false)
const triggerVisible = ref(false)
const triggering = ref(false)
const triggerForm = ref({ workflowId: null, workflowName: '', ref: 'main', inputs: [] })

async function loadWorkflows() {
  if (!query.value.owner || !query.value.repo) {
    ElMessage.warning('请输入 Owner 和 Repo')
    return
  }
  loading.value = true
  try {
    const [wfRes, brRes] = await Promise.all([
      getWorkflows(query.value.owner, query.value.repo),
      getBranches(query.value.owner, query.value.repo)
    ])
    workflows.value = wfRes?.data || wfRes?.workflows || wfRes || []
    branches.value = brRes?.data || brRes || []
  } finally { loading.value = false }
}

function openTrigger(row) {
  triggerForm.value = {
    workflowId: row.id,
    workflowName: row.name,
    ref: branches.value[0]?.name || 'main',
    inputs: []
  }
  triggerVisible.value = true
}

async function handleTrigger() {
  triggering.value = true
  try {
    const inputs = {}
    triggerForm.value.inputs.forEach(i => { if (i.key) inputs[i.key] = i.value })
    await triggerWorkflow({
      owner: query.value.owner,
      repo: query.value.repo,
      workflowId: triggerForm.value.workflowId,
      ref: triggerForm.value.ref,
      inputs
    })
    ElMessage.success('工作流触发成功')
    triggerVisible.value = false
  } finally { triggering.value = false }
}
</script>
