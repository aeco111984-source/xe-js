import Link from "next/link";
import { getSiteEntry } from "./useSiteConfig";

export default function Navbar(){
  const site = getSiteEntry();
  const baseTabs=[
    {name:"Converter",path:"/"},
    {name:"Providers",path:"/providers"},
    {name:"Charts",path:"/charts"},
    {name:"Live Prices",path:"/live"},
    {name:"Advanced",path:"/advanced"}
  ];
  const extra=[];
  if(site.features?.calendar)extra.push({name:"Calendar",path:"/calendar"});
  if(site.features?.infographics)extra.push({name:"Infographics",path:"/infographics"});
  if(site.features?.widgets)extra.push({name:"Widgets",path:"/widgets"});
  if(site.features?.news)extra.push({name:"News",path:"/news"});
  const tabs=[...baseTabs,...extra];
  return(
  <nav className="border-b bg-white/80 backdrop-blur">
    <div className="container py-3 flex gap-5 items-center">
      <Link href="/" className="text-lg font-semibold" style={{color:"var(--brand,#FF7A00)"}}>
        {site.title||"XE-Lite"}
      </Link>
      <div className="flex gap-4 text-sm">
        {tabs.map(t=>(<Link key={t.path} href={t.path} className="hover:underline">{t.name}</Link>))}
      </div>
    </div>
  </nav>);
}