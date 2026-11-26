import{renderLusionSpaceMarkup as _rlsm,mountLusionSpaceController as _mlsc,mountLusionAboutView as _mlav,mountLusionFluidCursor as _mlfc}from"./lusion-experience.js?v=20261126c";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();var Mr="1.3.27";function Po(i,e,t){return Math.max(i,Math.min(e,t))}function Sl(i,e,t){return(1-t)*i+t*e}function yl(i,e,t,n){return Sl(i,e,1-Math.exp(-t*n))}function bl(i,e){return(i%e+e)%e}var El=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(i){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=i;const t=Po(0,this.currentTime/this.duration,1);e=t>=1;const n=e?1:this.easing(t);this.value=this.from+(this.to-this.from)*n}else this.lerp?(this.value=yl(this.value,this.to,this.lerp*60,i),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(i,e,{lerp:t,duration:n,easing:s,onStart:a,onUpdate:r}){this.from=this.value=i,this.to=e,this.lerp=t,this.duration=n,this.easing=s,this.currentTime=0,this.isRunning=!0,a?.(),this.onUpdate=r}};function wl(i,e){let t;return function(...n){clearTimeout(t),t=setTimeout(()=>{t=void 0,i.apply(this,n)},e)}}var Tl=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(i,e,{autoResize:t=!0,debounce:n=250}={}){this.wrapper=i,this.content=e,t&&(this.debouncedResize=wl(this.resize,n),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},Lo=class{events={};emit(i,...e){const t=this.events[i]||[];for(let n=0,s=t.length;n<s;n++)t[n]?.(...e)}on(i,e){return this.events[i]?this.events[i].push(e):this.events[i]=[e],()=>{this.events[i]=this.events[i]?.filter(t=>e!==t)}}off(i,e){this.events[i]=this.events[i]?.filter(t=>e!==t)}destroy(){this.events={}}};const Al=100/6,cn={passive:!1};function Sr(i,e){return i===1?Al:i===2?e:1}var Rl=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new Lo;constructor(i,e={wheelMultiplier:1,touchMultiplier:1}){this.element=i,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,cn),this.element.addEventListener("touchstart",this.onTouchStart,cn),this.element.addEventListener("touchmove",this.onTouchMove,cn),this.element.addEventListener("touchend",this.onTouchEnd,cn)}on(i,e){return this.emitter.on(i,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,cn),this.element.removeEventListener("touchstart",this.onTouchStart,cn),this.element.removeEventListener("touchmove",this.onTouchMove,cn),this.element.removeEventListener("touchend",this.onTouchEnd,cn)}onTouchStart=i=>{const{clientX:e,clientY:t}=i.targetTouches?i.targetTouches[0]:i;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:i})};onTouchMove=i=>{const{clientX:e,clientY:t}=i.targetTouches?i.targetTouches[0]:i,n=-(e-this.touchStart.x)*this.options.touchMultiplier,s=-(t-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=t,this.lastDelta={x:n,y:s},this.emitter.emit("scroll",{deltaX:n,deltaY:s,event:i})};onTouchEnd=i=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:i})};onWheel=i=>{let{deltaX:e,deltaY:t,deltaMode:n}=i;const s=Sr(n,this.window.width),a=Sr(n,this.window.height);e*=s,t*=a,e*=this.options.wheelMultiplier,t*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:t,event:i})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};const yr=i=>Math.min(1,1.001-2**(-10*i));var Cl=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new El;emitter=new Lo;dimensions;virtualScroll;constructor({wrapper:i=window,content:e=document.documentElement,eventsTarget:t=i,smoothWheel:n=!0,syncTouch:s=!1,syncTouchLerp:a=.075,touchInertiaExponent:r=1.7,duration:o,easing:l,lerp:c=.1,infinite:h=!1,orientation:d="vertical",gestureOrientation:u=d==="horizontal"?"both":"vertical",touchMultiplier:f=1,wheelMultiplier:g=1,autoResize:x=!0,prevent:m,virtualScroll:p,overscroll:E=!0,autoRaf:v=!1,anchors:_=!1,autoToggle:L=!1,allowNestedScroll:A=!1,__experimental__naiveDimensions:R=!1,naiveDimensions:C=R,stopInertiaOnNavigate:b=!1,respectReducedMotion:S=!0}={}){window.lenisVersion=Mr,window.lenis||(window.lenis={}),window.lenis.version=Mr,d==="horizontal"&&(window.lenis.horizontal=!0),s===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!i||i===document.documentElement)&&(i=window),typeof o=="number"&&typeof l!="function"?l=yr:typeof l=="function"&&typeof o!="number"&&(o=1),this.options={wrapper:i,content:e,eventsTarget:t,smoothWheel:n,syncTouch:s,syncTouchLerp:a,touchInertiaExponent:r,duration:o,easing:l,lerp:c,infinite:h,gestureOrientation:u,orientation:d,touchMultiplier:f,wheelMultiplier:g,autoResize:x,prevent:m,virtualScroll:p,overscroll:E,autoRaf:v,anchors:_,autoToggle:L,allowNestedScroll:A,naiveDimensions:C,stopInertiaOnNavigate:b,respectReducedMotion:S},this.dimensions=new Tl(i,e,{autoResize:x}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new Rl(t,{touchMultiplier:f,wheelMultiplier:g}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(i,e){return this.emitter.on(i,e)}off(i,e){return this.emitter.off(i,e)}onScrollEnd=i=>{i instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&i.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){const i=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[i]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=i=>{i.propertyName?.includes("overflow")&&i.target===this.rootElement&&this.checkOverflow()};setScroll(i){this.isHorizontal?this.options.wrapper.scrollTo({left:i,behavior:"instant"}):this.options.wrapper.scrollTo({top:i,behavior:"instant"})}onClick=i=>{const e=i.composedPath().filter(n=>n instanceof HTMLAnchorElement&&n.href).map(n=>new URL(n.href)),t=new URL(window.location.href);if(this.options.anchors){const n=e.find(s=>t.host===s.host&&t.pathname===s.pathname&&s.hash);if(n){const s=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,a=decodeURIComponent(n.hash);this.scrollTo(a,s);return}}if(this.options.stopInertiaOnNavigate&&e.some(n=>t.host===n.host&&t.pathname!==n.pathname)){this.reset();return}};onPointerDown=i=>{i.button===1&&this.reset()};isTouchOnSelectionHandle(i){const e=window.getSelection();if(!e||e.isCollapsed||e.rangeCount===0)return!1;const t=i.targetTouches[0]??i.changedTouches[0];if(!t)return!1;const n=e.getRangeAt(0).getClientRects();if(n.length===0)return!1;const s=n[0],a=n[n.length-1],r=40,o=Math.hypot(t.clientX-s.left,t.clientY-s.top)<=r,l=Math.hypot(t.clientX-a.right,t.clientY-a.bottom)<=r;return o||l}onVirtualScroll=i=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(i)===!1)return;const{deltaX:e,deltaY:t,event:n}=i;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:t,event:n}),n.ctrlKey||n.lenisStopPropagation)return;const s=n.type.includes("touch"),a=n.type.includes("wheel");if(s&&this.isIos&&(n.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(n)),this._isDraggingSelection)){n.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=n.type==="touchstart"||n.type==="touchmove";const r=e===0&&t===0;if(this.options.syncTouch&&s&&n.type==="touchstart"&&r&&!this.isStopped&&!this.isLocked){this.reset();return}const o=this.options.gestureOrientation==="vertical"&&t===0||this.options.gestureOrientation==="horizontal"&&e===0;if(r||o)return;let l=n.composedPath();l=l.slice(0,l.indexOf(this.rootElement));const c=this.options.prevent,h=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";if(l.find(g=>g instanceof HTMLElement&&(typeof c=="function"&&c?.(g)||g.hasAttribute?.("data-lenis-prevent")||h==="vertical"&&g.hasAttribute?.("data-lenis-prevent-vertical")||h==="horizontal"&&g.hasAttribute?.("data-lenis-prevent-horizontal")||s&&g.hasAttribute?.("data-lenis-prevent-touch")||a&&g.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(g,{deltaX:e,deltaY:t}))))return;if(this.isStopped||this.isLocked){n.cancelable&&n.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&a)){this.isScrolling="native",this.animate.stop(),n.lenisStopPropagation=!0;return}let d=t;this.options.gestureOrientation==="both"?d=Math.abs(t)>Math.abs(e)?t:e:this.options.gestureOrientation==="horizontal"&&(d=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&t>0||this.animatedScroll===this.limit&&t<0))&&(n.lenisStopPropagation=!0),n.cancelable&&n.preventDefault();const u=s&&this.options.syncTouch,f=s&&n.type==="touchend";f&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...u?{lerp:f?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const i=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-i,this.direction=Math.sign(this.animatedScroll-i),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=i=>{const e=i-(this.time||i);this.time=i,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(i,{offset:e=0,immediate:t=!1,lock:n=!1,programmatic:s=!0,lerp:a=s?this.options.lerp:void 0,duration:r=s?this.options.duration:void 0,easing:o=s?this.options.easing:void 0,onStart:l,onComplete:c,force:h=!1,userData:d}={}){if(this.prefersReducedMotion&&(s?t=!0:(a=1,r=void 0,o=void 0)),(this.isStopped||this.isLocked)&&!h)return;let u=i,f=e;if(typeof u=="string"&&["top","left","start","#"].includes(u))u=0;else if(typeof u=="string"&&["bottom","right","end"].includes(u))u=this.limit;else{let g=null;if(typeof u=="string"?(g=u.startsWith("#")?document.getElementById(u.slice(1)):document.querySelector(u),g||(u==="#top"?u=0:console.warn("Lenis: Target not found",u))):u instanceof Element&&(g=u),g){if(this.options.wrapper!==window){const _=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?_.left:_.top}const x=g.getBoundingClientRect(),m=getComputedStyle(g),p=this.isHorizontal?Number.parseFloat(m.scrollMarginLeft):Number.parseFloat(m.scrollMarginTop),E=getComputedStyle(this.rootElement),v=this.isHorizontal?Number.parseFloat(E.scrollPaddingLeft):Number.parseFloat(E.scrollPaddingTop);u=(this.isHorizontal?x.left:x.top)+this.animatedScroll-(Number.isNaN(p)?0:p)-(Number.isNaN(v)?0:v)}}if(typeof u=="number"){if(u+=f,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;const g=u-this.animatedScroll;g>this.limit/2?u-=this.limit:g<-this.limit/2&&(u+=this.limit)}}else u=Po(0,u,this.limit);if(u===this.targetScroll){l?.(this),c?.(this);return}if(this.userData=d??{},t){this.animatedScroll=this.targetScroll=u,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=u),typeof r=="number"&&typeof o!="function"?o=yr:typeof o=="function"&&typeof r!="number"&&(r=1),this.animate.fromTo(this.animatedScroll,u,{duration:r,easing:o,lerp:a,onStart:()=>{n&&(this.isLocked=!0),this.isScrolling="smooth",l?.(this)},onUpdate:(g,x)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=g-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=g,this.setScroll(this.scroll),s&&(this.targetScroll=g),x||this.emit(),x&&(this.reset(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(i,{deltaX:e,deltaY:t}){const n=Date.now();i._lenis||(i._lenis={});const s=i._lenis;let a,r,o,l,c,h,d,u,f,g;if(n-(s.time??0)>2e3){s.time=Date.now();const A=window.getComputedStyle(i);if(s.computedStyle=A,a=["auto","overlay","scroll"].includes(A.overflowX),r=["auto","overlay","scroll"].includes(A.overflowY),c=["auto"].includes(A.overscrollBehaviorX),h=["auto"].includes(A.overscrollBehaviorY),s.hasOverflowX=a,s.hasOverflowY=r,!(a||r))return!1;d=i.scrollWidth,u=i.scrollHeight,f=i.clientWidth,g=i.clientHeight,o=d>f,l=u>g,s.isScrollableX=o,s.isScrollableY=l,s.scrollWidth=d,s.scrollHeight=u,s.clientWidth=f,s.clientHeight=g,s.hasOverscrollBehaviorX=c,s.hasOverscrollBehaviorY=h}else o=s.isScrollableX,l=s.isScrollableY,a=s.hasOverflowX,r=s.hasOverflowY,d=s.scrollWidth,u=s.scrollHeight,f=s.clientWidth,g=s.clientHeight,c=s.hasOverscrollBehaviorX,h=s.hasOverscrollBehaviorY;if(!(a&&o||r&&l))return!1;const x=Math.abs(e)>=Math.abs(t)?"horizontal":"vertical";let m,p,E,v,_,L;if(x==="horizontal")m=Math.round(i.scrollLeft),p=d-f,E=e,v=a,_=o,L=c;else if(x==="vertical")m=Math.round(i.scrollTop),p=u-g,E=t,v=r,_=l,L=h;else return!1;return!L&&(m>=p||m<=0)?!0:(E>0?m<p:m>0)&&v&&_}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const i=this.options.wrapper;return this.isHorizontal?i.scrollX??i.scrollLeft:i.scrollY??i.scrollTop}get scroll(){return this.options.infinite?bl(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(i){this._isScrolling!==i&&(this._isScrolling=i,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(i){this._isStopped!==i&&(this._isStopped=i,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(i){this._isLocked!==i&&(this._isLocked=i,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let i="lenis";return this.options.autoToggle&&(i+=" lenis-autoToggle"),this.isStopped&&(i+=" lenis-stopped"),this.isLocked&&(i+=" lenis-locked"),this.isScrolling&&(i+=" lenis-scrolling"),this.isScrolling==="smooth"&&(i+=" lenis-smooth"),i}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(i=>{this.rootElement.classList.add(i)})}cleanUpClassName(){for(const i of Array.from(this.rootElement.classList))(i==="lenis"||i.startsWith("lenis-"))&&this.rootElement.classList.remove(i)}};const br={"name": "Kak Adrian", "title": "Video & Audio Editor • Graphic Designer • AI Content Creator • Web Designer", "role": "Creative Designer & Mentor", "avatar": "/images/adrian-profile.jpg", "bio": "Halo! Kenalin, aku Kak Adrian. Sehari-hari fokus berkarya di bidang Editing Audio & Video, Graphic Design, AI Content Creator, dan Web Design. Di kelas, Kak Adrian lebih senang jadi partner ngulik bareng biar kalian nggak cuma hapal tombol software, tapi juga bisa bikin karya audio-video yang rapi, enak ditonton, dan relevan sama industri sekarang.", "quote": "Buat Kak Adrian, ngedesain itu ruang eksperimen yang asyik—santai ngerjainnya, serius hasilnya.", "stats": [], "skills": [{"name": "Editing Audio & Video", "level": 98}, {"name": "Graphic Designer", "level": 96}, {"name": "AI Content Creator", "level": 94}, {"name": "Web Designer", "level": 92}], "softwareStack": [{"name": "Editing Audio & Video", "icon": "PREMIERE PRO", "desc": "Timeline editing, pacing cerita, restorasi & mixing audio, grafis siaran, green screen, dan color grading."}, {"name": "Graphic Designer", "icon": "DESIGN", "desc": "Identitas visual, tata letak editorial, poster, dan grafis siaran yang bersih."}, {"name": "AI Content Creator", "icon": "AI CREATIVE", "desc": "Produksi konten kreatif, ideation cepat, dan alur kerja visual berbasis AI."}, {"name": "Web Designer", "icon": "WEB UI", "desc": "Desain antarmuka web modern, interaktif, responsif, dan nyaman dipakai."}], "socials": {"email": "hello@lexyth.my.id", "github": "https://github.com/lexyth", "youtube": "https://youtube.com/@lexyth", "instagram": "https://instagram.com/lexyth"}},ys=[{"id": "pr-01", "weekNumber": "01", "subject": "Editing Audio & Video", "title": "Pra-Produksi & Storyboard Produk (Iklan Produk TVC)", "subtitle": "Menentukan Ide, Tema, Konsep Monolog 16:9, Menulis Naskah & Menggambar Storyboard Produk", "category": "Pra-Produksi Iklan Produk TVC", "heroImage": "/thumbnails/cover-pr-1.png", "accentColor": "#2563EB", "duration": "4 Jam Pelajaran (180 Menit)", "level": "Dasar", "overview": "Sebelum menyentuh kamera di Pertemuan 02, kreator iklan wajib merancang cetak biru produksi terlebih dahulu: menemukan Ide dari masalah harian, menentukan Tema nuansa emosi, memilih Konsep Eksekusi TVC Monolog 16:9 (Slice of Life + Voice Over + Detail Produk CU/ECU), menyusun Naskah 2 Kolom, dan menggambar Storyboard Produk 9 Frame.", "videoReelPlaceholder": "/thumbnails/cover-pr-1.png", "directLinks": [{"title": "Slide Pertemuan 01: Pra-Produksi & Storyboard Produk (PAV)", "label": "📄 BUKA SLIDE PERTEMUAN 01 (PDF)", "url": "/downloads/Pertemuan%201%20(PAV).pdf", "altUrl": "/downloads/Pertemuan%201%20(PAV).pdf", "type": "siswa", "desc": "Materi slide PDF resmi Pertemuan 1 (Pra-Produksi, Ide, Tema, Konsep & Brief Tugas Iklan Produk TVC)."}], "breakdownStages": [{"step": "01", "name": "Ide, Tema & Konsep TVC", "desc": "Rumuskan Ide (masalah & produk solusi), Tema nuansa emosi, dan konsep Slice of Life 16:9 non-hard-selling.", "badge": "Pra-Produksi"}, {"step": "02", "name": "Naskah 2 Kolom & Monolog", "desc": "Tulis kolom Visual (adegan & detail produk ECU/CU) berpasangan dengan kolom Audio (Voice Over Monolog & BGM).", "badge": "Naskah Produk"}, {"step": "03", "name": "Storyboard Produk 9 Frame", "desc": "Gambar 9 kotak adegan lengkap dengan keterangan Shot (WS/MS/CU/ECU) untuk diajukan ACC sebelum syuting.", "badge": "Tugas 01"}], "tutorialSteps": [{"step": "LANGKAH 01", "phase": "IDE, TEMA & KONSEP PRODUK", "title": "1. Tentukan 1 Produk Pilihan, Masalah Harian, Tema Emosi & Konsep Monolog 16:9", "shortcut": "Ide + Tema + Konsep TVC", "action": "Pilih 1 produk nyata (minuman, skincare, sepatu, parfum, makanan, dll). Temukan masalah harian di sekitar, jadikan produk sebagai solusi, lalu tetapkan Tema emosi dan konsep Slice of Life (bukan selfie vlog atau hard-selling kaku).", "param": "Output: Rumusan Ide, Tema, dan Konsep Produk"}, {"step": "LANGKAH 02", "phase": "NASKAH 2 KOLOM & MONOLOG", "title": "2. Susun Naskah 2 Kolom (Visual Kiri & Audio Voice Over Kanan)", "shortcut": "Format AV Script (30–45 Detik)", "action": "Bagi kertas menjadi 2 kolom: kiri untuk detail visual tiap adegan dan detail produk (CU/ECU), kanan untuk kalimat Voice Over Monolog yang mengalir alami serta musik latar.", "param": "Durasi Iklan Produk: 30–45 Detik (16:9 Landscape)"}, {"step": "LANGKAH 03", "phase": "GAMBAR STORYBOARD PRODUK", "title": "3. Gambar Storyboard Produk 9 Frame & Ajukan ACC", "shortcut": "WS / MS / CU / ECU", "action": "Tuangkan naskah ke dalam 9 kotak Storyboard (sketsa stickman rapi boleh), lengkapi kode ukuran shot (WS, MS, CU, ECU detail produk), lalu foto dan kumpulkan ke Form Tugas 01.", "param": "Wajib ACC sebelum mulai syuting footage produk!"}], "aeLayers": [{"type": "Audio", "name": "01_VoiceOver_Narasi_Isu_Sosial.wav", "blend": "Master", "inPoint": "00:00", "duration": "00:45"}, {"type": "Video", "name": "02_Shot_CloseUp_Ekspresi_Subjek.mov", "blend": "Normal", "inPoint": "00:15", "duration": "00:10"}, {"type": "Video", "name": "03_Shot_Wide_Situasi_Lingkungan.mov", "blend": "Normal", "inPoint": "00:00", "duration": "00:25"}, {"type": "Audio", "name": "04_BGM_Akustik_Inspiratif_Peduli.mp3", "blend": "BGM_Duck", "inPoint": "00:00", "duration": "00:45"}], "assets": [{"name": "Pertemuan 1 (PAV).pdf", "size": "9.5 MB (11 Hal)", "type": "Materi Resmi Siswa (PDF)", "downloadUrl": "/downloads/Pertemuan%201%20(PAV).pdf", "isDownloadable": true, "actionLabel": "BUKA / UNDUH PDF"}, {"name": "Lembar_Kerja_Storyboard_9Frame.pdf", "size": "Kertas Fisik A4 Lab", "type": "Lembar Gambar Manual", "downloadUrl": null, "isDownloadable": false, "actionLabel": "DIBAGIKAN DI LAB"}], "assignment": {"title": "Tugas 01: Pra-Produksi Iklan Produk TVC & Storyboard Produk 9 Frame", "description": "Rancang dokumen pra-produksi iklan produk (TVC Monolog 16:9): rumusan Ide, Tema, Konsep, Naskah 2 Kolom (Visual & Audio Monolog), dan gambar Storyboard Produk 9 Kotak berdurasi 30–45 detik. Minta paraf ACC di kelas, lalu foto dan kumpulkan!", "Formats": ["JPG", "PNG", "PDF"], "FileNaming": "PAV01_Kelas_NamaKelompok_StoryboardProduk", "submissionNote": "Pastikan tulisan dan sketsa storyboard produk terbaca jelas saat difoto.", "deadline": "Pertemuan Berikutnya, 23:59 WIB", "submissionUrl": "/kumpul-tugas?id=pr-01", "requirements": ["Pilih 1 produk nyata untuk proyek Iklan Produk TVC (30–45 detik, format landscape 16:9, konsep Slice of Life + Voice Over Monolog).", "Tuliskan Ide (masalah & produk sebagai solusi), Tema nuansa emosi, dan Naskah 2 Kolom (Visual di kiri, Audio Monolog di kanan).", "Gambar Storyboard Produk 9 Kotak (lengkap dengan kode shot WS/MS/CU/ECU detail produk) dan minta paraf ACC.", "Foto lembar Naskah & Storyboard Produk dengan jelas (format JPG/PNG/PDF, nama file: PAV01_Kelas_NamaKelompok_StoryboardProduk) lalu unggah ke form pengumpulan."]}, "keyTerms": ["Pra-Produksi Produk", "TVC Monolog 16:9", "Slice of Life", "Naskah 2 Kolom", "Storyboard Produk 9 Frame", "ECU Detail Produk"], "fallbackImage": "/thumbnails/thumb-m01.jpg", "stage": "pra-cutting"}, {"id": "pr-02", "weekNumber": "02", "subject": "Editing Audio & Video", "title": "Foldering & Rough Cut Cepat (Q & W)", "subtitle": "Merapikan Folder Agar Video Tidak Hilang & Memotong Adegan ILM 30–45 Detik", "category": "Editing Dasar & Manajemen Bins", "heroImage": "/thumbnails/cover-pr-2.png", "accentColor": "#1D4ED8", "duration": "4 Jam Pelajaran (180 Menit)", "level": "Dasar", "overview": "Belajar kebiasaan paling penting seorang editor: membuat 5 folder rapi agar video tidak pernah error 'Media Offline', lalu cara paling gampang memotong bagian video yang salah atau kepanjangan menggunakan tombol I, O, Q, dan W supaya durasi ILM pas 30–45 detik.", "videoReelPlaceholder": "/thumbnails/cover-pr-2.png", "directLinks": [{"title": "Slide Pertemuan 02: Foldering & Rough Cut Cepat (PAV)", "label": "📄 BUKA SLIDE PERTEMUAN 02 (PDF)", "url": "/downloads/Pertemuan%202%20(PAV).pdf", "altUrl": "/downloads/Pertemuan%202%20(PAV).pdf", "type": "siswa", "desc": "Materi slide PDF resmi Pertemuan 2 (Anti Media Offline, 5 Subfolder, Workspace & Shortcut Q/W)."}], "breakdownStages": [{"step": "01", "name": "Buat 5 Folder Rapi", "desc": "Simpan semua video, rekaman suara, dan musik di dalam 1 folder induk yang punya 5 subfolder berurutan sebelum mulai mengedit.", "badge": "Anti-Error"}, {"step": "02", "name": "Pilih Bagian Bagus (I & O)", "desc": "Putar video mentah, tandai titik mulai bicara/akting dengan tombol I dan titik selesai dengan tombol O.", "badge": "Tandai I & O"}, {"step": "03", "name": "Potong & Rapatkan (Q & W)", "desc": "Gunakan tombol Q dan W untuk membuang sisa video di kiri atau kanan sekaligus merapatkan sambungan otomatis tanpa celah hitam.", "badge": "Potong Cepat"}], "tutorialSteps": [{"step": "LANGKAH 01", "phase": "PERSIAPAN FOLDER", "title": "1. Buat 5 Folder Sebelum Membuka Premiere Pro 2021", "shortcut": "Ctrl + I (Import)", "action": "Buka File Explorer di Drive D:, buat folder bernama 'ILM_NamaKelompok', lalu di dalamnya buat 5 folder: (1) 01_Footage untuk video, (2) 02_Audio untuk suara & musik, (3) 03_Graphics untuk logo/foto, (4) 04_Project untuk file Premiere, dan (5) 05_Exports untuk hasil akhir. Setelah itu tekan Ctrl + N di Premiere Pro dan pilih preset DSLR 1080p30.", "param": "Resolusi Layar: 1920 x 1080 (Mendatar / Landscape 16:9)"}, {"step": "LANGKAH 02", "phase": "MEMILIH ADEGAN", "title": "2. Ambil Bagian Video yang Bagus Saja dengan Tombol I dan O", "shortcut": "Tombol I & Tombol O", "action": "Klik 2 kali videomu di pojok kiri bawah agar muncul di layar kiri atas (Source Monitor). Putar dengan tombol Spasi. Tepat saat temanmu mulai berakting bagus, tekan huruf I (In). Saat adegannya selesai, tekan huruf O (Out). Lalu seret videonya ke baris V1 di Timeline kanan bawah.", "param": "I = Titik Mulai Adegan | O = Titik Akhir Adegan"}, {"step": "LANGKAH 03", "phase": "MEMOTONG CEPAT", "title": "3. Buang Bagian Goyang & Rapatkan Otomatis dengan Tombol Q dan W", "shortcut": "Q (Buang Kiri) | W (Buang Kanan)", "action": "Jika di Timeline masih ada bagian awal video yang goyang atau diam, geser garis biru (Playhead) ke batas mulai bagus, lalu tekan huruf Q (bagian kiri langsung hilang dan video otomatis merapat!). Jika ingin membuang sisa di ujung kanan video, tekan huruf W. Susun semua klip sampai durasinya pas 30–45 detik!", "param": "C = Gunting/Silet | V = Panah Pilih | Q = Pangkas Kiri | W = Pangkas Kanan"}], "aeLayers": [{"type": "Video", "name": "V1_Rangkaian_Shot_Terbaik_Hasil_Potong_Q_W", "blend": "Normal", "inPoint": "00:00", "duration": "01:30"}, {"type": "Audio", "name": "A1_Audio_Suara_Asli_Kamera_Hasil_Sinkron", "blend": "Normal", "inPoint": "00:00", "duration": "01:30"}], "assets": [{"name": "Pertemuan 2 (PAV).pdf", "size": "4.9 MB (6 Hal)", "type": "Materi Resmi Siswa (PDF)", "downloadUrl": "/downloads/Pertemuan%202%20(PAV).pdf", "isDownloadable": true, "actionLabel": "BUKA / UNDUH PDF"}, {"name": "Bahan_Footage_Praktikum_Lab.zip", "size": "Penyimpanan Server Lokal", "type": "Aset Mentah Video Lab", "downloadUrl": null, "isDownloadable": false, "actionLabel": "TERSEDIA DI PC LAB"}], "assignment": {"title": "Tugas 02: Susunan Urutan Adegan (Rough Cut) ILM 30–45 Detik", "description": "DI LAB: Susun potongan video adegan ILM di Timeline Premiere Pro (durasi 30–45 detik) menggunakan tombol I, O, Q, W tanpa ada celah layar hitam, lalu screenshot. TANPA LAB: Buat Tabel Daftar Urutan Klip (Detik ke-0 sampai ke-45) di kertas kerja & susun potongan kasarnya di HP kelompok.", "Formats": ["JPG", "PNG", "MP4"], "FileNaming": "PAV02_Kelas_NamaKelompok_RoughCutILM", "submissionNote": "Pastikan urutan adegan sudah sesuai dengan Storyboard Pertemuan 1 dan berdurasi 30–45 detik.", "deadline": "Pertemuan Berikutnya, 23:59 WIB", "submissionUrl": "/kumpul-tugas?id=pr-02", "requirements": ["DI LAB KOMPUTER: Buat 5 folder rapi (01_Footage s/d 05_Exports), potong adegan ILM menggunakan tombol I, O, Q, dan W di Timeline Premiere Pro 2021 hingga berdurasi pas 30–45 detik tanpa celah hitam, lalu ambil screenshot timeline.", "JIKA TANPA LAB (DI KELAS): Buat Tabel Daftar Urutan Klip (Cutting List) dari detik ke-00 sampai detik ke-45 di kertas kerja berdasarkan Storyboard Pertemuan 1.", "JIKA TANPA LAB (DI HP KELOMPOK): Susun potongan video kasar (Rough Cut) berdurasi 30–45 detik menggunakan aplikasi edit video di 1 HP kelompok.", "Kumpulkan screenshot Timeline / foto Tabel Cutting List (format JPG/PNG/MP4, nama file: PAV02_Kelas_NamaKelompok_RoughCutILM)."]}, "fallbackImage": "/thumbnails/thumb-m02.jpg", "stage": "pra-cutting"}, {"id": "pr-03", "weekNumber": "03", "subject": "Editing Audio & Video", "title": "Audio Denoise & Audio Ducking", "subtitle": "Menjernihkan Rekaman Suara Narator (Voice Over) & Mengatur Volume Musik Latar ILM", "category": "Restorasi Suara & Audio Mixing", "heroImage": "/thumbnails/cover-pr-3.png", "accentColor": "#059669", "duration": "4 Jam Pelajaran (180 Menit)", "level": "Dasar", "overview": "Dalam Iklan Layanan Masyarakat (ILM) 30–45 detik, pesan suara narator (Voice Over) adalah nyawa utama! Di pertemuan ke-3 ini kita belajar cara memisahkan 3 jalur suara, menghilangkan bunyi desis kipas/angin dengan efek DeNoise, dan mengecilkan volume musik otomatis saat narator berbicara (Audio Ducking).", "videoReelPlaceholder": "/thumbnails/cover-pr-3.png", "directLinks": [{"title": "Slide Pertemuan 03: Audio Denoise & Audio Ducking (PAV)", "label": "📄 BUKA SLIDE PERTEMUAN 03 (PDF)", "url": "/downloads/Pertemuan%203%20(PAV).pdf", "altUrl": "/downloads/Pertemuan%203%20(PAV).pdf", "type": "siswa", "desc": "Materi slide PDF resmi Pertemuan 3 (3 Jalur Audio, Ratakan Vokal -6 dB, Denoise & Ducking)."}], "breakdownStages": [{"step": "01", "name": "Pisahkan 3 Jalur Suara", "desc": "Taruh Suara Narator di baris A1, Efek Suara (SFX) di baris A2, dan Musik Latar (BGM) di baris A3 agar mudah diatur.", "badge": "3 Baris Audio"}, {"step": "02", "name": "Jernihkan Suara (DeNoise)", "desc": "Keraskan suara narator ke angka -6 dB (Audio Gain) dan pasang efek DeNoise 20%–30% agar suara desis ruangan hilang.", "badge": "Suara Bersih"}, {"step": "03", "name": "Musik Menunduk (Ducking)", "desc": "Turunkan garis volume musik latar ke -24 dB setiap kali narator mulai berbicara supaya pesan iklan terdengar sangat jelas.", "badge": "Audio Ducking"}], "tutorialSteps": [{"step": "LANGKAH 01", "phase": "VOLUME SUARA NARATOR", "title": "1. Atur Suara Bicara Narator Agar Jelas dan Tidak Pecah (-6 dB)", "shortcut": "Klik Kanan > Audio Gain (G)", "action": "Taruh rekaman suara narator (Voice Over) di baris Track A1. Klik kanan pada klip suara tersebut, pilih 'Audio Gain', lalu pilih 'Normalize Max Peak to' dan ketik angka -6 dB (atau -3 dB). Ini membuat suara temanmu terdengar lantang tapi tidak pecah (tidak menyentuh warna merah 0 dB).", "param": "Target Suara Bicara Manusia (A1): -6 dB sampai -3 dB"}, {"step": "LANGKAH 02", "phase": "HILANGKAN DESIS ANGIN", "title": "2. Bersihkan Suara Kipas/Ruangan dengan Efek DeNoise", "shortcut": "Effects > DeNoise (20% - 35%)", "action": "Buka panel Effects, ketik 'DeNoise', lalu tarik efek tersebut ke klip suara narator di A1. Buka panel Effect Controls di kiri atas, klik tombol 'Edit' pada DeNoise, lalu geser angkanya ke 20% sampai 35% saja (jangan 100% supaya suara temanmu tidak berubah seperti suara robot).", "param": "DeNoise Amount: 20% – 35% (Suara Bersih Alami)"}, {"step": "LANGKAH 03", "phase": "MUSIK MENUNDUK (DUCKING)", "title": "3. Kecilkan Musik Latar Saat Narator Berbicara (4 Titik Keyframe)", "shortcut": "Tahan Ctrl + Klik 4 Titik di Garis A3", "action": "Taruh musik instrumen sedih/inspiratif di baris A3. Lebarkan baris A3 hingga terlihat garis putih di tengahnya. Tahan tombol Ctrl di keyboard, lalu klik 4 titik pada garis putih musik (2 titik sebelum narator bicara, 2 titik setelah selesai bicara). Tarik garis tengahnya turun ke bawah (-24 dB) agar musik menunduk sopan saat narator berbicara!", "param": "Musik Saat Ada Suara Bicara: -24 dB (atau Volume 15% di aplikasi HP)"}], "aeLayers": [{"type": "Video", "name": "V1_Rekaman_Wawancara_Narasumber_Berita", "blend": "Normal", "inPoint": "00:00", "duration": "01:15"}, {"type": "Audio", "name": "A1_Vokal_Dialog_Jernih_DeNoised (-6dB)", "blend": "Dialogue", "inPoint": "00:00", "duration": "01:15"}, {"type": "Audio", "name": "A2_BGM_Musik_Latar_AutoDucked (-18dB)", "blend": "Music_Duck", "inPoint": "00:00", "duration": "01:15"}], "assets": [{"name": "Pertemuan 3 (PAV).pdf", "size": "7.8 MB (10 Hal)", "type": "Materi Resmi Siswa (PDF)", "downloadUrl": "/downloads/Pertemuan%203%20(PAV).pdf", "isDownloadable": true, "actionLabel": "BUKA / UNDUH PDF"}, {"name": "Koleksi_BGM_Bebas_Hak_Cipta.zip", "size": "Penyimpanan Server Lab", "type": "Musik Latar Resmi Lab", "downloadUrl": null, "isDownloadable": false, "actionLabel": "TERSEDIA DI PC LAB"}], "assignment": {"title": "Tugas 03: Klip Breaking News (15–20 Detik) + Teknik Audio DeNoise & Tim Bertugas", "description": "Buat video klip Breaking News singkat berdurasi 15–20 detik (landscape 16:9) dengan manajemen 5 folder rapi, penerapan teknik Audio DeNoise / Noise Reduction (20%–35%) agar vokal berita jernih bebas desis, serta cantumkan daftar Tim yang Bertugas!", "Formats": ["MP4", "MP3", "WAV", "JPG", "PNG"], "FileNaming": "BreakingNews_DKV[1/2/3]_NamaKelompok", "submissionNote": "Pastikan suara pembawa berita terdengar jernih (bebas noise ruangan) dan musik latar tidak menutupi suara bicara.", "deadline": "DKV 1: 16 Nov • DKV 3: 17 Nov • DKV 2: 18 Nov 2026 (23:59 WIB)", "submissionUrl": "/kumpul-tugas?id=pr-03", "requirements": ["Buat video klip Breaking News berdurasi 15–20 detik (posisi kamera mendatar/landscape 16:9, format .MP4) dengan susunan 5 folder proyek yang rapi.", "Terapkan teknik Audio DeNoise / Noise Reduction (20%–35%) agar suara pembawa berita terdengar jernih bebas desis kipas/angin, dan kecilkan musik latar (Audio Ducking).", "Wajib cantumkan daftar Tim yang Bertugas di akhir video dan di form pengumpulan: Pembawa Berita (News Anchor), Kameramen, Editor Audio DeNoise, dan Penulis Naskah.", "Batas Waktu Pengumpulan per Kelas: XI DKV 1 (Senin, 16 November 2026) • XI DKV 3 (Selasa, 17 November 2026) • XI DKV 2 (Rabu, 18 November 2026) pukul 23:59 WIB melalui https://dkv.lexyth.my.id/kumpul-tugas?id=pr-03."]}, "fallbackImage": "/thumbnails/thumb-m06.jpg", "stage": "audio-grafis"}, {"id": "pr-04", "weekNumber": "04", "subject": "Editing Audio & Video", "title": "Elemen Grafis Berita (Lower Third & Running Text)", "subtitle": "Membuat Teks Fakta Isu, Papan Nama (Lower Third) & Running Text di Essential Graphics", "category": "Grafis Siaran & Tipografi Video", "heroImage": "/thumbnails/cover-pr-4.png", "accentColor": "#2563EB", "duration": "4 Jam Pelajaran (180 Menit)", "level": "Dasar Menengah", "overview": "Iklan Layanan Masyarakat (ILM) yang kuat selalu menampilkan teks data fakta yang membuka mata penonton dan ditutup dengan kalimat ajakan (Call-to-Action) yang mudah diingat. Di pertemuan ke-5 ini kita belajar memasang garis batas aman layar (Safe Margins) dan membuat desain teks profesional yang mudah terbaca.", "videoReelPlaceholder": "/thumbnails/cover-pr-4.png", "directLinks": [{"title": "Slide Pertemuan 04: Elemen Grafis Berita (Lower Third & Running Text)", "label": "📄 BUKA SLIDE PERTEMUAN 04 (PDF)", "url": "/downloads/Pertemuan%204%20(PAV).pdf", "altUrl": "/downloads/Pertemuan%204%20(PAV).pdf", "type": "siswa", "desc": "Materi slide PDF resmi Pertemuan 4 (Lower Third, Running Text, Elemen Grafis Berita & Do's/Don'ts)."}], "breakdownStages": [{"step": "01", "name": "Nyalakan Batas Aman (Safe Margin)", "desc": "Aktifkan kotak garis panduan Safe Margins supaya tulisan tidak terpotong saat video ditonton di layar TV atau HP.", "badge": "Safe Margin"}, {"step": "02", "name": "Teks Fakta & Lower Third", "desc": "Buat teks fakta singkat tentang isu yang beredar di awal video dan papan nama (Lower Third) 2 baris di pojok kiri bawah.", "badge": "Teks & Nama"}, {"step": "03", "name": "Slogan Penutup (Call to Action)", "desc": "Buat layar penutup di 5 detik terakhir yang berisi kalimat ajakan masyarakat beserta nama anggota kelompokmu.", "badge": "Slogan Akhir"}], "tutorialSteps": [{"step": "LANGKAH 01", "phase": "BATAS AMAN TEKS", "title": "1. Nyalakan 'Safe Margins' Agar Tulisan Tidak Kepotong di Pinggir Layar", "shortcut": "Ikon Kunci Pas (Wrench) > Safe Margins", "action": "Klik ikon Kunci Pas kecil di bawah layar Program Monitor, lalu klik 'Safe Margins'. Akan muncul 2 kotak garis putih tipis. Aturan wajibnya: semua tulisan, judul, dan logo harus berada di dalam KOTAK BAGIAN DALAM (Title Safe 80%) supaya tidak terpotong di layar HP atau TV!", "param": "Aturan Emas: Jangan menaruh teks terlalu mepet ke tepi layar"}, {"step": "LANGKAH 02", "phase": "MEMBUAT KOTAK NAMA", "title": "2. Membuat Papan Nama (Lower Third) & Teks Fakta Isu dengan Tombol T", "shortcut": "Window > Essential Graphics (Tombol T)", "action": "Buka menu Window > Essential Graphics. Klik 'New Layer > Rectangle' untuk membuat kotak dasar berwarna gelap di kiri bawah layar, lalu tekan huruf T (Type Tool) untuk mengetik teks berwarna putih terang di atasnya. Gunakan jenis huruf tebal yang mudah dibaca seperti Montserrat Bold, Inter, atau Arial Bold.", "param": "Baris Atas: Huruf Tebal Besar (45pt) | Baris Bawah: Huruf Sedang (28pt)"}, {"step": "LANGKAH 03", "phase": "ANIMASI & SLOGAN PENUTUP", "title": "3. Memberi Gerakan Masuk Halus & Membuat Slogan Ajakan di Detik 35–45", "shortcut": "Keyframe Position + Slogan Akhir", "action": "Di 5 detik terakhir video ILM-mu (misal detik 35 sampai 40), buat teks Slogan Ajakan di tengah layar (contoh: 'STOP HOAKS! SARING SEBELUM SHARING' atau 'BUANG SAMPAH HARI INI, SELAMATKAN BUMI ESOK HARI') lengkap dengan nama anggota kelompok di bawahnya.", "param": "Durasi Teks Muncul di Layar: Minimal 4–5 Detik Agar Sempat Terbaca"}], "aeLayers": [{"type": "Graphics", "name": "V3_LowerThird_Identitas_Narasumber_Dan_Slogan_ILM", "blend": "Normal", "inPoint": "00:10", "duration": "00:08"}, {"type": "Video", "name": "V2_UltraKey_Anchor_Atau_Subjek_Wawancara", "blend": "ChromaKey", "inPoint": "00:00", "duration": "01:30"}, {"type": "Video", "name": "V1_Backdrop_Studio_Atau_Footage_Peristiwa_ILM", "blend": "Normal", "inPoint": "00:00", "duration": "01:30"}, {"type": "Audio", "name": "A1_Vokal_Wawancara_Dan_Narasi_Jernih", "blend": "Dialogue", "inPoint": "00:00", "duration": "01:30"}], "assets": [{"name": "Pertemuan 4 (PAV).pdf", "size": "5.9 MB (7 Hal)", "type": "Materi Resmi Siswa (PDF)", "downloadUrl": "/downloads/Pertemuan%204%20(PAV).pdf", "isDownloadable": true, "actionLabel": "BUKA / UNDUH PDF"}], "assignment": {"title": "Tugas 04: Elemen Grafis Berita (Lower Third, Running Text & Teks ILM)", "description": "DI LAB: Buat 3 elemen grafis di Track V4 proyek ILM-mu menggunakan Essential Graphics: (1) Teks Fakta Isu di awal video, (2) Lower Third nama tokoh/keterangan lokasi, dan (3) Layar Slogan Ajakan Penutup + Credit Nama Kelompok di dalam batas Safe Margin. TANPA LAB: Gambar desain 3 layar teks tersebut di kertas kerja (kotak 16:9) dan pasang langsung teksnya pada rakitan video ILM di HP kelompokmu!", "Formats": ["JPG", "PNG", "MP4"], "FileNaming": "PAV04_Kelas_NamaKelompok_GrafisBerita", "submissionNote": "Periksa ejaan Bahasa Indonesia pada semua teks iklanmu, pastikan bebas salah ketik (typo) dan mudah dibaca.", "deadline": "Pertemuan Berikutnya, 23:59 WIB", "submissionUrl": "/kumpul-tugas?id=pr-04", "requirements": ["DI LAB KOMPUTER: Aktifkan Safe Margins, lalu buat 3 teks grafis di Track V4 menggunakan Type Tool (T) & Essential Graphics: (1) Teks Fakta Isu di awal iklan, (2) Papan nama Lower Third, dan (3) Layar Slogan Ajakan Penutup + Nama Kelompok.", "JIKA TANPA LAB (DI KERTAS): Gambar desain tata letak 3 kotak layar 16:9 (Layar Fakta Isu, Layar Lower Third, dan Layar Slogan Penutup) lengkap dengan batas garis aman (Safe Margin).", "JIKA TANPA LAB (DI HP KELOMPOK): Tambahkan teks fakta, keterangan nama, dan slogan ajakan penutup langsung ke dalam rakitan video ILM 30–45 detik di HP kelompokmu.", "Pastikan ejaan Bahasa Indonesia rapi tanpa salah ketik (typo) dan kumpulkan hasilnya (format JPG/PNG/MP4, nama file: PAV04_Kelas_NamaKelompok_GrafisTeks_ILM)."]}, "fallbackImage": "/thumbnails/thumb-m01.jpg", "stage": "audio-grafis"}, {"id": "pr-05", "weekNumber": "05", "subject": "Editing Audio & Video", "title": "Studio Green Screen (Ultra Key) & Visual B-Roll", "subtitle": "Menumpuk Video Bukti Masalah (B-Roll) di Atas Suara Narator & Teknik Green Screen", "category": "Chroma Keying & Layering Video", "heroImage": "/thumbnails/cover-pr-5.png", "accentColor": "#0284C7", "duration": "4 Jam Pelajaran (180 Menit)", "level": "Dasar Menengah", "overview": "Agar Iklan Layanan Masyarakat (ILM) 30–45 detik tentang isu yang beredar terasa nyata dan meyakinkan, penonton tidak boleh hanya melihat 1 gambar monoton! Di pertemuan ke-4 ini kita belajar menumpuk video bukti kejadian/berita (B-Roll) di atas suara narator, serta cara menghapus latar kain hijau (Ultra Key) untuk segmen pembawa pesan/berita.", "videoReelPlaceholder": "/thumbnails/cover-pr-5.png", "directLinks": [{"title": "Slide Presentasi Pertemuan 05: Green Screen Ultra Key & B-Roll (10 Slide)", "label": "🖥️ BUKA SLIDE PERTEMUAN 05 (16:9)", "url": "/pav-pertemuan-5.html", "altUrl": "/pav-pertemuan-5.html", "type": "siswa", "desc": "Materi tayangan layar proyektor 10 slide lengkap dengan langkah klik demi klik, rumus parameter, dan shortcut keyboard."}, {"title": "Panduan Produksi Siaran Berita TV Kelas", "label": "📺 PANDUAN SIARAN BERITA TV", "url": "/karhutla/panduan-berita-karhutla.html", "altUrl": "/berita", "type": "berita", "desc": "Panduan pembagian peran redaksi satu kelas, naskah teleprompter anchor, dan tata letak studio berita."}], "breakdownStages": [{"step": "01", "name": "Konsep Tumpukan Kue Lapis", "desc": "Pahami urutan baris video dari bawah ke atas: V1 untuk latar/adegan dasar, V2 untuk presenter/aktor utama, dan V3 untuk gambar bukti isu (B-Roll).", "badge": "Layer V1-V2-V3"}, {"step": "02", "name": "Hapus Kain Hijau (Ultra Key)", "desc": "Gunakan pipet efek Ultra Key untuk melubangi warna latar hijau sehingga menyatu dengan gambar latar di bawahnya.", "badge": "Green Screen"}, {"step": "03", "name": "Sisipkan Video Bukti (B-Roll)", "desc": "Tutup tampilan layar setiap 4–5 detik dengan potongan video bukti masalah (sampah, berita hoaks di HP, ekspresi korban) sambil suara narator tetap berjalan.", "badge": "B-Roll ILM"}], "tutorialSteps": [{"step": "LANGKAH 01", "phase": "MENUMPUK LAYER VIDEO", "title": "1. Menyusun Latar di V1 dan Video Presenter/Aktor di V2", "shortcut": "Track V1 (Bawah) & Track V2 (Tengah)", "action": "Di Timeline Premiere Pro, baris yang lebih atas akan selalu menutupi baris di bawahnya. Letakkan gambar latar belakang (misal foto ruang berita atau latar isu) di baris V1 paling bawah, lalu letakkan video pembawa pesan berlatar kain hijau di baris V2 tepat di atasnya.", "param": "V1 = Background Latar | V2 = Subjek Utama / Green Screen"}, {"step": "LANGKAH 02", "phase": "MENGHAPUS WARNA HIJAU", "title": "2. Melubangi Kain Hijau dengan Pipet Efek Ultra Key", "shortcut": "Effects > Ultra Key > Klik Pipet", "action": "Ketik 'Ultra Key' di panel Effects, lalu seret ke video di baris V2. Di panel Effect Controls, klik ikon Pipet (Eyedropper) di samping tulisan 'Key Color', lalu klik warna kain hijau di dekat bahu temanmu. Kain hijau langsung hilang transparan! Ubah Setting dari Default ke 'Aggressive' atau naikkan angka Pedestal ke 85 agar latar bersih sempurna.", "param": "Ultra Key: Key Color = Hijau | Matte Generation Pedestal = 80 - 95"}, {"step": "LANGKAH 03", "phase": "MEMASANG B-ROLL ISU", "title": "3. Menaruh 6–8 Potongan Video Bukti Isu (B-Roll) di Baris V3", "shortcut": "Track V3 (Ganti Gambar Tiap 4-5 Detik)", "action": "Supaya ILM 30–45 detikmu menarik seperti iklan TV, taruh potongan-potongan video bukti masalah (misal: tangan mengetik komentar jahat, tumpukan sampah, atau layar berita viral) di baris V3. Biarkan suara narator di baris A1 terus bercerita sementara gambarnya berganti-ganti setiap 4 sampai 5 detik!", "param": "Durasi Tiap Potongan B-Roll: 4–5 Detik (Total 6–8 Klip untuk 40 Detik)"}], "aeLayers": [{"type": "Video", "name": "V2_UltraKey_GreenScreen_NewsAnchor_Studio", "blend": "ChromaKey", "inPoint": "00:00", "duration": "01:30"}, {"type": "Video", "name": "V1_Backdrop_Studio_Modern_Dan_BRoll_Lapangan", "blend": "Normal", "inPoint": "00:00", "duration": "01:30"}, {"type": "Audio", "name": "A1_Vokal_Dialog_Presenter_Studio_Jernih", "blend": "Dialogue", "inPoint": "00:00", "duration": "01:30"}], "assets": [{"name": "Slide_Presentasi_Berita_TV_GreenScreen.pdf", "size": "1.9 MB", "type": "Slide Resmi Pembelajaran (PDF)", "downloadUrl": "/karhutla/tugas-jurnalis-karhutla.pdf", "isDownloadable": true, "actionLabel": "UNDUH SLIDE"}, {"name": "Panduan_Lengkap_Tugas_Jurnalis_Berita.md", "size": "11 KB", "type": "Pedoman Naskah & Syuting", "downloadUrl": "/karhutla/PANDUAN_TUGAS_JURNALIS_BERITA_KARHUTLA.md", "isDownloadable": true, "actionLabel": "BUKA DOKUMEN"}], "assignment": {"title": "Tugas 05: Komposisi Green Screen (Ultra Key) & Video Bukti Isu (B-Roll)", "description": "DI LAB: Terapkan efek Ultra Key pada klip green screen di V2 dan pasang minimal 4 klip B-Roll bukti isu di V3 di atas suara narator ILM-mu. TANPA LAB: (1) Buat daftar 'Shot List' 6–8 adegan B-Roll di kertas, lalu (2) Rekam langsung 6–8 potongan video pendek (masing-masing 5 detik, posisi HP mendatar/landscape) di sekitar sekolah yang menggambarkan masalah dan solusi isu ILM kelompokmu!", "Formats": ["MP4", "JPG", "PNG"], "FileNaming": "PAV05_Kelas_NamaKelompok_GreenScreen_BRoll", "submissionNote": "Pastikan semua video direkam dengan posisi HP mendatar (Landscape 16:9) dan gambarnya tidak goyang.", "deadline": "Pertemuan Berikutnya, 23:59 WIB", "submissionUrl": "/kumpul-tugas?id=pr-05", "requirements": ["DI LAB KOMPUTER: Tumpuk minimal 4–6 video bukti masalah (B-Roll) di Track V2/V3 tepat di atas suara narator (A1), serta praktikkan penghapusan latar hijau menggunakan efek Ultra Key (Setting: Aggressive).", "JIKA TANPA LAB (DI KERTAS): Buat daftar 'Shot List B-Roll' berisi 6–8 adegan visual pendukung yang membuktikan masalah dan solusi isu ILM kelompokmu.", "JIKA TANPA LAB (SYUTING HP KELOMPOK): Rekam langsung 6–8 video pendek (masing-masing 5 detik, wajib posisi HP mendatar/landscape 16:9 dan tangan stabil) di lingkungan sekolah sesuai daftar B-Roll.", "Kumpulkan hasil komposisi B-Roll / kolase tangkapan layar video yang direkam (format MP4/JPG/PNG, nama file: PAV05_Kelas_NamaKelompok_VisualBRoll_ILM)."]}, "fallbackImage": "/thumbnails/thumb-m02-1.jpg", "stage": "finishing"}, {"id": "pr-06", "weekNumber": "06", "subject": "Editing Audio & Video", "title": "Color Grading & Master Export H.264 (Penilaian Akhir)", "subtitle": "Pewarnaan Emosi Video (Lumetri Color & Adjustment Layer), Quality Control 5 Titik & Ekspor MP4 Full HD (Ctrl + M)", "category": "Color Grading, QC & Master Export", "heroImage": "/thumbnails/cover-pr-6.png", "accentColor": "#0284C7", "duration": "4 Jam Pelajaran (180 Menit)", "level": "Dasar Menengah", "overview": "Pertemuan puncak Pengolahan Audio & Video: menyamakan pencahayaan antar kamera HP dengan Basic Correction, membangun suasana emosi melalui Adjustment Layer & Lumetri Color, melakukan Quality Control (QC) 5 titik, serta mengekspor karya Master Video Full HD H.264 (.MP4) melalui Ctrl + M.", "videoReelPlaceholder": "/thumbnails/cover-pr-6.png", "directLinks": [{"title": "Slide Presentasi Pertemuan 06: Color Grading & Master Export H.264 (10 Slide)", "label": "🖥️ BUKA SLIDE PERTEMUAN 06 (16:9)", "url": "/pav-pertemuan-6.html", "altUrl": "/pav-pertemuan-6.html", "type": "siswa", "desc": "Materi tayangan layar proyektor 10 slide gabungan Lumetri Color Grading, Quality Control 5 titik, dan Export H.264."}, {"title": "Panduan Produksi Siaran Berita TV Kelas", "label": "📺 PANDUAN SIARAN BERITA TV", "url": "/karhutla/panduan-berita-karhutla.html", "altUrl": "/berita", "type": "berita", "desc": "Panduan pembagian peran redaksi satu kelas, naskah teleprompter anchor, dan tata letak studio berita."}], "breakdownStages": [{"step": "01", "name": "Color Correction & Adjustment Layer", "desc": "Samakan terang dan suhu warna antar klip HP, lalu pasang Adjustment Layer di track teratas untuk grading emosi.", "badge": "Lumetri Color"}, {"step": "02", "name": "Cek 5 Titik Quality Control (QC)", "desc": "Pastikan bebas jeda hitam (black gap), audio vokal -6 dB & ducking -24 dB, green screen bersih, dan Lower Third bebas typo.", "badge": "Audit QC"}, {"step": "03", "name": "Master Export H.264 (Ctrl + M)", "desc": "Pasang Mark In (I) & Mark Out (O), tekan Ctrl + M, pilih Format H.264 & Preset Match Source - High Bitrate (.mp4 1080p).", "badge": "Export Final"}], "tutorialSteps": [{"step": "LANGKAH 01", "phase": "MEMASANG FILTER RATA", "title": "1. Pasang 'Adjustment Layer' di Baris Paling Atas (Track V4)", "shortcut": "New Item > Adjustment Layer", "action": "Supaya kamu tidak capek mewarnai 8 potongan video satu per satu, klik ikon kertas kecil (New Item) di pojok kanan bawah Project Panel, pilih 'Adjustment Layer', lalu tarik ke baris paling atas (Track V4) menutupi seluruh videomu. Potong Adjustment Layer menggunakan tombol C tepat di batas pergantian antara adegan Masalah dan adegan Solusi!", "param": "Adjustment Layer = Kaca Filter yang Mewarnai Semua Video di Bawahnya"}, {"step": "LANGKAH 02", "phase": "WARNA ADEGAN MASALAH", "title": "2. Atur Warna Babak Masalah (Detik 00–25): Agak Pucat & Dingin", "shortcut": "Window > Lumetri Color > Basic Correction", "action": "Klik potongan Adjustment Layer bagian pertama (Babak Masalah). Buka panel Lumetri Color > Basic Correction, lalu geser 3 angka mudah ini: (1) Turunkan Saturation ke angka 75–80 (agar warna agak pucat), (2) Geser Temperature ke kiri menjadi -15 (agak biru dingin), dan (3) Naikkan Contrast ke +20 agar bayangan tampak tegas.", "param": "Resep Masalah: Temp = -15 (Dingin) | Contrast = +20 | Saturation = 75%"}, {"step": "LANGKAH 01", "phase": "PERIKSA 5 TITIK WAJIB", "title": "1. Putar Videomu dari Detik 00:00 Sampai Selesai & Cek 5 Hal Ini", "shortcut": "Checklist Quality Control (QC)", "action": "Sebelum mengubah proyek menjadi file video akhir, pastikan 5 poin ini sudah beres: (1) Durasi total berada di rentang 30 sampai 45 detik, (2) Tidak ada layar kedip hitam kosong di sela sambungan, (3) Suara narator terdengar sangat jelas dan musik sudah mengecil saat narator bicara, (4) Terdapat teks fakta isu & slogan ajakan yang bebas typo, (5) Nama lengkap anggota kelompok tertulis di bagian akhir.", "param": "Jika 5 poin di atas sudah centang semua = Siap Export Nilai A!"}, {"step": "LANGKAH 02", "phase": "KUNCI DURASI EXPORT", "title": "2. Pasang Tanda I di Detik 00:00 dan Tanda O di Detik Terakhir", "shortcut": "Tombol I (Awal) & Tombol O (Akhir)", "action": "Geser garis waktu (Playhead) ke paling awal (detik 00:00) lalu tekan huruf I. Kemudian geser garis waktu tepat ke akhir layar penutup iklanmu (misal detik 00:40) lalu tekan huruf O. Ini mengunci batas supaya komputer hanya mengekspor tepat bagian iklanmu saja!", "param": "Rentang Export: 00:00 sampai 00:30 s/d 00:45"}], "aeLayers": [{"type": "Adjustment", "name": "V3_Master_Lumetri_ColorCorrection_SCurve", "blend": "ColorGrade", "inPoint": "00:00", "duration": "01:30"}, {"type": "Graphics", "name": "V2_LowerThird_Identitas_Dan_Grafis", "blend": "Normal", "inPoint": "00:10", "duration": "01:10"}, {"type": "Video", "name": "V1_Rangkaian_Video_Liputan_Dan_ILM", "blend": "Normal", "inPoint": "00:00", "duration": "01:30"}, {"type": "Audio", "name": "A1_Vokal_Jernih_Dan_BGM_Terdialog", "blend": "Master", "inPoint": "00:00", "duration": "01:30"}], "assets": [{"name": "Slide_Tutorial_PAV_Pertemuan_06.html", "size": "48 KB (10 Slide)", "type": "Bahan Tayang Presentasi Lab", "downloadUrl": "/pav-pertemuan-6.html", "isDownloadable": true, "actionLabel": "BUKA SLIDE"}], "assignment": {"title": "Tugas 06 (Penilaian Akhir): Color Grading & Export Master Video (H.264 MP4)", "description": "Selesaikan pewarnaan emosi video (Lumetri Color / Adjustment Layer), lakukan pengecekan Quality Control 5 titik, lalu ekspor hasil karya akhir (Berita TV / Video ILM 30–45 detik) menjadi file .MP4 Full HD 1080p (Ctrl + M, H.264). Unggah ke Google Drive (akses publik) dan kirimkan link-nya di form pengumpulan tugas!", "Formats": ["MP4", "LINK GOOGLE DRIVE", "JPG", "PNG"], "FileNaming": "PAV06_FINAL_Kelas_NamaKelompok.mp4", "submissionNote": "Putar dulu file .mp4 hasil akhirnya dari awal sampai habis sebelum dikumpulkan untuk memastikan warna, gambar, dan suaranya lancar!", "deadline": "Akhir November 2026, 23:59 WIB", "submissionUrl": "/kumpul-tugas?id=pr-06", "requirements": ["Terapkan Color Correction & Grading (Lumetri Color / Adjustment Layer) agar warna antar-klip seragam dan sesuai mood cerita.", "Periksa 5 Syarat Kelulusan (QC): Bebas celah layar hitam (Black Frame), suara narator -6 dB di atas musik Audio Ducking (-24 dB), Lower Third/Running Text bebas typo, dan Green Screen bersih.", "Ekspor video menjadi format .MP4 Full HD (1920x1080p) menggunakan Ctrl + M (Format: H.264, Preset: Match Source - High Bitrate).", "Putar ulang file .MP4 dari awal sampai akhir, unggah ke Google Drive (akses publik) atau upload langsung di portal (nama file: PAV06_FINAL_Kelas_NamaKelompok.mp4)."]}, "fallbackImage": "/thumbnails/thumb-m02.jpg", "stage": "finishing"}];class Pl{constructor(){this.ctx=null,this.analyser=null,this.dataArray=null,this.masterGain=null,this.compressor=null,this.bgmGain=null,this.isPlayingBGM=!1,this.isMuted=!1,this.tempo=118,this.secondsPerBeat=60/this.tempo,this.secondsPer16th=this.secondsPerBeat/4,this.lookaheadInterval=25,this.scheduleAheadTime=1.8,this.current16thNote=0,this.nextNoteTime=0,this.clockTimer=null,this.rafTimer=null,this.worker=null,this.watchdogTimer=null,this.hasWatchdog=!1,this.bgmDelay=null,this.bgmDelayFeedback=null,this.bgmDelayFilter=null,this.onStateChangeCallbacks=[],this.noiseBuffer=null,this.chords=[{name:"Fmaj7",root:43.65,padFreqs:[87.31,130.81,164.81,220,261.63],arpFreqs:[523.25,659.25,783.99,880,1046.5,1318.51,880,659.25]},{name:"Gadd9",root:49,padFreqs:[98,146.83,196,246.94,293.66],arpFreqs:[587.33,783.99,880,987.77,1174.66,1318.51,987.77,783.99]},{name:"Em7",root:41.2,padFreqs:[82.41,123.47,164.81,196,293.66],arpFreqs:[493.88,659.25,783.99,987.77,1174.66,1318.51,783.99,659.25]},{name:"Am7",root:55,padFreqs:[110,164.81,220,261.63,329.63],arpFreqs:[523.25,659.25,880,1046.5,1318.51,1567.98,1046.5,659.25]}],this.leadMotifNotes=[1046.5,1174.66,1318.51,1567.98,1760]}onStateChange(e){typeof e=="function"&&this.onStateChangeCallbacks.push(e)}notifyStateChange(){const e={isPlaying:this.isPlayingBGM,isMuted:this.isMuted};this.onStateChangeCallbacks.forEach(t=>{try{t(e)}catch{}})}init(){if(!this.ctx)try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.compressor=this.ctx.createDynamicsCompressor(),this.compressor.threshold.setValueAtTime(-20,this.ctx.currentTime),this.compressor.knee.setValueAtTime(25,this.ctx.currentTime),this.compressor.ratio.setValueAtTime(5,this.ctx.currentTime),this.compressor.attack.setValueAtTime(.005,this.ctx.currentTime),this.compressor.release.setValueAtTime(.2,this.ctx.currentTime),this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=64;const t=this.analyser.frequencyBinCount;if(this.dataArray=new Uint8Array(t),this.masterGain=this.ctx.createGain(),this.masterGain.gain.setValueAtTime(.9,this.ctx.currentTime),this.bgmGain=this.ctx.createGain(),this.bgmGain.gain.setValueAtTime(.001,this.ctx.currentTime),this.bgmGain.connect(this.compressor),this.compressor.connect(this.analyser),this.analyser.connect(this.masterGain),this.masterGain.connect(this.ctx.destination),this.bgmDelay=this.ctx.createDelay(),this.bgmDelay.delayTime.setValueAtTime(.25,this.ctx.currentTime),this.bgmDelayFeedback=this.ctx.createGain(),this.bgmDelayFeedback.gain.setValueAtTime(.28,this.ctx.currentTime),this.bgmDelayFilter=this.ctx.createBiquadFilter(),this.bgmDelayFilter.type="lowpass",this.bgmDelayFilter.frequency.setValueAtTime(2800,this.ctx.currentTime),this.bgmDelay.connect(this.bgmDelayFilter),this.bgmDelayFilter.connect(this.bgmDelayFeedback),this.bgmDelayFeedback.connect(this.bgmDelay),this.bgmDelayFilter.connect(this.bgmGain),this.buildNoiseBuffer(),typeof Worker<"u"&&!this.worker)try{const n=new Blob([`let t = null;
            self.onmessage = function(e) {
              if (e.data === 'start') {
                if (!t) t = setInterval(() => self.postMessage('tick'), 80);
              } else if (e.data === 'stop') {
                if (t) { clearInterval(t); t = null; }
              }
            };`],{type:"application/javascript"});this.worker=new Worker(URL.createObjectURL(n)),this.worker.onmessage=()=>{this.isPlayingBGM&&this.clockScheduler()}}catch(n){console.warn("Worker init fallback to setInterval:",n)}}catch(e){console.warn("AudioContext initialization failed:",e)}}buildNoiseBuffer(){if(!this.ctx)return;const e=this.ctx.sampleRate*1;this.noiseBuffer=this.ctx.createBuffer(1,e,this.ctx.sampleRate);const t=this.noiseBuffer.getChannelData(0);for(let n=0;n<e;n++)t[n]=Math.random()*2-1}startAutoBGM(){if(this.init(),!this.ctx)return;if(this.ctx.state==="running"){this.startBGM();return}const e=["pointerdown","touchstart","click","keydown","wheel","scroll"],t=()=>{this.ctx&&(this.ctx.state==="suspended"?this.ctx.resume().then(()=>{this.startBGM()}).catch(()=>{}):this.startBGM(),e.forEach(n=>window.removeEventListener(n,t,{passive:!0})))};e.forEach(n=>window.addEventListener(n,t,{passive:!0,once:!0})),this.ctx.resume().then(()=>{this.ctx.state==="running"&&(this.startBGM(),e.forEach(n=>window.removeEventListener(n,t,{passive:!0})))}).catch(()=>{})}startBGM(){this.init(),this.ctx&&(this.ctx.state==="suspended"?this.ctx.resume().then(()=>this._executeStartBGM()).catch(()=>{}):this._executeStartBGM())}_executeStartBGM(){if(this.isPlayingBGM)return;if(this.isPlayingBGM=!0,this.isMuted=!1,this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime),this.bgmGain.gain.setValueAtTime(1e-4,this.ctx.currentTime),this.bgmGain.gain.exponentialRampToValueAtTime(.2,this.ctx.currentTime+1.5),this.current16thNote=0,this.nextNoteTime=this.ctx.currentTime+.05,this.worker)try{this.worker.postMessage("start")}catch{}this.clockTimer&&clearInterval(this.clockTimer),this.clockTimer=setInterval(()=>{this.clockScheduler()},this.lookaheadInterval);const e=()=>{this.isPlayingBGM&&(this.clockScheduler(),this.rafTimer=requestAnimationFrame(e))};this.rafTimer&&cancelAnimationFrame(this.rafTimer),this.rafTimer=requestAnimationFrame(e),this.setupWatchdog(),this.notifyStateChange()}clockScheduler(){if(!(!this.ctx||!this.isPlayingBGM))for(this.nextNoteTime<this.ctx.currentTime&&(this.nextNoteTime=this.ctx.currentTime+.02);this.nextNoteTime<this.ctx.currentTime+this.scheduleAheadTime;)this.scheduleNote(this.current16thNote,this.nextNoteTime),this.nextNoteTime+=this.secondsPer16th,this.current16thNote=(this.current16thNote+1)%64}setupWatchdog(){if(this.hasWatchdog)return;this.hasWatchdog=!0;const e=()=>{this.isPlayingBGM&&this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})};this.ctx&&this.ctx.addEventListener("statechange",()=>{this.isPlayingBGM&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}),["pointerdown","touchstart","click","keydown","wheel","scroll"].forEach(t=>{window.addEventListener(t,e,{passive:!0})}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(e(),this.ctx&&this.nextNoteTime<this.ctx.currentTime&&(this.nextNoteTime=this.ctx.currentTime+.02))}),window.addEventListener("focus",()=>{e()}),this.watchdogTimer&&clearInterval(this.watchdogTimer),this.watchdogTimer=setInterval(()=>{this.isPlayingBGM&&(e(),this.ctx&&this.nextNoteTime<this.ctx.currentTime-.25&&(this.nextNoteTime=this.ctx.currentTime+.02))},1e3)}scheduleNote(e,t){const n=Math.floor(e/16),s=e%16,a=this.chords[n];s===0&&this.triggerUpliftingChord(a,t,this.secondsPerBeat*4),s%4===0&&(this.triggerSoftKick(t),this.triggerGroovyBass(a.root,t,this.secondsPer16th*1.8)),s%4===2&&this.triggerGroovyBass(a.root*2,t,this.secondsPer16th*1.5);const r=s%4===2;this.triggerCrispHiHat(t,r?.016:.009);const o=a.arpFreqs[s%a.arpFreqs.length];if(this.triggerArpPluck(o,t),e===32||e===48||e===0){const l=this.leadMotifNotes[Math.floor(Math.random()*this.leadMotifNotes.length)];this.triggerBellChime(l,t)}}triggerSoftKick(e){if(!this.ctx)return;const t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(130,e),t.frequency.exponentialRampToValueAtTime(42,e+.12),n.gain.setValueAtTime(.055,e),n.gain.exponentialRampToValueAtTime(1e-4,e+.14),t.connect(n),n.connect(this.bgmGain),t.start(e),t.stop(e+.15)}triggerGroovyBass(e,t,n){if(!this.ctx)return;const s=this.ctx.createOscillator(),a=this.ctx.createBiquadFilter(),r=this.ctx.createGain();s.type="sawtooth",s.frequency.setValueAtTime(e,t),a.type="lowpass",a.frequency.setValueAtTime(450,t),a.frequency.exponentialRampToValueAtTime(160,t+n),a.Q.setValueAtTime(3.5,t),r.gain.setValueAtTime(1e-4,t),r.gain.linearRampToValueAtTime(.045,t+.01),r.gain.exponentialRampToValueAtTime(1e-4,t+n),s.connect(a),a.connect(r),r.connect(this.bgmGain),s.start(t),s.stop(t+n+.02)}triggerCrispHiHat(e,t){if(!this.ctx||!this.noiseBuffer)return;const n=this.ctx.createBufferSource();n.buffer=this.noiseBuffer;const s=this.ctx.createBiquadFilter();s.type="highpass",s.frequency.setValueAtTime(7500,e);const a=this.ctx.createGain();a.gain.setValueAtTime(t,e),a.gain.exponentialRampToValueAtTime(1e-4,e+.04),n.connect(s),s.connect(a),a.connect(this.bgmGain),n.start(e),n.stop(e+.05)}triggerUpliftingChord(e,t,n){if(!this.ctx)return;const s=this.ctx.createBiquadFilter();s.type="lowpass",s.frequency.setValueAtTime(400,t),s.frequency.exponentialRampToValueAtTime(950,t+.8),s.frequency.exponentialRampToValueAtTime(500,t+n),s.Q.setValueAtTime(2,t);const a=this.ctx.createGain();a.gain.setValueAtTime(1e-4,t),a.gain.exponentialRampToValueAtTime(.065,t+.35),a.gain.setValueAtTime(.065,t+n-.5),a.gain.exponentialRampToValueAtTime(1e-4,t+n),s.connect(a),a.connect(this.bgmGain),e.padFreqs.forEach((r,o)=>{const l=this.ctx.createOscillator();l.type="sawtooth",l.frequency.setValueAtTime(r,t),l.detune.setValueAtTime(-6+(o%2===0?-2:2),t);const c=this.ctx.createOscillator();c.type="triangle",c.frequency.setValueAtTime(r,t),c.detune.setValueAtTime(6+(o%2===0?2:-2),t),l.connect(s),c.connect(s),l.start(t),c.start(t),l.stop(t+n+.05),c.stop(t+n+.05)})}triggerArpPluck(e,t){if(!this.ctx)return;const n=this.ctx.createOscillator(),s=this.ctx.createGain(),a=this.ctx.createBiquadFilter();n.type="sine",n.frequency.setValueAtTime(e,t),a.type="bandpass",a.frequency.setValueAtTime(e*1.2,t),a.Q.setValueAtTime(2.5,t),s.gain.setValueAtTime(1e-4,t),s.gain.exponentialRampToValueAtTime(.038,t+.015),s.gain.exponentialRampToValueAtTime(1e-4,t+.22),n.connect(a),a.connect(s),s.connect(this.bgmGain),this.bgmDelay&&s.connect(this.bgmDelay),n.start(t),n.stop(t+.25)}triggerBellChime(e,t){if(!this.ctx)return;const n=this.ctx.createOscillator(),s=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(e,t),s.gain.setValueAtTime(1e-4,t),s.gain.exponentialRampToValueAtTime(.045,t+.02),s.gain.exponentialRampToValueAtTime(1e-4,t+1.6),n.connect(s),s.connect(this.bgmGain),this.bgmDelay&&s.connect(this.bgmDelay),n.start(t),n.stop(t+1.8)}duckBGM(e=.04,t=.6){if(!(!this.ctx||!this.bgmGain||!this.isPlayingBGM||this.isMuted))try{this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime),this.bgmGain.gain.linearRampToValueAtTime(e,this.ctx.currentTime+t)}catch{}}restoreBGM(e=.2,t=.8){if(!(!this.ctx||!this.bgmGain||!this.isPlayingBGM||this.isMuted))try{this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime),this.bgmGain.gain.linearRampToValueAtTime(e,this.ctx.currentTime+t)}catch{}}stopBGM(){if(!(!this.ctx||!this.isPlayingBGM)){if(this.isPlayingBGM=!1,this.isMuted=!0,this.worker)try{this.worker.postMessage("stop")}catch{}this.clockTimer&&(clearInterval(this.clockTimer),this.clockTimer=null),this.rafTimer&&(cancelAnimationFrame(this.rafTimer),this.rafTimer=null),this.bgmGain&&(this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime),this.bgmGain.gain.exponentialRampToValueAtTime(1e-4,this.ctx.currentTime+.6)),this.notifyStateChange()}}toggleSound(){return this.ctx||this.init(),this.ctx.state==="suspended"&&this.ctx.resume(),this.isPlayingBGM?(this.stopBGM(),!1):(this.startBGM(),this.playWhoosh(380,100),!0)}playTick(e=900){if(!(!this.ctx||this.isMuted))try{const t=this.ctx.currentTime,n=this.ctx.createOscillator(),s=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(e,t),n.frequency.exponentialRampToValueAtTime(e*.4,t+.035),s.gain.setValueAtTime(.035,t),s.gain.exponentialRampToValueAtTime(1e-4,t+.035),n.connect(s),s.connect(this.compressor),n.start(t),n.stop(t+.04)}catch{}}playWhoosh(e=400,t=90){if(!(!this.ctx||this.isMuted))try{const n=this.ctx.currentTime,s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(e,n),s.frequency.exponentialRampToValueAtTime(t,n+.28),a.gain.setValueAtTime(.06,n),a.gain.exponentialRampToValueAtTime(1e-4,n+.28),s.connect(a),a.connect(this.compressor),s.start(n),s.stop(n+.3)}catch{}}getFrequencyIntensity(){if(!this.analyser||!this.isPlayingBGM||this.isMuted)return 0;this.analyser.getByteFrequencyData(this.dataArray);let e=0;for(let n=0;n<this.dataArray.length;n++)e+=this.dataArray[n];const t=e/this.dataArray.length;return Math.min(t/95,1)}}class Ll{constructor(){this.cursorDot=null,this.cursorRing=null,this.cursorText=null,this.pos={x:-100,y:-100},this.target={x:-100,y:-100},this.hasMoved=!1,this.isHovered=!1,this.hoverText="",this.init(),this.bindEvents(),this.animate()}init(){this.cursorDot=document.createElement("div"),this.cursorDot.className="custom-cursor-dot",this.cursorDot.style.opacity="0",this.cursorRing=document.createElement("div"),this.cursorRing.className="custom-cursor-ring",this.cursorRing.style.opacity="0",this.cursorText=document.createElement("span"),this.cursorText.className="custom-cursor-text",this.cursorRing.appendChild(this.cursorText),document.body.appendChild(this.cursorDot),document.body.appendChild(this.cursorRing)}bindEvents(){window.addEventListener("mousemove",e=>{this.target.x=e.clientX,this.target.y=e.clientY,this.hasMoved||(this.pos.x=e.clientX,this.pos.y=e.clientY,this.hasMoved=!0,this.cursorDot.style.opacity="1",this.cursorRing.style.opacity="1"),this.cursorDot.style.transform=`translate3d(${e.clientX}px, ${e.clientY}px, 0)`},{passive:!0}),document.addEventListener("mouseleave",()=>{this.cursorDot.style.opacity="0",this.cursorRing.style.opacity="0"}),document.addEventListener("mouseenter",()=>{this.hasMoved&&(this.cursorDot.style.opacity="1",this.cursorRing.style.opacity="1")}),document.addEventListener("mouseover",e=>{const t=e.target.closest("[data-cursor]");t&&(this.isHovered=!0,t.getAttribute("data-cursor")==="view"?(this.cursorRing.classList.add("cursor-view"),this.cursorText.textContent="EXPLORE"):(this.cursorRing.classList.add("cursor-hover"),this.cursorText.textContent=""))}),document.addEventListener("mouseout",e=>{e.target.closest("[data-cursor]")&&(this.isHovered=!1,this.cursorRing.classList.remove("cursor-hover","cursor-view"),this.cursorText.textContent="")}),document.addEventListener("mousedown",()=>{this.cursorRing.classList.add("cursor-click")}),document.addEventListener("mouseup",()=>{this.cursorRing.classList.remove("cursor-click")})}animate(){if(requestAnimationFrame(()=>this.animate()),!this.hasMoved)return;const e=this.target.x-this.pos.x,t=this.target.y-this.pos.y,s=e*e+t*t>8e3?.6:.42;this.pos.x+=e*s,this.pos.y+=t*s,this.cursorRing.style.transform=`translate3d(${this.pos.x.toFixed(2)}px, ${this.pos.y.toFixed(2)}px, 0)`}}class Dl{constructor(e){this.canvas=e,this.ctx=this.canvas.getContext("2d",{alpha:!0}),this.particles=[],this.lastMouse={x:window.innerWidth/2,y:window.innerHeight/2},this.colorPhase=0,this.palette=[{r:37,g:99,b:235},{r:30,g:64,b:175},{r:59,g:130,b:246},{r:14,g:165,b:233},{r:96,g:165,b:250}],this.init(),this.setupEventListeners(),this.animate()}init(){this.resize()}resize(){this.canvas.width=window.innerWidth*Math.min(window.devicePixelRatio,2),this.canvas.height=window.innerHeight*Math.min(window.devicePixelRatio,2),this.canvas.style.width=`${window.innerWidth}px`,this.canvas.style.height=`${window.innerHeight}px`,this.ctx.scale(Math.min(window.devicePixelRatio,2),Math.min(window.devicePixelRatio,2))}setupEventListeners(){window.addEventListener("resize",()=>this.resize()),window.addEventListener("mousemove",e=>{const t=e.clientX,n=e.clientY,s=t-this.lastMouse.x,a=n-this.lastMouse.y,r=Math.sqrt(s*s+a*a),o=Math.max(1,Math.min(Math.floor(r/8),8));for(let l=0;l<o;l++){const c=l/o,h=this.lastMouse.x+s*c,d=this.lastMouse.y+a*c;this.addWatercolorDrop(h,d,r)}this.lastMouse.x=t,this.lastMouse.y=n}),window.addEventListener("touchmove",e=>{if(e.touches.length>0){const t=e.touches[0];this.addWatercolorDrop(t.clientX,t.clientY,15)}},{passive:!0})}addWatercolorDrop(e,t,n){this.colorPhase=(this.colorPhase+.08)%this.palette.length;const s=Math.floor(this.colorPhase),a=(s+1)%this.palette.length,r=this.colorPhase-s,o=this.palette[s],l=this.palette[a],c=Math.round(o.r+(l.r-o.r)*r),h=Math.round(o.g+(l.g-o.g)*r),d=Math.round(o.b+(l.b-o.b)*r),u=Math.random()*22+18+Math.min(n*.4,25),f=u*(Math.random()*1.8+2.2);if(this.particles.push({x:e+(Math.random()-.5)*8,y:t+(Math.random()-.5)*8,radius:u,maxRadius:f,growthRate:Math.random()*.9+.8,color:{r:c,g:h,b:d},alpha:Math.random()*.08+.22,decay:Math.random()*.007+.008}),Math.random()<.28){const g=Math.random()*Math.PI*2,x=Math.random()*35+20;this.particles.push({x:e+Math.cos(g)*x,y:t+Math.sin(g)*x,radius:Math.random()*6+3,maxRadius:Math.random()*14+8,growthRate:.6,color:{r:c,g:h,b:d},alpha:Math.random()*.06+.12,decay:.012})}this.particles.length>180&&this.particles.splice(0,this.particles.length-180)}animate(){requestAnimationFrame(()=>this.animate()),this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight),this.ctx.globalCompositeOperation="multiply";for(let e=this.particles.length-1;e>=0;e--){const t=this.particles[e];if(t.radius<t.maxRadius&&(t.radius+=t.growthRate),t.alpha-=t.decay,t.alpha<=.005){this.particles.splice(e,1);continue}const n=this.ctx.createRadialGradient(t.x,t.y,t.radius*.1,t.x,t.y,t.radius);n.addColorStop(0,`rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${t.alpha*.9})`),n.addColorStop(.55,`rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${t.alpha*.45})`),n.addColorStop(1,`rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, 0)`),this.ctx.fillStyle=n,this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.fill()}}}class Il{constructor(e,t,n){this.container=e,this.soundEngine=t,this.onNavigate=n,this.activeRoute="home",this.isSoundOn=!0,this.render(),this.bindEvents(),this.listenToSoundState()}render(){this.container.innerHTML=`
      <nav class="lusion-nav-bar" id="mainNav">
        <!-- Brand Identity -->
        <div class="nav-brand" id="brandLogo" data-cursor="hover">
          <span class="brand-name">ADRIAN</span>
          <span class="brand-divider">/</span>
          <span class="brand-tag">EDITING AUDIO &amp; VIDEO</span>
        </div>

        <!-- Center Glass Navigation Pill -->
        <div class="nav-center-pill">
          <button class="nav-item ${this.activeRoute==="home"?"active":""}" data-route="home" data-cursor="hover">
            HOME
          </button>
          <button class="nav-item ${this.activeRoute==="materi"?"active":""}" data-route="materi" data-cursor="hover">
            SILABUS
          </button>
          <button class="nav-item ${this.activeRoute==="about"?"active":""}" data-route="about" data-cursor="hover">
            ABOUT
          </button>
          <a href="/kumpul-tugas" class="nav-item ${this.activeRoute==="kumpul-tugas"?"active":""}" data-route="kumpul-tugas" data-cursor="hover" style="text-decoration:none;display:inline-flex;align-items:center;">
            KUMPUL TUGAS
          </a>
        </div>

        <!-- Right Controls: Audio Toggle & Status -->
        <div class="nav-right-actions">
          <button class="audio-toggle-btn active" id="btnAudioToggle" data-cursor="hover" title="Klik untuk mematikan / menghidupkan BGM">
            <div class="eq-bars-icon playing" id="eqIcon">
              <span class="bar bar-1"></span>
              <span class="bar bar-2"></span>
              <span class="bar bar-3"></span>
              <span class="bar bar-4"></span>
            </div>
            <span class="audio-label" id="audioLabel">BGM: ON</span>
          </button>
        </div>
      </nav>
    `}listenToSoundState(){this.soundEngine&&typeof this.soundEngine.onStateChange=="function"&&this.soundEngine.onStateChange(({isPlaying:e})=>{this.updateAudioButtonState(e)})}updateAudioButtonState(e){const t=document.getElementById("btnAudioToggle"),n=document.getElementById("eqIcon"),s=document.getElementById("audioLabel");!t||!n||!s||(this.isSoundOn=e,e?(n.classList.add("playing"),s.textContent="BGM: ON",t.classList.add("active")):(n.classList.remove("playing"),s.textContent="BGM: OFF",t.classList.remove("active")))}bindEvents(){const e=document.getElementById("brandLogo");e&&e.addEventListener("click",()=>{this.soundEngine.playWhoosh(350,90),this.setActiveRoute("home"),this.onNavigate("home")}),this.container.querySelectorAll(".nav-item").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-route");this.soundEngine.playTick(950),a==="kumpul-tugas"?(window.location.href="/kumpul-tugas"):(this.setActiveRoute(a),this.onNavigate(a))})});const n=document.getElementById("btnAudioToggle");n&&n.addEventListener("click",()=>{const s=this.soundEngine.toggleSound();this.updateAudioButtonState(s)})}setActiveRoute(e){this.activeRoute=e,this.container.querySelectorAll(".nav-item").forEach(n=>{n.getAttribute("data-route")===e?n.classList.add("active"):n.classList.remove("active")})}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qa="170",kl=0,Er=1,Ul=2,Do=1,Nl=2,Zt=3,xn=0,bt=1,Qt=2,vn=0,Qn=1,sa=2,wr=3,Tr=4,Fl=5,Cn=100,Bl=101,Ol=102,zl=103,Gl=104,Hl=200,Vl=201,Wl=202,Xl=203,aa=204,ra=205,ql=206,Kl=207,Yl=208,$l=209,jl=210,Jl=211,Zl=212,Ql=213,ec=214,oa=0,la=1,ca=2,ni=3,ha=4,ua=5,da=6,pa=7,Io=0,tc=1,nc=2,_n=0,ic=1,sc=2,ac=3,Ka=4,rc=5,oc=6,lc=7,ko=300,ii=301,si=302,fa=303,ma=304,gs=306,ga=1e3,Dn=1001,va=1002,zt=1003,cc=1004,Fi=1005,Vt=1006,bs=1007,In=1008,sn=1009,Uo=1010,No=1011,Ci=1012,Ya=1013,kn=1014,en=1015,Li=1016,$a=1017,ja=1018,ai=1020,Fo=35902,Bo=1021,Oo=1022,Ot=1023,zo=1024,Go=1025,ei=1026,ri=1027,Ho=1028,Ja=1029,Vo=1030,Za=1031,Qa=1033,os=33776,ls=33777,cs=33778,hs=33779,_a=35840,xa=35841,Ma=35842,Sa=35843,ya=36196,ba=37492,Ea=37496,wa=37808,Ta=37809,Aa=37810,Ra=37811,Ca=37812,Pa=37813,La=37814,Da=37815,Ia=37816,ka=37817,Ua=37818,Na=37819,Fa=37820,Ba=37821,us=36492,Oa=36494,za=36495,Wo=36283,Ga=36284,Ha=36285,Va=36286,hc=3200,uc=3201,Xo=0,dc=1,gn="",Lt="srgb",li="srgb-linear",vs="linear",$e="srgb",Fn=7680,Ar=519,pc=512,fc=513,mc=514,qo=515,gc=516,vc=517,_c=518,xc=519,Rr=35044,Cr="300 es",tn=2e3,ps=2001;class ci{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Pr=1234567;const bi=Math.PI/180,Pi=180/Math.PI;function hi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ft[i&255]+ft[i>>8&255]+ft[i>>16&255]+ft[i>>24&255]+"-"+ft[e&255]+ft[e>>8&255]+"-"+ft[e>>16&15|64]+ft[e>>24&255]+"-"+ft[t&63|128]+ft[t>>8&255]+"-"+ft[t>>16&255]+ft[t>>24&255]+ft[n&255]+ft[n>>8&255]+ft[n>>16&255]+ft[n>>24&255]).toLowerCase()}function ht(i,e,t){return Math.max(e,Math.min(t,i))}function er(i,e){return(i%e+e)%e}function Mc(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Sc(i,e,t){return i!==e?(t-i)/(e-i):0}function Ei(i,e,t){return(1-t)*i+t*e}function yc(i,e,t,n){return Ei(i,e,1-Math.exp(-t*n))}function bc(i,e=1){return e-Math.abs(er(i,e*2)-e)}function Ec(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function wc(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Tc(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Ac(i,e){return i+Math.random()*(e-i)}function Rc(i){return i*(.5-Math.random())}function Cc(i){i!==void 0&&(Pr=i);let e=Pr+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Pc(i){return i*bi}function Lc(i){return i*Pi}function Dc(i){return(i&i-1)===0&&i!==0}function Ic(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function kc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Uc(i,e,t,n,s){const a=Math.cos,r=Math.sin,o=a(t/2),l=r(t/2),c=a((e+n)/2),h=r((e+n)/2),d=a((e-n)/2),u=r((e-n)/2),f=a((n-e)/2),g=r((n-e)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Jn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _t(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Nc={DEG2RAD:bi,RAD2DEG:Pi,generateUUID:hi,clamp:ht,euclideanModulo:er,mapLinear:Mc,inverseLerp:Sc,lerp:Ei,damp:yc,pingpong:bc,smoothstep:Ec,smootherstep:wc,randInt:Tc,randFloat:Ac,randFloatSpread:Rc,seededRandom:Cc,degToRad:Pc,radToDeg:Lc,isPowerOfTwo:Dc,ceilPowerOfTwo:Ic,floorPowerOfTwo:kc,setQuaternionFromProperEuler:Uc,normalize:_t,denormalize:Jn};class Se{constructor(e=0,t=0){Se.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*n-r*s+e.x,this.y=a*s+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Le{constructor(e,t,n,s,a,r,o,l,c){Le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,l,c)}set(e,t,n,s,a,r,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],x=s[0],m=s[3],p=s[6],E=s[1],v=s[4],_=s[7],L=s[2],A=s[5],R=s[8];return a[0]=r*x+o*E+l*L,a[3]=r*m+o*v+l*A,a[6]=r*p+o*_+l*R,a[1]=c*x+h*E+d*L,a[4]=c*m+h*v+d*A,a[7]=c*p+h*_+d*R,a[2]=u*x+f*E+g*L,a[5]=u*m+f*v+g*A,a[8]=u*p+f*_+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*r*h-t*o*c-n*a*h+n*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*r-o*c,u=o*l-h*a,f=c*a-r*l,g=t*d+n*u+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(s*c-h*n)*x,e[2]=(o*n-s*r)*x,e[3]=u*x,e[4]=(h*t-s*l)*x,e[5]=(s*a-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(r*t-n*a)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Es.makeScale(e,t)),this}rotate(e){return this.premultiply(Es.makeRotation(-e)),this}translate(e,t){return this.premultiply(Es.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Es=new Le;function Ko(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function fs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Fc(){const i=fs("canvas");return i.style.display="block",i}const Lr={};function Mi(i){i in Lr||(Lr[i]=!0,console.warn(i))}function Bc(i,e,t){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}function Oc(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function zc(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const He={enabled:!0,workingColorSpace:li,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===$e&&(i.r=nn(i.r),i.g=nn(i.g),i.b=nn(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===$e&&(i.r=ti(i.r),i.g=ti(i.g),i.b=ti(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===gn?vs:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ti(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Dr=[.64,.33,.3,.6,.15,.06],Ir=[.2126,.7152,.0722],kr=[.3127,.329],Ur=new Le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Nr=new Le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);He.define({[li]:{primaries:Dr,whitePoint:kr,transfer:vs,toXYZ:Ur,fromXYZ:Nr,luminanceCoefficients:Ir,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:Dr,whitePoint:kr,transfer:$e,toXYZ:Ur,fromXYZ:Nr,luminanceCoefficients:Ir,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}});let Bn;class Gc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Bn===void 0&&(Bn=fs("canvas")),Bn.width=e.width,Bn.height=e.height;const n=Bn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Bn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=nn(a[r]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(nn(t[n]/255)*255):t[n]=nn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Hc=0;class Yo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hc++}),this.uuid=hi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(ws(s[r].image)):a.push(ws(s[r]))}else a=ws(s);n.url=a}return t||(e.images[this.uuid]=n),n}}function ws(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Vc=0;class Et extends ci{constructor(e=Et.DEFAULT_IMAGE,t=Et.DEFAULT_MAPPING,n=Dn,s=Dn,a=Vt,r=In,o=Ot,l=sn,c=Et.DEFAULT_ANISOTROPY,h=gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vc++}),this.uuid=hi(),this.name="",this.source=new Yo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Se(0,0),this.repeat=new Se(1,1),this.center=new Se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ko)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ga:e.x=e.x-Math.floor(e.x);break;case Dn:e.x=e.x<0?0:1;break;case va:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ga:e.y=e.y-Math.floor(e.y);break;case Dn:e.y=e.y<0?0:1;break;case va:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Et.DEFAULT_IMAGE=null;Et.DEFAULT_MAPPING=ko;Et.DEFAULT_ANISOTROPY=1;class je{constructor(e=0,t=0,n=0,s=1){je.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*n+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,a;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,_=(f+1)/2,L=(p+1)/2,A=(h+u)/4,R=(d+x)/4,C=(g+m)/4;return v>_&&v>L?v<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(v),s=A/n,a=R/n):_>L?_<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(_),n=A/s,a=C/s):L<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(L),n=R/a,s=C/a),this.set(n,s,a,t),this}let E=Math.sqrt((m-g)*(m-g)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-x)/E,this.z=(u-h)/E,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Wc extends ci{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new je(0,0,e,t),this.scissorTest=!1,this.viewport=new je(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Et(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Yo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Un extends Wc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class $o extends Et{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xc extends Et{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Di{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,a,r,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=a[r+0],f=a[r+1],g=a[r+2],x=a[r+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=x;return}if(d!==x||l!==u||c!==f||h!==g){let m=1-o;const p=l*u+c*f+h*g+d*x,E=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const L=Math.sqrt(v),A=Math.atan2(L,p*E);m=Math.sin(m*A)/L,o=Math.sin(o*A)/L}const _=o*E;if(l=l*m+u*_,c=c*m+f*_,h=h*m+g*_,d=d*m+x*_,m===1-o){const L=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=L,c*=L,h*=L,d*=L}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,a,r){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=a[r],u=a[r+1],f=a[r+2],g=a[r+3];return e[t]=o*g+h*d+l*f-c*u,e[t+1]=l*g+h*u+c*d-o*f,e[t+2]=c*g+h*f+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(a/2),u=l(n/2),f=l(s/2),g=l(a/2);switch(r){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(a-c)*f,this._z=(r-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(a+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(a-c)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(r-s)/f,this._x=(a+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-n*c,this._z=a*h+r*c+n*l-s*o,this._w=r*h-n*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*e._w+n*e._x+s*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*r+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*a+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=r*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=a*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fr.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fr.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*s,this.y=a[1]*t+a[4]*n+a[7]*s,this.z=a[2]*t+a[5]*n+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*n),h=2*(o*t-a*s),d=2*(a*n-r*t);return this.x=t+l*c+r*d-o*h,this.y=n+l*h+o*c-a*d,this.z=s+l*d+a*h-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s,this.y=a[1]*t+a[5]*n+a[9]*s,this.z=a[2]*t+a[6]*n+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-n*l,this.z=n*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ts.copy(this).projectOnVector(e),this.sub(Ts)}reflect(e){return this.sub(Ts.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ts=new P,Fr=new Di;class Ii{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ut.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ut.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ut.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,Ut):Ut.fromBufferAttribute(a,r),Ut.applyMatrix4(e.matrixWorld),this.expandByPoint(Ut);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Bi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bi.copy(n.boundingBox)),Bi.applyMatrix4(e.matrixWorld),this.union(Bi)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ut),Ut.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(mi),Oi.subVectors(this.max,mi),On.subVectors(e.a,mi),zn.subVectors(e.b,mi),Gn.subVectors(e.c,mi),hn.subVectors(zn,On),un.subVectors(Gn,zn),Sn.subVectors(On,Gn);let t=[0,-hn.z,hn.y,0,-un.z,un.y,0,-Sn.z,Sn.y,hn.z,0,-hn.x,un.z,0,-un.x,Sn.z,0,-Sn.x,-hn.y,hn.x,0,-un.y,un.x,0,-Sn.y,Sn.x,0];return!As(t,On,zn,Gn,Oi)||(t=[1,0,0,0,1,0,0,0,1],!As(t,On,zn,Gn,Oi))?!1:(zi.crossVectors(hn,un),t=[zi.x,zi.y,zi.z],As(t,On,zn,Gn,Oi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ut).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ut).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Kt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Kt=[new P,new P,new P,new P,new P,new P,new P,new P],Ut=new P,Bi=new Ii,On=new P,zn=new P,Gn=new P,hn=new P,un=new P,Sn=new P,mi=new P,Oi=new P,zi=new P,yn=new P;function As(i,e,t,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){yn.fromArray(i,a);const o=s.x*Math.abs(yn.x)+s.y*Math.abs(yn.y)+s.z*Math.abs(yn.z),l=e.dot(yn),c=t.dot(yn),h=n.dot(yn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const qc=new Ii,gi=new P,Rs=new P;class _s{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):qc.setFromPoints(e).getCenter(n);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gi.subVectors(e,this.center);const t=gi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(gi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gi.copy(e.center).add(Rs)),this.expandByPoint(gi.copy(e.center).sub(Rs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Yt=new P,Cs=new P,Gi=new P,dn=new P,Ps=new P,Hi=new P,Ls=new P;class jo{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Yt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yt.copy(this.origin).addScaledVector(this.direction,t),Yt.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Cs.copy(e).add(t).multiplyScalar(.5),Gi.copy(t).sub(e).normalize(),dn.copy(this.origin).sub(Cs);const a=e.distanceTo(t)*.5,r=-this.direction.dot(Gi),o=dn.dot(this.direction),l=-dn.dot(Gi),c=dn.lengthSq(),h=Math.abs(1-r*r);let d,u,f,g;if(h>0)if(d=r*l-o,u=r*o-l,g=a*h,d>=0)if(u>=-g)if(u<=g){const x=1/h;d*=x,u*=x,f=d*(d+r*u+2*o)+u*(r*d+u+2*l)+c}else u=a,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*l)+c;else u=-a,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-r*a+o)),u=d>0?-a:Math.min(Math.max(-a,-l),a),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-a,-l),a),f=u*(u+2*l)+c):(d=Math.max(0,-(r*a+o)),u=d>0?a:Math.min(Math.max(-a,-l),a),f=-d*d+u*(u+2*l)+c);else u=r>0?-a:a,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Cs).addScaledVector(Gi,u),f}intersectSphere(e,t){Yt.subVectors(e.center,this.origin);const n=Yt.dot(this.direction),s=Yt.dot(Yt)-n*n,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,l=n+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,a,r,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(a=(e.min.y-u.y)*h,r=(e.max.y-u.y)*h):(a=(e.max.y-u.y)*h,r=(e.min.y-u.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Yt)!==null}intersectTriangle(e,t,n,s,a){Ps.subVectors(t,e),Hi.subVectors(n,e),Ls.crossVectors(Ps,Hi);let r=this.direction.dot(Ls),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;dn.subVectors(this.origin,e);const l=o*this.direction.dot(Hi.crossVectors(dn,Hi));if(l<0)return null;const c=o*this.direction.dot(Ps.cross(dn));if(c<0||l+c>r)return null;const h=-o*dn.dot(Ls);return h<0?null:this.at(h/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class nt{constructor(e,t,n,s,a,r,o,l,c,h,d,u,f,g,x,m){nt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,l,c,h,d,u,f,g,x,m)}set(e,t,n,s,a,r,o,l,c,h,d,u,f,g,x,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new nt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Hn.setFromMatrixColumn(e,0).length(),a=1/Hn.setFromMatrixColumn(e,1).length(),r=1/Hn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,a=e.z,r=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),d=Math.sin(a);if(e.order==="XYZ"){const u=r*h,f=r*d,g=o*h,x=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=u-x*c,t[9]=-o*l,t[2]=x-u*c,t[6]=g+f*c,t[10]=r*l}else if(e.order==="YXZ"){const u=l*h,f=l*d,g=c*h,x=c*d;t[0]=u+x*o,t[4]=g*o-f,t[8]=r*c,t[1]=r*d,t[5]=r*h,t[9]=-o,t[2]=f*o-g,t[6]=x+u*o,t[10]=r*l}else if(e.order==="ZXY"){const u=l*h,f=l*d,g=c*h,x=c*d;t[0]=u-x*o,t[4]=-r*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=r*h,t[9]=x-u*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const u=r*h,f=r*d,g=o*h,x=o*d;t[0]=l*h,t[4]=g*c-f,t[8]=u*c+x,t[1]=l*d,t[5]=x*c+u,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const u=r*l,f=r*c,g=o*l,x=o*c;t[0]=l*h,t[4]=x-u*d,t[8]=g*d+f,t[1]=d,t[5]=r*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*d+g,t[10]=u-x*d}else if(e.order==="XZY"){const u=r*l,f=r*c,g=o*l,x=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+x,t[5]=r*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Kc,e,Yc)}lookAt(e,t,n){const s=this.elements;return Tt.subVectors(e,t),Tt.lengthSq()===0&&(Tt.z=1),Tt.normalize(),pn.crossVectors(n,Tt),pn.lengthSq()===0&&(Math.abs(n.z)===1?Tt.x+=1e-4:Tt.z+=1e-4,Tt.normalize(),pn.crossVectors(n,Tt)),pn.normalize(),Vi.crossVectors(Tt,pn),s[0]=pn.x,s[4]=Vi.x,s[8]=Tt.x,s[1]=pn.y,s[5]=Vi.y,s[9]=Tt.y,s[2]=pn.z,s[6]=Vi.z,s[10]=Tt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],E=n[3],v=n[7],_=n[11],L=n[15],A=s[0],R=s[4],C=s[8],b=s[12],S=s[1],T=s[5],F=s[9],N=s[13],W=s[2],X=s[6],H=s[10],J=s[14],G=s[3],te=s[7],le=s[11],me=s[15];return a[0]=r*A+o*S+l*W+c*G,a[4]=r*R+o*T+l*X+c*te,a[8]=r*C+o*F+l*H+c*le,a[12]=r*b+o*N+l*J+c*me,a[1]=h*A+d*S+u*W+f*G,a[5]=h*R+d*T+u*X+f*te,a[9]=h*C+d*F+u*H+f*le,a[13]=h*b+d*N+u*J+f*me,a[2]=g*A+x*S+m*W+p*G,a[6]=g*R+x*T+m*X+p*te,a[10]=g*C+x*F+m*H+p*le,a[14]=g*b+x*N+m*J+p*me,a[3]=E*A+v*S+_*W+L*G,a[7]=E*R+v*T+_*X+L*te,a[11]=E*C+v*F+_*H+L*le,a[15]=E*b+v*N+_*J+L*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+a*l*d-s*c*d-a*o*u+n*c*u+s*o*f-n*l*f)+x*(+t*l*f-t*c*u+a*r*u-s*r*f+s*c*h-a*l*h)+m*(+t*c*d-t*o*f-a*r*d+n*r*f+a*o*h-n*c*h)+p*(-s*o*h-t*l*d+t*o*u+s*r*d-n*r*u+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],E=d*m*c-x*u*c+x*l*f-o*m*f-d*l*p+o*u*p,v=g*u*c-h*m*c-g*l*f+r*m*f+h*l*p-r*u*p,_=h*x*c-g*d*c+g*o*f-r*x*f-h*o*p+r*d*p,L=g*d*l-h*x*l-g*o*u+r*x*u+h*o*m-r*d*m,A=t*E+n*v+s*_+a*L;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=E*R,e[1]=(x*u*a-d*m*a-x*s*f+n*m*f+d*s*p-n*u*p)*R,e[2]=(o*m*a-x*l*a+x*s*c-n*m*c-o*s*p+n*l*p)*R,e[3]=(d*l*a-o*u*a-d*s*c+n*u*c+o*s*f-n*l*f)*R,e[4]=v*R,e[5]=(h*m*a-g*u*a+g*s*f-t*m*f-h*s*p+t*u*p)*R,e[6]=(g*l*a-r*m*a-g*s*c+t*m*c+r*s*p-t*l*p)*R,e[7]=(r*u*a-h*l*a+h*s*c-t*u*c-r*s*f+t*l*f)*R,e[8]=_*R,e[9]=(g*d*a-h*x*a-g*n*f+t*x*f+h*n*p-t*d*p)*R,e[10]=(r*x*a-g*o*a+g*n*c-t*x*c-r*n*p+t*o*p)*R,e[11]=(h*o*a-r*d*a-h*n*c+t*d*c+r*n*f-t*o*f)*R,e[12]=L*R,e[13]=(h*x*s-g*d*s+g*n*u-t*x*u-h*n*m+t*d*m)*R,e[14]=(g*o*s-r*x*s-g*n*l+t*x*l+r*n*m-t*o*m)*R,e[15]=(r*d*s-h*o*s+h*n*l-t*d*l-r*n*u+t*o*u)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,a=e.z;return t[0]*=n,t[4]*=s,t[8]*=a,t[1]*=n,t[5]*=s,t[9]*=a,t[2]*=n,t[6]*=s,t[10]*=a,t[3]*=n,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),a=1-n,r=e.x,o=e.y,l=e.z,c=a*r,h=a*o;return this.set(c*r+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,a,r){return this.set(1,n,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,h=r+r,d=o+o,u=a*c,f=a*h,g=a*d,x=r*h,m=r*d,p=o*d,E=l*c,v=l*h,_=l*d,L=n.x,A=n.y,R=n.z;return s[0]=(1-(x+p))*L,s[1]=(f+_)*L,s[2]=(g-v)*L,s[3]=0,s[4]=(f-_)*A,s[5]=(1-(u+p))*A,s[6]=(m+E)*A,s[7]=0,s[8]=(g+v)*R,s[9]=(m-E)*R,s[10]=(1-(u+x))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let a=Hn.set(s[0],s[1],s[2]).length();const r=Hn.set(s[4],s[5],s[6]).length(),o=Hn.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],Nt.copy(this);const c=1/a,h=1/r,d=1/o;return Nt.elements[0]*=c,Nt.elements[1]*=c,Nt.elements[2]*=c,Nt.elements[4]*=h,Nt.elements[5]*=h,Nt.elements[6]*=h,Nt.elements[8]*=d,Nt.elements[9]*=d,Nt.elements[10]*=d,t.setFromRotationMatrix(Nt),n.x=a,n.y=r,n.z=o,this}makePerspective(e,t,n,s,a,r,o=tn){const l=this.elements,c=2*a/(t-e),h=2*a/(n-s),d=(t+e)/(t-e),u=(n+s)/(n-s);let f,g;if(o===tn)f=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===ps)f=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,a,r,o=tn){const l=this.elements,c=1/(t-e),h=1/(n-s),d=1/(r-a),u=(t+e)*c,f=(n+s)*h;let g,x;if(o===tn)g=(r+a)*d,x=-2*d;else if(o===ps)g=a*d,x=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Hn=new P,Nt=new nt,Kc=new P(0,0,0),Yc=new P(1,1,1),pn=new P,Vi=new P,Tt=new P,Br=new nt,Or=new Di;class Wt{constructor(e=0,t=0,n=0,s=Wt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,a),this._z=0);break;case"ZXY":this._x=Math.asin(ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ht(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Br.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Br,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Or.setFromEuler(this),this.setFromQuaternion(Or,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Wt.DEFAULT_ORDER="XYZ";class Jo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let $c=0;const zr=new P,Vn=new Di,$t=new nt,Wi=new P,vi=new P,jc=new P,Jc=new Di,Gr=new P(1,0,0),Hr=new P(0,1,0),Vr=new P(0,0,1),Wr={type:"added"},Zc={type:"removed"},Wn={type:"childadded",child:null},Ds={type:"childremoved",child:null};class dt extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$c++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=dt.DEFAULT_UP.clone();const e=new P,t=new Wt,n=new Di,s=new P(1,1,1);function a(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new nt},normalMatrix:{value:new Le}}),this.matrix=new nt,this.matrixWorld=new nt,this.matrixAutoUpdate=dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vn.setFromAxisAngle(e,t),this.quaternion.multiply(Vn),this}rotateOnWorldAxis(e,t){return Vn.setFromAxisAngle(e,t),this.quaternion.premultiply(Vn),this}rotateX(e){return this.rotateOnAxis(Gr,e)}rotateY(e){return this.rotateOnAxis(Hr,e)}rotateZ(e){return this.rotateOnAxis(Vr,e)}translateOnAxis(e,t){return zr.copy(e).applyQuaternion(this.quaternion),this.position.add(zr.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gr,e)}translateY(e){return this.translateOnAxis(Hr,e)}translateZ(e){return this.translateOnAxis(Vr,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($t.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Wi.copy(e):Wi.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),vi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$t.lookAt(vi,Wi,this.up):$t.lookAt(Wi,vi,this.up),this.quaternion.setFromRotationMatrix($t),s&&($t.extractRotation(s.matrixWorld),Vn.setFromRotationMatrix($t),this.quaternion.premultiply(Vn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wr),Wn.child=e,this.dispatchEvent(Wn),Wn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Zc),Ds.child=e,this.dispatchEvent(Ds),Ds.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$t.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$t.multiply(e.parent.matrixWorld)),e.applyMatrix4($t),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wr),Wn.child=e,this.dispatchEvent(Wn),Wn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vi,e,jc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vi,Jc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];a(e.shapes,d)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),h=r(e.images),d=r(e.shapes),u=r(e.skeletons),f=r(e.animations),g=r(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}dt.DEFAULT_UP=new P(0,1,0);dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ft=new P,jt=new P,Is=new P,Jt=new P,Xn=new P,qn=new P,Xr=new P,ks=new P,Us=new P,Ns=new P,Fs=new je,Bs=new je,Os=new je;class Bt{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Ft.subVectors(e,t),s.cross(Ft);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,n,s,a){Ft.subVectors(s,t),jt.subVectors(n,t),Is.subVectors(e,t);const r=Ft.dot(Ft),o=Ft.dot(jt),l=Ft.dot(Is),c=jt.dot(jt),h=jt.dot(Is),d=r*c-o*o;if(d===0)return a.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,g=(r*h-o*l)*u;return a.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Jt)===null?!1:Jt.x>=0&&Jt.y>=0&&Jt.x+Jt.y<=1}static getInterpolation(e,t,n,s,a,r,o,l){return this.getBarycoord(e,t,n,s,Jt)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Jt.x),l.addScaledVector(r,Jt.y),l.addScaledVector(o,Jt.z),l)}static getInterpolatedAttribute(e,t,n,s,a,r){return Fs.setScalar(0),Bs.setScalar(0),Os.setScalar(0),Fs.fromBufferAttribute(e,t),Bs.fromBufferAttribute(e,n),Os.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Fs,a.x),r.addScaledVector(Bs,a.y),r.addScaledVector(Os,a.z),r}static isFrontFacing(e,t,n,s){return Ft.subVectors(n,t),jt.subVectors(e,t),Ft.cross(jt).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ft.subVectors(this.c,this.b),jt.subVectors(this.a,this.b),Ft.cross(jt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Bt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Bt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,a){return Bt.getInterpolation(e,this.a,this.b,this.c,t,n,s,a)}containsPoint(e){return Bt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Bt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,a=this.c;let r,o;Xn.subVectors(s,n),qn.subVectors(a,n),ks.subVectors(e,n);const l=Xn.dot(ks),c=qn.dot(ks);if(l<=0&&c<=0)return t.copy(n);Us.subVectors(e,s);const h=Xn.dot(Us),d=qn.dot(Us);if(h>=0&&d<=h)return t.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return r=l/(l-h),t.copy(n).addScaledVector(Xn,r);Ns.subVectors(e,a);const f=Xn.dot(Ns),g=qn.dot(Ns);if(g>=0&&f<=g)return t.copy(a);const x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(qn,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return Xr.subVectors(a,s),o=(d-h)/(d-h+(f-g)),t.copy(s).addScaledVector(Xr,o);const p=1/(m+x+u);return r=x*p,o=u*p,t.copy(n).addScaledVector(Xn,r).addScaledVector(qn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Zo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fn={h:0,s:0,l:0},Xi={h:0,s:0,l:0};function zs(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ne{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=He.workingColorSpace){return this.r=e,this.g=t,this.b=n,He.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=He.workingColorSpace){if(e=er(e,1),t=ht(t,0,1),n=ht(n,0,1),t===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+t):n+t-n*t,r=2*n-a;this.r=zs(r,a,e+1/3),this.g=zs(r,a,e),this.b=zs(r,a,e-1/3)}return He.toWorkingColorSpace(this,s),this}setStyle(e,t=Lt){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){const n=Zo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=nn(e.r),this.g=nn(e.g),this.b=nn(e.b),this}copyLinearToSRGB(e){return this.r=ti(e.r),this.g=ti(e.g),this.b=ti(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return He.fromWorkingColorSpace(mt.copy(this),e),Math.round(ht(mt.r*255,0,255))*65536+Math.round(ht(mt.g*255,0,255))*256+Math.round(ht(mt.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=He.workingColorSpace){He.fromWorkingColorSpace(mt.copy(this),t);const n=mt.r,s=mt.g,a=mt.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let l,c;const h=(o+r)/2;if(o===r)l=0,c=0;else{const d=r-o;switch(c=h<=.5?d/(r+o):d/(2-r-o),r){case n:l=(s-a)/d+(s<a?6:0);break;case s:l=(a-n)/d+2;break;case a:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=He.workingColorSpace){return He.fromWorkingColorSpace(mt.copy(this),t),e.r=mt.r,e.g=mt.g,e.b=mt.b,e}getStyle(e=Lt){He.fromWorkingColorSpace(mt.copy(this),e);const t=mt.r,n=mt.g,s=mt.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(fn),this.setHSL(fn.h+e,fn.s+t,fn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(fn),e.getHSL(Xi);const n=Ei(fn.h,Xi.h,t),s=Ei(fn.s,Xi.s,t),a=Ei(fn.l,Xi.l,t);return this.setHSL(n,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*s,this.g=a[1]*t+a[4]*n+a[7]*s,this.b=a[2]*t+a[5]*n+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const mt=new Ne;Ne.NAMES=Zo;let Qc=0;class ui extends ci{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qc++}),this.uuid=hi(),this.name="",this.blending=Qn,this.side=xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=aa,this.blendDst=ra,this.blendEquation=Cn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ar,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fn,this.stencilZFail=Fn,this.stencilZPass=Fn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Qn&&(n.blending=this.blending),this.side!==xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==aa&&(n.blendSrc=this.blendSrc),this.blendDst!==ra&&(n.blendDst=this.blendDst),this.blendEquation!==Cn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ni&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ar&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Fn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Fn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class wi extends ui{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.combine=Io,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const rt=new P,qi=new Se;class Rt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Rr,this.updateRanges=[],this.gpuType=en,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)qi.fromBufferAttribute(this,t),qi.applyMatrix3(e),this.setXY(t,qi.x,qi.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.applyMatrix3(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.applyMatrix4(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.applyNormalMatrix(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.transformDirection(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Jn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=_t(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Jn(t,this.array)),t}setX(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Jn(t,this.array)),t}setY(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Jn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Jn(t,this.array)),t}setW(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array),s=_t(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,a){return e*=this.itemSize,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array),s=_t(s,this.array),a=_t(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Rr&&(e.usage=this.usage),e}}class Qo extends Rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class el extends Rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class it extends Rt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let eh=0;const Pt=new nt,Gs=new dt,Kn=new P,At=new Ii,_i=new Ii,ct=new P;class vt extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:eh++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ko(e)?el:Qo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Le().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Pt.makeRotationFromQuaternion(e),this.applyMatrix4(Pt),this}rotateX(e){return Pt.makeRotationX(e),this.applyMatrix4(Pt),this}rotateY(e){return Pt.makeRotationY(e),this.applyMatrix4(Pt),this}rotateZ(e){return Pt.makeRotationZ(e),this.applyMatrix4(Pt),this}translate(e,t,n){return Pt.makeTranslation(e,t,n),this.applyMatrix4(Pt),this}scale(e,t,n){return Pt.makeScale(e,t,n),this.applyMatrix4(Pt),this}lookAt(e){return Gs.lookAt(e),Gs.updateMatrix(),this.applyMatrix4(Gs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Kn).negate(),this.translate(Kn.x,Kn.y,Kn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new it(n,3))}else{for(let n=0,s=t.count;n<s;n++){const a=e[n];t.setXYZ(n,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ii);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const a=t[n];At.setFromBufferAttribute(a),this.morphTargetsRelative?(ct.addVectors(this.boundingBox.min,At.min),this.boundingBox.expandByPoint(ct),ct.addVectors(this.boundingBox.max,At.max),this.boundingBox.expandByPoint(ct)):(this.boundingBox.expandByPoint(At.min),this.boundingBox.expandByPoint(At.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _s);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(At.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];_i.setFromBufferAttribute(o),this.morphTargetsRelative?(ct.addVectors(At.min,_i.min),At.expandByPoint(ct),ct.addVectors(At.max,_i.max),At.expandByPoint(ct)):(At.expandByPoint(_i.min),At.expandByPoint(_i.max))}At.getCenter(n);let s=0;for(let a=0,r=e.count;a<r;a++)ct.fromBufferAttribute(e,a),s=Math.max(s,n.distanceToSquared(ct));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ct.fromBufferAttribute(o,c),l&&(Kn.fromBufferAttribute(e,c),ct.add(Kn)),s=Math.max(s,n.distanceToSquared(ct))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Rt(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new P,l[C]=new P;const c=new P,h=new P,d=new P,u=new Se,f=new Se,g=new Se,x=new P,m=new P;function p(C,b,S){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,S),u.fromBufferAttribute(a,C),f.fromBufferAttribute(a,b),g.fromBufferAttribute(a,S),h.sub(c),d.sub(c),f.sub(u),g.sub(u);const T=1/(f.x*g.y-g.x*f.y);isFinite(T)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(T),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(T),o[C].add(x),o[b].add(x),o[S].add(x),l[C].add(m),l[b].add(m),l[S].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let C=0,b=E.length;C<b;++C){const S=E[C],T=S.start,F=S.count;for(let N=T,W=T+F;N<W;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const v=new P,_=new P,L=new P,A=new P;function R(C){L.fromBufferAttribute(s,C),A.copy(L);const b=o[C];v.copy(b),v.sub(L.multiplyScalar(L.dot(b))).normalize(),_.crossVectors(A,b);const T=_.dot(l[C])<0?-1:1;r.setXYZW(C,v.x,v.y,v.z,T)}for(let C=0,b=E.length;C<b;++C){const S=E[C],T=S.start,F=S.count;for(let N=T,W=T+F;N<W;N+=3)R(e.getX(N+0)),R(e.getX(N+1)),R(e.getX(N+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new P,a=new P,r=new P,o=new P,l=new P,c=new P,h=new P,d=new P;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),x=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),a.fromBufferAttribute(t,x),r.fromBufferAttribute(t,m),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),a.fromBufferAttribute(t,u+1),r.fromBufferAttribute(t,u+2),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ct.fromBufferAttribute(e,t),ct.normalize(),e.setXYZ(t,ct.x,ct.y,ct.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Rt(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new vt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=e(u,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const a=e.morphAttributes;for(const c in a){const h=[],d=a[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,h=r.length;c<h;c++){const d=r[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qr=new nt,bn=new jo,Ki=new _s,Kr=new P,Yi=new P,$i=new P,ji=new P,Hs=new P,Ji=new P,Yr=new P,Zi=new P;class Ae extends dt{constructor(e=new vt,t=new wi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){Ji.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=o[l],d=a[l];h!==0&&(Hs.fromBufferAttribute(d,e),r?Ji.addScaledVector(Hs,h):Ji.addScaledVector(Hs.sub(t),h))}t.add(Ji)}return t}raycast(e,t){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ki.copy(n.boundingSphere),Ki.applyMatrix4(a),bn.copy(e.ray).recast(e.near),!(Ki.containsPoint(bn.origin)===!1&&(bn.intersectSphere(Ki,Kr)===null||bn.origin.distanceToSquared(Kr)>(e.far-e.near)**2))&&(qr.copy(a).invert(),bn.copy(e.ray).applyMatrix4(qr),!(n.boundingBox!==null&&bn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,bn)))}_computeIntersections(e,t,n){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,d=a.attributes.normal,u=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const m=u[g],p=r[m.materialIndex],E=Math.max(m.start,f.start),v=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=E,L=v;_<L;_+=3){const A=o.getX(_),R=o.getX(_+1),C=o.getX(_+2);s=Qi(this,p,e,n,c,h,d,A,R,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const E=o.getX(m),v=o.getX(m+1),_=o.getX(m+2);s=Qi(this,r,e,n,c,h,d,E,v,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,x=u.length;g<x;g++){const m=u[g],p=r[m.materialIndex],E=Math.max(m.start,f.start),v=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=E,L=v;_<L;_+=3){const A=_,R=_+1,C=_+2;s=Qi(this,p,e,n,c,h,d,A,R,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const E=m,v=m+1,_=m+2;s=Qi(this,r,e,n,c,h,d,E,v,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function th(i,e,t,n,s,a,r,o){let l;if(e.side===bt?l=n.intersectTriangle(r,a,s,!0,o):l=n.intersectTriangle(s,a,r,e.side===xn,o),l===null)return null;Zi.copy(o),Zi.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Zi);return c<t.near||c>t.far?null:{distance:c,point:Zi.clone(),object:i}}function Qi(i,e,t,n,s,a,r,o,l,c){i.getVertexPosition(o,Yi),i.getVertexPosition(l,$i),i.getVertexPosition(c,ji);const h=th(i,e,t,n,Yi,$i,ji,Yr);if(h){const d=new P;Bt.getBarycoord(Yr,Yi,$i,ji,d),s&&(h.uv=Bt.getInterpolatedAttribute(s,o,l,c,d,new Se)),a&&(h.uv1=Bt.getInterpolatedAttribute(a,o,l,c,d,new Se)),r&&(h.normal=Bt.getInterpolatedAttribute(r,o,l,c,d,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new P,materialIndex:0};Bt.getNormal(Yi,$i,ji,u.normal),h.face=u,h.barycoord=d}return h}class Dt extends vt{constructor(e=1,t=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,r,a,0),g("z","y","x",1,-1,n,t,-e,r,a,1),g("x","z","y",1,1,e,n,t,s,r,2),g("x","z","y",1,-1,e,n,-t,s,r,3),g("x","y","z",1,-1,e,t,n,s,a,4),g("x","y","z",-1,-1,e,t,-n,s,a,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(d,2));function g(x,m,p,E,v,_,L,A,R,C,b){const S=_/R,T=L/C,F=_/2,N=L/2,W=A/2,X=R+1,H=C+1;let J=0,G=0;const te=new P;for(let le=0;le<H;le++){const me=le*T-N;for(let Ue=0;Ue<X;Ue++){const Ve=Ue*S-F;te[x]=Ve*E,te[m]=me*v,te[p]=W,c.push(te.x,te.y,te.z),te[x]=0,te[m]=0,te[p]=A>0?1:-1,h.push(te.x,te.y,te.z),d.push(Ue/R),d.push(1-le/C),J+=1}}for(let le=0;le<C;le++)for(let me=0;me<R;me++){const Ue=u+me+X*le,Ve=u+me+X*(le+1),K=u+(me+1)+X*(le+1),Z=u+(me+1)+X*le;l.push(Ue,Ve,Z),l.push(Ve,K,Z),G+=6}o.addGroup(f,G,b),f+=G,u+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function oi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function xt(i){const e={};for(let t=0;t<i.length;t++){const n=oi(i[t]);for(const s in n)e[s]=n[s]}return e}function nh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function tl(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:He.workingColorSpace}const ih={clone:oi,merge:xt};var sh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ah=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class an extends ui{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sh,this.fragmentShader=ah,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=oi(e.uniforms),this.uniformsGroups=nh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class nl extends dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new nt,this.projectionMatrix=new nt,this.projectionMatrixInverse=new nt,this.coordinateSystem=tn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const mn=new P,$r=new Se,jr=new Se;class yt extends nl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Pi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(bi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Pi*2*Math.atan(Math.tan(bi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){mn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(mn.x,mn.y).multiplyScalar(-e/mn.z),mn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(mn.x,mn.y).multiplyScalar(-e/mn.z)}getViewSize(e,t){return this.getViewBounds(e,$r,jr),t.subVectors(jr,$r)}setViewOffset(e,t,n,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(bi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*n/c,s*=r.width/l,n*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Yn=-90,$n=1;class rh extends dt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new yt(Yn,$n,e,t);s.layers=this.layers,this.add(s);const a=new yt(Yn,$n,e,t);a.layers=this.layers,this.add(a);const r=new yt(Yn,$n,e,t);r.layers=this.layers,this.add(r);const o=new yt(Yn,$n,e,t);o.layers=this.layers,this.add(o);const l=new yt(Yn,$n,e,t);l.layers=this.layers,this.add(l);const c=new yt(Yn,$n,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===tn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ps)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,a),e.setRenderTarget(n,1,s),e.render(t,r),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class il extends Et{constructor(e,t,n,s,a,r,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:ii,super(e,t,n,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class oh extends Un{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new il(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Vt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Dt(5,5,5),a=new an({name:"CubemapFromEquirect",uniforms:oi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:bt,blending:vn});a.uniforms.tEquirect.value=t;const r=new Ae(s,a),o=t.minFilter;return t.minFilter===In&&(t.minFilter=Vt),new rh(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t,n,s){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,s);e.setRenderTarget(a)}}const Vs=new P,lh=new P,ch=new Le;class An{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Vs.subVectors(n,t).cross(lh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Vs),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||ch.getNormalMatrix(e),s=this.coplanarPoint(Vs).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const En=new _s,es=new P;class tr{constructor(e=new An,t=new An,n=new An,s=new An,a=new An,r=new An){this.planes=[e,t,n,s,a,r]}set(e,t,n,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=tn){const n=this.planes,s=e.elements,a=s[0],r=s[1],o=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],f=s[8],g=s[9],x=s[10],m=s[11],p=s[12],E=s[13],v=s[14],_=s[15];if(n[0].setComponents(l-a,u-c,m-f,_-p).normalize(),n[1].setComponents(l+a,u+c,m+f,_+p).normalize(),n[2].setComponents(l+r,u+h,m+g,_+E).normalize(),n[3].setComponents(l-r,u-h,m-g,_-E).normalize(),n[4].setComponents(l-o,u-d,m-x,_-v).normalize(),t===tn)n[5].setComponents(l+o,u+d,m+x,_+v).normalize();else if(t===ps)n[5].setComponents(o,d,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),En.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),En.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(En)}intersectsSprite(e){return En.center.set(0,0,0),En.radius=.7071067811865476,En.applyMatrix4(e.matrixWorld),this.intersectsSphere(En)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(es.x=s.normal.x>0?e.max.x:e.min.x,es.y=s.normal.y>0?e.max.y:e.min.y,es.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(es)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sl(){let i=null,e=!1,t=null,n=null;function s(a,r){t(a,r),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function hh(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],x=d[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const x=d[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}class xs extends vt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){const E=p*u-r;for(let v=0;v<c;v++){const _=v*d-a;g.push(_,-E,0),x.push(0,0,1),m.push(v/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let E=0;E<o;E++){const v=E+c*p,_=E+c*(p+1),L=E+1+c*(p+1),A=E+1+c*p;f.push(v,_,A),f.push(_,L,A)}this.setIndex(f),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(x,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xs(e.width,e.height,e.widthSegments,e.heightSegments)}}var uh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ph=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_h=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Mh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Sh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Eh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,wh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Th=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ah=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ch=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ph=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Lh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ih=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,kh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Uh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Nh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Fh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Oh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Wh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,qh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Yh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$h=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,eu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,iu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,su=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,au=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ru=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ou=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,uu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,du=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mu=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_u=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Mu=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Su=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Eu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tu=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Au=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ru=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Pu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Du=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Iu=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ku=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Uu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ou=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,zu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xu=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ku=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Yu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,$u=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ju=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ju=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qu=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ed=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,td=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,nd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,id=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ad=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,rd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,od=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ld=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const hd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ud=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,md=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,vd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,_d=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Md=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Sd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ed=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,wd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Td=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ad=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pd=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ld=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Id=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kd=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ud=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nd=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Od=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zd=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Hd=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ke={alphahash_fragment:uh,alphahash_pars_fragment:dh,alphamap_fragment:ph,alphamap_pars_fragment:fh,alphatest_fragment:mh,alphatest_pars_fragment:gh,aomap_fragment:vh,aomap_pars_fragment:_h,batching_pars_vertex:xh,batching_vertex:Mh,begin_vertex:Sh,beginnormal_vertex:yh,bsdfs:bh,iridescence_fragment:Eh,bumpmap_pars_fragment:wh,clipping_planes_fragment:Th,clipping_planes_pars_fragment:Ah,clipping_planes_pars_vertex:Rh,clipping_planes_vertex:Ch,color_fragment:Ph,color_pars_fragment:Lh,color_pars_vertex:Dh,color_vertex:Ih,common:kh,cube_uv_reflection_fragment:Uh,defaultnormal_vertex:Nh,displacementmap_pars_vertex:Fh,displacementmap_vertex:Bh,emissivemap_fragment:Oh,emissivemap_pars_fragment:zh,colorspace_fragment:Gh,colorspace_pars_fragment:Hh,envmap_fragment:Vh,envmap_common_pars_fragment:Wh,envmap_pars_fragment:Xh,envmap_pars_vertex:qh,envmap_physical_pars_fragment:iu,envmap_vertex:Kh,fog_vertex:Yh,fog_pars_vertex:$h,fog_fragment:jh,fog_pars_fragment:Jh,gradientmap_pars_fragment:Zh,lightmap_pars_fragment:Qh,lights_lambert_fragment:eu,lights_lambert_pars_fragment:tu,lights_pars_begin:nu,lights_toon_fragment:su,lights_toon_pars_fragment:au,lights_phong_fragment:ru,lights_phong_pars_fragment:ou,lights_physical_fragment:lu,lights_physical_pars_fragment:cu,lights_fragment_begin:hu,lights_fragment_maps:uu,lights_fragment_end:du,logdepthbuf_fragment:pu,logdepthbuf_pars_fragment:fu,logdepthbuf_pars_vertex:mu,logdepthbuf_vertex:gu,map_fragment:vu,map_pars_fragment:_u,map_particle_fragment:xu,map_particle_pars_fragment:Mu,metalnessmap_fragment:Su,metalnessmap_pars_fragment:yu,morphinstance_vertex:bu,morphcolor_vertex:Eu,morphnormal_vertex:wu,morphtarget_pars_vertex:Tu,morphtarget_vertex:Au,normal_fragment_begin:Ru,normal_fragment_maps:Cu,normal_pars_fragment:Pu,normal_pars_vertex:Lu,normal_vertex:Du,normalmap_pars_fragment:Iu,clearcoat_normal_fragment_begin:ku,clearcoat_normal_fragment_maps:Uu,clearcoat_pars_fragment:Nu,iridescence_pars_fragment:Fu,opaque_fragment:Bu,packing:Ou,premultiplied_alpha_fragment:zu,project_vertex:Gu,dithering_fragment:Hu,dithering_pars_fragment:Vu,roughnessmap_fragment:Wu,roughnessmap_pars_fragment:Xu,shadowmap_pars_fragment:qu,shadowmap_pars_vertex:Ku,shadowmap_vertex:Yu,shadowmask_pars_fragment:$u,skinbase_vertex:ju,skinning_pars_vertex:Ju,skinning_vertex:Zu,skinnormal_vertex:Qu,specularmap_fragment:ed,specularmap_pars_fragment:td,tonemapping_fragment:nd,tonemapping_pars_fragment:id,transmission_fragment:sd,transmission_pars_fragment:ad,uv_pars_fragment:rd,uv_pars_vertex:od,uv_vertex:ld,worldpos_vertex:cd,background_vert:hd,background_frag:ud,backgroundCube_vert:dd,backgroundCube_frag:pd,cube_vert:fd,cube_frag:md,depth_vert:gd,depth_frag:vd,distanceRGBA_vert:_d,distanceRGBA_frag:xd,equirect_vert:Md,equirect_frag:Sd,linedashed_vert:yd,linedashed_frag:bd,meshbasic_vert:Ed,meshbasic_frag:wd,meshlambert_vert:Td,meshlambert_frag:Ad,meshmatcap_vert:Rd,meshmatcap_frag:Cd,meshnormal_vert:Pd,meshnormal_frag:Ld,meshphong_vert:Dd,meshphong_frag:Id,meshphysical_vert:kd,meshphysical_frag:Ud,meshtoon_vert:Nd,meshtoon_frag:Fd,points_vert:Bd,points_frag:Od,shadow_vert:zd,shadow_frag:Gd,sprite_vert:Hd,sprite_frag:Vd},se={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},envMapRotation:{value:new Le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new Se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new Se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},Ht={basic:{uniforms:xt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:xt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new Ne(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:xt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:xt([se.common,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.roughnessmap,se.metalnessmap,se.fog,se.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:xt([se.common,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.gradientmap,se.fog,se.lights,{emissive:{value:new Ne(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:xt([se.common,se.bumpmap,se.normalmap,se.displacementmap,se.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:xt([se.points,se.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:xt([se.common,se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:xt([se.common,se.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:xt([se.common,se.bumpmap,se.normalmap,se.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:xt([se.sprite,se.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Le}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:xt([se.common,se.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:xt([se.lights,se.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};Ht.physical={uniforms:xt([Ht.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new Se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new Se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new Se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const ts={r:0,b:0,g:0},wn=new Wt,Wd=new nt;function Xd(i,e,t,n,s,a,r){const o=new Ne(0);let l=a===!0?0:1,c,h,d=null,u=0,f=null;function g(E){let v=E.isScene===!0?E.background:null;return v&&v.isTexture&&(v=(E.backgroundBlurriness>0?t:e).get(v)),v}function x(E){let v=!1;const _=g(E);_===null?p(o,l):_&&_.isColor&&(p(_,1),v=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,r):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,v){const _=g(v);_&&(_.isCubeTexture||_.mapping===gs)?(h===void 0&&(h=new Ae(new Dt(1,1,1),new an({name:"BackgroundCubeMaterial",uniforms:oi(Ht.backgroundCube.uniforms),vertexShader:Ht.backgroundCube.vertexShader,fragmentShader:Ht.backgroundCube.fragmentShader,side:bt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),wn.copy(v.backgroundRotation),wn.x*=-1,wn.y*=-1,wn.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(wn.y*=-1,wn.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Wd.makeRotationFromEuler(wn)),h.material.toneMapped=He.getTransfer(_.colorSpace)!==$e,(d!==_||u!==_.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=_,u=_.version,f=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new Ae(new xs(2,2),new an({name:"BackgroundMaterial",uniforms:oi(Ht.background.uniforms),vertexShader:Ht.background.vertexShader,fragmentShader:Ht.background.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=He.getTransfer(_.colorSpace)!==$e,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||u!==_.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=_,u=_.version,f=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function p(E,v){E.getRGB(ts,tl(i)),n.buffers.color.setClear(ts.r,ts.g,ts.b,v,r)}return{getClearColor:function(){return o},setClearColor:function(E,v=1){o.set(E),l=v,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,p(o,l)},render:x,addToRenderList:m}}function qd(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let a=s,r=!1;function o(S,T,F,N,W){let X=!1;const H=d(N,F,T);a!==H&&(a=H,c(a.object)),X=f(S,N,F,W),X&&g(S,N,F,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(X||r)&&(r=!1,_(S,T,F,N),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function d(S,T,F){const N=F.wireframe===!0;let W=n[S.id];W===void 0&&(W={},n[S.id]=W);let X=W[T.id];X===void 0&&(X={},W[T.id]=X);let H=X[N];return H===void 0&&(H=u(l()),X[N]=H),H}function u(S){const T=[],F=[],N=[];for(let W=0;W<t;W++)T[W]=0,F[W]=0,N[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:F,attributeDivisors:N,object:S,attributes:{},index:null}}function f(S,T,F,N){const W=a.attributes,X=T.attributes;let H=0;const J=F.getAttributes();for(const G in J)if(J[G].location>=0){const le=W[G];let me=X[G];if(me===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(me=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(me=S.instanceColor)),le===void 0||le.attribute!==me||me&&le.data!==me.data)return!0;H++}return a.attributesNum!==H||a.index!==N}function g(S,T,F,N){const W={},X=T.attributes;let H=0;const J=F.getAttributes();for(const G in J)if(J[G].location>=0){let le=X[G];le===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(le=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(le=S.instanceColor));const me={};me.attribute=le,le&&le.data&&(me.data=le.data),W[G]=me,H++}a.attributes=W,a.attributesNum=H,a.index=N}function x(){const S=a.newAttributes;for(let T=0,F=S.length;T<F;T++)S[T]=0}function m(S){p(S,0)}function p(S,T){const F=a.newAttributes,N=a.enabledAttributes,W=a.attributeDivisors;F[S]=1,N[S]===0&&(i.enableVertexAttribArray(S),N[S]=1),W[S]!==T&&(i.vertexAttribDivisor(S,T),W[S]=T)}function E(){const S=a.newAttributes,T=a.enabledAttributes;for(let F=0,N=T.length;F<N;F++)T[F]!==S[F]&&(i.disableVertexAttribArray(F),T[F]=0)}function v(S,T,F,N,W,X,H){H===!0?i.vertexAttribIPointer(S,T,F,W,X):i.vertexAttribPointer(S,T,F,N,W,X)}function _(S,T,F,N){x();const W=N.attributes,X=F.getAttributes(),H=T.defaultAttributeValues;for(const J in X){const G=X[J];if(G.location>=0){let te=W[J];if(te===void 0&&(J==="instanceMatrix"&&S.instanceMatrix&&(te=S.instanceMatrix),J==="instanceColor"&&S.instanceColor&&(te=S.instanceColor)),te!==void 0){const le=te.normalized,me=te.itemSize,Ue=e.get(te);if(Ue===void 0)continue;const Ve=Ue.buffer,K=Ue.type,Z=Ue.bytesPerElement,pe=K===i.INT||K===i.UNSIGNED_INT||te.gpuType===Ya;if(te.isInterleavedBufferAttribute){const ne=te.data,be=ne.stride,we=te.offset;if(ne.isInstancedInterleavedBuffer){for(let De=0;De<G.locationSize;De++)p(G.location+De,ne.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let De=0;De<G.locationSize;De++)m(G.location+De);i.bindBuffer(i.ARRAY_BUFFER,Ve);for(let De=0;De<G.locationSize;De++)v(G.location+De,me/G.locationSize,K,le,be*Z,(we+me/G.locationSize*De)*Z,pe)}else{if(te.isInstancedBufferAttribute){for(let ne=0;ne<G.locationSize;ne++)p(G.location+ne,te.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ne=0;ne<G.locationSize;ne++)m(G.location+ne);i.bindBuffer(i.ARRAY_BUFFER,Ve);for(let ne=0;ne<G.locationSize;ne++)v(G.location+ne,me/G.locationSize,K,le,me*Z,me/G.locationSize*ne*Z,pe)}}else if(H!==void 0){const le=H[J];if(le!==void 0)switch(le.length){case 2:i.vertexAttrib2fv(G.location,le);break;case 3:i.vertexAttrib3fv(G.location,le);break;case 4:i.vertexAttrib4fv(G.location,le);break;default:i.vertexAttrib1fv(G.location,le)}}}}E()}function L(){C();for(const S in n){const T=n[S];for(const F in T){const N=T[F];for(const W in N)h(N[W].object),delete N[W];delete T[F]}delete n[S]}}function A(S){if(n[S.id]===void 0)return;const T=n[S.id];for(const F in T){const N=T[F];for(const W in N)h(N[W].object),delete N[W];delete T[F]}delete n[S.id]}function R(S){for(const T in n){const F=n[T];if(F[S.id]===void 0)continue;const N=F[S.id];for(const W in N)h(N[W].object),delete N[W];delete F[S.id]}}function C(){b(),r=!0,a!==s&&(a=s,c(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:m,disableUnusedAttributes:E}}function Kd(i,e,t){let n;function s(c){n=c}function a(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function r(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)r(c[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let x=0;x<d;x++)g+=h[x]*u[x];t.update(g,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Yd(i,e,t,n){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(R){return!(R!==Ot&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const C=R===Li&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==sn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==en&&!C)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:L,maxSamples:A}}function $d(i){const e=this;let t=null,n=0,s=!1,a=!1;const r=new An,o=new Le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||a&&!m)a?h(null):c();else{const E=a?0:n,v=E*4;let _=p.clippingState||null;l.value=_,_=h(g,u,v,f);for(let L=0;L!==v;++L)_[L]=t[L];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const p=f+x*4,E=u.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,_=f;v!==x;++v,_+=4)r.copy(d[v]).applyMatrix4(E,o),r.normal.toArray(m,_),m[_+3]=r.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function jd(i){let e=new WeakMap;function t(r,o){return o===fa?r.mapping=ii:o===ma&&(r.mapping=si),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===fa||o===ma)if(e.has(r)){const l=e.get(r).texture;return t(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new oh(l.height);return c.fromEquirectangularTexture(i,r),e.set(r,c),r.addEventListener("dispose",s),t(c.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function a(){e=new WeakMap}return{get:n,dispose:a}}class al extends nl{constructor(e=-1,t=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-e,r=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Zn=4,Jr=[.125,.215,.35,.446,.526,.582],Pn=20,Ws=new al,Zr=new Ne;let Xs=null,qs=0,Ks=0,Ys=!1;const Rn=(1+Math.sqrt(5))/2,jn=1/Rn,Qr=[new P(-Rn,jn,0),new P(Rn,jn,0),new P(-jn,0,Rn),new P(jn,0,Rn),new P(0,Rn,-jn),new P(0,Rn,jn),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class eo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Xs=this._renderer.getRenderTarget(),qs=this._renderer.getActiveCubeFace(),Ks=this._renderer.getActiveMipmapLevel(),Ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,n,s,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=io(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=no(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Xs,qs,Ks),this._renderer.xr.enabled=Ys,e.scissorTest=!1,ns(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ii||e.mapping===si?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Xs=this._renderer.getRenderTarget(),qs=this._renderer.getActiveCubeFace(),Ks=this._renderer.getActiveMipmapLevel(),Ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Vt,minFilter:Vt,generateMipmaps:!1,type:Li,format:Ot,colorSpace:li,depthBuffer:!1},s=to(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=to(e,t,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jd(a)),this._blurMaterial=Zd(a,e,t)}return s}_compileMaterial(e){const t=new Ae(this._lodPlanes[0],e);this._renderer.compile(t,Ws)}_sceneToCubeUV(e,t,n,s){const o=new yt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(Zr),h.toneMapping=_n,h.autoClear=!1;const f=new wi({name:"PMREM.Background",side:bt,depthWrite:!1,depthTest:!1}),g=new Ae(new Dt,f);let x=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,x=!0):(f.color.copy(Zr),x=!0);for(let p=0;p<6;p++){const E=p%3;E===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):E===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const v=this._cubeSize;ns(s,E*v,p>2?v:0,v,v),h.setRenderTarget(s),x&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ii||e.mapping===si;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=io()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=no());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new Ae(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;ns(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(r,Ws)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Qr[(s-a-1)%Qr.length];this._blur(e,a-1,a,r,o)}t.autoClear=n}_blur(e,t,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,n,s,"latitudinal",a),this._halfBlur(r,e,n,n,s,"longitudinal",a)}_halfBlur(e,t,n,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Ae(this._lodPlanes[s],c),u=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*Pn-1),x=a/g,m=isFinite(a)?1+Math.floor(h*x):Pn;m>Pn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Pn}`);const p=[];let E=0;for(let R=0;R<Pn;++R){const C=R/x,b=Math.exp(-C*C/2);p.push(b),R===0?E+=b:R<m&&(E+=2*b)}for(let R=0;R<p.length;R++)p[R]=p[R]/E;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=r==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:v}=this;u.dTheta.value=g,u.mipInt.value=v-n;const _=this._sizeLods[s],L=3*_*(s>v-Zn?s-v+Zn:0),A=4*(this._cubeSize-_);ns(t,L,A,3*_,2*_),l.setRenderTarget(t),l.render(d,Ws)}}function Jd(i){const e=[],t=[],n=[];let s=i;const a=i-Zn+1+Jr.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);t.push(o);let l=1/o;r>i-Zn?l=Jr[r-i+Zn-1]:r===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,x=3,m=2,p=1,E=new Float32Array(x*g*f),v=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let A=0;A<f;A++){const R=A%3*2/3-1,C=A>2?0:-1,b=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];E.set(b,x*g*A),v.set(u,m*g*A);const S=[A,A,A,A,A,A];_.set(S,p*g*A)}const L=new vt;L.setAttribute("position",new Rt(E,x)),L.setAttribute("uv",new Rt(v,m)),L.setAttribute("faceIndex",new Rt(_,p)),e.push(L),s>Zn&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function to(i,e,t){const n=new Un(i,e,t);return n.texture.mapping=gs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ns(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Zd(i,e,t){const n=new Float32Array(Pn),s=new P(0,1,0);return new an({name:"SphericalGaussianBlur",defines:{n:Pn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:nr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:vn,depthTest:!1,depthWrite:!1})}function no(){return new an({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:vn,depthTest:!1,depthWrite:!1})}function io(){return new an({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vn,depthTest:!1,depthWrite:!1})}function nr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Qd(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===fa||l===ma,h=l===ii||l===si;if(c||h){let d=e.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new eo(i)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new eo(i)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",a),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:r}}function ep(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Mi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function tp(i,e,t,n){const s={},a=new WeakMap;function r(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const x=u.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)e.remove(x[m])}u.removeEventListener("dispose",r),delete s[u.id];const f=a.get(u);f&&(e.remove(f),a.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",r),s[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const g in u)e.update(u[g],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const x=f[g];for(let m=0,p=x.length;m<p;m++)e.update(x[m],i.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,g=d.attributes.position;let x=0;if(f!==null){const E=f.array;x=f.version;for(let v=0,_=E.length;v<_;v+=3){const L=E[v+0],A=E[v+1],R=E[v+2];u.push(L,A,A,R,R,L)}}else if(g!==void 0){const E=g.array;x=g.version;for(let v=0,_=E.length/3-1;v<_;v+=3){const L=v+0,A=v+1,R=v+2;u.push(L,A,A,R,R,L)}}else return;const m=new(Ko(u)?el:Qo)(u,1);m.version=x;const p=a.get(d);p&&e.remove(p),a.set(d,m)}function h(d){const u=a.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return a.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function np(i,e,t){let n;function s(u){n=u}let a,r;function o(u){a=u.type,r=u.bytesPerElement}function l(u,f){i.drawElements(n,f,a,u*r),t.update(f,n,1)}function c(u,f,g){g!==0&&(i.drawElementsInstanced(n,f,a,u*r,g),t.update(f,n,g))}function h(u,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,a,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function d(u,f,g,x){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)c(u[p]/r,f[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,a,u,0,x,0,g);let p=0;for(let E=0;E<g;E++)p+=f[E]*x[E];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function ip(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(t.calls++,r){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function sp(i,e,t){const n=new WeakMap,s=new je;function a(r,o,l){const c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var f=S;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),x===!0&&(_=2),m===!0&&(_=3);let L=o.attributes.position.count*_,A=1;L>e.maxTextureSize&&(A=Math.ceil(L/e.maxTextureSize),L=e.maxTextureSize);const R=new Float32Array(L*A*4*d),C=new $o(R,L,A,d);C.type=en,C.needsUpdate=!0;const b=_*4;for(let T=0;T<d;T++){const F=p[T],N=E[T],W=v[T],X=L*A*4*T;for(let H=0;H<F.count;H++){const J=H*b;g===!0&&(s.fromBufferAttribute(F,H),R[X+J+0]=s.x,R[X+J+1]=s.y,R[X+J+2]=s.z,R[X+J+3]=0),x===!0&&(s.fromBufferAttribute(N,H),R[X+J+4]=s.x,R[X+J+5]=s.y,R[X+J+6]=s.z,R[X+J+7]=0),m===!0&&(s.fromBufferAttribute(W,H),R[X+J+8]=s.x,R[X+J+9]=s.y,R[X+J+10]=s.z,R[X+J+11]=W.itemSize===4?s.w:1)}}u={count:d,texture:C,size:new Se(L,A)},n.set(o,u),o.addEventListener("dispose",S)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",r.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const x=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:a}}function ap(i,e,t,n){let s=new WeakMap;function a(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function r(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:a,dispose:r}}class rl extends Et{constructor(e,t,n,s,a,r,o,l,c,h=ei){if(h!==ei&&h!==ri)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ei&&(n=kn),n===void 0&&h===ri&&(n=ai),super(null,s,a,r,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:zt,this.minFilter=l!==void 0?l:zt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const ol=new Et,so=new rl(1,1),ll=new $o,cl=new Xc,hl=new il,ao=[],ro=[],oo=new Float32Array(16),lo=new Float32Array(9),co=new Float32Array(4);function di(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let a=ao[s];if(a===void 0&&(a=new Float32Array(s),ao[s]=a),e!==0){n.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,i[r].toArray(a,o)}return a}function ot(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function lt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ms(i,e){let t=ro[e];t===void 0&&(t=new Int32Array(e),ro[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function rp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function op(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ot(t,e))return;i.uniform2fv(this.addr,e),lt(t,e)}}function lp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ot(t,e))return;i.uniform3fv(this.addr,e),lt(t,e)}}function cp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ot(t,e))return;i.uniform4fv(this.addr,e),lt(t,e)}}function hp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),lt(t,e)}else{if(ot(t,n))return;co.set(n),i.uniformMatrix2fv(this.addr,!1,co),lt(t,n)}}function up(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),lt(t,e)}else{if(ot(t,n))return;lo.set(n),i.uniformMatrix3fv(this.addr,!1,lo),lt(t,n)}}function dp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ot(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),lt(t,e)}else{if(ot(t,n))return;oo.set(n),i.uniformMatrix4fv(this.addr,!1,oo),lt(t,n)}}function pp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function fp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ot(t,e))return;i.uniform2iv(this.addr,e),lt(t,e)}}function mp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ot(t,e))return;i.uniform3iv(this.addr,e),lt(t,e)}}function gp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ot(t,e))return;i.uniform4iv(this.addr,e),lt(t,e)}}function vp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function _p(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ot(t,e))return;i.uniform2uiv(this.addr,e),lt(t,e)}}function xp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ot(t,e))return;i.uniform3uiv(this.addr,e),lt(t,e)}}function Mp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ot(t,e))return;i.uniform4uiv(this.addr,e),lt(t,e)}}function Sp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(so.compareFunction=qo,a=so):a=ol,t.setTexture2D(e||a,s)}function yp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||cl,s)}function bp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||hl,s)}function Ep(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||ll,s)}function wp(i){switch(i){case 5126:return rp;case 35664:return op;case 35665:return lp;case 35666:return cp;case 35674:return hp;case 35675:return up;case 35676:return dp;case 5124:case 35670:return pp;case 35667:case 35671:return fp;case 35668:case 35672:return mp;case 35669:case 35673:return gp;case 5125:return vp;case 36294:return _p;case 36295:return xp;case 36296:return Mp;case 35678:case 36198:case 36298:case 36306:case 35682:return Sp;case 35679:case 36299:case 36307:return yp;case 35680:case 36300:case 36308:case 36293:return bp;case 36289:case 36303:case 36311:case 36292:return Ep}}function Tp(i,e){i.uniform1fv(this.addr,e)}function Ap(i,e){const t=di(e,this.size,2);i.uniform2fv(this.addr,t)}function Rp(i,e){const t=di(e,this.size,3);i.uniform3fv(this.addr,t)}function Cp(i,e){const t=di(e,this.size,4);i.uniform4fv(this.addr,t)}function Pp(i,e){const t=di(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Lp(i,e){const t=di(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Dp(i,e){const t=di(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ip(i,e){i.uniform1iv(this.addr,e)}function kp(i,e){i.uniform2iv(this.addr,e)}function Up(i,e){i.uniform3iv(this.addr,e)}function Np(i,e){i.uniform4iv(this.addr,e)}function Fp(i,e){i.uniform1uiv(this.addr,e)}function Bp(i,e){i.uniform2uiv(this.addr,e)}function Op(i,e){i.uniform3uiv(this.addr,e)}function zp(i,e){i.uniform4uiv(this.addr,e)}function Gp(i,e,t){const n=this.cache,s=e.length,a=Ms(t,s);ot(n,a)||(i.uniform1iv(this.addr,a),lt(n,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||ol,a[r])}function Hp(i,e,t){const n=this.cache,s=e.length,a=Ms(t,s);ot(n,a)||(i.uniform1iv(this.addr,a),lt(n,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||cl,a[r])}function Vp(i,e,t){const n=this.cache,s=e.length,a=Ms(t,s);ot(n,a)||(i.uniform1iv(this.addr,a),lt(n,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||hl,a[r])}function Wp(i,e,t){const n=this.cache,s=e.length,a=Ms(t,s);ot(n,a)||(i.uniform1iv(this.addr,a),lt(n,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||ll,a[r])}function Xp(i){switch(i){case 5126:return Tp;case 35664:return Ap;case 35665:return Rp;case 35666:return Cp;case 35674:return Pp;case 35675:return Lp;case 35676:return Dp;case 5124:case 35670:return Ip;case 35667:case 35671:return kp;case 35668:case 35672:return Up;case 35669:case 35673:return Np;case 5125:return Fp;case 36294:return Bp;case 36295:return Op;case 36296:return zp;case 35678:case 36198:case 36298:case 36306:case 35682:return Gp;case 35679:case 36299:case 36307:return Hp;case 35680:case 36300:case 36308:case 36293:return Vp;case 36289:case 36303:case 36311:case 36292:return Wp}}class qp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=wp(t.type)}}class Kp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xp(t.type)}}class Yp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],n)}}}const $s=/(\w+)(\])?(\[|\.)?/g;function ho(i,e){i.seq.push(e),i.map[e.id]=e}function $p(i,e,t){const n=i.name,s=n.length;for($s.lastIndex=0;;){const a=$s.exec(n),r=$s.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){ho(t,c===void 0?new qp(o,i,e):new Kp(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Yp(o),ho(t,d)),t=d}}}class ds{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);$p(a,r,this)}}setValue(e,t,n,s){const a=this.map[t];a!==void 0&&a.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&n.push(r)}return n}}function uo(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const jp=37297;let Jp=0;function Zp(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return n.join(`
`)}const po=new Le;function Qp(i){He._getMatrix(po,He.workingColorSpace,i);const e=`mat3( ${po.elements.map(t=>t.toFixed(4))} )`;switch(He.getTransfer(i)){case vs:return[e,"LinearTransferOETF"];case $e:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function fo(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+Zp(i.getShaderSource(e),r)}else return s}function ef(i,e){const t=Qp(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function tf(i,e){let t;switch(e){case ic:t="Linear";break;case sc:t="Reinhard";break;case ac:t="Cineon";break;case Ka:t="ACESFilmic";break;case oc:t="AgX";break;case lc:t="Neutral";break;case rc:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const is=new P;function nf(){He.getLuminanceCoefficients(is);const i=is.x.toFixed(4),e=is.y.toFixed(4),t=is.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sf(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Si).join(`
`)}function af(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function rf(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(e,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:i.getAttribLocation(e,r),locationSize:o}}return t}function Si(i){return i!==""}function mo(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function go(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const of=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wa(i){return i.replace(of,cf)}const lf=new Map;function cf(i,e){let t=ke[e];if(t===void 0){const n=lf.get(e);if(n!==void 0)t=ke[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Wa(t)}const hf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vo(i){return i.replace(hf,uf)}function uf(i,e,t,n){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function _o(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function df(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Do?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Nl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Zt&&(e="SHADOWMAP_TYPE_VSM"),e}function pf(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ii:case si:e="ENVMAP_TYPE_CUBE";break;case gs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ff(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case si:e="ENVMAP_MODE_REFRACTION";break}return e}function mf(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Io:e="ENVMAP_BLENDING_MULTIPLY";break;case tc:e="ENVMAP_BLENDING_MIX";break;case nc:e="ENVMAP_BLENDING_ADD";break}return e}function gf(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function vf(i,e,t,n){const s=i.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=df(t),c=pf(t),h=ff(t),d=mf(t),u=gf(t),f=sf(t),g=af(a),x=s.createProgram();let m,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Si).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Si).join(`
`),p.length>0&&(p+=`
`)):(m=[_o(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Si).join(`
`),p=[_o(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==_n?"#define TONE_MAPPING":"",t.toneMapping!==_n?ke.tonemapping_pars_fragment:"",t.toneMapping!==_n?tf("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,ef("linearToOutputTexel",t.outputColorSpace),nf(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Si).join(`
`)),r=Wa(r),r=mo(r,t),r=go(r,t),o=Wa(o),o=mo(o,t),o=go(o,t),r=vo(r),o=vo(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Cr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Cr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=E+m+r,_=E+p+o,L=uo(s,s.VERTEX_SHADER,v),A=uo(s,s.FRAGMENT_SHADER,_);s.attachShader(x,L),s.attachShader(x,A),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(T){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(x).trim(),N=s.getShaderInfoLog(L).trim(),W=s.getShaderInfoLog(A).trim();let X=!0,H=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,L,A);else{const J=fo(s,L,"vertex"),G=fo(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+F+`
`+J+`
`+G)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(N===""||W==="")&&(H=!1);H&&(T.diagnostics={runnable:X,programLog:F,vertexShader:{log:N,prefix:m},fragmentShader:{log:W,prefix:p}})}s.deleteShader(L),s.deleteShader(A),C=new ds(s,x),b=rf(s,x)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(x,jp)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jp++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=L,this.fragmentShader=A,this}let _f=0;class xf{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Mf(e),t.set(e,n)),n}}class Mf{constructor(e){this.id=_f++,this.code=e,this.usedTimes=0}}function Sf(i,e,t,n,s,a,r){const o=new Jo,l=new xf,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,S,T,F,N){const W=F.fog,X=N.geometry,H=b.isMeshStandardMaterial?F.environment:null,J=(b.isMeshStandardMaterial?t:e).get(b.envMap||H),G=J&&J.mapping===gs?J.image.height:null,te=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const le=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,me=le!==void 0?le.length:0;let Ue=0;X.morphAttributes.position!==void 0&&(Ue=1),X.morphAttributes.normal!==void 0&&(Ue=2),X.morphAttributes.color!==void 0&&(Ue=3);let Ve,K,Z,pe;if(te){const Ye=Ht[te];Ve=Ye.vertexShader,K=Ye.fragmentShader}else Ve=b.vertexShader,K=b.fragmentShader,l.update(b),Z=l.getVertexShaderID(b),pe=l.getFragmentShaderID(b);const ne=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),we=N.isInstancedMesh===!0,De=N.isBatchedMesh===!0,Qe=!!b.map,Oe=!!b.matcap,st=!!J,I=!!b.aoMap,Mt=!!b.lightMap,Fe=!!b.bumpMap,ze=!!b.normalMap,ye=!!b.displacementMap,Xe=!!b.emissiveMap,xe=!!b.metalnessMap,w=!!b.roughnessMap,M=b.anisotropy>0,B=b.clearcoat>0,Y=b.dispersion>0,j=b.iridescence>0,q=b.sheen>0,fe=b.transmission>0,ie=M&&!!b.anisotropyMap,he=B&&!!b.clearcoatMap,Be=B&&!!b.clearcoatNormalMap,Q=B&&!!b.clearcoatRoughnessMap,ue=j&&!!b.iridescenceMap,Ee=j&&!!b.iridescenceThicknessMap,Te=q&&!!b.sheenColorMap,de=q&&!!b.sheenRoughnessMap,Ge=!!b.specularMap,Ie=!!b.specularColorMap,Je=!!b.specularIntensityMap,D=fe&&!!b.transmissionMap,ae=fe&&!!b.thicknessMap,V=!!b.gradientMap,$=!!b.alphaMap,ce=b.alphaTest>0,re=!!b.alphaHash,Ce=!!b.extensions;let at=_n;b.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(at=i.toneMapping);const pt={shaderID:te,shaderType:b.type,shaderName:b.name,vertexShader:Ve,fragmentShader:K,defines:b.defines,customVertexShaderID:Z,customFragmentShaderID:pe,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:De,batchingColor:De&&N._colorsTexture!==null,instancing:we,instancingColor:we&&N.instanceColor!==null,instancingMorph:we&&N.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:li,alphaToCoverage:!!b.alphaToCoverage,map:Qe,matcap:Oe,envMap:st,envMapMode:st&&J.mapping,envMapCubeUVHeight:G,aoMap:I,lightMap:Mt,bumpMap:Fe,normalMap:ze,displacementMap:u&&ye,emissiveMap:Xe,normalMapObjectSpace:ze&&b.normalMapType===dc,normalMapTangentSpace:ze&&b.normalMapType===Xo,metalnessMap:xe,roughnessMap:w,anisotropy:M,anisotropyMap:ie,clearcoat:B,clearcoatMap:he,clearcoatNormalMap:Be,clearcoatRoughnessMap:Q,dispersion:Y,iridescence:j,iridescenceMap:ue,iridescenceThicknessMap:Ee,sheen:q,sheenColorMap:Te,sheenRoughnessMap:de,specularMap:Ge,specularColorMap:Ie,specularIntensityMap:Je,transmission:fe,transmissionMap:D,thicknessMap:ae,gradientMap:V,opaque:b.transparent===!1&&b.blending===Qn&&b.alphaToCoverage===!1,alphaMap:$,alphaTest:ce,alphaHash:re,combine:b.combine,mapUv:Qe&&x(b.map.channel),aoMapUv:I&&x(b.aoMap.channel),lightMapUv:Mt&&x(b.lightMap.channel),bumpMapUv:Fe&&x(b.bumpMap.channel),normalMapUv:ze&&x(b.normalMap.channel),displacementMapUv:ye&&x(b.displacementMap.channel),emissiveMapUv:Xe&&x(b.emissiveMap.channel),metalnessMapUv:xe&&x(b.metalnessMap.channel),roughnessMapUv:w&&x(b.roughnessMap.channel),anisotropyMapUv:ie&&x(b.anisotropyMap.channel),clearcoatMapUv:he&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:Be&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ue&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:de&&x(b.sheenRoughnessMap.channel),specularMapUv:Ge&&x(b.specularMap.channel),specularColorMapUv:Ie&&x(b.specularColorMap.channel),specularIntensityMapUv:Je&&x(b.specularIntensityMap.channel),transmissionMapUv:D&&x(b.transmissionMap.channel),thicknessMapUv:ae&&x(b.thicknessMap.channel),alphaMapUv:$&&x(b.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(ze||M),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!X.attributes.uv&&(Qe||$),fog:!!W,useFog:b.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:be,skinning:N.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:Ue,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:at,decodeVideoTexture:Qe&&b.map.isVideoTexture===!0&&He.getTransfer(b.map.colorSpace)===$e,decodeVideoTextureEmissive:Xe&&b.emissiveMap.isVideoTexture===!0&&He.getTransfer(b.emissiveMap.colorSpace)===$e,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Qt,flipSided:b.side===bt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ce&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ce&&b.extensions.multiDraw===!0||De)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function p(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const T in b.defines)S.push(T),S.push(b.defines[T]);return b.isRawShaderMaterial===!1&&(E(S,b),v(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function E(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function v(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function _(b){const S=g[b.type];let T;if(S){const F=Ht[S];T=ih.clone(F.uniforms)}else T=b.uniforms;return T}function L(b,S){let T;for(let F=0,N=h.length;F<N;F++){const W=h[F];if(W.cacheKey===S){T=W,++T.usedTimes;break}}return T===void 0&&(T=new vf(i,S,b,a),h.push(T)),T}function A(b){if(--b.usedTimes===0){const S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function R(b){l.remove(b)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:L,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:C}}function yf(){let i=new WeakMap;function e(r){return i.has(r)}function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,l){i.get(r)[o]=l}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:a}}function bf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function xo(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Mo(){const i=[];let e=0;const t=[],n=[],s=[];function a(){e=0,t.length=0,n.length=0,s.length=0}function r(d,u,f,g,x,m){let p=i[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:x,group:m},i[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=x,p.group=m),e++,p}function o(d,u,f,g,x,m){const p=r(d,u,f,g,x,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(d,u,f,g,x,m){const p=r(d,u,f,g,x,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(d,u){t.length>1&&t.sort(d||bf),n.length>1&&n.sort(u||xo),s.length>1&&s.sort(u||xo)}function h(){for(let d=e,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:a,push:o,unshift:l,finish:h,sort:c}}function Ef(){let i=new WeakMap;function e(n,s){const a=i.get(n);let r;return a===void 0?(r=new Mo,i.set(n,[r])):s>=a.length?(r=new Mo,a.push(r)):r=a[s],r}function t(){i=new WeakMap}return{get:e,dispose:t}}function wf(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Ne};break;case"SpotLight":t={position:new P,direction:new P,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Tf(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Af=0;function Rf(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Cf(i){const e=new wf,t=Tf(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,a=new nt,r=new nt;function o(c){let h=0,d=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,E=0,v=0,_=0,L=0,A=0,R=0;c.sort(Rf);for(let b=0,S=c.length;b<S;b++){const T=c[b],F=T.color,N=T.intensity,W=T.distance,X=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=F.r*N,d+=F.g*N,u+=F.b*N;else if(T.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(T.sh.coefficients[H],N);R++}else if(T.isDirectionalLight){const H=e.get(T);if(H.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const J=T.shadow,G=t.get(T);G.shadowIntensity=J.intensity,G.shadowBias=J.bias,G.shadowNormalBias=J.normalBias,G.shadowRadius=J.radius,G.shadowMapSize=J.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=X,n.directionalShadowMatrix[f]=T.shadow.matrix,E++}n.directional[f]=H,f++}else if(T.isSpotLight){const H=e.get(T);H.position.setFromMatrixPosition(T.matrixWorld),H.color.copy(F).multiplyScalar(N),H.distance=W,H.coneCos=Math.cos(T.angle),H.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),H.decay=T.decay,n.spot[x]=H;const J=T.shadow;if(T.map&&(n.spotLightMap[L]=T.map,L++,J.updateMatrices(T),T.castShadow&&A++),n.spotLightMatrix[x]=J.matrix,T.castShadow){const G=t.get(T);G.shadowIntensity=J.intensity,G.shadowBias=J.bias,G.shadowNormalBias=J.normalBias,G.shadowRadius=J.radius,G.shadowMapSize=J.mapSize,n.spotShadow[x]=G,n.spotShadowMap[x]=X,_++}x++}else if(T.isRectAreaLight){const H=e.get(T);H.color.copy(F).multiplyScalar(N),H.halfWidth.set(T.width*.5,0,0),H.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=H,m++}else if(T.isPointLight){const H=e.get(T);if(H.color.copy(T.color).multiplyScalar(T.intensity),H.distance=T.distance,H.decay=T.decay,T.castShadow){const J=T.shadow,G=t.get(T);G.shadowIntensity=J.intensity,G.shadowBias=J.bias,G.shadowNormalBias=J.normalBias,G.shadowRadius=J.radius,G.shadowMapSize=J.mapSize,G.shadowCameraNear=J.camera.near,G.shadowCameraFar=J.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=T.shadow.matrix,v++}n.point[g]=H,g++}else if(T.isHemisphereLight){const H=e.get(T);H.skyColor.copy(T.color).multiplyScalar(N),H.groundColor.copy(T.groundColor).multiplyScalar(N),n.hemi[p]=H,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=se.LTC_FLOAT_1,n.rectAreaLTC2=se.LTC_FLOAT_2):(n.rectAreaLTC1=se.LTC_HALF_1,n.rectAreaLTC2=se.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==x||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==E||C.numPointShadows!==v||C.numSpotShadows!==_||C.numSpotMaps!==L||C.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=_+L-A,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,C.directionalLength=f,C.pointLength=g,C.spotLength=x,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=E,C.numPointShadows=v,C.numSpotShadows=_,C.numSpotMaps=L,C.numLightProbes=R,n.version=Af++)}function l(c,h){let d=0,u=0,f=0,g=0,x=0;const m=h.matrixWorldInverse;for(let p=0,E=c.length;p<E;p++){const v=c[p];if(v.isDirectionalLight){const _=n.directional[d];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),d++}else if(v.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),f++}else if(v.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),r.identity(),a.copy(v.matrixWorld),a.premultiply(m),r.extractRotation(a),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(r),_.halfHeight.applyMatrix4(r),g++}else if(v.isPointLight){const _=n.point[u];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),u++}else if(v.isHemisphereLight){const _=n.hemi[x];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(m),x++}}}return{setup:o,setupView:l,state:n}}function So(i){const e=new Cf(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function a(h){t.push(h)}function r(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:r}}function Pf(i){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new So(i),e.set(s,[o])):a>=r.length?(o=new So(i),r.push(o)):o=r[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class Lf extends ui{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=hc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Df extends ui{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const If=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kf=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Uf(i,e,t){let n=new tr;const s=new Se,a=new Se,r=new je,o=new Lf({depthPacking:uc}),l=new Df,c={},h=t.maxTextureSize,d={[xn]:bt,[bt]:xn,[Qt]:Qt},u=new an({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Se},radius:{value:4}},vertexShader:If,fragmentShader:kf}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new vt;g.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Ae(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Do;let p=this.type;this.render=function(A,R,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),F=i.state;F.setBlending(vn),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const N=p!==Zt&&this.type===Zt,W=p===Zt&&this.type!==Zt;for(let X=0,H=A.length;X<H;X++){const J=A[X],G=J.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const te=G.getFrameExtents();if(s.multiply(te),a.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/te.x),s.x=a.x*te.x,G.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/te.y),s.y=a.y*te.y,G.mapSize.y=a.y)),G.map===null||N===!0||W===!0){const me=this.type!==Zt?{minFilter:zt,magFilter:zt}:{};G.map!==null&&G.map.dispose(),G.map=new Un(s.x,s.y,me),G.map.texture.name=J.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const le=G.getViewportCount();for(let me=0;me<le;me++){const Ue=G.getViewport(me);r.set(a.x*Ue.x,a.y*Ue.y,a.x*Ue.z,a.y*Ue.w),F.viewport(r),G.updateMatrices(J,me),n=G.getFrustum(),_(R,C,G.camera,J,this.type)}G.isPointLightShadow!==!0&&this.type===Zt&&E(G,C),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,S,T)};function E(A,R){const C=e.update(x);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Un(s.x,s.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,C,u,x,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,C,f,x,null)}function v(A,R,C,b){let S=null;const T=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(T!==void 0)S=T;else if(S=C.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const F=S.uuid,N=R.uuid;let W=c[F];W===void 0&&(W={},c[F]=W);let X=W[N];X===void 0&&(X=S.clone(),W[N]=X,R.addEventListener("dispose",L)),S=X}if(S.visible=R.visible,S.wireframe=R.wireframe,b===Zt?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:d[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=i.properties.get(S);F.light=C}return S}function _(A,R,C,b,S){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===Zt)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);const N=e.update(A),W=A.material;if(Array.isArray(W)){const X=N.groups;for(let H=0,J=X.length;H<J;H++){const G=X[H],te=W[G.materialIndex];if(te&&te.visible){const le=v(A,te,b,S);A.onBeforeShadow(i,A,R,C,N,le,G),i.renderBufferDirect(C,null,N,le,A,G),A.onAfterShadow(i,A,R,C,N,le,G)}}}else if(W.visible){const X=v(A,W,b,S);A.onBeforeShadow(i,A,R,C,N,X,null),i.renderBufferDirect(C,null,N,X,A,null),A.onAfterShadow(i,A,R,C,N,X,null)}}const F=A.children;for(let N=0,W=F.length;N<W;N++)_(F[N],R,C,b,S)}function L(A){A.target.removeEventListener("dispose",L);for(const C in c){const b=c[C],S=A.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const Nf={[oa]:la,[ca]:da,[ha]:pa,[ni]:ua,[la]:oa,[da]:ca,[pa]:ha,[ua]:ni};function Ff(i,e){function t(){let D=!1;const ae=new je;let V=null;const $=new je(0,0,0,0);return{setMask:function(ce){V!==ce&&!D&&(i.colorMask(ce,ce,ce,ce),V=ce)},setLocked:function(ce){D=ce},setClear:function(ce,re,Ce,at,pt){pt===!0&&(ce*=at,re*=at,Ce*=at),ae.set(ce,re,Ce,at),$.equals(ae)===!1&&(i.clearColor(ce,re,Ce,at),$.copy(ae))},reset:function(){D=!1,V=null,$.set(-1,0,0,0)}}}function n(){let D=!1,ae=!1,V=null,$=null,ce=null;return{setReversed:function(re){if(ae!==re){const Ce=e.get("EXT_clip_control");ae?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT);const at=ce;ce=null,this.setClear(at)}ae=re},getReversed:function(){return ae},setTest:function(re){re?ne(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(re){V!==re&&!D&&(i.depthMask(re),V=re)},setFunc:function(re){if(ae&&(re=Nf[re]),$!==re){switch(re){case oa:i.depthFunc(i.NEVER);break;case la:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case ni:i.depthFunc(i.LEQUAL);break;case ha:i.depthFunc(i.EQUAL);break;case ua:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case pa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}$=re}},setLocked:function(re){D=re},setClear:function(re){ce!==re&&(ae&&(re=1-re),i.clearDepth(re),ce=re)},reset:function(){D=!1,V=null,$=null,ce=null,ae=!1}}}function s(){let D=!1,ae=null,V=null,$=null,ce=null,re=null,Ce=null,at=null,pt=null;return{setTest:function(Ye){D||(Ye?ne(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(Ye){ae!==Ye&&!D&&(i.stencilMask(Ye),ae=Ye)},setFunc:function(Ye,It,Xt){(V!==Ye||$!==It||ce!==Xt)&&(i.stencilFunc(Ye,It,Xt),V=Ye,$=It,ce=Xt)},setOp:function(Ye,It,Xt){(re!==Ye||Ce!==It||at!==Xt)&&(i.stencilOp(Ye,It,Xt),re=Ye,Ce=It,at=Xt)},setLocked:function(Ye){D=Ye},setClear:function(Ye){pt!==Ye&&(i.clearStencil(Ye),pt=Ye)},reset:function(){D=!1,ae=null,V=null,$=null,ce=null,re=null,Ce=null,at=null,pt=null}}}const a=new t,r=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],g=null,x=!1,m=null,p=null,E=null,v=null,_=null,L=null,A=null,R=new Ne(0,0,0),C=0,b=!1,S=null,T=null,F=null,N=null,W=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,J=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(G)[1]),H=J>=1):G.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),H=J>=2);let te=null,le={};const me=i.getParameter(i.SCISSOR_BOX),Ue=i.getParameter(i.VIEWPORT),Ve=new je().fromArray(me),K=new je().fromArray(Ue);function Z(D,ae,V,$){const ce=new Uint8Array(4),re=i.createTexture();i.bindTexture(D,re),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ce=0;Ce<V;Ce++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(ae,0,i.RGBA,1,1,$,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(ae+Ce,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return re}const pe={};pe[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),pe[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),pe[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),r.setFunc(ni),Fe(!1),ze(Er),ne(i.CULL_FACE),I(vn);function ne(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function be(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function we(D,ae){return d[D]!==ae?(i.bindFramebuffer(D,ae),d[D]=ae,D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ae),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ae),!0):!1}function De(D,ae){let V=f,$=!1;if(D){V=u.get(ae),V===void 0&&(V=[],u.set(ae,V));const ce=D.textures;if(V.length!==ce.length||V[0]!==i.COLOR_ATTACHMENT0){for(let re=0,Ce=ce.length;re<Ce;re++)V[re]=i.COLOR_ATTACHMENT0+re;V.length=ce.length,$=!0}}else V[0]!==i.BACK&&(V[0]=i.BACK,$=!0);$&&i.drawBuffers(V)}function Qe(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Oe={[Cn]:i.FUNC_ADD,[Bl]:i.FUNC_SUBTRACT,[Ol]:i.FUNC_REVERSE_SUBTRACT};Oe[zl]=i.MIN,Oe[Gl]=i.MAX;const st={[Hl]:i.ZERO,[Vl]:i.ONE,[Wl]:i.SRC_COLOR,[aa]:i.SRC_ALPHA,[jl]:i.SRC_ALPHA_SATURATE,[Yl]:i.DST_COLOR,[ql]:i.DST_ALPHA,[Xl]:i.ONE_MINUS_SRC_COLOR,[ra]:i.ONE_MINUS_SRC_ALPHA,[$l]:i.ONE_MINUS_DST_COLOR,[Kl]:i.ONE_MINUS_DST_ALPHA,[Jl]:i.CONSTANT_COLOR,[Zl]:i.ONE_MINUS_CONSTANT_COLOR,[Ql]:i.CONSTANT_ALPHA,[ec]:i.ONE_MINUS_CONSTANT_ALPHA};function I(D,ae,V,$,ce,re,Ce,at,pt,Ye){if(D===vn){x===!0&&(be(i.BLEND),x=!1);return}if(x===!1&&(ne(i.BLEND),x=!0),D!==Fl){if(D!==m||Ye!==b){if((p!==Cn||_!==Cn)&&(i.blendEquation(i.FUNC_ADD),p=Cn,_=Cn),Ye)switch(D){case Qn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sa:i.blendFunc(i.ONE,i.ONE);break;case wr:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Tr:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Qn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case wr:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Tr:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}E=null,v=null,L=null,A=null,R.set(0,0,0),C=0,m=D,b=Ye}return}ce=ce||ae,re=re||V,Ce=Ce||$,(ae!==p||ce!==_)&&(i.blendEquationSeparate(Oe[ae],Oe[ce]),p=ae,_=ce),(V!==E||$!==v||re!==L||Ce!==A)&&(i.blendFuncSeparate(st[V],st[$],st[re],st[Ce]),E=V,v=$,L=re,A=Ce),(at.equals(R)===!1||pt!==C)&&(i.blendColor(at.r,at.g,at.b,pt),R.copy(at),C=pt),m=D,b=!1}function Mt(D,ae){D.side===Qt?be(i.CULL_FACE):ne(i.CULL_FACE);let V=D.side===bt;ae&&(V=!V),Fe(V),D.blending===Qn&&D.transparent===!1?I(vn):I(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),a.setMask(D.colorWrite);const $=D.stencilWrite;o.setTest($),$&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Xe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(D){S!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),S=D)}function ze(D){D!==kl?(ne(i.CULL_FACE),D!==T&&(D===Er?i.cullFace(i.BACK):D===Ul?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),T=D}function ye(D){D!==F&&(H&&i.lineWidth(D),F=D)}function Xe(D,ae,V){D?(ne(i.POLYGON_OFFSET_FILL),(N!==ae||W!==V)&&(i.polygonOffset(ae,V),N=ae,W=V)):be(i.POLYGON_OFFSET_FILL)}function xe(D){D?ne(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function w(D){D===void 0&&(D=i.TEXTURE0+X-1),te!==D&&(i.activeTexture(D),te=D)}function M(D,ae,V){V===void 0&&(te===null?V=i.TEXTURE0+X-1:V=te);let $=le[V];$===void 0&&($={type:void 0,texture:void 0},le[V]=$),($.type!==D||$.texture!==ae)&&(te!==V&&(i.activeTexture(V),te=V),i.bindTexture(D,ae||pe[D]),$.type=D,$.texture=ae)}function B(){const D=le[te];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Y(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function fe(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function he(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Be(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ue(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Te(D){Ve.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Ve.copy(D))}function de(D){K.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),K.copy(D))}function Ge(D,ae){let V=c.get(ae);V===void 0&&(V=new WeakMap,c.set(ae,V));let $=V.get(D);$===void 0&&($=i.getUniformBlockIndex(ae,D.name),V.set(D,$))}function Ie(D,ae){const $=c.get(ae).get(D);l.get(ae)!==$&&(i.uniformBlockBinding(ae,$,D.__bindingPointIndex),l.set(ae,$))}function Je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},te=null,le={},d={},u=new WeakMap,f=[],g=null,x=!1,m=null,p=null,E=null,v=null,_=null,L=null,A=null,R=new Ne(0,0,0),C=0,b=!1,S=null,T=null,F=null,N=null,W=null,Ve.set(0,0,i.canvas.width,i.canvas.height),K.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:ne,disable:be,bindFramebuffer:we,drawBuffers:De,useProgram:Qe,setBlending:I,setMaterial:Mt,setFlipSided:Fe,setCullFace:ze,setLineWidth:ye,setPolygonOffset:Xe,setScissorTest:xe,activeTexture:w,bindTexture:M,unbindTexture:B,compressedTexImage2D:Y,compressedTexImage3D:j,texImage2D:ue,texImage3D:Ee,updateUBOMapping:Ge,uniformBlockBinding:Ie,texStorage2D:Be,texStorage3D:Q,texSubImage2D:q,texSubImage3D:fe,compressedTexSubImage2D:ie,compressedTexSubImage3D:he,scissor:Te,viewport:de,reset:Je}}function yo(i,e,t,n){const s=Bf(n);switch(t){case Bo:return i*e;case zo:return i*e;case Go:return i*e*2;case Ho:return i*e/s.components*s.byteLength;case Ja:return i*e/s.components*s.byteLength;case Vo:return i*e*2/s.components*s.byteLength;case Za:return i*e*2/s.components*s.byteLength;case Oo:return i*e*3/s.components*s.byteLength;case Ot:return i*e*4/s.components*s.byteLength;case Qa:return i*e*4/s.components*s.byteLength;case os:case ls:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case cs:case hs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xa:case Sa:return Math.max(i,16)*Math.max(e,8)/4;case _a:case Ma:return Math.max(i,8)*Math.max(e,8)/2;case ya:case ba:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ta:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Aa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ra:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case La:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Da:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ka:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Na:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Fa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ba:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case us:case Oa:case za:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Wo:case Ga:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ha:case Va:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Bf(i){switch(i){case sn:case Uo:return{byteLength:1,components:1};case Ci:case No:case Li:return{byteLength:2,components:1};case $a:case ja:return{byteLength:2,components:4};case kn:case Ya:case en:return{byteLength:4,components:1};case Fo:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Of(i,e,t,n,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Se,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,M){return f?new OffscreenCanvas(w,M):fs("canvas")}function x(w,M,B){let Y=1;const j=xe(w);if((j.width>B||j.height>B)&&(Y=B/Math.max(j.width,j.height)),Y<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const q=Math.floor(Y*j.width),fe=Math.floor(Y*j.height);d===void 0&&(d=g(q,fe));const ie=M?g(q,fe):d;return ie.width=q,ie.height=fe,ie.getContext("2d").drawImage(w,0,0,q,fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+q+"x"+fe+")."),ie}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){i.generateMipmap(w)}function E(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,M,B,Y,j=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let q=M;if(M===i.RED&&(B===i.FLOAT&&(q=i.R32F),B===i.HALF_FLOAT&&(q=i.R16F),B===i.UNSIGNED_BYTE&&(q=i.R8)),M===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.R8UI),B===i.UNSIGNED_SHORT&&(q=i.R16UI),B===i.UNSIGNED_INT&&(q=i.R32UI),B===i.BYTE&&(q=i.R8I),B===i.SHORT&&(q=i.R16I),B===i.INT&&(q=i.R32I)),M===i.RG&&(B===i.FLOAT&&(q=i.RG32F),B===i.HALF_FLOAT&&(q=i.RG16F),B===i.UNSIGNED_BYTE&&(q=i.RG8)),M===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RG8UI),B===i.UNSIGNED_SHORT&&(q=i.RG16UI),B===i.UNSIGNED_INT&&(q=i.RG32UI),B===i.BYTE&&(q=i.RG8I),B===i.SHORT&&(q=i.RG16I),B===i.INT&&(q=i.RG32I)),M===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RGB8UI),B===i.UNSIGNED_SHORT&&(q=i.RGB16UI),B===i.UNSIGNED_INT&&(q=i.RGB32UI),B===i.BYTE&&(q=i.RGB8I),B===i.SHORT&&(q=i.RGB16I),B===i.INT&&(q=i.RGB32I)),M===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),B===i.UNSIGNED_INT&&(q=i.RGBA32UI),B===i.BYTE&&(q=i.RGBA8I),B===i.SHORT&&(q=i.RGBA16I),B===i.INT&&(q=i.RGBA32I)),M===i.RGB&&B===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),M===i.RGBA){const fe=j?vs:He.getTransfer(Y);B===i.FLOAT&&(q=i.RGBA32F),B===i.HALF_FLOAT&&(q=i.RGBA16F),B===i.UNSIGNED_BYTE&&(q=fe===$e?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function _(w,M){let B;return w?M===null||M===kn||M===ai?B=i.DEPTH24_STENCIL8:M===en?B=i.DEPTH32F_STENCIL8:M===Ci&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===kn||M===ai?B=i.DEPTH_COMPONENT24:M===en?B=i.DEPTH_COMPONENT32F:M===Ci&&(B=i.DEPTH_COMPONENT16),B}function L(w,M){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==zt&&w.minFilter!==Vt?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function A(w){const M=w.target;M.removeEventListener("dispose",A),C(M),M.isVideoTexture&&h.delete(M)}function R(w){const M=w.target;M.removeEventListener("dispose",R),S(M)}function C(w){const M=n.get(w);if(M.__webglInit===void 0)return;const B=w.source,Y=u.get(B);if(Y){const j=Y[M.__cacheKey];j.usedTimes--,j.usedTimes===0&&b(w),Object.keys(Y).length===0&&u.delete(B)}n.remove(w)}function b(w){const M=n.get(w);i.deleteTexture(M.__webglTexture);const B=w.source,Y=u.get(B);delete Y[M.__cacheKey],r.memory.textures--}function S(w){const M=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(M.__webglFramebuffer[Y]))for(let j=0;j<M.__webglFramebuffer[Y].length;j++)i.deleteFramebuffer(M.__webglFramebuffer[Y][j]);else i.deleteFramebuffer(M.__webglFramebuffer[Y]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[Y])}else{if(Array.isArray(M.__webglFramebuffer))for(let Y=0;Y<M.__webglFramebuffer.length;Y++)i.deleteFramebuffer(M.__webglFramebuffer[Y]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Y=0;Y<M.__webglColorRenderbuffer.length;Y++)M.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[Y]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const B=w.textures;for(let Y=0,j=B.length;Y<j;Y++){const q=n.get(B[Y]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),r.memory.textures--),n.remove(B[Y])}n.remove(w)}let T=0;function F(){T=0}function N(){const w=T;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),T+=1,w}function W(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function X(w,M){const B=n.get(w);if(w.isVideoTexture&&ye(w),w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){const Y=w.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(B,w,M);return}}t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+M)}function H(w,M){const B=n.get(w);if(w.version>0&&B.__version!==w.version){K(B,w,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+M)}function J(w,M){const B=n.get(w);if(w.version>0&&B.__version!==w.version){K(B,w,M);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+M)}function G(w,M){const B=n.get(w);if(w.version>0&&B.__version!==w.version){Z(B,w,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+M)}const te={[ga]:i.REPEAT,[Dn]:i.CLAMP_TO_EDGE,[va]:i.MIRRORED_REPEAT},le={[zt]:i.NEAREST,[cc]:i.NEAREST_MIPMAP_NEAREST,[Fi]:i.NEAREST_MIPMAP_LINEAR,[Vt]:i.LINEAR,[bs]:i.LINEAR_MIPMAP_NEAREST,[In]:i.LINEAR_MIPMAP_LINEAR},me={[pc]:i.NEVER,[xc]:i.ALWAYS,[fc]:i.LESS,[qo]:i.LEQUAL,[mc]:i.EQUAL,[_c]:i.GEQUAL,[gc]:i.GREATER,[vc]:i.NOTEQUAL};function Ue(w,M){if(M.type===en&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Vt||M.magFilter===bs||M.magFilter===Fi||M.magFilter===In||M.minFilter===Vt||M.minFilter===bs||M.minFilter===Fi||M.minFilter===In)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,te[M.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,te[M.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,te[M.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,le[M.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,le[M.minFilter]),M.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,me[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===zt||M.minFilter!==Fi&&M.minFilter!==In||M.type===en&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Ve(w,M){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",A));const Y=M.source;let j=u.get(Y);j===void 0&&(j={},u.set(Y,j));const q=W(M);if(q!==w.__cacheKey){j[q]===void 0&&(j[q]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,B=!0),j[q].usedTimes++;const fe=j[w.__cacheKey];fe!==void 0&&(j[w.__cacheKey].usedTimes--,fe.usedTimes===0&&b(M)),w.__cacheKey=q,w.__webglTexture=j[q].texture}return B}function K(w,M,B){let Y=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Y=i.TEXTURE_3D);const j=Ve(w,M),q=M.source;t.bindTexture(Y,w.__webglTexture,i.TEXTURE0+B);const fe=n.get(q);if(q.version!==fe.__version||j===!0){t.activeTexture(i.TEXTURE0+B);const ie=He.getPrimaries(He.workingColorSpace),he=M.colorSpace===gn?null:He.getPrimaries(M.colorSpace),Be=M.colorSpace===gn||ie===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);let Q=x(M.image,!1,s.maxTextureSize);Q=Xe(M,Q);const ue=a.convert(M.format,M.colorSpace),Ee=a.convert(M.type);let Te=v(M.internalFormat,ue,Ee,M.colorSpace,M.isVideoTexture);Ue(Y,M);let de;const Ge=M.mipmaps,Ie=M.isVideoTexture!==!0,Je=fe.__version===void 0||j===!0,D=q.dataReady,ae=L(M,Q);if(M.isDepthTexture)Te=_(M.format===ri,M.type),Je&&(Ie?t.texStorage2D(i.TEXTURE_2D,1,Te,Q.width,Q.height):t.texImage2D(i.TEXTURE_2D,0,Te,Q.width,Q.height,0,ue,Ee,null));else if(M.isDataTexture)if(Ge.length>0){Ie&&Je&&t.texStorage2D(i.TEXTURE_2D,ae,Te,Ge[0].width,Ge[0].height);for(let V=0,$=Ge.length;V<$;V++)de=Ge[V],Ie?D&&t.texSubImage2D(i.TEXTURE_2D,V,0,0,de.width,de.height,ue,Ee,de.data):t.texImage2D(i.TEXTURE_2D,V,Te,de.width,de.height,0,ue,Ee,de.data);M.generateMipmaps=!1}else Ie?(Je&&t.texStorage2D(i.TEXTURE_2D,ae,Te,Q.width,Q.height),D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Q.width,Q.height,ue,Ee,Q.data)):t.texImage2D(i.TEXTURE_2D,0,Te,Q.width,Q.height,0,ue,Ee,Q.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ie&&Je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,Te,Ge[0].width,Ge[0].height,Q.depth);for(let V=0,$=Ge.length;V<$;V++)if(de=Ge[V],M.format!==Ot)if(ue!==null)if(Ie){if(D)if(M.layerUpdates.size>0){const ce=yo(de.width,de.height,M.format,M.type);for(const re of M.layerUpdates){const Ce=de.data.subarray(re*ce/de.data.BYTES_PER_ELEMENT,(re+1)*ce/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,re,de.width,de.height,1,ue,Ce)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,de.width,de.height,Q.depth,ue,de.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,V,Te,de.width,de.height,Q.depth,0,de.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?D&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,de.width,de.height,Q.depth,ue,Ee,de.data):t.texImage3D(i.TEXTURE_2D_ARRAY,V,Te,de.width,de.height,Q.depth,0,ue,Ee,de.data)}else{Ie&&Je&&t.texStorage2D(i.TEXTURE_2D,ae,Te,Ge[0].width,Ge[0].height);for(let V=0,$=Ge.length;V<$;V++)de=Ge[V],M.format!==Ot?ue!==null?Ie?D&&t.compressedTexSubImage2D(i.TEXTURE_2D,V,0,0,de.width,de.height,ue,de.data):t.compressedTexImage2D(i.TEXTURE_2D,V,Te,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?D&&t.texSubImage2D(i.TEXTURE_2D,V,0,0,de.width,de.height,ue,Ee,de.data):t.texImage2D(i.TEXTURE_2D,V,Te,de.width,de.height,0,ue,Ee,de.data)}else if(M.isDataArrayTexture)if(Ie){if(Je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,Te,Q.width,Q.height,Q.depth),D)if(M.layerUpdates.size>0){const V=yo(Q.width,Q.height,M.format,M.type);for(const $ of M.layerUpdates){const ce=Q.data.subarray($*V/Q.data.BYTES_PER_ELEMENT,($+1)*V/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,Q.width,Q.height,1,ue,Ee,ce)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ue,Ee,Q.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Te,Q.width,Q.height,Q.depth,0,ue,Ee,Q.data);else if(M.isData3DTexture)Ie?(Je&&t.texStorage3D(i.TEXTURE_3D,ae,Te,Q.width,Q.height,Q.depth),D&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ue,Ee,Q.data)):t.texImage3D(i.TEXTURE_3D,0,Te,Q.width,Q.height,Q.depth,0,ue,Ee,Q.data);else if(M.isFramebufferTexture){if(Je)if(Ie)t.texStorage2D(i.TEXTURE_2D,ae,Te,Q.width,Q.height);else{let V=Q.width,$=Q.height;for(let ce=0;ce<ae;ce++)t.texImage2D(i.TEXTURE_2D,ce,Te,V,$,0,ue,Ee,null),V>>=1,$>>=1}}else if(Ge.length>0){if(Ie&&Je){const V=xe(Ge[0]);t.texStorage2D(i.TEXTURE_2D,ae,Te,V.width,V.height)}for(let V=0,$=Ge.length;V<$;V++)de=Ge[V],Ie?D&&t.texSubImage2D(i.TEXTURE_2D,V,0,0,ue,Ee,de):t.texImage2D(i.TEXTURE_2D,V,Te,ue,Ee,de);M.generateMipmaps=!1}else if(Ie){if(Je){const V=xe(Q);t.texStorage2D(i.TEXTURE_2D,ae,Te,V.width,V.height)}D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,Ee,Q)}else t.texImage2D(i.TEXTURE_2D,0,Te,ue,Ee,Q);m(M)&&p(Y),fe.__version=q.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function Z(w,M,B){if(M.image.length!==6)return;const Y=Ve(w,M),j=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+B);const q=n.get(j);if(j.version!==q.__version||Y===!0){t.activeTexture(i.TEXTURE0+B);const fe=He.getPrimaries(He.workingColorSpace),ie=M.colorSpace===gn?null:He.getPrimaries(M.colorSpace),he=M.colorSpace===gn||fe===ie?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const Be=M.isCompressedTexture||M.image[0].isCompressedTexture,Q=M.image[0]&&M.image[0].isDataTexture,ue=[];for(let $=0;$<6;$++)!Be&&!Q?ue[$]=x(M.image[$],!0,s.maxCubemapSize):ue[$]=Q?M.image[$].image:M.image[$],ue[$]=Xe(M,ue[$]);const Ee=ue[0],Te=a.convert(M.format,M.colorSpace),de=a.convert(M.type),Ge=v(M.internalFormat,Te,de,M.colorSpace),Ie=M.isVideoTexture!==!0,Je=q.__version===void 0||Y===!0,D=j.dataReady;let ae=L(M,Ee);Ue(i.TEXTURE_CUBE_MAP,M);let V;if(Be){Ie&&Je&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Ge,Ee.width,Ee.height);for(let $=0;$<6;$++){V=ue[$].mipmaps;for(let ce=0;ce<V.length;ce++){const re=V[ce];M.format!==Ot?Te!==null?Ie?D&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,0,0,re.width,re.height,Te,re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,Ge,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,0,0,re.width,re.height,Te,de,re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce,Ge,re.width,re.height,0,Te,de,re.data)}}}else{if(V=M.mipmaps,Ie&&Je){V.length>0&&ae++;const $=xe(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Ge,$.width,$.height)}for(let $=0;$<6;$++)if(Q){Ie?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ue[$].width,ue[$].height,Te,de,ue[$].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ge,ue[$].width,ue[$].height,0,Te,de,ue[$].data);for(let ce=0;ce<V.length;ce++){const Ce=V[ce].image[$].image;Ie?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,0,0,Ce.width,Ce.height,Te,de,Ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,Ge,Ce.width,Ce.height,0,Te,de,Ce.data)}}else{Ie?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Te,de,ue[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ge,Te,de,ue[$]);for(let ce=0;ce<V.length;ce++){const re=V[ce];Ie?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,0,0,Te,de,re.image[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ce+1,Ge,Te,de,re.image[$])}}}m(M)&&p(i.TEXTURE_CUBE_MAP),q.__version=j.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function pe(w,M,B,Y,j,q){const fe=a.convert(B.format,B.colorSpace),ie=a.convert(B.type),he=v(B.internalFormat,fe,ie,B.colorSpace),Be=n.get(M),Q=n.get(B);if(Q.__renderTarget=M,!Be.__hasExternalTextures){const ue=Math.max(1,M.width>>q),Ee=Math.max(1,M.height>>q);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?t.texImage3D(j,q,he,ue,Ee,M.depth,0,fe,ie,null):t.texImage2D(j,q,he,ue,Ee,0,fe,ie,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),ze(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,j,Q.__webglTexture,0,Fe(M)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,j,Q.__webglTexture,q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ne(w,M,B){if(i.bindRenderbuffer(i.RENDERBUFFER,w),M.depthBuffer){const Y=M.depthTexture,j=Y&&Y.isDepthTexture?Y.type:null,q=_(M.stencilBuffer,j),fe=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=Fe(M);ze(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ie,q,M.width,M.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,ie,q,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,q,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,fe,i.RENDERBUFFER,w)}else{const Y=M.textures;for(let j=0;j<Y.length;j++){const q=Y[j],fe=a.convert(q.format,q.colorSpace),ie=a.convert(q.type),he=v(q.internalFormat,fe,ie,q.colorSpace),Be=Fe(M);B&&ze(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,he,M.width,M.height):ze(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Be,he,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,he,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function be(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(M.depthTexture);Y.__renderTarget=M,(!Y.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),X(M.depthTexture,0);const j=Y.__webglTexture,q=Fe(M);if(M.depthTexture.format===ei)ze(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(M.depthTexture.format===ri)ze(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function we(w){const M=n.get(w),B=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const Y=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Y){const j=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Y.removeEventListener("dispose",j)};Y.addEventListener("dispose",j),M.__depthDisposeCallback=j}M.__boundDepthTexture=Y}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");be(M.__webglFramebuffer,w)}else if(B){M.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[Y]),M.__webglDepthbuffer[Y]===void 0)M.__webglDepthbuffer[Y]=i.createRenderbuffer(),ne(M.__webglDepthbuffer[Y],w,!1);else{const j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=M.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,q)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),ne(M.__webglDepthbuffer,w,!1);else{const Y=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,j)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function De(w,M,B){const Y=n.get(w);M!==void 0&&pe(Y.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&we(w)}function Qe(w){const M=w.texture,B=n.get(w),Y=n.get(M);w.addEventListener("dispose",R);const j=w.textures,q=w.isWebGLCubeRenderTarget===!0,fe=j.length>1;if(fe||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=M.version,r.memory.textures++),q){B.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0){B.__webglFramebuffer[ie]=[];for(let he=0;he<M.mipmaps.length;he++)B.__webglFramebuffer[ie][he]=i.createFramebuffer()}else B.__webglFramebuffer[ie]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){B.__webglFramebuffer=[];for(let ie=0;ie<M.mipmaps.length;ie++)B.__webglFramebuffer[ie]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(fe)for(let ie=0,he=j.length;ie<he;ie++){const Be=n.get(j[ie]);Be.__webglTexture===void 0&&(Be.__webglTexture=i.createTexture(),r.memory.textures++)}if(w.samples>0&&ze(w)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ie=0;ie<j.length;ie++){const he=j[ie];B.__webglColorRenderbuffer[ie]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[ie]);const Be=a.convert(he.format,he.colorSpace),Q=a.convert(he.type),ue=v(he.internalFormat,Be,Q,he.colorSpace,w.isXRRenderTarget===!0),Ee=Fe(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ee,ue,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,B.__webglColorRenderbuffer[ie])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),ne(B.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Ue(i.TEXTURE_CUBE_MAP,M);for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0)for(let he=0;he<M.mipmaps.length;he++)pe(B.__webglFramebuffer[ie][he],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,he);else pe(B.__webglFramebuffer[ie],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(M)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(fe){for(let ie=0,he=j.length;ie<he;ie++){const Be=j[ie],Q=n.get(Be);t.bindTexture(i.TEXTURE_2D,Q.__webglTexture),Ue(i.TEXTURE_2D,Be),pe(B.__webglFramebuffer,w,Be,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,0),m(Be)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let ie=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ie=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,Y.__webglTexture),Ue(ie,M),M.mipmaps&&M.mipmaps.length>0)for(let he=0;he<M.mipmaps.length;he++)pe(B.__webglFramebuffer[he],w,M,i.COLOR_ATTACHMENT0,ie,he);else pe(B.__webglFramebuffer,w,M,i.COLOR_ATTACHMENT0,ie,0);m(M)&&p(ie),t.unbindTexture()}w.depthBuffer&&we(w)}function Oe(w){const M=w.textures;for(let B=0,Y=M.length;B<Y;B++){const j=M[B];if(m(j)){const q=E(w),fe=n.get(j).__webglTexture;t.bindTexture(q,fe),p(q),t.unbindTexture()}}}const st=[],I=[];function Mt(w){if(w.samples>0){if(ze(w)===!1){const M=w.textures,B=w.width,Y=w.height;let j=i.COLOR_BUFFER_BIT;const q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=n.get(w),ie=M.length>1;if(ie)for(let he=0;he<M.length;he++)t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let he=0;he<M.length;he++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),ie){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,fe.__webglColorRenderbuffer[he]);const Be=n.get(M[he]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Be,0)}i.blitFramebuffer(0,0,B,Y,0,0,B,Y,j,i.NEAREST),l===!0&&(st.length=0,I.length=0,st.push(i.COLOR_ATTACHMENT0+he),w.depthBuffer&&w.resolveDepthBuffer===!1&&(st.push(q),I.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ie)for(let he=0;he<M.length;he++){t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,fe.__webglColorRenderbuffer[he]);const Be=n.get(M[he]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,Be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const M=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Fe(w){return Math.min(s.maxSamples,w.samples)}function ze(w){const M=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ye(w){const M=r.render.frame;h.get(w)!==M&&(h.set(w,M),w.update())}function Xe(w,M){const B=w.colorSpace,Y=w.format,j=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==li&&B!==gn&&(He.getTransfer(B)===$e?(Y!==Ot||j!==sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),M}function xe(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=H,this.setTexture3D=J,this.setTextureCube=G,this.rebindTextures=De,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=Mt,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=ze}function zf(i,e){function t(n,s=gn){let a;const r=He.getTransfer(s);if(n===sn)return i.UNSIGNED_BYTE;if(n===$a)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ja)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Fo)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Uo)return i.BYTE;if(n===No)return i.SHORT;if(n===Ci)return i.UNSIGNED_SHORT;if(n===Ya)return i.INT;if(n===kn)return i.UNSIGNED_INT;if(n===en)return i.FLOAT;if(n===Li)return i.HALF_FLOAT;if(n===Bo)return i.ALPHA;if(n===Oo)return i.RGB;if(n===Ot)return i.RGBA;if(n===zo)return i.LUMINANCE;if(n===Go)return i.LUMINANCE_ALPHA;if(n===ei)return i.DEPTH_COMPONENT;if(n===ri)return i.DEPTH_STENCIL;if(n===Ho)return i.RED;if(n===Ja)return i.RED_INTEGER;if(n===Vo)return i.RG;if(n===Za)return i.RG_INTEGER;if(n===Qa)return i.RGBA_INTEGER;if(n===os||n===ls||n===cs||n===hs)if(r===$e)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===os)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ls)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===cs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===hs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===os)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ls)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===cs)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===hs)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===_a||n===xa||n===Ma||n===Sa)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===_a)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xa)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ma)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Sa)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ya||n===ba||n===Ea)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===ya||n===ba)return r===$e?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Ea)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===wa||n===Ta||n===Aa||n===Ra||n===Ca||n===Pa||n===La||n===Da||n===Ia||n===ka||n===Ua||n===Na||n===Fa||n===Ba)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===wa)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ta)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Aa)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ra)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ca)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Pa)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===La)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Da)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ia)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ka)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ua)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Na)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fa)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ba)return r===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===us||n===Oa||n===za)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===us)return r===$e?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Oa)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===za)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Wo||n===Ga||n===Ha||n===Va)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===us)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Ga)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ha)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Va)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ai?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Gf extends yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ut extends dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hf={type:"move"};class js{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ut,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ut,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ut,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ut;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Vf=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Wf=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Xf{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Et,a=e.properties.get(s);a.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new an({vertexShader:Vf,fragmentShader:Wf,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ae(new xs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class qf extends ci{constructor(e,t){super();const n=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const x=new Xf,m=t.getContextAttributes();let p=null,E=null;const v=[],_=[],L=new Se;let A=null;const R=new yt;R.viewport=new je;const C=new yt;C.viewport=new je;const b=[R,C],S=new Gf;let T=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let Z=v[K];return Z===void 0&&(Z=new js,v[K]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(K){let Z=v[K];return Z===void 0&&(Z=new js,v[K]=Z),Z.getGripSpace()},this.getHand=function(K){let Z=v[K];return Z===void 0&&(Z=new js,v[K]=Z),Z.getHandSpace()};function N(K){const Z=_.indexOf(K.inputSource);if(Z===-1)return;const pe=v[Z];pe!==void 0&&(pe.update(K.inputSource,K.frame,c||r),pe.dispatchEvent({type:K.type,data:K.inputSource}))}function W(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",X);for(let K=0;K<v.length;K++){const Z=_[K];Z!==null&&(_[K]=null,v[K].disconnect(Z))}T=null,F=null,x.reset(),e.setRenderTarget(p),f=null,u=null,d=null,s=null,E=null,Ve.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",W),s.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(L),s.renderState.layers===void 0){const Z={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),E=new Un(f.framebufferWidth,f.framebufferHeight,{format:Ot,type:sn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let Z=null,pe=null,ne=null;m.depth&&(ne=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=m.stencil?ri:ei,pe=m.stencil?ai:kn);const be={colorFormat:t.RGBA8,depthFormat:ne,scaleFactor:a};d=new XRWebGLBinding(s,t),u=d.createProjectionLayer(be),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),E=new Un(u.textureWidth,u.textureHeight,{format:Ot,type:sn,depthTexture:new rl(u.textureWidth,u.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Ve.setContext(s),Ve.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function X(K){for(let Z=0;Z<K.removed.length;Z++){const pe=K.removed[Z],ne=_.indexOf(pe);ne>=0&&(_[ne]=null,v[ne].disconnect(pe))}for(let Z=0;Z<K.added.length;Z++){const pe=K.added[Z];let ne=_.indexOf(pe);if(ne===-1){for(let we=0;we<v.length;we++)if(we>=_.length){_.push(pe),ne=we;break}else if(_[we]===null){_[we]=pe,ne=we;break}if(ne===-1)break}const be=v[ne];be&&be.connect(pe)}}const H=new P,J=new P;function G(K,Z,pe){H.setFromMatrixPosition(Z.matrixWorld),J.setFromMatrixPosition(pe.matrixWorld);const ne=H.distanceTo(J),be=Z.projectionMatrix.elements,we=pe.projectionMatrix.elements,De=be[14]/(be[10]-1),Qe=be[14]/(be[10]+1),Oe=(be[9]+1)/be[5],st=(be[9]-1)/be[5],I=(be[8]-1)/be[0],Mt=(we[8]+1)/we[0],Fe=De*I,ze=De*Mt,ye=ne/(-I+Mt),Xe=ye*-I;if(Z.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Xe),K.translateZ(ye),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),be[10]===-1)K.projectionMatrix.copy(Z.projectionMatrix),K.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const xe=De+ye,w=Qe+ye,M=Fe-Xe,B=ze+(ne-Xe),Y=Oe*Qe/w*xe,j=st*Qe/w*xe;K.projectionMatrix.makePerspective(M,B,Y,j,xe,w),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function te(K,Z){Z===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(Z.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let Z=K.near,pe=K.far;x.texture!==null&&(x.depthNear>0&&(Z=x.depthNear),x.depthFar>0&&(pe=x.depthFar)),S.near=C.near=R.near=Z,S.far=C.far=R.far=pe,(T!==S.near||F!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),T=S.near,F=S.far),R.layers.mask=K.layers.mask|2,C.layers.mask=K.layers.mask|4,S.layers.mask=R.layers.mask|C.layers.mask;const ne=K.parent,be=S.cameras;te(S,ne);for(let we=0;we<be.length;we++)te(be[we],ne);be.length===2?G(S,R,C):S.projectionMatrix.copy(R.projectionMatrix),le(K,S,ne)};function le(K,Z,pe){pe===null?K.matrix.copy(Z.matrixWorld):(K.matrix.copy(pe.matrixWorld),K.matrix.invert(),K.matrix.multiply(Z.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(Z.projectionMatrix),K.projectionMatrixInverse.copy(Z.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Pi*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(S)};let me=null;function Ue(K,Z){if(h=Z.getViewerPose(c||r),g=Z,h!==null){const pe=h.views;f!==null&&(e.setRenderTargetFramebuffer(E,f.framebuffer),e.setRenderTarget(E));let ne=!1;pe.length!==S.cameras.length&&(S.cameras.length=0,ne=!0);for(let we=0;we<pe.length;we++){const De=pe[we];let Qe=null;if(f!==null)Qe=f.getViewport(De);else{const st=d.getViewSubImage(u,De);Qe=st.viewport,we===0&&(e.setRenderTargetTextures(E,st.colorTexture,u.ignoreDepthValues?void 0:st.depthStencilTexture),e.setRenderTarget(E))}let Oe=b[we];Oe===void 0&&(Oe=new yt,Oe.layers.enable(we),Oe.viewport=new je,b[we]=Oe),Oe.matrix.fromArray(De.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(De.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),we===0&&(S.matrix.copy(Oe.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ne===!0&&S.cameras.push(Oe)}const be=s.enabledFeatures;if(be&&be.includes("depth-sensing")){const we=d.getDepthInformation(pe[0]);we&&we.isValid&&we.texture&&x.init(e,we,s.renderState)}}for(let pe=0;pe<v.length;pe++){const ne=_[pe],be=v[pe];ne!==null&&be!==void 0&&be.update(ne,Z,c||r)}me&&me(K,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Ve=new sl;Ve.setAnimationLoop(Ue),this.setAnimationLoop=function(K){me=K},this.dispose=function(){}}}const Tn=new Wt,Kf=new nt;function Yf(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,tl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,E,v,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),d(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),x(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,E,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===bt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===bt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const E=e.get(p),v=E.envMap,_=E.envMapRotation;v&&(m.envMap.value=v,Tn.copy(_),Tn.x*=-1,Tn.y*=-1,Tn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Tn.y*=-1,Tn.z*=-1),m.envMapRotation.value.setFromMatrix4(Kf.makeRotationFromEuler(Tn)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,E,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===bt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const E=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function $f(i,e,t,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,v){const _=v.program;n.uniformBlockBinding(E,_)}function c(E,v){let _=s[E.id];_===void 0&&(g(E),_=h(E),s[E.id]=_,E.addEventListener("dispose",m));const L=v.program;n.updateUBOMapping(E,L);const A=e.render.frame;a[E.id]!==A&&(u(E),a[E.id]=A)}function h(E){const v=d();E.__bindingPointIndex=v;const _=i.createBuffer(),L=E.__size,A=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,L,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,_),_}function d(){for(let E=0;E<o;E++)if(r.indexOf(E)===-1)return r.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){const v=s[E.id],_=E.uniforms,L=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,R=_.length;A<R;A++){const C=Array.isArray(_[A])?_[A]:[_[A]];for(let b=0,S=C.length;b<S;b++){const T=C[b];if(f(T,A,b,L)===!0){const F=T.__offset,N=Array.isArray(T.value)?T.value:[T.value];let W=0;for(let X=0;X<N.length;X++){const H=N[X],J=x(H);typeof H=="number"||typeof H=="boolean"?(T.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,F+W,T.__data)):H.isMatrix3?(T.__data[0]=H.elements[0],T.__data[1]=H.elements[1],T.__data[2]=H.elements[2],T.__data[3]=0,T.__data[4]=H.elements[3],T.__data[5]=H.elements[4],T.__data[6]=H.elements[5],T.__data[7]=0,T.__data[8]=H.elements[6],T.__data[9]=H.elements[7],T.__data[10]=H.elements[8],T.__data[11]=0):(H.toArray(T.__data,W),W+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(E,v,_,L){const A=E.value,R=v+"_"+_;if(L[R]===void 0)return typeof A=="number"||typeof A=="boolean"?L[R]=A:L[R]=A.clone(),!0;{const C=L[R];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return L[R]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(E){const v=E.uniforms;let _=0;const L=16;for(let R=0,C=v.length;R<C;R++){const b=Array.isArray(v[R])?v[R]:[v[R]];for(let S=0,T=b.length;S<T;S++){const F=b[S],N=Array.isArray(F.value)?F.value:[F.value];for(let W=0,X=N.length;W<X;W++){const H=N[W],J=x(H),G=_%L,te=G%J.boundary,le=G+te;_+=te,le!==0&&L-le<J.storage&&(_+=L-le),F.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=_,_+=J.storage}}}const A=_%L;return A>0&&(_+=L-A),E.__size=_,E.__cache={},this}function x(E){const v={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(v.boundary=4,v.storage=4):E.isVector2?(v.boundary=8,v.storage=8):E.isVector3||E.isColor?(v.boundary=16,v.storage=12):E.isVector4?(v.boundary=16,v.storage=16):E.isMatrix3?(v.boundary=48,v.storage=48):E.isMatrix4?(v.boundary=64,v.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),v}function m(E){const v=E.target;v.removeEventListener("dispose",m);const _=r.indexOf(v.__bindingPointIndex);r.splice(_,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function p(){for(const E in s)i.deleteBuffer(s[E]);r=[],s={},a={}}return{bind:l,update:c,dispose:p}}class ul{constructor(e={}){const{canvas:t=Fc(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=r;const g=new Uint32Array(4),x=new Int32Array(4);let m=null,p=null;const E=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Lt,this.toneMapping=_n,this.toneMappingExposure=1;const _=this;let L=!1,A=0,R=0,C=null,b=-1,S=null;const T=new je,F=new je;let N=null;const W=new Ne(0);let X=0,H=t.width,J=t.height,G=1,te=null,le=null;const me=new je(0,0,H,J),Ue=new je(0,0,H,J);let Ve=!1;const K=new tr;let Z=!1,pe=!1;const ne=new nt,be=new nt,we=new P,De=new je,Qe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Oe=!1;function st(){return C===null?G:1}let I=n;function Mt(y,k){return t.getContext(y,k)}try{const y={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qa}`),t.addEventListener("webglcontextlost",$,!1),t.addEventListener("webglcontextrestored",ce,!1),t.addEventListener("webglcontextcreationerror",re,!1),I===null){const k="webgl2";if(I=Mt(k,y),I===null)throw Mt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Fe,ze,ye,Xe,xe,w,M,B,Y,j,q,fe,ie,he,Be,Q,ue,Ee,Te,de,Ge,Ie,Je,D;function ae(){Fe=new ep(I),Fe.init(),Ie=new zf(I,Fe),ze=new Yd(I,Fe,e,Ie),ye=new Ff(I,Fe),ze.reverseDepthBuffer&&u&&ye.buffers.depth.setReversed(!0),Xe=new ip(I),xe=new yf,w=new Of(I,Fe,ye,xe,ze,Ie,Xe),M=new jd(_),B=new Qd(_),Y=new hh(I),Je=new qd(I,Y),j=new tp(I,Y,Xe,Je),q=new ap(I,j,Y,Xe),Te=new sp(I,ze,w),Q=new $d(xe),fe=new Sf(_,M,B,Fe,ze,Je,Q),ie=new Yf(_,xe),he=new Ef,Be=new Pf(Fe),Ee=new Xd(_,M,B,ye,q,f,l),ue=new Uf(_,q,ze),D=new $f(I,Xe,ze,ye),de=new Kd(I,Fe,Xe),Ge=new np(I,Fe,Xe),Xe.programs=fe.programs,_.capabilities=ze,_.extensions=Fe,_.properties=xe,_.renderLists=he,_.shadowMap=ue,_.state=ye,_.info=Xe}ae();const V=new qf(_,I);this.xr=V,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const y=Fe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Fe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(y){y!==void 0&&(G=y,this.setSize(H,J,!1))},this.getSize=function(y){return y.set(H,J)},this.setSize=function(y,k,O=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=y,J=k,t.width=Math.floor(y*G),t.height=Math.floor(k*G),O===!0&&(t.style.width=y+"px",t.style.height=k+"px"),this.setViewport(0,0,y,k)},this.getDrawingBufferSize=function(y){return y.set(H*G,J*G).floor()},this.setDrawingBufferSize=function(y,k,O){H=y,J=k,G=O,t.width=Math.floor(y*O),t.height=Math.floor(k*O),this.setViewport(0,0,y,k)},this.getCurrentViewport=function(y){return y.copy(T)},this.getViewport=function(y){return y.copy(me)},this.setViewport=function(y,k,O,z){y.isVector4?me.set(y.x,y.y,y.z,y.w):me.set(y,k,O,z),ye.viewport(T.copy(me).multiplyScalar(G).round())},this.getScissor=function(y){return y.copy(Ue)},this.setScissor=function(y,k,O,z){y.isVector4?Ue.set(y.x,y.y,y.z,y.w):Ue.set(y,k,O,z),ye.scissor(F.copy(Ue).multiplyScalar(G).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(y){ye.setScissorTest(Ve=y)},this.setOpaqueSort=function(y){te=y},this.setTransparentSort=function(y){le=y},this.getClearColor=function(y){return y.copy(Ee.getClearColor())},this.setClearColor=function(){Ee.setClearColor.apply(Ee,arguments)},this.getClearAlpha=function(){return Ee.getClearAlpha()},this.setClearAlpha=function(){Ee.setClearAlpha.apply(Ee,arguments)},this.clear=function(y=!0,k=!0,O=!0){let z=0;if(y){let U=!1;if(C!==null){const ee=C.texture.format;U=ee===Qa||ee===Za||ee===Ja}if(U){const ee=C.texture.type,oe=ee===sn||ee===kn||ee===Ci||ee===ai||ee===$a||ee===ja,ge=Ee.getClearColor(),ve=Ee.getClearAlpha(),Re=ge.r,Pe=ge.g,_e=ge.b;oe?(g[0]=Re,g[1]=Pe,g[2]=_e,g[3]=ve,I.clearBufferuiv(I.COLOR,0,g)):(x[0]=Re,x[1]=Pe,x[2]=_e,x[3]=ve,I.clearBufferiv(I.COLOR,0,x))}else z|=I.COLOR_BUFFER_BIT}k&&(z|=I.DEPTH_BUFFER_BIT),O&&(z|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$,!1),t.removeEventListener("webglcontextrestored",ce,!1),t.removeEventListener("webglcontextcreationerror",re,!1),he.dispose(),Be.dispose(),xe.dispose(),M.dispose(),B.dispose(),q.dispose(),Je.dispose(),D.dispose(),fe.dispose(),V.dispose(),V.removeEventListener("sessionstart",dr),V.removeEventListener("sessionend",pr),Mn.stop()};function $(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function ce(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const y=Xe.autoReset,k=ue.enabled,O=ue.autoUpdate,z=ue.needsUpdate,U=ue.type;ae(),Xe.autoReset=y,ue.enabled=k,ue.autoUpdate=O,ue.needsUpdate=z,ue.type=U}function re(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ce(y){const k=y.target;k.removeEventListener("dispose",Ce),at(k)}function at(y){pt(y),xe.remove(y)}function pt(y){const k=xe.get(y).programs;k!==void 0&&(k.forEach(function(O){fe.releaseProgram(O)}),y.isShaderMaterial&&fe.releaseShaderCache(y))}this.renderBufferDirect=function(y,k,O,z,U,ee){k===null&&(k=Qe);const oe=U.isMesh&&U.matrixWorld.determinant()<0,ge=_l(y,k,O,z,U);ye.setMaterial(z,oe);let ve=O.index,Re=1;if(z.wireframe===!0){if(ve=j.getWireframeAttribute(O),ve===void 0)return;Re=2}const Pe=O.drawRange,_e=O.attributes.position;let We=Pe.start*Re,Ze=(Pe.start+Pe.count)*Re;ee!==null&&(We=Math.max(We,ee.start*Re),Ze=Math.min(Ze,(ee.start+ee.count)*Re)),ve!==null?(We=Math.max(We,0),Ze=Math.min(Ze,ve.count)):_e!=null&&(We=Math.max(We,0),Ze=Math.min(Ze,_e.count));const et=Ze-We;if(et<0||et===1/0)return;Je.setup(U,z,ge,O,ve);let St,qe=de;if(ve!==null&&(St=Y.get(ve),qe=Ge,qe.setIndex(St)),U.isMesh)z.wireframe===!0?(ye.setLineWidth(z.wireframeLinewidth*st()),qe.setMode(I.LINES)):qe.setMode(I.TRIANGLES);else if(U.isLine){let Me=z.linewidth;Me===void 0&&(Me=1),ye.setLineWidth(Me*st()),U.isLineSegments?qe.setMode(I.LINES):U.isLineLoop?qe.setMode(I.LINE_LOOP):qe.setMode(I.LINE_STRIP)}else U.isPoints?qe.setMode(I.POINTS):U.isSprite&&qe.setMode(I.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)qe.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))qe.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Me=U._multiDrawStarts,qt=U._multiDrawCounts,Ke=U._multiDrawCount,kt=ve?Y.get(ve).bytesPerElement:1,Nn=xe.get(z).currentProgram.getUniforms();for(let wt=0;wt<Ke;wt++)Nn.setValue(I,"_gl_DrawID",wt),qe.render(Me[wt]/kt,qt[wt])}else if(U.isInstancedMesh)qe.renderInstances(We,et,U.count);else if(O.isInstancedBufferGeometry){const Me=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,qt=Math.min(O.instanceCount,Me);qe.renderInstances(We,et,qt)}else qe.render(We,et)};function Ye(y,k,O){y.transparent===!0&&y.side===Qt&&y.forceSinglePass===!1?(y.side=bt,y.needsUpdate=!0,Ni(y,k,O),y.side=xn,y.needsUpdate=!0,Ni(y,k,O),y.side=Qt):Ni(y,k,O)}this.compile=function(y,k,O=null){O===null&&(O=y),p=Be.get(O),p.init(k),v.push(p),O.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),y!==O&&y.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const z=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const ee=U.material;if(ee)if(Array.isArray(ee))for(let oe=0;oe<ee.length;oe++){const ge=ee[oe];Ye(ge,O,U),z.add(ge)}else Ye(ee,O,U),z.add(ee)}),v.pop(),p=null,z},this.compileAsync=function(y,k,O=null){const z=this.compile(y,k,O);return new Promise(U=>{function ee(){if(z.forEach(function(oe){xe.get(oe).currentProgram.isReady()&&z.delete(oe)}),z.size===0){U(y);return}setTimeout(ee,10)}Fe.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let It=null;function Xt(y){It&&It(y)}function dr(){Mn.stop()}function pr(){Mn.start()}const Mn=new sl;Mn.setAnimationLoop(Xt),typeof self<"u"&&Mn.setContext(self),this.setAnimationLoop=function(y){It=y,V.setAnimationLoop(y),y===null?Mn.stop():Mn.start()},V.addEventListener("sessionstart",dr),V.addEventListener("sessionend",pr),this.render=function(y,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(k),k=V.getCamera()),y.isScene===!0&&y.onBeforeRender(_,y,k,C),p=Be.get(y,v.length),p.init(k),v.push(p),be.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),K.setFromProjectionMatrix(be),pe=this.localClippingEnabled,Z=Q.init(this.clippingPlanes,pe),m=he.get(y,E.length),m.init(),E.push(m),V.enabled===!0&&V.isPresenting===!0){const ee=_.xr.getDepthSensingMesh();ee!==null&&Ss(ee,k,-1/0,_.sortObjects)}Ss(y,k,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(te,le),Oe=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,Oe&&Ee.addToRenderList(m,y),this.info.render.frame++,Z===!0&&Q.beginShadows();const O=p.state.shadowsArray;ue.render(O,y,k),Z===!0&&Q.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,U=m.transmissive;if(p.setupLights(),k.isArrayCamera){const ee=k.cameras;if(U.length>0)for(let oe=0,ge=ee.length;oe<ge;oe++){const ve=ee[oe];mr(z,U,y,ve)}Oe&&Ee.render(y);for(let oe=0,ge=ee.length;oe<ge;oe++){const ve=ee[oe];fr(m,y,ve,ve.viewport)}}else U.length>0&&mr(z,U,y,k),Oe&&Ee.render(y),fr(m,y,k);C!==null&&(w.updateMultisampleRenderTarget(C),w.updateRenderTargetMipmap(C)),y.isScene===!0&&y.onAfterRender(_,y,k),Je.resetDefaultState(),b=-1,S=null,v.pop(),v.length>0?(p=v[v.length-1],Z===!0&&Q.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function Ss(y,k,O,z){if(y.visible===!1)return;if(y.layers.test(k.layers)){if(y.isGroup)O=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(k);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||K.intersectsSprite(y)){z&&De.setFromMatrixPosition(y.matrixWorld).applyMatrix4(be);const oe=q.update(y),ge=y.material;ge.visible&&m.push(y,oe,ge,O,De.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||K.intersectsObject(y))){const oe=q.update(y),ge=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),De.copy(y.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),De.copy(oe.boundingSphere.center)),De.applyMatrix4(y.matrixWorld).applyMatrix4(be)),Array.isArray(ge)){const ve=oe.groups;for(let Re=0,Pe=ve.length;Re<Pe;Re++){const _e=ve[Re],We=ge[_e.materialIndex];We&&We.visible&&m.push(y,oe,We,O,De.z,_e)}}else ge.visible&&m.push(y,oe,ge,O,De.z,null)}}const ee=y.children;for(let oe=0,ge=ee.length;oe<ge;oe++)Ss(ee[oe],k,O,z)}function fr(y,k,O,z){const U=y.opaque,ee=y.transmissive,oe=y.transparent;p.setupLightsView(O),Z===!0&&Q.setGlobalState(_.clippingPlanes,O),z&&ye.viewport(T.copy(z)),U.length>0&&Ui(U,k,O),ee.length>0&&Ui(ee,k,O),oe.length>0&&Ui(oe,k,O),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function mr(y,k,O,z){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[z.id]===void 0&&(p.state.transmissionRenderTarget[z.id]=new Un(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?Li:sn,minFilter:In,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:He.workingColorSpace}));const ee=p.state.transmissionRenderTarget[z.id],oe=z.viewport||T;ee.setSize(oe.z,oe.w);const ge=_.getRenderTarget();_.setRenderTarget(ee),_.getClearColor(W),X=_.getClearAlpha(),X<1&&_.setClearColor(16777215,.5),_.clear(),Oe&&Ee.render(O);const ve=_.toneMapping;_.toneMapping=_n;const Re=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),p.setupLightsView(z),Z===!0&&Q.setGlobalState(_.clippingPlanes,z),Ui(y,O,z),w.updateMultisampleRenderTarget(ee),w.updateRenderTargetMipmap(ee),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let _e=0,We=k.length;_e<We;_e++){const Ze=k[_e],et=Ze.object,St=Ze.geometry,qe=Ze.material,Me=Ze.group;if(qe.side===Qt&&et.layers.test(z.layers)){const qt=qe.side;qe.side=bt,qe.needsUpdate=!0,gr(et,O,z,St,qe,Me),qe.side=qt,qe.needsUpdate=!0,Pe=!0}}Pe===!0&&(w.updateMultisampleRenderTarget(ee),w.updateRenderTargetMipmap(ee))}_.setRenderTarget(ge),_.setClearColor(W,X),Re!==void 0&&(z.viewport=Re),_.toneMapping=ve}function Ui(y,k,O){const z=k.isScene===!0?k.overrideMaterial:null;for(let U=0,ee=y.length;U<ee;U++){const oe=y[U],ge=oe.object,ve=oe.geometry,Re=z===null?oe.material:z,Pe=oe.group;ge.layers.test(O.layers)&&gr(ge,k,O,ve,Re,Pe)}}function gr(y,k,O,z,U,ee){y.onBeforeRender(_,k,O,z,U,ee),y.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(_,k,O,z,y,ee),U.transparent===!0&&U.side===Qt&&U.forceSinglePass===!1?(U.side=bt,U.needsUpdate=!0,_.renderBufferDirect(O,k,z,U,y,ee),U.side=xn,U.needsUpdate=!0,_.renderBufferDirect(O,k,z,U,y,ee),U.side=Qt):_.renderBufferDirect(O,k,z,U,y,ee),y.onAfterRender(_,k,O,z,U,ee)}function Ni(y,k,O){k.isScene!==!0&&(k=Qe);const z=xe.get(y),U=p.state.lights,ee=p.state.shadowsArray,oe=U.state.version,ge=fe.getParameters(y,U.state,ee,k,O),ve=fe.getProgramCacheKey(ge);let Re=z.programs;z.environment=y.isMeshStandardMaterial?k.environment:null,z.fog=k.fog,z.envMap=(y.isMeshStandardMaterial?B:M).get(y.envMap||z.environment),z.envMapRotation=z.environment!==null&&y.envMap===null?k.environmentRotation:y.envMapRotation,Re===void 0&&(y.addEventListener("dispose",Ce),Re=new Map,z.programs=Re);let Pe=Re.get(ve);if(Pe!==void 0){if(z.currentProgram===Pe&&z.lightsStateVersion===oe)return _r(y,ge),Pe}else ge.uniforms=fe.getUniforms(y),y.onBeforeCompile(ge,_),Pe=fe.acquireProgram(ge,ve),Re.set(ve,Pe),z.uniforms=ge.uniforms;const _e=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(_e.clippingPlanes=Q.uniform),_r(y,ge),z.needsLights=Ml(y),z.lightsStateVersion=oe,z.needsLights&&(_e.ambientLightColor.value=U.state.ambient,_e.lightProbe.value=U.state.probe,_e.directionalLights.value=U.state.directional,_e.directionalLightShadows.value=U.state.directionalShadow,_e.spotLights.value=U.state.spot,_e.spotLightShadows.value=U.state.spotShadow,_e.rectAreaLights.value=U.state.rectArea,_e.ltc_1.value=U.state.rectAreaLTC1,_e.ltc_2.value=U.state.rectAreaLTC2,_e.pointLights.value=U.state.point,_e.pointLightShadows.value=U.state.pointShadow,_e.hemisphereLights.value=U.state.hemi,_e.directionalShadowMap.value=U.state.directionalShadowMap,_e.directionalShadowMatrix.value=U.state.directionalShadowMatrix,_e.spotShadowMap.value=U.state.spotShadowMap,_e.spotLightMatrix.value=U.state.spotLightMatrix,_e.spotLightMap.value=U.state.spotLightMap,_e.pointShadowMap.value=U.state.pointShadowMap,_e.pointShadowMatrix.value=U.state.pointShadowMatrix),z.currentProgram=Pe,z.uniformsList=null,Pe}function vr(y){if(y.uniformsList===null){const k=y.currentProgram.getUniforms();y.uniformsList=ds.seqWithValue(k.seq,y.uniforms)}return y.uniformsList}function _r(y,k){const O=xe.get(y);O.outputColorSpace=k.outputColorSpace,O.batching=k.batching,O.batchingColor=k.batchingColor,O.instancing=k.instancing,O.instancingColor=k.instancingColor,O.instancingMorph=k.instancingMorph,O.skinning=k.skinning,O.morphTargets=k.morphTargets,O.morphNormals=k.morphNormals,O.morphColors=k.morphColors,O.morphTargetsCount=k.morphTargetsCount,O.numClippingPlanes=k.numClippingPlanes,O.numIntersection=k.numClipIntersection,O.vertexAlphas=k.vertexAlphas,O.vertexTangents=k.vertexTangents,O.toneMapping=k.toneMapping}function _l(y,k,O,z,U){k.isScene!==!0&&(k=Qe),w.resetTextureUnits();const ee=k.fog,oe=z.isMeshStandardMaterial?k.environment:null,ge=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:li,ve=(z.isMeshStandardMaterial?B:M).get(z.envMap||oe),Re=z.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Pe=!!O.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),_e=!!O.morphAttributes.position,We=!!O.morphAttributes.normal,Ze=!!O.morphAttributes.color;let et=_n;z.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(et=_.toneMapping);const St=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,qe=St!==void 0?St.length:0,Me=xe.get(z),qt=p.state.lights;if(Z===!0&&(pe===!0||y!==S)){const Ct=y===S&&z.id===b;Q.setState(z,y,Ct)}let Ke=!1;z.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==qt.state.version||Me.outputColorSpace!==ge||U.isBatchedMesh&&Me.batching===!1||!U.isBatchedMesh&&Me.batching===!0||U.isBatchedMesh&&Me.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Me.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Me.instancing===!1||!U.isInstancedMesh&&Me.instancing===!0||U.isSkinnedMesh&&Me.skinning===!1||!U.isSkinnedMesh&&Me.skinning===!0||U.isInstancedMesh&&Me.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Me.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Me.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Me.instancingMorph===!1&&U.morphTexture!==null||Me.envMap!==ve||z.fog===!0&&Me.fog!==ee||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==Q.numPlanes||Me.numIntersection!==Q.numIntersection)||Me.vertexAlphas!==Re||Me.vertexTangents!==Pe||Me.morphTargets!==_e||Me.morphNormals!==We||Me.morphColors!==Ze||Me.toneMapping!==et||Me.morphTargetsCount!==qe)&&(Ke=!0):(Ke=!0,Me.__version=z.version);let kt=Me.currentProgram;Ke===!0&&(kt=Ni(z,k,U));let Nn=!1,wt=!1,pi=!1;const tt=kt.getUniforms(),Gt=Me.uniforms;if(ye.useProgram(kt.program)&&(Nn=!0,wt=!0,pi=!0),z.id!==b&&(b=z.id,wt=!0),Nn||S!==y){ye.buffers.depth.getReversed()?(ne.copy(y.projectionMatrix),Oc(ne),zc(ne),tt.setValue(I,"projectionMatrix",ne)):tt.setValue(I,"projectionMatrix",y.projectionMatrix),tt.setValue(I,"viewMatrix",y.matrixWorldInverse);const on=tt.map.cameraPosition;on!==void 0&&on.setValue(I,we.setFromMatrixPosition(y.matrixWorld)),ze.logarithmicDepthBuffer&&tt.setValue(I,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&tt.setValue(I,"isOrthographic",y.isOrthographicCamera===!0),S!==y&&(S=y,wt=!0,pi=!0)}if(U.isSkinnedMesh){tt.setOptional(I,U,"bindMatrix"),tt.setOptional(I,U,"bindMatrixInverse");const Ct=U.skeleton;Ct&&(Ct.boneTexture===null&&Ct.computeBoneTexture(),tt.setValue(I,"boneTexture",Ct.boneTexture,w))}U.isBatchedMesh&&(tt.setOptional(I,U,"batchingTexture"),tt.setValue(I,"batchingTexture",U._matricesTexture,w),tt.setOptional(I,U,"batchingIdTexture"),tt.setValue(I,"batchingIdTexture",U._indirectTexture,w),tt.setOptional(I,U,"batchingColorTexture"),U._colorsTexture!==null&&tt.setValue(I,"batchingColorTexture",U._colorsTexture,w));const fi=O.morphAttributes;if((fi.position!==void 0||fi.normal!==void 0||fi.color!==void 0)&&Te.update(U,O,kt),(wt||Me.receiveShadow!==U.receiveShadow)&&(Me.receiveShadow=U.receiveShadow,tt.setValue(I,"receiveShadow",U.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(Gt.envMap.value=ve,Gt.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&k.environment!==null&&(Gt.envMapIntensity.value=k.environmentIntensity),wt&&(tt.setValue(I,"toneMappingExposure",_.toneMappingExposure),Me.needsLights&&xl(Gt,pi),ee&&z.fog===!0&&ie.refreshFogUniforms(Gt,ee),ie.refreshMaterialUniforms(Gt,z,G,J,p.state.transmissionRenderTarget[y.id]),ds.upload(I,vr(Me),Gt,w)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ds.upload(I,vr(Me),Gt,w),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&tt.setValue(I,"center",U.center),tt.setValue(I,"modelViewMatrix",U.modelViewMatrix),tt.setValue(I,"normalMatrix",U.normalMatrix),tt.setValue(I,"modelMatrix",U.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Ct=z.uniformsGroups;for(let on=0,ln=Ct.length;on<ln;on++){const xr=Ct[on];D.update(xr,kt),D.bind(xr,kt)}}return kt}function xl(y,k){y.ambientLightColor.needsUpdate=k,y.lightProbe.needsUpdate=k,y.directionalLights.needsUpdate=k,y.directionalLightShadows.needsUpdate=k,y.pointLights.needsUpdate=k,y.pointLightShadows.needsUpdate=k,y.spotLights.needsUpdate=k,y.spotLightShadows.needsUpdate=k,y.rectAreaLights.needsUpdate=k,y.hemisphereLights.needsUpdate=k}function Ml(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(y,k,O){xe.get(y.texture).__webglTexture=k,xe.get(y.depthTexture).__webglTexture=O;const z=xe.get(y);z.__hasExternalTextures=!0,z.__autoAllocateDepthBuffer=O===void 0,z.__autoAllocateDepthBuffer||Fe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,k){const O=xe.get(y);O.__webglFramebuffer=k,O.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(y,k=0,O=0){C=y,A=k,R=O;let z=!0,U=null,ee=!1,oe=!1;if(y){const ve=xe.get(y);if(ve.__useDefaultFramebuffer!==void 0)ye.bindFramebuffer(I.FRAMEBUFFER,null),z=!1;else if(ve.__webglFramebuffer===void 0)w.setupRenderTarget(y);else if(ve.__hasExternalTextures)w.rebindTextures(y,xe.get(y.texture).__webglTexture,xe.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const _e=y.depthTexture;if(ve.__boundDepthTexture!==_e){if(_e!==null&&xe.has(_e)&&(y.width!==_e.image.width||y.height!==_e.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(y)}}const Re=y.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(oe=!0);const Pe=xe.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Pe[k])?U=Pe[k][O]:U=Pe[k],ee=!0):y.samples>0&&w.useMultisampledRTT(y)===!1?U=xe.get(y).__webglMultisampledFramebuffer:Array.isArray(Pe)?U=Pe[O]:U=Pe,T.copy(y.viewport),F.copy(y.scissor),N=y.scissorTest}else T.copy(me).multiplyScalar(G).floor(),F.copy(Ue).multiplyScalar(G).floor(),N=Ve;if(ye.bindFramebuffer(I.FRAMEBUFFER,U)&&z&&ye.drawBuffers(y,U),ye.viewport(T),ye.scissor(F),ye.setScissorTest(N),ee){const ve=xe.get(y.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+k,ve.__webglTexture,O)}else if(oe){const ve=xe.get(y.texture),Re=k||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,ve.__webglTexture,O||0,Re)}b=-1},this.readRenderTargetPixels=function(y,k,O,z,U,ee,oe){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(ge=ge[oe]),ge){ye.bindFramebuffer(I.FRAMEBUFFER,ge);try{const ve=y.texture,Re=ve.format,Pe=ve.type;if(!ze.textureFormatReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ze.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=y.width-z&&O>=0&&O<=y.height-U&&I.readPixels(k,O,z,U,Ie.convert(Re),Ie.convert(Pe),ee)}finally{const ve=C!==null?xe.get(C).__webglFramebuffer:null;ye.bindFramebuffer(I.FRAMEBUFFER,ve)}}},this.readRenderTargetPixelsAsync=async function(y,k,O,z,U,ee,oe){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(ge=ge[oe]),ge){const ve=y.texture,Re=ve.format,Pe=ve.type;if(!ze.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ze.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=y.width-z&&O>=0&&O<=y.height-U){ye.bindFramebuffer(I.FRAMEBUFFER,ge);const _e=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,_e),I.bufferData(I.PIXEL_PACK_BUFFER,ee.byteLength,I.STREAM_READ),I.readPixels(k,O,z,U,Ie.convert(Re),Ie.convert(Pe),0);const We=C!==null?xe.get(C).__webglFramebuffer:null;ye.bindFramebuffer(I.FRAMEBUFFER,We);const Ze=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Bc(I,Ze,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,_e),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ee),I.deleteBuffer(_e),I.deleteSync(Ze),ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,k=null,O=0){y.isTexture!==!0&&(Mi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,y=arguments[1]);const z=Math.pow(2,-O),U=Math.floor(y.image.width*z),ee=Math.floor(y.image.height*z),oe=k!==null?k.x:0,ge=k!==null?k.y:0;w.setTexture2D(y,0),I.copyTexSubImage2D(I.TEXTURE_2D,O,0,0,oe,ge,U,ee),ye.unbindTexture()},this.copyTextureToTexture=function(y,k,O=null,z=null,U=0){y.isTexture!==!0&&(Mi("WebGLRenderer: copyTextureToTexture function signature has changed."),z=arguments[0]||null,y=arguments[1],k=arguments[2],U=arguments[3]||0,O=null);let ee,oe,ge,ve,Re,Pe,_e,We,Ze;const et=y.isCompressedTexture?y.mipmaps[U]:y.image;O!==null?(ee=O.max.x-O.min.x,oe=O.max.y-O.min.y,ge=O.isBox3?O.max.z-O.min.z:1,ve=O.min.x,Re=O.min.y,Pe=O.isBox3?O.min.z:0):(ee=et.width,oe=et.height,ge=et.depth||1,ve=0,Re=0,Pe=0),z!==null?(_e=z.x,We=z.y,Ze=z.z):(_e=0,We=0,Ze=0);const St=Ie.convert(k.format),qe=Ie.convert(k.type);let Me;k.isData3DTexture?(w.setTexture3D(k,0),Me=I.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(w.setTexture2DArray(k,0),Me=I.TEXTURE_2D_ARRAY):(w.setTexture2D(k,0),Me=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,k.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,k.unpackAlignment);const qt=I.getParameter(I.UNPACK_ROW_LENGTH),Ke=I.getParameter(I.UNPACK_IMAGE_HEIGHT),kt=I.getParameter(I.UNPACK_SKIP_PIXELS),Nn=I.getParameter(I.UNPACK_SKIP_ROWS),wt=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,et.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,et.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,ve),I.pixelStorei(I.UNPACK_SKIP_ROWS,Re),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Pe);const pi=y.isDataArrayTexture||y.isData3DTexture,tt=k.isDataArrayTexture||k.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const Gt=xe.get(y),fi=xe.get(k),Ct=xe.get(Gt.__renderTarget),on=xe.get(fi.__renderTarget);ye.bindFramebuffer(I.READ_FRAMEBUFFER,Ct.__webglFramebuffer),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,on.__webglFramebuffer);for(let ln=0;ln<ge;ln++)pi&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,xe.get(y).__webglTexture,U,Pe+ln),y.isDepthTexture?(tt&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,xe.get(k).__webglTexture,U,Ze+ln),I.blitFramebuffer(ve,Re,ee,oe,_e,We,ee,oe,I.DEPTH_BUFFER_BIT,I.NEAREST)):tt?I.copyTexSubImage3D(Me,U,_e,We,Ze+ln,ve,Re,ee,oe):I.copyTexSubImage2D(Me,U,_e,We,Ze+ln,ve,Re,ee,oe);ye.bindFramebuffer(I.READ_FRAMEBUFFER,null),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else tt?y.isDataTexture||y.isData3DTexture?I.texSubImage3D(Me,U,_e,We,Ze,ee,oe,ge,St,qe,et.data):k.isCompressedArrayTexture?I.compressedTexSubImage3D(Me,U,_e,We,Ze,ee,oe,ge,St,et.data):I.texSubImage3D(Me,U,_e,We,Ze,ee,oe,ge,St,qe,et):y.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,U,_e,We,ee,oe,St,qe,et.data):y.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,U,_e,We,et.width,et.height,St,et.data):I.texSubImage2D(I.TEXTURE_2D,U,_e,We,ee,oe,St,qe,et);I.pixelStorei(I.UNPACK_ROW_LENGTH,qt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ke),I.pixelStorei(I.UNPACK_SKIP_PIXELS,kt),I.pixelStorei(I.UNPACK_SKIP_ROWS,Nn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,wt),U===0&&k.generateMipmaps&&I.generateMipmap(Me),ye.unbindTexture()},this.copyTextureToTexture3D=function(y,k,O=null,z=null,U=0){return y.isTexture!==!0&&(Mi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),O=arguments[0]||null,z=arguments[1]||null,y=arguments[2],k=arguments[3],U=arguments[4]||0),Mi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,k,O,z,U)},this.initRenderTarget=function(y){xe.get(y).__webglFramebuffer===void 0&&w.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?w.setTextureCube(y,0):y.isData3DTexture?w.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?w.setTexture2DArray(y,0):w.setTexture2D(y,0),ye.unbindTexture()},this.resetState=function(){A=0,R=0,C=null,ye.reset(),Je.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=He._getDrawingBufferColorSpace(e),t.unpackColorSpace=He._getUnpackColorSpace()}}class ir{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ne(e),this.density=t}clone(){return new ir(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class dl extends dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wt,this.environmentIntensity=1,this.environmentRotation=new Wt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class sr extends ui{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const bo=new nt,Xa=new jo,ss=new _s,as=new P;class pl extends dt{constructor(e=new vt,t=new sr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,a=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ss.copy(n.boundingSphere),ss.applyMatrix4(s),ss.radius+=a,e.ray.intersectsSphere(ss)===!1)return;bo.copy(s).invert(),Xa.copy(e.ray).applyMatrix4(bo);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,r.start),f=Math.min(c.count,r.start+r.count);for(let g=u,x=f;g<x;g++){const m=c.getX(g);as.fromBufferAttribute(d,m),Eo(as,m,l,s,e,t,this)}}else{const u=Math.max(0,r.start),f=Math.min(d.count,r.start+r.count);for(let g=u,x=f;g<x;g++)as.fromBufferAttribute(d,g),Eo(as,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Eo(i,e,t,n,s,a,r){const o=Xa.distanceSqToPoint(i);if(o<t){const l=new P;Xa.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;a.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}class rn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)n=this.getPoint(r/e),a+=n.distanceTo(s),t.push(a),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const a=n.length;let r;t?r=t:r=e*n[a-1];let o=0,l=a-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-r,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===r)return s/(a-1);const h=n[s],u=n[s+1]-h,f=(r-h)/u;return(s+f)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),l=t||(r.isVector2?new Se:new P);return l.copy(o).sub(r).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new P,s=[],a=[],r=[],o=new P,l=new nt;for(let f=0;f<=e;f++){const g=f/e;s[f]=this.getTangentAt(g,new P)}a[0]=new P,r[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let f=1;f<=e;f++){if(a[f]=a[f-1].clone(),r[f]=r[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ht(s[f-1].dot(s[f]),-1,1));a[f].applyMatrix4(l.makeRotationAxis(o,g))}r[f].crossVectors(s[f],a[f])}if(t===!0){let f=Math.acos(ht(a[0].dot(a[e]),-1,1));f/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(f=-f);for(let g=1;g<=e;g++)a[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),r[g].crossVectors(s[g],a[g])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class fl extends rn{constructor(e=0,t=0,n=1,s=1,a=0,r=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new Se){const n=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class jf extends fl{constructor(e,t,n,s,a,r){super(e,t,n,n,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function ar(){let i=0,e=0,t=0,n=0;function s(a,r,o,l){i=a,e=o,t=-3*a+3*r-2*o-l,n=2*a-2*r+o+l}return{initCatmullRom:function(a,r,o,l,c){s(r,o,c*(o-a),c*(l-r))},initNonuniformCatmullRom:function(a,r,o,l,c,h,d){let u=(r-a)/c-(o-a)/(c+h)+(o-r)/h,f=(o-r)/h-(l-r)/(h+d)+(l-o)/d;u*=h,f*=h,s(r,o,u,f)},calc:function(a){const r=a*a,o=r*a;return i+e*a+t*r+n*o}}}const rs=new P,Js=new ar,Zs=new ar,Qs=new ar;class ml extends rn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){const n=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),l=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:l===0&&o===a-1&&(o=a-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%a]:(rs.subVectors(s[0],s[1]).add(s[0]),c=rs);const d=s[o%a],u=s[(o+1)%a];if(this.closed||o+2<a?h=s[(o+2)%a]:(rs.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=rs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),Js.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,x,m),Zs.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,x,m),Qs.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(Js.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Zs.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Qs.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Js.calc(l),Zs.calc(l),Qs.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function wo(i,e,t,n,s){const a=(n-e)*.5,r=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+a+r)*l+(-3*t+3*n-2*a-r)*o+a*i+t}function Jf(i,e){const t=1-i;return t*t*e}function Zf(i,e){return 2*(1-i)*i*e}function Qf(i,e){return i*i*e}function Ti(i,e,t,n){return Jf(i,e)+Zf(i,t)+Qf(i,n)}function em(i,e){const t=1-i;return t*t*t*e}function tm(i,e){const t=1-i;return 3*t*t*i*e}function nm(i,e){return 3*(1-i)*i*i*e}function im(i,e){return i*i*i*e}function Ai(i,e,t,n,s){return em(i,e)+tm(i,t)+nm(i,n)+im(i,s)}class sm extends rn{constructor(e=new Se,t=new Se,n=new Se,s=new Se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Se){const n=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return n.set(Ai(e,s.x,a.x,r.x,o.x),Ai(e,s.y,a.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class am extends rn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){const n=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return n.set(Ai(e,s.x,a.x,r.x,o.x),Ai(e,s.y,a.y,r.y,o.y),Ai(e,s.z,a.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class rm extends rn{constructor(e=new Se,t=new Se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Se){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class om extends rn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class lm extends rn{constructor(e=new Se,t=new Se,n=new Se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Se){const n=t,s=this.v0,a=this.v1,r=this.v2;return n.set(Ti(e,s.x,a.x,r.x),Ti(e,s.y,a.y,r.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class gl extends rn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,s=this.v0,a=this.v1,r=this.v2;return n.set(Ti(e,s.x,a.x,r.x),Ti(e,s.y,a.y,r.y),Ti(e,s.z,a.z,r.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cm extends rn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Se){const n=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,l=s[r===0?r:r-1],c=s[r],h=s[r>s.length-2?s.length-1:r+1],d=s[r>s.length-3?s.length-1:r+2];return n.set(wo(o,l.x,c.x,h.x,d.x),wo(o,l.y,c.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Se().fromArray(s))}return this}}var hm=Object.freeze({__proto__:null,ArcCurve:jf,CatmullRomCurve3:ml,CubicBezierCurve:sm,CubicBezierCurve3:am,EllipseCurve:fl,LineCurve:rm,LineCurve3:om,QuadraticBezierCurve:lm,QuadraticBezierCurve3:gl,SplineCurve:cm});class ms extends vt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const a=[],r=[],o=[],l=[],c=new P,h=new Se;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=n+d/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),r.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(r[u]/e+1)/2,h.y=(r[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)a.push(d,d+1,0);this.setIndex(a),this.setAttribute("position",new it(r,3)),this.setAttribute("normal",new it(o,3)),this.setAttribute("uv",new it(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ms(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class gt extends vt{constructor(e=1,t=1,n=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],d=[],u=[],f=[];let g=0;const x=[],m=n/2;let p=0;E(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new it(d,3)),this.setAttribute("normal",new it(u,3)),this.setAttribute("uv",new it(f,2));function E(){const _=new P,L=new P;let A=0;const R=(t-e)/n;for(let C=0;C<=a;C++){const b=[],S=C/a,T=S*(t-e)+e;for(let F=0;F<=s;F++){const N=F/s,W=N*l+o,X=Math.sin(W),H=Math.cos(W);L.x=T*X,L.y=-S*n+m,L.z=T*H,d.push(L.x,L.y,L.z),_.set(X,R,H).normalize(),u.push(_.x,_.y,_.z),f.push(N,1-S),b.push(g++)}x.push(b)}for(let C=0;C<s;C++)for(let b=0;b<a;b++){const S=x[b][C],T=x[b+1][C],F=x[b+1][C+1],N=x[b][C+1];(e>0||b!==0)&&(h.push(S,T,N),A+=3),(t>0||b!==a-1)&&(h.push(T,F,N),A+=3)}c.addGroup(p,A,0),p+=A}function v(_){const L=g,A=new Se,R=new P;let C=0;const b=_===!0?e:t,S=_===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,m*S,0),u.push(0,S,0),f.push(.5,.5),g++;const T=g;for(let F=0;F<=s;F++){const W=F/s*l+o,X=Math.cos(W),H=Math.sin(W);R.x=b*H,R.y=m*S,R.z=b*X,d.push(R.x,R.y,R.z),u.push(0,S,0),A.x=X*.5+.5,A.y=H*.5*S+.5,f.push(A.x,A.y),g++}for(let F=0;F<s;F++){const N=L+F,W=T+F;_===!0?h.push(W,W+1,N):h.push(W+1,W,N),C+=3}c.addGroup(p,C,_===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class rr extends gt{constructor(e=1,t=1,n=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,e,t,n,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(e){return new rr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ki extends vt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const a=[],r=[];o(s),c(n),h(),this.setAttribute("position",new it(a,3)),this.setAttribute("normal",new it(a.slice(),3)),this.setAttribute("uv",new it(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(E){const v=new P,_=new P,L=new P;for(let A=0;A<t.length;A+=3)f(t[A+0],v),f(t[A+1],_),f(t[A+2],L),l(v,_,L,E)}function l(E,v,_,L){const A=L+1,R=[];for(let C=0;C<=A;C++){R[C]=[];const b=E.clone().lerp(_,C/A),S=v.clone().lerp(_,C/A),T=A-C;for(let F=0;F<=T;F++)F===0&&C===A?R[C][F]=b:R[C][F]=b.clone().lerp(S,F/T)}for(let C=0;C<A;C++)for(let b=0;b<2*(A-C)-1;b++){const S=Math.floor(b/2);b%2===0?(u(R[C][S+1]),u(R[C+1][S]),u(R[C][S])):(u(R[C][S+1]),u(R[C+1][S+1]),u(R[C+1][S]))}}function c(E){const v=new P;for(let _=0;_<a.length;_+=3)v.x=a[_+0],v.y=a[_+1],v.z=a[_+2],v.normalize().multiplyScalar(E),a[_+0]=v.x,a[_+1]=v.y,a[_+2]=v.z}function h(){const E=new P;for(let v=0;v<a.length;v+=3){E.x=a[v+0],E.y=a[v+1],E.z=a[v+2];const _=m(E)/2/Math.PI+.5,L=p(E)/Math.PI+.5;r.push(_,1-L)}g(),d()}function d(){for(let E=0;E<r.length;E+=6){const v=r[E+0],_=r[E+2],L=r[E+4],A=Math.max(v,_,L),R=Math.min(v,_,L);A>.9&&R<.1&&(v<.2&&(r[E+0]+=1),_<.2&&(r[E+2]+=1),L<.2&&(r[E+4]+=1))}}function u(E){a.push(E.x,E.y,E.z)}function f(E,v){const _=E*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function g(){const E=new P,v=new P,_=new P,L=new P,A=new Se,R=new Se,C=new Se;for(let b=0,S=0;b<a.length;b+=9,S+=6){E.set(a[b+0],a[b+1],a[b+2]),v.set(a[b+3],a[b+4],a[b+5]),_.set(a[b+6],a[b+7],a[b+8]),A.set(r[S+0],r[S+1]),R.set(r[S+2],r[S+3]),C.set(r[S+4],r[S+5]),L.copy(E).add(v).add(_).divideScalar(3);const T=m(L);x(A,S+0,E,T),x(R,S+2,v,T),x(C,S+4,_,T)}}function x(E,v,_,L){L<0&&E.x===1&&(r[v]=E.x-1),_.x===0&&_.z===0&&(r[v]=L/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function p(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ki(e.vertices,e.indices,e.radius,e.details)}}class or extends ki{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new or(e.radius,e.detail)}}class lr extends ki{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new lr(e.radius,e.detail)}}class Ln extends vt{constructor(e=1,t=32,n=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(r+o,Math.PI);let c=0;const h=[],d=new P,u=new P,f=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){const E=[],v=p/n;let _=0;p===0&&r===0?_=.5/t:p===n&&l===Math.PI&&(_=-.5/t);for(let L=0;L<=t;L++){const A=L/t;d.x=-e*Math.cos(s+A*a)*Math.sin(r+v*o),d.y=e*Math.cos(r+v*o),d.z=e*Math.sin(s+A*a)*Math.sin(r+v*o),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),m.push(A+_,1-v),E.push(c++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<t;E++){const v=h[p][E+1],_=h[p][E],L=h[p+1][E],A=h[p+1][E+1];(p!==0||r>0)&&f.push(v,_,A),(p!==n-1||l<Math.PI)&&f.push(_,L,A)}this.setIndex(f),this.setAttribute("position",new it(g,3)),this.setAttribute("normal",new it(x,3)),this.setAttribute("uv",new it(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ln(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class cr extends ki{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new cr(e.radius,e.detail)}}class Ri extends vt{constructor(e=1,t=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],l=[],c=[],h=new P,d=new P,u=new P;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const x=g/s*a,m=f/n*Math.PI*2;d.x=(e+t*Math.cos(m))*Math.cos(x),d.y=(e+t*Math.cos(m))*Math.sin(x),d.z=t*Math.sin(m),o.push(d.x,d.y,d.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const x=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,E=(s+1)*f+g;r.push(x,m,E),r.push(m,p,E)}this.setIndex(r),this.setAttribute("position",new it(o,3)),this.setAttribute("normal",new it(l,3)),this.setAttribute("uv",new it(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ri(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class hr extends vt{constructor(e=new gl(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,a=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:a};const r=e.computeFrenetFrames(t,a);this.tangents=r.tangents,this.normals=r.normals,this.binormals=r.binormals;const o=new P,l=new P,c=new Se;let h=new P;const d=[],u=[],f=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new it(d,3)),this.setAttribute("normal",new it(u,3)),this.setAttribute("uv",new it(f,2));function x(){for(let v=0;v<t;v++)m(v);m(a===!1?t:0),E(),p()}function m(v){h=e.getPointAt(v/t,h);const _=r.normals[v],L=r.binormals[v];for(let A=0;A<=s;A++){const R=A/s*Math.PI*2,C=Math.sin(R),b=-Math.cos(R);l.x=b*_.x+C*L.x,l.y=b*_.y+C*L.y,l.z=b*_.z+C*L.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,d.push(o.x,o.y,o.z)}}function p(){for(let v=1;v<=t;v++)for(let _=1;_<=s;_++){const L=(s+1)*(v-1)+(_-1),A=(s+1)*v+(_-1),R=(s+1)*v+_,C=(s+1)*(v-1)+_;g.push(L,A,C),g.push(A,R,C)}}function E(){for(let v=0;v<=t;v++)for(let _=0;_<=s;_++)c.x=v/t,c.y=_/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new hr(new hm[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class yi extends ui{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xo,this.normalScale=new Se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class To extends yi{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Se(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ht(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class ur extends dt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const ea=new nt,Ao=new P,Ro=new P;class vl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Se(512,512),this.map=null,this.mapPass=null,this.matrix=new nt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new tr,this._frameExtents=new Se(1,1),this._viewportCount=1,this._viewports=[new je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ao.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ao),Ro.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ro),t.updateMatrixWorld(),ea.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ea),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ea)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Co=new nt,xi=new P,ta=new P;class um extends vl{constructor(){super(new yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Se(4,2),this._viewportCount=6,this._viewports=[new je(2,1,1,1),new je(0,1,1,1),new je(3,1,1,1),new je(1,1,1,1),new je(3,0,1,1),new je(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,a=e.distance||n.far;a!==n.far&&(n.far=a,n.updateProjectionMatrix()),xi.setFromMatrixPosition(e.matrixWorld),n.position.copy(xi),ta.copy(n.position),ta.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ta),n.updateMatrixWorld(),s.makeTranslation(-xi.x,-xi.y,-xi.z),Co.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Co)}}class na extends ur{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new um}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class dm extends vl{constructor(){super(new al(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class pm extends ur{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(dt.DEFAULT_UP),this.updateMatrix(),this.target=new dt,this.shadow=new dm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class fm extends ur{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qa);const ia=[{name:"Metallic Blue Chrome",a:"#2563eb",b:"#1e40af",c:"#93c5fd"},{name:"Deep Sapphire Core",a:"#1d4ed8",b:"#0284c7",c:"#60a5fa"},{name:"Electric Cyan Metallic",a:"#00b4d8",b:"#2563eb",c:"#ffffff"},{name:"Ice Platinum Chrome",a:"#ffffff",b:"#3b82f6",c:"#1e3a8a"},{name:"Cosmic Blue Prism",a:"#6366f1",b:"#2563eb",c:"#38bdf8"}];class mm{constructor(e){this.canvas=e,this.mouse={x:0,y:0,targetX:0,targetY:0,velocity:0},this.audioFrequency=0,this.time=0,this.shockwave=0,this.paletteIndex=0,this.init(),this.createOrganicMesh(),this.createAtmosphericSparks(),this.setupEventListeners(),this.animate()}init(){this.scene=new dl;const e=this.canvas.getBoundingClientRect(),t=e.width||window.innerWidth,n=e.height||window.innerWidth*9/21;this.camera=new yt(40,t/n,.1,100),this.camera.position.z=3.2,this.renderer=new ul({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(t,n),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.toneMapping=Ka,this.renderer.toneMappingExposure=1.1}createOrganicMesh(){const e=new or(.85,48),t=ia[this.paletteIndex];this.material=new an({wireframe:!1,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uMouse:{value:new Se(0,0)},uAudioIntensity:{value:0},uShockwave:{value:0},uColorA:{value:new Ne(t.a)},uColorB:{value:new Ne(t.b)},uColorC:{value:new Ne(t.c)}},vertexShader:`
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uAudioIntensity;
        uniform float uShockwave;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;

        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        
        float snoise(vec3 v){
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod(i, 289.0 );
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          float noise = snoise(position * 1.5 + vec3(uTime * 0.45));
          float mouseDist = distance(position.xy, uMouse * 1.4);
          float mouseDeform = exp(-mouseDist * 2.2) * 0.22;

          float audioPulse = uAudioIntensity * 0.4;
          float shockPulse = sin(uShockwave * 14.0 - length(position) * 9.0) * uShockwave * 0.32;

          float displacement = (noise * 0.18) + mouseDeform + (noise * audioPulse) + shockPulse;
          vNoise = displacement;

          vec3 newPosition = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform float uTime;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;

        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.6);

          vec3 inner = mix(vec3(0.04, 0.05, 0.09), uColorA * 0.35, vNoise * 1.4 + 0.3);
          vec3 edge = mix(uColorA, uColorB, vNoise * 2.0 + 0.5);
          edge = mix(edge, uColorC, fresnel * 0.95);

          vec3 finalColor = mix(inner, edge, fresnel * 0.88) + vec3(fresnel * 0.85);

          gl_FragColor = vec4(finalColor, 0.32 + fresnel * 0.68);
        }
      `}),this.mesh=new Ae(e,this.material),this.scene.add(this.mesh)}createAtmosphericSparks(){const t=new vt,n=new Float32Array(280*3);for(let a=0;a<280;a++){const r=1.4+Math.random()*2,o=Math.random()*Math.PI*2,l=Math.acos(2*Math.random()-1);n[a*3]=r*Math.sin(l)*Math.cos(o),n[a*3+1]=r*Math.sin(l)*Math.sin(o),n[a*3+2]=r*Math.cos(l)}t.setAttribute("position",new Rt(n,3));const s=new sr({size:.024,color:61695,transparent:!0,opacity:.45,blending:sa});this.sparks=new pl(t,s),this.scene.add(this.sparks)}cycleColorPalette(){this.paletteIndex=(this.paletteIndex+1)%ia.length;const e=ia[this.paletteIndex];return this.material&&(this.material.uniforms.uColorA.value.set(e.a),this.material.uniforms.uColorB.value.set(e.b),this.material.uniforms.uColorC.value.set(e.c)),this.sparks&&this.sparks.material.color.set(e.a),this.shockwave=1,e}setupEventListeners(){window.addEventListener("resize",()=>this.onResize()),this.canvas.addEventListener("mousemove",e=>{const t=this.canvas.getBoundingClientRect(),n=(e.clientX-t.left)/t.width*2-1,s=-((e.clientY-t.top)/t.height)*2+1;this.mouse.targetX=n,this.mouse.targetY=s}),this.canvas.addEventListener("click",()=>{this.cycleColorPalette()})}onResize(){const e=this.canvas.getBoundingClientRect(),t=e.width||window.innerWidth,n=e.height||window.innerWidth*9/21;this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,n),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))}setAudioIntensity(e){this.audioFrequency=e}animate(){requestAnimationFrame(()=>this.animate()),this.time+=.015,this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08,this.shockwave>.001?this.shockwave*=.93:this.shockwave=0,this.mesh&&(this.mesh.material.uniforms.uTime.value=this.time,this.mesh.material.uniforms.uMouse.value.set(this.mouse.x,this.mouse.y),this.mesh.material.uniforms.uAudioIntensity.value=this.audioFrequency,this.mesh.material.uniforms.uShockwave.value=this.shockwave,this.mesh.rotation.y=this.time*.2+this.mouse.x*.5,this.mesh.rotation.x=this.time*.12-this.mouse.y*.5),this.sparks&&(this.sparks.rotation.y=-this.time*.08,this.sparks.rotation.x=this.time*.05),this.renderer.render(this.scene,this.camera)}}class gm{constructor(e,t){this.canvas=e,this.onBreakout=t,this.scrollProgress=0,this.targetProgress=0,this.time=0,this.isShattered=!1,this.scrollVelocity=0,this.lastScroll=0,this.init(),this.createLights(),this.createCosmicEnvironment(),this.createAstronaut(),this.createGlassShards(),this.setupEventListeners(),this.animate()}init(){this.scene=new dl,this.scene.fog=new ir(132631,.032);const e=this.canvas.getBoundingClientRect(),t=e.width||window.innerWidth,n=e.height||window.innerHeight;this.camera=new yt(46,t/n,.1,120),this.camera.position.set(0,0,4.8),this.renderer=new ul({canvas:this.canvas,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(t,n),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.toneMapping=Ka,this.renderer.toneMappingExposure=1.25}createLights(){const e=new fm(725803,1.6);this.scene.add(e),this.keyLight=new pm(3718648,3.2),this.keyLight.position.set(5,5,4),this.scene.add(this.keyLight),this.rimLight1=new na(2450411,5,16),this.rimLight1.position.set(-4.5,-2,-1),this.scene.add(this.rimLight1),this.rimLight2=new na(8490232,4.2,14),this.rimLight2.position.set(3.5,-3.5,-2),this.scene.add(this.rimLight2),this.impactFlashLight=new na(16777215,0,10),this.impactFlashLight.position.set(0,0,2.5),this.scene.add(this.impactFlashLight)}createCosmicEnvironment(){const t=new vt,n=new Float32Array(2200*3),s=new Float32Array(2200*3);for(let c=0;c<2200;c++){n[c*3]=(Math.random()-.5)*32,n[c*3+1]=(Math.random()-.5)*32,n[c*3+2]=(Math.random()-.5)*55-5;const h=Math.random();h>.7?(s[c*3]=.4,s[c*3+1]=.8,s[c*3+2]=1):h>.4?(s[c*3]=.7,s[c*3+1]=.85,s[c*3+2]=1):(s[c*3]=1,s[c*3+1]=1,s[c*3+2]=1)}t.setAttribute("position",new Rt(n,3)),t.setAttribute("color",new Rt(s,3));const a=new sr({size:.05,vertexColors:!0,transparent:!0,opacity:.9});this.starfield=new pl(t,a),this.scene.add(this.starfield),this.ringsGroup=new ut;const r=8;this.rings=[];const o=new wi({color:3718648,wireframe:!0,transparent:!0,opacity:.15});for(let c=0;c<r;c++){const h=new Ri(2.8+c*.4,.02,8,36),d=new Ae(h,o);d.position.z=-c*6,this.ringsGroup.add(d),this.rings.push(d)}this.scene.add(this.ringsGroup),this.crystalsGroup=new ut;const l=new yi({color:165063,metalness:.9,roughness:.15,transparent:!0,opacity:.75});for(let c=0;c<18;c++){const h=new lr(Math.random()*.22+.1,0),d=new Ae(h,l);d.position.set((Math.random()-.5)*14,(Math.random()-.5)*12,(Math.random()-.5)*30-5),d.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,0),this.crystalsGroup.add(d)}this.scene.add(this.crystalsGroup)}createAstronaut(){this.astronautGroup=new ut;const e=new yi({color:16317180,roughness:.32,metalness:.18}),t=new yi({color:988970,roughness:.35,metalness:.65}),n=new yi({color:2450411,metalness:.88,roughness:.15}),s=new To({color:16096779,metalness:.98,roughness:.05,clearcoat:1,clearcoatRoughness:.08,reflectivity:1}),a=new wi({color:61695}),r=new wi({color:16347926}),o=new ut,l=new Ln(.56,32,32),c=new Ae(l,e);o.add(c);const h=new Ln(.48,32,24,0,Math.PI*2,0,Math.PI*.56),d=new Ae(h,s);d.rotation.x=Math.PI*.5,d.position.set(0,.05,.22),o.add(d);const u=new Ri(.44,.07,16,32),f=new Ae(u,n);f.rotation.x=Math.PI*.5,f.position.set(0,-.42,0),o.add(f);const g=new gt(.06,.07,.16,16),x=new Ae(g,t);x.rotation.z=Math.PI*.5,x.position.set(-.54,.1,.15);const m=new Ae(new ms(.055,16),a);m.position.set(-.62,.1,.15),m.rotation.y=-Math.PI*.5,o.add(x),o.add(m);const p=x.clone();p.position.set(.54,.1,.15);const E=m.clone();E.position.set(.62,.1,.15),E.rotation.y=Math.PI*.5,o.add(p),o.add(E),this.astronautGroup.add(o);const v=new ut,_=new gt(.44,.48,1.05,24),L=new Ae(_,e);L.position.set(0,-.92,0),v.add(L);const A=new Ri(.46,.04,12,24,Math.PI),R=new Ae(A,n);R.rotation.y=Math.PI*.4,R.position.set(-.25,-.65,0),v.add(R);const C=new Dt(.4,.34,.2),b=new Ae(C,t);b.position.set(0,-.78,.44),v.add(b);const S=new Ae(new Dt(.08,.03,.02),a);S.position.set(-.1,-.72,.55);const T=new Ae(new Dt(.08,.03,.02),a);T.position.set(.04,-.72,.55);const F=new Ae(new ms(.025,12),r);F.position.set(.12,-.82,.55),v.add(S),v.add(T),v.add(F);const N=new ml([new P(-.35,-.85,-.35),new P(-.52,-.95,.1),new P(-.18,-.86,.45)]),W=new hr(N,20,.04,10,!1),X=new Ae(W,t);v.add(X),this.astronautGroup.add(v);const H=new ut,J=new Dt(.76,.95,.4),G=new Ae(J,e);G.position.set(0,-.88,-.44),H.add(G);const te=new gt(.12,.12,.75,16),le=new Ae(te,n);le.position.set(-.2,-.88,-.62);const me=new Ae(te,n);me.position.set(.2,-.88,-.62),H.add(le),H.add(me);const Ue=new rr(.06,.12,12),Ve=new Ae(Ue,t);Ve.rotation.x=Math.PI,Ve.position.set(-.35,-.42,-.4);const K=Ve.clone();K.position.set(.35,-.42,-.4),H.add(Ve),H.add(K),this.astronautGroup.add(H);const Z=new ut;Z.position.set(-.56,-.58,0);const pe=new gt(.13,.12,.52,16),ne=new Ae(pe,e);ne.position.set(-.15,-.22,0),ne.rotation.z=.4,Z.add(ne);const be=new gt(.11,.1,.48,16),we=new Ae(be,e);we.position.set(-.32,-.62,.12),we.rotation.set(.3,0,.7),Z.add(we);const De=new Ae(new Ln(.13,16,16),t);De.position.set(-.46,-.86,.22),Z.add(De),this.astronautGroup.add(Z),this.leftArmGroup=Z,this.rightArmGroup=new ut,this.rightArmGroup.position.set(.56,-.58,0);const Qe=new gt(.14,.13,.52,16),Oe=new Ae(Qe,e);Oe.position.y=-.24,this.rightArmGroup.add(Oe),this.rightForearm=new ut,this.rightForearm.position.set(0,-.5,0);const st=new gt(.12,.11,.52,16),I=new Ae(st,e);I.position.set(0,-.25,.15),I.rotation.x=Math.PI*.48,this.rightForearm.add(I);const Mt=new Dt(.18,.14,.1),Fe=new Ae(Mt,t);Fe.position.set(0,-.48,.38),Fe.rotation.x=Math.PI*.48,this.rightForearm.add(Fe);for(let Be=-1.5;Be<=1.5;Be+=1){const Q=new gt(.022,.02,.14,8),ue=new Ae(Q,n);ue.position.set(Be*.045,-.56,.45),ue.rotation.x=Math.PI*.6,this.rightForearm.add(ue)}const ze=new gt(.024,.022,.12,8),ye=new Ae(ze,n);ye.position.set(-.11,-.46,.42),ye.rotation.set(.4,0,-.6),this.rightForearm.add(ye),this.rightArmGroup.add(this.rightForearm),this.astronautGroup.add(this.rightArmGroup);const Xe=new ut;Xe.position.set(0,-1.45,0);const xe=new ut,w=new Ae(new gt(.16,.14,.65,16),e);w.position.set(-.25,-.3,-.05),w.rotation.set(-.2,0,.1),xe.add(w);const M=new Ae(new Ln(.12,16,16),n);M.position.set(-.28,-.65,-.15),xe.add(M);const B=new Ae(new gt(.13,.11,.6,16),e);B.position.set(-.32,-.98,-.25),B.rotation.set(-.4,0,.1),xe.add(B);const Y=new Ae(new Dt(.18,.16,.32),t);Y.position.set(-.35,-1.28,-.32),xe.add(Y),Xe.add(xe);const j=new ut,q=new Ae(new gt(.16,.14,.65,16),e);q.position.set(.25,-.3,.05),q.rotation.set(.15,0,-.1),j.add(q);const fe=new Ae(new Ln(.12,16,16),n);fe.position.set(.28,-.65,.12),j.add(fe);const ie=new Ae(new gt(.13,.11,.6,16),e);ie.position.set(.3,-.98,.16),ie.rotation.set(.1,0,-.08),j.add(ie);const he=new Ae(new Dt(.18,.16,.32),t);he.position.set(.32,-1.28,.22),j.add(he),Xe.add(j),this.astronautGroup.add(Xe),this.legsGroup=Xe,this.astronautGroup.position.set(0,-.2,-7),this.astronautGroup.rotation.set(.2,-.4,.08),this.scene.add(this.astronautGroup)}createGlassShards(){this.shardGroup=new ut;const e=110;this.shardVelocities=[];const t=new To({color:9684477,transmission:.95,opacity:1,transparent:!0,roughness:.08,ior:1.55,thickness:.3,metalness:.1});for(let n=0;n<e;n++){const s=new cr(Math.random()*.24+.08,0),a=new Ae(s,t);a.position.set((Math.random()-.5)*3,(Math.random()-.5)*3,2.6+Math.random()*.4),a.visible=!1,this.shardGroup.add(a),this.shardVelocities.push(new P((Math.random()-.5)*.16,(Math.random()-.5)*.16,Math.random()*.22+.08))}this.scene.add(this.shardGroup)}onScrollProgress(e){this.targetProgress=Math.max(0,Math.min(1,e))}setupEventListeners(){window.addEventListener("resize",()=>{const e=this.canvas.getBoundingClientRect(),t=e.width||window.innerWidth,n=e.height||window.innerHeight;this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,n)})}triggerShatter(){this.isShattered||(this.isShattered=!0,this.impactFlashLight&&(this.impactFlashLight.intensity=8),this.shardGroup.children.forEach(e=>{e.visible=!0}),this.onBreakout&&this.onBreakout(!0))}resetShatter(){this.isShattered=!1,this.impactFlashLight&&(this.impactFlashLight.intensity=0),this.shardGroup.children.forEach((e,t)=>{e.visible=!1,e.position.set((Math.random()-.5)*3,(Math.random()-.5)*3,2.6+Math.random()*.4)}),this.onBreakout&&this.onBreakout(!1)}animate(){requestAnimationFrame(()=>this.animate()),this.time+=.015;const e=this.scrollProgress;if(this.scrollProgress+=(this.targetProgress-this.scrollProgress)*.08,this.scrollVelocity=Math.abs(this.scrollProgress-e),this.astronautGroup){const t=-7+this.scrollProgress*8.8;this.astronautGroup.position.z=t;const n=Math.sin(this.time*.9)*.08,s=Math.cos(this.time*.7)*.05;this.astronautGroup.position.y=-.15+n,this.astronautGroup.rotation.y=-.4+this.scrollProgress*.6+Math.sin(this.time*.6)*.04,this.astronautGroup.rotation.x=.2-this.scrollProgress*.25+s,this.astronautGroup.rotation.z=.08-this.scrollProgress*.08,this.leftArmGroup&&(this.leftArmGroup.rotation.z=Math.sin(this.time*.8)*.1),this.legsGroup&&(this.legsGroup.rotation.x=Math.sin(this.time*.6)*.08),this.rightArmGroup&&this.rightForearm&&(this.rightArmGroup.rotation.x=this.scrollProgress*1.1,this.rightArmGroup.rotation.y=-this.scrollProgress*.2,this.rightForearm.position.z=this.scrollProgress*.45,this.rightForearm.rotation.x=Nc.lerp(.2,.85,this.scrollProgress))}if(this.starfield){const t=this.starfield.geometry.attributes.position.array,n=.04+this.scrollProgress*.28+this.scrollVelocity*4;for(let s=2;s<t.length;s+=3)t[s]+=n,t[s]>5.5&&(t[s]=-45);this.starfield.geometry.attributes.position.needsUpdate=!0}this.rings&&this.rings.forEach((t,n)=>{t.rotation.z+=.003*(n%2===0?1:-1),t.position.z+=.08+this.scrollProgress*.2,t.position.z>6&&(t.position.z=-40)}),this.crystalsGroup&&this.crystalsGroup.children.forEach(t=>{t.rotation.x+=.01,t.rotation.y+=.015}),this.scrollProgress>=.87&&!this.isShattered?this.triggerShatter():this.scrollProgress<.72&&this.isShattered&&this.resetShatter(),this.isShattered&&(this.shardGroup.children.forEach((t,n)=>{const s=this.shardVelocities[n];t.position.add(s),t.rotation.x+=.06,t.rotation.y+=.09}),this.impactFlashLight&&this.impactFlashLight.intensity>1&&(this.impactFlashLight.intensity*=.95)),this.renderer.render(this.scene,this.camera)}}class vm{constructor(e,t,n,s,a,r){this.container=e,this.weeks=t,this.profile=n,this.soundEngine=s,this.onNavigate=a,this.onOpenDetail=r,this.heroFluidScene=null,this.astronautScene=null,this.isPlayingReel=!1}render(){const c1=this.weeks.filter(n=>n.stage==="pra-cutting").length,c2=this.weeks.filter(n=>n.stage==="audio-grafis").length,c3=this.weeks.filter(n=>n.stage==="finishing").length;this.container.innerHTML=`
      <div class="lusion-master-page" id="lusionMaster">

        <!-- ===================================================================
             SECTION 1: 21:9 ULTRAWIDE 3D HEADER (LUSION.CO HERO)
             =================================================================== -->
        <section class="sec-hero-21x9">
          <div class="frame-21x9-wrapper" id="hero21x9Container">
            <canvas id="heroCanvas21x9" class="canvas-21x9" data-cursor="hover"></canvas>

            <!-- Overlay Header UI -->
            <div class="frame-21x9-overlay">
              <div class="frame-top-meta">
                <div class="live-status-pill">
                  <span>SMK BINA BANGSA &bull; XI DKV</span>
                </div>
                <div class="palette-tip-badge" id="paletteBadge">
                  <span>Klik area ini untuk ganti warna</span>
                  <span class="click-icon">✦</span>
                </div>
              </div>

              <div class="frame-center-content">
                <div class="hero-sub-meta">EDITING AUDIO &amp; VIDEO &bull; ADOBE PREMIERE PRO</div>
                <h1 class="hero-ultrawide-headline">
                  VIDEO EDITING.<br/>
                  <span class="gradient-shimmer">AUDIO PRECISION.</span>
                </h1>
                <p class="hero-ultrawide-desc">
                  Materi pembelajaran <strong>${this.profile.name}</strong> untuk kelas XI DKV: panduan praktik Editing Audio &amp; Video dengan Adobe Premiere Pro, tata suara, dan pengumpulan tugas.
                </p>
              </div>

              <div class="frame-bottom-bar">
                <div class="mouse-scroll-indicator">
                  <div class="mouse-icon">
                    <div class="mouse-wheel-dot"></div>
                  </div>
                  <span>SCROLL KE BAWAH UNTUK MELIHAT MATERI</span>
                </div>

                <div class="frame-quick-actions">

                  <button class="pill-action-btn" id="btnScrollToCurriculum" data-cursor="hover">
                    <span>LIHAT SILABUS MINGGUAN ↓</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>


        <!-- ===================================================================
             SECTION 2: SCROLL-TRACER SPINE & MANIFESTO
             =================================================================== -->
        <section class="sec-spine-intro" id="secSpine">
          <div class="spine-container">
            <!-- Garis Dinamis yang Mengikuti Scroll -->
            <div class="spine-line-track">
              <div class="spine-line-fill" id="spineLine1"></div>
              <div class="spine-glow-head" id="spineGlow1"></div>
            </div>

            <div class="spine-content-block">
              <span class="mono-section-badge">PRINSIP BELAJAR</span>
              <h2 class="spine-giant-quote">
                "BELAJAR EDITING AUDIO &amp; VIDEO BUKAN HANYA SOAL HAFAL TOMBOL, TAPI MELATIH RASA VISUAL, RITME, DAN KERAPIAN EKSEKUSI."
              </h2>
              <p class="spine-lead-text">
                Semua modul disusun bertahap dari dasar sampai karya siap tayang. Mulai dari pra-produksi storyboard, kerapian timeline, pacing editing, restorasi &amp; mixing audio yang bersih, hingga color grading dan master export di Premiere Pro.
              </p>
            </div>
          </div>
        </section>


        <!-- ===================================================================
             SECTION 3: APPLE OS SHOWREEL CINEMA PLAYER (ADRIAN MUTHI SHOWREEL)
             =================================================================== -->
        <section class="sec-expand-media" id="secGenie">
          <div class="genie-sticky-wrapper">
            <div class="genie-card-outer" id="genieCard">
              <!-- macOS Window Header Bar -->
              <div class="macos-player-header">
                <div class="macos-traffic-dots">
                  <span class="dot dot-close"></span>
                  <span class="dot dot-min"></span>
                  <span class="dot dot-max"></span>
                </div>
                <div class="macos-window-title">ADRIAN MUTHI // AUDIO-VIDEO SHOWREEL 2026.MP4</div>
                <div class="macos-window-badge">720P HD • 25 FPS • 01:54</div>
              </div>

              <div class="media-player-container">
                <!-- Video Reel Player Screen -->
                <div class="media-screen" id="reelScreen">
                  <video 
                    id="reelVideo"
                    class="reel-video-element"
                    src="/showreel.mp4"
                    poster="/thumbnails/showreel-poster.jpg"
                    playsinline
                    preload="metadata"
                  ></video>
                  <img 
                    src="/thumbnails/showreel-poster.jpg" 
                    alt="Adrian Muthi Showreel" 
                    class="reel-poster-img"
                    id="reelPoster" 
                  />
                  <div class="reel-glitch-overlay"></div>

                  <!-- Play/Pause Center Button -->
                  <div class="reel-center-controls" id="reelCenterControls">
                    <button class="reel-play-circle" id="btnTogglePlayReel" data-cursor="hover" aria-label="Putar atau Jeda Showreel">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" id="iconPlay">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" id="iconPause" style="display: none;">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                    </button>
                    <span class="reel-play-label" id="reelPlayLabel">KLIK UNTUK MEMUTAR SHOWREEL</span>
                  </div>

                  <!-- In-Video Top HUD -->
                  <div class="reel-top-hud">
                    <span class="hud-tag">ADRIAN MUTHI • SHOWREEL KARYA</span>
                    <span class="hud-fps">25 FPS</span>
                    <span class="hud-timecode" id="reelTimecode">00:00:00:00</span>
                  </div>

                  <!-- In-Video Bottom HUD Bar -->
                  <div class="reel-bottom-hud">
                    <div class="reel-progress-track" id="reelScrubTrack" data-cursor="hover" title="Klik untuk melompat timeline">
                      <div class="reel-progress-fill" id="reelProgressFill"></div>
                    </div>
                    <div class="hud-control-row">
                      <span class="hud-layer-tag">Showreel Editing Audio &amp; Video</span>
                      <div class="hud-audio-group">
                        <button class="hud-audio-btn" id="btnReelAudio" data-cursor="hover" title="Nyalakan / Matikan Audio Video">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" id="iconReelSpeaker">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                          <span id="labelReelAudio">AUDIO: ON</span>
                        </button>
                        <div class="hud-audio-bars" id="reelAudioBars">
                          <span class="hud-bar b1"></span>
                          <span class="hud-bar b2"></span>
                          <span class="hud-bar b3"></span>
                          <span class="hud-bar b4"></span>
                          <span class="hud-bar b5"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Info Card -->
                <div class="genie-card-footer">
                  <div class="footer-left-col">
                    <span class="footer-badge">PORTFOLIO SHOWREEL</span>
                    <h3 class="footer-title">Adrian Muthi • Audio &amp; Video Editing Showreel</h3>
                    <p class="footer-meta">Durasi: 01:54 • Video Editing, Audio Mixing, Commercial TVC &amp; Color Grading</p>
                  </div>
                  <div class="footer-right-col">
                    <button class="footer-action-btn" id="btnExploreSyllabusReel" data-cursor="hover">
                      Jelajahi Silabus Lengkap ↓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <!-- ===================================================================
             SECTION 4 & 5: MATERI & BAHAN AJAR (3D TILT & ROLLING TEXT HOVER)
             =================================================================== -->
        <section class="sec-curriculum-showcase" id="secCurriculum">
          <div class="curriculum-container">
            <div class="curriculum-header-row">
              <div>
                <span class="mono-section-badge">MATERI MINGGUAN</span>
                <h2 class="curriculum-section-title">Silabus &amp; Bahan Ajar Terbuka</h2>
                <p class="curriculum-section-desc">
                  Seluruh materi difokuskan pada mata pelajaran <strong>Editing Audio &amp; Video</strong> dengan <strong>Adobe Premiere Pro</strong> — mulai dari pra-produksi, rough cut, tata suara, grafis berita, green screen, hingga color grading &amp; export. Pilih kartu di bawah untuk membuka modul, kuis, dan tugasnya.
                </p>

                <!-- Filter Tahapan Editing Audio & Video -->
                <div class="home-filter-tabs">
                  <button class="h-filter-pill active" data-home-filter="all" data-cursor="hover">Semua Materi (${this.weeks.length})</button>
                  <button class="h-filter-pill pill-pr" data-home-filter="pra-cutting" data-cursor="hover">
                    <span class="tab-badge-pr">01–02</span> Pra-Produksi &amp; Rough Cut (${c1})
                  </button>
                  <button class="h-filter-pill pill-pr" data-home-filter="audio-grafis" data-cursor="hover">
                    <span class="tab-badge-pr">03–04</span> Audio &amp; Grafis Berita (${c2})
                  </button>
                  <button class="h-filter-pill pill-pr" data-home-filter="finishing" data-cursor="hover">
                    <span class="tab-badge-pr">05–06</span> Green Screen &amp; Finishing (${c3})
                  </button>
                </div>
              </div>

              <div class="curriculum-counter-badge">
                <span class="count-big">${this.weeks.length}</span>
                <span class="count-label">MINGGU TERJADWAL</span>
              </div>
            </div>

            <!-- Grid Kartu Materi dengan 3D Tilt & Rolling Text -->
            <div class="curriculum-grid-3d" id="curriculumGrid">
              ${this.weeks.map((n,s)=>`
                <div class="tilt-card-3d" data-week-id="${n.id}" data-subject="${n.subject}" data-stage="${n.stage||""}" data-cursor="view">
                  <div class="tilt-card-inner">
                    <!-- Media Thumbnail with 3D Tilt Reflection -->
                    <div class="tilt-thumb-box">
                      <img src="${n.heroImage}" alt="${n.title}" class="tilt-thumb-img" data-fallback="${n.fallbackImage||''}" onerror="if(this.dataset.fallback&&this.src!==this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}" />
                      <div class="tilt-glare-overlay"></div>
                      
                      <div class="tilt-badges-top">
                        <span class="badge-week-tag">MINGGU ${n.weekNumber}</span>
                        <span class="badge-subject-tag badge-subj-pr">
                          Audio &amp; Video
                        </span>
                        ${n.id==="pr-02-5"||n.id==="minggu-02-1"?`
                          <span class="badge-feature-pill pill-amber">✦ Produksi Berita TV</span>
                        `:n.directLinks?`
                          <span class="badge-feature-pill pill-cyan">✦ Slide Materi &amp; Kuis</span>
                        `:n.caseStudies?`
                          <span class="badge-feature-pill pill-amber">✦ TVC Pra-Produksi</span>
                        `:""}
                      </div>

                      <div class="tilt-hover-prompt">
                        <span>BUKA MATERI</span>
                        <span class="arrow-reveal">→</span>
                      </div>
                    </div>

                    <!-- Card Body with Kinetic Rolling Text -->
                    <div class="tilt-card-body">
                      <div class="tilt-meta-row">
                        <span class="tilt-category" style="color: ${n.accentColor}">● ${n.category}</span>
                        <span class="tilt-duration">${n.duration}</span>
                      </div>

                      <!-- Rolling Text Effect (Awwwards / Lusion) -->
                      <h3 class="tilt-title-wrap">
                        <span class="rolling-text">
                          <span class="roll-primary">${n.title}</span>
                          <span class="roll-secondary" style="color: ${n.accentColor}">${n.title}</span>
                        </span>
                      </h3>

                      <p class="tilt-subtitle">${n.subtitle}</p>

                      <div class="tilt-card-footer">
                        <span class="level-badge">Level: ${n.level}</span>
                        <div class="footer-action-link">
                          <span>Eksplorasi</span>
                          <span class="arrow-reveal">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>


        ${_rlsm()}

      </div>
    `,this.initScenes(),this.bindInteractions()}initScenes(){const e=document.getElementById("heroCanvas21x9");e&&(this.heroFluidScene=new mm(e));this.astronautScene=_mlsc({three:{Scene:dl,PerspectiveCamera:yt,WebGLRenderer:ul,Group:ut,Mesh:Ae,Points:pl,PointsMaterial:sr,BufferGeometry:vt,BufferAttribute:Rt,FogExp2:ir,AmbientLight:fm,DirectionalLight:pm,PointLight:na,MeshStandardMaterial:yi,MeshPhysicalMaterial:To,MeshBasicMaterial:wi,ShaderMaterial:an,SphereGeometry:Ln,TorusGeometry:Ri,IcosahedronGeometry:or,OctahedronGeometry:lr,BoxGeometry:Dt,TubeGeometry:hr,CatmullRomCurve3:ml,Color:Ne,Vector3:P,Vector2:Se,AdditiveBlending:sa,ACESFilmicToneMapping:Ka},soundEngine:this.soundEngine,onOpenDetail:this.onOpenDetail,onNavigate:this.onNavigate})}bindInteractions(){const e=document.getElementById("heroCanvas21x9"),t=document.getElementById("paletteBadge");e&&this.heroFluidScene&&e.addEventListener("click",()=>{const T=this.heroFluidScene.cycleColorPalette();this.soundEngine.playTick(1200),t&&(t.innerHTML=`<span>PALET: ${T.name.toUpperCase()}</span> <span class="click-icon">✦</span>`)});const n=document.getElementById("btnScrollToCurriculum");n&&n.addEventListener("click",()=>{const T=document.getElementById("secCurriculum");T&&(this.soundEngine.playWhoosh(380,90),T.scrollIntoView({behavior:"smooth"}))});const s=document.getElementById("btnBackToTopSyllabus");s&&s.addEventListener("click",()=>{const T=document.getElementById("secCurriculum");T&&(this.soundEngine.playWhoosh(420,100),T.scrollIntoView({behavior:"smooth"}))});const a=this.container.querySelectorAll(".h-filter-pill"),r=this.container.querySelectorAll(".tilt-card-3d");a.forEach(T=>{T.addEventListener("click",()=>{a.forEach(N=>N.classList.remove("active")),T.classList.add("active");const F=T.getAttribute("data-home-filter");this.soundEngine.playTick(1050),r.forEach(N=>{const W=N.getAttribute("data-stage")||"";F==="all"||W===F?N.style.display="":N.style.display="none"})})});const o=document.getElementById("reelVideo"),l=document.getElementById("reelScreen"),c=document.getElementById("btnTogglePlayReel"),h=document.getElementById("iconPlay"),d=document.getElementById("iconPause"),u=document.getElementById("reelPlayLabel"),f=document.getElementById("reelTimecode"),g=document.getElementById("reelScrubTrack"),x=document.getElementById("reelProgressFill"),m=document.getElementById("btnReelAudio"),p=document.getElementById("labelReelAudio"),E=document.getElementById("iconReelSpeaker"),v=document.getElementById("reelAudioBars");let _=null;const L=()=>{l&&(l.classList.remove("controls-hidden"),clearTimeout(_),o&&!o.paused&&(_=setTimeout(()=>{l.classList.add("controls-hidden")},2600)))},A=T=>{this.isPlayingReel=T,T?(h&&(h.style.display="none"),d&&(d.style.display="block"),u&&(u.textContent="PAUSE SHOWREEL"),c&&c.classList.add("playing"),l&&l.classList.add("is-playing"),v&&v.classList.add("active"),this.soundEngine&&typeof this.soundEngine.duckBGM=="function"&&o&&!o.muted&&this.soundEngine.duckBGM(.04,.6)):(h&&(h.style.display="block"),d&&(d.style.display="none"),u&&(u.textContent=o&&o.ended?"PUTAR ULANG SHOWREEL":"PUTAR SHOWREEL"),c&&c.classList.remove("playing"),l&&(l.classList.remove("is-playing"),l.classList.remove("controls-hidden")),v&&v.classList.remove("active"),this.soundEngine&&typeof this.soundEngine.restoreBGM=="function"&&this.soundEngine.restoreBGM(.2,.8))},R=()=>{o&&(this.soundEngine.playTick(1100),o.paused||o.ended?o.play().then(()=>{A(!0),L()}).catch(()=>{o.muted=!0,o.play().then(()=>A(!0))}):(o.pause(),A(!1)))};if(c&&c.addEventListener("click",T=>{T.stopPropagation(),R()}),l&&(l.addEventListener("click",T=>{T.target.closest("#btnReelAudio")||T.target.closest("#reelScrubTrack")||R()}),l.addEventListener("mousemove",()=>{L()}),l.addEventListener("mouseleave",()=>{o&&!o.paused&&l.classList.add("controls-hidden")})),o&&(o.addEventListener("timeupdate",()=>{const T=o.currentTime||0,F=o.duration||114,N=T/F*100;if(x&&(x.style.width=`${N}%`),f){const W=Math.floor(T),X=String(Math.floor(W/60)).padStart(2,"0"),H=String(W%60).padStart(2,"0"),J=String(Math.floor(T%1*25)).padStart(2,"0");f.textContent=`00:${X}:${H}:${J}`}}),o.addEventListener("play",()=>A(!0)),o.addEventListener("pause",()=>A(!1)),o.addEventListener("ended",()=>{A(!1),x&&(x.style.width="100%"),u&&(u.textContent="PUTAR ULANG SHOWREEL")})),g&&o){const T=F=>{const N=g.getBoundingClientRect(),X=Math.max(0,Math.min(N.width,F.clientX-N.left))/N.width,H=o.duration||114;o.currentTime=X*H,x&&(x.style.width=`${X*100}%`),this.soundEngine.playTick(1300)};g.addEventListener("click",F=>{F.stopPropagation(),T(F)})}m&&o&&m.addEventListener("click",T=>{T.stopPropagation(),o.muted=!o.muted,this.soundEngine.playTick(1200),o.muted?(p&&(p.textContent="AUDIO: MUTE"),m.classList.add("muted"),E&&(E.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>'),v&&v.classList.remove("active"),this.soundEngine&&typeof this.soundEngine.restoreBGM=="function"&&this.soundEngine.restoreBGM(.2,.5)):(p&&(p.textContent="AUDIO: ON"),m.classList.remove("muted"),E&&(E.innerHTML='<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>'),!o.paused&&v&&v.classList.add("active"),!o.paused&&this.soundEngine&&typeof this.soundEngine.duckBGM=="function"&&this.soundEngine.duckBGM(.04,.5))});const C=document.getElementById("btnExploreSyllabusReel");C&&C.addEventListener("click",()=>{const T=document.getElementById("secCurriculum");T&&(this.soundEngine.playWhoosh(400,95),T.scrollIntoView({behavior:"smooth"}))});const b=document.getElementById("btnScrollToShowreel");b&&b.addEventListener("click",()=>{const T=document.getElementById("secGenie");T&&(this.soundEngine.playWhoosh(380,90),T.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{o&&o.paused&&R()},650))}),this.container.querySelectorAll(".tilt-card-3d").forEach(T=>{const F=T.querySelector(".tilt-card-inner"),N=T.querySelector(".tilt-glare-overlay");T.addEventListener("mousemove",W=>{if(window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse)").matches)return;const X=T.getBoundingClientRect(),H=W.clientX-X.left,J=W.clientY-X.top,G=X.width/2,te=X.height/2,le=-((J-te)/te)*12,me=(H-G)/G*14;F&&(F.style.transform=`perspective(1000px) rotateX(${le}deg) rotateY(${me}deg) scale3d(1.02, 1.02, 1.02)`),N&&(N.style.opacity="1",N.style.background=`radial-gradient(circle at ${H}px ${J}px, rgba(255,255,255,0.18) 0%, transparent 65%)`)}),T.addEventListener("mouseleave",()=>{F&&(F.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"),N&&(N.style.opacity="0")}),T.addEventListener("click",()=>{const W=T.getAttribute("data-week-id");this.soundEngine.playWhoosh(450,100),this.onOpenDetail(W)})})}onScrollUpdate(e,t){if(!t)return;const n=document.getElementById("secSpine"),s=document.getElementById("spineLine1"),a=document.getElementById("spineGlow1");if(n&&s){const u=n.getBoundingClientRect(),f=Math.max(0,Math.min(1,(window.innerHeight-u.top)/(u.height+200)));s.style.height=`${f*100}%`,a&&(a.style.top=`${f*100}%`)}const r=document.getElementById("secGenie"),o=document.getElementById("genieCard");if(r&&o){const u=r.getBoundingClientRect();u.top<window.innerHeight*.85&&u.bottom>window.innerHeight*.15?o.classList.add("genie-active"):o.classList.remove("genie-active")}this.astronautScene&&this.astronautScene.onScrollUpdate&&this.astronautScene.onScrollUpdate(e,t)}destroy(){this.astronautScene&&this.astronautScene.destroy&&this.astronautScene.destroy(),this.astronautScene=null}}class _m{constructor(e,t,n,s){this.container=e,this.weeks=t,this.soundEngine=n,this.onOpenDetail=s,this.currentFilter="all",this.searchQuery=""}render(){const e=this.weeks.length,c1=this.weeks.filter(s=>s.stage==="pra-cutting").length,c2=this.weeks.filter(s=>s.stage==="audio-grafis").length,c3=this.weeks.filter(s=>s.stage==="finishing").length;this.container.innerHTML=`
      <div class="syllabus-view-wrapper" id="syllabusWrapper">
        <!-- Hero Header -->
        <header class="syllabus-header">
          <div class="header-content-container">
            <div class="syllabus-breadcrumb">
              <span class="crumb-accent">● SILABUS &amp; MODUL</span>
              <span class="crumb-sep">/</span>
              <span>EDITING AUDIO &amp; VIDEO</span>
            </div>
            <h1 class="syllabus-main-title">Eksplorasi Materi Setiap Minggu</h1>
            <p class="syllabus-sub-desc">
              Silabus lengkap mata pelajaran <strong>Editing Audio &amp; Video</strong> dengan <strong>Adobe Premiere Pro</strong> — mulai dari pra-produksi &amp; storyboard, rough cut cepat, restorasi &amp; mixing audio, grafis siaran berita, green screen, hingga color grading &amp; master export.
            </p>

            <!-- Filter Tabs & Quick Search -->
            <div class="syllabus-control-bar">
              <div class="filter-tabs-group">
                <button class="filter-pill ${this.currentFilter==="all"?"active":""}" data-filter="all" data-cursor="hover">
                  Semua Materi (${e})
                </button>
                <button class="filter-pill filter-pill-pr ${this.currentFilter==="pra-cutting"?"active":""}" data-filter="pra-cutting" data-cursor="hover">
                  <span class="tab-badge-pr">01–02</span> Pra-Produksi &amp; Cutting (${c1})
                </button>
                <button class="filter-pill filter-pill-pr ${this.currentFilter==="audio-grafis"?"active":""}" data-filter="audio-grafis" data-cursor="hover">
                  <span class="tab-badge-pr">03–04</span> Audio &amp; Grafis (${c2})
                </button>
                <button class="filter-pill filter-pill-pr ${this.currentFilter==="finishing"?"active":""}" data-filter="finishing" data-cursor="hover">
                  <span class="tab-badge-pr">05–06</span> Green Screen &amp; Finishing (${c3})
                </button>
              </div>

              <div class="search-input-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <input type="text" id="syllabusSearchInput" value="${this.searchQuery}" placeholder="Cari materi (misal: Storyboard, Audio, Green Screen, Grading)..." />
              </div>
            </div>
          </div>
        </header>

        <!-- Grid Cards Section (Editing Audio & Video) -->
        <div class="syllabus-grid-section" id="syllabusGrid">
          ${this.renderCards()}
        </div>
      </div>
    `,this.bindEvents()}renderCardItem(e){return`
      <div class="meeting-card-glass card-theme-pr" data-week-id="${e.id}" data-cursor="view">
        <div class="card-media-thumb">
          <img src="${e.heroImage}" alt="${e.title}" class="thumb-img" loading="lazy" data-fallback="${e.fallbackImage||''}" onerror="if(this.dataset.fallback&&this.src!==this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}" />
          <div class="thumb-tint-gradient"></div>
          
          <div class="card-top-badges">
            <span class="badge-week">MINGGU ${e.weekNumber}</span>
            <span class="badge-subj badge-subj-pr">
              Audio &amp; Video
            </span>
          </div>

          <div class="card-hover-action">
            <div class="action-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <span>BUKA MATERI</span>
          </div>
        </div>

        <div class="card-body-content">
          <div class="card-meta-line">
            <span class="category-text" style="color: ${e.accentColor}">● ${e.category}</span>
            <span class="duration-text">${e.duration}</span>
          </div>

          <h3 class="card-title">${e.title}</h3>
          <p class="card-subtitle-preview">${e.subtitle}</p>

          <div class="card-footer-info">
            <span class="level-indicator">Level: ${e.level}</span>
            <span class="layers-count">${e.aeLayers?e.aeLayers.length:0} Track Timeline • ${e.assets?e.assets.length:0} Aset</span>
          </div>
        </div>
      </div>
    `}renderCards(){const e=this.searchQuery.toLowerCase(),t=l=>e?l.title.toLowerCase().includes(e)||l.subtitle.toLowerCase().includes(e)||l.category.toLowerCase().includes(e)||l.overview.toLowerCase().includes(e)||l.weekNumber.includes(e):!0,n=this.weeks.filter(l=>(this.currentFilter==="all"||l.stage===this.currentFilter)&&t(l));if(n.length===0)return`
        <div class="empty-results-box">
          <div class="empty-icon-circle">🔍</div>
          <p class="empty-msg-title">Tidak Ditemukan Materi</p>
          <p class="empty-msg-desc">Tidak ada materi yang cocok dengan kata kunci "${this.searchQuery}" pada filter ini.</p>
        </div>
      `;let o='<div class="syllabus-groups-wrapper">';return o+=`
        <section class="syllabus-subject-group group-premiere">
          <div class="group-header-card group-header-pr">
            <div class="group-header-left">
              <div class="software-badge-pill pill-pr">
                <span class="sw-code">Pr</span>
                <span class="sw-title">PREMIERE PRO</span>
              </div>
              <div class="group-title-info">
                <h2 class="group-heading">Mata Pelajaran: Editing Audio &amp; Video</h2>
                <p class="group-subtext">Pra-Produksi Iklan &amp; Berita, Timeline Rough Cut Q/W, Restorasi &amp; Mixing Audio DeNoise, Grafis Lower Third, Ultra Key Green Screen &amp; Color Grading H.264</p>
              </div>
            </div>
            <div class="group-header-right">
              <span class="group-count-tag count-pr">${n.length} Pertemuan</span>
            </div>
          </div>

          <div class="syllabus-grid-container">
            ${n.map(l=>this.renderCardItem(l)).join("")}
          </div>
        </section>
      `,o+="</div>",o}apply3DTilt(){const e=this.container.querySelectorAll(".meeting-card-glass");e.forEach(t=>{let n=t.querySelector(".card-glare-overlay");n||(n=document.createElement("div"),n.className="card-glare-overlay",n.style.cssText="position:absolute; inset:0; border-radius:inherit; pointer-events:none; opacity:0; transition:opacity 0.2s ease; z-index:5;",t.appendChild(n)),t.addEventListener("mousemove",s=>{if(window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse)").matches)return;const a=t.getBoundingClientRect(),r=s.clientX-a.left,o=s.clientY-a.top,l=a.width/2,c=a.height/2,h=-((o-c)/c)*12,d=(r-l)/l*14;t.style.transform=`perspective(1000px) rotateX(${h.toFixed(2)}deg) rotateY(${d.toFixed(2)}deg) scale3d(1.035, 1.035, 1.035) translateZ(10px)`,t.style.boxShadow="0 22px 48px rgba(0,0,0,0.35), 0 0 30px rgba(56,189,248,0.25)",n.style.opacity="1",n.style.background=`radial-gradient(circle at ${r}px ${o}px, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)`}),t.addEventListener("mouseleave",()=>{t.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)",t.style.boxShadow="",n.style.opacity="0"})})}bindEvents(){const e=this.container.querySelectorAll(".filter-pill");e.forEach(s=>{s.addEventListener("click",()=>{e.forEach(a=>a.classList.remove("active")),s.classList.add("active"),this.currentFilter=s.getAttribute("data-filter"),this.soundEngine.playTick(1050),this.updateGrid()})});const t=document.getElementById("syllabusSearchInput");t&&t.addEventListener("input",s=>{this.searchQuery=s.target.value.trim(),this.updateGrid()});const n=document.getElementById("syllabusGrid");n&&n.addEventListener("click",s=>{const a=s.target.closest("[data-week-id]");if(a){const r=a.getAttribute("data-week-id");this.soundEngine.playWhoosh(440,100),this.onOpenDetail(r)}}),this.apply3DTilt()}updateGrid(){const e=document.getElementById("syllabusGrid");e&&(e.innerHTML=this.renderCards(),this.apply3DTilt())}}class xm{constructor(e,t,n,s,a){this.container=e,this.weeks=t,this.soundEngine=n,this.onBack=s,this.onSelectWeek=a,this.currentWeekIndex=0,this.scrollX=0,this.targetScrollX=0,this.maxScroll=0,this.isDragging=!1,this.startX=0,this.currentX=0,this.wrapper=null,this.track=null,this.progressBar=null,this.animationFrameId=null}render(e){this.destroy();const t=this.weeks.findIndex(a=>a.id===e);this.currentWeekIndex=t!==-1?t:0;const n=this.weeks[this.currentWeekIndex],s=this.weeks[(this.currentWeekIndex+1)%this.weeks.length];this.container.innerHTML=`
      <div class="horizontal-detail-view" id="horizontalView" data-lenis-prevent data-lenis-prevent-touch data-lenis-prevent-wheel>
        <!-- Floating Header -->
        <header class="detail-floating-header">
          <button class="back-pill-btn" id="btnBackToSyllabus" data-cursor="hover">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>KEMBALI KE SILABUS</span>
          </button>

          <div class="detail-header-center">
            <span class="detail-week-badge">${n.subject.toUpperCase()} • MINGGU ${n.weekNumber}</span>
            <span class="detail-subject-pill">${n.category}</span>
          </div>

          <div class="detail-header-right">
            <div class="detail-nav-arrows">
              <button class="detail-arrow-btn" id="btnScrollPrev" title="Geser ke Kiri (Sebelumnya)" data-cursor="hover" aria-label="Geser ke Kiri">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button class="detail-arrow-btn" id="btnScrollNext" title="Geser ke Kanan (Berikutnya)" data-cursor="hover" aria-label="Geser ke Kanan">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div class="scroll-instruction-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
              </svg>
              <span>SCROLL / USAP</span>
            </div>
          </div>
        </header>

        <!-- Progress Indicator Bar -->
        <div class="detail-progress-track">
          <div class="detail-progress-fill" id="horizontalProgress"></div>
        </div>

        <!-- The Horizontal Continuous Track -->
        <div class="horizontal-track-wrapper" id="trackWrapper" data-lenis-prevent data-lenis-prevent-touch data-lenis-prevent-wheel>
          <div class="horizontal-track" id="horizontalTrack">

            <!-- PANEL 01: GIANT INTRO & METADATA -->
            <section class="h-panel panel-intro">
              <div class="panel-inner">
                <div class="intro-meta-tags">
                  <span class="tag-accent" style="color: ${n.accentColor}">● ${n.category}</span>
                  <span class="tag-meta">DURASI: ${n.duration}</span>
                  <span class="tag-meta">TINGKAT: ${n.level}</span>
                </div>
                <h1 class="giant-h1-title">${n.title}</h1>
                <p class="h-subtitle">${n.subtitle}</p>
                <div class="h-divider" style="background: linear-gradient(90deg, ${n.accentColor}, transparent)"></div>
                <p class="h-overview-text">${n.overview}</p>

                <div class="intro-scroll-prompt">
                  <span>${this.isMobileView()?"Scroll ke bawah untuk eksplorasi materi":"Geser untuk eksplorasi materi"}</span>
                  <div class="prompt-arrow">→</div>
                </div>
              </div>
            </section>

            <!-- PANEL 02: HERO CINEMATIC SHOWCASE & TIME CODE -->
            <section class="h-panel panel-showcase">
              <div class="panel-inner">
                <div class="showcase-card-container">
                  <div class="showcase-badge-row">
                    <span class="badge-status">PRATINJAU MATERI</span>
                    <span class="badge-timecode">Pertemuan ${n.weekNumber}</span>
                    <span class="badge-fps">${n.duration}</span>
                  </div>

                  <div class="showcase-video-wrapper">
                    <img src="${n.heroImage}" alt="${n.title}" class="showcase-media-image" data-fallback="${n.fallbackImage||''}" onerror="if(this.dataset.fallback&&this.src!==this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}" />
                    <div class="showcase-gradient-overlay"></div>
                    <div class="showcase-center-play">
                      <div class="play-pulse-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                      <span class="play-label">PRATINJAU PERTEMUAN ${n.weekNumber}</span>
                    </div>
                  </div>

                  <div class="showcase-caption">
                    <span>*Preview render project hasil akhir dari modul pertemuan ${n.weekNumber}</span>
                  </div>
                </div>
              </div>
            </section>

            ${n.directLinks&&n.directLinks.filter(a=>a&&a.type!=="teacher").length>0?`
              <!-- PANEL: BAHAN TAYANG PRESENTASI & MODUL SISWA -->
              <section class="h-panel panel-direct-launcher">
                <div class="panel-inner">
                  <div class="section-label-group">
                    <span class="panel-number-label">BAHAN TAYANG &amp; MODUL SISWA</span>
                    <h2 class="panel-sub-title">Bahan Tayang Presentasi &amp; Modul Materi</h2>
                    <p class="panel-desc">Akses langsung slide presentasi materi dan modul PDF pembelajaran sebelum mengerjakan kuis singkat.</p>
                  </div>

                  <div class="launcher-cards-grid ${n.directLinks.filter(a=>a&&a.type!=="teacher").length>2?"launcher-grid-4":""}">
                    ${n.directLinks.filter(a=>a&&a.type!=="teacher").map((a,r)=>{const l=a.type==="pdf",c=l?"card-slate":"card-blue",h=l?"badge-slate":"badge-blue",d=l?"btn-slate":"btn-blue";return`
                      <div class="launcher-card ${c}" data-cursor="hover">
                        <div class="launcher-tag-row">
                          <span class="launcher-badge ${h}">
                            ${l?"BERKAS • UNDUH DOKUMEN RESMI (PDF)":(a.url||"").toLowerCase().includes(".pdf")?"SLIDE PDF • BAHAN TAYANG SISWA":"SLIDE MATERI • BAHAN TAYANG SISWA"}
                          </span>
                        </div>
                        <h3 class="launcher-title">${a.title}</h3>
                        <p class="launcher-desc">${a.desc}</p>
                        <div class="launcher-actions">
                          <a href="${a.url}" target="_blank" class="launcher-btn ${d}">
                            <span>${a.label}</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    `}).join("")}
                  </div>
                </div>
              </section>
            `:""}

            ${n.caseStudies&&n.caseStudies.length>0?`
              <!-- PANEL: CASE STUDIES / BEDAH IKLAN KOMERSIAL TVC -->
              <section class="h-panel panel-case-studies">
                <div class="panel-inner">
                  <div class="section-label-group">
                    <span class="panel-number-label">STUDI KASUS PRA-PRODUKSI</span>
                    <h2 class="panel-sub-title">Bedah Formula Ide, Tema &amp; Konsep</h2>
                    <p class="panel-desc">Analisis referensi iklan produk TVC profesional untuk membedah perbedaan Slice of Life, Voice Over monolog, dan shot produk tajam.</p>
                  </div>

                  <div class="case-study-grid">
                    ${n.caseStudies.map(a=>`
                      <div class="case-study-card" data-cursor="hover">
                        <span class="case-courtesy">${a.tag}</span>
                        <h3 class="case-brand">${a.brand}</h3>
                        <div class="case-focus-badge">${a.focus}</div>
                        <p class="case-concept-desc">${a.concept}</p>
                        <div class="case-card-glow"></div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </section>
            `:""}

            ${n.youtubeVault?`
              <!-- PANEL: YOUTUBE FILM SCENES & MUSIC TRACKS VAULT -->
              <section class="h-panel panel-youtube-vault">
                <div class="panel-inner">
                  <div class="section-label-group">
                    <span class="panel-number-label">KATALOG BAHAN PRAKTIKUM YOUTUBE</span>
                    <h2 class="panel-sub-title">Adegan Film Epic &amp; Trek Musik Remake</h2>
                    <p class="panel-desc">Akses langsung ke YouTube untuk menonton referensi, memilih adegan film bioskop, dan menentukan musik bertempo tegas sebelum proses editing di lab.</p>
                  </div>

                  <div class="yt-vault-container">
                    <!-- Column 1: Film Scenes -->
                    <div class="vault-column" data-vertical-card="true">
                      <div class="vault-col-header">
                        <span class="vault-col-title">🎬 ${n.youtubeVault.filmScenes.length} REFERENSI SCENE FILM (KLIK MENUJU YOUTUBE)</span>
                        <span class="vault-col-badge">HD 1080P FOOTAGE</span>
                      </div>
                      <div class="vault-cards-scroll">
                        ${n.youtubeVault.filmScenes.map(a=>`
                          <div class="film-vault-card" data-cursor="hover">
                            <div class="f-top-row">
                              <span class="f-tag">${a.tag}</span>
                              <span class="f-vibe">${a.vibe}</span>
                            </div>
                            <h4 class="f-title">${a.title}</h4>
                            <p class="f-scene">${a.scene}</p>
                            <p class="f-why">${a.why}</p>
                            <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="yt-card-btn btn-film">
                              <span>▶ BUKA ADEGAN DI YOUTUBE</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                              </svg>
                            </a>
                          </div>
                        `).join("")}
                      </div>
                    </div>

                    <!-- Column 2: Music Tracks -->
                    <div class="vault-column" data-vertical-card="true">
                      <div class="vault-col-header">
                        <span class="vault-col-title">🎵 ${n.youtubeVault.musicTracks.length} PILIHAN MUSIK REMAKE (KLIK MENUJU YOUTUBE)</span>
                        <span class="vault-col-badge">BEAT &amp; RHYTHM</span>
                      </div>
                      <div class="vault-cards-scroll">
                        ${n.youtubeVault.musicTracks.map(a=>`
                          <div class="music-vault-card" data-cursor="hover">
                            <div class="m-top-row">
                              <span class="m-genre">${a.genre}</span>
                              <span class="m-bpm">${a.bpm}</span>
                            </div>
                            <h4 class="m-title">${a.title}</h4>
                            <p class="m-why">${a.why}</p>
                            <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="yt-card-btn btn-music">
                              <span>🎧 DENGAR LAGU DI YOUTUBE</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                              </svg>
                            </a>
                          </div>
                        `).join("")}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            `:""}

            ${n.downloadTutorial?`
              <!-- PANEL: CARA DOWNLOAD DI YTMP3 & COBALT -->
              <section class="h-panel panel-download-tutorial">
                <div class="panel-inner">
                  <div class="section-label-group">
                    <span class="panel-number-label">TUTORIAL DOWNLOAD DI LAB</span>
                    <h2 class="panel-sub-title">Cara Unduh Audio &amp; Video dari YouTube</h2>
                    <p class="panel-desc">${n.downloadTutorial.intro}</p>
                  </div>

                  <div class="tutorial-tools-grid">
                    ${n.downloadTutorial.tools.map(a=>`
                      <div class="tool-card" data-cursor="hover">
                        <div class="tool-header">
                          <span class="tool-badge">${a.badge}</span>
                        </div>
                        <h4 class="tool-name">${a.name}</h4>
                        <p class="tool-desc">${a.desc}</p>
                        <div class="tool-caution">
                          <span class="caution-icon">⚠️</span>
                          <span>${a.caution}</span>
                        </div>
                        <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="tool-launch-btn">
                          <span>BUKA SITUS TOOL INI</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                          </svg>
                        </a>
                      </div>
                    `).join("")}
                  </div>

                  <div class="safety-rules-card">
                    <div class="safety-title">🛡️ 4 PROTOKOL KEAMANAN JARINGAN LAB KOMPUTER:</div>
                    <ul class="safety-list">
                      ${n.downloadTutorial.labSafetyRules.map(a=>`
                        <li>
                          <span class="bullet-blue">✓</span>
                          <span>${a}</span>
                        </li>
                      `).join("")}
                    </ul>
                  </div>
                </div>
              </section>
            `:""}

            <!-- PANEL 03: TECHNICAL BREAKDOWN (STEP-BY-STEP) -->
            <section class="h-panel panel-breakdown">
              <div class="panel-inner">
                <div class="section-label-group">
                  <span class="panel-number-label">STAGE BREAKDOWN</span>
                  <h2 class="panel-sub-title">Tahapan Pembelajaran Inti</h2>
                </div>

                <div class="breakdown-grid">
                  ${n.breakdownStages.map((a,r)=>`
                    <div class="breakdown-card" data-cursor="hover">
                      <div class="card-step-num">${a.step}</div>
                      <div class="card-badge" style="border-color: ${n.accentColor}; color: ${n.accentColor}">
                        ${a.badge}
                      </div>
                      <h3 class="card-stage-name">${a.name}</h3>
                      <p class="card-stage-desc">${a.desc}</p>
                      <div class="card-corner-bracket"></div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </section>

            ${n.tutorialSteps&&n.tutorialSteps.length>0?`
              <!-- PANEL 03B: INTERACTIVE STEP-BY-STEP LAB TUTORIAL -->
              <section class="h-panel panel-tutorial-steps">
                <div class="panel-inner">
                  <div class="section-label-group">
                    <span class="panel-number-label">PANDUAN PRAKTIKUM LANGKAH DEMI LANGKAH</span>
                    <h2 class="panel-sub-title">Tutorial Eksekusi Lab &amp; Parameter Teknis</h2>
                    <p class="panel-desc">Ikuti tahapan praktikum berurutan di bawah ini lengkap dengan shortcut keyboard dan nilai parameter standar industri.</p>
                  </div>

                  <div class="tutorial-steps-box" data-vertical-card="true">
                    <div class="tutorial-steps-scroll" data-scrollable="true">
                      ${n.tutorialSteps.map(a=>`
                        <div class="tut-step-row" data-cursor="hover">
                          <div class="tut-step-left">
                            <span class="tut-step-pill" style="background:${n.accentColor}">${a.step}</span>
                            <span class="tut-step-phase">${a.phase}</span>
                          </div>
                          <div class="tut-step-right">
                            <div class="tut-step-header">
                              <h4 class="tut-step-title">${a.title}</h4>
                              <span class="tut-step-kbd">${a.shortcut}</span>
                            </div>
                            <p class="tut-step-desc">${a.action}</p>
                            <div class="tut-step-param">
                              <span class="param-label">PARAMETER / RUMUS:</span>
                              <code>${a.param}</code>
                            </div>
                          </div>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                </div>
              </section>
            `:""}

            <!-- PANEL 04: PREMIERE PRO TIMELINE ARCHITECTURE -->
            <section class="h-panel panel-timeline">
              <div class="panel-inner">
                <div class="section-label-group">
                  <span class="panel-number-label">TIMELINE ARCHITECTURE</span>
                  <h2 class="panel-sub-title">Struktur Track Timeline &amp; Multi-Layer</h2>
                  <p class="panel-desc">Bedah struktur track video, grafis siaran, voiceover, dan track audio musik/SFX di Timeline Premiere Pro untuk menjaga sinkronisasi ritme.</p>
                </div>

                <div class="ae-timeline-box" data-vertical-card="true">
                  <div class="timeline-header-bar">
                    <span class="tl-col tl-col-num">#</span>
                    <span class="tl-col tl-col-type">TYPE</span>
                    <span class="tl-col tl-col-name">SOURCE / LAYER NAME</span>
                    <span class="tl-col tl-col-mode">MODE</span>
                    <span class="tl-col tl-col-time">IN / DURATION</span>
                  </div>

                  <div class="timeline-layer-rows">
                    ${n.aeLayers.map((a,r)=>`
                      <div class="tl-row" data-cursor="hover">
                        <span class="tl-col tl-col-num">0${r+1}</span>
                        <span class="tl-col tl-col-type">
                          <span class="type-pill type-${a.type.toLowerCase()}">${a.type}</span>
                        </span>
                        <span class="tl-col tl-col-name">${a.name}</span>
                        <span class="tl-col tl-col-mode">${a.blend}</span>
                        <span class="tl-col tl-col-time">${a.inPoint} / ${a.duration}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            </section>

            <!-- PANEL 05: MODUL & BERKAS PRAKTIKUM -->
            <section class="h-panel panel-assets">
              <div class="panel-inner">
                <div class="section-label-group">
                  <span class="panel-number-label">REPOSITORI BAHAN AJAR</span>
                  <h2 class="panel-sub-title">Modul Resmi & Berkas Praktikum</h2>
                  <p class="panel-desc">Dokumen ajar resmi, modul PDF, dan berkas teknis yang siap diunduh langsung untuk pegangan belajar.</p>
                </div>

                <div class="asset-cards-col" data-vertical-card="true">
                  ${n.assets.map(a=>`
                    <div class="asset-download-card ${a.isDownloadable?"is-downloadable":"is-offline-only"}" ${a.isDownloadable?'data-cursor="hover"':""}>
                      <div class="asset-icon-box ${a.isDownloadable?"icon-available":"icon-offline"}">
                        ${a.isDownloadable?`
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                          </svg>
                        `:`
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                            <line x1="6" y1="6" x2="6.01" y2="6"/>
                            <line x1="6" y1="18" x2="6.01" y2="18"/>
                          </svg>
                        `}
                      </div>
                      <div class="asset-info-col">
                        <span class="asset-name">${a.name}</span>
                        <span class="asset-specs">${a.type} • ${a.size}</span>
                      </div>
                      ${a.isDownloadable?`
                        <a href="${a.downloadUrl}" download="${a.name}" class="asset-btn-action" target="_blank" rel="noopener noreferrer">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-right:4px;">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                          </svg>
                          <span>${a.actionLabel||"UNDUH BERKAS"}</span>
                        </a>
                      `:`
                        <div class="asset-badge-offline" title="Aset praktikum tersimpan di server lokal PC Lab">
                          <span class="offline-dot"></span>
                          <span>${a.actionLabel||"TERSEDIA DI PC LAB"}</span>
                        </div>
                      `}
                    </div>
                  `).join("")}
                </div>
              </div>
            </section>

            <!-- PANEL 05B: KUIS SINGKAT PEMAHAMAN MATERI -->
            <section class="h-panel panel-quiz">
              <div class="panel-inner">
                <div id="quizInlineMount" class="quiz-inline-mount"></div>
              </div>
            </section>

            <!-- PANEL 06: ASSIGNMENT TERMINAL & SUBMISSION -->
            <section class="h-panel panel-assignment">
              <div class="panel-inner">
                <div class="assignment-terminal-card" data-vertical-card="true">
                  <div class="terminal-badge-row">
                    <span class="terminal-tag">TUGAS PRAKTIKUM</span>
                    <span class="terminal-deadline">DEADLINE: ${n.assignment&&n.assignment.deadline||"Pertemuan Berikutnya, 23:59 WIB"}</span>
                  </div>

                  <h3 class="terminal-title">${n.assignment.title}</h3>

                  <div class="terminal-rubric-box">
                    <span class="rubric-header">Instruksi & Ketentuan Pengumpulan:</span>
                    <ul class="rubric-list">
                      ${(n.assignment&&Array.isArray(n.assignment.requirements)?n.assignment.requirements:[]).map(a=>`
                        <li>
                          <span class="bullet" style="color: ${n.accentColor}">▸</span>
                          <span>${a}</span>
                        </li>
                      `).join("")}
                    </ul>
                  </div>

                  <a href="${n.assignment&&n.assignment.submissionUrl||"/kumpul-tugas"}" target="_blank" rel="noopener noreferrer" class="submit-action-btn" data-cursor="hover">
                    <span>BUKA FORM PENGUMPULAN TUGAS</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            <!-- PANEL 07: NEXT MEETING TRANSITION TEASER -->
            <section class="h-panel panel-next">
              <div class="panel-inner">
                <div class="next-meeting-card" id="btnNextWeek" data-next-id="${s.id}" data-cursor="hover">
                  <span class="next-pill-label">PERTEMUAN BERIKUTNYA</span>
                  <span class="next-week-num">${s.subject} • MINGGU ${s.weekNumber} →</span>
                  <h3 class="next-title">${s.title}</h3>
                  <p class="next-desc">${s.subtitle}</p>
                  <div class="next-cta-badge">KLIK UNTUK PINDAH MATERI</div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    `,this.initScroller(),this.bindScrollerEvents(),this.probeSlidePdf(n),this.mountInlineQuiz(n)}mountInlineQuiz(n){try{if(!n||!n.id||!this.container)return;const mount=this.container.querySelector("#quizInlineMount");if(!mount)return;const run=()=>{if(window.BinaBangsaQuiz&&typeof window.BinaBangsaQuiz.renderInline==="function"){window.BinaBangsaQuiz.renderInline(mount,n.id,{theme:"light",onUpdate:()=>this.calculateMaxScroll()});setTimeout(()=>this.calculateMaxScroll(),80)}};if(window.BinaBangsaQuiz){run()}else{window.addEventListener("load",run,{once:!0})}}catch(_){}}probeSlidePdf(n){try{if(!n||!n.id||!this.container)return;const m=n.id.match(/^pr-0?(\d+)$/);if(!m)return;const num=parseInt(m[1],10),track="PAV",pdfUrl=encodeURI(`/downloads/Pertemuan ${num} (${track}).pdf`),btn=this.container.querySelector(".panel-direct-launcher .launcher-card.card-blue a.launcher-btn.btn-blue");if(!btn)return;if((btn.getAttribute("href")||"").toLowerCase().includes(".pdf"))return;fetch(pdfUrl,{method:"HEAD",cache:"no-cache"}).then(res=>{const ct=(res.headers.get("content-type")||"").toLowerCase();if(!res.ok||ct.indexOf("pdf")===-1)return;btn.setAttribute("href",pdfUrl);const sp=btn.querySelector("span");sp&&(sp.textContent=`📄 BUKA SLIDE PERTEMUAN ${String(num).padStart(2,"0")} (PDF)`);const card=btn.closest(".launcher-card");if(card){const badge=card.querySelector(".launcher-badge");badge&&(badge.textContent="SLIDE PDF • BAHAN TAYANG SISWA");const titleEl=card.querySelector(".launcher-title");titleEl&&(titleEl.textContent=`Slide Pertemuan ${String(num).padStart(2,"0")}: ${n.title} (${track})`)}const slate=this.container.querySelector(".panel-direct-launcher .launcher-card.card-slate a[href*='Modul_Pertemuan_']");slate&&slate.closest(".launcher-card")&&(slate.closest(".launcher-card").style.display="none")}).catch(()=>{})}catch(_){}}isMobileView(){return window.innerWidth<=850||!!(window.matchMedia&&window.matchMedia("(max-width: 1080px) and (orientation: portrait)").matches)}initScroller(){this.wrapper=document.getElementById("trackWrapper"),this.track=document.getElementById("horizontalTrack"),this.progressBar=document.getElementById("horizontalProgress"),this.calculateMaxScroll(),this.scrollX=0,this.targetScrollX=0,this.wrapper&&(this.wrapper.scrollTop=0),this.updateTrackPosition(0),this.startLoop()}calculateMaxScroll(){if(!this.track||!this.wrapper)return;if(this.isMobileView()){this.maxScroll=Math.max(0,this.wrapper.scrollHeight-this.wrapper.clientHeight);return}this.maxScroll=Math.max(0,this.track.scrollWidth-window.innerWidth)}bindScrollerEvents(){const isInter=v=>!!(v&&v.closest&&v.closest("a, button, input, select, textarea, label, .quiz-inline-mount, .bb-quiz-root, .next-meeting-card, #btnNextWeek, #btnBackToSyllabus, .detail-arrow-btn, .launcher-btn, .tool-launch-btn, .yt-card-btn, .asset-btn-action, .submit-action-btn, .showcase-video-wrapper, [data-cursor='hover']"));const e=document.getElementById("btnBackToSyllabus");e&&(this.backHandler=v=>{v&&v.stopPropagation(),this.destroy(),this.soundEngine.playWhoosh(350,90),this.onBack()},e.addEventListener("click",this.backHandler));const t=document.getElementById("btnScrollPrev"),n=document.getElementById("btnScrollNext");t&&(this.prevHandler=v=>{v.stopPropagation(),this.calculateMaxScroll(),this.isMobileView()&&this.wrapper?this.wrapper.scrollBy({top:-Math.round(window.innerHeight*.75),behavior:"smooth"}):(this.targetScrollX=Math.max(0,this.targetScrollX-450)),this.soundEngine.playTick(1300)},t.addEventListener("click",this.prevHandler)),n&&(this.nextHandler=v=>{v.stopPropagation(),this.calculateMaxScroll(),this.isMobileView()&&this.wrapper?this.wrapper.scrollBy({top:Math.round(window.innerHeight*.75),behavior:"smooth"}):(this.targetScrollX=Math.min(this.maxScroll,this.targetScrollX+450)),this.soundEngine.playTick(1500)},n.addEventListener("click",this.nextHandler));const s=document.querySelector(".detail-progress-track");s&&(this.progressClickHandler=v=>{this.calculateMaxScroll();const _=s.getBoundingClientRect(),L=Math.max(0,Math.min(1,(v.clientX-_.left)/_.width));this.isMobileView()&&this.wrapper?this.wrapper.scrollTo({top:L*this.maxScroll,behavior:"smooth"}):(this.targetScrollX=L*this.maxScroll),this.soundEngine.playTick(1400)},s.addEventListener("click",this.progressClickHandler));const a=document.getElementById("btnNextWeek");a&&(this.nextWeekHandler=v=>{v&&v.stopPropagation();const _=a.getAttribute("data-next-id");_&&(this.soundEngine.playWhoosh(420,110),this.destroy(),this.render(_))},a.addEventListener("click",this.nextWeekHandler));const r=this.container.querySelector(".showcase-video-wrapper");r&&(r.style.cursor="pointer",r.setAttribute("title","Klik untuk memutar video demo showreel"),r.addEventListener("click",()=>{if(r.querySelector("video"))return;this.soundEngine.playTick(1100),r.innerHTML=`
          <video 
            src="/showreel.mp4" 
            controls 
            autoplay 
            playsinline 
            style="width: 100%; height: 100%; object-fit: contain; background: #000; border-radius: 14px;"
          ></video>
        `,this.soundEngine&&typeof this.soundEngine.duckBGM=="function"&&this.soundEngine.duckBGM(.04,.6);const v=r.querySelector("video");v&&(v.addEventListener("pause",()=>{this.soundEngine&&typeof this.soundEngine.restoreBGM=="function"&&this.soundEngine.restoreBGM(.2,.8)}),v.addEventListener("ended",()=>{this.soundEngine&&typeof this.soundEngine.restoreBGM=="function"&&this.soundEngine.restoreBGM(.2,.8)}))})),this.wheelHandler=v=>{if(!this.wrapper||this.isMobileView())return;const qz=v.target&&v.target.closest&&v.target.closest(".bb-quiz-scroll");if(qz&&qz.scrollHeight>qz.clientHeight+2){if((v.deltaY>0&&qz.scrollTop+qz.clientHeight<qz.scrollHeight-2)||(v.deltaY<0&&qz.scrollTop>2))return}const _=v.target.closest('[data-vertical-card="true"], .vault-column, .vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col');if(_){const A=_.matches('.vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col, [data-scrollable="true"]')?_:_.querySelector('.vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col, [data-scrollable="true"]');if(A){A.scrollTop+=v.deltaY;return}}this.calculateMaxScroll();const L=Math.abs(v.deltaX)>Math.abs(v.deltaY)?v.deltaX:v.deltaY;this.targetScrollX+=L*1.2,this.targetScrollX=Math.max(0,Math.min(this.targetScrollX,this.maxScroll)),Math.random()<.1&&this.soundEngine.playTick(1200)},window.addEventListener("wheel",this.wheelHandler,{passive:!0});const o=this.wrapper?this.wrapper.querySelectorAll('.vault-column, .vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col, [data-vertical-card="true"]'):[];this.verticalCardWheelCleanups=[],o.forEach(v=>{const _=L=>{const A=v.matches(".vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col, .tutorial-steps-scroll")?v:v.querySelector(".vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col, .tutorial-steps-scroll");A&&(L.stopPropagation(),A.scrollTop+=L.deltaY)};v.addEventListener("wheel",_,{passive:!0}),this.verticalCardWheelCleanups.push(()=>v.removeEventListener("wheel",_))}),this.keyHandler=v=>{if(v.target&&v.target.closest&&v.target.closest("input, textarea, select, [contenteditable]"))return;v.key==="ArrowRight"||v.key==="PageDown"?(this.calculateMaxScroll(),this.targetScrollX=Math.min(this.maxScroll,this.targetScrollX+380),this.soundEngine.playTick(1400)):(v.key==="ArrowLeft"||v.key==="PageUp")&&(this.calculateMaxScroll(),this.targetScrollX=Math.max(0,this.targetScrollX-380),this.soundEngine.playTick(1200))},window.addEventListener("keydown",this.keyHandler);let l=!1,c=!1,h=null,d=0,u=0,f=0,g=0,x=0,m=0,p=0;this.preventClick=!1,this.pointerDownHandler=v=>{if(this.isMobileView()||isInter(v.target))return;v.type==="mousedown"&&v.button!==0||(l=!0,c=!1,this.preventClick=!1,h=v.target,d=v.clientX,u=v.clientY,g=v.clientX,x=v.clientY,m=performance.now(),f=this.targetScrollX,p=0,this.calculateMaxScroll())},this.pointerMoveHandler=v=>{if(!l)return;const _=v.clientX-d,L=v.clientY-u,A=h&&h.closest('[data-vertical-card="true"], .vault-column, .vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col');if(A&&Math.abs(L)>Math.abs(_)){const R=A.matches(".vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col, .tutorial-steps-scroll")?A:A.querySelector(".vault-cards-scroll, .terminal-rubric-box, .timeline-layer-rows, .asset-cards-col, .tutorial-steps-scroll");R&&(R.scrollTop-=v.clientY-x,x=v.clientY,g=v.clientX);return}const th=isInter(h)?22:14;if(!c&&Math.hypot(_,L)>th&&(c=!0,this.preventClick=!0,this.wrapper&&this.wrapper.classList.add("is-dragging"),document.body.style.userSelect="none",document.body.style.webkitUserSelect="none"),c){v.cancelable&&v.preventDefault();const R=performance.now(),C=R-m;C>0&&(p=(v.clientX-g)/C),g=v.clientX,m=R,this.targetScrollX=f-_*1.35,this.targetScrollX=Math.max(0,Math.min(this.targetScrollX,this.maxScroll))}},this.pointerUpHandler=()=>{if(l&&(l=!1,c)){const v=-p*220;this.targetScrollX+=v,this.targetScrollX=Math.max(0,Math.min(this.targetScrollX,this.maxScroll)),this.wrapper&&this.wrapper.classList.remove("is-dragging"),document.body.style.userSelect="",document.body.style.webkitUserSelect="",setTimeout(()=>{this.preventClick=!1,c=!1},40)}else this.preventClick=!1,c=!1},this.dragStartHandler=v=>{if(isInter(v.target))return;v.preventDefault()},this.captureClickHandler=v=>{if(isInter(v.target)){this.preventClick=!1;return}this.preventClick&&(v.preventDefault(),v.stopPropagation(),this.preventClick=!1)},this.wrapper&&(this.wrapper.addEventListener("mousedown",this.pointerDownHandler),this.wrapper.addEventListener("dragstart",this.dragStartHandler),this.wrapper.addEventListener("click",this.captureClickHandler,!0),this.touchStartHandler=v=>{if(this.isMobileView())return;v.touches.length>0&&this.pointerDownHandler({clientX:v.touches[0].clientX,clientY:v.touches[0].clientY,target:v.target,button:0,type:"touchstart"})},this.touchMoveHandler=v=>{if(this.isMobileView())return;v.touches.length>0&&this.pointerMoveHandler({clientX:v.touches[0].clientX,clientY:v.touches[0].clientY,preventDefault:()=>v.preventDefault(),cancelable:v.cancelable})},this.isMobileView()||(this.wrapper.addEventListener("touchstart",this.touchStartHandler,{passive:!0}),this.wrapper.addEventListener("touchmove",this.touchMoveHandler,{passive:!1}),this.wrapper.addEventListener("touchend",this.pointerUpHandler)),this.wrapper.querySelectorAll("a").forEach(v=>{v.addEventListener("click",_=>_.stopPropagation())}),this.wrapper.querySelectorAll(".breakdown-card, .asset-download-card, .assignment-terminal-card, .next-meeting-card, .vault-resource-card, .tut-step-row").forEach(v=>{v.style.transformStyle="preserve-3d",v.style.transition="transform 0.14s ease-out, box-shadow 0.2s ease",v.addEventListener("mousemove",_=>{if(window.matchMedia&&window.matchMedia("(hover: none), (pointer: coarse)").matches)return;const L=v.getBoundingClientRect(),A=_.clientX-L.left,R=_.clientY-L.top,C=L.width/2,T=L.height/2,N=-((R-T)/T)*10,F=(A-C)/C*12;v.style.transform=`perspective(800px) rotateX(${N.toFixed(2)}deg) rotateY(${F.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translateZ(8px)`,v.style.boxShadow="0 18px 36px rgba(0,0,0,0.4), 0 0 24px rgba(56,189,248,0.2)"}),v.addEventListener("mouseleave",()=>{v.style.transform="perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)",v.style.boxShadow=""})})),window.addEventListener("mousemove",this.pointerMoveHandler),window.addEventListener("mouseup",this.pointerUpHandler),this.resizeHandler=()=>{this.calculateMaxScroll()},window.addEventListener("resize",this.resizeHandler),(this.wrapper?this.wrapper.querySelectorAll("img"):[]).forEach(v=>{v.complete||v.addEventListener("load",()=>this.calculateMaxScroll())}),setTimeout(()=>this.calculateMaxScroll(),150),setTimeout(()=>this.calculateMaxScroll(),600)}startLoop(){const e=()=>{if(this.track){if(this.isMobileView()){this.track.style.transform="none";if(this.wrapper&&this.progressBar){const m=Math.max(1,this.wrapper.scrollHeight-this.wrapper.clientHeight),t=this.wrapper.scrollTop/m*100;this.progressBar.style.width=`${Math.min(100,Math.max(0,t))}%`}}else{this.scrollX+=(this.targetScrollX-this.scrollX)*.09,this.updateTrackPosition(this.scrollX);if(this.progressBar&&this.maxScroll>0){const t=this.scrollX/this.maxScroll*100;this.progressBar.style.width=`${Math.min(100,Math.max(0,t))}%`}}this.animationFrameId=requestAnimationFrame(e)}};e()}updateTrackPosition(e){this.track&&(this.isMobileView()?this.track.style.transform="none":this.track.style.transform=`translate3d(${-e}px, 0, 0)`)}destroy(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.verticalCardWheelCleanups&&(this.verticalCardWheelCleanups.forEach(e=>e()),this.verticalCardWheelCleanups=[]),this.wheelHandler&&window.removeEventListener("wheel",this.wheelHandler),this.keyHandler&&window.removeEventListener("keydown",this.keyHandler),this.pointerMoveHandler&&window.removeEventListener("mousemove",this.pointerMoveHandler),this.pointerUpHandler&&window.removeEventListener("mouseup",this.pointerUpHandler),this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler),this.wrapper&&(this.pointerDownHandler&&this.wrapper.removeEventListener("mousedown",this.pointerDownHandler),this.dragStartHandler&&this.wrapper.removeEventListener("dragstart",this.dragStartHandler),this.captureClickHandler&&this.wrapper.removeEventListener("click",this.captureClickHandler,!0),this.touchStartHandler&&this.wrapper.removeEventListener("touchstart",this.touchStartHandler),this.touchMoveHandler&&this.wrapper.removeEventListener("touchmove",this.touchMoveHandler),this.pointerUpHandler&&this.wrapper.removeEventListener("touchend",this.pointerUpHandler)),document.body.style.userSelect="",document.body.style.webkitUserSelect=""}}class Mm{constructor(e,t,n,s,a){this.container=e,this.profile=t,this.soundEngine=n,this.onNavigate=s,this.onOpenDetail=a,this.controller=null}render(){this.destroy(),this.controller=_mlav({container:this.container,profile:this.profile,soundEngine:this.soundEngine,onNavigate:this.onNavigate,onOpenDetail:this.onOpenDetail})}onScrollUpdate(e,t){this.controller&&this.controller.onScrollUpdate&&this.controller.onScrollUpdate(e,t)}destroy(){this.controller&&this.controller.destroy&&this.controller.destroy(),this.controller=null}}class Sm{constructor(){this.currentRoute=this.resolveInitialRoute(),this.lenis=null,this.soundEngine=null,this.cursor=null,this.watercolor=null,this.nav=null,this.homeView=null,this.aboutView=null,this.activeDetailView=null,this.mainContentEl=document.getElementById("mainContent"),this.detailModalEl=document.getElementById("detailModalContainer"),this.navContainerEl=document.getElementById("navContainer"),this.init()}resolveInitialRoute(){const e=document.documentElement.dataset.initialRoute;if(e==="about"||e==="materi"||e==="home")return e;const t=window.location.pathname.replace(/\/+$/,"");return t==="/about"||window.location.hash==="#about"?"about":window.location.hash==="#silabus"||window.location.hash==="#materi"?"materi":"home"}syncHistory(e){try{const t=e==="about"?"/about/":e==="materi"?"/#silabus":"/",n=window.location.pathname+(window.location.hash||"");n!==t&&window.history.pushState({route:e},"",t)}catch(_){}}init(){this.initLenis();const e=document.getElementById("watercolorCanvas");this.soundEngine=new Pl,this.soundEngine.startAutoBGM(),this.cursor=_mlfc(e),this.nav=new Il(this.navContainerEl,this.soundEngine,t=>this.navigateTo(t)),this.nav.setActiveRoute(this.currentRoute),this.startAudioSyncLoop(),this.renderRoute(this.currentRoute),window.addEventListener("popstate",()=>{const t=this.resolveInitialRoute();t!==this.currentRoute&&this.navigateTo(t,{skipPush:!0})})}initLenis(){this.lenis=new Cl({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),orientation:"vertical",gestureOrientation:"vertical",smoothWheel:!0,wheelMultiplier:1,touchMultiplier:2,prevent:t=>!!(t&&t.closest&&t.closest("#detailModalContainer, .horizontal-detail-view, .horizontal-track-wrapper"))}),window.__dkvLenis=this.lenis,this.lenis.on("scroll",t=>{this.currentRoute==="home"&&this.homeView&&this.homeView.onScrollUpdate(t.scroll,t.limit),this.currentRoute==="about"&&this.aboutView&&this.aboutView.onScrollUpdate(t.scroll,t.limit)});const e=t=>{this.lenis.raf(t),requestAnimationFrame(e)};requestAnimationFrame(e)}startAudioSyncLoop(){const e=()=>{if(this.soundEngine&&this.homeView&&this.homeView.heroFluidScene){const t=this.soundEngine.getFrequencyIntensity();this.homeView.heroFluidScene.setAudioIntensity(t)}requestAnimationFrame(e)};e()}navigateTo(e,t={}){if(e==="kumpul-tugas"||e==="kumpulkan-tugas"){window.location.href="/kumpul-tugas";return}if(e==="absensi"||e==="presensi"){window.location.href="/absensi";return}if(e==="database"||e==="database-tugas"){window.location.href="/database-tugas";return}if(e==="showreel"){this.activeDetailView&&(this.activeDetailView.destroy(),this.activeDetailView=null),this.detailModalEl&&(this.detailModalEl.innerHTML="",this.detailModalEl.style.display="none",this.lenis&&(this.lenis.start(),this.lenis.resize())),this.currentRoute!=="home"&&(this.currentRoute="home",this.renderRoute("home"),t.skipPush||this.syncHistory("home")),this.nav.setActiveRoute("showreel"),setTimeout(()=>{const n=document.getElementById("secGenie");n&&(this.lenis?this.lenis.scrollTo(n,{duration:1.2}):n.scrollIntoView({behavior:"smooth"}))},100);return}this.currentRoute===e&&e!=="detail"||(this.activeDetailView&&(this.activeDetailView.destroy(),this.activeDetailView=null),this.detailModalEl&&(this.detailModalEl.innerHTML="",this.detailModalEl.style.display="none",this.lenis&&this.lenis.start()),this.currentRoute=e,t.skipPush||this.syncHistory(e),this.nav.setActiveRoute(e),this.renderRoute(e),window.scrollTo({top:0,behavior:"instant"}),this.lenis&&(this.lenis.resize(),this.lenis.scrollTo(0,{immediate:!0}),setTimeout(()=>{this.lenis&&this.lenis.resize()},140)))}openWeekDetail(e){try{this.activeDetailView&&(this.activeDetailView.destroy(),this.activeDetailView=null),this.lenis&&this.lenis.stop(),this.detailModalEl.style.display="block",this.activeDetailView=new xm(this.detailModalEl,ys,this.soundEngine,()=>{this.activeDetailView=null,this.detailModalEl.innerHTML="",this.detailModalEl.style.display="none",this.lenis&&(this.lenis.start(),this.lenis.resize())},n=>{this.openWeekDetail(n)}),this.activeDetailView.render(e)}catch(t){console.error("Error opening detail:",t),this.activeDetailView&&(this.activeDetailView.destroy(),this.activeDetailView=null),this.detailModalEl&&(this.detailModalEl.innerHTML="",this.detailModalEl.style.display="none"),this.lenis&&(this.lenis.start(),this.lenis.resize())}}renderRoute(e){this.homeView&&this.homeView.destroy&&this.homeView.destroy(),this.aboutView&&this.aboutView.destroy&&this.aboutView.destroy(),this.homeView=null,this.aboutView=null;switch(this.mainContentEl.innerHTML="",e){case"home":{this.homeView=new vm(this.mainContentEl,ys,br,this.soundEngine,t=>this.navigateTo(t),t=>this.openWeekDetail(t)),this.homeView.render();break}case"materi":{new _m(this.mainContentEl,ys,this.soundEngine,n=>this.openWeekDetail(n)).render();break}case"about":{this.aboutView=new Mm(this.mainContentEl,br,this.soundEngine,n=>this.navigateTo(n),n=>this.openWeekDetail(n)),this.aboutView.render();break}default:this.renderRoute("home")}this.lenis&&(this.lenis.resize(),setTimeout(()=>{this.lenis&&this.lenis.resize()},140))}}document.addEventListener("DOMContentLoaded",()=>{new Sm});
