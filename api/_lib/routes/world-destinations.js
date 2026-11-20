const CACHE_MS=30*60*1000;
const cache=new Map();
const TYPES=['Q570116','Q839954','Q4989906','Q9259','Q46169','Q33506','Q151885','Q17350442'];
function commonsUrl(raw){return raw?raw.replace('http://commons.wikimedia.org/','https://commons.wikimedia.org/'):'';}
async function fetchPage(offset,limit){
  const key=offset+':'+limit,hit=cache.get(key);
  if(hit&&Date.now()-hit.at<CACHE_MS)return hit.items;
  const query=`SELECT DISTINCT ?place ?placeLabel ?image ?coord WHERE {
    VALUES ?type { ${TYPES.map(x=>'wd:'+x).join(' ')} }
    ?place wdt:P31 ?type; wdt:P18 ?image; wdt:P625 ?coord.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  } ORDER BY ?placeLabel LIMIT ${limit} OFFSET ${offset}`;
  const url='https://query.wikidata.org/sparql?query='+encodeURIComponent(query)+'&format=json';
  const response=await fetch(url,{headers:{Accept:'application/sparql-results+json','User-Agent':'VIA LOCAL destination discovery/1.0 (https://via-local.vercel.app)'},signal:AbortSignal.timeout(8500)});
  if(!response.ok)throw new Error('Wikidata API returned '+response.status);
  const data=await response.json();
  const items=(data.results?.bindings||[]).map(row=>{
    const qid=row.place.value.split('/').pop(),coords=row.coord?.value?.match(/Point\(([-0-9.]+) ([-0-9.]+)\)/),name=row.placeLabel?.value||qid;
    return {id:'wikidata-'+qid,slug:qid.toLowerCase(),name_ar:name,name_en:name,city_ar:'',city_en:'',country_ar:'',country_en:'',category:'world',description_ar:'',description_en:'',image_url:commonsUrl(row.image?.value),tags:['Worldwide','Wikidata'],family_friendly:false,nature:false,accessible:false,latitude:coords?Number(coords[2]):null,longitude:coords?Number(coords[1]):null,featured:false,published:true,source_url:row.place.value};
  });
  cache.set(key,{items,at:Date.now()});
  return items;
}
export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  try{
    const offset=Math.max(0,Math.min(2000,Number.parseInt(req.query?.offset||'0',10)||0));
    const limit=Math.max(1,Math.min(80,Number.parseInt(req.query?.limit||'80',10)||80));
    const items=await fetchPage(offset,limit);
    return res.status(200).json({items,offset,nextOffset:offset+items.length,limit,total:null,hasMore:items.length===limit&&offset+items.length<2000,source:'Wikidata / Wikimedia Commons'});
  }catch(error){return res.status(502).json({error:'World destination source unavailable',detail:error?.message||'Fetch failed'});}
}