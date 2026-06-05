const TELEFONO_LOCAL = "5493874848698"; // Reemplazar por el número real del local
function getExtraValue(o, p, activeRadioNames) {
  if (typeof o.extra === 'object' && o.extra !== null) {
    // Intenta buscar primero por el ID único del producto
    if (o.extra[p.id] !== undefined) return o.extra[p.id];
    
    // Intenta buscar por el nombre de la opción seleccionada (ej: 'Doble (x2)')
    for (let name of activeRadioNames) {
      if (o.extra[name] !== undefined) return o.extra[name];
    }
    return 0;
  }
  return typeof o.extra === 'number' ? o.extra : 0;
}
const MENU = [
    
  {
    id: 1,
    cat: 'Hamburguesas',
    name: 'Hamburguesa',
    desc: 'Elegí la cantidad de carnes y tu variedad favorita.',
    price: 6500, 
    img: 'image/burguer1.png',
    groups: [
      {
        name: 'Cantidad de Carnes',
        type: 'radio',
        req: true,
        opts: [
          { name: '1 Carne', extra: 0 },
          { name: '2 Carnes', extra: 0 }
        ]
      },
      {
        name: 'Variedad Simple',
        type: 'radio',
        req: true,
        soloPara: ['1 Carne'], // Este grupo completo solo aparece si se elige '1 Carne'
        opts: [
          { name: 'Clásica Simple', extra: 0 },
          { name: 'Bacon Simple', extra: 500 },
          { name: 'Mexicana Simple', extra:500 },
          { name: 'Americana Simple', extra: 0 },
          { name: 'Cheese Onion Simple', extra: 0 },
          { name: 'Cuarto de libra Simple', extra: 1000 }
          
          
        ]
      },
      {
        name: 'Variedad Doble',
        type: 'radio',
        req: true,
        soloPara: ['2 Carnes'], // Este grupo reemplaza al anterior si se elige '2 Carnes'
        opts: [
          { name: 'Clásica Doble', extra: 1000 },
          { name: 'Bacon Doble', extra: 1500 },
          { name: 'Mexicana Doble', extra: 1000 },
          { name: 'Americana Doble', extra: 1500 },
          { name: 'Cuarto de Libra Doble', extra: 3000 },
          { name: 'Q pinta', extra: 2000 },
          { name: 'Mega Bom', extra: 2500 },
        ]
      },
      {
        name: 'Adicionales',
        type: 'radio',
        req: false,
        opts: [
          { name: 'Papas fritas', extra: 2000 },
          { name: 'sin papas', extra: 0 }
        ]
      }
    ]
  }
,

   
  {
    id: 2,
    cat: 'sandwiches',
    name: 'Sandwiches',
    desc: 'Elija una opcion y luego su variedad ',
    price: 7000, 
    img: 'image/sandwich.png',
    groups: [
      {
        name: '',
        type: 'radio',
        req: true,
        opts: [
          { name: 'Lomito', extra: 0 },
          { name: 'Milanesa', extra: 0 }
        ]
      },
      {
        name: 'Variedad Milanesa',
        type: 'radio',
        req: true,
        soloPara: ['Milanesa'], // Este grupo completo solo aparece si se elige '1 Carne'
        opts: [
          { name: 'Mila Completo', extra: 0 },
          { name: 'Mila Cheddar', extra: 1000 },
          { name: 'Napolitano', extra:1000 },
            
        ]
      },
      {
        name: 'Variedad Lomito',
        type: 'radio',
        req: true,
        soloPara: ['Lomito'], // Este grupo reemplaza al anterior si se elige '2 Carnes'
        opts: [
          { name: 'Lomo Completo', extra: 500 },
          { name: 'Lomo cheddar', extra: 1500 },
        ]
      },
      {
        name: 'Adicionales',
        type: 'radio',
        req: false,
        opts: [
          { name: 'Papas fritas', extra: 2000 },
          { name: 'sin papas', extra: 0 }
        ]
      }
    ]
  }
  ,
  
  {id:4,cat:'Pizzas',name:'Pizza Muzzarella',desc:'Salsa de tomate, muzzarella y aceitunas',price:9000.00,img:'image/pizza.png',
    groups:[
      {name:'tipos',type:'radio',req:false,opts:[
        {name:'mozzarella',extra:0.00},{name:'napolitana',extra:500.00},{name:'fugazzeta',extra:500.00},
        {name:'Turca',extra:500.00}, {name:'especial',extra:1000.00},{name:'Calabreza',extra:500.00}
        , {name:'Cheddar con Ppas',extra:1000.00},{name:'Argenta',extra:1500.00},{name:'Q pinta',extra:3500.00}
      ]},
    ]
  },
  
  {id:5,cat:'Empanadas',name:'Empanadas (x12)',desc:'Relleno a elección, horneadas',price:8000.00,img:'image/empanada.png',
    groups:[
      {name:'Relleno',type:'radio',req:true,opts:[
        {name:'Carne cortada a cuchillo',extra:0},
      ]},
      {name:'Cocción',type:'radio',req:true,opts:[
        {name:'Horneadas',extra:0},{name:'Fritas',extra:0}
      ]}
    ]
  }
];
 

let cart = [];
let currentProd = null;
let currentSelections = {};
let currentQty = 1;
let currentCat = 'Todos';
let searchTerm = '';

function renderMenu(){
  const grid = document.getElementById('menu-grid');
  if(!grid) return;
  const filtered = MENU.filter(p=>{
    const catOk = currentCat==='Todos'||p.cat===currentCat;
    const srchOk = !searchTerm||p.name.toLowerCase().includes(searchTerm)||p.desc.toLowerCase().includes(searchTerm);
    return catOk&&srchOk;
  });
  grid.innerHTML = filtered.map(p=>`
    <div class="menu-card" onclick="openProd(${p.id})">
      <div class="card-img-wrap">
  <img src="${p.img}" alt="${p.name}" loading="lazy">
</div>

      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <span class="card-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn">Agregar</button>
        </div>
        <span class="view-link">Ver detalles</span>
      </div>
    </div>
  `).join('');
}

function filterCat(cat, btn){
  currentCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.getElementById('section-lbl').textContent = cat==='Todos'?'Menú Especial "Qpinta"':cat;
  renderMenu();
}

function filterMenu(){
  searchTerm = document.getElementById('search-inp').value.toLowerCase();
  renderMenu();
}

function openProd(id){
  currentProd = MENU.find(p=>p.id===id);
  currentSelections = {};
  currentQty = 1;
  currentProd.groups.forEach((g,gi)=>{
    if(g.type==='radio') currentSelections[gi]=0;
    else currentSelections[gi]=[];
  });
  document.getElementById('mod-title').textContent = 'Personalizar "'+currentProd.name+'"';
  renderModal();
  document.getElementById('prod-overlay').classList.add('open');
  updateTotal();
}
function renderModal(){
  const p = currentProd;
  let html = `
    <div class="modal-product">
      <div class="modal-img-wrap">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="modal-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p class="base-price">Precio base: $${p.price.toFixed(2)}</p>
      </div>
    </div>
    <div class="qty-row">
      <span style="font-size:14px;font-weight:600;color:var(--muted);margin-right:4px">Cantidad:</span>
      <button class="qty-btn" onclick="changeQty(-1)">−</button>
      <span class="qty-val" id="qty-display">${currentQty}</span>
      <button class="qty-btn" onclick="changeQty(1)">+</button>
    </div>
  `;

  // Detecta el botón de tipo radio activo del grupo raíz (el que no depende de nada)
  const activeRadioNames = [];
  p.groups.forEach((g, gi) => {
    if (g.type === 'radio' && !g.soloPara && currentSelections[gi] !== undefined) {
      const selectedOpt = g.opts[currentSelections[gi]];
      if (selectedOpt) activeRadioNames.push(selectedOpt.name);
    }
  });

  p.groups.forEach((g, gi) => {
    // Si el grupo está condicionado y no coincide con la cantidad de carnes elegida, se oculta por completo
    if (g.soloPara && !g.soloPara.some(name => activeRadioNames.includes(name))) {
      return; 
    }

    const badge = g.req ? '<span>Requerido</span>' : '';
    html += `<div class="opt-group">
      <div class="opt-group-title"> ${g.name} ${badge}</div>`;
    
    g.opts.forEach((o, oi) => {
      const sel = g.type === 'radio' ? currentSelections[gi] === oi : currentSelections[gi].includes(oi);
      const cls = (g.type === 'remove' ? 'opt-item remove-item' : 'opt-item') + (sel ? ' selected' : '');
      const ctrl = g.type === 'radio' ?
        `<div class="opt-radio"><div class="opt-radio-inner"></div></div>` :
        `<div class="opt-check">${sel ? '✓' : ''}</div>`;
      
      // Se eliminó la variable del precio extra para que no figure en la interfaz
      html += `<div class="${cls}" onclick="selectOpt(${gi},${oi})">
        <div class="opt-item-left">${ctrl}<span class="opt-name">${o.name}</span></div>
      </div>`;
    });
    html += '</div>';
  });

  html += `<div class="opt-group">
    <div class="opt-group-title">Notas especiales</div>
    <textarea class="notes-area" id="prod-notes" rows="2" placeholder="Ej: sin sal, bien cocido, alergia a..."></textarea>
  </div>`;
  document.getElementById('mod-body').innerHTML = html;
}

function changeQty(d){
  currentQty = Math.max(1,currentQty+d);
  document.getElementById('qty-display').textContent = currentQty;
  updateTotal();
}

function selectOpt(gi, oi){
  const g = currentProd.groups[gi];
  if(g.type === 'radio'){
    currentSelections[gi] = oi;

    const activeRadioNames = [];
    currentProd.groups.forEach((group, gIdx) => {
      if (group.type === 'radio' && !group.soloPara && currentSelections[gIdx] !== undefined) {
        const selectedOpt = group.opts[currentSelections[gIdx]];
        if (selectedOpt) activeRadioNames.push(selectedOpt.name);
      }
    });

    // Resetea las elecciones de los menús que quedaron fuera de la vista
    currentProd.groups.forEach((group, gIdx) => {
      if (group.soloPara && !group.soloPara.some(name => activeRadioNames.includes(name))) {
        if (group.type === 'radio') {
          currentSelections[gIdx] = undefined;
        } else {
          currentSelections[gIdx] = [];
        }
      }
    });

  } else {
    const arr = currentSelections[gi];
    const idx = arr.indexOf(oi);
    if(idx >= 0) arr.splice(idx, 1); else arr.push(oi);
  }
  renderModal();
  updateTotal();
}

function calcItemTotal(){
  if(!currentProd) return 0;
  let t = currentProd.price;
  
  const activeRadioNames = [];
  currentProd.groups.forEach((g, gi) => {
    if (g.type === 'radio' && !g.soloPara && currentSelections[gi] !== undefined) {
      const selectedOpt = g.opts[currentSelections[gi]];
      if (selectedOpt) activeRadioNames.push(selectedOpt.name);
    }
  });

  currentProd.groups.forEach((g, gi) => {
    // Si el grupo no pertenece a la cantidad de carnes activa, no se suma al dinero total
    if (g.soloPara && !g.soloPara.some(name => activeRadioNames.includes(name))) {
      return;
    }

    if(g.type === 'radio'){
      const o = g.opts[currentSelections[gi]];
      if (o) t += o.extra;
    } else {
      if (currentSelections[gi]) {
        currentSelections[gi].forEach(oi => {
          const o = g.opts[oi];
          if (o) t += o.extra;
        });
      }
    }
  });
  return t * currentQty;
}

function updateTotal(){
  document.getElementById('mod-total').textContent = '$'+calcItemTotal().toFixed(2);
}

function closeProd(e){
  if(e.target===document.getElementById('prod-overlay')) closeProdForce();
}
function closeProdForce(){
  document.getElementById('prod-overlay').classList.remove('open');
}

function addToCart(){
  const p = currentProd;
  const notes = document.getElementById('prod-notes')?.value||'';
  const opts = [];
  p.groups.forEach((g,gi)=>{
    if(g.type==='radio'){
      if(g.opts[currentSelections[gi]]) {
        opts.push(g.name+': '+g.opts[currentSelections[gi]].name);
      }
    } else {
      if(currentSelections[gi].length>0){
        opts.push(g.name+': '+currentSelections[gi].map(i=>g.opts[i].name).join(', '));
      }
    }
  });
  cart.push({
    id:Date.now(),name:p.name,emoji:p.emoji,qty:currentQty,
    unitPrice:calcItemTotal()/currentQty,
    total:calcItemTotal(),opts,notes
  });
  updateCartCount();
  closeProdForce();
  showToast('Producto agregado al carrito 🛒');
}

function updateCartCount(){
  const total = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').textContent = total;
}

function showToast(msg){
  const t = document.createElement('div');
  t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--navy);color:#fff;padding:10px 20px;border-radius:50px;font-family:Nunito,sans-serif;font-size:14px;font-weight:600;z-index:999;animation:fadeIn .3s';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2500);
}

function openCart(){
  renderCart();
  document.getElementById('cart-overlay').classList.add('open');
}
function closeCart(){document.getElementById('cart-overlay').classList.remove('open')}
function closeCartEv(e){if(e.target===document.getElementById('cart-overlay'))closeCart()}

function renderCart(){
  const body = document.getElementById('cart-body');
  if(cart.length===0){
    body.innerHTML='<div class="empty-cart"><div class="big">🛒</div><p>Tu carrito está vacío</p></div>';
    return;
  }
  const grandTotal = cart.reduce((s,i)=>s+i.total,0);
  let html = cart.map(item=>`
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.emoji} ${item.name} x${item.qty}</div>
        <div class="cart-item-opts">${item.opts.join(' · ')}</div>
        ${item.notes?`<div class="cart-item-opts" style="font-style:italic">📝 ${item.notes}</div>`:''}
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="cart-item-price">$${item.total.toFixed(2)}</span>
        <button class="del-btn" onclick="removeItem(${item.id})">Eliminar</button>
      </div>
    </div>
  `).join('');
  html += `<div class="total-row"><span>Total del pedido</span><span>$${grandTotal.toFixed(2)}</span></div>`;
  
  // Se eliminó la fila del input del teléfono para limpiar la interfaz
  html += `<button class="pdf-btn" onclick="generatePDF()">Descargar resumen PDF</button>`;
  html += `<button class="wpp-btn" onclick="sendWhatsApp()">Enviar pedido por WhatsApp</button>`;
  body.innerHTML = html;
}

function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  updateCartCount();
  renderCart();
}

function buildPedidoText(){
  const grandTotal = cart.reduce((s,i)=>s+i.total,0);
  let msg = '🍔 *PEDIDO QPINTA*\n─────────────────\n';
  cart.forEach((item,idx)=>{
    msg += `*${idx+1}. ${item.name}* x${item.qty}\n`;
    item.opts.forEach(o=>{ msg += `   • ${o}\n`; });
    if(item.notes) msg += `   📝 ${item.notes}\n`;
    msg += `   Subtotal: $${item.total.toFixed(2)}\n\n`;
  });
  msg += '─────────────────\n';
  msg += `💰 *TOTAL: $${grandTotal.toFixed(2)}*\n\n_Pedido generado desde Qpinta Menu_`;
  return msg;
}

function sendWhatsApp(){
  if(cart.length===0){alert('El carrito está vacío');return;}
  const msg = buildPedidoText();
  window.open('https://wa.me/'+TELEFONO_LOCAL+'?text='+encodeURIComponent(msg),'_blank');
}

function generatePDF(){
  if(cart.length===0){alert('El carrito está vacío');return;}
  const grandTotal = cart.reduce((s,i)=>s+i.total,0);
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR');
  const hora = now.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
  
  // Se cambia a concatenación clásica para evitar falsos positivos con Live Server
  let htmlCode = "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
  "<style>" +
    "body{font-family:Arial,sans-serif;padding:40px;color:#1a2a5e;max-width:600px;margin:0 auto}" +
    ".logo{font-size:28px;font-weight:900;color:#1a2a5e;margin-bottom:4px}" +
    ".sub{color:#6b7db3;font-size:13px;margin-bottom:24px}" +
    ".divider{border-top:2px solid #e8b84b;margin:16px 0}" +
    ".item{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #d0d8f0}" +
    ".item-name{font-weight:700;font-size:16px}" +
    ".item-opt{font-size:13px;color:#6b7db3;margin-top:3px}" +
    ".item-price{font-weight:700;color:#243580;margin-top:6px}" +
    ".total{font-size:22px;font-weight:900;color:#1a2a5e;padding:16px 0}" +
    ".footer{font-size:11px;color:#6b7db3;margin-top:24px;text-align:center}" +
  "</style></head><body>" +
  "<div class='logo'>🍔 Qpinta</div>" +
  "<div class='sub'>Resumen de pedido · " + fecha + " " + hora + "</div>" +
  "<div class='divider'></div>";
  
  cart.forEach((item,i)=>{
    htmlCode += "<div class='item'>" +
      "<div class='item-name'>" + (i+1) + ". " + item.emoji + " " + item.name + " (x" + item.qty + ")</div>";
      
    item.opts.forEach(o => {
      htmlCode += "<div class='item-opt'>• " + o + "</div>";
    });
    
    if(item.notes){
      htmlCode += "<div class='item-opt' style='font-style:italic'>📝 " + item.notes + "</div>";
    }
    
    htmlCode += "<div class='item-price'>Subtotal: $" + item.total.toFixed(2) + "</div>" +
    "</div>";
  });
  
  htmlCode += "<div class='divider'></div>" +
  "<div class='total'>💰 TOTAL: $" + grandTotal.toFixed(2) + "</div>" +
  "<div class='footer'>Pedido generado en Qpinta · " + fecha + "</div>" +
  "</body></html>";
  
  const blob = new Blob([htmlCode],{type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='pedido-qpinta.html'; a.click();
  URL.revokeObjectURL(url);
  showToast('Resumen descargado ✅');
}

renderMenu();
