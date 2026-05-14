/**
 * library.js - TOC Library and AI Tutor Logic
 */

function initLibrary() {
    const libraryTopics = [
        {
            id: "dfa",
            title: "DFA (Deterministic Finite Automata)",
            icon: "ph ph-git-commit",
            difficulty: "green",
            vibe: "A simple machine that reads a string one letter at a time, strictly following one path. It has no memory other than its current state.",
            formal: `
                <p>A DFA is a 5-tuple $M = (Q, \Sigma, \delta, q_0, F)$:</p>
                <ul>
                    <li>$Q$: Finite set of states</li>
                    <li>$\Sigma$: Finite alphabet</li>
                    <li>$\delta: Q \times \Sigma \to Q$: Transition function</li>
                    <li>$q_0 \in Q$: Start state</li>
                    <li>$F \subseteq Q$: Set of accept states</li>
                </ul>
            `,
            useCase: "Essential for Lexical Analysis in compilers to break code into tokens and for simple pattern matching in hardware.",
            example: "A DFA that accepts strings ending with '1'. States: {q0, q1}, Start: q0, Accept: {q1}, Transitions: (q0,1)->q1, (q0,0)->q0, (q1,1)->q1, (q1,0)->q0."
        },
        {
            id: "nfa",
            title: "NFA (Non-deterministic Finite Automata)",
            icon: "ph ph-git-branch",
            difficulty: "yellow",
            vibe: "Like a DFA, but it can clone itself to explore multiple paths at once. It accepts if <i>any</i> path leads to an accept state.",
            formal: `
                <p>An NFA is a 5-tuple $M = (Q, \Sigma, \delta, q_0, F)$:</p>
                <ul>
                    <li>$\delta: Q \times \Sigma_\epsilon \to \mathcal{P}(Q)$: The transition function returns a <b>set</b> of possible next states.</li>
                    <li>$\Sigma_\epsilon = \Sigma \cup \{\epsilon\}$: Allows transitions without consuming any input.</li>
                </ul>
            `,
            useCase: "NFAs are often much smaller and easier to design than DFAs for complex patterns. They are used internally by many RegEx engines.",
            example: "An NFA that matches strings containing 'aba'. It can stay in the start state indefinitely and 'guess' when to start matching the pattern."
        },
        {
            id: "regex",
            title: "Regular Expressions",
            icon: "ph ph-code",
            difficulty: "green",
            vibe: "A declarative way to describe regular languages. If you've used <code>grep</code> or <code>Ctrl+F</code>, you've used a simplified version of this.",
            formal: `
                <p>$R$ is a regular expression if $R$ is:</p>
                <ol>
                    <li>$a$ for some $a \in \Sigma$</li>
                    <li>$\epsilon$ (the empty string)</li>
                    <li>$\emptyset$ (the empty set)</li>
                    <li>$(R_1 \cup R_2)$ (Union)</li>
                    <li>$(R_1 \circ R_2)$ (Concatenation)</li>
                    <li>$(R_1^*)$ (Kleene Star - 0 or more repetitions)</li>
                </ol>
            `,
            useCase: "String validation (emails, phone numbers), text scraping, and syntax highlighting in IDEs.",
            example: "$(a \cup b)^* abb$ matches any string of 'a's and 'b's that ends in 'abb'."
        },
        {
            id: "pumping",
            title: "Pumping Lemma",
            icon: "ph ph-wrench",
            difficulty: "red",
            vibe: "A 'breakdown test' for regular languages. It's the primary tool used to prove that a language is <b>not</b> regular.",
            formal: `
                <p>If $L$ is a regular language, then there is a number $p$ (the pumping length) such that for any string $s \in L$ where $|s| \ge p$, $s$ can be divided into three pieces $s = xyz$ satisfying:</p>
                <ol>
                    <li>For each $i \ge 0$, $xy^i z \in L$</li>
                    <li>$|y| > 0$</li>
                    <li>$|xy| \le p$</li>
                </ol>
            `,
            useCase: "Proving that languages requiring infinite memory (like $\{0^n 1^n\}$) cannot be recognized by a DFA.",
            example: "Proving that $\{0^n 1^n \mid n \ge 0\}$ is not regular because any attempt to 'pump' the middle of a long string will result in an unequal number of 0s and 1s."
        },
        {
            id: "cfg",
            title: "Context-Free Grammars",
            icon: "ph ph-tree-structure",
            difficulty: "yellow",
            vibe: "A set of recursive rules used to generate strings. CFGs can describe structures like nested parentheses and HTML tags that RegEx cannot.",
            formal: `
                <p>A CFG is a 4-tuple $G = (V, \Sigma, R, S)$:</p>
                <ul>
                    <li>$V$: Finite set of variables (non-terminals)</li>
                    <li>$\Sigma$: Finite set of terminals (the alphabet)</li>
                    <li>$R$: Finite set of rules (e.g., $A \to 0A1$)</li>
                    <li>$S \in V$: The start variable</li>
                </ul>
            `,
            useCase: "Defining the syntax of almost all modern programming languages (C++, Java, Python).",
            example: "$S \to (S) \mid SS \mid \epsilon$ generates all strings of balanced parentheses."
        },
        {
            id: "pda",
            title: "Pushdown Automata",
            icon: "ph ph-stack",
            difficulty: "yellow",
            vibe: "An NFA with a 'Stack'. It has LIFO (Last-In-First-Out) memory, allowing it to remember things like 'how many 0s did I see?'",
            formal: `
                <p>A PDA is a 6-tuple $P = (Q, \Sigma, \Gamma, \delta, q_0, F)$:</p>
                <ul>
                    <li>$\Gamma$: The stack alphabet (different from the input alphabet)</li>
                    <li>$\delta: Q \times \Sigma_\epsilon \times \Gamma_\epsilon \to \mathcal{P}(Q \times \Gamma_\epsilon)$: Transition depends on state, input, AND the top of the stack.</li>
                </ul>
            `,
            useCase: "The theoretical model behind parsers in compilers.",
            example: "A PDA that pushes a symbol onto the stack for every '0' it sees, and pops it for every '1', accepting only if the stack is empty at the end."
        },
        {
            id: "tm",
            title: "Turing Machines",
            icon: "ph ph-cpu",
            difficulty: "red",
            vibe: "The absolute model of computation. If a problem can't be solved by a Turing Machine, it can't be solved by any computer ever.",
            formal: `
                <p>A TM is a 7-tuple $M = (Q, \Sigma, \Gamma, \delta, q_0, q_{accept}, q_{reject})$:</p>
                <ul>
                    <li>$\Gamma$: Tape alphabet ($\Sigma \subset \Gamma$ and includes the blank symbol $\sqcup$)</li>
                    <li>$\delta: Q \times \Gamma \to Q \times \Gamma \times \{L, R\}$: Moves the head Left or Right after reading/writing.</li>
                </ul>
            `,
            useCase: "Defining what is 'computable'. Used to prove that some problems (like the Halting Problem) are impossible to solve.",
            example: "A TM that moves across the tape to find the middle of a string or simulates a simple addition."
        },
        {
            id: "complexity",
            title: "P vs NP & Complexity",
            icon: "ph ph-chart-bar",
            difficulty: "red",
            vibe: "The study of how many resources (time/space) a problem needs. It's the most famous unsolved problem in Computer Science.",
            formal: `
                <ul>
                    <li><b>P</b>: Problems solvable in polynomial time (Easy to solve).</li>
                    <li><b>NP</b>: Problems where a solution can be <i>verified</i> in polynomial time (Easy to check).</li>
                    <li><b>NP-Complete</b>: The hardest problems in NP. If one is solved in P, they all are.</li>
                </ul>
            `,
            useCase: "Cybersecurity (RSA encryption relies on the fact that factoring large numbers is hard) and optimization (Traveling Salesperson).",
            example: "Finding a path through a maze (P) vs finding the shortest path that visits 100 cities (NP-Hard)."
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
            <h1 style="color: var(--neon-blue); margin-bottom: 1.5rem;">${topic.title}</h1>
            <div class="detail-section">
                <h3 style="color: #ff00ff;"><i class="ph ph-sparkle"></i> The Vibe</h3>
                <p>${topic.vibe}</p>
            </div>
            <div class="detail-section">
                <h3 style="color: #0088ff;"><i class="ph ph-scroll"></i> Formal Definition</h3>
                <div class="math-block" style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border: 1px solid rgba(255,255,255,0.05);">
                    ${topic.formal}
                </div>
            </div>
            <div class="detail-section">
                <h3 style="color: #00ff88;"><i class="ph ph-briefcase"></i> Real-World Use Case</h3>
                <p>${topic.useCase}</p>
            </div>
            <div class="detail-section">
                <h3 style="color: #ffaa00;"><i class="ph ph-lightbulb"></i> Quick Example</h3>
                <p>${topic.example}</p>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2.5rem;">
                <button class="glass-btn highlight-btn" onclick="alert('Starting interactive lab for ${topic.id}...')">
                    <i class="ph ph-play"></i> Try in Lab
                </button>
                <button class="glass-btn" style="border-color: #ff00ff; color: #ff00ff;">
                    <i class="ph ph-robot"></i> Explain Further
                </button>
            </div>
        `;
        libraryView.style.display = 'none';
        detailView.style.display = 'block';
        
        // Add button handlers
        const tryInLabBtn = detailContent.querySelector('.highlight-btn');
        const explainFurtherBtn = detailContent.querySelector('.glass-btn:not(.highlight-btn)');

        if (tryInLabBtn) {
            tryInLabBtn.onclick = () => {
                const targetPage = topic.id === 'tm' ? 'turing.html' : 
                                   (topic.id === 'dfa' || topic.id === 'nfa') ? 'turing.html' : 
                                   'converter.html';
                window.location.href = targetPage;
            };
        }

        if (explainFurtherBtn) {
            explainFurtherBtn.onclick = () => {
                showModal("AI Tutor", `I'm preparing a deeper dive into ${topic.title} for you. This will include more formal proofs and advanced examples. Stay tuned!`, true);
            };
        }

        // Re-render Math
        if (window.renderMathInElement) {
            renderMathInElement(detailContent, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError : false
            });
        }
    }

    if (backBtn) {
        backBtn.onclick = () => {
            detailView.style.display = 'none';
            libraryView.style.display = 'block';
        };
    }
}
