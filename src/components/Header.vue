<script setup>
import { RouterLink } from 'vue-router';
import Logo from './icons/Logo.vue';
import Person from './icons/PersonIcon.vue';
import Document from './icons/Document.vue';
import HomeIcon from './icons/HomeIcon.vue';
</script>

<template>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <!-- == LOGO == -->
                <RouterLink class="logo" to="/">
                    <div class="logo-icon">
                        <Logo />
                    </div>
                    <span class="logo-text">EAD</span>
                </RouterLink>
                <!-- == NAVIGATION == -->
                <nav class="nav">
                    <RouterLink to="/" class="nav-link">
                        <HomeIcon />
                        <span>Главное</span>
                    </RouterLink>
                    <RouterLink to="/employees" class="nav-link">
                        <Person />
                        <span>Сотрудники</span>
                    </RouterLink>

                    <RouterLink to="/documents" class="nav-link">
                        <Document />
                        <span>Документы</span>
                    </RouterLink>
                </nav>
            </div>
        </div>
    </header>
</template>

<style scoped>
.header {
    width: 100%;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    z-index: 100;
    display: flex;
    justify-content: space-between;
    height: 70px;
}

.header-content{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Logo */
.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
}

.logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: transform 0.2s ease;
}

.logo-icon:hover {
    transform: scale(1.05);
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.02em;
}

/* Navigation */
.nav {
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-color-light);
    font-weight: 500;
    font-size: 15px;
    transition: all 0.2s ease;
    position: relative;
}

.nav-link:hover {
    color: var(--primary-color);
    background: rgba(72, 101, 255, 0.06);
    text-decoration: none;
}

.nav-link.router-link-active {
    color: var(--primary-color);
    background: rgba(72, 101, 255, 0.1);
}

.nav-link.router-link-active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 16px;
    right: 16px;
    height: 2px;
    background: var(--primary-color);
    border-radius: 1px;
}

.nav-link svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

/* User Profile */
.user-profile {
    display: flex;
    align-items: center;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-light);
    cursor: pointer;
    transition: all 0.2s ease;
}

.user-avatar:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: rgba(72, 101, 255, 0.06);
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 16px;
        height: 64px;
    }

    .logo-text {
        font-size: 20px;
    }

    .nav {
        gap: 4px;
    }

    .nav-link {
        padding: 8px 12px;
        font-size: 14px;
    }

    .nav-link span {
        display: none;
    }

    .nav-link svg {
        width: 20px;
        height: 20px;
    }
}

@media (max-width: 480px) {
    .user-profile {
        display: none;
    }

    .nav-link {
        padding: 8px;
    }
}
</style>