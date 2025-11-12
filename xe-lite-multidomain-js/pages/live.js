import { useEffect } from "react";
export default function Live(){
  useEffect(()=>{
    if(document.getElementById("tv-ticker"))return;
    const s=document.createElement("script");
    s.id="tv-ticker";s.src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    s.async=true;
    s.innerHTML=JSON.stringify({
      symbols:[
        {proName:"FX:EURUSD",title:"EUR/USD"},
        {proName:"FX:GBPUSD",title:"GBP/USD"},
        {proName:"FX:USDJPY",title:"USD/JPY"},
        {proName:"FX:AUDUSD",title:"AUD/USD"},
        {proName:"FX:USDCAD",title:"USD/CAD"},
        {proName:"FX:USDCHF",title:"USD/CHF"}
      ],showSymbolLogo:true,colorTheme:"light",isTransparent:false,displayMode:"adaptive",locale:"en"
    });
    document.querySelector(".ticker")?.appendChild(s);
  },[]);
  return(<>
    <h1 className="text-2xl font-semibold mb-3" style={{color:"var(--brand,#FF7A00)"}}>Live Prices</h1>
    <div className="card mb-6"><div className="ticker"/></div>
  </>);
}