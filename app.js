const KEY="mi-cocina-products-v1";
const seed=[
{id:1,name:"Arroz",qty:5,unit:"kg",category:"Granos",min:2,location:"Despensa",expiry:"2026-11-30"},
{id:2,name:"Leche",qty:2,unit:"L",category:"Lácteos",min:1,location:"Nevera",expiry:"2026-10-02"},
{id:3,name:"Huevos",qty:6,unit:"un.",category:"Lácteos",min:6,location:"Nevera",expiry:"2026-10-05"},
{id:4,name:"Aceite",qty:0.5,unit:"L",category:"Condimentos",min:1,location:"Despensa",expiry:"2027-03-10"},
{id:5,name:"Tomate",qty:2,unit:"kg",category:"Verduras",min:1,location:"Nevera",expiry:"2026-09-29"}
];
let products=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
function save(){localStorage.setItem(KEY,JSON.stringify(products))}
function daysTo(date){if(!date)return 9999;return Math.ceil((new Date(date+"T23:59:59")-new Date())/86400000)}
function status(p){if(p.qty<=p.min)return ["low","Stock bajo"];if(daysTo(p.expiry)<=3)return ["exp","Por vencer"];return ["ok","OK"]}
function render(){
 const low=products.filter(p=>p.qty<=p.min), exp=products.filter(p=>daysTo(p.expiry)<=7);
 totalProducts.textContent=products.length;lowStock.textContent=low.length;expiring.textContent=exp.length;shoppingCount.textContent=low.length;
 recentList.innerHTML=products.slice(-5).reverse().map(row).join("")||'<div class="empty">No hay productos.</div>';
 alerts.innerHTML=(low.map(p=>`<div class="alert">🟠 <b>${p.name}</b> tiene poco stock (${p.qty} ${p.unit}).</div>`).concat(exp.map(p=>`<div class="alert">⏰ <b>${p.name}</b> vence ${daysTo(p.expiry)<=0?"hoy":"en "+daysTo(p.expiry)+" días"}.</div>`))).join("")||'<div class="empty">Todo está en orden 🎉</div>';
 renderInventory();renderShopping();fillCategories();
}
function row(p){let [c,t]=status(p);return `<div class="product"><div><div class="product-name">${p.name}</div><div class="meta">${p.category} · ${p.location} · ${p.qty} ${p.unit}</div></div><span class="badge ${c==="ok"?"":c}">${t}</span></div>`}
function renderInventory(){
 const q=(search?.value||"").toLowerCase(), cat=categoryFilter?.value||"";
 let list=products.filter(p=>(p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q))&&(!cat||p.category===cat));
 inventoryList.innerHTML=list.map(p=>row(p)+`<div class="product-actions"><button class="secondary" onclick="removeProduct(${p.id})">Eliminar</button></div>`).join("")||'<div class="empty">No encontramos productos.</div>';
}
function renderShopping(){shoppingList.innerHTML=products.filter(p=>p.qty<=p.min).map(p=>`<div class="product"><div><b>🛒 ${p.name}</b><div class="meta">Stock actual: ${p.qty} ${p.unit} · mínimo: ${p.min} ${p.unit}</div></div><span class="badge low">Comprar</span></div>`).join("")||'<div class="empty">Tu lista de compras está vacía 🎉</div>'}
function fillCategories(){let cats=[...new Set(products.map(p=>p.category))];categoryFilter.innerHTML='<option value="">Todas las categorías</option>'+cats.map(c=>`<option>${c}</option>`).join("")}
function removeProduct(id){if(confirm("¿Eliminar este producto?")){products=products.filter(p=>p.id!==id);save();render()}}
function show(view){document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));document.getElementById(view).classList.remove("hidden");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.view===view));pageTitle.textContent={dashboard:"Dashboard",inventory:"Inventario",shopping:"Lista de compras"}[view]}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>show(b.dataset.view));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
addBtn.onclick=()=>modal.classList.remove("hidden");closeModal.onclick=()=>modal.classList.add("hidden");
search?.addEventListener("input",renderInventory);categoryFilter?.addEventListener("change",renderInventory);
clearShopping.onclick=()=>{products=products.filter(p=>p.qty>p.min);save();render()};
productForm.onsubmit=e=>{e.preventDefault();let f=new FormData(productForm);products.push({id:Date.now(),name:f.get("name"),qty:+f.get("qty"),unit:f.get("unit"),category:f.get("category"),min:+f.get("min"),location:f.get("location"),expiry:f.get("expiry")});save();productForm.reset();modal.classList.add("hidden");render();show("inventory")};
render();
