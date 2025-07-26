import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// restrict the inspect element
// document.onkeydown = function (e) {
//   if (
//     // F12 key (all platforms)
//     e.keyCode === 123 || e.key === "F12" ||
    
//     // Windows/Linux shortcuts
//     (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
//     (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
//     (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
//     (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
    
//     // macOS shortcuts (Cmd key combinations)
//     (e.metaKey && e.altKey && e.keyCode === 73) || // Cmd+Opt+I
//     (e.metaKey && e.altKey && e.keyCode === 74) || // Cmd+Opt+J  
//     (e.metaKey && e.altKey && e.keyCode === 67) || // Cmd+Opt+C
//     (e.metaKey && e.shiftKey && e.keyCode === 73) || // Cmd+Shift+I
//     (e.metaKey && e.shiftKey && e.keyCode === 67) || // Cmd+Shift+C
//     (e.metaKey && e.shiftKey && e.keyCode === 74) || // Cmd+Shift+J
//     (e.metaKey && e.keyCode === 85) || // Cmd+U (view source)
    
//     // Alternative key detection (string-based)
//     (e.metaKey && e.altKey && e.key === "i") ||
//     (e.metaKey && e.altKey && e.key === "I") ||
//     (e.metaKey && e.altKey && e.key === "j") ||
//     (e.metaKey && e.altKey && e.key === "J") ||
//     (e.metaKey && e.altKey && e.key === "c") ||
//     (e.metaKey && e.altKey && e.key === "C") ||
//     (e.metaKey && e.shiftKey && e.key === "i") ||
//     (e.metaKey && e.shiftKey && e.key === "I") ||
//     (e.metaKey && e.shiftKey && e.key === "c") ||
//     (e.metaKey && e.shiftKey && e.key === "C") ||
//     (e.metaKey && e.shiftKey && e.key === "j") ||
//     (e.metaKey && e.shiftKey && e.key === "J") ||
    
//     // Additional security shortcuts
//     (e.ctrlKey && e.keyCode === 83) || // Ctrl+S (save page)
//     (e.metaKey && e.keyCode === 83) || // Cmd+S (save page)
//     (e.ctrlKey && e.keyCode === 80) || // Ctrl+P (print)
//     (e.metaKey && e.keyCode === 80) // Cmd+P (print)
//   ) {
//     e.preventDefault();
//     e.stopPropagation();
//     alert("Security Alert: This action is blocked for your protection");
//     return false;
//   }
// };

document.addEventListener('contextmenu', event => event.preventDefault());

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

