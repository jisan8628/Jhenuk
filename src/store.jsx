import {createContext,useContext,useState,useEffect} from 'react'
const Ctx=createContext()
export const useStore=()=>useContext(Ctx)
export const img=(e,c)=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${c}"/><text x="200" y="250" font-size="150" text-anchor="middle">${e}</text></svg>`)}`
export const tk=n=>'৳'+Math.round(n).toLocaleString('en-US')
export const price=p=>p.disc>0&&p.disc<p.price?p.disc:p.price
export const pct=p=>p.disc>0&&p.disc<p.price?Math.round(100-p.disc/p.price*100):0
const P=(id,name,cat,type,price,disc,stock,rating,sold,e,c)=>({id,name,cat,type,price,disc,stock,rating,sold,img:img(e,c),desc:`${name} — a quality ${type} product from Jhenuk.com. Demo description for preview purposes.`})
const seed={
 cats:['Fashion','Electronics','Home & Living','Books & E-books','Templates & Docs'],
 products:[P(1,'Cotton Panjabi','Fashion','physical',1800,1450,25,4.5,120,'👘','#cfe8e4'),P(2,'Leather Wallet','Fashion','physical',950,0,40,4.2,80,'👛','#f6e2bd'),P(3,'Wireless Earbuds','Electronics','physical',2400,1990,15,4.4,200,'🎧','#dbe4f7'),P(4,'Smart Watch','Electronics','physical',3800,3200,8,4.1,95,'⌚','#e3e3ea'),P(5,'Ceramic Mug Set','Home & Living','physical',780,650,60,4.7,150,'☕','#f9d9cf'),P(6,'Table Lamp','Home & Living','physical',1350,0,0,4.0,30,'💡','#fdf0b8'),P(7,'Learn React in 30 Days (PDF)','Books & E-books','digital',450,299,999,4.8,310,'📘','#cde7f9'),P(8,'Bangla Recipe E-book','Books & E-books','digital',350,0,999,4.6,210,'🍛','#fbdcb8'),P(9,'Resume Template Pack','Templates & Docs','digital',500,350,999,4.3,140,'📄','#e1f1d6'),P(10,'Business Plan Document','Templates & Docs','digital',800,600,999,4.5,75,'📊','#e7d9f5'),P(11,'Running Sneakers','Fashion','physical',2900,2490,20,4.3,110,'👟','#ffd6d6'),P(12,'Study Planner (PDF)','Books & E-books','digital',250,0,999,4.2,90,'🗓️','#d8f3ea')],
 coupons:[{code:'WELCOME10',type:'percent',value:10,min:500,expiry:'2027-12-31'},{code:'SAVE100',type:'fixed',value:100,min:1500,expiry:'2027-12-31'}],
 banners:[{t:'Eid-ready fashion',s:'Up to 25% off panjabi & more',c:'#0e4a4a',to:'/shop?cat=Fashion'},{t:'Digital library',s:'E-books & templates, instant access',c:'#5a3a8c',to:'/shop?type=digital'},{t:'Tech deals',s:'Earbuds, watches and accessories',c:'#1d4f91',to:'/shop?cat=Electronics'}],
 settings:{ship:{Dhaka:70,Other:120},bkash:'01XXXXXXXXX',email:'support@jhenuk.com',phone:'+880 1XXX-XXXXXX',freeShipAbove:5000},
 reviews:{7:[{n:'Rafi',r:5,t:'Very clear and practical.'}],1:[{n:'Mim',r:4,t:'Good fabric, nice fit.'}]}
}
function useLS(k,d){const[v,s]=useState(()=>{try{return JSON.parse(localStorage.getItem('jh_'+k))??d}catch{return d}});useEffect(()=>{localStorage.setItem('jh_'+k,JSON.stringify(v))},[k,v]);return[v,s]}
export function Provider({children}){
 const[products,setProducts]=useLS('products',seed.products),[cats,setCats]=useLS('cats',seed.cats),[coupons,setCoupons]=useLS('coupons',seed.coupons),[banners]=useLS('banners',seed.banners),[settings,setSettings]=useLS('settings',seed.settings),[reviews,setReviews]=useLS('reviews',seed.reviews)
 const[cart,setCart]=useLS('cart',[]),[orders,setOrders]=useLS('orders',[]),[users,setUsers]=useLS('users',[]),[me,setMe]=useLS('me',null),[wish,setWish]=useLS('wish',[]),[dl,setDl]=useLS('dl',[]),[admin,setAdmin]=useLS('admin',false),[coupon,setCoupon]=useLS('coupon',null)
 const add=(id,q=1)=>setCart(c=>c.some(i=>i.id===id)?c.map(i=>i.id===id?{...i,q:i.q+q}:i):[...c,{id,q}])
 const setQ=(id,q)=>setCart(c=>q<1?c.filter(i=>i.id!==id):c.map(i=>i.id===id?{...i,q}:i))
 const lines=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(l=>l.p)
 const subtotal=lines.reduce((s,l)=>s+price(l.p)*l.q,0)
 const checkCoupon=(code,sub=subtotal)=>{const c=coupons.find(x=>x.code===code.trim().toUpperCase());if(!c)return{err:'Invalid coupon code'};if(new Date(c.expiry)<new Date())return{err:'This coupon has expired'};if(sub<c.min)return{err:`Minimum order ${tk(c.min)} required`};return{c}}
 const discount=coupon?(c=>c.type==='percent'?Math.round(subtotal*c.value/100):Math.min(c.value,subtotal))(coupon):0
 const value={products,setProducts,cats,setCats,coupons,setCoupons,banners,settings,setSettings,reviews,setReviews,cart,setCart,orders,setOrders,users,setUsers,me,setMe,wish,setWish,dl,setDl,admin,setAdmin,coupon,setCoupon,add,setQ,lines,subtotal,discount,checkCoupon,count:cart.reduce((s,i)=>s+i.q,0),toggleWish:id=>setWish(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id])}
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
