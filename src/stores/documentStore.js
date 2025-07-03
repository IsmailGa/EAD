import { defineStore } from 'pinia'
import axios from 'axios'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    documents: [],
    document: null,
    total: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDocuments(page = 1, limit = 10, employeeId, search = '') {
      try {
        this.loading = true
        this.error = null

        const params = {
          _page: page,
          _limit: limit,
        }

        // Добавляем employeeId если он передан
        if (employeeId) {
          params.employeeId = employeeId
        }

        // Добавляем параметры поиска если они переданы
        if (search) {
          params.q = search // Поиск по всем полям
          params.number = search // Поиск по номеру документа
          params.description = search // Поиск по описанию
        }

        const response = await axios.get(`http://localhost:3001/documents`, { params })

        // Обрабатываем ответ как в шаблоне
        if (response.data.data) {
          this.documents = response.data.data
          this.total = Number(response.data.items) || 0
        } else {
          this.documents = response.data
          this.total = Number(response.headers['x-total-count']) || response.data.length
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch documents'
        console.error('Error fetching documents:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchDocument(id) {
      try {
        this.loading = true
        this.error = null

        const response = await axios.get(`http://localhost:3001/documents/${id}`)
        this.document = response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch document'
        console.error('Error fetching document:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearDocument() {
      this.document = null
      this.error = null
    },

    clearDocuments() {
      this.documents = []
      this.total = 0
      this.error = null
    },
  },
})
