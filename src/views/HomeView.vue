<script setup>

</script>

<template>
  <main class="home-main">
    <div class="container">
      <h1 class="page-title">
        Главная страница
      </h1>
      
      <div class="navigation-section">
        <h2>Разделы системы</h2>
        
        <div class="nav-links">
          <a href="/employees" class="nav-link">
            <span class="nav-icon">👥</span>
            <div class="nav-content">
              <h3>Сотрудники</h3>
              <p>Управление персоналом</p>
            </div>
          </a>
          
          <a href="/documents" class="nav-link">
            <span class="nav-icon">📄</span>
            <div class="nav-content">
              <h3>Документы</h3>
              <p>Работа с документами</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-main {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-top: 32px;
}

.container {
  padding: 0 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 40px;
}

.navigation-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 24px;
}

.nav-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  min-width: 250px;
}

.nav-link:hover {
  background: #e9ecef;
  border-color: #dee2e6;
  transform: translateY(-1px);
}

.nav-icon {
  font-size: 24px;
  margin-right: 16px;
}

.nav-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-color);
}

.nav-content p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
  }
  
  .nav-link {
    min-width: auto;
  }
}
</style>