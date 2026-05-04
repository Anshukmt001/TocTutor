/**
 * library.js - TOC Library and AI Tutor Logic
 */

function initLibrary() {
    const libraryTopics = [
        {
            id: "dfa",
            title: "DFA",
            icon: "ph ph-git-commit",
            difficulty: "yellow",
            vibe: "A simple machine that reads a string one letter at a time, strictly following one path. It never has to guess.",
            formal: "$$A = (Q, \\Sigma, \\delta, q_0, F)$$<br>Where $$\\delta: Q \\times \\Sigma \\to Q$$",
            useCase: "Essential for Lexical Analysis in compilers to break code into tokens.",
            example: "A machine with 2 states that toggles on '1' to accept strings with an odd number of 1s."
        },
        {
            id: "nfa",
            title: "NFA",
            icon: "ph ph-git-branch",
            difficulty: "yellow",
            vibe: "Like a DFA, but it can clone itself to explore multiple paths at once.",
            formal: "$$A = (Q, \\Sigma, \\delta, q_0, F)$$<br>Where $$\\delta: Q \\times \\Sigma_\\epsilon \\to \\mathcal{P}(Q)$$",
            useCase: "Easier to design for complex patterns, can be converted to DFA.",
            example: "An NFA that guesses when it's near the end of a string."
        },
        {
            id: "tm",
            title: "Turing Machines",
            icon: "ph ph-circuit-board",
            difficulty: "red",
            vibe: "The ultimate computer with an infinite tape. If it can't compute it, nothing can.",
            formal: "$$M = (Q, \\Sigma, \\Gamma, \\delta, q_0, q_{accept}, q_{reject})$$",
            useCase: "Foundation of computability theory (Halting Problem).",
            example: "A TM that checks for palindromes."
        }
    ];

    const container = document.getElementById('library-cards-container');
    const detailView = document.getElementById('topic-detail-view');
    const libraryView = document.getElementById('library-view');
    const detailContent = document.getElementById('topic-detail-content');
    const backBtn = document.getElementById('btn-back-to-library');

    if (!container) return;

    container.innerHTML = '';
    libraryTopics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'summary-card';
        card.innerHTML = `
            <i class="${topic.icon}"></i>
            <h3>${topic.title}</h3>
            <span class="difficulty-badge badge-${topic.difficulty}">${topic.difficulty}</span>
        `;
        card.onclick = () => openTopic(topic);
        container.appendChild(card);
    });

    function openTopic(topic) {
        detailContent.innerHTML = `
            <h1>${topic.title}</h1>
            <div class="detail-section"><h3>The Vibe</h3><p>${topic.vibe}</p></div>
            <div class="detail-section"><h3>Formal Definition</h3><div class="math-block">${topic.formal}</div></div>
            <div class="detail-section"><h3>Use Case</h3><p>${topic.useCase}</p></div>
            <button class="btn-ask-ai glass-btn highlight-btn" style="margin-top:2rem">Ask AI Expert about ${topic.title}</button>
        `;
        libraryView.style.display = 'none';
        detailView.style.display = 'block';
        
        // Re-render Math
        if (window.renderMathInElement) renderMathInElement(detailContent);
    }

    if (backBtn) {
        backBtn.onclick = () => {
            detailView.style.display = 'none';
            libraryView.style.display = 'block';
        };
    }
}
