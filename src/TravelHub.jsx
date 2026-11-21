import React, { useEffect, useState } from 'react';
import { Compass, CalendarDays, UserRound, Award, Star, UserPlus, PlaneTakeoff, CheckCircle2, LogIn, LogOut, RefreshCw, MapPin, Clock3, ShieldCheck } from 'lucide-react';
import './travel-hub.css';

const tabs = [
  ['planner','خطط رحلتك','Trip planner',Compass],
  ['book','احجز تجربة','Book an experience',CalendarDays],
  ['account','حسابي','My account',UserRound],
  ['passport','جوازي الرقمي','My passport',Award],
  ['reviews','التقييمات','Reviews',Star],
  ['guide','انضم كمرشد','Become a guide',UserPlus]
];

export default function TravelHub({ lang='ar' }) {
  const rtl = lang === 'ar';
  const t = (ar,en) => rtl ? ar : en;
  const [tab,setTab] = useState('planner');
  // Keep the protected destination the visitor originally requested until authentication completes.
  const [returnTab,setReturnTab] = useState('account');
  const [catalog,setCatalog] = useState({destinations:[],guides:[],experiences:[]});
  const [loadingCatalog,setLoadingCatalog] = useState(true);
  const [notice,setNotice] = useState('');
  const [busy,setBusy] = useState(false);
  const [planForm,setPlanForm] = useState({city:'',country:'',days:3,budget:'',interests:'culture,nature'});
  const [plan,setPlan] = useState(null);
  const [booking,setBooking] = useState({experience_id:'',customer_name:'',customer_email:'',customer_phone:'',booking_date:'',guests:1,notes:''});
  const [account,setAccount] = useState({email:'',password:'',full_name:'',phone:''});
  const [accountMode,setAccountMode] = useState('login');
  const [pendingConfirmationEmail,setPendingConfirmationEmail] = useState('');
  const [user,setUser] = useState(null);
  const [customerLoading,setCustomerLoading] = useState(true);
  const [profile,setProfile] = useState({full_name:'',phone:''});
  const [bookings,setBookings] = useState([]);
  const [visits,setVisits] = useState([]);
  const [points,setPoints] = useState(0);
  const [passportForm,setPassportForm] = useState({destination_id:'',visited_on:new Date().toISOString().slice(0,10),note:''});
  const [reviewForm,setReviewForm] = useState({author_name:'',destination_id:'',rating:5,comment:''});
  const [guideForm,setGuideForm] = useState({applicant_name:'',email:'',phone:'',city:'',country:'',languages:'Arabic, English',specialties:'Culture, History',bio:''});

  const message = value => { setNotice(value); window.setTimeout(()=>setNotice(''),4500); };
  async function loadCatalog() {
    setLoadingCatalog(true);
    try { const r=await fetch('/api/catalog'); const d=await r.json(); if(!r.ok) throw new Error(d.error||'Catalog unavailable'); setCatalog(d); }
    catch(e) { message(e.message || t('تعذر تحميل البيانات','Could not load catalog')); }
    finally { setLoadingCatalog(false); }
  }
  async function loadCustomer({preserveAuthenticatedUser=false} = {}) {
    setCustomerLoading(true);
    try {
      const r=await fetch('/api/customer/me',{credentials:'same-origin'});
      if(!r.ok){if(!preserveAuthenticatedUser)setUser(null);setBookings([]);setVisits([]);setPoints(0);return false;}
      const d=await r.json();setUser(d.user);setProfile({full_name:d.profile?.full_name||'',phone:d.profile?.phone||''});
      const [br,pr]=await Promise.all([fetch('/api/customer/bookings',{credentials:'same-origin'}),fetch('/api/passport',{credentials:'same-origin'})]);
      if(br.ok){const bd=await br.json();setBookings(bd.bookings||[]);}
      if(pr.ok){const pd=await pr.json();setVisits(pd.visits||[]);setPoints(pd.points||0);}
      return true;
    } catch { if(!preserveAuthenticatedUser)setUser(null);setBookings([]);setVisits([]);setPoints(0);return false; }
    finally {setCustomerLoading(false);}
  }
  useEffect(()=>{loadCatalog();loadCustomer();},[]);

  async function submitPlan(e){
    e.preventDefault();setBusy(true);setPlan(null);
    try{
      const r=await fetch('/api/itinerary',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...planForm,interests:planForm.interests.split(',').map(x=>x.trim()).filter(Boolean)})});
      const d=await r.json();if(!r.ok)throw new Error(d.error||t('تعذر إعداد الرحلة','Could not prepare the trip'));
      setPlan(d.plan);message(t('تم إعداد خطة رحلتك وحفظها.','Your itinerary was created and saved.'));
    }catch(e){message(e.message||t('حدث خطأ','Something went wrong'));}
    finally{setBusy(false);}
  }

  async function submitBooking(e){
    e.preventDefault();setBusy(true);
    try{
      const r=await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(booking)});
      const d=await r.json();if(!r.ok)throw new Error(d.error||'Booking request failed.');
      message(t('تم استلام طلب الحجز. رقم الطلب: ','Booking request received. Reference: ')+(d.booking?.booking_code||''));
      setBooking(v=>({...v,booking_date:'',notes:''}));
      if(user) loadCustomer();
    }catch(e){message(e.message||t('تعذر إرسال طلب الحجز','Could not send booking request'));}
    finally{setBusy(false);}
  }

  async function submitAccount(e){
    e.preventDefault();setBusy(true);
    const email = account.email.trim().toLowerCase();
    try{
      const r=await fetch('/api/customer/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:accountMode,email,password:account.password,full_name:account.full_name})});
      const d=await r.json();
      if(!r.ok) {
        if (/email not confirmed/i.test(d.error || '')) setPendingConfirmationEmail(email);
        throw new Error(d.error||'Account request failed.');
      }
      if(d.confirmationRequired){
        setPendingConfirmationEmail(email);
        setTab('account');
        message(t('تم إنشاء الحساب. أكّد بريدك ثم سجّل الدخول، وسنفتح الصفحة التي طلبتها تلقائيًا.','Account created. Confirm your email and sign in; we will automatically open the page you requested.'));
        return;
      }
      setPendingConfirmationEmail('');
      if(d.user){setUser(d.user);setProfile(v=>({...v,full_name:d.user.user_metadata?.full_name||v.full_name}));}
      const loaded=await loadCustomer({preserveAuthenticatedUser:!!d.user});
      if(!loaded&&!d.user)throw new Error(t('تم تسجيل الدخول لكن تعذر تحميل جلسة الحساب. أعد المحاولة.','Signed in, but the account session could not be loaded. Please retry.'));
      const destination = returnTab || 'account';
      setTab(destination);
      setReturnTab('account');
      message(destination==='passport' ? t('تم تسجيل الدخول بنجاح. تم فتح جوازك الرقمي تلقائيًا.','Signed in successfully. Your digital passport opened automatically.') : t('تم تسجيل الدخول بنجاح. جميع خدمات الحساب أصبحت متاحة.','Signed in successfully. Account services are now available.'));
    }catch(e){
      if (/email not confirmed/i.test(e.message || '')) {
        message(t('حسابك موجود، لكنه يحتاج تأكيد البريد الإلكتروني قبل تسجيل الدخول. أعد إرسال رسالة التأكيد من الزر أدناه.','Your account exists, but email confirmation is required before sign-in. Resend the confirmation email below.'));
      } else message(e.message||t('تعذر تسجيل الدخول','Could not sign in'));
    }
    finally{setBusy(false);}
  }
  async function resendConfirmation(){
    const email = (pendingConfirmationEmail || account.email).trim().toLowerCase();
    if (!email) return message(t('اكتب بريدك الإلكتروني أولًا.','Enter your email address first.'));
    setBusy(true);
    try {
      const r = await fetch('/api/customer/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'resend',email})});
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not resend confirmation email.');
      message(t('طلبنا إرسال رسالة تأكيد جديدة. افحص صندوق الوارد والبريد غير المرغوب فيه.','A new confirmation email was requested. Check your inbox and spam folder.'));
    } catch(e) {
      message(e.message || t('تعذر إعادة إرسال الرسالة الآن. حاول لاحقًا.','Could not resend the email right now. Try again later.'));
    } finally { setBusy(false); }
  }
  async function signOut(){await fetch('/api/customer/auth',{method:'DELETE'});setUser(null);setBookings([]);setVisits([]);message(t('تم تسجيل الخروج.','Signed out.'));}
  async function saveProfile(e){
    e.preventDefault();setBusy(true);
    try{const r=await fetch('/api/customer/me',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(profile)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Save failed');message(t('تم حفظ بياناتك.','Profile saved.'));}
    catch(e){message(e.message||'Save failed');}
    finally{setBusy(false);}
  }
  async function submitVisit(e){
    e.preventDefault();setBusy(true);
    try{const r=await fetch('/api/passport',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(passportForm)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Passport update failed');setPassportForm(v=>({...v,note:''}));await loadCustomer();message(t('تم إرسال الزيارة للمراجعة.','Visit submitted for verification.'));}
    catch(e){message(e.message||'Passport update failed');}
    finally{setBusy(false);}
  }
  async function submitReview(e){
    e.preventDefault();setBusy(true);
    try{const r=await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(reviewForm)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Review failed');setReviewForm(v=>({...v,comment:''}));message(d.message||t('تم إرسال التقييم للمراجعة.','Review submitted for moderation.'));}
    catch(e){message(e.message||'Review failed');}
    finally{setBusy(false);}
  }
  async function submitGuide(e){
    e.preventDefault();setBusy(true);
    try{const r=await fetch('/api/guide-applications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...guideForm,languages:guideForm.languages.split(',').map(x=>x.trim()).filter(Boolean),specialties:guideForm.specialties.split(',').map(x=>x.trim()).filter(Boolean)})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Application failed');setGuideForm(v=>({...v,bio:''}));message(t('تم استلام طلب انضمامك للمراجعة.','Your guide application was submitted for review.'));}
    catch(e){message(e.message||'Application failed');}
    finally{setBusy(false);}
  }

  const field=(label,element,wide=false)=><label className={wide?'hub-field wide':'hub-field'}>{label}{element}</label>;
  const experienceName = x => rtl ? x.title_ar : x.title_en;
  const placeName = x => rtl ? x.name_ar : x.name_en;

  return <section className="travel-hub container" dir={rtl?'rtl':'ltr'}>
    <div className="hub-intro"><div><span className="eyebrow gold-text">VIA LOCAL TRAVEL HUB</span><h1>{t('رحلتك تبدأ من هنا','Your journey starts here')}</h1><p>{t('خطط، احجز، تابع رحلاتك، واجمع ذكرياتك في حساب واحد.','Plan, book, track your trips and collect your memories in one place.')}</p></div><div className="hub-intro-mark"><PlaneTakeoff size={30}/></div></div>
    <nav className="hub-tabs">{tabs.map(([id,ar,en,Icon])=><button key={id} className={tab===id?'active':''} onClick={()=>{if(id==='passport'&&!user&&!customerLoading){setReturnTab('passport');setAccountMode('signup');setTab('account');message(t('أنشئ حسابك أو سجّل الدخول، وسيُفتح جوازك الرقمي تلقائيًا بعد نجاح الدخول.','Create an account or sign in; your digital passport will open automatically afterward.'));return;}setTab(id);if(id==='passport'&&!user)loadCustomer();}}><Icon size={16}/>{t(ar,en)}</button>)</nav>
    {notice&&<div className="hub-notice"><CheckCircle2 size={17}/>{notice}</div>}

    {tab==='planner'&&<div className="hub-card"><div className="hub-card-title"><Compass size={20}/><div><h2>{t('مخطط الرحلات الذكي','Smart trip planner')}</h2><p>{t('أنشئ برنامجًا أوليًا حسب المدينة والمدة واهتماماتك، باستخدام الوجهات المنشورة في الموقع.','Build a starter itinerary using published destinations, your city, trip length and interests.')}</p></div></div>
      <form className="hub-form" onSubmit={submitPlan}>
        {field(t('المدينة *','City *'),<input required value={planForm.city} onChange={e=>setPlanForm({...planForm,city:e.target.value})} placeholder={t('مثال: مسقط','e.g. Muscat')}/>)}
        {field(t('الدولة','Country'),<input value={planForm.country} onChange={e=>setPlanForm({...planForm,country:e.target.value})}/>)}
        {field(t('عدد الأيام','Number of days'),<input type="number" min="1" max="30" value={planForm.days} onChange={e=>setPlanForm({...planForm,days:e.target.value})}/>)}
        {field(t('الميزانية التقريبية','Approximate budget'),<input type="number" min="0" value={planForm.budget} onChange={e=>setPlanForm({...planForm,budget:e.target.value})} placeholder="USD"/>)}
        {field(t('اهتماماتك (بفواصل)','Interests (comma separated)'),<input value={planForm.interests} onChange={e=>setPlanForm({...planForm,interests:e.target.value})} placeholder="culture, nature, food"/>,true)}
        <button className="btn-primary" disabled={busy}>{busy?t('جارٍ إعداد الخطة...','Planning...'):t('أنشئ برنامج رحلتي','Create my itinerary')} <Compass size={17}/></button>
      </form>
      {plan&&<div className="itinerary-results"><h3>{t('برنامجك المقترح','Your suggested itinerary')}</h3>{plan.map(day=><article className="itinerary-day" key={day.day}><span>{t('اليوم','Day')} {day.day}</span><div><strong>{day.destination?.[rtl?'name_ar':'name_en']}</strong><p>{day.destination?.[rtl?'description_ar':'description_en']}</p><small><Clock3 size={13}/> {day.afternoon?.title_ar||day.afternoon?.title_en||day.afternoon?.title||t('وقت حر للاستكشاف','Free time to explore')}</small></div></article>)}</div>}
      <p className="hub-disclaimer">{t('الخطة اقتراح أولي وليست حجزًا أو ضمانًا للتوافر. راجع ظروف الزيارة ومواعيد الجهات الرسمية قبل السفر.','This is a starter suggestion, not a booking or availability guarantee. Check official visitor information before travelling.')}</p>
    </div>}

    {tab==='book'&&<div className="hub-card"><div className="hub-card-title"><CalendarDays size={20}/><div><h2>{t('احجز تجربة محلية','Book a local experience')}</h2><p>{t('اختر تجربة منشورة وأرسل طلب حجز ينتظر تأكيد فريق VIA LOCAL.','Choose a published experience and send a booking request for VIA LOCAL to confirm.')}</p></div></div>
      {!catalog.experiences.length?<div className="hub-empty">{t('لا توجد تجارب متاحة للحجز حاليًا. سيتم عرض التجارب هنا بمجرد إضافتها واعتمادها ونشرها.','No bookable experiences are available yet. Published experiences will appear here once they are added and approved.')}</div>:<form className="hub-form" onSubmit={submitBooking}>
        {field(t('التجربة *','Experience *'),<select required value={booking.experience_id} onChange={e=>setBooking({...booking,experience_id:e.target.value})}><option value="">{t('اختر تجربة','Select an experience')}</option>{catalog.experiences.map(x=><option key={x.id} value={x.id}>{experienceName(x)} · {Number(x.price||0)} {x.currency}</option>)}</select>,true)}
        {field(t('الاسم بالكامل *','Full name *'),<input required value={booking.customer_name} onChange={e=>setBooking({...booking,customer_name:e.target.value})}/>)}
        {field(t('رقم الهاتف *','Phone *'),<input required type="tel" value={booking.customer_phone} onChange={e=>setBooking({...booking,customer_phone:e.target.value})}/>)}
        {field(t('البريد الإلكتروني','Email'),<input type="email" value={booking.customer_email} onChange={e=>setBooking({...booking,customer_email:e.target.value})}/>)}
        {field(t('تاريخ التجربة *','Experience date *'),<input required type="date" min={new Date().toISOString().slice(0,10)} value={booking.booking_date} onChange={e=>setBooking({...booking,booking_date:e.target.value})}/>)}
        {field(t('عدد الأشخاص','Guests'),<input type="number" min="1" max="30" value={booking.guests} onChange={e=>setBooking({...booking,guests:e.target.value})}/>)}
        {field(t('ملاحظات','Notes'),<textarea rows="3" value={booking.notes} onChange={e=>setBooking({...booking,notes:e.target.value})}/>,true)}
        <button className="btn-primary" disabled={busy}>{busy?t('جارٍ الإرسال...','Sending...'):t('إرسال طلب الحجز','Send booking request')} <CalendarDays size={17}/></button>
      </form>}
      <p className="hub-disclaimer">{t('لا يتم تحصيل أي مدفوعات عبر هذا النموذج حاليًا. لا يعتبر الموعد مؤكدًا حتى تتواصل الإدارة معك.','No payment is collected through this form. Your date is not confirmed until the team contacts you.')}</p>
    </div>}

    {tab==='account'&&<div className="hub-card"><div className="hub-card-title"><UserRound size={20}/><div><h2>{t('حساب المسافر','Traveller account')}</h2><p>{t('احفظ بياناتك وتابع طلباتك من حساب واحد.','Save your details and keep track of your requests.')}</p></div></div>
      {customerLoading&&!user?<div className="hub-empty">{t('جارٍ التحقق من حسابك...','Checking your account session...')}</div>:user?<><div className="hub-signed"><CheckCircle2 size={18}/><strong>{user.email}</strong><button className="btn-outline" onClick={signOut}><LogOut size={15}/>{t('تسجيل الخروج','Sign out')}</button></div>
        <form className="hub-form" onSubmit={saveProfile}>{field(t('الاسم','Name'),<input value={profile.full_name} onChange={e=>setProfile({...profile,full_name:e.target.value})}/>)}{field(t('الهاتف','Phone'),<input value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})}/>)}<button className="btn-primary" disabled={busy}>{t('حفظ البيانات','Save profile')}</button></form>
        <h3 className="hub-subtitle">{t('حجوزاتي','My bookings')}</h3>{bookings.length?bookings.map(b=><article className="hub-list-row" key={b.id}><strong>{b.booking_code}</strong><span>{b.booking_date} · {b.guests} {t('أفراد','guests')}</span><b>{b.status}</b></article>):<p className="hub-muted">{t('لا توجد حجوزات مرتبطة بهذا الحساب بعد.','No bookings linked to this account yet.')}</p>}
      </>:<><div className="hub-switch"><button className={accountMode==='login'?'active':''} onClick={()=>setAccountMode('login')}>{t('تسجيل الدخول','Sign in')}</button><button className={accountMode==='signup'?'active':''} onClick={()=>setAccountMode('signup')}>{t('إنشاء حساب','Create account')}</button></div>
        <form className="hub-form" onSubmit={submitAccount}>{accountMode==='signup'&&field(t('الاسم','Name'),<input required value={account.full_name} onChange={e=>setAccount({...account,full_name:e.target.value})}/>)}{field(t('البريد الإلكتروني','Email'),<input required type="email" value={account.email} onChange={e=>setAccount({...account,email:e.target.value})}/>)}{field(t('كلمة المرور (8 أحرف على الأقل)','Password (8+ characters)'),<input required minLength="8" type="password" value={account.password} onChange={e=>setAccount({...account,password:e.target.value})}/>)}<button className="btn-primary" disabled={busy}>{busy?t('جارٍ التنفيذ...','Please wait...'):accountMode==='signup'?t('إنشاء الحساب','Create account'):t('دخول','Sign in')} <LogIn size={16}/></button></form>{pendingConfirmationEmail&&<div className="hub-confirmation"><p>{t('بانتظار تأكيد البريد: ','Waiting for email confirmation: ')}<strong>{pendingConfirmationEmail}</strong></p><button type="button" className="btn-outline" onClick={resendConfirmation} disabled={busy}>{busy?t('جارٍ الإرسال...','Sending...'):t('إعادة إرسال رسالة التأكيد','Resend confirmation email')}</button></div>}<p className="hub-disclaimer">{t('بعد إنشاء الحساب، افتح رسالة التأكيد المرسلة إلى بريدك الإلكتروني قبل تسجيل الدخول.','After creating an account, confirm your email before signing in.')}</p></>}
    </div>}

    {tab==='passport'&&<div className="hub-card"><div className="hub-card-title"><Award size={20}/><div><h2>{t('VIA LOCAL Passport','VIA LOCAL Passport')}</h2><p>{t('سجّل الأماكن التي زرتها واجمع نقاطًا بعد التحقق من الزيارات.','Record places you have visited and collect points after visits are verified.')}</p></div></div>
      {customerLoading&&!user?<div className="hub-empty">{t('جارٍ التحقق من تسجيل دخولك...','Checking your sign-in status...')} <button className="btn-outline" onClick={loadCustomer} disabled={customerLoading}>{t('تحقق مرة أخرى','Check again')}</button></div>:!user?<div className="hub-empty">{t('لم يتم العثور على جلسة دخول نشطة. لو أنشأت حسابًا بالفعل، اختَر تسجيل الدخول بنفس البريد وكلمة المرور بدل إنشاء حساب جديد.','No active sign-in session was found. If you already created an account, sign in using the same email and password instead of creating another account.')} <button className="btn-outline" onClick={()=>{setAccountMode('login');setTab('account')}}>{t('تسجيل الدخول','Sign in')}</button> <button className="btn-outline" onClick={loadCustomer} disabled={customerLoading}>{t('إعادة التحقق','Retry session check')}</button></div>:<>
        <div className="passport-score"><Award size={26}/><div><strong>{points}</strong><span>{t('نقطة معتمدة','verified points')}</span></div></div>
        <form className="hub-form" onSubmit={submitVisit}>{field(t('الوجهة التي زرتها','Destination visited'),<select required value={passportForm.destination_id} onChange={e=>setPassportForm({...passportForm,destination_id:e.target.value})}><option value="">{t('اختر وجهة','Choose a destination')}</option>{catalog.destinations.map(d=><option value={d.id} key={d.id}>{placeName(d)}</option>)}</select>,true)}{field(t('تاريخ الزيارة','Visit date'),<input type="date" required value={passportForm.visited_on} onChange={e=>setPassportForm({...passportForm,visited_on:e.target.value})}/>)}{field(t('ملاحظات','Notes'),<textarea rows="2" value={passportForm.note} onChange={e=>setPassportForm({...passportForm,note:e.target.value})}/>,true)}<button className="btn-primary" disabled={busy}>{t('إضافة زيارة','Add visit')}</button></form>
        <div className="hub-list">{visits.map(v=><article className="hub-list-row" key={v.id}><strong>{v.destination?.[rtl?'name_ar':'name_en']||v.destination_id}</strong><span>{v.visited_on}</span><b>{t(v.status==='verified'?'معتمدة':v.status==='rejected'?'مرفوضة':'قيد المراجعة',v.status==='verified'?'Verified':v.status==='rejected'?'Rejected':'Pending')}</b></article>)}</div>
      </>}
    </div>}

    {tab==='reviews'&&<div className="hub-card"><div className="hub-card-title"><Star size={20}/><div><h2>{t('شارك تجربتك','Share your experience')}</h2><p>{t('التقييمات الجديدة تُراجع قبل ظهورها للعامة.','New reviews are moderated before appearing publicly.')}</p></div></div>
      <form className="hub-form" onSubmit={submitReview}>{field(t('اسمك','Your name'),<input required value={reviewForm.author_name} onChange={e=>setReviewForm({...reviewForm,author_name:e.target.value})}/>)}{field(t('الوجهة *','Destination *'),<select required value={reviewForm.destination_id} onChange={e=>setReviewForm({...reviewForm,destination_id:e.target.value})}><option value="">{t('اختر وجهة','Choose destination')}</option>{catalog.destinations.map(d=><option key={d.id} value={d.id}>{placeName(d)}</option>)}</select>)}{field(t('التقييم','Rating'),<select value={reviewForm.rating} onChange={e=>setReviewForm({...reviewForm,rating:Number(e.target.value)})}>{[5,4,3,2,1].map(n=><option value={n} key={n}>{n}/5</option>)}</select>)}{field(t('اكتب تجربتك','Your review'),<textarea required rows="4" value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm,comment:e.target.value})}/>,true)}<button className="btn-primary" disabled={busy}>{t('إرسال التقييم','Submit review')} <Star size={16}/></button></form>
    </div>}

    {tab==='guide'&&<div className="hub-card"><div className="hub-card-title"><ShieldCheck size={20}/><div><h2>{t('انضم إلى شبكة المرشدين المحليين','Join the local guide network')}</h2><p>{t('قدّم بياناتك وخبراتك ليتم مراجعتها من فريق VIA LOCAL.','Share your details and experience for the VIA LOCAL team to review.')}</p></div></div>
      <form className="hub-form" onSubmit={submitGuide}>{field(t('الاسم الكامل','Full name'),<input required value={guideForm.applicant_name} onChange={e=>setGuideForm({...guideForm,applicant_name:e.target.value})}/>)}{field(t('البريد الإلكتروني','Email'),<input required type="email" value={guideForm.email} onChange={e=>setGuideForm({...guideForm,email:e.target.value})}/>)}{field(t('الهاتف','Phone'),<input required value={guideForm.phone} onChange={e=>setGuideForm({...guideForm,phone:e.target.value})}/>)}{field(t('المدينة','City'),<input required value={guideForm.city} onChange={e=>setGuideForm({...guideForm,city:e.target.value})}/>)}{field(t('الدولة','Country'),<input value={guideForm.country} onChange={e=>setGuideForm({...guideForm,country:e.target.value})}/>)}{field(t('اللغات (بفواصل)','Languages (comma separated)'),<input value={guideForm.languages} onChange={e=>setGuideForm({...guideForm,languages:e.target.value})}/>)}{field(t('التخصصات (بفواصل)','Specialties (comma separated)'),<input value={guideForm.specialties} onChange={e=>setGuideForm({...guideForm,specialties:e.target.value})}/>,true)}{field(t('نبذة عن خبرتك','About your experience'),<textarea rows="4" value={guideForm.bio} onChange={e=>setGuideForm({...guideForm,bio:e.target.value})}/>,true)}<button className="btn-primary" disabled={busy}>{t('إرسال طلب الانضمام','Submit guide application')} <UserPlus size={16}/></button></form>
    </div>}
    {loadingCatalog&&<div className="hub-loading"><RefreshCw size={15}/>{t('جارٍ تحميل الوجهات والتجارب...','Loading destinations and experiences...')}</div>}
  </section>;
}
