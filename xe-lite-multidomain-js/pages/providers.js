export default function Providers(){
  const rows=[
    {name:"Wise",fee:"0.45%",delivery:"Same day",example:"Mid + 0.45%"},
    {name:"Western Union",fee:"Varies",delivery:"Minutes–hours",example:"Varies"},
    {name:"Remitly",fee:"$0–$3.99",delivery:"Minutes–1 day",example:"Economy / Express"},
    {name:"Xoom",fee:"Varies",delivery:"Minutes–1 day",example:"Varies"}
  ];
  return(<>
    <h1 className="text-2xl font-semibold mb-3" style={{color:"var(--brand,#FF7A00)"}}>Money Transfer Providers</h1>
    <div className="card overflow-auto">
      <table className="min-w-full text-sm">
        <thead><tr className="border-b text-left"><th className="py-2 pr-4">Provider</th><th className="py-2 pr-4">Fee</th><th className="py-2 pr-4">Delivery</th><th className="py-2 pr-4">Example</th></tr></thead>
        <tbody>{rows.map((r,i)=>(<tr key={i} className="border-b"><td className="py-2 pr-4">{r.name}</td><td className="py-2 pr-4">{r.fee}</td><td className="py-2 pr-4">{r.delivery}</td><td className="py-2 pr-4">{r.example}</td></tr>))}</tbody>
      </table>
    </div>
  </>);
}