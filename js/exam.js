/**
 * exam.js - Student Quiz Logic
 */

function initExamCenter() {
    let currentQuiz = null;
    let currentIdx = 0;
    let score = 0;
    let timer = null;

    const noQuiz = document.getElementById('no-quiz-msg');
    const quizBox = document.getElementById('active-quiz-container');
    const resultsBox = document.getElementById('quiz-results-container');
    const timerEl = document.getElementById('quiz-timer');

    const saved = localStorage.getItem('activeQuiz');
    if (!saved) return;

    try {
        currentQuiz = JSON.parse(saved);
        noQuiz.style.display = 'none';
        quizBox.style.display = 'block';
        renderQuestion();
        startTimer();
    } catch (e) { console.error(e); }

    function renderQuestion() {
        const q = currentQuiz.questions[currentIdx];
        document.getElementById('quiz-topic-title').textContent = `Quiz: ${currentQuiz.topic}`;
        document.getElementById('quiz-question-counter').textContent = `Question ${currentIdx + 1} of ${currentQuiz.questions.length}`;
        document.getElementById('question-text').textContent = q.question || q.q;
        
        const optContainer = document.getElementById('options-container');
        optContainer.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'glass-btn option-btn';
            btn.textContent = opt;
            btn.onclick = () => {
                if (i === q.answer) score++;
                next();
            };
            optContainer.appendChild(btn);
        });

        document.getElementById('quiz-progress-fill').style.width = `${(currentIdx / currentQuiz.questions.length) * 100}%`;
    }

    function next() {
        currentIdx++;
        if (currentIdx < currentQuiz.questions.length) {
            renderQuestion();
        } else {
            finish();
        }
    }

    function startTimer() {
        let left = 300;
        timer = setInterval(() => {
            left--;
            const m = Math.floor(left/60);
            const s = left%60;
            timerEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
            if (left <= 0) finish();
        }, 1000);
    }

    function finish() {
        clearInterval(timer);
        quizBox.style.display = 'none';
        resultsBox.style.display = 'block';
        const pct = Math.round((score / currentQuiz.questions.length) * 100);
        document.getElementById('final-score').textContent = `${pct}%`;
        localStorage.setItem('latestScore', pct);
    }

    const retBtn = document.getElementById('btn-return-dashboard');
    if (retBtn) retBtn.onclick = () => window.location.href = 'index.html';
}
