(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const m of document.querySelectorAll('link[rel="modulepreload"]'))c(m);new MutationObserver(m=>{for(const f of m)if(f.type==="childList")for(const v of f.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&c(v)}).observe(document,{childList:!0,subtree:!0});function o(m){const f={};return m.integrity&&(f.integrity=m.integrity),m.referrerPolicy&&(f.referrerPolicy=m.referrerPolicy),m.crossOrigin==="use-credentials"?f.credentials="include":m.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function c(m){if(m.ep)return;m.ep=!0;const f=o(m);fetch(m.href,f)}})();var kc={exports:{}},Hn={};var pm;function qy(){if(pm)return Hn;pm=1;var u=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function o(c,m,f){var v=null;if(f!==void 0&&(v=""+f),m.key!==void 0&&(v=""+m.key),"key"in m){f={};for(var S in m)S!=="key"&&(f[S]=m[S])}else f=m;return m=f.ref,{$$typeof:u,type:c,key:v,ref:m!==void 0?m:null,props:f}}return Hn.Fragment=s,Hn.jsx=o,Hn.jsxs=o,Hn}var gm;function Hy(){return gm||(gm=1,kc.exports=qy()),kc.exports}var h=Hy(),Xc={exports:{}},ae={};var bm;function Uy(){if(bm)return ae;bm=1;var u=Symbol.for("react.transitional.element"),s=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),c=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),v=Symbol.for("react.context"),S=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),R=Symbol.for("react.activity"),q=Symbol.iterator;function K(b){return b===null||typeof b!="object"?null:(b=q&&b[q]||b["@@iterator"],typeof b=="function"?b:null)}var U={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Y=Object.assign,j={};function H(b,B,V){this.props=b,this.context=B,this.refs=j,this.updater=V||U}H.prototype.isReactComponent={},H.prototype.setState=function(b,B){if(typeof b!="object"&&typeof b!="function"&&b!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,b,B,"setState")},H.prototype.forceUpdate=function(b){this.updater.enqueueForceUpdate(this,b,"forceUpdate")};function X(){}X.prototype=H.prototype;function Q(b,B,V){this.props=b,this.context=B,this.refs=j,this.updater=V||U}var Z=Q.prototype=new X;Z.constructor=Q,Y(Z,H.prototype),Z.isPureReactComponent=!0;var ue=Array.isArray;function ge(){}var $={H:null,A:null,T:null,S:null},Se=Object.prototype.hasOwnProperty;function Ne(b,B,V){var F=V.ref;return{$$typeof:u,type:b,key:B,ref:F!==void 0?F:null,props:V}}function Ue(b,B){return Ne(b.type,B,b.props)}function Ye(b){return typeof b=="object"&&b!==null&&b.$$typeof===u}function G(b){var B={"=":"=0",":":"=2"};return"$"+b.replace(/[=:]/g,function(V){return B[V]})}var te=/\/+/g;function ce(b,B){return typeof b=="object"&&b!==null&&b.key!=null?G(""+b.key):B.toString(36)}function se(b){switch(b.status){case"fulfilled":return b.value;case"rejected":throw b.reason;default:switch(typeof b.status=="string"?b.then(ge,ge):(b.status="pending",b.then(function(B){b.status==="pending"&&(b.status="fulfilled",b.value=B)},function(B){b.status==="pending"&&(b.status="rejected",b.reason=B)})),b.status){case"fulfilled":return b.value;case"rejected":throw b.reason}}throw b}function C(b,B,V,F,le){var oe=typeof b;(oe==="undefined"||oe==="boolean")&&(b=null);var xe=!1;if(b===null)xe=!0;else switch(oe){case"bigint":case"string":case"number":xe=!0;break;case"object":switch(b.$$typeof){case u:case s:xe=!0;break;case _:return xe=b._init,C(xe(b._payload),B,V,F,le)}}if(xe)return le=le(b),xe=F===""?"."+ce(b,0):F,ue(le)?(V="",xe!=null&&(V=xe.replace(te,"$&/")+"/"),C(le,B,V,"",function(Vl){return Vl})):le!=null&&(Ye(le)&&(le=Ue(le,V+(le.key==null||b&&b.key===le.key?"":(""+le.key).replace(te,"$&/")+"/")+xe)),B.push(le)),1;xe=0;var tt=F===""?".":F+":";if(ue(b))for(var je=0;je<b.length;je++)F=b[je],oe=tt+ce(F,je),xe+=C(F,B,V,oe,le);else if(je=K(b),typeof je=="function")for(b=je.call(b),je=0;!(F=b.next()).done;)F=F.value,oe=tt+ce(F,je++),xe+=C(F,B,V,oe,le);else if(oe==="object"){if(typeof b.then=="function")return C(se(b),B,V,F,le);throw B=String(b),Error("Objects are not valid as a React child (found: "+(B==="[object Object]"?"object with keys {"+Object.keys(b).join(", ")+"}":B)+"). If you meant to render a collection of children, use an array instead.")}return xe}function k(b,B,V){if(b==null)return b;var F=[],le=0;return C(b,F,"","",function(oe){return B.call(V,oe,le++)}),F}function L(b){if(b._status===-1){var B=b._result;B=B(),B.then(function(V){(b._status===0||b._status===-1)&&(b._status=1,b._result=V)},function(V){(b._status===0||b._status===-1)&&(b._status=2,b._result=V)}),b._status===-1&&(b._status=0,b._result=B)}if(b._status===1)return b._result.default;throw b._result}var P=typeof reportError=="function"?reportError:function(b){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var B=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof b=="object"&&b!==null&&typeof b.message=="string"?String(b.message):String(b),error:b});if(!window.dispatchEvent(B))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",b);return}console.error(b)},re={map:k,forEach:function(b,B,V){k(b,function(){B.apply(this,arguments)},V)},count:function(b){var B=0;return k(b,function(){B++}),B},toArray:function(b){return k(b,function(B){return B})||[]},only:function(b){if(!Ye(b))throw Error("React.Children.only expected to receive a single React element child.");return b}};return ae.Activity=R,ae.Children=re,ae.Component=H,ae.Fragment=o,ae.Profiler=m,ae.PureComponent=Q,ae.StrictMode=c,ae.Suspense=y,ae.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=$,ae.__COMPILER_RUNTIME={__proto__:null,c:function(b){return $.H.useMemoCache(b)}},ae.cache=function(b){return function(){return b.apply(null,arguments)}},ae.cacheSignal=function(){return null},ae.cloneElement=function(b,B,V){if(b==null)throw Error("The argument must be a React element, but you passed "+b+".");var F=Y({},b.props),le=b.key;if(B!=null)for(oe in B.key!==void 0&&(le=""+B.key),B)!Se.call(B,oe)||oe==="key"||oe==="__self"||oe==="__source"||oe==="ref"&&B.ref===void 0||(F[oe]=B[oe]);var oe=arguments.length-2;if(oe===1)F.children=V;else if(1<oe){for(var xe=Array(oe),tt=0;tt<oe;tt++)xe[tt]=arguments[tt+2];F.children=xe}return Ne(b.type,le,F)},ae.createContext=function(b){return b={$$typeof:v,_currentValue:b,_currentValue2:b,_threadCount:0,Provider:null,Consumer:null},b.Provider=b,b.Consumer={$$typeof:f,_context:b},b},ae.createElement=function(b,B,V){var F,le={},oe=null;if(B!=null)for(F in B.key!==void 0&&(oe=""+B.key),B)Se.call(B,F)&&F!=="key"&&F!=="__self"&&F!=="__source"&&(le[F]=B[F]);var xe=arguments.length-2;if(xe===1)le.children=V;else if(1<xe){for(var tt=Array(xe),je=0;je<xe;je++)tt[je]=arguments[je+2];le.children=tt}if(b&&b.defaultProps)for(F in xe=b.defaultProps,xe)le[F]===void 0&&(le[F]=xe[F]);return Ne(b,oe,le)},ae.createRef=function(){return{current:null}},ae.forwardRef=function(b){return{$$typeof:S,render:b}},ae.isValidElement=Ye,ae.lazy=function(b){return{$$typeof:_,_payload:{_status:-1,_result:b},_init:L}},ae.memo=function(b,B){return{$$typeof:g,type:b,compare:B===void 0?null:B}},ae.startTransition=function(b){var B=$.T,V={};$.T=V;try{var F=b(),le=$.S;le!==null&&le(V,F),typeof F=="object"&&F!==null&&typeof F.then=="function"&&F.then(ge,P)}catch(oe){P(oe)}finally{B!==null&&V.types!==null&&(B.types=V.types),$.T=B}},ae.unstable_useCacheRefresh=function(){return $.H.useCacheRefresh()},ae.use=function(b){return $.H.use(b)},ae.useActionState=function(b,B,V){return $.H.useActionState(b,B,V)},ae.useCallback=function(b,B){return $.H.useCallback(b,B)},ae.useContext=function(b){return $.H.useContext(b)},ae.useDebugValue=function(){},ae.useDeferredValue=function(b,B){return $.H.useDeferredValue(b,B)},ae.useEffect=function(b,B){return $.H.useEffect(b,B)},ae.useEffectEvent=function(b){return $.H.useEffectEvent(b)},ae.useId=function(){return $.H.useId()},ae.useImperativeHandle=function(b,B,V){return $.H.useImperativeHandle(b,B,V)},ae.useInsertionEffect=function(b,B){return $.H.useInsertionEffect(b,B)},ae.useLayoutEffect=function(b,B){return $.H.useLayoutEffect(b,B)},ae.useMemo=function(b,B){return $.H.useMemo(b,B)},ae.useOptimistic=function(b,B){return $.H.useOptimistic(b,B)},ae.useReducer=function(b,B,V){return $.H.useReducer(b,B,V)},ae.useRef=function(b){return $.H.useRef(b)},ae.useState=function(b){return $.H.useState(b)},ae.useSyncExternalStore=function(b,B,V){return $.H.useSyncExternalStore(b,B,V)},ae.useTransition=function(){return $.H.useTransition()},ae.version="19.2.3",ae}var xm;function ns(){return xm||(xm=1,Xc.exports=Uy()),Xc.exports}var M=ns(),Gc={exports:{}},Un={},Vc={exports:{}},Qc={};var Sm;function Yy(){return Sm||(Sm=1,(function(u){function s(C,k){var L=C.length;C.push(k);e:for(;0<L;){var P=L-1>>>1,re=C[P];if(0<m(re,k))C[P]=k,C[L]=re,L=P;else break e}}function o(C){return C.length===0?null:C[0]}function c(C){if(C.length===0)return null;var k=C[0],L=C.pop();if(L!==k){C[0]=L;e:for(var P=0,re=C.length,b=re>>>1;P<b;){var B=2*(P+1)-1,V=C[B],F=B+1,le=C[F];if(0>m(V,L))F<re&&0>m(le,V)?(C[P]=le,C[F]=L,P=F):(C[P]=V,C[B]=L,P=B);else if(F<re&&0>m(le,L))C[P]=le,C[F]=L,P=F;else break e}}return k}function m(C,k){var L=C.sortIndex-k.sortIndex;return L!==0?L:C.id-k.id}if(u.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var f=performance;u.unstable_now=function(){return f.now()}}else{var v=Date,S=v.now();u.unstable_now=function(){return v.now()-S}}var y=[],g=[],_=1,R=null,q=3,K=!1,U=!1,Y=!1,j=!1,H=typeof setTimeout=="function"?setTimeout:null,X=typeof clearTimeout=="function"?clearTimeout:null,Q=typeof setImmediate<"u"?setImmediate:null;function Z(C){for(var k=o(g);k!==null;){if(k.callback===null)c(g);else if(k.startTime<=C)c(g),k.sortIndex=k.expirationTime,s(y,k);else break;k=o(g)}}function ue(C){if(Y=!1,Z(C),!U)if(o(y)!==null)U=!0,ge||(ge=!0,G());else{var k=o(g);k!==null&&se(ue,k.startTime-C)}}var ge=!1,$=-1,Se=5,Ne=-1;function Ue(){return j?!0:!(u.unstable_now()-Ne<Se)}function Ye(){if(j=!1,ge){var C=u.unstable_now();Ne=C;var k=!0;try{e:{U=!1,Y&&(Y=!1,X($),$=-1),K=!0;var L=q;try{t:{for(Z(C),R=o(y);R!==null&&!(R.expirationTime>C&&Ue());){var P=R.callback;if(typeof P=="function"){R.callback=null,q=R.priorityLevel;var re=P(R.expirationTime<=C);if(C=u.unstable_now(),typeof re=="function"){R.callback=re,Z(C),k=!0;break t}R===o(y)&&c(y),Z(C)}else c(y);R=o(y)}if(R!==null)k=!0;else{var b=o(g);b!==null&&se(ue,b.startTime-C),k=!1}}break e}finally{R=null,q=L,K=!1}k=void 0}}finally{k?G():ge=!1}}}var G;if(typeof Q=="function")G=function(){Q(Ye)};else if(typeof MessageChannel<"u"){var te=new MessageChannel,ce=te.port2;te.port1.onmessage=Ye,G=function(){ce.postMessage(null)}}else G=function(){H(Ye,0)};function se(C,k){$=H(function(){C(u.unstable_now())},k)}u.unstable_IdlePriority=5,u.unstable_ImmediatePriority=1,u.unstable_LowPriority=4,u.unstable_NormalPriority=3,u.unstable_Profiling=null,u.unstable_UserBlockingPriority=2,u.unstable_cancelCallback=function(C){C.callback=null},u.unstable_forceFrameRate=function(C){0>C||125<C?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Se=0<C?Math.floor(1e3/C):5},u.unstable_getCurrentPriorityLevel=function(){return q},u.unstable_next=function(C){switch(q){case 1:case 2:case 3:var k=3;break;default:k=q}var L=q;q=k;try{return C()}finally{q=L}},u.unstable_requestPaint=function(){j=!0},u.unstable_runWithPriority=function(C,k){switch(C){case 1:case 2:case 3:case 4:case 5:break;default:C=3}var L=q;q=C;try{return k()}finally{q=L}},u.unstable_scheduleCallback=function(C,k,L){var P=u.unstable_now();switch(typeof L=="object"&&L!==null?(L=L.delay,L=typeof L=="number"&&0<L?P+L:P):L=P,C){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=L+re,C={id:_++,callback:k,priorityLevel:C,startTime:L,expirationTime:re,sortIndex:-1},L>P?(C.sortIndex=L,s(g,C),o(y)===null&&C===o(g)&&(Y?(X($),$=-1):Y=!0,se(ue,L-P))):(C.sortIndex=re,s(y,C),U||K||(U=!0,ge||(ge=!0,G()))),C},u.unstable_shouldYield=Ue,u.unstable_wrapCallback=function(C){var k=q;return function(){var L=q;q=k;try{return C.apply(this,arguments)}finally{q=L}}}})(Qc)),Qc}var Em;function ky(){return Em||(Em=1,Vc.exports=Yy()),Vc.exports}var Zc={exports:{}},et={};var Mm;function Xy(){if(Mm)return et;Mm=1;var u=ns();function s(y){var g="https://react.dev/errors/"+y;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var _=2;_<arguments.length;_++)g+="&args[]="+encodeURIComponent(arguments[_])}return"Minified React error #"+y+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(){}var c={d:{f:o,r:function(){throw Error(s(522))},D:o,C:o,L:o,m:o,X:o,S:o,M:o},p:0,findDOMNode:null},m=Symbol.for("react.portal");function f(y,g,_){var R=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:m,key:R==null?null:""+R,children:y,containerInfo:g,implementation:_}}var v=u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function S(y,g){if(y==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=c,et.createPortal=function(y,g){var _=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(s(299));return f(y,g,null,_)},et.flushSync=function(y){var g=v.T,_=c.p;try{if(v.T=null,c.p=2,y)return y()}finally{v.T=g,c.p=_,c.d.f()}},et.preconnect=function(y,g){typeof y=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,c.d.C(y,g))},et.prefetchDNS=function(y){typeof y=="string"&&c.d.D(y)},et.preinit=function(y,g){if(typeof y=="string"&&g&&typeof g.as=="string"){var _=g.as,R=S(_,g.crossOrigin),q=typeof g.integrity=="string"?g.integrity:void 0,K=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;_==="style"?c.d.S(y,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:R,integrity:q,fetchPriority:K}):_==="script"&&c.d.X(y,{crossOrigin:R,integrity:q,fetchPriority:K,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},et.preinitModule=function(y,g){if(typeof y=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var _=S(g.as,g.crossOrigin);c.d.M(y,{crossOrigin:_,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0})}}else g==null&&c.d.M(y)},et.preload=function(y,g){if(typeof y=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var _=g.as,R=S(_,g.crossOrigin);c.d.L(y,_,{crossOrigin:R,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},et.preloadModule=function(y,g){if(typeof y=="string")if(g){var _=S(g.as,g.crossOrigin);c.d.m(y,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:_,integrity:typeof g.integrity=="string"?g.integrity:void 0})}else c.d.m(y)},et.requestFormReset=function(y){c.d.r(y)},et.unstable_batchedUpdates=function(y,g){return y(g)},et.useFormState=function(y,g,_){return v.H.useFormState(y,g,_)},et.useFormStatus=function(){return v.H.useHostTransitionStatus()},et.version="19.2.3",et}var Rm;function Gy(){if(Rm)return Zc.exports;Rm=1;function u(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)}catch(s){console.error(s)}}return u(),Zc.exports=Xy(),Zc.exports}var Tm;function Vy(){if(Tm)return Un;Tm=1;var u=ky(),s=ns(),o=Gy();function c(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function m(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function f(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function v(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function S(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function y(e){if(f(e)!==e)throw Error(c(188))}function g(e){var t=e.alternate;if(!t){if(t=f(e),t===null)throw Error(c(188));return t!==e?null:e}for(var a=e,l=t;;){var n=a.return;if(n===null)break;var i=n.alternate;if(i===null){if(l=n.return,l!==null){a=l;continue}break}if(n.child===i.child){for(i=n.child;i;){if(i===a)return y(n),e;if(i===l)return y(n),t;i=i.sibling}throw Error(c(188))}if(a.return!==l.return)a=n,l=i;else{for(var r=!1,d=n.child;d;){if(d===a){r=!0,a=n,l=i;break}if(d===l){r=!0,l=n,a=i;break}d=d.sibling}if(!r){for(d=i.child;d;){if(d===a){r=!0,a=i,l=n;break}if(d===l){r=!0,l=i,a=n;break}d=d.sibling}if(!r)throw Error(c(189))}}if(a.alternate!==l)throw Error(c(190))}if(a.tag!==3)throw Error(c(188));return a.stateNode.current===a?e:t}function _(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=_(e),t!==null)return t;e=e.sibling}return null}var R=Object.assign,q=Symbol.for("react.element"),K=Symbol.for("react.transitional.element"),U=Symbol.for("react.portal"),Y=Symbol.for("react.fragment"),j=Symbol.for("react.strict_mode"),H=Symbol.for("react.profiler"),X=Symbol.for("react.consumer"),Q=Symbol.for("react.context"),Z=Symbol.for("react.forward_ref"),ue=Symbol.for("react.suspense"),ge=Symbol.for("react.suspense_list"),$=Symbol.for("react.memo"),Se=Symbol.for("react.lazy"),Ne=Symbol.for("react.activity"),Ue=Symbol.for("react.memo_cache_sentinel"),Ye=Symbol.iterator;function G(e){return e===null||typeof e!="object"?null:(e=Ye&&e[Ye]||e["@@iterator"],typeof e=="function"?e:null)}var te=Symbol.for("react.client.reference");function ce(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===te?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Y:return"Fragment";case H:return"Profiler";case j:return"StrictMode";case ue:return"Suspense";case ge:return"SuspenseList";case Ne:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case U:return"Portal";case Q:return e.displayName||"Context";case X:return(e._context.displayName||"Context")+".Consumer";case Z:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case $:return t=e.displayName||null,t!==null?t:ce(e.type)||"Memo";case Se:t=e._payload,e=e._init;try{return ce(e(t))}catch{}}return null}var se=Array.isArray,C=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,k=o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,L={pending:!1,data:null,method:null,action:null},P=[],re=-1;function b(e){return{current:e}}function B(e){0>re||(e.current=P[re],P[re]=null,re--)}function V(e,t){re++,P[re]=e.current,e.current=t}var F=b(null),le=b(null),oe=b(null),xe=b(null);function tt(e,t){switch(V(oe,t),V(le,e),V(F,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Yd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Yd(t),e=kd(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}B(F),V(F,e)}function je(){B(F),B(le),B(oe)}function Vl(e){e.memoizedState!==null&&V(xe,e);var t=F.current,a=kd(t,e.type);t!==a&&(V(le,e),V(F,a))}function Kn(e){le.current===e&&(B(F),B(le)),xe.current===e&&(B(xe),Dn._currentValue=L)}var Mu,hs;function Da(e){if(Mu===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);Mu=t&&t[1]||"",hs=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Mu+e+hs}var Ru=!1;function Tu(e,t){if(!e||Ru)return"";Ru=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var D=function(){throw Error()};if(Object.defineProperty(D.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(D,[])}catch(z){var w=z}Reflect.construct(e,[],D)}else{try{D.call()}catch(z){w=z}e.call(D.prototype)}}else{try{throw Error()}catch(z){w=z}(D=e())&&typeof D.catch=="function"&&D.catch(function(){})}}catch(z){if(z&&w&&typeof z.stack=="string")return[z.stack,w.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var n=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");n&&n.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var i=l.DetermineComponentFrameRoot(),r=i[0],d=i[1];if(r&&d){var p=r.split(`
`),A=d.split(`
`);for(n=l=0;l<p.length&&!p[l].includes("DetermineComponentFrameRoot");)l++;for(;n<A.length&&!A[n].includes("DetermineComponentFrameRoot");)n++;if(l===p.length||n===A.length)for(l=p.length-1,n=A.length-1;1<=l&&0<=n&&p[l]!==A[n];)n--;for(;1<=l&&0<=n;l--,n--)if(p[l]!==A[n]){if(l!==1||n!==1)do if(l--,n--,0>n||p[l]!==A[n]){var N=`
`+p[l].replace(" at new "," at ");return e.displayName&&N.includes("<anonymous>")&&(N=N.replace("<anonymous>",e.displayName)),N}while(1<=l&&0<=n);break}}}finally{Ru=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?Da(a):""}function hh(e,t){switch(e.tag){case 26:case 27:case 5:return Da(e.type);case 16:return Da("Lazy");case 13:return e.child!==t&&t!==null?Da("Suspense Fallback"):Da("Suspense");case 19:return Da("SuspenseList");case 0:case 15:return Tu(e.type,!1);case 11:return Tu(e.type.render,!1);case 1:return Tu(e.type,!0);case 31:return Da("Activity");default:return""}}function vs(e){try{var t="",a=null;do t+=hh(e,a),a=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Au=Object.prototype.hasOwnProperty,wu=u.unstable_scheduleCallback,_u=u.unstable_cancelCallback,vh=u.unstable_shouldYield,yh=u.unstable_requestPaint,ot=u.unstable_now,ph=u.unstable_getCurrentPriorityLevel,ys=u.unstable_ImmediatePriority,ps=u.unstable_UserBlockingPriority,Jn=u.unstable_NormalPriority,gh=u.unstable_LowPriority,gs=u.unstable_IdlePriority,bh=u.log,xh=u.unstable_setDisableYieldValue,Ql=null,ft=null;function sa(e){if(typeof bh=="function"&&xh(e),ft&&typeof ft.setStrictMode=="function")try{ft.setStrictMode(Ql,e)}catch{}}var dt=Math.clz32?Math.clz32:Mh,Sh=Math.log,Eh=Math.LN2;function Mh(e){return e>>>=0,e===0?32:31-(Sh(e)/Eh|0)|0}var Fn=256,Wn=262144,$n=4194304;function La(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function In(e,t,a){var l=e.pendingLanes;if(l===0)return 0;var n=0,i=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var d=l&134217727;return d!==0?(l=d&~i,l!==0?n=La(l):(r&=d,r!==0?n=La(r):a||(a=d&~e,a!==0&&(n=La(a))))):(d=l&~i,d!==0?n=La(d):r!==0?n=La(r):a||(a=l&~e,a!==0&&(n=La(a)))),n===0?0:t!==0&&t!==n&&(t&i)===0&&(i=n&-n,a=t&-t,i>=a||i===32&&(a&4194048)!==0)?t:n}function Zl(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Rh(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function bs(){var e=$n;return $n<<=1,($n&62914560)===0&&($n=4194304),e}function Cu(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function Kl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Th(e,t,a,l,n,i){var r=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var d=e.entanglements,p=e.expirationTimes,A=e.hiddenUpdates;for(a=r&~a;0<a;){var N=31-dt(a),D=1<<N;d[N]=0,p[N]=-1;var w=A[N];if(w!==null)for(A[N]=null,N=0;N<w.length;N++){var z=w[N];z!==null&&(z.lane&=-536870913)}a&=~D}l!==0&&xs(e,l,0),i!==0&&n===0&&e.tag!==0&&(e.suspendedLanes|=i&~(r&~t))}function xs(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-dt(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|a&261930}function Ss(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var l=31-dt(a),n=1<<l;n&t|e[l]&t&&(e[l]|=t),a&=~n}}function Es(e,t){var a=t&-t;return a=(a&42)!==0?1:zu(a),(a&(e.suspendedLanes|t))!==0?0:a}function zu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Nu(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Ms(){var e=k.p;return e!==0?e:(e=window.event,e===void 0?32:om(e.type))}function Rs(e,t){var a=k.p;try{return k.p=e,t()}finally{k.p=a}}var oa=Math.random().toString(36).slice(2),Fe="__reactFiber$"+oa,lt="__reactProps$"+oa,el="__reactContainer$"+oa,Ou="__reactEvents$"+oa,Ah="__reactListeners$"+oa,wh="__reactHandles$"+oa,Ts="__reactResources$"+oa,Jl="__reactMarker$"+oa;function Bu(e){delete e[Fe],delete e[lt],delete e[Ou],delete e[Ah],delete e[wh]}function tl(e){var t=e[Fe];if(t)return t;for(var a=e.parentNode;a;){if(t=a[el]||a[Fe]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=Jd(e);e!==null;){if(a=e[Fe])return a;e=Jd(e)}return t}e=a,a=e.parentNode}return null}function al(e){if(e=e[Fe]||e[el]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Fl(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(c(33))}function ll(e){var t=e[Ts];return t||(t=e[Ts]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Ke(e){e[Jl]=!0}var As=new Set,ws={};function ja(e,t){nl(e,t),nl(e+"Capture",t)}function nl(e,t){for(ws[e]=t,e=0;e<t.length;e++)As.add(t[e])}var _h=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),_s={},Cs={};function Ch(e){return Au.call(Cs,e)?!0:Au.call(_s,e)?!1:_h.test(e)?Cs[e]=!0:(_s[e]=!0,!1)}function Pn(e,t,a){if(Ch(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function ei(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function Gt(e,t,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+l)}}function xt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function zs(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function zh(e,t,a){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var n=l.get,i=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return n.call(this)},set:function(r){a=""+r,i.call(this,r)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(r){a=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Du(e){if(!e._valueTracker){var t=zs(e)?"checked":"value";e._valueTracker=zh(e,t,""+e[t])}}function Ns(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),l="";return e&&(l=zs(e)?e.checked?"true":"false":e.value),e=l,e!==a?(t.setValue(e),!0):!1}function ti(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Nh=/[\n"\\]/g;function St(e){return e.replace(Nh,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Lu(e,t,a,l,n,i,r,d){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+xt(t)):e.value!==""+xt(t)&&(e.value=""+xt(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?ju(e,r,xt(t)):a!=null?ju(e,r,xt(a)):l!=null&&e.removeAttribute("value"),n==null&&i!=null&&(e.defaultChecked=!!i),n!=null&&(e.checked=n&&typeof n!="function"&&typeof n!="symbol"),d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"?e.name=""+xt(d):e.removeAttribute("name")}function Os(e,t,a,l,n,i,r,d){if(i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"&&(e.type=i),t!=null||a!=null){if(!(i!=="submit"&&i!=="reset"||t!=null)){Du(e);return}a=a!=null?""+xt(a):"",t=t!=null?""+xt(t):a,d||t===e.value||(e.value=t),e.defaultValue=t}l=l??n,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=d?e.checked:!!l,e.defaultChecked=!!l,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),Du(e)}function ju(e,t,a){t==="number"&&ti(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function il(e,t,a,l){if(e=e.options,t){t={};for(var n=0;n<a.length;n++)t["$"+a[n]]=!0;for(a=0;a<e.length;a++)n=t.hasOwnProperty("$"+e[a].value),e[a].selected!==n&&(e[a].selected=n),n&&l&&(e[a].defaultSelected=!0)}else{for(a=""+xt(a),t=null,n=0;n<e.length;n++){if(e[n].value===a){e[n].selected=!0,l&&(e[n].defaultSelected=!0);return}t!==null||e[n].disabled||(t=e[n])}t!==null&&(t.selected=!0)}}function Bs(e,t,a){if(t!=null&&(t=""+xt(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+xt(a):""}function Ds(e,t,a,l){if(t==null){if(l!=null){if(a!=null)throw Error(c(92));if(se(l)){if(1<l.length)throw Error(c(93));l=l[0]}a=l}a==null&&(a=""),t=a}a=xt(t),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l),Du(e)}function ul(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var Oh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Ls(e,t,a){var l=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,a):typeof a!="number"||a===0||Oh.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function js(e,t,a){if(t!=null&&typeof t!="object")throw Error(c(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var n in t)l=t[n],t.hasOwnProperty(n)&&a[n]!==l&&Ls(e,n,l)}else for(var i in t)t.hasOwnProperty(i)&&Ls(e,i,t[i])}function qu(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Bh=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Dh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ai(e){return Dh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Vt(){}var Hu=null;function Uu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var rl=null,cl=null;function qs(e){var t=al(e);if(t&&(e=t.stateNode)){var a=e[lt]||null;e:switch(e=t.stateNode,t.type){case"input":if(Lu(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+St(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var l=a[t];if(l!==e&&l.form===e.form){var n=l[lt]||null;if(!n)throw Error(c(90));Lu(l,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name)}}for(t=0;t<a.length;t++)l=a[t],l.form===e.form&&Ns(l)}break e;case"textarea":Bs(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&il(e,!!a.multiple,t,!1)}}}var Yu=!1;function Hs(e,t,a){if(Yu)return e(t,a);Yu=!0;try{var l=e(t);return l}finally{if(Yu=!1,(rl!==null||cl!==null)&&(Gi(),rl&&(t=rl,e=cl,cl=rl=null,qs(t),e)))for(t=0;t<e.length;t++)qs(e[t])}}function Wl(e,t){var a=e.stateNode;if(a===null)return null;var l=a[lt]||null;if(l===null)return null;a=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(c(231,t,typeof a));return a}var Qt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ku=!1;if(Qt)try{var $l={};Object.defineProperty($l,"passive",{get:function(){ku=!0}}),window.addEventListener("test",$l,$l),window.removeEventListener("test",$l,$l)}catch{ku=!1}var fa=null,Xu=null,li=null;function Us(){if(li)return li;var e,t=Xu,a=t.length,l,n="value"in fa?fa.value:fa.textContent,i=n.length;for(e=0;e<a&&t[e]===n[e];e++);var r=a-e;for(l=1;l<=r&&t[a-l]===n[i-l];l++);return li=n.slice(e,1<l?1-l:void 0)}function ni(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ii(){return!0}function Ys(){return!1}function nt(e){function t(a,l,n,i,r){this._reactName=a,this._targetInst=n,this.type=l,this.nativeEvent=i,this.target=r,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(a=e[d],this[d]=a?a(i):i[d]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?ii:Ys,this.isPropagationStopped=Ys,this}return R(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=ii)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=ii)},persist:function(){},isPersistent:ii}),t}var qa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ui=nt(qa),Il=R({},qa,{view:0,detail:0}),Lh=nt(Il),Gu,Vu,Pl,ri=R({},Il,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Zu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Pl&&(Pl&&e.type==="mousemove"?(Gu=e.screenX-Pl.screenX,Vu=e.screenY-Pl.screenY):Vu=Gu=0,Pl=e),Gu)},movementY:function(e){return"movementY"in e?e.movementY:Vu}}),ks=nt(ri),jh=R({},ri,{dataTransfer:0}),qh=nt(jh),Hh=R({},Il,{relatedTarget:0}),Qu=nt(Hh),Uh=R({},qa,{animationName:0,elapsedTime:0,pseudoElement:0}),Yh=nt(Uh),kh=R({},qa,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Xh=nt(kh),Gh=R({},qa,{data:0}),Xs=nt(Gh),Vh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Qh={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Zh={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kh(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Zh[e])?!!t[e]:!1}function Zu(){return Kh}var Jh=R({},Il,{key:function(e){if(e.key){var t=Vh[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ni(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Qh[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Zu,charCode:function(e){return e.type==="keypress"?ni(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ni(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Fh=nt(Jh),Wh=R({},ri,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Gs=nt(Wh),$h=R({},Il,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Zu}),Ih=nt($h),Ph=R({},qa,{propertyName:0,elapsedTime:0,pseudoElement:0}),ev=nt(Ph),tv=R({},ri,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),av=nt(tv),lv=R({},qa,{newState:0,oldState:0}),nv=nt(lv),iv=[9,13,27,32],Ku=Qt&&"CompositionEvent"in window,en=null;Qt&&"documentMode"in document&&(en=document.documentMode);var uv=Qt&&"TextEvent"in window&&!en,Vs=Qt&&(!Ku||en&&8<en&&11>=en),Qs=" ",Zs=!1;function Ks(e,t){switch(e){case"keyup":return iv.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Js(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var sl=!1;function rv(e,t){switch(e){case"compositionend":return Js(t);case"keypress":return t.which!==32?null:(Zs=!0,Qs);case"textInput":return e=t.data,e===Qs&&Zs?null:e;default:return null}}function cv(e,t){if(sl)return e==="compositionend"||!Ku&&Ks(e,t)?(e=Us(),li=Xu=fa=null,sl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Vs&&t.locale!=="ko"?null:t.data;default:return null}}var sv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Fs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!sv[e.type]:t==="textarea"}function Ws(e,t,a,l){rl?cl?cl.push(l):cl=[l]:rl=l,t=Wi(t,"onChange"),0<t.length&&(a=new ui("onChange","change",null,a,l),e.push({event:a,listeners:t}))}var tn=null,an=null;function ov(e){Dd(e,0)}function ci(e){var t=Fl(e);if(Ns(t))return e}function $s(e,t){if(e==="change")return t}var Is=!1;if(Qt){var Ju;if(Qt){var Fu="oninput"in document;if(!Fu){var Ps=document.createElement("div");Ps.setAttribute("oninput","return;"),Fu=typeof Ps.oninput=="function"}Ju=Fu}else Ju=!1;Is=Ju&&(!document.documentMode||9<document.documentMode)}function eo(){tn&&(tn.detachEvent("onpropertychange",to),an=tn=null)}function to(e){if(e.propertyName==="value"&&ci(an)){var t=[];Ws(t,an,e,Uu(e)),Hs(ov,t)}}function fv(e,t,a){e==="focusin"?(eo(),tn=t,an=a,tn.attachEvent("onpropertychange",to)):e==="focusout"&&eo()}function dv(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ci(an)}function mv(e,t){if(e==="click")return ci(t)}function hv(e,t){if(e==="input"||e==="change")return ci(t)}function vv(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var mt=typeof Object.is=="function"?Object.is:vv;function ln(e,t){if(mt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),l=Object.keys(t);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var n=a[l];if(!Au.call(t,n)||!mt(e[n],t[n]))return!1}return!0}function ao(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function lo(e,t){var a=ao(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=t&&l>=t)return{node:a,offset:t-e};e=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=ao(a)}}function no(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?no(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function io(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ti(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=ti(e.document)}return t}function Wu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var yv=Qt&&"documentMode"in document&&11>=document.documentMode,ol=null,$u=null,nn=null,Iu=!1;function uo(e,t,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Iu||ol==null||ol!==ti(l)||(l=ol,"selectionStart"in l&&Wu(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),nn&&ln(nn,l)||(nn=l,l=Wi($u,"onSelect"),0<l.length&&(t=new ui("onSelect","select",null,t,a),e.push({event:t,listeners:l}),t.target=ol)))}function Ha(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var fl={animationend:Ha("Animation","AnimationEnd"),animationiteration:Ha("Animation","AnimationIteration"),animationstart:Ha("Animation","AnimationStart"),transitionrun:Ha("Transition","TransitionRun"),transitionstart:Ha("Transition","TransitionStart"),transitioncancel:Ha("Transition","TransitionCancel"),transitionend:Ha("Transition","TransitionEnd")},Pu={},ro={};Qt&&(ro=document.createElement("div").style,"AnimationEvent"in window||(delete fl.animationend.animation,delete fl.animationiteration.animation,delete fl.animationstart.animation),"TransitionEvent"in window||delete fl.transitionend.transition);function Ua(e){if(Pu[e])return Pu[e];if(!fl[e])return e;var t=fl[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in ro)return Pu[e]=t[a];return e}var co=Ua("animationend"),so=Ua("animationiteration"),oo=Ua("animationstart"),pv=Ua("transitionrun"),gv=Ua("transitionstart"),bv=Ua("transitioncancel"),fo=Ua("transitionend"),mo=new Map,er="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");er.push("scrollEnd");function Nt(e,t){mo.set(e,t),ja(t,[e])}var si=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Et=[],dl=0,tr=0;function oi(){for(var e=dl,t=tr=dl=0;t<e;){var a=Et[t];Et[t++]=null;var l=Et[t];Et[t++]=null;var n=Et[t];Et[t++]=null;var i=Et[t];if(Et[t++]=null,l!==null&&n!==null){var r=l.pending;r===null?n.next=n:(n.next=r.next,r.next=n),l.pending=n}i!==0&&ho(a,n,i)}}function fi(e,t,a,l){Et[dl++]=e,Et[dl++]=t,Et[dl++]=a,Et[dl++]=l,tr|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function ar(e,t,a,l){return fi(e,t,a,l),di(e)}function Ya(e,t){return fi(e,null,null,t),di(e)}function ho(e,t,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var n=!1,i=e.return;i!==null;)i.childLanes|=a,l=i.alternate,l!==null&&(l.childLanes|=a),i.tag===22&&(e=i.stateNode,e===null||e._visibility&1||(n=!0)),e=i,i=i.return;return e.tag===3?(i=e.stateNode,n&&t!==null&&(n=31-dt(a),e=i.hiddenUpdates,l=e[n],l===null?e[n]=[t]:l.push(t),t.lane=a|536870912),i):null}function di(e){if(50<wn)throw wn=0,fc=null,Error(c(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ml={};function xv(e,t,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ht(e,t,a,l){return new xv(e,t,a,l)}function lr(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Zt(e,t){var a=e.alternate;return a===null?(a=ht(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function vo(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function mi(e,t,a,l,n,i){var r=0;if(l=e,typeof e=="function")lr(e)&&(r=1);else if(typeof e=="string")r=Ty(e,a,F.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case Ne:return e=ht(31,a,t,n),e.elementType=Ne,e.lanes=i,e;case Y:return ka(a.children,n,i,t);case j:r=8,n|=24;break;case H:return e=ht(12,a,t,n|2),e.elementType=H,e.lanes=i,e;case ue:return e=ht(13,a,t,n),e.elementType=ue,e.lanes=i,e;case ge:return e=ht(19,a,t,n),e.elementType=ge,e.lanes=i,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Q:r=10;break e;case X:r=9;break e;case Z:r=11;break e;case $:r=14;break e;case Se:r=16,l=null;break e}r=29,a=Error(c(130,e===null?"null":typeof e,"")),l=null}return t=ht(r,a,t,n),t.elementType=e,t.type=l,t.lanes=i,t}function ka(e,t,a,l){return e=ht(7,e,l,t),e.lanes=a,e}function nr(e,t,a){return e=ht(6,e,null,t),e.lanes=a,e}function yo(e){var t=ht(18,null,null,0);return t.stateNode=e,t}function ir(e,t,a){return t=ht(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var po=new WeakMap;function Mt(e,t){if(typeof e=="object"&&e!==null){var a=po.get(e);return a!==void 0?a:(t={value:e,source:t,stack:vs(t)},po.set(e,t),t)}return{value:e,source:t,stack:vs(t)}}var hl=[],vl=0,hi=null,un=0,Rt=[],Tt=0,da=null,Lt=1,jt="";function Kt(e,t){hl[vl++]=un,hl[vl++]=hi,hi=e,un=t}function go(e,t,a){Rt[Tt++]=Lt,Rt[Tt++]=jt,Rt[Tt++]=da,da=e;var l=Lt;e=jt;var n=32-dt(l)-1;l&=~(1<<n),a+=1;var i=32-dt(t)+n;if(30<i){var r=n-n%5;i=(l&(1<<r)-1).toString(32),l>>=r,n-=r,Lt=1<<32-dt(t)+n|a<<n|l,jt=i+e}else Lt=1<<i|a<<n|l,jt=e}function ur(e){e.return!==null&&(Kt(e,1),go(e,1,0))}function rr(e){for(;e===hi;)hi=hl[--vl],hl[vl]=null,un=hl[--vl],hl[vl]=null;for(;e===da;)da=Rt[--Tt],Rt[Tt]=null,jt=Rt[--Tt],Rt[Tt]=null,Lt=Rt[--Tt],Rt[Tt]=null}function bo(e,t){Rt[Tt++]=Lt,Rt[Tt++]=jt,Rt[Tt++]=da,Lt=t.id,jt=t.overflow,da=e}var We=null,_e=null,ve=!1,ma=null,At=!1,cr=Error(c(519));function ha(e){var t=Error(c(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw rn(Mt(t,e)),cr}function xo(e){var t=e.stateNode,a=e.type,l=e.memoizedProps;switch(t[Fe]=e,t[lt]=l,a){case"dialog":de("cancel",t),de("close",t);break;case"iframe":case"object":case"embed":de("load",t);break;case"video":case"audio":for(a=0;a<Cn.length;a++)de(Cn[a],t);break;case"source":de("error",t);break;case"img":case"image":case"link":de("error",t),de("load",t);break;case"details":de("toggle",t);break;case"input":de("invalid",t),Os(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":de("invalid",t);break;case"textarea":de("invalid",t),Ds(t,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||l.suppressHydrationWarning===!0||Hd(t.textContent,a)?(l.popover!=null&&(de("beforetoggle",t),de("toggle",t)),l.onScroll!=null&&de("scroll",t),l.onScrollEnd!=null&&de("scrollend",t),l.onClick!=null&&(t.onclick=Vt),t=!0):t=!1,t||ha(e,!0)}function So(e){for(We=e.return;We;)switch(We.tag){case 5:case 31:case 13:At=!1;return;case 27:case 3:At=!0;return;default:We=We.return}}function yl(e){if(e!==We)return!1;if(!ve)return So(e),ve=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||Ac(e.type,e.memoizedProps)),a=!a),a&&_e&&ha(e),So(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));_e=Kd(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));_e=Kd(e)}else t===27?(t=_e,_a(e.type)?(e=Nc,Nc=null,_e=e):_e=t):_e=We?_t(e.stateNode.nextSibling):null;return!0}function Xa(){_e=We=null,ve=!1}function sr(){var e=ma;return e!==null&&(ct===null?ct=e:ct.push.apply(ct,e),ma=null),e}function rn(e){ma===null?ma=[e]:ma.push(e)}var or=b(null),Ga=null,Jt=null;function va(e,t,a){V(or,t._currentValue),t._currentValue=a}function Ft(e){e._currentValue=or.current,B(or)}function fr(e,t,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===a)break;e=e.return}}function dr(e,t,a,l){var n=e.child;for(n!==null&&(n.return=e);n!==null;){var i=n.dependencies;if(i!==null){var r=n.child;i=i.firstContext;e:for(;i!==null;){var d=i;i=n;for(var p=0;p<t.length;p++)if(d.context===t[p]){i.lanes|=a,d=i.alternate,d!==null&&(d.lanes|=a),fr(i.return,a,e),l||(r=null);break e}i=d.next}}else if(n.tag===18){if(r=n.return,r===null)throw Error(c(341));r.lanes|=a,i=r.alternate,i!==null&&(i.lanes|=a),fr(r,a,e),r=null}else r=n.child;if(r!==null)r.return=n;else for(r=n;r!==null;){if(r===e){r=null;break}if(n=r.sibling,n!==null){n.return=r.return,r=n;break}r=r.return}n=r}}function pl(e,t,a,l){e=null;for(var n=t,i=!1;n!==null;){if(!i){if((n.flags&524288)!==0)i=!0;else if((n.flags&262144)!==0)break}if(n.tag===10){var r=n.alternate;if(r===null)throw Error(c(387));if(r=r.memoizedProps,r!==null){var d=n.type;mt(n.pendingProps.value,r.value)||(e!==null?e.push(d):e=[d])}}else if(n===xe.current){if(r=n.alternate,r===null)throw Error(c(387));r.memoizedState.memoizedState!==n.memoizedState.memoizedState&&(e!==null?e.push(Dn):e=[Dn])}n=n.return}e!==null&&dr(t,e,a,l),t.flags|=262144}function vi(e){for(e=e.firstContext;e!==null;){if(!mt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Va(e){Ga=e,Jt=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function $e(e){return Eo(Ga,e)}function yi(e,t){return Ga===null&&Va(e),Eo(e,t)}function Eo(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},Jt===null){if(e===null)throw Error(c(308));Jt=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Jt=Jt.next=t;return a}var Sv=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},Ev=u.unstable_scheduleCallback,Mv=u.unstable_NormalPriority,ke={$$typeof:Q,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function mr(){return{controller:new Sv,data:new Map,refCount:0}}function cn(e){e.refCount--,e.refCount===0&&Ev(Mv,function(){e.controller.abort()})}var sn=null,hr=0,gl=0,bl=null;function Rv(e,t){if(sn===null){var a=sn=[];hr=0,gl=pc(),bl={status:"pending",value:void 0,then:function(l){a.push(l)}}}return hr++,t.then(Mo,Mo),t}function Mo(){if(--hr===0&&sn!==null){bl!==null&&(bl.status="fulfilled");var e=sn;sn=null,gl=0,bl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Tv(e,t){var a=[],l={status:"pending",value:null,reason:null,then:function(n){a.push(n)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var n=0;n<a.length;n++)(0,a[n])(t)},function(n){for(l.status="rejected",l.reason=n,n=0;n<a.length;n++)(0,a[n])(void 0)}),l}var Ro=C.S;C.S=function(e,t){cd=ot(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Rv(e,t),Ro!==null&&Ro(e,t)};var Qa=b(null);function vr(){var e=Qa.current;return e!==null?e:we.pooledCache}function pi(e,t){t===null?V(Qa,Qa.current):V(Qa,t.pool)}function To(){var e=vr();return e===null?null:{parent:ke._currentValue,pool:e}}var xl=Error(c(460)),yr=Error(c(474)),gi=Error(c(542)),bi={then:function(){}};function Ao(e){return e=e.status,e==="fulfilled"||e==="rejected"}function wo(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(Vt,Vt),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Co(e),e;default:if(typeof t.status=="string")t.then(Vt,Vt);else{if(e=we,e!==null&&100<e.shellSuspendCounter)throw Error(c(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var n=t;n.status="fulfilled",n.value=l}},function(l){if(t.status==="pending"){var n=t;n.status="rejected",n.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Co(e),e}throw Ka=t,xl}}function Za(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Ka=a,xl):a}}var Ka=null;function _o(){if(Ka===null)throw Error(c(459));var e=Ka;return Ka=null,e}function Co(e){if(e===xl||e===gi)throw Error(c(483))}var Sl=null,on=0;function xi(e){var t=on;return on+=1,Sl===null&&(Sl=[]),wo(Sl,e,t)}function fn(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Si(e,t){throw t.$$typeof===q?Error(c(525)):(e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function zo(e){function t(E,x){if(e){var T=E.deletions;T===null?(E.deletions=[x],E.flags|=16):T.push(x)}}function a(E,x){if(!e)return null;for(;x!==null;)t(E,x),x=x.sibling;return null}function l(E){for(var x=new Map;E!==null;)E.key!==null?x.set(E.key,E):x.set(E.index,E),E=E.sibling;return x}function n(E,x){return E=Zt(E,x),E.index=0,E.sibling=null,E}function i(E,x,T){return E.index=T,e?(T=E.alternate,T!==null?(T=T.index,T<x?(E.flags|=67108866,x):T):(E.flags|=67108866,x)):(E.flags|=1048576,x)}function r(E){return e&&E.alternate===null&&(E.flags|=67108866),E}function d(E,x,T,O){return x===null||x.tag!==6?(x=nr(T,E.mode,O),x.return=E,x):(x=n(x,T),x.return=E,x)}function p(E,x,T,O){var I=T.type;return I===Y?N(E,x,T.props.children,O,T.key):x!==null&&(x.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===Se&&Za(I)===x.type)?(x=n(x,T.props),fn(x,T),x.return=E,x):(x=mi(T.type,T.key,T.props,null,E.mode,O),fn(x,T),x.return=E,x)}function A(E,x,T,O){return x===null||x.tag!==4||x.stateNode.containerInfo!==T.containerInfo||x.stateNode.implementation!==T.implementation?(x=ir(T,E.mode,O),x.return=E,x):(x=n(x,T.children||[]),x.return=E,x)}function N(E,x,T,O,I){return x===null||x.tag!==7?(x=ka(T,E.mode,O,I),x.return=E,x):(x=n(x,T),x.return=E,x)}function D(E,x,T){if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return x=nr(""+x,E.mode,T),x.return=E,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case K:return T=mi(x.type,x.key,x.props,null,E.mode,T),fn(T,x),T.return=E,T;case U:return x=ir(x,E.mode,T),x.return=E,x;case Se:return x=Za(x),D(E,x,T)}if(se(x)||G(x))return x=ka(x,E.mode,T,null),x.return=E,x;if(typeof x.then=="function")return D(E,xi(x),T);if(x.$$typeof===Q)return D(E,yi(E,x),T);Si(E,x)}return null}function w(E,x,T,O){var I=x!==null?x.key:null;if(typeof T=="string"&&T!==""||typeof T=="number"||typeof T=="bigint")return I!==null?null:d(E,x,""+T,O);if(typeof T=="object"&&T!==null){switch(T.$$typeof){case K:return T.key===I?p(E,x,T,O):null;case U:return T.key===I?A(E,x,T,O):null;case Se:return T=Za(T),w(E,x,T,O)}if(se(T)||G(T))return I!==null?null:N(E,x,T,O,null);if(typeof T.then=="function")return w(E,x,xi(T),O);if(T.$$typeof===Q)return w(E,x,yi(E,T),O);Si(E,T)}return null}function z(E,x,T,O,I){if(typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint")return E=E.get(T)||null,d(x,E,""+O,I);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case K:return E=E.get(O.key===null?T:O.key)||null,p(x,E,O,I);case U:return E=E.get(O.key===null?T:O.key)||null,A(x,E,O,I);case Se:return O=Za(O),z(E,x,T,O,I)}if(se(O)||G(O))return E=E.get(T)||null,N(x,E,O,I,null);if(typeof O.then=="function")return z(E,x,T,xi(O),I);if(O.$$typeof===Q)return z(E,x,T,yi(x,O),I);Si(x,O)}return null}function J(E,x,T,O){for(var I=null,ye=null,W=x,ie=x=0,he=null;W!==null&&ie<T.length;ie++){W.index>ie?(he=W,W=null):he=W.sibling;var pe=w(E,W,T[ie],O);if(pe===null){W===null&&(W=he);break}e&&W&&pe.alternate===null&&t(E,W),x=i(pe,x,ie),ye===null?I=pe:ye.sibling=pe,ye=pe,W=he}if(ie===T.length)return a(E,W),ve&&Kt(E,ie),I;if(W===null){for(;ie<T.length;ie++)W=D(E,T[ie],O),W!==null&&(x=i(W,x,ie),ye===null?I=W:ye.sibling=W,ye=W);return ve&&Kt(E,ie),I}for(W=l(W);ie<T.length;ie++)he=z(W,E,ie,T[ie],O),he!==null&&(e&&he.alternate!==null&&W.delete(he.key===null?ie:he.key),x=i(he,x,ie),ye===null?I=he:ye.sibling=he,ye=he);return e&&W.forEach(function(Ba){return t(E,Ba)}),ve&&Kt(E,ie),I}function ee(E,x,T,O){if(T==null)throw Error(c(151));for(var I=null,ye=null,W=x,ie=x=0,he=null,pe=T.next();W!==null&&!pe.done;ie++,pe=T.next()){W.index>ie?(he=W,W=null):he=W.sibling;var Ba=w(E,W,pe.value,O);if(Ba===null){W===null&&(W=he);break}e&&W&&Ba.alternate===null&&t(E,W),x=i(Ba,x,ie),ye===null?I=Ba:ye.sibling=Ba,ye=Ba,W=he}if(pe.done)return a(E,W),ve&&Kt(E,ie),I;if(W===null){for(;!pe.done;ie++,pe=T.next())pe=D(E,pe.value,O),pe!==null&&(x=i(pe,x,ie),ye===null?I=pe:ye.sibling=pe,ye=pe);return ve&&Kt(E,ie),I}for(W=l(W);!pe.done;ie++,pe=T.next())pe=z(W,E,ie,pe.value,O),pe!==null&&(e&&pe.alternate!==null&&W.delete(pe.key===null?ie:pe.key),x=i(pe,x,ie),ye===null?I=pe:ye.sibling=pe,ye=pe);return e&&W.forEach(function(jy){return t(E,jy)}),ve&&Kt(E,ie),I}function Ae(E,x,T,O){if(typeof T=="object"&&T!==null&&T.type===Y&&T.key===null&&(T=T.props.children),typeof T=="object"&&T!==null){switch(T.$$typeof){case K:e:{for(var I=T.key;x!==null;){if(x.key===I){if(I=T.type,I===Y){if(x.tag===7){a(E,x.sibling),O=n(x,T.props.children),O.return=E,E=O;break e}}else if(x.elementType===I||typeof I=="object"&&I!==null&&I.$$typeof===Se&&Za(I)===x.type){a(E,x.sibling),O=n(x,T.props),fn(O,T),O.return=E,E=O;break e}a(E,x);break}else t(E,x);x=x.sibling}T.type===Y?(O=ka(T.props.children,E.mode,O,T.key),O.return=E,E=O):(O=mi(T.type,T.key,T.props,null,E.mode,O),fn(O,T),O.return=E,E=O)}return r(E);case U:e:{for(I=T.key;x!==null;){if(x.key===I)if(x.tag===4&&x.stateNode.containerInfo===T.containerInfo&&x.stateNode.implementation===T.implementation){a(E,x.sibling),O=n(x,T.children||[]),O.return=E,E=O;break e}else{a(E,x);break}else t(E,x);x=x.sibling}O=ir(T,E.mode,O),O.return=E,E=O}return r(E);case Se:return T=Za(T),Ae(E,x,T,O)}if(se(T))return J(E,x,T,O);if(G(T)){if(I=G(T),typeof I!="function")throw Error(c(150));return T=I.call(T),ee(E,x,T,O)}if(typeof T.then=="function")return Ae(E,x,xi(T),O);if(T.$$typeof===Q)return Ae(E,x,yi(E,T),O);Si(E,T)}return typeof T=="string"&&T!==""||typeof T=="number"||typeof T=="bigint"?(T=""+T,x!==null&&x.tag===6?(a(E,x.sibling),O=n(x,T),O.return=E,E=O):(a(E,x),O=nr(T,E.mode,O),O.return=E,E=O),r(E)):a(E,x)}return function(E,x,T,O){try{on=0;var I=Ae(E,x,T,O);return Sl=null,I}catch(W){if(W===xl||W===gi)throw W;var ye=ht(29,W,null,E.mode);return ye.lanes=O,ye.return=E,ye}}}var Ja=zo(!0),No=zo(!1),ya=!1;function pr(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function gr(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function pa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function ga(e,t,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(be&2)!==0){var n=l.pending;return n===null?t.next=t:(t.next=n.next,n.next=t),l.pending=t,t=di(e),ho(e,null,a),t}return fi(e,l,t,a),di(e)}function dn(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Ss(e,a)}}function br(e,t){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var n=null,i=null;if(a=a.firstBaseUpdate,a!==null){do{var r={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};i===null?n=i=r:i=i.next=r,a=a.next}while(a!==null);i===null?n=i=t:i=i.next=t}else n=i=t;a={baseState:l.baseState,firstBaseUpdate:n,lastBaseUpdate:i,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var xr=!1;function mn(){if(xr){var e=bl;if(e!==null)throw e}}function hn(e,t,a,l){xr=!1;var n=e.updateQueue;ya=!1;var i=n.firstBaseUpdate,r=n.lastBaseUpdate,d=n.shared.pending;if(d!==null){n.shared.pending=null;var p=d,A=p.next;p.next=null,r===null?i=A:r.next=A,r=p;var N=e.alternate;N!==null&&(N=N.updateQueue,d=N.lastBaseUpdate,d!==r&&(d===null?N.firstBaseUpdate=A:d.next=A,N.lastBaseUpdate=p))}if(i!==null){var D=n.baseState;r=0,N=A=p=null,d=i;do{var w=d.lane&-536870913,z=w!==d.lane;if(z?(me&w)===w:(l&w)===w){w!==0&&w===gl&&(xr=!0),N!==null&&(N=N.next={lane:0,tag:d.tag,payload:d.payload,callback:null,next:null});e:{var J=e,ee=d;w=t;var Ae=a;switch(ee.tag){case 1:if(J=ee.payload,typeof J=="function"){D=J.call(Ae,D,w);break e}D=J;break e;case 3:J.flags=J.flags&-65537|128;case 0:if(J=ee.payload,w=typeof J=="function"?J.call(Ae,D,w):J,w==null)break e;D=R({},D,w);break e;case 2:ya=!0}}w=d.callback,w!==null&&(e.flags|=64,z&&(e.flags|=8192),z=n.callbacks,z===null?n.callbacks=[w]:z.push(w))}else z={lane:w,tag:d.tag,payload:d.payload,callback:d.callback,next:null},N===null?(A=N=z,p=D):N=N.next=z,r|=w;if(d=d.next,d===null){if(d=n.shared.pending,d===null)break;z=d,d=z.next,z.next=null,n.lastBaseUpdate=z,n.shared.pending=null}}while(!0);N===null&&(p=D),n.baseState=p,n.firstBaseUpdate=A,n.lastBaseUpdate=N,i===null&&(n.shared.lanes=0),Ma|=r,e.lanes=r,e.memoizedState=D}}function Oo(e,t){if(typeof e!="function")throw Error(c(191,e));e.call(t)}function Bo(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Oo(a[e],t)}var El=b(null),Ei=b(0);function Do(e,t){e=na,V(Ei,e),V(El,t),na=e|t.baseLanes}function Sr(){V(Ei,na),V(El,El.current)}function Er(){na=Ei.current,B(El),B(Ei)}var vt=b(null),wt=null;function ba(e){var t=e.alternate;V(qe,qe.current&1),V(vt,e),wt===null&&(t===null||El.current!==null||t.memoizedState!==null)&&(wt=e)}function Mr(e){V(qe,qe.current),V(vt,e),wt===null&&(wt=e)}function Lo(e){e.tag===22?(V(qe,qe.current),V(vt,e),wt===null&&(wt=e)):xa()}function xa(){V(qe,qe.current),V(vt,vt.current)}function yt(e){B(vt),wt===e&&(wt=null),B(qe)}var qe=b(0);function Mi(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Cc(a)||zc(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Wt=0,ne=null,Re=null,Xe=null,Ri=!1,Ml=!1,Fa=!1,Ti=0,vn=0,Rl=null,Av=0;function Be(){throw Error(c(321))}function Rr(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!mt(e[a],t[a]))return!1;return!0}function Tr(e,t,a,l,n,i){return Wt=i,ne=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,C.H=e===null||e.memoizedState===null?bf:Yr,Fa=!1,i=a(l,n),Fa=!1,Ml&&(i=qo(t,a,l,n)),jo(e),i}function jo(e){C.H=gn;var t=Re!==null&&Re.next!==null;if(Wt=0,Xe=Re=ne=null,Ri=!1,vn=0,Rl=null,t)throw Error(c(300));e===null||Ge||(e=e.dependencies,e!==null&&vi(e)&&(Ge=!0))}function qo(e,t,a,l){ne=e;var n=0;do{if(Ml&&(Rl=null),vn=0,Ml=!1,25<=n)throw Error(c(301));if(n+=1,Xe=Re=null,e.updateQueue!=null){var i=e.updateQueue;i.lastEffect=null,i.events=null,i.stores=null,i.memoCache!=null&&(i.memoCache.index=0)}C.H=xf,i=t(a,l)}while(Ml);return i}function wv(){var e=C.H,t=e.useState()[0];return t=typeof t.then=="function"?yn(t):t,e=e.useState()[0],(Re!==null?Re.memoizedState:null)!==e&&(ne.flags|=1024),t}function Ar(){var e=Ti!==0;return Ti=0,e}function wr(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function _r(e){if(Ri){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ri=!1}Wt=0,Xe=Re=ne=null,Ml=!1,vn=Ti=0,Rl=null}function at(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Xe===null?ne.memoizedState=Xe=e:Xe=Xe.next=e,Xe}function He(){if(Re===null){var e=ne.alternate;e=e!==null?e.memoizedState:null}else e=Re.next;var t=Xe===null?ne.memoizedState:Xe.next;if(t!==null)Xe=t,Re=e;else{if(e===null)throw ne.alternate===null?Error(c(467)):Error(c(310));Re=e,e={memoizedState:Re.memoizedState,baseState:Re.baseState,baseQueue:Re.baseQueue,queue:Re.queue,next:null},Xe===null?ne.memoizedState=Xe=e:Xe=Xe.next=e}return Xe}function Ai(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function yn(e){var t=vn;return vn+=1,Rl===null&&(Rl=[]),e=wo(Rl,e,t),t=ne,(Xe===null?t.memoizedState:Xe.next)===null&&(t=t.alternate,C.H=t===null||t.memoizedState===null?bf:Yr),e}function wi(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return yn(e);if(e.$$typeof===Q)return $e(e)}throw Error(c(438,String(e)))}function Cr(e){var t=null,a=ne.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var l=ne.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(n){return n.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=Ai(),ne.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),l=0;l<e;l++)a[l]=Ue;return t.index++,a}function $t(e,t){return typeof t=="function"?t(e):t}function _i(e){var t=He();return zr(t,Re,e)}function zr(e,t,a){var l=e.queue;if(l===null)throw Error(c(311));l.lastRenderedReducer=a;var n=e.baseQueue,i=l.pending;if(i!==null){if(n!==null){var r=n.next;n.next=i.next,i.next=r}t.baseQueue=n=i,l.pending=null}if(i=e.baseState,n===null)e.memoizedState=i;else{t=n.next;var d=r=null,p=null,A=t,N=!1;do{var D=A.lane&-536870913;if(D!==A.lane?(me&D)===D:(Wt&D)===D){var w=A.revertLane;if(w===0)p!==null&&(p=p.next={lane:0,revertLane:0,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null}),D===gl&&(N=!0);else if((Wt&w)===w){A=A.next,w===gl&&(N=!0);continue}else D={lane:0,revertLane:A.revertLane,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},p===null?(d=p=D,r=i):p=p.next=D,ne.lanes|=w,Ma|=w;D=A.action,Fa&&a(i,D),i=A.hasEagerState?A.eagerState:a(i,D)}else w={lane:D,revertLane:A.revertLane,gesture:A.gesture,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},p===null?(d=p=w,r=i):p=p.next=w,ne.lanes|=D,Ma|=D;A=A.next}while(A!==null&&A!==t);if(p===null?r=i:p.next=d,!mt(i,e.memoizedState)&&(Ge=!0,N&&(a=bl,a!==null)))throw a;e.memoizedState=i,e.baseState=r,e.baseQueue=p,l.lastRenderedState=i}return n===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function Nr(e){var t=He(),a=t.queue;if(a===null)throw Error(c(311));a.lastRenderedReducer=e;var l=a.dispatch,n=a.pending,i=t.memoizedState;if(n!==null){a.pending=null;var r=n=n.next;do i=e(i,r.action),r=r.next;while(r!==n);mt(i,t.memoizedState)||(Ge=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),a.lastRenderedState=i}return[i,l]}function Ho(e,t,a){var l=ne,n=He(),i=ve;if(i){if(a===void 0)throw Error(c(407));a=a()}else a=t();var r=!mt((Re||n).memoizedState,a);if(r&&(n.memoizedState=a,Ge=!0),n=n.queue,Dr(ko.bind(null,l,n,e),[e]),n.getSnapshot!==t||r||Xe!==null&&Xe.memoizedState.tag&1){if(l.flags|=2048,Tl(9,{destroy:void 0},Yo.bind(null,l,n,a,t),null),we===null)throw Error(c(349));i||(Wt&127)!==0||Uo(l,t,a)}return a}function Uo(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=ne.updateQueue,t===null?(t=Ai(),ne.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function Yo(e,t,a,l){t.value=a,t.getSnapshot=l,Xo(t)&&Go(e)}function ko(e,t,a){return a(function(){Xo(t)&&Go(e)})}function Xo(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!mt(e,a)}catch{return!0}}function Go(e){var t=Ya(e,2);t!==null&&st(t,e,2)}function Or(e){var t=at();if(typeof e=="function"){var a=e;if(e=a(),Fa){sa(!0);try{a()}finally{sa(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:$t,lastRenderedState:e},t}function Vo(e,t,a,l){return e.baseState=a,zr(e,Re,typeof l=="function"?l:$t)}function _v(e,t,a,l,n){if(Ni(e))throw Error(c(485));if(e=t.action,e!==null){var i={payload:n,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){i.listeners.push(r)}};C.T!==null?a(!0):i.isTransition=!1,l(i),a=t.pending,a===null?(i.next=t.pending=i,Qo(t,i)):(i.next=a.next,t.pending=a.next=i)}}function Qo(e,t){var a=t.action,l=t.payload,n=e.state;if(t.isTransition){var i=C.T,r={};C.T=r;try{var d=a(n,l),p=C.S;p!==null&&p(r,d),Zo(e,t,d)}catch(A){Br(e,t,A)}finally{i!==null&&r.types!==null&&(i.types=r.types),C.T=i}}else try{i=a(n,l),Zo(e,t,i)}catch(A){Br(e,t,A)}}function Zo(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){Ko(e,t,l)},function(l){return Br(e,t,l)}):Ko(e,t,a)}function Ko(e,t,a){t.status="fulfilled",t.value=a,Jo(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,Qo(e,a)))}function Br(e,t,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=a,Jo(t),t=t.next;while(t!==l)}e.action=null}function Jo(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Fo(e,t){return t}function Wo(e,t){if(ve){var a=we.formState;if(a!==null){e:{var l=ne;if(ve){if(_e){t:{for(var n=_e,i=At;n.nodeType!==8;){if(!i){n=null;break t}if(n=_t(n.nextSibling),n===null){n=null;break t}}i=n.data,n=i==="F!"||i==="F"?n:null}if(n){_e=_t(n.nextSibling),l=n.data==="F!";break e}}ha(l)}l=!1}l&&(t=a[0])}}return a=at(),a.memoizedState=a.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Fo,lastRenderedState:t},a.queue=l,a=yf.bind(null,ne,l),l.dispatch=a,l=Or(!1),i=Ur.bind(null,ne,!1,l.queue),l=at(),n={state:t,dispatch:null,action:e,pending:null},l.queue=n,a=_v.bind(null,ne,n,i,a),n.dispatch=a,l.memoizedState=e,[t,a,!1]}function $o(e){var t=He();return Io(t,Re,e)}function Io(e,t,a){if(t=zr(e,t,Fo)[0],e=_i($t)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=yn(t)}catch(r){throw r===xl?gi:r}else l=t;t=He();var n=t.queue,i=n.dispatch;return a!==t.memoizedState&&(ne.flags|=2048,Tl(9,{destroy:void 0},Cv.bind(null,n,a),null)),[l,i,e]}function Cv(e,t){e.action=t}function Po(e){var t=He(),a=Re;if(a!==null)return Io(t,a,e);He(),t=t.memoizedState,a=He();var l=a.queue.dispatch;return a.memoizedState=e,[t,l,!1]}function Tl(e,t,a,l){return e={tag:e,create:a,deps:l,inst:t,next:null},t=ne.updateQueue,t===null&&(t=Ai(),ne.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,t.lastEffect=e),e}function ef(){return He().memoizedState}function Ci(e,t,a,l){var n=at();ne.flags|=e,n.memoizedState=Tl(1|t,{destroy:void 0},a,l===void 0?null:l)}function zi(e,t,a,l){var n=He();l=l===void 0?null:l;var i=n.memoizedState.inst;Re!==null&&l!==null&&Rr(l,Re.memoizedState.deps)?n.memoizedState=Tl(t,i,a,l):(ne.flags|=e,n.memoizedState=Tl(1|t,i,a,l))}function tf(e,t){Ci(8390656,8,e,t)}function Dr(e,t){zi(2048,8,e,t)}function zv(e){ne.flags|=4;var t=ne.updateQueue;if(t===null)t=Ai(),ne.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function af(e){var t=He().memoizedState;return zv({ref:t,nextImpl:e}),function(){if((be&2)!==0)throw Error(c(440));return t.impl.apply(void 0,arguments)}}function lf(e,t){return zi(4,2,e,t)}function nf(e,t){return zi(4,4,e,t)}function uf(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function rf(e,t,a){a=a!=null?a.concat([e]):null,zi(4,4,uf.bind(null,t,e),a)}function Lr(){}function cf(e,t){var a=He();t=t===void 0?null:t;var l=a.memoizedState;return t!==null&&Rr(t,l[1])?l[0]:(a.memoizedState=[e,t],e)}function sf(e,t){var a=He();t=t===void 0?null:t;var l=a.memoizedState;if(t!==null&&Rr(t,l[1]))return l[0];if(l=e(),Fa){sa(!0);try{e()}finally{sa(!1)}}return a.memoizedState=[l,t],l}function jr(e,t,a){return a===void 0||(Wt&1073741824)!==0&&(me&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=od(),ne.lanes|=e,Ma|=e,a)}function of(e,t,a,l){return mt(a,t)?a:El.current!==null?(e=jr(e,a,l),mt(e,t)||(Ge=!0),e):(Wt&42)===0||(Wt&1073741824)!==0&&(me&261930)===0?(Ge=!0,e.memoizedState=a):(e=od(),ne.lanes|=e,Ma|=e,t)}function ff(e,t,a,l,n){var i=k.p;k.p=i!==0&&8>i?i:8;var r=C.T,d={};C.T=d,Ur(e,!1,t,a);try{var p=n(),A=C.S;if(A!==null&&A(d,p),p!==null&&typeof p=="object"&&typeof p.then=="function"){var N=Tv(p,l);pn(e,t,N,bt(e))}else pn(e,t,l,bt(e))}catch(D){pn(e,t,{then:function(){},status:"rejected",reason:D},bt())}finally{k.p=i,r!==null&&d.types!==null&&(r.types=d.types),C.T=r}}function Nv(){}function qr(e,t,a,l){if(e.tag!==5)throw Error(c(476));var n=df(e).queue;ff(e,n,t,L,a===null?Nv:function(){return mf(e),a(l)})}function df(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:L,baseState:L,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:$t,lastRenderedState:L},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:$t,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function mf(e){var t=df(e);t.next===null&&(t=e.alternate.memoizedState),pn(e,t.next.queue,{},bt())}function Hr(){return $e(Dn)}function hf(){return He().memoizedState}function vf(){return He().memoizedState}function Ov(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=bt();e=pa(a);var l=ga(t,e,a);l!==null&&(st(l,t,a),dn(l,t,a)),t={cache:mr()},e.payload=t;return}t=t.return}}function Bv(e,t,a){var l=bt();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Ni(e)?pf(t,a):(a=ar(e,t,a,l),a!==null&&(st(a,e,l),gf(a,t,l)))}function yf(e,t,a){var l=bt();pn(e,t,a,l)}function pn(e,t,a,l){var n={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Ni(e))pf(t,n);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var r=t.lastRenderedState,d=i(r,a);if(n.hasEagerState=!0,n.eagerState=d,mt(d,r))return fi(e,t,n,0),we===null&&oi(),!1}catch{}if(a=ar(e,t,n,l),a!==null)return st(a,e,l),gf(a,t,l),!0}return!1}function Ur(e,t,a,l){if(l={lane:2,revertLane:pc(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Ni(e)){if(t)throw Error(c(479))}else t=ar(e,a,l,2),t!==null&&st(t,e,2)}function Ni(e){var t=e.alternate;return e===ne||t!==null&&t===ne}function pf(e,t){Ml=Ri=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function gf(e,t,a){if((a&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,Ss(e,a)}}var gn={readContext:$e,use:wi,useCallback:Be,useContext:Be,useEffect:Be,useImperativeHandle:Be,useLayoutEffect:Be,useInsertionEffect:Be,useMemo:Be,useReducer:Be,useRef:Be,useState:Be,useDebugValue:Be,useDeferredValue:Be,useTransition:Be,useSyncExternalStore:Be,useId:Be,useHostTransitionStatus:Be,useFormState:Be,useActionState:Be,useOptimistic:Be,useMemoCache:Be,useCacheRefresh:Be};gn.useEffectEvent=Be;var bf={readContext:$e,use:wi,useCallback:function(e,t){return at().memoizedState=[e,t===void 0?null:t],e},useContext:$e,useEffect:tf,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,Ci(4194308,4,uf.bind(null,t,e),a)},useLayoutEffect:function(e,t){return Ci(4194308,4,e,t)},useInsertionEffect:function(e,t){Ci(4,2,e,t)},useMemo:function(e,t){var a=at();t=t===void 0?null:t;var l=e();if(Fa){sa(!0);try{e()}finally{sa(!1)}}return a.memoizedState=[l,t],l},useReducer:function(e,t,a){var l=at();if(a!==void 0){var n=a(t);if(Fa){sa(!0);try{a(t)}finally{sa(!1)}}}else n=t;return l.memoizedState=l.baseState=n,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},l.queue=e,e=e.dispatch=Bv.bind(null,ne,e),[l.memoizedState,e]},useRef:function(e){var t=at();return e={current:e},t.memoizedState=e},useState:function(e){e=Or(e);var t=e.queue,a=yf.bind(null,ne,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:Lr,useDeferredValue:function(e,t){var a=at();return jr(a,e,t)},useTransition:function(){var e=Or(!1);return e=ff.bind(null,ne,e.queue,!0,!1),at().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var l=ne,n=at();if(ve){if(a===void 0)throw Error(c(407));a=a()}else{if(a=t(),we===null)throw Error(c(349));(me&127)!==0||Uo(l,t,a)}n.memoizedState=a;var i={value:a,getSnapshot:t};return n.queue=i,tf(ko.bind(null,l,i,e),[e]),l.flags|=2048,Tl(9,{destroy:void 0},Yo.bind(null,l,i,a,t),null),a},useId:function(){var e=at(),t=we.identifierPrefix;if(ve){var a=jt,l=Lt;a=(l&~(1<<32-dt(l)-1)).toString(32)+a,t="_"+t+"R_"+a,a=Ti++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=Av++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Hr,useFormState:Wo,useActionState:Wo,useOptimistic:function(e){var t=at();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=Ur.bind(null,ne,!0,a),a.dispatch=t,[e,t]},useMemoCache:Cr,useCacheRefresh:function(){return at().memoizedState=Ov.bind(null,ne)},useEffectEvent:function(e){var t=at(),a={impl:e};return t.memoizedState=a,function(){if((be&2)!==0)throw Error(c(440));return a.impl.apply(void 0,arguments)}}},Yr={readContext:$e,use:wi,useCallback:cf,useContext:$e,useEffect:Dr,useImperativeHandle:rf,useInsertionEffect:lf,useLayoutEffect:nf,useMemo:sf,useReducer:_i,useRef:ef,useState:function(){return _i($t)},useDebugValue:Lr,useDeferredValue:function(e,t){var a=He();return of(a,Re.memoizedState,e,t)},useTransition:function(){var e=_i($t)[0],t=He().memoizedState;return[typeof e=="boolean"?e:yn(e),t]},useSyncExternalStore:Ho,useId:hf,useHostTransitionStatus:Hr,useFormState:$o,useActionState:$o,useOptimistic:function(e,t){var a=He();return Vo(a,Re,e,t)},useMemoCache:Cr,useCacheRefresh:vf};Yr.useEffectEvent=af;var xf={readContext:$e,use:wi,useCallback:cf,useContext:$e,useEffect:Dr,useImperativeHandle:rf,useInsertionEffect:lf,useLayoutEffect:nf,useMemo:sf,useReducer:Nr,useRef:ef,useState:function(){return Nr($t)},useDebugValue:Lr,useDeferredValue:function(e,t){var a=He();return Re===null?jr(a,e,t):of(a,Re.memoizedState,e,t)},useTransition:function(){var e=Nr($t)[0],t=He().memoizedState;return[typeof e=="boolean"?e:yn(e),t]},useSyncExternalStore:Ho,useId:hf,useHostTransitionStatus:Hr,useFormState:Po,useActionState:Po,useOptimistic:function(e,t){var a=He();return Re!==null?Vo(a,Re,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Cr,useCacheRefresh:vf};xf.useEffectEvent=af;function kr(e,t,a,l){t=e.memoizedState,a=a(l,t),a=a==null?t:R({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Xr={enqueueSetState:function(e,t,a){e=e._reactInternals;var l=bt(),n=pa(l);n.payload=t,a!=null&&(n.callback=a),t=ga(e,n,l),t!==null&&(st(t,e,l),dn(t,e,l))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var l=bt(),n=pa(l);n.tag=1,n.payload=t,a!=null&&(n.callback=a),t=ga(e,n,l),t!==null&&(st(t,e,l),dn(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=bt(),l=pa(a);l.tag=2,t!=null&&(l.callback=t),t=ga(e,l,a),t!==null&&(st(t,e,a),dn(t,e,a))}};function Sf(e,t,a,l,n,i,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,i,r):t.prototype&&t.prototype.isPureReactComponent?!ln(a,l)||!ln(n,i):!0}function Ef(e,t,a,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,l),t.state!==e&&Xr.enqueueReplaceState(t,t.state,null)}function Wa(e,t){var a=t;if("ref"in t){a={};for(var l in t)l!=="ref"&&(a[l]=t[l])}if(e=e.defaultProps){a===t&&(a=R({},a));for(var n in e)a[n]===void 0&&(a[n]=e[n])}return a}function Mf(e){si(e)}function Rf(e){console.error(e)}function Tf(e){si(e)}function Oi(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function Af(e,t,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(n){setTimeout(function(){throw n})}}function Gr(e,t,a){return a=pa(a),a.tag=3,a.payload={element:null},a.callback=function(){Oi(e,t)},a}function wf(e){return e=pa(e),e.tag=3,e}function _f(e,t,a,l){var n=a.type.getDerivedStateFromError;if(typeof n=="function"){var i=l.value;e.payload=function(){return n(i)},e.callback=function(){Af(t,a,l)}}var r=a.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){Af(t,a,l),typeof n!="function"&&(Ra===null?Ra=new Set([this]):Ra.add(this));var d=l.stack;this.componentDidCatch(l.value,{componentStack:d!==null?d:""})})}function Dv(e,t,a,l,n){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=a.alternate,t!==null&&pl(t,a,n,!0),a=vt.current,a!==null){switch(a.tag){case 31:case 13:return wt===null?Vi():a.alternate===null&&De===0&&(De=3),a.flags&=-257,a.flags|=65536,a.lanes=n,l===bi?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([l]):t.add(l),hc(e,l,n)),!1;case 22:return a.flags|=65536,l===bi?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([l]):a.add(l)),hc(e,l,n)),!1}throw Error(c(435,a.tag))}return hc(e,l,n),Vi(),!1}if(ve)return t=vt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=n,l!==cr&&(e=Error(c(422),{cause:l}),rn(Mt(e,a)))):(l!==cr&&(t=Error(c(423),{cause:l}),rn(Mt(t,a))),e=e.current.alternate,e.flags|=65536,n&=-n,e.lanes|=n,l=Mt(l,a),n=Gr(e.stateNode,l,n),br(e,n),De!==4&&(De=2)),!1;var i=Error(c(520),{cause:l});if(i=Mt(i,a),An===null?An=[i]:An.push(i),De!==4&&(De=2),t===null)return!0;l=Mt(l,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=n&-n,a.lanes|=e,e=Gr(a.stateNode,l,e),br(a,e),!1;case 1:if(t=a.type,i=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||i!==null&&typeof i.componentDidCatch=="function"&&(Ra===null||!Ra.has(i))))return a.flags|=65536,n&=-n,a.lanes|=n,n=wf(n),_f(n,e,a,l),br(a,n),!1}a=a.return}while(a!==null);return!1}var Vr=Error(c(461)),Ge=!1;function Ie(e,t,a,l){t.child=e===null?No(t,null,a,l):Ja(t,e.child,a,l)}function Cf(e,t,a,l,n){a=a.render;var i=t.ref;if("ref"in l){var r={};for(var d in l)d!=="ref"&&(r[d]=l[d])}else r=l;return Va(t),l=Tr(e,t,a,r,i,n),d=Ar(),e!==null&&!Ge?(wr(e,t,n),It(e,t,n)):(ve&&d&&ur(t),t.flags|=1,Ie(e,t,l,n),t.child)}function zf(e,t,a,l,n){if(e===null){var i=a.type;return typeof i=="function"&&!lr(i)&&i.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=i,Nf(e,t,i,l,n)):(e=mi(a.type,null,l,t,t.mode,n),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!Ir(e,n)){var r=i.memoizedProps;if(a=a.compare,a=a!==null?a:ln,a(r,l)&&e.ref===t.ref)return It(e,t,n)}return t.flags|=1,e=Zt(i,l),e.ref=t.ref,e.return=t,t.child=e}function Nf(e,t,a,l,n){if(e!==null){var i=e.memoizedProps;if(ln(i,l)&&e.ref===t.ref)if(Ge=!1,t.pendingProps=l=i,Ir(e,n))(e.flags&131072)!==0&&(Ge=!0);else return t.lanes=e.lanes,It(e,t,n)}return Qr(e,t,a,l,n)}function Of(e,t,a,l){var n=l.children,i=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(i=i!==null?i.baseLanes|a:a,e!==null){for(l=t.child=e.child,n=0;l!==null;)n=n|l.lanes|l.childLanes,l=l.sibling;l=n&~i}else l=0,t.child=null;return Bf(e,t,i,a,l)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&pi(t,i!==null?i.cachePool:null),i!==null?Do(t,i):Sr(),Lo(t);else return l=t.lanes=536870912,Bf(e,t,i!==null?i.baseLanes|a:a,a,l)}else i!==null?(pi(t,i.cachePool),Do(t,i),xa(),t.memoizedState=null):(e!==null&&pi(t,null),Sr(),xa());return Ie(e,t,n,a),t.child}function bn(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Bf(e,t,a,l,n){var i=vr();return i=i===null?null:{parent:ke._currentValue,pool:i},t.memoizedState={baseLanes:a,cachePool:i},e!==null&&pi(t,null),Sr(),Lo(t),e!==null&&pl(e,t,l,!0),t.childLanes=n,null}function Bi(e,t){return t=Li({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Df(e,t,a){return Ja(t,e.child,null,a),e=Bi(t,t.pendingProps),e.flags|=2,yt(t),t.memoizedState=null,e}function Lv(e,t,a){var l=t.pendingProps,n=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(ve){if(l.mode==="hidden")return e=Bi(t,l),t.lanes=536870912,bn(null,e);if(Mr(t),(e=_e)?(e=Zd(e,At),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:da!==null?{id:Lt,overflow:jt}:null,retryLane:536870912,hydrationErrors:null},a=yo(e),a.return=t,t.child=a,We=t,_e=null)):e=null,e===null)throw ha(t);return t.lanes=536870912,null}return Bi(t,l)}var i=e.memoizedState;if(i!==null){var r=i.dehydrated;if(Mr(t),n)if(t.flags&256)t.flags&=-257,t=Df(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(c(558));else if(Ge||pl(e,t,a,!1),n=(a&e.childLanes)!==0,Ge||n){if(l=we,l!==null&&(r=Es(l,a),r!==0&&r!==i.retryLane))throw i.retryLane=r,Ya(e,r),st(l,e,r),Vr;Vi(),t=Df(e,t,a)}else e=i.treeContext,_e=_t(r.nextSibling),We=t,ve=!0,ma=null,At=!1,e!==null&&bo(t,e),t=Bi(t,l),t.flags|=4096;return t}return e=Zt(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Di(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(c(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function Qr(e,t,a,l,n){return Va(t),a=Tr(e,t,a,l,void 0,n),l=Ar(),e!==null&&!Ge?(wr(e,t,n),It(e,t,n)):(ve&&l&&ur(t),t.flags|=1,Ie(e,t,a,n),t.child)}function Lf(e,t,a,l,n,i){return Va(t),t.updateQueue=null,a=qo(t,l,a,n),jo(e),l=Ar(),e!==null&&!Ge?(wr(e,t,i),It(e,t,i)):(ve&&l&&ur(t),t.flags|=1,Ie(e,t,a,i),t.child)}function jf(e,t,a,l,n){if(Va(t),t.stateNode===null){var i=ml,r=a.contextType;typeof r=="object"&&r!==null&&(i=$e(r)),i=new a(l,i),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Xr,t.stateNode=i,i._reactInternals=t,i=t.stateNode,i.props=l,i.state=t.memoizedState,i.refs={},pr(t),r=a.contextType,i.context=typeof r=="object"&&r!==null?$e(r):ml,i.state=t.memoizedState,r=a.getDerivedStateFromProps,typeof r=="function"&&(kr(t,a,r,l),i.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(r=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),r!==i.state&&Xr.enqueueReplaceState(i,i.state,null),hn(t,l,i,n),mn(),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){i=t.stateNode;var d=t.memoizedProps,p=Wa(a,d);i.props=p;var A=i.context,N=a.contextType;r=ml,typeof N=="object"&&N!==null&&(r=$e(N));var D=a.getDerivedStateFromProps;N=typeof D=="function"||typeof i.getSnapshotBeforeUpdate=="function",d=t.pendingProps!==d,N||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(d||A!==r)&&Ef(t,i,l,r),ya=!1;var w=t.memoizedState;i.state=w,hn(t,l,i,n),mn(),A=t.memoizedState,d||w!==A||ya?(typeof D=="function"&&(kr(t,a,D,l),A=t.memoizedState),(p=ya||Sf(t,a,p,l,w,A,r))?(N||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=A),i.props=l,i.state=A,i.context=r,l=p):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{i=t.stateNode,gr(e,t),r=t.memoizedProps,N=Wa(a,r),i.props=N,D=t.pendingProps,w=i.context,A=a.contextType,p=ml,typeof A=="object"&&A!==null&&(p=$e(A)),d=a.getDerivedStateFromProps,(A=typeof d=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(r!==D||w!==p)&&Ef(t,i,l,p),ya=!1,w=t.memoizedState,i.state=w,hn(t,l,i,n),mn();var z=t.memoizedState;r!==D||w!==z||ya||e!==null&&e.dependencies!==null&&vi(e.dependencies)?(typeof d=="function"&&(kr(t,a,d,l),z=t.memoizedState),(N=ya||Sf(t,a,N,l,w,z,p)||e!==null&&e.dependencies!==null&&vi(e.dependencies))?(A||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(l,z,p),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(l,z,p)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||r===e.memoizedProps&&w===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&w===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=z),i.props=l,i.state=z,i.context=p,l=N):(typeof i.componentDidUpdate!="function"||r===e.memoizedProps&&w===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&w===e.memoizedState||(t.flags|=1024),l=!1)}return i=l,Di(e,t),l=(t.flags&128)!==0,i||l?(i=t.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:i.render(),t.flags|=1,e!==null&&l?(t.child=Ja(t,e.child,null,n),t.child=Ja(t,null,a,n)):Ie(e,t,a,n),t.memoizedState=i.state,e=t.child):e=It(e,t,n),e}function qf(e,t,a,l){return Xa(),t.flags|=256,Ie(e,t,a,l),t.child}var Zr={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Kr(e){return{baseLanes:e,cachePool:To()}}function Jr(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=gt),e}function Hf(e,t,a){var l=t.pendingProps,n=!1,i=(t.flags&128)!==0,r;if((r=i)||(r=e!==null&&e.memoizedState===null?!1:(qe.current&2)!==0),r&&(n=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if(ve){if(n?ba(t):xa(),(e=_e)?(e=Zd(e,At),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:da!==null?{id:Lt,overflow:jt}:null,retryLane:536870912,hydrationErrors:null},a=yo(e),a.return=t,t.child=a,We=t,_e=null)):e=null,e===null)throw ha(t);return zc(e)?t.lanes=32:t.lanes=536870912,null}var d=l.children;return l=l.fallback,n?(xa(),n=t.mode,d=Li({mode:"hidden",children:d},n),l=ka(l,n,a,null),d.return=t,l.return=t,d.sibling=l,t.child=d,l=t.child,l.memoizedState=Kr(a),l.childLanes=Jr(e,r,a),t.memoizedState=Zr,bn(null,l)):(ba(t),Fr(t,d))}var p=e.memoizedState;if(p!==null&&(d=p.dehydrated,d!==null)){if(i)t.flags&256?(ba(t),t.flags&=-257,t=Wr(e,t,a)):t.memoizedState!==null?(xa(),t.child=e.child,t.flags|=128,t=null):(xa(),d=l.fallback,n=t.mode,l=Li({mode:"visible",children:l.children},n),d=ka(d,n,a,null),d.flags|=2,l.return=t,d.return=t,l.sibling=d,t.child=l,Ja(t,e.child,null,a),l=t.child,l.memoizedState=Kr(a),l.childLanes=Jr(e,r,a),t.memoizedState=Zr,t=bn(null,l));else if(ba(t),zc(d)){if(r=d.nextSibling&&d.nextSibling.dataset,r)var A=r.dgst;r=A,l=Error(c(419)),l.stack="",l.digest=r,rn({value:l,source:null,stack:null}),t=Wr(e,t,a)}else if(Ge||pl(e,t,a,!1),r=(a&e.childLanes)!==0,Ge||r){if(r=we,r!==null&&(l=Es(r,a),l!==0&&l!==p.retryLane))throw p.retryLane=l,Ya(e,l),st(r,e,l),Vr;Cc(d)||Vi(),t=Wr(e,t,a)}else Cc(d)?(t.flags|=192,t.child=e.child,t=null):(e=p.treeContext,_e=_t(d.nextSibling),We=t,ve=!0,ma=null,At=!1,e!==null&&bo(t,e),t=Fr(t,l.children),t.flags|=4096);return t}return n?(xa(),d=l.fallback,n=t.mode,p=e.child,A=p.sibling,l=Zt(p,{mode:"hidden",children:l.children}),l.subtreeFlags=p.subtreeFlags&65011712,A!==null?d=Zt(A,d):(d=ka(d,n,a,null),d.flags|=2),d.return=t,l.return=t,l.sibling=d,t.child=l,bn(null,l),l=t.child,d=e.child.memoizedState,d===null?d=Kr(a):(n=d.cachePool,n!==null?(p=ke._currentValue,n=n.parent!==p?{parent:p,pool:p}:n):n=To(),d={baseLanes:d.baseLanes|a,cachePool:n}),l.memoizedState=d,l.childLanes=Jr(e,r,a),t.memoizedState=Zr,bn(e.child,l)):(ba(t),a=e.child,e=a.sibling,a=Zt(a,{mode:"visible",children:l.children}),a.return=t,a.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=a,t.memoizedState=null,a)}function Fr(e,t){return t=Li({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Li(e,t){return e=ht(22,e,null,t),e.lanes=0,e}function Wr(e,t,a){return Ja(t,e.child,null,a),e=Fr(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Uf(e,t,a){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),fr(e.return,t,a)}function $r(e,t,a,l,n,i){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:n,treeForkCount:i}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=l,r.tail=a,r.tailMode=n,r.treeForkCount=i)}function Yf(e,t,a){var l=t.pendingProps,n=l.revealOrder,i=l.tail;l=l.children;var r=qe.current,d=(r&2)!==0;if(d?(r=r&1|2,t.flags|=128):r&=1,V(qe,r),Ie(e,t,l,a),l=ve?un:0,!d&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Uf(e,a,t);else if(e.tag===19)Uf(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(n){case"forwards":for(a=t.child,n=null;a!==null;)e=a.alternate,e!==null&&Mi(e)===null&&(n=a),a=a.sibling;a=n,a===null?(n=t.child,t.child=null):(n=a.sibling,a.sibling=null),$r(t,!1,n,a,i,l);break;case"backwards":case"unstable_legacy-backwards":for(a=null,n=t.child,t.child=null;n!==null;){if(e=n.alternate,e!==null&&Mi(e)===null){t.child=n;break}e=n.sibling,n.sibling=a,a=n,n=e}$r(t,!0,a,null,i,l);break;case"together":$r(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function It(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),Ma|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(pl(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,a=Zt(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=Zt(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function Ir(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&vi(e)))}function jv(e,t,a){switch(t.tag){case 3:tt(t,t.stateNode.containerInfo),va(t,ke,e.memoizedState.cache),Xa();break;case 27:case 5:Vl(t);break;case 4:tt(t,t.stateNode.containerInfo);break;case 10:va(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Mr(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(ba(t),t.flags|=128,null):(a&t.child.childLanes)!==0?Hf(e,t,a):(ba(t),e=It(e,t,a),e!==null?e.sibling:null);ba(t);break;case 19:var n=(e.flags&128)!==0;if(l=(a&t.childLanes)!==0,l||(pl(e,t,a,!1),l=(a&t.childLanes)!==0),n){if(l)return Yf(e,t,a);t.flags|=128}if(n=t.memoizedState,n!==null&&(n.rendering=null,n.tail=null,n.lastEffect=null),V(qe,qe.current),l)break;return null;case 22:return t.lanes=0,Of(e,t,a,t.pendingProps);case 24:va(t,ke,e.memoizedState.cache)}return It(e,t,a)}function kf(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)Ge=!0;else{if(!Ir(e,a)&&(t.flags&128)===0)return Ge=!1,jv(e,t,a);Ge=(e.flags&131072)!==0}else Ge=!1,ve&&(t.flags&1048576)!==0&&go(t,un,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=Za(t.elementType),t.type=e,typeof e=="function")lr(e)?(l=Wa(e,l),t.tag=1,t=jf(null,t,e,l,a)):(t.tag=0,t=Qr(null,t,e,l,a));else{if(e!=null){var n=e.$$typeof;if(n===Z){t.tag=11,t=Cf(null,t,e,l,a);break e}else if(n===$){t.tag=14,t=zf(null,t,e,l,a);break e}}throw t=ce(e)||e,Error(c(306,t,""))}}return t;case 0:return Qr(e,t,t.type,t.pendingProps,a);case 1:return l=t.type,n=Wa(l,t.pendingProps),jf(e,t,l,n,a);case 3:e:{if(tt(t,t.stateNode.containerInfo),e===null)throw Error(c(387));l=t.pendingProps;var i=t.memoizedState;n=i.element,gr(e,t),hn(t,l,null,a);var r=t.memoizedState;if(l=r.cache,va(t,ke,l),l!==i.cache&&dr(t,[ke],a,!0),mn(),l=r.element,i.isDehydrated)if(i={element:l,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){t=qf(e,t,l,a);break e}else if(l!==n){n=Mt(Error(c(424)),t),rn(n),t=qf(e,t,l,a);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,_e=_t(e.firstChild),We=t,ve=!0,ma=null,At=!0,a=No(t,null,l,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Xa(),l===n){t=It(e,t,a);break e}Ie(e,t,l,a)}t=t.child}return t;case 26:return Di(e,t),e===null?(a=Id(t.type,null,t.pendingProps,null))?t.memoizedState=a:ve||(a=t.type,e=t.pendingProps,l=$i(oe.current).createElement(a),l[Fe]=t,l[lt]=e,Pe(l,a,e),Ke(l),t.stateNode=l):t.memoizedState=Id(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Vl(t),e===null&&ve&&(l=t.stateNode=Fd(t.type,t.pendingProps,oe.current),We=t,At=!0,n=_e,_a(t.type)?(Nc=n,_e=_t(l.firstChild)):_e=n),Ie(e,t,t.pendingProps.children,a),Di(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&ve&&((n=l=_e)&&(l=dy(l,t.type,t.pendingProps,At),l!==null?(t.stateNode=l,We=t,_e=_t(l.firstChild),At=!1,n=!0):n=!1),n||ha(t)),Vl(t),n=t.type,i=t.pendingProps,r=e!==null?e.memoizedProps:null,l=i.children,Ac(n,i)?l=null:r!==null&&Ac(n,r)&&(t.flags|=32),t.memoizedState!==null&&(n=Tr(e,t,wv,null,null,a),Dn._currentValue=n),Di(e,t),Ie(e,t,l,a),t.child;case 6:return e===null&&ve&&((e=a=_e)&&(a=my(a,t.pendingProps,At),a!==null?(t.stateNode=a,We=t,_e=null,e=!0):e=!1),e||ha(t)),null;case 13:return Hf(e,t,a);case 4:return tt(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=Ja(t,null,l,a):Ie(e,t,l,a),t.child;case 11:return Cf(e,t,t.type,t.pendingProps,a);case 7:return Ie(e,t,t.pendingProps,a),t.child;case 8:return Ie(e,t,t.pendingProps.children,a),t.child;case 12:return Ie(e,t,t.pendingProps.children,a),t.child;case 10:return l=t.pendingProps,va(t,t.type,l.value),Ie(e,t,l.children,a),t.child;case 9:return n=t.type._context,l=t.pendingProps.children,Va(t),n=$e(n),l=l(n),t.flags|=1,Ie(e,t,l,a),t.child;case 14:return zf(e,t,t.type,t.pendingProps,a);case 15:return Nf(e,t,t.type,t.pendingProps,a);case 19:return Yf(e,t,a);case 31:return Lv(e,t,a);case 22:return Of(e,t,a,t.pendingProps);case 24:return Va(t),l=$e(ke),e===null?(n=vr(),n===null&&(n=we,i=mr(),n.pooledCache=i,i.refCount++,i!==null&&(n.pooledCacheLanes|=a),n=i),t.memoizedState={parent:l,cache:n},pr(t),va(t,ke,n)):((e.lanes&a)!==0&&(gr(e,t),hn(t,null,null,a),mn()),n=e.memoizedState,i=t.memoizedState,n.parent!==l?(n={parent:l,cache:l},t.memoizedState=n,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=n),va(t,ke,l)):(l=i.cache,va(t,ke,l),l!==n.cache&&dr(t,[ke],a,!0))),Ie(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(c(156,t.tag))}function Pt(e){e.flags|=4}function Pr(e,t,a,l,n){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(n&335544128)===n)if(e.stateNode.complete)e.flags|=8192;else if(hd())e.flags|=8192;else throw Ka=bi,yr}else e.flags&=-16777217}function Xf(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!lm(t))if(hd())e.flags|=8192;else throw Ka=bi,yr}function ji(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?bs():536870912,e.lanes|=t,Cl|=t)}function xn(e,t){if(!ve)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Ce(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(t)for(var n=e.child;n!==null;)a|=n.lanes|n.childLanes,l|=n.subtreeFlags&65011712,l|=n.flags&65011712,n.return=e,n=n.sibling;else for(n=e.child;n!==null;)a|=n.lanes|n.childLanes,l|=n.subtreeFlags,l|=n.flags,n.return=e,n=n.sibling;return e.subtreeFlags|=l,e.childLanes=a,t}function qv(e,t,a){var l=t.pendingProps;switch(rr(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ce(t),null;case 1:return Ce(t),null;case 3:return a=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),Ft(ke),je(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(yl(t)?Pt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,sr())),Ce(t),null;case 26:var n=t.type,i=t.memoizedState;return e===null?(Pt(t),i!==null?(Ce(t),Xf(t,i)):(Ce(t),Pr(t,n,null,l,a))):i?i!==e.memoizedState?(Pt(t),Ce(t),Xf(t,i)):(Ce(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&Pt(t),Ce(t),Pr(t,n,e,l,a)),null;case 27:if(Kn(t),a=oe.current,n=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Pt(t);else{if(!l){if(t.stateNode===null)throw Error(c(166));return Ce(t),null}e=F.current,yl(t)?xo(t):(e=Fd(n,l,a),t.stateNode=e,Pt(t))}return Ce(t),null;case 5:if(Kn(t),n=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Pt(t);else{if(!l){if(t.stateNode===null)throw Error(c(166));return Ce(t),null}if(i=F.current,yl(t))xo(t);else{var r=$i(oe.current);switch(i){case 1:i=r.createElementNS("http://www.w3.org/2000/svg",n);break;case 2:i=r.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;default:switch(n){case"svg":i=r.createElementNS("http://www.w3.org/2000/svg",n);break;case"math":i=r.createElementNS("http://www.w3.org/1998/Math/MathML",n);break;case"script":i=r.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild);break;case"select":i=typeof l.is=="string"?r.createElement("select",{is:l.is}):r.createElement("select"),l.multiple?i.multiple=!0:l.size&&(i.size=l.size);break;default:i=typeof l.is=="string"?r.createElement(n,{is:l.is}):r.createElement(n)}}i[Fe]=t,i[lt]=l;e:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)i.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break e;for(;r.sibling===null;){if(r.return===null||r.return===t)break e;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=i;e:switch(Pe(i,n,l),n){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Pt(t)}}return Ce(t),Pr(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&Pt(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(c(166));if(e=oe.current,yl(t)){if(e=t.stateNode,a=t.memoizedProps,l=null,n=We,n!==null)switch(n.tag){case 27:case 5:l=n.memoizedProps}e[Fe]=t,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||Hd(e.nodeValue,a)),e||ha(t,!0)}else e=$i(e).createTextNode(l),e[Fe]=t,t.stateNode=e}return Ce(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(l=yl(t),a!==null){if(e===null){if(!l)throw Error(c(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(557));e[Fe]=t}else Xa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ce(t),e=!1}else a=sr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(yt(t),t):(yt(t),null);if((t.flags&128)!==0)throw Error(c(558))}return Ce(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(n=yl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!n)throw Error(c(318));if(n=t.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(c(317));n[Fe]=t}else Xa(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ce(t),n=!1}else n=sr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),n=!0;if(!n)return t.flags&256?(yt(t),t):(yt(t),null)}return yt(t),(t.flags&128)!==0?(t.lanes=a,t):(a=l!==null,e=e!==null&&e.memoizedState!==null,a&&(l=t.child,n=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(n=l.alternate.memoizedState.cachePool.pool),i=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(i=l.memoizedState.cachePool.pool),i!==n&&(l.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),ji(t,t.updateQueue),Ce(t),null);case 4:return je(),e===null&&Sc(t.stateNode.containerInfo),Ce(t),null;case 10:return Ft(t.type),Ce(t),null;case 19:if(B(qe),l=t.memoizedState,l===null)return Ce(t),null;if(n=(t.flags&128)!==0,i=l.rendering,i===null)if(n)xn(l,!1);else{if(De!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=Mi(e),i!==null){for(t.flags|=128,xn(l,!1),e=i.updateQueue,t.updateQueue=e,ji(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)vo(a,e),a=a.sibling;return V(qe,qe.current&1|2),ve&&Kt(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&ot()>ki&&(t.flags|=128,n=!0,xn(l,!1),t.lanes=4194304)}else{if(!n)if(e=Mi(i),e!==null){if(t.flags|=128,n=!0,e=e.updateQueue,t.updateQueue=e,ji(t,e),xn(l,!0),l.tail===null&&l.tailMode==="hidden"&&!i.alternate&&!ve)return Ce(t),null}else 2*ot()-l.renderingStartTime>ki&&a!==536870912&&(t.flags|=128,n=!0,xn(l,!1),t.lanes=4194304);l.isBackwards?(i.sibling=t.child,t.child=i):(e=l.last,e!==null?e.sibling=i:t.child=i,l.last=i)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=ot(),e.sibling=null,a=qe.current,V(qe,n?a&1|2:a&1),ve&&Kt(t,l.treeForkCount),e):(Ce(t),null);case 22:case 23:return yt(t),Er(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(a&536870912)!==0&&(t.flags&128)===0&&(Ce(t),t.subtreeFlags&6&&(t.flags|=8192)):Ce(t),a=t.updateQueue,a!==null&&ji(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==a&&(t.flags|=2048),e!==null&&B(Qa),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),Ft(ke),Ce(t),null;case 25:return null;case 30:return null}throw Error(c(156,t.tag))}function Hv(e,t){switch(rr(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ft(ke),je(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Kn(t),null;case 31:if(t.memoizedState!==null){if(yt(t),t.alternate===null)throw Error(c(340));Xa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(yt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));Xa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return B(qe),null;case 4:return je(),null;case 10:return Ft(t.type),null;case 22:case 23:return yt(t),Er(),e!==null&&B(Qa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Ft(ke),null;case 25:return null;default:return null}}function Gf(e,t){switch(rr(t),t.tag){case 3:Ft(ke),je();break;case 26:case 27:case 5:Kn(t);break;case 4:je();break;case 31:t.memoizedState!==null&&yt(t);break;case 13:yt(t);break;case 19:B(qe);break;case 10:Ft(t.type);break;case 22:case 23:yt(t),Er(),e!==null&&B(Qa);break;case 24:Ft(ke)}}function Sn(e,t){try{var a=t.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var n=l.next;a=n;do{if((a.tag&e)===e){l=void 0;var i=a.create,r=a.inst;l=i(),r.destroy=l}a=a.next}while(a!==n)}}catch(d){Me(t,t.return,d)}}function Sa(e,t,a){try{var l=t.updateQueue,n=l!==null?l.lastEffect:null;if(n!==null){var i=n.next;l=i;do{if((l.tag&e)===e){var r=l.inst,d=r.destroy;if(d!==void 0){r.destroy=void 0,n=t;var p=a,A=d;try{A()}catch(N){Me(n,p,N)}}}l=l.next}while(l!==i)}}catch(N){Me(t,t.return,N)}}function Vf(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{Bo(t,a)}catch(l){Me(e,e.return,l)}}}function Qf(e,t,a){a.props=Wa(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){Me(e,t,l)}}function En(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(n){Me(e,t,n)}}function qt(e,t){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(n){Me(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(n){Me(e,t,n)}else a.current=null}function Zf(e){var t=e.type,a=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(n){Me(e,e.return,n)}}function ec(e,t,a){try{var l=e.stateNode;uy(l,e.type,a,t),l[lt]=t}catch(n){Me(e,e.return,n)}}function Kf(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&_a(e.type)||e.tag===4}function tc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Kf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&_a(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ac(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=Vt));else if(l!==4&&(l===27&&_a(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(ac(e,t,a),e=e.sibling;e!==null;)ac(e,t,a),e=e.sibling}function qi(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(l!==4&&(l===27&&_a(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(qi(e,t,a),e=e.sibling;e!==null;)qi(e,t,a),e=e.sibling}function Jf(e){var t=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,n=t.attributes;n.length;)t.removeAttributeNode(n[0]);Pe(t,l,a),t[Fe]=e,t[lt]=a}catch(i){Me(e,e.return,i)}}var ea=!1,Ve=!1,lc=!1,Ff=typeof WeakSet=="function"?WeakSet:Set,Je=null;function Uv(e,t){if(e=e.containerInfo,Rc=nu,e=io(e),Wu(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var n=l.anchorOffset,i=l.focusNode;l=l.focusOffset;try{a.nodeType,i.nodeType}catch{a=null;break e}var r=0,d=-1,p=-1,A=0,N=0,D=e,w=null;t:for(;;){for(var z;D!==a||n!==0&&D.nodeType!==3||(d=r+n),D!==i||l!==0&&D.nodeType!==3||(p=r+l),D.nodeType===3&&(r+=D.nodeValue.length),(z=D.firstChild)!==null;)w=D,D=z;for(;;){if(D===e)break t;if(w===a&&++A===n&&(d=r),w===i&&++N===l&&(p=r),(z=D.nextSibling)!==null)break;D=w,w=D.parentNode}D=z}a=d===-1||p===-1?null:{start:d,end:p}}else a=null}a=a||{start:0,end:0}}else a=null;for(Tc={focusedElem:e,selectionRange:a},nu=!1,Je=t;Je!==null;)if(t=Je,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Je=e;else for(;Je!==null;){switch(t=Je,i=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)n=e[a],n.ref.impl=n.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&i!==null){e=void 0,a=t,n=i.memoizedProps,i=i.memoizedState,l=a.stateNode;try{var J=Wa(a.type,n);e=l.getSnapshotBeforeUpdate(J,i),l.__reactInternalSnapshotBeforeUpdate=e}catch(ee){Me(a,a.return,ee)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)_c(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":_c(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(c(163))}if(e=t.sibling,e!==null){e.return=t.return,Je=e;break}Je=t.return}}function Wf(e,t,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:aa(e,a),l&4&&Sn(5,a);break;case 1:if(aa(e,a),l&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(r){Me(a,a.return,r)}else{var n=Wa(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(n,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){Me(a,a.return,r)}}l&64&&Vf(a),l&512&&En(a,a.return);break;case 3:if(aa(e,a),l&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{Bo(e,t)}catch(r){Me(a,a.return,r)}}break;case 27:t===null&&l&4&&Jf(a);case 26:case 5:aa(e,a),t===null&&l&4&&Zf(a),l&512&&En(a,a.return);break;case 12:aa(e,a);break;case 31:aa(e,a),l&4&&Pf(e,a);break;case 13:aa(e,a),l&4&&ed(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=Jv.bind(null,a),hy(e,a))));break;case 22:if(l=a.memoizedState!==null||ea,!l){t=t!==null&&t.memoizedState!==null||Ve,n=ea;var i=Ve;ea=l,(Ve=t)&&!i?la(e,a,(a.subtreeFlags&8772)!==0):aa(e,a),ea=n,Ve=i}break;case 30:break;default:aa(e,a)}}function $f(e){var t=e.alternate;t!==null&&(e.alternate=null,$f(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Bu(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ze=null,it=!1;function ta(e,t,a){for(a=a.child;a!==null;)If(e,t,a),a=a.sibling}function If(e,t,a){if(ft&&typeof ft.onCommitFiberUnmount=="function")try{ft.onCommitFiberUnmount(Ql,a)}catch{}switch(a.tag){case 26:Ve||qt(a,t),ta(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Ve||qt(a,t);var l=ze,n=it;_a(a.type)&&(ze=a.stateNode,it=!1),ta(e,t,a),Nn(a.stateNode),ze=l,it=n;break;case 5:Ve||qt(a,t);case 6:if(l=ze,n=it,ze=null,ta(e,t,a),ze=l,it=n,ze!==null)if(it)try{(ze.nodeType===9?ze.body:ze.nodeName==="HTML"?ze.ownerDocument.body:ze).removeChild(a.stateNode)}catch(i){Me(a,t,i)}else try{ze.removeChild(a.stateNode)}catch(i){Me(a,t,i)}break;case 18:ze!==null&&(it?(e=ze,Vd(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),ql(e)):Vd(ze,a.stateNode));break;case 4:l=ze,n=it,ze=a.stateNode.containerInfo,it=!0,ta(e,t,a),ze=l,it=n;break;case 0:case 11:case 14:case 15:Sa(2,a,t),Ve||Sa(4,a,t),ta(e,t,a);break;case 1:Ve||(qt(a,t),l=a.stateNode,typeof l.componentWillUnmount=="function"&&Qf(a,t,l)),ta(e,t,a);break;case 21:ta(e,t,a);break;case 22:Ve=(l=Ve)||a.memoizedState!==null,ta(e,t,a),Ve=l;break;default:ta(e,t,a)}}function Pf(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ql(e)}catch(a){Me(t,t.return,a)}}}function ed(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ql(e)}catch(a){Me(t,t.return,a)}}function Yv(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Ff),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Ff),t;default:throw Error(c(435,e.tag))}}function Hi(e,t){var a=Yv(e);t.forEach(function(l){if(!a.has(l)){a.add(l);var n=Fv.bind(null,e,l);l.then(n,n)}})}function ut(e,t){var a=t.deletions;if(a!==null)for(var l=0;l<a.length;l++){var n=a[l],i=e,r=t,d=r;e:for(;d!==null;){switch(d.tag){case 27:if(_a(d.type)){ze=d.stateNode,it=!1;break e}break;case 5:ze=d.stateNode,it=!1;break e;case 3:case 4:ze=d.stateNode.containerInfo,it=!0;break e}d=d.return}if(ze===null)throw Error(c(160));If(i,r,n),ze=null,it=!1,i=n.alternate,i!==null&&(i.return=null),n.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)td(t,e),t=t.sibling}var Ot=null;function td(e,t){var a=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:ut(t,e),rt(e),l&4&&(Sa(3,e,e.return),Sn(3,e),Sa(5,e,e.return));break;case 1:ut(t,e),rt(e),l&512&&(Ve||a===null||qt(a,a.return)),l&64&&ea&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var n=Ot;if(ut(t,e),rt(e),l&512&&(Ve||a===null||qt(a,a.return)),l&4){var i=a!==null?a.memoizedState:null;if(l=e.memoizedState,a===null)if(l===null)if(e.stateNode===null){e:{l=e.type,a=e.memoizedProps,n=n.ownerDocument||n;t:switch(l){case"title":i=n.getElementsByTagName("title")[0],(!i||i[Jl]||i[Fe]||i.namespaceURI==="http://www.w3.org/2000/svg"||i.hasAttribute("itemprop"))&&(i=n.createElement(l),n.head.insertBefore(i,n.querySelector("head > title"))),Pe(i,l,a),i[Fe]=e,Ke(i),l=i;break e;case"link":var r=tm("link","href",n).get(l+(a.href||""));if(r){for(var d=0;d<r.length;d++)if(i=r[d],i.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&i.getAttribute("rel")===(a.rel==null?null:a.rel)&&i.getAttribute("title")===(a.title==null?null:a.title)&&i.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){r.splice(d,1);break t}}i=n.createElement(l),Pe(i,l,a),n.head.appendChild(i);break;case"meta":if(r=tm("meta","content",n).get(l+(a.content||""))){for(d=0;d<r.length;d++)if(i=r[d],i.getAttribute("content")===(a.content==null?null:""+a.content)&&i.getAttribute("name")===(a.name==null?null:a.name)&&i.getAttribute("property")===(a.property==null?null:a.property)&&i.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&i.getAttribute("charset")===(a.charSet==null?null:a.charSet)){r.splice(d,1);break t}}i=n.createElement(l),Pe(i,l,a),n.head.appendChild(i);break;default:throw Error(c(468,l))}i[Fe]=e,Ke(i),l=i}e.stateNode=l}else am(n,e.type,e.stateNode);else e.stateNode=em(n,l,e.memoizedProps);else i!==l?(i===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):i.count--,l===null?am(n,e.type,e.stateNode):em(n,l,e.memoizedProps)):l===null&&e.stateNode!==null&&ec(e,e.memoizedProps,a.memoizedProps)}break;case 27:ut(t,e),rt(e),l&512&&(Ve||a===null||qt(a,a.return)),a!==null&&l&4&&ec(e,e.memoizedProps,a.memoizedProps);break;case 5:if(ut(t,e),rt(e),l&512&&(Ve||a===null||qt(a,a.return)),e.flags&32){n=e.stateNode;try{ul(n,"")}catch(J){Me(e,e.return,J)}}l&4&&e.stateNode!=null&&(n=e.memoizedProps,ec(e,n,a!==null?a.memoizedProps:n)),l&1024&&(lc=!0);break;case 6:if(ut(t,e),rt(e),l&4){if(e.stateNode===null)throw Error(c(162));l=e.memoizedProps,a=e.stateNode;try{a.nodeValue=l}catch(J){Me(e,e.return,J)}}break;case 3:if(eu=null,n=Ot,Ot=Ii(t.containerInfo),ut(t,e),Ot=n,rt(e),l&4&&a!==null&&a.memoizedState.isDehydrated)try{ql(t.containerInfo)}catch(J){Me(e,e.return,J)}lc&&(lc=!1,ad(e));break;case 4:l=Ot,Ot=Ii(e.stateNode.containerInfo),ut(t,e),rt(e),Ot=l;break;case 12:ut(t,e),rt(e);break;case 31:ut(t,e),rt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Hi(e,l)));break;case 13:ut(t,e),rt(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Yi=ot()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Hi(e,l)));break;case 22:n=e.memoizedState!==null;var p=a!==null&&a.memoizedState!==null,A=ea,N=Ve;if(ea=A||n,Ve=N||p,ut(t,e),Ve=N,ea=A,rt(e),l&8192)e:for(t=e.stateNode,t._visibility=n?t._visibility&-2:t._visibility|1,n&&(a===null||p||ea||Ve||$a(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){p=a=t;try{if(i=p.stateNode,n)r=i.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{d=p.stateNode;var D=p.memoizedProps.style,w=D!=null&&D.hasOwnProperty("display")?D.display:null;d.style.display=w==null||typeof w=="boolean"?"":(""+w).trim()}}catch(J){Me(p,p.return,J)}}}else if(t.tag===6){if(a===null){p=t;try{p.stateNode.nodeValue=n?"":p.memoizedProps}catch(J){Me(p,p.return,J)}}}else if(t.tag===18){if(a===null){p=t;try{var z=p.stateNode;n?Qd(z,!0):Qd(p.stateNode,!1)}catch(J){Me(p,p.return,J)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,Hi(e,a))));break;case 19:ut(t,e),rt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Hi(e,l)));break;case 30:break;case 21:break;default:ut(t,e),rt(e)}}function rt(e){var t=e.flags;if(t&2){try{for(var a,l=e.return;l!==null;){if(Kf(l)){a=l;break}l=l.return}if(a==null)throw Error(c(160));switch(a.tag){case 27:var n=a.stateNode,i=tc(e);qi(e,i,n);break;case 5:var r=a.stateNode;a.flags&32&&(ul(r,""),a.flags&=-33);var d=tc(e);qi(e,d,r);break;case 3:case 4:var p=a.stateNode.containerInfo,A=tc(e);ac(e,A,p);break;default:throw Error(c(161))}}catch(N){Me(e,e.return,N)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function ad(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;ad(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function aa(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Wf(e,t.alternate,t),t=t.sibling}function $a(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Sa(4,t,t.return),$a(t);break;case 1:qt(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Qf(t,t.return,a),$a(t);break;case 27:Nn(t.stateNode);case 26:case 5:qt(t,t.return),$a(t);break;case 22:t.memoizedState===null&&$a(t);break;case 30:$a(t);break;default:$a(t)}e=e.sibling}}function la(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,n=e,i=t,r=i.flags;switch(i.tag){case 0:case 11:case 15:la(n,i,a),Sn(4,i);break;case 1:if(la(n,i,a),l=i,n=l.stateNode,typeof n.componentDidMount=="function")try{n.componentDidMount()}catch(A){Me(l,l.return,A)}if(l=i,n=l.updateQueue,n!==null){var d=l.stateNode;try{var p=n.shared.hiddenCallbacks;if(p!==null)for(n.shared.hiddenCallbacks=null,n=0;n<p.length;n++)Oo(p[n],d)}catch(A){Me(l,l.return,A)}}a&&r&64&&Vf(i),En(i,i.return);break;case 27:Jf(i);case 26:case 5:la(n,i,a),a&&l===null&&r&4&&Zf(i),En(i,i.return);break;case 12:la(n,i,a);break;case 31:la(n,i,a),a&&r&4&&Pf(n,i);break;case 13:la(n,i,a),a&&r&4&&ed(n,i);break;case 22:i.memoizedState===null&&la(n,i,a),En(i,i.return);break;case 30:break;default:la(n,i,a)}t=t.sibling}}function nc(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&cn(a))}function ic(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&cn(e))}function Bt(e,t,a,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)ld(e,t,a,l),t=t.sibling}function ld(e,t,a,l){var n=t.flags;switch(t.tag){case 0:case 11:case 15:Bt(e,t,a,l),n&2048&&Sn(9,t);break;case 1:Bt(e,t,a,l);break;case 3:Bt(e,t,a,l),n&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&cn(e)));break;case 12:if(n&2048){Bt(e,t,a,l),e=t.stateNode;try{var i=t.memoizedProps,r=i.id,d=i.onPostCommit;typeof d=="function"&&d(r,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(p){Me(t,t.return,p)}}else Bt(e,t,a,l);break;case 31:Bt(e,t,a,l);break;case 13:Bt(e,t,a,l);break;case 23:break;case 22:i=t.stateNode,r=t.alternate,t.memoizedState!==null?i._visibility&2?Bt(e,t,a,l):Mn(e,t):i._visibility&2?Bt(e,t,a,l):(i._visibility|=2,Al(e,t,a,l,(t.subtreeFlags&10256)!==0||!1)),n&2048&&nc(r,t);break;case 24:Bt(e,t,a,l),n&2048&&ic(t.alternate,t);break;default:Bt(e,t,a,l)}}function Al(e,t,a,l,n){for(n=n&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var i=e,r=t,d=a,p=l,A=r.flags;switch(r.tag){case 0:case 11:case 15:Al(i,r,d,p,n),Sn(8,r);break;case 23:break;case 22:var N=r.stateNode;r.memoizedState!==null?N._visibility&2?Al(i,r,d,p,n):Mn(i,r):(N._visibility|=2,Al(i,r,d,p,n)),n&&A&2048&&nc(r.alternate,r);break;case 24:Al(i,r,d,p,n),n&&A&2048&&ic(r.alternate,r);break;default:Al(i,r,d,p,n)}t=t.sibling}}function Mn(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,l=t,n=l.flags;switch(l.tag){case 22:Mn(a,l),n&2048&&nc(l.alternate,l);break;case 24:Mn(a,l),n&2048&&ic(l.alternate,l);break;default:Mn(a,l)}t=t.sibling}}var Rn=8192;function wl(e,t,a){if(e.subtreeFlags&Rn)for(e=e.child;e!==null;)nd(e,t,a),e=e.sibling}function nd(e,t,a){switch(e.tag){case 26:wl(e,t,a),e.flags&Rn&&e.memoizedState!==null&&Ay(a,Ot,e.memoizedState,e.memoizedProps);break;case 5:wl(e,t,a);break;case 3:case 4:var l=Ot;Ot=Ii(e.stateNode.containerInfo),wl(e,t,a),Ot=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=Rn,Rn=16777216,wl(e,t,a),Rn=l):wl(e,t,a));break;default:wl(e,t,a)}}function id(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Tn(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Je=l,rd(l,e)}id(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)ud(e),e=e.sibling}function ud(e){switch(e.tag){case 0:case 11:case 15:Tn(e),e.flags&2048&&Sa(9,e,e.return);break;case 3:Tn(e);break;case 12:Tn(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Ui(e)):Tn(e);break;default:Tn(e)}}function Ui(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Je=l,rd(l,e)}id(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Sa(8,t,t.return),Ui(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,Ui(t));break;default:Ui(t)}e=e.sibling}}function rd(e,t){for(;Je!==null;){var a=Je;switch(a.tag){case 0:case 11:case 15:Sa(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:cn(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,Je=l;else e:for(a=e;Je!==null;){l=Je;var n=l.sibling,i=l.return;if($f(l),l===a){Je=null;break e}if(n!==null){n.return=i,Je=n;break e}Je=i}}}var kv={getCacheForType:function(e){var t=$e(ke),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return $e(ke).controller.signal}},Xv=typeof WeakMap=="function"?WeakMap:Map,be=0,we=null,fe=null,me=0,Ee=0,pt=null,Ea=!1,_l=!1,uc=!1,na=0,De=0,Ma=0,Ia=0,rc=0,gt=0,Cl=0,An=null,ct=null,cc=!1,Yi=0,cd=0,ki=1/0,Xi=null,Ra=null,Ze=0,Ta=null,zl=null,ia=0,sc=0,oc=null,sd=null,wn=0,fc=null;function bt(){return(be&2)!==0&&me!==0?me&-me:C.T!==null?pc():Ms()}function od(){if(gt===0)if((me&536870912)===0||ve){var e=Wn;Wn<<=1,(Wn&3932160)===0&&(Wn=262144),gt=e}else gt=536870912;return e=vt.current,e!==null&&(e.flags|=32),gt}function st(e,t,a){(e===we&&(Ee===2||Ee===9)||e.cancelPendingCommit!==null)&&(Nl(e,0),Aa(e,me,gt,!1)),Kl(e,a),((be&2)===0||e!==we)&&(e===we&&((be&2)===0&&(Ia|=a),De===4&&Aa(e,me,gt,!1)),Ht(e))}function fd(e,t,a){if((be&6)!==0)throw Error(c(327));var l=!a&&(t&127)===0&&(t&e.expiredLanes)===0||Zl(e,t),n=l?Qv(e,t):mc(e,t,!0),i=l;do{if(n===0){_l&&!l&&Aa(e,t,0,!1);break}else{if(a=e.current.alternate,i&&!Gv(a)){n=mc(e,t,!1),i=!1;continue}if(n===2){if(i=t,e.errorRecoveryDisabledLanes&i)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;e:{var d=e;n=An;var p=d.current.memoizedState.isDehydrated;if(p&&(Nl(d,r).flags|=256),r=mc(d,r,!1),r!==2){if(uc&&!p){d.errorRecoveryDisabledLanes|=i,Ia|=i,n=4;break e}i=ct,ct=n,i!==null&&(ct===null?ct=i:ct.push.apply(ct,i))}n=r}if(i=!1,n!==2)continue}}if(n===1){Nl(e,0),Aa(e,t,0,!0);break}e:{switch(l=e,i=n,i){case 0:case 1:throw Error(c(345));case 4:if((t&4194048)!==t)break;case 6:Aa(l,t,gt,!Ea);break e;case 2:ct=null;break;case 3:case 5:break;default:throw Error(c(329))}if((t&62914560)===t&&(n=Yi+300-ot(),10<n)){if(Aa(l,t,gt,!Ea),In(l,0,!0)!==0)break e;ia=t,l.timeoutHandle=Xd(dd.bind(null,l,a,ct,Xi,cc,t,gt,Ia,Cl,Ea,i,"Throttled",-0,0),n);break e}dd(l,a,ct,Xi,cc,t,gt,Ia,Cl,Ea,i,null,-0,0)}}break}while(!0);Ht(e)}function dd(e,t,a,l,n,i,r,d,p,A,N,D,w,z){if(e.timeoutHandle=-1,D=t.subtreeFlags,D&8192||(D&16785408)===16785408){D={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Vt},nd(t,i,D);var J=(i&62914560)===i?Yi-ot():(i&4194048)===i?cd-ot():0;if(J=wy(D,J),J!==null){ia=i,e.cancelPendingCommit=J(xd.bind(null,e,t,i,a,l,n,r,d,p,N,D,null,w,z)),Aa(e,i,r,!A);return}}xd(e,t,i,a,l,n,r,d,p)}function Gv(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var n=a[l],i=n.getSnapshot;n=n.value;try{if(!mt(i(),n))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Aa(e,t,a,l){t&=~rc,t&=~Ia,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var n=t;0<n;){var i=31-dt(n),r=1<<i;l[i]=-1,n&=~r}a!==0&&xs(e,a,t)}function Gi(){return(be&6)===0?(_n(0),!1):!0}function dc(){if(fe!==null){if(Ee===0)var e=fe.return;else e=fe,Jt=Ga=null,_r(e),Sl=null,on=0,e=fe;for(;e!==null;)Gf(e.alternate,e),e=e.return;fe=null}}function Nl(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,sy(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ia=0,dc(),we=e,fe=a=Zt(e.current,null),me=t,Ee=0,pt=null,Ea=!1,_l=Zl(e,t),uc=!1,Cl=gt=rc=Ia=Ma=De=0,ct=An=null,cc=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var n=31-dt(l),i=1<<n;t|=e[n],l&=~i}return na=t,oi(),a}function md(e,t){ne=null,C.H=gn,t===xl||t===gi?(t=_o(),Ee=3):t===yr?(t=_o(),Ee=4):Ee=t===Vr?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,pt=t,fe===null&&(De=1,Oi(e,Mt(t,e.current)))}function hd(){var e=vt.current;return e===null?!0:(me&4194048)===me?wt===null:(me&62914560)===me||(me&536870912)!==0?e===wt:!1}function vd(){var e=C.H;return C.H=gn,e===null?gn:e}function yd(){var e=C.A;return C.A=kv,e}function Vi(){De=4,Ea||(me&4194048)!==me&&vt.current!==null||(_l=!0),(Ma&134217727)===0&&(Ia&134217727)===0||we===null||Aa(we,me,gt,!1)}function mc(e,t,a){var l=be;be|=2;var n=vd(),i=yd();(we!==e||me!==t)&&(Xi=null,Nl(e,t)),t=!1;var r=De;e:do try{if(Ee!==0&&fe!==null){var d=fe,p=pt;switch(Ee){case 8:dc(),r=6;break e;case 3:case 2:case 9:case 6:vt.current===null&&(t=!0);var A=Ee;if(Ee=0,pt=null,Ol(e,d,p,A),a&&_l){r=0;break e}break;default:A=Ee,Ee=0,pt=null,Ol(e,d,p,A)}}Vv(),r=De;break}catch(N){md(e,N)}while(!0);return t&&e.shellSuspendCounter++,Jt=Ga=null,be=l,C.H=n,C.A=i,fe===null&&(we=null,me=0,oi()),r}function Vv(){for(;fe!==null;)pd(fe)}function Qv(e,t){var a=be;be|=2;var l=vd(),n=yd();we!==e||me!==t?(Xi=null,ki=ot()+500,Nl(e,t)):_l=Zl(e,t);e:do try{if(Ee!==0&&fe!==null){t=fe;var i=pt;t:switch(Ee){case 1:Ee=0,pt=null,Ol(e,t,i,1);break;case 2:case 9:if(Ao(i)){Ee=0,pt=null,gd(t);break}t=function(){Ee!==2&&Ee!==9||we!==e||(Ee=7),Ht(e)},i.then(t,t);break e;case 3:Ee=7;break e;case 4:Ee=5;break e;case 7:Ao(i)?(Ee=0,pt=null,gd(t)):(Ee=0,pt=null,Ol(e,t,i,7));break;case 5:var r=null;switch(fe.tag){case 26:r=fe.memoizedState;case 5:case 27:var d=fe;if(r?lm(r):d.stateNode.complete){Ee=0,pt=null;var p=d.sibling;if(p!==null)fe=p;else{var A=d.return;A!==null?(fe=A,Qi(A)):fe=null}break t}}Ee=0,pt=null,Ol(e,t,i,5);break;case 6:Ee=0,pt=null,Ol(e,t,i,6);break;case 8:dc(),De=6;break e;default:throw Error(c(462))}}Zv();break}catch(N){md(e,N)}while(!0);return Jt=Ga=null,C.H=l,C.A=n,be=a,fe!==null?0:(we=null,me=0,oi(),De)}function Zv(){for(;fe!==null&&!vh();)pd(fe)}function pd(e){var t=kf(e.alternate,e,na);e.memoizedProps=e.pendingProps,t===null?Qi(e):fe=t}function gd(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=Lf(a,t,t.pendingProps,t.type,void 0,me);break;case 11:t=Lf(a,t,t.pendingProps,t.type.render,t.ref,me);break;case 5:_r(t);default:Gf(a,t),t=fe=vo(t,na),t=kf(a,t,na)}e.memoizedProps=e.pendingProps,t===null?Qi(e):fe=t}function Ol(e,t,a,l){Jt=Ga=null,_r(t),Sl=null,on=0;var n=t.return;try{if(Dv(e,n,t,a,me)){De=1,Oi(e,Mt(a,e.current)),fe=null;return}}catch(i){if(n!==null)throw fe=n,i;De=1,Oi(e,Mt(a,e.current)),fe=null;return}t.flags&32768?(ve||l===1?e=!0:_l||(me&536870912)!==0?e=!1:(Ea=e=!0,(l===2||l===9||l===3||l===6)&&(l=vt.current,l!==null&&l.tag===13&&(l.flags|=16384))),bd(t,e)):Qi(t)}function Qi(e){var t=e;do{if((t.flags&32768)!==0){bd(t,Ea);return}e=t.return;var a=qv(t.alternate,t,na);if(a!==null){fe=a;return}if(t=t.sibling,t!==null){fe=t;return}fe=t=e}while(t!==null);De===0&&(De=5)}function bd(e,t){do{var a=Hv(e.alternate,e);if(a!==null){a.flags&=32767,fe=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){fe=e;return}fe=e=a}while(e!==null);De=6,fe=null}function xd(e,t,a,l,n,i,r,d,p){e.cancelPendingCommit=null;do Zi();while(Ze!==0);if((be&6)!==0)throw Error(c(327));if(t!==null){if(t===e.current)throw Error(c(177));if(i=t.lanes|t.childLanes,i|=tr,Th(e,a,i,r,d,p),e===we&&(fe=we=null,me=0),zl=t,Ta=e,ia=a,sc=i,oc=n,sd=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Wv(Jn,function(){return Td(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=C.T,C.T=null,n=k.p,k.p=2,r=be,be|=4;try{Uv(e,t,a)}finally{be=r,k.p=n,C.T=l}}Ze=1,Sd(),Ed(),Md()}}function Sd(){if(Ze===1){Ze=0;var e=Ta,t=zl,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=C.T,C.T=null;var l=k.p;k.p=2;var n=be;be|=4;try{td(t,e);var i=Tc,r=io(e.containerInfo),d=i.focusedElem,p=i.selectionRange;if(r!==d&&d&&d.ownerDocument&&no(d.ownerDocument.documentElement,d)){if(p!==null&&Wu(d)){var A=p.start,N=p.end;if(N===void 0&&(N=A),"selectionStart"in d)d.selectionStart=A,d.selectionEnd=Math.min(N,d.value.length);else{var D=d.ownerDocument||document,w=D&&D.defaultView||window;if(w.getSelection){var z=w.getSelection(),J=d.textContent.length,ee=Math.min(p.start,J),Ae=p.end===void 0?ee:Math.min(p.end,J);!z.extend&&ee>Ae&&(r=Ae,Ae=ee,ee=r);var E=lo(d,ee),x=lo(d,Ae);if(E&&x&&(z.rangeCount!==1||z.anchorNode!==E.node||z.anchorOffset!==E.offset||z.focusNode!==x.node||z.focusOffset!==x.offset)){var T=D.createRange();T.setStart(E.node,E.offset),z.removeAllRanges(),ee>Ae?(z.addRange(T),z.extend(x.node,x.offset)):(T.setEnd(x.node,x.offset),z.addRange(T))}}}}for(D=[],z=d;z=z.parentNode;)z.nodeType===1&&D.push({element:z,left:z.scrollLeft,top:z.scrollTop});for(typeof d.focus=="function"&&d.focus(),d=0;d<D.length;d++){var O=D[d];O.element.scrollLeft=O.left,O.element.scrollTop=O.top}}nu=!!Rc,Tc=Rc=null}finally{be=n,k.p=l,C.T=a}}e.current=t,Ze=2}}function Ed(){if(Ze===2){Ze=0;var e=Ta,t=zl,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=C.T,C.T=null;var l=k.p;k.p=2;var n=be;be|=4;try{Wf(e,t.alternate,t)}finally{be=n,k.p=l,C.T=a}}Ze=3}}function Md(){if(Ze===4||Ze===3){Ze=0,yh();var e=Ta,t=zl,a=ia,l=sd;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Ze=5:(Ze=0,zl=Ta=null,Rd(e,e.pendingLanes));var n=e.pendingLanes;if(n===0&&(Ra=null),Nu(a),t=t.stateNode,ft&&typeof ft.onCommitFiberRoot=="function")try{ft.onCommitFiberRoot(Ql,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=C.T,n=k.p,k.p=2,C.T=null;try{for(var i=e.onRecoverableError,r=0;r<l.length;r++){var d=l[r];i(d.value,{componentStack:d.stack})}}finally{C.T=t,k.p=n}}(ia&3)!==0&&Zi(),Ht(e),n=e.pendingLanes,(a&261930)!==0&&(n&42)!==0?e===fc?wn++:(wn=0,fc=e):wn=0,_n(0)}}function Rd(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,cn(t)))}function Zi(){return Sd(),Ed(),Md(),Td()}function Td(){if(Ze!==5)return!1;var e=Ta,t=sc;sc=0;var a=Nu(ia),l=C.T,n=k.p;try{k.p=32>a?32:a,C.T=null,a=oc,oc=null;var i=Ta,r=ia;if(Ze=0,zl=Ta=null,ia=0,(be&6)!==0)throw Error(c(331));var d=be;if(be|=4,ud(i.current),ld(i,i.current,r,a),be=d,_n(0,!1),ft&&typeof ft.onPostCommitFiberRoot=="function")try{ft.onPostCommitFiberRoot(Ql,i)}catch{}return!0}finally{k.p=n,C.T=l,Rd(e,t)}}function Ad(e,t,a){t=Mt(a,t),t=Gr(e.stateNode,t,2),e=ga(e,t,2),e!==null&&(Kl(e,2),Ht(e))}function Me(e,t,a){if(e.tag===3)Ad(e,e,a);else for(;t!==null;){if(t.tag===3){Ad(t,e,a);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Ra===null||!Ra.has(l))){e=Mt(a,e),a=wf(2),l=ga(t,a,2),l!==null&&(_f(a,l,t,e),Kl(l,2),Ht(l));break}}t=t.return}}function hc(e,t,a){var l=e.pingCache;if(l===null){l=e.pingCache=new Xv;var n=new Set;l.set(t,n)}else n=l.get(t),n===void 0&&(n=new Set,l.set(t,n));n.has(a)||(uc=!0,n.add(a),e=Kv.bind(null,e,t,a),t.then(e,e))}function Kv(e,t,a){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,we===e&&(me&a)===a&&(De===4||De===3&&(me&62914560)===me&&300>ot()-Yi?(be&2)===0&&Nl(e,0):rc|=a,Cl===me&&(Cl=0)),Ht(e)}function wd(e,t){t===0&&(t=bs()),e=Ya(e,t),e!==null&&(Kl(e,t),Ht(e))}function Jv(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),wd(e,a)}function Fv(e,t){var a=0;switch(e.tag){case 31:case 13:var l=e.stateNode,n=e.memoizedState;n!==null&&(a=n.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(c(314))}l!==null&&l.delete(t),wd(e,a)}function Wv(e,t){return wu(e,t)}var Ki=null,Bl=null,vc=!1,Ji=!1,yc=!1,wa=0;function Ht(e){e!==Bl&&e.next===null&&(Bl===null?Ki=Bl=e:Bl=Bl.next=e),Ji=!0,vc||(vc=!0,Iv())}function _n(e,t){if(!yc&&Ji){yc=!0;do for(var a=!1,l=Ki;l!==null;){if(e!==0){var n=l.pendingLanes;if(n===0)var i=0;else{var r=l.suspendedLanes,d=l.pingedLanes;i=(1<<31-dt(42|e)+1)-1,i&=n&~(r&~d),i=i&201326741?i&201326741|1:i?i|2:0}i!==0&&(a=!0,Nd(l,i))}else i=me,i=In(l,l===we?i:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(i&3)===0||Zl(l,i)||(a=!0,Nd(l,i));l=l.next}while(a);yc=!1}}function $v(){_d()}function _d(){Ji=vc=!1;var e=0;wa!==0&&cy()&&(e=wa);for(var t=ot(),a=null,l=Ki;l!==null;){var n=l.next,i=Cd(l,t);i===0?(l.next=null,a===null?Ki=n:a.next=n,n===null&&(Bl=a)):(a=l,(e!==0||(i&3)!==0)&&(Ji=!0)),l=n}Ze!==0&&Ze!==5||_n(e),wa!==0&&(wa=0)}function Cd(e,t){for(var a=e.suspendedLanes,l=e.pingedLanes,n=e.expirationTimes,i=e.pendingLanes&-62914561;0<i;){var r=31-dt(i),d=1<<r,p=n[r];p===-1?((d&a)===0||(d&l)!==0)&&(n[r]=Rh(d,t)):p<=t&&(e.expiredLanes|=d),i&=~d}if(t=we,a=me,a=In(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===t&&(Ee===2||Ee===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&_u(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Zl(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(l!==null&&_u(l),Nu(a)){case 2:case 8:a=ps;break;case 32:a=Jn;break;case 268435456:a=gs;break;default:a=Jn}return l=zd.bind(null,e),a=wu(a,l),e.callbackPriority=t,e.callbackNode=a,t}return l!==null&&l!==null&&_u(l),e.callbackPriority=2,e.callbackNode=null,2}function zd(e,t){if(Ze!==0&&Ze!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Zi()&&e.callbackNode!==a)return null;var l=me;return l=In(e,e===we?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(fd(e,l,t),Cd(e,ot()),e.callbackNode!=null&&e.callbackNode===a?zd.bind(null,e):null)}function Nd(e,t){if(Zi())return null;fd(e,t,!0)}function Iv(){oy(function(){(be&6)!==0?wu(ys,$v):_d()})}function pc(){if(wa===0){var e=gl;e===0&&(e=Fn,Fn<<=1,(Fn&261888)===0&&(Fn=256)),wa=e}return wa}function Od(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:ai(""+e)}function Bd(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function Pv(e,t,a,l,n){if(t==="submit"&&a&&a.stateNode===n){var i=Od((n[lt]||null).action),r=l.submitter;r&&(t=(t=r[lt]||null)?Od(t.formAction):r.getAttribute("formAction"),t!==null&&(i=t,r=null));var d=new ui("action","action",null,l,n);e.push({event:d,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(wa!==0){var p=r?Bd(n,r):new FormData(n);qr(a,{pending:!0,data:p,method:n.method,action:i},null,p)}}else typeof i=="function"&&(d.preventDefault(),p=r?Bd(n,r):new FormData(n),qr(a,{pending:!0,data:p,method:n.method,action:i},i,p))},currentTarget:n}]})}}for(var gc=0;gc<er.length;gc++){var bc=er[gc],ey=bc.toLowerCase(),ty=bc[0].toUpperCase()+bc.slice(1);Nt(ey,"on"+ty)}Nt(co,"onAnimationEnd"),Nt(so,"onAnimationIteration"),Nt(oo,"onAnimationStart"),Nt("dblclick","onDoubleClick"),Nt("focusin","onFocus"),Nt("focusout","onBlur"),Nt(pv,"onTransitionRun"),Nt(gv,"onTransitionStart"),Nt(bv,"onTransitionCancel"),Nt(fo,"onTransitionEnd"),nl("onMouseEnter",["mouseout","mouseover"]),nl("onMouseLeave",["mouseout","mouseover"]),nl("onPointerEnter",["pointerout","pointerover"]),nl("onPointerLeave",["pointerout","pointerover"]),ja("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),ja("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),ja("onBeforeInput",["compositionend","keypress","textInput","paste"]),ja("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),ja("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),ja("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Cn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ay=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Cn));function Dd(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],n=l.event;l=l.listeners;e:{var i=void 0;if(t)for(var r=l.length-1;0<=r;r--){var d=l[r],p=d.instance,A=d.currentTarget;if(d=d.listener,p!==i&&n.isPropagationStopped())break e;i=d,n.currentTarget=A;try{i(n)}catch(N){si(N)}n.currentTarget=null,i=p}else for(r=0;r<l.length;r++){if(d=l[r],p=d.instance,A=d.currentTarget,d=d.listener,p!==i&&n.isPropagationStopped())break e;i=d,n.currentTarget=A;try{i(n)}catch(N){si(N)}n.currentTarget=null,i=p}}}}function de(e,t){var a=t[Ou];a===void 0&&(a=t[Ou]=new Set);var l=e+"__bubble";a.has(l)||(Ld(t,e,2,!1),a.add(l))}function xc(e,t,a){var l=0;t&&(l|=4),Ld(a,e,l,t)}var Fi="_reactListening"+Math.random().toString(36).slice(2);function Sc(e){if(!e[Fi]){e[Fi]=!0,As.forEach(function(a){a!=="selectionchange"&&(ay.has(a)||xc(a,!1,e),xc(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Fi]||(t[Fi]=!0,xc("selectionchange",!1,t))}}function Ld(e,t,a,l){switch(om(t)){case 2:var n=zy;break;case 8:n=Ny;break;default:n=jc}a=n.bind(null,t,a,e),n=void 0,!ku||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(n=!0),l?n!==void 0?e.addEventListener(t,a,{capture:!0,passive:n}):e.addEventListener(t,a,!0):n!==void 0?e.addEventListener(t,a,{passive:n}):e.addEventListener(t,a,!1)}function Ec(e,t,a,l,n){var i=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var r=l.tag;if(r===3||r===4){var d=l.stateNode.containerInfo;if(d===n)break;if(r===4)for(r=l.return;r!==null;){var p=r.tag;if((p===3||p===4)&&r.stateNode.containerInfo===n)return;r=r.return}for(;d!==null;){if(r=tl(d),r===null)return;if(p=r.tag,p===5||p===6||p===26||p===27){l=i=r;continue e}d=d.parentNode}}l=l.return}Hs(function(){var A=i,N=Uu(a),D=[];e:{var w=mo.get(e);if(w!==void 0){var z=ui,J=e;switch(e){case"keypress":if(ni(a)===0)break e;case"keydown":case"keyup":z=Fh;break;case"focusin":J="focus",z=Qu;break;case"focusout":J="blur",z=Qu;break;case"beforeblur":case"afterblur":z=Qu;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":z=ks;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":z=qh;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":z=Ih;break;case co:case so:case oo:z=Yh;break;case fo:z=ev;break;case"scroll":case"scrollend":z=Lh;break;case"wheel":z=av;break;case"copy":case"cut":case"paste":z=Xh;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":z=Gs;break;case"toggle":case"beforetoggle":z=nv}var ee=(t&4)!==0,Ae=!ee&&(e==="scroll"||e==="scrollend"),E=ee?w!==null?w+"Capture":null:w;ee=[];for(var x=A,T;x!==null;){var O=x;if(T=O.stateNode,O=O.tag,O!==5&&O!==26&&O!==27||T===null||E===null||(O=Wl(x,E),O!=null&&ee.push(zn(x,O,T))),Ae)break;x=x.return}0<ee.length&&(w=new z(w,J,null,a,N),D.push({event:w,listeners:ee}))}}if((t&7)===0){e:{if(w=e==="mouseover"||e==="pointerover",z=e==="mouseout"||e==="pointerout",w&&a!==Hu&&(J=a.relatedTarget||a.fromElement)&&(tl(J)||J[el]))break e;if((z||w)&&(w=N.window===N?N:(w=N.ownerDocument)?w.defaultView||w.parentWindow:window,z?(J=a.relatedTarget||a.toElement,z=A,J=J?tl(J):null,J!==null&&(Ae=f(J),ee=J.tag,J!==Ae||ee!==5&&ee!==27&&ee!==6)&&(J=null)):(z=null,J=A),z!==J)){if(ee=ks,O="onMouseLeave",E="onMouseEnter",x="mouse",(e==="pointerout"||e==="pointerover")&&(ee=Gs,O="onPointerLeave",E="onPointerEnter",x="pointer"),Ae=z==null?w:Fl(z),T=J==null?w:Fl(J),w=new ee(O,x+"leave",z,a,N),w.target=Ae,w.relatedTarget=T,O=null,tl(N)===A&&(ee=new ee(E,x+"enter",J,a,N),ee.target=T,ee.relatedTarget=Ae,O=ee),Ae=O,z&&J)t:{for(ee=ly,E=z,x=J,T=0,O=E;O;O=ee(O))T++;O=0;for(var I=x;I;I=ee(I))O++;for(;0<T-O;)E=ee(E),T--;for(;0<O-T;)x=ee(x),O--;for(;T--;){if(E===x||x!==null&&E===x.alternate){ee=E;break t}E=ee(E),x=ee(x)}ee=null}else ee=null;z!==null&&jd(D,w,z,ee,!1),J!==null&&Ae!==null&&jd(D,Ae,J,ee,!0)}}e:{if(w=A?Fl(A):window,z=w.nodeName&&w.nodeName.toLowerCase(),z==="select"||z==="input"&&w.type==="file")var ye=$s;else if(Fs(w))if(Is)ye=hv;else{ye=dv;var W=fv}else z=w.nodeName,!z||z.toLowerCase()!=="input"||w.type!=="checkbox"&&w.type!=="radio"?A&&qu(A.elementType)&&(ye=$s):ye=mv;if(ye&&(ye=ye(e,A))){Ws(D,ye,a,N);break e}W&&W(e,w,A),e==="focusout"&&A&&w.type==="number"&&A.memoizedProps.value!=null&&ju(w,"number",w.value)}switch(W=A?Fl(A):window,e){case"focusin":(Fs(W)||W.contentEditable==="true")&&(ol=W,$u=A,nn=null);break;case"focusout":nn=$u=ol=null;break;case"mousedown":Iu=!0;break;case"contextmenu":case"mouseup":case"dragend":Iu=!1,uo(D,a,N);break;case"selectionchange":if(yv)break;case"keydown":case"keyup":uo(D,a,N)}var ie;if(Ku)e:{switch(e){case"compositionstart":var he="onCompositionStart";break e;case"compositionend":he="onCompositionEnd";break e;case"compositionupdate":he="onCompositionUpdate";break e}he=void 0}else sl?Ks(e,a)&&(he="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(he="onCompositionStart");he&&(Vs&&a.locale!=="ko"&&(sl||he!=="onCompositionStart"?he==="onCompositionEnd"&&sl&&(ie=Us()):(fa=N,Xu="value"in fa?fa.value:fa.textContent,sl=!0)),W=Wi(A,he),0<W.length&&(he=new Xs(he,e,null,a,N),D.push({event:he,listeners:W}),ie?he.data=ie:(ie=Js(a),ie!==null&&(he.data=ie)))),(ie=uv?rv(e,a):cv(e,a))&&(he=Wi(A,"onBeforeInput"),0<he.length&&(W=new Xs("onBeforeInput","beforeinput",null,a,N),D.push({event:W,listeners:he}),W.data=ie)),Pv(D,e,A,a,N)}Dd(D,t)})}function zn(e,t,a){return{instance:e,listener:t,currentTarget:a}}function Wi(e,t){for(var a=t+"Capture",l=[];e!==null;){var n=e,i=n.stateNode;if(n=n.tag,n!==5&&n!==26&&n!==27||i===null||(n=Wl(e,a),n!=null&&l.unshift(zn(e,n,i)),n=Wl(e,t),n!=null&&l.push(zn(e,n,i))),e.tag===3)return l;e=e.return}return[]}function ly(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function jd(e,t,a,l,n){for(var i=t._reactName,r=[];a!==null&&a!==l;){var d=a,p=d.alternate,A=d.stateNode;if(d=d.tag,p!==null&&p===l)break;d!==5&&d!==26&&d!==27||A===null||(p=A,n?(A=Wl(a,i),A!=null&&r.unshift(zn(a,A,p))):n||(A=Wl(a,i),A!=null&&r.push(zn(a,A,p)))),a=a.return}r.length!==0&&e.push({event:t,listeners:r})}var ny=/\r\n?/g,iy=/\u0000|\uFFFD/g;function qd(e){return(typeof e=="string"?e:""+e).replace(ny,`
`).replace(iy,"")}function Hd(e,t){return t=qd(t),qd(e)===t}function Te(e,t,a,l,n,i){switch(a){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||ul(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&ul(e,""+l);break;case"className":ei(e,"class",l);break;case"tabIndex":ei(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":ei(e,a,l);break;case"style":js(e,l,i);break;case"data":if(t!=="object"){ei(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=ai(""+l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof i=="function"&&(a==="formAction"?(t!=="input"&&Te(e,t,"name",n.name,n,null),Te(e,t,"formEncType",n.formEncType,n,null),Te(e,t,"formMethod",n.formMethod,n,null),Te(e,t,"formTarget",n.formTarget,n,null)):(Te(e,t,"encType",n.encType,n,null),Te(e,t,"method",n.method,n,null),Te(e,t,"target",n.target,n,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=ai(""+l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=Vt);break;case"onScroll":l!=null&&de("scroll",e);break;case"onScrollEnd":l!=null&&de("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(c(61));if(a=l.__html,a!=null){if(n.children!=null)throw Error(c(60));e.innerHTML=a}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=ai(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""+l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":de("beforetoggle",e),de("toggle",e),Pn(e,"popover",l);break;case"xlinkActuate":Gt(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Gt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Gt(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Gt(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Gt(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Gt(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Gt(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Gt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Gt(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Pn(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Bh.get(a)||a,Pn(e,a,l))}}function Mc(e,t,a,l,n,i){switch(a){case"style":js(e,l,i);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(c(61));if(a=l.__html,a!=null){if(n.children!=null)throw Error(c(60));e.innerHTML=a}}break;case"children":typeof l=="string"?ul(e,l):(typeof l=="number"||typeof l=="bigint")&&ul(e,""+l);break;case"onScroll":l!=null&&de("scroll",e);break;case"onScrollEnd":l!=null&&de("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Vt);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!ws.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(n=a.endsWith("Capture"),t=a.slice(2,n?a.length-7:void 0),i=e[lt]||null,i=i!=null?i[a]:null,typeof i=="function"&&e.removeEventListener(t,i,n),typeof l=="function")){typeof i!="function"&&i!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,l,n);break e}a in e?e[a]=l:l===!0?e.setAttribute(a,""):Pn(e,a,l)}}}function Pe(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":de("error",e),de("load",e);var l=!1,n=!1,i;for(i in a)if(a.hasOwnProperty(i)){var r=a[i];if(r!=null)switch(i){case"src":l=!0;break;case"srcSet":n=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(c(137,t));default:Te(e,t,i,r,a,null)}}n&&Te(e,t,"srcSet",a.srcSet,a,null),l&&Te(e,t,"src",a.src,a,null);return;case"input":de("invalid",e);var d=i=r=n=null,p=null,A=null;for(l in a)if(a.hasOwnProperty(l)){var N=a[l];if(N!=null)switch(l){case"name":n=N;break;case"type":r=N;break;case"checked":p=N;break;case"defaultChecked":A=N;break;case"value":i=N;break;case"defaultValue":d=N;break;case"children":case"dangerouslySetInnerHTML":if(N!=null)throw Error(c(137,t));break;default:Te(e,t,l,N,a,null)}}Os(e,i,d,p,A,r,n,!1);return;case"select":de("invalid",e),l=r=i=null;for(n in a)if(a.hasOwnProperty(n)&&(d=a[n],d!=null))switch(n){case"value":i=d;break;case"defaultValue":r=d;break;case"multiple":l=d;default:Te(e,t,n,d,a,null)}t=i,a=r,e.multiple=!!l,t!=null?il(e,!!l,t,!1):a!=null&&il(e,!!l,a,!0);return;case"textarea":de("invalid",e),i=n=l=null;for(r in a)if(a.hasOwnProperty(r)&&(d=a[r],d!=null))switch(r){case"value":l=d;break;case"defaultValue":n=d;break;case"children":i=d;break;case"dangerouslySetInnerHTML":if(d!=null)throw Error(c(91));break;default:Te(e,t,r,d,a,null)}Ds(e,l,n,i);return;case"option":for(p in a)a.hasOwnProperty(p)&&(l=a[p],l!=null)&&(p==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":Te(e,t,p,l,a,null));return;case"dialog":de("beforetoggle",e),de("toggle",e),de("cancel",e),de("close",e);break;case"iframe":case"object":de("load",e);break;case"video":case"audio":for(l=0;l<Cn.length;l++)de(Cn[l],e);break;case"image":de("error",e),de("load",e);break;case"details":de("toggle",e);break;case"embed":case"source":case"link":de("error",e),de("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(A in a)if(a.hasOwnProperty(A)&&(l=a[A],l!=null))switch(A){case"children":case"dangerouslySetInnerHTML":throw Error(c(137,t));default:Te(e,t,A,l,a,null)}return;default:if(qu(t)){for(N in a)a.hasOwnProperty(N)&&(l=a[N],l!==void 0&&Mc(e,t,N,l,a,void 0));return}}for(d in a)a.hasOwnProperty(d)&&(l=a[d],l!=null&&Te(e,t,d,l,a,null))}function uy(e,t,a,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var n=null,i=null,r=null,d=null,p=null,A=null,N=null;for(z in a){var D=a[z];if(a.hasOwnProperty(z)&&D!=null)switch(z){case"checked":break;case"value":break;case"defaultValue":p=D;default:l.hasOwnProperty(z)||Te(e,t,z,null,l,D)}}for(var w in l){var z=l[w];if(D=a[w],l.hasOwnProperty(w)&&(z!=null||D!=null))switch(w){case"type":i=z;break;case"name":n=z;break;case"checked":A=z;break;case"defaultChecked":N=z;break;case"value":r=z;break;case"defaultValue":d=z;break;case"children":case"dangerouslySetInnerHTML":if(z!=null)throw Error(c(137,t));break;default:z!==D&&Te(e,t,w,z,l,D)}}Lu(e,r,d,p,A,N,i,n);return;case"select":z=r=d=w=null;for(i in a)if(p=a[i],a.hasOwnProperty(i)&&p!=null)switch(i){case"value":break;case"multiple":z=p;default:l.hasOwnProperty(i)||Te(e,t,i,null,l,p)}for(n in l)if(i=l[n],p=a[n],l.hasOwnProperty(n)&&(i!=null||p!=null))switch(n){case"value":w=i;break;case"defaultValue":d=i;break;case"multiple":r=i;default:i!==p&&Te(e,t,n,i,l,p)}t=d,a=r,l=z,w!=null?il(e,!!a,w,!1):!!l!=!!a&&(t!=null?il(e,!!a,t,!0):il(e,!!a,a?[]:"",!1));return;case"textarea":z=w=null;for(d in a)if(n=a[d],a.hasOwnProperty(d)&&n!=null&&!l.hasOwnProperty(d))switch(d){case"value":break;case"children":break;default:Te(e,t,d,null,l,n)}for(r in l)if(n=l[r],i=a[r],l.hasOwnProperty(r)&&(n!=null||i!=null))switch(r){case"value":w=n;break;case"defaultValue":z=n;break;case"children":break;case"dangerouslySetInnerHTML":if(n!=null)throw Error(c(91));break;default:n!==i&&Te(e,t,r,n,l,i)}Bs(e,w,z);return;case"option":for(var J in a)w=a[J],a.hasOwnProperty(J)&&w!=null&&!l.hasOwnProperty(J)&&(J==="selected"?e.selected=!1:Te(e,t,J,null,l,w));for(p in l)w=l[p],z=a[p],l.hasOwnProperty(p)&&w!==z&&(w!=null||z!=null)&&(p==="selected"?e.selected=w&&typeof w!="function"&&typeof w!="symbol":Te(e,t,p,w,l,z));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ee in a)w=a[ee],a.hasOwnProperty(ee)&&w!=null&&!l.hasOwnProperty(ee)&&Te(e,t,ee,null,l,w);for(A in l)if(w=l[A],z=a[A],l.hasOwnProperty(A)&&w!==z&&(w!=null||z!=null))switch(A){case"children":case"dangerouslySetInnerHTML":if(w!=null)throw Error(c(137,t));break;default:Te(e,t,A,w,l,z)}return;default:if(qu(t)){for(var Ae in a)w=a[Ae],a.hasOwnProperty(Ae)&&w!==void 0&&!l.hasOwnProperty(Ae)&&Mc(e,t,Ae,void 0,l,w);for(N in l)w=l[N],z=a[N],!l.hasOwnProperty(N)||w===z||w===void 0&&z===void 0||Mc(e,t,N,w,l,z);return}}for(var E in a)w=a[E],a.hasOwnProperty(E)&&w!=null&&!l.hasOwnProperty(E)&&Te(e,t,E,null,l,w);for(D in l)w=l[D],z=a[D],!l.hasOwnProperty(D)||w===z||w==null&&z==null||Te(e,t,D,w,l,z)}function Ud(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function ry(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var n=a[l],i=n.transferSize,r=n.initiatorType,d=n.duration;if(i&&d&&Ud(r)){for(r=0,d=n.responseEnd,l+=1;l<a.length;l++){var p=a[l],A=p.startTime;if(A>d)break;var N=p.transferSize,D=p.initiatorType;N&&Ud(D)&&(p=p.responseEnd,r+=N*(p<d?1:(d-A)/(p-A)))}if(--l,t+=8*(i+r)/(n.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Rc=null,Tc=null;function $i(e){return e.nodeType===9?e:e.ownerDocument}function Yd(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function kd(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Ac(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var wc=null;function cy(){var e=window.event;return e&&e.type==="popstate"?e===wc?!1:(wc=e,!0):(wc=null,!1)}var Xd=typeof setTimeout=="function"?setTimeout:void 0,sy=typeof clearTimeout=="function"?clearTimeout:void 0,Gd=typeof Promise=="function"?Promise:void 0,oy=typeof queueMicrotask=="function"?queueMicrotask:typeof Gd<"u"?function(e){return Gd.resolve(null).then(e).catch(fy)}:Xd;function fy(e){setTimeout(function(){throw e})}function _a(e){return e==="head"}function Vd(e,t){var a=t,l=0;do{var n=a.nextSibling;if(e.removeChild(a),n&&n.nodeType===8)if(a=n.data,a==="/$"||a==="/&"){if(l===0){e.removeChild(n),ql(t);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")Nn(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Nn(a);for(var i=a.firstChild;i;){var r=i.nextSibling,d=i.nodeName;i[Jl]||d==="SCRIPT"||d==="STYLE"||d==="LINK"&&i.rel.toLowerCase()==="stylesheet"||a.removeChild(i),i=r}}else a==="body"&&Nn(e.ownerDocument.body);a=n}while(a);ql(t)}function Qd(e,t){var a=e;e=0;do{var l=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=l}while(a)}function _c(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":_c(a),Bu(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function dy(e,t,a,l){for(;e.nodeType===1;){var n=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Jl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(i=e.getAttribute("rel"),i==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(i!==n.rel||e.getAttribute("href")!==(n.href==null||n.href===""?null:n.href)||e.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin)||e.getAttribute("title")!==(n.title==null?null:n.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(i=e.getAttribute("src"),(i!==(n.src==null?null:n.src)||e.getAttribute("type")!==(n.type==null?null:n.type)||e.getAttribute("crossorigin")!==(n.crossOrigin==null?null:n.crossOrigin))&&i&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var i=n.name==null?null:""+n.name;if(n.type==="hidden"&&e.getAttribute("name")===i)return e}else return e;if(e=_t(e.nextSibling),e===null)break}return null}function my(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=_t(e.nextSibling),e===null))return null;return e}function Zd(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=_t(e.nextSibling),e===null))return null;return e}function Cc(e){return e.data==="$?"||e.data==="$~"}function zc(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function hy(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var l=function(){t(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function _t(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Nc=null;function Kd(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return _t(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function Jd(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function Fd(e,t,a){switch(t=$i(a),e){case"html":if(e=t.documentElement,!e)throw Error(c(452));return e;case"head":if(e=t.head,!e)throw Error(c(453));return e;case"body":if(e=t.body,!e)throw Error(c(454));return e;default:throw Error(c(451))}}function Nn(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Bu(e)}var Ct=new Map,Wd=new Set;function Ii(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ua=k.d;k.d={f:vy,r:yy,D:py,C:gy,L:by,m:xy,X:Ey,S:Sy,M:My};function vy(){var e=ua.f(),t=Gi();return e||t}function yy(e){var t=al(e);t!==null&&t.tag===5&&t.type==="form"?mf(t):ua.r(e)}var Dl=typeof document>"u"?null:document;function $d(e,t,a){var l=Dl;if(l&&typeof t=="string"&&t){var n=St(t);n='link[rel="'+e+'"][href="'+n+'"]',typeof a=="string"&&(n+='[crossorigin="'+a+'"]'),Wd.has(n)||(Wd.add(n),e={rel:e,crossOrigin:a,href:t},l.querySelector(n)===null&&(t=l.createElement("link"),Pe(t,"link",e),Ke(t),l.head.appendChild(t)))}}function py(e){ua.D(e),$d("dns-prefetch",e,null)}function gy(e,t){ua.C(e,t),$d("preconnect",e,t)}function by(e,t,a){ua.L(e,t,a);var l=Dl;if(l&&e&&t){var n='link[rel="preload"][as="'+St(t)+'"]';t==="image"&&a&&a.imageSrcSet?(n+='[imagesrcset="'+St(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(n+='[imagesizes="'+St(a.imageSizes)+'"]')):n+='[href="'+St(e)+'"]';var i=n;switch(t){case"style":i=Ll(e);break;case"script":i=jl(e)}Ct.has(i)||(e=R({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),Ct.set(i,e),l.querySelector(n)!==null||t==="style"&&l.querySelector(On(i))||t==="script"&&l.querySelector(Bn(i))||(t=l.createElement("link"),Pe(t,"link",e),Ke(t),l.head.appendChild(t)))}}function xy(e,t){ua.m(e,t);var a=Dl;if(a&&e){var l=t&&typeof t.as=="string"?t.as:"script",n='link[rel="modulepreload"][as="'+St(l)+'"][href="'+St(e)+'"]',i=n;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":i=jl(e)}if(!Ct.has(i)&&(e=R({rel:"modulepreload",href:e},t),Ct.set(i,e),a.querySelector(n)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Bn(i)))return}l=a.createElement("link"),Pe(l,"link",e),Ke(l),a.head.appendChild(l)}}}function Sy(e,t,a){ua.S(e,t,a);var l=Dl;if(l&&e){var n=ll(l).hoistableStyles,i=Ll(e);t=t||"default";var r=n.get(i);if(!r){var d={loading:0,preload:null};if(r=l.querySelector(On(i)))d.loading=5;else{e=R({rel:"stylesheet",href:e,"data-precedence":t},a),(a=Ct.get(i))&&Oc(e,a);var p=r=l.createElement("link");Ke(p),Pe(p,"link",e),p._p=new Promise(function(A,N){p.onload=A,p.onerror=N}),p.addEventListener("load",function(){d.loading|=1}),p.addEventListener("error",function(){d.loading|=2}),d.loading|=4,Pi(r,t,l)}r={type:"stylesheet",instance:r,count:1,state:d},n.set(i,r)}}}function Ey(e,t){ua.X(e,t);var a=Dl;if(a&&e){var l=ll(a).hoistableScripts,n=jl(e),i=l.get(n);i||(i=a.querySelector(Bn(n)),i||(e=R({src:e,async:!0},t),(t=Ct.get(n))&&Bc(e,t),i=a.createElement("script"),Ke(i),Pe(i,"link",e),a.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function My(e,t){ua.M(e,t);var a=Dl;if(a&&e){var l=ll(a).hoistableScripts,n=jl(e),i=l.get(n);i||(i=a.querySelector(Bn(n)),i||(e=R({src:e,async:!0,type:"module"},t),(t=Ct.get(n))&&Bc(e,t),i=a.createElement("script"),Ke(i),Pe(i,"link",e),a.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(n,i))}}function Id(e,t,a,l){var n=(n=oe.current)?Ii(n):null;if(!n)throw Error(c(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=Ll(a.href),a=ll(n).hoistableStyles,l=a.get(t),l||(l={type:"style",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=Ll(a.href);var i=ll(n).hoistableStyles,r=i.get(e);if(r||(n=n.ownerDocument||n,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},i.set(e,r),(i=n.querySelector(On(e)))&&!i._p&&(r.instance=i,r.state.loading=5),Ct.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ct.set(e,a),i||Ry(n,e,a,r.state))),t&&l===null)throw Error(c(528,""));return r}if(t&&l!==null)throw Error(c(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=jl(a),a=ll(n).hoistableScripts,l=a.get(t),l||(l={type:"script",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(c(444,e))}}function Ll(e){return'href="'+St(e)+'"'}function On(e){return'link[rel="stylesheet"]['+e+"]"}function Pd(e){return R({},e,{"data-precedence":e.precedence,precedence:null})}function Ry(e,t,a,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),Pe(t,"link",a),Ke(t),e.head.appendChild(t))}function jl(e){return'[src="'+St(e)+'"]'}function Bn(e){return"script[async]"+e}function em(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+St(a.href)+'"]');if(l)return t.instance=l,Ke(l),l;var n=R({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Ke(l),Pe(l,"style",n),Pi(l,a.precedence,e),t.instance=l;case"stylesheet":n=Ll(a.href);var i=e.querySelector(On(n));if(i)return t.state.loading|=4,t.instance=i,Ke(i),i;l=Pd(a),(n=Ct.get(n))&&Oc(l,n),i=(e.ownerDocument||e).createElement("link"),Ke(i);var r=i;return r._p=new Promise(function(d,p){r.onload=d,r.onerror=p}),Pe(i,"link",l),t.state.loading|=4,Pi(i,a.precedence,e),t.instance=i;case"script":return i=jl(a.src),(n=e.querySelector(Bn(i)))?(t.instance=n,Ke(n),n):(l=a,(n=Ct.get(i))&&(l=R({},a),Bc(l,n)),e=e.ownerDocument||e,n=e.createElement("script"),Ke(n),Pe(n,"link",l),e.head.appendChild(n),t.instance=n);case"void":return null;default:throw Error(c(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Pi(l,a.precedence,e));return t.instance}function Pi(e,t,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),n=l.length?l[l.length-1]:null,i=n,r=0;r<l.length;r++){var d=l[r];if(d.dataset.precedence===t)i=d;else if(i!==n)break}i?i.parentNode.insertBefore(e,i.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function Oc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Bc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var eu=null;function tm(e,t,a){if(eu===null){var l=new Map,n=eu=new Map;n.set(a,l)}else n=eu,l=n.get(a),l||(l=new Map,n.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),n=0;n<a.length;n++){var i=a[n];if(!(i[Jl]||i[Fe]||e==="link"&&i.getAttribute("rel")==="stylesheet")&&i.namespaceURI!=="http://www.w3.org/2000/svg"){var r=i.getAttribute(t)||"";r=e+r;var d=l.get(r);d?d.push(i):l.set(r,[i])}}return l}function am(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function Ty(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function lm(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Ay(e,t,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var n=Ll(l.href),i=t.querySelector(On(n));if(i){t=i._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=tu.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=i,Ke(i);return}i=t.ownerDocument||t,l=Pd(l),(n=Ct.get(n))&&Oc(l,n),i=i.createElement("link"),Ke(i);var r=i;r._p=new Promise(function(d,p){r.onload=d,r.onerror=p}),Pe(i,"link",l),a.instance=i}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=tu.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var Dc=0;function wy(e,t){return e.stylesheets&&e.count===0&&lu(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var l=setTimeout(function(){if(e.stylesheets&&lu(e,e.stylesheets),e.unsuspend){var i=e.unsuspend;e.unsuspend=null,i()}},6e4+t);0<e.imgBytes&&Dc===0&&(Dc=62500*ry());var n=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&lu(e,e.stylesheets),e.unsuspend)){var i=e.unsuspend;e.unsuspend=null,i()}},(e.imgBytes>Dc?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(n)}}:null}function tu(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)lu(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var au=null;function lu(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,au=new Map,t.forEach(_y,e),au=null,tu.call(e))}function _y(e,t){if(!(t.state.loading&4)){var a=au.get(e);if(a)var l=a.get(null);else{a=new Map,au.set(e,a);for(var n=e.querySelectorAll("link[data-precedence],style[data-precedence]"),i=0;i<n.length;i++){var r=n[i];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(a.set(r.dataset.precedence,r),l=r)}l&&a.set(null,l)}n=t.instance,r=n.getAttribute("data-precedence"),i=a.get(r)||l,i===l&&a.set(null,n),a.set(r,n),this.count++,l=tu.bind(this),n.addEventListener("load",l),n.addEventListener("error",l),i?i.parentNode.insertBefore(n,i.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(n,e.firstChild)),t.state.loading|=4}}var Dn={$$typeof:Q,Provider:null,Consumer:null,_currentValue:L,_currentValue2:L,_threadCount:0};function Cy(e,t,a,l,n,i,r,d,p){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Cu(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Cu(0),this.hiddenUpdates=Cu(null),this.identifierPrefix=l,this.onUncaughtError=n,this.onCaughtError=i,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=p,this.incompleteTransitions=new Map}function nm(e,t,a,l,n,i,r,d,p,A,N,D){return e=new Cy(e,t,a,r,p,A,N,D,d),t=1,i===!0&&(t|=24),i=ht(3,null,null,t),e.current=i,i.stateNode=e,t=mr(),t.refCount++,e.pooledCache=t,t.refCount++,i.memoizedState={element:l,isDehydrated:a,cache:t},pr(i),e}function im(e){return e?(e=ml,e):ml}function um(e,t,a,l,n,i){n=im(n),l.context===null?l.context=n:l.pendingContext=n,l=pa(t),l.payload={element:a},i=i===void 0?null:i,i!==null&&(l.callback=i),a=ga(e,l,t),a!==null&&(st(a,e,t),dn(a,e,t))}function rm(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function Lc(e,t){rm(e,t),(e=e.alternate)&&rm(e,t)}function cm(e){if(e.tag===13||e.tag===31){var t=Ya(e,67108864);t!==null&&st(t,e,67108864),Lc(e,67108864)}}function sm(e){if(e.tag===13||e.tag===31){var t=bt();t=zu(t);var a=Ya(e,t);a!==null&&st(a,e,t),Lc(e,t)}}var nu=!0;function zy(e,t,a,l){var n=C.T;C.T=null;var i=k.p;try{k.p=2,jc(e,t,a,l)}finally{k.p=i,C.T=n}}function Ny(e,t,a,l){var n=C.T;C.T=null;var i=k.p;try{k.p=8,jc(e,t,a,l)}finally{k.p=i,C.T=n}}function jc(e,t,a,l){if(nu){var n=qc(l);if(n===null)Ec(e,t,l,iu,a),fm(e,l);else if(By(n,e,t,a,l))l.stopPropagation();else if(fm(e,l),t&4&&-1<Oy.indexOf(e)){for(;n!==null;){var i=al(n);if(i!==null)switch(i.tag){case 3:if(i=i.stateNode,i.current.memoizedState.isDehydrated){var r=La(i.pendingLanes);if(r!==0){var d=i;for(d.pendingLanes|=2,d.entangledLanes|=2;r;){var p=1<<31-dt(r);d.entanglements[1]|=p,r&=~p}Ht(i),(be&6)===0&&(ki=ot()+500,_n(0))}}break;case 31:case 13:d=Ya(i,2),d!==null&&st(d,i,2),Gi(),Lc(i,2)}if(i=qc(l),i===null&&Ec(e,t,l,iu,a),i===n)break;n=i}n!==null&&l.stopPropagation()}else Ec(e,t,l,null,a)}}function qc(e){return e=Uu(e),Hc(e)}var iu=null;function Hc(e){if(iu=null,e=tl(e),e!==null){var t=f(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=v(t),e!==null)return e;e=null}else if(a===31){if(e=S(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return iu=e,null}function om(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(ph()){case ys:return 2;case ps:return 8;case Jn:case gh:return 32;case gs:return 268435456;default:return 32}default:return 32}}var Uc=!1,Ca=null,za=null,Na=null,Ln=new Map,jn=new Map,Oa=[],Oy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function fm(e,t){switch(e){case"focusin":case"focusout":Ca=null;break;case"dragenter":case"dragleave":za=null;break;case"mouseover":case"mouseout":Na=null;break;case"pointerover":case"pointerout":Ln.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":jn.delete(t.pointerId)}}function qn(e,t,a,l,n,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:a,eventSystemFlags:l,nativeEvent:i,targetContainers:[n]},t!==null&&(t=al(t),t!==null&&cm(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,n!==null&&t.indexOf(n)===-1&&t.push(n),e)}function By(e,t,a,l,n){switch(t){case"focusin":return Ca=qn(Ca,e,t,a,l,n),!0;case"dragenter":return za=qn(za,e,t,a,l,n),!0;case"mouseover":return Na=qn(Na,e,t,a,l,n),!0;case"pointerover":var i=n.pointerId;return Ln.set(i,qn(Ln.get(i)||null,e,t,a,l,n)),!0;case"gotpointercapture":return i=n.pointerId,jn.set(i,qn(jn.get(i)||null,e,t,a,l,n)),!0}return!1}function dm(e){var t=tl(e.target);if(t!==null){var a=f(t);if(a!==null){if(t=a.tag,t===13){if(t=v(a),t!==null){e.blockedOn=t,Rs(e.priority,function(){sm(a)});return}}else if(t===31){if(t=S(a),t!==null){e.blockedOn=t,Rs(e.priority,function(){sm(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function uu(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=qc(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);Hu=l,a.target.dispatchEvent(l),Hu=null}else return t=al(a),t!==null&&cm(t),e.blockedOn=a,!1;t.shift()}return!0}function mm(e,t,a){uu(e)&&a.delete(t)}function Dy(){Uc=!1,Ca!==null&&uu(Ca)&&(Ca=null),za!==null&&uu(za)&&(za=null),Na!==null&&uu(Na)&&(Na=null),Ln.forEach(mm),jn.forEach(mm)}function ru(e,t){e.blockedOn===t&&(e.blockedOn=null,Uc||(Uc=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Dy)))}var cu=null;function hm(e){cu!==e&&(cu=e,u.unstable_scheduleCallback(u.unstable_NormalPriority,function(){cu===e&&(cu=null);for(var t=0;t<e.length;t+=3){var a=e[t],l=e[t+1],n=e[t+2];if(typeof l!="function"){if(Hc(l||a)===null)continue;break}var i=al(a);i!==null&&(e.splice(t,3),t-=3,qr(i,{pending:!0,data:n,method:a.method,action:l},l,n))}}))}function ql(e){function t(p){return ru(p,e)}Ca!==null&&ru(Ca,e),za!==null&&ru(za,e),Na!==null&&ru(Na,e),Ln.forEach(t),jn.forEach(t);for(var a=0;a<Oa.length;a++){var l=Oa[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<Oa.length&&(a=Oa[0],a.blockedOn===null);)dm(a),a.blockedOn===null&&Oa.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var n=a[l],i=a[l+1],r=n[lt]||null;if(typeof i=="function")r||hm(a);else if(r){var d=null;if(i&&i.hasAttribute("formAction")){if(n=i,r=i[lt]||null)d=r.formAction;else if(Hc(n)!==null)continue}else d=r.action;typeof d=="function"?a[l+1]=d:(a.splice(l,3),l-=3),hm(a)}}}function vm(){function e(i){i.canIntercept&&i.info==="react-transition"&&i.intercept({handler:function(){return new Promise(function(r){return n=r})},focusReset:"manual",scroll:"manual"})}function t(){n!==null&&(n(),n=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var i=navigation.currentEntry;i&&i.url!=null&&navigation.navigate(i.url,{state:i.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,n=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),n!==null&&(n(),n=null)}}}function Yc(e){this._internalRoot=e}su.prototype.render=Yc.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));var a=t.current,l=bt();um(a,l,e,t,null,null)},su.prototype.unmount=Yc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;um(e.current,2,null,e,null,null),Gi(),t[el]=null}};function su(e){this._internalRoot=e}su.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ms();e={blockedOn:null,target:e,priority:t};for(var a=0;a<Oa.length&&t!==0&&t<Oa[a].priority;a++);Oa.splice(a,0,e),a===0&&dm(e)}};var ym=s.version;if(ym!=="19.2.3")throw Error(c(527,ym,"19.2.3"));k.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=g(t),e=e!==null?_(e):null,e=e===null?null:e.stateNode,e};var Ly={bundleType:0,version:"19.2.3",rendererPackageName:"react-dom",currentDispatcherRef:C,reconcilerVersion:"19.2.3"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ou=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ou.isDisabled&&ou.supportsFiber)try{Ql=ou.inject(Ly),ft=ou}catch{}}return Un.createRoot=function(e,t){if(!m(e))throw Error(c(299));var a=!1,l="",n=Mf,i=Rf,r=Tf;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(n=t.onUncaughtError),t.onCaughtError!==void 0&&(i=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=nm(e,1,!1,null,null,a,l,null,n,i,r,vm),e[el]=t.current,Sc(e),new Yc(t)},Un.hydrateRoot=function(e,t,a){if(!m(e))throw Error(c(299));var l=!1,n="",i=Mf,r=Rf,d=Tf,p=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(n=a.identifierPrefix),a.onUncaughtError!==void 0&&(i=a.onUncaughtError),a.onCaughtError!==void 0&&(r=a.onCaughtError),a.onRecoverableError!==void 0&&(d=a.onRecoverableError),a.formState!==void 0&&(p=a.formState)),t=nm(e,1,!0,t,a??null,l,n,p,i,r,d,vm),t.context=im(null),a=t.current,l=bt(),l=zu(l),n=pa(l),n.callback=null,ga(a,n,l),a=l,t.current.lanes=a,Kl(t,a),Ht(t),e[el]=t.current,Sc(e),new su(t)},Un.version="19.2.3",Un}var Am;function Qy(){if(Am)return Gc.exports;Am=1;function u(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)}catch(s){console.error(s)}}return u(),Gc.exports=Vy(),Gc.exports}var Zy=Qy();var is=/^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,Ym=/^[\\/]{2}/;function Ky(u,s){return s+u.replace(/\\/g,"/")}var wm="popstate";function _m(u){return typeof u=="object"&&u!=null&&"pathname"in u&&"search"in u&&"hash"in u&&"state"in u&&"key"in u}function Jy(u={}){function s(c,m){let f=m.state?.masked,{pathname:v,search:S,hash:y}=f||c.location;return es("",{pathname:v,search:S,hash:y},m.state&&m.state.usr||null,m.state&&m.state.key||"default",f?{pathname:c.location.pathname,search:c.location.search,hash:c.location.hash}:void 0)}function o(c,m){return typeof m=="string"?m:Hl(m)}return Wy(s,o,null,u)}function Oe(u,s){if(u===!1||u===null||typeof u>"u")throw new Error(s)}function Yt(u,s){if(!u){typeof console<"u"&&console.warn(s);try{throw new Error(s)}catch{}}}function Fy(){return Math.random().toString(36).substring(2,10)}function Cm(u,s){return{usr:u.state,key:u.key,idx:s,masked:u.mask?{pathname:u.pathname,search:u.search,hash:u.hash}:void 0}}function es(u,s,o=null,c,m){return{pathname:typeof u=="string"?u:u.pathname,search:"",hash:"",...typeof s=="string"?kl(s):s,state:o,key:s&&s.key||c||Fy(),mask:m}}function Hl({pathname:u="/",search:s="",hash:o=""}){return s&&s!=="?"&&(u+=s.charAt(0)==="?"?s:"?"+s),o&&o!=="#"&&(u+=o.charAt(0)==="#"?o:"#"+o),u}function kl(u){let s={};if(u){let o=u.indexOf("#");o>=0&&(s.hash=u.substring(o),u=u.substring(0,o));let c=u.indexOf("?");c>=0&&(s.search=u.substring(c),u=u.substring(0,c)),u&&(s.pathname=u)}return s}function Wy(u,s,o,c={}){let{window:m=document.defaultView,v5Compat:f=!1}=c,v=m.history,S="POP",y=null,g=_();g==null&&(g=0,v.replaceState({...v.state,idx:g},""));function _(){return(v.state||{idx:null}).idx}function R(){S="POP";let j=_(),H=j==null?null:j-g;g=j,y&&y({action:S,location:Y.location,delta:H})}function q(j,H){S="PUSH";let X=_m(j)?j:es(Y.location,j,H);g=_()+1;let Q=Cm(X,g),Z=Y.createHref(X.mask||X);try{v.pushState(Q,"",Z)}catch(ue){if(ue instanceof DOMException&&ue.name==="DataCloneError")throw ue;m.location.assign(Z)}f&&y&&y({action:S,location:Y.location,delta:1})}function K(j,H){S="REPLACE";let X=_m(j)?j:es(Y.location,j,H);g=_();let Q=Cm(X,g),Z=Y.createHref(X.mask||X);v.replaceState(Q,"",Z),f&&y&&y({action:S,location:Y.location,delta:0})}function U(j){return $y(m,j)}let Y={get action(){return S},get location(){return u(m,v)},listen(j){if(y)throw new Error("A history only accepts one active listener");return m.addEventListener(wm,R),y=j,()=>{m.removeEventListener(wm,R),y=null}},createHref(j){return s(m,j)},createURL:U,encodeLocation(j){let H=U(j);return{pathname:H.pathname,search:H.search,hash:H.hash}},push:q,replace:K,go(j){return v.go(j)}};return Y}function $y(u,s,o=!1){let c="http://localhost";u&&(c=u.location.origin!=="null"?u.location.origin:u.location.href),Oe(c,"No window.location.(origin|href) available to create URL");let m=typeof s=="string"?s:Hl(s);return m=m.replace(/ $/,"%20"),!o&&Ym.test(m)&&(m=c+m),new URL(m,c)}function km(u,s,o="/"){return Iy(u,s,o,!1)}function Iy(u,s,o,c,m){let f=typeof s=="string"?kl(s):s,v=ra(f.pathname||"/",o);if(v==null)return null;let S=Py(u),y=null,g=op(v);for(let _=0;y==null&&_<S.length;++_)y=sp(S[_],g,c);return y}function Py(u){let s=Xm(u);return ep(s),s}function Xm(u,s=[],o=[],c="",m=!1){let f=(v,S,y=m,g)=>{let _={relativePath:g===void 0?v.path||"":g,caseSensitive:v.caseSensitive===!0,childrenIndex:S,route:v};if(_.relativePath.startsWith("/")){if(!_.relativePath.startsWith(c)&&y)return;Oe(_.relativePath.startsWith(c),`Absolute route path "${_.relativePath}" nested under path "${c}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),_.relativePath=_.relativePath.slice(c.length)}let R=Dt([c,_.relativePath]),q=o.concat(_);v.children&&v.children.length>0&&(Oe(v.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${R}".`),Xm(v.children,s,q,R,y)),!(v.path==null&&!v.index)&&s.push({path:R,score:rp(R,v.index),routesMeta:q.map((K,U)=>{let[Y,j]=Qm(K.relativePath,K.caseSensitive,U===q.length-1);return{...K,matcher:Y,compiledParams:j}})})};return u.forEach((v,S)=>{if(v.path===""||!v.path?.includes("?"))f(v,S);else for(let y of Gm(v.path))f(v,S,!0,y)}),s}function Gm(u){let s=u.split("/");if(s.length===0)return[];let[o,...c]=s,m=o.endsWith("?"),f=o.replace(/\?$/,"");if(c.length===0)return m?[f,""]:[f];let v=Gm(c.join("/")),S=[];return S.push(...v.map(y=>y===""?f:[f,y].join("/"))),m&&S.push(...v),S.map(y=>u.startsWith("/")&&y===""?"/":y)}function ep(u){u.sort((s,o)=>s.score!==o.score?o.score-s.score:cp(s.routesMeta.map(c=>c.childrenIndex),o.routesMeta.map(c=>c.childrenIndex)))}var tp=/^:[\w-]+$/,ap=3,lp=2,np=1,ip=10,up=-2,zm=u=>u==="*";function rp(u,s){let o=u.split("/"),c=o.length;return o.some(zm)&&(c+=up),s&&(c+=lp),o.filter(m=>!zm(m)).reduce((m,f)=>m+(tp.test(f)?ap:f===""?np:ip),c)}function cp(u,s){return u.length===s.length&&u.slice(0,-1).every((c,m)=>c===s[m])?u[u.length-1]-s[s.length-1]:0}function sp(u,s,o=!1){let{routesMeta:c}=u,m={},f="/",v=[];for(let S=0;S<c.length;++S){let y=c[S],g=S===c.length-1,_=f==="/"?s:s.slice(f.length)||"/",R={path:y.relativePath,caseSensitive:y.caseSensitive,end:g},q=y.matcher&&y.compiledParams?Vm(R,_,y.matcher,y.compiledParams):gu(R,_),K=y.route;if(!q&&g&&o&&!c[c.length-1].route.index&&(q=gu({path:y.relativePath,caseSensitive:y.caseSensitive,end:!1},_)),!q)return null;Object.assign(m,q.params),v.push({params:m,pathname:Dt([f,q.pathname]),pathnameBase:mp(Dt([f,q.pathnameBase])),route:K}),q.pathnameBase!=="/"&&(f=Dt([f,q.pathnameBase]))}return v}function gu(u,s){typeof u=="string"&&(u={path:u,caseSensitive:!1,end:!0});let[o,c]=Qm(u.path,u.caseSensitive,u.end);return Vm(u,s,o,c)}function Vm(u,s,o,c){let m=s.match(o);if(!m)return null;let f=m[0],v=Ul(f,1),S=m.slice(1);return{params:c.reduce((g,{paramName:_,isOptional:R},q)=>{if(_==="*"){let U=S[q]||"";v=Ul(f.slice(0,f.length-U.length),1)}const K=S[q];return R&&!K?g[_]=void 0:g[_]=(K||"").replace(/%2F/g,"/"),g},{}),pathname:f,pathnameBase:v,pattern:u}}function Qm(u,s=!1,o=!0){Yt(u==="*"||!u.endsWith("*")||u.endsWith("/*"),`Route path "${u}" will be treated as if it were "${u.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${u.replace(/\*$/,"/*")}".`);let c=[],m="^"+u.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(v,S,y,g,_)=>{if(c.push({paramName:S,isOptional:y!=null}),y){let R=_.charAt(g+v.length);return R&&R!=="/"?"/([^\\/]*)":"(?:/([^\\/]*))?"}return"/([^\\/]+)"}).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return u.endsWith("*")?(c.push({paramName:"*"}),m+=u==="*"||u==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):o?m+="\\/*$":u!==""&&u!=="/"&&(m+="(?:(?=\\/|$))"),[new RegExp(m,s?void 0:"i"),c]}function op(u){try{return u.split("/").map(s=>decodeURIComponent(s).replace(/\//g,"%2F")).join("/")}catch(s){return Yt(!1,`The URL path "${u}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${s}).`),u}}function ra(u,s){if(s==="/")return u;if(!u.toLowerCase().startsWith(s.toLowerCase()))return null;let o=s.endsWith("/")?s.length-1:s.length,c=u.charAt(o);return c&&c!=="/"?null:u.slice(o)||"/"}function fp(u,s="/"){let{pathname:o,search:c="",hash:m=""}=typeof u=="string"?kl(u):u,f;return o?(o=Km(o),o.startsWith("/")||o.startsWith("\\")?f=Nm(o.substring(1),"/"):f=Nm(o,s)):f=s,{pathname:f,search:hp(c),hash:vp(m)}}function Nm(u,s){let o=Ul(s).split("/");return u.split("/").forEach(m=>{m===".."?o.length>1&&o.pop():m!=="."&&o.push(m)}),o.length>1?o.join("/"):"/"}function Kc(u,s,o,c){return`Cannot include a '${u}' character in a manually specified \`to.${s}\` field [${JSON.stringify(c)}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function dp(u){return u.filter((s,o)=>o===0||s.route.path&&s.route.path.length>0)}function Zm(u){let s=dp(u);return s.map((o,c)=>c===s.length-1?o.pathname:o.pathnameBase)}function us(u,s,o,c=!1){let m;typeof u=="string"?m=kl(u):(m={...u},Oe(!m.pathname||!m.pathname.includes("?"),Kc("?","pathname","search",m)),Oe(!m.pathname||!m.pathname.includes("#"),Kc("#","pathname","hash",m)),Oe(!m.search||!m.search.includes("#"),Kc("#","search","hash",m)));let f=u===""||m.pathname==="",v=f?"/":m.pathname,S;if(v==null)S=o;else{let R=s.length-1;if(!c&&v.startsWith("..")){let q=v.split("/");for(;q[0]==="..";)q.shift(),R-=1;m.pathname=q.join("/")}S=R>=0?s[R]:"/"}let y=fp(m,S),g=v&&v!=="/"&&v.endsWith("/"),_=(f||v===".")&&o.endsWith("/");return!y.pathname.endsWith("/")&&(g||_)&&(y.pathname+="/"),y}var Km=u=>u.replace(/[\\/]{2,}/g,"/"),Dt=u=>Km(u.join("/"));function Ul(u,s=0){let o=u.length;for(;o>s&&u.charCodeAt(o-1)===47;)o--;return o===u.length?u:u.slice(0,o)}var mp=u=>Ul(u).replace(/^\/*/,"/"),hp=u=>!u||u==="?"?"":u.startsWith("?")?u:"?"+u,vp=u=>!u||u==="#"?"":u.startsWith("#")?u:"#"+u,yp=class{constructor(u,s,o,c=!1){this.status=u,this.statusText=s||"",this.internal=c,o instanceof Error?(this.data=o.toString(),this.error=o):this.data=o}};function pp(u){return u!=null&&typeof u.status=="number"&&typeof u.statusText=="string"&&typeof u.internal=="boolean"&&"data"in u}function gp(u){let s=u.map(o=>o.route.path).filter(Boolean);return Dt(s)||"/"}var Jm=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function Fm(u,s){let o=u;if(typeof o!="string"||!is.test(o))return{absoluteURL:void 0,isExternal:!1,to:o};let c=o,m=!1;if(Jm)try{let f=new URL(window.location.href),v=Ym.test(o)?new URL(Ky(o,f.protocol)):new URL(o),S=ra(v.pathname,s);v.origin===f.origin&&S!=null?o=S+v.search+v.hash:m=!0}catch{Yt(!1,`<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:c,isExternal:m,to:o}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var Om=new URL("http://localhost");function Wm(u){if(u.createURL)return u.createURL("/");try{return new URL(u.createHref("/"),Om)}catch{return Om}}function Jc(u,s){return u.origin===s.origin&&(u.origin!=="null"||u.protocol===s.protocol&&u.host===s.host)}function bp(u,s){if(u.startsWith("//"))return!0;let o=s.protocol.toLowerCase();return u.toLowerCase().startsWith(o)?s.host===""||u.slice(o.length).startsWith("//"):!1}function $m(u,s,o,c){let m=null;try{m=u==null?null:new URL(u,o)}catch{}let f=new URL(s,o),v=m!=null&&!Jc(m,o),S=!Jc(f,o);if(c==="reject"){if(v||S)throw new Error("External navigation is not allowed")}else if(S&&(m==null||!bp(u,m)||!Jc(m,f)))throw new Error("External navigation is not allowed")}var Im=["POST","PUT","PATCH","DELETE"];new Set(Im);var xp=["GET",...Im];new Set(xp);var Sp=["about:","blob:","chrome:","chrome-untrusted:","content:","data:","devtools:","file:","filesystem:","javascript:"];function Ep(u){try{return Sp.includes(new URL(u).protocol)}catch{return!1}}var Xl=M.createContext(null);Xl.displayName="DataRouter";var xu=M.createContext(null);xu.displayName="DataRouterState";var Pm=M.createContext(!1);function Mp(){return M.useContext(Pm)}var eh=M.createContext({isTransitioning:!1});eh.displayName="ViewTransition";var Rp=M.createContext(new Map);Rp.displayName="Fetchers";var Tp=M.createContext(null);Tp.displayName="Await";var zt=M.createContext(null);zt.displayName="Navigation";var Xn=M.createContext(null);Xn.displayName="Location";var ca=M.createContext({outlet:null,matches:[],isDataRoute:!1});ca.displayName="Route";var rs=M.createContext(null);rs.displayName="RouteError";var th="REACT_ROUTER_ERROR",Ap="REDIRECT",wp="ROUTE_ERROR_RESPONSE";function _p(u){if(u.startsWith(`${th}:${Ap}:{`))try{let s=JSON.parse(u.slice(28));if(typeof s=="object"&&s&&typeof s.status=="number"&&typeof s.statusText=="string"&&typeof s.location=="string"&&typeof s.reloadDocument=="boolean"&&typeof s.replace=="boolean")return s}catch{}}function Cp(u){if(u.startsWith(`${th}:${wp}:{`))try{let s=JSON.parse(u.slice(40));if(typeof s=="object"&&s&&typeof s.status=="number"&&typeof s.statusText=="string")return new yp(s.status,s.statusText,s.data)}catch{}}function zp(u,{relative:s}={}){Oe(Gn(),"useHref() may be used only in the context of a <Router> component.");let{basename:o,navigator:c}=M.useContext(zt),{hash:m,pathname:f,search:v}=Vn(u,{relative:s}),S=f;return o!=="/"&&(S=f==="/"?o:Dt([o,f])),c.createHref({pathname:S,search:v,hash:m})}function Gn(){return M.useContext(Xn)!=null}function Xt(){return Oe(Gn(),"useLocation() may be used only in the context of a <Router> component."),M.useContext(Xn).location}var ah="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function lh(u){M.useContext(zt).static||M.useLayoutEffect(u)}function Np(){let{isDataRoute:u}=M.useContext(ca);return u?Vp():Op()}function Op(){Oe(Gn(),"useNavigate() may be used only in the context of a <Router> component.");let u=M.useContext(Xl),{basename:s,navigator:o}=M.useContext(zt),{matches:c}=M.useContext(ca),{pathname:m}=Xt(),f=JSON.stringify(Zm(c)),v=M.useRef(!1);return lh(()=>{v.current=!0}),M.useCallback((y,g={})=>{if(Yt(v.current,ah),!v.current)return;if(typeof y=="number"){o.go(y);return}let _=us(y,JSON.parse(f),m,g.relative==="path");u==null&&s!=="/"&&(_.pathname=_.pathname==="/"?s:Dt([s,_.pathname])),$m(typeof y=="string"?y:Hl(y),o.createHref(_),Wm(o),"reject"),(g.replace?o.replace:o.push)(_,g.state,g)},[s,o,f,m,u])}M.createContext(null);function Vn(u,{relative:s}={}){let{matches:o}=M.useContext(ca),{pathname:c}=Xt(),m=JSON.stringify(Zm(o));return M.useMemo(()=>us(u,JSON.parse(m),c,s==="path"),[u,m,c,s])}function Bp(u,s){return nh(u,s)}function nh(u,s,o){Oe(Gn(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:c}=M.useContext(zt),{matches:m}=M.useContext(ca),f=m[m.length-1],v=f?f.params:{},S=f?f.pathname:"/",y=f?f.pathnameBase:"/",g=f&&f.route;{let j=g&&g.path||"";uh(S,!g||j.endsWith("*")||j.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${S}" (under <Route path="${j}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${j}"> to <Route path="${j==="/"?"*":`${j}/*`}">.`)}let _=Xt(),R;if(s){let j=typeof s=="string"?kl(s):s;Oe(y==="/"||j.pathname?.startsWith(y),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${y}" but pathname "${j.pathname}" was given in the \`location\` prop.`),R=j}else R=_;let q=R.pathname||"/",K=q;if(y!=="/"){let j=y.replace(/^\//,"").split("/");K="/"+q.replace(/^\//,"").split("/").slice(j.length).join("/")}let U=o&&o.state.matches.length?o.state.matches.map(j=>Object.assign(j,{route:o.manifest[j.route.id]||j.route})):km(u,{pathname:K});Yt(g||U!=null,`No routes matched location "${R.pathname}${R.search}${R.hash}" `),Yt(U==null||U[U.length-1].route.element!==void 0||U[U.length-1].route.Component!==void 0||U[U.length-1].route.lazy!==void 0,`Matched leaf route at location "${R.pathname}${R.search}${R.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let Y=Hp(U&&U.map(j=>Object.assign({},j,{params:Object.assign({},v,j.params),pathname:Dt([y,c.encodeLocation?c.encodeLocation(j.pathname.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:j.pathname]),pathnameBase:j.pathnameBase==="/"?y:Dt([y,c.encodeLocation?c.encodeLocation(j.pathnameBase.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:j.pathnameBase])})),m,o);return s&&Y?M.createElement(Xn.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",mask:void 0,...R},navigationType:"POP"}},Y):Y}function Dp(){let u=Gp(),s=pp(u)?`${u.status} ${u.statusText}`:u instanceof Error?u.message:JSON.stringify(u),o=u instanceof Error?u.stack:null,c="rgba(200,200,200, 0.5)",m={padding:"0.5rem",backgroundColor:c},f={padding:"2px 4px",backgroundColor:c},v=null;return console.error("Error handled by React Router default ErrorBoundary:",u),v=M.createElement(M.Fragment,null,M.createElement("p",null,"💿 Hey developer 👋"),M.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",M.createElement("code",{style:f},"ErrorBoundary")," or"," ",M.createElement("code",{style:f},"errorElement")," prop on your route.")),M.createElement(M.Fragment,null,M.createElement("h2",null,"Unexpected Application Error!"),M.createElement("h3",{style:{fontStyle:"italic"}},s),o?M.createElement("pre",{style:m},o):null,v)}var Lp=M.createElement(Dp,null),ih=class extends M.Component{constructor(u){super(u),this.state={location:u.location,revalidation:u.revalidation,error:u.error}}static getDerivedStateFromError(u){return{error:u}}static getDerivedStateFromProps(u,s){return s.location!==u.location||s.revalidation!=="idle"&&u.revalidation==="idle"?{error:u.error,location:u.location,revalidation:u.revalidation}:{error:u.error!==void 0?u.error:s.error,location:s.location,revalidation:u.revalidation||s.revalidation}}componentDidCatch(u,s){this.props.onError?this.props.onError(u,s):console.error("React Router caught the following error during render",u)}render(){let u=this.state.error;if(this.context&&typeof u=="object"&&u&&"digest"in u&&typeof u.digest=="string"){const o=Cp(u.digest);o&&(u=o)}let s=u!==void 0?M.createElement(ca.Provider,{value:this.props.routeContext},M.createElement(rs.Provider,{value:u,children:this.props.component})):this.props.children;return this.context?M.createElement(jp,{error:u},s):s}};ih.contextType=Pm;var Fc=new WeakMap;function jp({children:u,error:s}){let{basename:o,navigator:c}=M.useContext(zt);if(typeof s=="object"&&s&&"digest"in s&&typeof s.digest=="string"){let m=_p(s.digest);if(m){let f=Fc.get(s);if(f)throw f;let v=Fm(m.location,o),S=v.absoluteURL||v.to;if($m(m.location,S,Wm(c),"allow-explicit"),Ep(S))throw new Error("Invalid redirect location");if(Jm&&!Fc.get(s))if(v.isExternal||m.reloadDocument)window.location.href=S;else{const y=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(v.to,{replace:m.replace}));throw Fc.set(s,y),y}return M.createElement("meta",{httpEquiv:"refresh",content:`0;url=${S}`})}}return u}function qp({routeContext:u,match:s,children:o}){let c=M.useContext(Xl);return c&&c.static&&c.staticContext&&(s.route.errorElement||s.route.ErrorBoundary)&&(c.staticContext._deepestRenderedBoundaryId=s.route.id),M.createElement(ca.Provider,{value:u},o)}function Hp(u,s=[],o){let c=o?.state;if(u==null){if(!c)return null;if(c.errors)u=c.matches;else if(s.length===0&&!c.initialized&&c.matches.length>0)u=c.matches;else return null}let m=u,f=c?.errors;if(f!=null){let _=m.findIndex(R=>R.route.id&&f?.[R.route.id]!==void 0);Oe(_>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(f).join(",")}`),m=m.slice(0,Math.min(m.length,_+1))}let v=!1,S=-1;if(o&&c){v=c.renderFallback;for(let _=0;_<m.length;_++){let R=m[_];if((R.route.HydrateFallback||R.route.hydrateFallbackElement)&&(S=_),R.route.id){let{loaderData:q,errors:K}=c,U=R.route.loader&&!q.hasOwnProperty(R.route.id)&&(!K||K[R.route.id]===void 0);if(R.route.lazy||U){o.isStatic&&(v=!0),S>=0?m=m.slice(0,S+1):m=[m[0]];break}}}}let y=o?.onError,g=c&&y?(_,R)=>{y(_,{location:c.location,params:c.matches?.[0]?.params??{},pattern:gp(c.matches),errorInfo:R})}:void 0;return m.reduceRight((_,R,q)=>{let K,U=!1,Y=null,j=null;c&&(K=f&&R.route.id?f[R.route.id]:void 0,Y=R.route.errorElement||Lp,v&&(S<0&&q===0?(uh("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),U=!0,j=null):S===q&&(U=!0,j=R.route.hydrateFallbackElement||null)));let H=s.concat(m.slice(0,q+1)),X=()=>{let Q;return K?Q=Y:U?Q=j:R.route.Component?Q=M.createElement(R.route.Component,null):R.route.element?Q=R.route.element:Q=_,M.createElement(qp,{match:R,routeContext:{outlet:_,matches:H,isDataRoute:c!=null},children:Q})};return c&&(R.route.ErrorBoundary||R.route.errorElement||q===0)?M.createElement(ih,{location:c.location,revalidation:c.revalidation,component:Y,error:K,children:X(),routeContext:{outlet:null,matches:H,isDataRoute:!0},onError:g}):X()},null)}function cs(u){return`${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Up(u){let s=M.useContext(Xl);return Oe(s,cs(u)),s}function Yp(u){let s=M.useContext(xu);return Oe(s,cs(u)),s}function kp(u){let s=M.useContext(ca);return Oe(s,cs(u)),s}function ss(u){let s=kp(u),o=s.matches[s.matches.length-1];return Oe(o.route.id,`${u} can only be used on routes that contain a unique "id"`),o.route.id}function Xp(){return ss("useRouteId")}function Gp(){let u=M.useContext(rs),s=Yp("useRouteError"),o=ss("useRouteError");return u!==void 0?u:s.errors?.[o]}function Vp(){let{router:u}=Up("useNavigate"),s=ss("useNavigate"),o=M.useRef(!1);return lh(()=>{o.current=!0}),M.useCallback(async(m,f={})=>{Yt(o.current,ah),o.current&&(typeof m=="number"?await u.navigate(m):await u.navigate(m,{fromRouteId:s,...f}))},[u,s])}var Bm={};function uh(u,s,o){!s&&!Bm[u]&&(Bm[u]=!0,Yt(!1,o))}M.memo(Qp);function Qp({routes:u,manifest:s,future:o,state:c,isStatic:m,onError:f}){return nh(u,void 0,{manifest:s,state:c,isStatic:m,onError:f})}function rh(u){Oe(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function Zp({basename:u="/",children:s=null,location:o,navigationType:c="POP",navigator:m,static:f=!1,useTransitions:v}){Oe(!Gn(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let S=u.replace(/^\/*/,"/"),y=M.useMemo(()=>({basename:S,navigator:m,static:f,useTransitions:v,future:{}}),[S,m,f,v]);typeof o=="string"&&(o=kl(o));let{pathname:g="/",search:_="",hash:R="",state:q=null,key:K="default",mask:U}=o,Y=M.useMemo(()=>{let j=ra(g,S);return j==null?null:{location:{pathname:j,search:_,hash:R,state:q,key:K,mask:U},navigationType:c}},[S,g,_,R,q,K,c,U]);return Yt(Y!=null,`<Router basename="${S}"> is not able to match the URL "${g}${_}${R}" because it does not start with the basename, so the <Router> won't render anything.`),Y==null?null:M.createElement(zt.Provider,{value:y},M.createElement(Xn.Provider,{children:s,value:Y}))}function Kp({children:u,location:s}){return Bp(ts(u),s)}function ts(u,s=[]){let o=[];return M.Children.forEach(u,(c,m)=>{if(!M.isValidElement(c))return;let f=[...s,m];if(c.type===M.Fragment){o.push.apply(o,ts(c.props.children,f));return}Oe(c.type===rh,`[${typeof c.type=="string"?c.type:c.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),Oe(!c.props.index||!c.props.children,"An index route cannot have child routes.");let v={id:c.props.id||f.join("-"),caseSensitive:c.props.caseSensitive,element:c.props.element,Component:c.props.Component,index:c.props.index,path:c.props.path,middleware:c.props.middleware,loader:c.props.loader,action:c.props.action,hydrateFallbackElement:c.props.hydrateFallbackElement,HydrateFallback:c.props.HydrateFallback,errorElement:c.props.errorElement,ErrorBoundary:c.props.ErrorBoundary,hasErrorBoundary:c.props.hasErrorBoundary===!0||c.props.ErrorBoundary!=null||c.props.errorElement!=null,shouldRevalidate:c.props.shouldRevalidate,handle:c.props.handle,lazy:c.props.lazy};c.props.children&&(v.children=ts(c.props.children,f)),o.push(v)}),o}var hu="get",vu="application/x-www-form-urlencoded";function Su(u){return typeof HTMLElement<"u"&&u instanceof HTMLElement}function Jp(u){return Su(u)&&u.tagName.toLowerCase()==="button"}function Fp(u){return Su(u)&&u.tagName.toLowerCase()==="form"}function Wp(u){return Su(u)&&u.tagName.toLowerCase()==="input"}function $p(u){return!!(u.metaKey||u.altKey||u.ctrlKey||u.shiftKey)}function Ip(u,s){return u.button===0&&(!s||s==="_self")&&!$p(u)}var fu=null;function Pp(){if(fu===null)try{new FormData(document.createElement("form"),0),fu=!1}catch{fu=!0}return fu}var e0=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function Wc(u){return u!=null&&!e0.has(u)?(Yt(!1,`"${u}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${vu}"`),null):u}function t0(u,s){let o,c,m,f,v;if(Fp(u)){let S=u.getAttribute("action");c=S?ra(S,s):null,o=u.getAttribute("method")||hu,m=Wc(u.getAttribute("enctype"))||vu,f=new FormData(u)}else if(Jp(u)||Wp(u)&&(u.type==="submit"||u.type==="image")){let S=u.form;if(S==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let y=u.getAttribute("formaction")||S.getAttribute("action");if(c=y?ra(y,s):null,o=u.getAttribute("formmethod")||S.getAttribute("method")||hu,m=Wc(u.getAttribute("formenctype"))||Wc(S.getAttribute("enctype"))||vu,f=new FormData(S,u),!Pp()){let{name:g,type:_,value:R}=u;if(_==="image"){let q=g?`${g}.`:"";f.append(`${q}x`,"0"),f.append(`${q}y`,"0")}else g&&f.append(g,R)}}else{if(Su(u))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');o=hu,c=null,m=vu,v=u}return f&&m==="text/plain"&&(v=f,f=void 0),{action:c,method:o.toLowerCase(),encType:m,formData:f,body:v}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function os(u,s){if(u===!1||u===null||typeof u>"u")throw new Error(s)}function ch(u,s,o,c){let m=typeof u=="string"?new URL(u,typeof window>"u"?"server://singlefetch/":window.location.origin):u;return o?m.pathname.endsWith("/")?m.pathname=`${m.pathname}_.${c}`:m.pathname=`${m.pathname}.${c}`:m.pathname==="/"?m.pathname=`_root.${c}`:s&&ra(m.pathname,s)==="/"?m.pathname=`${Ul(s)}/_root.${c}`:m.pathname=`${Ul(m.pathname)}.${c}`,m}async function a0(u,s){if(u.id in s)return s[u.id];try{let o=await import(u.module);return s[u.id]=o,o}catch(o){return console.error(`Error loading route module \`${u.module}\`, reloading page...`),console.error(o),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function l0(u){return u==null?!1:u.href==null?u.rel==="preload"&&typeof u.imageSrcSet=="string"&&typeof u.imageSizes=="string":typeof u.rel=="string"&&typeof u.href=="string"}async function n0(u,s,o){let c=await Promise.all(u.map(async m=>{let f=s.routes[m.route.id];if(f){let v=await a0(f,o);return v.links?v.links():[]}return[]}));return c0(c.flat(1).filter(l0).filter(m=>m.rel==="stylesheet"||m.rel==="preload").map(m=>m.rel==="stylesheet"?{...m,rel:"prefetch",as:"style"}:{...m,rel:"prefetch"}))}function Dm(u,s,o,c,m,f){let v=(y,g)=>o[g]?y.route.id!==o[g].route.id:!0,S=(y,g)=>o[g].pathname!==y.pathname||o[g].route.path?.endsWith("*")&&o[g].params["*"]!==y.params["*"];return f==="assets"?s.filter((y,g)=>v(y,g)||S(y,g)):f==="data"?s.filter((y,g)=>{let _=c.routes[y.route.id];if(!_||!_.hasLoader)return!1;if(v(y,g)||S(y,g))return!0;if(y.route.shouldRevalidate){let R=y.route.shouldRevalidate({currentUrl:new URL(m.pathname+m.search+m.hash,window.origin),currentParams:o[0]?.params||{},nextUrl:new URL(u,window.origin),nextParams:y.params,defaultShouldRevalidate:!0});if(typeof R=="boolean")return R}return!0}):[]}function i0(u,s,{includeHydrateFallback:o}={}){return u0(u.map(c=>{let m=s.routes[c.route.id];if(!m)return[];let f=[m.module];return m.clientActionModule&&(f=f.concat(m.clientActionModule)),m.clientLoaderModule&&(f=f.concat(m.clientLoaderModule)),o&&m.hydrateFallbackModule&&(f=f.concat(m.hydrateFallbackModule)),m.imports&&(f=f.concat(m.imports)),f}).flat(1))}function u0(u){return[...new Set(u)]}function r0(u){let s={},o=Object.keys(u).sort();for(let c of o)s[c]=u[c];return s}function c0(u,s){let o=new Set;return new Set(s),u.reduce((c,m)=>{let f=JSON.stringify(r0(m));return o.has(f)||(o.add(f),c.push({key:f,link:m})),c},[])}function fs(){let u=M.useContext(Xl);return os(u,"You must render this element inside a <DataRouterContext.Provider> element"),u}function s0(){let u=M.useContext(xu);return os(u,"You must render this element inside a <DataRouterStateContext.Provider> element"),u}var ds=M.createContext(void 0);ds.displayName="FrameworkContext";function Eu(){let u=M.useContext(ds);return os(u,"You must render this element inside a <HydratedRouter> element"),u}function o0(u,s){let o=M.useContext(ds),[c,m]=M.useState(!1),[f,v]=M.useState(!1),{onFocus:S,onBlur:y,onMouseEnter:g,onMouseLeave:_,onTouchStart:R}=s,q=M.useRef(null);M.useEffect(()=>{if(u==="render"&&v(!0),u==="viewport"){let Y=H=>{H.forEach(X=>{v(X.isIntersecting)})},j=new IntersectionObserver(Y,{threshold:.5});return q.current&&j.observe(q.current),()=>{j.disconnect()}}},[u]),M.useEffect(()=>{if(c){let Y=setTimeout(()=>{v(!0)},100);return()=>{clearTimeout(Y)}}},[c]);let K=()=>{m(!0)},U=()=>{m(!1),v(!1)};return o?u!=="intent"?[f,q,{}]:[f,q,{onFocus:Yn(S,K),onBlur:Yn(y,U),onMouseEnter:Yn(g,K),onMouseLeave:Yn(_,U),onTouchStart:Yn(R,K)}]:[!1,q,{}]}function Yn(u,s){return o=>{u&&u(o),o.defaultPrevented||s(o)}}function f0({page:u,...s}){let o=Mp(),{nonce:c}=Eu(),{router:m}=fs(),f=M.useMemo(()=>km(m.routes,u,m.basename),[m.routes,u,m.basename]);return f?(s.nonce==null&&c&&(s={...s,nonce:c}),o?M.createElement(m0,{page:u,matches:f,...s}):M.createElement(h0,{page:u,matches:f,...s})):null}function d0(u){let{manifest:s,routeModules:o}=Eu(),[c,m]=M.useState([]);return M.useEffect(()=>{let f=!1;return n0(u,s,o).then(v=>{f||m(v)}),()=>{f=!0}},[u,s,o]),c}function m0({page:u,matches:s,...o}){let c=Xt(),{future:m}=Eu(),{basename:f}=fs(),v=M.useMemo(()=>{if(u===c.pathname+c.search+c.hash)return[];let S=ch(u,f,m.v8_trailingSlashAwareDataRequests,"rsc"),y=!1,g=[];for(let _ of s)typeof _.route.shouldRevalidate=="function"?y=!0:g.push(_.route.id);return y&&g.length>0&&S.searchParams.set("_routes",g.join(",")),[S.pathname+S.search]},[f,m.v8_trailingSlashAwareDataRequests,u,c,s]);return M.createElement(M.Fragment,null,v.map(S=>M.createElement("link",{key:S,rel:"prefetch",as:"fetch",href:S,...o})))}function h0({page:u,matches:s,...o}){let c=Xt(),{future:m,manifest:f,routeModules:v}=Eu(),{basename:S}=fs(),{loaderData:y,matches:g}=s0(),_=M.useMemo(()=>Dm(u,s,g,f,c,"data"),[u,s,g,f,c]),R=M.useMemo(()=>Dm(u,s,g,f,c,"assets"),[u,s,g,f,c]),q=M.useMemo(()=>{if(u===c.pathname+c.search+c.hash)return[];let Y=new Set,j=!1;if(s.forEach(X=>{let Q=f.routes[X.route.id];!Q||!Q.hasLoader||(!_.some(Z=>Z.route.id===X.route.id)&&X.route.id in y&&v[X.route.id]?.shouldRevalidate||Q.hasClientLoader?j=!0:Y.add(X.route.id))}),Y.size===0)return[];let H=ch(u,S,m.v8_trailingSlashAwareDataRequests,"data");return j&&Y.size>0&&H.searchParams.set("_routes",s.filter(X=>Y.has(X.route.id)).map(X=>X.route.id).join(",")),[H.pathname+H.search]},[S,m.v8_trailingSlashAwareDataRequests,y,c,f,_,s,u,v]),K=M.useMemo(()=>i0(R,f),[R,f]),U=d0(R);return M.createElement(M.Fragment,null,q.map(Y=>M.createElement("link",{key:Y,rel:"prefetch",as:"fetch",href:Y,...o})),K.map(Y=>M.createElement("link",{key:Y,rel:"modulepreload",href:Y,...o})),U.map(({key:Y,link:j})=>M.createElement("link",{key:Y,nonce:o.nonce,...j,crossOrigin:j.crossOrigin??o.crossOrigin})))}function v0(...u){return s=>{u.forEach(o=>{typeof o=="function"?o(s):o!=null&&(o.current=s)})}}var y0=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{y0&&(window.__reactRouterVersion="7.18.4")}catch{}function p0({basename:u,children:s,useTransitions:o,window:c}){let m=M.useRef();m.current==null&&(m.current=Jy({window:c,v5Compat:!0}));let f=m.current,[v,S]=M.useState({action:f.action,location:f.location}),y=M.useCallback(g=>{o===!1?S(g):M.startTransition(()=>S(g))},[o]);return M.useLayoutEffect(()=>f.listen(y),[f,y]),M.createElement(Zp,{basename:u,children:s,location:v.location,navigationType:v.action,navigator:f,useTransitions:o})}var sh=M.forwardRef(function({onClick:s,discover:o="render",prefetch:c="none",relative:m,reloadDocument:f,replace:v,mask:S,state:y,target:g,to:_,preventScrollReset:R,viewTransition:q,defaultShouldRevalidate:K,...U},Y){let{basename:j,navigator:H,useTransitions:X}=M.useContext(zt),Q=typeof _=="string"&&is.test(_),Z=Fm(_,j);_=Z.to;let ue=zp(_,{relative:m}),ge=Xt(),$=null;if(S){let se=us(S,[],ge.mask?ge.mask.pathname:"/",!0);j!=="/"&&(se.pathname=se.pathname==="/"?j:Dt([j,se.pathname])),$=H.createHref(se)}let[Se,Ne,Ue]=o0(c,U),Ye=S0(_,{replace:v,mask:S,state:y,target:g,preventScrollReset:R,relative:m,viewTransition:q,defaultShouldRevalidate:K,useTransitions:X});function G(se){s&&s(se),se.defaultPrevented||Ye(se)}let te=!(Z.isExternal||f),ce=M.createElement("a",{...U,...Ue,href:(te?$:void 0)||Z.absoluteURL||ue,onClick:te?G:s,ref:v0(Y,Ne),target:g,"data-discover":!Q&&o==="render"?"true":void 0});return Se&&!Q?M.createElement(M.Fragment,null,ce,M.createElement(f0,{page:ue})):ce});sh.displayName="Link";var g0=M.forwardRef(function({"aria-current":s="page",caseSensitive:o=!1,className:c="",end:m=!1,style:f,to:v,viewTransition:S,children:y,...g},_){let R=Vn(v,{relative:g.relative}),q=Xt(),K=M.useContext(xu),{navigator:U,basename:Y}=M.useContext(zt),j=K!=null&&A0(R)&&S===!0,H=U.encodeLocation?U.encodeLocation(R).pathname:R.pathname,X=q.pathname,Q=K&&K.navigation&&K.navigation.location?K.navigation.location.pathname:null;o||(X=X.toLowerCase(),Q=Q?Q.toLowerCase():null,H=H.toLowerCase()),Q&&Y&&(Q=ra(Q,Y)||Q);const Z=H!=="/"&&H.endsWith("/")?H.length-1:H.length;let ue=X===H||!m&&X.startsWith(H)&&X.charAt(Z)==="/",ge=Q!=null&&(Q===H||!m&&Q.startsWith(H)&&Q.charAt(H.length)==="/"),$={isActive:ue,isPending:ge,isTransitioning:j},Se=ue?s:void 0,Ne;typeof c=="function"?Ne=c($):Ne=[c,ue?"active":null,ge?"pending":null,j?"transitioning":null].filter(Boolean).join(" ");let Ue=typeof f=="function"?f($):f;return M.createElement(sh,{...g,"aria-current":Se,className:Ne,ref:_,style:Ue,to:v,viewTransition:S},typeof y=="function"?y($):y)});g0.displayName="NavLink";var b0=M.forwardRef(({discover:u="render",fetcherKey:s,navigate:o,reloadDocument:c,replace:m,state:f,method:v=hu,action:S,onSubmit:y,relative:g,preventScrollReset:_,viewTransition:R,defaultShouldRevalidate:q,...K},U)=>{let{useTransitions:Y}=M.useContext(zt),j=R0(),H=T0(S,{relative:g}),X=v.toLowerCase()==="get"?"get":"post",Q=typeof S=="string"&&is.test(S),Z=ue=>{if(y&&y(ue),ue.defaultPrevented)return;ue.preventDefault();let ge=ue.nativeEvent.submitter,$=ge?.getAttribute("formmethod")||v,Se=()=>j(ge||ue.currentTarget,{fetcherKey:s,method:$,navigate:o,replace:m,state:f,relative:g,preventScrollReset:_,viewTransition:R,defaultShouldRevalidate:q});Y&&o!==!1?M.startTransition(()=>Se()):Se()};return M.createElement("form",{ref:U,method:X,action:H,onSubmit:c?y:Z,...K,"data-discover":!Q&&u==="render"?"true":void 0})});b0.displayName="Form";function x0(u){return`${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function oh(u){let s=M.useContext(Xl);return Oe(s,x0(u)),s}function S0(u,{target:s,replace:o,mask:c,state:m,preventScrollReset:f,relative:v,viewTransition:S,defaultShouldRevalidate:y,useTransitions:g}={}){let _=Np(),R=Xt(),q=Vn(u,{relative:v});return M.useCallback(K=>{if(Ip(K,s)){K.preventDefault();let U=o!==void 0?o:Hl(R)===Hl(q),Y=()=>_(u,{replace:U,mask:c,state:m,preventScrollReset:f,relative:v,viewTransition:S,defaultShouldRevalidate:y});g?M.startTransition(()=>Y()):Y()}},[R,_,q,o,c,m,s,u,f,v,S,y,g])}var E0=0,M0=()=>`__${String(++E0)}__`;function R0(){let{router:u}=oh("useSubmit"),{basename:s}=M.useContext(zt),o=Xp(),c=u.fetch,m=u.navigate;return M.useCallback(async(f,v={})=>{let{action:S,method:y,encType:g,formData:_,body:R}=t0(f,s);if(v.navigate===!1){let q=v.fetcherKey||M0();await c(q,o,v.action||S,{defaultShouldRevalidate:v.defaultShouldRevalidate,preventScrollReset:v.preventScrollReset,formData:_,body:R,formMethod:v.method||y,formEncType:v.encType||g,flushSync:v.flushSync})}else await m(v.action||S,{defaultShouldRevalidate:v.defaultShouldRevalidate,preventScrollReset:v.preventScrollReset,formData:_,body:R,formMethod:v.method||y,formEncType:v.encType||g,replace:v.replace,state:v.state,fromRouteId:o,flushSync:v.flushSync,viewTransition:v.viewTransition})},[c,m,s,o])}function T0(u,{relative:s}={}){let{basename:o}=M.useContext(zt),c=M.useContext(ca);Oe(c,"useFormAction must be used inside a RouteContext");let[m]=c.matches.slice(-1),f={...Vn(u||".",{relative:s})},v=Xt();if(u==null){f.search=v.search;let S=new URLSearchParams(f.search),y=S.getAll("index");if(y.some(_=>_==="")){S.delete("index"),y.filter(R=>R).forEach(R=>S.append("index",R));let _=S.toString();f.search=_?`?${_}`:""}}return(!u||u===".")&&m.route.index&&(f.search=f.search?f.search.replace(/^\?/,"?index&"):"?index"),o!=="/"&&(f.pathname=f.pathname==="/"?o:Dt([o,f.pathname])),Hl(f)}function A0(u,{relative:s}={}){let o=M.useContext(eh);Oe(o!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:c}=oh("useViewTransitionState"),m=Vn(u,{relative:s});if(!o.isTransitioning)return!1;let f=ra(o.currentLocation.pathname,c)||o.currentLocation.pathname,v=ra(o.nextLocation.pathname,c)||o.nextLocation.pathname;return gu(m.pathname,v)!=null||gu(m.pathname,f)!=null}class kn extends Error{retryable;constructor(s,o=!0){super(s),this.name="ApiRequestError",this.retryable=o}}function w0(u){if(!u||typeof u!="object"||!("detail"in u))return"";const s=u.detail;return typeof s=="string"?s.trim().slice(0,1200):Array.isArray(s)?s.map(o=>o&&typeof o.msg=="string"?o.msg:"").filter(Boolean).join("; ").slice(0,1200):""}async function ms(u){let s;try{s=await u.json()}catch{if(u.ok)throw new kn("The service returned unreadable data. Please try again.")}if(u.ok)return s;const o=w0(s),c=`HTTP ${u.status}`;if(u.status===503&&/reembed_all\.py|model.*index|index.*model|vector dimension.*index/.test(o))throw new kn(`Retrieval configuration error (${c}):${o} Please contact the maintainer; retrying will not fix this configuration issue.`,!1);if(u.status===429)throw new kn(`Too many requests (${c}),Please wait and try again.${o?` ${o}`:""}`);const m=u.status>=500||u.status===408,f=m?"The service is temporarily unavailable. Please try again later":"The request could not be completed. Check your input or access permissions";throw new kn(`${f}(${c}).${o?` ${o}`:""}`,m)}function bu(u){return u instanceof kn?{message:u.message,retryable:u.retryable}:u instanceof TypeError?{message:"Network connection failed. Check your network or confirm the service is running, then retry.",retryable:!0}:{message:u instanceof Error?u.message:"Request failed. Please try again.",retryable:!0}}function _0(u,s,o){let c=!1;const m=[],f=new Set,v=new Set,S=new Map,y=new AbortController,g=H=>(X,Q,Z)=>{c||(H.addEventListener(X,Q,Z),m.push(()=>H.removeEventListener(X,Q,Z)))},_=(H,X=0)=>{if(c)return 0;const Q=window.setTimeout(()=>{f.delete(Q),c||H()},X);return f.add(Q),Q},R=H=>{if(c)return 0;const X=window.requestAnimationFrame(Q=>{v.delete(X),c||H(Q)});return v.add(X),X},q=new Proxy(window,{get(H,X){if(X==="addEventListener")return g(window);if(X==="setTimeout")return _;if(X==="requestAnimationFrame")return R;const Q=Reflect.get(H,X,H);return typeof Q=="function"&&!String(X).startsWith("__")?Q.bind(H):Q},set(H,X,Q){return c?!0:(S.has(X)||S.set(X,Object.getOwnPropertyDescriptor(H,X)),Reflect.set(H,X,Q,H))}}),K=new Proxy(document,{get(H,X){if(X==="addEventListener")return g(document);if(X==="querySelector")return u.querySelector.bind(u);if(X==="querySelectorAll")return u.querySelectorAll.bind(u);if(X==="getElementById")return Z=>u.querySelector(`#${CSS.escape(Z)}`);const Q=Reflect.get(H,X,H);return typeof Q=="function"?Q.bind(H):Q}}),U=(H,X)=>window.fetch(H,{...X,signal:y.signal}),Y=new Function("window","document","setTimeout","requestAnimationFrame","addEventListener","fetch","searchSession","readApiResponse","describeApiError",s.join(`
;
`));function j(){c=!0,y.abort(),m.forEach(H=>H()),f.forEach(H=>window.clearTimeout(H)),v.forEach(H=>window.cancelAnimationFrame(H)),S.forEach((H,X)=>{H?Object.defineProperty(window,X,H):Reflect.deleteProperty(window,X)})}try{Y(q,K,_,R,g(window),U,o,ms,bu)}catch(H){throw j(),H}return j}const C0=""+new URL("home-hero-znjhObZF.jpg",import.meta.url).href;var Lm=Object.freeze,z0=Object.defineProperty,N0=(u,s)=>Lm(z0(u,"raw",{value:Lm(s||u.slice())})),jm;const O0={current:null},B0=String.raw(jm||(jm=N0([`
<div id="veil" aria-hidden="true"><i class="ring"></i><span class="vlogo">
  <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
    <circle cx="13.25" cy="8.4" r="8.8" fill="#e8edf5"/>
    <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#e8edf5" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
  </svg>Code-X-Ray</span></div>
<div id="view-home">
<div class="frame">
  <img class="sky" id="sky" aria-hidden="true" alt="" draggable="false"
       src="`,`" />
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="skyTurb" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence id="skyTurbN" type="fractalNoise" baseFrequency="0.006 0.016" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G">
      <animate attributeName="scale" values="2.4;3.6;2.4" dur="9s" repeatCount="indefinite"/>
    </feDisplacementMap>
  </filter>
</svg>
<div id="mirror" aria-hidden="true">
  <div class="m-ring"></div>
  <div class="m-ring2"></div>
  <div class="m-gloss"></div>
  <div class="m-sweep"></div>
  <div class="m-touch" id="m-touch"></div>
</div>
<div class="hero-scrim" aria-hidden="true"></div>
<div class="silver-grad" aria-hidden="true"></div>
<canvas id="fx-particles" aria-hidden="true"></canvas>
  <div class="veil"></div>

  <header class="bar" data-open="false">
    <a class="brand" href="#home" aria-label="Code-X-Ray — home">
      <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
        <circle cx="13.25" cy="8.4" r="8.8" fill="#000"/>
        <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#000" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
      </svg>
      <span class="word">Code-X-Ray</span>
    </a>

    <nav class="links" aria-label="Primary">
      <span class="seg">
        <a href="#home" aria-current="page">Home</a>
        <a href="#search">Browse</a>
        <a href="#/learn">Learn</a>
      </span>
    </nav>

    <div class="actions">

      <a class="icon-btn" href="https://github.com/Cissy4mA/Code-X-ray_Numpy-ml" target="_blank" rel="noopener" aria-label="GitHub">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
      </a>
      <button class="menu" id="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu-sheet">
        <svg viewBox="0 0 20 14" fill="none" aria-hidden="true">
          <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
      <nav class="sheet" id="menu-sheet" aria-label="Menu">
        <a href="#home" aria-current="page">Home</a>
        <a href="#search">Browse</a>
        <a href="#/learn">Learn</a>
      </nav>
    </div>
  </header>

  <div class="screen">
    <main class="hero">
      <a class="pill" href="#search">
        <span class="chip">NumPy-ML</span>
        <span class="pill-label">From code retrieval to understanding</span>
        <svg class="arr" viewBox="0 0 9.5 8" fill="none" aria-hidden="true">
          <path d="M0.7 4H8.8M5.6 0.75 8.85 4 5.6 7.25" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>

      <h1>
        <span class="ln"><span class="ln-i">Code-X-Ray</span></span>
        <span class="ln"><span class="ln-i">ML Code Retrieval &amp; Learning</span></span>
      </h1>

      <p>A machine learning code retrieval and learning platform for NumPy-ML.</p>

      <form class="import-bar" id="import-form" action="#import" role="search">
        <svg class="imp-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.6" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10.4 10.4 14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <input id="import-input" type="text" autocomplete="off" spellcheck="false"
               placeholder="e.g. logistic regression"
               aria-label="Search an algorithm">
        <button class="imp-btn" id="import-btn" type="submit">X-Ray</button>
      </form>

      <div class="chip-row" aria-label="Sample kernel modules">
        <span class="chip-label">Indexed modules</span>
        <button class="kchip" type="button">bandits</button>
        <button class="kchip" type="button">gmm</button>
        <button class="kchip" type="button">hmm</button>
        <button class="kchip" type="button">lda</button>
        <button class="kchip" type="button">neural_nets</button>
        <button class="kchip" type="button">trees</button>
        <button class="kchip" type="button">rl_models</button>
      </div>

    </main>
  </div>
</div>
</div>

<div id="view-search" style="display:none">

<canvas id="fx2-particles" aria-hidden="true"></canvas>

<header class="s-top">
  <a class="s-brand" href="#home" aria-label="Code-X-Ray — home">
    <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
      <circle cx="13.25" cy="8.4" r="8.8" fill="#07090f"/>
      <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#07090f" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
    </svg>
    Code-X-Ray
  </a>
  <nav class="seg s-seg" aria-label="Primary">
    <a href="#home">Home</a>
    <a href="#module-search" aria-current="page">Browse</a>
    <a href="#/learn">Learn</a>
  </nav>
  <nav class="s-sub" aria-label="Sections">
    <a href="#module-search">1. Find a module</a>
    <a href="#algo-search">2. Find an algorithm</a>
  </nav>
</header>

<main class="wrap">
  <h1 class="page-title">Find your module. Then your algorithm.</h1>
  <p class="page-sub">Search NumPy-ML by topic or algorithm name, then narrow the results to a module.</p>
  <ol class="search-flow" aria-label="Retrieval and learning steps"><li>1. Find a module</li><li aria-hidden="true">&rarr;</li><li>2. Find an algorithm</li><li aria-hidden="true">&rarr;</li><li>3. Open the Learn Page</li></ol>

  <div class="grid">
    <!-- ============ 3.1 Module Search ============ -->
    <section class="panel" id="module-search">
      <h2>Step 1 &middot; Find a module</h2>
      <p class="desc">Find a module by algorithm name, topic or task.</p>
      <p class="rowlabel">What do you want to learn?</p>
      <div class="controls">
        <input id="mq" type="text" placeholder="e.g. reinforcement learning / neural networks / probabilistic models" aria-label="Module search query">
        <button class="sbtn" id="mgo" type="button">Search modules</button>
      </div>
      <details class="search-options"><summary>Search options</summary><label>Number of module results
        <select id="mk" aria-label="Number of module results">
          <option value="1" selected>Top-K 1</option>
          <option value="2">Top-K 2</option>
          <option value="3">Top-K 3</option>
        </select>
      </label></details>
      <p class="try">Try: <button type="button" class="tchip">reinforcement learning</button><button type="button" class="tchip">neural networks</button><button type="button" class="tchip">bandits</button></p>
      <div class="results" id="mres" aria-live="polite"></div>
    </section>

    <!-- ============ 3.2 Algorithm Search ============ -->
    <section class="panel" id="algo-search" data-ready="false">
      <h2>Step 2 &middot; Find an algorithm</h2>
      <p class="desc">Your query is carried over. Refine it to search within the selected module.</p>
      <p class="rowlabel" id="module-context" aria-live="polite">Select a module in Step 1 to continue.</p>
      <button class="sbtn change-module" id="change-module" type="button" hidden>Change module &uarr;</button>
      <div class="controls">
        <input id="aq" type="text" placeholder="Your query carries over after selecting a module" aria-label="Algorithm search query" disabled>
        <select id="amod" aria-label="Selected module" hidden disabled>
          <option value="" selected>Select a module first</option>
        </select>
        <button class="sbtn" id="ago" type="button" disabled>Search algorithms</button>
      </div>
      <details class="search-options"><summary>Search options</summary><label>Number of algorithm results
        <select id="ak" aria-label="Number of algorithm results" disabled>
          <option value="1">Top-K 1</option>
          <option value="2">Top-K 2</option>
          <option value="3" selected>Top-K 3</option>
          <option value="4">Top-K 4</option>
          <option value="5">Top-K 5</option>
          <option value="6">Top-K 6</option>
          <option value="7">Top-K 7</option>
          <option value="8">Top-K 8</option>
          <option value="9">Top-K 9</option>
          <option value="10">Top-K 10</option>
        </select>
      </label></details>
      <p class="try">Refine your query to search within the selected module.</p>
      <div id="score-summary"></div>
      <div id="bubble-field" class="bubble-field" role="group" aria-label="Algorithm relevance bubbles" hidden></div>
      <div class="results" id="ares" aria-live="polite"><div class="empty">First find and select a module. Algorithm results will appear here.</div></div>
    </section>
  </div>
</main>

</div>

<script>
(function(){
  var root=document.getElementById('view-home');
  if(!root)return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!RM)root.classList.add('intro');
  setTimeout(function(){root.classList.remove('intro');root.classList.remove('intro-play');},5000);
  function start(){
    if(root.classList.contains('intro-play'))return;
    root.classList.add('intro-play');
  }
  function end(){
    root.classList.remove('intro');root.classList.remove('intro-play');
  }
  if(root.classList.contains('intro')){
    var started=false;
    var kick=function(){
      if(started)return;started=true;
    requestAnimationFrame(function(){requestAnimationFrame(start);});
    };
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(kick);}
    setTimeout(kick,700);
    var done=false;
    var finish=function(){if(done)return;done=true;end();};
    setTimeout(finish,3000);
  }
})();
<\/script>
<script>
(function(){
  var bar=document.querySelector('.bar');
  var btn=document.getElementById('menu-btn');
  function set(open){
    bar.dataset.open=open?'true':'false';
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Close menu':'Menu');
  }
  set(false);
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    set(bar.dataset.open!=='true');
  });
  document.addEventListener('click',function(e){
    if(!bar.contains(e.target))set(false);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')set(false);
  });
})();
<\/script>
<script>
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var veil=document.getElementById('veil');
  var home=document.getElementById('view-home');
  var srch=document.getElementById('view-search');
  var busy=false, cur='home', pending=null, target='home';
  function setView(v){
    cur=v; target=v;
    (veil.closest('.orbit-page')||veil).classList.toggle('v-search', v==='search');
    home.style.display=(v!=='home')?'none':'';
    srch.style.display=(v!=='search')?'none':'';
    if(v==='search'){
      window.scrollTo(0,0);
      if(window.__ensureSearchBooted)window.__ensureSearchBooted();
    }
  }
  var ring=veil.querySelector('.ring'), vlogo=veil.querySelector('.vlogo');
  function go(v,x,y,noPush){
    if(busy){pending={v:v,x:x,y:y,noPush:noPush};return;}
    if(v===cur&&v===target)return;
    busy=true;
    target=v;
    if(!noPush){try{history.pushState({v:v},'','#'+(v==='search'?'search':'home'));}catch(e){}}
    if(RM){setView(v);busy=false;if(pending){var q=pending;pending=null;go(q.v,q.x,q.y,q.noPush);}return;}
    x=(x==null)?window.innerWidth/2:x; y=(y==null)?window.innerHeight/2:y;
    var R=Math.hypot(window.innerWidth,window.innerHeight);
    // reset
    veil.style.transition='none';
    veil.style.opacity='1';
    veil.style.transform='scale(1)';
    veil.style.clipPath='circle(0px at '+x+'px '+y+'px)';
    ring.style.transition='none';
    ring.style.opacity='0';
    ring.style.transform='scale(.2)';
    void veil.offsetWidth;
    // Act 1: silver disc expands from the click point,halo sweeps the screen
    veil.style.transition='clip-path .56s cubic-bezier(.6,.05,.25,1)';
    veil.style.clipPath='circle('+(R*1.02).toFixed(0)+'px at '+x+'px '+y+'px)';
    ring.style.transition='transform .56s cubic-bezier(.6,.05,.25,1), opacity .25s ease';
    ring.style.opacity='1';
    ring.style.transform='scale('+(R*2.04/24).toFixed(1)+')';
    vlogo.style.opacity='1';
    setTimeout(function(){
      setView(v);
      ring.style.opacity='0';
      // Act 2: glow blooms and fades
      setTimeout(function(){
        vlogo.style.opacity='0';
        veil.style.transition='opacity .42s ease, transform .42s ease';
        veil.style.opacity='0';
        veil.style.transform='scale(1.07)';
        setTimeout(function(){
          veil.style.transition='none';
          veil.style.clipPath='circle(0px at 50% 50%)';
          ring.style.transform='scale(.2)';
          busy=false;
          if(pending){var q=pending;pending=null;go(q.v,q.x,q.y,q.noPush);}
        },440);
      },130);
    },580);
  }
  window.__go=go;
  document.querySelectorAll('a[href="#search"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault(); go('search', e.clientX, e.clientY);
    });
  });
  document.querySelectorAll('#view-search a[href="#home"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault(); go('home', e.clientX, e.clientY);
    });
  });
  document.querySelectorAll('#view-search .s-top nav a[href^="#"]:not([href^="#/"])').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var t=document.querySelector('#view-search '+a.getAttribute('href'));
      if(t)t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
    });
  });
  function syncFromHash(){
    var v=location.hash==='#search'?'search':'home';
    if(v!==target)go(v,null,null,true);
  }
  window.addEventListener('popstate',syncFromHash);
  window.addEventListener('hashchange',syncFromHash);
  if(location.hash==='#search'){cur='home';go('search',null,null,true);}
})();
<\/script>
<script>
(function(){
  var form=document.getElementById('import-form');
  var btn=document.getElementById('import-btn');
  var input=document.getElementById('import-input');
  var busy=false;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(busy)return; busy=true;
    var v=btn.textContent; btn.textContent='Searching…';
    var q=input.value.trim();
    var mq=document.getElementById('mq');
    if(mq)mq.value=q;
    if(window.__go)window.__go('search');
    if(window.__ensureSearchBooted)window.__ensureSearchBooted().then(function(){
      if(mq)mq.value=q;
      if(window.__runModuleSearch)window.__runModuleSearch();
    });
    setTimeout(function(){
      var panel=document.getElementById('module-search');
      if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
    },720);
    setTimeout(function(){btn.textContent=v; busy=false;},1600);
  });
  document.querySelectorAll('.kchip').forEach(function(c){
    c.addEventListener('click',function(){
      input.value=c.textContent.trim(); input.focus();
    });
  });
})();
<\/script>
<script>
(function(){
  var frame=document.querySelector('.frame');
  var sky=document.getElementById('sky');
  var mirror=document.getElementById('mirror');
  var touchPt=document.getElementById('m-touch');
  var turb=document.getElementById('skyTurbN');
  var cvs=document.getElementById('fx-particles');
  var ctx=cvs.getContext('2d');
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var NATW=1627,NATH=967;
  var MCX=1194,MCY=475,MR=318;      // mirror center/radius(source image pixels)
  var TXX=886,TXY=516;              // touch point(source image pixels)

  var P=[],M=[],lastT=0,pmx=0,pmy=0,parX=0,parY=0,frame2=0;
  var SPR=document.createElement('canvas'); SPR.width=SPR.height=64;
  (function(){var g=SPR.getContext('2d');
    var rg=g.createRadialGradient(32,32,0,32,32,32);
    rg.addColorStop(0,'rgba(236,241,250,.9)');
    rg.addColorStop(.4,'rgba(228,235,248,.32)');
    rg.addColorStop(1,'rgba(228,235,248,0)');
    g.fillStyle=rg; g.fillRect(0,0,64,64);})();

  function unit(){var w=window.innerWidth,h=window.innerHeight;
    return Math.max(Math.min(w/1563,h/460),0.8);}

  function layout(){
    var W=frame.clientWidth,H=frame.clientHeight,u=unit();
    var ultra=matchMedia('(min-aspect-ratio:3/1)').matches;
    var boxH=Math.max(W*NATH/NATW,H+(ultra?0:1.5*u));
    var s=Math.max(W/NATW,boxH/NATH);
    var cw=NATW*s,ch=NATH*s;
    var ox=(W-cw)/2, oy=ultra?(H-ch):(-1.5*u);
    var r=MR*s,cx=MCX*s+ox,cy=MCY*s+oy,d=2*r;
    mirror.style.width=d+'px'; mirror.style.height=d+'px';
    mirror.style.left=(cx-r)+'px'; mirror.style.top=(cy-r)+'px';
    touchPt.style.left=((TXX*s+ox)-(cx-r))+'px';
    touchPt.style.top=((TXY*s+oy)-(cy-r))+'px';
    sizeCanvas(W,H);
  }

  function sizeCanvas(W,H){
    cvs.width=Math.round(W*DPR); cvs.height=Math.round(H*DPR);
    cvs.style.width=W+'px'; cvs.style.height=H+'px';
    var n=Math.max(14,Math.round(W*H/(W<700?52000:36000)));
    while(P.length<n)P.push(newP(true));
    P.length=n;
    var m=Math.max(6,Math.round(W*H/(W<700?260000:190000)));
    while(M.length<m)M.push(newM(true));
    M.length=m;
  }
  function newM(any){
    var topBias=Math.random()<0.72;
    return{x:Math.random()*cvs.width,
      y:any?(topBias?Math.random()*cvs.height*0.55:Math.random()*cvs.height):cvs.height+30,
      s:(14+Math.random()*34)*DPR,
      vy:(2+Math.random()*5)*DPR,
      vx:(Math.random()-.5)*2.4*DPR,
      ph:Math.random()*6.283,
      sp:0.2+Math.random()*0.5,
      a:0.05+Math.random()*0.09};
  }
  function newP(any){
    return{x:Math.random()*cvs.width,
      y:any?Math.random()*cvs.height:cvs.height+8,
      r:(0.6+Math.random()*1.7)*DPR,
      vy:(5+Math.random()*13)*DPR,
      vx:(Math.random()-.5)*3*DPR,
      ph:Math.random()*6.283,
      sp:0.5+Math.random()*1.5,
      a:0.22+Math.random()*0.5};
  }
  function drawParticles(t,dt){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(var i=0;i<P.length;i++){
      var p=P[i];
      p.y-=p.vy*dt; p.x+=p.vx*dt;
      if(p.y<-8||p.x<-8||p.x>cvs.width+8){P[i]=p=newP(false);}
      var tw=0.55+0.45*Math.sin(t*0.001*p.sp+p.ph);
      ctx.beginPath();
      ctx.fillStyle='rgba(228,234,244,'+(p.a*tw).toFixed(3)+')';
      ctx.arc(p.x,p.y,p.r,0,6.283);
      ctx.fill();
    }
    for(var j=0;j<M.length;j++){
      var q=M[j];
      q.y-=q.vy*dt; q.x+=q.vx*dt+Math.sin(t*0.0004+q.ph)*0.15;
      if(q.y<-40||q.x<-40||q.x>cvs.width+40){M[j]=q=newM(false);q.y=cvs.height+20;}
      var tw2=0.6+0.4*Math.sin(t*0.001*q.sp+q.ph);
      ctx.globalAlpha=(q.a*tw2).toFixed(3);
      var sz=q.s*(1+0.15*Math.sin(t*0.0005+q.ph));
      ctx.drawImage(SPR,q.x-sz/2,q.y-sz/2,sz,sz);
    }
    ctx.globalAlpha=1;
  }

  window.addEventListener('pointermove',function(e){
    pmx=e.clientX/window.innerWidth-.5;
    pmy=e.clientY/window.innerHeight-.5;
  },{passive:true});

  function tick(t){
    var dt=Math.min(0.05,(t-lastT)/1000||0.016); lastT=t;
    var veil=document.getElementById('veil');
    if(document.hidden||veil&&veil.closest('.orbit-page').classList.contains('v-search')){
      setTimeout(function(){requestAnimationFrame(tick);},250);
      return;
    }
    parX+=(pmx-parX)*0.05; parY+=(pmy-parY)*0.05;
    drawParticles(t,dt);
    if(frame2++%2===0){
      var bx=0.006+0.0018*Math.sin(t*0.0006);
      var by=0.016+0.004*Math.sin(t*0.00083+2);
      turb.setAttribute('baseFrequency',bx.toFixed(4)+' '+by.toFixed(4));
    }
    var rx=-parY*7+Math.sin(t*0.0009)*2.2;
    var ry=parX*9+Math.sin(t*0.0011+1)*2.6;
    var sc=1+0.006*Math.sin(t*0.0013);
    mirror.style.transform='perspective(1000px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
    requestAnimationFrame(tick);
  }

  var rzT=null;
  window.addEventListener('resize',function(){
    if(rzT)cancelAnimationFrame(rzT);
    rzT=requestAnimationFrame(layout);
  });

  layout();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(layout);}
  window.addEventListener('load',layout);

  if(!RM){
    requestAnimationFrame(function(t){lastT=t;requestAnimationFrame(tick);});
  }else{
    drawParticles(0,0);
    mirror.style.transform='perspective(1000px) scale(1.005)';
  }
})();
<\/script>
<script>

/* ================= real database search ================= */
var MODULE_CACHE=[];
var API_READY=false;
var MODULE_SEARCH_VERSION=0;
var ALGO_SEARCH_VERSION=0;
var MODULE_QUERY='';
var MODULE_RESULTS=[];
var FREE_FUNCTION_RESULTS=[];

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function asList(v){return Array.isArray(v)?v:[]}
function firstText(){
  for(var i=0;i<arguments.length;i++){
    var v=arguments[i];
    if(typeof v==='string'&&v.trim())return v.trim();
  }
  return '';
}
function api(path, options){
  return fetch(path, Object.assign({headers:{'Content-Type':'application/json'}}, options||{})).then(readApiResponse);
}
function setBusy(el,msg){if(el)el.innerHTML='<div class="empty">'+esc(msg)+'</div>';}
function apiError(where, err){
  if(err&&err.name==='AbortError')return;
  console.error(err);
  var el=document.getElementById(where);
  if(!el)return;
  var problem=describeApiError(err);
  el.innerHTML='<div class="empty" role="alert">'+esc(problem.message)+(problem.retryable?'<br><button type="button" class="sbtn retry-search">Retry / Retry</button>':'')+'</div>';
  if(!problem.retryable)return;
  el.querySelector('.retry-search').addEventListener('click',function(){
    if(!API_READY||where==='mres')runModuleSearch();else runAlgoSearch();
  });
}
function moduleReadme(m){
  var readme=firstText(m.readme, m.description, m.summary);
  if(!readme){
    readme='# '+(m.name||'module')+'
'+
      'Files: '+(m.file_count||0)+' · Classes: '+(m.class_count||0)+' · Functions: '+(m.function_count||0);
    if(asList(m.samples).length)readme+='

Contents
- '+asList(m.samples).join('
- ');
  }
  return readme;
}
function normalizeModuleResult(x){return x&&x.m?x.m:x}
function normalizeClassResult(x){return x&&x.c?x.c:x}
function memberFunctions(c){
  var f=asList(c.functions).map(function(fn){
    if(typeof fn==='string')return fn;
    var name=firstText(fn.name, fn.function, fn.signature);
    var sig=firstText(fn.signature);
    return sig||name;
  }).filter(Boolean);
  if(!f.length)f=asList(c.member_functions).filter(Boolean);
  return f.slice(0,12);
}
function algoDesc(c){
  var text=firstText(c.docstring_math, c.description, c.summary, c.task, c.family);
  if(!text&&c.code){text=String(c.code).split('
').map(function(line){return line.trim()}).filter(Boolean)[0]||'';}
  return text||'Indexed from the numpy-ml source database.';
}
function scoreLine(c){
  var parts=[];
  if(c.path)parts.push(c.path);
  if(c.lines)parts.push('lines '+c.lines);
  if(c.fused!=null)parts.push('score '+Number(c.fused).toFixed(3));
  return parts.join(' · ');
}

/* ================= rendering ================= */
function renderModules(list){
  var el=document.getElementById('mres');
  if(!el)return;
  MODULE_RESULTS=list.map(normalizeModuleResult);
  if(!list.length){el.innerHTML='<div class="empty">No modules matched.</div>';return;}
  el.innerHTML=list.map(function(raw,i){
    var m=normalizeModuleResult(raw)||{};
    var reason=firstText(m.reason, m.why, asList(m.why).join(' · '));
    var rd=esc(moduleReadme(m))
      .replace(/^# (.+)$/m,'<span class="md-h">$1</span>')
      .replace(/^## (.+)$/gm,'<span class="md-h">$1</span>')
      .replace(/
- /g,'<br>- ')
      .replace(/
/g,'<br>');
    return '<article class="hit" style="animation-delay:'+(i*0.06)+'s">'
      +'<div class="hit-head"><span class="mname">'+esc(m.name||'module')+'</span>'
      +'<span class="path">'+esc(m.path||('numpy_ml/'+(m.name||'')+'/README.md'))+'</span></div>'
      +(reason?'<p class="module-reason">Why this module: '+esc(reason)+'</p>':'')
      +'<div class="readme">'+rd+'</div>'
      +'<button class="module-select sbtn" type="button" data-index="'+i+'">Select module &amp; continue &rarr;</button></article>';
  }).join('');
  el.querySelectorAll('.module-select').forEach(function(btn){
    btn.addEventListener('click',function(){selectModule(MODULE_RESULTS[+btn.dataset.index])});
  });
}
function resetModuleSelection(){
  renderBubbles([]);
  ALGO_SEARCH_VERSION++;
  var sel=document.getElementById('amod');
  sel.value='';sel.disabled=true;
  document.getElementById('ago').disabled=true;
  document.getElementById('aq').disabled=true;
  document.getElementById('ak').disabled=true;
  document.getElementById('aq').value='';
  document.getElementById('change-module').hidden=true;
  document.getElementById('algo-search').dataset.ready='false';
  document.getElementById('score-summary').innerHTML='';
  document.getElementById('module-context').textContent='Select a module in Step 1 to continue.';
  window.__lastAlgoResults=[];
  FREE_FUNCTION_RESULTS=[];
  setBusy(document.getElementById('ares'),'First find and select a module. Algorithm results will appear here.');
}
function selectModule(m){
  if(!m||!m.name)return;
  var sel=document.getElementById('amod');
  if(!Array.from(sel.options).some(function(option){return option.value===m.name})){
    var option=document.createElement('option');option.value=m.name;option.textContent=m.name;sel.appendChild(option);
  }
  sel.value=m.name;sel.disabled=false;
  document.getElementById('ago').disabled=false;
  document.getElementById('aq').disabled=false;
  document.getElementById('ak').disabled=false;
  document.getElementById('change-module').hidden=false;
  document.getElementById('algo-search').dataset.ready='true';
  document.getElementById('aq').value=MODULE_QUERY||m.name;
  document.getElementById('module-context').textContent='Searching within '+m.name+' · selected in Step 1';
  runAlgoSearch();
  document.getElementById('algo-search').scrollIntoView({behavior:'smooth',block:'start'});
}
function rememberSearch(){
  if(typeof searchSession==='undefined')return;
  searchSession.current={
    query:document.getElementById('mq').value,moduleQuery:MODULE_QUERY,
    moduleTopK:document.getElementById('mk').value,algorithmQuery:document.getElementById('aq').value,
    algorithmTopK:document.getElementById('ak').value,module:document.getElementById('amod').value,
    modules:MODULE_RESULTS,classes:window.__lastAlgoResults||[],freeFunctions:FREE_FUNCTION_RESULTS
  };
}
function renderClasses(list,freeFunctions){
  var el=document.getElementById('ares');
  if(!el)return;
  FREE_FUNCTION_RESULTS=asList(freeFunctions);
  window.__lastAlgoResults=list.map(function(raw){return normalizeClassResult(raw)||{}}).concat(FREE_FUNCTION_RESULTS);
  renderScores(window.__lastAlgoResults);
  renderBubbles(window.__lastAlgoResults);
  rememberSearch();
  if(!window.__lastAlgoResults.length){el.innerHTML='<div class="empty">No matching algorithms or functions. Refine your query within the selected module, or choose another module in Step 1.</div>';return;}
  el.innerHTML=window.__lastAlgoResults.map(function(c,i){
    var f=memberFunctions(c);
    var meta=scoreLine(c);
    return '<article class="acard" id="algorithm-result-'+i+'" tabindex="-1" style="animation-delay:'+(i*0.06)+'s">'
      +'<div class="left"><div class="cname">'+esc(c.entity||c.name||c.class_name||'Algorithm')+'</div><span class="entity-kind">'+(c.type==='function'?'Function / Function':'Class / Class')+'</span>'
      +'<div class="tagrow"><span class="mtag">'+esc(c.module||c.m||'module')+'</span>'+(c.family?'<span class="mtag">'+esc(c.family)+'</span>':'')+'</div>'
      +'<div class="desc2">'+esc(algoDesc(c))+'</div>'+(meta?'<div class="desc2">'+esc(meta)+'</div>':'')
      +renderScoreBreakdown(c,window.__lastAlgoResults)
      +'<p class="result-taxonomy"><b>Family / Family:</b> '+esc(c.family||'Not indexed')+' &middot; <b>Task / Task:</b> '+esc(c.task||'Not indexed')+'</p>'
      +'<div class="result-source"><div class="flabel">Indexed source / Indexed source</div><pre tabindex="0" aria-label="Source code for '+esc(c.entity||c.name||'Algorithm')+'"><code>'+esc(c.code||'No source code is available in this index.')+'</code></pre></div>'
      +'<button class="learn-open" type="button" data-index="'+i+'">Open the Learn Page</button></div>'
      +'<div class="right"><div class="flabel">Member functions</div>'
      +'<div class="function-list">'+(asList(c.functions).length?asList(c.functions).map(function(fn){return '<div class="function-entry"><span class="fn">'+esc(typeof fn==='string'?fn:firstText(fn.signature,fn.name))+'</span>'+(fn&&typeof fn==='object'&&fn.meaning?'<p>'+esc(fn.meaning)+'</p>':'')+'</div>'}).join(''):(f.length?f.map(function(fn){return '<div class="function-entry"><span class="fn">'+esc(fn)+'</span></div>'}).join(''):'<span class="fn">No member functions indexed</span>'))+'</div>'
      +'</div></article>';
  }).join('');
  document.querySelectorAll('.learn-open').forEach(function(btn){
    btn.addEventListener('click',function(){
      var c=window.__lastAlgoResults[+btn.dataset.index];
      if(!c)return;
      rememberSearch();
      try{localStorage.setItem('codexray:selectedAlgorithm',JSON.stringify({entity:c.entity||c.name||c.class_name,module:c.module,path:c.path}));}catch(e){}
      location.hash='#/learn';
    });
  });
}
var bubbleState=null;
function bubbleStop(){
  if(bubbleState&&bubbleState.raf)window.cancelAnimationFrame(bubbleState.raf);
  bubbleState=null;
}
function renderBubbles(list){
  bubbleStop();
  var field=document.getElementById('bubble-field');
  if(!field)return;
  field.innerHTML='';
  field.hidden=!list.length;
  if(!list.length)return;
  var hoverScale=1.1,gap=2,hintHeight=24;
  var scores=list.map(function(item){return Number.isFinite(item.fused)?item.fused:0});
  var maximum=Math.max.apply(null,[0.0001].concat(scores));
  field.innerHTML=list.map(function(item,index){
    var ratio=Math.max(0,Math.min(1,scores[index]/maximum));
    var size=Math.round(62+ratio*74);
    var hue=Math.floor(Math.random()*360);
    var name=item.entity||item.name||item.class_name||'Algorithm';
    return '<button type="button" class="bubble" data-result="'+index+'" style="width:'+size+'px;height:'+size+'px;background:radial-gradient(circle at 32% 28%,hsl('+hue+' 92% 92%),hsl('+((hue+38)%360)+' 78% 76%));color:hsl('+hue+' 62% 26%)" aria-label="'+esc(name)+'; relevance '+scores[index].toFixed(3)+'; jump to result"><span>'+esc(name)+'<span class="bub-pct">'+Math.round(ratio*100)+'%</span></span></button>';
  }).join('')+'<div class="bubble-dot">Bubble size = relevance= </div>';
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state={list:[],raf:0,width:0};
  bubbleState=state;
  field.querySelectorAll('.bubble').forEach(function(button,index){
    var bubble={el:button,size:Math.round(62+Math.max(0,Math.min(1,scores[index]/maximum))*74),x:0,y:0,vx:(Math.random()-0.5)*0.55||0.25,vy:(Math.random()-0.5)*0.55||0.2,scale:reduced?1:0.15,hovered:false};
    state.list.push(bubble);
    function pause(){bubble.hovered=true}
    function resume(){bubble.hovered=button.matches(':hover, :focus-visible')}
    button.addEventListener('mouseenter',pause);
    button.addEventListener('mouseleave',resume);
    button.addEventListener('focus',pause);
    button.addEventListener('blur',resume);
    button.addEventListener('click',function(){
      var card=document.getElementById('algorithm-result-'+button.dataset.result);
      if(card){
        document.querySelectorAll('#ares .acard').forEach(function(result){result.classList.remove('active')});
        card.classList.add('active');
        card.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
        card.focus({preventScroll:true});
      }
    });
  });
  function layout(){
    var width=field.clientWidth||900;
    var cell=Math.ceil(136*hoverScale+gap+4);
    var columns=Math.max(1,Math.floor(width/cell));
    var rows=Math.ceil(state.list.length/columns);
    field.style.height=Math.max(236,rows*cell+hintHeight)+'px';
    state.width=width;
    state.list.forEach(function(bubble,index){
      bubble.x=(index%columns)*(width/columns)+(width/columns-bubble.size)/2;
      bubble.y=Math.floor(index/columns)*cell+(cell-bubble.size)/2;
    });
  }
  function clamp(bubble,width,floor){
    var margin=bubble.size*(hoverScale-1)/2+2;
    var right=Math.max(margin,width-bubble.size-margin);
    var bottom=Math.max(margin,floor-bubble.size-margin);
    if(bubble.x<margin){bubble.x=margin;bubble.vx=Math.abs(bubble.vx)}
    if(bubble.y<margin){bubble.y=margin;bubble.vy=Math.abs(bubble.vy)}
    if(bubble.x>right){bubble.x=right;bubble.vx=-Math.abs(bubble.vx)}
    if(bubble.y>bottom){bubble.y=bottom;bubble.vy=-Math.abs(bubble.vy)}
  }
  function separate(width,floor){
    for(var pass=0;pass<2;pass++){
      state.list.forEach(function(first,index){
        state.list.slice(index+1).forEach(function(second){
          var deltaX=second.x+second.size/2-first.x-first.size/2;
          var deltaY=second.y+second.size/2-first.y-first.size/2;
          var distance=Math.hypot(deltaX,deltaY);
          var minimum=(first.size+second.size)*hoverScale/2+gap;
          if(distance>=minimum)return;
          if(distance<0.01){deltaX=Math.random()-0.5;deltaY=Math.random()-0.5;distance=Math.hypot(deltaX,deltaY)||1}
          var normalX=deltaX/distance,normalY=deltaY/distance,needed=minimum-distance;
          var weight=first.hovered?0:second.hovered?1:0.5;
          if(first.hovered&&second.hovered)return;
          first.x-=normalX*needed*weight;first.y-=normalY*needed*weight;
          second.x+=normalX*needed*(1-weight);second.y+=normalY*needed*(1-weight);
          var firstVelocity=first.vx*normalX+first.vy*normalY;
          var secondVelocity=second.vx*normalX+second.vy*normalY;
          if(firstVelocity-secondVelocity>0){
            first.vx-=(firstVelocity-secondVelocity)*normalX;first.vy-=(firstVelocity-secondVelocity)*normalY;
            second.vx+=(firstVelocity-secondVelocity)*normalX;second.vy+=(firstVelocity-secondVelocity)*normalY;
          }
        });
      });
    }
    state.list.forEach(function(bubble){clamp(bubble,width,floor)});
  }
  function step(){
    if(bubbleState!==state)return;
    var width=field.clientWidth||900;
    if(width!==state.width)layout();
    var floor=(field.clientHeight||236)-hintHeight;
    state.list.forEach(function(bubble){
      if(!bubble.hovered&&!reduced&&!document.hidden){bubble.x+=bubble.vx;bubble.y+=bubble.vy}
      clamp(bubble,width,floor);
      bubble.scale=reduced?(bubble.hovered?hoverScale:1):bubble.scale+((bubble.hovered?hoverScale:1)-bubble.scale)*0.18;
    });
    if(!reduced)separate(width,floor);
    state.list.forEach(function(bubble){
      bubble.el.style.transform='translate3d('+bubble.x.toFixed(1)+'px,'+bubble.y.toFixed(1)+'px,0) scale('+bubble.scale.toFixed(3)+')';
      bubble.el.style.zIndex=bubble.hovered?6:2;
    });
    state.raf=requestAnimationFrame(step);
  }
  layout();
  step();
}
function renderScoreBreakdown(item,list){
  var channels=[{key:'fused',label:'Fused / Fused'},{key:'keyword',label:'Keyword / Keyword'},{key:'semantic',label:'Semantic / Semantic'}];
  return '<div class="result-scores">'+channels.map(function(channel){
    var value=item[channel.key];
    if(typeof value!=='number'||!Number.isFinite(value))return '<div class="result-score"><span>'+channel.label+'</span><span class="score-value">Not available</span></div>';
    var values=list.map(function(result){return result[channel.key]}).filter(function(score){return typeof score==='number'&&Number.isFinite(score)});
    var min=channel.key==='semantic'?-1:0;
    var max=Math.max.apply(null,[1].concat(values));
    return '<div class="result-score score-'+channel.key+'"><label>'+channel.label+' <strong>'+value.toFixed(3)+'</strong><meter min="'+min+'" max="'+max+'" value="'+value+'" aria-label="'+channel.label+' for '+esc(item.entity||item.name||'Algorithm')+'"></meter></label></div>';
  }).join('')+'</div><p class="score-explanation">Ranking scores, not probabilities. Each channel uses its own scale.</p>';
}
function renderScores(list){
  var el=document.getElementById('score-summary');
  var scored=list.filter(function(item){return typeof item.fused==='number'&&Number.isFinite(item.fused)});
  if(!scored.length){el.innerHTML='';return;}
  var max=Math.max.apply(null,[1].concat(scored.map(function(item){return item.fused})));
  el.innerHTML='<details class="score-details"><summary>View relevance scores</summary><p>Scores rank these search results; they are not probabilities.</p>'
    +scored.map(function(item){return '<div class="score-row"><span>'+esc(item.entity||item.name)+'</span><meter min="0" max="'+max+'" value="'+Math.max(0,item.fused)+'" aria-label="Ranking score for '+esc(item.entity||item.name)+'"></meter><code>'+item.fused.toFixed(3)+'</code></div>'}).join('')+'</details>';
}

/* ================= API-backed search ================= */
function loadModules(){
  var sel=document.getElementById('amod');
  return api('/api/modules').then(function(data){
    MODULE_CACHE=asList(data.modules);
    if(sel){
      var previous=sel.value;
      sel.innerHTML='<option value="" selected>Select a module first</option>';
      MODULE_CACHE.forEach(function(m){
        var o=document.createElement('option');o.value=m.name;o.textContent=m.name;
        sel.appendChild(o);
      });
      if(previous)sel.value=previous;
    }
    API_READY=true;
    return MODULE_CACHE;
  });
}
function runModuleSearch(){
  if(!API_READY)return window.__ensureSearchBooted().then(function(){if(API_READY)runModuleSearch()});
  var q=(document.getElementById('mq').value||'').trim();
  var k=+document.getElementById('mk').value||3;
  var version=++MODULE_SEARCH_VERSION;
  MODULE_QUERY=q;
  resetModuleSelection();
  MODULE_RESULTS=[];
  rememberSearch();
  setBusy(document.getElementById('mres'),'Searching indexed modules...');
  var p=q?api('/api/modules/search',{method:'POST',body:JSON.stringify({query:q,top_k:k})}):Promise.resolve({results:MODULE_CACHE.slice(0,k)});
  p.then(function(data){
    if(version!==MODULE_SEARCH_VERSION)return;
    if(data.not_in_repo){
      renderModules([]);
      setBusy(document.getElementById('mres'),'Not included in NumPy-ML: '+(data.algorithm||q)+'. Try another algorithm or topic.');
      setBusy(document.getElementById('ares'),'This algorithm is not included in the repository, so Step 2 cannot continue.');
      return;
    }
    renderModules(asList(data.results));
    rememberSearch();
  }).catch(function(err){if(version===MODULE_SEARCH_VERSION)apiError('mres',err)});
}
function runAlgoSearch(){
  var mod=document.getElementById('amod').value;
  if(!mod)return;
  document.getElementById('module-context').textContent='Searching within '+mod+' · selected in Step 1';
  var version=++ALGO_SEARCH_VERSION;
  var q=(document.getElementById('aq').value||'').trim();
  var k=+document.getElementById('ak').value||3;
  if(!q){renderClasses([]);return;}
  document.getElementById('score-summary').innerHTML='';
  setBusy(document.getElementById('ares'),'Searching indexed algorithms...');
  renderBubbles([]);
  api('/api/search',{method:'POST',body:JSON.stringify({query:q,top_k:k,module:mod,family:'',task:''})})
    .then(function(data){
      if(version!==ALGO_SEARCH_VERSION)return;
      renderClasses(asList(data.results),asList(data.free_functions));
      if(data.not_in_repo)setBusy(document.getElementById('ares'),'Not included in NumPy-ML: '+(data.algorithm||q)+'. Try another query.');
    })
    .catch(function(err){if(version===ALGO_SEARCH_VERSION)apiError('ares',err)});
}
function bootSearch(){
  return loadModules().then(function(){
    if(!MODULE_SEARCH_VERSION){
      var saved=typeof searchSession!=='undefined'?searchSession.current:null;
      if(saved){
        document.getElementById('mq').value=saved.query||'';
        document.getElementById('mk').value=saved.moduleTopK||'1';
        document.getElementById('ak').value=saved.algorithmTopK||'3';
        MODULE_QUERY=saved.moduleQuery||'';
        renderModules(asList(saved.modules));
        resetModuleSelection();
        if(saved.module&&MODULE_CACHE.some(function(item){return item.name===saved.module})){
          document.getElementById('amod').value=saved.module;
          document.getElementById('amod').disabled=false;
          document.getElementById('aq').value=saved.algorithmQuery||'';
          document.getElementById('aq').disabled=false;
          document.getElementById('ak').disabled=false;
          document.getElementById('ago').disabled=false;
          document.getElementById('change-module').hidden=false;
          document.getElementById('algo-search').dataset.ready='true';
          document.getElementById('module-context').textContent='Searching within '+saved.module+' · selected in Step 1';
          renderClasses(asList(saved.classes).filter(function(item){return item.type!=='function'}),asList(saved.freeFunctions));
        }
        return;
      }
      renderModules(MODULE_CACHE.slice(0,+document.getElementById('mk').value||3));
      resetModuleSelection();
    }
  }).catch(function(err){
    SEARCH_BOOTED=null;
    apiError('mres',err);apiError('ares',err);
  });
}

document.getElementById('mgo').addEventListener('click',runModuleSearch);
document.getElementById('change-module').addEventListener('click',function(){
  resetModuleSelection();
  rememberSearch();
  document.getElementById('module-search').scrollIntoView({behavior:'smooth',block:'start'});
  document.getElementById('mq').focus();
});
document.getElementById('mq').addEventListener('keydown',function(e){if(e.key==='Enter')runModuleSearch()});
document.getElementById('mk').addEventListener('change',runModuleSearch);
document.getElementById('ago').addEventListener('click',runAlgoSearch);
document.getElementById('aq').addEventListener('keydown',function(e){if(e.key==='Enter')runAlgoSearch()});
document.getElementById('ak').addEventListener('change',runAlgoSearch);
document.getElementById('amod').addEventListener('change',runAlgoSearch);
document.querySelectorAll('.tchip').forEach(function(c){
  c.addEventListener('click',function(){
    var panel=c.closest('.panel');
    var input=panel.querySelector('input[type=text]');
    input.value=c.textContent.trim();
    if(panel.id==='module-search')runModuleSearch();else runAlgoSearch();
    input.focus();
  });
});
window.__runAlgoSearch=runAlgoSearch;
window.__runModuleSearch=runModuleSearch;
var SEARCH_BOOTED=null;
window.__ensureSearchBooted=function(){
  if(!SEARCH_BOOTED)SEARCH_BOOTED=bootSearch();
  return SEARCH_BOOTED;
};
if(location.hash==='#search')window.__ensureSearchBooted();

/* ================= particles ================= */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var cvs=document.getElementById('fx2-particles'),ctx=cvs.getContext('2d');
  var DPR=Math.min(devicePixelRatio||1,2),P=[],last=0;
  function size(){cvs.width=innerWidth*DPR;cvs.height=innerHeight*DPR;
    cvs.style.width=innerWidth+'px';cvs.style.height=innerHeight+'px';
    var n=Math.round(innerWidth*innerHeight/52000);P=[];
    for(var i=0;i<n;i++)P.push(np());}
  function np(){return{x:Math.random()*cvs.width,y:Math.random()*cvs.height,
    r:(0.5+Math.random()*1.5)*DPR,vy:(4+Math.random()*10)*DPR,vx:(Math.random()-.5)*2*DPR,
    ph:Math.random()*6.28,sp:.5+Math.random()*1.4,a:.18+Math.random()*.4};}
  function tick(t){var dt=Math.min(.05,(t-last)/1000||.016);last=t;
    var veil=document.getElementById('veil');
    if(document.hidden||!(veil&&veil.closest('.orbit-page').classList.contains('v-search'))){
      setTimeout(function(){requestAnimationFrame(tick);},250);
      return;
    }
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(var i=0;i<P.length;i++){var p=P[i];p.y-=p.vy*dt;p.x+=p.vx*dt;
      if(p.y<-8||p.x<-8||p.x>cvs.width+8)P[i]=p=np(),p.y=cvs.height+8;
      var tw=.55+.45*Math.sin(t*.001*p.sp+p.ph);
      ctx.beginPath();ctx.fillStyle='rgba(98,110,134,'+(p.a*1.4*tw).toFixed(3)+')';
      ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill();}
    requestAnimationFrame(tick);}
  addEventListener('resize',size);size();
  requestAnimationFrame(function(t){last=t;requestAnimationFrame(tick);});
})();

<\/script>
`],[`
<div id="veil" aria-hidden="true"><i class="ring"></i><span class="vlogo">
  <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
    <circle cx="13.25" cy="8.4" r="8.8" fill="#e8edf5"/>
    <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#e8edf5" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
  </svg>Code-X-Ray</span></div>
<div id="view-home">
<div class="frame">
  <img class="sky" id="sky" aria-hidden="true" alt="" draggable="false"
       src="`,`" />
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="skyTurb" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence id="skyTurbN" type="fractalNoise" baseFrequency="0.006 0.016" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G">
      <animate attributeName="scale" values="2.4;3.6;2.4" dur="9s" repeatCount="indefinite"/>
    </feDisplacementMap>
  </filter>
</svg>
<div id="mirror" aria-hidden="true">
  <div class="m-ring"></div>
  <div class="m-ring2"></div>
  <div class="m-gloss"></div>
  <div class="m-sweep"></div>
  <div class="m-touch" id="m-touch"></div>
</div>
<div class="hero-scrim" aria-hidden="true"></div>
<div class="silver-grad" aria-hidden="true"></div>
<canvas id="fx-particles" aria-hidden="true"></canvas>
  <div class="veil"></div>

  <header class="bar" data-open="false">
    <a class="brand" href="#home" aria-label="Code-X-Ray — home">
      <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
        <circle cx="13.25" cy="8.4" r="8.8" fill="#000"/>
        <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#000" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
      </svg>
      <span class="word">Code-X-Ray</span>
    </a>

    <nav class="links" aria-label="Primary">
      <span class="seg">
        <a href="#home" aria-current="page">Home</a>
        <a href="#search">Browse</a>
        <a href="#/learn">Learn</a>
      </span>
    </nav>

    <div class="actions">

      <a class="icon-btn" href="https://github.com/Cissy4mA/Code-X-ray_Numpy-ml" target="_blank" rel="noopener" aria-label="GitHub">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
      </a>
      <button class="menu" id="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu-sheet">
        <svg viewBox="0 0 20 14" fill="none" aria-hidden="true">
          <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
      <nav class="sheet" id="menu-sheet" aria-label="Menu">
        <a href="#home" aria-current="page">Home</a>
        <a href="#search">Browse</a>
        <a href="#/learn">Learn</a>
      </nav>
    </div>
  </header>

  <div class="screen">
    <main class="hero">
      <a class="pill" href="#search">
        <span class="chip">NumPy-ML</span>
        <span class="pill-label">From code retrieval to understanding</span>
        <svg class="arr" viewBox="0 0 9.5 8" fill="none" aria-hidden="true">
          <path d="M0.7 4H8.8M5.6 0.75 8.85 4 5.6 7.25" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>

      <h1>
        <span class="ln"><span class="ln-i">Code-X-Ray</span></span>
        <span class="ln"><span class="ln-i">ML Code Retrieval &amp; Learning</span></span>
      </h1>

      <p>A machine learning code retrieval and learning platform for NumPy-ML.</p>

      <form class="import-bar" id="import-form" action="#import" role="search">
        <svg class="imp-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.6" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10.4 10.4 14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <input id="import-input" type="text" autocomplete="off" spellcheck="false"
               placeholder="e.g. logistic regression"
               aria-label="Search an algorithm">
        <button class="imp-btn" id="import-btn" type="submit">X-Ray</button>
      </form>

      <div class="chip-row" aria-label="Sample kernel modules">
        <span class="chip-label">Indexed modules</span>
        <button class="kchip" type="button">bandits</button>
        <button class="kchip" type="button">gmm</button>
        <button class="kchip" type="button">hmm</button>
        <button class="kchip" type="button">lda</button>
        <button class="kchip" type="button">neural_nets</button>
        <button class="kchip" type="button">trees</button>
        <button class="kchip" type="button">rl_models</button>
      </div>

    </main>
  </div>
</div>
</div>

<div id="view-search" style="display:none">

<canvas id="fx2-particles" aria-hidden="true"></canvas>

<header class="s-top">
  <a class="s-brand" href="#home" aria-label="Code-X-Ray — home">
    <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
      <circle cx="13.25" cy="8.4" r="8.8" fill="#07090f"/>
      <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#07090f" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
    </svg>
    Code-X-Ray
  </a>
  <nav class="seg s-seg" aria-label="Primary">
    <a href="#home">Home</a>
    <a href="#module-search" aria-current="page">Browse</a>
    <a href="#/learn">Learn</a>
  </nav>
  <nav class="s-sub" aria-label="Sections">
    <a href="#module-search">1. Find a module</a>
    <a href="#algo-search">2. Find an algorithm</a>
  </nav>
</header>

<main class="wrap">
  <h1 class="page-title">Find your module. Then your algorithm.</h1>
  <p class="page-sub">Search NumPy-ML by topic or algorithm name, then narrow the results to a module.</p>
  <ol class="search-flow" aria-label="Retrieval and learning steps"><li>1. Find a module</li><li aria-hidden="true">&rarr;</li><li>2. Find an algorithm</li><li aria-hidden="true">&rarr;</li><li>3. Open the Learn Page</li></ol>

  <div class="grid">
    <!-- ============ 3.1 Module Search ============ -->
    <section class="panel" id="module-search">
      <h2>Step 1 &middot; Find a module</h2>
      <p class="desc">Find a module by algorithm name, topic or task.</p>
      <p class="rowlabel">What do you want to learn?</p>
      <div class="controls">
        <input id="mq" type="text" placeholder="e.g. reinforcement learning / neural networks / probabilistic models" aria-label="Module search query">
        <button class="sbtn" id="mgo" type="button">Search modules</button>
      </div>
      <details class="search-options"><summary>Search options</summary><label>Number of module results
        <select id="mk" aria-label="Number of module results">
          <option value="1" selected>Top-K 1</option>
          <option value="2">Top-K 2</option>
          <option value="3">Top-K 3</option>
        </select>
      </label></details>
      <p class="try">Try: <button type="button" class="tchip">reinforcement learning</button><button type="button" class="tchip">neural networks</button><button type="button" class="tchip">bandits</button></p>
      <div class="results" id="mres" aria-live="polite"></div>
    </section>

    <!-- ============ 3.2 Algorithm Search ============ -->
    <section class="panel" id="algo-search" data-ready="false">
      <h2>Step 2 &middot; Find an algorithm</h2>
      <p class="desc">Your query is carried over. Refine it to search within the selected module.</p>
      <p class="rowlabel" id="module-context" aria-live="polite">Select a module in Step 1 to continue.</p>
      <button class="sbtn change-module" id="change-module" type="button" hidden>Change module &uarr;</button>
      <div class="controls">
        <input id="aq" type="text" placeholder="Your query carries over after selecting a module" aria-label="Algorithm search query" disabled>
        <select id="amod" aria-label="Selected module" hidden disabled>
          <option value="" selected>Select a module first</option>
        </select>
        <button class="sbtn" id="ago" type="button" disabled>Search algorithms</button>
      </div>
      <details class="search-options"><summary>Search options</summary><label>Number of algorithm results
        <select id="ak" aria-label="Number of algorithm results" disabled>
          <option value="1">Top-K 1</option>
          <option value="2">Top-K 2</option>
          <option value="3" selected>Top-K 3</option>
          <option value="4">Top-K 4</option>
          <option value="5">Top-K 5</option>
          <option value="6">Top-K 6</option>
          <option value="7">Top-K 7</option>
          <option value="8">Top-K 8</option>
          <option value="9">Top-K 9</option>
          <option value="10">Top-K 10</option>
        </select>
      </label></details>
      <p class="try">Refine your query to search within the selected module.</p>
      <div id="score-summary"></div>
      <div id="bubble-field" class="bubble-field" role="group" aria-label="Algorithm relevance bubbles" hidden></div>
      <div class="results" id="ares" aria-live="polite"><div class="empty">First find and select a module. Algorithm results will appear here.</div></div>
    </section>
  </div>
</main>

</div>

<script>
(function(){
  var root=document.getElementById('view-home');
  if(!root)return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!RM)root.classList.add('intro');
  setTimeout(function(){root.classList.remove('intro');root.classList.remove('intro-play');},5000);
  function start(){
    if(root.classList.contains('intro-play'))return;
    root.classList.add('intro-play');
  }
  function end(){
    root.classList.remove('intro');root.classList.remove('intro-play');
  }
  if(root.classList.contains('intro')){
    var started=false;
    var kick=function(){
      if(started)return;started=true;
    requestAnimationFrame(function(){requestAnimationFrame(start);});
    };
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(kick);}
    setTimeout(kick,700);
    var done=false;
    var finish=function(){if(done)return;done=true;end();};
    setTimeout(finish,3000);
  }
})();
<\/script>
<script>
(function(){
  var bar=document.querySelector('.bar');
  var btn=document.getElementById('menu-btn');
  function set(open){
    bar.dataset.open=open?'true':'false';
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Close menu':'Menu');
  }
  set(false);
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    set(bar.dataset.open!=='true');
  });
  document.addEventListener('click',function(e){
    if(!bar.contains(e.target))set(false);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')set(false);
  });
})();
<\/script>
<script>
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var veil=document.getElementById('veil');
  var home=document.getElementById('view-home');
  var srch=document.getElementById('view-search');
  var busy=false, cur='home', pending=null, target='home';
  function setView(v){
    cur=v; target=v;
    (veil.closest('.orbit-page')||veil).classList.toggle('v-search', v==='search');
    home.style.display=(v!=='home')?'none':'';
    srch.style.display=(v!=='search')?'none':'';
    if(v==='search'){
      window.scrollTo(0,0);
      if(window.__ensureSearchBooted)window.__ensureSearchBooted();
    }
  }
  var ring=veil.querySelector('.ring'), vlogo=veil.querySelector('.vlogo');
  function go(v,x,y,noPush){
    if(busy){pending={v:v,x:x,y:y,noPush:noPush};return;}
    if(v===cur&&v===target)return;
    busy=true;
    target=v;
    if(!noPush){try{history.pushState({v:v},'','#'+(v==='search'?'search':'home'));}catch(e){}}
    if(RM){setView(v);busy=false;if(pending){var q=pending;pending=null;go(q.v,q.x,q.y,q.noPush);}return;}
    x=(x==null)?window.innerWidth/2:x; y=(y==null)?window.innerHeight/2:y;
    var R=Math.hypot(window.innerWidth,window.innerHeight);
    // reset
    veil.style.transition='none';
    veil.style.opacity='1';
    veil.style.transform='scale(1)';
    veil.style.clipPath='circle(0px at '+x+'px '+y+'px)';
    ring.style.transition='none';
    ring.style.opacity='0';
    ring.style.transform='scale(.2)';
    void veil.offsetWidth;
    // Act 1: silver disc expands from the click point,halo sweeps the screen
    veil.style.transition='clip-path .56s cubic-bezier(.6,.05,.25,1)';
    veil.style.clipPath='circle('+(R*1.02).toFixed(0)+'px at '+x+'px '+y+'px)';
    ring.style.transition='transform .56s cubic-bezier(.6,.05,.25,1), opacity .25s ease';
    ring.style.opacity='1';
    ring.style.transform='scale('+(R*2.04/24).toFixed(1)+')';
    vlogo.style.opacity='1';
    setTimeout(function(){
      setView(v);
      ring.style.opacity='0';
      // Act 2: glow blooms and fades
      setTimeout(function(){
        vlogo.style.opacity='0';
        veil.style.transition='opacity .42s ease, transform .42s ease';
        veil.style.opacity='0';
        veil.style.transform='scale(1.07)';
        setTimeout(function(){
          veil.style.transition='none';
          veil.style.clipPath='circle(0px at 50% 50%)';
          ring.style.transform='scale(.2)';
          busy=false;
          if(pending){var q=pending;pending=null;go(q.v,q.x,q.y,q.noPush);}
        },440);
      },130);
    },580);
  }
  window.__go=go;
  document.querySelectorAll('a[href="#search"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault(); go('search', e.clientX, e.clientY);
    });
  });
  document.querySelectorAll('#view-search a[href="#home"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault(); go('home', e.clientX, e.clientY);
    });
  });
  document.querySelectorAll('#view-search .s-top nav a[href^="#"]:not([href^="#/"])').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var t=document.querySelector('#view-search '+a.getAttribute('href'));
      if(t)t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
    });
  });
  function syncFromHash(){
    var v=location.hash==='#search'?'search':'home';
    if(v!==target)go(v,null,null,true);
  }
  window.addEventListener('popstate',syncFromHash);
  window.addEventListener('hashchange',syncFromHash);
  if(location.hash==='#search'){cur='home';go('search',null,null,true);}
})();
<\/script>
<script>
(function(){
  var form=document.getElementById('import-form');
  var btn=document.getElementById('import-btn');
  var input=document.getElementById('import-input');
  var busy=false;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(busy)return; busy=true;
    var v=btn.textContent; btn.textContent='Searching…';
    var q=input.value.trim();
    var mq=document.getElementById('mq');
    if(mq)mq.value=q;
    if(window.__go)window.__go('search');
    if(window.__ensureSearchBooted)window.__ensureSearchBooted().then(function(){
      if(mq)mq.value=q;
      if(window.__runModuleSearch)window.__runModuleSearch();
    });
    setTimeout(function(){
      var panel=document.getElementById('module-search');
      if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
    },720);
    setTimeout(function(){btn.textContent=v; busy=false;},1600);
  });
  document.querySelectorAll('.kchip').forEach(function(c){
    c.addEventListener('click',function(){
      input.value=c.textContent.trim(); input.focus();
    });
  });
})();
<\/script>
<script>
(function(){
  var frame=document.querySelector('.frame');
  var sky=document.getElementById('sky');
  var mirror=document.getElementById('mirror');
  var touchPt=document.getElementById('m-touch');
  var turb=document.getElementById('skyTurbN');
  var cvs=document.getElementById('fx-particles');
  var ctx=cvs.getContext('2d');
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var NATW=1627,NATH=967;
  var MCX=1194,MCY=475,MR=318;      // mirror center/radius(source image pixels)
  var TXX=886,TXY=516;              // touch point(source image pixels)

  var P=[],M=[],lastT=0,pmx=0,pmy=0,parX=0,parY=0,frame2=0;
  var SPR=document.createElement('canvas'); SPR.width=SPR.height=64;
  (function(){var g=SPR.getContext('2d');
    var rg=g.createRadialGradient(32,32,0,32,32,32);
    rg.addColorStop(0,'rgba(236,241,250,.9)');
    rg.addColorStop(.4,'rgba(228,235,248,.32)');
    rg.addColorStop(1,'rgba(228,235,248,0)');
    g.fillStyle=rg; g.fillRect(0,0,64,64);})();

  function unit(){var w=window.innerWidth,h=window.innerHeight;
    return Math.max(Math.min(w/1563,h/460),0.8);}

  function layout(){
    var W=frame.clientWidth,H=frame.clientHeight,u=unit();
    var ultra=matchMedia('(min-aspect-ratio:3/1)').matches;
    var boxH=Math.max(W*NATH/NATW,H+(ultra?0:1.5*u));
    var s=Math.max(W/NATW,boxH/NATH);
    var cw=NATW*s,ch=NATH*s;
    var ox=(W-cw)/2, oy=ultra?(H-ch):(-1.5*u);
    var r=MR*s,cx=MCX*s+ox,cy=MCY*s+oy,d=2*r;
    mirror.style.width=d+'px'; mirror.style.height=d+'px';
    mirror.style.left=(cx-r)+'px'; mirror.style.top=(cy-r)+'px';
    touchPt.style.left=((TXX*s+ox)-(cx-r))+'px';
    touchPt.style.top=((TXY*s+oy)-(cy-r))+'px';
    sizeCanvas(W,H);
  }

  function sizeCanvas(W,H){
    cvs.width=Math.round(W*DPR); cvs.height=Math.round(H*DPR);
    cvs.style.width=W+'px'; cvs.style.height=H+'px';
    var n=Math.max(14,Math.round(W*H/(W<700?52000:36000)));
    while(P.length<n)P.push(newP(true));
    P.length=n;
    var m=Math.max(6,Math.round(W*H/(W<700?260000:190000)));
    while(M.length<m)M.push(newM(true));
    M.length=m;
  }
  function newM(any){
    var topBias=Math.random()<0.72;
    return{x:Math.random()*cvs.width,
      y:any?(topBias?Math.random()*cvs.height*0.55:Math.random()*cvs.height):cvs.height+30,
      s:(14+Math.random()*34)*DPR,
      vy:(2+Math.random()*5)*DPR,
      vx:(Math.random()-.5)*2.4*DPR,
      ph:Math.random()*6.283,
      sp:0.2+Math.random()*0.5,
      a:0.05+Math.random()*0.09};
  }
  function newP(any){
    return{x:Math.random()*cvs.width,
      y:any?Math.random()*cvs.height:cvs.height+8,
      r:(0.6+Math.random()*1.7)*DPR,
      vy:(5+Math.random()*13)*DPR,
      vx:(Math.random()-.5)*3*DPR,
      ph:Math.random()*6.283,
      sp:0.5+Math.random()*1.5,
      a:0.22+Math.random()*0.5};
  }
  function drawParticles(t,dt){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(var i=0;i<P.length;i++){
      var p=P[i];
      p.y-=p.vy*dt; p.x+=p.vx*dt;
      if(p.y<-8||p.x<-8||p.x>cvs.width+8){P[i]=p=newP(false);}
      var tw=0.55+0.45*Math.sin(t*0.001*p.sp+p.ph);
      ctx.beginPath();
      ctx.fillStyle='rgba(228,234,244,'+(p.a*tw).toFixed(3)+')';
      ctx.arc(p.x,p.y,p.r,0,6.283);
      ctx.fill();
    }
    for(var j=0;j<M.length;j++){
      var q=M[j];
      q.y-=q.vy*dt; q.x+=q.vx*dt+Math.sin(t*0.0004+q.ph)*0.15;
      if(q.y<-40||q.x<-40||q.x>cvs.width+40){M[j]=q=newM(false);q.y=cvs.height+20;}
      var tw2=0.6+0.4*Math.sin(t*0.001*q.sp+q.ph);
      ctx.globalAlpha=(q.a*tw2).toFixed(3);
      var sz=q.s*(1+0.15*Math.sin(t*0.0005+q.ph));
      ctx.drawImage(SPR,q.x-sz/2,q.y-sz/2,sz,sz);
    }
    ctx.globalAlpha=1;
  }

  window.addEventListener('pointermove',function(e){
    pmx=e.clientX/window.innerWidth-.5;
    pmy=e.clientY/window.innerHeight-.5;
  },{passive:true});

  function tick(t){
    var dt=Math.min(0.05,(t-lastT)/1000||0.016); lastT=t;
    var veil=document.getElementById('veil');
    if(document.hidden||veil&&veil.closest('.orbit-page').classList.contains('v-search')){
      setTimeout(function(){requestAnimationFrame(tick);},250);
      return;
    }
    parX+=(pmx-parX)*0.05; parY+=(pmy-parY)*0.05;
    drawParticles(t,dt);
    if(frame2++%2===0){
      var bx=0.006+0.0018*Math.sin(t*0.0006);
      var by=0.016+0.004*Math.sin(t*0.00083+2);
      turb.setAttribute('baseFrequency',bx.toFixed(4)+' '+by.toFixed(4));
    }
    var rx=-parY*7+Math.sin(t*0.0009)*2.2;
    var ry=parX*9+Math.sin(t*0.0011+1)*2.6;
    var sc=1+0.006*Math.sin(t*0.0013);
    mirror.style.transform='perspective(1000px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
    requestAnimationFrame(tick);
  }

  var rzT=null;
  window.addEventListener('resize',function(){
    if(rzT)cancelAnimationFrame(rzT);
    rzT=requestAnimationFrame(layout);
  });

  layout();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(layout);}
  window.addEventListener('load',layout);

  if(!RM){
    requestAnimationFrame(function(t){lastT=t;requestAnimationFrame(tick);});
  }else{
    drawParticles(0,0);
    mirror.style.transform='perspective(1000px) scale(1.005)';
  }
})();
<\/script>
<script>

/* ================= real database search ================= */
var MODULE_CACHE=[];
var API_READY=false;
var MODULE_SEARCH_VERSION=0;
var ALGO_SEARCH_VERSION=0;
var MODULE_QUERY='';
var MODULE_RESULTS=[];
var FREE_FUNCTION_RESULTS=[];

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function asList(v){return Array.isArray(v)?v:[]}
function firstText(){
  for(var i=0;i<arguments.length;i++){
    var v=arguments[i];
    if(typeof v==='string'&&v.trim())return v.trim();
  }
  return '';
}
function api(path, options){
  return fetch(path, Object.assign({headers:{'Content-Type':'application/json'}}, options||{})).then(readApiResponse);
}
function setBusy(el,msg){if(el)el.innerHTML='<div class="empty">'+esc(msg)+'</div>';}
function apiError(where, err){
  if(err&&err.name==='AbortError')return;
  console.error(err);
  var el=document.getElementById(where);
  if(!el)return;
  var problem=describeApiError(err);
  el.innerHTML='<div class="empty" role="alert">'+esc(problem.message)+(problem.retryable?'<br><button type="button" class="sbtn retry-search">Retry / Retry</button>':'')+'</div>';
  if(!problem.retryable)return;
  el.querySelector('.retry-search').addEventListener('click',function(){
    if(!API_READY||where==='mres')runModuleSearch();else runAlgoSearch();
  });
}
function moduleReadme(m){
  var readme=firstText(m.readme, m.description, m.summary);
  if(!readme){
    readme='# '+(m.name||'module')+'\\n'+
      'Files: '+(m.file_count||0)+' · Classes: '+(m.class_count||0)+' · Functions: '+(m.function_count||0);
    if(asList(m.samples).length)readme+='\\n\\nContents\\n- '+asList(m.samples).join('\\n- ');
  }
  return readme;
}
function normalizeModuleResult(x){return x&&x.m?x.m:x}
function normalizeClassResult(x){return x&&x.c?x.c:x}
function memberFunctions(c){
  var f=asList(c.functions).map(function(fn){
    if(typeof fn==='string')return fn;
    var name=firstText(fn.name, fn.function, fn.signature);
    var sig=firstText(fn.signature);
    return sig||name;
  }).filter(Boolean);
  if(!f.length)f=asList(c.member_functions).filter(Boolean);
  return f.slice(0,12);
}
function algoDesc(c){
  var text=firstText(c.docstring_math, c.description, c.summary, c.task, c.family);
  if(!text&&c.code){text=String(c.code).split('\\n').map(function(line){return line.trim()}).filter(Boolean)[0]||'';}
  return text||'Indexed from the numpy-ml source database.';
}
function scoreLine(c){
  var parts=[];
  if(c.path)parts.push(c.path);
  if(c.lines)parts.push('lines '+c.lines);
  if(c.fused!=null)parts.push('score '+Number(c.fused).toFixed(3));
  return parts.join(' · ');
}

/* ================= rendering ================= */
function renderModules(list){
  var el=document.getElementById('mres');
  if(!el)return;
  MODULE_RESULTS=list.map(normalizeModuleResult);
  if(!list.length){el.innerHTML='<div class="empty">No modules matched.</div>';return;}
  el.innerHTML=list.map(function(raw,i){
    var m=normalizeModuleResult(raw)||{};
    var reason=firstText(m.reason, m.why, asList(m.why).join(' · '));
    var rd=esc(moduleReadme(m))
      .replace(/^# (.+)$/m,'<span class="md-h">$1</span>')
      .replace(/^## (.+)$/gm,'<span class="md-h">$1</span>')
      .replace(/\\n- /g,'<br>- ')
      .replace(/\\n/g,'<br>');
    return '<article class="hit" style="animation-delay:'+(i*0.06)+'s">'
      +'<div class="hit-head"><span class="mname">'+esc(m.name||'module')+'</span>'
      +'<span class="path">'+esc(m.path||('numpy_ml/'+(m.name||'')+'/README.md'))+'</span></div>'
      +(reason?'<p class="module-reason">Why this module: '+esc(reason)+'</p>':'')
      +'<div class="readme">'+rd+'</div>'
      +'<button class="module-select sbtn" type="button" data-index="'+i+'">Select module &amp; continue &rarr;</button></article>';
  }).join('');
  el.querySelectorAll('.module-select').forEach(function(btn){
    btn.addEventListener('click',function(){selectModule(MODULE_RESULTS[+btn.dataset.index])});
  });
}
function resetModuleSelection(){
  renderBubbles([]);
  ALGO_SEARCH_VERSION++;
  var sel=document.getElementById('amod');
  sel.value='';sel.disabled=true;
  document.getElementById('ago').disabled=true;
  document.getElementById('aq').disabled=true;
  document.getElementById('ak').disabled=true;
  document.getElementById('aq').value='';
  document.getElementById('change-module').hidden=true;
  document.getElementById('algo-search').dataset.ready='false';
  document.getElementById('score-summary').innerHTML='';
  document.getElementById('module-context').textContent='Select a module in Step 1 to continue.';
  window.__lastAlgoResults=[];
  FREE_FUNCTION_RESULTS=[];
  setBusy(document.getElementById('ares'),'First find and select a module. Algorithm results will appear here.');
}
function selectModule(m){
  if(!m||!m.name)return;
  var sel=document.getElementById('amod');
  if(!Array.from(sel.options).some(function(option){return option.value===m.name})){
    var option=document.createElement('option');option.value=m.name;option.textContent=m.name;sel.appendChild(option);
  }
  sel.value=m.name;sel.disabled=false;
  document.getElementById('ago').disabled=false;
  document.getElementById('aq').disabled=false;
  document.getElementById('ak').disabled=false;
  document.getElementById('change-module').hidden=false;
  document.getElementById('algo-search').dataset.ready='true';
  document.getElementById('aq').value=MODULE_QUERY||m.name;
  document.getElementById('module-context').textContent='Searching within '+m.name+' · selected in Step 1';
  runAlgoSearch();
  document.getElementById('algo-search').scrollIntoView({behavior:'smooth',block:'start'});
}
function rememberSearch(){
  if(typeof searchSession==='undefined')return;
  searchSession.current={
    query:document.getElementById('mq').value,moduleQuery:MODULE_QUERY,
    moduleTopK:document.getElementById('mk').value,algorithmQuery:document.getElementById('aq').value,
    algorithmTopK:document.getElementById('ak').value,module:document.getElementById('amod').value,
    modules:MODULE_RESULTS,classes:window.__lastAlgoResults||[],freeFunctions:FREE_FUNCTION_RESULTS
  };
}
function renderClasses(list,freeFunctions){
  var el=document.getElementById('ares');
  if(!el)return;
  FREE_FUNCTION_RESULTS=asList(freeFunctions);
  window.__lastAlgoResults=list.map(function(raw){return normalizeClassResult(raw)||{}}).concat(FREE_FUNCTION_RESULTS);
  renderScores(window.__lastAlgoResults);
  renderBubbles(window.__lastAlgoResults);
  rememberSearch();
  if(!window.__lastAlgoResults.length){el.innerHTML='<div class="empty">No matching algorithms or functions. Refine your query within the selected module, or choose another module in Step 1.</div>';return;}
  el.innerHTML=window.__lastAlgoResults.map(function(c,i){
    var f=memberFunctions(c);
    var meta=scoreLine(c);
    return '<article class="acard" id="algorithm-result-'+i+'" tabindex="-1" style="animation-delay:'+(i*0.06)+'s">'
      +'<div class="left"><div class="cname">'+esc(c.entity||c.name||c.class_name||'Algorithm')+'</div><span class="entity-kind">'+(c.type==='function'?'Function / Function':'Class / Class')+'</span>'
      +'<div class="tagrow"><span class="mtag">'+esc(c.module||c.m||'module')+'</span>'+(c.family?'<span class="mtag">'+esc(c.family)+'</span>':'')+'</div>'
      +'<div class="desc2">'+esc(algoDesc(c))+'</div>'+(meta?'<div class="desc2">'+esc(meta)+'</div>':'')
      +renderScoreBreakdown(c,window.__lastAlgoResults)
      +'<p class="result-taxonomy"><b>Family / Family:</b> '+esc(c.family||'Not indexed')+' &middot; <b>Task / Task:</b> '+esc(c.task||'Not indexed')+'</p>'
      +'<div class="result-source"><div class="flabel">Indexed source / Indexed source</div><pre tabindex="0" aria-label="Source code for '+esc(c.entity||c.name||'Algorithm')+'"><code>'+esc(c.code||'No source code is available in this index.')+'</code></pre></div>'
      +'<button class="learn-open" type="button" data-index="'+i+'">Open the Learn Page</button></div>'
      +'<div class="right"><div class="flabel">Member functions</div>'
      +'<div class="function-list">'+(asList(c.functions).length?asList(c.functions).map(function(fn){return '<div class="function-entry"><span class="fn">'+esc(typeof fn==='string'?fn:firstText(fn.signature,fn.name))+'</span>'+(fn&&typeof fn==='object'&&fn.meaning?'<p>'+esc(fn.meaning)+'</p>':'')+'</div>'}).join(''):(f.length?f.map(function(fn){return '<div class="function-entry"><span class="fn">'+esc(fn)+'</span></div>'}).join(''):'<span class="fn">No member functions indexed</span>'))+'</div>'
      +'</div></article>';
  }).join('');
  document.querySelectorAll('.learn-open').forEach(function(btn){
    btn.addEventListener('click',function(){
      var c=window.__lastAlgoResults[+btn.dataset.index];
      if(!c)return;
      rememberSearch();
      try{localStorage.setItem('codexray:selectedAlgorithm',JSON.stringify({entity:c.entity||c.name||c.class_name,module:c.module,path:c.path}));}catch(e){}
      location.hash='#/learn';
    });
  });
}
var bubbleState=null;
function bubbleStop(){
  if(bubbleState&&bubbleState.raf)window.cancelAnimationFrame(bubbleState.raf);
  bubbleState=null;
}
function renderBubbles(list){
  bubbleStop();
  var field=document.getElementById('bubble-field');
  if(!field)return;
  field.innerHTML='';
  field.hidden=!list.length;
  if(!list.length)return;
  var hoverScale=1.1,gap=2,hintHeight=24;
  var scores=list.map(function(item){return Number.isFinite(item.fused)?item.fused:0});
  var maximum=Math.max.apply(null,[0.0001].concat(scores));
  field.innerHTML=list.map(function(item,index){
    var ratio=Math.max(0,Math.min(1,scores[index]/maximum));
    var size=Math.round(62+ratio*74);
    var hue=Math.floor(Math.random()*360);
    var name=item.entity||item.name||item.class_name||'Algorithm';
    return '<button type="button" class="bubble" data-result="'+index+'" style="width:'+size+'px;height:'+size+'px;background:radial-gradient(circle at 32% 28%,hsl('+hue+' 92% 92%),hsl('+((hue+38)%360)+' 78% 76%));color:hsl('+hue+' 62% 26%)" aria-label="'+esc(name)+'; relevance '+scores[index].toFixed(3)+'; jump to result"><span>'+esc(name)+'<span class="bub-pct">'+Math.round(ratio*100)+'%</span></span></button>';
  }).join('')+'<div class="bubble-dot">Bubble size = relevance= </div>';
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state={list:[],raf:0,width:0};
  bubbleState=state;
  field.querySelectorAll('.bubble').forEach(function(button,index){
    var bubble={el:button,size:Math.round(62+Math.max(0,Math.min(1,scores[index]/maximum))*74),x:0,y:0,vx:(Math.random()-0.5)*0.55||0.25,vy:(Math.random()-0.5)*0.55||0.2,scale:reduced?1:0.15,hovered:false};
    state.list.push(bubble);
    function pause(){bubble.hovered=true}
    function resume(){bubble.hovered=button.matches(':hover, :focus-visible')}
    button.addEventListener('mouseenter',pause);
    button.addEventListener('mouseleave',resume);
    button.addEventListener('focus',pause);
    button.addEventListener('blur',resume);
    button.addEventListener('click',function(){
      var card=document.getElementById('algorithm-result-'+button.dataset.result);
      if(card){
        document.querySelectorAll('#ares .acard').forEach(function(result){result.classList.remove('active')});
        card.classList.add('active');
        card.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
        card.focus({preventScroll:true});
      }
    });
  });
  function layout(){
    var width=field.clientWidth||900;
    var cell=Math.ceil(136*hoverScale+gap+4);
    var columns=Math.max(1,Math.floor(width/cell));
    var rows=Math.ceil(state.list.length/columns);
    field.style.height=Math.max(236,rows*cell+hintHeight)+'px';
    state.width=width;
    state.list.forEach(function(bubble,index){
      bubble.x=(index%columns)*(width/columns)+(width/columns-bubble.size)/2;
      bubble.y=Math.floor(index/columns)*cell+(cell-bubble.size)/2;
    });
  }
  function clamp(bubble,width,floor){
    var margin=bubble.size*(hoverScale-1)/2+2;
    var right=Math.max(margin,width-bubble.size-margin);
    var bottom=Math.max(margin,floor-bubble.size-margin);
    if(bubble.x<margin){bubble.x=margin;bubble.vx=Math.abs(bubble.vx)}
    if(bubble.y<margin){bubble.y=margin;bubble.vy=Math.abs(bubble.vy)}
    if(bubble.x>right){bubble.x=right;bubble.vx=-Math.abs(bubble.vx)}
    if(bubble.y>bottom){bubble.y=bottom;bubble.vy=-Math.abs(bubble.vy)}
  }
  function separate(width,floor){
    for(var pass=0;pass<2;pass++){
      state.list.forEach(function(first,index){
        state.list.slice(index+1).forEach(function(second){
          var deltaX=second.x+second.size/2-first.x-first.size/2;
          var deltaY=second.y+second.size/2-first.y-first.size/2;
          var distance=Math.hypot(deltaX,deltaY);
          var minimum=(first.size+second.size)*hoverScale/2+gap;
          if(distance>=minimum)return;
          if(distance<0.01){deltaX=Math.random()-0.5;deltaY=Math.random()-0.5;distance=Math.hypot(deltaX,deltaY)||1}
          var normalX=deltaX/distance,normalY=deltaY/distance,needed=minimum-distance;
          var weight=first.hovered?0:second.hovered?1:0.5;
          if(first.hovered&&second.hovered)return;
          first.x-=normalX*needed*weight;first.y-=normalY*needed*weight;
          second.x+=normalX*needed*(1-weight);second.y+=normalY*needed*(1-weight);
          var firstVelocity=first.vx*normalX+first.vy*normalY;
          var secondVelocity=second.vx*normalX+second.vy*normalY;
          if(firstVelocity-secondVelocity>0){
            first.vx-=(firstVelocity-secondVelocity)*normalX;first.vy-=(firstVelocity-secondVelocity)*normalY;
            second.vx+=(firstVelocity-secondVelocity)*normalX;second.vy+=(firstVelocity-secondVelocity)*normalY;
          }
        });
      });
    }
    state.list.forEach(function(bubble){clamp(bubble,width,floor)});
  }
  function step(){
    if(bubbleState!==state)return;
    var width=field.clientWidth||900;
    if(width!==state.width)layout();
    var floor=(field.clientHeight||236)-hintHeight;
    state.list.forEach(function(bubble){
      if(!bubble.hovered&&!reduced&&!document.hidden){bubble.x+=bubble.vx;bubble.y+=bubble.vy}
      clamp(bubble,width,floor);
      bubble.scale=reduced?(bubble.hovered?hoverScale:1):bubble.scale+((bubble.hovered?hoverScale:1)-bubble.scale)*0.18;
    });
    if(!reduced)separate(width,floor);
    state.list.forEach(function(bubble){
      bubble.el.style.transform='translate3d('+bubble.x.toFixed(1)+'px,'+bubble.y.toFixed(1)+'px,0) scale('+bubble.scale.toFixed(3)+')';
      bubble.el.style.zIndex=bubble.hovered?6:2;
    });
    state.raf=requestAnimationFrame(step);
  }
  layout();
  step();
}
function renderScoreBreakdown(item,list){
  var channels=[{key:'fused',label:'Fused / Fused'},{key:'keyword',label:'Keyword / Keyword'},{key:'semantic',label:'Semantic / Semantic'}];
  return '<div class="result-scores">'+channels.map(function(channel){
    var value=item[channel.key];
    if(typeof value!=='number'||!Number.isFinite(value))return '<div class="result-score"><span>'+channel.label+'</span><span class="score-value">Not available</span></div>';
    var values=list.map(function(result){return result[channel.key]}).filter(function(score){return typeof score==='number'&&Number.isFinite(score)});
    var min=channel.key==='semantic'?-1:0;
    var max=Math.max.apply(null,[1].concat(values));
    return '<div class="result-score score-'+channel.key+'"><label>'+channel.label+' <strong>'+value.toFixed(3)+'</strong><meter min="'+min+'" max="'+max+'" value="'+value+'" aria-label="'+channel.label+' for '+esc(item.entity||item.name||'Algorithm')+'"></meter></label></div>';
  }).join('')+'</div><p class="score-explanation">Ranking scores, not probabilities. Each channel uses its own scale.</p>';
}
function renderScores(list){
  var el=document.getElementById('score-summary');
  var scored=list.filter(function(item){return typeof item.fused==='number'&&Number.isFinite(item.fused)});
  if(!scored.length){el.innerHTML='';return;}
  var max=Math.max.apply(null,[1].concat(scored.map(function(item){return item.fused})));
  el.innerHTML='<details class="score-details"><summary>View relevance scores</summary><p>Scores rank these search results; they are not probabilities.</p>'
    +scored.map(function(item){return '<div class="score-row"><span>'+esc(item.entity||item.name)+'</span><meter min="0" max="'+max+'" value="'+Math.max(0,item.fused)+'" aria-label="Ranking score for '+esc(item.entity||item.name)+'"></meter><code>'+item.fused.toFixed(3)+'</code></div>'}).join('')+'</details>';
}

/* ================= API-backed search ================= */
function loadModules(){
  var sel=document.getElementById('amod');
  return api('/api/modules').then(function(data){
    MODULE_CACHE=asList(data.modules);
    if(sel){
      var previous=sel.value;
      sel.innerHTML='<option value="" selected>Select a module first</option>';
      MODULE_CACHE.forEach(function(m){
        var o=document.createElement('option');o.value=m.name;o.textContent=m.name;
        sel.appendChild(o);
      });
      if(previous)sel.value=previous;
    }
    API_READY=true;
    return MODULE_CACHE;
  });
}
function runModuleSearch(){
  if(!API_READY)return window.__ensureSearchBooted().then(function(){if(API_READY)runModuleSearch()});
  var q=(document.getElementById('mq').value||'').trim();
  var k=+document.getElementById('mk').value||3;
  var version=++MODULE_SEARCH_VERSION;
  MODULE_QUERY=q;
  resetModuleSelection();
  MODULE_RESULTS=[];
  rememberSearch();
  setBusy(document.getElementById('mres'),'Searching indexed modules...');
  var p=q?api('/api/modules/search',{method:'POST',body:JSON.stringify({query:q,top_k:k})}):Promise.resolve({results:MODULE_CACHE.slice(0,k)});
  p.then(function(data){
    if(version!==MODULE_SEARCH_VERSION)return;
    if(data.not_in_repo){
      renderModules([]);
      setBusy(document.getElementById('mres'),'Not included in NumPy-ML: '+(data.algorithm||q)+'. Try another algorithm or topic.');
      setBusy(document.getElementById('ares'),'This algorithm is not included in the repository, so Step 2 cannot continue.');
      return;
    }
    renderModules(asList(data.results));
    rememberSearch();
  }).catch(function(err){if(version===MODULE_SEARCH_VERSION)apiError('mres',err)});
}
function runAlgoSearch(){
  var mod=document.getElementById('amod').value;
  if(!mod)return;
  document.getElementById('module-context').textContent='Searching within '+mod+' · selected in Step 1';
  var version=++ALGO_SEARCH_VERSION;
  var q=(document.getElementById('aq').value||'').trim();
  var k=+document.getElementById('ak').value||3;
  if(!q){renderClasses([]);return;}
  document.getElementById('score-summary').innerHTML='';
  setBusy(document.getElementById('ares'),'Searching indexed algorithms...');
  renderBubbles([]);
  api('/api/search',{method:'POST',body:JSON.stringify({query:q,top_k:k,module:mod,family:'',task:''})})
    .then(function(data){
      if(version!==ALGO_SEARCH_VERSION)return;
      renderClasses(asList(data.results),asList(data.free_functions));
      if(data.not_in_repo)setBusy(document.getElementById('ares'),'Not included in NumPy-ML: '+(data.algorithm||q)+'. Try another query.');
    })
    .catch(function(err){if(version===ALGO_SEARCH_VERSION)apiError('ares',err)});
}
function bootSearch(){
  return loadModules().then(function(){
    if(!MODULE_SEARCH_VERSION){
      var saved=typeof searchSession!=='undefined'?searchSession.current:null;
      if(saved){
        document.getElementById('mq').value=saved.query||'';
        document.getElementById('mk').value=saved.moduleTopK||'1';
        document.getElementById('ak').value=saved.algorithmTopK||'3';
        MODULE_QUERY=saved.moduleQuery||'';
        renderModules(asList(saved.modules));
        resetModuleSelection();
        if(saved.module&&MODULE_CACHE.some(function(item){return item.name===saved.module})){
          document.getElementById('amod').value=saved.module;
          document.getElementById('amod').disabled=false;
          document.getElementById('aq').value=saved.algorithmQuery||'';
          document.getElementById('aq').disabled=false;
          document.getElementById('ak').disabled=false;
          document.getElementById('ago').disabled=false;
          document.getElementById('change-module').hidden=false;
          document.getElementById('algo-search').dataset.ready='true';
          document.getElementById('module-context').textContent='Searching within '+saved.module+' · selected in Step 1';
          renderClasses(asList(saved.classes).filter(function(item){return item.type!=='function'}),asList(saved.freeFunctions));
        }
        return;
      }
      renderModules(MODULE_CACHE.slice(0,+document.getElementById('mk').value||3));
      resetModuleSelection();
    }
  }).catch(function(err){
    SEARCH_BOOTED=null;
    apiError('mres',err);apiError('ares',err);
  });
}

document.getElementById('mgo').addEventListener('click',runModuleSearch);
document.getElementById('change-module').addEventListener('click',function(){
  resetModuleSelection();
  rememberSearch();
  document.getElementById('module-search').scrollIntoView({behavior:'smooth',block:'start'});
  document.getElementById('mq').focus();
});
document.getElementById('mq').addEventListener('keydown',function(e){if(e.key==='Enter')runModuleSearch()});
document.getElementById('mk').addEventListener('change',runModuleSearch);
document.getElementById('ago').addEventListener('click',runAlgoSearch);
document.getElementById('aq').addEventListener('keydown',function(e){if(e.key==='Enter')runAlgoSearch()});
document.getElementById('ak').addEventListener('change',runAlgoSearch);
document.getElementById('amod').addEventListener('change',runAlgoSearch);
document.querySelectorAll('.tchip').forEach(function(c){
  c.addEventListener('click',function(){
    var panel=c.closest('.panel');
    var input=panel.querySelector('input[type=text]');
    input.value=c.textContent.trim();
    if(panel.id==='module-search')runModuleSearch();else runAlgoSearch();
    input.focus();
  });
});
window.__runAlgoSearch=runAlgoSearch;
window.__runModuleSearch=runModuleSearch;
var SEARCH_BOOTED=null;
window.__ensureSearchBooted=function(){
  if(!SEARCH_BOOTED)SEARCH_BOOTED=bootSearch();
  return SEARCH_BOOTED;
};
if(location.hash==='#search')window.__ensureSearchBooted();

/* ================= particles ================= */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var cvs=document.getElementById('fx2-particles'),ctx=cvs.getContext('2d');
  var DPR=Math.min(devicePixelRatio||1,2),P=[],last=0;
  function size(){cvs.width=innerWidth*DPR;cvs.height=innerHeight*DPR;
    cvs.style.width=innerWidth+'px';cvs.style.height=innerHeight+'px';
    var n=Math.round(innerWidth*innerHeight/52000);P=[];
    for(var i=0;i<n;i++)P.push(np());}
  function np(){return{x:Math.random()*cvs.width,y:Math.random()*cvs.height,
    r:(0.5+Math.random()*1.5)*DPR,vy:(4+Math.random()*10)*DPR,vx:(Math.random()-.5)*2*DPR,
    ph:Math.random()*6.28,sp:.5+Math.random()*1.4,a:.18+Math.random()*.4};}
  function tick(t){var dt=Math.min(.05,(t-last)/1000||.016);last=t;
    var veil=document.getElementById('veil');
    if(document.hidden||!(veil&&veil.closest('.orbit-page').classList.contains('v-search'))){
      setTimeout(function(){requestAnimationFrame(tick);},250);
      return;
    }
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(var i=0;i<P.length;i++){var p=P[i];p.y-=p.vy*dt;p.x+=p.vx*dt;
      if(p.y<-8||p.x<-8||p.x>cvs.width+8)P[i]=p=np(),p.y=cvs.height+8;
      var tw=.55+.45*Math.sin(t*.001*p.sp+p.ph);
      ctx.beginPath();ctx.fillStyle='rgba(98,110,134,'+(p.a*1.4*tw).toFixed(3)+')';
      ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill();}
    requestAnimationFrame(tick);}
  addEventListener('resize',size);size();
  requestAnimationFrame(function(t){last=t;requestAnimationFrame(tick);});
})();

<\/script>
`])),C0);function D0({view:u}){const s=M.useRef(null);return M.useEffect(()=>{const o=s.current;if(!o)return;o.innerHTML=B0;const c=Array.from(o.querySelectorAll("script")).map(f=>{const v=f.textContent||"";return f.remove(),v}),m=_0(o,c,O0);return()=>{m(),o.innerHTML=""}},[]),M.useEffect(()=>{if(u==="search"&&location.hash!=="#search")try{history.replaceState(null,"","#search"),window.dispatchEvent(new HashChangeEvent("hashchange"))}catch{}},[u]),h.jsx("div",{className:"orbit-page",ref:s})}const du=[{id:"math-card",num:"01",en:`Math
Card`,zh:"Math Card",tagEn:"Indexed math context, parameters, documentation and references.",tagZh:"View indexed math tags, parameters, source docs, and references.",bg:"linear-gradient(155deg, rgba(237,243,252,0.8) 0%, rgba(176,192,215,0.64) 48%, rgba(228,234,245,0.92) 100%)",fg:"#1b1f24",ink:"rgba(27, 31, 36, 0.32)",accent:"#3d4652",pattern:"orbit"},{id:"path",num:"02",en:"Path",zh:"Learning Path",tagEn:"A metadata-based reading guide with your saved progress.",tagZh:"Reading suggestions based on index info, with progress saving and module switching.",bg:"linear-gradient(155deg, rgba(218,228,243,0.82) 0%, rgba(141,160,188,0.72) 52%, rgba(204,215,232,0.94) 100%)",fg:"#1b1f24",ink:"rgba(27, 31, 36, 0.34)",accent:"#454f5c",pattern:"trajectory"},{id:"related-functions",num:"03",en:`Related
Functions`,zh:"Related Functions",tagEn:"Browse member functions, documentation and source code.",tagZh:"View member functions, their descriptions, and source code.",bg:"linear-gradient(155deg, rgba(108,130,164,0.82) 0%, rgba(43,61,89,0.86) 55%, rgba(27,39,60,0.96) 100%)",fg:"#edf3ff",ink:"rgba(222, 234, 255, 0.32)",accent:"#2e3641",pattern:"constellation"},{id:"call-graph",num:"04",en:`Call
Graph`,zh:"Call Graph",tagEn:"Static call symbols resolved from indexed source.",tagZh:"View static call relations in indexed source and unresolved symbols.",bg:"linear-gradient(155deg, rgba(112,126,150,0.78) 0%, rgba(49,64,87,0.86) 55%, rgba(25,35,53,0.96) 100%)",fg:"#f2f4f7",ink:"rgba(242, 244, 247, 0.38)",accent:"#39424d",pattern:"lattice"},{id:"compare",num:"05",en:"Compare",zh:"Compare",tagEn:"Compare parameters and mathematical methods within a module.",tagZh:"Pick another algorithm in the same module and compare parameters and math methods.",bg:"linear-gradient(155deg, rgba(69,78,103,0.88) 0%, rgba(28,35,53,0.94) 55%, rgba(13,20,35,0.98) 100%)",fg:"#edf0f4",ink:"rgba(237, 240, 244, 0.32)",accent:"#232a33",pattern:"singularity"},{id:"complexity",num:"06",en:"Complexity",zh:"Complexity",tagEn:"Inspect loops, branches and source size.",tagZh:"View loops, branches, and source size.",bg:"linear-gradient(155deg, rgba(224,233,247,0.82) 0%, rgba(151,174,204,0.7) 55%, rgba(197,213,233,0.95) 100%)",fg:"#1b1f24",ink:"rgba(27,31,36,0.32)",accent:"#3d4652",pattern:"wave"},{id:"quiz",num:"07",en:"Self-check",zh:"Self-check",tagEn:"Source-aware questions with revealable reference answers.",tagZh:"Dynamic questions from the current algorithm source and metadata, with answers and evidence.",bg:"linear-gradient(155deg, rgba(139,151,181,0.82) 0%, rgba(66,79,109,0.88) 55%, rgba(34,44,67,0.96) 100%)",fg:"#f2f4f7",ink:"rgba(242,244,247,0.38)",accent:"#39424d",pattern:"prism"},{id:"recommend",num:"08",en:"Recommend",zh:"Recommend",tagEn:"Related algorithms ranked by semantic similarity and metadata overlap.",tagZh:"Recommend similar algorithms by semantic score and module/task/math-method overlap.",bg:"linear-gradient(155deg, rgba(218,228,243,0.82), rgba(66,79,109,0.88))",fg:"#edf3ff",ink:"rgba(222,234,255,0.32)",accent:"#39424d",pattern:"constellation"}];function L0({kind:u,ink:s,className:o}){const c=M.useRef(null);return M.useEffect(()=>{const m=c.current;if(!m)return;const f=m.getContext("2d");if(!f)return;const v=Math.min(window.devicePixelRatio||1,2),S=window.matchMedia("(prefers-reduced-motion: reduce)");let y=0,g=-1/0,_=!0;const R=H=>{const X=m.width/v,Q=m.height/v,Z=X*.32,ue=H*.16;f.setTransform(v,0,0,v,0,0),f.clearRect(0,0,X,Q),f.save(),f.translate(X*.5,Q*.35);const ge=f.createRadialGradient(0,0,Z*.1,0,0,Z*1.55);ge.addColorStop(0,"rgba(232,240,255,0.32)"),ge.addColorStop(.5,"rgba(156,183,255,0.19)"),ge.addColorStop(.76,"rgba(197,171,255,0.09)"),ge.addColorStop(1,"rgba(170,200,255,0)"),f.fillStyle=ge,f.fillRect(-X,-Q,X*2,Q*2);const $=f.createLinearGradient(-Z,-Z,Z,Z);$.addColorStop(0,"rgba(255,255,255,0.95)"),$.addColorStop(.22,"rgba(165,184,220,0.44)"),$.addColorStop(.43,"rgba(247,251,255,0.95)"),$.addColorStop(.64,"rgba(119,151,209,0.44)"),$.addColorStop(.82,"rgba(215,200,255,0.8)"),$.addColorStop(1,"rgba(255,255,255,0.9)");const Se=(G,te,ce,se=1)=>{f.save(),f.rotate(ce),f.beginPath(),f.ellipse(0,0,G,G*te,0,0,Math.PI*2),f.strokeStyle=$,f.lineWidth=se,f.stroke(),f.restore()};if(f.strokeStyle=s,f.lineWidth=.6,u!=="trajectory"){f.beginPath(),f.arc(0,0,Z*1.22,-Math.PI*.93,-Math.PI*.12),f.arc(0,0,Z*1.22,Math.PI*.08,Math.PI*.78),f.stroke();for(let G=0;G<48;G++){const te=G/48*Math.PI*2,ce=Z*(G%4===0?1.28:1.31);f.beginPath(),f.moveTo(Math.cos(te)*ce,Math.sin(te)*ce),f.lineTo(Math.cos(te)*Z*1.35,Math.sin(te)*Z*1.35),f.stroke()}}if(u==="orbit")for(let G=0;G<5;G++)Se(Z*(.79+G*.04),.38+G*.1,-.65+G*.27+ue,G===2?2.8:.8);else if(u==="trajectory"){const G=C=>[Math.sin(C*Math.PI*2-Math.PI*.65)*Z*.64,Z*(.93-C*1.98)];for(let C=-1;C<=1;C++){f.beginPath();for(let k=0;k<=100;k++){const[L,P]=G(k/100);k===0?f.moveTo(L+C*5,P):f.lineTo(L+C*5,P)}f.strokeStyle=C===0?"rgba(237,247,255,0.95)":$,f.lineWidth=C===0?2.2:.8,f.shadowColor="#9bc7ff",f.shadowBlur=C===0?9:0,f.stroke()}f.shadowBlur=0;for(let C=0;C<5;C++){const[k,L]=G(C/4);f.save(),f.translate(k,L),Se(Z*(.2+C*.014),.34,-.15,1.4),f.fillStyle="#eef6ff",f.shadowColor="#c0daff",f.shadowBlur=10,f.beginPath(),f.arc(0,0,C===4?3.5:2.2,0,Math.PI*2),f.fill(),f.shadowBlur=0,f.fillStyle=s,f.font="7px monospace",f.fillText(`0${C+1}`,Z*.33,2),f.restore()}const[te,ce]=G((H*.12+.12)%1),se=f.createRadialGradient(te,ce,0,te,ce,12);se.addColorStop(0,"rgba(255,255,255,1)"),se.addColorStop(.22,"rgba(202,229,255,0.95)"),se.addColorStop(1,"rgba(146,186,255,0)"),f.fillStyle=se,f.fillRect(te-12,ce-12,24,24)}else if(u==="constellation"){const G=Array.from({length:12},(te,ce)=>{const se=ce*2.39996+ue,C=Z*Math.sqrt((ce+1)/12);return[Math.cos(se)*C,Math.sin(se)*C*.85]});f.strokeStyle=$;for(let te=0;te<G.length;te++){for(let ce=te+1;ce<G.length;ce++)Math.hypot(G[te][0]-G[ce][0],G[te][1]-G[ce][1])>Z*.95||(f.beginPath(),f.moveTo(...G[te]),f.lineTo(...G[ce]),f.stroke());f.shadowColor="#bcd7ff",f.shadowBlur=10,f.fillStyle="#eef5ff",f.beginPath(),f.arc(G[te][0],G[te][1],te%3===0?2.8:1.5,0,Math.PI*2),f.fill(),f.shadowBlur=0}}else if(u==="lattice")for(let G=0;G<11;G++){Se(Z,Math.max(.07,Math.abs(Math.cos(G/11*Math.PI+ue))),-.45,.7);const te=(G/10-.5)*Z*1.85;f.save(),f.translate(0,te),Se(Math.sqrt(Math.max(0,Z*Z-te*te)),.17,-.12,.6),f.restore()}else if(u==="singularity")for(let G=0;G<26;G++)Se(Z*(.26+G*.03),.58+G*.009,G*.095+ue,G%5===0?1.8:.65);else if(u==="wave"){f.strokeStyle=$;for(let G=0;G<24;G++){f.beginPath();for(let te=0;te<=80;te++){const ce=te/80*2-1,se=Math.sqrt(Math.max(0,1-ce*ce)),C=Math.sin(ce*4+G*.16+ue*3)*Z*.32+(G/23-.5)*Z*1.4,k=ce*Z,L=C*se;te===0?f.moveTo(k,L):f.lineTo(k,L)}f.stroke()}}else for(let G=0;G<7;G++){f.save(),f.rotate(-.3+ue+G*.07);const te=Z*(.95-G*.08);f.strokeStyle=$,f.lineWidth=G===0?2:.8,f.beginPath(),f.moveTo(0,-te),f.lineTo(te*.8,0),f.lineTo(0,te),f.lineTo(-te*.8,0),f.closePath(),f.stroke(),f.restore()}if(u==="orbit"){const G=f.createRadialGradient(-8,-10,0,0,0,Z*.25);G.addColorStop(0,"#ffffff"),G.addColorStop(.28,"#e3edff"),G.addColorStop(.63,"#91a4c2"),G.addColorStop(.9,"#45536e"),G.addColorStop(1,"#c5d8ff"),f.fillStyle=G,f.beginPath(),f.arc(0,0,Z*.25,0,Math.PI*2),f.fill()}const Ne=ue*2-.7,Ue=Math.cos(Ne)*Z*1.22,Ye=Math.sin(Ne)*Z*1.22;f.shadowColor="#b5cfff",f.shadowBlur=14,f.strokeStyle="rgba(245,250,255,0.95)",f.lineWidth=.9,f.beginPath(),f.moveTo(Ue-7,Ye),f.lineTo(Ue+7,Ye),f.moveTo(Ue,Ye-7),f.lineTo(Ue,Ye+7),f.stroke(),f.restore()},q=()=>{m.width=Math.max(1,Math.floor(m.clientWidth*v)),m.height=Math.max(1,Math.floor(m.clientHeight*v)),R(0)};q();const K=new ResizeObserver(q);K.observe(m);const U=new IntersectionObserver(H=>{_=H[0].isIntersecting});U.observe(m);const Y=H=>{_&&!document.hidden&&H-g>=40&&(R(S.matches?0:H/1e3),g=H),S.matches||(y=requestAnimationFrame(Y))},j=()=>{cancelAnimationFrame(y),R(0),S.matches||(y=requestAnimationFrame(Y))};return S.addEventListener("change",j),j(),()=>{cancelAnimationFrame(y),K.disconnect(),U.disconnect(),S.removeEventListener("change",j)}},[u,s]),h.jsx("canvas",{ref:c,className:o,"aria-hidden":"true"})}const yu=(u,s)=>(u%s+s)%s;function j0(u,s,o){let c=yu(u-s,o);return c>o/2&&(c-=o),c}const qm=[-2.2,1.6,-1.1,2,-1.5];function q0({modes:u,onActive:s}){const o=u.length,[c,m]=M.useState(0),[f,v]=M.useState(()=>window.innerWidth),[S,y]=M.useState(!1),g=M.useRef(0),_=M.useRef(0),R=M.useRef(0),q=M.useRef(!1),K=M.useRef(0),U=M.useRef(0),Y=M.useRef(!1),j=M.useRef(0),H=M.useRef(0),X=M.useRef(0),Q=M.useRef(s);Q.current=s;const Z=M.useRef(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);M.useEffect(()=>{const L=()=>v(window.innerWidth);return window.addEventListener("resize",L),()=>window.removeEventListener("resize",L)},[]);const ue=f<480?172:f<768?200:240,ge=Math.round(ue*1.3),$=Math.round(ue*.68),Se=Math.round(ue*.55);M.useEffect(()=>{let L=0;const P=()=>{q.current||(Z.current?(g.current=_.current,R.current=0):(R.current+=(_.current-g.current)*.085,R.current*=.78,g.current+=R.current));const re=g.current;Math.abs(re-j.current)>4e-4&&(j.current=re,m(re));const b=yu(Math.round(re),o);b!==X.current&&(X.current=b,Q.current(b),j.current=re,m(re)),L=requestAnimationFrame(P)};return L=requestAnimationFrame(P),()=>cancelAnimationFrame(L)},[o]);const Ne=()=>{H.current=Date.now()},Ue=M.useCallback(L=>{_.current=Math.round(_.current)+L,Ne()},[]),Ye=M.useCallback(L=>{let P=yu(L-g.current,o);P>o/2&&(P-=o),_.current=g.current+P,Ne()},[o]);M.useEffect(()=>{if(!S||Z.current)return;const L=window.setInterval(()=>{!q.current&&Date.now()-H.current>4500&&(_.current=Math.round(_.current)+1)},4e3);return()=>window.clearInterval(L)},[S]);const G=M.useRef(!1),te=L=>{q.current=!0,G.current=!1,K.current=L.clientX,U.current=g.current,Y.current=!1},ce=L=>{if(!q.current)return;const P=L.clientX-K.current;Math.abs(P)>8&&(Y.current=!0,G.current||(G.current=!0,L.currentTarget.setPointerCapture(L.pointerId))),Y.current&&(g.current=U.current-P/$,R.current=0)},se=()=>{q.current&&(q.current=!1,_.current=Math.round(g.current),Ne())},C=L=>{L.key==="ArrowLeft"?(L.preventDefault(),L.currentTarget.focus(),Ue(-1)):L.key==="ArrowRight"&&(L.preventDefault(),L.currentTarget.focus(),Ue(1))},k=yu(Math.round(c),o);return h.jsxs("div",{className:"relative",children:[h.jsx("div",{className:"relative mx-auto h-[300px] w-full max-w-6xl touch-pan-y select-none outline-none sm:h-[350px] md:h-[400px]",style:{perspective:"1400px"},role:"region","aria-label":"Learning mode card deck",tabIndex:0,onKeyDown:C,onPointerDown:te,onPointerMove:ce,onPointerUp:se,onPointerCancel:se,onLostPointerCapture:se,onPointerLeave:()=>{G.current||se()},children:h.jsx("div",{className:"absolute inset-0",style:{transformStyle:"preserve-3d"},children:u.map((L,P)=>{const re=j0(P,c,o),b=Math.abs(re),B=b>o/2-.15,V=P===k,F=`translate(-50%, -50%) translateX(${(re*$).toFixed(2)}px) translateZ(${(-b*Se).toFixed(2)}px) rotateY(${(re*28).toFixed(2)}deg) rotateZ(${(qm[P%qm.length]-re*1.4).toFixed(2)}deg)`;return h.jsxs("button",{type:"button","aria-label":`${L.en.replace(`
`," ")} / ${L.zh}`,"aria-current":V,"aria-hidden":B,tabIndex:B?-1:0,onClick:()=>{if(Y.current){Y.current=!1;return}Ye(P)},className:"learn-orbit-card group absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-[20px] text-left",style:{width:ue,height:ge,background:L.bg,color:L.fg,transform:F,zIndex:100-Math.round(b*10),opacity:B?0:Math.max(.4,1-b*.14),filter:`brightness(${(1-b*.16).toFixed(3)})`,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(164,185,220,0.35), 0 28px 50px -20px rgba(24,39,67,0.48)",transition:"opacity 0.3s ease",pointerEvents:B?"none":"auto"},children:[h.jsx(L0,{kind:L.pattern,ink:L.ink,className:"absolute inset-0 h-full w-full"}),h.jsxs("span",{"aria-hidden":"true",className:"absolute left-4 top-3 font-mono text-[8px] tracking-[0.2em] opacity-60",children:["CXR / ",L.pattern.toUpperCase()]}),h.jsx("span",{className:"absolute right-3 top-2.5 rounded-full border border-current/20 px-2 py-0.5 font-mono text-[10px] tracking-widest opacity-70",children:L.num}),h.jsxs("span",{className:"absolute inset-x-0 bottom-0 block p-5",children:[h.jsx("span",{className:"block whitespace-pre-line text-[26px] font-semibold leading-[28px] tracking-tight",children:L.en}),h.jsx("span",{className:"mt-1 block text-sm font-medium opacity-80",children:L.zh}),h.jsxs("span",{className:`mt-2 line-clamp-3 block text-[12px] leading-snug transition-all [transition-duration:400ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${V?"translate-y-0 opacity-90 blur-0":"translate-y-2 opacity-0 blur-[4px] group-hover:translate-y-0 group-hover:opacity-90 group-hover:blur-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-90 group-focus-visible:blur-0"}`,children:[h.jsx("span",{className:"block",children:L.tagZh}),h.jsx("span",{className:"block opacity-70",children:L.tagEn})]})]})]},L.id)})})}),h.jsxs("div",{className:"mx-auto mt-2 flex w-full max-w-6xl flex-wrap items-center justify-center gap-2 px-4 sm:gap-4",children:[h.jsx("button",{type:"button",onClick:()=>Ue(-1),"aria-label":"Previous",className:"flex size-11 items-center justify-center rounded-full border border-[rgba(20,28,40,0.16)] text-[#1c2434]/70 backdrop-blur-sm transition-colors hover:border-[rgba(20,28,40,0.34)] hover:bg-white/50",children:h.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:h.jsx("path",{d:"M15 18l-6-6 6-6"})})}),h.jsx("div",{className:"order-first flex w-full items-center justify-center sm:order-none sm:w-auto",children:u.map((L,P)=>h.jsx("button",{type:"button",onClick:()=>Ye(P),"aria-label":`Go to ${L.zh} / Go to ${L.en.replace(`
`," ")}`,"aria-pressed":P===k,className:"flex size-11 items-center justify-center",children:h.jsx("span",{className:"block rounded-full transition-all duration-300",style:{width:P===k?22:7,height:7,background:P===k?"#101318":"rgba(20,28,40,0.22)"}})},L.id))}),h.jsx("button",{type:"button",onClick:()=>Ue(1),"aria-label":"Next",className:"flex size-11 items-center justify-center rounded-full border border-[rgba(20,28,40,0.16)] text-[#1c2434]/70 backdrop-blur-sm transition-colors hover:border-[rgba(20,28,40,0.34)] hover:bg-white/50",children:h.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:h.jsx("path",{d:"M9 6l6 6-6 6"})})}),h.jsxs("button",{type:"button",onClick:()=>y(L=>!L),"aria-pressed":S,className:`ml-1 flex h-11 items-center gap-2 rounded-full border px-4 font-mono text-[11px] tracking-widest backdrop-blur-sm transition-colors sm:ml-3 ${S?"border-[rgba(20,28,40,0.3)] bg-white/60 text-[#1c2434]":"border-[rgba(20,28,40,0.16)] text-[#1c2434]/50 hover:text-[#1c2434]/80"}`,children:[h.jsx("span",{className:`block size-1.5 rounded-full ${S?"bg-[#101318] animate-pulse":"bg-[#1c2434]/30"}`}),"AUTO"]})]})]})}function Le(u){return u.entity||u.name||u.class_name||""}function Qn(u,s){const o=new URLSearchParams({module:s.module||"",algorithm:Le(s),entity:Le(s),path:s.path||""});return`/api/learn/${u}?${o}`}function Zn(u){const[s,o]=M.useState(0),[c,m]=M.useState({url:null}),f=`${u||""}:${s}`;return M.useEffect(()=>{if(!u)return;const v=new AbortController;return fetch(u,{signal:v.signal}).then(S=>ms(S)).then(S=>{v.signal.aborted||m({url:f,data:S})}).catch(S=>{if(!v.signal.aborted){const y=bu(S);m({url:f,error:y.message,retryable:y.retryable})}}),()=>v.abort()},[u,f]),{...c.url===f?c:{url:u},retry:()=>o(v=>v+1)}}const as="codexray:learning-progress:v1";function pu(u,s,o){return JSON.stringify([u,s,o])}function H0(u){try{const s=JSON.parse(u||"{}");return!s||typeof s!="object"||Array.isArray(s)?{}:Object.fromEntries(Object.entries(s).filter(([,o])=>Array.isArray(o)&&o.every(c=>typeof c=="string")))}catch{return{}}}function $c(u,s,o){return o.filter(c=>(u[s]||[]).includes(c)).length}function fh(u){if(u==null||u==="")return[];if(Array.isArray(u))return u.map(s=>typeof s=="object"?JSON.stringify(s):String(s));if(typeof u=="string"){const s=u.trim();if(!s)return[];try{const o=JSON.parse(s);if(Array.isArray(o))return fh(o)}catch{}return s.split(/[,;|]/).map(o=>o.trim()).filter(Boolean)}return typeof u=="object"?Object.entries(u).map(([s,o])=>`${s}: ${typeof o=="object"?JSON.stringify(o):o}`):[String(u)]}const dh=u=>{const s=u;return fh(s.math_methods||s.mathMethods||s.methods)},Hm=u=>dh(u).map(s=>String(s).toLowerCase()),Ic=u=>JSON.stringify([Le(u),u.path||"",u.lines||""]);function U0(u){return[Le(u),u.task,...dh(u).slice(0,4)].filter(Boolean).join(" ")||Le(u)||"algorithm"}function mh(u,s){const o=[],c=S=>String(S.path||S.module||"").replace(/\\/g,"/").split("/").slice(0,-1).join("/"),m=c(u),f=c(s);m&&f&&m===f&&o.push("same module / same module"),u.family&&s.family&&String(u.family).toLowerCase()===String(s.family).toLowerCase()&&String(u.family).toLowerCase()!=="other"&&o.push("same family / same family"),u.task&&s.task&&String(u.task).toLowerCase()===String(s.task).toLowerCase()&&o.push("same task / same task");const v=Hm(u).filter(S=>Hm(s).includes(S));return v.length&&o.push(`shared math: ${v.slice(0,3).join(", ")} / shared math`),o.length||o.push("semantic/source-code similarity / semantic/source-code similarity"),o}function ls(u,s){let o=Number(s.fused||0);for(const c of mh(u,s))c.includes("same module")&&(o+=.3),c.includes("same family")&&(o+=.2),c.includes("same task")&&(o+=.2),c.includes("shared math")&&(o+=.25);return o}function Y0(u,s){const o=new Map;for(const c of s){if(!Le(c)||Ic(c)===Ic(u))continue;const m=Ic(c);o.has(m)||o.set(m,c)}return[...o.values()].sort((c,m)=>ls(u,m)-ls(u,c)).slice(0,6)}const Yl="rounded-lg border border-slate-300 bg-white/70 px-3 py-2 text-xs text-slate-800 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:cursor-not-allowed disabled:opacity-50",kt="text-sm leading-6 text-slate-500";function mu({children:u}){return h.jsx("div",{className:"learn-glass rounded-2xl border p-5 text-slate-800 shadow-sm sm:p-8",children:u})}function Qe({children:u,error:s=!1}){return h.jsx("p",{role:s?"alert":"status",className:`rounded-xl border p-4 text-sm leading-6 ${s?"border-red-200 bg-red-50 text-red-800":"border-slate-200 bg-white/50 text-slate-600"}`,children:u})}function Gl({message:u,retry:s,retryable:o=!0}){return h.jsxs(Qe,{error:!0,children:[u,o&&h.jsx("button",{className:`${Yl} ml-3`,onClick:s,children:"Retry / Retry"})]})}function Ut({children:u}){return h.jsx("h4",{className:"mb-3 mt-6 font-mono text-xs uppercase tracking-widest text-slate-500",children:u})}function k0({algo:u}){return h.jsxs("div",{className:"mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-300/60 pb-5",children:[h.jsxs("div",{children:[h.jsx("h3",{className:"break-all text-3xl font-semibold tracking-tight",children:Le(u)}),h.jsx("p",{className:kt,children:[u.module,u.family,u.task].filter(Boolean).join(" · ")})]}),h.jsxs("span",{className:"break-all font-mono text-xs text-slate-500",children:[u.path,u.lines?`:${u.lines}`:""]})]})}function Pa({items:u,empty:s="Not available in the index."}){return u.length?h.jsx("ul",{className:"space-y-2 text-sm leading-6",children:u.map((o,c)=>h.jsx("li",{className:"break-words rounded-lg border border-slate-200 bg-white/50 px-3 py-2",children:o},`${c}:${o}`))}):h.jsx("p",{className:kt,children:s})}function X0({algo:u}){const s=Zn(Qn("card",u)),o=s.data?.cards||[];return h.jsxs(h.Fragment,{children:[h.jsx(Ut,{children:"Mathematical context"}),s.error&&h.jsx(Gl,{message:`Math card failed to load:${s.error} You can still view the source documentation below.`,retry:s.retry,retryable:s.retryable}),!s.data&&!s.error&&h.jsx(Qe,{children:"Loading curated math cards…"}),o.map((c,m)=>h.jsxs("article",{className:"my-4 rounded-xl border border-slate-200 bg-white/60 p-4",children:[h.jsx("h5",{className:"font-semibold",children:c.title||c.algorithm||Le(u)}),h.jsx("p",{className:kt,children:c.description||c.intuition||c.summary||c.math}),h.jsx("pre",{className:"mt-3 whitespace-pre-wrap break-words text-sm",children:c.formula||c.formulas?.join(`
`)}),c.references?.length?h.jsx(Pa,{items:c.references}):null]},m)),h.jsxs("div",{className:"grid gap-6 md:grid-cols-2",children:[h.jsxs("section",{children:[h.jsx(Ut,{children:"Indexed mathematical methods · math method"}),h.jsx(Pa,{items:u.math_methods||[]})]}),h.jsxs("section",{children:[h.jsx(Ut,{children:"Constructor parameters · parameters"}),h.jsx(Pa,{items:u.params||[]})]})]}),h.jsx(Ut,{children:"Indexed documentation"}),h.jsx("pre",{className:"max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-white/60 p-4 text-sm leading-7",children:u.docstring_math||"No mathematical description is available in the index."}),h.jsx(Ut,{children:"References · references"}),h.jsx(Pa,{items:u.references||[]}),h.jsxs("details",{className:"mt-6 rounded-xl border border-slate-200 p-4",children:[h.jsx("summary",{className:"cursor-pointer text-sm font-medium",children:"View indexed source"}),h.jsx("pre",{className:"mt-4 max-h-96 overflow-auto text-xs leading-6",children:u.code||"No source is indexed."})]})]})}function Pc(){try{return H0(localStorage.getItem(as))}catch{return{}}}function G0({algo:u,onSelect:s}){const o=Zn(Qn("path",u)),[c,m]=M.useState(Pc),[f,v]=M.useState(!1);if(M.useEffect(()=>{const U=Y=>{(Y.key===as||Y.key===null)&&m(Pc())};return window.addEventListener("storage",U),()=>window.removeEventListener("storage",U)},[]),o.error)return h.jsx(Gl,{message:`Learning path failed to load:${o.error}`,retry:o.retry,retryable:o.retryable});if(!o.data)return h.jsx(Qe,{children:"Loading the reading path for this algorithm…"});const S=o.data;if(!S.steps.length)return h.jsx(Qe,{children:S.note||"No reading path is available for this algorithm."});const y=pu(u.module||"",Le(u),u.path||""),g=S.steps.map(U=>U.kind),_=$c(c,y,g);function R(U){const Y={...Pc(),[y]:U[y]||[]};m(Y);try{localStorage.setItem(as,JSON.stringify(Y)),v(!1)}catch{v(!0)}}const q=S.roadmap||[],K=q.filter(U=>$c(c,pu(S.module,U.name,U.path),g)===g.length).length;return h.jsxs(h.Fragment,{children:[h.jsx(Qe,{children:"Reading suggestions organized from algorithm information; the order can be adjusted."}),h.jsxs("details",{className:"mt-3 text-sm text-slate-500",children:[h.jsx("summary",{className:"cursor-pointer",children:"About this path"}),h.jsx("p",{className:"mt-2 leading-6",children:"The path is generated from math tags, module membership, and source info; it does not represent verified prerequisite dependencies."})]}),h.jsxs("div",{className:"my-5 flex flex-wrap items-center gap-3",children:[h.jsxs("span",{className:"text-sm",children:["Read ",_,"/",S.steps.length," steps"]}),h.jsx("progress",{"aria-label":"Algorithm reading progress",max:S.steps.length,value:_,className:"h-2 min-w-24 flex-1 accent-slate-700"}),h.jsx("button",{className:Yl,onClick:()=>R({...c,[y]:[]}),children:"Reset progress"})]}),f&&h.jsx(Qe,{error:!0,children:"This browser could not save progress;you can still check items in this session, but they may be lost after refresh."}),h.jsx("ol",{className:"space-y-3",children:S.steps.map(U=>h.jsxs("li",{className:"rounded-xl border border-slate-200 bg-white/50 p-4",children:[h.jsxs("label",{className:"flex cursor-pointer items-start gap-3",children:[h.jsx("input",{type:"checkbox",className:"mt-1 size-4 accent-slate-700",checked:(c[y]||[]).includes(U.kind),onChange:Y=>{const j=c[y]||[];R({...c,[y]:Y.target.checked?[...new Set([...j,U.kind])]:j.filter(H=>H!==U.kind)})}}),h.jsxs("span",{className:"font-medium",children:[U.step,". ",U.title]})]}),h.jsx("p",{className:`mb-3 mt-2 ${kt}`,children:U.detail}),h.jsx(Pa,{items:U.items.map(Y=>`${Y.name}: ${Y.note}`),empty:"No additional items for this step."})]},U.kind))}),h.jsx(Ut,{children:"Module roadmap"}),h.jsxs("p",{className:kt,children:["Sorted by name, not difficulty or prerequisite order. ",K,"/",q.length," algorithms completed;Click to switch the learning target."]}),h.jsx("div",{className:"mt-3 grid gap-2 sm:grid-cols-2",children:q.map(U=>{const Y=$c(c,pu(S.module,U.name,U.path),g);return h.jsxs("button",{"aria-pressed":U.is_target,className:`${Yl} text-left ${U.is_target?"ring-2 ring-slate-500":""}`,onClick:()=>s({entity:U.name,module:S.module,path:U.path}),children:[h.jsx("span",{className:"block break-all font-medium",children:U.name}),h.jsxs("span",{className:"mt-1 block text-slate-500",children:["Read ",Y,"/",g.length," steps",U.is_target?" · Current algorithm":""]})]},`${U.path}:${U.name}`)})})]})}function V0({algo:u}){const s=(u.functions||[]).map(o=>typeof o=="string"?{name:o}:o);return h.jsxs(h.Fragment,{children:[h.jsx(Qe,{children:"View the member functions and implementations of this algorithm."}),h.jsxs("div",{className:"mt-5 space-y-3",children:[s.map((o,c)=>h.jsxs("details",{className:"rounded-xl border border-slate-200 bg-white/55 p-4",children:[h.jsx("summary",{className:"cursor-pointer break-all font-mono text-sm",children:o.name}),h.jsx("p",{className:`mt-3 whitespace-pre-wrap ${kt}`,children:o.meaning||"No function documentation is indexed."}),o.code&&h.jsx("pre",{className:"mt-3 max-h-72 overflow-auto text-xs leading-6",children:o.code})]},`${c}:${o.name}`)),!s.length&&h.jsx(Qe,{children:"No member functions are indexed for this algorithm."})]})]})}function Q0({algo:u}){const s=Zn(Qn("call_graph",u));if(s.error)return h.jsx(Gl,{message:`Call graph failed to load:${s.error}`,retry:s.retry,retryable:s.retryable});if(!s.data)return h.jsx(Qe,{children:"Loading indexed call relationships…"});const o=s.data;if(!o.nodes.length)return h.jsx(Qe,{children:o.message||"No indexed call relationships are available."});const c=o.nodes.find(v=>v.role==="selected"),m=new Map(o.nodes.map(v=>{const S=o.nodes.filter(y=>y.role===v.role);return[v.id,{x:v.role==="selected"?340:v.role==="caller"?20:660,y:30+S.findIndex(y=>y.id===v.id)*88}]})),f=Math.max(160,...Array.from(m.values()).map(v=>v.y+100));return h.jsxs(h.Fragment,{children:[h.jsx(Qe,{children:"Generated by static analysis of the source; some calls may not be resolved."}),h.jsxs("details",{className:"mt-3 text-sm text-slate-500",children:[h.jsx("summary",{className:"cursor-pointer",children:"About this call graph"}),h.jsx("p",{className:"mt-2 leading-6",children:"Based on call symbols in the AST, matching objects in the same file, module, and class first. This is not runtime tracing;ambiguous calls are not connected; unresolved symbols are listed below."})]}),h.jsx("div",{className:"mt-4 overflow-auto rounded-xl border border-slate-200 bg-white/40",children:h.jsxs("svg",{viewBox:`0 0 960 ${f}`,className:"min-w-[800px] w-full",role:"img","aria-label":`Indexed calls for ${Le(u)}`,children:[h.jsx("defs",{children:h.jsx("marker",{id:"indexed-call-arrow",viewBox:"0 0 10 10",refX:"9",refY:"5",markerWidth:"6",markerHeight:"6",orient:"auto",children:h.jsx("path",{d:"M0 0L10 5L0 10z",fill:"#64748b"})})}),o.edges.map((v,S)=>{const y=m.get(v.source),g=m.get(v.target);return y&&g?h.jsx("line",{x1:y.x+250,y1:y.y+27,x2:g.x,y2:g.y+27,stroke:"#64748b",markerEnd:"url(#indexed-call-arrow)"},S):null}),o.nodes.map(v=>{const S=m.get(v.id);return h.jsxs("g",{children:[h.jsxs("title",{children:[v.entity," · ",v.path,":",v.lines]}),h.jsx("rect",{x:S.x,y:S.y,width:"250",height:"54",rx:"10",fill:v.id===c?.id?"#334155":"#ffffff",stroke:"#94a3b8"}),h.jsx("text",{x:S.x+12,y:S.y+23,fontSize:"12",fill:v.id===c?.id?"#ffffff":"#1e293b",children:v.entity.length>31?`${v.entity.slice(0,30)}…`:v.entity}),h.jsxs("text",{x:S.x+12,y:S.y+42,fontSize:"10",fill:v.id===c?.id?"#cbd5e1":"#64748b",children:[v.role," · ",v.lines]})]},v.id)})]})}),!o.edges.length&&h.jsx("p",{className:`mt-3 ${kt}`,children:"No unambiguous indexed edges were found; no illustrative edges have been added."}),h.jsx(Ut,{children:"Unresolved call symbols"}),h.jsx(Pa,{items:o.unresolved_calls,empty:"No unresolved symbols were reported."})]})}function Z0({algo:u}){const s=Zn(Qn("compare",u)),[o,c]=M.useState("");if(s.error)return h.jsx(Gl,{message:`Same-module algorithms failed to load:${s.error}`,retry:s.retry,retryable:s.retryable});if(!s.data)return h.jsx(Qe,{children:"Loading algorithms from the selected module…"});const m=y=>pu(y.module||"",Le(y),y.path||""),f=s.data.algorithms.filter(y=>m(y)!==m(u)),v=f.find(y=>m(y)===o)||f[0];if(!v)return h.jsx(Qe,{children:"No other algorithm classes are indexed in this module."});const S=[["Module",y=>y.module||"—"],["Family",y=>y.family||"—"],["Task",y=>y.task||"—"],["Mathematical methods · math method",y=>y.math_methods?.join(", ")||"—"],["Parameters · parameters",y=>y.params?.join(", ")||"—"],["Mathematical description",y=>y.docstring_math?.trim()||"Not indexed"],["References · references",y=>y.references?.filter(g=>g.trim()).join(`
`)||"Not indexed"],["Heuristic source score · Heuristic source score (not Big-O)",y=>y.complexity==null?"—":String(y.complexity)],["Source",y=>`${y.path||"—"}:${y.lines||"—"}`]];return h.jsxs(h.Fragment,{children:[h.jsxs("label",{className:"flex flex-wrap items-center gap-3 text-sm",children:["Compare with",h.jsx("select",{className:Yl,value:m(v),onChange:y=>c(y.target.value),children:f.map(y=>h.jsx("option",{value:m(y),children:Le(y)},m(y)))})]}),h.jsx("p",{className:`my-4 ${kt}`,children:'Compare the parameters, math methods, descriptions, references, and source of two algorithms. Missing values are marked as "Not indexed".'}),h.jsx("div",{className:"overflow-auto",children:h.jsxs("table",{className:"w-full min-w-[620px] text-left text-sm",children:[h.jsx("thead",{children:h.jsxs("tr",{className:"border-b border-slate-300",children:[h.jsx("th",{className:"p-3",children:"Feature"}),h.jsx("th",{className:"p-3",children:Le(u)}),h.jsx("th",{className:"p-3",children:Le(v)})]})}),h.jsx("tbody",{children:S.map(([y,g])=>h.jsxs("tr",{className:"border-b border-slate-200 align-top",children:[h.jsx("th",{scope:"row",className:"p-3 font-normal text-slate-500",children:y}),h.jsx("td",{className:"max-w-xs whitespace-pre-wrap break-words p-3",children:g(u)}),h.jsx("td",{className:"max-w-xs whitespace-pre-wrap break-words p-3",children:g(v)})]},y))})]})})]})}function K0({algo:u}){const s=u.source_signals;return h.jsxs(h.Fragment,{children:[h.jsx(Qe,{children:"Source-structure metrics, for reading reference only; not time or space complexity."}),h.jsx(Ut,{children:"Heuristic source score"}),h.jsx("p",{className:"text-3xl font-semibold",children:u.complexity??"Not indexed"}),h.jsxs("details",{className:`mt-3 ${kt}`,children:[h.jsx("summary",{className:"cursor-pointer",children:"About these metrics"}),h.jsx("p",{className:"mt-2",children:"Computed as:branch, loop, comprehension counts + source lines ÷ 10.Not cyclomatic complexity, nor Big-O;judging runtime cost also needs input dimensions, loop bounds, and library costs."})]}),h.jsx(Ut,{children:"AST evidence"}),s?h.jsx("div",{className:"grid grid-cols-2 gap-3 md:grid-cols-3",children:[["Source lines",s.lines],["For loops",s.for_loops],["While loops",s.while_loops],["Comprehensions",s.comprehensions],["If branches",s.branches],["Matrix @ operators",s.matrix_operators]].map(([o,c])=>h.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white/60 p-4",children:[h.jsx("span",{className:"text-xs text-slate-500",children:o}),h.jsx("p",{className:"mt-1 text-2xl",children:c})]},o))}):h.jsx(Qe,{children:"Source could not be parsed, so structural counts are unavailable."}),h.jsx(Ut,{children:"Before claiming Big-O"}),h.jsx(Pa,{items:["Confirm input dimensions such as sample, feature, and iteration counts.","Check nested-loop bounds and early-exit conditions.","Verify costs of matrix/external operations, temporary arrays, and data copies."]})]})}function J0({algo:u}){const[s,o]=M.useState(0),c=u.quiz||[];return h.jsxs(h.Fragment,{children:[c.length===0&&h.jsx(Qe,{children:"Not enough source or metadata to generate reliable questions."}),h.jsx("div",{className:"my-5 space-y-3",children:c.map((m,f)=>h.jsxs("details",{className:"rounded-xl border border-slate-200 bg-white/60 p-4",children:[h.jsxs("summary",{className:"cursor-pointer text-sm font-medium",children:["Q",f+1,". ",m.question]}),h.jsx("p",{className:"mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600",children:m.answer}),h.jsxs("pre",{className:"mt-3 whitespace-pre-wrap break-words text-xs text-slate-500",children:["Evidence:",m.evidence]})]},m.question))},s),h.jsx("button",{className:Yl,onClick:()=>o(m=>m+1),children:"Hide all answers"})]})}function F0({algo:u,onSelect:s}){const[o,c]=M.useState(0),[m,f]=M.useState({});return M.useEffect(()=>{const v=new AbortController;return f({}),fetch("/api/search",{method:"POST",headers:{"Content-Type":"application/json"},signal:v.signal,body:JSON.stringify({query:U0(u),top_k:10,module:"",family:"",task:""})}).then(S=>ms(S)).then(S=>{v.signal.aborted||f({items:Y0(u,S.results||[])})}).catch(S=>{v.signal.aborted||f({error:bu(S).message,retryable:bu(S).retryable})}),()=>v.abort()},[u,o]),h.jsxs(h.Fragment,{children:[m.error&&h.jsx(Gl,{message:m.error,retryable:m.retryable,retry:()=>c(v=>v+1)}),!m.items&&!m.error&&h.jsx(Qe,{children:"Finding related algorithms…"}),m.items?.length===0&&h.jsx(Qe,{children:"No other similar algorithms were found."}),h.jsx("div",{className:"mt-5 grid gap-4 sm:grid-cols-2",children:m.items?.map(v=>h.jsxs("article",{className:"rounded-xl border border-slate-200 bg-white/60 p-4",children:[h.jsx("h4",{className:"break-words font-semibold",children:Le(v)}),h.jsxs("p",{className:kt,children:[v.module," · ",v.task]}),h.jsxs("p",{className:"my-3 text-sm",children:["Ranking score:",ls(u,v).toFixed(3)," · ",Number.isFinite(v.semantic)?`Semantic score:${v.semantic.toFixed(3)}`:"Semantic score unavailable"]}),h.jsxs("p",{className:"mb-3 text-sm",children:["Why recommended:",mh(u,v).join(" · ")]}),h.jsxs("button",{className:Yl,onClick:()=>s(v),children:["Study ",Le(v)]})]},`${v.module}:${v.path}:${Le(v)}`))})]})}function W0({mode:u,algorithm:s,onSelect:o,onOpenRecommendation:c}){const m=Zn(Qn("algorithm",s));if(m.error)return h.jsx(mu,{children:h.jsx(Gl,{message:`Algorithm details failed to load:${m.error}`,retry:m.retry,retryable:m.retryable})});if(!m.data)return h.jsx(mu,{children:h.jsx(Qe,{children:"Loading indexed algorithm details…"})});if(!m.data.algorithm)return h.jsx(mu,{children:h.jsx(Qe,{children:"The selected algorithm is not present in this index. Return to Browse to select another."})});const f=m.data.algorithm;return h.jsxs(mu,{children:[h.jsx(k0,{algo:f}),u.id==="math-card"&&h.jsx(X0,{algo:f}),u.id==="path"&&h.jsx(G0,{algo:f,onSelect:o}),u.id==="related-functions"&&h.jsx(V0,{algo:f}),u.id==="call-graph"&&h.jsx(Q0,{algo:f}),u.id==="compare"&&h.jsx(Z0,{algo:f}),u.id==="complexity"&&h.jsx(K0,{algo:f}),u.id==="quiz"&&h.jsx(J0,{algo:f},`${f.module}:${f.path}:${Le(f)}`),u.id==="recommend"&&h.jsx(F0,{algo:f,onSelect:c},`${f.module}:${f.path}:${Le(f)}`)]})}function $0({className:u}){return h.jsxs("svg",{viewBox:"0 0 26.9 16.6",fill:"none",className:u,"aria-hidden":"true",children:[h.jsx("ellipse",{cx:"13.25",cy:"8.4",rx:"13.2",ry:"2.9",transform:"rotate(-25 13.25 8.4)",stroke:"currentColor",strokeWidth:"1.25"}),h.jsx("circle",{cx:"13.25",cy:"8.4",r:"8.8",fill:"#07090f"}),h.jsx("circle",{cx:"13.25",cy:"8.4",r:"8.1",fill:"currentColor"}),h.jsx("ellipse",{cx:"13.25",cy:"8.4",rx:"13.2",ry:"2.9",transform:"rotate(-25 13.25 8.4)",stroke:"#07090f",strokeWidth:"0.9",strokeDasharray:"28.2 28.2"}),h.jsx("ellipse",{cx:"13.25",cy:"8.4",rx:"13.2",ry:"2.9",transform:"rotate(-25 13.25 8.4)",stroke:"currentColor",strokeWidth:"1.25",strokeDasharray:"28.2 28.2"})]})}function I0(){const[u,s]=M.useState(0),[o,c]=M.useState(null),[m,f]=M.useState(0),v=M.useRef(null),S=du[u];M.useEffect(()=>{try{const _=localStorage.getItem("codexray:selectedAlgorithm"),R=_?JSON.parse(_):null;c(R&&typeof R=="object"&&typeof R.entity=="string"?R:null)}catch{c(null)}},[]);function y(_){const R={entity:Le(_),module:_.module,path:_.path};c(R);try{localStorage.setItem("codexray:selectedAlgorithm",JSON.stringify(R))}catch{return}}function g(_){y(_),s(0),f(R=>R+1)}return M.useEffect(()=>{m&&(v.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}),v.current?.focus({preventScroll:!0}))},[m]),h.jsxs("section",{className:"learn-page relative min-h-screen overflow-hidden pb-16",children:[h.jsxs("header",{className:"relative mx-auto flex w-full max-w-[1240px] items-center px-5 pt-5 sm:px-8",children:[h.jsxs("a",{href:"#home",className:"flex items-center gap-2.5 font-semibold text-[#1c2434]",style:{fontSize:17,letterSpacing:"-0.02em",textDecoration:"none"},children:[h.jsx($0,{className:"h-[16px] w-[26px] overflow-visible"}),"Code-X-Ray"]}),h.jsxs("nav",{className:"learn-seg absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-full border border-[rgba(20,28,40,0.12)] bg-[rgba(255,255,255,0.52)] p-[3px] backdrop-blur-md sm:flex",children:[h.jsx("a",{href:"#home",children:"Home"}),h.jsx("a",{href:"#search",children:"Browse"}),h.jsx("a",{href:"#/learn","aria-current":"page",children:"Learn"})]}),h.jsx("div",{className:"ml-auto flex items-center gap-2.5",children:h.jsx("a",{href:"https://github.com/Cissy4mA/Code-X-ray_Numpy-ml",target:"_blank",rel:"noreferrer","aria-label":"GitHub",className:"flex size-9 items-center justify-center rounded-full border border-[rgba(20,28,40,0.14)] bg-[rgba(255,255,255,0.52)] text-[#1c2434] backdrop-blur-md transition-colors hover:border-[rgba(20,28,40,0.3)]",children:h.jsx("svg",{width:"15",height:"15",viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":"true",children:h.jsx("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"})})})})]}),h.jsxs("nav",{className:"learn-seg relative mx-auto mt-4 flex w-fit items-center gap-0.5 rounded-full border border-[rgba(20,28,40,0.12)] bg-[rgba(255,255,255,0.52)] p-[3px] backdrop-blur-md sm:hidden",children:[h.jsx("a",{href:"#home",children:"Home"}),h.jsx("a",{href:"#search",children:"Browse"}),h.jsx("a",{href:"#/learn","aria-current":"page",children:"Learn"})]}),h.jsxs("div",{className:"relative mx-auto w-full max-w-6xl px-4 pb-8 pt-10 text-center sm:px-6 md:pb-10 md:pt-14",children:[h.jsx("p",{className:"font-mono text-[11px] uppercase",style:{letterSpacing:"0.3em",color:"rgba(28,36,52,0.42)"},children:"03 — Learning Suite"}),h.jsxs("h2",{className:"mt-3 text-4xl font-semibold text-[#1c2434] md:text-6xl",style:{letterSpacing:"-0.03em"},children:["Learn ",h.jsx("span",{style:{color:"rgba(28,36,52,0.35)"},children:"/"})," ",h.jsx("span",{style:{color:"rgba(28,36,52,0.62)"},children:"Learn"})]}),h.jsxs("p",{className:"mx-auto mt-4 max-w-xl text-sm leading-relaxed",style:{color:"rgba(28,36,52,0.62)"},children:["Drag the deck, click a card, or use ",h.jsx("kbd",{className:"rounded border border-[rgba(20,28,40,0.14)] bg-white/70 px-1.5 py-0.5 font-mono text-[11px] text-[#1c2434]",children:"←"})," ",h.jsx("kbd",{className:"rounded border border-[rgba(20,28,40,0.14)] bg-white/70 px-1.5 py-0.5 font-mono text-[11px] text-[#1c2434]",children:"→"}),"  to switch between ",du.length," learning modes.",h.jsxs("span",{className:"block",style:{color:"rgba(28,36,52,0.42)"},children:["Explore ",du.length," learning modes. Reading progress is saved on this browser; automatic rotation is off by default."]})]})]}),o?h.jsxs(h.Fragment,{children:[h.jsx(q0,{modes:du,onActive:s},m),h.jsxs("div",{ref:v,tabIndex:-1,className:"relative mx-auto mt-10 w-full max-w-6xl scroll-mt-6 px-4 outline-none sm:px-6 md:mt-14",children:[h.jsx("div",{className:"panel-enter",children:h.jsx(W0,{mode:S,algorithm:o,onSelect:y,onOpenRecommendation:g})},`${o.module}:${o.path}:${Le(o)}`),h.jsxs("p",{className:"mt-5 text-center font-mono text-[11px]",style:{color:"rgba(28,36,52,0.42)"},children:[Le(o)," · ",o.module||"NumPy-ML"]})]})]}):h.jsx("div",{className:"relative mx-auto mt-8 w-full max-w-2xl px-4 sm:px-6",children:h.jsxs("div",{className:"learn-glass rounded-2xl border p-8 text-center",style:{boxShadow:"0 18px 40px -24px rgba(20,28,40,0.25)"},children:[h.jsx("p",{className:"font-mono text-[11px] uppercase tracking-[0.22em]",style:{color:"rgba(28,36,52,0.42)"},children:"No Algorithm Selected"}),h.jsx("h3",{className:"mt-3 text-2xl font-semibold tracking-tight text-[#1c2434]",children:"Search for an algorithm first, then open the learning cards"}),h.jsx("p",{className:"mx-auto mt-3 max-w-md text-sm leading-relaxed",style:{color:"rgba(28,36,52,0.62)"},children:"After finding an algorithm in Browse, click Open the Learn Page to start reading."}),h.jsx("a",{href:"#search",className:"mt-6 inline-flex h-10 items-center justify-center rounded-[10px] bg-[#101318] px-4 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#242a34]",children:"Back to Browse"})]})})]})}function P0({view:u="home"}){return u==="learn"?h.jsx(I0,{}):h.jsx("div",{className:"h-screen overflow-hidden",children:h.jsx(D0,{view:u==="search"?"search":"home"})})}function Um(){const u=location.hash;return u.startsWith("#/learn")?"learn":u.startsWith("#/search")||u==="#search"?"search":"home"}function eg(){const[u,s]=M.useState(Um),o=Xt();return M.useEffect(()=>{o.pathname==="/learn"&&location.hash!=="#/learn"&&(location.hash="#/learn")},[o]),M.useEffect(()=>{const c=()=>s(Um());return window.addEventListener("hashchange",c),()=>window.removeEventListener("hashchange",c)},[]),h.jsx(Kp,{children:h.jsx(rh,{path:"*",element:h.jsx(P0,{view:u})})})}Zy.createRoot(document.getElementById("root")).render(h.jsx(M.StrictMode,{children:h.jsx(p0,{children:h.jsx(eg,{})})}));
