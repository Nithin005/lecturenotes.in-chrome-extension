let doc;
let i;
let reader;
let pageNodes;
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
const observer = new MutationObserver(main);
const config = { attributes: true, childList: true, subtree: true };

// A helper to listen for params change
(function (history) {
    var pushState = history.pushState;
    history.pushState = function (state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({ state: state });
        }
        return pushState.apply(history, arguments);
    };
})(window.history);


function constructButton() {
    const { search } = window.location;
    let insterted = false;

    if (!insterted) {
        insterted = true;
        const dom = document.querySelector('body');
        const button = document.createElement('button');
        button.setAttribute('class', 'dl-button');
        button.innerHTML = `
        <span class="MuiButton-startIcon MuiButton-iconSizeMedium"><svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm12 6V9c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1zm-2-3h1v3h-1V9zm4 2h1v-1h-1V9h1V8h-2v5h1zm-8 0h1c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9v5h1v-2zm0-2h1v1h-1V9z"></path></svg></span>
        <div>Download PDF</div>
        `;
        button.onclick = buttonClicked;
        dom.appendChild(button);
    }

    if (search !== '?reading=true') {
        document.querySelector('.dl-button').style.display = 'flex';
    } else {
        document.querySelector('.dl-button').style.display = 'none';
    }
}

function buttonClicked() {
    const button = document.querySelector('.dl-button');
    i = 0;

    button.innerText = 'Loading please wait...';
    setTimeout(() => {
        reader = document.querySelector("main");
        pageNodes = reader.querySelector("div").children;
        reader.scroll(0, 0);
        main();
        randomScroll();
    }, 1000);
}


function main() {
    let imgElement = pageNodes[i].querySelector("div.MuiPaper-root > div > img");
    const button = document.querySelector('.dl-button');
    if (imgElement === null) {
        pageNodes[i].scrollIntoView(true);
        observer.observe(pageNodes[i], config);
        return;
    }
    observer.disconnect();
    let url = imgElement.src;
    if (i === 0) {
        doc = jspdf.jsPDF('p', 'px', [imgElement.naturalWidth, imgElement.naturalHeight]);
    }
    let imgProp = doc.getImageProperties(url);
    doc.addImage(imgProp.data, 'JPEG', 0, 0, imgProp.width, imgProp.height);
    button.innerText = `${i + 1} page loaded out of ${pageNodes.length - 1}`;
    i++;
    if (i >= pageNodes.length - 1) {
        let titleElement = document.querySelector("head > title");
        doc.save(titleElement.innerText);
        button.innerText = 'Download';
        return;
    }
    doc.addPage();
    main();
}

function randomScroll() {
    const button = document.querySelector('.dl-button');
    const handler = setInterval(() => {
        let scrollLen = -window.innerHeight;
        reader.scrollBy(0, scrollLen);
        if (i === (pageNodes.length - 1)) {
            clearInterval(handler);
            button.innerHTML = `
            <div class="plugin-flex">
                <div class="check"></div>
                <div style="margin-left:9px">Downloaded</div>
            </div>
            `
        }
    }, 1000)
}

window.onpopstate = history.onpushstate = () => {
    constructButton();
};
