const CACHE_MS = 30 * 60 * 1000;
const memberCache = { items: null, at: 0 };
const detailCache = new Map();
const CATEGORIES = [
  'World Heritage Sites', 'Archaeological sites', 'Historic sites',
  'Tourist attractions', 'National parks', 'Ancient cities',
  'Museums', 'Natural landmarks', 'Temples', 'Castles',
  'Monuments and memorials', 'Waterfalls'
];

async function wikiFetch(params) {
  const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
    action:'query', format:'json', ...params
  });
  const response = await fetch(url, {
    headers:{'User-Agent':'VIA-LOCAL/1.0 (destination discovery)'},
    signal:AbortSignal.timeout(8500)
  });
  if(!response.ok) throw new Error('Wikipedia API returned '+response.status);
  return response.json();
}

async function getMembers() {
  if(memberCache.items && Date.now()-memberCache.at<CACHE_MS) return memberCache.items;
  const lists=await Promise.all(CATEGORIES.map(category =>
    wikiFetch({list:'categorymembers',cmtitle:'Category:'+category,cmnamespace:'0',cmlimit:'500'})
      .then(data=>(data.query?.categorymembers||[]).map(p=>({...p,category})))
      .catch(()=>[])
  ));
  const unique=new Map();
  for(const list of lists) for(const page of list) {
    if(!unique.has(page.pageid)) unique.set(page.pageid,page);
  }
  memberCache.items=[...unique.values()].sort((a,b)=>a.title.localeCompare(b.title));
  memberCache.at=Date.now();
  return memberCache.items;
}

async function getPageDetails(pageIds) {
  const missing=pageIds.filter(id=>!detailCache.has(id));
  if(missing.length) {
    const data=await wikiFetch({
      pageids:missing.join('|'),
      prop:'pageimages|extracts|coordinates',
      piprop:'thumbnail',pithumbsize:'1200',
      exintro:'1',explaintext:'1',exchars:'450',
      colimit:'100'
    });
    for(const page of Object.values(data.query?.pages||{})) detailCache.set(page.pageid,{
      pageid:page.pageid,title:page.title,
      description:page.extract||'',
      image:page.thumbnail?.source||'',
      coords:page.coordinates?.[0]||null
    });
  }
  return pageIds.map(id=>detailCache.get(id)).filter(p=>p&&p.image);
}

export default async function handler(req,res) {
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  try {
    const offset=Math.max(0,Math.min(3000,Number.parseInt(req.query?.offset||'0',10)||0));
    const limit=Math.max(1,Math.min(80,Number.parseInt(req.query?.limit||'80',10)||80));
    const members=await getMembers();
    const batch=members.slice(offset,offset+limit);
    const pages=await getPageDetails(batch.map(p=>p.pageid));
    const categoryById=new Map(batch.map(p=>[p.pageid,p.category]));
    const items=pages.map(p=>{
      const coords=p.coords;
      const country='';
      return {
        id:'wiki-'+p.pageid,slug:String(p.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
        name_ar:p.title,name_en:p.title,city_ar:'',city_en:'',country_ar:country,country_en:country,
        category:categoryById.get(p.pageid)||'world',
        description_ar:p.description,description_en:p.description,image_url:p.image,
        tags:['Worldwide','Wikipedia'],family_friendly:false,nature:false,accessible:false,
        latitude:coords?.lat??null,longitude:coords?.lon??null,featured:false,published:true,
        source_url:'https://en.wikipedia.org/wiki/'+encodeURIComponent(p.title.replace(/ /g,'_'))
      };
    });
    const nextOffset=offset+batch.length;
    return res.status(200).json({items,offset,nextOffset,limit,total:members.length,hasMore:nextOffset<members.length,source:'Wikipedia / Wikimedia Commons'});
  } catch(error) {
    return res.status(502).json({error:'World destination source unavailable',detail:error?.message||'Fetch failed'});
  }
}