<template>
  <div class="not-found">
    <h1>404 — Страница не найдена</h1>
    <p>Извините, но такой страницы не существует.</p>
    <RouterLink to="/" class="back-home">На главную</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}
.not-found h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.not-found p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.back-home {
  color: #ffffff;
  background-color: #42b983;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}
</style>
