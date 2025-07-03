import { defineStore } from 'pinia'
import axios from 'axios'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [],
    employee: null,
    total: 0,
    loading: false,
    error: null,
  }),

  getters: {
    getEmployeeFullName: (state) => {
      if (!state.employee) return ''
      return `${state.employee.firstName} ${state.employee.lastName}`
    },

    getEmployeeInitials: (state) => {
      if (!state.employee) return '??'
      const firstName = state.employee.firstName || ''
      const lastName = state.employee.lastName || ''
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    },

    // Геттер для получения инициалов любого сотрудника
    getEmployeeInitialsFromObject: () => (employee) => {
      if (!employee) return '??'
      const firstName = employee.firstName || ''
      const lastName = employee.lastName || ''
      if (!firstName && !lastName) return '??'
      if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      return (firstName.charAt(0) || lastName.charAt(0) || '?').toUpperCase()
    },

    isEmployeeActive: (state) => {
      return state.employee?.active || false
    },
  },

  actions: {
    async fetchEmployees(page = 1, limit = 12, search = '') {
      try {
        this.loading = true
        this.error = null

        const params = {
          _page: page,
          _per_page: limit,
        }

        if (search) {
          params.firstName = search
        }

        console.log('EmployeeStore: fetching with params:', params) // Добавляем лог для отладки

        const response = await axios.get(`http://localhost:3001/employees`, { params })

        // Обрабатываем ответ как в шаблоне
        if (response.data.data) {
          this.employees = response.data.data
          this.total = Number(response.data.items) || 0
        } else {
          this.employees = response.data
          this.total = Number(response.headers['x-total-count']) || response.data.length
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch employees'
        console.error('Error fetching employees:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchEmployee(id) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.get(`http://localhost:3001/employees/${id}`)
        this.employee = response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch employee'
        console.error('Error fetching employee:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearEmployee() {
      this.employee = null
      this.error = null
    },

    clearEmployees() {
      this.employees = []
      this.total = 0
      this.error = null
    },
  },
})
