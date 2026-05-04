/**
 * shared.js - Global Logic for TOC Learning Platform
 * Handles Authentication, Sidebar, and Common UI
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Session Protection
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Global UI Sync
    const displayNames = document.querySelectorAll('.user-name, #display-user-name');
    const displayRoles = document.querySelectorAll('.user-role, #display-user-role');
    const adminIndicator = document.getElementById('admin-indicator');
    const adminFooter = document.getElementById('admin-footer');

    if (user) {
        displayNames.forEach(el => el.textContent = user.name);
        displayRoles.forEach(el => el.textContent = user.role);
        
        if (user.isAdmin) {
            document.body.classList.add('admin-mode');
            if (adminIndicator) adminIndicator.style.display = 'flex';
            if (adminFooter) adminFooter.style.display = 'block';
        }
    }

    // 3. Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // 4. Shared Progress Animations
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 400);
    });
});

// Shared Modal Helper
function showModal(title, message, isSuccess = true) {
    const modal = document.getElementById('custom-modal');
    if (!modal) {
        alert(`${title}: ${message}`);
        return;
    }
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-title').style.color = isSuccess ? '#00f3ff' : '#ff4c4c';
    document.getElementById('modal-message').textContent = message;
    modal.style.display = 'flex';
    
    const closeBtn = document.getElementById('btn-close-modal');
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
}
