import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, RefreshCw, MapPin, Users, CalendarDays, Star, FileText, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import './admin-workspace.css';

const contentTypes = {
  destinations: {
    ar: 'الوجهات', en: 'Destinations',
    fields: [
      ['slug','الرابط المختصر','Slug','text',true],['name_ar','الاسم بالعربية','Arabic name','text',true],['name_en','الاسم بالإنجليزية','English name','text',true],
      ['city_ar','المدينة بالعربية','Arabic city','text'],['city_en','المدينة بالإنجليزية','English city','text'],['country_ar','الدولة بالعربية','Arabic country','text'],['country_en','الدولة بالإنجليزية','English country','text'],
      ['category','التصنيف','Category','text'],['description_ar','الوصف بالعربية','Arabic description','textarea'],['description_en','الوصف بالإنجليزية','English description','textarea'],
      ['image_url','رابط الصورة','Image URL','text'],['tags','الكلمات المفتاحية (بفواصل)','Tags (comma separated)','array'],['gallery','معرض الصور JSON','Gallery JSON','json'],
      ['family_friendly','مناسب للعائلات','Family friendly','boolean'],['nature','طبيعة','Nature','boolean'],['halal_options','خيارات حلال','Halal options','boolean'],['accessible','إمكانية الوصول','Accessibility','boolean'],
      ['accessibility_details','تفاصيل الوصول JSON','Accessibility details JSON','json'],['latitude','خط العرض','Latitude','number'],['longitude','خط الطول','Longitude','number'],
      ['featured','وجهة مميزة','Featured','boolean'],['published','منشور على الموقع','Published on site','boolean']
    ]
  },
  guides: {
    ar: 'المرشدون', en: 'Guides',
    fields: [
      ['name_ar','الاسم بالعربية','Arabic name','text',true],['name_en','الاسم بالإنجليزية','English name','text',true],['bio_ar','نبذة بالعربية','Arabic bio','textarea'],['bio_en','نبذة بالإنجليزية','English bio','textarea'],
      ['city_ar','المدينة بالعربية','Arabic city','text'],['city_en','المدينة بالإنجليزية','English city','text'],['country_ar','الدولة بالعربية','Arabic country','text'],['country_en','الدولة بالإنجليزية','English country','text'],
      ['languages','اللغات (بفواصل)','Languages (comma separated)','array'],['specialties','التخصصات (بفواصل)','Specialties (comma separated)','array'],['price','السعر','Price','number'],['currency','العملة','Currency','text'],['avatar_url','رابط الصورة الشخصية','Avatar URL','text'],['is_demo','ملف تجريبي (بيانات افتراضية)','Demo profile (fictional data)','boolean'],['verified','مرشد موثّق','Verified','boolean'],['published','منشور على الموقع','Published on site','boolean']
    ]
  },
  experiences: {
    ar: 'التجارب والجولات', en: 'Experiences',
    fields: [
      ['slug','الرابط المختصر','Slug','text',true],['title_ar','اسم التجربة بالعربية','Arabic title','text',true],['title_en','اسم التجربة بالإنجليزية','English title','text',true],
      ['description_ar','الوصف بالعربية','Arabic description','textarea'],['description_en','الوصف بالإنجليزية','English description','textarea'],['destination_id','الوجهة','Destination','select',true],['guide_id','المرشد (اختياري)','Guide (optional)','select'],
      ['duration_minutes','المدة بالدقائق','Duration in minutes','number'],['price','السعر للفرد','Price per guest','number'],['currency','العملة','Currency','text'],['capacity','السعة القصوى','Capacity','number'],
      ['schedule','المواعيد JSON','Schedule JSON','json'],['accessible_features','مميزات الوصول JSON','Accessibility JSON','json'],['published','متاحة للحجز','Published / bookable','boolean']
    ]
  },
  content_pages: {
    ar: 'صفحات ومحتوى الموقع', en: 'CMS Pages',
    fields: [['slug','الرابط المختصر','Slug','text',true],['title_ar','العنوان بالعربية','Arabic title','text',true],['title_en','العنوان بالإنجليزية','English title','text',true],['body_ar','المحتوى بالعربية','Arabic body','textarea'],['body_en','المحتوى بالإنجليزية','English body','textarea'],['published','منشور','Published','boolean']]
  }
};

const bookingStatuses = ['pending','accepted','confirmed','cancelled','completed','rejected'];
const applicationStatuses = ['pending','reviewing','approved','rejected'];
const statusAr = {pending:'قيد الانتظار',accepted:'مقبول',confirmed:'مؤكد',cancelled:'ملغي',completed:'مكتمل',rejected:'مرفوض',reviewing:'قيد المراجعة',approved:'تمت الموافقة'};
const statusEn = {pending:'Pending',accepted:'Accepted',confirmed:'Confirmed',cancelled:'Cancelled',completed:'Completed',rejected:'Rejected',reviewing:'Reviewing',approved:'Approved'};
const money = (v,c='USD') => new Intl.NumberFormat('en',{style:'currency',currency:c,maximumFractionDigits:2}).format(Number(v||0));
const blankFor = fields => Object.fromEntries(fields.map(([key,,,,required]) => [key, key==='published'||key==='verified'||key==='is_demo'||key==='featured'||key==='family_friendly'||key==='nature'||key==='halal_options'||key==='accessible' ? false : key==='price'?0:key==='capacity'?10:key==='duration_minutes'?120:key==='currency'?'USD':'']));

const jsonDefaults = { gallery: [], schedule: [], accessibility_details: {}, accessible_features: {} };

export default function AdminWorkspace({ section, lang='ar', type='destinations', setType=()=>{}, onGoToExperiences=()=>{} }) {
  const rtl = lang === 'ar';
  const [items,setItems] = useState([]);
  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [editing,setEditing] = useState(null);
  const [form,setForm] = useState({});
  const [saving,setSaving] = useState(false);
  const [search,setSearch] = useState('');
  const [experienceOptions,setExperienceOptions] = useState([]);
  const [contentDestinations,setContentDestinations] = useState([]);
  const [contentGuides,setContentGuides] = useState([]);
  const [manualBooking,setManualBooking] = useState({experience_id:'',customer_name:'',customer_phone:'',customer_email:'',booking_date:'',guests:1,notes:'',status:'pending'});
  const [showManualBooking,setShowManualBooking] = useState(false);
  const [savingBooking,setSavingBooking] = useState(false);
  const t = (ar,en) => rtl ? ar : en;

  async function load() {
    setLoading(true); setError('');
    try {
      let url = '';
      if (section === 'content') url = `/api/admin/content?type=${type}`;
      if (section === 'bookings') url = '/api/admin/bookings';
      if (section === 'reviews') url = '/api/admin/reviews';
      if (section === 'applications') url = '/api/admin/guide-applications';
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load data.');
      setItems(data.items || data.bookings || data.reviews || data.applications || []);
      if (section === 'content' && type === 'experiences') {
        const [destResponse, guideResponse] = await Promise.all([
          fetch('/api/admin/content?type=destinations'),
          fetch('/api/admin/content?type=guides')
        ]);
        const [destData, guideData] = await Promise.all([destResponse.json(), guideResponse.json()]);
        if (!destResponse.ok || !guideResponse.ok) throw new Error('Could not load destination and guide choices.');
        setContentDestinations(destData.items || []);
        setContentGuides(guideData.items || []);
      }
      if (section === 'bookings') {
        const experienceResponse = await fetch('/api/admin/content?type=experiences');
        const experienceData = await experienceResponse.json();
        if (!experienceResponse.ok) throw new Error(experienceData.error || 'Could not load experiences.');
        setExperienceOptions((experienceData.items || []).filter(x => x.published));
      }
    } catch (e) { setError(e.message || 'Could not load data.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { setEditing(null); setForm({}); setSearch(''); load(); }, [section,type]);

  const beginNew = () => { setEditing('new'); setForm(blankFor(contentTypes[type].fields)); };
  const beginEdit = row => {
    const next = {};
    contentTypes[type].fields.forEach(([key,, ,kind]) => {
      const value = row[key];
      next[key] = kind === 'array' ? (Array.isArray(value) ? value.join(', ') : '') : kind === 'json' ? JSON.stringify(value ?? jsonDefaults[key] ?? {}, null, 2) : (value ?? '');
    });
    setEditing(row.id); setForm(next);
  };
  const saveContent = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = {};
      for (const [key,, ,kind,required] of contentTypes[type].fields) {
        let value = form[key];
        if (required && !String(value ?? '').trim()) throw new Error(t('أكمل الحقول المطلوبة أولًا.','Complete the required fields first.'));
        if (kind === 'array') value = String(value || '').split(',').map(x=>x.trim()).filter(Boolean);
        if (kind === 'number') {
          if (String(value ?? '').trim() === '') {
            const defaults = { price: 0, duration_minutes: 120, capacity: 10 };
            value = Object.prototype.hasOwnProperty.call(defaults, key) ? defaults[key] : null;
          } else {
            value = Number(value);
            if (!Number.isFinite(value)) throw new Error(t('أدخل رقمًا صحيحًا في الحقل.','Enter a valid number in this field.'));
          }
        }
        if (kind === 'select') value = value === '' || value == null ? null : value;
        if (kind === 'json') { try { value = String(value ?? '').trim() ? JSON.parse(value) : (jsonDefaults[key] ?? {}); } catch { throw new Error(t('صيغة JSON غير صحيحة في أحد الحقول.','One of the JSON fields is invalid.')); } }
        if (kind === 'boolean') value = Boolean(value);
        payload[key] = value;
      }
      const endpoint = editing === 'new' ? `/api/admin/content?type=${type}` : `/api/admin/content/${editing}?type=${type}`;
      const response = await fetch(endpoint,{method:editing==='new'?'POST':'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Save failed.');
      setEditing(null); setForm({}); await load();
    } catch (e) { setError(e.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  async function deleteContent(id) {
    if (!window.confirm(type==='guides' ? t('متأكد من حذف ملف المرشد؟ سيتم حذفه من الموقع وقاعدة البيانات.','Delete this guide profile from the site and database?') : t('متأكد من حذف العنصر؟','Delete this item?'))) return;
    try {
      const r = await fetch(`/api/admin/content/${id}?type=${type}`,{method:'DELETE'});
      const d = await r.json(); if(!r.ok) throw new Error(d.error || 'Delete failed.');
      await load();
    } catch(e) { setError(e.message || 'Delete failed.'); }
  }

  function startManualBooking() {
    setError('');
    setManualBooking({experience_id:'',customer_name:'',customer_phone:'',customer_email:'',booking_date:'',guests:1,notes:'',status:'pending'});
    setShowManualBooking(true);
  }

  async function submitManualBooking(e) {
    e.preventDefault();
    if (!experienceOptions.length) {
      setError(t('لا يمكن إنشاء حجز قبل نشر تجربة واحدة على الأقل.','Publish at least one experience before creating a booking.'));
      return;
    }
    setSavingBooking(true);
    setError('');
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualBooking)
      });
      const data = await response.json();
      if (response.status === 401) {
        setError(t('انتهت جلسة الإدارة. سجّل الدخول مرة أخرى.','Your admin session expired. Please sign in again.'));
        return;
      }
      if (!response.ok) throw new Error(data.error || t('تعذر حفظ الحجز.','Could not save the booking.'));
      setShowManualBooking(false);
      setManualBooking({experience_id:'',customer_name:'',customer_phone:'',customer_email:'',booking_date:'',guests:1,notes:'',status:'pending'});
      await load();
    } catch (e) {
      setError(e.message || t('تعذر حفظ الحجز.','Could not save the booking.'));
    } finally {
      setSavingBooking(false);
    }
  }

  async function patchStatus(kind,row,value) {
    const endpoint = kind==='bookings' ? `/api/admin/bookings/${row.id}` : kind==='applications' ? `/api/admin/guide-applications/${row.id}` : `/api/admin/reviews/${row.id}`;
    const body = kind==='reviews' ? {approved:value} : {status:value};
    try {
      const r=await fetch(endpoint,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d=await r.json(); if(!r.ok) throw new Error(d.error || 'Update failed.');
      await load();
    } catch(e) { setError(e.message || 'Update failed.'); }
  }

  const filtered = items.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const title = section==='content'?t('إدارة المحتوى','Content management'):section==='bookings'?t('الحجوزات','Bookings'):section==='reviews'?t('مراجعة التقييمات','Review moderation'):t('طلبات انضمام المرشدين','Guide applications');

  if (section === 'content') {
    const fields = contentTypes[type].fields;
    return <section className="workspace-panel" dir={rtl?'rtl':'ltr'}>
      <div className="workspace-heading"><div><span className="workspace-kicker">VIA LOCAL CMS</span><h2>{title}</h2><p>{t('أضف الوجهات والمرشدين والتجارب والمحتوى، ثم انشرها للموقع.','Create destinations, guides, experiences and pages, then publish them.')}</p></div><button className="workspace-primary" onClick={beginNew}><Plus size={16}/>{t('إضافة جديد','Add new')}</button></div>
      <div className="workspace-toolbar"><select value={type} onChange={e=>setType(e.target.value)}>{Object.entries(contentTypes).map(([key,v])=><option key={key} value={key}>{rtl?v.ar:v.en}</option>)}</select><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('ابحث في المحتوى...','Search content...')}/><button onClick={load} disabled={loading}><RefreshCw size={15}/>{t('تحديث','Refresh')}</button></div>
      {type==='guides'&&<div className="workspace-demo-note">{t('الملفات التجريبية مميزة بعلامة «ملف تجريبي». يمكنك تعديلها أو حذفها من هنا. أي ملف جديد لمرشد حقيقي اترك خيار «ملف تجريبي» مغلقًا ولا تمنحه توثيقًا قبل مراجعة بياناته.','Demo profiles are marked with a Demo badge. You can edit or delete them here. For a real guide, leave Demo profile off and do not verify the profile before checking its details.')}</div>}
      {error&&<div className="workspace-error">{error}</div>}
      {editing!==null && <form className="workspace-form" onSubmit={saveContent}>
        <div className="workspace-form-head"><strong>{editing==='new'?t('إضافة عنصر جديد','Create item'):t('تعديل العنصر','Edit item')}</strong><button type="button" onClick={()=>setEditing(null)}><X size={17}/></button></div>
        <div className="workspace-fields">{fields.map(([key,labelAr,labelEn,kind,required])=><label key={key} className={kind==='textarea'||kind==='json'?'wide':''}>{rtl?labelAr:labelEn}{required?' *':''}
          {kind==='textarea'||kind==='json'?<textarea rows={kind==='json'?3:2} value={form[key]??''} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={kind==='json'?'{}':''}/>:kind==='boolean'?<input type="checkbox" checked={!!form[key]} onChange={e=>setForm({...form,[key]:e.target.checked})}/>:kind==='select'?<select required={required} value={form[key]??''} onChange={e=>setForm({...form,[key]:e.target.value})}><option value="">{rtl?'اختر':'Select'}</option>{(key==='destination_id'?contentDestinations:contentGuides).map(item=><option value={item.id} key={item.id}>{item.name_ar||item.title_ar||item.name_en||item.title_en||item.slug}{key==='destination_id'&&item.city_ar?' · '+item.city_ar:''}</option>)}</select>:<input type={kind==='number'?'number':'text'} step={kind==='number'?'any':undefined} value={form[key]??''} onChange={e=>setForm({...form,[key]:e.target.value})}/>}
        </label>)}</div>
        <div className="workspace-form-actions"><button type="button" className="workspace-quiet" onClick={()=>setEditing(null)}>{t('إلغاء','Cancel')}</button><button className="workspace-primary" disabled={saving}><Save size={16}/>{saving?t('جارٍ الحفظ...','Saving...'):t('حفظ','Save')}</button></div>
      </form>}
      <div className="workspace-list">
        {loading?<div className="workspace-empty"><RefreshCw className="spin"/> {t('جارٍ تحميل المحتوى...','Loading content...')}</div>:filtered.map(row=><article className="workspace-item" key={row.id}>
          <div className="workspace-item-main"><strong>{row.name_ar||row.title_ar||row.title_en||row.name_en||row.slug||row.id}</strong><small>{row.city_ar||row.city_en||row.category||row.specialties?.join(' · ')||row.slug||row.id}</small></div>
          <span className={'workspace-badge '+(row.published?'published':'draft')}>{row.published?t('منشور','Published'):t('مسودة','Draft')}</span>
          {type==='guides'&&row.is_demo&&<span className="workspace-badge demo">{t('ملف تجريبي','Demo profile')}</span>}
          <button className="workspace-icon-btn" onClick={()=>beginEdit(row)} title={t('تعديل','Edit')}><Pencil size={16}/></button>
          <button className="workspace-icon-btn danger" onClick={()=>deleteContent(row.id)} title={t('حذف','Delete')}><Trash2 size={16}/></button>
        </article>)}
        {!loading&&!filtered.length&&<div className="workspace-empty">{t('لا توجد عناصر بعد. أضف أول عنصر من الأعلى.','No items yet. Add your first item above.')}</div>}
      </div>
    </section>;
  }

  if (section === 'bookings') return <section className="workspace-panel" dir={rtl?'rtl':'ltr'}>
    <div className="workspace-heading"><div><span className="workspace-kicker">VIA LOCAL OPERATIONS</span><h2>{title}</h2><p>{t('راجع طلبات الحجز وأضف حجزًا يدويًا للعميل وغيّر حالته.','Review requests, create a booking manually, and update its status.')}</p></div><div className="workspace-heading-actions">{!experienceOptions.length&&<button className="workspace-quiet" onClick={onGoToExperiences}><FileText size={15}/>{t('إضافة تجربة أولًا','Add an experience first')}</button>}<button className="workspace-primary" onClick={startManualBooking}><Plus size={16}/>{t('إضافة حجز','Add booking')}</button><button className="workspace-quiet" onClick={load}><RefreshCw size={15}/>{t('تحديث','Refresh')}</button></div></div>
    {error&&<div className="workspace-error">{error}</div>}
    {showManualBooking&&<form className="workspace-form" onSubmit={submitManualBooking}>
      <div className="workspace-form-head"><strong>{t('إضافة حجز يدوي','Create manual booking')}</strong><button type="button" onClick={()=>setShowManualBooking(false)}><X size={17}/></button></div>
      <div className="workspace-fields">
        <label>
          {t('التجربة *','Experience *')}
          <select
            required
            value={manualBooking.experience_id}
            onChange={e => setManualBooking(prev => ({ ...prev, experience_id: e.target.value }))}
          >
            <option value="">{t('اختر تجربة منشورة','Choose published experience')}</option>
            {experienceOptions.map(x => (
              <option key={x.id} value={x.id}>
                {x.title_ar || x.title_en} · {money(x.price, x.currency)}
              </option>
            ))}
          </select>
        </label>
        <label>{t('اسم العميل *','Customer name *')}<input required maxLength="100" value={manualBooking.customer_name} onChange={e=>setManualBooking({...manualBooking,customer_name:e.target.value})}/></label>
        <label>{t('رقم الهاتف *','Phone *')}<input required maxLength="40" type="tel" value={manualBooking.customer_phone} onChange={e=>setManualBooking({...manualBooking,customer_phone:e.target.value})}/></label>
        <label>{t('البريد الإلكتروني','Email')}<input type="email" maxLength="160" value={manualBooking.customer_email} onChange={e=>setManualBooking({...manualBooking,customer_email:e.target.value})}/></label>
        <label>{t('تاريخ التجربة *','Booking date *')}<input required type="date" min={new Date().toISOString().slice(0,10)} value={manualBooking.booking_date} onChange={e=>setManualBooking({...manualBooking,booking_date:e.target.value})}/></label>
        <label>{t('عدد الأشخاص','Guests')}<input type="number" min="1" max="30" value={manualBooking.guests} onChange={e=>setManualBooking({...manualBooking,guests:e.target.value})}/></label>
        <label>{t('الحالة','Status')}<select value={manualBooking.status} onChange={e=>setManualBooking({...manualBooking,status:e.target.value})}>{bookingStatuses.map(s=><option key={s} value={s}>{rtl?statusAr[s]:statusEn[s]}</option>)}</select></label>
        <label className="wide">{t('ملاحظات','Notes')}<textarea rows="2" maxLength="1000" value={manualBooking.notes} onChange={e=>setManualBooking({...manualBooking,notes:e.target.value})}/></label>
      </div>
      {!experienceOptions.length&&<div className="workspace-error">{t('لا توجد تجارب منشورة؛ لن يمكن حفظ حجز حتى تضيف تجربة وتنشرها.','There are no published experiences, so bookings cannot be saved yet. Add and publish an experience first.')} <button type="button" className="workspace-quiet" onClick={onGoToExperiences}>{t('فتح إدارة التجارب','Open experience management')}</button></div>}
      <div className="workspace-form-actions"><button type="button" className="workspace-quiet" onClick={()=>setShowManualBooking(false)}>{t('إلغاء','Cancel')}</button><button className="workspace-primary" disabled={savingBooking||!experienceOptions.length}>{savingBooking?t('جارٍ الحفظ...','Saving...'):t('حفظ الحجز','Save booking')}</button></div>
    </form>}
    <div className="workspace-list">{loading?<div className="workspace-empty">{t('جارٍ التحميل...','Loading...')}</div>:filtered.map(b=><article className="workspace-row" key={b.id}><div className="workspace-item-main"><strong>{b.customer_name} · {b.booking_code||b.id?.slice(0,8)}</strong><small>{b.customer_phone} · {b.booking_date} · {b.guests} {t('أفراد','guests')}</small><small>{b.customer_email||'—'} · {money(b.total_amount,b.currency)}</small></div><select value={b.status} onChange={e=>patchStatus('bookings',b,e.target.value)}>{bookingStatuses.map(s=><option key={s} value={s}>{rtl?statusAr[s]:statusEn[s]}</option>)}</select></article>)}
    {!loading&&!filtered.length&&<div className="workspace-empty">{t('لا توجد حجوزات حتى الآن. يمكنك إضافة حجز يدوي من الزر أعلى الصفحة.','No bookings yet. Create a manual booking from the button above.')}</div>}</div>
  </section>;

  if (section === 'reviews') return <section className="workspace-panel" dir={rtl?'rtl':'ltr'}>
    <div className="workspace-heading"><div><span className="workspace-kicker">VIA LOCAL COMMUNITY</span><h2>{title}</h2><p>{t('كل تقييم يظل مخفيًا عن الزوار حتى توافق عليه.','Reviews stay hidden from visitors until approved.')}</p></div><button className="workspace-quiet" onClick={load}><RefreshCw size={15}/>{t('تحديث','Refresh')}</button></div>
    {error&&<div className="workspace-error">{error}</div>}
    <div className="workspace-list">{loading?<div className="workspace-empty">{t('جارٍ التحميل...','Loading...')}</div>:filtered.map(r=><article className="workspace-review" key={r.id}><div className="workspace-review-top"><strong>{r.author_name}</strong><span><Star size={14} fill="currentColor"/> {r.rating}/5</span><span className={'workspace-badge '+(r.approved?'published':'draft')}>{r.approved?t('منشور','Approved'):t('بانتظار المراجعة','Pending')}</span></div><p>{r.comment}</p><button className="workspace-primary" onClick={()=>patchStatus('reviews',r,!r.approved)}>{r.approved?t('إخفاء التقييم','Unpublish review'):t('الموافقة والنشر','Approve & publish')}</button></article>)}
    {!loading&&!filtered.length&&<div className="workspace-empty">{t('لا توجد تقييمات حتى الآن.','No reviews yet.')}</div>}</div>
  </section>;

  return <section className="workspace-panel" dir={rtl?'rtl':'ltr'}>
    <div className="workspace-heading"><div><span className="workspace-kicker">VIA LOCAL PARTNERS</span><h2>{title}</h2><p>{t('راجع طلبات المرشدين ووافق على المناسب منها لإضافته إلى دليل المرشدين كمسودة.','Review guide applications and approve suitable candidates to create an unpublished guide profile.')}</p></div><button className="workspace-quiet" onClick={load}><RefreshCw size={15}/>{t('تحديث','Refresh')}</button></div>
    {error&&<div className="workspace-error">{error}</div>}
    <div className="workspace-list">{loading?<div className="workspace-empty">{t('جارٍ التحميل...','Loading...')}</div>:filtered.map(a=><article className="workspace-row" key={a.id}><div className="workspace-item-main"><strong>{a.applicant_name}</strong><small>{a.city}, {a.country||''} · {a.email} · {a.phone}</small><small>{(a.languages||[]).join(' · ')} | {(a.specialties||[]).join(' · ')}</small><small>{a.bio||''}</small></div><select value={a.status} onChange={e=>patchStatus('applications',a,e.target.value)}>{applicationStatuses.map(s=><option value={s} key={s}>{rtl?statusAr[s]:statusEn[s]}</option>)}</select></article>)}
    {!loading&&!filtered.length&&<div className="workspace-empty">{t('لا توجد طلبات انضمام.','No guide applications yet.')}</div>}</div>
  </section>;
}
