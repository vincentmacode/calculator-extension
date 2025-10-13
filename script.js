const input = document.getElementById('inputtext');
const buttons = document.querySelectorAll('button');

/**
 * Evaluate a simple arithmetic expression.
 * This sanitizes the input to allow only digits, operators, parentheses, dot and spaces.
 * Returns the result or the string 'Malformed Operation' on error.
 */
function calculate(expression) {
    const expr = String(expression).trim();
    if (!expr) return '';

    // Allow only these characters: digits, + - * / ( ) . and whitespace
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        return 'Malformed Operation';
    }

    try {
        // Shunting-yard algorithm to parse to RPN, then evaluate RPN
        const outputQueue = [];
        const operatorStack = [];

        const ops = {
            '+': { prec: 1, assoc: 'L' },
            '-': { prec: 1, assoc: 'L' },
            '*': { prec: 2, assoc: 'L' },
            '/': { prec: 2, assoc: 'L' },
        };

        // Tokenize: numbers (including decimals), operators, parentheses
        const tokens = expr.match(/\d*\.?\d+|[+\-*/()]|\s+/g).filter(t => !/^\s+$/.test(t));

        for (const token of tokens) {
            if (/^\d*\.?\d+$/.test(token)) {
                outputQueue.push(token);
            } else if (token in ops) {
                while (operatorStack.length) {
                    const top = operatorStack[operatorStack.length - 1];
                    if (top in ops && ((ops[token].assoc === 'L' && ops[token].prec <= ops[top].prec) || (ops[token].assoc === 'R' && ops[token].prec < ops[top].prec))) {
                        outputQueue.push(operatorStack.pop());
                        continue;
                    }
                    break;
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (operatorStack.length === 0) throw new Error('Mismatched parentheses');
                operatorStack.pop(); // pop '('
            } else {
                throw new Error('Invalid token');
            }
        }

        while (operatorStack.length) {
            const op = operatorStack.pop();
            if (op === '(' || op === ')') throw new Error('Mismatched parentheses');
            outputQueue.push(op);
        }

        // Evaluate RPN
        const stack = [];
        for (const token of outputQueue) {
            if (/^\d*\.?\d+$/.test(token)) {
                stack.push(parseFloat(token));
            } else if (token in ops) {
                const b = stack.pop();
                const a = stack.pop();
                if (a === undefined || b === undefined) throw new Error('Malformed expression');
                let res;
                switch (token) {
                    case '+': res = a + b; break;
                    case '-': res = a - b; break;
                    case '*': res = a * b; break;
                    case '/': res = a / b; break;
                    default: throw new Error('Unknown operator');
                }
                stack.push(res);
            } else {
                throw new Error('Invalid RPN token');
            }
        }

        if (stack.length !== 1) throw new Error('Malformed expression');
        return String(stack[0]);
    } catch (error) {
        return 'Malformed Operation';
    }
}

function operation(buttonValue) {
    if (buttonValue === 'C') {
        input.value = '';
    } else if (buttonValue === 'DEL') {
        input.value = input.value.slice(0, -1);
    } else if (buttonValue === '=') {
        input.value = calculate(input.value);
    } else {
        input.value += buttonValue;
    }
}

buttons.forEach(button => {
    const buttonValue = button.innerText;
    button.addEventListener('click', () => operation(buttonValue));
});

// Focus the input when the popup loads so keyboard works immediately
window.addEventListener('load', () => {
    if (input && typeof input.focus === 'function') input.focus();
});

// Keyboard support: Enter => evaluate, Backspace => delete, Escape => clear
window.addEventListener('keydown', (e) => {
    if (!input) return;

    const key = e.key;

    if (key === 'Enter') {
        e.preventDefault();
        operation('=');
        return;
    }

    if (key === 'Backspace') {
        e.preventDefault();
        operation('DEL');
        return;
    }

    if (key === 'Escape') {
        e.preventDefault();
        operation('C');
        return;
    }

    // Allow digits, operators, parentheses, dot
    if (/^[0-9+\-*/().]$/.test(key)) {
        e.preventDefault();
        operation(key);
        return;
    }
});