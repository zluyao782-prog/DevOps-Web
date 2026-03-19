import request from '@/utils/request'
import { encryptPassword } from '@/utils/crypto'

export const getUsers = (params) => request.get('/user', { params })

export const createUser = ({ userName, password, authType }) => {
  const { password: encPwd, iv } = encryptPassword(password)
  return request.post('/user', { username: userName, password: encPwd, iv, authType })
}

export const updateUser = ({ userName, password, authType }) => {
  if (password) {
    const { password: encPwd, iv } = encryptPassword(password)
    return request.put('/user', { username: userName, authType, password: encPwd, iv })
  }
  return request.put('/user', { username: userName, authType })
}

export const deleteUser = username => request.delete('/user', { params: { username } })
