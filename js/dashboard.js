/**
 * dashboard.js - Student Dashboard Logic
 */

function initDashboard() {
    const timeSpentEl = document.getElementById('stat-time-spent');
    const avgScoreEl = document.getElementById('stat-avg-score');
    
    function update() {
        const seconds = parseInt(localStorage.getItem('timeSpentSeconds') || '0');
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        
        if (timeSpentEl) timeSpentEl.textContent = h > 0 ? `${h}h ${m}m` : `${m}m`;
        
        const latest = localStorage.getItem('latestScore') || '0';
        if (avgScoreEl) avgScoreEl.textContent = `${latest}%`;
        
        const fill = document.querySelector('.stat-card:nth-child(2) .progress-bar-fill');
        if (fill) fill.style.width = `${latest}%`;
    }

    // Update every minute
    setInterval(update, 60000);
    update();

    // Time ticker
    setInterval(() => {
        let s = parseInt(localStorage.getItem('timeSpentSeconds') || '0');
        localStorage.setItem('timeSpentSeconds', s + 1);
    }, 1000);
}
