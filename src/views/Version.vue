<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>版本管理</span>
        <el-button type="primary" @click="openDialog()">新增版本</el-button>
      </div>
    </template>
    <div class="filter-bar">
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
          <el-button size="small" @click="openVersionDialog(row)">编辑</el-button>
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
import { useCRUD } from '../composables/useCRUD'
import { getProducts, getVersions, createVersion, updateVersion, deleteVersion } from '../api'

const products = ref([])
const selectedProduct = ref(null)

const rules = {
  productId: [{ required: true, message: '请选择产品' }],
  version: [
    { required: true, message: '请输入版本号' },
    { pattern: /^v\d+\.\d+\.\d+/, message: '格式如 v1.0.0' }
  ]
}

const { list, loading, saving, dialogVisible, formRef, form, load, openDialog, handleSave, handleDelete } = useCRUD({
  fetchFn: () => selectedProduct.value ? getVersions(selectedProduct.value) : Promise.resolve([]),
  createFn: createVersion,
  updateFn: updateVersion,
  deleteFn: deleteVersion,
  getDeleteLabel: row => row.version,
  defaultForm: { isTest: false }
})

// 重写 openDialog 以注入当前选中产品
const _openDialog = openDialog
function openVersionDialog(row) {
  _openDialog(row)
  if (!row) form.value.productId = selectedProduct.value
}

onMounted(async () => {
  try {
    const res = await getProducts()
    products.value = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
    if (products.value.length) {
      selectedProduct.value = products.value[0].id
      load()
    }
  } catch (e) {
    console.error('加载产品失败', e)
  }
})
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.filter-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
</style>
