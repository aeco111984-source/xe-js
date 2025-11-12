import { useState,useEffect } from "react";
export default function Advanced(){
  const [base,setBase]=useState("USD");
  const [rows,setRows]=useState([{code:"EUR",amount:100},{code:"GBP",amount:100},{code:"JPY",amount:10000}]);
  async function recalc(){
    try{
      const r=await fetch(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`);
      const j=await r.json();const rates=j?.rates||{};
      setRows(prev=>prev.map(row=>({...row,result:rates[row.code]?row.amount*rates[row.code]:undefined})));
    }catch{}
  }
  useEffect(()=>{recalc()},[base]);
  return(<>
    <h1 className="text-2xl font-semibold mb-3" style={{color:"var(--brand,#FF7A00)"}}>Advanced Converter</h1>
    <div className="card mb-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="block text-sm mb-1">Base Currency</label>
          <input value={base} onChange={e=>setBase(e.target.value.toUpperCase())}
                 className="w-full border rounded-md px-3 py-2" placeholder="USD"/></div>
        <div className="sm:col-span-2 flex items-end"><button className="btn" onClick={recalc}>Recalculate</button></div>
      </div>
    </div>
    <div className="card overflow-auto">
      <table className="min-w-full text-sm">
        <thead><tr className="border-b text-left">
          <th className="py-2 pr-4">Currency</th>
          <th className="py-2 pr-4">Amount</th>
          <th className="py-2 pr-4">Result</th>
        </tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} className="border-b">
              <td className="py-2 pr-4">{r.code}</td>
              <td className="py-2 pr-4">{r.amount}</td>
              <td className="py-2 pr-4">{typeof r.result==='number' ? r.result.toFixed(4) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}