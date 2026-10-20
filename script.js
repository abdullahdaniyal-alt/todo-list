(function(){
  var KEY="taskly-tasks-v2", THEME="taskly-theme";
  var tasks=[], filter="all";
  function load(){try{var d=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(d))tasks=d;}catch(e){tasks=[];}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(tasks));}catch(e){}}

  var $=function(id){return document.getElementById(id);};
  var list=$("list"),input=$("input"),clearBtn=$("clearBtn");

  var CHECK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var TRASH='<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';

  function render(){
    var shown=tasks.filter(function(t){return filter==="all"||(filter==="done"?t.done:!t.done);});
    list.innerHTML="";
    if(!shown.length){
      var msg={all:"No tasks yet. Add your first one above.",active:"You’re all caught up.",done:"No completed tasks yet."}[filter];
      list.innerHTML='<li class="empty">'+msg+'</li>';
    }
    shown.forEach(function(t){
      var li=document.createElement("li");li.className=t.done?"done":"";li.dataset.id=t.id;
      li.innerHTML='<button type="button" class="check" data-a="toggle" aria-label="Toggle complete">'+CHECK+'</button>'
        +'<span class="text" data-a="toggle"></span>'
        +'<button type="button" class="del" data-a="delete" aria-label="Delete task" title="Delete">'+TRASH+'</button>';
      li.querySelector(".text").textContent=t.text;
      list.appendChild(li);
    });
    var total=tasks.length,done=tasks.filter(function(t){return t.done;}).length,left=total-done;
    var pct=total?Math.round(done/total*100):0;
    $("bar").style.width=pct+"%";
    $("pText").textContent=done+" of "+total+" completed";
    $("pPct").textContent=pct+"%";
    $("count").textContent=left+(left===1?" task remaining":" tasks remaining");
    clearBtn.disabled=done===0;
  }

  function addTask(){
    var v=input.value.trim();
    if(!v){input.focus();return;}
    tasks.unshift({id:String(Date.now())+Math.random().toString(36).slice(2,6),text:v,done:false});
    input.value="";save();render();input.focus();
  }

  $("addBtn").addEventListener("click",addTask);
  input.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();addTask();}});

  list.addEventListener("click",function(e){
    var el=e.target.closest("[data-a]");if(!el)return;
    var li=el.closest("li");if(!li)return;
    var id=li.dataset.id;
    if(el.dataset.a==="toggle"){
      tasks.forEach(function(t){if(t.id===id)t.done=!t.done;});
    }else if(el.dataset.a==="delete"){
      tasks=tasks.filter(function(t){return t.id!==id;});
    }
    save();render();
  });

  clearBtn.addEventListener("click",function(){
    tasks=tasks.filter(function(t){return !t.done;});
    save();render();
  });

  $("filters").addEventListener("click",function(e){
    var b=e.target.closest("button[data-f]");if(!b)return;
    filter=b.dataset.f;
    Array.prototype.forEach.call($("filters").children,function(x){x.classList.toggle("active",x===b);});
    render();
  });

  $("themeBtn").addEventListener("click",function(){
    var cur=document.documentElement.getAttribute("data-theme");
    if(!cur)cur=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
    var next=cur==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",next);
    try{localStorage.setItem(THEME,next);}catch(e){}
  });
  try{var th=localStorage.getItem(THEME);if(th)document.documentElement.setAttribute("data-theme",th);}catch(e){}

  $("date").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  load();render();
})();
