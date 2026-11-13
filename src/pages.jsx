import {useState,useMemo} from 'react'
import {Link,useParams,useSearchParams,useNavigate} from 'react-router-dom'
import {useStore,tk,price,pct} from './store'
export const Stars=({r})=><span className="stars" title={r}>{'★'.repeat(Math.round(r))}{'☆'.repeat(5-Math.round(r))} <small>{r}</small></span>
export function Card({p}){
 const{add,wish,toggleWish}=useStore(),d=pct(p)
 return <div className="card"><Link to={'/product/'+p.id}><img src={p.img} alt={p.name} loading="lazy"/>{d>0&&<span className="tag">-{d}%</span>}{p.type==='digital'&&<span className="tag dg">Digital</span>}</Link>
 <button className={'heart'+(wish.includes(p.id)?' on':'')} aria-label="Wishlist" onClick={()=>toggleWish(p.id)}>♥</button>
 <div className="cb"><Link to={'/product/'+p.id}>{p.name}</Link><Stars r={p.rating}/><div className="pr"><b>{tk(price(p))}</b>{d>0&&<s>{tk(p.price)}</s>}</div>
 <button className="btn sm" disabled={p.stock<1} onClick={()=>add(p.id)}>{p.stock<1?'Out of stock':'Add to cart'}</button></div></div>
}
const Row=({title,items,to})=>items.length>0&&<section><div className="sh"><h2>{title}</h2>{to&&<Link to={to}>See all</Link>}</div><div className="grid">{items.slice(0,4).map(p=><Card key={p.id} p={p}/>)}</div></section>
export function Home(){
 const{products,banners,cats}=useStore(),[i,setI]=useState(0),b=banners[i%banners.length],nav=useNavigate(),[ok,setOk]=useState(false)
 const by=(f)=>[...products].sort(f)
 return <>
 <div className="hero" style={{background:b.c}}><div><h1>{b.t}</h1><p>{b.s}</p><Link className="btn amber" to={b.to}>Shop now</Link></div><div className="dots">{banners.map((_,k)=><button key={k} aria-label={'Banner '+(k+1)} className={k===i%banners.length?'on':''} onClick={()=>setI(k)}/>)}</div></div>
 <section><h2>Shop by category</h2><div className="chips">{cats.map(c=><Link key={c} to={'/shop?cat='+encodeURIComponent(c)}>{c}</Link>)}</div></section>
 <Row title="Featured" items={by((a,b)=>b.rating-a.rating)} to="/shop"/>
 <Row title="New arrivals" items={by((a,b)=>b.id-a.id)} to="/shop"/>
 <Row title="Best selling" items={by((a,b)=>b.sold-a.sold)} to="/shop"/>
 <Row title="Special offers" items={products.filter(p=>pct(p)>0).sort((a,b)=>pct(b)-pct(a))} to="/shop"/>
 <Row title="Digital products" items={products.filter(p=>p.type==='digital')} to="/shop?type=digital"/>
 <Row title="Physical products" items={products.filter(p=>p.type==='physical')} to="/shop?type=physical"/>
 <section className="news"><h2>Get offers by email</h2>{ok?<p>Thanks! (Demo: nothing was sent.)</p>:<form onSubmit={e=>{e.preventDefault();setOk(true)}}><input type="email" required placeholder="Your email"/><button className="btn amber">Subscribe</button></form>}</section></>
}
export function Shop(){
 const{products,cats}=useStore(),[sp,setSp]=useSearchParams(),[more,setMore]=useState(1),[sort,setSort]=useState('new'),[min,setMin]=useState(''),[max,setMax]=useState('')
 const q=sp.get('q')||'',cat=sp.get('cat')||'',type=sp.get('type')||''
 const set=(k,v)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n);setMore(1)}
 const list=useMemo(()=>{let l=products.filter(p=>(!q||p.name.toLowerCase().includes(q.toLowerCase()))&&(!cat||p.cat===cat)&&(!type||p.type===type)&&(!min||price(p)>=+min)&&(!max||price(p)<=+max))
  const s={new:(a,b)=>b.id-a.id,low:(a,b)=>price(a)-price(b),high:(a,b)=>price(b)-price(a),pop:(a,b)=>b.sold-a.sold};return l.sort(s[sort])},[products,q,cat,type,min,max,sort])
 return <><h1>{q?`Results for "${q}"`:cat||(type?type[0].toUpperCase()+type.slice(1)+' products':'All products')}</h1>
 <div className="filters"><input placeholder="Search" value={q} onChange={e=>set('q',e.target.value)}/><select value={cat} onChange={e=>set('cat',e.target.value)}><option value="">All categories</option>{cats.map(c=><option key={c}>{c}</option>)}</select><select value={type} onChange={e=>set('type',e.target.value)}><option value="">All types</option><option value="physical">Physical</option><option value="digital">Digital</option></select>
 <input type="number" placeholder="Min ৳" value={min} onChange={e=>setMin(e.target.value)}/><input type="number" placeholder="Max ৳" value={max} onChange={e=>setMax(e.target.value)}/>
 <select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Newest</option><option value="pop">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
 {list.length?<div className="grid">{list.slice(0,more*8).map(p=><Card key={p.id} p={p}/>)}</div>:<p className="empty">No products match. Try clearing a filter.</p>}
 {list.length>more*8&&<div className="center"><button className="btn" onClick={()=>setMore(more+1)}>Load more</button></div>}</>
}
export function Product(){
 const{id}=useParams(),{products,add,reviews,setReviews,me,wish,toggleWish}=useStore(),nav=useNavigate(),p=products.find(x=>x.id===+id),[q,setQ]=useState(1),[rv,setRv]=useState({r:5,t:''})
 if(!p)return <NotFound/>
 const rs=reviews[p.id]||[],d=pct(p),rel=products.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4)
 return <><div className="pd"><div className="gal"><img src={p.img} alt={p.name}/><div className="thumbs">{[0,1,2].map(k=><img key={k} src={p.img} alt="" style={{opacity:1-k*.25}}/>)}</div></div>
 <div><h1>{p.name}</h1><Stars r={p.rating}/> <small>({rs.length} reviews)</small><div className="pr big"><b>{tk(price(p))}</b>{d>0&&<><s>{tk(p.price)}</s><span className="tag in">-{d}%</span></>}</div>
 <p>{p.desc}</p><p><span className="pill">{p.type==='digital'?'Digital download':'Physical product'}</span> <span className="pill">{p.cat}</span> <span className={'pill '+(p.stock>0?'ok':'bad')}>{p.stock>0?(p.type==='digital'?'Available':p.stock+' in stock'):'Out of stock'}</span></p>
 <div className="qty"><button onClick={()=>setQ(Math.max(1,q-1))}>−</button><span>{q}</span><button onClick={()=>setQ(q+1)}>+</button></div>
 <p><button className="btn" disabled={p.stock<1} onClick={()=>{add(p.id,q);}}>Add to cart</button> <button className="btn amber" disabled={p.stock<1} onClick={()=>{add(p.id,q);nav('/checkout')}}>Buy now</button> <button className="btn ghost" onClick={()=>toggleWish(p.id)}>{wish.includes(p.id)?'Saved ♥':'Save ♡'}</button></p></div></div>
 <section><h2>Reviews</h2>{rs.length?rs.map((r,i)=><div key={i} className="rev"><b>{r.n}</b> <Stars r={r.r}/><p>{r.t}</p></div>):<p className="empty">No reviews yet.</p>}
 {me?<form className="form" onSubmit={e=>{e.preventDefault();setReviews({...reviews,[p.id]:[...rs,{n:me.name,r:+rv.r,t:rv.t}]});setRv({r:5,t:''})}}><select value={rv.r} onChange={e=>setRv({...rv,r:e.target.value})}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} stars</option>)}</select><textarea required placeholder="Write your review" value={rv.t} onChange={e=>setRv({...rv,t:e.target.value})}/><button className="btn sm">Post review</button></form>:<p><Link to="/login">Log in</Link> to write a review.</p>}</section>
 <Row title="Related products" items={rel}/></>
}
export function Cart(){
 const{lines,setQ,subtotal,discount,coupon,setCoupon,checkCoupon}=useStore(),[code,setCode]=useState(''),[msg,setMsg]=useState('')
 if(!lines.length)return <div className="empty"><h1>Your cart is empty</h1><Link className="btn" to="/shop">Browse products</Link></div>
 const apply=()=>{const r=checkCoupon(code);if(r.err)setMsg(r.err);else{setCoupon(r.c);setMsg('Coupon applied')}}
 return <><h1>Cart</h1><div className="two"><div>{lines.map(l=><div className="line" key={l.id}><img src={l.p.img} alt=""/><div><Link to={'/product/'+l.id}>{l.p.name}</Link><br/><b>{tk(price(l.p))}</b></div><div className="qty"><button onClick={()=>setQ(l.id,l.q-1)}>−</button><span>{l.q}</span><button onClick={()=>setQ(l.id,l.q+1)}>+</button></div><button className="x" aria-label="Remove" onClick={()=>setQ(l.id,0)}>✕</button></div>)}</div>
 <aside className="box"><h3>Summary</h3><p className="row">Subtotal <b>{tk(subtotal)}</b></p><p className="row">Discount <b>−{tk(discount)}</b></p><div className="cp"><input placeholder="Coupon code" value={code} onChange={e=>setCode(e.target.value)}/><button className="btn sm" onClick={apply}>Apply</button></div>{msg&&<small>{msg}</small>}{coupon&&<small> · {coupon.code} <a href="#" onClick={e=>{e.preventDefault();setCoupon(null);setMsg('')}}>remove</a></small>}<p className="row tot">Total <b>{tk(subtotal-discount)}</b></p><small>Shipping is calculated at checkout.</small><br/><Link className="btn" to="/checkout">Checkout</Link></aside></div></>
}
export function Checkout(){
 const{lines,subtotal,discount,settings,setCart,setCoupon,coupon,orders,setOrders,me,products,setProducts}=useStore(),nav=useNavigate()
 const[f,setF]=useState({name:me?.name||'',phone:'',email:me?.email||'',address:'',district:'Dhaka',pay:'cod',txn:''}),[err,setErr]=useState('')
 if(!lines.length)return <div className="empty"><h1>Nothing to check out</h1><Link className="btn" to="/shop">Shop</Link></div>
 const physical=lines.some(l=>l.p.type==='physical'),after=subtotal-discount
 const ship=!physical||after>=settings.freeShipAbove?0:(f.district==='Dhaka'?settings.ship.Dhaka:settings.ship.Other),total=after+ship,u=(k,v)=>setF({...f,[k]:v})
 const submit=e=>{e.preventDefault();if(!/^01\d{9}$/.test(f.phone))return setErr('Enter a valid 11-digit mobile number (01XXXXXXXXX).');if(f.pay!=='cod'&&f.txn.trim().length<6)return setErr('Enter the transaction ID for this payment.')
  const id='JH'+Date.now().toString().slice(-7),o={id,date:new Date().toISOString(),cust:{...f,uid:me?.email||null},items:lines.map(l=>({id:l.id,name:l.p.name,type:l.p.type,q:l.q,price:price(l.p)})),subtotal,discount,ship,total,coupon:coupon?.code||null,pay:f.pay,txn:f.txn,payStatus:f.pay==='cod'?'Unpaid':'Pending',status:'Pending',demo:true}
  setOrders([o,...orders]);setProducts(products.map(p=>{const l=lines.find(x=>x.id===p.id);return l&&p.type==='physical'?{...p,stock:Math.max(0,p.stock-l.q)}:p}));setCart([]);setCoupon(null);nav('/account?tab=orders&new='+id)}
 return <><h1>Checkout</h1><form className="two" onSubmit={submit}><div className="form"><input required placeholder="Full name" value={f.name} onChange={e=>u('name',e.target.value)}/><input required placeholder="Mobile (01XXXXXXXXX)" value={f.phone} onChange={e=>u('phone',e.target.value)}/><input required type="email" placeholder="Email" value={f.email} onChange={e=>u('email',e.target.value)}/>
 {physical&&<><textarea required placeholder="Full address" value={f.address} onChange={e=>u('address',e.target.value)}/><select value={f.district} onChange={e=>u('district',e.target.value)}><option>Dhaka</option><option>Chattogram</option><option>Sylhet</option><option>Rajshahi</option><option>Khulna</option><option>Barishal</option><option>Rangpur</option><option>Mymensingh</option></select><small>Delivery: 2–3 days inside Dhaka, 3–5 days elsewhere.</small></>}
 <h3>Payment <span className="pill">DEMO</span></h3>{[['cod','Cash on delivery'],['bkash','bKash'],['online','Other online payment']].map(([k,t])=><label key={k} className="opt"><input type="radio" checked={f.pay===k} onChange={()=>u('pay',k)}/>{t}</label>)}
 {f.pay!=='cod'&&<div className="note"><b>Demo only — no money moves.</b>{f.pay==='bkash'?<p>In a live store you would send {tk(total)} to the merchant bKash number ({settings.bkash}) and enter the transaction ID. Here, any ID (6+ characters) works and the order stays "Pending" until an admin changes it.</p>:<p>No gateway is connected in this demo.</p>}<input placeholder="Transaction ID" value={f.txn} onChange={e=>u('txn',e.target.value)}/></div>}
 {err&&<p className="err">{err}</p>}</div>
 <aside className="box"><h3>Order summary</h3>{lines.map(l=><p className="row" key={l.id}>{l.p.name} × {l.q}<b>{tk(price(l.p)*l.q)}</b></p>)}<p className="row">Subtotal <b>{tk(subtotal)}</b></p>{coupon&&<p className="row">Coupon {coupon.code}<b>−{tk(discount)}</b></p>}<p className="row">Shipping <b>{ship?tk(ship):'Free'}</b></p><p className="row tot">Total payable <b>{tk(total)}</b></p><button className="btn">Place demo order</button></aside></form></>
}
const STEPS=['Pending','Confirmed','Processing','Shipped','Delivered']
export const Track=({o})=>o.status==='Cancelled'||o.status==='Failed'?<p className="err">Order {o.status.toLowerCase()}</p>:<ol className="track">{STEPS.map((s,i)=><li key={s} className={i<=STEPS.indexOf(o.status)?'done':''}>{s}</li>)}</ol>
export function Login(){
 const{users,setUsers,setMe}=useStore(),[reg,setReg]=useState(false),[f,setF]=useState({name:'',email:'',password:''}),[err,setErr]=useState(''),[forgot,setForgot]=useState(false),nav=useNavigate()
 const go=e=>{e.preventDefault();if(reg){if(users.some(u=>u.email===f.email))return setErr('Email already registered');if(f.password.length<6)return setErr('Password needs 6+ characters');setUsers([...users,f]);setMe({name:f.name,email:f.email})}else{const u=users.find(u=>u.email===f.email&&u.password===f.password);if(!u)return setErr('Wrong email or password');setMe({name:u.name,email:u.email})}nav('/account')}
 return <form className="form narrow" onSubmit={go}><h1>{forgot?'Reset password':reg?'Create account':'Log in'}</h1>
 {forgot?<><input required type="email" placeholder="Email" onChange={e=>setF({...f,email:e.target.value})}/><button type="button" className="btn" onClick={()=>setErr('Demo: no email is sent.')}>Send reset link</button></>:<>{reg&&<input required placeholder="Name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>}<input required type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/><input required type="password" placeholder="Password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/><button className="btn">{reg?'Register':'Log in'}</button></>}
 {err&&<p className="err">{err}</p>}<p><a href="#" onClick={e=>{e.preventDefault();setReg(!reg);setForgot(false);setErr('')}}>{reg?'Have an account? Log in':'New here? Register'}</a>{!reg&&<> · <a href="#" onClick={e=>{e.preventDefault();setForgot(!forgot)}}>Forgot password</a></>}</p>
 <small>Demo only: accounts live in your browser. Production needs a secure backend for authentication.</small></form>
}
export function Account(){
 const{me,setMe,orders,wish,products,dl,setDl,users,setUsers}=useStore(),[sp,setSp]=useSearchParams(),tab=sp.get('tab')||'orders',[open,setOpen]=useState(null),[pf,setPf]=useState({name:me?.name||'',pw:''}),[note,setNote]=useState('')
 if(!me)return <div className="empty"><h1>Please log in</h1><Link className="btn" to="/login">Log in / Register</Link></div>
 const mine=orders.filter(o=>o.cust.uid===me.email||o.cust.email===me.email),lib=mine.filter(o=>!['Cancelled','Failed'].includes(o.status)).flatMap(o=>o.items.filter(i=>i.type==='digital').map(i=>({...i,oid:o.id})))
 const down=i=>{const b=new Blob([`Jhenuk.com demo file for "${i.name}". Replace with private R2 download in production.`],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=i.name.replace(/\W+/g,'_')+'.txt';a.click();setDl([{n:i.name,d:new Date().toISOString()},...dl])}
 const T=['orders','library','downloads','wishlist','profile']
 return <><h1>Hi, {me.name}</h1>{sp.get('new')&&<p className="note">Demo order {sp.get('new')} placed. No real payment was taken.</p>}<div className="tabs">{T.map(t=><button key={t} className={t===tab?'on':''} onClick={()=>setSp({tab:t})}>{t==='library'?'My digital products':t[0].toUpperCase()+t.slice(1)}</button>)}</div>
 {tab==='orders'&&(mine.length?mine.map(o=><div className="box" key={o.id}><p className="row"><b>#{o.id}</b><span className="pill">{o.status}</span></p><small>{new Date(o.date).toLocaleDateString()} · {o.pay.toUpperCase()} · Payment: {o.payStatus} · {tk(o.total)}</small><br/><a href="#" onClick={e=>{e.preventDefault();setOpen(open===o.id?null:o.id)}}>{open===o.id?'Hide details':'Details & tracking'}</a>{open===o.id&&<div><Track o={o}/>{o.items.map(i=><p key={i.id} className="row">{i.name} × {i.q}<b>{tk(i.price*i.q)}</b></p>)}<small>Ship to: {o.cust.address||'Digital delivery'} {o.cust.district}</small></div>}</div>):<p className="empty">No orders yet.</p>)}
 {tab==='library'&&(lib.length?lib.map((i,k)=><p className="box row" key={k}>{i.name}<button className="btn sm" onClick={()=>down(i)}>Download</button></p>):<p className="empty">Purchased digital products appear here.</p>)}
 {tab==='downloads'&&(dl.length?dl.map((d,k)=><p key={k}>{d.n} · {new Date(d.d).toLocaleString()}</p>):<p className="empty">No downloads yet.</p>)}
 {tab==='wishlist'&&(wish.length?<div className="grid">{products.filter(p=>wish.includes(p.id)).map(p=><Card key={p.id} p={p}/>)}</div>:<p className="empty">Your wishlist is empty.</p>)}
 {tab==='profile'&&<form className="form narrow" onSubmit={e=>{e.preventDefault();setUsers(users.map(u=>u.email===me.email?{...u,name:pf.name,...(pf.pw.length>=6?{password:pf.pw}:{})}:u));setMe({...me,name:pf.name});setNote('Saved')}}><input value={pf.name} onChange={e=>setPf({...pf,name:e.target.value})}/><input value={me.email} disabled/><input type="password" placeholder="New password (optional)" value={pf.pw} onChange={e=>setPf({...pf,pw:e.target.value})}/><button className="btn">Save changes</button>{note&&<small>{note}</small>}</form>}
 <p><button className="btn ghost" onClick={()=>setMe(null)}>Log out</button></p></>
}
const TXT={about:['About Jhenuk.com','Jhenuk.com sells everyday products and digital downloads with simple checkout and clear delivery updates.'],contact:['Contact us','Email support@jhenuk.com or call +880 1XXX-XXXXXX (10am–8pm). Update these in admin settings.'],faq:['FAQ','How long is delivery? 2–5 days. Can I return items? Yes, within 7 days (see Refund policy). When do I get digital files? From My digital products once the order is not cancelled.'],'privacy-policy':['Privacy policy','Demo text. We collect only what is needed to process orders. Replace with your final policy before launch.'],terms:['Terms & conditions','Demo text. By ordering you agree to provide accurate details. Replace with your final terms.'],'refund-policy':['Refund policy','Demo text. Physical items can be returned within 7 days if unused. Digital products are non-refundable once downloaded.'],'shipping-policy':['Shipping policy','Demo text. Inside Dhaka ৳70, outside Dhaka ৳120. Free shipping above the threshold set in admin.']}
export const Info=({page})=><div className="narrow"><h1>{TXT[page][0]}</h1><p>{TXT[page][1]}</p></div>
export const NotFound=()=><div className="empty"><h1>404 — Page not found</h1><Link className="btn" to="/">Back to home</Link></div>
