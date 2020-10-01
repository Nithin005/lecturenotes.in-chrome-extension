window.onload = () => {
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL('injectScript.js')
    document.head.appendChild(script);
}