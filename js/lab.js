/**
 * lab.js - Full DFA Simulator Logic (Restored)
 */

function initLab() {
    const canvas = document.getElementById('dfa-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let states = [];
    let transitions = [];
    let stateCounter = 0;
    let currentMode = 'idle'; // 'add-state', 'add-transition', 'set-start', 'set-accept'
    let selectedState = null;
    let activeStateId = null;

    const btnAddState = document.getElementById('btn-add-state');
    const btnAddTransition = document.getElementById('btn-add-transition');
    const btnSetStart = document.getElementById('btn-set-start');
    const btnSetAccept = document.getElementById('btn-set-accept');
    const btnClear = document.getElementById('btn-clear');
    const btnSimulate = document.getElementById('btn-simulate');
    const simString = document.getElementById('sim-string');

    function setToolbarActive(btn) {
        [btnAddState, btnAddTransition, btnSetStart, btnSetAccept].forEach(b => {
            if(b) b.classList.remove('highlight-btn');
        });
        if (btn) btn.classList.add('highlight-btn');
    }

    if(btnAddState) btnAddState.onclick = () => { currentMode = 'add-state'; setToolbarActive(btnAddState); selectedState = null; };
    if(btnAddTransition) btnAddTransition.onclick = () => { currentMode = 'add-transition'; setToolbarActive(btnAddTransition); selectedState = null; };
    if(btnSetStart) btnSetStart.onclick = () => { currentMode = 'set-start'; setToolbarActive(btnSetStart); selectedState = null; };
    if(btnSetAccept) btnSetAccept.onclick = () => { currentMode = 'set-accept'; setToolbarActive(btnSetAccept); selectedState = null; };
    
    if(btnClear) btnClear.onclick = () => { 
        states = []; transitions = []; stateCounter = 0; currentMode = 'idle'; 
        setToolbarActive(null); activeStateId = null; draw(); 
    };

    function resize() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        draw();
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (currentMode === 'add-state') {
            states.push({ id: `q${stateCounter++}`, x, y, isStart: states.length === 0, isAccept: false });
            draw();
        } else if (currentMode === 'add-transition') {
            const clicked = states.find(s => Math.hypot(s.x - x, s.y - y) < 25);
            if (clicked) {
                if (!selectedState) {
                    selectedState = clicked;
                    draw();
                } else {
                    openTransitionModal(selectedState, clicked);
                    selectedState = null;
                    draw();
                }
            }
        } else if (currentMode === 'set-start') {
            const clicked = states.find(s => Math.hypot(s.x - x, s.y - y) < 25);
            if (clicked) {
                states.forEach(s => s.isStart = false);
                clicked.isStart = true;
                draw();
            }
        } else if (currentMode === 'set-accept') {
            const clicked = states.find(s => Math.hypot(s.x - x, s.y - y) < 25);
            if (clicked) {
                clicked.isAccept = !clicked.isAccept;
                draw();
            }
        }
    });

    // --- Transition Modal Logic ---
    const transitionModal = document.getElementById('transition-modal');
    const transitionInput = document.getElementById('transition-symbol-input');
    const transitionInfo = document.getElementById('transition-info');
    const btnConfirmTrans = document.getElementById('btn-confirm-transition');
    const btnCancelTrans = document.getElementById('btn-cancel-transition');
    let pendingTransition = null;

    function openTransitionModal(from, to) {
        pendingTransition = { from, to };
        transitionInfo.textContent = `${from.id} → ${to.id}`;
        transitionInput.value = '';
        transitionModal.style.display = 'flex';
        setTimeout(() => transitionInput.focus(), 100);
    }

    if (btnConfirmTrans) {
        btnConfirmTrans.onclick = () => {
            const symbol = transitionInput.value.trim();
            if (symbol && pendingTransition) {
                transitions.push({ from: pendingTransition.from.id, to: pendingTransition.to.id, symbol });
                draw();
            }
            transitionModal.style.display = 'none';
            pendingTransition = null;
        };
    }

    if (btnCancelTrans) btnCancelTrans.onclick = () => {
        transitionModal.style.display = 'none';
        pendingTransition = null;
    };

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        transitions.forEach(t => {
            const from = states.find(s => s.id === t.from);
            const to = states.find(s => s.id === t.to);
            if (!from || !to) return;

            ctx.strokeStyle = "#a0aab2";
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (from === to) {
                ctx.arc(from.x, from.y - 35, 20, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillText(t.symbol, from.x, from.y - 60);
            } else {
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                ctx.fillStyle = "white";
                ctx.fillText(t.symbol, midX, midY - 10);
            }
        });

        states.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, 25, 0, Math.PI * 2);
            ctx.fillStyle = (s.id === activeStateId) ? "rgba(0, 243, 255, 0.4)" : "#12141c";
            ctx.fill();
            ctx.strokeStyle = (s === selectedState) ? "white" : "#a0aab2";
            ctx.stroke();
            if (s.isAccept) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, 20, 0, Math.PI * 2);
                ctx.stroke();
            }
            if (s.isStart) {
                ctx.beginPath();
                ctx.moveTo(s.x - 50, s.y);
                ctx.lineTo(s.x - 25, s.y);
                ctx.stroke();
            }
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(s.id, s.x, s.y + 5);
        });
    }

    if(btnSimulate) btnSimulate.onclick = async () => {
        const input = simString.value;
        let current = states.find(s => s.isStart);
        if(!current) return alert("Set a start state first!");

        for (let char of input) {
            activeStateId = current.id;
            draw();
            await new Promise(r => setTimeout(r, 600));
            const trans = transitions.find(t => t.from === current.id && t.symbol.includes(char));
            if (trans) {
                current = states.find(s => s.id === trans.to);
            } else {
                alert("Rejected!");
                activeStateId = null;
                draw();
                return;
            }
        }
        activeStateId = current.id;
        draw();
        alert(current.isAccept ? "Accepted!" : "Rejected!");
        activeStateId = null;
        draw();
    };

    // --- Random DFA Logic ---
    const btnRandomDfa = document.getElementById('btn-random-dfa');
    if (btnRandomDfa) {
        btnRandomDfa.onclick = () => {
            const examples = [
                {
                    name: "Even number of 0s",
                    states: [
                        { id: 'q0', x: 250, y: 300, isStart: true, isAccept: true },
                        { id: 'q1', x: 550, y: 300, isStart: false, isAccept: false }
                    ],
                    transitions: [
                        { from: 'q0', to: 'q1', symbol: '0' },
                        { from: 'q0', to: 'q0', symbol: '1' },
                        { from: 'q1', to: 'q0', symbol: '0' },
                        { from: 'q1', to: 'q1', symbol: '1' }
                    ]
                },
                {
                    name: "Ends with 01",
                    states: [
                        { id: 'q0', x: 150, y: 300, isStart: true, isAccept: false },
                        { id: 'q1', x: 400, y: 300, isStart: false, isAccept: false },
                        { id: 'q2', x: 650, y: 300, isStart: false, isAccept: true }
                    ],
                    transitions: [
                        { from: 'q0', to: 'q1', symbol: '0' },
                        { from: 'q0', to: 'q0', symbol: '1' },
                        { from: 'q1', to: 'q1', symbol: '0' },
                        { from: 'q1', to: 'q2', symbol: '1' },
                        { from: 'q2', to: 'q1', symbol: '0' },
                        { from: 'q2', to: 'q0', symbol: '1' }
                    ]
                },
                {
                    name: "Multiple of 3 (Binary)",
                    states: [
                        { id: 'q0', x: 150, y: 300, isStart: true, isAccept: true },
                        { id: 'q1', x: 400, y: 150, isStart: false, isAccept: false },
                        { id: 'q2', x: 650, y: 300, isStart: false, isAccept: false }
                    ],
                    transitions: [
                        { from: 'q0', to: 'q0', symbol: '0' },
                        { from: 'q0', to: 'q1', symbol: '1' },
                        { from: 'q1', to: 'q2', symbol: '0' },
                        { from: 'q1', to: 'q0', symbol: '1' },
                        { from: 'q2', to: 'q1', symbol: '0' },
                        { from: 'q2', to: 'q2', symbol: '1' }
                    ]
                }
            ];
            const ex = examples[Math.floor(Math.random() * examples.length)];
            states = ex.states;
            transitions = ex.transitions;
            stateCounter = states.length;
            draw();
        };
    }


    // --- NFA to DFA Converter ---
    const nfaModal = document.getElementById('nfa-modal');
    const btnOpenNfa = document.getElementById('btn-nfa-to-dfa');
    const btnCloseNfa = document.getElementById('btn-close-nfa');
    const btnProcessNfa = document.getElementById('btn-process-conversion');
    const nfaInputArea = document.getElementById('nfa-input-area');
    const dfaOutputResults = document.getElementById('dfa-output-results');

    if (btnOpenNfa) btnOpenNfa.onclick = () => nfaModal.style.display = 'flex';
    if (btnCloseNfa) btnCloseNfa.onclick = () => nfaModal.style.display = 'none';

    if (btnProcessNfa) {
        btnProcessNfa.onclick = () => {
            const text = nfaInputArea.value;
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            let nfa = {};
            let startState = null;
            let acceptStates = new Set();
            let alphabet = new Set();

            lines.forEach(line => {
                let isStart = line.startsWith('->');
                let isAccept = line.includes('*') || line.startsWith('*');
                let cleanLine = line.replace('->', '').replace('*', '');
                
                const [statePart, transPart] = cleanLine.split(',');
                if (!statePart) return;
                
                const state = statePart.trim();
                if (isStart) startState = state;
                if (isAccept) acceptStates.add(state);

                if (transPart) {
                    const [sym, targets] = transPart.split('->');
                    if (sym && targets) {
                        const symbol = sym.trim();
                        const nextStates = targets.split(',').map(s => s.trim());
                        alphabet.add(symbol);
                        if (!nfa[state]) nfa[state] = {};
                        nfa[state][symbol] = nextStates;
                    }
                }
            });

            if (!startState) return dfaOutputResults.innerHTML = "<p style='color:red'>No start state (->q0)</p>";

            // Subset construction
            let dfaStates = [];
            let dfaMap = {};
            let queue = [];

            let startSet = [startState].sort();
            let startName = startSet.join(',') || '∅';
            dfaMap[startName] = { isAccept: startSet.some(s => acceptStates.has(s)), trans: {} };
            queue.push(startSet);

            while (queue.length > 0) {
                let currentSet = queue.shift();
                let currentName = currentSet.join(',') || '∅';

                alphabet.forEach(symbol => {
                    let nextSet = new Set();
                    currentSet.forEach(s => {
                        if (nfa[s] && nfa[s][symbol]) {
                            nfa[s][symbol].forEach(ns => nextSet.add(ns));
                        }
                    });
                    let nextArr = [...nextSet].sort();
                    let nextName = nextArr.join(',') || '∅';

                    dfaMap[currentName].trans[symbol] = nextName;

                    if (!dfaMap[nextName]) {
                        dfaMap[nextName] = { isAccept: nextArr.some(s => acceptStates.has(s)), trans: {} };
                        queue.push(nextArr);
                    }
                });
            }

            // Render Table
            let html = "<table style='width:100%; border-collapse:collapse; font-size:0.8rem;'><thead><tr><th style='border:1px solid #444; padding:5px;'>State</th>";
            alphabet.forEach(sym => html += `<th style='border:1px solid #444; padding:5px;'>${sym}</th>`);
            html += "</tr></thead><tbody>";

            for (let sName in dfaMap) {
                html += `<tr><td style='border:1px solid #444; padding:5px;'>{${sName}}${dfaMap[sName].isAccept?'*':''}</td>`;
                alphabet.forEach(sym => {
                    html += `<td style='border:1px solid #444; padding:5px;'>{${dfaMap[sName].trans[sym] || '∅'}}</td>`;
                });
                html += "</tr>";
            }
            html += "</tbody></table>";
            dfaOutputResults.innerHTML = html;
        };
    }
}

