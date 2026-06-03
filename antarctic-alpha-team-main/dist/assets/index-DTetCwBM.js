import{r as A,a as Eg,g as kg,R as uu,u as hu,b as Ng,c as jg,L as zt,N as so,B as Tg,d as Ig,e as Vt}from"./react-vendor-Dou2_yf_.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();var mu={exports:{}},ni={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sg=A,Ag=Symbol.for("react.element"),Cg=Symbol.for("react.fragment"),Rg=Object.prototype.hasOwnProperty,Pg=Sg.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Dg={key:!0,ref:!0,__self:!0,__source:!0};function gu(r,e,t){var n,s={},i=null,l=null;t!==void 0&&(i=""+t),e.key!==void 0&&(i=""+e.key),e.ref!==void 0&&(l=e.ref);for(n in e)Rg.call(e,n)&&!Dg.hasOwnProperty(n)&&(s[n]=e[n]);if(r&&r.defaultProps)for(n in e=r.defaultProps,e)s[n]===void 0&&(s[n]=e[n]);return{$$typeof:Ag,type:r,key:i,ref:l,props:s,_owner:Pg.current}}ni.Fragment=Cg;ni.jsx=gu;ni.jsxs=gu;mu.exports=ni;var a=mu.exports,ao={},Nc=Eg;ao.createRoot=Nc.createRoot,ao.hydrateRoot=Nc.hydrateRoot;const $g={},jc=r=>{let e;const t=new Set,n=(g,x)=>{const p=typeof g=="function"?g(e):g;if(!Object.is(p,e)){const T=e;e=x??(typeof p!="object"||p===null)?p:Object.assign({},e,p),t.forEach(j=>j(e,T))}},s=()=>e,d={setState:n,getState:s,getInitialState:()=>h,subscribe:g=>(t.add(g),()=>t.delete(g)),destroy:()=>{($g?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),t.clear()}},h=e=r(n,s,d);return d},Mg=r=>r?jc(r):jc;var fu={exports:{}},pu={},xu={exports:{}},yu={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Dn=A;function Og(r,e){return r===e&&(r!==0||1/r===1/e)||r!==r&&e!==e}var Vg=typeof Object.is=="function"?Object.is:Og,Lg=Dn.useState,Fg=Dn.useEffect,Ug=Dn.useLayoutEffect,Bg=Dn.useDebugValue;function qg(r,e){var t=e(),n=Lg({inst:{value:t,getSnapshot:e}}),s=n[0].inst,i=n[1];return Ug(function(){s.value=t,s.getSnapshot=e,Ui(s)&&i({inst:s})},[r,t,e]),Fg(function(){return Ui(s)&&i({inst:s}),r(function(){Ui(s)&&i({inst:s})})},[r]),Bg(t),t}function Ui(r){var e=r.getSnapshot;r=r.value;try{var t=e();return!Vg(r,t)}catch{return!0}}function Wg(r,e){return e()}var zg=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?Wg:qg;yu.useSyncExternalStore=Dn.useSyncExternalStore!==void 0?Dn.useSyncExternalStore:zg;xu.exports=yu;var Hg=xu.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var si=A,Gg=Hg;function Kg(r,e){return r===e&&(r!==0||1/r===1/e)||r!==r&&e!==e}var Qg=typeof Object.is=="function"?Object.is:Kg,Yg=Gg.useSyncExternalStore,Xg=si.useRef,Jg=si.useEffect,Zg=si.useMemo,ef=si.useDebugValue;pu.useSyncExternalStoreWithSelector=function(r,e,t,n,s){var i=Xg(null);if(i.current===null){var l={hasValue:!1,value:null};i.current=l}else l=i.current;i=Zg(function(){function d(T){if(!h){if(h=!0,g=T,T=n(T),s!==void 0&&l.hasValue){var j=l.value;if(s(j,T))return x=j}return x=T}if(j=x,Qg(g,T))return j;var E=n(T);return s!==void 0&&s(j,E)?(g=T,j):(g=T,x=E)}var h=!1,g,x,p=t===void 0?null:t;return[function(){return d(e())},p===null?void 0:function(){return d(p())}]},[e,t,n,s]);var c=Yg(r,i[0],i[1]);return Jg(function(){l.hasValue=!0,l.value=c},[c]),ef(c),c};fu.exports=pu;var tf=fu.exports;const rf=kg(tf),bu={},{useDebugValue:nf}=uu,{useSyncExternalStoreWithSelector:sf}=rf;let Tc=!1;const af=r=>r;function of(r,e=af,t){(bu?"production":void 0)!=="production"&&t&&!Tc&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Tc=!0);const n=sf(r.subscribe,r.getState,r.getServerState||r.getInitialState,e,t);return nf(n),n}const lf=r=>{(bu?"production":void 0)!=="production"&&typeof r!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const e=typeof r=="function"?Mg(r):r,t=(n,s)=>of(e,n,s);return Object.assign(t,e),t},$o=r=>lf,cf={};function df(r,e){let t;try{t=r()}catch{return}return{getItem:s=>{var i;const l=d=>d===null?null:JSON.parse(d,void 0),c=(i=t.getItem(s))!=null?i:null;return c instanceof Promise?c.then(l):l(c)},setItem:(s,i)=>t.setItem(s,JSON.stringify(i,void 0)),removeItem:s=>t.removeItem(s)}}const ks=r=>e=>{try{const t=r(e);return t instanceof Promise?t:{then(n){return ks(n)(t)},catch(n){return this}}}catch(t){return{then(n){return this},catch(n){return ks(n)(t)}}}},uf=(r,e)=>(t,n,s)=>{let i={getStorage:()=>localStorage,serialize:JSON.stringify,deserialize:JSON.parse,partialize:I=>I,version:0,merge:(I,D)=>({...D,...I}),...e},l=!1;const c=new Set,d=new Set;let h;try{h=i.getStorage()}catch{}if(!h)return r((...I)=>{console.warn(`[zustand persist middleware] Unable to update item '${i.name}', the given storage is currently unavailable.`),t(...I)},n,s);const g=ks(i.serialize),x=()=>{const I=i.partialize({...n()});let D;const S=g({state:I,version:i.version}).then(C=>h.setItem(i.name,C)).catch(C=>{D=C});if(D)throw D;return S},p=s.setState;s.setState=(I,D)=>{p(I,D),x()};const T=r((...I)=>{t(...I),x()},n,s);let j;const E=()=>{var I;if(!h)return;l=!1,c.forEach(S=>S(n()));const D=((I=i.onRehydrateStorage)==null?void 0:I.call(i,n()))||void 0;return ks(h.getItem.bind(h))(i.name).then(S=>{if(S)return i.deserialize(S)}).then(S=>{if(S)if(typeof S.version=="number"&&S.version!==i.version){if(i.migrate)return i.migrate(S.state,S.version);console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return S.state}).then(S=>{var C;return j=i.merge(S,(C=n())!=null?C:T),t(j,!0),x()}).then(()=>{D==null||D(j,void 0),l=!0,d.forEach(S=>S(j))}).catch(S=>{D==null||D(void 0,S)})};return s.persist={setOptions:I=>{i={...i,...I},I.getStorage&&(h=I.getStorage())},clearStorage:()=>{h==null||h.removeItem(i.name)},getOptions:()=>i,rehydrate:()=>E(),hasHydrated:()=>l,onHydrate:I=>(c.add(I),()=>{c.delete(I)}),onFinishHydration:I=>(d.add(I),()=>{d.delete(I)})},E(),j||T},hf=(r,e)=>(t,n,s)=>{let i={storage:df(()=>localStorage),partialize:E=>E,version:0,merge:(E,I)=>({...I,...E}),...e},l=!1;const c=new Set,d=new Set;let h=i.storage;if(!h)return r((...E)=>{console.warn(`[zustand persist middleware] Unable to update item '${i.name}', the given storage is currently unavailable.`),t(...E)},n,s);const g=()=>{const E=i.partialize({...n()});return h.setItem(i.name,{state:E,version:i.version})},x=s.setState;s.setState=(E,I)=>{x(E,I),g()};const p=r((...E)=>{t(...E),g()},n,s);s.getInitialState=()=>p;let T;const j=()=>{var E,I;if(!h)return;l=!1,c.forEach(S=>{var C;return S((C=n())!=null?C:p)});const D=((I=i.onRehydrateStorage)==null?void 0:I.call(i,(E=n())!=null?E:p))||void 0;return ks(h.getItem.bind(h))(i.name).then(S=>{if(S)if(typeof S.version=="number"&&S.version!==i.version){if(i.migrate)return[!0,i.migrate(S.state,S.version)];console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,S.state];return[!1,void 0]}).then(S=>{var C;const[F,ne]=S;if(T=i.merge(ne,(C=n())!=null?C:p),t(T,!0),F)return g()}).then(()=>{D==null||D(T,void 0),T=n(),l=!0,d.forEach(S=>S(T))}).catch(S=>{D==null||D(void 0,S)})};return s.persist={setOptions:E=>{i={...i,...E},E.storage&&(h=E.storage)},clearStorage:()=>{h==null||h.removeItem(i.name)},getOptions:()=>i,rehydrate:()=>j(),hasHydrated:()=>l,onHydrate:E=>(c.add(E),()=>{c.delete(E)}),onFinishHydration:E=>(d.add(E),()=>{d.delete(E)})},i.skipHydration||j(),T||p},mf=(r,e)=>"getStorage"in e||"serialize"in e||"deserialize"in e?((cf?"production":void 0)!=="production"&&console.warn("[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."),uf(r,e)):hf(r,e),Mo=mf,ve=[{id:"1",name:"Артём",login:"artyom03",password:"248artdex",avatar:"/avatars/artyom.jpg"},{id:"2",name:"Адель",login:"adel05",password:"058adeldex",avatar:"/avatars/adel.jpg"},{id:"3",name:"Ксения",login:"ksen03",password:"907ksendex",avatar:"/avatars/kseniya.jpg"},{id:"4",name:"Ольга",login:"olga04",password:"638olgadex",avatar:"/avatars/olga.jpg"},{id:"5",name:"Анастасия",login:"anastasia05",password:"638anastadex",avatar:"/avatars/anastasia.jpg"}],Oo={trading:{label:"Торговля",icon:"📈",color:"green"},learning:{label:"Обучение",icon:"📚",color:"blue"},technical:{label:"Техническая часть",icon:"⚙️",color:"purple"},stream:{label:"Стрим",icon:"📺",color:"red"},research:{label:"Изучение нового",icon:"🔬",color:"yellow"},organization:{label:"Поиск и систематизация информации",icon:"📋",color:"indigo"}},Ma={pending:{label:"На согласовании",color:"yellow"},in_progress:{label:"В работе",color:"blue"},completed:{label:"Выполнена",color:"green"},closed:{label:"Закрыта",color:"gray"},rejected:{label:"Отклонена",color:"red"}},nt=$o()(Mo(r=>({user:null,isAuthenticated:!1,login:(e,t)=>{const n=ve.find(s=>s.login===e&&s.password===t);return n?(r({user:n,isAuthenticated:!0}),!0):!1},logout:()=>r({user:null,isAuthenticated:!1})}),{name:"apevault-auth"})),gf="9119ApeVault",yt=$o()(Mo(r=>({isAdmin:!1,activateAdmin:e=>e===gf?(r({isAdmin:!0}),!0):!1,deactivateAdmin:()=>r({isAdmin:!1})}),{name:"apevault-admin"})),Ve=$o()(Mo(r=>({theme:"light",toggleTheme:()=>r(e=>{const t=e.theme==="light"?"dark":"light";return document.body.classList.toggle("dark",t==="dark"),{theme:t}}),setTheme:e=>r(()=>(document.body.classList.toggle("dark",e==="dark"),{theme:e}))}),{name:"apevault-theme"}));/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ff={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pf=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),he=(r,e)=>{const t=A.forwardRef(({color:n="currentColor",size:s=24,strokeWidth:i=2,absoluteStrokeWidth:l,className:c="",children:d,...h},g)=>A.createElement("svg",{ref:g,...ff,width:s,height:s,stroke:n,strokeWidth:l?Number(i)*24/Number(s):i,className:["lucide",`lucide-${pf(r)}`,c].join(" "),...h},[...e.map(([x,p])=>A.createElement(x,p)),...Array.isArray(d)?d:[d]]));return t.displayName=`${r}`,t};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xf=he("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ys=he("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vu=he("Award",[["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}],["path",{d:"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11",key:"em7aur"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ic=he("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sc=he("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ac=he("CalendarCheck",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}],["path",{d:"m9 16 2 2 4-4",key:"19s6y9"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mr=he("Calendar",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vo=he("CheckCircle2",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pr=he("CheckSquare",[["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}],["path",{d:"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",key:"1jnkn4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=he("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=he("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zn=he("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oo=he("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ai=he("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yf=he("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wu=he("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lo=he("FileText",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"16",x2:"8",y1:"13",y2:"13",key:"14keom"}],["line",{x1:"16",x2:"8",y1:"17",y2:"17",key:"17nazh"}],["line",{x1:"10",x2:"8",y1:"9",y2:"9",key:"1a5vjj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cc=he("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bf=he("HeartPulse",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}],["path",{d:"M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",key:"1uw2ng"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vf=he("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fo=he("HelpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ut=he("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wf=he("Key",[["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["path",{d:"m15.5 7.5 3 3L22 7l-3-3",key:"1rn1fs"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _f=he("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ef=he("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1pjlvk"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rc=he("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kf=he("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nf=he("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jf=he("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _u=he("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uo=he("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tf=he("MoreVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=he("PenSquare",[["path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1qinfi"}],["path",{d:"M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z",key:"w2jsv5"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pc=he("Pen",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dc=he("PiggyBank",[["path",{d:"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z",key:"uf6l00"}],["path",{d:"M2 9v1c0 1.1.9 2 2 2h1",key:"nm575m"}],["path",{d:"M16 11h0",key:"k2aug8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eu=he("Plane",[["path",{d:"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",key:"1v9wt8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const If=he("PlusCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ns=he("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sf=he("RefreshCcw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Af=he("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cf=he("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $c=he("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=he("Shield",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rn=he("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ku=he("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mc=he("Table2",[["path",{d:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",key:"gugj83"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rf=he("Tag",[["path",{d:"M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z",key:"14b2ls"}],["path",{d:"M7 7h.01",key:"7u93v4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=he("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=he("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vr=he("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zr=he("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const un=he("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pf=he("Wallet",[["path",{d:"M21 12V7H5a2 2 0 0 1 0-4h14v4",key:"195gfw"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h16v-5",key:"195n9w"}],["path",{d:"M18 12a2 2 0 0 0 0 4h4v-4Z",key:"vllfpd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Df=he("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pt=he("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=he("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]),Nu="/assets/logo-DoMo9ObD.png",$f=()=>{const[r,e]=A.useState("member"),[t,n]=A.useState(""),[s,i]=A.useState(""),[l,c]=A.useState(""),{login:d,user:h,isAuthenticated:g}=nt(),{theme:x,toggleTheme:p}=Ve(),{activateAdmin:T}=yt(),j=hu(),[E]=Ng();A.useEffect(()=>{document.body.classList.toggle("dark",x==="dark")},[x]),A.useEffect(()=>{var S,C,F;if(g&&h){j("/management");return}if((S=window.Telegram)!=null&&S.WebApp){window.Telegram.WebApp.ready(),window.Telegram.WebApp.expand();const B=E.get("tgWebAppData")||window.Telegram.WebApp.initData,_=E.get("login"),y=E.get("password");if(_&&y&&d(_,y)){j("/management");return}if(B)try{const k=new URLSearchParams(B).get("user");if(k){const f=JSON.parse(decodeURIComponent(k)).id;sessionStorage.setItem("telegram_user_id",String(f));const O=localStorage.getItem("apevault-auth");if(O)try{const Q=JSON.parse(O);if((C=Q.state)!=null&&C.user){const P=Q.state.user;if(d(P.login,P.password)){j("/management");return}}}catch(Q){console.error("Error parsing saved auth:",Q)}console.log("Telegram Mini App detected, user ID:",f)}}catch(w){console.error("Error parsing Telegram initData:",w)}const b=(F=window.Telegram.WebApp.initDataUnsafe)==null?void 0:F.user;b&&(sessionStorage.setItem("telegram_user_id",String(b.id)),console.log("Telegram user detected:",b.first_name))}},[E,g,h,j,d]);const I=S=>{if(S.preventDefault(),c(""),!s){c("Пожалуйста, введите пароль");return}if(r==="admin")T(s)?j("/management"):c("Неверный пароль администратора");else{if(!t){c("Пожалуйста, введите логин");return}d(t,s)?j("/management"):c("Неверный логин или пароль")}},D=()=>{p()};return a.jsxs("div",{className:`min-h-screen relative overflow-hidden ${x==="dark"?"bg-[#0b0f17]":"bg-gradient-to-br from-slate-50 via-white to-slate-100"}`,children:[a.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[a.jsx("div",{className:"absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4E6E49]/35 via-emerald-400/22 to-transparent blur-[110px]"}),a.jsx("div",{className:"absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-blue-500/24 via-purple-500/22 to-transparent blur-[140px]"}),a.jsx("div",{className:"absolute bottom-[-200px] right-[-80px] w-[620px] h-[620px] bg-gradient-to-tr from-amber-400/18 via-[#4E6E49]/18 to-transparent blur-[120px]"}),a.jsx("div",{className:"floating-grid opacity-75 dark:opacity-45"})]}),a.jsx("div",{className:"relative z-10 max-w-6xl mx-auto px-4 lg:px-6 min-h-screen flex items-center justify-center py-10",children:a.jsxs("div",{className:"glass-panel rounded-[28px] p-4 sm:p-6 md:p-8 border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden w-full",children:[a.jsx("div",{className:"accent-dots"}),a.jsxs("div",{className:"relative z-10 grid md:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-stretch",children:[a.jsxs("div",{className:"section-card rounded-2xl p-6 lg:p-7 border border-white/60 dark:border-white/10 shadow-xl flex flex-col items-center text-center gap-4",children:[a.jsx("div",{className:"p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg",children:a.jsx("img",{src:Nu,alt:"ApeVault Logo",className:"w-16 h-16 object-contain"})}),a.jsxs("div",{className:"space-y-1",children:[a.jsx("p",{className:`text-xs uppercase tracking-[0.16em] ${x==="dark"?"text-gray-400":"text-gray-500"}`,children:"ApeVault Black Ops"}),a.jsx("h1",{className:`text-3xl lg:text-4xl font-extrabold ${x==="dark"?"text-white":"text-gray-900"}`,children:"Командная панель"})]}),a.jsxs("div",{className:"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#4E6E49]/15 to-emerald-500/10 text-[#4E6E49] text-xs font-semibold",children:[a.jsx(Lt,{className:"w-4 h-4"}),"Защищенный доступ"]}),a.jsxs("div",{className:`w-full mt-4 rounded-xl border ${x==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white/80"} p-4 text-left space-y-3`,children:[a.jsxs("div",{className:"flex items-center gap-2 text-sm font-semibold",children:[a.jsx(Lt,{className:"w-4 h-4 text-[#4E6E49]"}),a.jsx("span",{className:x==="dark"?"text-white":"text-gray-900",children:"Правила и доступ"})]}),a.jsxs("ul",{className:`text-xs leading-relaxed space-y-1 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx("li",{children:"• Пользуемся данными из бота: логин + пароль."}),a.jsx("li",{children:"• Админ пароль: только для доверенных (режим администратора)."}),a.jsxs("li",{children:["• Правила: ",a.jsx("a",{className:"text-[#4E6E49] font-semibold",href:"https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20",target:"_blank",rel:"noreferrer",children:"читать"}),"."]})]}),a.jsxs("div",{className:`text-xs ${x==="dark"?"text-gray-400":"text-gray-600"}`,children:["Администратор: ",a.jsx("span",{className:"font-semibold",children:"@artyommedoed"})]})]})]}),a.jsxs("div",{className:"section-card rounded-2xl p-6 lg:p-7 border border-white/60 dark:border-white/10 shadow-xl",children:[a.jsxs("div",{className:"flex items-center justify-between mb-6",children:[a.jsxs("div",{children:[a.jsx("p",{className:`text-xs uppercase tracking-[0.12em] ${x==="dark"?"text-gray-400":"text-gray-500"}`,children:"Доступ"}),a.jsx("h2",{className:`text-2xl font-extrabold ${x==="dark"?"text-white":"text-gray-900"}`,children:"Вход в систему"})]}),a.jsx("button",{onClick:D,className:"nav-chip px-3 py-2","data-active":"false","aria-label":"Toggle theme",children:x==="dark"?a.jsx(ku,{className:"w-5 h-5 text-amber-300"}):a.jsx(Uo,{className:"w-5 h-5 text-gray-700"})})]}),a.jsxs("form",{onSubmit:I,className:"space-y-5",children:[a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-semibold mb-3 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:"Тип пользователя"}),a.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[a.jsxs("button",{type:"button",onClick:()=>{e("member"),n(""),i(""),c("")},className:"pill justify-center","data-active":r==="member",children:[a.jsx(un,{className:"w-5 h-5"}),a.jsx("span",{children:"Участник"})]}),a.jsxs("button",{type:"button",onClick:()=>{e("admin"),n(""),i(""),c("")},className:"pill justify-center","data-active":r==="admin",children:[a.jsx(Lt,{className:"w-5 h-5"}),a.jsx("span",{children:"Админ"})]})]})]}),r==="member"&&a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"login",className:`block text-sm font-semibold mb-2 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx(Zr,{className:"w-4 h-4 inline mr-2"}),"Логин"]}),a.jsx("div",{className:"flex items-center gap-2",children:a.jsx("input",{id:"login",type:"text",value:t,onChange:S=>n(S.target.value),className:`w-full px-4 py-3 rounded-xl border transition-all ${x==="dark"?"bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4E6E49]":"bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]"} focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`,placeholder:"Введите ваш логин",autoComplete:"username"})})]}),a.jsxs("div",{children:[a.jsxs("label",{htmlFor:"password",className:`block text-sm font-semibold mb-2 ${x==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx(Lt,{className:"w-4 h-4 inline mr-2"}),"Пароль"]}),a.jsx("input",{id:"password",type:"password",value:s,onChange:S=>i(S.target.value),className:`w-full px-4 py-3 rounded-xl border transition-all ${x==="dark"?"bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4E6E49]":"bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]"} focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`,placeholder:r==="admin"?"Введите пароль администратора":"Введите ваш пароль",autoComplete:r==="admin"?"off":"current-password"}),r==="admin"&&a.jsx("p",{className:`mt-2 text-xs ${x==="dark"?"text-gray-400":"text-gray-500"}`,children:"Для входа в режим администратора требуется специальный пароль"})]}),l&&a.jsx("div",{className:`p-4 rounded-xl border ${x==="dark"?"bg-red-500/15 border-red-500/40 text-red-300":"bg-red-50 border-red-300 text-red-700"} text-sm font-semibold animate-shake`,children:l}),a.jsx("button",{type:"submit",className:"w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white",children:"Войти в систему"})]}),a.jsxs("div",{className:`mt-6 pt-6 border-t ${x==="dark"?"border-white/10":"border-gray-200"} flex items-center justify-between gap-3`,children:[a.jsx("div",{className:`text-xs ${x==="dark"?"text-gray-400":"text-gray-600"}`,children:"Защищенная система для команды ApeVault"}),a.jsx("div",{})]})]})]})]})})]})},qt=({children:r})=>{const{theme:e,toggleTheme:t}=Ve(),{isAdmin:n}=yt(),s=jg(),[i,l]=A.useState(!1),[c,d]=A.useState(!1),h=[{path:"/management",label:"Расписание",icon:mr},{path:"/earnings",label:"Заработок",icon:ai},{path:"/tasks",label:"Задачи",icon:Pr},{path:"/rating",label:"Рейтинг",icon:Vr}],g=[{path:"/about",label:"О сообществе",icon:Ut},{path:"/faq",label:"FAQ",icon:Fo}],x=h.some(E=>s.pathname===E.path),p=E=>s.pathname===E,T=g.some(E=>s.pathname===E.path),j=E=>s.pathname===E;return A.useEffect(()=>{l(!1),d(!1)},[s.pathname]),a.jsxs("div",{className:"app-shell",children:[a.jsxs("div",{className:"absolute inset-0 pointer-events-none -z-10 overflow-hidden",children:[a.jsx("div",{className:"absolute -top-24 -left-12 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/25 via-transparent to-transparent blur-3xl"}),a.jsx("div",{className:"absolute top-8 right-0 w-[520px] h-[520px] bg-gradient-to-bl from-blue-500/12 via-purple-500/10 to-transparent blur-3xl"}),a.jsx("div",{className:"absolute bottom-[-120px] left-12 w-96 h-96 bg-gradient-to-tr from-amber-400/10 to-[#4E6E49]/12 blur-3xl"}),a.jsx("div",{className:"floating-grid"})]}),a.jsx("header",{className:"sticky top-0 z-50 backdrop-blur-md",children:a.jsx("div",{className:"max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2",children:a.jsxs("div",{className:"glass-panel rounded-2xl px-4 lg:px-6 py-3 flex items-center gap-4 shadow-2xl",children:[a.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[a.jsxs("div",{className:"relative w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg overflow-hidden flex items-center justify-center",children:[a.jsx("img",{src:Nu,alt:"ApeVault Logo",className:"w-10 h-10 object-contain"}),a.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5"})]}),a.jsxs("div",{className:"leading-tight",children:[a.jsx("p",{className:`text-xs uppercase tracking-[0.16em] ${e==="dark"?"text-gray-400":"text-gray-500"}`,children:"ApeVault Black Ops"}),a.jsx("p",{className:`text-xl font-extrabold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Панель команды"})]})]}),a.jsxs("nav",{className:"hidden lg:flex items-center gap-2 flex-1 justify-center",children:[a.jsxs(zt,{to:"/call","data-active":s.pathname==="/call",className:"nav-chip",children:[a.jsx(Tn,{className:"w-4 h-4"}),a.jsx("span",{children:"Call"})]}),a.jsxs("div",{className:"relative",children:[a.jsxs("button",{onClick:()=>l(!i),"data-active":x,className:"nav-chip",children:[a.jsx($c,{className:"w-4 h-4"}),a.jsx("span",{children:"Функционал"}),a.jsx(io,{className:`w-4 h-4 transition-transform ${i?"rotate-180":""}`})]}),i&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>l(!1)}),a.jsxs("div",{className:"absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden",children:[a.jsx("div",{className:"accent-dots"}),a.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:h.map(E=>a.jsxs(zt,{to:E.path,onClick:()=>l(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${p(E.path)?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[a.jsx(E.icon,{className:"w-4 h-4 flex-shrink-0"}),a.jsx("span",{className:"font-semibold",children:E.label})]},E.path))})]})]})]}),a.jsxs("div",{className:"relative",children:[a.jsxs("button",{onClick:()=>d(!c),"data-active":T,className:"nav-chip",children:[a.jsx(Ut,{className:"w-4 h-4"}),a.jsx("span",{children:"О нас"}),a.jsx(io,{className:`w-4 h-4 transition-transform ${c?"rotate-180":""}`})]}),c&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>d(!1)}),a.jsxs("div",{className:"absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden",children:[a.jsx("div",{className:"accent-dots"}),a.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:g.map(E=>a.jsxs(zt,{to:E.path,onClick:()=>d(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${j(E.path)?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[a.jsx(E.icon,{className:"w-4 h-4 flex-shrink-0"}),a.jsx("span",{className:"font-semibold",children:E.label})]},E.path))})]})]})]}),a.jsxs(zt,{to:"/profile","data-active":s.pathname==="/profile",className:"nav-chip",children:[a.jsx(Zr,{className:"w-4 h-4"}),a.jsx("span",{children:"ЛК"})]}),n&&a.jsxs(zt,{to:"/admin","data-active":s.pathname==="/admin",className:"nav-chip",children:[a.jsx(Lt,{className:"w-4 h-4"}),a.jsx("span",{children:"Админ"})]})]}),a.jsxs("div",{className:"flex items-center gap-3 ml-auto",children:[n&&a.jsxs("div",{className:"badge-glow px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hidden md:inline-flex items-center gap-2",children:[a.jsx(Lt,{className:"w-4 h-4"}),a.jsx("span",{className:"text-sm",children:"Админ"})]}),a.jsx("button",{onClick:t,className:"nav-chip px-3 py-2","data-active":"false","aria-label":"Toggle theme",children:e==="dark"?a.jsx(ku,{className:"w-5 h-5 text-amber-300"}):a.jsx(Uo,{className:"w-5 h-5 text-gray-700"})})]})]})})}),a.jsx("main",{className:"page-shell",children:r}),a.jsx("nav",{className:"lg:hidden fixed bottom-4 left-0 right-0 px-3 z-50",children:a.jsx("div",{className:"max-w-5xl mx-auto",children:a.jsx("div",{className:"glass-panel rounded-2xl shadow-2xl border border-white/60 dark:border-white/10",children:a.jsxs("div",{className:"grid grid-cols-4 divide-x divide-white/40 dark:divide-white/5",children:[a.jsxs(zt,{to:"/call",className:`flex flex-col items-center justify-center gap-1 py-3 ${s.pathname==="/call"?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx(Tn,{className:"w-5 h-5"}),a.jsx("span",{className:"text-[11px] font-semibold",children:"Call"})]}),a.jsxs("button",{onClick:()=>l(!i),className:`flex flex-col items-center justify-center gap-1 py-3 ${x?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx($c,{className:"w-5 h-5"}),a.jsx("span",{className:"text-[11px] font-semibold",children:"Функционал"})]}),a.jsxs("button",{onClick:()=>d(!c),className:`flex flex-col items-center justify-center gap-1 py-3 ${T?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx(Ut,{className:"w-5 h-5"}),a.jsx("span",{className:"text-[11px] font-semibold",children:"О нас"})]}),a.jsxs(zt,{to:"/profile",className:`flex flex-col items-center justify-center gap-1 py-3 ${s.pathname==="/profile"?"text-[#4E6E49]":e==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx(Zr,{className:"w-5 h-5"}),a.jsx("span",{className:"text-[11px] font-semibold",children:"ЛК"})]})]})})})}),i&&a.jsx("div",{className:"lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",onClick:()=>l(!1),children:a.jsxs("div",{className:"absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden",children:[a.jsx("div",{className:"accent-dots"}),a.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:h.map(E=>a.jsxs(zt,{to:E.path,onClick:()=>l(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${p(E.path)?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[a.jsx(E.icon,{className:"w-4 h-4 flex-shrink-0"}),a.jsx("span",{className:"font-semibold",children:E.label})]},E.path))})]})}),c&&a.jsx("div",{className:"lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",onClick:()=>d(!1),children:a.jsxs("div",{className:"absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden",children:[a.jsx("div",{className:"accent-dots"}),a.jsx("div",{className:"relative z-10 divide-y divide-gray-100/60 dark:divide-white/5",children:g.map(E=>a.jsxs(zt,{to:E.path,onClick:()=>d(!1),className:`flex items-center gap-3 px-4 py-3 transition-colors ${j(E.path)?"bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]":e==="dark"?"hover:bg-white/5 text-gray-200":"hover:bg-gray-50 text-gray-800"}`,children:[a.jsx(E.icon,{className:"w-4 h-4 flex-shrink-0"}),a.jsx("span",{className:"font-semibold",children:E.label})]},E.path))})]})})]})};var Oc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ju=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Mf=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],l=r[t++],c=r[t++],d=((s&7)<<18|(i&63)<<12|(l&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(d>>10)),e[n++]=String.fromCharCode(56320+(d&1023))}else{const i=r[t++],l=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|l&63)}}return e.join("")},Tu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],l=s+1<r.length,c=l?r[s+1]:0,d=s+2<r.length,h=d?r[s+2]:0,g=i>>2,x=(i&3)<<4|c>>4;let p=(c&15)<<2|h>>6,T=h&63;d||(T=64,l||(p=64)),n.push(t[g],t[x],t[p],t[T])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(ju(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):Mf(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],c=s<r.length?t[r.charAt(s)]:0;++s;const h=s<r.length?t[r.charAt(s)]:64;++s;const x=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||c==null||h==null||x==null)throw new Of;const p=i<<2|c>>4;if(n.push(p),h!==64){const T=c<<4&240|h>>2;if(n.push(T),x!==64){const j=h<<6&192|x;n.push(j)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Of extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Vf=function(r){const e=ju(r);return Tu.encodeByteArray(e,!0)},Oa=function(r){return Vf(r).replace(/\./g,"")},Iu=function(r){try{return Tu.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ff=()=>Lf().__FIREBASE_DEFAULTS__,Uf=()=>{if(typeof process>"u"||typeof Oc>"u")return;const r=Oc.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Bf=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Iu(r[1]);return e&&JSON.parse(e)},ii=()=>{try{return Ff()||Uf()||Bf()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Su=r=>{var e,t;return(t=(e=ii())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},Au=r=>{const e=Su(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Cu=()=>{var r;return(r=ii())===null||r===void 0?void 0:r.config},Ru=r=>{var e;return(e=ii())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pu(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},r);return[Oa(JSON.stringify(t)),Oa(JSON.stringify(l)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ft(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Wf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ft())}function zf(){var r;const e=(r=ii())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Hf(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Gf(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Kf(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Qf(){const r=ft();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Yf(){return!zf()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Xf(){try{return typeof indexedDB=="object"}catch{return!1}}function Jf(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zf="FirebaseError";class nr extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=Zf,Object.setPrototypeOf(this,nr.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Vs.prototype.create)}}class Vs{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],l=i?e0(i,n):"Error",c=`${this.serviceName}: ${l} (${s}).`;return new nr(s,c,n)}}function e0(r,e){return r.replace(t0,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const t0=/\{\$([^}]+)}/g;function r0(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Va(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],l=e[s];if(Vc(i)&&Vc(l)){if(!Va(i,l))return!1}else if(i!==l)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function Vc(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ls(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function n0(r,e){const t=new s0(r,e);return t.subscribe.bind(t)}class s0{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");a0(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=Bi),s.error===void 0&&(s.error=Bi),s.complete===void 0&&(s.complete=Bi);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function a0(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Bi(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(r){return r&&r._delegate?r._delegate:r}class Lr{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i0{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new qf;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(l0(e))try{this.getOrInitializeService({instanceIdentifier:Qr})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=Qr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Qr){return this.instances.has(e)}getOptions(e=Qr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,l]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);n===c&&l.resolve(s)}return s}onInit(e,t){var n;const s=this.normalizeInstanceIdentifier(t),i=(n=this.onInitCallbacks.get(s))!==null&&n!==void 0?n:new Set;i.add(e),this.onInitCallbacks.set(s,i);const l=this.instances.get(s);return l&&e(l,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:o0(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Qr){return this.component?this.component.multipleInstances?e:Qr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function o0(r){return r===Qr?void 0:r}function l0(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c0{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new i0(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ie;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Ie||(Ie={}));const d0={debug:Ie.DEBUG,verbose:Ie.VERBOSE,info:Ie.INFO,warn:Ie.WARN,error:Ie.ERROR,silent:Ie.SILENT},u0=Ie.INFO,h0={[Ie.DEBUG]:"log",[Ie.VERBOSE]:"log",[Ie.INFO]:"info",[Ie.WARN]:"warn",[Ie.ERROR]:"error"},m0=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=h0[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Bo{constructor(e){this.name=e,this._logLevel=u0,this._logHandler=m0,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Ie))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?d0[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Ie.DEBUG,...e),this._logHandler(this,Ie.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Ie.VERBOSE,...e),this._logHandler(this,Ie.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Ie.INFO,...e),this._logHandler(this,Ie.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Ie.WARN,...e),this._logHandler(this,Ie.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Ie.ERROR,...e),this._logHandler(this,Ie.ERROR,...e)}}const g0=(r,e)=>e.some(t=>r instanceof t);let Lc,Fc;function f0(){return Lc||(Lc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function p0(){return Fc||(Fc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Du=new WeakMap,co=new WeakMap,$u=new WeakMap,qi=new WeakMap,qo=new WeakMap;function x0(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",l)},i=()=>{t(Dr(r.result)),s()},l=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&Du.set(t,r)}).catch(()=>{}),qo.set(e,r),e}function y0(r){if(co.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",l),r.removeEventListener("abort",l)},i=()=>{t(),s()},l=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",l),r.addEventListener("abort",l)});co.set(r,e)}let uo={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return co.get(r);if(e==="objectStoreNames")return r.objectStoreNames||$u.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Dr(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function b0(r){uo=r(uo)}function v0(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(Wi(this),e,...t);return $u.set(n,e.sort?e.sort():[e]),Dr(n)}:p0().includes(r)?function(...e){return r.apply(Wi(this),e),Dr(Du.get(this))}:function(...e){return Dr(r.apply(Wi(this),e))}}function w0(r){return typeof r=="function"?v0(r):(r instanceof IDBTransaction&&y0(r),g0(r,f0())?new Proxy(r,uo):r)}function Dr(r){if(r instanceof IDBRequest)return x0(r);if(qi.has(r))return qi.get(r);const e=w0(r);return e!==r&&(qi.set(r,e),qo.set(e,r)),e}const Wi=r=>qo.get(r);function _0(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const l=indexedDB.open(r,e),c=Dr(l);return n&&l.addEventListener("upgradeneeded",d=>{n(Dr(l.result),d.oldVersion,d.newVersion,Dr(l.transaction),d)}),t&&l.addEventListener("blocked",d=>t(d.oldVersion,d.newVersion,d)),c.then(d=>{i&&d.addEventListener("close",()=>i()),s&&d.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const E0=["get","getKey","getAll","getAllKeys","count"],k0=["put","add","delete","clear"],zi=new Map;function Uc(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(zi.get(e))return zi.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=k0.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||E0.includes(t)))return;const i=async function(l,...c){const d=this.transaction(l,s?"readwrite":"readonly");let h=d.store;return n&&(h=h.index(c.shift())),(await Promise.all([h[t](...c),s&&d.done]))[0]};return zi.set(e,i),i}b0(r=>({...r,get:(e,t,n)=>Uc(e,t)||r.get(e,t,n),has:(e,t)=>!!Uc(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N0{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(j0(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function j0(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ho="@firebase/app",Bc="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gr=new Bo("@firebase/app"),T0="@firebase/app-compat",I0="@firebase/analytics-compat",S0="@firebase/analytics",A0="@firebase/app-check-compat",C0="@firebase/app-check",R0="@firebase/auth",P0="@firebase/auth-compat",D0="@firebase/database",$0="@firebase/data-connect",M0="@firebase/database-compat",O0="@firebase/functions",V0="@firebase/functions-compat",L0="@firebase/installations",F0="@firebase/installations-compat",U0="@firebase/messaging",B0="@firebase/messaging-compat",q0="@firebase/performance",W0="@firebase/performance-compat",z0="@firebase/remote-config",H0="@firebase/remote-config-compat",G0="@firebase/storage",K0="@firebase/storage-compat",Q0="@firebase/firestore",Y0="@firebase/vertexai-preview",X0="@firebase/firestore-compat",J0="firebase",Z0="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mo="[DEFAULT]",ep={[ho]:"fire-core",[T0]:"fire-core-compat",[S0]:"fire-analytics",[I0]:"fire-analytics-compat",[C0]:"fire-app-check",[A0]:"fire-app-check-compat",[R0]:"fire-auth",[P0]:"fire-auth-compat",[D0]:"fire-rtdb",[$0]:"fire-data-connect",[M0]:"fire-rtdb-compat",[O0]:"fire-fn",[V0]:"fire-fn-compat",[L0]:"fire-iid",[F0]:"fire-iid-compat",[U0]:"fire-fcm",[B0]:"fire-fcm-compat",[q0]:"fire-perf",[W0]:"fire-perf-compat",[z0]:"fire-rc",[H0]:"fire-rc-compat",[G0]:"fire-gcs",[K0]:"fire-gcs-compat",[Q0]:"fire-fst",[X0]:"fire-fst-compat",[Y0]:"fire-vertex","fire-js":"fire-js",[J0]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const La=new Map,tp=new Map,go=new Map;function qc(r,e){try{r.container.addComponent(e)}catch(t){gr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function nn(r){const e=r.name;if(go.has(e))return gr.debug(`There were multiple attempts to register component ${e}.`),!1;go.set(e,r);for(const t of La.values())qc(t,r);for(const t of tp.values())qc(t,r);return!0}function oi(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Ar(r){return r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},$r=new Vs("app","Firebase",rp);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Lr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw $r.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hn=Z0;function Mu(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:mo,automaticDataCollectionEnabled:!1},e),s=n.name;if(typeof s!="string"||!s)throw $r.create("bad-app-name",{appName:String(s)});if(t||(t=Cu()),!t)throw $r.create("no-options");const i=La.get(s);if(i){if(Va(t,i.options)&&Va(n,i.config))return i;throw $r.create("duplicate-app",{appName:s})}const l=new c0(s);for(const d of go.values())l.addComponent(d);const c=new np(t,n,l);return La.set(s,c),c}function Wo(r=mo){const e=La.get(r);if(!e&&r===mo&&Cu())return Mu();if(!e)throw $r.create("no-app",{appName:r});return e}function Kt(r,e,t){var n;let s=(n=ep[r])!==null&&n!==void 0?n:r;t&&(s+=`-${t}`);const i=s.match(/\s|\//),l=e.match(/\s|\//);if(i||l){const c=[`Unable to register library "${s}" with version "${e}":`];i&&c.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&l&&c.push("and"),l&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),gr.warn(c.join(" "));return}nn(new Lr(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sp="firebase-heartbeat-database",ap=1,js="firebase-heartbeat-store";let Hi=null;function Ou(){return Hi||(Hi=_0(sp,ap,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(js)}catch(t){console.warn(t)}}}}).catch(r=>{throw $r.create("idb-open",{originalErrorMessage:r.message})})),Hi}async function ip(r){try{const t=(await Ou()).transaction(js),n=await t.objectStore(js).get(Vu(r));return await t.done,n}catch(e){if(e instanceof nr)gr.warn(e.message);else{const t=$r.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});gr.warn(t.message)}}}async function Wc(r,e){try{const n=(await Ou()).transaction(js,"readwrite");await n.objectStore(js).put(e,Vu(r)),await n.done}catch(t){if(t instanceof nr)gr.warn(t.message);else{const n=$r.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});gr.warn(n.message)}}}function Vu(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const op=1024,lp=30*24*60*60*1e3;class cp{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new up(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=zc();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(l=>l.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(l=>{const c=new Date(l.date).valueOf();return Date.now()-c<=lp}),this._storage.overwrite(this._heartbeatsCache))}catch(n){gr.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=zc(),{heartbeatsToSend:n,unsentEntries:s}=dp(this._heartbeatsCache.heartbeats),i=Oa(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return gr.warn(t),""}}}function zc(){return new Date().toISOString().substring(0,10)}function dp(r,e=op){const t=[];let n=r.slice();for(const s of r){const i=t.find(l=>l.agent===s.agent);if(i){if(i.dates.push(s.date),Hc(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Hc(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class up{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Xf()?Jf().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await ip(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Wc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Wc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Hc(r){return Oa(JSON.stringify({version:2,heartbeats:r})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hp(r){nn(new Lr("platform-logger",e=>new N0(e),"PRIVATE")),nn(new Lr("heartbeat",e=>new cp(e),"PRIVATE")),Kt(ho,Bc,r),Kt(ho,Bc,"esm2017"),Kt("fire-js","")}hp("");var Gc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var en,Lu;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(_,y){function b(){}b.prototype=y.prototype,_.D=y.prototype,_.prototype=new b,_.prototype.constructor=_,_.C=function(w,k,N){for(var f=Array(arguments.length-2),O=2;O<arguments.length;O++)f[O-2]=arguments[O];return y.prototype[k].apply(w,f)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(_,y,b){b||(b=0);var w=Array(16);if(typeof y=="string")for(var k=0;16>k;++k)w[k]=y.charCodeAt(b++)|y.charCodeAt(b++)<<8|y.charCodeAt(b++)<<16|y.charCodeAt(b++)<<24;else for(k=0;16>k;++k)w[k]=y[b++]|y[b++]<<8|y[b++]<<16|y[b++]<<24;y=_.g[0],b=_.g[1],k=_.g[2];var N=_.g[3],f=y+(N^b&(k^N))+w[0]+3614090360&4294967295;y=b+(f<<7&4294967295|f>>>25),f=N+(k^y&(b^k))+w[1]+3905402710&4294967295,N=y+(f<<12&4294967295|f>>>20),f=k+(b^N&(y^b))+w[2]+606105819&4294967295,k=N+(f<<17&4294967295|f>>>15),f=b+(y^k&(N^y))+w[3]+3250441966&4294967295,b=k+(f<<22&4294967295|f>>>10),f=y+(N^b&(k^N))+w[4]+4118548399&4294967295,y=b+(f<<7&4294967295|f>>>25),f=N+(k^y&(b^k))+w[5]+1200080426&4294967295,N=y+(f<<12&4294967295|f>>>20),f=k+(b^N&(y^b))+w[6]+2821735955&4294967295,k=N+(f<<17&4294967295|f>>>15),f=b+(y^k&(N^y))+w[7]+4249261313&4294967295,b=k+(f<<22&4294967295|f>>>10),f=y+(N^b&(k^N))+w[8]+1770035416&4294967295,y=b+(f<<7&4294967295|f>>>25),f=N+(k^y&(b^k))+w[9]+2336552879&4294967295,N=y+(f<<12&4294967295|f>>>20),f=k+(b^N&(y^b))+w[10]+4294925233&4294967295,k=N+(f<<17&4294967295|f>>>15),f=b+(y^k&(N^y))+w[11]+2304563134&4294967295,b=k+(f<<22&4294967295|f>>>10),f=y+(N^b&(k^N))+w[12]+1804603682&4294967295,y=b+(f<<7&4294967295|f>>>25),f=N+(k^y&(b^k))+w[13]+4254626195&4294967295,N=y+(f<<12&4294967295|f>>>20),f=k+(b^N&(y^b))+w[14]+2792965006&4294967295,k=N+(f<<17&4294967295|f>>>15),f=b+(y^k&(N^y))+w[15]+1236535329&4294967295,b=k+(f<<22&4294967295|f>>>10),f=y+(k^N&(b^k))+w[1]+4129170786&4294967295,y=b+(f<<5&4294967295|f>>>27),f=N+(b^k&(y^b))+w[6]+3225465664&4294967295,N=y+(f<<9&4294967295|f>>>23),f=k+(y^b&(N^y))+w[11]+643717713&4294967295,k=N+(f<<14&4294967295|f>>>18),f=b+(N^y&(k^N))+w[0]+3921069994&4294967295,b=k+(f<<20&4294967295|f>>>12),f=y+(k^N&(b^k))+w[5]+3593408605&4294967295,y=b+(f<<5&4294967295|f>>>27),f=N+(b^k&(y^b))+w[10]+38016083&4294967295,N=y+(f<<9&4294967295|f>>>23),f=k+(y^b&(N^y))+w[15]+3634488961&4294967295,k=N+(f<<14&4294967295|f>>>18),f=b+(N^y&(k^N))+w[4]+3889429448&4294967295,b=k+(f<<20&4294967295|f>>>12),f=y+(k^N&(b^k))+w[9]+568446438&4294967295,y=b+(f<<5&4294967295|f>>>27),f=N+(b^k&(y^b))+w[14]+3275163606&4294967295,N=y+(f<<9&4294967295|f>>>23),f=k+(y^b&(N^y))+w[3]+4107603335&4294967295,k=N+(f<<14&4294967295|f>>>18),f=b+(N^y&(k^N))+w[8]+1163531501&4294967295,b=k+(f<<20&4294967295|f>>>12),f=y+(k^N&(b^k))+w[13]+2850285829&4294967295,y=b+(f<<5&4294967295|f>>>27),f=N+(b^k&(y^b))+w[2]+4243563512&4294967295,N=y+(f<<9&4294967295|f>>>23),f=k+(y^b&(N^y))+w[7]+1735328473&4294967295,k=N+(f<<14&4294967295|f>>>18),f=b+(N^y&(k^N))+w[12]+2368359562&4294967295,b=k+(f<<20&4294967295|f>>>12),f=y+(b^k^N)+w[5]+4294588738&4294967295,y=b+(f<<4&4294967295|f>>>28),f=N+(y^b^k)+w[8]+2272392833&4294967295,N=y+(f<<11&4294967295|f>>>21),f=k+(N^y^b)+w[11]+1839030562&4294967295,k=N+(f<<16&4294967295|f>>>16),f=b+(k^N^y)+w[14]+4259657740&4294967295,b=k+(f<<23&4294967295|f>>>9),f=y+(b^k^N)+w[1]+2763975236&4294967295,y=b+(f<<4&4294967295|f>>>28),f=N+(y^b^k)+w[4]+1272893353&4294967295,N=y+(f<<11&4294967295|f>>>21),f=k+(N^y^b)+w[7]+4139469664&4294967295,k=N+(f<<16&4294967295|f>>>16),f=b+(k^N^y)+w[10]+3200236656&4294967295,b=k+(f<<23&4294967295|f>>>9),f=y+(b^k^N)+w[13]+681279174&4294967295,y=b+(f<<4&4294967295|f>>>28),f=N+(y^b^k)+w[0]+3936430074&4294967295,N=y+(f<<11&4294967295|f>>>21),f=k+(N^y^b)+w[3]+3572445317&4294967295,k=N+(f<<16&4294967295|f>>>16),f=b+(k^N^y)+w[6]+76029189&4294967295,b=k+(f<<23&4294967295|f>>>9),f=y+(b^k^N)+w[9]+3654602809&4294967295,y=b+(f<<4&4294967295|f>>>28),f=N+(y^b^k)+w[12]+3873151461&4294967295,N=y+(f<<11&4294967295|f>>>21),f=k+(N^y^b)+w[15]+530742520&4294967295,k=N+(f<<16&4294967295|f>>>16),f=b+(k^N^y)+w[2]+3299628645&4294967295,b=k+(f<<23&4294967295|f>>>9),f=y+(k^(b|~N))+w[0]+4096336452&4294967295,y=b+(f<<6&4294967295|f>>>26),f=N+(b^(y|~k))+w[7]+1126891415&4294967295,N=y+(f<<10&4294967295|f>>>22),f=k+(y^(N|~b))+w[14]+2878612391&4294967295,k=N+(f<<15&4294967295|f>>>17),f=b+(N^(k|~y))+w[5]+4237533241&4294967295,b=k+(f<<21&4294967295|f>>>11),f=y+(k^(b|~N))+w[12]+1700485571&4294967295,y=b+(f<<6&4294967295|f>>>26),f=N+(b^(y|~k))+w[3]+2399980690&4294967295,N=y+(f<<10&4294967295|f>>>22),f=k+(y^(N|~b))+w[10]+4293915773&4294967295,k=N+(f<<15&4294967295|f>>>17),f=b+(N^(k|~y))+w[1]+2240044497&4294967295,b=k+(f<<21&4294967295|f>>>11),f=y+(k^(b|~N))+w[8]+1873313359&4294967295,y=b+(f<<6&4294967295|f>>>26),f=N+(b^(y|~k))+w[15]+4264355552&4294967295,N=y+(f<<10&4294967295|f>>>22),f=k+(y^(N|~b))+w[6]+2734768916&4294967295,k=N+(f<<15&4294967295|f>>>17),f=b+(N^(k|~y))+w[13]+1309151649&4294967295,b=k+(f<<21&4294967295|f>>>11),f=y+(k^(b|~N))+w[4]+4149444226&4294967295,y=b+(f<<6&4294967295|f>>>26),f=N+(b^(y|~k))+w[11]+3174756917&4294967295,N=y+(f<<10&4294967295|f>>>22),f=k+(y^(N|~b))+w[2]+718787259&4294967295,k=N+(f<<15&4294967295|f>>>17),f=b+(N^(k|~y))+w[9]+3951481745&4294967295,_.g[0]=_.g[0]+y&4294967295,_.g[1]=_.g[1]+(k+(f<<21&4294967295|f>>>11))&4294967295,_.g[2]=_.g[2]+k&4294967295,_.g[3]=_.g[3]+N&4294967295}n.prototype.u=function(_,y){y===void 0&&(y=_.length);for(var b=y-this.blockSize,w=this.B,k=this.h,N=0;N<y;){if(k==0)for(;N<=b;)s(this,_,N),N+=this.blockSize;if(typeof _=="string"){for(;N<y;)if(w[k++]=_.charCodeAt(N++),k==this.blockSize){s(this,w),k=0;break}}else for(;N<y;)if(w[k++]=_[N++],k==this.blockSize){s(this,w),k=0;break}}this.h=k,this.o+=y},n.prototype.v=function(){var _=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);_[0]=128;for(var y=1;y<_.length-8;++y)_[y]=0;var b=8*this.o;for(y=_.length-8;y<_.length;++y)_[y]=b&255,b/=256;for(this.u(_),_=Array(16),y=b=0;4>y;++y)for(var w=0;32>w;w+=8)_[b++]=this.g[y]>>>w&255;return _};function i(_,y){var b=c;return Object.prototype.hasOwnProperty.call(b,_)?b[_]:b[_]=y(_)}function l(_,y){this.h=y;for(var b=[],w=!0,k=_.length-1;0<=k;k--){var N=_[k]|0;w&&N==y||(b[k]=N,w=!1)}this.g=b}var c={};function d(_){return-128<=_&&128>_?i(_,function(y){return new l([y|0],0>y?-1:0)}):new l([_|0],0>_?-1:0)}function h(_){if(isNaN(_)||!isFinite(_))return x;if(0>_)return I(h(-_));for(var y=[],b=1,w=0;_>=b;w++)y[w]=_/b|0,b*=4294967296;return new l(y,0)}function g(_,y){if(_.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(_.charAt(0)=="-")return I(g(_.substring(1),y));if(0<=_.indexOf("-"))throw Error('number format error: interior "-" character');for(var b=h(Math.pow(y,8)),w=x,k=0;k<_.length;k+=8){var N=Math.min(8,_.length-k),f=parseInt(_.substring(k,k+N),y);8>N?(N=h(Math.pow(y,N)),w=w.j(N).add(h(f))):(w=w.j(b),w=w.add(h(f)))}return w}var x=d(0),p=d(1),T=d(16777216);r=l.prototype,r.m=function(){if(E(this))return-I(this).m();for(var _=0,y=1,b=0;b<this.g.length;b++){var w=this.i(b);_+=(0<=w?w:4294967296+w)*y,y*=4294967296}return _},r.toString=function(_){if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(j(this))return"0";if(E(this))return"-"+I(this).toString(_);for(var y=h(Math.pow(_,6)),b=this,w="";;){var k=F(b,y).g;b=D(b,k.j(y));var N=((0<b.g.length?b.g[0]:b.h)>>>0).toString(_);if(b=k,j(b))return N+w;for(;6>N.length;)N="0"+N;w=N+w}},r.i=function(_){return 0>_?0:_<this.g.length?this.g[_]:this.h};function j(_){if(_.h!=0)return!1;for(var y=0;y<_.g.length;y++)if(_.g[y]!=0)return!1;return!0}function E(_){return _.h==-1}r.l=function(_){return _=D(this,_),E(_)?-1:j(_)?0:1};function I(_){for(var y=_.g.length,b=[],w=0;w<y;w++)b[w]=~_.g[w];return new l(b,~_.h).add(p)}r.abs=function(){return E(this)?I(this):this},r.add=function(_){for(var y=Math.max(this.g.length,_.g.length),b=[],w=0,k=0;k<=y;k++){var N=w+(this.i(k)&65535)+(_.i(k)&65535),f=(N>>>16)+(this.i(k)>>>16)+(_.i(k)>>>16);w=f>>>16,N&=65535,f&=65535,b[k]=f<<16|N}return new l(b,b[b.length-1]&-2147483648?-1:0)};function D(_,y){return _.add(I(y))}r.j=function(_){if(j(this)||j(_))return x;if(E(this))return E(_)?I(this).j(I(_)):I(I(this).j(_));if(E(_))return I(this.j(I(_)));if(0>this.l(T)&&0>_.l(T))return h(this.m()*_.m());for(var y=this.g.length+_.g.length,b=[],w=0;w<2*y;w++)b[w]=0;for(w=0;w<this.g.length;w++)for(var k=0;k<_.g.length;k++){var N=this.i(w)>>>16,f=this.i(w)&65535,O=_.i(k)>>>16,Q=_.i(k)&65535;b[2*w+2*k]+=f*Q,S(b,2*w+2*k),b[2*w+2*k+1]+=N*Q,S(b,2*w+2*k+1),b[2*w+2*k+1]+=f*O,S(b,2*w+2*k+1),b[2*w+2*k+2]+=N*O,S(b,2*w+2*k+2)}for(w=0;w<y;w++)b[w]=b[2*w+1]<<16|b[2*w];for(w=y;w<2*y;w++)b[w]=0;return new l(b,0)};function S(_,y){for(;(_[y]&65535)!=_[y];)_[y+1]+=_[y]>>>16,_[y]&=65535,y++}function C(_,y){this.g=_,this.h=y}function F(_,y){if(j(y))throw Error("division by zero");if(j(_))return new C(x,x);if(E(_))return y=F(I(_),y),new C(I(y.g),I(y.h));if(E(y))return y=F(_,I(y)),new C(I(y.g),y.h);if(30<_.g.length){if(E(_)||E(y))throw Error("slowDivide_ only works with positive integers.");for(var b=p,w=y;0>=w.l(_);)b=ne(b),w=ne(w);var k=B(b,1),N=B(w,1);for(w=B(w,2),b=B(b,2);!j(w);){var f=N.add(w);0>=f.l(_)&&(k=k.add(b),N=f),w=B(w,1),b=B(b,1)}return y=D(_,k.j(y)),new C(k,y)}for(k=x;0<=_.l(y);){for(b=Math.max(1,Math.floor(_.m()/y.m())),w=Math.ceil(Math.log(b)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),N=h(b),f=N.j(y);E(f)||0<f.l(_);)b-=w,N=h(b),f=N.j(y);j(N)&&(N=p),k=k.add(N),_=D(_,f)}return new C(k,_)}r.A=function(_){return F(this,_).h},r.and=function(_){for(var y=Math.max(this.g.length,_.g.length),b=[],w=0;w<y;w++)b[w]=this.i(w)&_.i(w);return new l(b,this.h&_.h)},r.or=function(_){for(var y=Math.max(this.g.length,_.g.length),b=[],w=0;w<y;w++)b[w]=this.i(w)|_.i(w);return new l(b,this.h|_.h)},r.xor=function(_){for(var y=Math.max(this.g.length,_.g.length),b=[],w=0;w<y;w++)b[w]=this.i(w)^_.i(w);return new l(b,this.h^_.h)};function ne(_){for(var y=_.g.length+1,b=[],w=0;w<y;w++)b[w]=_.i(w)<<1|_.i(w-1)>>>31;return new l(b,_.h)}function B(_,y){var b=y>>5;y%=32;for(var w=_.g.length-b,k=[],N=0;N<w;N++)k[N]=0<y?_.i(N+b)>>>y|_.i(N+b+1)<<32-y:_.i(N+b);return new l(k,_.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,Lu=n,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=h,l.fromString=g,en=l}).apply(typeof Gc<"u"?Gc:typeof self<"u"?self:typeof window<"u"?window:{});var xa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Fu,fs,Uu,Ta,fo,Bu,qu,Wu;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,m){return o==Array.prototype||o==Object.prototype||(o[u]=m.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof xa=="object"&&xa];for(var u=0;u<o.length;++u){var m=o[u];if(m&&m.Math==Math)return m}throw Error("Cannot find global object")}var n=t(this);function s(o,u){if(u)e:{var m=n;o=o.split(".");for(var v=0;v<o.length-1;v++){var R=o[v];if(!(R in m))break e;m=m[R]}o=o[o.length-1],v=m[o],u=u(v),u!=v&&u!=null&&e(m,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var m=0,v=!1,R={next:function(){if(!v&&m<o.length){var M=m++;return{value:u(M,o[M]),done:!1}}return v=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}s("Array.prototype.values",function(o){return o||function(){return i(this,function(u,m){return m})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},c=this||self;function d(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function h(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function g(o,u,m){return o.call.apply(o.bind,arguments)}function x(o,u,m){if(!o)throw Error();if(2<arguments.length){var v=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,v),o.apply(u,R)}}return function(){return o.apply(u,arguments)}}function p(o,u,m){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?g:x,p.apply(null,arguments)}function T(o,u){var m=Array.prototype.slice.call(arguments,1);return function(){var v=m.slice();return v.push.apply(v,arguments),o.apply(this,v)}}function j(o,u){function m(){}m.prototype=u.prototype,o.aa=u.prototype,o.prototype=new m,o.prototype.constructor=o,o.Qb=function(v,R,M){for(var te=Array(arguments.length-2),Oe=2;Oe<arguments.length;Oe++)te[Oe-2]=arguments[Oe];return u.prototype[R].apply(v,te)}}function E(o){const u=o.length;if(0<u){const m=Array(u);for(let v=0;v<u;v++)m[v]=o[v];return m}return[]}function I(o,u){for(let m=1;m<arguments.length;m++){const v=arguments[m];if(d(v)){const R=o.length||0,M=v.length||0;o.length=R+M;for(let te=0;te<M;te++)o[R+te]=v[te]}else o.push(v)}}class D{constructor(u,m){this.i=u,this.j=m,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function S(o){return/^[\s\xa0]*$/.test(o)}function C(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function F(o){return F[" "](o),o}F[" "]=function(){};var ne=C().indexOf("Gecko")!=-1&&!(C().toLowerCase().indexOf("webkit")!=-1&&C().indexOf("Edge")==-1)&&!(C().indexOf("Trident")!=-1||C().indexOf("MSIE")!=-1)&&C().indexOf("Edge")==-1;function B(o,u,m){for(const v in o)u.call(m,o[v],v,o)}function _(o,u){for(const m in o)u.call(void 0,o[m],m,o)}function y(o){const u={};for(const m in o)u[m]=o[m];return u}const b="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(o,u){let m,v;for(let R=1;R<arguments.length;R++){v=arguments[R];for(m in v)o[m]=v[m];for(let M=0;M<b.length;M++)m=b[M],Object.prototype.hasOwnProperty.call(v,m)&&(o[m]=v[m])}}function k(o){var u=1;o=o.split(":");const m=[];for(;0<u&&o.length;)m.push(o.shift()),u--;return o.length&&m.push(o.join(":")),m}function N(o){c.setTimeout(()=>{throw o},0)}function f(){var o=H;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class O{constructor(){this.h=this.g=null}add(u,m){const v=Q.get();v.set(u,m),this.h?this.h.next=v:this.g=v,this.h=v}}var Q=new D(()=>new P,o=>o.reset());class P{constructor(){this.next=this.g=this.h=null}set(u,m){this.h=u,this.g=m,this.next=null}reset(){this.next=this.g=this.h=null}}let $,K=!1,H=new O,Z=()=>{const o=c.Promise.resolve(void 0);$=()=>{o.then(ce)}};var ce=()=>{for(var o;o=f();){try{o.h.call(o.g)}catch(m){N(m)}var u=Q;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}K=!1};function q(){this.s=this.s,this.C=this.C}q.prototype.s=!1,q.prototype.ma=function(){this.s||(this.s=!0,this.N())},q.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function W(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}W.prototype.h=function(){this.defaultPrevented=!0};var le=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const m=()=>{};c.addEventListener("test",m,u),c.removeEventListener("test",m,u)}catch{}return o}();function Ee(o,u){if(W.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var m=this.type=o.type,v=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(ne){e:{try{F(u.nodeName);var R=!0;break e}catch{}R=!1}R||(u=null)}}else m=="mouseover"?u=o.fromElement:m=="mouseout"&&(u=o.toElement);this.relatedTarget=u,v?(this.clientX=v.clientX!==void 0?v.clientX:v.pageX,this.clientY=v.clientY!==void 0?v.clientY:v.pageY,this.screenX=v.screenX||0,this.screenY=v.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:L[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Ee.aa.h.call(this)}}j(Ee,W);var L={2:"touch",3:"pen",4:"mouse"};Ee.prototype.h=function(){Ee.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var V="closure_listenable_"+(1e6*Math.random()|0),X=0;function se(o,u,m,v,R){this.listener=o,this.proxy=null,this.src=u,this.type=m,this.capture=!!v,this.ha=R,this.key=++X,this.da=this.fa=!1}function J(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function z(o){this.src=o,this.g={},this.h=0}z.prototype.add=function(o,u,m,v,R){var M=o.toString();o=this.g[M],o||(o=this.g[M]=[],this.h++);var te=ke(o,u,v,R);return-1<te?(u=o[te],m||(u.fa=!1)):(u=new se(u,this.src,M,!!v,R),u.fa=m,o.push(u)),u};function ee(o,u){var m=u.type;if(m in o.g){var v=o.g[m],R=Array.prototype.indexOf.call(v,u,void 0),M;(M=0<=R)&&Array.prototype.splice.call(v,R,1),M&&(J(u),o.g[m].length==0&&(delete o.g[m],o.h--))}}function ke(o,u,m,v){for(var R=0;R<o.length;++R){var M=o[R];if(!M.da&&M.listener==u&&M.capture==!!m&&M.ha==v)return R}return-1}var pe="closure_lm_"+(1e6*Math.random()|0),Ne={};function Xe(o,u,m,v,R){if(Array.isArray(u)){for(var M=0;M<u.length;M++)Xe(o,u[M],m,v,R);return null}return m=je(m),o&&o[V]?o.K(u,m,h(v)?!!v.capture:!1,R):ie(o,u,m,!1,v,R)}function ie(o,u,m,v,R,M){if(!u)throw Error("Invalid event type");var te=h(R)?!!R.capture:!!R,Oe=Mt(o);if(Oe||(o[pe]=Oe=new z(o)),m=Oe.add(u,m,v,te,M),m.proxy)return m;if(v=re(),m.proxy=v,v.src=o,v.listener=m,o.addEventListener)le||(R=te),R===void 0&&(R=!1),o.addEventListener(u.toString(),v,R);else if(o.attachEvent)o.attachEvent(Ge(u.toString()),v);else if(o.addListener&&o.removeListener)o.addListener(v);else throw Error("addEventListener and attachEvent are unavailable.");return m}function re(){function o(m){return u.call(o.src,o.listener,m)}const u=It;return o}function Fe(o,u,m,v,R){if(Array.isArray(u))for(var M=0;M<u.length;M++)Fe(o,u[M],m,v,R);else v=h(v)?!!v.capture:!!v,m=je(m),o&&o[V]?(o=o.i,u=String(u).toString(),u in o.g&&(M=o.g[u],m=ke(M,m,v,R),-1<m&&(J(M[m]),Array.prototype.splice.call(M,m,1),M.length==0&&(delete o.g[u],o.h--)))):o&&(o=Mt(o))&&(u=o.g[u.toString()],o=-1,u&&(o=ke(u,m,v,R)),(m=-1<o?u[o]:null)&&Je(m))}function Je(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[V])ee(u.i,o);else{var m=o.type,v=o.proxy;u.removeEventListener?u.removeEventListener(m,v,o.capture):u.detachEvent?u.detachEvent(Ge(m),v):u.addListener&&u.removeListener&&u.removeListener(v),(m=Mt(u))?(ee(m,o),m.h==0&&(m.src=null,u[pe]=null)):J(o)}}}function Ge(o){return o in Ne?Ne[o]:Ne[o]="on"+o}function It(o,u){if(o.da)o=!0;else{u=new Ee(u,this);var m=o.listener,v=o.ha||o.src;o.fa&&Je(o),o=m.call(v,u)}return o}function Mt(o){return o=o[pe],o instanceof z?o:null}var xe="__closure_events_fn_"+(1e9*Math.random()>>>0);function je(o){return typeof o=="function"?o:(o[xe]||(o[xe]=function(u){return o.handleEvent(u)}),o[xe])}function Le(){q.call(this),this.i=new z(this),this.M=this,this.F=null}j(Le,q),Le.prototype[V]=!0,Le.prototype.removeEventListener=function(o,u,m,v){Fe(this,o,u,m,v)};function st(o,u){var m,v=o.F;if(v)for(m=[];v;v=v.F)m.push(v);if(o=o.M,v=u.type||u,typeof u=="string")u=new W(u,o);else if(u instanceof W)u.target=u.target||o;else{var R=u;u=new W(v,o),w(u,R)}if(R=!0,m)for(var M=m.length-1;0<=M;M--){var te=u.g=m[M];R=xn(te,v,!0,u)&&R}if(te=u.g=o,R=xn(te,v,!0,u)&&R,R=xn(te,v,!1,u)&&R,m)for(M=0;M<m.length;M++)te=u.g=m[M],R=xn(te,v,!1,u)&&R}Le.prototype.N=function(){if(Le.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var m=o.g[u],v=0;v<m.length;v++)J(m[v]);delete o.g[u],o.h--}}this.F=null},Le.prototype.K=function(o,u,m,v){return this.i.add(String(o),u,!1,m,v)},Le.prototype.L=function(o,u,m,v){return this.i.add(String(o),u,!0,m,v)};function xn(o,u,m,v){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var R=!0,M=0;M<u.length;++M){var te=u[M];if(te&&!te.da&&te.capture==m){var Oe=te.listener,at=te.ha||te.src;te.fa&&ee(o.i,te),R=Oe.call(at,v)!==!1&&R}}return R&&!v.defaultPrevented}function Js(o,u,m){if(typeof o=="function")m&&(o=p(o,m));else if(o&&typeof o.handleEvent=="function")o=p(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:c.setTimeout(o,u||0)}function Zs(o){o.g=Js(()=>{o.g=null,o.i&&(o.i=!1,Zs(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class ji extends q{constructor(u,m){super(),this.m=u,this.l=m,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Zs(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Wr(o){q.call(this),this.h=o,this.g={}}j(Wr,q);var ea=[];function es(o){B(o.g,function(u,m){this.g.hasOwnProperty(m)&&Je(u)},o),o.g={}}Wr.prototype.N=function(){Wr.aa.N.call(this),es(this)},Wr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ts=c.JSON.stringify,ta=c.JSON.parse,Ti=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function rs(){}rs.prototype.h=null;function ns(o){return o.h||(o.h=o.i())}function ra(){}var zr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function yn(){W.call(this,"d")}j(yn,W);function U(){W.call(this,"c")}j(U,W);var ae={},fe=null;function ge(){return fe=fe||new Le}ae.La="serverreachability";function Pe(o){W.call(this,ae.La,o)}j(Pe,W);function qe(o){const u=ge();st(u,new Pe(u))}ae.STAT_EVENT="statevent";function kt(o,u){W.call(this,ae.STAT_EVENT,o),this.stat=u}j(kt,W);function De(o){const u=ge();st(u,new kt(u,o))}ae.Ma="timingevent";function bt(o,u){W.call(this,ae.Ma,o),this.size=u}j(bt,W);function vt(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},u)}function Dt(){this.g=!0}Dt.prototype.xa=function(){this.g=!1};function wt(o,u,m,v,R,M){o.info(function(){if(o.g)if(M)for(var te="",Oe=M.split("&"),at=0;at<Oe.length;at++){var Ae=Oe[at].split("=");if(1<Ae.length){var dt=Ae[0];Ae=Ae[1];var ut=dt.split("_");te=2<=ut.length&&ut[1]=="type"?te+(dt+"="+Ae+"&"):te+(dt+"=redacted&")}}else te=null;else te=M;return"XMLHTTP REQ ("+v+") [attempt "+R+"]: "+u+`
`+m+`
`+te})}function Nt(o,u,m,v,R,M,te){o.info(function(){return"XMLHTTP RESP ("+v+") [ attempt "+R+"]: "+u+`
`+m+`
`+M+" "+te})}function vr(o,u,m,v){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+ng(o,m)+(v?" "+v:"")})}function Ii(o,u){o.info(function(){return"TIMEOUT: "+u})}Dt.prototype.info=function(){};function ng(o,u){if(!o.g)return u;if(!u)return null;try{var m=JSON.parse(u);if(m){for(o=0;o<m.length;o++)if(Array.isArray(m[o])){var v=m[o];if(!(2>v.length)){var R=v[1];if(Array.isArray(R)&&!(1>R.length)){var M=R[0];if(M!="noop"&&M!="stop"&&M!="close")for(var te=1;te<R.length;te++)R[te]=""}}}}return ts(m)}catch{return u}}var na={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Fl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Si;function sa(){}j(sa,rs),sa.prototype.g=function(){return new XMLHttpRequest},sa.prototype.i=function(){return{}},Si=new sa;function wr(o,u,m,v){this.j=o,this.i=u,this.l=m,this.R=v||1,this.U=new Wr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ul}function Ul(){this.i=null,this.g="",this.h=!1}var Bl={},Ai={};function Ci(o,u,m){o.L=1,o.v=la(ar(u)),o.m=m,o.P=!0,ql(o,null)}function ql(o,u){o.F=Date.now(),aa(o),o.A=ar(o.v);var m=o.A,v=o.R;Array.isArray(v)||(v=[String(v)]),nc(m.i,"t",v),o.C=0,m=o.j.J,o.h=new Ul,o.g=wc(o.j,m?u:null,!o.m),0<o.O&&(o.M=new ji(p(o.Y,o,o.g),o.O)),u=o.U,m=o.g,v=o.ca;var R="readystatechange";Array.isArray(R)||(R&&(ea[0]=R.toString()),R=ea);for(var M=0;M<R.length;M++){var te=Xe(m,R[M],v||u.handleEvent,!1,u.h||u);if(!te)break;u.g[te.key]=te}u=o.H?y(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),qe(),wt(o.i,o.u,o.A,o.l,o.R,o.m)}wr.prototype.ca=function(o){o=o.target;const u=this.M;u&&ir(o)==3?u.j():this.Y(o)},wr.prototype.Y=function(o){try{if(o==this.g)e:{const ut=ir(this.g);var u=this.g.Ba();const wn=this.g.Z();if(!(3>ut)&&(ut!=3||this.g&&(this.h.h||this.g.oa()||dc(this.g)))){this.J||ut!=4||u==7||(u==8||0>=wn?qe(3):qe(2)),Ri(this);var m=this.g.Z();this.X=m;t:if(Wl(this)){var v=dc(this.g);o="";var R=v.length,M=ir(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Hr(this),ss(this);var te="";break t}this.h.i=new c.TextDecoder}for(u=0;u<R;u++)this.h.h=!0,o+=this.h.i.decode(v[u],{stream:!(M&&u==R-1)});v.length=0,this.h.g+=o,this.C=0,te=this.h.g}else te=this.g.oa();if(this.o=m==200,Nt(this.i,this.u,this.A,this.l,this.R,ut,m),this.o){if(this.T&&!this.K){t:{if(this.g){var Oe,at=this.g;if((Oe=at.g?at.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!S(Oe)){var Ae=Oe;break t}}Ae=null}if(m=Ae)vr(this.i,this.l,m,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Pi(this,m);else{this.o=!1,this.s=3,De(12),Hr(this),ss(this);break e}}if(this.P){m=!0;let Ot;for(;!this.J&&this.C<te.length;)if(Ot=sg(this,te),Ot==Ai){ut==4&&(this.s=4,De(14),m=!1),vr(this.i,this.l,null,"[Incomplete Response]");break}else if(Ot==Bl){this.s=4,De(15),vr(this.i,this.l,te,"[Invalid Chunk]"),m=!1;break}else vr(this.i,this.l,Ot,null),Pi(this,Ot);if(Wl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ut!=4||te.length!=0||this.h.h||(this.s=1,De(16),m=!1),this.o=this.o&&m,!m)vr(this.i,this.l,te,"[Invalid Chunked Response]"),Hr(this),ss(this);else if(0<te.length&&!this.W){this.W=!0;var dt=this.j;dt.g==this&&dt.ba&&!dt.M&&(dt.j.info("Great, no buffering proxy detected. Bytes received: "+te.length),Li(dt),dt.M=!0,De(11))}}else vr(this.i,this.l,te,null),Pi(this,te);ut==4&&Hr(this),this.o&&!this.J&&(ut==4?xc(this.j,this):(this.o=!1,aa(this)))}else wg(this.g),m==400&&0<te.indexOf("Unknown SID")?(this.s=3,De(12)):(this.s=0,De(13)),Hr(this),ss(this)}}}catch{}finally{}};function Wl(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function sg(o,u){var m=o.C,v=u.indexOf(`
`,m);return v==-1?Ai:(m=Number(u.substring(m,v)),isNaN(m)?Bl:(v+=1,v+m>u.length?Ai:(u=u.slice(v,v+m),o.C=v+m,u)))}wr.prototype.cancel=function(){this.J=!0,Hr(this)};function aa(o){o.S=Date.now()+o.I,zl(o,o.I)}function zl(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=vt(p(o.ba,o),u)}function Ri(o){o.B&&(c.clearTimeout(o.B),o.B=null)}wr.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Ii(this.i,this.A),this.L!=2&&(qe(),De(17)),Hr(this),this.s=2,ss(this)):zl(this,this.S-o)};function ss(o){o.j.G==0||o.J||xc(o.j,o)}function Hr(o){Ri(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,es(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Pi(o,u){try{var m=o.j;if(m.G!=0&&(m.g==o||Di(m.h,o))){if(!o.K&&Di(m.h,o)&&m.G==3){try{var v=m.Da.g.parse(u)}catch{v=null}if(Array.isArray(v)&&v.length==3){var R=v;if(R[0]==0){e:if(!m.u){if(m.g)if(m.g.F+3e3<o.F)ga(m),ha(m);else break e;Vi(m),De(18)}}else m.za=R[1],0<m.za-m.T&&37500>R[2]&&m.F&&m.v==0&&!m.C&&(m.C=vt(p(m.Za,m),6e3));if(1>=Kl(m.h)&&m.ca){try{m.ca()}catch{}m.ca=void 0}}else Kr(m,11)}else if((o.K||m.g==o)&&ga(m),!S(u))for(R=m.Da.g.parse(u),u=0;u<R.length;u++){let Ae=R[u];if(m.T=Ae[0],Ae=Ae[1],m.G==2)if(Ae[0]=="c"){m.K=Ae[1],m.ia=Ae[2];const dt=Ae[3];dt!=null&&(m.la=dt,m.j.info("VER="+m.la));const ut=Ae[4];ut!=null&&(m.Aa=ut,m.j.info("SVER="+m.Aa));const wn=Ae[5];wn!=null&&typeof wn=="number"&&0<wn&&(v=1.5*wn,m.L=v,m.j.info("backChannelRequestTimeoutMs_="+v)),v=m;const Ot=o.g;if(Ot){const pa=Ot.g?Ot.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(pa){var M=v.h;M.g||pa.indexOf("spdy")==-1&&pa.indexOf("quic")==-1&&pa.indexOf("h2")==-1||(M.j=M.l,M.g=new Set,M.h&&($i(M,M.h),M.h=null))}if(v.D){const Fi=Ot.g?Ot.g.getResponseHeader("X-HTTP-Session-Id"):null;Fi&&(v.ya=Fi,Ue(v.I,v.D,Fi))}}m.G=3,m.l&&m.l.ua(),m.ba&&(m.R=Date.now()-o.F,m.j.info("Handshake RTT: "+m.R+"ms")),v=m;var te=o;if(v.qa=vc(v,v.J?v.ia:null,v.W),te.K){Ql(v.h,te);var Oe=te,at=v.L;at&&(Oe.I=at),Oe.B&&(Ri(Oe),aa(Oe)),v.g=te}else fc(v);0<m.i.length&&ma(m)}else Ae[0]!="stop"&&Ae[0]!="close"||Kr(m,7);else m.G==3&&(Ae[0]=="stop"||Ae[0]=="close"?Ae[0]=="stop"?Kr(m,7):Oi(m):Ae[0]!="noop"&&m.l&&m.l.ta(Ae),m.v=0)}}qe(4)}catch{}}var ag=class{constructor(o,u){this.g=o,this.map=u}};function Hl(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Gl(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Kl(o){return o.h?1:o.g?o.g.size:0}function Di(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function $i(o,u){o.g?o.g.add(u):o.h=u}function Ql(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Hl.prototype.cancel=function(){if(this.i=Yl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Yl(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const m of o.g.values())u=u.concat(m.D);return u}return E(o.i)}function ig(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(d(o)){for(var u=[],m=o.length,v=0;v<m;v++)u.push(o[v]);return u}u=[],m=0;for(v in o)u[m++]=o[v];return u}function og(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(d(o)||typeof o=="string"){var u=[];o=o.length;for(var m=0;m<o;m++)u.push(m);return u}u=[],m=0;for(const v in o)u[m++]=v;return u}}}function Xl(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(d(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var m=og(o),v=ig(o),R=v.length,M=0;M<R;M++)u.call(void 0,v[M],m&&m[M],o)}var Jl=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function lg(o,u){if(o){o=o.split("&");for(var m=0;m<o.length;m++){var v=o[m].indexOf("="),R=null;if(0<=v){var M=o[m].substring(0,v);R=o[m].substring(v+1)}else M=o[m];u(M,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Gr(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Gr){this.h=o.h,ia(this,o.j),this.o=o.o,this.g=o.g,oa(this,o.s),this.l=o.l;var u=o.i,m=new os;m.i=u.i,u.g&&(m.g=new Map(u.g),m.h=u.h),Zl(this,m),this.m=o.m}else o&&(u=String(o).match(Jl))?(this.h=!1,ia(this,u[1]||"",!0),this.o=as(u[2]||""),this.g=as(u[3]||"",!0),oa(this,u[4]),this.l=as(u[5]||"",!0),Zl(this,u[6]||"",!0),this.m=as(u[7]||"")):(this.h=!1,this.i=new os(null,this.h))}Gr.prototype.toString=function(){var o=[],u=this.j;u&&o.push(is(u,ec,!0),":");var m=this.g;return(m||u=="file")&&(o.push("//"),(u=this.o)&&o.push(is(u,ec,!0),"@"),o.push(encodeURIComponent(String(m)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),m=this.s,m!=null&&o.push(":",String(m))),(m=this.l)&&(this.g&&m.charAt(0)!="/"&&o.push("/"),o.push(is(m,m.charAt(0)=="/"?ug:dg,!0))),(m=this.i.toString())&&o.push("?",m),(m=this.m)&&o.push("#",is(m,mg)),o.join("")};function ar(o){return new Gr(o)}function ia(o,u,m){o.j=m?as(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function oa(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function Zl(o,u,m){u instanceof os?(o.i=u,gg(o.i,o.h)):(m||(u=is(u,hg)),o.i=new os(u,o.h))}function Ue(o,u,m){o.i.set(u,m)}function la(o){return Ue(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function as(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function is(o,u,m){return typeof o=="string"?(o=encodeURI(o).replace(u,cg),m&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function cg(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var ec=/[#\/\?@]/g,dg=/[#\?:]/g,ug=/[#\?]/g,hg=/[#\?@]/g,mg=/#/g;function os(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function _r(o){o.g||(o.g=new Map,o.h=0,o.i&&lg(o.i,function(u,m){o.add(decodeURIComponent(u.replace(/\+/g," ")),m)}))}r=os.prototype,r.add=function(o,u){_r(this),this.i=null,o=bn(this,o);var m=this.g.get(o);return m||this.g.set(o,m=[]),m.push(u),this.h+=1,this};function tc(o,u){_r(o),u=bn(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function rc(o,u){return _r(o),u=bn(o,u),o.g.has(u)}r.forEach=function(o,u){_r(this),this.g.forEach(function(m,v){m.forEach(function(R){o.call(u,R,v,this)},this)},this)},r.na=function(){_r(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),m=[];for(let v=0;v<u.length;v++){const R=o[v];for(let M=0;M<R.length;M++)m.push(u[v])}return m},r.V=function(o){_r(this);let u=[];if(typeof o=="string")rc(this,o)&&(u=u.concat(this.g.get(bn(this,o))));else{o=Array.from(this.g.values());for(let m=0;m<o.length;m++)u=u.concat(o[m])}return u},r.set=function(o,u){return _r(this),this.i=null,o=bn(this,o),rc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},r.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function nc(o,u,m){tc(o,u),0<m.length&&(o.i=null,o.g.set(bn(o,u),E(m)),o.h+=m.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var m=0;m<u.length;m++){var v=u[m];const M=encodeURIComponent(String(v)),te=this.V(v);for(v=0;v<te.length;v++){var R=M;te[v]!==""&&(R+="="+encodeURIComponent(String(te[v]))),o.push(R)}}return this.i=o.join("&")};function bn(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function gg(o,u){u&&!o.j&&(_r(o),o.i=null,o.g.forEach(function(m,v){var R=v.toLowerCase();v!=R&&(tc(this,v),nc(this,R,m))},o)),o.j=u}function fg(o,u){const m=new Dt;if(c.Image){const v=new Image;v.onload=T(Er,m,"TestLoadImage: loaded",!0,u,v),v.onerror=T(Er,m,"TestLoadImage: error",!1,u,v),v.onabort=T(Er,m,"TestLoadImage: abort",!1,u,v),v.ontimeout=T(Er,m,"TestLoadImage: timeout",!1,u,v),c.setTimeout(function(){v.ontimeout&&v.ontimeout()},1e4),v.src=o}else u(!1)}function pg(o,u){const m=new Dt,v=new AbortController,R=setTimeout(()=>{v.abort(),Er(m,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:v.signal}).then(M=>{clearTimeout(R),M.ok?Er(m,"TestPingServer: ok",!0,u):Er(m,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(R),Er(m,"TestPingServer: error",!1,u)})}function Er(o,u,m,v,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),v(m)}catch{}}function xg(){this.g=new Ti}function yg(o,u,m){const v=m||"";try{Xl(o,function(R,M){let te=R;h(R)&&(te=ts(R)),u.push(v+M+"="+encodeURIComponent(te))})}catch(R){throw u.push(v+"type="+encodeURIComponent("_badmap")),R}}function ca(o){this.l=o.Ub||null,this.j=o.eb||!1}j(ca,rs),ca.prototype.g=function(){return new da(this.l,this.j)},ca.prototype.i=function(o){return function(){return o}}({});function da(o,u){Le.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}j(da,Le),r=da.prototype,r.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,cs(this)},r.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||c).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ls(this)),this.readyState=0},r.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,cs(this)),this.g&&(this.readyState=3,cs(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;sc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function sc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}r.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?ls(this):cs(this),this.readyState==3&&sc(this)}},r.Ra=function(o){this.g&&(this.response=this.responseText=o,ls(this))},r.Qa=function(o){this.g&&(this.response=o,ls(this))},r.ga=function(){this.g&&ls(this)};function ls(o){o.readyState=4,o.l=null,o.j=null,o.v=null,cs(o)}r.setRequestHeader=function(o,u){this.u.append(o,u)},r.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var m=u.next();!m.done;)m=m.value,o.push(m[0]+": "+m[1]),m=u.next();return o.join(`\r
`)};function cs(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(da.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function ac(o){let u="";return B(o,function(m,v){u+=v,u+=":",u+=m,u+=`\r
`}),u}function Mi(o,u,m){e:{for(v in m){var v=!1;break e}v=!0}v||(m=ac(m),typeof o=="string"?m!=null&&encodeURIComponent(String(m)):Ue(o,u,m))}function He(o){Le.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}j(He,Le);var bg=/^https?$/i,vg=["POST","PUT"];r=He.prototype,r.Ha=function(o){this.J=o},r.ea=function(o,u,m,v){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Si.g(),this.v=this.o?ns(this.o):ns(Si),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(M){ic(this,M);return}if(o=m||"",m=new Map(this.headers),v)if(Object.getPrototypeOf(v)===Object.prototype)for(var R in v)m.set(R,v[R]);else if(typeof v.keys=="function"&&typeof v.get=="function")for(const M of v.keys())m.set(M,v.get(M));else throw Error("Unknown input type for opt_headers: "+String(v));v=Array.from(m.keys()).find(M=>M.toLowerCase()=="content-type"),R=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(vg,u,void 0))||v||R||m.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[M,te]of m)this.g.setRequestHeader(M,te);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{cc(this),this.u=!0,this.g.send(o),this.u=!1}catch(M){ic(this,M)}};function ic(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,oc(o),ua(o)}function oc(o){o.A||(o.A=!0,st(o,"complete"),st(o,"error"))}r.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,st(this,"complete"),st(this,"abort"),ua(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ua(this,!0)),He.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?lc(this):this.bb())},r.bb=function(){lc(this)};function lc(o){if(o.h&&typeof l<"u"&&(!o.v[1]||ir(o)!=4||o.Z()!=2)){if(o.u&&ir(o)==4)Js(o.Ea,0,o);else if(st(o,"readystatechange"),ir(o)==4){o.h=!1;try{const te=o.Z();e:switch(te){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var m;if(!(m=u)){var v;if(v=te===0){var R=String(o.D).match(Jl)[1]||null;!R&&c.self&&c.self.location&&(R=c.self.location.protocol.slice(0,-1)),v=!bg.test(R?R.toLowerCase():"")}m=v}if(m)st(o,"complete"),st(o,"success");else{o.m=6;try{var M=2<ir(o)?o.g.statusText:""}catch{M=""}o.l=M+" ["+o.Z()+"]",oc(o)}}finally{ua(o)}}}}function ua(o,u){if(o.g){cc(o);const m=o.g,v=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||st(o,"ready");try{m.onreadystatechange=v}catch{}}}function cc(o){o.I&&(c.clearTimeout(o.I),o.I=null)}r.isActive=function(){return!!this.g};function ir(o){return o.g?o.g.readyState:0}r.Z=function(){try{return 2<ir(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),ta(u)}};function dc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function wg(o){const u={};o=(o.g&&2<=ir(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let v=0;v<o.length;v++){if(S(o[v]))continue;var m=k(o[v]);const R=m[0];if(m=m[1],typeof m!="string")continue;m=m.trim();const M=u[R]||[];u[R]=M,M.push(m)}_(u,function(v){return v.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ds(o,u,m){return m&&m.internalChannelParams&&m.internalChannelParams[o]||u}function uc(o){this.Aa=0,this.i=[],this.j=new Dt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ds("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ds("baseRetryDelayMs",5e3,o),this.cb=ds("retryDelaySeedMs",1e4,o),this.Wa=ds("forwardChannelMaxRetries",2,o),this.wa=ds("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Hl(o&&o.concurrentRequestLimit),this.Da=new xg,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=uc.prototype,r.la=8,r.G=1,r.connect=function(o,u,m,v){De(0),this.W=o,this.H=u||{},m&&v!==void 0&&(this.H.OSID=m,this.H.OAID=v),this.F=this.X,this.I=vc(this,null,this.W),ma(this)};function Oi(o){if(hc(o),o.G==3){var u=o.U++,m=ar(o.I);if(Ue(m,"SID",o.K),Ue(m,"RID",u),Ue(m,"TYPE","terminate"),us(o,m),u=new wr(o,o.j,u),u.L=2,u.v=la(ar(m)),m=!1,c.navigator&&c.navigator.sendBeacon)try{m=c.navigator.sendBeacon(u.v.toString(),"")}catch{}!m&&c.Image&&(new Image().src=u.v,m=!0),m||(u.g=wc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),aa(u)}bc(o)}function ha(o){o.g&&(Li(o),o.g.cancel(),o.g=null)}function hc(o){ha(o),o.u&&(c.clearTimeout(o.u),o.u=null),ga(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function ma(o){if(!Gl(o.h)&&!o.s){o.s=!0;var u=o.Ga;$||Z(),K||($(),K=!0),H.add(u,o),o.B=0}}function _g(o,u){return Kl(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=vt(p(o.Ga,o,u),yc(o,o.B)),o.B++,!0)}r.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const R=new wr(this,this.j,o);let M=this.o;if(this.S&&(M?(M=y(M),w(M,this.S)):M=this.S),this.m!==null||this.O||(R.H=M,M=null),this.P)e:{for(var u=0,m=0;m<this.i.length;m++){t:{var v=this.i[m];if("__data__"in v.map&&(v=v.map.__data__,typeof v=="string")){v=v.length;break t}v=void 0}if(v===void 0)break;if(u+=v,4096<u){u=m;break e}if(u===4096||m===this.i.length-1){u=m+1;break e}}u=1e3}else u=1e3;u=gc(this,R,u),m=ar(this.I),Ue(m,"RID",o),Ue(m,"CVER",22),this.D&&Ue(m,"X-HTTP-Session-Id",this.D),us(this,m),M&&(this.O?u="headers="+encodeURIComponent(String(ac(M)))+"&"+u:this.m&&Mi(m,this.m,M)),$i(this.h,R),this.Ua&&Ue(m,"TYPE","init"),this.P?(Ue(m,"$req",u),Ue(m,"SID","null"),R.T=!0,Ci(R,m,null)):Ci(R,m,u),this.G=2}}else this.G==3&&(o?mc(this,o):this.i.length==0||Gl(this.h)||mc(this))};function mc(o,u){var m;u?m=u.l:m=o.U++;const v=ar(o.I);Ue(v,"SID",o.K),Ue(v,"RID",m),Ue(v,"AID",o.T),us(o,v),o.m&&o.o&&Mi(v,o.m,o.o),m=new wr(o,o.j,m,o.B+1),o.m===null&&(m.H=o.o),u&&(o.i=u.D.concat(o.i)),u=gc(o,m,1e3),m.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),$i(o.h,m),Ci(m,v,u)}function us(o,u){o.H&&B(o.H,function(m,v){Ue(u,v,m)}),o.l&&Xl({},function(m,v){Ue(u,v,m)})}function gc(o,u,m){m=Math.min(o.i.length,m);var v=o.l?p(o.l.Na,o.l,o):null;e:{var R=o.i;let M=-1;for(;;){const te=["count="+m];M==-1?0<m?(M=R[0].g,te.push("ofs="+M)):M=0:te.push("ofs="+M);let Oe=!0;for(let at=0;at<m;at++){let Ae=R[at].g;const dt=R[at].map;if(Ae-=M,0>Ae)M=Math.max(0,R[at].g-100),Oe=!1;else try{yg(dt,te,"req"+Ae+"_")}catch{v&&v(dt)}}if(Oe){v=te.join("&");break e}}}return o=o.i.splice(0,m),u.D=o,v}function fc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;$||Z(),K||($(),K=!0),H.add(u,o),o.v=0}}function Vi(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=vt(p(o.Fa,o),yc(o,o.v)),o.v++,!0)}r.Fa=function(){if(this.u=null,pc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=vt(p(this.ab,this),o)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,De(10),ha(this),pc(this))};function Li(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function pc(o){o.g=new wr(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=ar(o.qa);Ue(u,"RID","rpc"),Ue(u,"SID",o.K),Ue(u,"AID",o.T),Ue(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&Ue(u,"TO",o.ja),Ue(u,"TYPE","xmlhttp"),us(o,u),o.m&&o.o&&Mi(u,o.m,o.o),o.L&&(o.g.I=o.L);var m=o.g;o=o.ia,m.L=1,m.v=la(ar(u)),m.m=null,m.P=!0,ql(m,o)}r.Za=function(){this.C!=null&&(this.C=null,ha(this),Vi(this),De(19))};function ga(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function xc(o,u){var m=null;if(o.g==u){ga(o),Li(o),o.g=null;var v=2}else if(Di(o.h,u))m=u.D,Ql(o.h,u),v=1;else return;if(o.G!=0){if(u.o)if(v==1){m=u.m?u.m.length:0,u=Date.now()-u.F;var R=o.B;v=ge(),st(v,new bt(v,m)),ma(o)}else fc(o);else if(R=u.s,R==3||R==0&&0<u.X||!(v==1&&_g(o,u)||v==2&&Vi(o)))switch(m&&0<m.length&&(u=o.h,u.i=u.i.concat(m)),R){case 1:Kr(o,5);break;case 4:Kr(o,10);break;case 3:Kr(o,6);break;default:Kr(o,2)}}}function yc(o,u){let m=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(m*=2),m*u}function Kr(o,u){if(o.j.info("Error code "+u),u==2){var m=p(o.fb,o),v=o.Xa;const R=!v;v=new Gr(v||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||ia(v,"https"),la(v),R?fg(v.toString(),m):pg(v.toString(),m)}else De(2);o.G=0,o.l&&o.l.sa(u),bc(o),hc(o)}r.fb=function(o){o?(this.j.info("Successfully pinged google.com"),De(2)):(this.j.info("Failed to ping google.com"),De(1))};function bc(o){if(o.G=0,o.ka=[],o.l){const u=Yl(o.h);(u.length!=0||o.i.length!=0)&&(I(o.ka,u),I(o.ka,o.i),o.h.i.length=0,E(o.i),o.i.length=0),o.l.ra()}}function vc(o,u,m){var v=m instanceof Gr?ar(m):new Gr(m);if(v.g!="")u&&(v.g=u+"."+v.g),oa(v,v.s);else{var R=c.location;v=R.protocol,u=u?u+"."+R.hostname:R.hostname,R=+R.port;var M=new Gr(null);v&&ia(M,v),u&&(M.g=u),R&&oa(M,R),m&&(M.l=m),v=M}return m=o.D,u=o.ya,m&&u&&Ue(v,m,u),Ue(v,"VER",o.la),us(o,v),v}function wc(o,u,m){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new He(new ca({eb:m})):new He(o.pa),u.Ha(o.J),u}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function _c(){}r=_c.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function fa(){}fa.prototype.g=function(o,u){return new St(o,u)};function St(o,u){Le.call(this),this.g=new uc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!S(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!S(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new vn(this)}j(St,Le),St.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},St.prototype.close=function(){Oi(this.g)},St.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var m={};m.__data__=o,o=m}else this.u&&(m={},m.__data__=ts(o),o=m);u.i.push(new ag(u.Ya++,o)),u.G==3&&ma(u)},St.prototype.N=function(){this.g.l=null,delete this.j,Oi(this.g),delete this.g,St.aa.N.call(this)};function Ec(o){yn.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const m in u){o=m;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}j(Ec,yn);function kc(){U.call(this),this.status=1}j(kc,U);function vn(o){this.g=o}j(vn,_c),vn.prototype.ua=function(){st(this.g,"a")},vn.prototype.ta=function(o){st(this.g,new Ec(o))},vn.prototype.sa=function(o){st(this.g,new kc)},vn.prototype.ra=function(){st(this.g,"b")},fa.prototype.createWebChannel=fa.prototype.g,St.prototype.send=St.prototype.o,St.prototype.open=St.prototype.m,St.prototype.close=St.prototype.close,Wu=function(){return new fa},qu=function(){return ge()},Bu=ae,fo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},na.NO_ERROR=0,na.TIMEOUT=8,na.HTTP_ERROR=6,Ta=na,Fl.COMPLETE="complete",Uu=Fl,ra.EventType=zr,zr.OPEN="a",zr.CLOSE="b",zr.ERROR="c",zr.MESSAGE="d",Le.prototype.listen=Le.prototype.K,fs=ra,He.prototype.listenOnce=He.prototype.L,He.prototype.getLastError=He.prototype.Ka,He.prototype.getLastErrorCode=He.prototype.Ba,He.prototype.getStatus=He.prototype.Z,He.prototype.getResponseJson=He.prototype.Oa,He.prototype.getResponseText=He.prototype.oa,He.prototype.send=He.prototype.ea,He.prototype.setWithCredentials=He.prototype.Ha,Fu=He}).apply(typeof xa<"u"?xa:typeof self<"u"?self:typeof window<"u"?window:{});const Kc="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}mt.UNAUTHENTICATED=new mt(null),mt.GOOGLE_CREDENTIALS=new mt("google-credentials-uid"),mt.FIRST_PARTY=new mt("first-party-uid"),mt.MOCK_USER=new mt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Hn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sn=new Bo("@firebase/firestore");function hs(){return sn.logLevel}function ue(r,...e){if(sn.logLevel<=Ie.DEBUG){const t=e.map(zo);sn.debug(`Firestore (${Hn}): ${r}`,...t)}}function fr(r,...e){if(sn.logLevel<=Ie.ERROR){const t=e.map(zo);sn.error(`Firestore (${Hn}): ${r}`,...t)}}function Mn(r,...e){if(sn.logLevel<=Ie.WARN){const t=e.map(zo);sn.warn(`Firestore (${Hn}): ${r}`,...t)}}function zo(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(r="Unexpected state"){const e=`FIRESTORE (${Hn}) INTERNAL ASSERTION FAILED: `+r;throw fr(e),new Error(e)}function Me(r,e){r||be()}function _e(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class de extends nr{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zu{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class mp{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(mt.UNAUTHENTICATED))}shutdown(){}}class gp{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class fp{constructor(e){this.t=e,this.currentUser=mt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Me(this.o===void 0);let n=this.i;const s=d=>this.i!==n?(n=this.i,t(d)):Promise.resolve();let i=new Mr;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Mr,e.enqueueRetryable(()=>s(this.currentUser))};const l=()=>{const d=i;e.enqueueRetryable(async()=>{await d.promise,await s(this.currentUser)})},c=d=>{ue("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=d,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit(d=>c(d)),setTimeout(()=>{if(!this.auth){const d=this.t.getImmediate({optional:!0});d?c(d):(ue("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Mr)}},0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(ue("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(Me(typeof n.accessToken=="string"),new zu(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Me(e===null||typeof e=="string"),new mt(e)}}class pp{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=mt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class xp{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new pp(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(mt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class yp{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class bp{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){Me(this.o===void 0);const n=i=>{i.error!=null&&ue("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const l=i.token!==this.R;return this.R=i.token,ue("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>n(i))};const s=i=>{ue("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):ue("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Me(typeof t.token=="string"),this.R=t.token,new yp(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vp(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let n="";for(;n.length<20;){const s=vp(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%e.length))}return n}}function Ce(r,e){return r<e?-1:r>e?1:0}function On(r,e,t){return r.length===e.length&&r.every((n,s)=>t(n,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new de(G.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new de(G.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new de(G.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new de(G.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return et.fromMillis(Date.now())}static fromDate(e){return et.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor(1e6*(e-1e3*t));return new et(t,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?Ce(this.nanoseconds,e.nanoseconds):Ce(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this.timestamp=e}static fromTimestamp(e){return new we(e)}static min(){return new we(new et(0,0))}static max(){return new we(new et(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(e,t,n){t===void 0?t=0:t>e.length&&be(),n===void 0?n=e.length-t:n>e.length-t&&be(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Ts.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ts?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=e.get(s),l=t.get(s);if(i<l)return-1;if(i>l)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Be extends Ts{construct(e,t,n){return new Be(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new de(G.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(s=>s.length>0))}return new Be(t)}static emptyPath(){return new Be([])}}const wp=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ot extends Ts{construct(e,t,n){return new ot(e,t,n)}static isValidIdentifier(e){return wp.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ot.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new ot(["__name__"])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new de(G.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let l=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new de(G.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const d=e[s+1];if(d!=="\\"&&d!=="."&&d!=="`")throw new de(G.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=d,s+=2}else c==="`"?(l=!l,s++):c!=="."||l?(n+=c,s++):(i(),s++)}if(i(),l)throw new de(G.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ot(t)}static emptyPath(){return new ot([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e){this.path=e}static fromPath(e){return new me(Be.fromString(e))}static fromName(e){return new me(Be.fromString(e).popFirst(5))}static empty(){return new me(Be.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Be.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Be.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new me(new Be(e.slice()))}}function _p(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=we.fromTimestamp(n===1e9?new et(t+1,0):new et(t,n));return new Fr(s,me.empty(),e)}function Ep(r){return new Fr(r.readTime,r.key,-1)}class Fr{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Fr(we.min(),me.empty(),-1)}static max(){return new Fr(we.max(),me.empty(),-1)}}function kp(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=me.comparator(r.documentKey,e.documentKey),t!==0?t:Ce(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Np="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class jp{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fs(r){if(r.code!==G.FAILED_PRECONDITION||r.message!==Np)throw r;ue("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&be(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new Y((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof Y?t:Y.resolve(t)}catch(t){return Y.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):Y.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):Y.reject(t)}static resolve(e){return new Y((t,n)=>{t(e)})}static reject(e){return new Y((t,n)=>{n(e)})}static waitFor(e){return new Y((t,n)=>{let s=0,i=0,l=!1;e.forEach(c=>{++s,c.next(()=>{++i,l&&i===s&&t()},d=>n(d))}),l=!0,i===s&&t()})}static or(e){let t=Y.resolve(!1);for(const n of e)t=t.next(s=>s?Y.resolve(s):n());return t}static forEach(e,t){const n=[];return e.forEach((s,i)=>{n.push(t.call(this,s,i))}),this.waitFor(n)}static mapArray(e,t){return new Y((n,s)=>{const i=e.length,l=new Array(i);let c=0;for(let d=0;d<i;d++){const h=d;t(e[h]).next(g=>{l[h]=g,++c,c===i&&n(l)},g=>s(g))}})}static doWhile(e,t){return new Y((n,s)=>{const i=()=>{e()===!0?t().next(()=>{i()},s):n()};i()})}}function Tp(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Us(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ie(n),this.se=n=>t.writeSequenceNumber(n))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Ho.oe=-1;function li(r){return r==null}function Fa(r){return r===0&&1/r==-1/0}function Ip(r){return typeof r=="number"&&Number.isInteger(r)&&!Fa(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qc(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function mn(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Gu(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e,t){this.comparator=e,this.root=t||it.EMPTY}insert(e,t){return new We(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,it.BLACK,null,null))}remove(e){return new We(this.comparator,this.root.remove(e,this.comparator).copy(null,null,it.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ya(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ya(this.root,e,this.comparator,!1)}getReverseIterator(){return new ya(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ya(this.root,e,this.comparator,!0)}}class ya{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class it{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??it.RED,this.left=s??it.EMPTY,this.right=i??it.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new it(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return it.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return it.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,it.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,it.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw be();const e=this.left.check();if(e!==this.right.check())throw be();return e+(this.isRed()?0:1)}}it.EMPTY=null,it.RED=!0,it.BLACK=!1;it.EMPTY=new class{constructor(){this.size=0}get key(){throw be()}get value(){throw be()}get color(){throw be()}get left(){throw be()}get right(){throw be()}copy(e,t,n,s,i){return this}insert(e,t,n){return new it(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.comparator=e,this.data=new We(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Yc(this.data.getIterator())}getIteratorFrom(e){return new Yc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof lt)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new lt(this.comparator);return t.data=e,t}}class Yc{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e){this.fields=e,e.sort(ot.comparator)}static empty(){return new At([])}unionWith(e){let t=new lt(ot.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new At(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return On(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ku extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Ku("Invalid base64 string: "+i):i}}(e);return new ct(t)}static fromUint8Array(e){const t=function(s){let i="";for(let l=0;l<s.length;++l)i+=String.fromCharCode(s[l]);return i}(e);return new ct(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ce(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ct.EMPTY_BYTE_STRING=new ct("");const Sp=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ur(r){if(Me(!!r),typeof r=="string"){let e=0;const t=Sp.exec(r);if(Me(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:Ke(r.seconds),nanos:Ke(r.nanos)}}function Ke(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function an(r){return typeof r=="string"?ct.fromBase64String(r):ct.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Go(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Ko(r){const e=r.mapValue.fields.__previous_value__;return Go(e)?Ko(e):e}function Is(r){const e=Ur(r.mapValue.fields.__local_write_time__.timestampValue);return new et(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ap{constructor(e,t,n,s,i,l,c,d,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=l,this.autoDetectLongPolling=c,this.longPollingOptions=d,this.useFetchStreams=h}}class Ss{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Ss("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Ss&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ba={mapValue:{}};function on(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Go(r)?4:Rp(r)?9007199254740991:Cp(r)?10:11:be()}function Zt(r,e){if(r===e)return!0;const t=on(r);if(t!==on(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Is(r).isEqual(Is(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const l=Ur(s.timestampValue),c=Ur(i.timestampValue);return l.seconds===c.seconds&&l.nanos===c.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(s,i){return an(s.bytesValue).isEqual(an(i.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(s,i){return Ke(s.geoPointValue.latitude)===Ke(i.geoPointValue.latitude)&&Ke(s.geoPointValue.longitude)===Ke(i.geoPointValue.longitude)}(r,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return Ke(s.integerValue)===Ke(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const l=Ke(s.doubleValue),c=Ke(i.doubleValue);return l===c?Fa(l)===Fa(c):isNaN(l)&&isNaN(c)}return!1}(r,e);case 9:return On(r.arrayValue.values||[],e.arrayValue.values||[],Zt);case 10:case 11:return function(s,i){const l=s.mapValue.fields||{},c=i.mapValue.fields||{};if(Qc(l)!==Qc(c))return!1;for(const d in l)if(l.hasOwnProperty(d)&&(c[d]===void 0||!Zt(l[d],c[d])))return!1;return!0}(r,e);default:return be()}}function As(r,e){return(r.values||[]).find(t=>Zt(t,e))!==void 0}function Vn(r,e){if(r===e)return 0;const t=on(r),n=on(e);if(t!==n)return Ce(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return Ce(r.booleanValue,e.booleanValue);case 2:return function(i,l){const c=Ke(i.integerValue||i.doubleValue),d=Ke(l.integerValue||l.doubleValue);return c<d?-1:c>d?1:c===d?0:isNaN(c)?isNaN(d)?0:-1:1}(r,e);case 3:return Xc(r.timestampValue,e.timestampValue);case 4:return Xc(Is(r),Is(e));case 5:return Ce(r.stringValue,e.stringValue);case 6:return function(i,l){const c=an(i),d=an(l);return c.compareTo(d)}(r.bytesValue,e.bytesValue);case 7:return function(i,l){const c=i.split("/"),d=l.split("/");for(let h=0;h<c.length&&h<d.length;h++){const g=Ce(c[h],d[h]);if(g!==0)return g}return Ce(c.length,d.length)}(r.referenceValue,e.referenceValue);case 8:return function(i,l){const c=Ce(Ke(i.latitude),Ke(l.latitude));return c!==0?c:Ce(Ke(i.longitude),Ke(l.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return Jc(r.arrayValue,e.arrayValue);case 10:return function(i,l){var c,d,h,g;const x=i.fields||{},p=l.fields||{},T=(c=x.value)===null||c===void 0?void 0:c.arrayValue,j=(d=p.value)===null||d===void 0?void 0:d.arrayValue,E=Ce(((h=T==null?void 0:T.values)===null||h===void 0?void 0:h.length)||0,((g=j==null?void 0:j.values)===null||g===void 0?void 0:g.length)||0);return E!==0?E:Jc(T,j)}(r.mapValue,e.mapValue);case 11:return function(i,l){if(i===ba.mapValue&&l===ba.mapValue)return 0;if(i===ba.mapValue)return 1;if(l===ba.mapValue)return-1;const c=i.fields||{},d=Object.keys(c),h=l.fields||{},g=Object.keys(h);d.sort(),g.sort();for(let x=0;x<d.length&&x<g.length;++x){const p=Ce(d[x],g[x]);if(p!==0)return p;const T=Vn(c[d[x]],h[g[x]]);if(T!==0)return T}return Ce(d.length,g.length)}(r.mapValue,e.mapValue);default:throw be()}}function Xc(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return Ce(r,e);const t=Ur(r),n=Ur(e),s=Ce(t.seconds,n.seconds);return s!==0?s:Ce(t.nanos,n.nanos)}function Jc(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Vn(t[s],n[s]);if(i)return i}return Ce(t.length,n.length)}function Ln(r){return po(r)}function po(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=Ur(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return an(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return me.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=po(i);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const l of n)i?i=!1:s+=",",s+=`${l}:${po(t.fields[l])}`;return s+"}"}(r.mapValue):be()}function Zc(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function xo(r){return!!r&&"integerValue"in r}function Qo(r){return!!r&&"arrayValue"in r}function ed(r){return!!r&&"nullValue"in r}function td(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Ia(r){return!!r&&"mapValue"in r}function Cp(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function bs(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return mn(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=bs(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=bs(r.arrayValue.values[t]);return e}return Object.assign({},r)}function Rp(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(e){this.value=e}static empty(){return new jt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Ia(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=bs(t)}setAll(e){let t=ot.emptyPath(),n={},s=[];e.forEach((l,c)=>{if(!t.isImmediateParentOf(c)){const d=this.getFieldsMap(t);this.applyChanges(d,n,s),n={},s=[],t=c.popLast()}l?n[c.lastSegment()]=bs(l):s.push(c.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());Ia(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Zt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];Ia(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){mn(t,(s,i)=>e[s]=i);for(const s of n)delete e[s]}clone(){return new jt(bs(this.value))}}function Qu(r){const e=[];return mn(r.fields,(t,n)=>{const s=new ot([t]);if(Ia(n)){const i=Qu(n.mapValue).fields;if(i.length===0)e.push(s);else for(const l of i)e.push(s.child(l))}else e.push(s)}),new At(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e,t,n,s,i,l,c){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=l,this.documentState=c}static newInvalidDocument(e){return new gt(e,0,we.min(),we.min(),we.min(),jt.empty(),0)}static newFoundDocument(e,t,n,s){return new gt(e,1,t,we.min(),n,s,0)}static newNoDocument(e,t){return new gt(e,2,t,we.min(),we.min(),jt.empty(),0)}static newUnknownDocument(e,t){return new gt(e,3,t,we.min(),we.min(),jt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(we.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=jt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=jt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=we.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof gt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new gt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{constructor(e,t){this.position=e,this.inclusive=t}}function rd(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],l=r.position[s];if(i.field.isKeyField()?n=me.comparator(me.fromName(l.referenceValue),t.key):n=Vn(l,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function nd(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Zt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs{constructor(e,t="asc"){this.field=e,this.dir=t}}function Pp(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yu{}class Ye extends Yu{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new $p(e,t,n):t==="array-contains"?new Vp(e,n):t==="in"?new Lp(e,n):t==="not-in"?new Fp(e,n):t==="array-contains-any"?new Up(e,n):new Ye(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Mp(e,n):new Op(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Vn(t,this.value)):t!==null&&on(this.value)===on(t)&&this.matchesComparison(Vn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return be()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Wt extends Yu{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Wt(e,t)}matches(e){return Xu(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Xu(r){return r.op==="and"}function Ju(r){return Dp(r)&&Xu(r)}function Dp(r){for(const e of r.filters)if(e instanceof Wt)return!1;return!0}function yo(r){if(r instanceof Ye)return r.field.canonicalString()+r.op.toString()+Ln(r.value);if(Ju(r))return r.filters.map(e=>yo(e)).join(",");{const e=r.filters.map(t=>yo(t)).join(",");return`${r.op}(${e})`}}function Zu(r,e){return r instanceof Ye?function(n,s){return s instanceof Ye&&n.op===s.op&&n.field.isEqual(s.field)&&Zt(n.value,s.value)}(r,e):r instanceof Wt?function(n,s){return s instanceof Wt&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce((i,l,c)=>i&&Zu(l,s.filters[c]),!0):!1}(r,e):void be()}function eh(r){return r instanceof Ye?function(t){return`${t.field.canonicalString()} ${t.op} ${Ln(t.value)}`}(r):r instanceof Wt?function(t){return t.op.toString()+" {"+t.getFilters().map(eh).join(" ,")+"}"}(r):"Filter"}class $p extends Ye{constructor(e,t,n){super(e,t,n),this.key=me.fromName(n.referenceValue)}matches(e){const t=me.comparator(e.key,this.key);return this.matchesComparison(t)}}class Mp extends Ye{constructor(e,t){super(e,"in",t),this.keys=th("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Op extends Ye{constructor(e,t){super(e,"not-in",t),this.keys=th("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function th(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(n=>me.fromName(n.referenceValue))}class Vp extends Ye{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Qo(t)&&As(t.arrayValue,this.value)}}class Lp extends Ye{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&As(this.value.arrayValue,t)}}class Fp extends Ye{constructor(e,t){super(e,"not-in",t)}matches(e){if(As(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!As(this.value.arrayValue,t)}}class Up extends Ye{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Qo(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>As(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bp{constructor(e,t=null,n=[],s=[],i=null,l=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=l,this.endAt=c,this.ue=null}}function sd(r,e=null,t=[],n=[],s=null,i=null,l=null){return new Bp(r,e,t,n,s,i,l)}function Yo(r){const e=_e(r);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>yo(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(i){return i.field.canonicalString()+i.dir}(n)).join(","),li(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>Ln(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>Ln(n)).join(",")),e.ue=t}return e.ue}function Xo(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Pp(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Zu(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!nd(r.startAt,e.startAt)&&nd(r.endAt,e.endAt)}function bo(r){return me.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn{constructor(e,t=null,n=[],s=[],i=null,l="F",c=null,d=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=l,this.startAt=c,this.endAt=d,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function qp(r,e,t,n,s,i,l,c){return new Gn(r,e,t,n,s,i,l,c)}function rh(r){return new Gn(r)}function ad(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function nh(r){return r.collectionGroup!==null}function vs(r){const e=_e(r);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(l){let c=new lt(ot.comparator);return l.filters.forEach(d=>{d.getFlattenedFilters().forEach(h=>{h.isInequality()&&(c=c.add(h.field))})}),c})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new Cs(i,n))}),t.has(ot.keyField().canonicalString())||e.ce.push(new Cs(ot.keyField(),n))}return e.ce}function Qt(r){const e=_e(r);return e.le||(e.le=Wp(e,vs(r))),e.le}function Wp(r,e){if(r.limitType==="F")return sd(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new Cs(s.field,i)});const t=r.endAt?new Ua(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Ua(r.startAt.position,r.startAt.inclusive):null;return sd(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function vo(r,e){const t=r.filters.concat([e]);return new Gn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function wo(r,e,t){return new Gn(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function ci(r,e){return Xo(Qt(r),Qt(e))&&r.limitType===e.limitType}function sh(r){return`${Yo(Qt(r))}|lt:${r.limitType}`}function En(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(s=>eh(s)).join(", ")}]`),li(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(s=>function(l){return`${l.field.canonicalString()} (${l.dir})`}(s)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(s=>Ln(s)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(s=>Ln(s)).join(",")),`Target(${n})`}(Qt(r))}; limitType=${r.limitType})`}function di(r,e){return e.isFoundDocument()&&function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):me.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)}(r,e)&&function(n,s){for(const i of vs(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(r,e)&&function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0}(r,e)&&function(n,s){return!(n.startAt&&!function(l,c,d){const h=rd(l,c,d);return l.inclusive?h<=0:h<0}(n.startAt,vs(n),s)||n.endAt&&!function(l,c,d){const h=rd(l,c,d);return l.inclusive?h>=0:h>0}(n.endAt,vs(n),s))}(r,e)}function zp(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function ah(r){return(e,t)=>{let n=!1;for(const s of vs(r)){const i=Hp(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function Hp(r,e,t){const n=r.field.isKeyField()?me.comparator(e.key,t.key):function(i,l,c){const d=l.data.field(i),h=c.data.field(i);return d!==null&&h!==null?Vn(d,h):be()}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return be()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){mn(this.inner,(t,n)=>{for(const[s,i]of n)e(s,i)})}isEmpty(){return Gu(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gp=new We(me.comparator);function pr(){return Gp}const ih=new We(me.comparator);function ps(...r){let e=ih;for(const t of r)e=e.insert(t.key,t);return e}function oh(r){let e=ih;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function Xr(){return ws()}function lh(){return ws()}function ws(){return new Kn(r=>r.toString(),(r,e)=>r.isEqual(e))}const Kp=new We(me.comparator),Qp=new lt(me.comparator);function Te(...r){let e=Qp;for(const t of r)e=e.add(t);return e}const Yp=new lt(Ce);function Xp(){return Yp}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jo(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Fa(e)?"-0":e}}function ch(r){return{integerValue:""+r}}function Jp(r,e){return Ip(e)?ch(e):Jo(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ui{constructor(){this._=void 0}}function Zp(r,e,t){return r instanceof Ba?function(s,i){const l={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Go(i)&&(i=Ko(i)),i&&(l.fields.__previous_value__=i),{mapValue:l}}(t,e):r instanceof Rs?uh(r,e):r instanceof Ps?hh(r,e):function(s,i){const l=dh(s,i),c=id(l)+id(s.Pe);return xo(l)&&xo(s.Pe)?ch(c):Jo(s.serializer,c)}(r,e)}function ex(r,e,t){return r instanceof Rs?uh(r,e):r instanceof Ps?hh(r,e):t}function dh(r,e){return r instanceof qa?function(n){return xo(n)||function(i){return!!i&&"doubleValue"in i}(n)}(e)?e:{integerValue:0}:null}class Ba extends ui{}class Rs extends ui{constructor(e){super(),this.elements=e}}function uh(r,e){const t=mh(e);for(const n of r.elements)t.some(s=>Zt(s,n))||t.push(n);return{arrayValue:{values:t}}}class Ps extends ui{constructor(e){super(),this.elements=e}}function hh(r,e){let t=mh(e);for(const n of r.elements)t=t.filter(s=>!Zt(s,n));return{arrayValue:{values:t}}}class qa extends ui{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function id(r){return Ke(r.integerValue||r.doubleValue)}function mh(r){return Qo(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}function tx(r,e){return r.field.isEqual(e.field)&&function(n,s){return n instanceof Rs&&s instanceof Rs||n instanceof Ps&&s instanceof Ps?On(n.elements,s.elements,Zt):n instanceof qa&&s instanceof qa?Zt(n.Pe,s.Pe):n instanceof Ba&&s instanceof Ba}(r.transform,e.transform)}class rx{constructor(e,t){this.version=e,this.transformResults=t}}class Bt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Bt}static exists(e){return new Bt(void 0,e)}static updateTime(e){return new Bt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Sa(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class hi{}function gh(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Zo(r.key,Bt.none()):new Bs(r.key,r.data,Bt.none());{const t=r.data,n=jt.empty();let s=new lt(ot.comparator);for(let i of e.fields)if(!s.has(i)){let l=t.field(i);l===null&&i.length>1&&(i=i.popLast(),l=t.field(i)),l===null?n.delete(i):n.set(i,l),s=s.add(i)}return new qr(r.key,n,new At(s.toArray()),Bt.none())}}function nx(r,e,t){r instanceof Bs?function(s,i,l){const c=s.value.clone(),d=ld(s.fieldTransforms,i,l.transformResults);c.setAll(d),i.convertToFoundDocument(l.version,c).setHasCommittedMutations()}(r,e,t):r instanceof qr?function(s,i,l){if(!Sa(s.precondition,i))return void i.convertToUnknownDocument(l.version);const c=ld(s.fieldTransforms,i,l.transformResults),d=i.data;d.setAll(fh(s)),d.setAll(c),i.convertToFoundDocument(l.version,d).setHasCommittedMutations()}(r,e,t):function(s,i,l){i.convertToNoDocument(l.version).setHasCommittedMutations()}(0,e,t)}function _s(r,e,t,n){return r instanceof Bs?function(i,l,c,d){if(!Sa(i.precondition,l))return c;const h=i.value.clone(),g=cd(i.fieldTransforms,d,l);return h.setAll(g),l.convertToFoundDocument(l.version,h).setHasLocalMutations(),null}(r,e,t,n):r instanceof qr?function(i,l,c,d){if(!Sa(i.precondition,l))return c;const h=cd(i.fieldTransforms,d,l),g=l.data;return g.setAll(fh(i)),g.setAll(h),l.convertToFoundDocument(l.version,g).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(x=>x.field))}(r,e,t,n):function(i,l,c){return Sa(i.precondition,l)?(l.convertToNoDocument(l.version).setHasLocalMutations(),null):c}(r,e,t)}function sx(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=dh(n.transform,s||null);i!=null&&(t===null&&(t=jt.empty()),t.set(n.field,i))}return t||null}function od(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&On(n,s,(i,l)=>tx(i,l))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Bs extends hi{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class qr extends hi{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function fh(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function ld(r,e,t){const n=new Map;Me(r.length===t.length);for(let s=0;s<t.length;s++){const i=r[s],l=i.transform,c=e.data.field(i.field);n.set(i.field,ex(l,c,t[s]))}return n}function cd(r,e,t){const n=new Map;for(const s of r){const i=s.transform,l=t.data.field(s.field);n.set(s.field,Zp(i,l,e))}return n}class Zo extends hi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ax extends hi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ix{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&nx(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=_s(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=_s(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=lh();return this.mutations.forEach(s=>{const i=e.get(s.key),l=i.overlayedDocument;let c=this.applyToLocalView(l,i.mutatedFields);c=t.has(s.key)?null:c;const d=gh(l,c);d!==null&&n.set(s.key,d),l.isValidDocument()||l.convertToNoDocument(we.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Te())}isEqual(e){return this.batchId===e.batchId&&On(this.mutations,e.mutations,(t,n)=>od(t,n))&&On(this.baseMutations,e.baseMutations,(t,n)=>od(t,n))}}class el{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){Me(e.mutations.length===n.length);let s=function(){return Kp}();const i=e.mutations;for(let l=0;l<i.length;l++)s=s.insert(i[l].key,n[l].version);return new el(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ox{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lx{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qe,Se;function cx(r){switch(r){default:return be();case G.CANCELLED:case G.UNKNOWN:case G.DEADLINE_EXCEEDED:case G.RESOURCE_EXHAUSTED:case G.INTERNAL:case G.UNAVAILABLE:case G.UNAUTHENTICATED:return!1;case G.INVALID_ARGUMENT:case G.NOT_FOUND:case G.ALREADY_EXISTS:case G.PERMISSION_DENIED:case G.FAILED_PRECONDITION:case G.ABORTED:case G.OUT_OF_RANGE:case G.UNIMPLEMENTED:case G.DATA_LOSS:return!0}}function ph(r){if(r===void 0)return fr("GRPC error has no .code"),G.UNKNOWN;switch(r){case Qe.OK:return G.OK;case Qe.CANCELLED:return G.CANCELLED;case Qe.UNKNOWN:return G.UNKNOWN;case Qe.DEADLINE_EXCEEDED:return G.DEADLINE_EXCEEDED;case Qe.RESOURCE_EXHAUSTED:return G.RESOURCE_EXHAUSTED;case Qe.INTERNAL:return G.INTERNAL;case Qe.UNAVAILABLE:return G.UNAVAILABLE;case Qe.UNAUTHENTICATED:return G.UNAUTHENTICATED;case Qe.INVALID_ARGUMENT:return G.INVALID_ARGUMENT;case Qe.NOT_FOUND:return G.NOT_FOUND;case Qe.ALREADY_EXISTS:return G.ALREADY_EXISTS;case Qe.PERMISSION_DENIED:return G.PERMISSION_DENIED;case Qe.FAILED_PRECONDITION:return G.FAILED_PRECONDITION;case Qe.ABORTED:return G.ABORTED;case Qe.OUT_OF_RANGE:return G.OUT_OF_RANGE;case Qe.UNIMPLEMENTED:return G.UNIMPLEMENTED;case Qe.DATA_LOSS:return G.DATA_LOSS;default:return be()}}(Se=Qe||(Qe={}))[Se.OK=0]="OK",Se[Se.CANCELLED=1]="CANCELLED",Se[Se.UNKNOWN=2]="UNKNOWN",Se[Se.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Se[Se.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Se[Se.NOT_FOUND=5]="NOT_FOUND",Se[Se.ALREADY_EXISTS=6]="ALREADY_EXISTS",Se[Se.PERMISSION_DENIED=7]="PERMISSION_DENIED",Se[Se.UNAUTHENTICATED=16]="UNAUTHENTICATED",Se[Se.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Se[Se.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Se[Se.ABORTED=10]="ABORTED",Se[Se.OUT_OF_RANGE=11]="OUT_OF_RANGE",Se[Se.UNIMPLEMENTED=12]="UNIMPLEMENTED",Se[Se.INTERNAL=13]="INTERNAL",Se[Se.UNAVAILABLE=14]="UNAVAILABLE",Se[Se.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dx(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ux=new en([4294967295,4294967295],0);function dd(r){const e=dx().encode(r),t=new Lu;return t.update(e),new Uint8Array(t.digest())}function ud(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new en([t,n],0),new en([s,i],0)]}class tl{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new xs(`Invalid padding: ${t}`);if(n<0)throw new xs(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new xs(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new xs(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=en.fromNumber(this.Ie)}Ee(e,t,n){let s=e.add(t.multiply(en.fromNumber(n)));return s.compare(ux)===1&&(s=new en([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=dd(e),[n,s]=ud(t);for(let i=0;i<this.hashCount;i++){const l=this.Ee(n,s,i);if(!this.de(l))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),l=new tl(i,s,t);return n.forEach(c=>l.insert(c)),l}insert(e){if(this.Ie===0)return;const t=dd(e),[n,s]=ud(t);for(let i=0;i<this.hashCount;i++){const l=this.Ee(n,s,i);this.Ae(l)}}Ae(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class xs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,qs.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new mi(we.min(),s,new We(Ce),pr(),Te())}}class qs{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new qs(n,t,Te(),Te(),Te())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa{constructor(e,t,n,s){this.Re=e,this.removedTargetIds=t,this.key=n,this.Ve=s}}class xh{constructor(e,t){this.targetId=e,this.me=t}}class yh{constructor(e,t,n=ct.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class hd{constructor(){this.fe=0,this.ge=gd(),this.pe=ct.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=Te(),t=Te(),n=Te();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:be()}}),new qs(this.pe,this.ye,e,t,n)}Ce(){this.we=!1,this.ge=gd()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Me(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class hx{constructor(e){this.Le=e,this.Be=new Map,this.ke=pr(),this.qe=md(),this.Qe=new We(Ce)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const n=this.Ge(t);switch(e.state){case 0:this.ze(t)&&n.De(e.resumeToken);break;case 1:n.Oe(),n.Se||n.Ce(),n.De(e.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(n.Ne(),n.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),n.De(e.resumeToken));break;default:be()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((n,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,n=e.me.count,s=this.Je(t);if(s){const i=s.target;if(bo(i))if(n===0){const l=new me(i.path);this.Ue(t,l,gt.newNoDocument(l,we.min()))}else Me(n===1);else{const l=this.Ye(t);if(l!==n){const c=this.Ze(e),d=c?this.Xe(c,e,l):1;if(d!==0){this.je(t);const h=d===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let l,c;try{l=an(n).toUint8Array()}catch(d){if(d instanceof Ku)return Mn("Decoding the base64 bloom filter in existence filter failed ("+d.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw d}try{c=new tl(l,s,i)}catch(d){return Mn(d instanceof xs?"BloomFilter error: ":"Applying bloom filter failed: ",d),null}return c.Ie===0?null:c}Xe(e,t,n){return t.me.count===n-this.nt(e,t.targetId)?0:2}nt(e,t){const n=this.Le.getRemoteKeysForTarget(t);let s=0;return n.forEach(i=>{const l=this.Le.tt(),c=`projects/${l.projectId}/databases/${l.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,i,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((i,l)=>{const c=this.Je(l);if(c){if(i.current&&bo(c.target)){const d=new me(c.target.path);this.ke.get(d)!==null||this.it(l,d)||this.Ue(l,d,gt.newNoDocument(d,e))}i.be&&(t.set(l,i.ve()),i.Ce())}});let n=Te();this.qe.forEach((i,l)=>{let c=!0;l.forEachWhile(d=>{const h=this.Je(d);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(n=n.add(i))}),this.ke.forEach((i,l)=>l.setReadTime(e));const s=new mi(e,t,this.Qe,this.ke,n);return this.ke=pr(),this.qe=md(),this.Qe=new We(Ce),s}$e(e,t){if(!this.ze(e))return;const n=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,n),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,n){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),n&&(this.ke=this.ke.insert(t,n))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new hd,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new lt(Ce),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||ue("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new hd),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function md(){return new We(me.comparator)}function gd(){return new We(me.comparator)}const mx={asc:"ASCENDING",desc:"DESCENDING"},gx={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},fx={and:"AND",or:"OR"};class px{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function _o(r,e){return r.useProto3Json||li(e)?e:{value:e}}function Wa(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function bh(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function xx(r,e){return Wa(r,e.toTimestamp())}function Yt(r){return Me(!!r),we.fromTimestamp(function(t){const n=Ur(t);return new et(n.seconds,n.nanos)}(r))}function rl(r,e){return Eo(r,e).canonicalString()}function Eo(r,e){const t=function(s){return new Be(["projects",s.projectId,"databases",s.database])}(r).child("documents");return e===void 0?t:t.child(e)}function vh(r){const e=Be.fromString(r);return Me(Nh(e)),e}function ko(r,e){return rl(r.databaseId,e.path)}function Gi(r,e){const t=vh(e);if(t.get(1)!==r.databaseId.projectId)throw new de(G.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new de(G.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new me(_h(t))}function wh(r,e){return rl(r.databaseId,e)}function yx(r){const e=vh(r);return e.length===4?Be.emptyPath():_h(e)}function No(r){return new Be(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function _h(r){return Me(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}function fd(r,e,t){return{name:ko(r,e),fields:t.value.mapValue.fields}}function bx(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:be()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(h,g){return h.useProto3Json?(Me(g===void 0||typeof g=="string"),ct.fromBase64String(g||"")):(Me(g===void 0||g instanceof Buffer||g instanceof Uint8Array),ct.fromUint8Array(g||new Uint8Array))}(r,e.targetChange.resumeToken),l=e.targetChange.cause,c=l&&function(h){const g=h.code===void 0?G.UNKNOWN:ph(h.code);return new de(g,h.message||"")}(l);t=new yh(n,s,i,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=Gi(r,n.document.name),i=Yt(n.document.updateTime),l=n.document.createTime?Yt(n.document.createTime):we.min(),c=new jt({mapValue:{fields:n.document.fields}}),d=gt.newFoundDocument(s,i,l,c),h=n.targetIds||[],g=n.removedTargetIds||[];t=new Aa(h,g,d.key,d)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=Gi(r,n.document),i=n.readTime?Yt(n.readTime):we.min(),l=gt.newNoDocument(s,i),c=n.removedTargetIds||[];t=new Aa([],c,l.key,l)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=Gi(r,n.document),i=n.removedTargetIds||[];t=new Aa([],i,s,null)}else{if(!("filter"in e))return be();{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,l=new lx(s,i),c=n.targetId;t=new xh(c,l)}}return t}function vx(r,e){let t;if(e instanceof Bs)t={update:fd(r,e.key,e.value)};else if(e instanceof Zo)t={delete:ko(r,e.key)};else if(e instanceof qr)t={update:fd(r,e.key,e.data),updateMask:Sx(e.fieldMask)};else{if(!(e instanceof ax))return be();t={verify:ko(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(i,l){const c=l.transform;if(c instanceof Ba)return{fieldPath:l.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Rs)return{fieldPath:l.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Ps)return{fieldPath:l.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof qa)return{fieldPath:l.field.canonicalString(),increment:c.Pe};throw be()}(0,n))),e.precondition.isNone||(t.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:xx(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:be()}(r,e.precondition)),t}function wx(r,e){return r&&r.length>0?(Me(e!==void 0),r.map(t=>function(s,i){let l=s.updateTime?Yt(s.updateTime):Yt(i);return l.isEqual(we.min())&&(l=Yt(i)),new rx(l,s.transformResults||[])}(t,e))):[]}function _x(r,e){return{documents:[wh(r,e.path)]}}function Ex(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=wh(r,s);const i=function(h){if(h.length!==0)return kh(Wt.create(h,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const l=function(h){if(h.length!==0)return h.map(g=>function(p){return{field:kn(p.field),direction:jx(p.dir)}}(g))}(e.orderBy);l&&(t.structuredQuery.orderBy=l);const c=_o(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:s}}function kx(r){let e=yx(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){Me(n===1);const g=t.from[0];g.allDescendants?s=g.collectionId:e=e.child(g.collectionId)}let i=[];t.where&&(i=function(x){const p=Eh(x);return p instanceof Wt&&Ju(p)?p.getFilters():[p]}(t.where));let l=[];t.orderBy&&(l=function(x){return x.map(p=>function(j){return new Cs(Nn(j.field),function(I){switch(I){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(j.direction))}(p))}(t.orderBy));let c=null;t.limit&&(c=function(x){let p;return p=typeof x=="object"?x.value:x,li(p)?null:p}(t.limit));let d=null;t.startAt&&(d=function(x){const p=!!x.before,T=x.values||[];return new Ua(T,p)}(t.startAt));let h=null;return t.endAt&&(h=function(x){const p=!x.before,T=x.values||[];return new Ua(T,p)}(t.endAt)),qp(e,s,l,i,c,"F",d,h)}function Nx(r,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return be()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Eh(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Nn(t.unaryFilter.field);return Ye.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Nn(t.unaryFilter.field);return Ye.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Nn(t.unaryFilter.field);return Ye.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const l=Nn(t.unaryFilter.field);return Ye.create(l,"!=",{nullValue:"NULL_VALUE"});default:return be()}}(r):r.fieldFilter!==void 0?function(t){return Ye.create(Nn(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return be()}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return Wt.create(t.compositeFilter.filters.map(n=>Eh(n)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return be()}}(t.compositeFilter.op))}(r):be()}function jx(r){return mx[r]}function Tx(r){return gx[r]}function Ix(r){return fx[r]}function kn(r){return{fieldPath:r.canonicalString()}}function Nn(r){return ot.fromServerFormat(r.fieldPath)}function kh(r){return r instanceof Ye?function(t){if(t.op==="=="){if(td(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NAN"}};if(ed(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(td(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NOT_NAN"}};if(ed(t.value))return{unaryFilter:{field:kn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:kn(t.field),op:Tx(t.op),value:t.value}}}(r):r instanceof Wt?function(t){const n=t.getFilters().map(s=>kh(s));return n.length===1?n[0]:{compositeFilter:{op:Ix(t.op),filters:n}}}(r):be()}function Sx(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Nh(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cr{constructor(e,t,n,s,i=we.min(),l=we.min(),c=ct.EMPTY_BYTE_STRING,d=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=l,this.resumeToken=c,this.expectedCount=d}withSequenceNumber(e){return new Cr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Cr(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Cr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Cr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ax{constructor(e){this.ct=e}}function Cx(r){const e=kx({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?wo(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rx{constructor(){this.un=new Px}addToCollectionParentIndex(e,t){return this.un.add(t),Y.resolve()}getCollectionParents(e,t){return Y.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return Y.resolve()}deleteFieldIndex(e,t){return Y.resolve()}deleteAllFieldIndexes(e){return Y.resolve()}createTargetIndexes(e,t){return Y.resolve()}getDocumentsMatchingTarget(e,t){return Y.resolve(null)}getIndexType(e,t){return Y.resolve(0)}getFieldIndexes(e,t){return Y.resolve([])}getNextCollectionGroupToUpdate(e){return Y.resolve(null)}getMinOffset(e,t){return Y.resolve(Fr.min())}getMinOffsetFromCollectionGroup(e,t){return Y.resolve(Fr.min())}updateCollectionGroup(e,t,n){return Y.resolve()}updateIndexEntries(e,t){return Y.resolve()}}class Px{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new lt(Be.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new lt(Be.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Fn(0)}static kn(){return new Fn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dx{constructor(){this.changes=new Kn(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,gt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?Y.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $x{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mx{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(n=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(n!==null&&_s(n.mutation,s,At.empty(),et.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,Te()).next(()=>n))}getLocalViewOfDocuments(e,t,n=Te()){const s=Xr();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,n).next(i=>{let l=ps();return i.forEach((c,d)=>{l=l.insert(c,d.overlayedDocument)}),l}))}getOverlayedDocuments(e,t){const n=Xr();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,Te()))}populateOverlays(e,t,n){const s=[];return n.forEach(i=>{t.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((l,c)=>{t.set(l,c)})})}computeViews(e,t,n,s){let i=pr();const l=ws(),c=function(){return ws()}();return t.forEach((d,h)=>{const g=n.get(h.key);s.has(h.key)&&(g===void 0||g.mutation instanceof qr)?i=i.insert(h.key,h):g!==void 0?(l.set(h.key,g.mutation.getFieldMask()),_s(g.mutation,h,g.mutation.getFieldMask(),et.now())):l.set(h.key,At.empty())}),this.recalculateAndSaveOverlays(e,i).next(d=>(d.forEach((h,g)=>l.set(h,g)),t.forEach((h,g)=>{var x;return c.set(h,new $x(g,(x=l.get(h))!==null&&x!==void 0?x:null))}),c))}recalculateAndSaveOverlays(e,t){const n=ws();let s=new We((l,c)=>l-c),i=Te();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(l=>{for(const c of l)c.keys().forEach(d=>{const h=t.get(d);if(h===null)return;let g=n.get(d)||At.empty();g=c.applyToLocalView(h,g),n.set(d,g);const x=(s.get(c.batchId)||Te()).add(d);s=s.insert(c.batchId,x)})}).next(()=>{const l=[],c=s.getReverseIterator();for(;c.hasNext();){const d=c.getNext(),h=d.key,g=d.value,x=lh();g.forEach(p=>{if(!i.has(p)){const T=gh(t.get(p),n.get(p));T!==null&&x.set(p,T),i=i.add(p)}}),l.push(this.documentOverlayCache.saveOverlays(e,h,x))}return Y.waitFor(l)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,s){return function(l){return me.isDocumentKey(l.path)&&l.collectionGroup===null&&l.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):nh(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next(i=>{const l=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):Y.resolve(Xr());let c=-1,d=i;return l.next(h=>Y.forEach(h,(g,x)=>(c<x.largestBatchId&&(c=x.largestBatchId),i.get(g)?Y.resolve():this.remoteDocumentCache.getEntry(e,g).next(p=>{d=d.insert(g,p)}))).next(()=>this.populateOverlays(e,h,i)).next(()=>this.computeViews(e,d,h,Te())).next(g=>({batchId:c,changes:oh(g)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new me(t)).next(n=>{let s=ps();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let l=ps();return this.indexManager.getCollectionParents(e,i).next(c=>Y.forEach(c,d=>{const h=function(x,p){return new Gn(p,null,x.explicitOrderBy.slice(),x.filters.slice(),x.limit,x.limitType,x.startAt,x.endAt)}(t,d.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,n,s).next(g=>{g.forEach((x,p)=>{l=l.insert(x,p)})})}).next(()=>l))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(l=>(i=l,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s))).next(l=>{i.forEach((d,h)=>{const g=h.getKey();l.get(g)===null&&(l=l.insert(g,gt.newInvalidDocument(g)))});let c=ps();return l.forEach((d,h)=>{const g=i.get(d);g!==void 0&&_s(g.mutation,h,At.empty(),et.now()),di(t,h)&&(c=c.insert(d,h))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ox{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return Y.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Yt(s.createTime)}}(t)),Y.resolve()}getNamedQuery(e,t){return Y.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:Cx(s.bundledQuery),readTime:Yt(s.readTime)}}(t)),Y.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vx{constructor(){this.overlays=new We(me.comparator),this.Ir=new Map}getOverlay(e,t){return Y.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Xr();return Y.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((s,i)=>{this.ht(e,t,i)}),Y.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Ir.get(n);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(n)),Y.resolve()}getOverlaysForCollection(e,t,n){const s=Xr(),i=t.length+1,l=new me(t.child("")),c=this.overlays.getIteratorFrom(l);for(;c.hasNext();){const d=c.getNext().value,h=d.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&d.largestBatchId>n&&s.set(d.getKey(),d)}return Y.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new We((h,g)=>h-g);const l=this.overlays.getIterator();for(;l.hasNext();){const h=l.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>n){let g=i.get(h.largestBatchId);g===null&&(g=Xr(),i=i.insert(h.largestBatchId,g)),g.set(h.getKey(),h)}}const c=Xr(),d=i.getIterator();for(;d.hasNext()&&(d.getNext().value.forEach((h,g)=>c.set(h,g)),!(c.size()>=s)););return Y.resolve(c)}ht(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const l=this.Ir.get(s.largestBatchId).delete(n.key);this.Ir.set(s.largestBatchId,l)}this.overlays=this.overlays.insert(n.key,new ox(t,n));let i=this.Ir.get(t);i===void 0&&(i=Te(),this.Ir.set(t,i)),this.Ir.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lx{constructor(){this.sessionToken=ct.EMPTY_BYTE_STRING}getSessionToken(e){return Y.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,Y.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nl{constructor(){this.Tr=new lt(tt.Er),this.dr=new lt(tt.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const n=new tt(e,t);this.Tr=this.Tr.add(n),this.dr=this.dr.add(n)}Rr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Vr(new tt(e,t))}mr(e,t){e.forEach(n=>this.removeReference(n,t))}gr(e){const t=new me(new Be([])),n=new tt(t,e),s=new tt(t,e+1),i=[];return this.dr.forEachInRange([n,s],l=>{this.Vr(l),i.push(l.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new me(new Be([])),n=new tt(t,e),s=new tt(t,e+1);let i=Te();return this.dr.forEachInRange([n,s],l=>{i=i.add(l.key)}),i}containsKey(e){const t=new tt(e,0),n=this.Tr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class tt{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return me.comparator(e.key,t.key)||Ce(e.wr,t.wr)}static Ar(e,t){return Ce(e.wr,t.wr)||me.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fx{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new lt(tt.Er)}checkEmpty(e){return Y.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const l=new ix(i,t,n,s);this.mutationQueue.push(l);for(const c of s)this.br=this.br.add(new tt(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return Y.resolve(l)}lookupMutationBatch(e,t){return Y.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.vr(n),i=s<0?0:s;return Y.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return Y.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return Y.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new tt(t,0),s=new tt(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([n,s],l=>{const c=this.Dr(l.wr);i.push(c)}),Y.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new lt(Ce);return t.forEach(s=>{const i=new tt(s,0),l=new tt(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,l],c=>{n=n.add(c.wr)})}),Y.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;me.isDocumentKey(i)||(i=i.child(""));const l=new tt(new me(i),0);let c=new lt(Ce);return this.br.forEachWhile(d=>{const h=d.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(c=c.add(d.wr)),!0)},l),Y.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach(n=>{const s=this.Dr(n);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){Me(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let n=this.br;return Y.forEach(t.mutations,s=>{const i=new tt(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=n})}On(e){}containsKey(e,t){const n=new tt(t,0),s=this.br.firstAfterOrEqual(n);return Y.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,Y.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ux{constructor(e){this.Mr=e,this.docs=function(){return new We(me.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,l=this.Mr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:l}),this.size+=l-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return Y.resolve(n?n.document.mutableCopy():gt.newInvalidDocument(t))}getEntries(e,t){let n=pr();return t.forEach(s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():gt.newInvalidDocument(s))}),Y.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=pr();const l=t.path,c=new me(l.child("")),d=this.docs.getIteratorFrom(c);for(;d.hasNext();){const{key:h,value:{document:g}}=d.getNext();if(!l.isPrefixOf(h.path))break;h.path.length>l.length+1||kp(Ep(g),n)<=0||(s.has(g.key)||di(t,g))&&(i=i.insert(g.key,g.mutableCopy()))}return Y.resolve(i)}getAllFromCollectionGroup(e,t,n,s){be()}Or(e,t){return Y.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new Bx(this)}getSize(e){return Y.resolve(this.size)}}class Bx extends Dx{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((n,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(n)}),Y.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qx{constructor(e){this.persistence=e,this.Nr=new Kn(t=>Yo(t),Xo),this.lastRemoteSnapshotVersion=we.min(),this.highestTargetId=0,this.Lr=0,this.Br=new nl,this.targetCount=0,this.kr=Fn.Bn()}forEachTarget(e,t){return this.Nr.forEach((n,s)=>t(s)),Y.resolve()}getLastRemoteSnapshotVersion(e){return Y.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return Y.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),Y.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.Lr&&(this.Lr=t),Y.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Fn(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,Y.resolve()}updateTargetData(e,t){return this.Kn(t),Y.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,Y.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.Nr.forEach((l,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.Nr.delete(l),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)}),Y.waitFor(i).next(()=>s)}getTargetCount(e){return Y.resolve(this.targetCount)}getTargetData(e,t){const n=this.Nr.get(t)||null;return Y.resolve(n)}addMatchingKeys(e,t,n){return this.Br.Rr(t,n),Y.resolve()}removeMatchingKeys(e,t,n){this.Br.mr(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach(l=>{i.push(s.markPotentiallyOrphaned(e,l))}),Y.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),Y.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Br.yr(t);return Y.resolve(n)}containsKey(e,t){return Y.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wx{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Ho(0),this.Kr=!1,this.Kr=!0,this.$r=new Lx,this.referenceDelegate=e(this),this.Ur=new qx(this),this.indexManager=new Rx,this.remoteDocumentCache=function(s){return new Ux(s)}(n=>this.referenceDelegate.Wr(n)),this.serializer=new Ax(t),this.Gr=new Ox(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Vx,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.qr[e.toKey()];return n||(n=new Fx(t,this.referenceDelegate),this.qr[e.toKey()]=n),n}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,n){ue("MemoryPersistence","Starting transaction:",e);const s=new zx(this.Qr.next());return this.referenceDelegate.zr(),n(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(e,t){return Y.or(Object.values(this.qr).map(n=>()=>n.containsKey(e,t)))}}class zx extends jp{constructor(e){super(),this.currentSequenceNumber=e}}class sl{constructor(e){this.persistence=e,this.Jr=new nl,this.Yr=null}static Zr(e){return new sl(e)}get Xr(){if(this.Yr)return this.Yr;throw be()}addReference(e,t,n){return this.Jr.addReference(n,t),this.Xr.delete(n.toString()),Y.resolve()}removeReference(e,t,n){return this.Jr.removeReference(n,t),this.Xr.add(n.toString()),Y.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),Y.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>n.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return Y.forEach(this.Xr,n=>{const s=me.fromPath(n);return this.ei(e,s).next(i=>{i||t.removeEntry(s,we.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(n=>{n?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return Y.or([()=>Y.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.$i=n,this.Ui=s}static Wi(e,t){let n=Te(),s=Te();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new al(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hx{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gx{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Yf()?8:Tp(ft())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.Yi(e,t).next(l=>{i.result=l}).next(()=>{if(!i.result)return this.Zi(e,t,s,n).next(l=>{i.result=l})}).next(()=>{if(i.result)return;const l=new Hx;return this.Xi(e,t,l).next(c=>{if(i.result=c,this.zi)return this.es(e,t,l,c.size)})}).next(()=>i.result)}es(e,t,n,s){return n.documentReadCount<this.ji?(hs()<=Ie.DEBUG&&ue("QueryEngine","SDK will not create cache indexes for query:",En(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),Y.resolve()):(hs()<=Ie.DEBUG&&ue("QueryEngine","Query:",En(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.Hi*s?(hs()<=Ie.DEBUG&&ue("QueryEngine","The SDK decides to create cache indexes for query:",En(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Qt(t))):Y.resolve())}Yi(e,t){if(ad(t))return Y.resolve(null);let n=Qt(t);return this.indexManager.getIndexType(e,n).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=wo(t,null,"F"),n=Qt(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(i=>{const l=Te(...i);return this.Ji.getDocuments(e,l).next(c=>this.indexManager.getMinOffset(e,n).next(d=>{const h=this.ts(t,c);return this.ns(t,h,l,d.readTime)?this.Yi(e,wo(t,null,"F")):this.rs(e,h,t,d)}))})))}Zi(e,t,n,s){return ad(t)||s.isEqual(we.min())?Y.resolve(null):this.Ji.getDocuments(e,n).next(i=>{const l=this.ts(t,i);return this.ns(t,l,n,s)?Y.resolve(null):(hs()<=Ie.DEBUG&&ue("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),En(t)),this.rs(e,l,t,_p(s,-1)).next(c=>c))})}ts(e,t){let n=new lt(ah(e));return t.forEach((s,i)=>{di(e,i)&&(n=n.add(i))}),n}ns(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(e,t,n){return hs()<=Ie.DEBUG&&ue("QueryEngine","Using full collection scan to execute query:",En(t)),this.Ji.getDocumentsMatchingQuery(e,t,Fr.min(),n)}rs(e,t,n,s){return this.Ji.getDocumentsMatchingQuery(e,n,s).next(i=>(t.forEach(l=>{i=i.insert(l.key,l)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kx{constructor(e,t,n,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new We(Ce),this._s=new Kn(i=>Yo(i),Xo),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(n)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Mx(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function Qx(r,e,t,n){return new Kx(r,e,t,n)}async function jh(r,e){const t=_e(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next(i=>(s=i,t.ls(e),t.mutationQueue.getAllMutationBatches(n))).next(i=>{const l=[],c=[];let d=Te();for(const h of s){l.push(h.batchId);for(const g of h.mutations)d=d.add(g.key)}for(const h of i){c.push(h.batchId);for(const g of h.mutations)d=d.add(g.key)}return t.localDocuments.getDocuments(n,d).next(h=>({hs:h,removedBatchIds:l,addedBatchIds:c}))})})}function Yx(r,e){const t=_e(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const s=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(c,d,h,g){const x=h.batch,p=x.keys();let T=Y.resolve();return p.forEach(j=>{T=T.next(()=>g.getEntry(d,j)).next(E=>{const I=h.docVersions.get(j);Me(I!==null),E.version.compareTo(I)<0&&(x.applyToRemoteDocument(E,h),E.isValidDocument()&&(E.setReadTime(h.commitVersion),g.addEntry(E)))})}),T.next(()=>c.mutationQueue.removeMutationBatch(d,x))}(t,n,e,i).next(()=>i.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(c){let d=Te();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(d=d.add(c.batch.mutations[h].key));return d}(e))).next(()=>t.localDocuments.getDocuments(n,s))})}function Th(r){const e=_e(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function Xx(r,e){const t=_e(r),n=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const l=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const c=[];e.targetChanges.forEach((g,x)=>{const p=s.get(x);if(!p)return;c.push(t.Ur.removeMatchingKeys(i,g.removedDocuments,x).next(()=>t.Ur.addMatchingKeys(i,g.addedDocuments,x)));let T=p.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(x)!==null?T=T.withResumeToken(ct.EMPTY_BYTE_STRING,we.min()).withLastLimboFreeSnapshotVersion(we.min()):g.resumeToken.approximateByteSize()>0&&(T=T.withResumeToken(g.resumeToken,n)),s=s.insert(x,T),function(E,I,D){return E.resumeToken.approximateByteSize()===0||I.snapshotVersion.toMicroseconds()-E.snapshotVersion.toMicroseconds()>=3e8?!0:D.addedDocuments.size+D.modifiedDocuments.size+D.removedDocuments.size>0}(p,T,g)&&c.push(t.Ur.updateTargetData(i,T))});let d=pr(),h=Te();if(e.documentUpdates.forEach(g=>{e.resolvedLimboDocuments.has(g)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,g))}),c.push(Jx(i,l,e.documentUpdates).next(g=>{d=g.Ps,h=g.Is})),!n.isEqual(we.min())){const g=t.Ur.getLastRemoteSnapshotVersion(i).next(x=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,n));c.push(g)}return Y.waitFor(c).next(()=>l.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,d,h)).next(()=>d)}).then(i=>(t.os=s,i))}function Jx(r,e,t){let n=Te(),s=Te();return t.forEach(i=>n=n.add(i)),e.getEntries(r,n).next(i=>{let l=pr();return t.forEach((c,d)=>{const h=i.get(c);d.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(c)),d.isNoDocument()&&d.version.isEqual(we.min())?(e.removeEntry(c,d.readTime),l=l.insert(c,d)):!h.isValidDocument()||d.version.compareTo(h.version)>0||d.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(d),l=l.insert(c,d)):ue("LocalStore","Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",d.version)}),{Ps:l,Is:s}})}function Zx(r,e){const t=_e(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function ey(r,e){const t=_e(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let s;return t.Ur.getTargetData(n,e).next(i=>i?(s=i,Y.resolve(s)):t.Ur.allocateTargetId(n).next(l=>(s=new Cr(e,l,"TargetPurposeListen",n.currentSequenceNumber),t.Ur.addTargetData(n,s).next(()=>s))))}).then(n=>{const s=t.os.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(n.targetId,n),t._s.set(e,n.targetId)),n})}async function jo(r,e,t){const n=_e(r),s=n.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,l=>n.persistence.referenceDelegate.removeTarget(l,s))}catch(l){if(!Us(l))throw l;ue("LocalStore",`Failed to update sequence numbers for target ${e}: ${l}`)}n.os=n.os.remove(e),n._s.delete(s.target)}function pd(r,e,t){const n=_e(r);let s=we.min(),i=Te();return n.persistence.runTransaction("Execute query","readwrite",l=>function(d,h,g){const x=_e(d),p=x._s.get(g);return p!==void 0?Y.resolve(x.os.get(p)):x.Ur.getTargetData(h,g)}(n,l,Qt(e)).next(c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,n.Ur.getMatchingKeysForTargetId(l,c.targetId).next(d=>{i=d})}).next(()=>n.ss.getDocumentsMatchingQuery(l,e,t?s:we.min(),t?i:Te())).next(c=>(ty(n,zp(e),c),{documents:c,Ts:i})))}function ty(r,e,t){let n=r.us.get(e)||we.min();t.forEach((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)}),r.us.set(e,n)}class xd{constructor(){this.activeTargetIds=Xp()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class ry{constructor(){this.so=new xd,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,n){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new xd,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yd{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){ue("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){ue("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let va=null;function Ki(){return va===null?va=function(){return 268435456+Math.round(2147483648*Math.random())}():va++,"0x"+va.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sy={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ay{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ht="WebChannelConnection";class iy extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=n+"://"+t.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(t,n,s,i,l){const c=Ki(),d=this.xo(t,n.toUriEncodedString());ue("RestConnection",`Sending RPC '${t}' ${c}:`,d,s);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,i,l),this.No(t,d,h,s).then(g=>(ue("RestConnection",`Received RPC '${t}' ${c}: `,g),g),g=>{throw Mn("RestConnection",`RPC '${t}' ${c} failed with error: `,g,"url: ",d,"request:",s),g})}Lo(t,n,s,i,l,c){return this.Mo(t,n,s,i,l)}Oo(t,n,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Hn}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,l)=>t[l]=i),s&&s.headers.forEach((i,l)=>t[l]=i)}xo(t,n){const s=sy[t];return`${this.Do}/v1/${n}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,n,s){const i=Ki();return new Promise((l,c)=>{const d=new Fu;d.setWithCredentials(!0),d.listenOnce(Uu.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case Ta.NO_ERROR:const g=d.getResponseJson();ue(ht,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(g)),l(g);break;case Ta.TIMEOUT:ue(ht,`RPC '${e}' ${i} timed out`),c(new de(G.DEADLINE_EXCEEDED,"Request time out"));break;case Ta.HTTP_ERROR:const x=d.getStatus();if(ue(ht,`RPC '${e}' ${i} failed with status:`,x,"response text:",d.getResponseText()),x>0){let p=d.getResponseJson();Array.isArray(p)&&(p=p[0]);const T=p==null?void 0:p.error;if(T&&T.status&&T.message){const j=function(I){const D=I.toLowerCase().replace(/_/g,"-");return Object.values(G).indexOf(D)>=0?D:G.UNKNOWN}(T.status);c(new de(j,T.message))}else c(new de(G.UNKNOWN,"Server responded with status "+d.getStatus()))}else c(new de(G.UNAVAILABLE,"Connection failed."));break;default:be()}}finally{ue(ht,`RPC '${e}' ${i} completed.`)}});const h=JSON.stringify(s);ue(ht,`RPC '${e}' ${i} sending request:`,s),d.send(t,"POST",h,n,15)})}Bo(e,t,n){const s=Ki(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],l=Wu(),c=qu(),d={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(d.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(d.useFetchStreams=!0),this.Oo(d.initMessageHeaders,t,n),d.encodeInitMessageHeaders=!0;const g=i.join("");ue(ht,`Creating RPC '${e}' stream ${s}: ${g}`,d);const x=l.createWebChannel(g,d);let p=!1,T=!1;const j=new ay({Io:I=>{T?ue(ht,`Not sending because RPC '${e}' stream ${s} is closed:`,I):(p||(ue(ht,`Opening RPC '${e}' stream ${s} transport.`),x.open(),p=!0),ue(ht,`RPC '${e}' stream ${s} sending:`,I),x.send(I))},To:()=>x.close()}),E=(I,D,S)=>{I.listen(D,C=>{try{S(C)}catch(F){setTimeout(()=>{throw F},0)}})};return E(x,fs.EventType.OPEN,()=>{T||(ue(ht,`RPC '${e}' stream ${s} transport opened.`),j.yo())}),E(x,fs.EventType.CLOSE,()=>{T||(T=!0,ue(ht,`RPC '${e}' stream ${s} transport closed`),j.So())}),E(x,fs.EventType.ERROR,I=>{T||(T=!0,Mn(ht,`RPC '${e}' stream ${s} transport errored:`,I),j.So(new de(G.UNAVAILABLE,"The operation could not be completed")))}),E(x,fs.EventType.MESSAGE,I=>{var D;if(!T){const S=I.data[0];Me(!!S);const C=S,F=C.error||((D=C[0])===null||D===void 0?void 0:D.error);if(F){ue(ht,`RPC '${e}' stream ${s} received error:`,F);const ne=F.status;let B=function(b){const w=Qe[b];if(w!==void 0)return ph(w)}(ne),_=F.message;B===void 0&&(B=G.INTERNAL,_="Unknown error status: "+ne+" with message "+F.message),T=!0,j.So(new de(B,_)),x.close()}else ue(ht,`RPC '${e}' stream ${s} received:`,S),j.bo(S)}}),E(c,Bu.STAT_EVENT,I=>{I.stat===fo.PROXY?ue(ht,`RPC '${e}' stream ${s} detected buffering proxy`):I.stat===fo.NOPROXY&&ue(ht,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{j.wo()},0),j}}function Qi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gi(r){return new px(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ih{constructor(e,t,n=1e3,s=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=n,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),n=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-n);s>0&&ue("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sh{constructor(e,t,n,s,i,l,c,d){this.ui=e,this.Ho=n,this.Jo=s,this.connection=i,this.authCredentialsProvider=l,this.appCheckCredentialsProvider=c,this.listener=d,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Ih(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===G.RESOURCE_EXHAUSTED?(fr(t.toString()),fr("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===G.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,s])=>{this.Yo===t&&this.P_(n,s)},n=>{e(()=>{const s=new de(G.UNKNOWN,"Fetching auth token failed: "+n.message);return this.I_(s)})})}P_(e,t){const n=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{n(()=>this.listener.Eo())}),this.stream.Ro(()=>{n(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{n(()=>this.I_(s))}),this.stream.onMessage(s=>{n(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return ue("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(ue("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class oy extends Sh{constructor(e,t,n,s,i,l){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,l),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=bx(this.serializer,e),n=function(i){if(!("targetChange"in i))return we.min();const l=i.targetChange;return l.targetIds&&l.targetIds.length?we.min():l.readTime?Yt(l.readTime):we.min()}(e);return this.listener.d_(t,n)}A_(e){const t={};t.database=No(this.serializer),t.addTarget=function(i,l){let c;const d=l.target;if(c=bo(d)?{documents:_x(i,d)}:{query:Ex(i,d)._t},c.targetId=l.targetId,l.resumeToken.approximateByteSize()>0){c.resumeToken=bh(i,l.resumeToken);const h=_o(i,l.expectedCount);h!==null&&(c.expectedCount=h)}else if(l.snapshotVersion.compareTo(we.min())>0){c.readTime=Wa(i,l.snapshotVersion.toTimestamp());const h=_o(i,l.expectedCount);h!==null&&(c.expectedCount=h)}return c}(this.serializer,e);const n=Nx(this.serializer,e);n&&(t.labels=n),this.a_(t)}R_(e){const t={};t.database=No(this.serializer),t.removeTarget=e,this.a_(t)}}class ly extends Sh{constructor(e,t,n,s,i,l){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,l),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return Me(!!e.streamToken),this.lastStreamToken=e.streamToken,Me(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Me(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=wx(e.writeResults,e.commitTime),n=Yt(e.commitTime);return this.listener.g_(n,t)}p_(){const e={};e.database=No(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>vx(this.serializer,n))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy extends class{}{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new de(G.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,n,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,l])=>this.connection.Mo(e,Eo(t,n),s,i,l)).catch(i=>{throw i.name==="FirebaseError"?(i.code===G.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new de(G.UNKNOWN,i.toString())})}Lo(e,t,n,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([l,c])=>this.connection.Lo(e,Eo(t,n),s,l,c,i)).catch(l=>{throw l.name==="FirebaseError"?(l.code===G.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new de(G.UNKNOWN,l.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class dy{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(fr(t),this.D_=!1):ue("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uy{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(l=>{n.enqueueAndForget(async()=>{gn(this)&&(ue("RemoteStore","Restarting streams for network reachability change."),await async function(d){const h=_e(d);h.L_.add(4),await Ws(h),h.q_.set("Unknown"),h.L_.delete(4),await fi(h)}(this))})}),this.q_=new dy(n,s)}}async function fi(r){if(gn(r))for(const e of r.B_)await e(!0)}async function Ws(r){for(const e of r.B_)await e(!1)}function Ah(r,e){const t=_e(r);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),cl(t)?ll(t):Qn(t).r_()&&ol(t,e))}function il(r,e){const t=_e(r),n=Qn(t);t.N_.delete(e),n.r_()&&Ch(t,e),t.N_.size===0&&(n.r_()?n.o_():gn(t)&&t.q_.set("Unknown"))}function ol(r,e){if(r.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(we.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Qn(r).A_(e)}function Ch(r,e){r.Q_.xe(e),Qn(r).R_(e)}function ll(r){r.Q_=new hx({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>r.N_.get(e)||null,tt:()=>r.datastore.serializer.databaseId}),Qn(r).start(),r.q_.v_()}function cl(r){return gn(r)&&!Qn(r).n_()&&r.N_.size>0}function gn(r){return _e(r).L_.size===0}function Rh(r){r.Q_=void 0}async function hy(r){r.q_.set("Online")}async function my(r){r.N_.forEach((e,t)=>{ol(r,e)})}async function gy(r,e){Rh(r),cl(r)?(r.q_.M_(e),ll(r)):r.q_.set("Unknown")}async function fy(r,e,t){if(r.q_.set("Online"),e instanceof yh&&e.state===2&&e.cause)try{await async function(s,i){const l=i.cause;for(const c of i.targetIds)s.N_.has(c)&&(await s.remoteSyncer.rejectListen(c,l),s.N_.delete(c),s.Q_.removeTarget(c))}(r,e)}catch(n){ue("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),n),await za(r,n)}else if(e instanceof Aa?r.Q_.Ke(e):e instanceof xh?r.Q_.He(e):r.Q_.We(e),!t.isEqual(we.min()))try{const n=await Th(r.localStore);t.compareTo(n)>=0&&await function(i,l){const c=i.Q_.rt(l);return c.targetChanges.forEach((d,h)=>{if(d.resumeToken.approximateByteSize()>0){const g=i.N_.get(h);g&&i.N_.set(h,g.withResumeToken(d.resumeToken,l))}}),c.targetMismatches.forEach((d,h)=>{const g=i.N_.get(d);if(!g)return;i.N_.set(d,g.withResumeToken(ct.EMPTY_BYTE_STRING,g.snapshotVersion)),Ch(i,d);const x=new Cr(g.target,d,h,g.sequenceNumber);ol(i,x)}),i.remoteSyncer.applyRemoteEvent(c)}(r,t)}catch(n){ue("RemoteStore","Failed to raise snapshot:",n),await za(r,n)}}async function za(r,e,t){if(!Us(e))throw e;r.L_.add(1),await Ws(r),r.q_.set("Offline"),t||(t=()=>Th(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{ue("RemoteStore","Retrying IndexedDB access"),await t(),r.L_.delete(1),await fi(r)})}function Ph(r,e){return e().catch(t=>za(r,t,e))}async function pi(r){const e=_e(r),t=Br(e);let n=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;py(e);)try{const s=await Zx(e.localStore,n);if(s===null){e.O_.length===0&&t.o_();break}n=s.batchId,xy(e,s)}catch(s){await za(e,s)}Dh(e)&&$h(e)}function py(r){return gn(r)&&r.O_.length<10}function xy(r,e){r.O_.push(e);const t=Br(r);t.r_()&&t.V_&&t.m_(e.mutations)}function Dh(r){return gn(r)&&!Br(r).n_()&&r.O_.length>0}function $h(r){Br(r).start()}async function yy(r){Br(r).p_()}async function by(r){const e=Br(r);for(const t of r.O_)e.m_(t.mutations)}async function vy(r,e,t){const n=r.O_.shift(),s=el.from(n,e,t);await Ph(r,()=>r.remoteSyncer.applySuccessfulWrite(s)),await pi(r)}async function wy(r,e){e&&Br(r).V_&&await async function(n,s){if(function(l){return cx(l)&&l!==G.ABORTED}(s.code)){const i=n.O_.shift();Br(n).s_(),await Ph(n,()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s)),await pi(n)}}(r,e),Dh(r)&&$h(r)}async function bd(r,e){const t=_e(r);t.asyncQueue.verifyOperationInProgress(),ue("RemoteStore","RemoteStore received new credentials");const n=gn(t);t.L_.add(3),await Ws(t),n&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await fi(t)}async function _y(r,e){const t=_e(r);e?(t.L_.delete(2),await fi(t)):e||(t.L_.add(2),await Ws(t),t.q_.set("Unknown"))}function Qn(r){return r.K_||(r.K_=function(t,n,s){const i=_e(t);return i.w_(),new oy(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Eo:hy.bind(null,r),Ro:my.bind(null,r),mo:gy.bind(null,r),d_:fy.bind(null,r)}),r.B_.push(async e=>{e?(r.K_.s_(),cl(r)?ll(r):r.q_.set("Unknown")):(await r.K_.stop(),Rh(r))})),r.K_}function Br(r){return r.U_||(r.U_=function(t,n,s){const i=_e(t);return i.w_(),new ly(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Eo:()=>Promise.resolve(),Ro:yy.bind(null,r),mo:wy.bind(null,r),f_:by.bind(null,r),g_:vy.bind(null,r)}),r.B_.push(async e=>{e?(r.U_.s_(),await pi(r)):(await r.U_.stop(),r.O_.length>0&&(ue("RemoteStore",`Stopping write stream with ${r.O_.length} pending writes`),r.O_=[]))})),r.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Mr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(l=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const l=Date.now()+n,c=new dl(e,t,l,s,i);return c.start(n),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new de(G.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ul(r,e){if(fr("AsyncQueue",`${e}: ${r}`),Us(r))return new de(G.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e){this.comparator=e?(t,n)=>e(t,n)||me.comparator(t.key,n.key):(t,n)=>me.comparator(t.key,n.key),this.keyedMap=ps(),this.sortedSet=new We(this.comparator)}static emptySet(e){return new In(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof In)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new In;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(){this.W_=new We(me.comparator)}track(e){const t=e.doc.key,n=this.W_.get(t);n?e.type!==0&&n.type===3?this.W_=this.W_.insert(t,e):e.type===3&&n.type!==1?this.W_=this.W_.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.W_=this.W_.remove(t):e.type===1&&n.type===2?this.W_=this.W_.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):be():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,n)=>{e.push(n)}),e}}class Un{constructor(e,t,n,s,i,l,c,d,h){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=l,this.syncStateChanged=c,this.excludesMetadataChanges=d,this.hasCachedResults=h}static fromInitialDocuments(e,t,n,s,i){const l=[];return t.forEach(c=>{l.push({type:0,doc:c})}),new Un(e,t,In.emptySet(t),l,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ci(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ey{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class ky{constructor(){this.queries=wd(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,n){const s=_e(t),i=s.queries;s.queries=wd(),i.forEach((l,c)=>{for(const d of c.j_)d.onError(n)})})(this,new de(G.ABORTED,"Firestore shutting down"))}}function wd(){return new Kn(r=>sh(r),ci)}async function Ny(r,e){const t=_e(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.H_()&&e.J_()&&(n=2):(i=new Ey,n=e.J_()?0:1);try{switch(n){case 0:i.z_=await t.onListen(s,!0);break;case 1:i.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(l){const c=ul(l,`Initialization of query '${En(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&hl(t)}async function jy(r,e){const t=_e(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const l=i.j_.indexOf(e);l>=0&&(i.j_.splice(l,1),i.j_.length===0?s=e.J_()?0:1:!i.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Ty(r,e){const t=_e(r);let n=!1;for(const s of e){const i=s.query,l=t.queries.get(i);if(l){for(const c of l.j_)c.X_(s)&&(n=!0);l.z_=s}}n&&hl(t)}function Iy(r,e,t){const n=_e(r),s=n.queries.get(e);if(s)for(const i of s.j_)i.onError(t);n.queries.delete(e)}function hl(r){r.Y_.forEach(e=>{e.next()})}var To,_d;(_d=To||(To={})).ea="default",_d.Cache="cache";class Sy{constructor(e,t,n){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=n||{}}X_(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new Un(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const n=t!=="Offline";return(!this.options._a||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Un.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==To.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh{constructor(e){this.key=e}}class Oh{constructor(e){this.key=e}}class Ay{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=Te(),this.mutatedKeys=Te(),this.Aa=ah(e),this.Ra=new In(this.Aa)}get Va(){return this.Ta}ma(e,t){const n=t?t.fa:new vd,s=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,l=s,c=!1;const d=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((g,x)=>{const p=s.get(g),T=di(this.query,x)?x:null,j=!!p&&this.mutatedKeys.has(p.key),E=!!T&&(T.hasLocalMutations||this.mutatedKeys.has(T.key)&&T.hasCommittedMutations);let I=!1;p&&T?p.data.isEqual(T.data)?j!==E&&(n.track({type:3,doc:T}),I=!0):this.ga(p,T)||(n.track({type:2,doc:T}),I=!0,(d&&this.Aa(T,d)>0||h&&this.Aa(T,h)<0)&&(c=!0)):!p&&T?(n.track({type:0,doc:T}),I=!0):p&&!T&&(n.track({type:1,doc:p}),I=!0,(d||h)&&(c=!0)),I&&(T?(l=l.add(T),i=E?i.add(g):i.delete(g)):(l=l.delete(g),i=i.delete(g)))}),this.query.limit!==null)for(;l.size>this.query.limit;){const g=this.query.limitType==="F"?l.last():l.first();l=l.delete(g.key),i=i.delete(g.key),n.track({type:1,doc:g})}return{Ra:l,fa:n,ns:c,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const l=e.fa.G_();l.sort((g,x)=>function(T,j){const E=I=>{switch(I){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return be()}};return E(T)-E(j)}(g.type,x.type)||this.Aa(g.doc,x.doc)),this.pa(n),s=s!=null&&s;const c=t&&!s?this.ya():[],d=this.da.size===0&&this.current&&!s?1:0,h=d!==this.Ea;return this.Ea=d,l.length!==0||h?{snapshot:new Un(this.query,e.Ra,i,l,e.mutatedKeys,d===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new vd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=Te(),this.Ra.forEach(n=>{this.Sa(n.key)&&(this.da=this.da.add(n.key))});const t=[];return e.forEach(n=>{this.da.has(n)||t.push(new Oh(n))}),this.da.forEach(n=>{e.has(n)||t.push(new Mh(n))}),t}ba(e){this.Ta=e.Ts,this.da=Te();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Un.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class Cy{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Ry{constructor(e){this.key=e,this.va=!1}}class Py{constructor(e,t,n,s,i,l){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=l,this.Ca={},this.Fa=new Kn(c=>sh(c),ci),this.Ma=new Map,this.xa=new Set,this.Oa=new We(me.comparator),this.Na=new Map,this.La=new nl,this.Ba={},this.ka=new Map,this.qa=Fn.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Dy(r,e,t=!0){const n=qh(r);let s;const i=n.Fa.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await Vh(n,e,t,!0),s}async function $y(r,e){const t=qh(r);await Vh(t,e,!0,!1)}async function Vh(r,e,t,n){const s=await ey(r.localStore,Qt(e)),i=s.targetId,l=r.sharedClientState.addLocalQueryTarget(i,t);let c;return n&&(c=await My(r,e,i,l==="current",s.resumeToken)),r.isPrimaryClient&&t&&Ah(r.remoteStore,s),c}async function My(r,e,t,n,s){r.Ka=(x,p,T)=>async function(E,I,D,S){let C=I.view.ma(D);C.ns&&(C=await pd(E.localStore,I.query,!1).then(({documents:_})=>I.view.ma(_,C)));const F=S&&S.targetChanges.get(I.targetId),ne=S&&S.targetMismatches.get(I.targetId)!=null,B=I.view.applyChanges(C,E.isPrimaryClient,F,ne);return kd(E,I.targetId,B.wa),B.snapshot}(r,x,p,T);const i=await pd(r.localStore,e,!0),l=new Ay(e,i.Ts),c=l.ma(i.documents),d=qs.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),h=l.applyChanges(c,r.isPrimaryClient,d);kd(r,t,h.wa);const g=new Cy(e,t,l);return r.Fa.set(e,g),r.Ma.has(t)?r.Ma.get(t).push(e):r.Ma.set(t,[e]),h.snapshot}async function Oy(r,e,t){const n=_e(r),s=n.Fa.get(e),i=n.Ma.get(s.targetId);if(i.length>1)return n.Ma.set(s.targetId,i.filter(l=>!ci(l,e))),void n.Fa.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await jo(n.localStore,s.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(s.targetId),t&&il(n.remoteStore,s.targetId),Io(n,s.targetId)}).catch(Fs)):(Io(n,s.targetId),await jo(n.localStore,s.targetId,!0))}async function Vy(r,e){const t=_e(r),n=t.Fa.get(e),s=t.Ma.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),il(t.remoteStore,n.targetId))}async function Ly(r,e,t){const n=Hy(r);try{const s=await function(l,c){const d=_e(l),h=et.now(),g=c.reduce((T,j)=>T.add(j.key),Te());let x,p;return d.persistence.runTransaction("Locally write mutations","readwrite",T=>{let j=pr(),E=Te();return d.cs.getEntries(T,g).next(I=>{j=I,j.forEach((D,S)=>{S.isValidDocument()||(E=E.add(D))})}).next(()=>d.localDocuments.getOverlayedDocuments(T,j)).next(I=>{x=I;const D=[];for(const S of c){const C=sx(S,x.get(S.key).overlayedDocument);C!=null&&D.push(new qr(S.key,C,Qu(C.value.mapValue),Bt.exists(!0)))}return d.mutationQueue.addMutationBatch(T,h,D,c)}).next(I=>{p=I;const D=I.applyToLocalDocumentSet(x,E);return d.documentOverlayCache.saveOverlays(T,I.batchId,D)})}).then(()=>({batchId:p.batchId,changes:oh(x)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),function(l,c,d){let h=l.Ba[l.currentUser.toKey()];h||(h=new We(Ce)),h=h.insert(c,d),l.Ba[l.currentUser.toKey()]=h}(n,s.batchId,t),await zs(n,s.changes),await pi(n.remoteStore)}catch(s){const i=ul(s,"Failed to persist write");t.reject(i)}}async function Lh(r,e){const t=_e(r);try{const n=await Xx(t.localStore,e);e.targetChanges.forEach((s,i)=>{const l=t.Na.get(i);l&&(Me(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?l.va=!0:s.modifiedDocuments.size>0?Me(l.va):s.removedDocuments.size>0&&(Me(l.va),l.va=!1))}),await zs(t,n,e)}catch(n){await Fs(n)}}function Ed(r,e,t){const n=_e(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Fa.forEach((i,l)=>{const c=l.view.Z_(e);c.snapshot&&s.push(c.snapshot)}),function(l,c){const d=_e(l);d.onlineState=c;let h=!1;d.queries.forEach((g,x)=>{for(const p of x.j_)p.Z_(c)&&(h=!0)}),h&&hl(d)}(n.eventManager,e),s.length&&n.Ca.d_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function Fy(r,e,t){const n=_e(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Na.get(e),i=s&&s.key;if(i){let l=new We(me.comparator);l=l.insert(i,gt.newNoDocument(i,we.min()));const c=Te().add(i),d=new mi(we.min(),new Map,new We(Ce),l,c);await Lh(n,d),n.Oa=n.Oa.remove(i),n.Na.delete(e),ml(n)}else await jo(n.localStore,e,!1).then(()=>Io(n,e,t)).catch(Fs)}async function Uy(r,e){const t=_e(r),n=e.batch.batchId;try{const s=await Yx(t.localStore,e);Uh(t,n,null),Fh(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await zs(t,s)}catch(s){await Fs(s)}}async function By(r,e,t){const n=_e(r);try{const s=await function(l,c){const d=_e(l);return d.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let g;return d.mutationQueue.lookupMutationBatch(h,c).next(x=>(Me(x!==null),g=x.keys(),d.mutationQueue.removeMutationBatch(h,x))).next(()=>d.mutationQueue.performConsistencyCheck(h)).next(()=>d.documentOverlayCache.removeOverlaysForBatchId(h,g,c)).next(()=>d.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,g)).next(()=>d.localDocuments.getDocuments(h,g))})}(n.localStore,e);Uh(n,e,t),Fh(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await zs(n,s)}catch(s){await Fs(s)}}function Fh(r,e){(r.ka.get(e)||[]).forEach(t=>{t.resolve()}),r.ka.delete(e)}function Uh(r,e,t){const n=_e(r);let s=n.Ba[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.Ba[n.currentUser.toKey()]=s}}function Io(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Ma.get(e))r.Fa.delete(n),t&&r.Ca.$a(n,t);r.Ma.delete(e),r.isPrimaryClient&&r.La.gr(e).forEach(n=>{r.La.containsKey(n)||Bh(r,n)})}function Bh(r,e){r.xa.delete(e.path.canonicalString());const t=r.Oa.get(e);t!==null&&(il(r.remoteStore,t),r.Oa=r.Oa.remove(e),r.Na.delete(t),ml(r))}function kd(r,e,t){for(const n of t)n instanceof Mh?(r.La.addReference(n.key,e),qy(r,n)):n instanceof Oh?(ue("SyncEngine","Document no longer in limbo: "+n.key),r.La.removeReference(n.key,e),r.La.containsKey(n.key)||Bh(r,n.key)):be()}function qy(r,e){const t=e.key,n=t.path.canonicalString();r.Oa.get(t)||r.xa.has(n)||(ue("SyncEngine","New document in limbo: "+t),r.xa.add(n),ml(r))}function ml(r){for(;r.xa.size>0&&r.Oa.size<r.maxConcurrentLimboResolutions;){const e=r.xa.values().next().value;r.xa.delete(e);const t=new me(Be.fromString(e)),n=r.qa.next();r.Na.set(n,new Ry(t)),r.Oa=r.Oa.insert(t,n),Ah(r.remoteStore,new Cr(Qt(rh(t.path)),n,"TargetPurposeLimboResolution",Ho.oe))}}async function zs(r,e,t){const n=_e(r),s=[],i=[],l=[];n.Fa.isEmpty()||(n.Fa.forEach((c,d)=>{l.push(n.Ka(d,e,t).then(h=>{var g;if((h||t)&&n.isPrimaryClient){const x=h?!h.fromCache:(g=t==null?void 0:t.targetChanges.get(d.targetId))===null||g===void 0?void 0:g.current;n.sharedClientState.updateQueryState(d.targetId,x?"current":"not-current")}if(h){s.push(h);const x=al.Wi(d.targetId,h);i.push(x)}}))}),await Promise.all(l),n.Ca.d_(s),await async function(d,h){const g=_e(d);try{await g.persistence.runTransaction("notifyLocalViewChanges","readwrite",x=>Y.forEach(h,p=>Y.forEach(p.$i,T=>g.persistence.referenceDelegate.addReference(x,p.targetId,T)).next(()=>Y.forEach(p.Ui,T=>g.persistence.referenceDelegate.removeReference(x,p.targetId,T)))))}catch(x){if(!Us(x))throw x;ue("LocalStore","Failed to update sequence numbers: "+x)}for(const x of h){const p=x.targetId;if(!x.fromCache){const T=g.os.get(p),j=T.snapshotVersion,E=T.withLastLimboFreeSnapshotVersion(j);g.os=g.os.insert(p,E)}}}(n.localStore,i))}async function Wy(r,e){const t=_e(r);if(!t.currentUser.isEqual(e)){ue("SyncEngine","User change. New user:",e.toKey());const n=await jh(t.localStore,e);t.currentUser=e,function(i,l){i.ka.forEach(c=>{c.forEach(d=>{d.reject(new de(G.CANCELLED,l))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await zs(t,n.hs)}}function zy(r,e){const t=_e(r),n=t.Na.get(e);if(n&&n.va)return Te().add(n.key);{let s=Te();const i=t.Ma.get(e);if(!i)return s;for(const l of i){const c=t.Fa.get(l);s=s.unionWith(c.view.Va)}return s}}function qh(r){const e=_e(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Lh.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=zy.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Fy.bind(null,e),e.Ca.d_=Ty.bind(null,e.eventManager),e.Ca.$a=Iy.bind(null,e.eventManager),e}function Hy(r){const e=_e(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Uy.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=By.bind(null,e),e}class Ha{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=gi(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return Qx(this.persistence,new Gx,e.initialUser,this.serializer)}Ga(e){return new Wx(sl.Zr,this.serializer)}Wa(e){return new ry}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ha.provider={build:()=>new Ha};class So{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>Ed(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=Wy.bind(null,this.syncEngine),await _y(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new ky}()}createDatastore(e){const t=gi(e.databaseInfo.databaseId),n=function(i){return new iy(i)}(e.databaseInfo);return function(i,l,c,d){return new cy(i,l,c,d)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,s,i,l,c){return new uy(n,s,i,l,c)}(this.localStore,this.datastore,e.asyncQueue,t=>Ed(this.syncEngine,t,0),function(){return yd.D()?new yd:new ny}())}createSyncEngine(e,t){return function(s,i,l,c,d,h,g){const x=new Py(s,i,l,c,d,h);return g&&(x.Qa=!0),x}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const i=_e(s);ue("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Ws(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}So.provider={build:()=>new So};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gy{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):fr("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=s,this.user=mt.UNAUTHENTICATED,this.clientId=Hu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async l=>{ue("FirestoreClient","Received user=",l.uid),await this.authCredentialListener(l),this.user=l}),this.appCheckCredentials.start(n,l=>(ue("FirestoreClient","Received new app check token=",l),this.appCheckCredentialListener(l,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Mr;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=ul(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function Yi(r,e){r.asyncQueue.verifyOperationInProgress(),ue("FirestoreClient","Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async s=>{n.isEqual(s)||(await jh(e.localStore,s),n=s)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function Nd(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Qy(r);ue("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>bd(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,s)=>bd(e.remoteStore,s)),r._onlineComponents=e}async function Qy(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){ue("FirestoreClient","Using user provided OfflineComponentProvider");try{await Yi(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===G.FAILED_PRECONDITION||s.code===G.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;Mn("Error using user provided cache. Falling back to memory cache: "+t),await Yi(r,new Ha)}}else ue("FirestoreClient","Using default OfflineComponentProvider"),await Yi(r,new Ha);return r._offlineComponents}async function Wh(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(ue("FirestoreClient","Using user provided OnlineComponentProvider"),await Nd(r,r._uninitializedComponentsProvider._online)):(ue("FirestoreClient","Using default OnlineComponentProvider"),await Nd(r,new So))),r._onlineComponents}function Yy(r){return Wh(r).then(e=>e.syncEngine)}async function Xy(r){const e=await Wh(r),t=e.eventManager;return t.onListen=Dy.bind(null,e.syncEngine),t.onUnlisten=Oy.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=$y.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Vy.bind(null,e.syncEngine),t}function Jy(r,e,t={}){const n=new Mr;return r.asyncQueue.enqueueAndForget(async()=>function(i,l,c,d,h){const g=new Gy({next:p=>{g.Za(),l.enqueueAndForget(()=>jy(i,x)),p.fromCache&&d.source==="server"?h.reject(new de(G.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(p)},error:p=>h.reject(p)}),x=new Sy(c,g,{includeMetadataChanges:!0,_a:!0});return Ny(i,x)}(await Xy(r),r.asyncQueue,e,t,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zh(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jd=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hh(r,e,t){if(!t)throw new de(G.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function Zy(r,e,t,n){if(e===!0&&n===!0)throw new de(G.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Td(r){if(!me.isDocumentKey(r))throw new de(G.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Id(r){if(me.isDocumentKey(r))throw new de(G.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function xi(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":be()}function ln(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new de(G.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=xi(r);throw new de(G.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sd{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new de(G.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new de(G.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Zy("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=zh((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new de(G.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new de(G.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new de(G.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,s){return n.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class yi{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Sd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new de(G.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new de(G.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Sd(e),e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new mp;switch(n.type){case"firstParty":return new xp(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new de(G.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=jd.get(t);n&&(ue("ComponentProvider","Removing Datastore"),jd.delete(t),n.terminate())}(this),Promise.resolve()}}function eb(r,e,t,n={}){var s;const i=(r=ln(r,yi))._getSettings(),l=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==l&&Mn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),r._setSettings(Object.assign(Object.assign({},i),{host:l,ssl:!1})),n.mockUserToken){let c,d;if(typeof n.mockUserToken=="string")c=n.mockUserToken,d=mt.MOCK_USER;else{c=Pu(n.mockUserToken,(s=r._app)===null||s===void 0?void 0:s.options.projectId);const h=n.mockUserToken.sub||n.mockUserToken.user_id;if(!h)throw new de(G.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");d=new mt(h)}r._authCredentials=new gp(new zu(c,d))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new fn(this.firestore,e,this._query)}}class Ct{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Or(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ct(this.firestore,e,this._key)}}class Or extends fn{constructor(e,t,n){super(e,t,rh(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ct(this.firestore,null,new me(e))}withConverter(e){return new Or(this.firestore,e,this._path)}}function xt(r,e,...t){if(r=pt(r),Hh("collection","path",e),r instanceof yi){const n=Be.fromString(e,...t);return Id(n),new Or(r,null,n)}{if(!(r instanceof Ct||r instanceof Or))throw new de(G.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Be.fromString(e,...t));return Id(n),new Or(r.firestore,null,n)}}function Tt(r,e,...t){if(r=pt(r),arguments.length===1&&(e=Hu.newId()),Hh("doc","path",e),r instanceof yi){const n=Be.fromString(e,...t);return Td(n),new Ct(r,null,new me(n))}{if(!(r instanceof Ct||r instanceof Or))throw new de(G.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Be.fromString(e,...t));return Td(n),new Ct(r.firestore,r instanceof Or?r.converter:null,new me(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Ih(this,"async_queue_retry"),this.Vu=()=>{const n=Qi();n&&ue("AsyncQueue","Visibility state changed to "+n.visibilityState),this.t_.jo()},this.mu=e;const t=Qi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Qi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Mr;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Us(e))throw e;ue("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(n=>{this.Eu=n,this.du=!1;const s=function(l){let c=l.message||"";return l.stack&&(c=l.stack.includes(l.message)?l.stack:l.message+`
`+l.stack),c}(n);throw fr("INTERNAL UNHANDLED ERROR: ",s),n}).then(n=>(this.du=!1,n))));return this.mu=t,t}enqueueAfterDelay(e,t,n){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=dl.createAndSchedule(this,e,t,n,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&be()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class Hs extends yi{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Ad,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ad(e),this._firestoreClient=void 0,await e}}}function tb(r,e){const t=typeof r=="object"?r:Wo(),n=typeof r=="string"?r:"(default)",s=oi(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=Au("firestore");i&&eb(s,...i)}return s}function Gh(r){if(r._terminated)throw new de(G.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||rb(r),r._firestoreClient}function rb(r){var e,t,n;const s=r._freezeSettings(),i=function(c,d,h,g){return new Ap(c,d,h,g.host,g.ssl,g.experimentalForceLongPolling,g.experimentalAutoDetectLongPolling,zh(g.experimentalLongPollingOptions),g.useFetchStreams)}(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,s);r._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=s.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),r._firestoreClient=new Ky(r._authCredentials,r._appCheckCredentials,r._queue,i,r._componentsProvider&&function(c){const d=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(d),_online:d}}(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Bn(ct.fromBase64String(e))}catch(t){throw new de(G.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Bn(ct.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new de(G.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ot(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new de(G.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new de(G.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return Ce(this._lat,e._lat)||Ce(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nb=/^__.*__$/;class sb{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new qr(e,this.data,this.fieldMask,t,this.fieldTransforms):new Bs(e,this.data,t,this.fieldTransforms)}}class Kh{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new qr(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Qh(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw be()}}class xl{constructor(e,t,n,s,i,l){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=l||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new xl(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:n,xu:!1});return s.Ou(e),s}Nu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:n,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Ga(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Qh(this.Cu)&&nb.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class ab{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||gi(e)}Qu(e,t,n,s=!1){return new xl({Cu:e,methodName:t,qu:n,path:ot.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function yl(r){const e=r._freezeSettings(),t=gi(r._databaseId);return new ab(r._databaseId,!!e.ignoreUndefinedProperties,t)}function ib(r,e,t,n,s,i={}){const l=r.Qu(i.merge||i.mergeFields?2:0,e,t,s);bl("Data must be an object, but it was:",l,n);const c=Yh(n,l);let d,h;if(i.merge)d=new At(l.fieldMask),h=l.fieldTransforms;else if(i.mergeFields){const g=[];for(const x of i.mergeFields){const p=Ao(e,x,t);if(!l.contains(p))throw new de(G.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);Jh(g,p)||g.push(p)}d=new At(g),h=l.fieldTransforms.filter(x=>d.covers(x.field))}else d=null,h=l.fieldTransforms;return new sb(new jt(c),d,h)}class vi extends gl{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof vi}}function ob(r,e,t,n){const s=r.Qu(1,e,t);bl("Data must be an object, but it was:",s,n);const i=[],l=jt.empty();mn(n,(d,h)=>{const g=vl(e,d,t);h=pt(h);const x=s.Nu(g);if(h instanceof vi)i.push(g);else{const p=Gs(h,x);p!=null&&(i.push(g),l.set(g,p))}});const c=new At(i);return new Kh(l,c,s.fieldTransforms)}function lb(r,e,t,n,s,i){const l=r.Qu(1,e,t),c=[Ao(e,n,t)],d=[s];if(i.length%2!=0)throw new de(G.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<i.length;p+=2)c.push(Ao(e,i[p])),d.push(i[p+1]);const h=[],g=jt.empty();for(let p=c.length-1;p>=0;--p)if(!Jh(h,c[p])){const T=c[p];let j=d[p];j=pt(j);const E=l.Nu(T);if(j instanceof vi)h.push(T);else{const I=Gs(j,E);I!=null&&(h.push(T),g.set(T,I))}}const x=new At(h);return new Kh(g,x,l.fieldTransforms)}function cb(r,e,t,n=!1){return Gs(t,r.Qu(n?4:3,e))}function Gs(r,e){if(Xh(r=pt(r)))return bl("Unsupported field value:",e,r),Yh(r,e);if(r instanceof gl)return function(n,s){if(!Qh(s.Cu))throw s.Bu(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(n,s){const i=[];let l=0;for(const c of n){let d=Gs(c,s.Lu(l));d==null&&(d={nullValue:"NULL_VALUE"}),i.push(d),l++}return{arrayValue:{values:i}}}(r,e)}return function(n,s){if((n=pt(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Jp(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=et.fromDate(n);return{timestampValue:Wa(s.serializer,i)}}if(n instanceof et){const i=new et(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Wa(s.serializer,i)}}if(n instanceof fl)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Bn)return{bytesValue:bh(s.serializer,n._byteString)};if(n instanceof Ct){const i=s.databaseId,l=n.firestore._databaseId;if(!l.isEqual(i))throw s.Bu(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:rl(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof pl)return function(l,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:l.toArray().map(d=>{if(typeof d!="number")throw c.Bu("VectorValues must only contain numeric values.");return Jo(c.serializer,d)})}}}}}}(n,s);throw s.Bu(`Unsupported field value: ${xi(n)}`)}(r,e)}function Yh(r,e){const t={};return Gu(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):mn(r,(n,s)=>{const i=Gs(s,e.Mu(n));i!=null&&(t[n]=i)}),{mapValue:{fields:t}}}function Xh(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof et||r instanceof fl||r instanceof Bn||r instanceof Ct||r instanceof gl||r instanceof pl)}function bl(r,e,t){if(!Xh(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const n=xi(t);throw n==="an object"?e.Bu(r+" a custom object"):e.Bu(r+" "+n)}}function Ao(r,e,t){if((e=pt(e))instanceof bi)return e._internalPath;if(typeof e=="string")return vl(r,e);throw Ga("Field path arguments must be of type string or ",r,!1,void 0,t)}const db=new RegExp("[~\\*/\\[\\]]");function vl(r,e,t){if(e.search(db)>=0)throw Ga(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new bi(...e.split("."))._internalPath}catch{throw Ga(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Ga(r,e,t,n,s){const i=n&&!n.isEmpty(),l=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let d="";return(i||l)&&(d+=" (found",i&&(d+=` in field ${n}`),l&&(d+=` in document ${s}`),d+=")"),new de(G.INVALID_ARGUMENT,c+r+d)}function Jh(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Ct(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ub(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(wi("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ub extends Zh{data(){return super.data()}}function wi(r,e){return typeof e=="string"?vl(r,e):e instanceof bi?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hb(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new de(G.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class wl{}class em extends wl{}function Ze(r,e,...t){let n=[];e instanceof wl&&n.push(e),n=n.concat(t),function(i){const l=i.filter(d=>d instanceof _l).length,c=i.filter(d=>d instanceof _i).length;if(l>1||l>0&&c>0)throw new de(G.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const s of n)r=s._apply(r);return r}class _i extends em{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new _i(e,t,n)}_apply(e){const t=this._parse(e);return tm(e._query,t),new fn(e.firestore,e.converter,vo(e._query,t))}_parse(e){const t=yl(e.firestore);return function(i,l,c,d,h,g,x){let p;if(h.isKeyField()){if(g==="array-contains"||g==="array-contains-any")throw new de(G.INVALID_ARGUMENT,`Invalid Query. You can't perform '${g}' queries on documentId().`);if(g==="in"||g==="not-in"){Rd(x,g);const T=[];for(const j of x)T.push(Cd(d,i,j));p={arrayValue:{values:T}}}else p=Cd(d,i,x)}else g!=="in"&&g!=="not-in"&&g!=="array-contains-any"||Rd(x,g),p=cb(c,l,x,g==="in"||g==="not-in");return Ye.create(h,g,p)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Rt(r,e,t){const n=e,s=wi("where",r);return _i._create(s,n,t)}class _l extends wl{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new _l(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:Wt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,i){let l=s;const c=i.getFlattenedFilters();for(const d of c)tm(l,d),l=vo(l,d)}(e._query,t),new fn(e.firestore,e.converter,vo(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class El extends em{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new El(e,t)}_apply(e){const t=function(s,i,l){if(s.startAt!==null)throw new de(G.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new de(G.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Cs(i,l)}(e._query,this._field,this._direction);return new fn(e.firestore,e.converter,function(s,i){const l=s.explicitOrderBy.concat([i]);return new Gn(s.path,s.collectionGroup,l,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(e._query,t))}}function Ds(r,e="asc"){const t=e,n=wi("orderBy",r);return El._create(n,t)}function Cd(r,e,t){if(typeof(t=pt(t))=="string"){if(t==="")throw new de(G.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!nh(e)&&t.indexOf("/")!==-1)throw new de(G.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Be.fromString(t));if(!me.isDocumentKey(n))throw new de(G.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Zc(r,new me(n))}if(t instanceof Ct)return Zc(r,t._key);throw new de(G.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${xi(t)}.`)}function Rd(r,e){if(!Array.isArray(r)||r.length===0)throw new de(G.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function tm(r,e){const t=function(s,i){for(const l of s)for(const c of l.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null}(r.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new de(G.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new de(G.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class mb{convertValue(e,t="none"){switch(on(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ke(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(an(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw be()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return mn(e,(s,i)=>{n[s]=this.convertValue(i,t)}),n}convertVectorValue(e){var t,n,s;const i=(s=(n=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||n===void 0?void 0:n.values)===null||s===void 0?void 0:s.map(l=>Ke(l.doubleValue));return new pl(i)}convertGeoPoint(e){return new fl(Ke(e.latitude),Ke(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Ko(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Is(e));default:return null}}convertTimestamp(e){const t=Ur(e);return new et(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Be.fromString(e);Me(Nh(n));const s=new Ss(n.get(1),n.get(3)),i=new me(n.popFirst(5));return s.isEqual(t)||fr(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gb(r,e,t){let n;return n=r?r.toFirestore(e):e,n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class fb extends Zh{constructor(e,t,n,s,i,l){super(e,t,n,s,l),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ca(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(wi("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class Ca extends fb{data(e={}){return super.data(e)}}class pb{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new wa(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Ca(this._firestore,this._userDataWriter,n.key,n,new wa(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new de(G.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let l=0;return s._snapshot.docChanges.map(c=>{const d=new Ca(s._firestore,s._userDataWriter,c.doc.key,c.doc,new wa(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:d,oldIndex:-1,newIndex:l++}})}{let l=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(c=>i||c.type!==3).map(c=>{const d=new Ca(s._firestore,s._userDataWriter,c.doc.key,c.doc,new wa(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,g=-1;return c.type!==0&&(h=l.indexOf(c.doc.key),l=l.delete(c.doc.key)),c.type!==1&&(l=l.add(c.doc),g=l.indexOf(c.doc.key)),{type:xb(c.type),doc:d,oldIndex:h,newIndex:g}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function xb(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return be()}}class yb extends mb{constructor(e){super(),this.firestore=e}convertBytes(e){return new Bn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ct(this.firestore,null,t)}}function er(r){r=ln(r,fn);const e=ln(r.firestore,Hs),t=Gh(e),n=new yb(e);return hb(r._query),Jy(t,r._query).then(s=>new pb(e,n,r,s))}function Yn(r,e,t,...n){r=ln(r,Ct);const s=ln(r.firestore,Hs),i=yl(s);let l;return l=typeof(e=pt(e))=="string"||e instanceof bi?lb(i,"updateDoc",r._key,e,t,n):ob(i,"updateDoc",r._key,e),kl(s,[l.toMutation(r._key,Bt.exists(!0))])}function pn(r){return kl(ln(r.firestore,Hs),[new Zo(r._key,Bt.none())])}function Xn(r,e){const t=ln(r.firestore,Hs),n=Tt(r),s=gb(r.converter,e);return kl(t,[ib(yl(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,Bt.exists(!1))]).then(()=>n)}function kl(r,e){return function(n,s){const i=new Mr;return n.asyncQueue.enqueueAndForget(async()=>Ly(await Yy(n),s,i)),i.promise}(Gh(r),e)}(function(e,t=!0){(function(s){Hn=s})(hn),nn(new Lr("firestore",(n,{instanceIdentifier:s,options:i})=>{const l=n.getProvider("app").getImmediate(),c=new Hs(new fp(n.getProvider("auth-internal")),new bp(n.getProvider("app-check-internal")),function(h,g){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new de(G.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ss(h.options.projectId,g)}(l,s),l);return i=Object.assign({useFetchStreams:t},i),c._setSettings(i),c},"PUBLIC").setMultipleInstances(!0)),Kt(Kc,"4.7.3",e),Kt(Kc,"4.7.3","esm2017")})();var bb="firebase",vb="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Kt(bb,vb,"app");function Nl(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(r);s<n.length;s++)e.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(r,n[s])&&(t[n[s]]=r[n[s]]);return t}function rm(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const wb=rm,nm=new Vs("auth","Firebase",rm());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ka=new Bo("@firebase/auth");function _b(r,...e){Ka.logLevel<=Ie.WARN&&Ka.warn(`Auth (${hn}): ${r}`,...e)}function Ra(r,...e){Ka.logLevel<=Ie.ERROR&&Ka.error(`Auth (${hn}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(r,...e){throw jl(r,...e)}function Xt(r,...e){return jl(r,...e)}function sm(r,e,t){const n=Object.assign(Object.assign({},wb()),{[e]:t});return new Vs("auth","Firebase",n).create(e,{appName:r.name})}function tn(r){return sm(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function jl(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return nm.create(r,...e)}function ye(r,e,...t){if(!r)throw jl(e,...t)}function cr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Ra(e),new Error(e)}function yr(r,e){r||cr(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Co(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function Eb(){return Pd()==="http:"||Pd()==="https:"}function Pd(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kb(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Eb()||Gf()||"connection"in navigator)?navigator.onLine:!0}function Nb(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e,t){this.shortDelay=e,this.longDelay=t,yr(t>e,"Short delay should be less than long delay!"),this.isMobile=Wf()||Kf()}get(){return kb()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tl(r,e){yr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class am{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;cr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;cr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;cr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jb={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tb=new Ks(3e4,6e4);function Il(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Jn(r,e,t,n,s={}){return im(r,s,async()=>{let i={},l={};n&&(e==="GET"?l=n:i={body:JSON.stringify(n)});const c=Ls(Object.assign({key:r.config.apiKey},l)).slice(1),d=await r._getAdditionalHeaders();d["Content-Type"]="application/json",r.languageCode&&(d["X-Firebase-Locale"]=r.languageCode);const h=Object.assign({method:e,headers:d},i);return Hf()||(h.referrerPolicy="no-referrer"),am.fetch()(om(r,r.config.apiHost,t,c),h)})}async function im(r,e,t){r._canInitEmulator=!1;const n=Object.assign(Object.assign({},jb),e);try{const s=new Sb(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const l=await i.json();if("needConfirmation"in l)throw _a(r,"account-exists-with-different-credential",l);if(i.ok&&!("errorMessage"in l))return l;{const c=i.ok?l.errorMessage:l.error.message,[d,h]=c.split(" : ");if(d==="FEDERATED_USER_ID_ALREADY_LINKED")throw _a(r,"credential-already-in-use",l);if(d==="EMAIL_EXISTS")throw _a(r,"email-already-in-use",l);if(d==="USER_DISABLED")throw _a(r,"user-disabled",l);const g=n[d]||d.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw sm(r,g,h);xr(r,g)}}catch(s){if(s instanceof nr)throw s;xr(r,"network-request-failed",{message:String(s)})}}async function Ib(r,e,t,n,s={}){const i=await Jn(r,e,t,n,s);return"mfaPendingCredential"in i&&xr(r,"multi-factor-auth-required",{_serverResponse:i}),i}function om(r,e,t,n){const s=`${e}${t}?${n}`;return r.config.emulator?Tl(r.config,s):`${r.config.apiScheme}://${s}`}class Sb{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(Xt(this.auth,"network-request-failed")),Tb.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function _a(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=Xt(r,e,n);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ab(r,e){return Jn(r,"POST","/v1/accounts:delete",e)}async function lm(r,e){return Jn(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Cb(r,e=!1){const t=pt(r),n=await t.getIdToken(e),s=Sl(n);ye(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,l=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:Es(Xi(s.auth_time)),issuedAtTime:Es(Xi(s.iat)),expirationTime:Es(Xi(s.exp)),signInProvider:l||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Xi(r){return Number(r)*1e3}function Sl(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Ra("JWT malformed, contained fewer than 3 sections"),null;try{const s=Iu(t);return s?JSON.parse(s):(Ra("Failed to decode base64 JWT payload"),null)}catch(s){return Ra("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Dd(r){const e=Sl(r);return ye(e,"internal-error"),ye(typeof e.exp<"u","internal-error"),ye(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $s(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof nr&&Rb(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function Rb({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pb{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ro{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Es(this.lastLoginAt),this.creationTime=Es(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qa(r){var e;const t=r.auth,n=await r.getIdToken(),s=await $s(r,lm(t,{idToken:n}));ye(s==null?void 0:s.users.length,t,"internal-error");const i=s.users[0];r._notifyReloadListener(i);const l=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?cm(i.providerUserInfo):[],c=$b(r.providerData,l),d=r.isAnonymous,h=!(r.email&&i.passwordHash)&&!(c!=null&&c.length),g=d?h:!1,x={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:c,metadata:new Ro(i.createdAt,i.lastLoginAt),isAnonymous:g};Object.assign(r,x)}async function Db(r){const e=pt(r);await Qa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function $b(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function cm(r){return r.map(e=>{var{providerId:t}=e,n=Nl(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mb(r,e){const t=await im(r,{},async()=>{const n=Ls({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,l=om(r,s,"/v1/token",`key=${i}`),c=await r._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",am.fetch()(l,{method:"POST",headers:c,body:n})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Ob(r,e){return Jn(r,"POST","/v2/accounts:revokeToken",Il(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ye(e.idToken,"internal-error"),ye(typeof e.idToken<"u","internal-error"),ye(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Dd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ye(e.length!==0,"internal-error");const t=Dd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(ye(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await Mb(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,l=new Sn;return n&&(ye(typeof n=="string","internal-error",{appName:e}),l.refreshToken=n),s&&(ye(typeof s=="string","internal-error",{appName:e}),l.accessToken=s),i&&(ye(typeof i=="number","internal-error",{appName:e}),l.expirationTime=i),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Sn,this.toJSON())}_performRefresh(){return cr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kr(r,e){ye(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class dr{constructor(e){var{uid:t,auth:n,stsTokenManager:s}=e,i=Nl(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Pb(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ro(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await $s(this,this.stsTokenManager.getToken(this.auth,e));return ye(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Cb(this,e)}reload(){return Db(this)}_assign(e){this!==e&&(ye(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new dr(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){ye(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Qa(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ar(this.auth.app))return Promise.reject(tn(this.auth));const e=await this.getIdToken();return await $s(this,Ab(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,s,i,l,c,d,h,g;const x=(n=t.displayName)!==null&&n!==void 0?n:void 0,p=(s=t.email)!==null&&s!==void 0?s:void 0,T=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,j=(l=t.photoURL)!==null&&l!==void 0?l:void 0,E=(c=t.tenantId)!==null&&c!==void 0?c:void 0,I=(d=t._redirectEventId)!==null&&d!==void 0?d:void 0,D=(h=t.createdAt)!==null&&h!==void 0?h:void 0,S=(g=t.lastLoginAt)!==null&&g!==void 0?g:void 0,{uid:C,emailVerified:F,isAnonymous:ne,providerData:B,stsTokenManager:_}=t;ye(C&&_,e,"internal-error");const y=Sn.fromJSON(this.name,_);ye(typeof C=="string",e,"internal-error"),kr(x,e.name),kr(p,e.name),ye(typeof F=="boolean",e,"internal-error"),ye(typeof ne=="boolean",e,"internal-error"),kr(T,e.name),kr(j,e.name),kr(E,e.name),kr(I,e.name),kr(D,e.name),kr(S,e.name);const b=new dr({uid:C,auth:e,email:p,emailVerified:F,displayName:x,isAnonymous:ne,photoURL:j,phoneNumber:T,tenantId:E,stsTokenManager:y,createdAt:D,lastLoginAt:S});return B&&Array.isArray(B)&&(b.providerData=B.map(w=>Object.assign({},w))),I&&(b._redirectEventId=I),b}static async _fromIdTokenResponse(e,t,n=!1){const s=new Sn;s.updateFromServerResponse(t);const i=new dr({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await Qa(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];ye(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?cm(s.providerUserInfo):[],l=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new Sn;c.updateFromIdToken(n);const d=new dr({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:l}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ro(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(d,h),d}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d=new Map;function ur(r){yr(r instanceof Function,"Expected a class definition");let e=$d.get(r);return e?(yr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,$d.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dm{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}dm.type="NONE";const Md=dm;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pa(r,e,t){return`firebase:${r}:${e}:${t}`}class An{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=Pa(this.userKey,s.apiKey,i),this.fullPersistenceKey=Pa("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?dr._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new An(ur(Md),e,n);const s=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=s[0]||ur(Md);const l=Pa(n,e.config.apiKey,e.name);let c=null;for(const h of t)try{const g=await h._get(l);if(g){const x=dr._fromJSON(e,g);h!==i&&(c=x),i=h;break}}catch{}const d=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!d.length?new An(i,e,n):(i=d[0],c&&await i._set(l,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==i)try{await h._remove(l)}catch{}})),new An(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Od(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(gm(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(um(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(pm(e))return"Blackberry";if(xm(e))return"Webos";if(hm(e))return"Safari";if((e.includes("chrome/")||mm(e))&&!e.includes("edge/"))return"Chrome";if(fm(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function um(r=ft()){return/firefox\//i.test(r)}function hm(r=ft()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function mm(r=ft()){return/crios\//i.test(r)}function gm(r=ft()){return/iemobile/i.test(r)}function fm(r=ft()){return/android/i.test(r)}function pm(r=ft()){return/blackberry/i.test(r)}function xm(r=ft()){return/webos/i.test(r)}function Al(r=ft()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function Vb(r=ft()){var e;return Al(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Lb(){return Qf()&&document.documentMode===10}function ym(r=ft()){return Al(r)||fm(r)||xm(r)||pm(r)||/windows phone/i.test(r)||gm(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bm(r,e=[]){let t;switch(r){case"Browser":t=Od(ft());break;case"Worker":t=`${Od(ft())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${hn}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fb{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((l,c)=>{try{const d=e(i);l(d)}catch(d){c(d)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ub(r,e={}){return Jn(r,"GET","/v2/passwordPolicy",Il(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bb=6;class qb{constructor(e){var t,n,s,i;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=l.minPasswordLength)!==null&&t!==void 0?t:Bb,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,s,i,l,c;const d={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,d),this.validatePasswordCharacterOptions(e,d),d.isValid&&(d.isValid=(t=d.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),d.isValid&&(d.isValid=(n=d.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),d.isValid&&(d.isValid=(s=d.containsLowercaseLetter)!==null&&s!==void 0?s:!0),d.isValid&&(d.isValid=(i=d.containsUppercaseLetter)!==null&&i!==void 0?i:!0),d.isValid&&(d.isValid=(l=d.containsNumericCharacter)!==null&&l!==void 0?l:!0),d.isValid&&(d.isValid=(c=d.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),d}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wb{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Vd(this),this.idTokenSubscription=new Vd(this),this.beforeStateQueue=new Fb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=nm,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ur(t)),this._initializationPromise=this.queue(async()=>{var n,s;if(!this._deleted&&(this.persistenceManager=await An.create(this,e),!this._deleted)){if(!((n=this._popupRedirectResolver)===null||n===void 0)&&n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await lm(this,{idToken:e}),n=await dr._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ar(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let s=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=s==null?void 0:s._redirectEventId,d=await this.tryRedirectSignIn(e);(!l||l===c)&&(d!=null&&d.user)&&(s=d.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(l){s=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return ye(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Qa(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Nb()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ar(this.app))return Promise.reject(tn(this));const t=e?pt(e):null;return t&&ye(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ye(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ar(this.app)?Promise.reject(tn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ar(this.app)?Promise.reject(tn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ur(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Ub(this),t=new qb(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Vs("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await Ob(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ur(e)||this._popupRedirectResolver;ye(t,this,"argument-error"),this.redirectPersistenceManager=await An.create(this,[ur(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let l=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(ye(c,this,"internal-error"),c.then(()=>{l||i(this.currentUser)}),typeof t=="function"){const d=e.addObserver(t,n,s);return()=>{l=!0,d()}}else{const d=e.addObserver(t);return()=>{l=!0,d()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ye(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=bm(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&_b(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Cl(r){return pt(r)}class Vd{constructor(e){this.auth=e,this.observer=null,this.addObserver=n0(t=>this.observer=t)}get next(){return ye(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rl={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function zb(r){Rl=r}function Hb(r){return Rl.loadJS(r)}function Gb(){return Rl.gapiScript}function Kb(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qb(r,e){const t=oi(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Va(i,e??{}))return s;xr(s,"already-initialized")}return t.initialize({options:e})}function Yb(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(ur);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function Xb(r,e,t){const n=Cl(r);ye(n._canInitEmulator,n,"emulator-config-failed"),ye(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=vm(e),{host:l,port:c}=Jb(e),d=c===null?"":`:${c}`;n.config.emulator={url:`${i}//${l}${d}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:l,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),Zb()}function vm(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function Jb(r){const e=vm(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:Ld(n.substr(i.length+1))}}else{const[i,l]=n.split(":");return{host:i,port:Ld(l)}}}function Ld(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function Zb(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return cr("not implemented")}_getIdTokenResponse(e){return cr("not implemented")}_linkToIdToken(e,t){return cr("not implemented")}_getReauthenticationResolver(e){return cr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cn(r,e){return Ib(r,"POST","/v1/accounts:signInWithIdp",Il(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ev="http://localhost";class cn extends wm{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new cn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):xr("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s}=t,i=Nl(t,["providerId","signInMethod"]);if(!n||!s)return null;const l=new cn(n,s);return l.idToken=i.idToken||void 0,l.accessToken=i.accessToken||void 0,l.secret=i.secret,l.nonce=i.nonce,l.pendingToken=i.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return Cn(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Cn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Cn(e,t)}buildRequest(){const e={requestUri:ev,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ls(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _m{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qs extends _m{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr extends Qs{constructor(){super("facebook.com")}static credential(e){return cn._fromParams({providerId:jr.PROVIDER_ID,signInMethod:jr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return jr.credentialFromTaggedObject(e)}static credentialFromError(e){return jr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return jr.credential(e.oauthAccessToken)}catch{return null}}}jr.FACEBOOK_SIGN_IN_METHOD="facebook.com";jr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr extends Qs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return cn._fromParams({providerId:Tr.PROVIDER_ID,signInMethod:Tr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Tr.credentialFromTaggedObject(e)}static credentialFromError(e){return Tr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Tr.credential(t,n)}catch{return null}}}Tr.GOOGLE_SIGN_IN_METHOD="google.com";Tr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir extends Qs{constructor(){super("github.com")}static credential(e){return cn._fromParams({providerId:Ir.PROVIDER_ID,signInMethod:Ir.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ir.credentialFromTaggedObject(e)}static credentialFromError(e){return Ir.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ir.credential(e.oauthAccessToken)}catch{return null}}}Ir.GITHUB_SIGN_IN_METHOD="github.com";Ir.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr extends Qs{constructor(){super("twitter.com")}static credential(e,t){return cn._fromParams({providerId:Sr.PROVIDER_ID,signInMethod:Sr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Sr.credentialFromTaggedObject(e)}static credentialFromError(e){return Sr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Sr.credential(t,n)}catch{return null}}}Sr.TWITTER_SIGN_IN_METHOD="twitter.com";Sr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await dr._fromIdTokenResponse(e,n,s),l=Fd(n);return new qn({user:i,providerId:l,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=Fd(n);return new qn({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function Fd(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya extends nr{constructor(e,t,n,s){var i;super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,Ya.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new Ya(e,t,n,s)}}function Em(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ya._fromErrorAndOperation(r,i,e,n):i})}async function tv(r,e,t=!1){const n=await $s(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return qn._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rv(r,e,t=!1){const{auth:n}=r;if(Ar(n.app))return Promise.reject(tn(n));const s="reauthenticate";try{const i=await $s(r,Em(n,s,e,r),t);ye(i.idToken,n,"internal-error");const l=Sl(i.idToken);ye(l,n,"internal-error");const{sub:c}=l;return ye(r.uid===c,n,"user-mismatch"),qn._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&xr(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nv(r,e,t=!1){if(Ar(r.app))return Promise.reject(tn(r));const n="signIn",s=await Em(r,n,e),i=await qn._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}function sv(r,e,t,n){return pt(r).onIdTokenChanged(e,t,n)}function av(r,e,t){return pt(r).beforeAuthStateChanged(e,t)}const Xa="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class km{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Xa,"1"),this.storage.removeItem(Xa),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=1e3,ov=10;class Nm extends km{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ym(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,c,d)=>{this.notifyListeners(l,d)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const l=this.storage.getItem(n);!t&&this.localCache[n]===l||this.notifyListeners(n,l)},i=this.storage.getItem(n);Lb()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,ov):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},iv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Nm.type="LOCAL";const lv=Nm;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jm extends km{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}jm.type="SESSION";const Tm=jm;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cv(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new Ei(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,l=this.handlersMap[s];if(!(l!=null&&l.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const c=Array.from(l).map(async h=>h(t.origin,i)),d=await cv(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:d})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ei.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pl(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dv{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,l;return new Promise((c,d)=>{const h=Pl("",20);s.port1.start();const g=setTimeout(()=>{d(new Error("unsupported_event"))},n);l={messageChannel:s,onMessage(x){const p=x;if(p.data.eventId===h)switch(p.data.status){case"ack":clearTimeout(g),i=setTimeout(()=>{d(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(p.data.response);break;default:clearTimeout(g),clearTimeout(i),d(new Error("invalid_response"));break}}},this.handlers.add(l),s.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[s.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(){return window}function uv(r){Jt().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Im(){return typeof Jt().WorkerGlobalScope<"u"&&typeof Jt().importScripts=="function"}async function hv(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function mv(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function gv(){return Im()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sm="firebaseLocalStorageDb",fv=1,Ja="firebaseLocalStorage",Am="fbase_key";class Ys{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ki(r,e){return r.transaction([Ja],e?"readwrite":"readonly").objectStore(Ja)}function pv(){const r=indexedDB.deleteDatabase(Sm);return new Ys(r).toPromise()}function Po(){const r=indexedDB.open(Sm,fv);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Ja,{keyPath:Am})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Ja)?e(n):(n.close(),await pv(),e(await Po()))})})}async function Ud(r,e,t){const n=ki(r,!0).put({[Am]:e,value:t});return new Ys(n).toPromise()}async function xv(r,e){const t=ki(r,!1).get(e),n=await new Ys(t).toPromise();return n===void 0?null:n.value}function Bd(r,e){const t=ki(r,!0).delete(e);return new Ys(t).toPromise()}const yv=800,bv=3;class Cm{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Po(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>bv)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Im()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ei._getInstance(gv()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await hv(),!this.activeServiceWorker)return;this.sender=new dv(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||mv()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Po();return await Ud(e,Xa,"1"),await Bd(e,Xa),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ud(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>xv(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Bd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=ki(s,!1).getAll();return new Ys(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),yv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Cm.type="LOCAL";const vv=Cm;new Ks(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wv(r,e){return e?ur(e):(ye(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl extends wm{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Cn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Cn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Cn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function _v(r){return nv(r.auth,new Dl(r),r.bypassAuthState)}function Ev(r){const{auth:e,user:t}=r;return ye(t,e,"internal-error"),rv(t,new Dl(r),r.bypassAuthState)}async function kv(r){const{auth:e,user:t}=r;return ye(t,e,"internal-error"),tv(t,new Dl(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rm{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:l,type:c}=e;if(l){this.reject(l);return}const d={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(d))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return _v;case"linkViaPopup":case"linkViaRedirect":return kv;case"reauthViaPopup":case"reauthViaRedirect":return Ev;default:xr(this.auth,"internal-error")}}resolve(e){yr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){yr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nv=new Ks(2e3,1e4);class jn extends Rm{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,jn.currentPopupAction&&jn.currentPopupAction.cancel(),jn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return ye(e,this.auth,"internal-error"),e}async onExecution(){yr(this.filter.length===1,"Popup operations only handle one event");const e=Pl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Xt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Xt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,jn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if(!((n=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Xt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Nv.get())};e()}}jn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jv="pendingRedirect",Da=new Map;class Tv extends Rm{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Da.get(this.auth._key());if(!e){try{const n=await Iv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Da.set(this.auth._key(),e)}return this.bypassAuthState||Da.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Iv(r,e){const t=Cv(e),n=Av(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}function Sv(r,e){Da.set(r._key(),e)}function Av(r){return ur(r._redirectPersistence)}function Cv(r){return Pa(jv,r.config.apiKey,r.name)}async function Rv(r,e,t=!1){if(Ar(r.app))return Promise.reject(tn(r));const n=Cl(r),s=wv(n,e),l=await new Tv(n,s,t).execute();return l&&!t&&(delete l.user._redirectEventId,await n._persistUserIfCurrent(l.user),await n._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pv=10*60*1e3;class Dv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!$v(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Pm(e)){const s=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";t.onError(Xt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Pv&&this.cachedEventUids.clear(),this.cachedEventUids.has(qd(e))}saveEventToCache(e){this.cachedEventUids.add(qd(e)),this.lastProcessedEventTime=Date.now()}}function qd(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function Pm({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function $v(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Pm(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mv(r,e={}){return Jn(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ov=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Vv=/^https?/;async function Lv(r){if(r.config.emulator)return;const{authorizedDomains:e}=await Mv(r);for(const t of e)try{if(Fv(t))return}catch{}xr(r,"unauthorized-domain")}function Fv(r){const e=Co(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const l=new URL(r);return l.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===n}if(!Vv.test(t))return!1;if(Ov.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uv=new Ks(3e4,6e4);function Wd(){const r=Jt().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function Bv(r){return new Promise((e,t)=>{var n,s,i;function l(){Wd(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Wd(),t(Xt(r,"network-request-failed"))},timeout:Uv.get()})}if(!((s=(n=Jt().gapi)===null||n===void 0?void 0:n.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Jt().gapi)===null||i===void 0)&&i.load)l();else{const c=Kb("iframefcb");return Jt()[c]=()=>{gapi.load?l():t(Xt(r,"network-request-failed"))},Hb(`${Gb()}?onload=${c}`).catch(d=>t(d))}}).catch(e=>{throw $a=null,e})}let $a=null;function qv(r){return $a=$a||Bv(r),$a}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wv=new Ks(5e3,15e3),zv="__/auth/iframe",Hv="emulator/auth/iframe",Gv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Kv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Qv(r){const e=r.config;ye(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Tl(e,Hv):`https://${r.config.authDomain}/${zv}`,n={apiKey:e.apiKey,appName:r.name,v:hn},s=Kv.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${Ls(n).slice(1)}`}async function Yv(r){const e=await qv(r),t=Jt().gapi;return ye(t,r,"internal-error"),e.open({where:document.body,url:Qv(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Gv,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const l=Xt(r,"network-request-failed"),c=Jt().setTimeout(()=>{i(l)},Wv.get());function d(){Jt().clearTimeout(c),s(n)}n.ping(d).then(d,()=>{i(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Jv=500,Zv=600,ew="_blank",tw="http://localhost";class zd{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function rw(r,e,t,n=Jv,s=Zv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),l=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const d=Object.assign(Object.assign({},Xv),{width:n.toString(),height:s.toString(),top:i,left:l}),h=ft().toLowerCase();t&&(c=mm(h)?ew:t),um(h)&&(e=e||tw,d.scrollbars="yes");const g=Object.entries(d).reduce((p,[T,j])=>`${p}${T}=${j},`,"");if(Vb(h)&&c!=="_self")return nw(e||"",c),new zd(null);const x=window.open(e||"",c,g);ye(x,r,"popup-blocked");try{x.focus()}catch{}return new zd(x)}function nw(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sw="__/auth/handler",aw="emulator/auth/handler",iw=encodeURIComponent("fac");async function Hd(r,e,t,n,s,i){ye(r.config.authDomain,r,"auth-domain-config-required"),ye(r.config.apiKey,r,"invalid-api-key");const l={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:hn,eventId:s};if(e instanceof _m){e.setDefaultLanguage(r.languageCode),l.providerId=e.providerId||"",r0(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[g,x]of Object.entries({}))l[g]=x}if(e instanceof Qs){const g=e.getScopes().filter(x=>x!=="");g.length>0&&(l.scopes=g.join(","))}r.tenantId&&(l.tid=r.tenantId);const c=l;for(const g of Object.keys(c))c[g]===void 0&&delete c[g];const d=await r._getAppCheckToken(),h=d?`#${iw}=${encodeURIComponent(d)}`:"";return`${ow(r)}?${Ls(c).slice(1)}${h}`}function ow({config:r}){return r.emulator?Tl(r,aw):`https://${r.authDomain}/${sw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji="webStorageSupport";class lw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Tm,this._completeRedirectFn=Rv,this._overrideRedirectResult=Sv}async _openPopup(e,t,n,s){var i;yr((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const l=await Hd(e,t,n,Co(),s);return rw(e,l,Pl())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await Hd(e,t,n,Co(),s);return uv(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(yr(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Yv(e),n=new Dv(e);return t.register("authEvent",s=>(ye(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ji,{type:Ji},s=>{var i;const l=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[Ji];l!==void 0&&t(!!l),xr(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Lv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ym()||hm()||Al()}}const cw=lw;var Gd="@firebase/auth",Kd="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ye(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uw(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function hw(r){nn(new Lr("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:l,authDomain:c}=n.options;ye(l&&!l.includes(":"),"invalid-api-key",{appName:n.name});const d={apiKey:l,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:bm(r)},h=new Wb(n,s,i,d);return Yb(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),nn(new Lr("auth-internal",e=>{const t=Cl(e.getProvider("auth").getImmediate());return(n=>new dw(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Kt(Gd,Kd,uw(r)),Kt(Gd,Kd,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mw=5*60,gw=Ru("authIdTokenMaxAge")||mw;let Qd=null;const fw=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>gw)return;const s=t==null?void 0:t.token;Qd!==s&&(Qd=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function pw(r=Wo()){const e=oi(r,"auth");if(e.isInitialized())return e.getImmediate();const t=Qb(r,{popupRedirectResolver:cw,persistence:[vv,lv,Tm]}),n=Ru("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const l=fw(i.toString());av(t,l,()=>l(t.currentUser)),sv(t,c=>l(c))}}const s=Su("auth");return s&&Xb(t,`http://${s}`),t}function xw(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}zb({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=Xt("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",xw().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});hw("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dm="firebasestorage.googleapis.com",yw="storageBucket",bw=2*60*1e3,vw=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr extends nr{constructor(e,t,n=0){super(Zi(e),`Firebase Storage: ${t} (${Zi(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,sr.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Zi(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var tr;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(tr||(tr={}));function Zi(r){return"storage/"+r}function ww(){const r="An unknown error occurred, please check the error payload for server response.";return new sr(tr.UNKNOWN,r)}function _w(){return new sr(tr.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Ew(){return new sr(tr.CANCELED,"User canceled the upload/download.")}function kw(r){return new sr(tr.INVALID_URL,"Invalid URL '"+r+"'.")}function Nw(r){return new sr(tr.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function Yd(r){return new sr(tr.INVALID_ARGUMENT,r)}function $m(){return new sr(tr.APP_DELETED,"The Firebase app was deleted.")}function jw(r){return new sr(tr.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=Ft.makeFromUrl(e,t)}catch{return new Ft(e,"")}if(n.path==="")return n;throw Nw(e)}static makeFromUrl(e,t){let n=null;const s="([A-Za-z0-9.\\-_]+)";function i(F){F.path.charAt(F.path.length-1)==="/"&&(F.path_=F.path_.slice(0,-1))}const l="(/(.*))?$",c=new RegExp("^gs://"+s+l,"i"),d={bucket:1,path:3};function h(F){F.path_=decodeURIComponent(F.path)}const g="v[A-Za-z0-9_]+",x=t.replace(/[.]/g,"\\."),p="(/([^?#]*).*)?$",T=new RegExp(`^https?://${x}/${g}/b/${s}/o${p}`,"i"),j={bucket:1,path:3},E=t===Dm?"(?:storage.googleapis.com|storage.cloud.google.com)":t,I="([^?#]*)",D=new RegExp(`^https?://${E}/${s}/${I}`,"i"),C=[{regex:c,indices:d,postModify:i},{regex:T,indices:j,postModify:h},{regex:D,indices:{bucket:1,path:2},postModify:h}];for(let F=0;F<C.length;F++){const ne=C[F],B=ne.regex.exec(e);if(B){const _=B[ne.indices.bucket];let y=B[ne.indices.path];y||(y=""),n=new Ft(_,y),ne.postModify(n);break}}if(n==null)throw kw(e);return n}}class Tw{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iw(r,e,t){let n=1,s=null,i=null,l=!1,c=0;function d(){return c===2}let h=!1;function g(...I){h||(h=!0,e.apply(null,I))}function x(I){s=setTimeout(()=>{s=null,r(T,d())},I)}function p(){i&&clearTimeout(i)}function T(I,...D){if(h){p();return}if(I){p(),g.call(null,I,...D);return}if(d()||l){p(),g.call(null,I,...D);return}n<64&&(n*=2);let C;c===1?(c=2,C=0):C=(n+Math.random())*1e3,x(C)}let j=!1;function E(I){j||(j=!0,p(),!h&&(s!==null?(I||(c=2),clearTimeout(s),x(0)):I||(c=1)))}return x(0),i=setTimeout(()=>{l=!0,E(!0)},t),E}function Sw(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aw(r){return r!==void 0}function Xd(r,e,t,n){if(n<e)throw Yd(`Invalid value for '${r}'. Expected ${e} or greater.`);if(n>t)throw Yd(`Invalid value for '${r}'. Expected ${t} or less.`)}function Cw(r){const e=encodeURIComponent;let t="?";for(const n in r)if(r.hasOwnProperty(n)){const s=e(n)+"="+e(r[n]);t=t+s+"&"}return t=t.slice(0,-1),t}var Za;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(Za||(Za={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rw(r,e){const t=r>=500&&r<600,s=[408,429].indexOf(r)!==-1,i=e.indexOf(r)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pw{constructor(e,t,n,s,i,l,c,d,h,g,x,p=!0){this.url_=e,this.method_=t,this.headers_=n,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=l,this.callback_=c,this.errorCallback_=d,this.timeout_=h,this.progressCallback_=g,this.connectionFactory_=x,this.retry=p,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((T,j)=>{this.resolve_=T,this.reject_=j,this.start_()})}start_(){const e=(n,s)=>{if(s){n(!1,new Ea(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const l=c=>{const d=c.loaded,h=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(d,h)};this.progressCallback_!==null&&i.addUploadProgressListener(l),i.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(l),this.pendingConnection_=null;const c=i.getErrorCode()===Za.NO_ERROR,d=i.getStatus();if(!c||Rw(d,this.additionalRetryCodes_)&&this.retry){const g=i.getErrorCode()===Za.ABORT;n(!1,new Ea(!1,null,g));return}const h=this.successCodes_.indexOf(d)!==-1;n(!0,new Ea(h,i))})},t=(n,s)=>{const i=this.resolve_,l=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const d=this.callback_(c,c.getResponse());Aw(d)?i(d):i()}catch(d){l(d)}else if(c!==null){const d=ww();d.serverResponse=c.getErrorText(),this.errorCallback_?l(this.errorCallback_(c,d)):l(d)}else if(s.canceled){const d=this.appDelete_?$m():Ew();l(d)}else{const d=_w();l(d)}};this.canceled_?t(!1,new Ea(!1,null,!0)):this.backoffId_=Iw(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Sw(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Ea{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function Dw(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function $w(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Mw(r,e){e&&(r["X-Firebase-GMPID"]=e)}function Ow(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function Vw(r,e,t,n,s,i,l=!0){const c=Cw(r.urlParams),d=r.url+c,h=Object.assign({},r.headers);return Mw(h,e),Dw(h,t),$w(h,i),Ow(h,n),new Pw(d,r.method,h,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,s,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lw(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function Fw(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,t){this._service=e,t instanceof Ft?this._location=t:this._location=Ft.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new ei(e,t)}get root(){const e=new Ft(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Fw(this._location.path)}get storage(){return this._service}get parent(){const e=Lw(this._location.path);if(e===null)return null;const t=new Ft(this._location.bucket,e);return new ei(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw jw(e)}}function Jd(r,e){const t=e==null?void 0:e[yw];return t==null?null:Ft.makeFromBucketSpec(t,r)}function Uw(r,e,t,n={}){r.host=`${e}:${t}`,r._protocol="http";const{mockUserToken:s}=n;s&&(r._overrideAuthToken=typeof s=="string"?s:Pu(s,r.app.options.projectId))}class Bw{constructor(e,t,n,s,i){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=s,this._firebaseVersion=i,this._bucket=null,this._host=Dm,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=bw,this._maxUploadRetryTime=vw,this._requests=new Set,s!=null?this._bucket=Ft.makeFromBucketSpec(s,this._host):this._bucket=Jd(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Ft.makeFromBucketSpec(this._url,e):this._bucket=Jd(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Xd("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Xd("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new ei(this,e)}_makeRequest(e,t,n,s,i=!0){if(this._deleted)return new Tw($m());{const l=Vw(e,this._appId,n,s,t,this._firebaseVersion,i);return this._requests.add(l),l.getPromise().then(()=>this._requests.delete(l),()=>this._requests.delete(l)),l}}async makeRequestWithTokens(e,t){const[n,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,s).getPromise()}}const Zd="@firebase/storage",eu="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mm="storage";function qw(r=Wo(),e){r=pt(r);const n=oi(r,Mm).getImmediate({identifier:e}),s=Au("storage");return s&&Ww(n,...s),n}function Ww(r,e,t,n={}){Uw(r,e,t,n)}function zw(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),n=r.getProvider("auth-internal"),s=r.getProvider("app-check-internal");return new Bw(t,n,s,e,hn)}function Hw(){nn(new Lr(Mm,zw,"PUBLIC").setMultipleInstances(!0)),Kt(Zd,eu,""),Kt(Zd,eu,"esm2017")}Hw();const lr={apiKey:"your-api-key",authDomain:"your-auth-domain",projectId:"your-project-id",storageBucket:"your-storage-bucket",messagingSenderId:"your-messaging-sender-id",appId:"your-app-id"};console.log("Firebase config check:",{hasApiKey:!!lr.apiKey&&lr.apiKey!=="your-api-key",authDomain:lr.authDomain,projectId:lr.projectId,hasStorageBucket:!!lr.storageBucket&&lr.storageBucket!=="your-storage-bucket",hasAppId:!!lr.appId&&lr.appId!=="your-app-id"});console.log("Raw env values:",{VITE_FIREBASE_API_KEY:void 0,VITE_FIREBASE_AUTH_DOMAIN:void 0,VITE_FIREBASE_PROJECT_ID:void 0,VITE_FIREBASE_STORAGE_BUCKET:void 0});const $l=Mu(lr);pw($l);const Re=tb($l);qw($l);console.log("Firestore db initialized:",!!Re);const Gw=30,tu=r=>r.toString().padStart(2,"0"),Kw=()=>{const r=new Date;return r.setDate(r.getDate()-Gw),{dateOnly:`${r.getFullYear()}-${tu(r.getMonth()+1)}-${tu(r.getDate())}`,iso:r.toISOString()}},ka=async(r,e,t)=>{const n=xt(Re,r),s=Ze(n,Rt(e,"<",t)),i=await er(s);await Promise.all(i.docs.map(l=>pn(Tt(Re,r,l.id))))},Qw=async()=>{try{const{dateOnly:r,iso:e}=Kw();await Promise.all([ka("workSlots","date",r),ka("dayStatuses","date",r),ka("earnings","date",r),ka("referrals","createdAt",e)])}catch(r){console.error("Failed to cleanup old data",r)}},br=async(r,e)=>{const t=xt(Re,"workSlots");let n;r&&e||r?n=Ze(t,Rt("userId","==",r)):e?n=Ze(t,Rt("date","==",e)):n=Ze(t);let i=(await er(n)).docs.map(l=>{const c=l.data(),d=((c==null?void 0:c.slots)||[]).map(h=>h.break&&!h.breaks?{...h,breaks:[h.break],break:void 0}:h);return{id:l.id,userId:(c==null?void 0:c.userId)||"",date:(c==null?void 0:c.date)||"",slots:d,participants:(c==null?void 0:c.participants)||[],...(c==null?void 0:c.comment)&&{comment:c.comment}}});return r&&e&&(i=i.filter(l=>l.date===e)),i.sort((l,c)=>l.date.localeCompare(c.date)),i},Yw=async r=>{try{console.log("addWorkSlot: Starting, db initialized:",!!Re);const e=xt(Re,"workSlots");console.log("addWorkSlot: Collection reference created");const t=Object.fromEntries(Object.entries(r).filter(([s,i])=>i!==void 0));console.log("addWorkSlot: Clean slot prepared:",t),console.log("addWorkSlot: Calling addDoc...");const n=await Xn(e,t);return console.log("addWorkSlot: Work slot added successfully:",n.id),n}catch(e){throw console.error("addWorkSlot: Error caught:",e),console.error("addWorkSlot: Error code:",e==null?void 0:e.code),console.error("addWorkSlot: Error message:",e==null?void 0:e.message),console.error("addWorkSlot: Full error:",JSON.stringify(e,null,2)),e}},Xw=async(r,e)=>{const t=Tt(Re,"workSlots",r),n=Object.fromEntries(Object.entries(e).filter(([s,i])=>i!==void 0));await Yn(t,n)},Ml=async r=>{const e=Tt(Re,"workSlots",r);await pn(e)},hr=async(r,e)=>{const t=xt(Re,"dayStatuses");let n;r?n=Ze(t,Rt("userId","==",r)):n=Ze(t);let i=(await er(n)).docs.map(l=>{const c=l.data();return{id:l.id,userId:(c==null?void 0:c.userId)||"",date:(c==null?void 0:c.date)||"",type:(c==null?void 0:c.type)||"dayoff",...(c==null?void 0:c.comment)&&{comment:c.comment},...(c==null?void 0:c.endDate)&&{endDate:c.endDate}}});return i.sort((l,c)=>l.date.localeCompare(c.date)),i},Jw=async r=>{try{const e=xt(Re,"dayStatuses"),t=Object.fromEntries(Object.entries(r).filter(([s,i])=>i!==void 0));console.log("Adding day status:",t);const n=await Xn(e,t);return console.log("Day status added successfully:",n.id),n}catch(e){throw console.error("Error in addDayStatus:",e),e}},Zw=async(r,e)=>{const t=Tt(Re,"dayStatuses",r),n=Object.fromEntries(Object.entries(e).filter(([s,i])=>i!==void 0));await Yn(t,n)},Om=async r=>{const e=Tt(Re,"dayStatuses",r);await pn(e)},Ms=async(r,e,t)=>{const n=xt(Re,"earnings");let s;r?s=Ze(n):e&&t?s=Ze(n,Rt("date",">=",e),Rt("date","<=",t)):s=Ze(n);let l=(await er(s)).docs.map(c=>{const d=c.data();return{id:c.id,userId:(d==null?void 0:d.userId)||"",date:(d==null?void 0:d.date)||"",amount:(d==null?void 0:d.amount)||0,poolAmount:(d==null?void 0:d.poolAmount)||0,slotId:(d==null?void 0:d.slotId)||"",participants:(d==null?void 0:d.participants)||[]}});return r&&(l=l.filter(c=>(c.participants&&c.participants.length>0?[...c.participants,c.userId]:[c.userId]).includes(r))),r&&e&&t?l=l.filter(c=>c.date>=e&&c.date<=t):!r&&e&&t&&(l=l.filter(c=>c.date>=e&&c.date<=t)),l.sort((c,d)=>d.date.localeCompare(c.date)),l},e_=async r=>{try{const e=xt(Re,"earnings"),t=Object.fromEntries(Object.entries(r).filter(([s,i])=>i!==void 0));console.log("Adding earnings:",t);const n=await Xn(e,t);return console.log("Earnings added successfully:",n.id),n}catch(e){throw console.error("Error in addEarnings:",e),e}},t_=async(r,e)=>{const t=Tt(Re,"earnings",r),n=Object.fromEntries(Object.entries(e).filter(([s,i])=>i!==void 0));await Yn(t,n)},r_=async r=>{const e=Tt(Re,"earnings",r);await pn(e)},Vm=async r=>{const e=xt(Re,"ratings");let t=Ze(e);return r&&(t=Ze(t,Rt("userId","==",r))),(await er(t)).docs.map(s=>{const i=s.data();return{id:s.id,userId:i.userId||"",earnings:i.earnings||0,messages:i.messages||0,initiatives:i.initiatives||0,signals:i.signals||0,profitableSignals:i.profitableSignals||0,referrals:i.referrals||0,daysOff:i.daysOff||0,sickDays:i.sickDays||0,vacationDays:i.vacationDays||0,poolAmount:i.poolAmount||0,rating:i.rating||0,lastUpdated:i.lastUpdated||new Date().toISOString()}})},Lm=async(r,e,t)=>{try{const n=xt(Re,"messages"),s=Ze(n,Rt("userId","==",r));return(await er(s)).docs.filter(c=>{const h=c.data().date||"";return h>=e&&h<=t}).length}catch(n){console.error("Error getting weekly messages:",n);const s=xt(Re,"ratings"),i=Ze(s,Rt("userId","==",r)),l=await er(i);return l.empty?0:l.docs[0].data().messages||0}},n_=async r=>{try{const e=xt(Re,"referrals"),t=Object.fromEntries(Object.entries(r).filter(([s,i])=>i!==void 0));console.log("Adding referral:",t);const n=await Xn(e,t);return console.log("Referral added successfully:",n.id),n}catch(e){throw console.error("Error in addReferral:",e),e}},Fm=async(r,e,t)=>{const n=xt(Re,"referrals");let s;s=Ze(n,Ds("createdAt","desc"));let l=(await er(s)).docs.map(c=>{const d=c.data();return{id:c.id,referralId:d.referralId,ownerId:d.ownerId,name:d.name,age:d.age,createdAt:d.createdAt,comment:d.comment}});return e&&t&&(l=l.filter(c=>c.createdAt>=e&&c.createdAt<=t)),l.sort((c,d)=>c.createdAt<d.createdAt?1:-1)},s_=async(r,e)=>{const t=Tt(Re,"referrals",r),n=Object.fromEntries(Object.entries(e).filter(([s,i])=>i!==void 0));await Yn(t,n)},a_=async r=>{const e=Tt(Re,"referrals",r);await pn(e)},i_=async r=>{if(console.log("📝 Service site: Creating call:",{ticker:r.ticker,network:r.network,userId:r.userId,status:r.status,createdAt:r.createdAt}),!Re)throw console.error("❌ Service site: Firestore db is not initialized"),new Error("Firestore database is not initialized");const e=xt(Re,"calls"),t=await Xn(e,r);return console.log("✅ Service site: Call created successfully with ID:",t.id),console.log("📊 Service site: Call data saved to Firestore:",r),t.id},o_=async r=>{const e=xt(Re,"calls"),t=[];t.push(Ds("createdAt","desc"));let n;return t.length>0?n=Ze(e,...t):n=Ze(e,Ds("createdAt","desc")),(await er(n)).docs.map(l=>{const c=l.data();return{id:l.id,userId:c.userId||"",network:c.network||"",ticker:c.ticker||"",pair:c.pair||"",entryPoint:c.entryPoint||"",target:c.target||"",strategy:c.strategy||"flip",risks:c.risks||"",cancelConditions:c.cancelConditions,comment:c.comment,createdAt:c.createdAt||new Date().toISOString(),status:c.status||"active",maxProfit:c.maxProfit,currentPnL:c.currentPnL,currentMarketCap:c.currentMarketCap,signalMarketCap:c.signalMarketCap,currentPrice:c.currentPrice,entryPrice:c.entryPrice}})},l_=async(r,e)=>{const t=Tt(Re,"calls",r);await Yn(t,e)},c_=async r=>{const e=Tt(Re,"calls",r);await pn(e)},d_=async r=>{const e=xt(Re,"tasks");return(await Xn(e,r)).id},Um=async r=>{const e=xt(Re,"tasks"),t=[];r!=null&&r.status&&t.push(Rt("status","==",r.status)),r!=null&&r.category&&t.push(Rt("category","==",r.category)),r!=null&&r.createdBy&&t.push(Rt("createdBy","==",r.createdBy)),t.push(Ds("createdAt","desc"));let n;t.length>0?n=Ze(e,...t):n=Ze(e,Ds("createdAt","desc"));let i=(await er(n)).docs.map(h=>{const g=h.data(),p=((Array.isArray(g.assignees)?g.assignees:(g.assignedTo||[]).map(j=>({userId:j,priority:"medium"})))||[]).map(j=>({userId:j.userId||"",priority:j.priority==="high"||j.priority==="low"?j.priority:"medium",comment:j.comment})).filter(j=>!!j.userId),T=p.map(j=>j.userId);return{id:h.id,title:g.title||"",description:g.description,category:g.category||"trading",status:g.status||"pending",createdBy:g.createdBy||"",assignedTo:T,assignees:p,approvals:g.approvals||[],createdAt:g.createdAt||new Date().toISOString(),updatedAt:g.updatedAt||new Date().toISOString(),completedAt:g.completedAt,closedAt:g.closedAt,completedBy:g.completedBy,priority:g.priority,dueDate:g.dueDate||new Date().toISOString().split("T")[0],dueTime:g.dueTime||"12:00"}});const l=new Date,c=new Date(l.getTime()-12*60*60*1e3),d=i.filter(h=>h.status==="closed"&&h.closedAt?new Date(h.closedAt)<c:!1);if(d.length>0&&(await Promise.all(d.map(h=>Bm(h.id))),i=i.filter(h=>!d.find(g=>g.id===h.id))),r!=null&&r.assignedTo)if(Array.isArray(r.assignedTo)){const h=r.assignedTo;h.length>0&&(i=i.filter(g=>h.some(x=>g.assignedTo.includes(x))))}else i=i.filter(h=>h.assignedTo.includes(r.assignedTo));return i},Jr=async(r,e)=>{const t=Tt(Re,"tasks",r),n={...e,updatedAt:new Date().toISOString()};await Yn(t,n)},Bm=async r=>{const e=Tt(Re,"tasks",r);await pn(e)},u_=({onSuccess:r,onCancel:e,callToEdit:t})=>{const{theme:n}=Ve(),{user:s}=nt(),[i,l]=A.useState(!1),[c,d]=A.useState(""),[h,g]=A.useState({network:(t==null?void 0:t.network)||"solana",ticker:(t==null?void 0:t.ticker)||"",pair:(t==null?void 0:t.pair)||"",entryPoint:(t==null?void 0:t.entryPoint)||"",target:(t==null?void 0:t.target)||"",strategy:(t==null?void 0:t.strategy)||"flip",risks:(t==null?void 0:t.risks)||"",cancelConditions:(t==null?void 0:t.cancelConditions)||"",comment:(t==null?void 0:t.comment)||""}),x=[{value:"solana",label:"Solana",tone:"bg-purple-500/15 text-purple-200 border-purple-400/40"},{value:"bsc",label:"BSC",tone:"bg-amber-500/15 text-amber-200 border-amber-400/40"},{value:"ethereum",label:"Ethereum",tone:"bg-blue-500/15 text-blue-200 border-blue-400/40"},{value:"base",label:"Base",tone:"bg-indigo-500/15 text-indigo-200 border-indigo-400/40"},{value:"ton",label:"Ton",tone:"bg-cyan-500/15 text-cyan-200 border-cyan-400/40"},{value:"tron",label:"Tron",tone:"bg-red-500/15 text-red-200 border-red-400/40"},{value:"sui",label:"SUI",tone:"bg-emerald-500/15 text-emerald-200 border-emerald-400/40"},{value:"cex",label:"CEX",tone:"bg-orange-500/15 text-orange-200 border-orange-400/40"}],p=[{value:"flip",label:"🔄 Флип",hint:"Краткосрочно (часы/дни)"},{value:"medium",label:"📊 Среднесрок",hint:"Дни/недели"},{value:"long",label:"⏰ Долгосрок",hint:"Недели/месяцы"}],T=async C=>{if(C.preventDefault(),d(""),l(!0),!h.ticker.trim()){d("Укажите тикер токена"),l(!1);return}if(!h.pair.trim()){d("Укажите пару токена"),l(!1);return}if(!h.entryPoint.trim()){d("Укажите точку входа или диапазон"),l(!1);return}if(!h.target.trim()){d("Укажите цель/ориентиры по прибыли"),l(!1);return}if(!h.risks.trim()){d("Опишите риски"),l(!1);return}try{if(t){const F={network:h.network,ticker:h.ticker,pair:h.pair,entryPoint:h.entryPoint,target:h.target,strategy:h.strategy,risks:h.risks,cancelConditions:h.cancelConditions||void 0,comment:h.comment||void 0};await l_(t.id,F)}else{if(!s){d("Вы не авторизованы. Для создания сигнала необходимо войти как участник."),l(!1);return}const F={...h,userId:s.id,createdAt:new Date().toISOString(),status:"active",cancelConditions:h.cancelConditions||void 0,comment:h.comment||void 0};await i_(F)}r==null||r()}catch(F){console.error("Error creating call:",F),d("Ошибка при создании сигнала. Попробуйте позже.")}finally{l(!1)}},j=n==="dark"?"text-white":"text-gray-900",E=n==="dark"?"border-gray-800":"border-gray-200",I=n==="dark"?"bg-gray-700":"bg-gray-50",D=n==="dark"?"bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-500":"bg-white border-gray-200 text-gray-700 hover:border-gray-400",S="bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-transparent";return a.jsxs("form",{onSubmit:T,className:"space-y-6",children:[c&&a.jsx("div",{className:`p-4 rounded-lg ${n==="dark"?"bg-red-900/30 border border-red-700 text-red-300":"bg-red-50 border border-red-200 text-red-800"}`,children:c}),a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("label",{className:`block text-sm font-medium ${j}`,children:"Сеть *"}),a.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:"Кликните для выбора"})]}),a.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-2",children:x.map(C=>a.jsx("button",{type:"button",onClick:()=>g({...h,network:C.value}),className:`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${h.network===C.value?S:D} ${h.network===C.value?"":C.tone}`,children:C.label},C.value))})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium ${j} mb-2`,children:"Тикер токена *"}),a.jsx("input",{type:"text",value:h.ticker,onChange:C=>g({...h,ticker:C.target.value.toUpperCase()}),className:`w-full px-4 py-2 rounded-lg border ${E} ${I} ${j} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"тикер токена",required:!0})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium ${j} mb-2`,children:"Пара токена *"}),a.jsx("input",{type:"text",value:h.pair,onChange:C=>g({...h,pair:C.target.value}),className:`w-full px-4 py-2 rounded-lg border ${E} ${I} ${j} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"PEPE/USDT, DOGE/USDT...",required:!0})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium ${j} mb-2`,children:"Точка входа или диапазон капитализации *"}),a.jsx("input",{type:"text",value:h.entryPoint,onChange:C=>g({...h,entryPoint:C.target.value}),className:`w-full px-4 py-2 rounded-lg border ${E} ${I} ${j} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"10M или 10M-15M (в миллионах долларов)",required:!0})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium ${j} mb-2`,children:"Цель/ориентиры по капитализации *"}),a.jsx("input",{type:"text",value:h.target,onChange:C=>g({...h,target:C.target.value}),className:`w-full px-4 py-2 rounded-lg border ${E} ${I} ${j} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"20M, 30M, 50M (в миллионах долларов)",required:!0})]}),a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("label",{className:`block text-sm font-medium ${j}`,children:"Стратегия *"}),a.jsx("span",{className:"text-[11px] text-gray-500 dark:text-gray-400",children:"Кликните для выбора"})]}),a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2",children:p.map(C=>a.jsxs("button",{type:"button",onClick:()=>g({...h,strategy:C.value}),className:`flex flex-col items-start gap-1 px-3 py-3 rounded-lg border text-sm transition-all ${h.strategy===C.value?S:D}`,children:[a.jsx("span",{className:"font-semibold",children:C.label}),a.jsx("span",{className:"text-[11px] opacity-80",children:C.hint})]},C.value))})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium ${j} mb-2`,children:"Риски *"}),a.jsx("textarea",{value:h.risks,onChange:C=>g({...h,risks:C.target.value}),className:`w-full px-4 py-2 rounded-lg border ${E} ${I} ${j} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[100px] resize-y`,placeholder:"Опишите риски этого сигнала...",required:!0})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium ${j} mb-2`,children:"Условия отмены или пересмотра колла"}),a.jsx("textarea",{value:h.cancelConditions,onChange:C=>g({...h,cancelConditions:C.target.value}),className:`w-full px-4 py-2 rounded-lg border ${E} ${I} ${j} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[80px] resize-y`,placeholder:"При каких условиях сигнал должен быть отменен или пересмотрен..."})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium ${j} mb-2`,children:"Комментарий по ситуации"}),a.jsx("textarea",{value:h.comment,onChange:C=>g({...h,comment:C.target.value}),className:`w-full px-4 py-2 rounded-lg border ${E} ${I} ${j} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[100px] resize-y`,placeholder:"Дополнительные комментарии по ситуации..."})]}),a.jsxs("div",{className:"flex gap-4",children:[a.jsx("button",{type:"submit",disabled:i,className:`flex-1 py-3 rounded-lg font-semibold transition-colors ${n==="dark"?"bg-[#4E6E49] hover:bg-[#4E6E49] text-white disabled:bg-gray-700 disabled:text-gray-400":"bg-[#4E6E49] hover:bg-[#4E6E49] text-white disabled:bg-gray-300 disabled:text-gray-500"}`,children:i?"Создание...":t?"Обновить сигнал":"Создать сигнал"}),e&&a.jsx("button",{type:"button",onClick:e,className:`px-6 py-3 rounded-lg font-semibold transition-colors ${n==="dark"?"bg-gray-700 hover:bg-gray-600 text-white":"bg-gray-200 hover:bg-gray-300 text-gray-900"}`,children:"Отмена"})]})]})},h_=()=>{var Ee;const{theme:r}=Ve(),{user:e}=nt(),[t,n]=A.useState([]),[s,i]=A.useState(!0),[l,c]=A.useState(!1),[d,h]=A.useState(!1),[g,x]=A.useState(!0),[p,T]=A.useState(null),[j,E]=A.useState(null),[I,D]=A.useState(null),[S,C]=A.useState(""),[F,ne]=A.useState("all");A.useEffect(()=>{B()},[]);const B=async()=>{i(!0);try{const L=await o_();n(L),console.log("Loaded calls:",L.length,"User ID:",e==null?void 0:e.id),L.length>0&&console.log("First call userId:",L[0].userId)}catch(L){console.error("Error loading calls:",L),n([])}finally{i(!1)}},_=A.useMemo(()=>{const L={};return t.forEach(V=>{const X=ve.find(z=>z.id===V.userId),se=V.userId||"unknown",J=(X==null?void 0:X.name)||"Неизвестный";L[se]||(L[se]={name:J,totalCalls:0,activeCalls:0,completedCalls:0,cancelledCalls:0,avgPnL:0,totalPnL:0,maxProfit:0}),L[se].totalCalls++,V.status==="active"&&L[se].activeCalls++,V.status==="completed"&&L[se].completedCalls++,V.status==="cancelled"&&L[se].cancelledCalls++,V.currentPnL!==void 0&&(L[se].totalPnL+=V.currentPnL),V.maxProfit!==void 0&&V.maxProfit>L[se].maxProfit&&(L[se].maxProfit=V.maxProfit)}),Object.keys(L).forEach(V=>{const X=L[V];X.totalCalls>0&&(X.avgPnL=X.totalPnL/X.totalCalls)}),Object.values(L).sort((V,X)=>X.totalCalls-V.totalCalls)},[t]),y=A.useMemo(()=>{const L=t.length,V=t.filter(ee=>ee.status==="active").length,X=t.filter(ee=>ee.status==="completed").length,se=t.filter(ee=>ee.status==="cancelled").length,J=t.length>0?t.reduce((ee,ke)=>ee+(ke.currentPnL||0),0)/t.length:0,z=t.reduce((ee,ke)=>ke.maxProfit!==void 0&&(!ee||(ee.maxProfit||0)<ke.maxProfit)?ke:ee,null);return{total:L,active:V,completed:X,cancelled:se,avgPnL:J,bestCall:z}},[t]),b=()=>{c(!1),E(null),B()},w=()=>{c(!1),E(null)},k=L=>{E(L),c(!0)},N=L=>{T(L),h(!0)},f=async()=>{if(p)try{await c_(p),h(!1),T(null),B()}catch(L){console.error("Error deleting call:",L),alert("Ошибка при удалении сигнала")}},O=async L=>{try{await navigator.clipboard.writeText(L),D(L),setTimeout(()=>D(null),2e3)}catch(V){console.error("Failed to copy:",V)}},Q=r==="dark"?"bg-[#1a1a1a]":"bg-white",P=r==="dark"?"text-white":"text-gray-900",$=r==="dark"?"text-gray-400":"text-gray-600",K=r==="dark"?"border-gray-800":"border-gray-200",H=r==="dark"?"bg-gray-800 text-gray-200 border border-gray-700":"bg-white text-gray-700 border border-gray-200",Z="bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white shadow-lg shadow-emerald-500/30",ce={solana:{bg:"bg-purple-500/10",text:"text-purple-400",icon:"bg-purple-500"},bsc:{bg:"bg-yellow-500/10",text:"text-yellow-400",icon:"bg-yellow-500"},ethereum:{bg:"bg-blue-500/10",text:"text-blue-400",icon:"bg-blue-500"},base:{bg:"bg-indigo-500/10",text:"text-indigo-400",icon:"bg-indigo-500"},ton:{bg:"bg-cyan-500/10",text:"text-cyan-400",icon:"bg-cyan-500"},tron:{bg:"bg-red-500/10",text:"text-red-400",icon:"bg-red-500"},sui:{bg:"bg-[#4E6E49]/10",text:"text-[#4E6E49]",icon:"bg-[#4E6E49]"},cex:{bg:"bg-orange-500/10",text:"text-orange-400",icon:"bg-orange-500"}},q={flip:{label:"Флип",icon:"🔄",color:"bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"},medium:{label:"Среднесрок",icon:"📊",color:"bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30"},long:{label:"Долгосрок",icon:"⏰",color:"bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30"}},W={active:{label:"Активен",color:"bg-[#4E6E49]/20 text-[#4E6E49] dark:text-[#4E6E49] border-[#4E6E49]/30"},completed:{label:"Завершен",color:"bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30"},cancelled:{label:"Отменен",color:"bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"},reviewed:{label:"На рассмотрении",color:"bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30"}},le=t.filter(L=>L.ticker.toLowerCase().includes(S.toLowerCase())||L.pair.toLowerCase().includes(S.toLowerCase())||L.network.toLowerCase().includes(S.toLowerCase())).filter(L=>F==="all"?!0:L.status===F);return a.jsx(qt,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:`rounded-2xl p-8 ${Q} shadow-xl border-2 ${r==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white"} relative overflow-hidden`,children:[a.jsx("div",{className:"absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-32 -mt-32"}),a.jsx("div",{className:"absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -ml-24 -mb-24"}),a.jsxs("div",{className:"relative z-10",children:[a.jsxs("div",{className:"flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6",children:[a.jsx("div",{className:"flex-1 space-y-2",children:a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"p-4 rounded-2xl shadow-lg bg-gradient-to-br from-[#4E6E49] to-emerald-700 text-white",children:a.jsx(Tn,{className:"w-8 h-8"})}),a.jsxs("div",{children:[a.jsx("h1",{className:`text-4xl font-extrabold ${P} flex items-center gap-3`,children:a.jsx("span",{className:"bg-gradient-to-r from-[#4E6E49] via-emerald-600 to-blue-600 text-transparent bg-clip-text",children:"Trading Signals"})}),a.jsxs("p",{className:`text-sm font-medium ${$} flex items-center gap-2`,children:[a.jsx("span",{className:"text-[#4E6E49]",children:"●"}),"Управление торговыми сигналами для команды"]})]})]})}),a.jsxs("button",{onClick:()=>{E(null),c(!0)},className:"w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform",children:[a.jsx(Ns,{className:"w-5 h-5"}),a.jsx("span",{children:"Создать сигнал"})]})]}),a.jsxs("div",{className:"relative",children:[a.jsx(Cf,{className:`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${$}`}),a.jsx("input",{type:"text",value:S,onChange:L=>C(L.target.value),placeholder:"Поиск по тикеру, паре или сети...",className:`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${K} ${r==="dark"?"bg-gray-700/50":"bg-gray-50"} ${P} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}),a.jsxs("div",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400",children:[le.length,"/",t.length]})]})]})]}),g&&t.length>0&&a.jsxs("div",{className:`${Q} rounded-2xl p-6 shadow-xl border ${K}`,children:[a.jsxs("div",{className:"flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6",children:[a.jsxs("h2",{className:`text-2xl font-bold ${P} flex items-center gap-2`,children:[a.jsx(Ic,{className:"w-6 h-6 text-[#4E6E49]"}),"Аналитика"]}),a.jsxs("div",{className:"flex flex-wrap gap-2",children:[["all","active","completed","cancelled","reviewed"].map(L=>a.jsxs("button",{onClick:()=>ne(L),className:`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${F===L?Z:H}`,children:[L==="all"&&"Все",L==="active"&&"Активные",L==="completed"&&"Завершенные",L==="cancelled"&&"Отмененные",L==="reviewed"&&"На рассмотрении"]},L)),a.jsx("button",{onClick:()=>x(!g),className:`p-2 rounded-lg ${r==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,title:"Скрыть аналитику",children:a.jsx(Pt,{className:`w-5 h-5 ${$}`})})]})]}),a.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",children:[a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-blue-500/10 border border-blue-500/20":"bg-blue-50 border border-blue-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(xf,{className:"w-5 h-5 text-blue-500"}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Всего сигналов"})]}),a.jsx("p",{className:`text-2xl font-bold ${P}`,children:y.total})]}),a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-[#4E6E49]/10 border border-[#4E6E49]/20":"bg-green-50 border border-green-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(Tn,{className:"w-5 h-5 text-[#4E6E49]"}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Активных"})]}),a.jsx("p",{className:`text-2xl font-bold ${P}`,children:y.active})]}),a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-purple-500/10 border border-purple-500/20":"bg-purple-50 border border-purple-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx($n,{className:"w-5 h-5 text-purple-500"}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Завершено"})]}),a.jsx("p",{className:`text-2xl font-bold ${P}`,children:y.completed})]}),a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-orange-500/10 border border-orange-500/20":"bg-orange-50 border border-orange-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(Vr,{className:"w-5 h-5 text-orange-500"}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Средний PNL"})]}),a.jsxs("p",{className:`text-2xl font-bold ${y.avgPnL>=0?"text-[#4E6E49]":"text-red-500"}`,children:[y.avgPnL>=0?"+":"",y.avgPnL.toFixed(2),"%"]})]})]}),y.bestCall&&a.jsxs("div",{className:`p-4 rounded-xl mb-6 ${r==="dark"?"bg-gradient-to-r from-[#4E6E49]/10 to-[#4E6E49]/10 border border-[#4E6E49]/20":"bg-gradient-to-r from-green-50 to-green-100 border border-green-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(vu,{className:"w-5 h-5 text-[#4E6E49]"}),a.jsx("p",{className:`text-sm font-semibold ${P}`,children:"Лучший сигнал"})]}),a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{children:[a.jsx("p",{className:`font-bold ${P}`,children:y.bestCall.pair}),a.jsxs("p",{className:`text-xs ${$}`,children:["Тикер: ",y.bestCall.ticker]})]}),a.jsxs("div",{className:"text-right",children:[a.jsxs("p",{className:"text-2xl font-bold text-[#4E6E49]",children:["+",((Ee=y.bestCall.maxProfit)==null?void 0:Ee.toFixed(2))||"0.00","%"]}),a.jsx("p",{className:`text-xs ${$}`,children:"MAX прибыль"})]})]})]}),a.jsxs("div",{children:[a.jsxs("h3",{className:`text-lg font-bold ${P} mb-4 flex items-center gap-2`,children:[a.jsx(un,{className:"w-5 h-5 text-[#4E6E49]"}),"Статистика по трейдерам"]}),a.jsx("div",{className:"space-y-3",children:_.map(L=>a.jsxs("div",{className:`p-4 rounded-xl border ${K} ${r==="dark"?"bg-gray-700/30":"bg-gray-50"}`,children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-10 h-10 rounded-full bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] flex items-center justify-center text-white font-bold",children:L.name[0]}),a.jsxs("div",{children:[a.jsx("p",{className:`font-bold ${P}`,children:L.name}),a.jsxs("p",{className:`text-xs ${$}`,children:["Всего сигналов: ",L.totalCalls]})]})]}),a.jsxs("div",{className:"text-right",children:[a.jsxs("p",{className:`text-lg font-bold ${L.avgPnL>=0?"text-[#4E6E49]":"text-red-500"}`,children:[L.avgPnL>=0?"+":"",L.avgPnL.toFixed(2),"%"]}),a.jsx("p",{className:`text-xs ${$}`,children:"Средний PNL"})]})]}),a.jsxs("div",{className:"grid grid-cols-4 gap-2",children:[a.jsxs("div",{className:`p-2 rounded-lg text-center ${r==="dark"?"bg-[#4E6E49]/10":"bg-green-50"}`,children:[a.jsx("p",{className:`text-sm font-bold ${P}`,children:L.activeCalls}),a.jsx("p",{className:`text-xs ${$}`,children:"Активных"})]}),a.jsxs("div",{className:`p-2 rounded-lg text-center ${r==="dark"?"bg-blue-500/10":"bg-blue-50"}`,children:[a.jsx("p",{className:`text-sm font-bold ${P}`,children:L.completedCalls}),a.jsx("p",{className:`text-xs ${$}`,children:"Завершено"})]}),a.jsxs("div",{className:`p-2 rounded-lg text-center ${r==="dark"?"bg-red-500/10":"bg-red-50"}`,children:[a.jsx("p",{className:`text-sm font-bold ${P}`,children:L.cancelledCalls}),a.jsx("p",{className:`text-xs ${$}`,children:"Отменено"})]}),a.jsxs("div",{className:`p-2 rounded-lg text-center ${r==="dark"?"bg-purple-500/10":"bg-purple-50"}`,children:[a.jsxs("p",{className:"text-sm font-bold text-purple-500",children:["+",L.maxProfit.toFixed(1),"%"]}),a.jsx("p",{className:`text-xs ${$}`,children:"MAX"})]})]})]},L.name))})]})]}),t.length>0&&!g&&a.jsxs("button",{onClick:()=>x(!0),className:`w-full ${Q} rounded-xl p-4 shadow-lg border ${K} hover:shadow-xl transition-all flex items-center justify-center gap-2 ${r==="dark"?"hover:bg-gray-700/50":"hover:bg-gray-50"}`,children:[a.jsx(Ic,{className:"w-5 h-5 text-[#4E6E49]"}),a.jsx("span",{className:`font-semibold ${P}`,children:"Показать аналитику"})]}),l&&a.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200",children:a.jsxs("div",{className:`${Q} rounded-2xl p-8 shadow-2xl border ${K} max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300`,children:[a.jsxs("div",{className:"flex items-center justify-between mb-6",children:[a.jsx("h2",{className:`text-3xl font-bold ${P}`,children:j?"Редактировать сигнал":"Создать новый сигнал"}),a.jsx("button",{onClick:w,className:`p-2 rounded-xl transition-colors ${r==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,children:a.jsx(Pt,{className:`w-6 h-6 ${$}`})})]}),a.jsx(u_,{callToEdit:j,onSuccess:b,onCancel:w})]})}),d&&a.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200",children:a.jsxs("div",{className:`${Q} rounded-2xl p-8 shadow-2xl border ${K} max-w-md w-full animate-in slide-in-from-bottom-4 duration-300`,children:[a.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[a.jsx("div",{className:"p-3 rounded-full bg-red-500/10",children:a.jsx(ys,{className:"w-8 h-8 text-red-500"})}),a.jsxs("div",{children:[a.jsx("h3",{className:`text-2xl font-bold ${P}`,children:"Удалить сигнал?"}),a.jsx("p",{className:$,children:"Это действие нельзя отменить"})]})]}),a.jsxs("div",{className:"flex gap-4",children:[a.jsx("button",{onClick:()=>{h(!1),T(null)},className:`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${r==="dark"?"bg-gray-700 hover:bg-gray-600 text-white":"bg-gray-200 hover:bg-gray-300 text-gray-900"}`,children:"Отмена"}),a.jsx("button",{onClick:f,className:`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${r==="dark"?"bg-red-600 hover:bg-red-700 text-white":"bg-red-500 hover:bg-red-600 text-white"}`,children:"Удалить"})]})]})}),!l&&a.jsx(a.Fragment,{children:s?a.jsxs("div",{className:`${Q} rounded-2xl p-12 text-center ${K} border shadow-xl`,children:[a.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-4 border-[#4E6E49] border-t-transparent mx-auto mb-4"}),a.jsx("p",{className:`${$} text-lg`,children:"Загрузка сигналов..."})]}):t.length===0?a.jsxs("div",{className:`${Q} rounded-2xl p-12 text-center ${K} border shadow-xl`,children:[a.jsx(rn,{className:`w-20 h-20 mx-auto mb-6 ${$}`}),a.jsx("h3",{className:`text-2xl font-bold ${P} mb-2`,children:"Нет сигналов"}),a.jsx("p",{className:$,children:"Создайте первый торговый сигнал для команды"})]}):le.length===0?a.jsxs("div",{className:`${Q} rounded-2xl p-12 text-center ${K} border shadow-xl`,children:[a.jsx(rn,{className:`w-20 h-20 mx-auto mb-6 ${$}`}),a.jsx("h3",{className:`text-2xl font-bold ${P} mb-2`,children:"Ничего не найдено"}),a.jsx("p",{className:$,children:"Попробуйте изменить запрос"}),a.jsxs("p",{className:`${$} text-xs mt-2`,children:["Найдено сигналов: ",t.length,", отфильтровано: ",le.length]})]}):a.jsx("div",{className:"grid grid-cols-1 gap-6",children:le.map(L=>{const V=ve.find(ee=>ee.id===L.userId),X=ce[L.network]||{bg:"bg-gray-500/10",text:"text-gray-400",icon:"bg-gray-500"},se=q[L.strategy]||q.flip,J=W[L.status]||W.active,z=I===L.ticker;return a.jsxs("div",{className:`${Q} rounded-2xl p-6 shadow-xl border ${K} hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`,children:[a.jsx("div",{className:`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4E6E49] via-[#4E6E49] to-[#4E6E49] ${L.status==="active"?"opacity-100":"opacity-50"}`}),a.jsxs("div",{className:"flex items-start justify-between mb-6",children:[a.jsxs("div",{className:"flex-1",children:[a.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[a.jsxs("div",{className:`${X.bg} ${X.text} px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border ${K}`,children:[a.jsx("div",{className:`w-2 h-2 rounded-full ${X.icon}`}),L.network.toUpperCase()]}),a.jsx("span",{className:`px-3 py-1 rounded-lg text-xs font-medium border ${J.color}`,children:J.label}),V&&a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"w-6 h-6 rounded-full bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] flex items-center justify-center text-white text-xs font-bold",children:V.name[0]}),a.jsx("span",{className:`text-xs ${$}`,children:V.name})]})]}),a.jsxs("div",{className:"mb-3",children:[a.jsx("h2",{className:`text-3xl font-bold ${P} mb-1`,children:L.pair}),a.jsx("p",{className:`text-xs ${$} uppercase tracking-wider`,children:"Торговая пара"})]}),a.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[a.jsxs("span",{className:`font-mono text-sm ${$} bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded`,children:["№ ",L.ticker]}),a.jsx("button",{onClick:()=>O(L.ticker),className:`p-1.5 rounded-lg transition-all ${r==="dark"?"bg-gray-700/50 hover:bg-gray-600":"bg-gray-100 hover:bg-gray-200"}`,title:"Скопировать тикер",children:z?a.jsx($n,{className:"w-4 h-4 text-[#4E6E49]"}):a.jsx(oo,{className:`w-4 h-4 ${$}`})})]})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("button",{onClick:()=>k(L),className:`p-3 rounded-xl transition-all duration-200 ${r==="dark"?"bg-blue-500/10 hover:bg-blue-500/20 text-blue-400":"bg-blue-50 hover:bg-blue-100 text-blue-600"}`,title:"Редактировать",children:a.jsx($t,{className:"w-5 h-5"})}),a.jsx("button",{onClick:()=>N(L.id),className:`p-3 rounded-xl transition-all duration-200 ${r==="dark"?"bg-red-500/10 hover:bg-red-500/20 text-red-400":"bg-red-50 hover:bg-red-100 text-red-600"}`,title:"Удалить",children:a.jsx(Et,{className:"w-5 h-5"})})]})]}),(L.maxProfit!==void 0||L.currentPnL!==void 0)&&a.jsxs("div",{className:"grid grid-cols-2 gap-3 mb-4",children:[L.maxProfit!==void 0&&a.jsxs("div",{className:`p-3 rounded-xl ${r==="dark"?"bg-[#4E6E49]/10 border border-[#4E6E49]/20":"bg-green-50 border border-green-200"}`,children:[a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$} mb-1`,children:"MAX прибыль"}),a.jsxs("p",{className:"text-xl font-bold text-[#4E6E49]",children:["+",L.maxProfit.toFixed(2),"%"]})]}),L.currentPnL!==void 0&&a.jsxs("div",{className:`p-3 rounded-xl ${r==="dark"?L.currentPnL>=0?"bg-[#4E6E49]/10 border border-[#4E6E49]/20":"bg-red-500/10 border border-red-500/20":L.currentPnL>=0?"bg-green-50 border border-green-200":"bg-red-50 border border-red-200"}`,children:[a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$} mb-1`,children:"Текущий PNL"}),a.jsxs("p",{className:`text-xl font-bold ${L.currentPnL>=0?"text-[#4E6E49]":"text-red-500"}`,children:[L.currentPnL>=0?"+":"",L.currentPnL.toFixed(2),"%"]})]})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",children:[a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-gray-700/30":"bg-green-50/50"} border ${K}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(lo,{className:"w-4 h-4 text-[#4E6E49]"}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Вход (капитализация)"})]}),a.jsx("p",{className:`${P} font-medium`,children:L.entryPoint})]}),a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-gray-700/30":"bg-blue-50/50"} border ${K}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(lo,{className:`w-4 h-4 ${r==="dark"?"text-blue-400":"text-blue-600"}`}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Цели (капитализация)"})]}),a.jsx("p",{className:`${P} font-medium`,children:L.target})]}),a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-gray-700/30":"bg-purple-50/50"} border ${K}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(Tn,{className:`w-4 h-4 ${r==="dark"?"text-purple-400":"text-purple-600"}`}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Стратегия"})]}),a.jsxs("span",{className:`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${se.color}`,children:[se.icon," ",se.label]})]}),a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-gray-700/30":"bg-gray-50/50"} border ${K}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(zn,{className:`w-4 h-4 ${$}`}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Создан"})]}),a.jsx("p",{className:`${P} text-sm`,children:new Date(L.createdAt).toLocaleDateString("ru-RU",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})})]})]}),a.jsxs("div",{className:"space-y-3 mb-4",children:[a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-red-500/5 border-red-500/20":"bg-red-50/50 border-red-200/50"} border`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(ys,{className:`w-4 h-4 ${r==="dark"?"text-red-400":"text-red-600"}`}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${r==="dark"?"text-red-400":"text-red-600"}`,children:"Риски"})]}),a.jsx("p",{className:`${P} text-sm leading-relaxed`,children:L.risks})]}),L.cancelConditions&&a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-orange-500/5 border-orange-500/20":"bg-orange-50/50 border-orange-200/50"} border`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(ys,{className:`w-4 h-4 ${r==="dark"?"text-orange-400":"text-orange-600"}`}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${r==="dark"?"text-orange-400":"text-orange-600"}`,children:"Условия отмены"})]}),a.jsx("p",{className:`${P} text-sm leading-relaxed`,children:L.cancelConditions})]}),L.comment&&a.jsxs("div",{className:`p-4 rounded-xl ${r==="dark"?"bg-gray-700/30":"bg-gray-50/50"} border ${K}`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(Lo,{className:`w-4 h-4 ${$}`}),a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wider ${$}`,children:"Комментарий"})]}),a.jsx("p",{className:`${P} text-sm leading-relaxed`,children:L.comment})]})]})]},L.id)})})})]})})};function ti(r){"@babel/helpers - typeof";return ti=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ti(r)}function rr(r){if(r===null||r===!0||r===!1)return NaN;var e=Number(r);return isNaN(e)?e:e<0?Math.ceil(e):Math.floor(e)}function ze(r,e){if(e.length<r)throw new TypeError(r+" argument"+(r>1?"s":"")+" required, but only "+e.length+" present")}function rt(r){ze(1,arguments);var e=Object.prototype.toString.call(r);return r instanceof Date||ti(r)==="object"&&e==="[object Date]"?new Date(r.getTime()):typeof r=="number"||e==="[object Number]"?new Date(r):((typeof r=="string"||e==="[object String]")&&typeof console<"u"&&(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"),console.warn(new Error().stack)),new Date(NaN))}function m_(r,e){ze(2,arguments);var t=rt(r).getTime(),n=rr(e);return new Date(t+n)}var g_={};function Zn(){return g_}function f_(r,e){var t,n,s,i,l,c,d,h;ze(1,arguments);var g=Zn(),x=rr((t=(n=(s=(i=e==null?void 0:e.weekStartsOn)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.weekStartsOn)!==null&&s!==void 0?s:g.weekStartsOn)!==null&&n!==void 0?n:(d=g.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.weekStartsOn)!==null&&t!==void 0?t:0);if(!(x>=0&&x<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var p=rt(r),T=p.getDay(),j=(T<x?7:0)+T-x;return p.setDate(p.getDate()-j),p.setHours(0,0,0,0),p}function p_(r){var e=new Date(Date.UTC(r.getFullYear(),r.getMonth(),r.getDate(),r.getHours(),r.getMinutes(),r.getSeconds(),r.getMilliseconds()));return e.setUTCFullYear(r.getFullYear()),r.getTime()-e.getTime()}function ru(r){ze(1,arguments);var e=rt(r);return e.setHours(0,0,0,0),e}var qm=6e4,Wm=36e5;function x_(r,e){ze(2,arguments);var t=ru(r),n=ru(e);return t.getTime()===n.getTime()}function y_(r){return ze(1,arguments),r instanceof Date||ti(r)==="object"&&Object.prototype.toString.call(r)==="[object Date]"}function b_(r){if(ze(1,arguments),!y_(r)&&typeof r!="number")return!1;var e=rt(r);return!isNaN(Number(e))}function v_(r,e){var t;ze(1,arguments);var n=r||{},s=rt(n.start),i=rt(n.end),l=i.getTime();if(!(s.getTime()<=l))throw new RangeError("Invalid interval");var c=[],d=s;d.setHours(0,0,0,0);var h=Number((t=void 0)!==null&&t!==void 0?t:1);if(h<1||isNaN(h))throw new RangeError("`options.step` must be a number greater than 1");for(;d.getTime()<=l;)c.push(rt(d)),d.setDate(d.getDate()+h),d.setHours(0,0,0,0);return c}function w_(r,e){var t,n,s,i,l,c,d,h;ze(1,arguments);var g=Zn(),x=rr((t=(n=(s=(i=e==null?void 0:e.weekStartsOn)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.weekStartsOn)!==null&&s!==void 0?s:g.weekStartsOn)!==null&&n!==void 0?n:(d=g.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.weekStartsOn)!==null&&t!==void 0?t:0);if(!(x>=0&&x<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var p=rt(r),T=p.getDay(),j=(T<x?-7:0)+6-(T-x);return p.setDate(p.getDate()+j),p.setHours(23,59,59,999),p}function __(r,e){ze(2,arguments);var t=rr(e);return m_(r,-t)}var E_=864e5;function k_(r){ze(1,arguments);var e=rt(r),t=e.getTime();e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0);var n=e.getTime(),s=t-n;return Math.floor(s/E_)+1}function ri(r){ze(1,arguments);var e=1,t=rt(r),n=t.getUTCDay(),s=(n<e?7:0)+n-e;return t.setUTCDate(t.getUTCDate()-s),t.setUTCHours(0,0,0,0),t}function zm(r){ze(1,arguments);var e=rt(r),t=e.getUTCFullYear(),n=new Date(0);n.setUTCFullYear(t+1,0,4),n.setUTCHours(0,0,0,0);var s=ri(n),i=new Date(0);i.setUTCFullYear(t,0,4),i.setUTCHours(0,0,0,0);var l=ri(i);return e.getTime()>=s.getTime()?t+1:e.getTime()>=l.getTime()?t:t-1}function N_(r){ze(1,arguments);var e=zm(r),t=new Date(0);t.setUTCFullYear(e,0,4),t.setUTCHours(0,0,0,0);var n=ri(t);return n}var j_=6048e5;function T_(r){ze(1,arguments);var e=rt(r),t=ri(e).getTime()-N_(e).getTime();return Math.round(t/j_)+1}function Wn(r,e){var t,n,s,i,l,c,d,h;ze(1,arguments);var g=Zn(),x=rr((t=(n=(s=(i=e==null?void 0:e.weekStartsOn)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.weekStartsOn)!==null&&s!==void 0?s:g.weekStartsOn)!==null&&n!==void 0?n:(d=g.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.weekStartsOn)!==null&&t!==void 0?t:0);if(!(x>=0&&x<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var p=rt(r),T=p.getUTCDay(),j=(T<x?7:0)+T-x;return p.setUTCDate(p.getUTCDate()-j),p.setUTCHours(0,0,0,0),p}function Hm(r,e){var t,n,s,i,l,c,d,h;ze(1,arguments);var g=rt(r),x=g.getUTCFullYear(),p=Zn(),T=rr((t=(n=(s=(i=e==null?void 0:e.firstWeekContainsDate)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.firstWeekContainsDate)!==null&&s!==void 0?s:p.firstWeekContainsDate)!==null&&n!==void 0?n:(d=p.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.firstWeekContainsDate)!==null&&t!==void 0?t:1);if(!(T>=1&&T<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var j=new Date(0);j.setUTCFullYear(x+1,0,T),j.setUTCHours(0,0,0,0);var E=Wn(j,e),I=new Date(0);I.setUTCFullYear(x,0,T),I.setUTCHours(0,0,0,0);var D=Wn(I,e);return g.getTime()>=E.getTime()?x+1:g.getTime()>=D.getTime()?x:x-1}function I_(r,e){var t,n,s,i,l,c,d,h;ze(1,arguments);var g=Zn(),x=rr((t=(n=(s=(i=e==null?void 0:e.firstWeekContainsDate)!==null&&i!==void 0?i:e==null||(l=e.locale)===null||l===void 0||(c=l.options)===null||c===void 0?void 0:c.firstWeekContainsDate)!==null&&s!==void 0?s:g.firstWeekContainsDate)!==null&&n!==void 0?n:(d=g.locale)===null||d===void 0||(h=d.options)===null||h===void 0?void 0:h.firstWeekContainsDate)!==null&&t!==void 0?t:1),p=Hm(r,e),T=new Date(0);T.setUTCFullYear(p,0,x),T.setUTCHours(0,0,0,0);var j=Wn(T,e);return j}var S_=6048e5;function A_(r,e){ze(1,arguments);var t=rt(r),n=Wn(t,e).getTime()-I_(t,e).getTime();return Math.round(n/S_)+1}function $e(r,e){for(var t=r<0?"-":"",n=Math.abs(r).toString();n.length<e;)n="0"+n;return t+n}var Nr={y:function(e,t){var n=e.getUTCFullYear(),s=n>0?n:1-n;return $e(t==="yy"?s%100:s,t.length)},M:function(e,t){var n=e.getUTCMonth();return t==="M"?String(n+1):$e(n+1,2)},d:function(e,t){return $e(e.getUTCDate(),t.length)},a:function(e,t){var n=e.getUTCHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return n.toUpperCase();case"aaa":return n;case"aaaaa":return n[0];case"aaaa":default:return n==="am"?"a.m.":"p.m."}},h:function(e,t){return $e(e.getUTCHours()%12||12,t.length)},H:function(e,t){return $e(e.getUTCHours(),t.length)},m:function(e,t){return $e(e.getUTCMinutes(),t.length)},s:function(e,t){return $e(e.getUTCSeconds(),t.length)},S:function(e,t){var n=t.length,s=e.getUTCMilliseconds(),i=Math.floor(s*Math.pow(10,n-3));return $e(i,t.length)}},_n={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},C_={G:function(e,t,n){var s=e.getUTCFullYear()>0?1:0;switch(t){case"G":case"GG":case"GGG":return n.era(s,{width:"abbreviated"});case"GGGGG":return n.era(s,{width:"narrow"});case"GGGG":default:return n.era(s,{width:"wide"})}},y:function(e,t,n){if(t==="yo"){var s=e.getUTCFullYear(),i=s>0?s:1-s;return n.ordinalNumber(i,{unit:"year"})}return Nr.y(e,t)},Y:function(e,t,n,s){var i=Hm(e,s),l=i>0?i:1-i;if(t==="YY"){var c=l%100;return $e(c,2)}return t==="Yo"?n.ordinalNumber(l,{unit:"year"}):$e(l,t.length)},R:function(e,t){var n=zm(e);return $e(n,t.length)},u:function(e,t){var n=e.getUTCFullYear();return $e(n,t.length)},Q:function(e,t,n){var s=Math.ceil((e.getUTCMonth()+1)/3);switch(t){case"Q":return String(s);case"QQ":return $e(s,2);case"Qo":return n.ordinalNumber(s,{unit:"quarter"});case"QQQ":return n.quarter(s,{width:"abbreviated",context:"formatting"});case"QQQQQ":return n.quarter(s,{width:"narrow",context:"formatting"});case"QQQQ":default:return n.quarter(s,{width:"wide",context:"formatting"})}},q:function(e,t,n){var s=Math.ceil((e.getUTCMonth()+1)/3);switch(t){case"q":return String(s);case"qq":return $e(s,2);case"qo":return n.ordinalNumber(s,{unit:"quarter"});case"qqq":return n.quarter(s,{width:"abbreviated",context:"standalone"});case"qqqqq":return n.quarter(s,{width:"narrow",context:"standalone"});case"qqqq":default:return n.quarter(s,{width:"wide",context:"standalone"})}},M:function(e,t,n){var s=e.getUTCMonth();switch(t){case"M":case"MM":return Nr.M(e,t);case"Mo":return n.ordinalNumber(s+1,{unit:"month"});case"MMM":return n.month(s,{width:"abbreviated",context:"formatting"});case"MMMMM":return n.month(s,{width:"narrow",context:"formatting"});case"MMMM":default:return n.month(s,{width:"wide",context:"formatting"})}},L:function(e,t,n){var s=e.getUTCMonth();switch(t){case"L":return String(s+1);case"LL":return $e(s+1,2);case"Lo":return n.ordinalNumber(s+1,{unit:"month"});case"LLL":return n.month(s,{width:"abbreviated",context:"standalone"});case"LLLLL":return n.month(s,{width:"narrow",context:"standalone"});case"LLLL":default:return n.month(s,{width:"wide",context:"standalone"})}},w:function(e,t,n,s){var i=A_(e,s);return t==="wo"?n.ordinalNumber(i,{unit:"week"}):$e(i,t.length)},I:function(e,t,n){var s=T_(e);return t==="Io"?n.ordinalNumber(s,{unit:"week"}):$e(s,t.length)},d:function(e,t,n){return t==="do"?n.ordinalNumber(e.getUTCDate(),{unit:"date"}):Nr.d(e,t)},D:function(e,t,n){var s=k_(e);return t==="Do"?n.ordinalNumber(s,{unit:"dayOfYear"}):$e(s,t.length)},E:function(e,t,n){var s=e.getUTCDay();switch(t){case"E":case"EE":case"EEE":return n.day(s,{width:"abbreviated",context:"formatting"});case"EEEEE":return n.day(s,{width:"narrow",context:"formatting"});case"EEEEEE":return n.day(s,{width:"short",context:"formatting"});case"EEEE":default:return n.day(s,{width:"wide",context:"formatting"})}},e:function(e,t,n,s){var i=e.getUTCDay(),l=(i-s.weekStartsOn+8)%7||7;switch(t){case"e":return String(l);case"ee":return $e(l,2);case"eo":return n.ordinalNumber(l,{unit:"day"});case"eee":return n.day(i,{width:"abbreviated",context:"formatting"});case"eeeee":return n.day(i,{width:"narrow",context:"formatting"});case"eeeeee":return n.day(i,{width:"short",context:"formatting"});case"eeee":default:return n.day(i,{width:"wide",context:"formatting"})}},c:function(e,t,n,s){var i=e.getUTCDay(),l=(i-s.weekStartsOn+8)%7||7;switch(t){case"c":return String(l);case"cc":return $e(l,t.length);case"co":return n.ordinalNumber(l,{unit:"day"});case"ccc":return n.day(i,{width:"abbreviated",context:"standalone"});case"ccccc":return n.day(i,{width:"narrow",context:"standalone"});case"cccccc":return n.day(i,{width:"short",context:"standalone"});case"cccc":default:return n.day(i,{width:"wide",context:"standalone"})}},i:function(e,t,n){var s=e.getUTCDay(),i=s===0?7:s;switch(t){case"i":return String(i);case"ii":return $e(i,t.length);case"io":return n.ordinalNumber(i,{unit:"day"});case"iii":return n.day(s,{width:"abbreviated",context:"formatting"});case"iiiii":return n.day(s,{width:"narrow",context:"formatting"});case"iiiiii":return n.day(s,{width:"short",context:"formatting"});case"iiii":default:return n.day(s,{width:"wide",context:"formatting"})}},a:function(e,t,n){var s=e.getUTCHours(),i=s/12>=1?"pm":"am";switch(t){case"a":case"aa":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"aaa":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return n.dayPeriod(i,{width:"narrow",context:"formatting"});case"aaaa":default:return n.dayPeriod(i,{width:"wide",context:"formatting"})}},b:function(e,t,n){var s=e.getUTCHours(),i;switch(s===12?i=_n.noon:s===0?i=_n.midnight:i=s/12>=1?"pm":"am",t){case"b":case"bb":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"bbb":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return n.dayPeriod(i,{width:"narrow",context:"formatting"});case"bbbb":default:return n.dayPeriod(i,{width:"wide",context:"formatting"})}},B:function(e,t,n){var s=e.getUTCHours(),i;switch(s>=17?i=_n.evening:s>=12?i=_n.afternoon:s>=4?i=_n.morning:i=_n.night,t){case"B":case"BB":case"BBB":return n.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"BBBBB":return n.dayPeriod(i,{width:"narrow",context:"formatting"});case"BBBB":default:return n.dayPeriod(i,{width:"wide",context:"formatting"})}},h:function(e,t,n){if(t==="ho"){var s=e.getUTCHours()%12;return s===0&&(s=12),n.ordinalNumber(s,{unit:"hour"})}return Nr.h(e,t)},H:function(e,t,n){return t==="Ho"?n.ordinalNumber(e.getUTCHours(),{unit:"hour"}):Nr.H(e,t)},K:function(e,t,n){var s=e.getUTCHours()%12;return t==="Ko"?n.ordinalNumber(s,{unit:"hour"}):$e(s,t.length)},k:function(e,t,n){var s=e.getUTCHours();return s===0&&(s=24),t==="ko"?n.ordinalNumber(s,{unit:"hour"}):$e(s,t.length)},m:function(e,t,n){return t==="mo"?n.ordinalNumber(e.getUTCMinutes(),{unit:"minute"}):Nr.m(e,t)},s:function(e,t,n){return t==="so"?n.ordinalNumber(e.getUTCSeconds(),{unit:"second"}):Nr.s(e,t)},S:function(e,t){return Nr.S(e,t)},X:function(e,t,n,s){var i=s._originalDate||e,l=i.getTimezoneOffset();if(l===0)return"Z";switch(t){case"X":return su(l);case"XXXX":case"XX":return Yr(l);case"XXXXX":case"XXX":default:return Yr(l,":")}},x:function(e,t,n,s){var i=s._originalDate||e,l=i.getTimezoneOffset();switch(t){case"x":return su(l);case"xxxx":case"xx":return Yr(l);case"xxxxx":case"xxx":default:return Yr(l,":")}},O:function(e,t,n,s){var i=s._originalDate||e,l=i.getTimezoneOffset();switch(t){case"O":case"OO":case"OOO":return"GMT"+nu(l,":");case"OOOO":default:return"GMT"+Yr(l,":")}},z:function(e,t,n,s){var i=s._originalDate||e,l=i.getTimezoneOffset();switch(t){case"z":case"zz":case"zzz":return"GMT"+nu(l,":");case"zzzz":default:return"GMT"+Yr(l,":")}},t:function(e,t,n,s){var i=s._originalDate||e,l=Math.floor(i.getTime()/1e3);return $e(l,t.length)},T:function(e,t,n,s){var i=s._originalDate||e,l=i.getTime();return $e(l,t.length)}};function nu(r,e){var t=r>0?"-":"+",n=Math.abs(r),s=Math.floor(n/60),i=n%60;if(i===0)return t+String(s);var l=e;return t+String(s)+l+$e(i,2)}function su(r,e){if(r%60===0){var t=r>0?"-":"+";return t+$e(Math.abs(r)/60,2)}return Yr(r,e)}function Yr(r,e){var t=e||"",n=r>0?"-":"+",s=Math.abs(r),i=$e(Math.floor(s/60),2),l=$e(s%60,2);return n+i+t+l}var au=function(e,t){switch(e){case"P":return t.date({width:"short"});case"PP":return t.date({width:"medium"});case"PPP":return t.date({width:"long"});case"PPPP":default:return t.date({width:"full"})}},Gm=function(e,t){switch(e){case"p":return t.time({width:"short"});case"pp":return t.time({width:"medium"});case"ppp":return t.time({width:"long"});case"pppp":default:return t.time({width:"full"})}},R_=function(e,t){var n=e.match(/(P+)(p+)?/)||[],s=n[1],i=n[2];if(!i)return au(e,t);var l;switch(s){case"P":l=t.dateTime({width:"short"});break;case"PP":l=t.dateTime({width:"medium"});break;case"PPP":l=t.dateTime({width:"long"});break;case"PPPP":default:l=t.dateTime({width:"full"});break}return l.replace("{{date}}",au(s,t)).replace("{{time}}",Gm(i,t))},P_={p:Gm,P:R_},D_=["D","DD"],$_=["YY","YYYY"];function M_(r){return D_.indexOf(r)!==-1}function O_(r){return $_.indexOf(r)!==-1}function iu(r,e,t){if(r==="YYYY")throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(e,"`) for formatting years to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(r==="YY")throw new RangeError("Use `yy` instead of `YY` (in `".concat(e,"`) for formatting years to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(r==="D")throw new RangeError("Use `d` instead of `D` (in `".concat(e,"`) for formatting days of the month to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(r==="DD")throw new RangeError("Use `dd` instead of `DD` (in `".concat(e,"`) for formatting days of the month to the input `").concat(t,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"))}var V_={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},L_=function(e,t,n){var s,i=V_[e];return typeof i=="string"?s=i:t===1?s=i.one:s=i.other.replace("{{count}}",t.toString()),n!=null&&n.addSuffix?n.comparison&&n.comparison>0?"in "+s:s+" ago":s};function Rn(r){return function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.width?String(e.width):r.defaultWidth,n=r.formats[t]||r.formats[r.defaultWidth];return n}}var F_={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},U_={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},B_={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},q_={date:Rn({formats:F_,defaultWidth:"full"}),time:Rn({formats:U_,defaultWidth:"full"}),dateTime:Rn({formats:B_,defaultWidth:"full"})},W_={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},z_=function(e,t,n,s){return W_[e]};function Ht(r){return function(e,t){var n=t!=null&&t.context?String(t.context):"standalone",s;if(n==="formatting"&&r.formattingValues){var i=r.defaultFormattingWidth||r.defaultWidth,l=t!=null&&t.width?String(t.width):i;s=r.formattingValues[l]||r.formattingValues[i]}else{var c=r.defaultWidth,d=t!=null&&t.width?String(t.width):r.defaultWidth;s=r.values[d]||r.values[c]}var h=r.argumentCallback?r.argumentCallback(e):e;return s[h]}}var H_={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},G_={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},K_={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Q_={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Y_={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},X_={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},J_=function(e,t){var n=Number(e),s=n%100;if(s>20||s<10)switch(s%10){case 1:return n+"st";case 2:return n+"nd";case 3:return n+"rd"}return n+"th"},Z_={ordinalNumber:J_,era:Ht({values:H_,defaultWidth:"wide"}),quarter:Ht({values:G_,defaultWidth:"wide",argumentCallback:function(e){return e-1}}),month:Ht({values:K_,defaultWidth:"wide"}),day:Ht({values:Q_,defaultWidth:"wide"}),dayPeriod:Ht({values:Y_,defaultWidth:"wide",formattingValues:X_,defaultFormattingWidth:"wide"})};function Gt(r){return function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.width,s=n&&r.matchPatterns[n]||r.matchPatterns[r.defaultMatchWidth],i=e.match(s);if(!i)return null;var l=i[0],c=n&&r.parsePatterns[n]||r.parsePatterns[r.defaultParseWidth],d=Array.isArray(c)?tE(c,function(x){return x.test(l)}):eE(c,function(x){return x.test(l)}),h;h=r.valueCallback?r.valueCallback(d):d,h=t.valueCallback?t.valueCallback(h):h;var g=e.slice(l.length);return{value:h,rest:g}}}function eE(r,e){for(var t in r)if(r.hasOwnProperty(t)&&e(r[t]))return t}function tE(r,e){for(var t=0;t<r.length;t++)if(e(r[t]))return t}function Km(r){return function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=e.match(r.matchPattern);if(!n)return null;var s=n[0],i=e.match(r.parsePattern);if(!i)return null;var l=r.valueCallback?r.valueCallback(i[0]):i[0];l=t.valueCallback?t.valueCallback(l):l;var c=e.slice(s.length);return{value:l,rest:c}}}var rE=/^(\d+)(th|st|nd|rd)?/i,nE=/\d+/i,sE={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},aE={any:[/^b/i,/^(a|c)/i]},iE={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},oE={any:[/1/i,/2/i,/3/i,/4/i]},lE={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},cE={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},dE={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},uE={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},hE={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},mE={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},gE={ordinalNumber:Km({matchPattern:rE,parsePattern:nE,valueCallback:function(e){return parseInt(e,10)}}),era:Gt({matchPatterns:sE,defaultMatchWidth:"wide",parsePatterns:aE,defaultParseWidth:"any"}),quarter:Gt({matchPatterns:iE,defaultMatchWidth:"wide",parsePatterns:oE,defaultParseWidth:"any",valueCallback:function(e){return e+1}}),month:Gt({matchPatterns:lE,defaultMatchWidth:"wide",parsePatterns:cE,defaultParseWidth:"any"}),day:Gt({matchPatterns:dE,defaultMatchWidth:"wide",parsePatterns:uE,defaultParseWidth:"any"}),dayPeriod:Gt({matchPatterns:hE,defaultMatchWidth:"any",parsePatterns:mE,defaultParseWidth:"any"})},fE={code:"en-US",formatDistance:L_,formatLong:q_,formatRelative:z_,localize:Z_,match:gE,options:{weekStartsOn:0,firstWeekContainsDate:1}},pE=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,xE=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,yE=/^'([^]*?)'?$/,bE=/''/g,vE=/[a-zA-Z]/;function Qm(r,e,t){var n,s,i,l,c,d,h,g,x,p,T,j,E,I,D,S,C,F;ze(2,arguments);var ne=String(e),B=Zn(),_=(n=(s=t==null?void 0:t.locale)!==null&&s!==void 0?s:B.locale)!==null&&n!==void 0?n:fE,y=rr((i=(l=(c=(d=t==null?void 0:t.firstWeekContainsDate)!==null&&d!==void 0?d:t==null||(h=t.locale)===null||h===void 0||(g=h.options)===null||g===void 0?void 0:g.firstWeekContainsDate)!==null&&c!==void 0?c:B.firstWeekContainsDate)!==null&&l!==void 0?l:(x=B.locale)===null||x===void 0||(p=x.options)===null||p===void 0?void 0:p.firstWeekContainsDate)!==null&&i!==void 0?i:1);if(!(y>=1&&y<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var b=rr((T=(j=(E=(I=t==null?void 0:t.weekStartsOn)!==null&&I!==void 0?I:t==null||(D=t.locale)===null||D===void 0||(S=D.options)===null||S===void 0?void 0:S.weekStartsOn)!==null&&E!==void 0?E:B.weekStartsOn)!==null&&j!==void 0?j:(C=B.locale)===null||C===void 0||(F=C.options)===null||F===void 0?void 0:F.weekStartsOn)!==null&&T!==void 0?T:0);if(!(b>=0&&b<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");if(!_.localize)throw new RangeError("locale must contain localize property");if(!_.formatLong)throw new RangeError("locale must contain formatLong property");var w=rt(r);if(!b_(w))throw new RangeError("Invalid time value");var k=p_(w),N=__(w,k),f={firstWeekContainsDate:y,weekStartsOn:b,locale:_,_originalDate:w},O=ne.match(xE).map(function(Q){var P=Q[0];if(P==="p"||P==="P"){var $=P_[P];return $(Q,_.formatLong)}return Q}).join("").match(pE).map(function(Q){if(Q==="''")return"'";var P=Q[0];if(P==="'")return wE(Q);var $=C_[P];if($)return!(t!=null&&t.useAdditionalWeekYearTokens)&&O_(Q)&&iu(Q,e,String(r)),!(t!=null&&t.useAdditionalDayOfYearTokens)&&M_(Q)&&iu(Q,e,String(r)),$(N,Q,_.localize,f);if(P.match(vE))throw new RangeError("Format string contains an unescaped latin alphabet character `"+P+"`");return Q}).join("");return O}function wE(r){var e=r.match(yE);return e?e[1].replace(bE,"'"):r}function _E(r,e){ze(2,arguments);var t=rt(r),n=rt(e);return t.getTime()<n.getTime()}function dn(r,e){var t;ze(1,arguments);var n=rr((t=void 0)!==null&&t!==void 0?t:2);if(n!==2&&n!==1&&n!==0)throw new RangeError("additionalDigits must be 0, 1 or 2");if(!(typeof r=="string"||Object.prototype.toString.call(r)==="[object String]"))return new Date(NaN);var s=jE(r),i;if(s.date){var l=TE(s.date,n);i=IE(l.restDateString,l.year)}if(!i||isNaN(i.getTime()))return new Date(NaN);var c=i.getTime(),d=0,h;if(s.time&&(d=SE(s.time),isNaN(d)))return new Date(NaN);if(s.timezone){if(h=AE(s.timezone),isNaN(h))return new Date(NaN)}else{var g=new Date(c+d),x=new Date(0);return x.setFullYear(g.getUTCFullYear(),g.getUTCMonth(),g.getUTCDate()),x.setHours(g.getUTCHours(),g.getUTCMinutes(),g.getUTCSeconds(),g.getUTCMilliseconds()),x}return new Date(c+d+h)}var Na={dateTimeDelimiter:/[T ]/,timeZoneDelimiter:/[Z ]/i,timezone:/([Z+-].*)$/},EE=/^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,kE=/^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,NE=/^([+-])(\d{2})(?::?(\d{2}))?$/;function jE(r){var e={},t=r.split(Na.dateTimeDelimiter),n;if(t.length>2)return e;if(/:/.test(t[0])?n=t[0]:(e.date=t[0],n=t[1],Na.timeZoneDelimiter.test(e.date)&&(e.date=r.split(Na.timeZoneDelimiter)[0],n=r.substr(e.date.length,r.length))),n){var s=Na.timezone.exec(n);s?(e.time=n.replace(s[1],""),e.timezone=s[1]):e.time=n}return e}function TE(r,e){var t=new RegExp("^(?:(\\d{4}|[+-]\\d{"+(4+e)+"})|(\\d{2}|[+-]\\d{"+(2+e)+"})$)"),n=r.match(t);if(!n)return{year:NaN,restDateString:""};var s=n[1]?parseInt(n[1]):null,i=n[2]?parseInt(n[2]):null;return{year:i===null?s:i*100,restDateString:r.slice((n[1]||n[2]).length)}}function IE(r,e){if(e===null)return new Date(NaN);var t=r.match(EE);if(!t)return new Date(NaN);var n=!!t[4],s=ms(t[1]),i=ms(t[2])-1,l=ms(t[3]),c=ms(t[4]),d=ms(t[5])-1;if(n)return $E(e,c,d)?CE(e,c,d):new Date(NaN);var h=new Date(0);return!PE(e,i,l)||!DE(e,s)?new Date(NaN):(h.setUTCFullYear(e,i,Math.max(s,l)),h)}function ms(r){return r?parseInt(r):1}function SE(r){var e=r.match(kE);if(!e)return NaN;var t=eo(e[1]),n=eo(e[2]),s=eo(e[3]);return ME(t,n,s)?t*Wm+n*qm+s*1e3:NaN}function eo(r){return r&&parseFloat(r.replace(",","."))||0}function AE(r){if(r==="Z")return 0;var e=r.match(NE);if(!e)return 0;var t=e[1]==="+"?-1:1,n=parseInt(e[2]),s=e[3]&&parseInt(e[3])||0;return OE(n,s)?t*(n*Wm+s*qm):NaN}function CE(r,e,t){var n=new Date(0);n.setUTCFullYear(r,0,4);var s=n.getUTCDay()||7,i=(e-1)*7+t+1-s;return n.setUTCDate(n.getUTCDate()+i),n}var RE=[31,null,31,30,31,30,31,31,30,31,30,31];function Ym(r){return r%400===0||r%4===0&&r%100!==0}function PE(r,e,t){return e>=0&&e<=11&&t>=1&&t<=(RE[e]||(Ym(r)?29:28))}function DE(r,e){return e>=1&&e<=(Ym(r)?366:365)}function $E(r,e,t){return e>=1&&e<=53&&t>=0&&t<=6}function ME(r,e,t){return r===24?e===0&&t===0:t>=0&&t<60&&e>=0&&e<60&&r>=0&&r<25}function OE(r,e){return e>=0&&e<=59}function ou(r,e,t){ze(2,arguments);var n=Wn(r,t),s=Wn(e,t);return n.getTime()===s.getTime()}function gs(r,e){if(r.one!==void 0&&e===1)return r.one;var t=e%10,n=e%100;return t===1&&n!==11?r.singularNominative.replace("{{count}}",String(e)):t>=2&&t<=4&&(n<10||n>20)?r.singularGenitive.replace("{{count}}",String(e)):r.pluralGenitive.replace("{{count}}",String(e))}function _t(r){return function(e,t){return t!=null&&t.addSuffix?t.comparison&&t.comparison>0?r.future?gs(r.future,e):"через "+gs(r.regular,e):r.past?gs(r.past,e):gs(r.regular,e)+" назад":gs(r.regular,e)}}var VE={lessThanXSeconds:_t({regular:{one:"меньше секунды",singularNominative:"меньше {{count}} секунды",singularGenitive:"меньше {{count}} секунд",pluralGenitive:"меньше {{count}} секунд"},future:{one:"меньше, чем через секунду",singularNominative:"меньше, чем через {{count}} секунду",singularGenitive:"меньше, чем через {{count}} секунды",pluralGenitive:"меньше, чем через {{count}} секунд"}}),xSeconds:_t({regular:{singularNominative:"{{count}} секунда",singularGenitive:"{{count}} секунды",pluralGenitive:"{{count}} секунд"},past:{singularNominative:"{{count}} секунду назад",singularGenitive:"{{count}} секунды назад",pluralGenitive:"{{count}} секунд назад"},future:{singularNominative:"через {{count}} секунду",singularGenitive:"через {{count}} секунды",pluralGenitive:"через {{count}} секунд"}}),halfAMinute:function(e,t){return t!=null&&t.addSuffix?t.comparison&&t.comparison>0?"через полминуты":"полминуты назад":"полминуты"},lessThanXMinutes:_t({regular:{one:"меньше минуты",singularNominative:"меньше {{count}} минуты",singularGenitive:"меньше {{count}} минут",pluralGenitive:"меньше {{count}} минут"},future:{one:"меньше, чем через минуту",singularNominative:"меньше, чем через {{count}} минуту",singularGenitive:"меньше, чем через {{count}} минуты",pluralGenitive:"меньше, чем через {{count}} минут"}}),xMinutes:_t({regular:{singularNominative:"{{count}} минута",singularGenitive:"{{count}} минуты",pluralGenitive:"{{count}} минут"},past:{singularNominative:"{{count}} минуту назад",singularGenitive:"{{count}} минуты назад",pluralGenitive:"{{count}} минут назад"},future:{singularNominative:"через {{count}} минуту",singularGenitive:"через {{count}} минуты",pluralGenitive:"через {{count}} минут"}}),aboutXHours:_t({regular:{singularNominative:"около {{count}} часа",singularGenitive:"около {{count}} часов",pluralGenitive:"около {{count}} часов"},future:{singularNominative:"приблизительно через {{count}} час",singularGenitive:"приблизительно через {{count}} часа",pluralGenitive:"приблизительно через {{count}} часов"}}),xHours:_t({regular:{singularNominative:"{{count}} час",singularGenitive:"{{count}} часа",pluralGenitive:"{{count}} часов"}}),xDays:_t({regular:{singularNominative:"{{count}} день",singularGenitive:"{{count}} дня",pluralGenitive:"{{count}} дней"}}),aboutXWeeks:_t({regular:{singularNominative:"около {{count}} недели",singularGenitive:"около {{count}} недель",pluralGenitive:"около {{count}} недель"},future:{singularNominative:"приблизительно через {{count}} неделю",singularGenitive:"приблизительно через {{count}} недели",pluralGenitive:"приблизительно через {{count}} недель"}}),xWeeks:_t({regular:{singularNominative:"{{count}} неделя",singularGenitive:"{{count}} недели",pluralGenitive:"{{count}} недель"}}),aboutXMonths:_t({regular:{singularNominative:"около {{count}} месяца",singularGenitive:"около {{count}} месяцев",pluralGenitive:"около {{count}} месяцев"},future:{singularNominative:"приблизительно через {{count}} месяц",singularGenitive:"приблизительно через {{count}} месяца",pluralGenitive:"приблизительно через {{count}} месяцев"}}),xMonths:_t({regular:{singularNominative:"{{count}} месяц",singularGenitive:"{{count}} месяца",pluralGenitive:"{{count}} месяцев"}}),aboutXYears:_t({regular:{singularNominative:"около {{count}} года",singularGenitive:"около {{count}} лет",pluralGenitive:"около {{count}} лет"},future:{singularNominative:"приблизительно через {{count}} год",singularGenitive:"приблизительно через {{count}} года",pluralGenitive:"приблизительно через {{count}} лет"}}),xYears:_t({regular:{singularNominative:"{{count}} год",singularGenitive:"{{count}} года",pluralGenitive:"{{count}} лет"}}),overXYears:_t({regular:{singularNominative:"больше {{count}} года",singularGenitive:"больше {{count}} лет",pluralGenitive:"больше {{count}} лет"},future:{singularNominative:"больше, чем через {{count}} год",singularGenitive:"больше, чем через {{count}} года",pluralGenitive:"больше, чем через {{count}} лет"}}),almostXYears:_t({regular:{singularNominative:"почти {{count}} год",singularGenitive:"почти {{count}} года",pluralGenitive:"почти {{count}} лет"},future:{singularNominative:"почти через {{count}} год",singularGenitive:"почти через {{count}} года",pluralGenitive:"почти через {{count}} лет"}})},LE=function(e,t,n){return VE[e](t,n)},FE={full:"EEEE, d MMMM y 'г.'",long:"d MMMM y 'г.'",medium:"d MMM y 'г.'",short:"dd.MM.y"},UE={full:"H:mm:ss zzzz",long:"H:mm:ss z",medium:"H:mm:ss",short:"H:mm"},BE={any:"{{date}}, {{time}}"},qE={date:Rn({formats:FE,defaultWidth:"full"}),time:Rn({formats:UE,defaultWidth:"full"}),dateTime:Rn({formats:BE,defaultWidth:"any"})},Ol=["воскресенье","понедельник","вторник","среду","четверг","пятницу","субботу"];function WE(r){var e=Ol[r];switch(r){case 0:return"'в прошлое "+e+" в' p";case 1:case 2:case 4:return"'в прошлый "+e+" в' p";case 3:case 5:case 6:return"'в прошлую "+e+" в' p"}}function lu(r){var e=Ol[r];return r===2?"'во "+e+" в' p":"'в "+e+" в' p"}function zE(r){var e=Ol[r];switch(r){case 0:return"'в следующее "+e+" в' p";case 1:case 2:case 4:return"'в следующий "+e+" в' p";case 3:case 5:case 6:return"'в следующую "+e+" в' p"}}var HE={lastWeek:function(e,t,n){var s=e.getUTCDay();return ou(e,t,n)?lu(s):WE(s)},yesterday:"'вчера в' p",today:"'сегодня в' p",tomorrow:"'завтра в' p",nextWeek:function(e,t,n){var s=e.getUTCDay();return ou(e,t,n)?lu(s):zE(s)},other:"P"},GE=function(e,t,n,s){var i=HE[e];return typeof i=="function"?i(t,n,s):i},KE={narrow:["до н.э.","н.э."],abbreviated:["до н. э.","н. э."],wide:["до нашей эры","нашей эры"]},QE={narrow:["1","2","3","4"],abbreviated:["1-й кв.","2-й кв.","3-й кв.","4-й кв."],wide:["1-й квартал","2-й квартал","3-й квартал","4-й квартал"]},YE={narrow:["Я","Ф","М","А","М","И","И","А","С","О","Н","Д"],abbreviated:["янв.","фев.","март","апр.","май","июнь","июль","авг.","сент.","окт.","нояб.","дек."],wide:["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"]},XE={narrow:["Я","Ф","М","А","М","И","И","А","С","О","Н","Д"],abbreviated:["янв.","фев.","мар.","апр.","мая","июн.","июл.","авг.","сент.","окт.","нояб.","дек."],wide:["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]},JE={narrow:["В","П","В","С","Ч","П","С"],short:["вс","пн","вт","ср","чт","пт","сб"],abbreviated:["вск","пнд","втр","срд","чтв","птн","суб"],wide:["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"]},ZE={narrow:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утро",afternoon:"день",evening:"веч.",night:"ночь"},abbreviated:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утро",afternoon:"день",evening:"веч.",night:"ночь"},wide:{am:"ДП",pm:"ПП",midnight:"полночь",noon:"полдень",morning:"утро",afternoon:"день",evening:"вечер",night:"ночь"}},e1={narrow:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утра",afternoon:"дня",evening:"веч.",night:"ночи"},abbreviated:{am:"ДП",pm:"ПП",midnight:"полн.",noon:"полд.",morning:"утра",afternoon:"дня",evening:"веч.",night:"ночи"},wide:{am:"ДП",pm:"ПП",midnight:"полночь",noon:"полдень",morning:"утра",afternoon:"дня",evening:"вечера",night:"ночи"}},t1=function(e,t){var n=Number(e),s=t==null?void 0:t.unit,i;return s==="date"?i="-е":s==="week"||s==="minute"||s==="second"?i="-я":i="-й",n+i},r1={ordinalNumber:t1,era:Ht({values:KE,defaultWidth:"wide"}),quarter:Ht({values:QE,defaultWidth:"wide",argumentCallback:function(e){return e-1}}),month:Ht({values:YE,defaultWidth:"wide",formattingValues:XE,defaultFormattingWidth:"wide"}),day:Ht({values:JE,defaultWidth:"wide"}),dayPeriod:Ht({values:ZE,defaultWidth:"any",formattingValues:e1,defaultFormattingWidth:"wide"})},n1=/^(\d+)(-?(е|я|й|ое|ье|ая|ья|ый|ой|ий|ый))?/i,s1=/\d+/i,a1={narrow:/^((до )?н\.?\s?э\.?)/i,abbreviated:/^((до )?н\.?\s?э\.?)/i,wide:/^(до нашей эры|нашей эры|наша эра)/i},i1={any:[/^д/i,/^н/i]},o1={narrow:/^[1234]/i,abbreviated:/^[1234](-?[ыои]?й?)? кв.?/i,wide:/^[1234](-?[ыои]?й?)? квартал/i},l1={any:[/1/i,/2/i,/3/i,/4/i]},c1={narrow:/^[яфмаисонд]/i,abbreviated:/^(янв|фев|март?|апр|ма[йя]|июн[ья]?|июл[ья]?|авг|сент?|окт|нояб?|дек)\.?/i,wide:/^(январ[ья]|феврал[ья]|марта?|апрел[ья]|ма[йя]|июн[ья]|июл[ья]|августа?|сентябр[ья]|октябр[ья]|октябр[ья]|ноябр[ья]|декабр[ья])/i},d1={narrow:[/^я/i,/^ф/i,/^м/i,/^а/i,/^м/i,/^и/i,/^и/i,/^а/i,/^с/i,/^о/i,/^н/i,/^я/i],any:[/^я/i,/^ф/i,/^мар/i,/^ап/i,/^ма[йя]/i,/^июн/i,/^июл/i,/^ав/i,/^с/i,/^о/i,/^н/i,/^д/i]},u1={narrow:/^[впсч]/i,short:/^(вс|во|пн|по|вт|ср|чт|че|пт|пя|сб|су)\.?/i,abbreviated:/^(вск|вос|пнд|пон|втр|вто|срд|сре|чтв|чет|птн|пят|суб).?/i,wide:/^(воскресень[ея]|понедельника?|вторника?|сред[аы]|четверга?|пятниц[аы]|суббот[аы])/i},h1={narrow:[/^в/i,/^п/i,/^в/i,/^с/i,/^ч/i,/^п/i,/^с/i],any:[/^в[ос]/i,/^п[он]/i,/^в/i,/^ср/i,/^ч/i,/^п[ят]/i,/^с[уб]/i]},m1={narrow:/^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,abbreviated:/^([дп]п|полн\.?|полд\.?|утр[оа]|день|дня|веч\.?|ноч[ьи])/i,wide:/^([дп]п|полночь|полдень|утр[оа]|день|дня|вечера?|ноч[ьи])/i},g1={any:{am:/^дп/i,pm:/^пп/i,midnight:/^полн/i,noon:/^полд/i,morning:/^у/i,afternoon:/^д[ен]/i,evening:/^в/i,night:/^н/i}},f1={ordinalNumber:Km({matchPattern:n1,parsePattern:s1,valueCallback:function(e){return parseInt(e,10)}}),era:Gt({matchPatterns:a1,defaultMatchWidth:"wide",parsePatterns:i1,defaultParseWidth:"any"}),quarter:Gt({matchPatterns:o1,defaultMatchWidth:"wide",parsePatterns:l1,defaultParseWidth:"any",valueCallback:function(e){return e+1}}),month:Gt({matchPatterns:c1,defaultMatchWidth:"wide",parsePatterns:d1,defaultParseWidth:"any"}),day:Gt({matchPatterns:u1,defaultMatchWidth:"wide",parsePatterns:h1,defaultParseWidth:"any"}),dayPeriod:Gt({matchPatterns:m1,defaultMatchWidth:"wide",parsePatterns:g1,defaultParseWidth:"any"})},p1={code:"ru",formatDistance:LE,formatLong:qE,formatRelative:GE,localize:r1,match:f1,options:{weekStartsOn:1,firstWeekContainsDate:1}};const oe=(r,e="dd.MM.yyyy")=>{const t=typeof r=="string"?dn(r):r;return Qm(t,e,{locale:p1})},Xs=(r=new Date)=>{const e=f_(r,{weekStartsOn:1}),t=w_(r,{weekStartsOn:1});return{start:e,end:t}},Vl=(r=new Date)=>{const{start:e,end:t}=Xs(r);return v_({start:e,end:t})},Xm=r=>{const e=new Date,t=new Date(e);t.setHours(0,0,0,0),t.setDate(t.getDate()-(r-1));const n=new Date(e);return n.setHours(23,59,59,999),{start:t,end:n}},x1=(r,e)=>{const t=typeof r=="string"?dn(r):r,n=typeof e=="string"?dn(e):e;return x_(t,n)},Ni=r=>r.reduce((e,t)=>{const[n,s]=t.start.split(":").map(Number),[i,l]=t.end.split(":").map(Number),c=n*60+s;let h=(i*60+l-c)/60;if((h<0||t.endDate)&&(h+=24),t.breaks&&t.breaks.length>0){const g=t.breaks.reduce((x,p)=>{const[T,j]=p.start.split(":").map(Number),[E,I]=p.end.split(":").map(Number),D=T*60+j;let C=(E*60+I-D)/60;return C<0&&(C+=24),x+C},0);h-=g}return e+h},0),Rr=r=>{const[e,t]=r.split(":").map(Number);return e*60+t},Jm=(r,e)=>{if(!r||!e)return[];const t=dn(r),n=dn(e);if(_E(n,t))return[];const s=[],i=new Date(t);for(;i<=n;)s.push(oe(i,"yyyy-MM-dd")),i.setDate(i.getDate()+1);return s},Zm=r=>{const e=Array.from(new Set(r.filter(Boolean)));return e.sort(),e},y1=(r,e)=>{const t=Rr(r.start),n=Rr(r.end),s=Rr(e.start),i=Rr(e.end);return t<i&&n>s},Do=()=>{const r=new Date,e=3*60,t=r.getTimezoneOffset();return new Date(r.getTime()+(e+t)*60*1e3)},cu=(r,e=Do())=>{const t=e.getHours(),n=new Date(`${Qm(e,"yyyy-MM-dd")}T${r}:00`);return t>=21||e>n},b1=r=>{const e=Math.floor(r),t=Math.round((r-e)*60);return e===0&&t===0?"0ч":e===0?`${t}м`:t===0?`${e}ч`:`${e}ч ${t}м`},Pn=(r,e,t,n)=>{const s=r,i=e||r;if(i<t||s>n)return 0;const l=s>t?s:t,c=i<n?i:n,d=dn(l),g=dn(c).getTime()-d.getTime();return Math.floor(g/(1e3*60*60*24))+1},v1=({selectedUserId:r,slotFilter:e,onEditSlot:t,onEditStatus:n})=>{const{theme:s}=Ve(),{user:i}=nt(),{isAdmin:l}=yt(),[c,d]=A.useState([]),[h,g]=A.useState([]),[x,p]=A.useState(new Date),[T,j]=A.useState(!0),E=Vl(x),I=r?ve.filter(N=>N.id===r):ve;A.useEffect(()=>{D()},[r,x]),A.useEffect(()=>{const N=()=>{D()};return window.addEventListener("focus",N),()=>window.removeEventListener("focus",N)},[]);const D=async()=>{j(!0);try{const N=new Date(E[0]);N.setHours(0,0,0,0);const f=new Date(E[6]);f.setHours(23,59,59,999);const O=oe(N,"yyyy-MM-dd"),Q=oe(f,"yyyy-MM-dd"),[P,$]=await Promise.all([br(),hr()]),K=P.filter(q=>q.date>=O&&q.date<=Q),H=$.filter(q=>{const W=q.date,le=q.endDate||q.date;return W<=Q&&le>=O}),Z=r?K.filter(q=>q.userId===r):K,ce=r?H.filter(q=>q.userId===r):H;console.log("Loaded slots:",{weekStart:O,weekEnd:Q,allSlotsCount:P.length,weekSlotsCount:K.length,filteredSlotsCount:Z.length,selectedUserId:r}),d(Z),g(ce)}catch(N){console.error("Error loading data:",N)}finally{j(!1)}},S=async N=>{var f;if(!l&&(i==null?void 0:i.id)!==((f=c.find(O=>O.id===N))==null?void 0:f.userId)){alert("Только администратор может удалять чужие слоты");return}confirm("Удалить слот?")&&(await Ml(N),D())},C=async N=>{var f;if(!l&&(i==null?void 0:i.id)!==((f=h.find(O=>O.id===N))==null?void 0:f.userId)){alert("Только администратор может удалять чужие статусы");return}confirm("Удалить статус?")&&(await Om(N),D())},F=N=>{const f=new Date;f.setHours(0,0,0,0);const O=new Date(N.date);if(O.setHours(0,0,0,0),O>f)return!0;if(O.getTime()===f.getTime()){const P=new Date,$=P.getHours()*60+P.getMinutes();return N.slots.some(K=>{if(K.endDate){const q=new Date(K.endDate);if(q.setHours(0,0,0,0),new Date(f).setHours(23,59,59),q>f)return!0;if(q.getTime()===f.getTime()){const[le,Ee]=K.end.split(":").map(Number);return le*60+Ee>$}return!1}const[H,Z]=K.end.split(":").map(Number);return H*60+Z>$})}return N.slots.some(P=>{if(P.endDate){const $=new Date(P.endDate);return $.setHours(0,0,0,0),$>=f}return!1})},ne=(N,f)=>{const O=c.find(Q=>Q.userId===N&&Q.date===f)||null;if(O&&e!=="all"){const Q=F(O);if(e==="upcoming"&&!Q||e==="completed"&&Q)return null}return O},B=(N,f)=>h.find(O=>O.userId!==N?!1:O.endDate?O.date<=f&&O.endDate>=f:O.date===f)||null,_=N=>{const O=c.filter(H=>H.userId===N).reduce((H,Z)=>H+Ni(Z.slots),0),Q=h.filter(H=>H.userId===N),P=Q.filter(H=>H.type==="dayoff").length,$=Q.filter(H=>H.type==="sick").length,K=Q.filter(H=>H.type==="vacation").length;return{totalHours:O,daysOff:P,sickDays:$,vacationDays:K}},y=N=>{const f=new Date(x);N==="prev"?f.setDate(f.getDate()-7):f.setDate(f.getDate()+7),p(f)};if(T)return a.jsx("div",{className:`rounded-lg p-8 text-center ${s==="dark"?"bg-[#1a1a1a]":"bg-white"}`,children:a.jsx("p",{className:s==="dark"?"text-gray-400":"text-gray-600",children:"Загрузка..."})});const b=s==="dark"?"text-white":"text-gray-900",w=s==="dark"?"text-gray-300":"text-gray-600",k={dayoff:"bg-teal-100 text-teal-900 border border-teal-200 dark:bg-teal-900/40 dark:text-teal-100 dark:border-teal-800",sick:"bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-700",vacation:"bg-sky-100 text-sky-900 border border-sky-200 dark:bg-sky-900/40 dark:text-sky-100 dark:border-sky-800"};return a.jsxs("div",{className:`rounded-lg ${s==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-md overflow-hidden`,children:[a.jsxs("div",{className:`p-4 border-b ${s==="dark"?"border-gray-800":"border-gray-200"} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r ${s==="dark"?"from-[#0f172a] via-[#0b1323] to-[#0f172a]":"from-green-50 via-white to-green-50"}`,children:[a.jsx("button",{onClick:()=>y("prev"),className:"w-full sm:w-auto px-3 py-2 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors",children:"← Предыдущая неделя"}),a.jsxs("span",{className:`${b} font-semibold text-center text-sm sm:text-base`,children:[oe(E[0],"dd.MM.yyyy")," - ",oe(E[6],"dd.MM.yyyy")]}),a.jsx("button",{onClick:()=>y("next"),className:"w-full sm:w-auto px-3 py-2 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors",children:"Следующая неделя →"})]}),a.jsx("div",{className:"overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8",children:a.jsx("div",{className:"min-w-full inline-block align-middle",children:a.jsxs("table",{className:"w-full min-w-[640px]",children:[a.jsx("thead",{className:"sticky top-0 z-30",children:a.jsxs("tr",{className:`${s==="dark"?"bg-[#0f172a]":"bg-gray-50"} shadow-sm`,children:[a.jsx("th",{className:`px-2 sm:px-3 md:px-4 py-3 text-left text-xs sm:text-sm font-semibold ${b} sticky left-0 z-30 ${s==="dark"?"bg-[#0f172a]":"bg-gray-50"}`,children:"Участник"}),E.map(N=>a.jsx("th",{className:"px-1.5 sm:px-2 md:px-3 lg:px-4 py-3",children:a.jsxs("div",{className:`mx-auto w-full max-w-[110px] rounded-xl border ${s==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"} shadow-sm text-center`,children:[a.jsx("div",{className:"text-[10px] sm:text-xs opacity-70",children:oe(N,"EEE")}),a.jsx("div",{className:"text-sm font-semibold",children:oe(N,"dd.MM")})]})},N.toISOString())),a.jsx("th",{className:`px-2 sm:px-3 md:px-4 py-3 text-center text-xs sm:text-sm font-bold ${b} whitespace-nowrap`,children:"Итог"})]})}),a.jsx("tbody",{children:I.map((N,f)=>{const O=_(N.id),Q=f%2===0;return a.jsxs("tr",{className:`
                    group border-b transition-all duration-300 relative
                    ${s==="dark"?"border-gray-800/30":"border-gray-200/30"}
                    ${Q?s==="dark"?"bg-gradient-to-r from-[#1a1a1a]/40 via-[#1a1a1a]/20 to-transparent hover:from-[#1a1a1a]/70 hover:via-[#1a1a1a]/50 hover:shadow-lg hover:shadow-#4E6E49/10":"bg-gradient-to-r from-gray-50/70 via-gray-50/40 to-transparent hover:from-gray-100/90 hover:via-gray-100/70 hover:shadow-lg hover:shadow-#4E6E49/5":s==="dark"?"bg-gradient-to-r from-[#1a1a1a]/10 via-[#1a1a1a]/5 to-transparent hover:from-[#1a1a1a]/50 hover:via-[#1a1a1a]/30 hover:shadow-lg hover:shadow-#4E6E49/10":"bg-gradient-to-r from-white via-gray-50/30 to-transparent hover:from-gray-50 hover:via-gray-50/60 hover:shadow-lg hover:shadow-#4E6E49/5"}
                    hover:scale-[1.01] hover:-translate-y-0.5
                  `,children:[a.jsx("td",{className:`px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 font-semibold text-xs sm:text-sm ${b} sticky left-0 z-10 transition-all duration-300 backdrop-blur-sm min-w-[140px] sm:min-w-[160px] ${Q?s==="dark"?"bg-gradient-to-r from-[#1a1a1a]/40 via-[#1a1a1a]/20 to-transparent group-hover:from-[#1a1a1a]/70 group-hover:via-[#1a1a1a]/50":"bg-gradient-to-r from-gray-50/70 via-gray-50/40 to-transparent group-hover:from-gray-100/90 group-hover:via-gray-100/70":s==="dark"?"bg-gradient-to-r from-[#1a1a1a]/10 via-[#1a1a1a]/5 to-transparent group-hover:from-[#1a1a1a]/50 group-hover:via-[#1a1a1a]/30":"bg-gradient-to-r from-white via-gray-50/30 to-transparent group-hover:from-gray-50 group-hover:via-gray-50/60"}`,children:a.jsxs("div",{className:"flex items-center gap-2 sm:gap-3",children:[a.jsxs("div",{className:"relative flex-shrink-0 group/avatar",children:[N.avatar?a.jsx("img",{src:N.avatar,alt:N.name,className:"w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-#4E6E49/30 ring-2 ring-transparent group-hover:ring-#4E6E49/50",style:{borderColor:s==="dark"?"rgba(34, 197, 94, 0.6)":"rgba(34, 197, 94, 0.4)"},onError:P=>{const $=P.target;$.style.display="none";const K=$.nextElementSibling;K&&(K.style.display="flex")}}):null,a.jsx("div",{className:`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg ring-2 ring-transparent group-hover/avatar:scale-110 group-hover/avatar:shadow-xl group-hover/avatar:ring-#4E6E49/50 ${s==="dark"?"bg-gradient-to-br from-[#4E6E49] via-[#4E6E49] to-blue-500 text-white group-hover/avatar:shadow-#4E6E49/40":"bg-gradient-to-br from-[#4E6E49] via-[#4E6E49] to-blue-400 text-white group-hover/avatar:shadow-#4E6E49/40"} ${N.avatar?"absolute inset-0 hidden":""}`,children:N.name.charAt(0).toUpperCase()}),a.jsx("div",{className:"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-[#4E6E49] rounded-full border border-white sm:border-2 shadow-lg animate-pulse opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"})]}),a.jsx("span",{className:"font-semibold group-hover:text-[#4E6E49] transition-colors duration-300 truncate hidden sm:inline",children:N.name}),a.jsx("span",{className:"font-semibold group-hover:text-[#4E6E49] transition-colors duration-300 sm:hidden",children:(N.name.split(" ")[0]||N.name).substring(0,8)})]})}),E.map(P=>{const $=oe(P,"yyyy-MM-dd"),K=ne(N.id,$),H=B(N.id,$);return a.jsx("td",{className:"px-1 sm:px-2 py-2 sm:py-3 text-center border-l border-r border-transparent hover:border-blue-500/20 transition-colors min-w-[80px] sm:min-w-[100px]",children:K?a.jsxs("div",{className:"space-y-2",children:[(()=>{const Z=F(K),ce=Z?"bg-gradient-to-r from-emerald-500 to-teal-600":"bg-gradient-to-r from-slate-500 to-slate-700",W=Z?mr:Vo;return K.slots.map((le,Ee)=>a.jsxs("div",{className:"space-y-1",children:[a.jsx("div",{className:`${ce} text-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${Z?"hover:shadow-emerald-500/40 ring-2 ring-emerald-400/40":"hover:shadow-slate-500/40 ring-2 ring-slate-400/40"}`,children:a.jsxs("div",{className:"flex items-center justify-center gap-0.5 sm:gap-1 flex-wrap",children:[a.jsx(W,{className:"w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse flex-shrink-0"}),a.jsxs("span",{className:"whitespace-nowrap",children:[le.start," - ",le.end]}),le.endDate&&a.jsxs("span",{className:"text-[9px] sm:text-[10px] opacity-90 whitespace-nowrap",children:["(до ",oe(new Date(le.endDate),"dd.MM"),")"]})]})}),le.breaks&&le.breaks.length>0&&a.jsxs("div",{className:"space-y-1",children:[a.jsx("div",{className:`text-[10px] ${s==="dark"?"text-gray-400":"text-gray-600"} font-medium`,children:"Перерывы:"}),le.breaks.map((L,V)=>a.jsx("div",{className:`${s==="dark"?"bg-gray-700/90":"bg-white"} ${s==="dark"?"text-gray-200":"text-gray-900"} border-2 ${s==="dark"?"border-orange-500/50":"border-orange-300"} rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${s==="dark"?"hover:border-orange-400/70 hover:shadow-orange-500/20":"hover:border-orange-400 hover:shadow-orange-400/20"}`,children:a.jsxs("span",{className:"flex items-center gap-0.5 sm:gap-1 justify-center flex-wrap",children:[a.jsx("span",{className:"w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-orange-500 flex-shrink-0"}),a.jsxs("span",{className:"whitespace-nowrap",children:[L.start," - ",L.end]})]})},V))]})]},Ee))})(),K.comment&&a.jsxs("div",{className:"flex items-center justify-center group relative",children:[a.jsx(Ut,{className:"w-4 h-4 text-gray-400 cursor-help"}),a.jsx("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10",children:K.comment})]}),a.jsx("div",{className:"flex gap-1 justify-center",children:l||(N==null?void 0:N.id)===K.userId?a.jsxs(a.Fragment,{children:[a.jsx("button",{onClick:()=>t(K),className:"p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded",children:a.jsx($t,{className:"w-3 h-3"})}),a.jsx("button",{onClick:()=>S(K.id),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded",children:a.jsx(Et,{className:"w-3 h-3"})})]}):a.jsxs(a.Fragment,{children:[a.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете редактировать только свои слоты",children:a.jsx($t,{className:"w-3 h-3"})}),a.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете удалять только свои слоты",children:a.jsx(Et,{className:"w-3 h-3"})})]})})]}):H?a.jsxs("div",{className:"space-y-1",children:[a.jsx("div",{className:`rounded px-2 py-1 text-xs font-semibold ${k[H.type]}`,children:H.type==="dayoff"?"Выходной":H.type==="sick"?"Больничный":"Отпуск"}),H.comment&&a.jsxs("div",{className:"flex items-center justify-center group relative",children:[a.jsx(Ut,{className:"w-4 h-4 text-gray-400 cursor-help"}),a.jsx("div",{className:"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10",children:H.comment})]}),a.jsx("div",{className:"flex gap-1 justify-center",children:l||(N==null?void 0:N.id)===H.userId?a.jsxs(a.Fragment,{children:[a.jsx("button",{onClick:()=>n(H),className:"p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded",children:a.jsx($t,{className:"w-3 h-3"})}),a.jsx("button",{onClick:()=>C(H.id),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded",children:a.jsx(Et,{className:"w-3 h-3"})})]}):a.jsxs(a.Fragment,{children:[a.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете редактировать только свои статусы",children:a.jsx($t,{className:"w-3 h-3"})}),a.jsx("button",{disabled:!0,className:"p-1 text-gray-400 cursor-not-allowed rounded",title:"Вы можете удалять только свои статусы",children:a.jsx(Et,{className:"w-3 h-3"})})]})})]}):a.jsx("span",{className:`text-sm ${w}`,children:"—"})},$)}),a.jsx("td",{className:`px-4 py-3 text-sm ${b}`,children:a.jsxs("div",{className:"space-y-1",children:[a.jsxs("div",{children:["Часов: ",O.totalHours.toFixed(1)]}),a.jsxs("div",{children:["Выходных: ",O.daysOff]}),a.jsxs("div",{children:["Больничных: ",O.sickDays]}),a.jsxs("div",{children:["Отпусков: ",O.vacationDays]})]})})]},N.id)})})]})})})]})},w1=({selectedUserId:r,slotFilter:e,onEditSlot:t,onEditStatus:n})=>{const{theme:s}=Ve(),{user:i}=nt(),{isAdmin:l}=yt(),[c,d]=A.useState([]),[h,g]=A.useState([]),[x,p]=A.useState(new Date),[T,j]=A.useState(!0),E=Vl(x);A.useEffect(()=>{I()},[r,x]),A.useEffect(()=>{const w=()=>{I()};return window.addEventListener("focus",w),()=>window.removeEventListener("focus",w)},[]);const I=async()=>{j(!0);try{const w=new Date(E[0]);w.setHours(0,0,0,0);const k=new Date(E[6]);k.setHours(23,59,59,999);const N=oe(w,"yyyy-MM-dd"),f=oe(k,"yyyy-MM-dd"),[O,Q]=await Promise.all([br(),hr()]),P=O.filter(Z=>Z.date>=N&&Z.date<=f),$=Q.filter(Z=>{const ce=Z.date,q=Z.endDate||Z.date;return ce<=f&&q>=N}),K=r?P.filter(Z=>Z.userId===r):P,H=r?$.filter(Z=>Z.userId===r):$;console.log("Loaded slots (week view):",{weekStart:N,weekEnd:f,allSlotsCount:O.length,weekSlotsCount:P.length,filteredSlotsCount:K.length,selectedUserId:r}),d(K),g(H)}catch(w){console.error("Error loading data:",w)}finally{j(!1)}},D=async w=>{var k;if(!l&&(i==null?void 0:i.id)!==((k=c.find(N=>N.id===w))==null?void 0:k.userId)){alert("Только администратор может удалять чужие слоты");return}confirm("Удалить слот?")&&(await Ml(w),I())},S=async w=>{var k;if(!l&&(i==null?void 0:i.id)!==((k=h.find(N=>N.id===w))==null?void 0:k.userId)){alert("Только администратор может удалять чужие статусы");return}confirm("Удалить статус?")&&(await Om(w),I())},C=w=>{const k=new Date;k.setHours(0,0,0,0);const N=new Date(w.date);if(N.setHours(0,0,0,0),N>k)return!0;if(N.getTime()===k.getTime()){const O=new Date,Q=O.getHours()*60+O.getMinutes();return w.slots.some(P=>{if(P.endDate){const Z=new Date(P.endDate);if(Z.setHours(0,0,0,0),new Date(k).setHours(23,59,59),Z>k)return!0;if(Z.getTime()===k.getTime()){const[q,W]=P.end.split(":").map(Number);return q*60+W>Q}return!1}const[$,K]=P.end.split(":").map(Number);return $*60+K>Q})}return w.slots.some(O=>{if(O.endDate){const Q=new Date(O.endDate);return Q.setHours(0,0,0,0),Q>=k}return!1})},F=w=>{let k=c.filter(N=>N.date===w);return e!=="all"&&(k=k.filter(N=>{const f=C(N);return e==="upcoming"?f:e==="completed"?!f:!0})),k},ne=w=>h.filter(k=>k.endDate?k.date<=w&&k.endDate>=w:k.date===w),B=w=>{const k=new Date(x);w==="prev"?k.setDate(k.getDate()-7):k.setDate(k.getDate()+7),p(k)};if(T)return a.jsx("div",{className:`rounded-lg p-8 text-center ${s==="dark"?"bg-[#1a1a1a]":"bg-white"}`,children:a.jsx("p",{className:s==="dark"?"text-gray-400":"text-gray-600",children:"Загрузка..."})});const _=s==="dark"?"text-white":"text-gray-900",y=s==="dark"?"text-gray-400":"text-gray-600",b={dayoff:"bg-teal-100 text-teal-900 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-100 dark:border-teal-800",sick:"bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-700",vacation:"bg-sky-100 text-sky-900 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-100 dark:border-sky-800"};return a.jsxs("div",{className:`rounded-lg ${s==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-md overflow-hidden`,children:[a.jsxs("div",{className:`p-3 sm:p-4 border-b ${s==="dark"?"border-gray-800":"border-gray-200"} flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between`,children:[a.jsx("button",{onClick:()=>B("prev"),className:"w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors touch-manipulation active:scale-95",children:"← Предыдущая неделя"}),a.jsxs("span",{className:`${_} font-semibold text-center text-xs sm:text-sm md:text-base whitespace-nowrap`,children:[oe(E[0],"dd.MM.yyyy")," - ",oe(E[6],"dd.MM.yyyy")]}),a.jsx("button",{onClick:()=>B("next"),className:"w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors touch-manipulation active:scale-95",children:"Следующая неделя →"})]}),a.jsx("div",{className:"p-3 sm:p-4 space-y-3 sm:space-y-4",children:E.map(w=>{const k=oe(w,"yyyy-MM-dd"),N=F(k),f=ne(k);return a.jsxs("div",{className:`rounded-xl p-4 sm:p-5 border ${s==="dark"?"bg-gray-800/70 border-gray-700":"bg-gray-50 border-gray-200"}`,children:[a.jsx("h3",{className:`text-lg font-semibold mb-3 ${_}`,children:oe(w,"dd.MM.yyyy")}),a.jsxs("div",{className:"space-y-3 sm:space-y-4",children:[f.map(O=>{const P=ve.find(K=>K.id===O.userId)||ve.find(K=>({artyom:"1",adel:"2",kseniya:"3",olga:"4",anastasia:"5"})[O.userId]===K.id),$=(P==null?void 0:P.name)||O.userId;return a.jsxs("div",{className:`group relative flex items-center justify-between p-4 rounded-xl shadow-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl backdrop-blur ${b[O.type]}`,children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"font-semibold",children:$}),a.jsx("span",{className:"text-sm",children:O.type==="dayoff"?"Выходной":O.type==="sick"?"Больничный":"Отпуск"}),O.comment&&a.jsxs("div",{className:"relative group",children:[a.jsx(Ut,{className:"w-4 h-4 text-current cursor-help"}),a.jsx("div",{className:"absolute bottom-full left-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap",children:O.comment})]})]}),a.jsx("div",{className:"flex gap-2",children:l||(i==null?void 0:i.id)===O.userId?a.jsxs(a.Fragment,{children:[a.jsx("button",{onClick:()=>n(O),className:`p-1 rounded transition-colors ${s==="dark"?"bg-white/10 hover:bg-white/20 text-white":"bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`,children:a.jsx($t,{className:"w-4 h-4 text-current"})}),a.jsx("button",{onClick:()=>S(O.id),className:`p-1 rounded transition-colors ${s==="dark"?"bg-white/10 hover:bg-white/20 text-white":"bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`,children:a.jsx(Et,{className:"w-4 h-4 text-current"})})]}):a.jsxs(a.Fragment,{children:[a.jsx("button",{disabled:!0,className:`p-1 cursor-not-allowed rounded ${s==="dark"?"bg-white/5 text-white/60":"bg-gray-100 text-gray-400 border border-gray-200"}`,title:"Вы можете редактировать только свои статусы",children:a.jsx($t,{className:"w-4 h-4 text-current opacity-60"})}),a.jsx("button",{disabled:!0,className:`p-1 cursor-not-allowed rounded ${s==="dark"?"bg-white/5 text-white/60":"bg-gray-100 text-gray-400 border border-gray-200"}`,title:"Вы можете удалять только свои статусы",children:a.jsx(Et,{className:"w-4 h-4 text-current opacity-60"})})]})})]},O.id)}),N.map(O=>{const P=ve.find(ce=>ce.id===O.userId)||ve.find(ce=>({artyom:"1",adel:"2",kseniya:"3",olga:"4",anastasia:"5"})[O.userId]===ce.id),$=(P==null?void 0:P.name)||O.userId,K=C(O),H=K?"bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300/40":"bg-gradient-to-r from-slate-500 to-slate-700 border-slate-300/40",Z=K?mr:Vo;return a.jsxs("div",{className:`group relative space-y-2 sm:space-y-3 p-3 sm:p-4 ${H} rounded-lg sm:rounded-xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl active:scale-[0.98] sm:hover:scale-[1.03] mb-2 sm:mb-3 ${K?"hover:border-emerald-200/80 ring-2 ring-emerald-200/40 hover:ring-4 hover:ring-emerald-200/60":"hover:border-slate-200/80 ring-2 ring-slate-200/40 hover:ring-4 hover:ring-slate-200/60"}`,children:[a.jsxs("div",{className:"flex items-center justify-between border-b border-white/20 pb-2 sm:pb-3",children:[a.jsxs("div",{className:"flex items-center gap-2 sm:gap-3 min-w-0 flex-1",children:[a.jsxs("div",{className:"relative flex-shrink-0 group/avatar",children:[P!=null&&P.avatar?a.jsx("img",{src:P.avatar,alt:$,className:`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover border-2 shadow-xl transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:shadow-2xl ${K?"border-white/50 ring-2 ring-white/40 ring-offset-2 ring-offset-emerald-400/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/60":"border-white/40 ring-2 ring-white/30 ring-offset-2 ring-offset-slate-400/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/50"}`,onError:ce=>{const q=ce.target;q.style.display="none";const W=q.nextElementSibling;W&&(W.style.display="flex")}}):null,a.jsx("div",{className:`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-xl group-hover/avatar:scale-110 group-hover/avatar:shadow-2xl ${K?"bg-white/25 backdrop-blur-md border-2 border-white/40 ring-2 ring-white/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/60":"bg-white/15 backdrop-blur-md border-2 border-white/30 ring-2 ring-white/20 group-hover/avatar:ring-4 group-hover/avatar:ring-white/50"} ${P!=null&&P.avatar?"absolute inset-0 hidden":""}`,children:$.charAt(0).toUpperCase()}),a.jsx("div",{className:`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full border border-white sm:border-2 shadow-lg animate-pulse opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 ${K?"bg-emerald-300":"bg-slate-400"}`})]}),a.jsx("span",{className:"text-white font-bold text-sm sm:text-base group-hover:scale-105 transition-transform duration-300 truncate",children:$})]}),a.jsx("div",{className:"flex gap-2",children:l||(i==null?void 0:i.id)===O.userId?a.jsxs(a.Fragment,{children:[a.jsx("button",{onClick:()=>t(O),className:"p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors",children:a.jsx($t,{className:"w-4 h-4 text-white"})}),a.jsx("button",{onClick:()=>D(O.id),className:"p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors",children:a.jsx(Et,{className:"w-4 h-4 text-white"})})]}):a.jsxs(a.Fragment,{children:[a.jsx("button",{disabled:!0,className:"p-1.5 bg-white/10 cursor-not-allowed rounded-lg",title:"Вы можете редактировать только свои слоты",children:a.jsx($t,{className:"w-4 h-4 text-white/50"})}),a.jsx("button",{disabled:!0,className:"p-1.5 bg-white/10 cursor-not-allowed rounded-lg",title:"Вы можете удалять только свои слоты",children:a.jsx(Et,{className:"w-4 h-4 text-white/50"})})]})})]}),a.jsxs("div",{className:"space-y-2",children:[O.slots.map((ce,q)=>a.jsxs("div",{className:"space-y-1.5",children:[a.jsx("div",{className:`bg-white/25 backdrop-blur-md rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${K?"border-white/40 ring-2 ring-white/20 hover:border-white/60 hover:ring-4 hover:ring-white/40":"border-white/30 ring-2 ring-white/10 hover:border-white/50 hover:ring-4 hover:ring-white/30"}`,children:a.jsxs("div",{className:"flex items-center gap-1.5 sm:gap-2 flex-wrap",children:[a.jsx(Z,{className:`w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0 ${K?"animate-pulse":""}`}),a.jsxs("span",{className:"text-white font-bold text-xs sm:text-sm whitespace-nowrap",children:[ce.start," - ",ce.end]}),ce.endDate&&a.jsxs("span",{className:"text-white/80 font-medium text-[10px] sm:text-xs whitespace-nowrap",children:["(до ",oe(new Date(ce.endDate),"dd.MM"),")"]})]})}),ce.breaks&&ce.breaks.length>0&&a.jsxs("div",{className:"space-y-1 ml-6",children:[a.jsx("div",{className:`text-[10px] ${s==="dark"?"text-gray-300":"text-gray-700"} font-medium`,children:"Перерывы:"}),ce.breaks.map((W,le)=>a.jsx("div",{className:`${s==="dark"?"bg-gray-700/95":"bg-white"} ${s==="dark"?"text-gray-200":"text-gray-900"} border-2 ${s==="dark"?"border-orange-500/60":"border-orange-300"} rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${s==="dark"?"hover:border-orange-400/80 hover:shadow-orange-500/30 ring-2 ring-orange-500/20 hover:ring-4 hover:ring-orange-400/40":"hover:border-orange-400 hover:shadow-orange-400/30 ring-2 ring-orange-300/20 hover:ring-4 hover:ring-orange-300/40"}`,children:a.jsxs("span",{className:"flex items-center gap-1 sm:gap-1.5 justify-center flex-wrap",children:[a.jsx("span",{className:`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${s==="dark"?"bg-orange-400":"bg-orange-500"} animate-pulse flex-shrink-0`}),a.jsxs("span",{className:"whitespace-nowrap",children:[W.start," - ",W.end]})]})},le))]})]},q)),O.comment&&a.jsxs("div",{className:"relative group flex items-center gap-2 pt-2",children:[a.jsx(Ut,{className:"w-4 h-4 text-white cursor-help"}),a.jsx("div",{className:"absolute bottom-full left-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap",children:O.comment})]})]})]},O.id)}),N.length===0&&f.length===0&&a.jsx("p",{className:`text-sm ${y}`,children:"Нет данных"})]})]},k)})})]})},_1=({slot:r,onClose:e,onSave:t})=>{var yn;const{user:n}=nt(),{theme:s}=Ve(),{isAdmin:i}=yt(),l=s==="dark"?"text-white":"text-gray-900",c=(r==null?void 0:r.date)||oe(new Date,"yyyy-MM-dd"),[d,h]=A.useState(c),[g,x]=A.useState(r!=null&&r.userId?[r.userId]:n!=null&&n.id?[n.id]:[]),[p,T]=A.useState(((yn=r==null?void 0:r.slots)==null?void 0:yn.map(U=>{const ae=U;return ae.break&&!ae.breaks?{...U,breaks:[ae.break]}:U}))||[]),[j,E]=A.useState(""),[I,D]=A.useState(""),[S,C]=A.useState(!1),[F,ne]=A.useState(""),[B,_]=A.useState(""),[y,b]=A.useState(""),[w,k]=A.useState(null),[N,f]=A.useState(null),[O,Q]=A.useState(null),[P,$]=A.useState((r==null?void 0:r.comment)||""),[K,H]=A.useState(!1),[Z,ce]=A.useState([]),[q,W]=A.useState(!1),[le,Ee]=A.useState([]),[L,V]=A.useState("single"),[X,se]=A.useState(c),[J,z]=A.useState(c),[ee,ke]=A.useState(c),[pe,Ne]=A.useState([]),[Xe,ie]=A.useState(""),[re,Fe]=A.useState(!1),Je=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],Ge=i&&!r;A.useEffect(()=>{console.log("SlotForm mounted, user:",n==null?void 0:n.name,"slots count:",p.length)},[]),A.useEffect(()=>{if(K&&d){const U=new Date(d),ae=U.getDay()===0?6:U.getDay()-1;ce([ae])}},[K,d]),A.useEffect(()=>{L!=="single"&&(H(!1),W(!1),ce([]),Ee([]))},[L]),A.useEffect(()=>{if(S&&d&&j&&I)if(j>=I){const U=new Date(d);U.setDate(U.getDate()+1),ne(oe(U,"yyyy-MM-dd"))}else ne("");else ne("")},[S,d,j,I]);const It=()=>{if(!j||!I){ie("Заполните время начала и окончания");return}const U=S&&j>=I;if(!U&&j>=I){ie('Время окончания должно быть позже времени начала. Включите "Переходит через полночь" для слотов, переходящих на следующий день.');return}let ae;if(U&&d)if(F)ae=F;else{const ge=new Date(d);ge.setDate(ge.getDate()+1),ae=oe(ge,"yyyy-MM-dd")}const fe={start:j,end:I,...ae&&{endDate:ae},breaks:[]};T([...p,fe]),E(""),D(""),C(!1),ne(""),_(""),b(""),k(null),ie("")},Mt=U=>{if(!B||!y){ie("Заполните время начала и окончания перерыва");return}const ae=p[U];if(!ae)return;if(B>=y){ie("Время окончания перерыва должно быть позже времени начала");return}const fe=Rr(B),ge=Rr(y),Pe=Rr(ae.start),qe=Rr(ae.end),kt=ae.endDate||qe<=Pe;let De=!1;if(kt){const Nt=fe>=Pe&&fe<1440&&ge>fe&&ge<=1440&&ge>fe,vr=fe>=0&&fe<=qe&&ge>fe&&ge<=qe,Ii=fe>=Pe&&fe<1440&&ge>0&&ge<=qe&&fe>ge;De=Nt||vr||Ii}else De=fe>=Pe&&ge<=qe&&ge>fe;if(!De){ie(`Перерыв должен быть в пределах времени слота (${ae.start} - ${ae.end})`);return}const bt=ae.breaks||[];for(let wt=0;wt<bt.length;wt++){if(N===U&&O===wt)continue;const Nt=bt[wt];if(B>=Nt.start&&B<Nt.end||y>Nt.start&&y<=Nt.end||B<=Nt.start&&y>=Nt.end){ie("Перерывы не должны пересекаться");return}}let vt;N===U&&O!==null?(vt=[...bt],vt[O]={start:B,end:y},vt.sort((wt,Nt)=>wt.start.localeCompare(Nt.start))):vt=[...bt,{start:B,end:y}].sort((wt,Nt)=>wt.start.localeCompare(Nt.start));const Dt=[...p];Dt[U]={...ae,breaks:vt},T(Dt),_(""),b(""),k(null),f(null),Q(null),ie("")},xe=(U,ae)=>{const fe=p[U];if(!fe||!fe.breaks||!fe.breaks[ae])return;const ge=fe.breaks[ae];f(U),Q(ae),k(U),_(ge.start),b(ge.end),ie("")},je=()=>{_(""),b(""),k(null),f(null),Q(null),ie("")},Le=(U,ae)=>{const fe=p[U];if(!fe||!fe.breaks)return;const ge=fe.breaks.filter((qe,kt)=>kt!==ae),Pe=[...p];Pe[U]={...fe,breaks:ge.length>0?ge:void 0},T(Pe)},st=U=>{T(p.filter((ae,fe)=>fe!==U))},xn=U=>{Z.includes(U)?ce(Z.filter(ae=>ae!==U)):ce([...Z,U])},Js=U=>{le.includes(U)?Ee(le.filter(ae=>ae!==U)):Ee([...le,U])},Zs=U=>{x(ae=>ae.includes(U)?ae.filter(fe=>fe!==U):[...ae,U])},ji=()=>{g.length===ve.length?x([]):x(ve.map(U=>U.id))},Wr=()=>{if(!ee)return;const U=Zm([...pe,ee]);Ne(U),ke("")},ea=U=>{Ne(ae=>ae.filter(fe=>fe!==U))},es=()=>{if(Ge){if(L==="range")return Jm(X,J);if(L==="multiple")return pe}return[d]},ts=()=>r?[r.userId]:Ge?g:i&&!n?g.length>0?g:[]:n!=null&&n.id?[n.id]:[],ta=U=>{var ae;return((ae=ve.find(fe=>fe.id===U))==null?void 0:ae.name)||U},Ti=async(U,ae)=>{const ge=(await br(void 0,U)).filter(Pe=>Pe.id!==(r==null?void 0:r.id));for(const Pe of ae)for(const qe of ge)if(y1(Pe,qe.slots[0])&&qe.participants.length>=3)return`Слот ${Pe.start}-${Pe.end} уже занят максимальным количеством участников (3)`;return null},rs=async()=>{if(console.log("handleSave called"),!i&&!n){console.log("No user found"),ie("Пользователь не найден");return}if(p.length===0){ie("Добавьте хотя бы один временной интервал");return}if(r&&!i&&n&&r.userId!==n.id){ie("Вы можете редактировать только свои слоты"),Fe(!1);return}const U=ts();if(U.length===0){ie("Выберите хотя бы одного участника");return}const ae=es();if(ae.length===0){ie("Выберите даты");return}const fe=async(ge,Pe,qe=[ge])=>{const kt=await Ti(Pe,p);if(kt)throw new Error(`[${ta(ge)} • ${oe(new Date(Pe),"dd.MM.yyyy")}] ${kt}`);const De={userId:ge,date:Pe,slots:p,...P&&{comment:P},participants:qe};r?await Xw(r.id,De):await Yw(De)};console.log("Starting save process..."),ie(""),Fe(!0);try{if(r){await fe(r.userId,d,r.participants||[r.userId]),t();return}if(K&&Z.length>0){const ge=new Date(d),Pe=ge.getMonth(),qe=ge.getFullYear(),kt=new Date(qe,Pe+1,0).getDate();for(let De=1;De<=kt;De++){const bt=new Date(qe,Pe,De),vt=bt.getDay()===0?6:bt.getDay()-1;if(Z.includes(vt)){const Dt=oe(bt,"yyyy-MM-dd");for(const wt of U)await fe(wt,Dt)}}}else if(q&&le.length>0){const ge=new Date(d),Pe=ge.getMonth(),qe=ge.getFullYear(),kt=new Date(qe,Pe+1,0).getDate();for(let De=1;De<=kt;De++){const bt=new Date(qe,Pe,De),vt=bt.getDay()===0?6:bt.getDay()-1;if(le.includes(vt)){const Dt=oe(bt,"yyyy-MM-dd");for(const wt of U)await fe(wt,Dt)}}}else if(Ge&&L!=="single")for(const ge of ae)for(const Pe of U)await fe(Pe,ge);else for(const ge of U)await fe(ge,d);t()}catch(ge){console.error("Error saving slot:",ge);const Pe=ge.message||ge.code||"Ошибка при сохранении";ie(Pe)}finally{Fe(!1)}},ns=Ge?es():[d],ra=g.map(U=>ta(U)).join(", "),zr=p.map(U=>`${U.start}–${U.end}${U.endDate?" (+1)":""}`);return a.jsx("div",{className:"fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto touch-manipulation",children:a.jsx("div",{className:`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${s==="dark"?"bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10":"bg-gradient-to-br from-white via-slate-50 to-white border-slate-200"} max-h-[92vh] overflow-y-auto my-4 sm:my-8`,children:a.jsxs("div",{className:"p-4 sm:p-6 lg:p-7",children:[a.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[a.jsxs("div",{className:"space-y-1",children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold",children:[a.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30",children:[r?"Редактирование":"Создание"," слота"]}),a.jsx("span",{className:`${s==="dark"?"text-gray-400":"text-gray-500"}`,children:"расписание"})]}),a.jsx("h3",{className:`text-2xl sm:text-3xl font-bold ${l}`,children:r?"Редактировать слот":"Добавить слот"}),a.jsx("p",{className:`${s==="dark"?"text-gray-400":"text-gray-600"} text-sm`,children:"Новая оболочка с акцентом на шаги: участники → даты → время → заметки."})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("div",{className:`px-3 py-2 rounded-xl border text-xs sm:text-sm ${s==="dark"?"border-white/10 bg-white/5 text-gray-200":"border-slate-200 bg-slate-50 text-slate-700"}`,children:[r?"Редактирование":"Создание"," · ",p.length||0," интервал(ов)"]}),a.jsx("button",{onClick:e,className:`p-2.5 rounded-full border ${s==="dark"?"border-white/10 text-gray-200 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-100"} transition-colors touch-manipulation`,"aria-label":"Закрыть",children:a.jsx(Pt,{className:"w-4 h-4 sm:w-5 sm:h-5"})})]})]}),a.jsxs("div",{className:"mt-5 grid lg:grid-cols-[0.9fr_1.6fr] gap-4 lg:gap-6",children:[a.jsxs("aside",{className:`rounded-2xl border ${s==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-white"} p-4 sm:p-5 space-y-4 sticky top-4 self-start`,children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("p",{className:"text-sm font-semibold",children:"Навигация"}),a.jsx("span",{className:"text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold",children:"4 шага"})]}),a.jsx("div",{className:"space-y-2",children:[{label:"Участники",detail:ra||"Не выбрано",done:g.length>0||!!r},{label:"Даты",detail:ns.slice(0,2).map(U=>oe(U,"dd.MM")).join(", ")||"Выберите дату",done:ns.length>0},{label:"Время",detail:zr.slice(0,2).join(" · ")||"Добавьте интервал",done:p.length>0},{label:"Комментарий",detail:P?"Заполнен":"Необязателен",done:!!P}].map((U,ae)=>a.jsxs("div",{className:`flex items-start gap-3 rounded-xl border px-3 py-3 ${s==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`,children:[a.jsx("span",{className:`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${U.done?"bg-[#4E6E49] text-white":s==="dark"?"bg-slate-800 text-gray-300":"bg-slate-200 text-slate-700"}`,children:ae+1}),a.jsxs("div",{className:"flex-1",children:[a.jsx("p",{className:"text-sm font-semibold",children:U.label}),a.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 truncate",children:U.detail})]})]},U.label))}),a.jsxs("div",{className:`rounded-xl border px-3 py-3 space-y-2 ${s==="dark"?"border-emerald-900/50 bg-emerald-900/20":"border-emerald-100 bg-emerald-50"}`,children:[a.jsx("p",{className:"text-xs uppercase tracking-wide text-emerald-600 font-semibold",children:"Подсказка"}),a.jsx("p",{className:"text-sm text-emerald-700 dark:text-emerald-200",children:"Формы теперь разбиты на блоки: вы свободно переключаетесь между шагами, не теряя данных."})]})]}),a.jsxs("div",{className:"space-y-4",children:[Ge&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Участники"}),a.jsxs("div",{className:"space-y-3",children:[a.jsx("div",{className:"flex flex-wrap gap-2",children:ve.map(U=>a.jsxs("label",{className:`px-3 py-1.5 rounded-full border cursor-pointer text-sm flex items-center gap-2 ${g.includes(U.id)?"bg-[#4E6E49] border-[#4E6E49] text-white":s==="dark"?"bg-gray-700 border-gray-800 text-gray-200":"bg-gray-100 border-gray-300 text-gray-700"}`,children:[a.jsx("input",{type:"checkbox",checked:g.includes(U.id),onChange:()=>Zs(U.id),className:"hidden"}),U.name]},U.id))}),a.jsx("button",{type:"button",onClick:ji,className:"text-sm text-[#4E6E49] hover:text-[#4E6E49]",children:g.length===ve.length?"Снять выделение":"Выбрать всех"})]})]}),Ge&&a.jsxs("div",{children:[a.jsx("p",{className:`text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Формат выбора дат"}),a.jsx("div",{className:"flex flex-wrap gap-4",children:[{value:"single",label:"Один день"},{value:"range",label:"Диапазон дат"},{value:"multiple",label:"Конкретные даты"}].map(U=>a.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[a.jsx("input",{type:"radio",value:U.value,checked:L===U.value,onChange:ae=>V(ae.target.value)}),a.jsx("span",{className:s==="dark"?"text-gray-200":"text-gray-700",children:U.label})]},U.value))})]}),(!Ge||L==="single")&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата"}),a.jsx("input",{type:"date",value:d,onChange:U=>h(U.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),Ge&&L==="range"&&a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Начало диапазона"}),a.jsx("input",{type:"date",value:X,onChange:U=>se(U.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Конец диапазона"}),a.jsx("input",{type:"date",value:J,min:X,onChange:U=>z(U.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]})]}),Ge&&L==="multiple"&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Выбранные даты"}),a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[a.jsx("input",{type:"date",value:ee,onChange:U=>ke(U.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}),a.jsx("button",{type:"button",onClick:Wr,className:"px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors",children:"Добавить"})]}),pe.length>0?a.jsx("div",{className:"flex flex-wrap gap-2",children:pe.map(U=>a.jsxs("span",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm",children:[oe(U,"dd.MM.yyyy"),a.jsx("button",{type:"button",onClick:()=>ea(U),className:"text-red-500 hover:text-red-600",children:"x"})]},U))}):a.jsx("p",{className:"text-sm text-gray-500",children:"Пока не выбрано ни одной даты"})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Временные слоты"}),a.jsxs("div",{className:"space-y-2 mb-2",children:[a.jsx("div",{className:"flex flex-col sm:flex-row gap-2",children:a.jsxs("div",{className:"flex gap-2 flex-1",children:[a.jsx("input",{type:"time",value:j,onChange:U=>E(U.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Начало"}),a.jsx("span",{className:"mx-1 sm:mx-2 text-gray-500 text-sm sm:text-base flex items-center",children:"—"}),a.jsx("input",{type:"time",value:I,onChange:U=>D(U.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Окончание"})]})}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",id:"crossMidnight",checked:S,onChange:U=>{C(U.target.checked),U.target.checked||ne("")},className:`w-4 h-4 rounded border-2 ${s==="dark"?"border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]":"border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]"} focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}),a.jsx("label",{htmlFor:"crossMidnight",className:`text-xs sm:text-sm font-medium cursor-pointer ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Переходит через полночь (на следующий день)"})]}),S&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-1 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата окончания (автоматически: следующий день после начала)"}),a.jsx("input",{type:"date",value:F,onChange:U=>ne(U.target.value),min:d,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}),F&&a.jsxs("p",{className:`mt-1 text-xs ${s==="dark"?"text-gray-400":"text-gray-500"}`,children:["Слот: ",d," ",j," → ",F," ",I]})]}),a.jsxs("button",{onClick:It,className:"w-full px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors flex items-center justify-center gap-2",children:[a.jsx(Ns,{className:"w-4 h-4"}),"Добавить слот"]})]}),a.jsx("div",{className:"space-y-3",children:p.map((U,ae)=>a.jsxs("div",{className:`flex flex-col gap-2 p-3 rounded-lg ${s==="dark"?"bg-gray-700":"bg-gray-100"}`,children:[a.jsxs("div",{className:"flex items-center justify-between flex-wrap gap-2",children:[a.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[a.jsxs("span",{className:l,children:[U.start," - ",U.end]}),U.endDate&&a.jsxs("span",{className:`text-xs px-2 py-0.5 rounded-full ${s==="dark"?"bg-blue-500/20 text-blue-400 border border-blue-500/30":"bg-blue-100 text-blue-700 border border-blue-300"}`,children:["до ",oe(new Date(U.endDate),"dd.MM.yyyy")]})]}),a.jsx("button",{onClick:()=>st(ae),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-shrink-0",title:"Удалить слот",children:a.jsx(Et,{className:"w-4 h-4"})})]}),U.breaks&&U.breaks.length>0&&a.jsxs("div",{className:"ml-4 space-y-1",children:[a.jsx("span",{className:`text-xs ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:"Перерывы:"}),U.breaks.map((fe,ge)=>N===ae&&O===ge?null:a.jsxs("div",{className:"flex items-center justify-between gap-2",children:[a.jsxs("span",{className:`text-sm ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:[fe.start," - ",fe.end]}),a.jsxs("div",{className:"flex gap-1",children:[a.jsx("button",{onClick:()=>xe(ae,ge),className:"p-1 text-blue-400 hover:bg-blue-400 hover:text-white rounded transition-colors",title:"Редактировать перерыв",children:a.jsx($t,{className:"w-3 h-3"})}),a.jsx("button",{onClick:()=>Le(ae,ge),className:"p-1 text-red-400 hover:bg-red-400 hover:text-white rounded transition-colors",title:"Удалить перерыв",children:a.jsx(Pt,{className:"w-3 h-3"})})]})]},ge))]}),a.jsx("div",{className:"ml-4 space-y-2 border-t pt-2 border-gray-500 border-opacity-30",children:w===ae?a.jsxs("div",{className:"space-y-2",children:[a.jsxs("div",{className:"flex gap-2",children:[a.jsx("input",{type:"time",value:B,onChange:fe=>_(fe.target.value),className:`flex-1 px-3 py-1.5 text-sm rounded-lg border ${s==="dark"?"bg-gray-600 border-gray-500 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Начало"}),a.jsx("input",{type:"time",value:y,onChange:fe=>b(fe.target.value),className:`flex-1 px-3 py-1.5 text-sm rounded-lg border ${s==="dark"?"bg-gray-600 border-gray-500 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Конец"})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:()=>Mt(ae),className:"flex-1 px-3 py-1.5 text-sm bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors",children:N===ae&&O!==null?"Сохранить":"Добавить перерыв"}),a.jsx("button",{onClick:je,className:"px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors",children:"Отмена"})]})]}):a.jsxs("button",{onClick:()=>{k(ae),_(""),b(""),f(null),Q(null),ie("")},className:"w-full px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1",children:[a.jsx(Ns,{className:"w-3 h-3"}),"Добавить перерыв"]})})]},ae))}),p.length>0&&a.jsxs("p",{className:`text-sm mt-2 ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:["Всего часов: ",Ni(p).toFixed(1)]})]}),(!Ge||L==="single")&&a.jsxs("div",{className:"space-y-3",children:[a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:K,onChange:U=>{if(U.target.checked&&q){ie("Снимите галочку с другой функции");return}H(U.target.checked),ie("")},className:"w-4 h-4"}),a.jsx("span",{className:`${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Добавить аналогичные слоты на месяц вперед"})]}),K&&a.jsxs("div",{className:"ml-6",children:[a.jsx("p",{className:`text-sm mb-2 ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:"Выберите день недели:"}),a.jsx("div",{className:"flex gap-2 flex-wrap",children:Je.map((U,ae)=>a.jsx("button",{onClick:()=>xn(ae),className:`px-3 py-1 rounded-lg transition-colors ${Z.includes(ae)?"bg-[#4E6E49] text-white":s==="dark"?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-700"}`,children:U},ae))})]}),a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:q,onChange:U=>{if(U.target.checked&&K){ie("Снимите галочку с другой функции");return}W(U.target.checked),ie("")},className:"w-4 h-4"}),a.jsx("span",{className:`${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Установить время работы на все выбранные дни"})]}),q&&a.jsxs("div",{className:"ml-6",children:[a.jsx("p",{className:`text-sm mb-2 ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:"Выберите дни недели:"}),a.jsx("div",{className:"flex gap-2 flex-wrap",children:Je.map((U,ae)=>a.jsx("button",{onClick:()=>Js(ae),className:`px-3 py-1 rounded-lg transition-colors ${le.includes(ae)?"bg-[#4E6E49] text-white":s==="dark"?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-700"}`,children:U},ae))})]})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${s==="dark"?"text-gray-300":"text-gray-700"}`,children:"Комментарий"}),a.jsx("textarea",{value:P,onChange:U=>$(U.target.value),rows:3,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation resize-y ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Добавьте комментарий (необязательно)"})]}),Xe&&a.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:Xe}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2",children:[a.jsx("button",{onClick:U=>{console.log("Save button clicked!",{loading:re,slotsCount:p.length,disabled:re||p.length===0}),U.preventDefault(),rs()},disabled:re||p.length===0,className:"flex-1 px-4 py-2.5 sm:py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100",children:re?"Сохранение...":"Сохранить"}),a.jsx("button",{onClick:e,className:`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${s==="dark"?"bg-gray-700 hover:bg-gray-600 active:bg-gray-500":"bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}`,children:"Отмена"})]})]})]})]})})})},E1=({type:r,status:e,onClose:t,onSave:n})=>{const{user:s}=nt(),{theme:i}=Ve(),{isAdmin:l}=yt(),c=i==="dark"?"text-white":"text-gray-900",d=(e==null?void 0:e.date)||oe(new Date,"yyyy-MM-dd"),[h,g]=A.useState(e!=null&&e.userId?[e.userId]:s!=null&&s.id?[s.id]:[]),[x,p]=A.useState(d),[T,j]=A.useState((e==null?void 0:e.endDate)||d),[E,I]=A.useState(!!(e!=null&&e.endDate)),[D,S]=A.useState((e==null?void 0:e.comment)||""),[C,F]=A.useState(""),[ne,B]=A.useState(!1),[_,y]=A.useState("single"),[b,w]=A.useState(d),[k,N]=A.useState(d),[f,O]=A.useState(d),[Q,P]=A.useState([]),$=l&&!e;A.useEffect(()=>{E||j(x)},[E,x]),A.useEffect(()=>{$&&_!=="single"&&I(!1)},[$,_]);const K=z=>{g(ee=>ee.includes(z)?ee.filter(ke=>ke!==z):[...ee,z])},H=()=>{h.length===ve.length?g([]):g(ve.map(z=>z.id))},Z=()=>{if(!f)return;const z=Zm([...Q,f]);P(z),O("")},ce=z=>{P(ee=>ee.filter(ke=>ke!==z))},q=()=>e?[e.userId]:$?h:l&&!s?h.length>0?h:[]:s!=null&&s.id?[s.id]:[],W=z=>{var ee;return((ee=ve.find(ke=>ke.id===z))==null?void 0:ee.name)||z},le=()=>{if($){if(_==="range")return r==="dayoff"?Jm(b,k).map(ee=>({date:ee})):b&&k?[{date:b,endDate:k}]:[];if(_==="multiple")return r==="dayoff"?Q.map(ee=>({date:ee})):Q.map(ee=>({date:ee,endDate:ee}))}const z={date:x};return r!=="dayoff"&&(E||e!=null&&e.endDate)&&(z.endDate=T),[z]},Ee=async(z,ee,ke)=>{if(!l&&!s)return"Пользователь не найден";const pe=new Date,Ne=new Date(ee),Xe=new Date(ke||ee);if(r==="dayoff"&&x1(Ne,pe))return"Нельзя установить выходной на сегодня. Выберите смену или возьмите больничный.";if(r==="sick"){const ie=new Date;ie.setHours(0,0,0,0);const re=new Date(ie);re.setDate(re.getDate()+2);const Fe=new Date(ee);if(Fe.setHours(0,0,0,0),Fe<ie||Fe>re)return"Больничный можно взять только на актуальную дату и + 2 суток. Нельзя выбрать заранее.";const Je=Math.ceil((Xe.getTime()-Ne.getTime())/(1e3*60*60*24))+1;if(Je<1)return"Больничный должен быть минимум на 1 день";if(Je>14)return"Больничный может длиться не более 14 календарных дней в месяце";const Ge=new Date(Ne.getFullYear(),Ne.getMonth(),1),It=new Date(Ne.getFullYear(),Ne.getMonth()+1,0);if((await hr(z)).filter(je=>je.type==="sick"&&je.date>=oe(Ge,"yyyy-MM-dd")&&je.date<=oe(It,"yyyy-MM-dd")).length+Je>14)return"Больничный ограничен 14 днями в месяц"}if(r==="vacation"){if(Math.ceil((Xe.getTime()-Ne.getTime())/864e5)+1>14)return"Отпуск не может быть больше 14 дней в месяце";const re=new Date(Ne.getFullYear(),0,1),Fe=new Date(Ne.getFullYear(),11,31);if((await hr(z)).filter(It=>It.type==="vacation"&&It.date>=oe(re,"yyyy-MM-dd")&&It.date<=oe(Fe,"yyyy-MM-dd")).length>=6)return"Не более 6 отпусков в год"}if(r==="dayoff"){const ie=new Date(Ne);ie.setDate(ie.getDate()-ie.getDay()+1);const re=new Date(ie);re.setDate(ie.getDate()+6);let Je=(await hr(z)).filter(xe=>xe.type==="dayoff"&&xe.date>=oe(ie,"yyyy-MM-dd")&&xe.date<=oe(re,"yyyy-MM-dd"));if(e&&(Je=Je.filter(xe=>xe.id!==e.id)),Je.length>=2)return"Выходные на неделе ограничены максимум 2 днями";const It=(await hr()).filter(xe=>xe.type==="dayoff"&&xe.date===ee),Mt=new Set(It.map(xe=>xe.userId));if(e&&e.type==="dayoff"&&e.date===ee&&Mt.delete(e.userId),Mt.size>=3)return"На этот день уже установлено максимальное количество выходных (3 человека). Выберите другую дату."}return null},L=async()=>{if(console.log("handleSave called (DayStatusForm)"),!l&&!s){console.log("No user found"),F("Пользователь не найден");return}if(e&&!l&&s&&e.userId!==s.id){F("Вы можете редактировать только свои статусы"),B(!1);return}const z=q();if(z.length===0){F("Выберите хотя бы одного участника");return}const ee=le();if(ee.length===0){F("Выберите даты");return}const ke=async(pe,Ne)=>{const Xe=await Ee(pe,Ne.date,Ne.endDate);if(Xe)throw new Error(`[${W(pe)} • ${oe(Ne.date,"dd.MM.yyyy")}] ${Xe}`);const ie={userId:pe,date:Ne.date,type:r,...Ne.endDate&&{endDate:Ne.endDate},...D&&{comment:D}};e?await Zw(e.id,ie):await Jw(ie)};console.log("Starting save process..."),F(""),B(!0);try{if(e){const pe={date:x};r!=="dayoff"&&(E||e.endDate)&&(pe.endDate=T),await ke(e.userId,pe),n();return}for(const pe of z)for(const Ne of ee)await ke(pe,Ne);n()}catch(pe){console.error("Error saving day status:",pe);const Ne=pe.message||pe.code||"Ошибка при сохранении";F(Ne)}finally{B(!1)}},V={dayoff:"Выходной",sick:"Больничный",vacation:"Отпуск"},X={dayoff:"bg-yellow-500",sick:"bg-purple-500",vacation:"bg-orange-500"},se=$&&_==="range"?[`${oe(b,"dd.MM")}–${oe(k,"dd.MM")}`]:$&&_==="multiple"?Q.map(z=>oe(z,"dd.MM")):[oe(x,"dd.MM")],J=h.map(z=>W(z)).join(", ");return a.jsx("div",{className:"fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto touch-manipulation",children:a.jsx("div",{className:`w-full max-w-4xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${i==="dark"?"bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10":"bg-gradient-to-br from-white via-slate-50 to-white border-slate-200"} max-h-[92vh] overflow-y-auto my-4 sm:my-8`,children:a.jsxs("div",{className:"p-4 sm:p-6 lg:p-7",children:[a.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[a.jsxs("div",{className:"space-y-1",children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold",children:[a.jsx("span",{className:"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30",children:V[r]}),a.jsx("span",{className:`${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"расписание"})]}),a.jsxs("h3",{className:`text-2xl sm:text-3xl font-bold ${c}`,children:[e?"Редактировать":"Добавить"," ",V[r]]}),a.jsx("p",{className:`${i==="dark"?"text-gray-400":"text-gray-600"} text-sm`,children:"Обновленная модалка: быстрый обзор выбранных людей, дат и комментария."})]}),a.jsx("button",{onClick:t,className:`p-2.5 rounded-full border ${i==="dark"?"border-white/10 text-gray-200 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-100"}`,children:a.jsx(Pt,{className:"w-5 h-5"})})]}),a.jsxs("div",{className:"mt-5 grid lg:grid-cols-[0.9fr_1.4fr] gap-4 lg:gap-6",children:[a.jsxs("aside",{className:`rounded-2xl border ${i==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-white"} p-4 sm:p-5 space-y-4 sticky top-4 self-start`,children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("p",{className:"text-sm font-semibold",children:"Навигация"}),a.jsx("span",{className:"text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold",children:"3 шага"})]}),a.jsx("div",{className:"space-y-2",children:[{label:"Участники",detail:J||"Не выбрано",done:h.length>0||!!e},{label:"Даты",detail:se.slice(0,2).join(" · "),done:se.length>0},{label:"Комментарий",detail:D?"Заполнен":"Необязателен",done:!!D}].map((z,ee)=>a.jsxs("div",{className:`flex items-start gap-3 rounded-xl border px-3 py-3 ${i==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`,children:[a.jsx("span",{className:`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${z.done?"bg-[#4E6E49] text-white":i==="dark"?"bg-slate-800 text-gray-300":"bg-slate-200 text-slate-700"}`,children:ee+1}),a.jsxs("div",{className:"flex-1",children:[a.jsx("p",{className:"text-sm font-semibold",children:z.label}),a.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 truncate",children:z.detail||"—"})]})]},z.label))}),a.jsxs("div",{className:`rounded-xl border px-3 py-3 space-y-2 ${i==="dark"?"border-emerald-900/50 bg-emerald-900/20":"border-emerald-100 bg-emerald-50"}`,children:[a.jsx("p",{className:"text-xs uppercase tracking-wide text-emerald-600 font-semibold",children:"Подсказка"}),a.jsx("p",{className:"text-sm text-emerald-700 dark:text-emerald-200",children:"Визуальные блоки помогают не потеряться между диапазоном дат и выбором команды."})]})]}),a.jsxs("div",{className:"space-y-4",children:[$&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Участники"}),a.jsxs("div",{className:"space-y-3",children:[a.jsx("div",{className:"flex flex-wrap gap-2",children:ve.map(z=>a.jsxs("label",{className:`px-3 py-1.5 rounded-full border cursor-pointer text-sm flex items-center gap-2 ${h.includes(z.id)?"bg-[#4E6E49] border-[#4E6E49] text-white":i==="dark"?"bg-gray-700 border-gray-800 text-gray-200":"bg-gray-100 border-gray-300 text-gray-700"}`,children:[a.jsx("input",{type:"checkbox",checked:h.includes(z.id),onChange:()=>K(z.id),className:"hidden"}),z.name]},z.id))}),a.jsx("button",{type:"button",onClick:H,className:"text-sm text-[#4E6E49] hover:text-[#4E6E49]",children:h.length===ve.length?"Снять выделение":"Выбрать всех"})]})]}),$&&a.jsxs("div",{children:[a.jsx("p",{className:`text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Формат выбора дат"}),a.jsx("div",{className:"flex flex-wrap gap-4",children:[{value:"single",label:"Один день"},{value:"range",label:r==="dayoff"?"Диапазон (каждый день)":"Диапазон дат"},{value:"multiple",label:"Конкретные даты"}].map(z=>a.jsxs("label",{className:"flex items-center gap-2 text-sm cursor-pointer",children:[a.jsx("input",{type:"radio",value:z.value,checked:_===z.value,onChange:ee=>y(ee.target.value)}),a.jsx("span",{className:i==="dark"?"text-gray-200":"text-gray-700",children:z.label})]},z.value))})]}),(!$||_==="single")&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата начала"}),a.jsx("input",{type:"date",value:x,onChange:z=>p(z.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),$&&_==="range"&&a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Начало"}),a.jsx("input",{type:"date",value:b,onChange:z=>w(z.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Конец"}),a.jsx("input",{type:"date",value:k,min:b,onChange:z=>N(z.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]})]}),$&&_==="multiple"&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Выбранные даты"}),a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[a.jsx("input",{type:"date",value:f,onChange:z=>O(z.target.value),className:`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}),a.jsx("button",{type:"button",onClick:Z,className:"px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors",children:"Добавить"})]}),Q.length>0?a.jsx("div",{className:"flex flex-wrap gap-2",children:Q.map(z=>a.jsxs("span",{className:"inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm",children:[oe(z,"dd.MM.yyyy"),a.jsx("button",{type:"button",onClick:()=>ce(z),className:"text-red-500 hover:text-red-600",children:"x"})]},z))}):a.jsx("p",{className:"text-sm text-gray-500",children:"Пока не выбрано ни одной даты"})]})]}),(r==="sick"||r==="vacation")&&(!$||_==="single")&&a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:E,onChange:z=>I(z.target.checked),className:"w-4 h-4"}),a.jsx("span",{className:`${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Несколько дней"})]}),E&&a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Дата окончания"}),a.jsx("input",{type:"date",value:T,onChange:z=>j(z.target.value),min:x,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Комментарий"}),a.jsx("textarea",{value:D,onChange:z=>S(z.target.value),rows:3,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation resize-y ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Добавьте комментарий (необязательно)"})]}),C&&a.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:C}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2",children:[a.jsx("button",{onClick:L,disabled:ne,className:`flex-1 px-4 py-2.5 sm:py-2 ${X[r]} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100`,children:ne?"Сохранение...":"Сохранить"}),a.jsx("button",{onClick:t,className:`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${i==="dark"?"bg-gray-700 hover:bg-gray-600 active:bg-gray-500":"bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}`,children:"Отмена"})]})]})]})]})})})},k1=({onClose:r,onSave:e})=>{const{user:t}=nt(),{theme:n}=Ve(),{isAdmin:s}=yt(),i=n==="dark"?"text-white":"text-gray-900",[l,c]=A.useState(s?[]:t!=null&&t.id?[t.id]:[]),[d,h]=A.useState(!1),[g,x]=A.useState(!1),[p,T]=A.useState(!1),[j,E]=A.useState(null),[I,D]=A.useState([]),[S,C]=A.useState(""),[F,ne]=A.useState(""),[B,_]=A.useState(""),[y,b]=A.useState(""),[w,k]=A.useState(!1),N=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],f=d?"По дню недели":g?"По датам":p?"Диапазон":"Не выбран",O=d?j!==null?N[j]:"День недели":g?I[0]?`${oe(I[0],"dd.MM")} +${Math.max(I.length-1,0)}`:"Добавьте даты":p?F&&B?`${oe(F,"dd.MM")}–${oe(B,"dd.MM")}`:"Укажите диапазон":"Выберите режим",Q=l.map(W=>{var le;return((le=ve.find(Ee=>Ee.id===W))==null?void 0:le.name)||W}).join(", "),P=W=>{if(W){if(g||p){b("Снимите галочку с другой функции, чтобы активировать эту");return}h(!0),b("")}else h(!1),E(null)},$=W=>{if(W){if(d||p){b("Снимите галочку с другой функции, чтобы активировать эту");return}x(!0),b("")}else x(!1),D([]),C("")},K=W=>{if(W){if(d||g){b("Снимите галочку с другой функции, чтобы активировать эту");return}T(!0),b("")}else T(!1),ne(""),_("")},H=W=>{l.includes(W)?c(l.filter(le=>le!==W)):c([...l,W])},Z=()=>{if(!S){b("Выберите дату");return}if(I.includes(S)){b("Эта дата уже добавлена");return}D([...I,S].sort()),C(""),b("")},ce=W=>{D(I.filter(le=>le!==W))},q=async()=>{var le;if(!s&&!t){b("Пользователь не найден");return}const W=s?l:t?[t.id]:[];if(W.length===0){b("Выберите хотя бы одного участника");return}if(!d&&!g&&!p){b("Выберите способ удаления слотов");return}if(d&&j===null){b("Выберите день недели");return}if(g&&I.length===0){b("Добавьте хотя бы одну дату");return}if(p){if(!F||!B){b("Укажите начальную и конечную дату диапазона");return}if(F>B){b("Начальная дата должна быть раньше конечной");return}}b(""),k(!0);try{const Ee=W.map(z=>br(z)),V=(await Promise.all(Ee)).flat();let X=[];if(d?X=V.filter(z=>{const ee=new Date(z.date+"T00:00:00");return(ee.getDay()===0?6:ee.getDay()-1)===j}).map(z=>z.id):g?X=V.filter(z=>I.includes(z.date)).map(z=>z.id):p&&(X=V.filter(z=>z.date>=F&&z.date<=B).map(z=>z.id)),X.length===0){b("Слоты для удаления не найдены"),k(!1);return}const se=W.length>1?`${W.length} участников`:((le=ve.find(z=>z.id===W[0]))==null?void 0:le.name)||"участника",J=d?`Удалить все слоты ${se} на ${N[j]}? (${X.length} слотов)`:p?`Удалить все слоты ${se} с ${oe(F,"dd.MM.yyyy")} по ${oe(B,"dd.MM.yyyy")}? (${X.length} слотов)`:`Удалить слоты ${se} на выбранные даты? (${X.length} слотов)`;if(!confirm(J)){k(!1);return}await Promise.all(X.map(z=>Ml(z))),e()}catch(Ee){console.error("Error deleting slots:",Ee);const L=Ee.message||Ee.code||"Ошибка при удалении слотов";b(L)}finally{k(!1)}};return a.jsx("div",{className:"fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto",children:a.jsx("div",{className:`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${n==="dark"?"bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10":"bg-gradient-to-br from-white via-slate-50 to-white border-slate-200"} max-h-[92vh] overflow-y-auto`,children:a.jsxs("div",{className:"p-5 sm:p-6 lg:p-7",children:[a.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[a.jsxs("div",{className:"space-y-1",children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold",children:[a.jsx("span",{className:"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30",children:"Очистка"}),a.jsx("span",{className:`${n==="dark"?"text-gray-400":"text-gray-500"}`,children:"расписание"})]}),a.jsx("h3",{className:`text-2xl sm:text-3xl font-bold ${i}`,children:"Удаление слотов"}),a.jsx("p",{className:`${n==="dark"?"text-gray-400":"text-gray-600"} text-sm`,children:"Новый обзор: режим удаления, выбранные люди и диапазон видны сразу."})]}),a.jsx("button",{onClick:r,className:`p-2.5 rounded-full border ${n==="dark"?"border-white/10 text-gray-200 hover:bg-white/5":"border-slate-200 text-slate-600 hover:bg-slate-100"}`,children:a.jsx(Pt,{className:"w-5 h-5"})})]}),a.jsxs("div",{className:"mt-5 grid lg:grid-cols-[0.95fr_1.45fr] gap-4 lg:gap-6",children:[a.jsxs("aside",{className:`rounded-2xl border ${n==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-white"} p-4 sm:p-5 space-y-4 sticky top-4 self-start`,children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("p",{className:"text-sm font-semibold",children:"Навигация"}),a.jsx("span",{className:"text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold",children:"3 шага"})]}),a.jsx("div",{className:"space-y-2",children:[{label:"Участники",detail:Q||"Не выбрано",done:l.length>0||!s},{label:"Режим",detail:f,done:f!=="Не выбран"},{label:"Параметры",detail:O,done:O!=="Выберите режим"}].map((W,le)=>a.jsxs("div",{className:`flex items-start gap-3 rounded-xl border px-3 py-3 ${n==="dark"?"border-white/10 bg-white/5":"border-slate-200 bg-slate-50"}`,children:[a.jsx("span",{className:`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${W.done?"bg-[#4E6E49] text-white":n==="dark"?"bg-slate-800 text-gray-300":"bg-slate-200 text-slate-700"}`,children:le+1}),a.jsxs("div",{className:"flex-1",children:[a.jsx("p",{className:"text-sm font-semibold",children:W.label}),a.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400 truncate",children:W.detail||"—"})]})]},W.label))}),a.jsxs("div",{className:`rounded-xl border px-3 py-3 space-y-2 ${n==="dark"?"border-emerald-900/50 bg-emerald-900/20":"border-emerald-100 bg-emerald-50"}`,children:[a.jsx("p",{className:"text-xs uppercase tracking-wide text-emerald-600 font-semibold",children:"Подсказка"}),a.jsx("p",{className:"text-sm text-emerald-700 dark:text-emerald-200",children:"Выберите только один способ удаления: по дню, по списку дат или по диапазону."})]})]}),a.jsxs("div",{className:"space-y-4",children:[s&&a.jsxs("div",{children:[a.jsxs("label",{className:`block text-sm font-medium mb-2 ${n==="dark"?"text-gray-300":"text-gray-700"}`,children:["Участники ",l.length>0&&`(${l.length} выбрано)`]}),a.jsx("div",{className:"flex flex-wrap gap-2",children:ve.map(W=>{const le=l.includes(W.id);return a.jsx("button",{onClick:()=>H(W.id),className:`px-3 py-1.5 rounded-lg transition-colors ${le?"bg-red-500 text-white":n==="dark"?"bg-gray-700 text-gray-300 hover:bg-gray-600":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`,children:W.name},W.id)})})]}),a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:d,onChange:W=>P(W.target.checked),className:"w-4 h-4"}),a.jsx("span",{className:`${n==="dark"?"text-gray-300":"text-gray-700"}`,children:"Удалить по дню недели"})]}),d&&a.jsxs("div",{className:"ml-6",children:[a.jsx("p",{className:`text-sm mb-2 ${n==="dark"?"text-gray-400":"text-gray-600"}`,children:"Выберите день недели:"}),a.jsx("div",{className:"flex gap-2 flex-wrap",children:N.map((W,le)=>a.jsx("button",{onClick:()=>E(le),className:`px-3 py-1 rounded-lg transition-colors ${j===le?"bg-red-500 text-white":n==="dark"?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-700"}`,children:W},le))})]}),a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:g,onChange:W=>$(W.target.checked),className:"w-4 h-4"}),a.jsx("span",{className:`${n==="dark"?"text-gray-300":"text-gray-700"}`,children:"Удалить по конкретным датам"})]}),g&&a.jsxs("div",{className:"ml-6 space-y-3",children:[a.jsxs("div",{className:"flex gap-2",children:[a.jsx("input",{type:"date",value:S,onChange:W=>C(W.target.value),className:`flex-1 px-4 py-2 rounded-lg border ${n==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-red-500`}),a.jsx("button",{onClick:Z,className:"px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors",children:"Добавить"})]}),I.length>0&&a.jsxs("div",{className:"space-y-2",children:[a.jsxs("p",{className:`text-sm ${n==="dark"?"text-gray-400":"text-gray-600"}`,children:["Выбранные даты (",I.length,"):"]}),a.jsx("div",{className:"flex flex-wrap gap-2",children:I.map(W=>a.jsxs("div",{className:`flex items-center gap-2 px-3 py-1 rounded-lg ${n==="dark"?"bg-gray-700":"bg-gray-100"}`,children:[a.jsx("span",{className:i,children:oe(W,"dd.MM.yyyy")}),a.jsx("button",{onClick:()=>ce(W),className:"p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors",children:a.jsx(Pt,{className:"w-3 h-3"})})]},W))})]})]}),a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:p,onChange:W=>K(W.target.checked),className:"w-4 h-4"}),a.jsx("span",{className:`${n==="dark"?"text-gray-300":"text-gray-700"}`,children:"Удалить по диапазону дат"})]}),p&&a.jsxs("div",{className:"ml-6 space-y-3",children:[a.jsxs("div",{className:"flex gap-2",children:[a.jsxs("div",{className:"flex-1",children:[a.jsx("label",{className:`block text-xs mb-1 ${n==="dark"?"text-gray-400":"text-gray-600"}`,children:"Начальная дата"}),a.jsx("input",{type:"date",value:F,onChange:W=>ne(W.target.value),className:`w-full px-4 py-2 rounded-lg border ${n==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-red-500`})]}),a.jsxs("div",{className:"flex-1",children:[a.jsx("label",{className:`block text-xs mb-1 ${n==="dark"?"text-gray-400":"text-gray-600"}`,children:"Конечная дата"}),a.jsx("input",{type:"date",value:B,onChange:W=>_(W.target.value),min:F,className:`w-full px-4 py-2 rounded-lg border ${n==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-red-500`})]})]}),F&&B&&a.jsxs("p",{className:`text-sm ${n==="dark"?"text-gray-400":"text-gray-600"}`,children:["Будет удалено: с ",oe(F,"dd.MM.yyyy")," по ",oe(B,"dd.MM.yyyy")]})]}),y&&a.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:y}),a.jsxs("div",{className:"flex gap-3",children:[a.jsxs("button",{onClick:q,disabled:w||!d&&!g&&!p,className:"flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2",children:[a.jsx(Et,{className:"w-4 h-4"}),w?"Удаление...":"Удалить слоты"]}),a.jsx("button",{onClick:r,className:`px-4 py-2 rounded-lg transition-colors ${n==="dark"?"bg-gray-700 hover:bg-gray-600":"bg-gray-200 hover:bg-gray-300"}`,children:"Отмена"})]})]})]})]})})})},N1=()=>{const{theme:r}=Ve(),[e,t]=A.useState("table"),[n,s]=A.useState("all"),[i,l]=A.useState(!1),[c,d]=A.useState(!1),[h,g]=A.useState(!1),[x,p]=A.useState(null),[T,j]=A.useState(null),[E,I]=A.useState(null),[D,S]=A.useState(null),[C,F]=A.useState("add-slot"),[ne,B]=A.useState({slotsThisWeek:0,activeMembers:0,upcomingSlots:0,completedSlots:0,recommendedToAdd:0,topMembers:[]}),[_,y]=A.useState(!1);A.useEffect(()=>{k()},[]),A.useEffect(()=>{const q=window.matchMedia("(max-width: 1023px)"),W=Ee=>{y(Ee.matches)};W(q);const le=Ee=>W(Ee);return q.addEventListener("change",le),()=>q.removeEventListener("change",le)},[]),A.useEffect(()=>{_&&e==="table"&&t("week")},[_,e]);const b=q=>{const W=new Date;W.setHours(0,0,0,0);const le=new Date(q.date);if(le.setHours(0,0,0,0),le>W)return!0;if(le.getTime()===W.getTime()){const L=new Date,V=L.getHours()*60+L.getMinutes();return q.slots.some(X=>{if(X.endDate){const ee=new Date(X.endDate);if(ee.setHours(0,0,0,0),ee>W)return!0;if(ee.getTime()===W.getTime()){const[ke,pe]=X.end.split(":").map(Number);return ke*60+pe>V}return!1}const[se,J]=X.end.split(":").map(Number);return se*60+J>V})}return q.slots.some(L=>{if(L.endDate){const V=new Date(L.endDate);return V.setHours(0,0,0,0),V>=W}return!1})},w=q=>{var W;return((W=ve.find(le=>le.id===q))==null?void 0:W.name)||q},k=async()=>{try{const q=Vl(new Date),W=oe(q[0],"yyyy-MM-dd"),le=oe(q[6],"yyyy-MM-dd"),[Ee,L]=await Promise.all([br(),hr()]),V=Ee.filter(pe=>pe.date>=W&&pe.date<=le),X=new Set([...V.map(pe=>pe.userId),...L.map(pe=>pe.userId)]),se=V.filter(b).length,J=V.length-se,z=Math.max(0,10-V.length),ee={};V.forEach(pe=>{ee[pe.userId]=(ee[pe.userId]||0)+1});const ke=Object.entries(ee).sort((pe,Ne)=>Ne[1]-pe[1]).slice(0,3).map(([pe])=>w(pe));B({slotsThisWeek:V.length,activeMembers:X.size,upcomingSlots:se,completedSlots:J,recommendedToAdd:z,topMembers:ke})}catch(q){console.error("Error loading stats:",q)}},N=()=>{I(null),l(!0)},f=q=>{I(q),l(!0)},O=q=>{p(q),S(null),g(!0)},Q=q=>{S(q),p(q.type),g(!0)},P=()=>{d(!0)},$=()=>{l(!1),d(!1),g(!1),p(null),I(null),S(null),setTimeout(()=>{window.location.reload()},500)},K=r==="dark"?"text-white":"text-gray-900",H=r==="dark"?"text-gray-300":"text-gray-700",Z=`rounded-xl sm:rounded-2xl p-4 sm:p-5 border ${r==="dark"?"bg-[#0A0A0A]/40 border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)]":"bg-white border-gray-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"}`,ce=q=>{if(q==="table"&&_){alert("Этот вид недоступен на мобильных устройствах. Пожалуйста, воспользуйтесь ПК.");return}t(q)};return a.jsx(qt,{children:a.jsxs("div",{className:"space-y-5 sm:space-y-7",children:[a.jsxs("div",{className:`relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-7 border-2 shadow-2xl ${r==="dark"?"bg-gradient-to-br from-[#0b0f17] via-[#0f1b2d] to-[#0b0f17] border-[#4E6E49]/30":"bg-gradient-to-br from-white via-green-50/60 to-white border-green-200"}`,children:[a.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[a.jsx("div",{className:"absolute -top-32 -left-16 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/24 via-transparent to-transparent blur-3xl"}),a.jsx("div",{className:"absolute top-0 right-0 w-[26rem] h-[26rem] bg-gradient-to-bl from-blue-500/18 via-purple-500/12 to-transparent blur-3xl"}),a.jsx("div",{className:"absolute bottom-[-140px] left-14 w-80 h-80 bg-gradient-to-tr from-amber-300/14 via-[#4E6E49]/12 to-transparent blur-3xl"})]}),a.jsx("div",{className:"relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] items-start",children:a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsxs("div",{className:"flex items-start gap-3",children:[a.jsx("div",{className:"p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg",children:a.jsx(Ac,{className:"w-7 h-7 text-[#4E6E49]"})}),a.jsxs("div",{className:"space-y-2",children:[a.jsx("h1",{className:`text-3xl sm:text-4xl font-extrabold ${K}`,children:"Расписание команды"}),a.jsx("p",{className:`${H} text-sm sm:text-base leading-snug max-w-2xl`,children:"Здесь можно управлять слотами, сменами и статусами."})]})]}),a.jsx("div",{className:`rounded-2xl border p-4 sm:p-5 backdrop-blur ${r==="dark"?"border-white/10 bg-white/5":"border-green-100 bg-white/80"}`,children:a.jsxs("div",{className:"grid sm:grid-cols-3 gap-4",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-xs uppercase tracking-wide text-[#4E6E49] font-semibold",children:"Рекомендуется добавить"}),a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsxs("span",{className:"p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-200 border border-emerald-500/30",children:["+",ne.recommendedToAdd]}),a.jsx("p",{className:`text-sm ${H}`,children:"минимум 10 слотов в неделю"})]})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-xs uppercase tracking-wide text-sky-500 font-semibold",children:"Завершено слотов"}),a.jsx("p",{className:"text-3xl font-black text-slate-900 dark:text-white",children:ne.completedSlots}),a.jsx("p",{className:"text-xs text-gray-500 dark:text-gray-400",children:"на этой неделе"})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-xs uppercase tracking-wide text-purple-500 font-semibold",children:"Активные участники"}),a.jsx("div",{className:"flex flex-wrap gap-2",children:ne.topMembers.length>0?ne.topMembers.map(q=>a.jsx("span",{className:"px-3 py-1 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200",children:q},q)):a.jsx("span",{className:"text-sm text-gray-500 dark:text-gray-400",children:"Нет данных"})})]})]})})]})})]}),a.jsxs("div",{className:`rounded-2xl border ${r==="dark"?"border-gray-800 bg-[#0f1623]":"border-gray-200 bg-white"} shadow-xl p-4 sm:p-5 space-y-5`,children:[a.jsx("div",{className:"space-y-3",children:a.jsxs("div",{className:"flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between",children:[a.jsxs("div",{className:`flex rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-900/70":"border-gray-200 bg-gray-50"} overflow-hidden`,children:[a.jsxs("button",{onClick:()=>ce("table"),"aria-disabled":_,className:`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all ${e==="table"&&!_?"bg-[#4E6E49] text-white shadow-lg":_?"text-gray-400 cursor-not-allowed":r==="dark"?"text-gray-300 hover:bg-gray-800":"text-gray-700 hover:bg-white"}`,children:[a.jsx(Mc,{className:"w-4 h-4"}),"Таблица"]}),a.jsxs("button",{onClick:()=>ce("week"),className:`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all ${e==="week"?"bg-[#4E6E49] text-white shadow-lg":r==="dark"?"text-gray-300 hover:bg-gray-800":"text-gray-700 hover:bg-white"}`,children:[a.jsx(mr,{className:"w-4 h-4"}),"Неделя"]})]}),a.jsx("div",{className:"flex flex-wrap gap-2",children:[{key:"all",label:"Все",icon:a.jsx(mr,{className:"w-4 h-4"})},{key:"upcoming",label:"Предстоящие",icon:a.jsx(zn,{className:"w-4 h-4"})},{key:"completed",label:"Завершённые",icon:a.jsx(Ac,{className:"w-4 h-4"})}].map(q=>a.jsxs("button",{onClick:()=>s(q.key),className:`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${n===q.key?"bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white border-transparent shadow-lg":r==="dark"?"border-gray-800 bg-gray-900/70 text-gray-200 hover:border-[#4E6E49]/40":"border-gray-200 bg-gray-50 text-gray-700 hover:border-[#4E6E49]/40"}`,children:[q.icon,q.label]},q.key))})]})}),a.jsxs("div",{className:`rounded-2xl border ${r==="dark"?"border-gray-800 bg-gray-900/70":"border-gray-100 bg-gray-50"} p-3 sm:p-4 space-y-3`,children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("p",{className:`text-sm font-semibold ${K}`,children:"Действие"}),a.jsx("span",{className:"text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400",children:"выбор задачи"})]}),a.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:[{key:"add-slot",label:"Добавить слот",desc:"Разовое или серия",icon:a.jsx(If,{className:"w-5 h-5"}),tone:"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800",action:N},{key:"delete-slots",label:"Удалить слоты",desc:"Очистить интервалы",icon:a.jsx(Et,{className:"w-5 h-5"}),tone:"bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:border-rose-800",action:P},{key:"dayoff",label:"Выходной",desc:"Отметить отдых",icon:a.jsx(Uo,{className:"w-5 h-5"}),tone:"bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-100 dark:border-teal-800",action:()=>O("dayoff")},{key:"sick",label:"Больничный",desc:"Подтвердить отсутствие",icon:a.jsx(bf,{className:"w-5 h-5"}),tone:"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-700",action:()=>O("sick")},{key:"vacation",label:"Отпуск",desc:"Запланировать отпуск",icon:a.jsx(Eu,{className:"w-5 h-5"}),tone:"bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-100 dark:border-sky-800",action:()=>O("vacation")}].map(q=>a.jsxs("button",{onClick:()=>{F(q.key),q.action()},className:`text-left rounded-xl border px-3 py-3 transition-all shadow-sm flex items-start gap-3 h-full ${C===q.key?`${q.tone} ring-2 ring-[#4E6E49]/50 shadow-lg`:`${r==="dark"?"border-gray-800 bg-gray-950/60 text-gray-100":"border-gray-200 bg-white text-gray-900"} hover:-translate-y-0.5 hover:shadow-md`}`,children:[a.jsx("span",{className:`p-2 rounded-lg ${C===q.key?"bg-white/30":r==="dark"?"bg-gray-800":"bg-gray-100"}`,children:q.icon}),a.jsxs("span",{className:"flex flex-col whitespace-normal leading-snug gap-0.5",children:[a.jsx("span",{className:"text-sm font-semibold",children:q.label}),a.jsx("span",{className:"text-xs text-gray-500 dark:text-gray-400",children:q.desc})]})]},q.key))})]}),a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsx("p",{className:`text-sm font-semibold ${K}`,children:"Участники"}),a.jsxs("div",{className:"flex gap-2 overflow-x-auto pb-1",children:[a.jsx("button",{onClick:()=>j(null),className:`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition ${T===null?"bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg":r==="dark"?"bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`,children:"Все участники"}),ve.map(q=>a.jsxs("button",{onClick:()=>j(q.id),className:`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition flex items-center gap-2 ${T===q.id?"bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg":r==="dark"?"bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40":"bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40"}`,children:[a.jsx("span",{className:"inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#4E6E49]/30 to-blue-500/30 text-xs font-bold",children:q.name.charAt(0)}),q.name]},q.id))]})]})]}),a.jsxs("div",{className:Z,children:[a.jsxs("div",{className:"flex items-center justify-between mb-4",children:[a.jsxs("div",{children:[a.jsx("p",{className:`text-sm sm:text-base font-semibold ${K}`,children:"Расписание"}),a.jsx("p",{className:`text-xs sm:text-sm ${H}`,children:"Слоты и статусы за выбранную неделю"})]}),_&&a.jsx("span",{className:"text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300",children:"Мобильный вид"})]}),e==="table"?_?a.jsx("div",{className:`rounded-lg border-2 border-dashed p-4 text-center ${r==="dark"?"bg-[#1a1a1a]/60 border-gray-800 text-gray-300":"bg-gray-50 border-gray-200 text-gray-600"}`,children:a.jsxs("div",{className:"flex flex-col items-center gap-2",children:[a.jsx(Mc,{className:`w-8 h-8 ${r==="dark"?"text-gray-400":"text-gray-500"}`}),a.jsx("p",{className:"text-sm font-semibold",children:"Табличный вид недоступен на мобильных устройствах"}),a.jsx("p",{className:"text-xs",children:"Откройте ApeVault Panel на ПК, чтобы использовать таблицу."})]})}):a.jsx(v1,{selectedUserId:T,slotFilter:n,onEditSlot:f,onEditStatus:Q}):a.jsx(w1,{selectedUserId:T,slotFilter:n,onEditSlot:f,onEditStatus:Q})]}),i&&a.jsx(_1,{slot:E,onClose:$,onSave:$}),c&&a.jsx(k1,{onClose:$,onSave:$}),h&&x&&a.jsx(E1,{type:x,status:D,onClose:$,onSave:$})]})})},j1=({onClose:r,onSave:e,editingEarning:t})=>{const{user:n}=nt(),{isAdmin:s}=yt(),{theme:i}=Ve(),l=i==="dark"?"text-white":"text-gray-900",c=!!t,[d,h]=A.useState((t==null?void 0:t.date)||oe(new Date,"yyyy-MM-dd")),[g,x]=A.useState((t==null?void 0:t.slotId)||""),[p,T]=A.useState((t==null?void 0:t.amount.toString())||""),[j,E]=A.useState((t==null?void 0:t.poolAmount.toString())||""),[I,D]=A.useState(t?t.participants.length>1:!1),[S,C]=A.useState(t?t.participants.filter(f=>f!==t.userId):[]),[F,ne]=A.useState([]),[B,_]=A.useState(""),[y,b]=A.useState(!1);A.useEffect(()=>{w()},[d,n,c]);const w=async()=>{if(!(!s&&!n&&!c))try{const f=c||s?await br(void 0,d):await br(n.id,d),O=Do(),Q=oe(O,"yyyy-MM-dd"),P=c?f:f.filter($=>{if(d!==Q)return s;const K=$.slots[$.slots.length-1];return cu(K.end,O)||s});ne(P)}catch(f){console.error("Error loading slots:",f)}},k=f=>{S.includes(f)?C(S.filter(O=>O!==f)):C([...S,f])},N=async()=>{if(!s&&!n&&!c){_("Пользователь не найден");return}_(""),b(!0);try{if(!g){_("Выберите слот"),b(!1);return}if(!p||!j){_("Заполните все поля"),b(!1);return}const f=parseFloat(p),O=parseFloat(j);if(isNaN(f)||isNaN(O)||f<0||O<0){_("Введите корректные суммы"),b(!1);return}const Q=F.find(P=>P.id===g);if(!Q&&!c){_("Выбранный слот не найден"),b(!1);return}if(!s&&!c){const P=Do(),$=oe(P,"yyyy-MM-dd");if(d!==$){_("Можно добавить заработок только за сегодня"),b(!1);return}if(Q){const K=Q.slots[Q.slots.length-1];if(!cu(K.end,P)){_("Слот еще идет или еще не начат. Можно добавить заработок после 21:00 МСК или после окончания слота"),b(!1);return}}}if(c&&t)await t_(t.id,{date:d,amount:f,poolAmount:O,slotId:g});else{const P=s&&!n?S.length>0?S:[]:I&&S.length>0?[...S,n.id]:[n.id];if(P.length===0){_("Выберите хотя бы одного участника"),b(!1);return}await e_({userId:P[0],date:d,amount:f,poolAmount:O,slotId:g,participants:P})}e()}catch(f){console.error("Error saving earnings:",f);const O=f.message||f.code||"Ошибка при сохранении";_(O)}finally{b(!1)}};return a.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto touch-manipulation",children:a.jsx("div",{className:`w-full max-w-md rounded-lg sm:rounded-xl shadow-xl ${i==="dark"?"bg-[#1a1a1a]":"bg-white"} max-h-[90vh] overflow-y-auto my-4 sm:my-8`,children:a.jsxs("div",{className:"p-4 sm:p-6",children:[a.jsxs("div",{className:"flex items-center justify-between mb-4 sm:mb-6",children:[a.jsx("h3",{className:`text-lg sm:text-xl font-bold ${l} pr-2`,children:c?"Редактировать заработок":"Добавить заработок"}),a.jsx("button",{onClick:r,className:`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${i==="dark"?"hover:bg-gray-700 active:bg-gray-600":"hover:bg-gray-100 active:bg-gray-200"} transition-colors touch-manipulation`,"aria-label":"Закрыть",children:a.jsx(Pt,{className:"w-4 h-4 sm:w-5 sm:h-5"})})]}),a.jsxs("div",{className:"space-y-3 sm:space-y-4",children:[a.jsxs("div",{children:[a.jsxs("label",{className:`flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm font-medium mb-2 gap-1 sm:gap-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:[a.jsx("span",{children:"Дата"}),!s&&!c&&a.jsx("span",{className:"text-[10px] sm:text-xs text-gray-400 whitespace-nowrap",children:"Доступна только текущая дата"})]}),a.jsx("input",{type:"date",value:d,onChange:f=>h(f.target.value),disabled:!s&&!c,className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] disabled:opacity-50 disabled:cursor-not-allowed`}),c&&!s&&a.jsx("p",{className:`mt-1 text-xs ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Только администратор может изменить дату"})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Слот"}),a.jsxs("select",{value:g,onChange:f=>x(f.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,children:[a.jsx("option",{value:"",children:"Выберите слот"}),F.map(f=>a.jsx("option",{value:f.id,children:f.slots.map(O=>`${O.start}-${O.end}`).join(", ")},f.id)),c&&t&&!F.find(f=>f.id===t.slotId)&&a.jsx("option",{value:t.slotId,disabled:!0,children:"[Текущий слот - не найден]"})]}),c&&t&&!F.find(f=>f.id===t.slotId)&&a.jsx("p",{className:`mt-1 text-xs ${i==="dark"?"text-gray-400":"text-gray-500"}`,children:"Текущий слот не найден в списке. Выберите другой слот или оставьте текущий."})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Сумма заработка (руб.)"}),a.jsx("input",{type:"number",value:p,onChange:f=>T(f.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"0",min:"0",step:"100"})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-xs sm:text-sm font-medium mb-2 ${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Сумма в пул (руб.)"}),a.jsx("input",{type:"number",value:j,onChange:f=>E(f.target.value),className:`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${i==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"0",min:"0",step:"100"})]}),!c&&a.jsxs(a.Fragment,{children:[a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:I,onChange:f=>D(f.target.checked),className:"w-4 h-4"}),a.jsx("span",{className:`${i==="dark"?"text-gray-300":"text-gray-700"}`,children:"Отметить несколько участников"})]}),(I||s&&!n)&&a.jsx("div",{className:"ml-6 space-y-2",children:ve.filter(f=>!n||f.id!==n.id).map(f=>a.jsxs("label",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"checkbox",checked:S.includes(f.id),onChange:()=>k(f.id),className:"w-4 h-4"}),a.jsx("span",{className:i==="dark"?"text-gray-300":"text-gray-700",children:f.name})]},f.id))})]}),B&&a.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:B}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2",children:[a.jsx("button",{onClick:N,disabled:y,className:"flex-1 px-4 py-2.5 sm:py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100",children:y?"Сохранение...":"Сохранить"}),a.jsx("button",{onClick:r,className:`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${i==="dark"?"bg-gray-700 hover:bg-gray-600 active:bg-gray-500":"bg-gray-200 hover:bg-gray-300 active:bg-gray-400"}`,children:"Отмена"})]})]})]})})})},T1=({earnings:r})=>{const{theme:e}=Ve(),t=Xs(),n=oe(t.start,"yyyy-MM-dd"),s=oe(t.end,"yyyy-MM-dd"),i=oe(new Date(new Date().getFullYear(),new Date().getMonth(),1),"yyyy-MM-dd"),l=oe(new Date(new Date().getFullYear(),new Date().getMonth()+1,0),"yyyy-MM-dd"),c=(p,T,j)=>{const E=r.filter(S=>(S.participants&&S.participants.length>0?[...S.participants,S.userId]:[S.userId]).includes(p)&&S.date>=T&&S.date<=j),I=E.reduce((S,C)=>{const F=C.participants&&C.participants.length>0?C.participants.length:1;return S+C.amount/F},0),D=E.reduce((S,C)=>{const F=C.participants&&C.participants.length>0?C.participants.length:1;return S+C.poolAmount/F},0);return{totalEarnings:I,totalPool:D,count:E.length}},d=ve.reduce((p,T)=>{const j=c(T.id,n,s);return p+j.totalEarnings},0),h=ve.reduce((p,T)=>{const j=c(T.id,n,s);return p+j.totalPool},0),g=ve.reduce((p,T)=>{const j=c(T.id,i,l);return p+j.totalEarnings},0),x=ve.reduce((p,T)=>{const j=c(T.id,i,l);return p+j.totalPool},0);return a.jsx("div",{className:`rounded-2xl ${e==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-lg border-2 ${e==="dark"?"border-gray-800":"border-gray-200"} overflow-hidden`,children:a.jsxs("div",{className:"p-6",children:[a.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[a.jsx("div",{className:`p-2 rounded-lg ${e==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:a.jsx(Vr,{className:`w-5 h-5 ${e==="dark"?"text-blue-400":"text-blue-600"}`})}),a.jsx("h3",{className:`text-xl font-bold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Статистика заработка"})]}),a.jsxs("div",{className:"mb-6",children:[a.jsx("h4",{className:`text-lg font-semibold mb-4 px-2 ${e==="dark"?"text-white":"text-gray-900"}`,children:"За неделю"}),a.jsx("div",{className:"overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800",children:a.jsxs("table",{className:"w-full",children:[a.jsx("thead",{children:a.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/50":"bg-gray-100"}`,children:[a.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Участник"}),a.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Заработок"}),a.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Пул"})]})}),a.jsxs("tbody",{children:[ve.map(p=>{const T=c(p.id,n,s);return a.jsxs("tr",{className:`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${e==="dark"?"hover:bg-gray-700/30":"hover:bg-gray-50"}`,children:[a.jsx("td",{className:`px-4 py-3 font-medium ${e==="dark"?"text-white":"text-gray-900"}`,children:p.name}),a.jsxs("td",{className:"px-4 py-3 text-right font-semibold text-[#4E6E49]",children:[T.totalEarnings.toFixed(2)," ₽"]}),a.jsxs("td",{className:`px-4 py-3 text-right font-semibold ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[T.totalPool.toFixed(2)," ₽"]})]},p.id)}),a.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/70":"bg-gray-100"} font-bold border-t-2 border-gray-800/50 dark:border-gray-800`,children:[a.jsx("td",{className:`px-4 py-3 ${e==="dark"?"text-white":"text-gray-900"}`,children:"Итого команды"}),a.jsxs("td",{className:"px-4 py-3 text-right text-[#4E6E49]",children:[d.toFixed(2)," ₽"]}),a.jsxs("td",{className:`px-4 py-3 text-right ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[h.toFixed(2)," ₽"]})]})]})]})})]}),a.jsxs("div",{children:[a.jsx("h4",{className:`text-lg font-semibold mb-4 px-2 ${e==="dark"?"text-white":"text-gray-900"}`,children:"За месяц"}),a.jsx("div",{className:"overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800",children:a.jsxs("table",{className:"w-full",children:[a.jsx("thead",{children:a.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/50":"bg-gray-100"}`,children:[a.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Участник"}),a.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Заработок"}),a.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${e==="dark"?"text-white":"text-gray-900"}`,children:"Пул"})]})}),a.jsxs("tbody",{children:[ve.map(p=>{const T=c(p.id,i,l);return a.jsxs("tr",{className:`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${e==="dark"?"hover:bg-gray-700/30":"hover:bg-gray-50"}`,children:[a.jsx("td",{className:`px-4 py-3 font-medium ${e==="dark"?"text-white":"text-gray-900"}`,children:p.name}),a.jsxs("td",{className:"px-4 py-3 text-right font-semibold text-[#4E6E49]",children:[T.totalEarnings.toFixed(2)," ₽"]}),a.jsxs("td",{className:`px-4 py-3 text-right font-semibold ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[T.totalPool.toFixed(2)," ₽"]})]},p.id)}),a.jsxs("tr",{className:`${e==="dark"?"bg-gray-700/70":"bg-gray-100"} font-bold border-t-2 border-gray-800/50 dark:border-gray-800`,children:[a.jsx("td",{className:`px-4 py-3 ${e==="dark"?"text-white":"text-gray-900"}`,children:"Итого команды"}),a.jsxs("td",{className:"px-4 py-3 text-right text-[#4E6E49]",children:[g.toFixed(2)," ₽"]}),a.jsxs("td",{className:`px-4 py-3 text-right ${e==="dark"?"text-purple-400":"text-purple-600"}`,children:[x.toFixed(2)," ₽"]})]})]})]})})]})]})})},I1=({earnings:r,onEdit:e,onDelete:t})=>{const{theme:n}=Ve(),{user:s}=nt(),{isAdmin:i}=yt(),[l,c]=A.useState(null),d=async p=>{if(confirm("Вы уверены, что хотите удалить эту запись о заработке?")){c(p);try{await r_(p),t()}catch(T){console.error("Error deleting earnings:",T),alert("Ошибка при удалении записи")}finally{c(null)}}},h=p=>{var T;return((T=ve.find(j=>j.id===p))==null?void 0:T.name)||p},g=p=>i||p.userId===(s==null?void 0:s.id),x=[...r].sort((p,T)=>T.date.localeCompare(p.date));return x.length===0?a.jsxs("div",{className:`rounded-2xl p-8 text-center border-2 ${n==="dark"?"bg-[#1a1a1a] border-gray-800":"bg-white border-gray-200"} shadow-md`,children:[a.jsx("p",{className:`${n==="dark"?"text-gray-400":"text-gray-600"} text-lg`,children:"Пока нет записей о заработке"}),a.jsx("p",{className:"text-gray-500 text-sm mt-2",children:"Добавьте первую запись, чтобы начать отслеживать доходы команды"})]}):a.jsx("div",{className:`rounded-2xl ${n==="dark"?"bg-[#1a1a1a]":"bg-white"} shadow-lg border-2 ${n==="dark"?"border-gray-800":"border-gray-200"} overflow-hidden`,children:a.jsxs("div",{className:"p-6",children:[a.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[a.jsx("div",{className:`p-2 rounded-lg ${n==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:a.jsx(Pc,{className:`w-5 h-5 ${n==="dark"?"text-blue-400":"text-blue-600"}`})}),a.jsx("h3",{className:`text-xl font-bold ${n==="dark"?"text-white":"text-gray-900"}`,children:"Все записи о заработке"})]}),a.jsx("div",{className:"overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800",children:a.jsxs("table",{className:"w-full",children:[a.jsx("thead",{children:a.jsxs("tr",{className:`${n==="dark"?"bg-gray-700/50":"bg-gray-100"}`,children:[a.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${n==="dark"?"text-white":"text-gray-900"}`,children:"Дата"}),a.jsx("th",{className:`px-4 py-3 text-left text-sm font-semibold ${n==="dark"?"text-white":"text-gray-900"}`,children:"Участник"}),a.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${n==="dark"?"text-white":"text-gray-900"}`,children:"Заработок"}),a.jsx("th",{className:`px-4 py-3 text-right text-sm font-semibold ${n==="dark"?"text-white":"text-gray-900"}`,children:"Пул"}),a.jsx("th",{className:`px-4 py-3 text-center text-sm font-semibold ${n==="dark"?"text-white":"text-gray-900"}`,children:"Действия"})]})}),a.jsx("tbody",{children:x.map(p=>{const T=g(p);return a.jsxs("tr",{className:`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${n==="dark"?"hover:bg-gray-700/30":"hover:bg-gray-50"}`,children:[a.jsx("td",{className:`px-4 py-3 font-medium ${n==="dark"?"text-white":"text-gray-900"}`,children:oe(new Date(p.date+"T00:00:00"),"dd.MM.yyyy")}),a.jsx("td",{className:`px-4 py-3 font-medium ${n==="dark"?"text-white":"text-gray-900"}`,children:h(p.userId)}),a.jsxs("td",{className:"px-4 py-3 text-right font-semibold text-[#4E6E49]",children:[p.amount.toFixed(2)," ₽"]}),a.jsxs("td",{className:`px-4 py-3 text-right font-semibold ${n==="dark"?"text-purple-400":"text-purple-600"}`,children:[p.poolAmount.toFixed(2)," ₽"]}),a.jsx("td",{className:"px-4 py-3 text-center",children:T?a.jsxs("div",{className:"flex items-center justify-center gap-2",children:[a.jsx("button",{onClick:()=>e(p),className:`p-2 rounded-lg transition-colors ${n==="dark"?"hover:bg-gray-600 text-blue-400":"hover:bg-gray-200 text-blue-600"}`,title:"Редактировать",children:a.jsx(Pc,{className:"w-4 h-4"})}),a.jsx("button",{onClick:()=>d(p.id),disabled:l===p.id,className:`p-2 rounded-lg transition-colors ${n==="dark"?"hover:bg-gray-600 text-red-400":"hover:bg-gray-200 text-red-600"} disabled:opacity-50 disabled:cursor-not-allowed`,title:"Удалить",children:a.jsx(Et,{className:"w-4 h-4"})})]}):a.jsx("span",{className:`text-sm ${n==="dark"?"text-gray-500":"text-gray-400"}`,children:"—"})})]},p.id)})})]})})]})})},S1=()=>{const{theme:r}=Ve(),[e,t]=A.useState(!1),[n,s]=A.useState(null),[i,l]=A.useState([]),[c,d]=A.useState(!0),[h,g]=A.useState({weekTotal:0,weekPool:0,monthTotal:0,monthPool:0}),x=r==="dark"?"text-white":"text-gray-900",p=r==="dark"?"bg-[#1a1a1a]":"bg-white",T=()=>{const S=Xs(),C=oe(S.start,"yyyy-MM-dd"),F=oe(S.end,"yyyy-MM-dd"),ne=oe(new Date(new Date().getFullYear(),new Date().getMonth(),1),"yyyy-MM-dd"),B=oe(new Date(new Date().getFullYear(),new Date().getMonth()+1,0),"yyyy-MM-dd"),_=i.filter(b=>b.date>=C&&b.date<=F),y=i.filter(b=>b.date>=ne&&b.date<=B);g({weekTotal:_.reduce((b,w)=>b+w.amount,0),weekPool:_.reduce((b,w)=>b+w.poolAmount,0),monthTotal:y.reduce((b,w)=>b+w.amount,0),monthPool:y.reduce((b,w)=>b+w.poolAmount,0)})};A.useEffect(()=>{j()},[]),A.useEffect(()=>{i.length>0&&T()},[i]);const j=async()=>{d(!0);try{const S=await Ms();l(S)}catch(S){console.error("Error loading earnings:",S)}finally{d(!1)}},E=S=>{s(S),t(!0)},I=()=>{t(!1),s(null)},D=()=>{t(!1),s(null),j()};return a.jsx(qt,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${p} shadow-xl border-2 ${r==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white"} relative overflow-hidden`,children:[a.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"}),a.jsx("div",{className:"absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"}),a.jsx("div",{className:"relative z-10",children:a.jsxs("div",{className:"flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6",children:[a.jsxs("div",{className:"flex-1 min-w-0 space-y-3 sm:space-y-4",children:[a.jsxs("div",{className:"flex items-center gap-3 sm:gap-4",children:[a.jsx("div",{className:"p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0 bg-gradient-to-br from-[#4E6E49] to-emerald-700 text-white transform transition-transform active:scale-95 sm:hover:scale-110",children:a.jsx(ai,{className:"w-5 h-5 sm:w-7 sm:h-7"})}),a.jsx("div",{className:"flex-1 min-w-0",children:a.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${x} flex items-center gap-2 sm:gap-3`,children:[a.jsx("span",{className:"bg-gradient-to-r from-[#4E6E49] via-emerald-700 to-yellow-600 text-transparent bg-clip-text",children:"Заработок команды"}),a.jsx(rn,{className:`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${r==="dark"?"text-yellow-400":"text-yellow-500"} animate-pulse`})]})})]}),a.jsx("p",{className:`text-sm sm:text-base font-medium ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Отслеживайте доходы и вклад каждого участника в общий успех"}),a.jsx("div",{className:"flex flex-wrap gap-2",children:[{href:"#earn-stats",label:"Обзор"},{href:"#earn-history",label:"История"},{href:"#earn-insights",label:"Инсайты"}].map(S=>a.jsx("a",{href:S.href,className:`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${r==="dark"?"border-white/10 bg-white/5 text-white hover:border-[#4E6E49]/50":"border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:S.label},S.href))})]}),a.jsxs("button",{onClick:()=>t(!0),className:"w-full lg:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transform touch-manipulation",children:[a.jsx(Ns,{className:"w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"}),a.jsx("span",{className:"whitespace-nowrap",children:"Добавить заработок"})]})]})}),a.jsxs("div",{id:"earn-stats",className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6",children:[a.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-blue-500/10 border-blue-500/30":"bg-blue-50 border-blue-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[a.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:a.jsx(Vr,{className:`w-5 h-5 ${r==="dark"?"text-blue-400":"text-blue-600"}`})}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Неделя"})]}),a.jsxs("p",{className:`text-2xl font-bold ${r==="dark"?"text-blue-400":"text-blue-600"}`,children:[h.weekTotal.toFixed(2)," ₽"]})]}),a.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-purple-500/10 border-purple-500/30":"bg-purple-50 border-purple-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[a.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-purple-500/20":"bg-purple-100"}`,children:a.jsx(Dc,{className:`w-5 h-5 ${r==="dark"?"text-purple-400":"text-purple-600"}`})}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Пул за неделю"})]}),a.jsxs("p",{className:`text-2xl font-bold ${r==="dark"?"text-purple-400":"text-purple-600"}`,children:[h.weekPool.toFixed(2)," ₽"]})]}),a.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-[#4E6E49]/10 border-[#4E6E49]/30":"bg-green-50 border-green-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[a.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-[#4E6E49]/20":"bg-green-100"}`,children:a.jsx(Pf,{className:"w-5 h-5 text-[#4E6E49]"})}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Месяц"})]}),a.jsxs("p",{className:"text-2xl font-bold text-[#4E6E49]",children:[h.monthTotal.toFixed(2)," ₽"]})]}),a.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-orange-500/10 border-orange-500/30":"bg-orange-50 border-orange-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[a.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-orange-500/20":"bg-orange-100"}`,children:a.jsx(Dc,{className:`w-5 h-5 ${r==="dark"?"text-orange-400":"text-orange-600"}`})}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:"Пул за месяц"})]}),a.jsxs("p",{className:`text-2xl font-bold ${r==="dark"?"text-orange-400":"text-orange-600"}`,children:[h.monthPool.toFixed(2)," ₽"]})]})]}),a.jsx("div",{className:"hidden sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-800/50 dark:border-gray-800",children:a.jsx("h2",{className:`text-base sm:text-lg md:text-xl font-semibold ${r==="dark"?"text-white":"text-gray-900"}`,children:"Управление заработком"})})]}),c?a.jsx("div",{className:`rounded-xl p-8 text-center border-2 ${r==="dark"?"bg-[#1a1a1a] border-gray-800":"bg-white border-gray-200"} shadow-md`,children:a.jsxs("div",{className:"flex flex-col items-center gap-3",children:[a.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E6E49]"}),a.jsx("p",{className:r==="dark"?"text-gray-400":"text-gray-600",children:"Загрузка данных..."})]})}):a.jsxs(a.Fragment,{children:[a.jsxs("div",{id:"earn-history",className:"space-y-6",children:[a.jsx(T1,{earnings:i}),a.jsx(I1,{earnings:i,onEdit:E,onDelete:j})]}),a.jsxs("div",{id:"earn-insights",className:`rounded-2xl p-6 ${p} border ${r==="dark"?"border-white/10":"border-gray-200"} shadow-lg space-y-4`,children:[a.jsx("div",{className:"flex items-center justify-between",children:a.jsxs("div",{children:[a.jsx("p",{className:`text-sm font-semibold ${r==="dark"?"text-gray-300":"text-gray-700"}`,children:"Инсайты"}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Где мы зарабатываем больше всего"})]})}),a.jsx("div",{className:"grid sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[{label:"Средний чек (нед.)",value:`${(h.weekTotal/Math.max(i.length,1)).toFixed(0)} ₽`,tone:"bg-blue-500/10 text-blue-600 dark:text-blue-200"},{label:"Доля пула (нед.)",value:h.weekTotal?`${Math.round(h.weekPool/h.weekTotal*100)}%`:"0%",tone:"bg-purple-500/10 text-purple-600 dark:text-purple-200"},{label:"Средний чек (мес.)",value:`${(h.monthTotal/Math.max(i.length,1)).toFixed(0)} ₽`,tone:"bg-emerald-500/10 text-emerald-600 dark:text-emerald-200"},{label:"Доля пула (мес.)",value:h.monthTotal?`${Math.round(h.monthPool/h.monthTotal*100)}%`:"0%",tone:"bg-orange-500/10 text-orange-600 dark:text-orange-200"}].map(S=>a.jsxs("div",{className:`p-3 rounded-xl ${S.tone} border ${r==="dark"?"border-white/10":"border-transparent"} shadow-sm`,children:[a.jsx("p",{className:"text-[11px] uppercase tracking-wide opacity-70",children:S.label}),a.jsx("p",{className:"text-xl font-extrabold",children:S.value})]},S.label))})]})]}),e&&a.jsx(j1,{onClose:I,onSave:D,editingEarning:n})]})})},eg=(r,e=0,t=0,n=0)=>{let s=0;(r.daysOff===0||r.daysOff<=2)&&(s+=10),r.sickDays<=7&&(s+=10),r.vacationDays<=7&&(s+=10),e>=30?s+=25:e>=20&&(s+=15),t>=6e3?s+=30:t>=3e3&&(s+=15);const i=Math.min(r.referrals*5,30);return s+=i,n>50&&(s+=15),Math.min(s,100)},tg=(r,e=0,t=0,n=0)=>{const s=r.daysOff===0||r.daysOff<=2?10:0,i=r.sickDays<=7?10:0,l=r.vacationDays<=7?10:0;let c=0;e>=30?c=25:e>=20&&(c=15);let d=0;t>=6e3?d=30:t>=3e3&&(d=15);const h=Math.min(r.referrals*5,30),g=n>50?15:0,x=Math.min(s+i+l+c+d+h+g,100);return{daysOff:r.daysOff,daysOffPoints:s,sickDays:r.sickDays,sickDaysPoints:i,vacationDays:r.vacationDays,vacationDaysPoints:l,weeklyHours:e,weeklyHoursPoints:c,weeklyEarnings:t,weeklyEarningsPoints:d,referrals:r.referrals,referralsPoints:h,weeklyMessages:n,weeklyMessagesPoints:g,totalRating:x}},A1=r=>r>=1&&r<=10?"#ef4444":r>=11&&r<=30?"#f97316":r>=31&&r<=59?"#eab308":r>=60&&r<=80?"#3b82f6":r>=81&&r<=100?"#10b981":"#6b7280",C1=({rating:r})=>{const{theme:e}=Ve(),[t,n]=A.useState(null),s=ve.find(E=>E.id===r.userId),i=A1(r.rating),l=e==="dark"?"text-white":"text-gray-900",c=e==="dark"?"text-gray-400":"text-gray-600",d=e==="dark"?"bg-[#1a1a1a]":"bg-white",h=e==="dark"?"border-gray-800":"border-gray-200",g=e==="dark"?"hover:bg-gray-700":"hover:bg-gray-50",x=r.rating<=0?"4%":`${Math.min(r.rating,100)}%`,p=E=>E>=81?"🏆":E>=60?"⭐":E>=31?"📊":E>=11?"📈":E>=1?"⚠️":"❌",T=r.breakdown?[{icon:a.jsx(mr,{className:"w-5 h-5"}),label:"Выходные",value:`${r.breakdown.daysOff} день`,points:r.breakdown.daysOffPoints,maxPoints:10,explanation:"0-2 выходных в неделю = 10% к рейтингу. Более 2 выходных = 0%. Показывает стабильность присутствия.",threshold:"0-2 дня",color:"bg-yellow-500"},{icon:a.jsx(vf,{className:"w-5 h-5"}),label:"Больничные",value:`${r.breakdown.sickDays} дней`,points:r.breakdown.sickDaysPoints,maxPoints:10,explanation:"До 7 дней больничного в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.",threshold:"≤7 дней",color:"bg-purple-500"},{icon:a.jsx(Eu,{className:"w-5 h-5"}),label:"Отпуск",value:`${r.breakdown.vacationDays} дней`,points:r.breakdown.vacationDaysPoints,maxPoints:10,explanation:"До 7 дней отпуска в месяц = 10% к рейтингу. Более 7 дней = 0%. Учитывается за последние 30 дней.",threshold:"≤7 дней",color:"bg-orange-500"},{icon:a.jsx(zn,{className:"w-5 h-5"}),label:"Часы работы",value:b1(r.breakdown.weeklyHours),points:r.breakdown.weeklyHoursPoints,maxPoints:25,explanation:"30+ часов в неделю = 25% к рейтингу. 20-29 часов = 15%. Менее 20 часов = 0%. Показывает объем работы за неделю.",threshold:"≥30ч: 25% | ≥20ч: 15%",color:"bg-blue-500"},{icon:a.jsx(ai,{className:"w-5 h-5"}),label:"Заработок",value:`${r.breakdown.weeklyEarnings.toFixed(2)} ₽`,points:r.breakdown.weeklyEarningsPoints,maxPoints:30,explanation:"6000+ ₽ в неделю = 30% к рейтингу. 3000-5999 ₽ = 15%. Менее 3000 ₽ = 0%. Основной показатель эффективности.",threshold:"≥6000₽: 30% | ≥3000₽: 15%",color:"bg-[#4E6E49]"},{icon:a.jsx(un,{className:"w-5 h-5"}),label:"Рефералы",value:`${r.breakdown.referrals} чел.`,points:r.breakdown.referralsPoints,maxPoints:30,explanation:"5% к рейтингу за каждого реферала. Максимум 30% (6 рефералов). Учитываются за последние 30 дней. Показывает активность по привлечению новых участников.",threshold:"5% за каждого (макс 30%)",color:"bg-pink-500"},{icon:a.jsx(_u,{className:"w-5 h-5"}),label:"Сообщения",value:`${r.breakdown.weeklyMessages} сообщений`,points:r.breakdown.weeklyMessagesPoints,maxPoints:15,explanation:"Более 50 сообщений в неделю в группе = 15% к рейтингу. Менее 50 = 0%. Учитываются все типы сообщений (текст, фото, стикеры и т.д.). Показывает активность в общении.",threshold:">50 сообщений",color:"bg-indigo-500"}]:[],j=T.reduce((E,I)=>E+I.points,0);return a.jsxs("div",{className:`rounded-xl p-6 ${d} shadow-lg border ${h} transition-all hover:shadow-xl`,children:[a.jsxs("div",{className:"mb-6",children:[a.jsx("div",{className:"flex items-center justify-between mb-4",children:a.jsxs("div",{children:[a.jsx("h3",{className:`text-2xl font-bold mb-1 ${l}`,children:(s==null?void 0:s.name)||"Неизвестно"}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("span",{className:"text-lg font-bold",style:{color:i},children:[r.rating.toFixed(1),"%"]}),a.jsx("span",{className:"text-2xl",children:p(r.rating)})]})]})}),a.jsxs("div",{className:"mb-2",children:[a.jsx("div",{className:"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden shadow-inner",children:a.jsx("div",{className:"h-full transition-all duration-500 flex items-center justify-center text-sm font-bold text-white shadow-md",style:{width:x,backgroundColor:i,minWidth:r.rating<=0?"40px":void 0},children:r.rating>=10&&a.jsxs("span",{children:[r.rating.toFixed(0),"%"]})})}),a.jsxs("div",{className:"flex justify-between mt-1",children:[a.jsx("span",{className:`text-xs ${c}`,children:"Общий рейтинг"}),a.jsxs("span",{className:`text-xs font-semibold ${c}`,children:[j,"/100 баллов"]})]})]})]}),r.breakdown&&a.jsxs("div",{className:"space-y-3 mb-6",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[a.jsx(Vr,{className:`w-5 h-5 ${c}`}),a.jsx("h4",{className:`text-lg font-semibold ${l}`,children:"Детальный разбор рейтинга"})]}),T.map((E,I)=>{const D=E.maxPoints>0?E.points/E.maxPoints*100:0,S=t===I;return a.jsxs("div",{className:`rounded-lg border ${h} overflow-hidden transition-all ${S?"shadow-md":""}`,children:[a.jsx("button",{onClick:()=>n(S?null:I),className:`w-full p-4 flex items-center justify-between ${g} transition-colors`,children:a.jsxs("div",{className:"flex items-center gap-3 flex-1 min-w-0",children:[a.jsx("div",{className:`p-2 rounded-lg ${E.color} text-white flex-shrink-0`,children:E.icon}),a.jsxs("div",{className:"flex-1 min-w-0",children:[a.jsxs("div",{className:"flex items-center justify-between mb-1",children:[a.jsx("span",{className:`font-semibold ${l} truncate`,children:E.label}),a.jsxs("span",{className:`font-bold ml-2 ${E.points>0?"text-[#4E6E49]":"text-red-500"}`,children:[E.points,"/",E.maxPoints]})]}),a.jsx("div",{className:"w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden",children:a.jsx("div",{className:`h-full transition-all duration-300 ${E.color}`,style:{width:`${D}%`}})}),a.jsxs("div",{className:"flex items-center justify-between mt-1",children:[a.jsx("span",{className:`text-xs ${c} truncate mr-2`,children:E.value}),a.jsx("span",{className:`text-xs ${c} whitespace-nowrap`,children:E.threshold})]})]}),a.jsx(Ut,{className:`w-4 h-4 flex-shrink-0 ml-2 ${c} transition-transform ${S?"rotate-180":""}`})]})}),S&&a.jsx("div",{className:`px-4 pb-4 pt-2 border-t ${h} ${e==="dark"?"bg-gray-700":"bg-gray-50"}`,children:a.jsx("p",{className:`text-sm ${c} leading-relaxed`,children:E.explanation})})]},I)})]}),a.jsxs("div",{className:`pt-4 border-t ${h}`,children:[a.jsx("h4",{className:`text-sm font-semibold mb-3 ${l}`,children:"Дополнительная статистика"}),a.jsxs("div",{className:"grid grid-cols-2 gap-3 text-sm",children:[a.jsxs("div",{className:`p-3 rounded-lg ${e==="dark"?"bg-gray-700":"bg-gray-50"}`,children:[a.jsx("div",{className:`text-xs ${c} mb-1`,children:"Заработок (месяц)"}),a.jsxs("div",{className:`text-lg font-bold ${l}`,children:[r.earnings.toFixed(0)," ₽"]})]}),a.jsxs("div",{className:`p-3 rounded-lg ${e==="dark"?"bg-gray-700":"bg-gray-50"}`,children:[a.jsx("div",{className:`text-xs ${c} mb-1`,children:"В пул"}),a.jsxs("div",{className:`text-lg font-bold ${l}`,children:[r.poolAmount.toFixed(0)," ₽"]})]})]})]})]})},to=()=>`REF-${Math.random().toString(36).slice(2,8).toUpperCase()}`,R1=({referral:r,onClose:e,onSave:t})=>{const{user:n}=nt(),{theme:s}=Ve(),[i,l]=A.useState(""),[c,d]=A.useState(""),[h,g]=A.useState(""),[x,p]=A.useState(to()),[T,j]=A.useState(""),[E,I]=A.useState(!1),[D,S]=A.useState(!1);A.useEffect(()=>{r?(l(r.name),d(String(r.age)),p(r.referralId),g(r.comment||"")):(l(""),d(""),g(""),p(to()))},[r]);const C=!!r,F=C?"Редактировать реферала":"Добавить реферала",ne=s==="dark"?"bg-gray-700 hover:bg-gray-600 text-white":"bg-gray-200 hover:bg-gray-300 text-gray-900",B=s==="dark"?"text-gray-300":"text-gray-700",_=s==="dark"?"text-white":"text-gray-900",y=async()=>{if(!r){if(!n){j("Пользователь не найден. Для добавления реферала необходимо войти как участник.");return}}if(!i.trim()||!c.trim()){j("Заполните имя и возраст");return}const w=Number(c);if(Number.isNaN(w)||w<16){j("Возраст должен быть числом не меньше 16");return}I(!0),j("");const k={referralId:x,ownerId:(r==null?void 0:r.ownerId)||n.id,name:i.trim(),age:w,createdAt:(r==null?void 0:r.createdAt)||new Date().toISOString(),...h.trim()&&{comment:h.trim()}};try{r?await s_(r.id,k):await n_(k),t()}catch(N){console.error("Error saving referral:",N);const f=N.message||N.code||"Не удалось сохранить реферала";j(f)}finally{I(!1)}},b=async()=>{if(r&&confirm(`Удалить реферала ${r.name}?`)){S(!0);try{await a_(r.id),t()}catch(w){console.error("Error deleting referral:",w);const k=w.message||w.code||"Не удалось удалить реферала";j(k)}finally{S(!1)}}};return a.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 sm:py-0 overflow-y-auto",children:a.jsx("div",{className:`w-full max-w-md rounded-lg shadow-xl ${s==="dark"?"bg-[#1a1a1a]":"bg-white"} max-h-[90vh] overflow-y-auto`,children:a.jsxs("div",{className:"p-6 space-y-4",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("h3",{className:`text-xl font-bold ${_}`,children:F}),a.jsx("button",{onClick:e,className:`p-2 rounded-lg ${ne}`,children:a.jsx(Pt,{className:"w-5 h-5"})})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium mb-2 ${B}`,children:"Имя"}),a.jsx("input",{type:"text",value:i,onChange:w=>l(w.target.value),className:`w-full px-4 py-2 rounded-lg border ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Введите имя"})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium mb-2 ${B}`,children:"Возраст"}),a.jsx("input",{type:"number",value:c,onChange:w=>d(w.target.value),className:`w-full px-4 py-2 rounded-lg border ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"18",min:16})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium mb-2 ${B}`,children:"Комментарий"}),a.jsx("textarea",{value:h,onChange:w=>g(w.target.value),rows:3,className:`w-full px-4 py-2 rounded-lg border ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`,placeholder:"Например, источник лида или статус"})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium mb-2 ${B}`,children:"ID реферала"}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-2",children:[a.jsx("input",{type:"text",value:x,readOnly:C,onChange:w=>p(w.target.value),className:`flex-1 px-4 py-2 rounded-lg border ${s==="dark"?"bg-gray-700 border-gray-800 text-white":"bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] ${C?"opacity-80 cursor-not-allowed":""}`}),!C&&a.jsxs("button",{type:"button",onClick:()=>p(to()),className:"px-3 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors flex items-center justify-center gap-1 text-sm",children:[a.jsx(Sf,{className:"w-4 h-4"}),"Новый"]})]}),a.jsx("p",{className:`text-xs mt-1 ${s==="dark"?"text-gray-400":"text-gray-500"}`,children:"ID генерируется автоматически и используется для учета."})]}),T&&a.jsx("div",{className:"p-3 bg-red-500 text-white rounded-lg text-sm",children:T}),a.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[C&&a.jsxs("button",{onClick:b,disabled:D,className:"flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center justify-center gap-2",children:[a.jsx(Et,{className:"w-4 h-4"}),D?"Удаление...":"Удалить"]}),a.jsx("button",{onClick:y,disabled:E,className:"flex-1 px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors",children:E?"Сохранение...":"Сохранить"}),a.jsx("button",{onClick:e,className:`px-4 py-2 rounded-lg transition-colors ${ne}`,children:"Отмена"})]})]})})})},P1=()=>{var ne;const{theme:r}=Ve(),[e,t]=A.useState([]),[n,s]=A.useState(!0),[i,l]=A.useState([]),[c,d]=A.useState(!1),[h,g]=A.useState(null),[x,p]=A.useState("rating");A.useEffect(()=>{T()},[]);const T=async()=>{s(!0);try{const B=Xs(),_=oe(B.start,"yyyy-MM-dd"),y=oe(B.end,"yyyy-MM-dd"),b=Xm(30),w=oe(b.start,"yyyy-MM-dd"),k=oe(b.end,"yyyy-MM-dd"),N=b.start.toISOString(),f=b.end.toISOString(),O=await Fm(void 0,N,f);l(O);const Q=[];for(const P of ve){const K=(await Ms(P.id,_,y)).reduce((ie,re)=>{const Fe=re.participants&&re.participants.length>0?re.participants.length:1;return ie+re.amount/Fe},0),H=await Ms(P.id,w,k),Z=H.reduce((ie,re)=>{const Fe=re.participants&&re.participants.length>0?re.participants.length:1;return ie+re.amount/Fe},0),ce=H.reduce((ie,re)=>{const Fe=re.participants&&re.participants.length>0?re.participants.length:1;return ie+re.poolAmount/Fe},0),W=(await hr(P.id)).filter(ie=>{const re=ie.date,Fe=ie.endDate||ie.date;return re<=k&&Fe>=w}),le=W.filter(ie=>ie.type==="dayoff").reduce((ie,re)=>ie+Pn(re.date,re.endDate,w,k),0),Ee=W.filter(ie=>ie.type==="sick").reduce((ie,re)=>ie+Pn(re.date,re.endDate,w,k),0),L=W.filter(ie=>ie.type==="vacation").reduce((ie,re)=>ie+Pn(re.date,re.endDate,w,k),0),se=(await br(P.id)).filter(ie=>ie.date>=_&&ie.date<=y).reduce((ie,re)=>ie+Ni(re.slots),0),J=await Lm(P.id,_,y),ee=(await Vm(P.id))[0]||{userId:P.id,earnings:0,messages:0,initiatives:0,signals:0,profitableSignals:0,referrals:0,daysOff:0,sickDays:0,vacationDays:0,poolAmount:0,rating:0,lastUpdated:new Date().toISOString()},ke=O.filter(ie=>ie.ownerId===P.id).length,pe={userId:P.id,earnings:Z,messages:ee.messages||0,initiatives:ee.initiatives||0,signals:ee.signals||0,profitableSignals:ee.profitableSignals||0,referrals:ke,daysOff:le,sickDays:Ee,vacationDays:L,poolAmount:ce,lastUpdated:new Date().toISOString()},Ne=eg(pe,se,K,J),Xe=tg(pe,se,K,J);Q.push({...pe,rating:Ne,breakdown:Xe})}Q.sort((P,$)=>$.rating-P.rating),t(Q)}catch(B){console.error("Error loading ratings:",B)}finally{s(!1)}},j=e.reduce((B,_)=>B+_.rating,0)/(e.length||1),E=r==="dark"?"text-white":"text-gray-900",I=r==="dark"?"text-gray-400":"text-gray-600",D=r==="dark"?"bg-[#1a1a1a]":"bg-white",S=A.useMemo(()=>{const B=[...e];return x==="name"?B.sort((_,y)=>_.userId.localeCompare(y.userId)):B.sort((_,y)=>y.rating-_.rating)},[e,x]),C=()=>{g(null),d(!0)},F=B=>{g(B),d(!0)};return a.jsxs(qt,{children:[a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${D} shadow-xl border-2 ${r==="dark"?"border-blue-500/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-blue-200 bg-gradient-to-br from-white via-blue-50/30 to-white"} relative overflow-hidden`,children:[a.jsx("div",{className:"absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"}),a.jsx("div",{className:"absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#4E6E49]/10 to-yellow-500/10 rounded-full blur-2xl -ml-24 -mb-24"}),a.jsx("div",{className:"relative z-10",children:a.jsxs("div",{className:"flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between",children:[a.jsxs("div",{className:"flex-1 space-y-4",children:[a.jsxs("div",{className:"flex items-center gap-3 sm:gap-4",children:[a.jsx("div",{className:`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg ${r==="dark"?"bg-gradient-to-br from-blue-600 to-purple-600":"bg-gradient-to-br from-blue-500 to-purple-500"} text-white transform transition-transform active:scale-95 sm:hover:scale-110`,children:a.jsx("span",{className:"text-2xl sm:text-3xl md:text-4xl",children:"🏆"})}),a.jsx("div",{className:"flex-1",children:a.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${E} flex items-center gap-2 sm:gap-3`,children:[a.jsx("span",{className:"bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text",children:"Рейтинг участников"}),a.jsx("span",{className:"text-xl sm:text-2xl",children:"⭐"})]})})]}),a.jsx("p",{className:`text-sm sm:text-base font-medium ${I}`,children:"Система оценки эффективности команды на основе ключевых метрик"}),a.jsx("div",{className:"flex flex-wrap gap-2",children:[{href:"#rating-team",label:"Команда"},{href:"#rating-ref",label:"Рефералы"},{href:"#rating-method",label:"Методика"}].map(B=>a.jsx("a",{href:B.href,className:`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${r==="dark"?"border-white/10 bg-white/5 text-white hover:border-blue-400/50":"border-gray-200 bg-white text-gray-800 hover:border-blue-400 hover:text-blue-700"}`,children:B.label},B.href))}),a.jsx("div",{className:`p-5 rounded-xl border-2 ${r==="dark"?"bg-[#1a1a1a]/50 border-blue-500/20":"bg-blue-50/50 border-blue-200"} mb-4`,children:a.jsxs("p",{className:`text-sm leading-relaxed ${I}`,children:["Рейтинг рассчитывается на основе ",a.jsx("strong",{className:E,children:"7 параметров"}),": выходные, больничные, отпуск (за месяц), часы работы, заработок, рефералы и сообщения в группе (за неделю). Каждый параметр дает определенное количество баллов.",a.jsx("strong",{className:E,children:" Максимальный рейтинг - 100%"}),". Рейтинг обновляется автоматически при изменении данных."]})})]}),a.jsxs("button",{onClick:C,className:"w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform",children:[a.jsx("span",{className:"text-xl",children:"➕"}),a.jsx("span",{children:"Добавить реферала"})]})]})})]}),a.jsxs("div",{id:"rating-team",className:`rounded-2xl p-8 ${D} shadow-xl border-2 ${r==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white to-green-50/20"} relative overflow-hidden`,children:[a.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-2xl -mr-20 -mt-20"}),a.jsxs("div",{className:"relative z-10",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center gap-6 mb-6",children:[a.jsx("div",{className:"p-4 rounded-2xl shadow-lg bg-gradient-to-br from-[#4E6E49] to-emerald-700 text-white flex-shrink-0",children:a.jsx("span",{className:"text-3xl",children:"📊"})}),a.jsxs("div",{className:"flex-1",children:[a.jsx("h3",{className:`text-2xl font-extrabold mb-2 ${E} flex items-center gap-2`,children:a.jsx("span",{className:"bg-gradient-to-r from-[#4E6E49] to-emerald-700 text-transparent bg-clip-text",children:"Средний КПД команды"})}),a.jsx("p",{className:`text-sm ${I} font-medium`,children:"Средний рейтинг всех участников команды за текущий период"})]}),a.jsxs("div",{className:"text-center sm:text-right",children:[a.jsxs("div",{className:`text-5xl font-extrabold mb-1 ${r==="dark"?"text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-500":"text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-700"}`,children:[j.toFixed(1),"%"]}),a.jsx("p",{className:`text-xs ${I}`,children:"из 100%"})]})]}),a.jsx("div",{className:"flex items-center gap-4",children:a.jsx("div",{className:"flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-12 overflow-hidden shadow-inner border-2 border-gray-300 dark:border-gray-800",children:a.jsx("div",{className:`h-full bg-gradient-to-r ${j>=80?"from-[#4E6E49] to-emerald-700":j>=50?"from-yellow-500 to-orange-500":"from-blue-500 to-purple-500"} transition-all duration-500 flex items-center justify-center shadow-lg`,style:{width:`${Math.min(j,100)}%`},children:j>=10&&a.jsxs("span",{className:"text-white text-sm font-bold px-3",children:[j.toFixed(1),"%"]})})})})]})]}),a.jsxs("div",{id:"rating-ref",className:`rounded-2xl p-8 ${D} shadow-xl border-2 ${r==="dark"?"border-pink-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]":"border-pink-200 bg-gradient-to-br from-white to-pink-50/20"} relative overflow-hidden`,children:[a.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-2xl -mr-20 -mt-20"}),a.jsxs("div",{className:"relative z-10",children:[a.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[a.jsx("div",{className:`p-4 rounded-2xl shadow-lg ${r==="dark"?"bg-gradient-to-br from-pink-600 to-rose-600":"bg-gradient-to-br from-pink-500 to-rose-500"} text-white flex-shrink-0`,children:a.jsx("span",{className:"text-3xl",children:"👥"})}),a.jsxs("div",{className:"flex-1",children:[a.jsx("h3",{className:`text-2xl font-extrabold mb-2 ${E} flex items-center gap-2`,children:a.jsx("span",{className:"bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text",children:"Рефералы за 30 дней"})}),a.jsxs("p",{className:`text-sm ${I} font-medium`,children:["Всего добавлено: ",a.jsx("strong",{className:`text-lg ${E}`,children:i.length})," рефералов"]})]})]}),a.jsx("div",{className:"grid gap-4 md:grid-cols-2",children:ve.map(B=>{const _=i.filter(y=>y.ownerId===B.id);return a.jsxs("div",{className:`p-4 rounded-lg border ${r==="dark"?"border-gray-800":"border-gray-200"} ${r==="dark"?"bg-gray-700":"bg-gray-50"}`,children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("span",{className:`${E} font-semibold`,children:B.name}),a.jsxs("span",{className:`px-3 py-1 rounded-full text-sm font-bold ${_.length>0?r==="dark"?"bg-pink-600 text-white":"bg-pink-100 text-pink-700":r==="dark"?"bg-gray-700 text-gray-400":"bg-gray-200 text-gray-600"}`,children:[_.length," ",_.length===1?"реферал":_.length<5?"реферала":"рефералов"]})]}),_.length>0&&a.jsx("div",{className:"space-y-2",children:_.map(y=>a.jsxs("div",{className:`rounded-lg border ${r==="dark"?"border-gray-800":"border-gray-300"} p-3 ${r==="dark"?"bg-[#1a1a1a]":"bg-white"} flex flex-col gap-2 transition-all hover:shadow-md`,children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",children:[a.jsxs("div",{className:"flex-1",children:[a.jsx("p",{className:`text-sm font-semibold ${E} mb-1`,children:y.name}),a.jsxs("div",{className:"flex flex-wrap gap-2 text-xs",children:[a.jsxs("span",{className:`px-2 py-1 rounded ${r==="dark"?"bg-gray-700":"bg-gray-100"} ${I}`,children:["ID: ",y.referralId]}),y.age&&a.jsxs("span",{className:`px-2 py-1 rounded ${r==="dark"?"bg-gray-700":"bg-gray-100"} ${I}`,children:["Возраст: ",y.age]}),a.jsx("span",{className:`px-2 py-1 rounded ${r==="dark"?"bg-gray-700":"bg-gray-100"} ${I}`,children:new Date(y.createdAt).toLocaleDateString("ru-RU")})]})]}),a.jsx("button",{onClick:()=>F(y),className:"self-start sm:self-auto px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium",children:"Редактировать"})]}),y.comment&&a.jsx("div",{className:`mt-2 pt-2 border-t ${r==="dark"?"border-gray-800":"border-gray-200"}`,children:a.jsxs("p",{className:`text-xs ${I} italic`,children:["💬 ",y.comment]})})]},y.id))})]},B.id)})})]})]}),a.jsxs("div",{id:"rating-method",className:`rounded-2xl p-8 ${D} shadow-xl border-2 ${r==="dark"?"border-purple-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]":"border-purple-200 bg-gradient-to-br from-white to-purple-50/20"} relative overflow-hidden`,children:[a.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl -mr-20 -mt-20"}),a.jsxs("div",{className:"relative z-10",children:[a.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[a.jsx("div",{className:`p-4 rounded-2xl shadow-lg ${r==="dark"?"bg-gradient-to-br from-purple-600 to-indigo-600":"bg-gradient-to-br from-purple-500 to-indigo-500"} text-white flex-shrink-0`,children:a.jsx("span",{className:"text-3xl",children:"⭐"})}),a.jsxs("div",{className:"flex-1",children:[a.jsx("h3",{className:`text-2xl font-extrabold mb-2 ${E} flex items-center gap-2`,children:a.jsx("span",{className:"bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text",children:"Рейтинг участников"})}),a.jsx("p",{className:`text-sm ${I} font-medium`,children:"Детальная статистика по каждому участнику команды"})]})]}),n?a.jsxs("div",{className:`rounded-xl p-12 text-center ${r==="dark"?"bg-gray-700/50":"bg-gray-50"} border-2 ${r==="dark"?"border-gray-800":"border-gray-200"}`,children:[a.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"}),a.jsx("p",{className:`text-lg font-semibold ${E}`,children:"Загрузка рейтинга..."}),a.jsx("p",{className:`text-sm ${I} mt-2`,children:"Подождите, собираем статистику"})]}):a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6",children:[a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1",children:[{label:"Топ-1",value:(ne=S[0])!=null&&ne.rating?`${S[0].rating.toFixed(1)}%`:"—",tone:"from-yellow-400/40 to-amber-500/40 text-yellow-900 dark:text-yellow-100"},{label:"Средний рейтинг",value:`${j.toFixed(1)}%`,tone:"from-emerald-400/30 to-emerald-600/30 text-emerald-900 dark:text-emerald-100"},{label:"Участников",value:S.length,tone:"from-blue-400/30 to-indigo-500/30 text-indigo-900 dark:text-indigo-100"}].map(B=>a.jsxs("div",{className:`rounded-xl px-4 py-3 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-sm`,children:[a.jsx("p",{className:"text-[11px] uppercase tracking-wide opacity-70",children:B.label}),a.jsx("p",{className:`text-2xl font-extrabold bg-gradient-to-r ${B.tone} text-transparent bg-clip-text`,children:B.value})]},B.label))}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:()=>p("rating"),className:`px-3 py-2 rounded-lg text-sm font-semibold border transition ${x==="rating"?"bg-gradient-to-r from-[#4E6E49] to-emerald-700 text-white border-transparent shadow":r==="dark"?"border-white/10 text-white hover:border-[#4E6E49]/50":"border-gray-300 text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:"По рейтингу"}),a.jsx("button",{onClick:()=>p("name"),className:`px-3 py-2 rounded-lg text-sm font-semibold border transition ${x==="name"?"bg-gradient-to-r from-[#4E6E49] to-emerald-700 text-white border-transparent shadow":r==="dark"?"border-white/10 text-white hover:border-[#4E6E49]/50":"border-gray-300 text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:"По имени"})]})]}),a.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6",children:S.map((B,_)=>a.jsxs("div",{className:"relative transform transition-all duration-300 hover:scale-105",children:[_===0&&S.length>1&&a.jsxs("div",{className:"absolute -top-4 -right-4 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-xl animate-pulse border-2 border-yellow-300 flex items-center gap-1",children:[a.jsx("span",{className:"text-base",children:"🥇"}),a.jsx("span",{children:"ЛИДЕР"})]}),_===1&&S.length>2&&a.jsxs("div",{className:"absolute -top-4 -right-4 z-20 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 text-xs font-extrabold px-4 py-2 rounded-full shadow-xl border-2 border-gray-200 flex items-center gap-1",children:[a.jsx("span",{className:"text-base",children:"🥈"}),a.jsx("span",{children:"2-е место"})]}),_===2&&S.length>3&&a.jsxs("div",{className:"absolute -top-4 -right-4 z-20 bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-xl border-2 border-orange-200 flex items-center gap-1",children:[a.jsx("span",{className:"text-base",children:"🥉"}),a.jsx("span",{children:"3-е место"})]}),a.jsx(C1,{rating:B})]},B.userId))})]})]})]})]}),c&&a.jsx(R1,{referral:h,onClose:()=>{d(!1),g(null)},onSave:()=>{d(!1),g(null),T()}})]})},D1=({onClose:r,onSave:e,editingTask:t})=>{const{user:n}=nt(),{isAdmin:s}=yt(),{theme:i}=Ve(),l=!!t,c=i==="dark"?"text-white":"text-gray-900",d=i==="dark"?"bg-[#1a1a1a]":"bg-white",h=i==="dark"?"bg-gray-700":"bg-gray-50",g=i==="dark"?"border-gray-800":"border-gray-300",[x,p]=A.useState((t==null?void 0:t.title)||""),[T,j]=A.useState((t==null?void 0:t.description)||""),[E,I]=A.useState((t==null?void 0:t.category)||"trading"),[D,S]=A.useState((t==null?void 0:t.priority)||"medium"),[C,F]=A.useState((t==null?void 0:t.dueDate)||oe(new Date,"yyyy-MM-dd")),[ne,B]=A.useState((t==null?void 0:t.dueTime)||"12:00"),_=t&&t.assignees&&t.assignees.length>0?t.assignees:t?t.assignedTo.map(H=>({userId:H,priority:"medium"})):[],[y,b]=A.useState(_),[w,k]=A.useState(""),[N,f]=A.useState(!1),O=H=>{y.find(Z=>Z.userId===H)?b(Z=>Z.filter(ce=>ce.userId!==H)):b(Z=>[...Z,{userId:H,priority:"medium"}])},Q=()=>{y.length===ve.length?b([]):b(ve.map(H=>({userId:H.id,priority:"medium"})))},P=(H,Z)=>{b(ce=>ce.map(q=>q.userId===H?{...q,priority:Z}:q))},$=(H,Z)=>{b(ce=>ce.map(q=>q.userId===H?{...q,comment:Z}:q))},K=async()=>{if(!s&&!n){k("Пользователь не найден");return}k(""),f(!0);try{if(!x.trim()){k("Введите название задачи"),f(!1);return}if(y.length===0){k("Выберите хотя бы одного участника"),f(!1);return}if(!C){k("Укажите дату дедлайна"),f(!1);return}if(!ne){k("Укажите время дедлайна"),f(!1);return}const H=new Date().toISOString(),Z=(n==null?void 0:n.id)||"admin",ce=y.map(q=>q.userId);if(l&&t){const q=ce.map(le=>t.approvals.find(L=>L.userId===le)||{userId:le,status:"pending",updatedAt:H}),W={title:x.trim(),description:T.trim()||void 0,category:E,priority:D,assignedTo:ce,assignees:y,approvals:q,dueDate:C,dueTime:ne,updatedAt:H};await Jr(t.id,W)}else{const q={title:x.trim(),description:T.trim()||void 0,category:E,status:"pending",createdBy:Z,assignedTo:ce,assignees:y,approvals:ce.map(W=>({userId:W,status:"pending",updatedAt:H})),createdAt:H,updatedAt:H,priority:D,dueDate:C,dueTime:ne};await d_(q)}e()}catch(H){console.error("Error saving task:",H),k("Ошибка при сохранении задачи"),f(!1)}};return a.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto",children:a.jsxs("div",{className:`${d} rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 ${i==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white"} relative`,children:[a.jsxs("div",{className:`sticky top-0 ${d} border-b ${g} p-4 sm:p-6 flex items-center justify-between z-10`,children:[a.jsxs("h2",{className:`text-xl sm:text-2xl font-bold ${c} flex items-center gap-2`,children:[a.jsx(Lo,{className:"w-5 h-5 sm:w-6 sm:h-6"}),l?"Редактировать задачу":"Новая задача"]}),a.jsx("button",{onClick:r,className:`p-2 rounded-lg transition-colors ${i==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,children:a.jsx(Pt,{className:"w-5 h-5"})})]}),a.jsxs("div",{className:"p-4 sm:p-6 space-y-4 sm:space-y-6",children:[w&&a.jsxs("div",{className:"p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-500",children:[a.jsx(ys,{className:"w-5 h-5 flex-shrink-0"}),a.jsx("span",{className:"text-sm",children:w})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium mb-2 ${c}`,children:"Название задачи *"}),a.jsx("input",{type:"text",value:x,onChange:H=>p(H.target.value),className:`w-full px-4 py-2.5 rounded-lg border ${g} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`,placeholder:"Введите название задачи"})]}),y.length>0&&a.jsxs("div",{className:"space-y-3",children:[a.jsx("label",{className:`block text-sm font-medium ${c}`,children:"Приоритеты и комментарии"}),a.jsx("div",{className:"space-y-3",children:y.map(H=>{const Z=ve.find(ce=>ce.id===H.userId);return a.jsxs("div",{className:`p-3 rounded-lg border ${g} ${h} space-y-2`,children:[a.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",children:[a.jsxs("div",{className:"text-sm font-medium",children:[(Z==null?void 0:Z.name)||"Участник"," ",a.jsxs("span",{className:"text-xs text-gray-500",children:["(",(Z==null?void 0:Z.login)||(Z==null?void 0:Z.id)||"—",")"]})]}),a.jsxs("select",{value:H.priority,onChange:ce=>P(H.userId,ce.target.value),className:`px-3 py-1.5 rounded-lg border ${g} ${i==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"}`,children:[a.jsx("option",{value:"low",children:"Низкий приоритет"}),a.jsx("option",{value:"medium",children:"Средний приоритет"}),a.jsx("option",{value:"high",children:"Высокий приоритет"})]})]}),a.jsx("textarea",{value:H.comment||"",onChange:ce=>$(H.userId,ce.target.value),rows:2,className:`w-full px-3 py-2 rounded-lg border ${g} ${i==="dark"?"bg-[#1a1a1a] text-gray-100":"bg-white text-gray-700"} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`,placeholder:"Комментарий для исполнителя (необязательно)"})]},H.userId)})})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium mb-2 ${c}`,children:"Описание"}),a.jsx("textarea",{value:T,onChange:H=>j(H.target.value),rows:4,className:`w-full px-4 py-2.5 rounded-lg border ${g} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all resize-none`,placeholder:"Добавьте описание задачи (необязательно)"})]}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[a.jsxs("div",{children:[a.jsxs("label",{className:`block text-sm font-medium mb-2 ${c} flex items-center gap-2`,children:[a.jsx(Rf,{className:"w-4 h-4"}),"Категория"]}),a.jsx("select",{value:E,onChange:H=>I(H.target.value),className:`w-full px-4 py-2.5 rounded-lg border ${g} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`,children:Object.entries(Oo).map(([H,{label:Z,icon:ce}])=>a.jsxs("option",{value:H,children:[ce," ",Z]},H))})]}),a.jsxs("div",{children:[a.jsx("label",{className:`block text-sm font-medium mb-2 ${c}`,children:"Приоритет"}),a.jsxs("select",{value:D,onChange:H=>S(H.target.value),className:`w-full px-4 py-2.5 rounded-lg border ${g} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`,children:[a.jsx("option",{value:"low",children:"Низкий"}),a.jsx("option",{value:"medium",children:"Средний"}),a.jsx("option",{value:"high",children:"Высокий"})]})]})]}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[a.jsxs("div",{children:[a.jsxs("label",{className:`block text-sm font-medium mb-2 ${c} flex items-center gap-2`,children:[a.jsx(mr,{className:"w-4 h-4"}),"Дата дедлайна *"]}),a.jsx("input",{type:"date",value:C,onChange:H=>F(H.target.value),min:oe(new Date,"yyyy-MM-dd"),required:!0,className:`w-full px-4 py-2.5 rounded-lg border ${g} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`})]}),a.jsxs("div",{children:[a.jsxs("label",{className:`block text-sm font-medium mb-2 ${c} flex items-center gap-2`,children:[a.jsx(zn,{className:"w-4 h-4"}),"Время дедлайна *"]}),a.jsx("input",{type:"time",value:ne,onChange:H=>B(H.target.value),required:!0,className:`w-full px-4 py-2.5 rounded-lg border ${g} ${h} ${c} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`})]})]}),a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsxs("label",{className:`block text-sm font-medium ${c} flex items-center gap-2`,children:[a.jsx(un,{className:"w-4 h-4"}),"Участники *"]}),a.jsx("button",{type:"button",onClick:Q,className:`text-xs sm:text-sm px-3 py-1 rounded-lg transition-colors ${i==="dark"?"bg-gray-700 hover:bg-gray-600 text-gray-300":"bg-gray-200 hover:bg-gray-300 text-gray-700"}`,children:y.length===ve.length?"Снять выделение":"Выбрать всех"})]}),a.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3",children:ve.map(H=>{const Z=y.some(ce=>ce.userId===H.id);return a.jsx("button",{type:"button",onClick:()=>O(H.id),className:`p-3 rounded-lg border-2 transition-all text-left ${Z?i==="dark"?"border-[#4E6E49] bg-[#4E6E49]/20":"border-[#4E6E49] bg-green-50":`${g} ${h}`}`,children:a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:`w-2 h-2 rounded-full ${Z?"bg-[#4E6E49]":"bg-gray-400"}`}),a.jsx("span",{className:`text-sm font-medium ${Z?"text-[#4E6E49]":c}`,children:H.name})]})},H.id)})})]}),a.jsxs("div",{className:`flex flex-col sm:flex-row gap-3 pt-4 border-t ${g}`,children:[a.jsx("button",{onClick:K,disabled:N,className:`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${N?"bg-gray-400 cursor-not-allowed":"bg-gradient-to-r from-[#4E6E49] to-emerald-700 hover:from-[#4E6E49] hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"}`,children:N?"Сохранение...":l?"Сохранить изменения":"Создать задачу"}),a.jsx("button",{onClick:r,className:`px-6 py-3 rounded-lg font-semibold transition-colors ${i==="dark"?"bg-gray-700 hover:bg-gray-600 text-gray-300":"bg-gray-200 hover:bg-gray-300 text-gray-700"}`,children:"Отмена"})]})]})]})})},Ll=60*1e3,Os=60*Ll,du=24*Os,$1=r=>{if(r<=0)return"Просрочено";const e=Math.floor(r/du),t=Math.floor(r%du/Os),n=Math.floor(r%Os/Ll);return e>0?`${e}д ${t}ч`:t>0?`${t}ч ${n}м`:`${Math.max(n,1)}м`},M1=r=>r<=0?"overdue":r<=Os?"urgent":r<=6*Os?"soon":"on_track",ro=(r,e)=>{if(!r||!e)return{label:"—",status:"unknown",isOverdue:!1};const n=new Date(`${r}T${e}`).getTime()-Date.now();if(Number.isNaN(n))return{label:"—",status:"unknown",isOverdue:!1};const s=M1(n);return{label:$1(n),status:s,isOverdue:s==="overdue"}},O1=(r,e)=>{const t=A.useMemo(()=>ro(r,e),[r,e]),[n,s]=A.useState(t);return A.useEffect(()=>{s(ro(r,e));const i=setInterval(()=>{s(ro(r,e))},Ll);return()=>clearInterval(i)},[r,e]),n},V1=(r,e)=>e==="dark"?{overdue:"bg-red-500/10 border-red-500/40 text-red-300",urgent:"bg-orange-500/10 border-orange-500/40 text-orange-200",soon:"bg-yellow-500/10 border-yellow-500/40 text-yellow-200",on_track:"bg-[#4E6E49]/10 border-[#4E6E49]/40 text-green-200",unknown:"bg-gray-600/30 border-gray-500/40 text-gray-200"}[r]:{overdue:"bg-red-50 border-red-200 text-red-600",urgent:"bg-orange-50 border-orange-200 text-orange-600",soon:"bg-yellow-50 border-yellow-200 text-yellow-700",on_track:"bg-green-50 border-green-200 text-[#4E6E49]",unknown:"bg-gray-100 border-gray-200 text-gray-600"}[r],rg=({dueDate:r,dueTime:e,theme:t,size:n="default"})=>{const{label:s,status:i}=O1(r,e),l=V1(i,t),c=n==="compact"?"px-2 py-0.5 text-[11px]":"px-2.5 py-1 text-xs sm:text-sm",d=n==="compact"?"w-3 h-3":"w-4 h-4";return a.jsxs("span",{className:`inline-flex items-center gap-1 rounded-full border font-medium ${c} ${l}`,children:[a.jsx(zn,{className:d}),s]})},L1=({task:r,onEdit:e,onDelete:t,onUpdate:n})=>{const{user:s}=nt(),{isAdmin:i}=yt(),{theme:l}=Ve(),[c,d]=A.useState(!1),[h,g]=A.useState(!1),[x,p]=A.useState(""),T=l==="dark"?"text-white":"text-gray-900",j=l==="dark"?"bg-[#1a1a1a]":"bg-white",E=l==="dark"?"border-gray-800":"border-gray-300",I=Oo[r.category],D=Ma[r.status],S=ve.find(P=>P.id===r.createdBy),C=r.assignees&&r.assignees.length>0?r.assignees:r.assignedTo.map(P=>({userId:P,priority:"medium"})),F=C.map(P=>P.userId),ne=C.map(P=>{const $=ve.find(K=>K.id===P.userId);return $?{...P,member:$}:null}).filter(Boolean),B=i||(s==null?void 0:s.id)===r.createdBy,_=r.status==="pending"&&F.includes((s==null?void 0:s.id)||""),y=r.approvals.find(P=>P.userId===(s==null?void 0:s.id)),b=r.status==="pending"&&r.approvals.length>0&&r.approvals.every(P=>P.status==="approved"),w=async P=>{if(!(!s&&!i)){d(!0);try{const $=new Date().toISOString(),K={status:P,updatedAt:$};if(P==="completed")K.completedAt=$,K.completedBy=(s==null?void 0:s.id)||"admin";else if(P==="closed")K.closedAt=$;else if(P==="in_progress"&&r.status==="pending"&&!b){d(!1);return}await Jr(r.id,K),n()}catch($){console.error("Error updating task status:",$)}finally{d(!1)}}},k=async P=>{if(s){d(!0);try{const $=new Date().toISOString(),K=P==="approve"?"approved":"rejected",H=r.approvals.map(ce=>ce.userId===s.id?{...ce,status:K,comment:P==="reject"&&x||void 0,updatedAt:$}:ce);y||H.push({userId:s.id,status:K,comment:P==="reject"&&x||void 0,updatedAt:$});const Z={approvals:H,updatedAt:$};P==="reject"?Z.status="rejected":P==="approve"&&(Z.status="in_progress"),await Jr(r.id,Z),P==="reject"&&(g(!1),p("")),n()}catch($){console.error("Error approving task:",$)}finally{d(!1)}}},N=()=>{switch(r.priority){case"high":return l==="dark"?"text-red-400":"text-red-600";case"medium":return l==="dark"?"text-yellow-400":"text-yellow-600";case"low":return l==="dark"?"text-gray-400":"text-gray-600"}},f=P=>({high:{label:"Высокий",classes:l==="dark"?"bg-red-500/20 text-red-300 border-red-500/40":"bg-red-50 text-red-600 border-red-200"},medium:{label:"Средний",classes:l==="dark"?"bg-yellow-500/20 text-yellow-300 border-yellow-500/40":"bg-yellow-50 text-yellow-700 border-yellow-200"},low:{label:"Низкий",classes:l==="dark"?"bg-gray-500/20 text-gray-300 border-gray-500/40":"bg-gray-50 text-gray-700 border-gray-200"}})[P],O=()=>({pending:l==="dark"?"bg-yellow-500/20 border-yellow-500/50 text-yellow-400":"bg-yellow-50 border-yellow-200 text-yellow-700",in_progress:l==="dark"?"bg-blue-500/20 border-blue-500/50 text-blue-400":"bg-blue-50 border-blue-200 text-blue-700",completed:l==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49]/50 text-[#4E6E49]":"bg-green-50 border-green-200 text-[#4E6E49]",closed:l==="dark"?"bg-gray-500/20 border-gray-500/50 text-gray-400":"bg-gray-50 border-gray-200 text-gray-700",rejected:l==="dark"?"bg-red-500/20 border-red-500/50 text-red-400":"bg-red-50 border-red-200 text-red-700"})[r.status],Q=()=>{const P={green:{bg:l==="dark"?"bg-[#4E6E49]/20":"bg-green-50",text:"text-[#4E6E49]"},blue:{bg:l==="dark"?"bg-blue-500/20":"bg-blue-50",text:l==="dark"?"text-blue-400":"text-blue-700"},purple:{bg:l==="dark"?"bg-purple-500/20":"bg-purple-50",text:l==="dark"?"text-purple-400":"text-purple-700"},red:{bg:l==="dark"?"bg-red-500/20":"bg-red-50",text:l==="dark"?"text-red-400":"text-red-700"},yellow:{bg:l==="dark"?"bg-yellow-500/20":"bg-yellow-50",text:l==="dark"?"text-yellow-400":"text-yellow-700"},indigo:{bg:l==="dark"?"bg-indigo-500/20":"bg-indigo-50",text:l==="dark"?"text-indigo-400":"text-indigo-700"}};return P[I.color]||P.green};return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:`${j} rounded-xl border-2 ${E} p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all ${l==="dark"?"hover:border-[#4E6E49]/50":"hover:border-[#4E6E49]"}`,children:[a.jsxs("div",{className:"flex items-start justify-between gap-3 mb-3",children:[a.jsxs("div",{className:"flex-1 min-w-0",children:[a.jsx("div",{className:"flex items-center gap-2 mb-2",children:a.jsx("h3",{className:`text-lg sm:text-xl font-bold ${T} truncate`,children:r.title})}),a.jsxs("div",{className:"flex flex-wrap items-center gap-2 sm:gap-3",children:[a.jsxs("span",{className:`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium ${Q().bg} ${Q().text}`,children:[I.icon," ",I.label]}),a.jsx("span",{className:`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium border ${O()}`,children:D.label}),a.jsx("span",{className:`text-xs sm:text-sm font-medium ${N()}`,children:r.priority==="high"?"🔴 Высокий":r.priority==="medium"?"🟡 Средний":"🟢 Низкий"})]})]}),B&&a.jsxs("div",{className:"flex items-center gap-2 flex-shrink-0",children:[a.jsx("button",{onClick:()=>e(r),className:`p-2 rounded-lg transition-colors ${l==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,title:"Редактировать",children:a.jsx($t,{className:"w-4 h-4"})}),a.jsx("button",{onClick:()=>t(r.id),className:`p-2 rounded-lg transition-colors ${l==="dark"?"hover:bg-red-500/20 text-red-400":"hover:bg-red-50 text-red-600"}`,title:"Удалить",children:a.jsx(Et,{className:"w-4 h-4"})})]})]}),r.description&&a.jsx("p",{className:`text-sm ${l==="dark"?"text-gray-300":"text-gray-600"} mb-4 line-clamp-2`,children:r.description}),a.jsxs("div",{className:"space-y-2 mb-4",children:[a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs sm:text-sm",children:[a.jsx(Zr,{className:`w-4 h-4 ${l==="dark"?"text-blue-400":"text-blue-600"}`}),a.jsx("span",{className:`font-medium ${l==="dark"?"text-gray-300":"text-gray-700"}`,children:"Автор:"}),a.jsx("span",{className:l==="dark"?"text-gray-400":"text-gray-600",children:(S==null?void 0:S.name)||"Неизвестно"})]}),a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 text-xs sm:text-sm",children:[a.jsx(un,{className:"w-4 h-4 text-[#4E6E49]"}),a.jsx("span",{className:`font-medium ${l==="dark"?"text-gray-300":"text-gray-700"}`,children:"Исполнители:"})]}),ne.length>0?a.jsx("div",{className:"mt-2 space-y-2",children:ne.map(P=>{const $=f(P.priority);return a.jsxs("div",{className:`p-3 rounded-lg border ${E} ${l==="dark"?"bg-[#1a1a1a]/70":"bg-gray-50"}`,children:[a.jsxs("div",{className:"flex items-center justify-between gap-2",children:[a.jsx("span",{className:`text-sm font-medium ${l==="dark"?"text-gray-100":"text-gray-800"}`,children:P.member.name}),a.jsx("span",{className:`text-[11px] px-2 py-0.5 rounded-full border ${$.classes}`,children:$.label})]}),P.comment&&a.jsx("p",{className:`text-xs mt-1 ${l==="dark"?"text-gray-400":"text-gray-600"}`,children:P.comment})]},P.member.id)})}):a.jsx("span",{className:"text-gray-500",children:"Не назначены"})]})]}),a.jsxs("div",{className:"flex items-center gap-2 flex-wrap text-xs sm:text-sm",children:[a.jsx(mr,{className:`w-4 h-4 ${l==="dark"?"text-gray-400":"text-gray-500"}`}),a.jsxs("span",{className:l==="dark"?"text-gray-400":"text-gray-600",children:["Срок: ",oe(new Date(r.dueDate),"dd.MM.yyyy")," ",r.dueTime]}),a.jsx(rg,{dueDate:r.dueDate,dueTime:r.dueTime,theme:l})]}),r.status==="pending"&&r.approvals.length>0&&a.jsxs("div",{className:"flex items-center gap-2 text-xs sm:text-sm",children:[a.jsx(ys,{className:`w-4 h-4 ${l==="dark"?"text-yellow-400":"text-yellow-600"}`}),a.jsxs("span",{className:l==="dark"?"text-yellow-400":"text-yellow-600",children:["Согласований: ",r.approvals.filter(P=>P.status==="approved").length,"/",r.approvals.length]})]})]}),a.jsxs("div",{className:`flex flex-wrap gap-2 pt-4 border-t ${E}`,children:[_&&!y&&a.jsxs("button",{onClick:()=>k("approve"),className:"flex-1 sm:flex-none px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",children:[a.jsx($n,{className:"w-4 h-4"}),"Согласовать"]}),_&&!y&&a.jsxs("button",{onClick:()=>g(!0),className:"flex-1 sm:flex-none px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",children:[a.jsx(Pt,{className:"w-4 h-4"}),"Отклонить"]}),r.status==="pending"&&b&&(B||_)&&a.jsxs("button",{onClick:()=>w("in_progress"),disabled:c,className:"flex-1 sm:flex-none px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[a.jsx(zn,{className:"w-4 h-4"}),"В работу"]}),r.status==="in_progress"&&(B||F.includes((s==null?void 0:s.id)||""))&&a.jsxs("button",{onClick:()=>w("completed"),disabled:c,className:"flex-1 sm:flex-none px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[a.jsx(Vo,{className:"w-4 h-4"}),"Выполнена"]}),r.status==="completed"&&B&&a.jsxs("button",{onClick:()=>w("closed"),disabled:c,className:"flex-1 sm:flex-none px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50",children:[a.jsx(Df,{className:"w-4 h-4"}),"Закрыть"]})]})]}),h&&a.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:a.jsxs("div",{className:`${j} rounded-xl p-6 max-w-md w-full border-2 ${E}`,children:[a.jsx("h3",{className:`text-lg font-bold mb-4 ${T}`,children:"Отклонить задачу"}),a.jsx("textarea",{value:x,onChange:P=>p(P.target.value),placeholder:"Укажите причину отклонения",rows:3,className:`w-full px-4 py-2 rounded-lg border ${E} ${l==="dark"?"bg-gray-700":"bg-gray-50"} ${T} mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}),a.jsxs("div",{className:"flex gap-3",children:[a.jsx("button",{onClick:()=>k("reject"),disabled:c||!x.trim(),className:"flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50",children:"Отклонить"}),a.jsx("button",{onClick:()=>{g(!1),p("")},className:`px-4 py-2 rounded-lg font-medium transition-colors ${l==="dark"?"bg-gray-700 hover:bg-gray-600":"bg-gray-200 hover:bg-gray-300"}`,children:"Отмена"})]})]})})]})},F1=({selectedCategory:r,selectedStatus:e,selectedUsers:t,onCategoryChange:n,onStatusChange:s,onUsersChange:i,onClear:l})=>{const{theme:c}=Ve(),d=c==="dark"?"text-white":"text-gray-900",h=c==="dark"?"bg-[#1a1a1a]":"bg-white",g=c==="dark"?"border-gray-800":"border-gray-300",x=r!=="all"||e!=="all"||t.length>0;return a.jsxs("div",{className:`${h} rounded-xl border-2 ${g} p-4 sm:p-6 shadow-lg sticky top-4`,children:[a.jsxs("div",{className:"flex items-center gap-2 mb-5",children:[a.jsx("div",{className:`p-2 rounded-lg ${c==="dark"?"bg-[#4E6E49]/20":"bg-green-50"}`,children:a.jsx(Cc,{className:"w-5 h-5 text-[#4E6E49]"})}),a.jsx("h3",{className:`text-lg font-bold ${d} flex-1`,children:"Фильтры"}),x&&a.jsxs("button",{onClick:l,className:`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${c==="dark"?"bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50":"bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"}`,children:[a.jsx(Pt,{className:"w-4 h-4"}),a.jsx("span",{className:"hidden sm:inline",children:"Сбросить"})]})]}),a.jsxs("div",{className:"space-y-5",children:[a.jsxs("div",{children:[a.jsxs("label",{className:`block text-sm font-semibold mb-3 ${d} flex items-center gap-2`,children:[a.jsx(rn,{className:"w-4 h-4"}),"Категория"]}),a.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.jsx("button",{onClick:()=>n("all"),className:`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${r==="all"?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}`}`,children:"Все"}),Object.entries(Oo).map(([p,{label:T,icon:j}])=>a.jsxs("button",{onClick:()=>n(p),className:`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${r===p?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}`}`,children:[a.jsx("span",{className:"mr-1.5",children:j}),T]},p))]})]}),a.jsxs("div",{children:[a.jsxs("label",{className:`block text-sm font-semibold mb-3 ${d} flex items-center gap-2`,children:[a.jsx(Cc,{className:"w-4 h-4"}),"Статус"]}),a.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.jsx("button",{onClick:()=>s("all"),className:`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${e==="all"?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}`}`,children:"Все"}),Object.entries(Ma).map(([p,{label:T,color:j}])=>{const E={yellow:{active:c==="dark"?"bg-yellow-500/20 border-yellow-500 text-yellow-400":"bg-yellow-50 border-yellow-500 text-yellow-700",inactive:c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"},blue:{active:c==="dark"?"bg-blue-500/20 border-blue-500 text-blue-400":"bg-blue-50 border-blue-500 text-blue-700",inactive:c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"},green:{active:c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]",inactive:c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"},gray:{active:c==="dark"?"bg-gray-500/20 border-gray-500 text-gray-400":"bg-gray-50 border-gray-500 text-gray-700",inactive:c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"},red:{active:c==="dark"?"bg-red-500/20 border-red-500 text-red-400":"bg-red-50 border-red-500 text-red-700",inactive:c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}},I=E[j]||E.gray;return a.jsx("button",{onClick:()=>s(p),className:`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${e===p?I.active:I.inactive}`,children:T},p)})]})]}),a.jsxs("div",{children:[a.jsxs("label",{className:`block text-sm font-semibold mb-3 ${d} flex items-center gap-2`,children:[a.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})}),"Участники"]}),a.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.jsx("button",{onClick:()=>i([]),className:`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${t.length===0?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}`}`,children:"Все"}),ve.map(p=>{const T=t.includes(p.id);return a.jsx("button",{onClick:()=>{i(T?t.filter(j=>j!==p.id):[...t,p.id])},className:`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${T?c==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]":"bg-green-50 border-[#4E6E49] text-[#4E6E49]":`${c==="dark"?"bg-gray-700 border-gray-800 text-gray-300 hover:bg-gray-600":"bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}`}`,children:p.name},p.id)})]})]})]})]})},U1=({tasks:r,onUpdate:e,onEdit:t,onDelete:n})=>{const{theme:s}=Ve(),{user:i}=nt(),{isAdmin:l}=yt(),[c,d]=A.useState(null),[h,g]=A.useState(null),[x,p]=A.useState(null),[T,j]=A.useState(""),[E,I]=A.useState(null),[D,S]=A.useState(null),[C,F]=A.useState(null),ne=s==="dark"?"text-white":"text-gray-900",B=s==="dark"?"bg-[#1a1a1a]":"bg-white",_=s==="dark"?"border-gray-800":"border-gray-300",y=["pending","in_progress","completed","closed","rejected"],b=V=>V.assignees&&V.assignees.length>0?V.assignees:V.assignedTo.map(X=>({userId:X,priority:"medium"})),w=V=>b(V).map(X=>X.userId),k=V=>r.filter(X=>X.status===V),N=(V,X)=>{if(E){V.preventDefault();return}d(X),V.dataTransfer.effectAllowed="move",V.dataTransfer.setData("text/plain",X.id)},f=V=>{V.preventDefault(),V.dataTransfer.dropEffect="move"},O=()=>{d(null)},Q=(V,X)=>{if(E||X.status==="rejected")return;const se=V.touches[0];S({x:se.clientX,y:se.clientY,task:X})},P=V=>{if(!D)return;V.preventDefault();const X=V.touches[0],se=document.elementFromPoint(X.clientX,X.clientY);if(se){const J=se.closest("[data-status]");if(J){const z=J.getAttribute("data-status");z&&F(z)}}},$=async(V,X)=>{if(!D)return;const se=V.changedTouches[0],J=document.elementFromPoint(se.clientX,se.clientY);if(J){const z=J.closest("[data-status]");if(z){const ee=z.getAttribute("data-status");ee&&ee!==X&&D.task.status!=="rejected"&&await H(D.task,ee)}}S(null),F(null)},K=async(V,X)=>{if(V.preventDefault(),V.stopPropagation(),!c||c.status===X||E){d(null);return}if(c.status==="rejected"&&X!=="pending"){d(null);return}if(X==="rejected"){d(null);return}I(c.id);try{const se=new Date().toISOString(),J={status:X,updatedAt:se};if(X==="completed")J.completedAt=se,J.completedBy=(i==null?void 0:i.id)||"admin";else if(X==="closed")J.closedAt=se;else if(X==="in_progress"&&c.status==="pending"){if(!c.approvals.every(ee=>ee.status==="approved")){I(null),d(null);return}}else X==="pending"&&c.status==="rejected"&&(J.approvals=w(c).map(z=>({userId:z,status:"pending",updatedAt:se})));await Jr(c.id,J),e()}catch(se){console.error("Error updating task status:",se)}finally{I(null),d(null)}},H=async(V,X)=>{if(V.status===X||E===V.id){g(null);return}I(V.id);try{const se=new Date().toISOString(),J={status:X,updatedAt:se};if(X==="completed")J.completedAt=se,J.completedBy=(i==null?void 0:i.id)||"admin";else if(X==="closed")J.closedAt=se;else if(X==="in_progress"&&V.status==="pending"){if(!V.approvals.every(ee=>ee.status==="approved")){I(null),g(null);return}}else X==="pending"&&V.status==="rejected"&&(J.approvals=w(V).map(z=>({userId:z,status:"pending",updatedAt:se})));await Jr(V.id,J),e(),g(null)}catch(se){console.error("Error updating task status:",se)}finally{I(null)}},Z=async(V,X)=>{if(i){I(V.id);try{const se=new Date().toISOString(),J=X==="approve"?"approved":"rejected",z=V.approvals.map(ke=>ke.userId===i.id?{...ke,status:J,comment:X==="reject"&&T||void 0,updatedAt:se}:ke);V.approvals.find(ke=>ke.userId===i.id)||z.push({userId:i.id,status:J,comment:X==="reject"&&T||void 0,updatedAt:se});const ee={approvals:z,updatedAt:se};X==="reject"?ee.status="rejected":X==="approve"&&(ee.status="in_progress"),await Jr(V.id,ee),e(),X==="reject"&&(p(null),j(""))}catch(se){console.error("Error approving task:",se)}finally{I(null)}}},ce=async V=>{if(!(!i||V.createdBy!==i.id)){I(V.id);try{const X=new Date().toISOString();await Jr(V.id,{status:"pending",approvals:w(V).map(se=>({userId:se,status:"pending",updatedAt:X})),updatedAt:X}),e()}catch(X){console.error("Error resubmitting task:",X)}finally{I(null)}}},q=V=>({pending:s==="dark"?"bg-yellow-500/20 border-yellow-500/50":"bg-yellow-50 border-yellow-200",in_progress:s==="dark"?"bg-blue-500/20 border-blue-500/50":"bg-blue-50 border-blue-200",completed:s==="dark"?"bg-[#4E6E49]/20 border-[#4E6E49]/50":"bg-green-50 border-green-200",closed:s==="dark"?"bg-gray-500/20 border-gray-500/50":"bg-gray-50 border-gray-200",rejected:s==="dark"?"bg-red-500/20 border-red-500/50":"bg-red-50 border-red-200"})[V],W=V=>({pending:s==="dark"?"text-yellow-400":"text-yellow-700",in_progress:s==="dark"?"text-blue-400":"text-blue-700",completed:"text-[#4E6E49]",closed:s==="dark"?"text-gray-400":"text-gray-700",rejected:s==="dark"?"text-red-400":"text-red-700"})[V],le=V=>{const X=new Date;return new Date(`${V.dueDate}T${V.dueTime}`)<X&&V.status!=="completed"&&V.status!=="closed"&&V.status!=="rejected"},Ee=V=>{if(V.status!=="pending"||!i||!w(V).includes(i.id))return!1;const se=V.approvals.find(J=>J.userId===i.id);return!se||se.status==="pending"},L=V=>V.status!=="rejected"||!i?!1:V.createdBy===i.id||l;return a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"overflow-x-auto pb-4 -mx-4 px-4",children:a.jsx("div",{className:"flex gap-3 sm:gap-4 min-w-max",children:y.map(V=>{const X=k(V),se=Ma[V];return a.jsxs("div",{"data-status":V,className:`flex-shrink-0 w-[280px] sm:w-80 ${B} rounded-xl border-2 ${_} p-3 sm:p-4 ${C===V?"border-[#4E6E49]":""}`,onDragOver:f,onDrop:J=>K(J,V),onTouchMove:P,children:[a.jsx("div",{className:`mb-3 sm:mb-4 pb-2 sm:pb-3 border-b ${_}`,children:a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("h3",{className:`text-base sm:text-lg font-bold ${W(V)}`,children:se.label}),a.jsx("span",{className:`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium ${q(V)} ${W(V)}`,children:X.length})]})}),a.jsxs("div",{className:"space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto",children:[X.map(J=>{var ie;const z=le(J),ee=l||(i==null?void 0:i.id)===J.createdBy,ke=Ee(J),pe=L(J),Xe=b(J).map(re=>{const Fe=ve.find(Je=>Je.id===re.userId);return Fe?{...re,member:Fe}:null}).filter(Boolean);return a.jsxs("div",{draggable:!E&&J.status!=="rejected",onDragStart:re=>N(re,J),onDragEnd:O,onTouchStart:re=>Q(re,J),onTouchEnd:re=>$(re,V),className:`${B} rounded-lg border-2 ${_} p-2.5 sm:p-3 cursor-move hover:shadow-lg transition-all ${(c==null?void 0:c.id)===J.id||(D==null?void 0:D.task.id)===J.id?"opacity-50":""} ${z?"border-red-500":""} ${E===J.id?"opacity-50 pointer-events-none":""} ${J.status==="rejected"?"opacity-75":""}`,children:[a.jsxs("div",{className:"flex items-start justify-between gap-2 mb-2",children:[a.jsx("h4",{className:`font-semibold text-xs sm:text-sm ${ne} flex-1`,children:J.title}),a.jsx("div",{className:"flex items-center gap-1 flex-shrink-0",children:a.jsxs("div",{className:"relative lg:hidden",children:[a.jsx("button",{onClick:()=>g((h==null?void 0:h.id)===J.id?null:J),className:`p-1 rounded ${s==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"}`,children:a.jsx(Tf,{className:"w-4 h-4"})}),(h==null?void 0:h.id)===J.id&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>g(null)}),a.jsx("div",{className:`absolute right-0 top-8 z-50 ${B} rounded-lg shadow-xl border-2 ${_} min-w-[200px]`,children:a.jsxs("div",{className:"p-2",children:[a.jsx("div",{className:`text-xs font-medium mb-2 px-2 py-1 ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:"Изменить статус:"}),y.filter(re=>re!=="rejected"||J.status==="rejected").map(re=>a.jsx("button",{onClick:()=>H(J,re),disabled:J.status===re||E===J.id,className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${J.status===re?q(re):s==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"} ${J.status===re?W(re):ne} disabled:opacity-50`,children:Ma[re].label},re)),ee&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:`border-t ${_} my-2`}),a.jsx("button",{onClick:()=>{g(null),t(J)},className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${s==="dark"?"hover:bg-gray-700":"hover:bg-gray-100"} ${ne}`,children:"Редактировать"}),a.jsx("button",{onClick:()=>{g(null),n(J.id)},className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${s==="dark"?"hover:bg-red-500/20 text-red-400":"hover:bg-red-50 text-red-600"}`,children:"Удалить"})]})]})})]})]})})]}),a.jsxs("div",{className:"space-y-1.5 text-xs mb-2",children:[a.jsxs("div",{className:"space-y-1",children:[a.jsxs("div",{className:`flex items-center gap-1 ${s==="dark"?"text-blue-400":"text-blue-600"}`,children:[a.jsx("span",{className:"font-medium",children:"Автор:"}),a.jsx("span",{className:s==="dark"?"text-gray-400":"text-gray-600",children:((ie=ve.find(re=>re.id===J.createdBy))==null?void 0:ie.name)||"Неизвестно"})]}),a.jsxs("div",{className:"flex flex-col gap-1",children:[a.jsx("div",{className:"flex items-center gap-1 text-[#4E6E49]",children:a.jsx("span",{className:"font-medium",children:"Исполнители:"})}),Xe.length>0?Xe.map(re=>a.jsxs("div",{className:`text-[11px] sm:text-xs ${s==="dark"?"text-gray-300":"text-gray-700"} flex flex-wrap gap-1`,children:[a.jsx("span",{className:"font-medium",children:re.member.name}),a.jsx("span",{children:"•"}),a.jsx("span",{children:re.priority==="high"?"Высокий":re.priority==="medium"?"Средний":"Низкий"}),re.comment&&a.jsxs(a.Fragment,{children:[a.jsx("span",{children:"•"}),a.jsx("span",{className:"truncate max-w-[140px] sm:max-w-[180px]",children:re.comment})]})]},re.member.id)):a.jsx("span",{className:"text-gray-500",children:"Не назначены"})]})]}),a.jsxs("div",{className:`flex items-center gap-1 flex-wrap ${s==="dark"?"text-gray-400":"text-gray-600"}`,children:[a.jsxs("span",{children:["📅 ",oe(new Date(J.dueDate),"dd.MM.yyyy")]}),a.jsxs("span",{children:["🕐 ",J.dueTime]}),a.jsx(rg,{dueDate:J.dueDate,dueTime:J.dueTime,theme:s,size:"compact"})]}),J.description&&a.jsx("p",{className:`line-clamp-2 ${s==="dark"?"text-gray-300":"text-gray-600"}`,children:J.description}),a.jsx("div",{className:"flex items-center gap-2 flex-wrap",children:a.jsx("span",{className:`px-1.5 py-0.5 rounded text-xs ${q(V)} ${W(V)}`,children:J.category==="trading"?"📈":J.category==="learning"?"📚":J.category==="technical"?"⚙️":J.category==="stream"?"📺":J.category==="research"?"🔬":(J.category==="organization","📋")})})]}),ke&&a.jsxs("div",{className:`flex gap-2 mt-2 pt-2 border-t ${_}`,children:[a.jsxs("button",{onClick:()=>Z(J,"approve"),className:"flex-1 px-2 py-1.5 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",children:[a.jsx($n,{className:"w-3 h-3"}),"Согласовать"]}),a.jsxs("button",{onClick:()=>{p({task:J}),j("")},className:"flex-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",children:[a.jsx(Pt,{className:"w-3 h-3"}),"Отклонить"]})]}),pe&&a.jsx("div",{className:`mt-2 pt-2 border-t ${_}`,children:a.jsxs("button",{onClick:()=>ce(J),disabled:E===J.id,className:"w-full px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50",children:[a.jsx(Af,{className:"w-3 h-3"}),"Отправить на согласование"]})})]},J.id)}),X.length===0&&a.jsxs("div",{className:`text-center py-6 sm:py-8 ${s==="dark"?"text-gray-500":"text-gray-400"}`,children:[a.jsx(Pr,{className:"w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50"}),a.jsx("p",{className:"text-xs sm:text-sm",children:"Нет задач"})]})]})]},V)})})}),x&&a.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:a.jsxs("div",{className:`${B} rounded-xl p-6 max-w-md w-full border-2 ${_}`,children:[a.jsx("h3",{className:`text-lg font-bold mb-4 ${ne}`,children:"Отклонить задачу"}),a.jsx("textarea",{value:T,onChange:V=>j(V.target.value),placeholder:"Укажите причину отклонения",rows:3,className:`w-full px-4 py-2 rounded-lg border ${_} ${s==="dark"?"bg-gray-700":"bg-gray-50"} ${ne} mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}),a.jsxs("div",{className:"flex gap-3",children:[a.jsx("button",{onClick:()=>x.task&&Z(x.task,"reject"),disabled:E===x.task.id||!T.trim(),className:"flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50",children:"Отклонить"}),a.jsx("button",{onClick:()=>{p(null),j("")},className:`px-4 py-2 rounded-lg font-medium transition-colors ${s==="dark"?"bg-gray-700 hover:bg-gray-600":"bg-gray-200 hover:bg-gray-300"}`,children:"Отмена"})]})]})})]})},B1=()=>{const{theme:r}=Ve(),{user:e}=nt(),[t,n]=A.useState(!1),[s,i]=A.useState(null),[l,c]=A.useState([]),[d,h]=A.useState(!0),[g,x]=A.useState("all"),[p,T]=A.useState("all"),[j,E]=A.useState([]),[I,D]=A.useState("kanban"),S=r==="dark"?"text-white":"text-gray-900",C=r==="dark"?"bg-[#1a1a1a]":"bg-white";A.useEffect(()=>{F()},[e]),A.useEffect(()=>{F()},[g,p,j]);const F=async()=>{h(!0);try{const f={};g!=="all"&&(f.category=g),p!=="all"&&(f.status=p),j.length>0&&(f.assignedTo=j);const O=await Um(f);c(O)}catch(f){console.error("Error loading tasks:",f)}finally{h(!1)}},ne=f=>{i(f),n(!0)},B=async f=>{if(confirm("Вы уверены, что хотите удалить эту задачу?"))try{await Bm(f),F()}catch(O){console.error("Error deleting task:",O)}},_=()=>{n(!1),i(null)},y=()=>{n(!1),i(null),F()},b=()=>{x("all"),T("all"),E([])},w=l.filter(f=>!(g!=="all"&&f.category!==g||p!=="all"&&f.status!==p||j.length>0&&!j.some(O=>f.assignedTo.includes(O)))),k={pending:l.filter(f=>f.status==="pending").length,inProgress:l.filter(f=>f.status==="in_progress").length,completed:l.filter(f=>f.status==="completed").length,closed:l.filter(f=>f.status==="closed").length},N=e?l.filter(f=>{var O;return(O=f.assignedTo)==null?void 0:O.includes(e.id)}).length:0;return a.jsx(qt,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${C} shadow-xl border-2 ${r==="dark"?"border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]":"border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white"} relative overflow-hidden`,children:[a.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"}),a.jsx("div",{className:"absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"}),a.jsxs("div",{className:"relative z-10",children:[a.jsx("div",{className:"flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6",children:a.jsxs("div",{className:"flex-1",children:[a.jsxs("div",{className:"flex items-center gap-2 sm:gap-3 mb-2",children:[a.jsx(Pr,{className:"w-6 h-6 sm:w-8 sm:h-8 text-[#4E6E49]"}),a.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${S} flex items-center gap-2`,children:["Задачи",a.jsx(rn,{className:`w-5 h-5 sm:w-6 sm:h-6 ${r==="dark"?"text-yellow-400":"text-yellow-600"}`})]})]}),a.jsx("p",{className:`text-sm sm:text-base ${r==="dark"?"text-gray-300":"text-gray-600"}`,children:"Управление задачами и заданиями команды"}),a.jsx("div",{className:"flex flex-wrap gap-2 mt-2",children:[{href:"#tasks-stats",label:"Обзор"},{href:"#tasks-board",label:"Доска"},{href:"#tasks-filters",label:"Фильтры"}].map(f=>a.jsx("a",{href:f.href,className:`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${r==="dark"?"border-white/10 bg-white/5 text-white hover:border-[#4E6E49]/50":"border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:f.label},f.href))})]})}),a.jsxs("div",{id:"tasks-stats",className:"grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4",children:[a.jsxs("div",{className:`p-3 sm:p-4 rounded-lg border-2 ${r==="dark"?"bg-yellow-500/10 border-yellow-500/30":"bg-yellow-50 border-yellow-200"}`,children:[a.jsx("div",{className:`text-xs sm:text-sm font-medium mb-1 ${r==="dark"?"text-yellow-400":"text-yellow-700"}`,children:"На согласовании"}),a.jsx("div",{className:`text-xl sm:text-2xl font-bold ${S}`,children:k.pending})]}),a.jsxs("div",{className:`p-3 sm:p-4 rounded-lg border-2 ${r==="dark"?"bg-blue-500/10 border-blue-500/30":"bg-blue-50 border-blue-200"}`,children:[a.jsx("div",{className:`text-xs sm:text-sm font-medium mb-1 ${r==="dark"?"text-blue-400":"text-blue-700"}`,children:"В работе"}),a.jsx("div",{className:`text-xl sm:text-2xl font-bold ${S}`,children:k.inProgress})]}),a.jsxs("div",{className:`p-3 sm:p-4 rounded-lg border-2 ${r==="dark"?"bg-[#4E6E49]/10 border-[#4E6E49]/30":"bg-green-50 border-green-200"}`,children:[a.jsx("div",{className:"text-xs sm:text-sm font-medium mb-1 text-[#4E6E49]",children:"Выполнена"}),a.jsx("div",{className:`text-xl sm:text-2xl font-bold ${S}`,children:k.completed})]}),a.jsxs("div",{className:`p-3 sm:p-4 rounded-lg border-2 ${r==="dark"?"bg-gray-500/10 border-gray-500/30":"bg-gray-50 border-gray-200"}`,children:[a.jsx("div",{className:`text-xs sm:text-sm font-medium mb-1 ${r==="dark"?"text-gray-400":"text-gray-700"}`,children:"Закрыта"}),a.jsx("div",{className:`text-xl sm:text-2xl font-bold ${S}`,children:k.closed})]})]}),e&&a.jsxs("div",{className:"mt-4 flex flex-wrap gap-2",children:[a.jsxs("div",{className:`px-3 py-2 rounded-lg text-xs font-semibold border ${r==="dark"?"border-white/10 text-white bg-white/5":"border-gray-200 text-gray-800 bg-white"}`,children:["Мои задачи: ",N]}),a.jsx(zt,{to:"/profile",className:`px-3 py-2 rounded-lg text-xs font-semibold border ${r==="dark"?"border-white/10 text-white bg-white/5 hover:border-[#4E6E49]/50":"border-gray-200 text-gray-800 bg-white hover:border-[#4E6E49]/50 hover:text-[#4E6E49]"}`,children:"Перейти в ЛК"})]})]})]}),a.jsxs("div",{className:"flex flex-col lg:flex-row gap-4 sm:gap-6",id:"tasks-board",children:[a.jsx("div",{className:"lg:w-80 flex-shrink-0",children:a.jsx(F1,{selectedCategory:g,selectedStatus:p,selectedUsers:j,onCategoryChange:x,onStatusChange:T,onUsersChange:E,onClear:b})}),a.jsxs("div",{className:"flex-1",children:[a.jsxs("div",{className:"flex items-center justify-between mb-4 gap-3",children:[a.jsxs("h2",{className:`text-xl font-bold ${S}`,children:["Задачи (",w.length,")"]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs("div",{className:`flex rounded-lg border-2 ${r==="dark"?"border-gray-800":"border-gray-300"} overflow-hidden`,children:[a.jsx("button",{onClick:()=>D("kanban"),className:`px-3 py-2 transition-colors ${I==="kanban"?"bg-[#4E6E49] text-white":r==="dark"?"bg-[#1a1a1a] text-gray-300 hover:bg-gray-700":"bg-white text-gray-700 hover:bg-gray-50"}`,title:"Kanban доска",children:a.jsx(_f,{className:"w-4 h-4"})}),a.jsx("button",{onClick:()=>D("list"),className:`px-3 py-2 transition-colors ${I==="list"?"bg-[#4E6E49] text-white":r==="dark"?"bg-[#1a1a1a] text-gray-300 hover:bg-gray-700":"bg-white text-gray-700 hover:bg-gray-50"}`,title:"Список",children:a.jsx(Ef,{className:"w-4 h-4"})})]}),a.jsxs("button",{onClick:()=>n(!0),className:"px-4 py-2 bg-gradient-to-r from-[#4E6E49] to-emerald-700 hover:from-[#4E6E49] hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2",children:[a.jsx(Ns,{className:"w-5 h-5"}),a.jsx("span",{className:"hidden sm:inline",children:"Новая задача"}),a.jsx("span",{className:"sm:hidden",children:"Добавить"})]})]})]}),d?a.jsx("div",{className:`${C} rounded-xl p-8 text-center ${S}`,children:a.jsx("div",{className:"animate-pulse",children:"Загрузка..."})}):w.length===0?a.jsxs("div",{className:`${C} rounded-xl p-8 text-center border-2 ${r==="dark"?"border-gray-800":"border-gray-300"}`,children:[a.jsx(Pr,{className:`w-12 h-12 mx-auto mb-4 ${r==="dark"?"text-gray-600":"text-gray-400"}`}),a.jsx("p",{className:`text-lg font-medium ${S} mb-2`,children:"Нет задач"}),a.jsx("p",{className:`text-sm ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:g!=="all"||p!=="all"||j.length>0?"Попробуйте изменить фильтры":"Создайте первую задачу"})]}):I==="kanban"?a.jsx(U1,{tasks:w,onUpdate:F,onEdit:ne,onDelete:B}):a.jsx("div",{className:"grid grid-cols-1 gap-4 sm:gap-6",children:w.map(f=>a.jsx(L1,{task:f,onEdit:ne,onDelete:B,onUpdate:F},f.id))})]})]}),t&&a.jsx(D1,{onClose:_,onSave:y,editingTask:s})]})})},no=[{id:"all",name:"Все вопросы",icon:a.jsx(Fo,{className:"w-5 h-5"}),color:"text-blue-600",darkColor:"text-blue-400"},{id:"auth",name:"Авторизация",icon:a.jsx(kf,{className:"w-5 h-5"}),color:"text-purple-600",darkColor:"text-purple-400"},{id:"slots",name:"Рабочие слоты",icon:a.jsx(mr,{className:"w-5 h-5"}),color:"text-[#4E6E49]",darkColor:"text-[#4E6E49]"},{id:"status",name:"Статусы",icon:a.jsx(Lo,{className:"w-5 h-5"}),color:"text-orange-600",darkColor:"text-orange-400"},{id:"rating",name:"Рейтинг",icon:a.jsx(Vr,{className:"w-5 h-5"}),color:"text-red-600",darkColor:"text-red-400"},{id:"earnings",name:"Заработок",icon:a.jsx(ai,{className:"w-5 h-5"}),color:"text-yellow-600",darkColor:"text-yellow-400"},{id:"calls",name:"Торговые сигналы",icon:a.jsx(Tn,{className:"w-5 h-5"}),color:"text-emerald-700",darkColor:"text-emerald-500"},{id:"tasks",name:"Задачи",icon:a.jsx(Pr,{className:"w-5 h-5"}),color:"text-lime-600",darkColor:"text-lime-400"},{id:"admin",name:"Администратор",icon:a.jsx(Lt,{className:"w-5 h-5"}),color:"text-indigo-600",darkColor:"text-indigo-400"},{id:"messages",name:"Сообщения",icon:a.jsx(_u,{className:"w-5 h-5"}),color:"text-cyan-600",darkColor:"text-cyan-400"},{id:"referrals",name:"Рефералы",icon:a.jsx(un,{className:"w-5 h-5"}),color:"text-pink-600",darkColor:"text-pink-400"},{id:"edit",name:"Редактирование",icon:a.jsx($t,{className:"w-5 h-5"}),color:"text-teal-600",darkColor:"text-teal-400"},{id:"interface",name:"Интерфейс сайта",icon:a.jsx(wu,{className:"w-5 h-5"}),color:"text-violet-600",darkColor:"text-violet-400"}],ja=[{question:"Как начать работу с системой?",answer:`1. Авторизуйтесь в боте командой /start, введя ваш логин и пароль в формате "логин : пароль"
2. После успешной авторизации вы получите ваши данные доступа
3. Используйте /menu для доступа к основным разделам
4. Ознакомьтесь с правилами сообщества по ссылке, которая придет после авторизации

Для работы на сайте просто войдите, используя те же логин и пароль.`,category:"auth"},{question:"Как работает авторизация?",answer:`ПЕРВЫЙ ВХОД В БОТА:
1. Отправьте команду /start
2. Бот попросит ввести логин и пароль
3. Введите в формате: "логин : пароль" (например: mylogin : mypassword)
4. После успешной авторизации вы получите:
   • Ваше имя
   • Ваш логин
   • Ваш пароль
   • Ссылку на правила сообщества

ВХОД НА САЙТ:
1. Откройте сайт
2. На странице входа выберите тип пользователя: "Участник" или "Админ"
3. Если выбрали "Участник":
   • Введите логин
   • Введите пароль
4. Если выбрали "Админ":
   • Введите только пароль администратора
5. Выберите тему оформления (светлая/темная) - она сохранится для всего сайта
6. Нажмите "Войти"
7. При первом входе система запомнит ваши данные

ВЫХОД:
• В боте: команда /logout
• На сайте: кнопка выхода в правом верхнем углу

ВАЖНО:
• Не передавайте свои данные доступа третьим лицам
• Храните логин и пароль в безопасном месте
• После выхода для доступа снова используйте /start в боте или войдите на сайте
• Тема оформления, выбранная на странице входа, сохраняется и применяется ко всему сайту
• Режим администратора на сайте активируется при входе с паролем админа

ПРОБЛЕМЫ С ВХОДОМ:
• Проверьте правильность формата (логин : пароль с пробелами вокруг двоеточия)
• Убедитесь, что используете правильные логин и пароль
• Если не помогло, обратитесь к администратору: @artyommedoed`,category:"auth"},{question:"Как войти в режим администратора на сайте?",answer:`АКТИВАЦИЯ РЕЖИМА АДМИНИСТРАТОРА НА САЙТЕ:
1. Откройте страницу входа на сайте
2. Выберите тип пользователя "Админ" (кнопка справа)
3. Введите пароль администратора
4. Нажмите "Войти"
5. После успешного входа режим администратора будет активен

ОТЛИЧИЯ ОТ ВХОДА УЧАСТНИКА:
• При входе как "Админ" не нужно вводить логин - только пароль
• Режим администратора активируется автоматически
• Все административные функции становятся доступными

ЧТО МОЖЕТ АДМИНИСТРАТОР:
• Управлять слотами и статусами всех участников
• Массовое создание/удаление слотов
• Добавлять заработок за любую дату
• Удалять сообщения из подсчета
• Просматривать и редактировать данные всех участников

ДЕАКТИВАЦИЯ:
• Выйдите из системы (кнопка выхода в правом верхнем углу)
• При следующем входе выберите "Участник" для обычного доступа

ВАЖНО:
• Пароль администратора не передавайте третьим лицам
• Режим администратора дает полный доступ к системе`,category:"admin"},{question:"Как добавить торговый сигнал?",answer:`В БОТЕ:
1. Используйте команду /add_call
2. Следуйте инструкциям бота для пошагового ввода:

ШАГ 1 - СЕТЬ:
• Выберите сеть из списка: Solana, BSC, Ethereum, Base, Ton, Tron, SUI или CEX биржа
• Нажмите на соответствующую кнопку

ШАГ 2 - ТИКЕР ТОКЕНА:
• Введите тикер токена (например: PEPE, DOGE, BONK)
• Бот покажет его с символом № (например: №PEPE)

ШАГ 3 - ПАРА ТОКЕНА:
• Введите торговую пару (например: PEPE/USDT)

ШАГ 4 - ТОЧКА ВХОДА:
• Введите точку входа или диапазон в формате капитализации
• Можно указать одно значение или диапазон (например: 1000000 или 1000000-1500000)

ШАГ 5 - ЦЕЛЬ:
• Введите цели по прибыли в формате капитализации
• Можно указать несколько целей через запятую (например: 2000000, 3000000, 5000000)

ШАГ 6 - СТРАТЕГИЯ:
• Выберите стратегию: Флип, Среднесрок или Долгосрок

ШАГ 7 - РИСКИ:
• Опишите риски, связанные с этим сигналом

ШАГ 8 - УСЛОВИЯ ОТМЕНЫ:
• Укажите условия отмены или пересмотра сигнала (или "-" для пропуска)

ШАГ 9 - КОММЕНТАРИЙ:
• Добавьте дополнительный комментарий (или "-" для пропуска)

НА САЙТЕ:
1. Перейдите в раздел "Call"
2. Нажмите кнопку "Создать сигнал"
3. Заполните форму со всеми параметрами
4. Нажмите "Сохранить"

ПРОСМОТР СИГНАЛОВ:
• /my_calls - ваши сигналы
• /all_calls - все активные сигналы команды
• Раздел "Call" на сайте - все сигналы с фильтрацией и поиском`,category:"calls"},{question:"Как просмотреть торговые сигналы?",answer:`В БОТЕ:

МОИ СИГНАЛЫ:
• /my_calls - показывает все ваши торговые сигналы
• Отображается список с:
  - Символом № перед тикером
  - Сетью и парой
  - Точкой входа (капитализация)
  - Целью (капитализация)
  - Стратегией
  - Статусом (Активен/Завершен/Отменен)
  - Датой создания

ВСЕ СИГНАЛЫ:
• /all_calls - показывает все активные сигналы команды
• Фильтрует только активные сигналы
• Отображает информацию о трейдере

НА САЙТЕ:
1. Перейдите в раздел "Call"
2. На странице отображаются:
   • Все сигналы команды
   • Поиск по тикеру, паре или сети
   • Фильтрация по статусу
   • Статистика по сигналам

АНАЛИТИКА:
• Раздел "Call" на сайте показывает:
  - Общую статистику команды
  - Статистику каждого трейдера
  - Средний PNL
  - Количество активных/завершенных/отмененных сигналов
  - Максимальную прибыль

РЕДАКТИРОВАНИЕ И УДАЛЕНИЕ:
• На сайте: кнопки редактирования и удаления для ваших сигналов
• Только автор сигнала или администратор могут редактировать/удалять`,category:"calls"},{question:"Что означают параметры торгового сигнала?",answer:`ПОЛНЫЙ СПИСОК ПАРАМЕТРОВ:

1. СЕТЬ:
• Solana, BSC, Ethereum, Base, Ton, Tron, SUI или CEX биржа
• Определяет блокчейн, на котором торгуется токен

2. ТИКЕР ТОКЕНА (№ТИКЕР):
• Идентификатор токена (например: №PEPE)
• Символ № указывает, что это тикер
• Можно скопировать для поиска на биржах

3. ПАРА ТОКЕНА:
• Торговая пара (например: PEPE/USDT)
• Показывает, с какой валютой торгуется токен

4. ТОЧКА ВХОДА:
• Указывается в формате КАПИТАЛИЗАЦИИ (не цены)
• Может быть одно значение или диапазон
• Пример: 1000000 или 1000000-1500000

5. ЦЕЛЬ:
• Цели по прибыли в формате КАПИТАЛИЗАЦИИ
• Можно указать несколько целей через запятую
• Пример: 2000000, 3000000, 5000000

6. СТРАТЕГИЯ:
• Флип - краткосрочная торговля (часы-дни)
• Среднесрок - среднесрочная торговля (дни-недели)
• Долгосрок - долгосрочная торговля (недели-месяцы)

7. РИСКИ:
• Описание рисков, связанных с торговлей этим токеном
• Важно для понимания потенциальных потерь

8. УСЛОВИЯ ОТМЕНЫ:
• При каких условиях сигнал должен быть отменен
• Может быть изменен или пересмотрен

9. КОММЕНТАРИЙ:
• Дополнительная информация о сигнале
• Аналитика или особенности токена

ВАЖНО:
• Точка входа и цель указываются в КАПИТАЛИЗАЦИИ, а не в цене
• Это помогает учитывать изменения ликвидности и общую оценку проекта`,category:"calls"},{question:"Как работает раздел Management на сайте?",answer:`ОСНОВНЫЕ ВОЗМОЖНОСТИ:

ПРЕДСТАВЛЕНИЯ:
1. ТАБЛИЦА:
   • Отображает участников в строках, дни недели - в колонках
   • Компактный вид для быстрого обзора
   • Аватары участников в первом столбце
   • Подсветка строк при наведении
   • Чередующаяся подсветка для лучшей читаемости

2. НЕДЕЛЯ:
   • Отображает каждый день недели отдельно
   • Карточки со слотами и статусами
   • Визуальное разделение по участникам
   • Удобно для просмотра расписания по дням

ФИЛЬТРЫ СЛОТОВ:
• Все - показывает все слоты
• Предстоящие - только будущие и текущие активные слоты
• Завершенные - только прошедшие слоты

ВИЗУАЛЬНОЕ РАЗДЕЛЕНИЕ:
• Предстоящие слоты: синий градиент с иконкой календаря
• Завершенные слоты: серый градиент с иконкой галочки
• Перерывы: белый фон (светлая тема) или темно-серый (темная тема)
• Аватары участников для быстрой идентификации

СТАТИСТИКА:
• Общее количество слотов за неделю
• Количество предстоящих и завершенных слотов
• Количество активных участников

НАВИГАЦИЯ:
• Кнопки "Предыдущая неделя" и "Следующая неделя"
• Автоматическое отображение текущей недели

БЫСТРЫЕ ДЕЙСТВИЯ:
• Добавление слотов, выходных, больничных, отпуска
• Массовое управление (для администраторов)
• Фильтрация по участникам`,category:"interface"},{question:"Как работают аватары участников?",answer:`ЧТО ТАКОЕ АВАТАРЫ:
• Фотографии участников команды, отображаемые вместо букв
• Круглые изображения для визуальной идентификации
• Помогают быстро найти нужного участника

ГДЕ ОТОБРАЖАЮТСЯ:
• Раздел Management (таблица и неделя)
• Первая колонка в таблице
• Карточки участников в недельном виде
• Рейтинг участников

КАК ДОБАВИТЬ ФОТО:
1. Поместите фотографии в папку public/avatars/
2. Назовите файлы по имени участника:
   • artyom.jpg - для Артёма
   • adel.jpg - для Адели
   • kseniya.jpg - для Ксении
   • olga.jpg - для Ольги
   • anastasia.jpg - для Анастасии

ТРЕБОВАНИЯ К ФОТО:
• Формат: JPG, PNG или другой веб-формат
• Рекомендуемый размер: 200x200 пикселей или больше
• Изображение автоматически обрезается до круга
• Оптимальное соотношение сторон: 1:1 (квадрат)

FALLBACK:
• Если фотография не загружена или не найдена:
  - Отображается первая буква имени
  - Круглая иконка с градиентным фоном
  - Автоматическое переключение при ошибке загрузки

ПРОБЛЕМЫ:
• Проверьте путь к файлу (public/avatars/)
• Убедитесь, что имя файла совпадает с настройками
• Перезагрузите страницу после добавления фото`,category:"interface"},{question:"Как выбрать тему оформления?",answer:`ВЫБОР ТЕМЫ:

НА СТРАНИЦЕ ВХОДА:
1. Откройте сайт
2. На странице входа найдите кнопку переключения темы в правом верхнем углу
3. Нажмите на кнопку:
   • 🌙 (Луна) - включить темную тему
   • ☀️ (Солнце) - включить светлую тему
4. Тема сохранится и будет применяться ко всему сайту после входа

ПОСЛЕ ВХОДА:
• Кнопка переключения темы в правом верхнем углу навигации
• Тема переключается мгновенно
• Сохраняется в браузере между сессиями

ЧТО МЕНЯЕТСЯ:

СВЕТЛАЯ ТЕМА:
• Светлый фон страниц
• Темный текст
• Яркие цвета элементов
• Оптимизирована для работы днем

ТЕМНАЯ ТЕМА:
• Темный фон страниц
• Светлый текст
• Приглушенные цвета элементов
• Оптимизирована для работы вечером/ночью
• Меньше нагрузки на глаза

СОХРАНЕНИЕ:
• Тема сохраняется автоматически в браузере
• При следующем входе тема будет автоматически применена
• Можно изменить в любой момент`,category:"interface"},{question:"Как отличаются предстоящие и завершенные слоты?",answer:`ВИЗУАЛЬНОЕ РАЗДЕЛЕНИЕ:

ПРЕДСТОЯЩИЕ СЛОТЫ:
• Синий градиентный фон (от blue-500 до blue-600)
• Иконка календаря 📅
• Белый текст
• Отображаются для:
  - Будущих дат
  - Текущего дня, если время окончания еще не прошло

ЗАВЕРШЕННЫЕ СЛОТЫ:
• Серый градиентный фон (от gray-500 до gray-600)
• Иконка галочки ✓
• Белый текст
• Отображаются для:
  - Прошедших дат
  - Текущего дня, если время окончания уже прошло

ПЕРЕРЫВЫ:
• Белый фон в светлой теме
• Темно-серый фон (gray-700) в темной теме
• Рамка с оранжевым цветом
• Отображаются под основным слотом

ФИЛЬТРЫ:
• "Все" - показывает все слоты
• "Предстоящие" - только будущие и активные
• "Завершенные" - только прошедшие

ЗАЧЕМ ЭТО НУЖНО:
• Быстро увидеть, какие слоты еще предстоят
• Отличить актуальные слоты от прошлых
• Планировать дальнейшую работу
• Анализировать выполненную работу`,category:"slots"},{question:"Как добавить рабочий слот?",answer:`В боте:
1. Используйте команду /add_slot
2. Введите дату в формате ДД.ММ.ГГГГ (например: 25.12.2024)
3. Введите время начала в формате ЧЧ:ММ (например: 10:00)
4. Введите время окончания (например: 14:00)
5. При необходимости добавьте перерывы (отправьте время начала перерыва или "-" для пропуска)
6. Добавьте комментарий (опционально)

На сайте:
1. Перейдите в раздел Management
2. Нажмите кнопку "Добавить слот"
3. Заполните форму: выберите участника (для админа), дату, добавьте временные интервалы, перерывы и комментарий
4. Нажмите "Сохранить"

Для администраторов доступна массовая установка слотов на несколько участников и дат одновременно.`,category:"slots"},{question:"Как работают перекрытия слотов?",answer:`Система разрешает перекрытие слотов при определенных условиях:

✅ РАЗРЕШЕНО:
- Если новый слот начинается после начала существующего. Например, если есть слот 19:00-21:00, можно создать слот 20:00-22:00
- Перекрытие может быть частичным или полным, если начало нового слота совпадает с началом или происходит после начала существующего

❌ ЗАПРЕЩЕНО:
- Если новый слот начинается до начала существующего и перекрывается с ним
- Максимум 3 участника могут иметь перекрывающиеся слоты одновременно

Примеры:
• Слот 19:00-21:00 и слот 20:00-22:00 ✅ РАЗРЕШЕНО
• Слот 19:00-21:00 и слот 18:00-20:00 ❌ ЗАПРЕЩЕНО
• Слот 19:00-21:00 и слот 21:30-23:00 ✅ РАЗРЕШЕНО`,category:"slots"},{question:"Как посмотреть расписание?",answer:`В боте:
1. Используйте команду /schedule
2. Бот покажет расписание на текущую неделю
3. Используйте кнопки "◀️ Предыдущая" и "Следующая ▶️" для навигации между неделями

Что показывает расписание:
• Все рабочие слоты участников (с временем и ID)
• Выходные, больничные и отпуск всех участников
• Комментарии к слотам и статусам
• ID каждого слота для редактирования/удаления

На сайте:
1. Перейдите в раздел Management
2. На странице автоматически отображается расписание на текущую неделю
3. Используйте навигацию для просмотра других недель
4. Можно фильтровать по участникам

Формат отображения:
• 🟢 Рабочие слоты
• 🟡 Выходные
• 🟣 Больничные
• 🟠 Отпуск`,category:"slots"},{question:"Как добавить выходной?",answer:`В боте:
1. Используйте команду /dayoff
2. Введите дату выходного в формате ДД.ММ.ГГГГ
3. Добавьте комментарий (опционально, отправьте "-" для пропуска)

Важные ограничения:
• Максимально 2 выходных в неделю
• Не более 3 человек могут быть в выходном на одну дату
• Нельзя установить выходной на сегодняшний день (используйте больничный или смену)

На сайте:
1. Перейдите в раздел Management
2. Нажмите кнопку "Добавить выходной"
3. Выберите дату и участника (для админа)
4. Добавьте комментарий (опционально)
5. Нажмите "Сохранить"

Для администраторов доступна массовая установка выходных на несколько участников и дат.`,category:"status"},{question:"Как добавить больничный?",answer:`В боте:
1. Используйте команду /sick
2. Введите дату больничного в формате ДД.ММ.ГГГГ
3. При необходимости укажите несколько дней (система предложит ввести дату окончания)
4. Добавьте комментарий (опционально)

Важные ограничения:
• Обычные пользователи могут добавить больничный только на сегодня + 2 дня вперед
• Администраторы могут добавлять больничные на любые даты
• Максимально 14 дней больничного в месяц
• Больничный должен быть минимум на 1 день

На сайте:
1. Перейдите в раздел Management
2. Нажмите кнопку "Добавить больничный"
3. Выберите дату (и дату окончания для нескольких дней)
4. Добавьте комментарий и сохраните`,category:"status"},{question:"Как добавить отпуск?",answer:`В боте:
1. Используйте команду /vacation
2. Введите дату начала отпуска в формате ДД.ММ.ГГГГ
3. Введите дату окончания отпуска
4. Добавьте комментарий (опционально)

Важные ограничения:
• Максимально 14 дней отпуска в месяц
• Не более 6 отпусков в год
• Отпуск автоматически создается для всех дней в указанном диапазоне включительно

На сайте:
1. Перейдите в раздел Management
2. Нажмите кнопку "Добавить отпуск"
3. Выберите дату начала и окончания
4. Добавьте комментарий и сохраните`,category:"status"},{question:"Как работает система рейтинга?",answer:`Рейтинг рассчитывается в процентах (максимум 100%) на основе 7 параметров за неделю:

1. ВЫХОДНЫЕ (10%)
   • 0-2 выходных в неделю = 10%
   • Более 2 выходных = 0%

2. БОЛЬНИЧНЫЕ (10%)
   • До 7 дней за месяц = 10%
   • Более 7 дней = 0%

3. ОТПУСК (10%)
   • До 7 дней за месяц = 10%
   • Более 7 дней = 0%

4. ЧАСЫ РАБОТЫ (до 25%)
   • 30+ часов в неделю = 25%
   • 20-29 часов = 15%
   • Менее 20 часов = 0%

5. ЗАРАБОТОК (до 30%)
   • 6000+ ₽ в неделю = 30%
   • 3000-5999 ₽ = 15%
   • Менее 3000 ₽ = 0%

6. РЕФЕРАЛЫ (до 30%)
   • 5% за каждого реферала
   • Максимум 30% (6 рефералов)

7. СООБЩЕНИЯ В ГРУППЕ (15%)
   • Более 50 сообщений в неделю = 15%
   • 50 и менее = 0%

Просмотр рейтинга:
• /my_stats - ваша статистика и разбор рейтинга
• /team_kpd - средний рейтинг команды
• Раздел "Рейтинг" на сайте`,category:"rating"},{question:"Какие есть ограничения и правила?",answer:`ОСНОВНЫЕ ОГРАНИЧЕНИЯ:

📅 ВЫХОДНЫЕ:
• Максимум 2 выходных в неделю
• Не более 3 человек одновременно на одну дату
• Нельзя установить выходной на сегодня

🏥 БОЛЬНИЧНЫЕ:
• Обычные пользователи: только сегодня + 2 дня вперед
• Максимум 14 дней в месяц
• Администраторы могут добавлять на любые даты

🏖️ ОТПУСК:
• Максимум 14 дней в месяц
• Не более 6 отпусков в год

⏰ СЛОТЫ:
• Можно перекрывать, если новый слот начинается после начала существующего
• Максимум 3 участника на перекрывающиеся слоты

💰 ЗАРАБОТОК:
• Обычные пользователи: только за сегодня
• Администраторы: за любую дату

📊 РЕЙТИНГ:
• Минимум 20 часов в неделю для получения баллов
• Минимум 50 сообщений в неделю для получения баллов
• Минимум 3000₽ в неделю для получения баллов

📖 ПОЛНЫЕ ПРАВИЛА:
Ознакомьтесь с регламентом торговых сессий по ссылке, которая отправляется после авторизации.`,category:"rating"},{question:"Как добавить заработок?",answer:`В боте:
1. Используйте команду /add_earning
2. Введите дату в формате ДД.ММ.ГГГГ или "сегодня"
3. Введите сумму заработка (только число, например: 5000)
4. Введите сумму пула (только число, например: 1000)

Важно:
• Обычные пользователи могут добавлять заработок только за сегодня
• Администраторы могут добавлять заработок за любую дату

На сайте:
1. Перейдите в раздел Earnings
2. Нажмите кнопку "Добавить заработок"
3. Выберите дату (или введите "сегодня")
4. Укажите сумму заработка и сумму пула
5. При необходимости выберите участников (для распределенного заработка)
6. Нажмите "Сохранить"

Просмотр статистики:
• /earnings_day - статистика за день
• /earnings_week - статистика за неделю`,category:"earnings"},{question:"Как добавить в пул команды?",answer:`В боте:
1. Используйте команду /add_pool
2. Бот покажет список ваших завершенных слотов
3. Выберите слот, скопировав его ID
4. Введите ID слота
5. Введите сумму для добавления в пул (только число)

Важно:
• Можно добавить в пул только для завершенных слотов (слот должен закончиться)
• Слот должен принадлежать вам или вы должны быть его участником
• Пул добавляется на сегодняшнюю дату

На сайте:
1. Перейдите в раздел Earnings
2. Нажмите кнопку "Добавить в пул"
3. Выберите завершенный слот из списка
4. Укажите сумму пула
5. Нажмите "Сохранить"

Пул команды - это общий фонд для поддержки команды и распределения дополнительных бонусов.`,category:"earnings"},{question:"Как работает режим администратора?",answer:`АКТИВАЦИЯ В БОТЕ:
1. Используйте команду /admin
2. Введите пароль администратора
3. После успешной активации вы увидите подтверждение

АКТИВАЦИЯ НА САЙТЕ:
1. На странице входа выберите тип пользователя "Админ"
2. Введите пароль администратора
3. Режим активируется автоматически при входе

ВОЗМОЖНОСТИ АДМИНИСТРАТОРА:

📅 УПРАВЛЕНИЕ СЛОТАМИ:
• Создавать слоты для любого участника
• Массовое создание слотов для нескольких участников одновременно
• Удалять слоты любого участника
• Массовое удаление слотов (по дню недели, датам, диапазону дат)
• Редактировать слоты любого участника

📋 УПРАВЛЕНИЕ СТАТУСАМИ:
• Устанавливать выходные, больничные и отпуск для любого участника
• Массовое управление статусами
• Удалять статусы любого участника
• Редактировать статусы любого участника

💰 УПРАВЛЕНИЕ ЗАРАБОТКОМ:
• Добавлять заработок за любую дату (не только сегодня)
• Редактировать и удалять записи о заработке любого участника
• Добавлять в пул команды

📊 УПРАВЛЕНИЕ СИГНАЛАМИ:
• Редактировать и удалять любые торговые сигналы
• Просматривать всю аналитику команды

📊 ДОПОЛНИТЕЛЬНО:
• Удалять сообщения из подсчета (/remove_message)
• Добавлять больничные на любые даты
• Полный доступ ко всем функциям системы
• Видеть индикатор "Админ" в интерфейсе

ДЕАКТИВАЦИЯ:
• В боте: /logout - выход из системы
• На сайте: кнопка выхода в правом верхнем углу
• При следующем входе выберите "Участник" для обычного режима

БЕЗОПАСНОСТЬ:
• Пароль администратора храните в секрете
• Не передавайте пароль третьим лицам
• Режим администратора дает полный доступ ко всем данным`,category:"admin"},{question:"Как редактировать и удалять торговые сигналы?",answer:`РЕДАКТИРОВАНИЕ:

НА САЙТЕ:
1. Перейдите в раздел "Call"
2. Найдите нужный сигнал в списке
3. Нажмите кнопку редактирования (иконка карандаша)
4. Внесите изменения в форме
5. Нажмите "Сохранить"

УДАЛЕНИЕ:

НА САЙТЕ:
1. Перейдите в раздел "Call"
2. Найдите нужный сигнал
3. Нажмите кнопку удаления (иконка корзины)
4. Подтвердите удаление

ПРАВА ДОСТУПА:
• Обычные пользователи могут редактировать/удалять только свои сигналы
• Администраторы могут редактировать/удалять любые сигналы
• При попытке редактировать чужой сигнал кнопки будут неактивны

ЧТО МОЖНО ИЗМЕНИТЬ:
• Все параметры сигнала:
  - Сеть
  - Тикер токена
  - Пару
  - Точку входа
  - Цель
  - Стратегию
  - Риски
  - Условия отмены
  - Комментарий
  - Статус (Активен/Завершен/Отменен)

ВАЖНО:
• После редактирования изменения сохраняются сразу
• Статус сигнала влияет на отображение в списках
• Завершенные и отмененные сигналы не показываются в "активных"`,category:"calls"},{question:"Как работает аналитика в разделе Call?",answer:`ОБЩАЯ СТАТИСТИКА КОМАНДЫ:
• Общее количество сигналов
• Количество активных сигналов
• Количество завершенных сигналов
• Количество отмененных сигналов
• Средний PNL всех сигналов
• Лучший сигнал по максимальной прибыли

СТАТИСТИКА ПО ТРЕЙДЕРАМ:
• Количество сигналов каждого трейдера
• Активные/завершенные/отмененные сигналы
• Средний PNL трейдера
• Общий PNL трейдера
• Максимальная прибыль по сигналу

ОТОБРАЖЕНИЕ:
• Статистика обновляется автоматически при изменении сигналов
• Показывается только для участников команды
• Данные для MAX прибыли, PNL и капитализации загружаются из аналитических сервисов
• Обновление данных происходит в реальном времени

ИСПОЛЬЗОВАНИЕ:
• Оценить эффективность работы команды
• Сравнить результаты разных трейдеров
• Найти лучшие торговые стратегии
• Отследить динамику сигналов`,category:"calls"},{question:"Как работает подсчет сообщений?",answer:`Система автоматически считает сообщения в группе:

✅ УЧИТЫВАЮТСЯ:
• Все типы сообщений в группе (текст, фото, стикеры, видео, голосовые и т.д.)
• Сообщения авторизованных пользователей
• Сообщения за неделю (для расчета рейтинга)

❌ НЕ УЧИТЫВАЮТСЯ:
• Команды бота (начинающиеся с /)
• Сообщения неавторизованных пользователей
• Сообщения в личных чатах (только групповые)

Важно:
• Для учета в рейтинге нужно отправить более 50 сообщений в неделю (это дает 15% к рейтингу)
• Сообщения считаются автоматически, ничего делать не нужно
• Если сообщение удалено из группы, администратор может удалить его из подсчета командой /remove_message (ответить reply на сообщение)

Проверка количества сообщений:
• /my_stats - показывает количество сообщений за неделю
• Раздел "Рейтинг" на сайте - детальная статистика`,category:"messages"},{question:"Что делать, если сообщение удалено из группы?",answer:`Если сообщение было удалено из группы, оно все еще учитывается в подсчете. Чтобы убрать его из подсчета:

Для администратора:
1. Используйте команду /remove_message
2. Ответьте (reply) на удаленное сообщение (если оно видно в истории) ИЛИ введите ID сообщения
3. Система удалит сообщение из подсчета и уменьшит счетчик

Формат:
• /remove_message (с reply на сообщение) - автоматически определит ID
• /remove_message [messageId] - указать ID вручную

Что происходит:
• Сообщение удаляется из коллекции messages
• Счетчик в ratings уменьшается на 1
• При расчете рейтинга за неделю это сообщение не учитывается

Важно:
• Только администраторы могут удалять сообщения из подсчета
• Обычные пользователи не имеют доступа к этой функции
• Если сообщение удалено из группы, его ID можно узнать из истории чата или через другие методы`,category:"messages"},{question:"Как работают рефералы?",answer:`Система рефералов позволяет получить дополнительный рейтинг за привлечение новых участников:

Как добавить реферала:
В боте:
1. Используйте команду /add_referral
2. Введите имя реферала
3. Введите ID реферала (username или номер)
4. Укажите возраст (опционально, отправьте "-" для пропуска)
5. Добавьте комментарий (опционально)

На сайте:
1. Перейдите в раздел Rating
2. Нажмите "Добавить реферала"
3. Заполните форму

Система начисления:
• 5% к рейтингу за каждого реферала
• Максимум 30% (6 рефералов)
• Рефералы учитываются за последние 30 дней

Управление рефералами:
• /my_referrals - список ваших рефералов
• /edit_referral [ID] - редактировать реферала
• /delete_referral [ID] - удалить реферала

На сайте доступны те же функции в разделе Rating.`,category:"referrals"},{question:"Как редактировать и удалять записи?",answer:`УДАЛЕНИЕ:

В боте (для своих записей):
• /delete_slot [ID] - удалить слот
• /delete_dayoff [ID] - удалить выходной
• /delete_sick [ID] - удалить больничный
• /delete_vacation [ID] - удалить отпуск
• /delete_earning [ID] - удалить заработок
• /delete_referral [ID] - удалить реферала

Массовое удаление слотов:
• /bulk_delete_slots - доступны варианты:
  - По дню недели (удалить все слоты на определенный день недели)
  - По датам (удалить слоты на конкретные даты)
  - По диапазону дат (удалить слоты за период)

На сайте:
• Перейдите в соответствующий раздел
• Найдите нужную запись
• Нажмите кнопку удаления (иконка корзины)
• Подтвердите удаление

РЕДАКТИРОВАНИЕ:

В боте:
• Редактирование доступно только на сайте
• Используйте команды вида /edit_slot [ID], чтобы получить информацию
• В боте появится сообщение о том, что редактирование доступно на сайте

На сайте:
• Перейдите в соответствующий раздел
• Найдите нужную запись
• Нажмите кнопку редактирования (иконка карандаша)
• Внесите изменения и сохраните

ЧТО МОЖНО РЕДАКТИРОВАТЬ:
• Рабочие слоты: время, перерывы, комментарий, участники
• Статусы: даты, комментарий
• Заработок: дата, сумма, пул, участники
• Торговые сигналы: все параметры и статус
• Рефералы: имя, возраст, комментарий

Важно:
• Обычные пользователи могут редактировать/удалять только свои записи
• Администраторы могут управлять записями всех участников
• При попытке редактировать чужую запись кнопки будут неактивны`,category:"edit"},{question:"Как использовать фильтры и поиск на сайте?",answer:`ФИЛЬТРЫ В РАЗДЕЛЕ MANAGEMENT:

ФИЛЬТР СЛОТОВ:
• "Все" - показывает все слоты независимо от статуса
• "Предстоящие" - только будущие и активные слоты
• "Завершенные" - только прошедшие слоты

ФИЛЬТР ПО УЧАСТНИКАМ:
• Выберите конкретного участника из списка
• "Все участники команды" - показывает всех
• Применяется к обоим представлениям (таблица и неделя)

ПРЕДСТАВЛЕНИЯ:
• "Таблица" - компактный вид с участниками в строках
• "Неделя" - детальный вид по дням недели
• Переключение кнопками в верхней части страницы

ПОИСК В РАЗДЕЛЕ CALL:
• Поле поиска в верхней части страницы
• Поиск по:
  - Тикеру токена (например: PEPE)
  - Паре токена (например: PEPE/USDT)
  - Сети (например: Solana)
• Поиск работает в реальном времени
• Автоматически фильтрует список сигналов

КАК ИСПОЛЬЗОВАТЬ:
1. Выберите нужный фильтр
2. Результаты обновятся автоматически
3. Несколько фильтров можно применять одновременно
4. Для сброса выберите "Все" или очистите поле поиска`,category:"interface"},{question:"Как работает статистика на сайте?",answer:`РАЗДЕЛ MANAGEMENT:

СТАТИСТИКА СЛОТОВ:
• Общее количество слотов за неделю
• Количество предстоящих слотов (синий индикатор)
• Количество завершенных слотов (серый индикатор)
• Количество активных участников за неделю

СТАТИСТИКА ПО УЧАСТНИКУ:
• Количество слотов участника
• Общее количество часов работы
• Отображается в последней колонке таблицы

РАЗДЕЛ EARNINGS:

СТАТИСТИКА ЗАРАБОТКА:
• Заработок за неделю
• Пул команды за неделю
• Заработок за месяц
• Пул команды за месяц

РАЗДЕЛ RATING:

РЕЙТИНГ УЧАСТНИКОВ:
• Процент эффективности каждого участника
• Детальный разбор по параметрам:
  - Выходные (10%)
  - Больничные (10%)
  - Отпуск (10%)
  - Часы работы (до 25%)
  - Заработок (до 30%)
  - Рефералы (до 30%)
  - Сообщения (15%)

СРЕДНИЙ РЕЙТИНГ КОМАНДЫ:
• Общий процент эффективности команды
• Визуальный индикатор с цветовыми зонами:
  - Зеленая: 70%+
  - Желтая: 50-70%
  - Синяя: менее 50%

РАЗДЕЛ CALL:

СТАТИСТИКА СИГНАЛОВ:
• Общее количество сигналов
• Активные/завершенные/отмененные
• Средний PNL команды
• Лучший сигнал по прибыли
• Статистика по каждому трейдеру

ОБНОВЛЕНИЕ:
• Статистика обновляется автоматически
• При изменении данных статистика пересчитывается
• Данные загружаются из базы данных в реальном времени`,category:"interface"},{question:"Как работает навигация на сайте?",answer:`СТРУКТУРА МЕНЮ:

НА ПК (верхнее меню):
• Call - управление торговыми сигналами
• Функционал - выпадающее меню с подразделами:
  - Расписание (Management)
  - Заработок (Earnings)
  - Задачи (Tasks)
  - Рейтинг (Rating)
• О сообществе - информация о команде
• FAQ - часто задаваемые вопросы
• ЛК - личный кабинет
• Админ - только для администраторов

НА МОБИЛЬНЫХ (нижнее меню):
• Фиксированное меню внизу экрана для удобной навигации
• Те же разделы, что и на ПК
• Подменю "Функционал" открывается вверх от кнопки
• Иконки и подписи для быстрого доступа

ОСНОВНЫЕ РАЗДЕЛЫ:

CALL:
• Управление торговыми сигналами
• Создание, редактирование, удаление сигналов
• Аналитика по сигналам и трейдерам
• Поиск и фильтрация сигналов

ФУНКЦИОНАЛ:

Расписание (Management):
• Управление рабочими слотами
• Установка выходных, больничных, отпуска
• Просмотр расписания команды
• Два представления: таблица и неделя
• Фильтры по статусу и участникам

Заработок (Earnings):
• Добавление заработка
• Добавление в пул команды
• Статистика заработка (неделя/месяц)
• Просмотр истории заработка

Задачи (Tasks):
• Управление задачами и заданиями команды
• Kanban доска с drag & drop
• Список задач
• Система согласования задач
• Фильтрация по категориям, статусам и участникам
• Уведомления о новых задачах и изменениях

Рейтинг (Rating):
• Рейтинг всех участников
• Детальный разбор по параметрам
• Средний рейтинг команды
• Управление рефералами

О СООБЩЕСТВЕ:
• Информация о команде ApeVault
• Возможности и принципы работы
• Ссылка на правила сообщества
• Контактная информация

FAQ:
• Ответы на частые вопросы
• Инструкции по работе с системой
• Категории для удобной навигации

ЛК (ЛИЧНЫЙ КАБИНЕТ):
• Личные данные: имя, логин, пароль
• Рейтинг и эффективность
• Статистика задач
• Уведомления
• Выход из аккаунта

АДМИН (только для администраторов):
• Информация о режиме администратора
• Список возможностей
• Доступен только при активном режиме админа`,category:"interface"},{question:"Что такое личный кабинет (ЛК)?",answer:`ЛИЧНЫЙ КАБИНЕТ - это раздел с вашими персональными данными и статистикой:

ЛИЧНЫЕ ДАННЫЕ:
• Имя - ваше имя в системе
• Логин - ваш логин для входа
• Пароль - ваш пароль (с возможностью показать/скрыть и копировать)

РЕЙТИНГ:
• Процент эффективности (максимум 100%)
• Детальный разбор по параметрам:
  - Выходные (10%)
  - Больничные (10%)
  - Отпуск (10%)
  - Часы работы (до 25%)
  - Заработок (до 30%)
  - Рефералы (до 30%)
  - Сообщения (15%)
• Цветовая индикация:
  - Зеленая: 70%+
  - Желтая: 50-70%
  - Синяя: менее 50%

МОИ ЗАДАЧИ:
• Статистика по статусам:
  - На согласовании
  - В работе
  - Выполнена
  - Всего задач
• Кнопка перехода к задачам

УВЕДОМЛЕНИЯ:
• Количество непрочитанных уведомлений
• Общее количество уведомлений
• Кнопка перехода к уведомлениям

ВЫХОД ИЗ АККАУНТА:
• Кнопка "Выйти из аккаунта" внизу страницы
• При выходе:
  - Деактивируется режим администратора (если был активен)
  - Выполняется выход из системы
  - Перенаправление на страницу входа

КАК ОТКРЫТЬ:
• Нажмите "ЛК" в меню навигации
• Или перейдите по адресу /profile

ВАЖНО:
• Все данные обновляются автоматически
• Рейтинг рассчитывается на основе последних данных
• Задачи и уведомления загружаются в реальном времени`,category:"interface"},{question:"Как работает раздел Tasks (Задачи)?",answer:`РАЗДЕЛ ЗАДАЧ - это система управления заданиями для команды:

ОСНОВНЫЕ ВОЗМОЖНОСТИ:

СОЗДАНИЕ ЗАДАЧ:
1. Нажмите кнопку "Новая задача"
2. Заполните форму:
   • Название задачи (обязательно)
   • Описание (необязательно)
   • Категория: торговля, обучение, техническая часть, стрим, изучение нового, поиск и систематизация информации
   • Приоритет: низкий, средний, высокий
   • Срок выполнения (необязательно)
   • Участники (выберите одного или нескольких)
3. Нажмите "Создать задачу"

СТАТУСЫ ЗАДАЧ:

1. НА СОГЛАСОВАНИИ:
   • Все новые задачи начинаются с этого статуса
   • Все назначенные участники должны согласовать задачу
   • Участники могут одобрить или отклонить с комментарием
   • После согласования всеми участниками задача автоматически переходит в "В работе"

2. В РАБОТЕ:
   • Задача выполняется участниками
   • Можно переместить в "Выполнена" когда работа завершена

3. ВЫПОЛНЕНА:
   • Задача завершена
   • Если в задаче несколько участников, они получают уведомление для подтверждения
   • Создатель задачи может закрыть задачу

4. ЗАКРЫТА:
   • Задача окончательно закрыта
   • Не участвует в активной работе

ФИЛЬТРЫ:
• По категориям: торговля, обучение, техническая часть, стрим, изучение нового, поиск и систематизация информации
• По статусам: на согласовании, в работе, выполнена, закрыта
• По участникам: фильтр по конкретному участнику или все

УВЕДОМЛЕНИЯ:
• При создании задачи все назначенные участники получают уведомление
• При изменении статуса задачи (если несколько участников) отправляются уведомления
• При завершении задачи участники получают запрос на подтверждение
• Индикатор непрочитанных уведомлений на карточке задачи
• Кнопка "Отметить все прочитанными" для быстрой очистки

СТАТИСТИКА:
• Количество задач по каждому статусу
• Общее количество задач
• Быстрый обзор активности команды

УПРАВЛЕНИЕ:
• Редактирование задач (только создатель или администратор)
• Удаление задач (только создатель или администратор)
• Изменение статуса задач
• Согласование/отклонение задач`,category:"tasks"},{question:"Как создать задачу и назначить участников?",answer:`СОЗДАНИЕ ЗАДАЧИ:

1. Перейдите в раздел "Задачи"
2. Нажмите кнопку "Новая задача"
3. Заполните форму:

ОБЯЗАТЕЛЬНЫЕ ПОЛЯ:
• Название задачи - краткое описание задания
• Участники - выберите одного или нескольких участников команды

НЕОБЯЗАТЕЛЬНЫЕ ПОЛЯ:
• Описание - детальное описание задачи
• Категория - выберите из списка:
  📈 Торговля
  📚 Обучение
  ⚙️ Техническая часть
  📺 Стрим
  🔬 Изучение нового
  📋 Поиск и систематизация информации
• Приоритет - низкий, средний или высокий
• Срок выполнения - выберите дату (необязательно)

ВЫБОР УЧАСТНИКОВ:
• Нажмите на карточку участника для выбора
• Можно выбрать нескольких участников
• Кнопка "Выбрать всех" для массового выбора
• Кнопка "Снять выделение" для сброса

СОЗДАНИЕ:
• После заполнения нажмите "Создать задачу"
• Задача будет создана со статусом "На согласовании"
• Все назначенные участники получат уведомление

ВАЖНО:
• Задача должна иметь хотя бы одного участника
• После создания задачи все участники должны согласовать ее
• Только после согласования всеми участниками задача перейдет в "В работе"`,category:"tasks"},{question:"Как работает система согласования задач?",answer:`СОГЛАСОВАНИЕ ЗАДАЧ:

КОГДА НУЖНО СОГЛАСОВАТЬ:
• Все новые задачи начинаются со статуса "На согласовании"
• Все назначенные участники должны согласовать задачу
• Пока не все согласовали, задача остается в статусе "На согласовании"

КАК СОГЛАСОВАТЬ:
1. Найдите задачу со статусом "На согласовании"
2. Если вы назначены участником, увидите кнопки "Согласовать" и "Отклонить"
3. Нажмите "Согласовать"
4. При необходимости добавьте комментарий
5. Нажмите "Согласовать" в диалоге

КАК ОТКЛОНИТЬ:
1. Нажмите кнопку "Отклонить"
2. Обязательно укажите причину отклонения в комментарии
3. Нажмите "Отклонить"

ЧТО ПРОИСХОДИТ ПОСЛЕ СОГЛАСОВАНИЯ:
• Ваше согласование сохраняется
• Отображается количество согласований (например: "Согласований: 2/3")
• Когда все участники согласуют, задача автоматически переходит в статус "В работе"
• Кнопка "В работу" появляется только после согласования всеми

ПРОСМОТР СТАТУСА:
• На карточке задачи отображается количество согласований
• Видно, кто уже согласовал, а кто еще нет
• Если вы еще не согласовали, кнопки будут активны

ВАЖНО:
• Комментарий при отклонении обязателен
• После согласования всеми участниками задача автоматически переходит в работу
• Если хотя бы один участник отклонил, задача остается на согласовании`,category:"tasks"},{question:"Как работают уведомления в задачах?",answer:`СИСТЕМА УВЕДОМЛЕНИЙ:

КОГДА ПОЯВЛЯЮТСЯ УВЕДОМЛЕНИЯ:

1. ПРИ СОЗДАНИИ ЗАДАЧИ:
   • Все назначенные участники получают уведомление
   • Текст: "Новая задача [название] добавлена. Просмотрите и согласуйте."
   • Появляется индикатор на карточке задачи

2. ПРИ ИЗМЕНЕНИИ СТАТУСА:
   • Если в задаче несколько участников, все остальные получают уведомление
   • При перемещении в "В работе": "Задача [название] перемещена в работу пользователем [имя]"
   • При перемещении в "Закрыта": "Задача [название] закрыта пользователем [имя]"

3. ПРИ ЗАВЕРШЕНИИ ЗАДАЧИ:
   • Если в задаче несколько участников, они получают уведомление
   • Текст: "Задача [название] выполнена. Подтвердите выполнение."
   • Участники могут подтвердить выполнение

ИНДИКАТОРЫ:
• Значок колокольчика на карточке задачи
• Красный бейдж с количеством непрочитанных уведомлений
• Отображается только если есть непрочитанные уведомления

УПРАВЛЕНИЕ УВЕДОМЛЕНИЯМИ:
• Кнопка "Отметить все прочитанными" в верхней части страницы
• Показывает количество непрочитанных уведомлений
• После нажатия все уведомления помечаются как прочитанные

ВАЖНО:
• Уведомления появляются только для задач с несколькими участниками
• Если в задаче один участник, уведомления не создаются
• Уведомления помогают отслеживать изменения в задачах`,category:"tasks"},{question:"Как фильтровать задачи?",answer:`ФИЛЬТРАЦИЯ ЗАДАЧ:

ФИЛЬТР ПО КАТЕГОРИЯМ:
• Все - показывает задачи всех категорий
• Торговля 📈
• Обучение 📚
• Техническая часть ⚙️
• Стрим 📺
• Изучение нового 🔬
• Поиск и систематизация информации 📋

ФИЛЬТР ПО СТАТУСАМ:
• Все - показывает задачи всех статусов
• На согласовании - задачи, ожидающие согласования
• В работе - активные задачи
• Выполнена - завершенные задачи
• Закрыта - окончательно закрытые задачи

ФИЛЬТР ПО УЧАСТНИКАМ:
• Все - показывает задачи всех участников
• Конкретный участник - фильтрует задачи, где участник назначен

КАК ИСПОЛЬЗОВАТЬ:
1. В левой части страницы находится панель фильтров
2. Выберите нужные фильтры
3. Список задач автоматически обновится
4. Можно применять несколько фильтров одновременно
5. Кнопка "Сбросить" для очистки всех фильтров

СТАТИСТИКА:
• В верхней части страницы отображается статистика по статусам
• Показывает количество задач в каждом статусе
• Обновляется автоматически при изменении фильтров`,category:"tasks"}],q1=()=>{const{theme:r}=Ve(),[e,t]=A.useState("all"),[n,s]=A.useState(new Set),i=r==="dark"?"text-white":"text-gray-900",l=r==="dark"?"text-gray-400":"text-gray-600",c=r==="dark"?"text-gray-300":"text-gray-700",d=r==="dark"?"bg-[#1a1a1a]":"bg-white",h=r==="dark"?"border-gray-800":"border-gray-200",g=r==="dark"?"hover:bg-gray-700":"hover:bg-gray-50",x=e==="all"?ja:ja.filter(E=>E.category===e),p=no.find(E=>E.id===e),T=E=>{const I=new Set(n),D=ja.indexOf(E);I.has(D)?I.delete(D):I.add(D),s(I)},j=E=>E.split(`
`).map((D,S)=>{const C=D.trim();return C.match(/^[А-Я\s]+:$/)||C.match(/^\d+\.\s+[А-Я]/)?a.jsx("h4",{className:`font-bold text-base mt-4 mb-2 ${r==="dark"?"text-white":"text-gray-900"}`,children:C},S):C.startsWith("✅")||C.startsWith("❌")?a.jsxs("div",{className:`flex items-start gap-2 my-2 ${C.startsWith("✅")?"text-[#4E6E49]":r==="dark"?"text-red-400":"text-red-600"}`,children:[a.jsx("span",{className:"text-xl",children:C.startsWith("✅")?"✅":"❌"}),a.jsx("span",{className:"flex-1",children:C.substring(2).trim()})]},S):C.startsWith("•")?a.jsxs("div",{className:"flex items-start gap-2 my-1.5 ml-4",children:[a.jsx("span",{className:`${r==="dark"?"text-blue-400":"text-blue-600"} mt-1`,children:"•"}),a.jsx("span",{className:"flex-1",children:C.substring(1).trim()})]},S):C.match(/^[📅🏥🏖️⏰💰📊📖]\s+[А-Я]/)?a.jsx("div",{className:`font-semibold text-base mt-3 mb-1 ${r==="dark"?"text-gray-200":"text-gray-800"}`,children:C},S):C?a.jsx("p",{className:"my-2 leading-relaxed",children:C},S):a.jsx("br",{},S)});return a.jsx(qt,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:"section-card rounded-2xl p-5 sm:p-6 md:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden mb-4 sm:mb-6",children:[a.jsx("div",{className:"absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"}),a.jsx("div",{className:"absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-[#4E6E49]/10 to-yellow-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"}),a.jsxs("div",{className:"relative z-10 text-center space-y-3 sm:space-y-4",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4",children:[a.jsx("div",{className:`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0 ${r==="dark"?"bg-gradient-to-br from-blue-600 to-purple-600":"bg-gradient-to-br from-blue-500 to-purple-500"} text-white transform transition-transform active:scale-95 sm:hover:scale-110`,children:a.jsx(Fo,{className:"w-5 h-5 sm:w-7 sm:h-7"})}),a.jsx("div",{className:"flex-1 min-w-0",children:a.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${i} flex flex-wrap items-center justify-center gap-2 sm:gap-3`,children:[a.jsx("span",{className:"bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text",children:"FAQ ApeVault Black Ops"}),a.jsx(rn,{className:`hidden sm:inline-flex w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${r==="dark"?"text-yellow-400":"text-yellow-500"} animate-pulse`})]})})]}),a.jsx("p",{className:`text-sm sm:text-base font-medium ${l}`,children:"Найдите ответы на популярные вопросы о работе системы"})]})]}),a.jsx("div",{className:"mb-6 section-card rounded-2xl p-4 sm:p-5 border border-white/60 dark:border-white/10 shadow",children:a.jsx("div",{className:"flex flex-wrap gap-2 justify-center",children:no.map(E=>a.jsxs("button",{onClick:()=>{t(E.id),s(new Set)},className:`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${e===E.id?r==="dark"?"bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105":"bg-blue-600 text-white shadow-lg scale-105":r==="dark"?"bg-[#1a1a1a] text-gray-300 border border-gray-800 hover:bg-gray-700 hover:border-gray-800":"bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"}`,children:[a.jsx("span",{className:e===E.id?"text-white":r==="dark"?E.darkColor:E.color,children:E.icon}),a.jsx("span",{children:E.name})]},E.id))})}),p&&e!=="all"&&a.jsx("div",{className:`${d} rounded-xl p-4 border-2 ${r==="dark"?"border-blue-500/30 bg-blue-500/5":"border-blue-200 bg-blue-50"} mb-6`,children:a.jsxs("div",{className:`flex items-center gap-3 ${r==="dark"?p.darkColor:p.color}`,children:[p.icon,a.jsxs("div",{children:[a.jsx("h3",{className:"font-bold text-lg",children:p.name}),a.jsxs("p",{className:`text-sm ${c}`,children:[x.length," ",x.length===1?"вопрос":x.length<5?"вопроса":"вопросов"]})]})]})}),a.jsx("div",{className:"space-y-4",children:x.length===0?a.jsx("div",{className:`${d} rounded-xl p-8 text-center border ${h}`,children:a.jsx("p",{className:c,children:"В этой категории пока нет вопросов"})}):x.map(E=>{const I=ja.indexOf(E),D=n.has(I),S=no.find(F=>F.id===E.category),C=S?r==="dark"?S.darkColor:S.color:r==="dark"?"text-gray-300":"text-gray-600";return a.jsxs("div",{className:"section-card rounded-2xl shadow-lg border border-white/60 dark:border-white/10 overflow-hidden transition-all duration-300",children:[a.jsxs("button",{onClick:()=>T(E),className:`w-full p-5 sm:p-6 flex flex-col gap-3 text-left ${g} transition-colors group`,children:[a.jsxs("div",{className:"flex items-center justify-between gap-3",children:[a.jsxs("div",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border ${r==="dark"?"bg-[#1a1a1a]/80 border-gray-800":"bg-gray-100 border-gray-200"} ${C}`,children:[S&&a.jsx("span",{className:"flex items-center gap-1 text-sm",children:S.icon}),a.jsx("span",{className:"uppercase tracking-wide",children:S?S.name:"Общее"})]}),a.jsx("div",{className:`flex-shrink-0 p-2 rounded-lg transition-all ${D?r==="dark"?"bg-blue-500/20 text-blue-400 rotate-180":"bg-blue-100 text-blue-600 rotate-180":r==="dark"?"text-gray-400 group-hover:text-gray-300":"text-gray-400 group-hover:text-gray-600"}`,children:a.jsx(io,{className:"w-5 h-5"})})]}),a.jsx("h3",{className:`text-lg sm:text-xl font-bold ${i} group-hover:${r==="dark"?"text-blue-400":"text-blue-600"} transition-colors`,children:E.question})]}),D&&a.jsx("div",{className:`px-5 sm:px-6 pb-5 sm:pb-6 border-t ${h} pt-4 animate-fade-in`,children:a.jsx("div",{className:`rounded-lg p-4 text-sm leading-relaxed ${r==="dark"?"bg-[#1a1a1a]/70 text-gray-200":"bg-blue-50/80 text-gray-800"}`,children:j(E.answer)})})]},I)})}),a.jsxs("div",{className:`${d} rounded-lg shadow-lg p-6 border ${h}`,children:[a.jsx("h2",{className:`text-xl font-semibold mb-4 ${i}`,children:"Нужна дополнительная помощь?"}),a.jsx("p",{className:`${c} mb-4`,children:"Если вы не нашли ответ на свой вопрос, обратитесь к администратору или ознакомьтесь с правилами сообщества."}),a.jsxs("div",{className:"flex flex-wrap gap-4",children:[a.jsx("a",{href:"https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20",target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors",children:"📖 Правила сообщества"}),a.jsx("div",{className:`inline-flex items-center px-4 py-2 rounded-lg ${r==="dark"?"bg-gray-700":"bg-gray-200"}`,children:a.jsxs("span",{className:c,children:["Администратор: ",a.jsx("span",{className:"font-semibold",children:"@artyommedoed"})]})})]})]})]})})},W1=()=>{const{theme:r}=Ve(),{isAdmin:e}=yt(),t=r==="dark"?"text-white":"text-gray-900",n=r==="dark"?"text-gray-300":"text-gray-700",s=r==="dark"?"bg-[#1a1a1a]":"bg-white";return e?a.jsx(qt,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:`rounded-2xl p-6 ${s} shadow-lg border-2 ${r==="dark"?"border-purple-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#1a1a1a]/90":"border-purple-200 bg-gradient-to-br from-white to-purple-50/30"}`,children:[a.jsxs("div",{className:"flex items-start gap-4 mb-6",children:[a.jsx("div",{className:`p-3 rounded-xl ${r==="dark"?"bg-purple-500/20":"bg-purple-100"}`,children:a.jsx(Lt,{className:`w-8 h-8 ${r==="dark"?"text-purple-400":"text-purple-600"}`})}),a.jsxs("div",{className:"flex-1",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx("h1",{className:`text-3xl font-bold bg-gradient-to-r ${r==="dark"?"from-purple-400 to-pink-400 text-transparent bg-clip-text":"from-purple-600 to-pink-600 text-transparent bg-clip-text"}`,children:"Панель администратора"}),a.jsx(rn,{className:`w-5 h-5 ${r==="dark"?"text-yellow-400":"text-yellow-500"} animate-pulse`})]}),a.jsxs("p",{className:`${n} text-sm flex items-center gap-2`,children:[a.jsx(Rc,{className:"w-4 h-4"}),"Управление системой и командой ApeVault"]})]})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",children:[a.jsxs("div",{className:`p-4 rounded-xl border-2 ${r==="dark"?"bg-blue-500/10 border-blue-500/30":"bg-blue-50 border-blue-200"}`,children:[a.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[a.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-blue-500/20":"bg-blue-100"}`,children:a.jsx(Lt,{className:`w-5 h-5 ${r==="dark"?"text-blue-400":"text-blue-600"}`})}),a.jsx("h3",{className:`font-semibold ${t}`,children:"Доступ к функциям"})]}),a.jsx("p",{className:`text-sm ${n}`,children:"В режиме администратора вы можете управлять слотами, статусами и заработком всех участников команды"})]}),a.jsxs("div",{className:"p-4 rounded-xl border-2 bg-[#4E6E49]/10 border-[#4E6E49]/30",children:[a.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[a.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-[#4E6E49]/20":"bg-green-100"}`,children:a.jsx(wf,{className:"w-5 h-5 text-[#4E6E49]"})}),a.jsx("h3",{className:`font-semibold ${t}`,children:"Безопасность"})]}),a.jsx("p",{className:`text-sm ${n}`,children:"Режим администратора требует ввода пароля. Не делитесь паролем с другими участниками"})]})]}),a.jsx("div",{className:`pt-4 border-t ${r==="dark"?"border-gray-800":"border-gray-200"}`,children:a.jsxs("div",{className:`flex items-center gap-3 p-4 rounded-xl ${r==="dark"?"bg-[#4E6E49]/20 border-2 border-[#4E6E49]/50":"bg-green-50 border-2 border-green-200"}`,children:[a.jsx("div",{className:`p-2 rounded-lg ${r==="dark"?"bg-[#4E6E49]/30":"bg-green-100"}`,children:a.jsx(Lt,{className:"w-6 h-6 text-[#4E6E49]"})}),a.jsxs("div",{children:[a.jsx("h3",{className:`font-semibold mb-1 ${t}`,children:"Режим администратора активен"}),a.jsx("p",{className:`text-sm ${n}`,children:"Вы вошли в систему как администратор. Все административные функции доступны."})]})]})})]}),a.jsxs("div",{className:`rounded-2xl p-6 ${s} shadow-lg border-2 ${r==="dark"?"border-gray-800":"border-gray-200"}`,children:[a.jsx("h2",{className:`text-xl font-semibold mb-4 ${t}`,children:"Возможности администратора"}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[a.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[a.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"📅 Управление слотами"}),a.jsxs("ul",{className:`text-sm space-y-1 ${n} list-disc list-inside`,children:[a.jsx("li",{children:"Создание слотов для любого участника"}),a.jsx("li",{children:"Массовое создание слотов"}),a.jsx("li",{children:"Удаление слотов любого участника"}),a.jsx("li",{children:"Массовое удаление слотов"})]})]}),a.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[a.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"📋 Управление статусами"}),a.jsxs("ul",{className:`text-sm space-y-1 ${n} list-disc list-inside`,children:[a.jsx("li",{children:"Установка выходных, больничных и отпуск"}),a.jsx("li",{children:"Массовое управление статусами"}),a.jsx("li",{children:"Удаление статусов любого участника"})]})]}),a.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[a.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"💰 Управление заработком"}),a.jsxs("ul",{className:`text-sm space-y-1 ${n} list-disc list-inside`,children:[a.jsx("li",{children:"Добавление заработка за любую дату"}),a.jsx("li",{children:"Редактирование записей о заработке"}),a.jsx("li",{children:"Удаление записей о заработке"})]})]}),a.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-gray-800 bg-gray-700/30":"border-gray-200 bg-gray-50"}`,children:[a.jsx("h3",{className:`font-semibold mb-2 ${t}`,children:"📊 Дополнительно"}),a.jsxs("ul",{className:`text-sm space-y-1 ${n} list-disc list-inside`,children:[a.jsx("li",{children:"Удаление сообщений из подсчета"}),a.jsx("li",{children:"Полный доступ ко всем функциям"}),a.jsx("li",{children:"Просмотр и управление данными команды"})]})]})]})]})]})}):a.jsx(qt,{children:a.jsx("div",{className:`rounded-2xl p-8 ${s} shadow-xl border-2 ${r==="dark"?"border-red-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]":"border-red-200 bg-gradient-to-br from-white to-red-50/20"} relative overflow-hidden`,children:a.jsxs("div",{className:"text-center",children:[a.jsx("div",{className:`inline-flex p-4 rounded-2xl mb-4 ${r==="dark"?"bg-red-500/20":"bg-red-100"}`,children:a.jsx(Rc,{className:`w-12 h-12 ${r==="dark"?"text-red-400":"text-red-600"}`})}),a.jsx("h2",{className:`text-2xl font-bold mb-2 ${t}`,children:"Доступ запрещен"}),a.jsx("p",{className:n,children:'Эта страница доступна только администраторам. Для входа используйте режим "Админ" на странице входа.'})]})})})},z1=()=>{const{theme:r}=Ve(),{user:e,logout:t}=nt(),{isAdmin:n,deactivateAdmin:s}=yt(),i=hu(),[l,c]=A.useState(!1),[d,h]=A.useState(!1),[g,x]=A.useState([]),[p,T]=A.useState(null),[j,E]=A.useState(null),[I,D]=A.useState(!0),[S,C]=A.useState(!1),F=r==="dark"?"text-white":"text-gray-900";A.useEffect(()=>{(e||n)&&ne()},[e,n]);const ne=async()=>{if(!(!e&&!n)){D(!0);try{const f=(e==null?void 0:e.id)||"admin",O=await Um({assignedTo:f});if(x(O),e){const Q=Xs(),P=oe(Q.start,"yyyy-MM-dd"),$=oe(Q.end,"yyyy-MM-dd"),K=Xm(30),H=oe(K.start,"yyyy-MM-dd"),Z=oe(K.end,"yyyy-MM-dd"),ce=K.start.toISOString(),q=K.end.toISOString(),le=(await Ms(f,P,$)).reduce((xe,je)=>{const Le=je.participants&&je.participants.length>0?je.participants.length:1;return xe+je.amount/Le},0),Ee=await Ms(f,H,Z),L=Ee.reduce((xe,je)=>{const Le=je.participants&&je.participants.length>0?je.participants.length:1;return xe+je.amount/Le},0),V=Ee.reduce((xe,je)=>{const Le=je.participants&&je.participants.length>0?je.participants.length:1;return xe+je.poolAmount/Le},0),se=(await hr(f)).filter(xe=>{const je=xe.date,Le=xe.endDate||xe.date;return je<=Z&&Le>=H}),J=se.filter(xe=>xe.type==="dayoff").reduce((xe,je)=>xe+Pn(je.date,je.endDate,H,Z),0),z=se.filter(xe=>xe.type==="sick").reduce((xe,je)=>xe+Pn(je.date,je.endDate,H,Z),0),ee=se.filter(xe=>xe.type==="vacation").reduce((xe,je)=>xe+Pn(je.date,je.endDate,H,Z),0),Ne=(await br(f)).filter(xe=>xe.date>=P&&xe.date<=$).reduce((xe,je)=>xe+Ni(je.slots),0),Xe=await Lm(f,P,$),re=(await Vm(f))[0]||{userId:f,earnings:0,messages:0,initiatives:0,signals:0,profitableSignals:0,referrals:0,daysOff:0,sickDays:0,vacationDays:0,poolAmount:0,rating:0,lastUpdated:new Date().toISOString()},Je=(await Fm(void 0,ce,q)).filter(xe=>xe.ownerId===f).length,Ge={userId:f,earnings:L,messages:re.messages||0,initiatives:re.initiatives||0,signals:re.signals||0,profitableSignals:re.profitableSignals||0,referrals:Je,daysOff:J,sickDays:z,vacationDays:ee,poolAmount:V,lastUpdated:new Date().toISOString()},It=eg(Ge,Ne,le,Xe),Mt=tg(Ge,Ne,le,Xe);T({...Ge,rating:It}),E(Mt)}}catch(f){console.error("Error loading profile data:",f)}finally{D(!1)}}},B=()=>{n&&s(),t(),i("/login")},_=()=>{e!=null&&e.password&&(navigator.clipboard.writeText(e.password),h(!0),setTimeout(()=>h(!1),2e3))},y=()=>{b!=null&&b.login&&(navigator.clipboard.writeText(b.login),C(!0),setTimeout(()=>C(!1),2e3))},b=e||(n?{name:"Администратор",login:"admin",password:"admin"}:null),w=g.filter(f=>f.status==="pending").length,k=g.filter(f=>f.status==="in_progress").length,N=g.filter(f=>f.status==="completed").length;return b?a.jsx(qt,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsx("div",{className:`rounded-2xl p-6 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-lg`,children:a.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:`p-3 rounded-xl ${r==="dark"?"bg-[#4E6E49]/20 text-[#4E6E49]":"bg-green-50 text-[#4E6E49]"}`,children:a.jsx(Zr,{className:"w-6 h-6"})}),a.jsxs("div",{children:[a.jsx("p",{className:`text-xs uppercase tracking-[0.14em] ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"ApeVault Black Ops"}),a.jsx("h1",{className:`text-2xl sm:text-3xl font-extrabold ${F}`,children:"Личный кабинет"}),a.jsx("p",{className:`text-sm ${r==="dark"?"text-gray-300":"text-gray-600"}`,children:"Закрытый контур. Ваши данные и показатели."})]})]}),a.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.jsxs("div",{className:"pill","data-active":"true",children:[a.jsx(Zr,{className:"w-4 h-4"}),a.jsx("span",{children:b.name})]}),n&&a.jsxs("div",{className:"pill","data-active":"true",children:[a.jsx(Lt,{className:"w-4 h-4"}),a.jsx("span",{children:"Администратор"})]}),a.jsxs("div",{className:"pill","data-active":"false",children:[a.jsx(Pr,{className:"w-4 h-4"}),a.jsxs("span",{children:[g.length," задач"]})]}),p&&a.jsxs("div",{className:"pill","data-active":"false",children:[a.jsx(Vr,{className:"w-4 h-4"}),a.jsxs("span",{children:[p.rating.toFixed(1),"%"]})]})]})]})}),I?a.jsx("div",{className:`rounded-xl p-8 text-center ${r==="dark"?"bg-white/5 text-white":"bg-white text-gray-800"} shadow`,children:"Загрузка..."}):a.jsxs("div",{className:"space-y-5",children:[a.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch",children:[a.jsxs("div",{className:"space-y-4 flex flex-col",children:[a.jsxs("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow flex-1`,children:[a.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[a.jsx("div",{className:`p-2.5 rounded-xl ${r==="dark"?"bg-blue-500/15 text-blue-200":"bg-blue-50 text-blue-700"}`,children:a.jsx(Zr,{className:"w-5 h-5"})}),a.jsxs("div",{children:[a.jsx("h2",{className:`text-lg font-bold ${F}`,children:"Профиль"}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Доступ и учетные данные"})]})]}),a.jsxs("div",{className:"grid sm:grid-cols-2 gap-3",children:[a.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-sm`,children:[a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wide ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Имя"}),a.jsx("p",{className:`mt-1 text-lg font-bold ${F}`,children:b.name})]}),a.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow-sm`,children:[a.jsx("p",{className:`text-xs font-semibold uppercase tracking-wide ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Логин"}),a.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[a.jsx("p",{className:`text-lg font-bold ${F}`,children:b.login}),a.jsx("button",{onClick:y,className:`p-2 rounded-lg border transition ${S?"bg-[#4E6E49] text-white border-[#4E6E49]":r==="dark"?"border-white/10 bg-white/5 hover:border-white/30":"border-gray-200 bg-white hover:border-gray-300"}`,title:"Скопировать логин",children:S?a.jsx($n,{className:"w-4 h-4"}):a.jsx(oo,{className:"w-4 h-4"})})]})]})]}),a.jsxs("div",{className:"mt-4 space-y-2",children:[a.jsx("label",{className:`text-sm font-semibold ${r==="dark"?"text-gray-300":"text-gray-700"} block`,children:"Пароль"}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:`flex-1 px-4 py-3 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"} font-mono text-sm`,children:l?b.password:"•".repeat(b.password.length)}),a.jsx("button",{onClick:()=>c(!l),className:`p-3 rounded-lg border ${r==="dark"?"border-white/10 bg-white/5 hover:border-white/30":"border-gray-200 bg-white hover:border-gray-300"} transition`,title:l?"Скрыть пароль":"Показать пароль",children:l?a.jsx(yf,{className:"w-5 h-5"}):a.jsx(wu,{className:"w-5 h-5"})}),a.jsx("button",{onClick:_,className:`p-3 rounded-lg border transition ${d?"bg-[#4E6E49] text-white border-[#4E6E49]":r==="dark"?"border-white/10 bg-white/5 hover:border-white/30":"border-gray-200 bg-white hover:border-gray-300"}`,title:"Скопировать пароль",children:d?a.jsx($n,{className:"w-5 h-5"}):a.jsx(oo,{className:"w-5 h-5"})})]})]})]}),a.jsxs("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow flex-1`,children:[a.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[a.jsx("div",{className:`p-2.5 rounded-xl ${r==="dark"?"bg-green-500/15 text-green-200":"bg-green-50 text-[#4E6E49]"}`,children:a.jsx(Pr,{className:"w-5 h-5"})}),a.jsxs("div",{children:[a.jsx("h2",{className:`text-lg font-bold ${F}`,children:"Мои задачи"}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Сводка по статусам"})]})]}),a.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4",children:[{label:"На согласовании",value:w,classes:r==="dark"?"bg-amber-500/15 border-amber-500/30 text-amber-100":"bg-amber-50 border-amber-200 text-amber-900"},{label:"В работе",value:k,classes:r==="dark"?"bg-blue-500/15 border-blue-500/30 text-blue-100":"bg-blue-50 border-blue-200 text-blue-900"},{label:"Выполнена",value:N,classes:r==="dark"?"bg-emerald-500/15 border-emerald-500/30 text-emerald-50":"bg-emerald-50 border-emerald-200 text-emerald-900"},{label:"Всего",value:g.length,classes:r==="dark"?"bg-gray-600/20 border-gray-500/40 text-gray-100":"bg-gray-50 border-gray-200 text-gray-800"}].map(({label:f,value:O,classes:Q})=>a.jsxs("div",{className:`p-4 rounded-xl border shadow-sm transition-all hover:translate-y-[-2px] ${Q}`,children:[a.jsx("div",{className:"text-xs font-semibold mb-2 opacity-80",children:f}),a.jsx("div",{className:`text-3xl font-extrabold ${F}`,children:O})]},f))}),a.jsxs("button",{onClick:()=>i("/tasks"),className:`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${r==="dark"?"bg-gradient-to-r from-[#4E6E49]/20 to-emerald-700/20 text-[#4E6E49] border border-[#4E6E49]/40":"bg-gradient-to-r from-green-50 to-emerald-50 text-[#4E6E49] border border-green-200"}`,children:[a.jsx(Pr,{className:"w-4 h-4"}),"Перейти к задачам"]})]})]}),a.jsx("div",{className:"space-y-4 flex flex-col",children:p&&j&&a.jsxs("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow flex-1`,children:[a.jsxs("div",{className:"flex items-center justify-between mb-4",children:[a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:`p-2.5 rounded-xl ${r==="dark"?"bg-purple-500/20 text-purple-200":"bg-purple-50 text-purple-700"}`,children:a.jsx(Vr,{className:"w-5 h-5"})}),a.jsxs("div",{children:[a.jsx("h2",{className:`text-lg font-bold ${F}`,children:"Рейтинг"}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-400":"text-gray-500"}`,children:"Еженедельная оценка"})]})]}),a.jsx("div",{className:"pill","data-active":"true",children:a.jsxs("span",{className:"font-bold",children:[p.rating.toFixed(1),"%"]})})]}),a.jsxs("div",{className:`p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-100 bg-gray-50"} mb-4`,children:[a.jsxs("div",{className:`text-4xl font-extrabold ${F}`,children:[p.rating.toFixed(1),"%"]}),a.jsx("p",{className:`text-xs mt-1 ${r==="dark"?"text-gray-400":"text-gray-600"}`,children:p.rating>=70?"Отличный результат":p.rating>=50?"Хороший темп":"Требуется усиление показателей"})]}),a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[{label:"Выходные",value:`${p.daysOff} дн`,pts:j.daysOffPoints,classes:r==="dark"?"bg-slate-700/40 border-slate-600/60":"bg-slate-50 border-slate-200"},{label:"Больничные",value:`${p.sickDays} дн`,pts:j.sickDaysPoints,classes:r==="dark"?"bg-amber-500/15 border-amber-500/30":"bg-amber-50 border-amber-200"},{label:"Отпуск",value:`${p.vacationDays} дн`,pts:j.vacationDaysPoints,classes:r==="dark"?"bg-orange-500/15 border-orange-500/30":"bg-orange-50 border-orange-200"},{label:"Часы",value:`${j.weeklyHours.toFixed(1)} ч/нед`,pts:j.weeklyHoursPoints,classes:r==="dark"?"bg-blue-500/15 border-blue-500/30":"bg-blue-50 border-blue-200"},{label:"Заработок",value:`${j.weeklyEarnings.toFixed(0)} ₽/нед`,pts:j.weeklyEarningsPoints,classes:r==="dark"?"bg-emerald-500/15 border-emerald-500/30":"bg-emerald-50 border-emerald-200"},{label:"Рефералы",value:`${p.referrals}`,pts:j.referralsPoints,classes:r==="dark"?"bg-purple-500/15 border-purple-500/30":"bg-purple-50 border-purple-200"},{label:"Сообщения",value:`${j.weeklyMessages} сообщ/нед`,pts:j.weeklyMessagesPoints,classes:r==="dark"?"bg-pink-500/15 border-pink-500/30":"bg-pink-50 border-pink-200"}].map(f=>a.jsxs("div",{className:`p-3 rounded-xl border shadow-sm ${f.classes}`,children:[a.jsx("div",{className:"text-xs font-semibold uppercase opacity-80",children:f.label}),a.jsx("div",{className:`text-lg font-bold ${F}`,children:f.value}),a.jsxs("div",{className:`text-sm ${r==="dark"?"text-gray-100":"text-gray-800"}`,children:[f.pts.toFixed(1),"%"]})]},f.label))}),a.jsxs("div",{className:`mt-4 p-4 rounded-xl border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-100 bg-gray-50"}`,children:[a.jsxs("h3",{className:`text-sm font-bold ${F} mb-2 flex items-center gap-2`,children:[a.jsx(Ut,{className:"w-4 h-4"}),"Как считается рейтинг"]}),a.jsx("p",{className:`text-xs ${r==="dark"?"text-gray-300":"text-gray-700"}`,children:"7 параметров: выходные, больничные, отпуск (месяц), часы, доход, рефералы, сообщения (неделя). Максимум 100%."})]})]})})]}),a.jsx("div",{className:`rounded-2xl p-5 border ${r==="dark"?"border-white/10 bg-white/5":"border-gray-200 bg-white"} shadow`,children:a.jsxs("button",{onClick:B,className:`w-full px-6 py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${r==="dark"?"bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/50":"bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200"}`,children:[a.jsx(Nf,{className:"w-5 h-5"}),"Выйти из аккаунта"]})})]})]})}):a.jsx(qt,{children:a.jsx("div",{className:"text-center py-12",children:a.jsx("p",{className:F,children:"Необходима авторизация"})})})},H1=()=>{const{theme:r}=Ve(),e=r==="dark"?"text-white":"text-gray-900",t=r==="dark"?"text-gray-400":"text-gray-600";return a.jsx(qt,{children:a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{className:"section-card rounded-2xl p-5 sm:p-6 md:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[a.jsx("div",{className:"accent-dots"}),a.jsxs("div",{className:"relative z-10 space-y-4",children:[a.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",children:[a.jsxs("div",{className:"flex items-center gap-3 sm:gap-4",children:[a.jsx("div",{className:`p-3 sm:p-4 rounded-2xl shadow-lg ${r==="dark"?"bg-gradient-to-br from-blue-600 to-purple-600":"bg-gradient-to-br from-blue-500 to-purple-500"} text-white`,children:a.jsx(Ut,{className:"w-6 h-6 sm:w-7 sm:h-7"})}),a.jsxs("div",{children:[a.jsx("p",{className:`text-xs uppercase tracking-[0.14em] ${t}`,children:"ApeVault Black Ops"}),a.jsxs("h1",{className:`text-2xl sm:text-3xl md:text-4xl font-extrabold ${e} flex items-center gap-2`,children:["О сообществе",a.jsx("span",{className:"text-xl sm:text-2xl flex-shrink-0",children:"🌟"})]}),a.jsx("p",{className:`text-sm sm:text-base font-medium ${t}`,children:"Профессиональное сообщество трейдеров и коллеров"})]})]}),a.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.jsx("a",{href:"#overview",className:"pill","data-active":"false",children:"Обзор"}),a.jsx("a",{href:"#features",className:"pill","data-active":"false",children:"Принципы"}),a.jsx("a",{href:"#rules",className:"pill","data-active":"false",children:"Правила"}),a.jsx("a",{href:"#contacts",className:"pill","data-active":"false",children:"Контакты"})]})]}),a.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:[{label:"Участников",value:"50+"},{label:"Уроков",value:"100+"},{label:"Сессий/нед",value:"10+"},{label:"Продуктов",value:"3"}].map(n=>a.jsxs("div",{className:`rounded-xl border ${r==="dark"?"border-white/10 bg-white/5 text-white":"border-gray-200 bg-white text-gray-900"} p-3 shadow-sm`,children:[a.jsx("p",{className:"text-[11px] uppercase tracking-wide opacity-70",children:n.label}),a.jsx("p",{className:"text-2xl font-extrabold",children:n.value})]},n.label))})]})]}),a.jsxs("div",{id:"overview",className:"section-card rounded-2xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[a.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl -mr-20 -mt-20"}),a.jsx("div",{className:"relative z-10 space-y-5",children:a.jsxs("div",{className:"flex flex-col lg:flex-row gap-4 lg:gap-6 items-start",children:[a.jsx("div",{className:`p-3 sm:p-4 rounded-2xl shadow-lg ${r==="dark"?"bg-gradient-to-br from-cyan-600 to-blue-600":"bg-gradient-to-br from-cyan-500 to-blue-500"} text-white flex-shrink-0`,children:a.jsx(Ut,{className:"w-5 h-5 sm:w-7 sm:h-7"})}),a.jsxs("div",{className:"flex-1 space-y-3",children:[a.jsx("h2",{className:`text-2xl sm:text-3xl font-extrabold ${e}`,children:a.jsx("span",{className:"bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text",children:"Что такое ApeVault Black Ops?"})}),a.jsx("p",{className:`text-sm sm:text-base leading-relaxed ${t}`,children:"ApeVault — закрытое профессиональное сообщество трейдеров и коллеров. Мы объединяем экспертизу, строгие регламенты и командную поддержку, чтобы ускорять результаты каждого участника и строить прозрачную культуру трейдинга."}),a.jsx("div",{className:"flex flex-wrap gap-2",children:["Профессиональные коллеры","Командные сессии","Прозрачная аналитика"].map(n=>a.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-semibold ${r==="dark"?"bg-cyan-500/10 text-cyan-200 border border-cyan-500/30":"bg-cyan-50 text-cyan-700 border border-cyan-200"}`,children:n},n))})]})]})})]}),a.jsx("div",{id:"features",className:"grid md:grid-cols-3 gap-5",children:[{title:"Командная работа",desc:"Слаженная работа профессионалов, каждый вносит вклад в общий успех.",icon:un,tone:"bg-gradient-to-br from-[#4E6E49] to-emerald-700",halo:"from-[#4E6E49]/10 to-emerald-700/10"},{title:"Профессионализм",desc:"Высокие стандарты, строгий регламент, дисциплина сессий.",icon:lo,tone:r==="dark"?"bg-gradient-to-br from-purple-600 to-pink-600":"bg-gradient-to-br from-purple-500 to-pink-500",halo:"from-purple-500/10 to-pink-500/10"},{title:"Рейтинг и мотивация",desc:"Прозрачная система рейтинга мотивирует достигать большего.",icon:vu,tone:r==="dark"?"bg-gradient-to-br from-yellow-600 to-orange-600":"bg-gradient-to-br from-yellow-500 to-orange-500",halo:"from-yellow-500/10 to-orange-500/10"}].map(({title:n,desc:s,icon:i,tone:l,halo:c})=>a.jsxs("div",{className:"section-card rounded-2xl p-6 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden h-full",children:[a.jsx("div",{className:`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c} rounded-full blur-xl -mr-16 -mt-16`}),a.jsxs("div",{className:"relative z-10 h-full flex flex-col gap-4",children:[a.jsx("div",{className:`p-3 rounded-xl shadow-lg inline-flex ${l} text-white w-max`,children:a.jsx(i,{className:"w-6 h-6"})}),a.jsxs("div",{className:"space-y-2",children:[a.jsx("h3",{className:`text-xl font-extrabold ${e}`,children:n}),a.jsx("p",{className:`${t} leading-relaxed`,children:s})]})]})]},n))}),a.jsxs("div",{id:"rules",className:"section-card rounded-2xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[a.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl -mr-20 -mt-20"}),a.jsx("div",{className:"relative z-10",children:a.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[a.jsx("div",{className:`p-4 rounded-2xl shadow-lg ${r==="dark"?"bg-gradient-to-br from-indigo-600 to-purple-600":"bg-gradient-to-br from-indigo-500 to-purple-500"} text-white flex-shrink-0`,children:a.jsx(Sc,{className:"w-8 h-8"})}),a.jsxs("div",{className:"flex-1",children:[a.jsx("h2",{className:`text-2xl font-extrabold mb-2 ${e} flex items-center gap-2`,children:a.jsx("span",{className:"bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text",children:"Правила сообщества"})}),a.jsx("p",{className:`${t} mb-6 font-medium`,children:"Подробный регламент торговых сессий и правила взаимодействия участников."}),a.jsxs("a",{href:"https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20",target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform",children:[a.jsx(Sc,{className:"w-5 h-5"}),a.jsx("span",{children:"Ознакомиться с правилами"})]})]})]})})]}),a.jsxs("div",{id:"contacts",className:"section-card rounded-2xl p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden",children:[a.jsx("div",{className:"absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-2xl -mr-20 -mt-20"}),a.jsx("div",{className:"relative z-10",children:a.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[a.jsx("div",{className:`p-4 rounded-2xl shadow-lg ${r==="dark"?"bg-gradient-to-br from-pink-600 to-rose-600":"bg-gradient-to-br from-pink-500 to-rose-500"} text-white flex-shrink-0`,children:a.jsx(jf,{className:"w-8 h-8"})}),a.jsxs("div",{className:"flex-1",children:[a.jsx("h2",{className:`text-2xl font-extrabold mb-2 ${e} flex items-center gap-2`,children:a.jsx("span",{className:"bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text",children:"Контакты"})}),a.jsxs("p",{className:`${t} font-medium`,children:["По вопросам работы системы и правил обращайтесь к администратору:"," ",a.jsx("span",{className:`font-extrabold ${e}`,children:"@artyommedoed"})]})]})]})})]})]})})},or=({children:r})=>{const{isAuthenticated:e}=nt(),{isAdmin:t}=yt();return!e&&!t?a.jsx(so,{to:"/login",replace:!0}):a.jsx(a.Fragment,{children:r})};function G1(){const{isAuthenticated:r}=nt(),{isAdmin:e}=yt(),{theme:t}=Ve();return A.useEffect(()=>{document.body.classList.toggle("dark",t==="dark")},[t]),A.useEffect(()=>{Qw().catch(n=>console.error("Cleanup failed",n))},[]),a.jsx(Tg,{children:a.jsxs(Ig,{children:[a.jsx(Vt,{path:"/login",element:!r&&!e?a.jsx($f,{}):a.jsx(so,{to:"/management",replace:!0})}),a.jsx(Vt,{path:"/call",element:a.jsx(or,{children:a.jsx(h_,{})})}),a.jsx(Vt,{path:"/management",element:a.jsx(or,{children:a.jsx(N1,{})})}),a.jsx(Vt,{path:"/earnings",element:a.jsx(or,{children:a.jsx(S1,{})})}),a.jsx(Vt,{path:"/rating",element:a.jsx(or,{children:a.jsx(P1,{})})}),a.jsx(Vt,{path:"/tasks",element:a.jsx(or,{children:a.jsx(B1,{})})}),a.jsx(Vt,{path:"/about",element:a.jsx(or,{children:a.jsx(H1,{})})}),a.jsx(Vt,{path:"/faq",element:a.jsx(or,{children:a.jsx(q1,{})})}),a.jsx(Vt,{path:"/admin",element:a.jsx(or,{children:a.jsx(W1,{})})}),a.jsx(Vt,{path:"/profile",element:a.jsx(or,{children:a.jsx(z1,{})})}),a.jsx(Vt,{path:"/",element:a.jsx(so,{to:r||e?"/management":"/login",replace:!0})})]})})}ao.createRoot(document.getElementById("root")).render(a.jsx(uu.StrictMode,{children:a.jsx(G1,{})}));
