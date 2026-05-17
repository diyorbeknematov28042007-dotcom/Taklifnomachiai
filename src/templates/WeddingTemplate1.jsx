import { useState, useEffect, useRef, useCallback } from 'react';

const MONTHS = ['','Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
const WDAYS = ['Du','Se','Chor','Pay','Ju','Sha','Ya'];
const DAYNAMES = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'];

function countdown(ds){const t=new Date(ds)-new Date();if(t<=0)return{d:0,h:0,m:0,s:0};return{d:Math.floor(t/864e5),h:Math.floor(t%864e5/36e5),m:Math.floor(t%36e5/6e4),s:Math.floor(t%6e4/1e3)}}

function calendar(ds){const dt=new Date(ds),y=dt.getFullYear(),mo=dt.getMonth(),dy=dt.getDate(),f=(new Date(y,mo,1).getDay()+6)%7,dim=new Date(y,mo+1,0).getDate(),ws=[];let w=Array(f).fill(null);for(let i=1;i<=dim;i++){w.push(i);if(w.length===7){ws.push(w);w=[]}}if(w.length){while(w.length<7)w.push(null);ws.push(w)}return{y,mo:mo+1,dy,ws,mn:MONTHS[mo+1]}}

function useOnScreen(){
  const ref=useRef(null);
  const [seen,setSeen]=useState(false);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setSeen(true);obs.disconnect()}},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
    obs.observe(el);return()=>obs.disconnect();
  },[]);
  return [ref,seen];
}

function Reveal({children,className='',style={},delay=0}){
  const [ref,seen]=useOnScreen();
  return <div ref={ref} className={className} style={{...style,opacity:seen?1:0,transform:seen?'translateY(0)':'translateY(40px)',transition:`opacity .8s ease ${delay}s, transform .8s ease ${delay}s`}}>{children}</div>;
}

export default function WeddingTemplate1({data,onRespond,sent}){
  const d=data||{};
  const groom=d.groomName||'Kuyov', bride=d.brideName||'Kelin';
  const date=d.date||'2026-06-15', time=d.time||'18:00';
  const mainText=d.mainText||'';
  const address=d.address||'', venueName=d.venueName||'';
  const cardNumber=d.cardNumber||'';
  const gMaps=d.googleMapsUrl||'', yMaps=d.yandexMapsUrl||'';

  const [cd,setCd]=useState(countdown(date));
  const [rsvp,setRsvp]=useState('');
  const [guests,setGuests]=useState(1);
  const [msg,setMsg]=useState('');
  const [name,setName]=useState('');
  const [copied,setCopied]=useState(false);
  const [heroOn,setHero]=useState(false);

  // Refs for animated sections
  const [locRef,locSeen]=useOnScreen();
  const [giftRef,giftSeen]=useOnScreen();

  useEffect(()=>{setTimeout(()=>setHero(true),400)},[]);
  useEffect(()=>{const iv=setInterval(()=>setCd(countdown(date)),1000);return()=>clearInterval(iv)},[date]);

  const cal=calendar(date);
  const dow=DAYNAMES[new Date(date).getDay()];

  const fmtCard=s=>s.replace(/\s/g,'').replace(/(\d{4})/g,'$1 ').trim();
  const copyC=()=>{navigator.clipboard?.writeText(cardNumber.replace(/\s/g,'')).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)})};
  const submit=()=>{if(onRespond)onRespond({rsvp:rsvp||null,guestCount:guests,message:msg,senderName:name})};

  return (
    <div className="w1">
      <style>{CSS}</style>

      {/* ===== HERO ===== */}
      <div className="w1-hero">
        <div style={{opacity:heroOn?1:0,transform:heroOn?'translateY(0)':'translateY(30px)',transition:'all 1.2s ease'}}>
          <div className="w1-groom">{groom.toUpperCase()}</div>
          <div className="w1-amp">&</div>
          <div className="w1-bride">{bride.toUpperCase()}</div>
          <div className="w1-subtitle">Baxt to'yimizga taklif etamiz</div>
          <div className="w1-cd">
            {[{v:cd.d,l:'Kun'},{v:cd.h,l:'Soat'},{v:cd.m,l:'Daqiqa'},{v:cd.s,l:'Soniya'}].map((c,i)=>(
              <div className="w1-cd-item" key={i} style={{animationDelay:i*120+'ms'}}>
                <div className="w1-cd-num">{String(c.v).padStart(2,'0')}</div>
                <div className="w1-cd-lbl">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="w1-arrow"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg></div>
      </div>

      {/* ===== LOVE LETTER ===== */}
      <Reveal className="w1-sec w1-letter" delay={0}>
        <div className="w1-heart">🤍</div>
        <h2>Qalblarimiz birlashgan kunda...</h2>
        <p className="w1-letter-p">{mainText||`"Aziz mehmonlarimiz, hayotimizdagi eng muhim kunni siz bilan birga nishonlashdan baxtiyor bo'lamiz. Sizning tashrifingiz biz uchun katta sovg'adir. Duolaringiz va samimiy tabriklaringiz bilan yangi hayotimizga qadam qo'yamiz."`}</p>
      </Reveal>

      {/* ===== CALENDAR ===== */}
      <Reveal className="w1-sec w1-cal-sec" delay={0}>
        <div className="w1-cal-card">
          <div className="w1-cal-month">{cal.mn} {cal.y}</div>
          <div className="w1-gold-line"/>
          <div className="w1-cal-grid">
            {WDAYS.map(x=><div key={x} className="w1-cal-hdr">{x}</div>)}
            {cal.ws.flat().map((x,i)=><div key={i} className={`w1-cal-d${x===cal.dy?' w1today':''}${x==null?' w1empty':''}`}>{x}</div>)}
          </div>
        </div>
        <div className="w1-when">{dow} kuni, <b>{time}</b> da</div>
      </Reveal>

      {/* ===== LOCATION ===== */}
      {address&&(
        <div ref={locRef} className="w1-sec w1-loc-sec">
          <div className="w1-loc-pin" style={{opacity:locSeen?1:0,transform:locSeen?'translateY(0) scale(1)':'translateY(-20px) scale(0.5)',transition:'all .6s cubic-bezier(.175,.885,.32,1.275)'}}>📍</div>
          <h2 style={{opacity:locSeen?1:0,transform:locSeen?'translateY(0)':'translateY(20px)',transition:'all .6s ease .15s'}}>To'yxona manzili</h2>
          <div className="w1-loc-card" style={{opacity:locSeen?1:0,transform:locSeen?'translateY(0) scale(1)':'translateY(30px) scale(0.92)',transition:'all .8s cubic-bezier(.25,.46,.45,.94) .25s'}}>
            {venueName&&<div className="w1-venue">"{venueName}"</div>}
            <div className="w1-addr">{address}</div>
            <a href={gMaps||`https://www.google.com/maps/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener" className="w1-mbtn w1-gm" style={{opacity:locSeen?1:0,transform:locSeen?'translateX(0)':'translateX(-30px)',transition:'all .5s ease .55s'}}>📍 Google Maps'da ochish</a>
            {yMaps&&<a href={yMaps} target="_blank" rel="noopener" className="w1-mbtn w1-ym" style={{opacity:locSeen?1:0,transform:locSeen?'translateX(0)':'translateX(-30px)',transition:'all .5s ease .7s'}}>📍 Yandex Maps'da ochish</a>}
          </div>
        </div>
      )}

      {/* ===== GIFT / CARD ===== */}
      {cardNumber&&(
        <div ref={giftRef} className="w1-sec w1-gift-sec">
          <div style={{fontSize:36,marginBottom:10,opacity:giftSeen?1:0,transform:giftSeen?'scale(1) rotate(0)':'scale(0.3) rotate(-30deg)',transition:'all .6s cubic-bezier(.175,.885,.32,1.275)'}}>🎁</div>
          <h2 style={{opacity:giftSeen?1:0,transform:giftSeen?'translateY(0)':'translateY(20px)',transition:'all .6s ease .1s'}}>To'yona va tabriklar</h2>
          <p className="w1-gift-txt" style={{opacity:giftSeen?1:0,transform:giftSeen?'translateY(0)':'translateY(15px)',transition:'all .6s ease .25s'}}>Sizning tilaklaringiz va to'yonangiz biz uchun qadrli. Agar sovg'ani pul ko'rinishida berishni ma'qul ko'rsangiz, quyidagi kartadan foydalanishingiz mumkin:</p>
          <div className={`w1-bank-card${giftSeen?' w1-card-in':''}`}>
            <div className="w1-chip"/>
            <div className="w1-card-type">HUMO</div>
            <div className="w1-card-num">{fmtCard(cardNumber)}</div>
            <div className="w1-card-lbl">Karta egasi</div>
            <div className="w1-card-owner">{groom.toUpperCase()}</div>
            <div className="w1-card-circle"/>
            <div className={`w1-shine${giftSeen?' w1-shine-go':''}`}/>
          </div>
          <button className="w1-copy" onClick={copyC} style={{opacity:giftSeen?1:0,transform:giftSeen?'translateY(0)':'translateY(10px)',transition:'all .5s ease 1.3s'}}>{copied?'✅ Nusxalandi!':'📋 Karta raqamini nusxalash'}</button>
        </div>
      )}

      {/* ===== RSVP ===== */}
      <Reveal className="w1-sec w1-rsvp" delay={0}>
        <h2>Javobingiz</h2>
        {sent?<div className="w1-sent">✅ Javobingiz qabul qilindi! Rahmat!</div>:<>
          <input className="w1-inp" placeholder="Ismingiz" value={name} onChange={e=>setName(e.target.value)}/>
          <div className="w1-rbtns">
            {[{k:'attending',l:'✅ Kelaman'},{k:'notAttending',l:'❌ Kela olmayman'},{k:'maybe',l:'🤔 Bilmayman'}].map(o=>
              <button key={o.k} className={`w1-rbtn${rsvp===o.k?' w1on':''}`} onClick={()=>setRsvp(o.k)}>{o.l}</button>
            )}
          </div>
          <div className="w1-gcount"><span>Mehmonlar soni:</span><input type="number" min="1" max="20" value={guests} onChange={e=>setGuests(+e.target.value)}/></div>
          <textarea className="w1-inp w1-ta" placeholder="Tabrik so'zlaringiz..." value={msg} onChange={e=>setMsg(e.target.value)}/>
          <button className="w1-sendbtn" onClick={submit}>✈️ Yuborish</button>
        </>}
      </Reveal>

      <div className="w1-footer">© {new Date().getFullYear()} {groom} & {bride}</div>
    </div>
  );
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
.w1{font-family:'Cormorant Garamond',serif;color:#3a3a3a;overflow-x:hidden;-webkit-font-smoothing:antialiased}
.w1 *{box-sizing:border-box;margin:0;padding:0}

/* HERO */
.w1-hero{position:relative;min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 20px;background:linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.45)),url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80') center/cover;color:#fff}
.w1-hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(transparent,#fdfbf7)}
.w1-groom,.w1-bride{font-family:'Playfair Display',serif;font-size:40px;font-weight:700;letter-spacing:3px;text-shadow:0 2px 20px rgba(0,0,0,0.5);line-height:1.15}
.w1-amp{font-family:'Playfair Display',serif;font-size:30px;color:#d4a574;font-style:italic;margin:2px 0}
.w1-subtitle{font-size:17px;font-style:italic;margin-top:12px;opacity:.85;letter-spacing:1px}
.w1-cd{display:flex;gap:10px;margin-top:28px;justify-content:center;position:relative;z-index:1}
.w1-cd-item{width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.25);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:w1pop .6s ease both}
@keyframes w1pop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
.w1-cd-num{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;line-height:1}
.w1-cd-lbl{font-size:9px;opacity:.7;margin-top:2px;text-transform:uppercase;letter-spacing:.5px}
.w1-arrow{position:absolute;bottom:40px;z-index:2;animation:w1bob 2s infinite}
@keyframes w1bob{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}

/* SECTIONS */
.w1-sec{padding:56px 24px;text-align:center}
.w1-sec h2{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:#2c2c2c;margin-bottom:16px}

/* LOVE LETTER */
.w1-letter{background:#fdfbf7}
.w1-heart{font-size:32px;margin-bottom:14px;display:inline-block;animation:w1pulse 2s ease-in-out infinite}
@keyframes w1pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
.w1-letter-p{font-size:16px;font-style:italic;line-height:1.75;color:#5a5a5a;max-width:340px;margin:0 auto}

/* CALENDAR */
.w1-cal-sec{background:#fdfbf7}
.w1-cal-card{background:#fff;border-radius:20px;padding:26px 18px;max-width:340px;margin:0 auto;box-shadow:0 4px 30px rgba(0,0,0,.05)}
.w1-cal-month{font-family:'Playfair Display',serif;font-size:22px}
.w1-gold-line{width:36px;height:3px;background:#d4a574;border-radius:2px;margin:8px auto 14px}
.w1-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.w1-cal-hdr{font-size:12px;font-weight:600;color:#aaa;padding:6px 0}
.w1-cal-d{font-size:14px;padding:8px 0;border-radius:50%;position:relative}
.w1-cal-d.w1today{background:#d4a574;color:#fff;font-weight:700;animation:w1dayPop .5s ease .3s both}
.w1-cal-d.w1today::after{content:'❤';position:absolute;top:-5px;right:-1px;font-size:9px;animation:w1hb 1.5s ease-in-out infinite 1s}
@keyframes w1dayPop{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes w1hb{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
.w1-cal-d.w1empty{visibility:hidden}
.w1-when{font-size:19px;margin-top:22px}
.w1-when b{color:#d4a574;font-weight:600}

/* LOCATION */
.w1-loc-sec{background:#fdfbf7}
.w1-loc-pin{font-size:36px;color:#d4a574;margin-bottom:10px;display:inline-block}
.w1-loc-card{background:#fff;border-radius:20px;padding:24px;max-width:340px;margin:0 auto;box-shadow:0 4px 30px rgba(0,0,0,.05)}
.w1-venue{font-family:'Playfair Display',serif;font-size:19px;color:#c0392b;font-weight:600;margin-bottom:8px}
.w1-addr{font-size:14px;color:#666;line-height:1.5;margin-bottom:16px}
.w1-mbtn{display:block;width:100%;padding:14px;border:none;border-radius:12px;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:#fff;cursor:pointer;margin-bottom:8px;text-decoration:none;text-align:center}
.w1-gm{background:#4285f4}
.w1-ym{background:#e74c3c}

/* GIFT */
.w1-gift-sec{background:#fdfbf7}
.w1-gift-txt{font-size:14px;color:#666;line-height:1.6;max-width:320px;margin:0 auto 24px}
.w1-bank-card{background:linear-gradient(135deg,#d4a574,#b8863a);border-radius:16px;padding:22px;max-width:320px;margin:0 auto;color:#fff;box-shadow:0 8px 32px rgba(180,130,58,.35);position:relative;overflow:hidden;text-align:left;
  opacity:0;transform:perspective(800px) rotateY(30deg) scale(.88);transition:all 1s cubic-bezier(.25,.46,.45,.94) .4s}
.w1-bank-card.w1-card-in{opacity:1;transform:perspective(800px) rotateY(0) scale(1)}
.w1-chip{width:34px;height:26px;background:#e6b84d;border-radius:5px;margin-bottom:14px}
.w1-card-type{position:absolute;top:20px;right:20px;font-size:13px;font-weight:600;opacity:.8;letter-spacing:1px}
.w1-card-num{font-family:'Courier New',monospace;font-size:19px;letter-spacing:2.5px;margin-bottom:14px}
.w1-card-lbl{font-size:9px;opacity:.5;text-transform:uppercase;letter-spacing:1px}
.w1-card-owner{font-size:15px;font-weight:700;letter-spacing:1px;margin-top:2px}
.w1-card-circle{position:absolute;bottom:18px;right:18px;width:32px;height:32px;border:2px solid rgba(255,255,255,.3);border-radius:50%}
.w1-shine{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)}
.w1-shine.w1-shine-go{animation:w1sh 1.5s ease .9s 1 forwards}
@keyframes w1sh{0%{left:-100%}100%{left:150%}}
.w1-copy{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;max-width:320px;margin:14px auto 0;padding:14px;background:#fff;border:1.5px solid #e0d5c7;border-radius:12px;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;cursor:pointer;color:#3a3a3a;transition:all .2s}
.w1-copy:active{transform:scale(.96);background:#f5efe6}

/* RSVP */
.w1-rsvp{background:linear-gradient(180deg,#fdfbf7,#f5efe6);padding-bottom:40px}
.w1-inp{width:100%;max-width:320px;padding:14px 16px;border:1.5px solid #e0d5c7;border-radius:12px;font-family:'Cormorant Garamond',serif;font-size:15px;outline:none;background:#fff;margin:0 auto 10px;display:block;color:#3a3a3a}
.w1-inp:focus{border-color:#d4a574}
.w1-ta{min-height:80px;resize:none}
.w1-rbtns{display:flex;gap:8px;justify-content:center;margin-bottom:14px;flex-wrap:wrap}
.w1-rbtn{padding:10px 16px;border-radius:10px;border:1.5px solid #e0d5c7;background:#fff;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
.w1-rbtn.w1on{background:#d4a574;color:#fff;border-color:#d4a574}
.w1-gcount{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;font-size:14px}
.w1-gcount input{width:54px;text-align:center;padding:10px;border:1.5px solid #e0d5c7;border-radius:10px;font-family:'Cormorant Garamond',serif;font-size:15px;outline:none}
.w1-sendbtn{width:100%;max-width:320px;padding:16px;border:none;border-radius:12px;background:linear-gradient(135deg,#d4a574,#b8863a);color:#fff;font-family:'Playfair Display',serif;font-size:16px;font-weight:600;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 20px rgba(180,130,58,.35);margin-top:4px}
.w1-sent{padding:30px;font-size:18px;color:#d4a574;font-weight:600}
.w1-footer{padding:28px 20px;text-align:center;background:#f5efe6;font-size:13px;color:#aaa}
`;
