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

    // 5. Mobile Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarClose = document.getElementById('mobile-sidebar-close');
    
    // Create overlay if not exists
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    const toggleSidebar = (show) => {
        if (show) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (menuToggle) menuToggle.onclick = () => toggleSidebar(true);
    if (sidebarClose) sidebarClose.onclick = () => toggleSidebar(false);
    if (overlay) overlay.onclick = () => toggleSidebar(false);

    // Close sidebar on nav click (mobile)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) toggleSidebar(false);
        });
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

// Global UI Injection (Chatbot & Modals)
function injectGlobalUI() {
    // 1. Chatbot
    if (!document.getElementById('chatbot')) {
        const chatbotHTML = `
            <div class="chatbot-container" id="chatbot" style="display: none;">
                <div class="chatbot-header">
                    <div class="bot-info" style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600;">
                        <i class="ph-fill ph-robot" style="color: var(--neon-blue); font-size: 1.5rem;"></i>
                        <span>TOC Expert AI</span>
                    </div>
                    <button id="btn-close-chat" class="glass-btn" style="padding: 0.25rem 0.5rem; border: none;"><i class="ph ph-x"></i></button>
                </div>
                <div class="chatbot-messages" id="chat-messages">
                    <div class="chat-message bot-message">
                        <p>Hello! I'm your TOC Expert AI. Ask me anything about automata, grammars, or complexity!</p>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chat-input" class="glass-input" placeholder="Type your question..." style="border-radius: 20px;">
                    <button id="btn-send-chat" class="glass-btn highlight-btn" style="padding: 0.5rem 1rem; border-radius: 20px;"><i class="ph ph-paper-plane-right"></i></button>
                </div>
            </div>
            <button id="btn-toggle-chat" class="floating-chat-btn">
                <i class="ph-fill ph-chat-circle-dots"></i>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // 2. Modals
    if (!document.getElementById('custom-modal')) {
        const modalHTML = `
            <div id="custom-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content glass-card">
                    <h2 id="modal-title">Notification</h2>
                    <p id="modal-message">Message content...</p>
                    <div class="modal-actions">
                        <button id="btn-close-modal" class="glass-btn highlight-btn">Dismiss</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 3. Load Dependencies (Marked, KaTeX, Chatbot)
    const dependencies = [
        { type: 'script', id: 'marked-js', src: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js' },
        { type: 'script', id: 'katex-js', src: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js' },
        { type: 'script', id: 'katex-auto-render', src: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js' },
        { type: 'link', id: 'katex-css', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css' },
        { type: 'script', id: 'chatbot-js', src: 'js/chatbot.js' }
    ];

    dependencies.forEach(dep => {
        const existing = dep.type === 'script' ? 
                         document.querySelector(`script[src="${dep.src}"]`) : 
                         document.querySelector(`link[href="${dep.href}"]`);
        
        if (!existing) {
            const el = document.createElement(dep.type === 'script' ? 'script' : 'link');
            if (dep.type === 'script') {
                el.src = dep.src;
                el.async = true;
                // If it's the chatbot script, re-init after it loads
                if (dep.id === 'chatbot-js') {
                    el.onload = () => {
                        if (window.Chatbot && typeof window.Chatbot.init === 'function') {
                            window.Chatbot.init();
                        }
                    };
                }
            } else {
                el.rel = 'stylesheet';
                el.href = dep.href;
            }
            el.id = dep.id;
            document.head.appendChild(el);
        } else if (dep.id === 'chatbot-js' && window.Chatbot) {
            // Already exists, just init
            window.Chatbot.init();
        }
    });
}

// Run injection on load (Robust)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectGlobalUI);
} else {
    injectGlobalUI();
}
