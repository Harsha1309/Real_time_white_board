let optionsCont= document.querySelector(".options-cont");
let toolsCont= document.querySelector(".tools-cont");
let optionsFlag=true;
let pencilToolCont=document.querySelector(".pencil-tool-cont");
let eraserToolCont=document.querySelector(".eraser-tool-cont");
let pencil=document.querySelector(".pencil");
let eraser=document.querySelector(".eraser");
let sticky=document.querySelector(".sticky");
let upload=document.querySelector(".upload");
let pencilFlag=false;
let eraserFlag=false;




optionsCont.addEventListener("click",(e)=>{
    // true -> tools show, false -> hide tools
    optionsFlag= !optionsFlag;

    if(optionsFlag)openTools();
    else closeTools();
})


function openTools(){
    let iconElem= optionsCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display="flex";
}

function closeTools(){
    let iconElem= optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsCont.style.display="none";

    pencilToolCont.style.display="none";
    eraserToolCont.style.display="none";
    
}

pencil.addEventListener("click",(e)=>{
    // true->show pencil tool , false-> hide pencil tool
    pencilFlag = !pencilFlag;
    if (pencilFlag)pencilToolCont.style.display="block";
    else pencilToolCont.style.display="none";
})

eraser.addEventListener("click",(e)=>{
    // true->show eraser tool , false-> hide eraser tool
    eraserFlag = !eraserFlag;
    if (eraserFlag)eraserToolCont.style.display="flex";
    else eraserToolCont.style.display="none";
})

sticky.addEventListener("click",(e)=>{
    
    
    let data=`
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
      </div>
      <div class="note-cont">
        <textarea spellcheck="false" class="textarea"></textarea>
      </div>
    `;
    socket.emit("createSticky1",data);
    // createSticky(stickyTemplateHTML);
    
})

upload.addEventListener("click",(e)=>{
    let input=document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e)=>{
        let file=input.files[0];
        let url=URL.createObjectURL(file);
        let data=`
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
          </div>
          <div class="note-cont">
            <img src="${url}">
          </div>
        `;
        socket.emit("createSticky1",data);
        // createSticky(stickyTemplateHTML);
        
    })
})

function createSticky(stickyTemplateHTML){
    let stickyCont= document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML=stickyTemplateHTML;

    document.body.appendChild(stickyCont);
    let minimize=stickyCont.querySelector(".minimize");
    let remove=stickyCont.querySelector(".remove");
    
    noteActions(minimize,remove,stickyCont);
    stickyCont.onmousedown = function(event) {
       dragAndDrop(stickyCont,event) 
      };
      
      stickyCont.ondragstart = function() {
        return false;
      };
}

function createSticky1(stickyTemplateHTML){
  let stickyCont= document.createElement("div");
  stickyCont.setAttribute("class","sticky-cont");
  stickyCont.innerHTML=stickyTemplateHTML;

  document.body.appendChild(stickyCont);
  let minimize=stickyCont.querySelector(".minimize");
  let remove=stickyCont.querySelector(".remove");
  let textarea=stickyCont.querySelector(".textarea");
  console.log(Math.floor(Date.now()/1000))
  const uniqueId = 'textarea_' + Math.floor(Date.now()/1000);
  console.log(uniqueId)
  textarea.id = uniqueId;
  textarea.addEventListener("input",(e)=>{
    
    let data={
      id:textarea.id,
      content:textarea.value
    }
    socket.emit('textareaContent',data);
  })
  socket.on('updateContent', function(data) {
    if(textarea.id === data.id){
      console.log(textarea.id);
      textarea.value = data.content;
    }
  });
  noteActions(minimize,remove,stickyCont);
  stickyCont.onmousedown = function(event) {
     dragAndDrop(stickyCont,event) 
    };
    
    stickyCont.ondragstart = function() {
      return false;
    };
}

function noteActions(minimize,remove,stickyCont){
    remove.addEventListener("click",(e)=>{
        let data="";
        socket.emit('closeNoteAction',data);
        
    })
    socket.on('closeNoteAction', function(data) {
        stickyCont.remove();
    });
    minimize.addEventListener("click",(e)=>{
        let noteCont=stickyCont.querySelector(".note-cont");
        let display=getComputedStyle(noteCont).getPropertyValue("display");
        if ( display==="none")noteCont.style.display="block";
        else noteCont.style.display="none";
    })
}

function dragAndDrop(element, event){
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
        
      
        moveAt(event.pageX, event.pageY);
      
        // moves the element at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the element on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the element, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
}

socket.on("createSticky",(data)=>{

  createSticky(data);
})
socket.on("createSticky1",(data)=>{
  
  createSticky1(data);
})

