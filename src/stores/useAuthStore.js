import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref((localStorage.getItem('token'))?localStorage.getItem('token'):null)
  const usuario_id = ref((localStorage.getItem('usuario_id'))?localStorage.getItem('usuario_id'):null)

  function login(newToken, newUserId) {
    
    token.value = newToken
    usuario_id.value = newUserId

    localStorage.setItem('token', newToken)
    localStorage.setItem('usuario_id', newUserId)
  }

  function logout() {
    token.value = null
    usuario_id.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario_id')
  }

  return {
    token,
    usuario_id,
    login,
    logout,
  }
})