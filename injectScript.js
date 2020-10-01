let navBar;
let doc;
let i = 0;
let reader;
let pageNodes;
let observer = new MutationObserver(main);
const config = { attributes: true, childList: true, subtree: true };
let button;





function constructButton() {
    navBar = document.querySelector("body > div.MuiDialog-root.reader-track > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div > div > header.MuiPaper-root.MuiAppBar-root.MuiAppBar-positionAbsolute.MuiAppBar-colorInherit.MuiPaper-elevation4 > div");

    button = document.createElement('button');
    button.setAttribute('class', 'dl-button');
    button.value = 'Download';
    button.innerText = "Download"
    button.onclick = buttonClicked;
    let buttonDiv = document.createElement('div');
    buttonDiv.className = 'MuiButtonBase-root';
    buttonDiv.appendChild(button);
    navBar.insertBefore(buttonDiv, navBar.children[2]);


}

function buttonClicked() {
    let = script = document.createElement('script');
    document.body.appendChild(script);
    
    script.onload = function(){
        setTimeout(()=>
        {
            
            reader = document.querySelector("body > div.MuiDialog-root.reader-track > div.MuiDialog-container.MuiDialog-scrollPaper > div > div > div > div > main");
            pageNodes = reader.querySelector("div").children;
            reader.scroll(0,0);
            main();
            randomScroll();
        },1000);
      

    };
    script.src = 'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js';

   
}


function main() {

    let imgElement = pageNodes[i].querySelector("div.MuiPaper-root > div > img");
    if (imgElement === null) {
        pageNodes[i].scrollIntoView(true);
        observer.observe(pageNodes[i], config);
        return;
    }
    observer.disconnect();
    let url = imgElement.src;
    if(i===0){
        doc = jspdf.jsPDF('p','px',[imgElement.naturalWidth,imgElement.naturalHeight]);
    }
    let imgProp = doc.getImageProperties(url);
    doc.addImage(imgProp.data, 'JPEG', 0, 0,imgProp.width,imgProp.height);
    console.log(imgElement.naturalWidth,imgElement.naturalHeight)
    button.innerText = (i+1)+'/'+pageNodes.length;
    console.log(url);
    console.log(i);
    i++;
    if (i >= pageNodes.length-1) {
        setTimeout(()=>{
            i=0;
        },5000);
        let titleElement = document.querySelector("head > title");
        doc.save(titleElement.innerText);
        button.innerText = 'Download';
        return;
    }
    doc.addPage();
    main();
}

function randomScroll() {
    let scrollLen = -window.innerHeight;
    reader.scrollBy(0, scrollLen);
    if (i < pageNodes.length - 1) {
        setTimeout(() => { randomScroll() }, 3000);
    }
}

constructButton();