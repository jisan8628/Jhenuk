import {Routes,Route,Link,NavLink,useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {useStore} from './store'
import {Home,Shop,Product,Cart,Checkout,Login,Account,Info,NotFound} from './pages'
import Admin from './admin'
import {Logo} from './Logo'
function Header(){
 const{count,me,cats}=useStore(),[q,setQ]=useState(''),[open,setOpen]=useState(false),nav=useNavigate()
 return <header><div className="bar wrap"><button className="burger" aria-label="Menu" onClick={()=>setOpen(!open)}>☰</button><Link to="/"><Logo/></Link>
 <form className="search" onSubmit={e=>{e.preventDefault();nav('/shop?q='+encodeURIComponent(q))}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products"/><button>Search</button></form>
 <nav className={open?'open':''} onClick={()=>setOpen(false)}><NavLink to="/shop">Shop</NavLink><NavLink to="/shop?type=digital">Digital</NavLink><NavLink to="/account">{me?'My account':'Login'}</NavLink><NavLink to="/cart" className="cartlink">Cart <span className="badge">{count}</span></NavLink></nav></div>
 <div className="cats wrap">{cats.map(c=><Link key={c} to={'/shop?cat='+encodeURIComponent(c)}>{c}</Link>)}</div></header>
}
function Footer(){
 const{settings}=useStore()
 return <footer><div className="wrap fgrid"><div><Logo/><p>Everyday products and digital downloads, delivered across Bangladesh.</p><p>{settings.email} · {settings.phone}</p></div>
 <div><h4>Help</h4>{[['about','About us'],['contact','Contact'],['faq','FAQ'],['shipping-policy','Shipping policy'],['refund-policy','Refund policy'],['privacy-policy','Privacy policy'],['terms','Terms']].map(([p,t])=><Link key={p} to={'/'+p}>{t}</Link>)}</div>
 <div><h4>Follow</h4><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a></div></div><p className="demo">Demo store: payments, accounts and data are simulated and stored in your browser only.</p></footer>
}
export default function App(){
 return <Routes>
  <Route path="/admin/*" element={<Admin/>}/>
  <Route path="*" element={<><Header/><main className="wrap"><Routes>
   <Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/product/:id" element={<Product/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/login" element={<Login/>}/><Route path="/account" element={<Account/>}/>
   {['about','contact','faq','privacy-policy','terms','refund-policy','shipping-policy'].map(p=><Route key={p} path={'/'+p} element={<Info page={p}/>}/>)}
   <Route path="*" element={<NotFound/>}/></Routes></main><Footer/></>}/>
 </Routes>
}
