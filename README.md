Calculator Extension
=====================

This is a small Chrome extension that provides a calculator popup. It includes a simple grid-based UI, keyboard support (Enter, Backspace, Escape, digits/operators), and a safe arithmetic evaluator (no eval).

Files of interest
- `index.html` — popup UI
- `styles.css` — styling
- `script.js` — logic, keyboard handling, arithmetic evaluator
- `manifest.json` — Chrome extension manifest (Manifest V3)

Quick local test (Load unpacked)
1. Open Chrome and navigate to: `chrome://extensions`.
2. Enable "Developer mode" (toggle top-right).
3. Click "Load unpacked" and select this project directory.
4. The extension should appear in your toolbar. Click the icon to open the popup.

Basic functionality to test
- Click number/operator buttons and `=` to evaluate.
- Keyboard: Enter evaluates, Backspace deletes last char, Escape clears. Typing digits/operators also works.
- `C` clears, `DEL` deletes last character.


