window.onload = () => {
    let script1 = document.createElement('script');
    script1.src = chrome.runtime.getURL('injectScript.js')
    document.head.appendChild(script1);
    let script2 = document.createElement('script');
    script2.src = chrome.runtime.getURL('./lib/jspdf.umd.min.js');
    document.head.appendChild(script2);
}