(function(root){
 const DAY=1440;
 function clock(date=new Date()){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));const day=Date.UTC(+p.year,+p.month-1,+p.day)/86400000;return {day,minute:+p.hour*60+(+p.minute)+(+p.second)/60,date:`${p.year}-${p.month}-${p.day}`,label:`${p.hour}:${p.minute}:${p.second}`};}
 function service(day){return ![0,3].includes(new Date(day*86400000).getUTCDay());}
 function time(m){const n=((Math.floor(m)%DAY)+DAY)%DAY;return `${m>=DAY?'次日 ':''}${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
 function state(route,c){
  const stops=route.stops,now=c.day*DAY+c.minute;
  for(const offset of [-1,0]){const d=c.day+offset;if(!service(d))continue;const m=now-d*DAY;
   if(m<stops[0].arrival||m>stops.at(-1).departure)continue;
   for(let i=0;i<stops.length;i++){const s=stops[i];if(m>=s.arrival&&m<=s.departure)return {active:true,atStop:true,position:[s.lat,s.lng],stop:s,eta:0,serviceDay:d};if(i<stops.length-1&&m>s.departure&&m<stops[i+1].arrival){const next=stops[i+1];const f=(m-s.departure)/(next.arrival-s.departure);return {active:true,atStop:false,position:[s.lat+(next.lat-s.lat)*f,s.lng+(next.lng-s.lng)*f],stop:next,eta:Math.ceil(next.arrival-m),serviceDay:d};}}
  }
  let best=null;for(let offset=-1;offset<=7;offset++){const d=c.day+offset;if(!service(d))continue;for(const s of stops){const t=d*DAY+s.arrival;if(t>=now&&(!best||t<best.t))best={t,stop:s,serviceDay:d};}}
  return {active:false,stop:best?.stop,eta:best?Math.ceil(best.t-now):null,serviceDay:best?.serviceDay};
 }
 function stopNext(stop,c){const now=c.day*DAY+c.minute;for(let offset=-1;offset<=7;offset++){const d=c.day+offset;if(!service(d))continue;const a=d*DAY+stop.arrival,b=d*DAY+stop.departure;if(b>=now)return {eta:Math.max(0,Math.ceil(a-now)),day:d,atStop:a<=now};}return null;}
 function distance(a,b){const r=Math.PI/180,dlat=(b[0]-a[0])*r,dlng=(b[1]-a[1])*r;const v=Math.sin(dlat/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dlng/2)**2;return 6371*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v));}
 const api={clock,service,time,state,stopNext,distance};if(typeof module!=='undefined')module.exports=api;root.TrashLogic=api;
})(typeof globalThis!=='undefined'?globalThis:this);
