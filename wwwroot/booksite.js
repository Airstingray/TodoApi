

// function setBookmarked(){
//   array = sessionStorage.getItem("bookmarked")
//   newBookmarked = [];
//   array.forEach(item => {
//     newBookmarked.push(item);
//   });
//   alert(newBookmarked)
//   return newBookmarked;
// }

let bookmarkedNovel = [];
let novels = [];




function selectNewNovel(num){
 sessionStorage.setItem("currentNovel", num);
}

function selectNewChapter(num){
  currentChapt = sessionStorage.getItem("currentChapter");
  if(num > -1){
    sessionStorage.setItem("currentChapter", num);
  }else if(num == -1){
     previousChapt = parseInt(currentChapt)+1;
     sessionStorage.setItem("currentChapter", previousChapt);
  }else if(num == -2){
     nextChapt = parseInt(currentChapt)-1;
     sessionStorage.setItem("currentChapter", nextChapt);
  }
  
  updateArrowButtons();
  renderUser2();
}


async function fetchUser(){
    let url = '/novels.json';
    

    try{
      let response = await fetch(url);
      if(response.status == 200){
          response.json().then(json => {
            //console.log(JSON.parse(json[2].json));
            novelsFromJson = JSON.parse(json[2].json);
            
            //console.log(novelsFromJson[0])
            for(i=0;i<6;i++){
              novels.push(novelsFromJson[i]);
            }
            
          });
          
          
        
        return await response.json();
      } else{
        console.log(response.status);
        window.location = 'https://airstingray.github.io/bad.html'
      }
      
      //TODO
      //Break into the catch, throw an error
    } catch(error){
      console.log('error');
      
    }
    
  }
  
  
  async function renderUser(){
    novels = await fetchUser();
    let selectNovel = sessionStorage.getItem("currentNovel");
    let selectChapter = sessionStorage.getItem("currentChapter");
    let novel = novels[selectNovel];
    let chapterAmount = novel.Chapters.Texts.length;
   
    let desc = document.querySelector('.text');
    let name = document.querySelector('.title');
    let image = document.querySelector('.bookImg');
    let currentChapterTitle = document.querySelector('.currChaptName');

    desc.innerHTML = novel.Description;
    name.innerHTML = novel.Title;
    image.src = novel.CoverIMG;
    
    for (let i = 0; i < 10; i++){
      let nameID = '.ld' + (1+i);
      let chapt = document.querySelector(nameID);
      chapt.innerHTML = "Chapter " + (chapterAmount-i) + ": " + novel.Chapters.Titles[chapterAmount-i-1];    
    }

    currentChapterTitle.innerHTML = novel.Chapters.Titles[chapterAmount-selectChapter-1];
  }

  async function renderUser2(){
    novels = await fetchUser();
    let selectNovel = sessionStorage.getItem("currentNovel");
    let selectChapter = sessionStorage.getItem("currentChapter");
    let novel = novels[selectNovel];
    let chapterAmount = novel.Chapters.Texts.length;
    let chapterNum = chapterAmount-selectChapter;
  
    let currentChapterTitle = document.querySelector('.currChaptName');
    let currentChapterText = document.querySelector('.currChaptText');

    currentChapterTitle.innerHTML = "Chapter "+ chapterNum + ": "+novel.Chapters.Titles[chapterAmount-selectChapter-1];
    currentChapterText.innerHTML = "&emsp;" + novel.Chapters.Texts[chapterAmount-selectChapter-1];
  }
  
  function updateArrowButtons(){
    
  }
  
  renderUser();
  renderUser2();
  updatebookmarkNovelsPage();



  function bookmarkItem(num){
    let alreadyIncludes = bookmarkedNovel.includes(num);
    if(alreadyIncludes == false){
      bookmarkedNovel.push(num);
    }else{
      tempBook =[];
      for(i = 0; i < bookmarkedNovel.length; i++){
         if(bookmarkedNovel[i] != num){
          tempBook.push(bookmarkedNovel[i]);
         }
      }
      bookmarkedNovel = tempBook;
    }
    
    sessionStorage.setItem("bookmarked", bookmarkedNovel);
    console.log(sessionStorage.getItem("bookmarked"));
    
  }

  function updatebookmarkNovelsPage(){
     if(bookmarkedNovel.length > 5){

      for(i=0; i<5; i++){
        
          var x=document.getElementById("bpb" +(1+i));
          x.style.visibility="visible";
        
       }


     }else {


      for(i=0; i<bookmarkedNovel.length; i++){
        path = "bpb" +(1+i);
        console.log(path);
        var x=document.getElementById(path);
        x.style.visibility="visible";
       }
       for(i=bookmarkedNovel.length; i<5; i++){
        path = "bpb" +(1+i);
        console.log(path);
        var x=document.getElementById(path);
        x.style.visibility="hidden";
       }


     }
  }
  //  var x=document.getElementById("bpb1");
  //  x.style.visibility="visible";

  console.log(sessionStorage.getItem("bookmarked"));


  const uri = 'api/todoitems';
  let todos = [];
  
  function getItems() {
    fetch(uri)
      .then(response => response.json())
      .then(data => _displayItems(data))
      .catch(error => console.error('Unable to get items.', error));
  }
  
  function addItem() {
    const addNameTextbox = document.getElementById('add-name');
  
    const item = {
      isComplete: false,
      name: addNameTextbox.value.trim()
    };
  
    fetch(uri, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => response.json())
      .then(() => {
        getItems();
        addNameTextbox.value = '';
      })
      .catch(error => console.error('Unable to add item.', error));
  }
  
  function deleteItem(id) {
    fetch(`${uri}/${id}`, {
      method: 'DELETE'
    })
    .then(() => getItems())
    .catch(error => console.error('Unable to delete item.', error));
  }
  
  function displayEditForm(id) {
    const item = todos.find(item => item.id === id);
    
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
  }
  
  function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
      id: parseInt(itemId, 10),
      isComplete: document.getElementById('edit-isComplete').checked,
      name: document.getElementById('edit-name').value.trim()
    };
  
    fetch(`${uri}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    .then(() => getItems())
    .catch(error => console.error('Unable to update item.', error));
  
    closeInput();
  
    return false;
  }
  
  function closeInput() {
    document.getElementById('editForm').style.display = 'none';
  }
  
  function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';
  
    document.getElementById('counter').innerText = `${itemCount} ${name}`;
  }
  
  function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';
  
    _displayCount(data.length);
  
    const button = document.createElement('button');
  
    data.forEach(item => {
      let isCompleteCheckbox = document.createElement('input');
      isCompleteCheckbox.type = 'checkbox';
      isCompleteCheckbox.disabled = true;
      isCompleteCheckbox.checked = item.isComplete;
  
      let editButton = button.cloneNode(false);
      editButton.innerText = 'Edit';
      editButton.setAttribute('onclick', `displayEditForm(${item.id})`);
  
      let deleteButton = button.cloneNode(false);
      deleteButton.innerText = 'Delete';
      deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
  
      let tr = tBody.insertRow();
      
      let td1 = tr.insertCell(0);
      td1.appendChild(isCompleteCheckbox);
  
      let td2 = tr.insertCell(1);
      let textNode = document.createTextNode(item.name);
      td2.appendChild(textNode);
  
      let td3 = tr.insertCell(2);
      td3.appendChild(editButton);
  
      let td4 = tr.insertCell(3);
      td4.appendChild(deleteButton);
    });
  
    todos = data;
  }

  function addItem() {
    const addNameTextbox = document.getElementById('add-name');
  
    const item = {
      isComplete: false,
      name: addNameTextbox.value.trim()
    };
  
    fetch(uri, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => response.json())
      .then(() => {
        getItems();
        addNameTextbox.value = '';
      })
      .catch(error => console.error('Unable to add item.', error));
  }
