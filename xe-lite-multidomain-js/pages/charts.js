import { useEffect } from "react";
export default function Charts(){
  useEffect(()=>{
    if(document.getElementById("tv-market"))return;
    const s=document.createElement("script");
    s.id="tv-market";s.src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    s.async=true;
    s.innerHTML=JSON.stringify({
      colorTheme:"light",dateRange:"1D",showChart:true,locale:"en",isTransparent:false,showSymbolLogo:true,width:"100%",height:660,
      tabs:[{title:"FX Majors",symbols:["FX:EURUSD","FX:GBPUSD","FX:USDJPY","FX:AUDUSD","FX:USDCAD","FX:USDCHF"].map(s=>({s}))}]
    });
    document.querySelector(".tv-container")?.appendChild(s);
  },[]);
  return(<>
    <h1 className="text-2xl font-semibold mb-3" style={{color:"var(--brand,#FF7A00)"}}>Charts</h1>
    <div className="card"><div className="tv-container" style={{minHeight:680}}/></div>
  </>);
}
