/**
 * converter.js - NFA to DFA Subset Construction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const btnConvert = document.getElementById('btn-convert');
    const btnRandom = document.getElementById('btn-random');
    const nfaInput = document.getElementById('nfa-input');
    const dfaOutput = document.getElementById('dfa-output');

    function generateRandomNFA() {
        const examples = [
            `->q0, 0 -> q0, q1
q0, 1 -> q0
*q1, 1 -> q2`,
            `->q0, a -> q0, q1
q0, b -> q0
*q1, a -> q2`,
            `->q0, 0 -> q1
q0, 1 -> q0, q1
*q1, 1 -> q2
q2, 0 -> q2`,
            `->q0, x -> q0
q0, y -> q0, q1
*q1, x -> q2
q2, y -> q2`,
            `->q0, a -> q1
q0, b -> q1
q1, a -> q2
*q2, b -> q2`,
            `->q0, 0 -> q0, q1
q0, 1 -> q1
*q1, 0 -> q2`,
            `->q0, a -> q0
q0, b -> q0, q1
*q1, a -> q2
*q2, b -> q2`,
            `->q0, 1 -> q0, q1
q0, 0 -> q1
*q1, 1 -> q2
q2, 0 -> q2`,
            `->q0, a -> q1
q0, b -> q0
q1, a -> q2
*q2, b -> q0, q2`,
            `->q0, 0 -> q1
q0, 1 -> q0, q1
q1, 0 -> q2
*q2, 1 -> q1`
        ];
        return examples[Math.floor(Math.random() * examples.length)];
    }

    if (btnRandom) {
        btnRandom.addEventListener('click', () => {
            nfaInput.value = generateRandomNFA();
            dfaOutput.innerHTML = `<div class="placeholder-text" style="height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.5;">
                                Click "Perform Subset Construction" to convert...
                            </div>`;
        });
    }

    if (btnConvert) {
        btnConvert.addEventListener('click', () => {
            const text = nfaInput.value.trim();
            if (!text) return;

            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            let nfa = {};
            let startState = null;
            let acceptStates = new Set();
            let alphabet = new Set();

            // 1. Parse NFA
            lines.forEach(line => {
                let isStart = line.startsWith('->');
                let isAccept = line.includes('*') || line.startsWith('*');
                let cleanLine = line.replace('->', '').replace('*', '');
                
                const parts = cleanLine.split(',');
                if (parts.length < 2) return;

                const state = parts[0].trim();
                const rest = parts[1].trim();

                if (isStart) startState = state;
                if (isAccept) acceptStates.add(state);

                const [sym, targets] = rest.split('->');
                if (sym && targets) {
                    const symbol = sym.trim();
                    const nextStates = targets.split(',').map(s => s.trim()).filter(s => s !== '-' && s !== '');
                    alphabet.add(symbol);
                    if (!nfa[state]) nfa[state] = {};
                    nfa[state][symbol] = nextStates;
                }
            });

            if (!startState) {
                dfaOutput.innerHTML = "<p style='color:#ff4c4c; text-align:center;'>Error: No start state defined (use ->q0)</p>";
                return;
            }

            // 2. Subset Construction (DFA Generation)
            let dfaMap = {};
            let queue = [];
            let alphabetArr = [...alphabet].sort();

            let startSet = [startState].sort();
            let startName = startSet.join(',') || '∅';
            
            dfaMap[startName] = { 
                isAccept: startSet.some(s => acceptStates.has(s)), 
                trans: {},
                isStart: true 
            };
            queue.push(startSet);

            while (queue.length > 0) {
                let currentSet = queue.shift();
                let currentName = currentSet.join(',') || '∅';

                alphabetArr.forEach(symbol => {
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
                        dfaMap[nextName] = { 
                            isAccept: nextArr.some(s => acceptStates.has(s)), 
                            trans: {},
                            isStart: false
                        };
                        queue.push(nextArr);
                    }
                });
            }

            // 3. Render DFA Table
            let html = `
                <table style="width:100%; border-collapse: collapse; color: white;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--card-border);">
                            <th style="padding: 1rem; text-align: left;">State</th>
                            ${alphabetArr.map(sym => `<th style="padding: 1rem;">Input: ${sym}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (let sName in dfaMap) {
                let prefix = dfaMap[sName].isStart ? '→ ' : '';
                let suffix = dfaMap[sName].isAccept ? '*' : '';
                let displayName = `${prefix}{${sName}}${suffix}`;
                
                html += `
                    <tr style="border-bottom: 1px solid var(--card-border);">
                        <td style="padding: 1rem; font-weight: 700; color: var(--neon-blue);">${displayName}</td>
                        ${alphabetArr.map(sym => `
                            <td style="padding: 1rem; text-align: center;">
                                {${dfaMap[sName].trans[sym] || '∅'}}
                            </td>
                        `).join('')}
                    </tr>
                `;
            }

            html += "</tbody></table>";
            dfaOutput.innerHTML = html;
        });
    }
});
