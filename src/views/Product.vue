<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>产品管理</span>
        <el-button type="primary" @click="openDialog()">新增产品</el-button>
      </div>
    </template>
    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="nameZh" label="中文名" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="needShow" label="显示" width="80">
        <template #default="{ row }">
          <el-tag :type="row.needShow ? 'success' : 'info'">{{ row.needShow ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="members" label="成员" show-overflow-tooltip>
        <template #default="{ row }">{{ (row.members || []).join(', ') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑产品' : '新增产品'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="中文名" prop="nameZh">
          <el-input v-model="form.nameZh" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="form.needShow" />
        </el-form-item>
        <el-form-item label="成员">
          <el-select v-model="form.members" multiple filterable allow-create default-first-option placeholder="输入成员后回车" style="width:100%">
            <el-option v-for="m in form.members" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api'

const list = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({})
const rules = {
  name: [{ required: true, message: '请输入名称' }],
  nameZh: [{ required: true, message: '请输入中文名' }]
}

async function load() {
  loading.value = true
  try {
    const res = await getProducts()
    list.value = res?.data || res || []
  } finally { loading.value = false }
}

function openDialog(row) {
  form.value = row ? { ...row, members: [...(row.members || [])] } : { needShow: true, members: [] }
  dialogVisible.value = true
  formRef.value?.resetFields()
}

async function handleSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (form.value.id) await updateProduct(form.value)
    else await createProduct(form.value)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } finally { saving.value = false }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确认删除产品 "${row.name}"？`, '提示', { type: 'warning' })
  await deleteProduct(row.id)
  ElMessage.success('删除成功')
  load()
}

onMounted(load)
</script>
