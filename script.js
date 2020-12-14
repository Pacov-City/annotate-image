window.addEventListener("load", () => {
  let fileSel = document.getElementById("select-files");
  let fileListElm = document.getElementById("list");

  fileSel.addEventListener("change", () => {
    initData();
  });

  let files = {};
  let data = {};
  let selected = null;
  let selectedIdx = -1;
  let sortedNames = null;
  function initData() {
    // from file selector
    for (let idx = 0; idx < fileSel.files.length; idx++) {
      let item = fileSel.files.item(idx);
      files[item.name] = {
        file: item,
      };
    }
    // from local storage
    load()

    for (let key of Object.keys(files)) {
      if (!data[key]) {
        data[key] = {
          name: key,
        };
      }
    }
    store()
    
    sortedNames = Object.keys(data);
    sortedNames.sort((a, b) => (a > b ? 1 : a === b ? 0 : -1));

    document.getElementById("btnNext")
    .addEventListener("click", () => next());
    
    document.getElementById("btnPrev")
    .addEventListener("click", () => prev());
 
    document.getElementById("btnFromPrev")
    .addEventListener("click", () => fromPrev());
    
    document.getElementById("txtName")
    .addEventListener("change", () => updateData());

    document.getElementById("txtOrder")
    .addEventListener("change", () => updateData());

    document.getElementById("txtDate")
    .addEventListener("change", () => updateData());

    document.getElementById("txtSummary")
    .addEventListener("change", () => updateData());


    populateList();
  }

  function id(name) {
    return `li-${name}`;
  }

  function populateList() {
    fileListElm.innerHTML = "";
    console.log(`sortdNames.length: ${sortedNames.length}`)
    const names = sortedNames;
    let docIdx=0
    let lastName=""
    for (let idx = 0; idx < names.length; idx++) {
      if (lastName!==data[names[idx]].name){
          docIdx++
          lastName=data[names[idx]].name
      }
      let li = document.createElement("li");
      li.classList.add("list-item");
      if ( selected === names[idx]){
        li.classList.add("selected");
      }
      li.innerHTML=`
      <div class="hbox ${docIdx%2==0?'bg1':'bg2'}">
        <div class="pad">${files[names[idx]]?'🖼️':"❌"}</div>
        <div class="pad">${docIdx}</div>
        <div class="vbox pad ">
          <div class="">${data[names[idx]].name}</div>
          <div class="small">${names[idx]} ${data[names[idx]].order||""} ${data[names[idx]].date||""}</div>
        </div>
      </div>
      `
      //li.textContent = `${idx} ${names[idx]} ${files[names[idx]]?'🖼️':""}`;
      li.id = id(names[idx]);
      li.dataset.name = names[idx];
      li.dataset.idx = idx;
      fileListElm.appendChild(li);
      li.addEventListener("click", (ev) => {
        let name = li.dataset.name
        let idx = Number(li.dataset.idx)
        setSelected(name, idx);
      });
    }
  }

  function setSelected(name, idx) {
    console.log(`selected ${idx} ${name}`)
    if (selected) {
      document.getElementById(id(selected)).classList.remove("selected");
    }
    selected = name;
    selectedIdx = idx;
    const newSelected = document.getElementById(id(selected));
    newSelected.classList.add("selected");
    document.getElementById("txtName").focus();
    document.getElementById("name").textContent=name

    let d=data[name]
    console.log(d)
    document.getElementById("txtName").value = d.name
    document.getElementById("txtOrder").value = d.order
    document.getElementById("txtSummary").value = d.summary||""
    document.getElementById("txtDate").value = d.date

    if (files[name]){
        let f = files[name].file
        let rd = new FileReader()
        rd.addEventListener("loadend",()=>{
            document.getElementById("display").src=rd.result
        })
        rd.readAsDataURL(f)    
    }
}

  function next() {
    if (!selected) return
    let newIdx = selectedIdx + 1
    if (newIdx>sortedNames.length) {
        newIdx=0;
    }
    console.log(`newIdx: ${newIdx}`)
    setSelected(sortedNames[newIdx], newIdx);
  }

  function prev() {
    if (!selected) return
    let newIdx = selectedIdx - 1 
    if (newIdx<0){
        newIdx=sortedNames.length
    }
    console.log(`newIdx: ${newIdx}`)
    setSelected(sortedNames[newIdx], newIdx);
  }

  function updateData(){
    if (!selected) return
    let d = data[selected]
    d.name = document.getElementById("txtName").value
    d.order = document.getElementById("txtOrder").value
    d.summary = document.getElementById("txtSummary").value
    d.date = document.getElementById("txtDate").value
    store()
    populateList()
  }

  function store(){
      console.log("storing")
      localStorage["data"]=JSON.stringify(data)
  }

  function load(){
    console.log("loading")
    data = JSON.parse(localStorage["data"] || "{}");
  }

  function fromPrev(){
      if (!selected) return;
      if (selectedIdx<=0) return;
      let prevName=sortedNames[selectedIdx-1]
      let nameElm=document.getElementById("txtName")
      nameElm.value=data[prevName].name
      nameElm.dispatchEvent(new Event('change'))
  }

});
