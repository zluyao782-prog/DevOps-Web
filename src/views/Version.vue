<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span>版本管理</span>
        <el-button type="primary" @click="openDialog()">新增版本</el-button>
      </div>
    </template>
    <div style="margin-bottom:12px;display:flex;gap:12px;align-items:center">
      <span>选择产品：</span>
      <el-select v-model="selectedProduct" placeholder="请选择产品" @change="load" style="width:200px">
        <el-option v-for="p in products" :key="p.id" :label="p.nameZh || p.name" :value="p.id" />
      </el-select>
    </div>
    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="version" label="版本号" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="isTest" label="测试版" width="80">
        <template #default="{ row }">
          <el-tag :type="row.isTest ? 'warning' : 'success'">{{ row.isTest ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑版本' : '新增版本'" width="480px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="产品" prop="productId">
          <el-select v-model="form.productId" style="width:100%">
            <el-option v-for="p in products" :key="p.id" :label="p.nameZh || p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="如 v1.0.0" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="测试版">
          <el-switch v-model="form.isTest" />
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
import { getProducts, getVersions, createVersion, updateVersion, deleteVersion } from '../api'

const list = ref([])
const products = ref([])
const selectedProduct = ref(null)
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({})
const rules = {
  productId: [{ required: true, message: '请选择产品' }],
  version: [
    { required: true, message: '请输入版本号' },
    { pattern: /^v\d+\.\d+\.\d+/, message: '格式如 v1.0.0' }
  ]
}

async function load() {
  if (!selectedProduct.value) return
  loading.value = true
  try {
    const res = await getVersions(selectedProduct.value)
    list.value = res?.data || res || []
  } finally { loading.value = false }
}

function openDialog(row) {
  form.value = row ? { ...row } : { isTest: false, productId: selectedProduct.value }
  dialogVisible.value = true
  formRef.value?.resetFields()
}

async function handleSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (form.value.id) await updateVersion(form.value)
    else await createVersion(form.value)
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } finally { saving.value = false }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确认删除版本 "${row.version}"？`, '提示', { type: 'warning' })
  await deleteVersion(row.id)
  ElMessage.success('删除成功')
  load()
}

onMounted(async () => {
  const res = await getProducts()
  products.value = res?.data || res || []
  if (products.value.length) {
    selectedProduct.value = products.value[0].id
    load()
  }
})
</script>
