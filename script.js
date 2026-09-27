/*
 * Inviteus — معرض ثابت للاستعراض فقط.
 * لإضافة تصميم جديد: أضف معاينته في previews ورابط النسخة المنشورة إلى TEMPLATES.
 * previewPath نسخة محلية احتياطية، وpreviewUrl هو رابط الدعوة الأصلية الكاملة.
 * ضع روابط التواصل الحقيقية في SITE_CONFIG.socials عندما تتوفر.
 * الموقع معرض فقط. الصوت يظهر ضمن الدعوات الأصلية التي تتضمنه.
 */
'use strict';

const SITE_CONFIG = {
  socials: {
    whatsapp: '', // رقم دولي بالأرقام فقط، مثل 9647…
    instagram: '', // رابط الحساب الكامل https://…
    facebook: ''   // رابط الصفحة الكامل https://…
  }
};

const CATEGORIES = [
  { id: 'all', name: 'كل المناسبات', symbol: '✧' },
  { id: 'engagement', name: 'خطوبة', symbol: '◇' },
  { id: 'henna', name: 'حنة', symbol: '❋' },
  { id: 'wedding', name: 'زفاف', symbol: '∞' },
  { id: 'conferences', name: 'مؤتمرات', symbol: '▤' },
  { id: 'openings', name: 'افتتاحيات', symbol: '⌑' }
];

const STYLES = {
  all: 'كل الأساليب',
  luxury: 'فاخر',
  classic: 'كلاسيكي',
  romantic: 'رومانسي',
  minimal: 'بسيط',
  creative: 'مبتكر',
  modern: 'عصري'
};

const FEATURES = {
  photos: 'صور شخصية',
  bilingual: 'عربي / إنجليزي',
  countdown: 'عدّ تنازلي',
  maps: 'رابط موقع القاعة',
  calendar: 'إضافة الموعد للتقويم',
  darkMode: 'وضع داكن',
  audio: 'صوت ضمن الدعوة الأصلية'
};

// كل عنصر أدناه دعوة موجودة فعلاً. يمكن إضافة الفئات الأخرى بالطريقة نفسها لاحقاً.
const TEMPLATES = [
  { id:'ENG-001', name:'الوعد الكلاسيكي', englishName:'Classic Promise', category:'engagement', styles:['classic','romantic'], description:'ظرف تفاعلي يفتح حكاية أنس وآية، مع الصور والعدّ التنازلي وموقع القاعة.', features:['photos','countdown','maps','audio'], previewPath:'templates/engagement-a/index.html', previewUrl:'https://novixai29.github.io/engagement-a/', image:'previews/engagement-a.webp', trending:false, newArrival:true },
  { id:'ENG-002', name:'خطوبة ملكية', englishName:'Royal Engagement', category:'engagement', styles:['luxury','classic'], description:'ستارة افتتاحية سوداء ولمسات ذهبية تمنح دعوة علي وزهراء حضوراً ملكياً.', features:['countdown','maps','calendar','audio'], previewPath:'templates/engagement-b/index.html', previewUrl:'https://novixai29.github.io/engagement-b/', image:'previews/engagement-b.webp', trending:true, newArrival:true },
  { id:'ENG-003', name:'حكايتنا', englishName:'Our Story', category:'engagement', styles:['romantic'], description:'رحلة يوسف ومريم تُروى بمشاهد وصور شخصية ومعرض يمكن تصفّحه.', features:['photos','maps','audio'], previewPath:'templates/engagement-c/index.html', previewUrl:'https://novixai29.github.io/engagement-c/', image:'previews/engagement-c.webp', trending:true, newArrival:true },
  { id:'ENG-004', name:'صحيفة الخطوبة', englishName:'The Engagement Times', category:'engagement', styles:['creative','classic'], description:'خبر خطوبة عمر وليان على صفحات صحيفة تفاعلية مع صور ووضع داكن.', features:['photos','maps','calendar','darkMode'], previewPath:'templates/engagement-d/index.html', previewUrl:'https://novixai29.github.io/engagement-d/', image:'previews/engagement-d.webp', trending:false, newArrival:true },
  { id:'ENG-005', name:'فيلم خطوبتنا', englishName:'Our Engagement Movie', category:'engagement', styles:['creative','romantic'], description:'دعوة كريم ونور بصيغة فيلم: مقدمة سينمائية وملصق ومشاهد مصوّرة مع صوت النسخة الأصلية.', features:['photos','countdown','maps','calendar','audio'], previewPath:'templates/engagement-e/index.html', previewUrl:'https://novixai29.github.io/engagement-e/', image:'previews/engagement-e.webp', trending:false, newArrival:true },
  { id:'ENG-006', name:'ألبوم الذكريات', englishName:'Scrapbook', category:'engagement', styles:['creative','romantic'], description:'دفتر ذكريات زيد وسارة، بصور وصفحات تشبه الألبوم الشخصي.', features:['photos','countdown','maps','calendar'], previewPath:'templates/engagement-f/index.html', previewUrl:'https://novixai29.github.io/engagement-f/', image:'previews/engagement-f.webp', trending:false, newArrival:true },
  { id:'ENG-007', name:'تحت النجوم', englishName:'Under The Stars', category:'engagement', styles:['romantic','luxury'], description:'سماء ليلية هادئة تحيط بدعوة يوسف وزهراء ومشهدها البصري وعدّها التنازلي.', features:['photos','countdown','maps','calendar'], previewPath:'templates/engagement-g/index.html', previewUrl:'https://novixai29.github.io/engagement-g/', image:'previews/engagement-g.webp', trending:true, newArrival:true },
  { id:'ENG-008', name:'الحديقة النباتية', englishName:'Botanical Garden', category:'engagement', styles:['romantic','classic'], description:'رسوم نباتية وبوابة أنيقة لخطوبة سيف وجنى بتفاصيل ناعمة.', features:['countdown','maps','calendar'], previewPath:'templates/engagement-h/index.html', previewUrl:'https://novixai29.github.io/engagement-h/', image:'previews/engagement-h.webp', trending:false, newArrival:true },
  { id:'ENG-009', name:'ترف هادئ', englishName:'Minimal Luxury', category:'engagement', styles:['minimal','luxury'], description:'خطوط نظيفة وصور ووضع داكن، مع خيار العربية والإنجليزية لدعوة رامي ولينا.', features:['photos','bilingual','countdown','maps','calendar','darkMode'], previewPath:'templates/engagement-i/index.html', previewUrl:'https://novixai29.github.io/engagement-i/', image:'previews/engagement-i.webp', trending:true, newArrival:true },
  { id:'ENG-010', name:'رحلة العمر', englishName:'Boarding Pass', category:'engagement', styles:['creative','modern'], description:'دعوة مروان وزينة على هيئة بطاقة صعود للطائرة، بتفاصيل الرحلة وموعد الإقلاع.', features:['countdown','maps','calendar'], previewPath:'templates/engagement-j/index.html', previewUrl:'https://novixai29.github.io/engagement-j/', image:'previews/engagement-j.webp', trending:false, newArrival:true }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const number = value => new Intl.NumberFormat('ar-IQ').format(value);
const categoryName = id => CATEGORIES.find(category => category.id === id)?.name || id;
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const previewLink = template => template.previewUrl || template.previewPath;
const heartIcon = '<svg class="heart-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 42 5.8 24.7C-1.2 18 1.4 6.8 10 4.8c5.6-1.3 10.7 1.2 14 6.2 3.3-5 8.4-7.5 14-6.2 8.6 2 11.2 13.2 4.2 19.9L24 42Z"/></svg>';
const storageKey = 'inviteus-favorites-v2';
let favorites = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) favorites = new Set(saved.filter(id => TEMPLATES.some(template => template.id === id)));
} catch { /* المفضلة تظل متاحة لهذه الزيارة. */ }

const state = { category:'all', collection:'all' };
let selectedTemplate = null;
let previousFocus = null;
let toastTimer = null;

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3500);
}

function renderCategories() {
  $('#category-list').innerHTML = CATEGORIES.map(category => {
    const count = category.id === 'all' ? TEMPLATES.length : TEMPLATES.filter(template => template.category === category.id).length;
    return `<button type="button" data-category="${category.id}" class="category-card ${state.category === category.id ? 'active' : ''}" aria-pressed="${state.category === category.id}"><span class="category-symbol" aria-hidden="true">${category.symbol}</span><strong>${category.name}</strong><small>${count ? `${number(count)} تصاميم` : 'قريباً'}</small></button>`;
  }).join('');
}

function filteredTemplates() {
  return TEMPLATES.filter(template => {
    if (state.category !== 'all' && template.category !== state.category) return false;
    if (state.collection === 'favorites' && !favorites.has(template.id)) return false;
    return true;
  }).sort((a, b) => a.id.localeCompare(b.id));
}

function cardMarkup(template) {
  const saved = favorites.has(template.id);
  return `<article class="template-card">
    <div class="card-cover">
      <a class="cover-link" href="${previewLink(template)}" target="_blank" rel="noopener noreferrer" aria-label="شاهد دعوة ${escapeHTML(template.name)} كاملة">
        <img src="${template.image}" alt="لقطة فعلية من دعوة ${escapeHTML(template.name)}" width="640" height="640" loading="lazy">
        <span class="cover-open">شاهد الدعوة كاملة ↗</span>
      </a>
      <span class="card-badge">${categoryName(template.category)}</span>
      ${template.features.includes('audio') ? '<span class="sound-badge">♫ صوت أصلي</span>' : ''}
      <button type="button" class="favorite-button ${saved ? 'saved' : ''}" data-favorite="${template.id}" aria-label="${saved ? 'إزالة' : 'إضافة'} ${escapeHTML(template.name)} ${saved ? 'من' : 'إلى'} المفضلة" aria-pressed="${saved}">${heartIcon}</button>
    </div>
    <div class="card-body">
      <div class="card-kicker"><span>${template.id}</span><span>${template.styles.map(style => STYLES[style]).join(' · ')}</span></div>
      <h3>${escapeHTML(template.name)}</h3><span class="english-name" lang="en" dir="ltr">${escapeHTML(template.englishName)}</span>
      <p>${escapeHTML(template.description)}</p>
      <div class="card-features">${template.features.slice(0, 3).map(feature => `<span>${FEATURES[feature]}</span>`).join('')}${template.features.length > 3 ? `<span>+ ${number(template.features.length - 3)}</span>` : ''}</div>
      <div class="card-actions"><button type="button" class="button secondary" data-preview="${template.id}">تفاصيل التصميم</button><a class="button" href="${previewLink(template)}" target="_blank" rel="noopener noreferrer">جرّب الدعوة ↗</a></div>
    </div>
  </article>`;
}

function renderGallery() {
  renderCategories();
  const templates = filteredTemplates();
  $('#template-grid').innerHTML = templates.map(cardMarkup).join('');
  const labels = { all:'كل التصاميم', favorites:'المفضلة' };
  $('#result-count').textContent = `${labels[state.collection]} · ${number(templates.length)} تصاميم حقيقية`;
  $('#favorite-count').textContent = number(favorites.size);
  $('#favorite-nav').setAttribute('aria-label', `عرض المفضلة: ${number(favorites.size)} تصاميم`);
  $('#favorite-nav').classList.toggle('has-favorites', favorites.size > 0);
  const empty = $('#empty-state');
  empty.hidden = templates.length > 0;
  if (!templates.length) {
    const category = CATEGORIES.find(item => item.id === state.category);
    const upcoming = state.category !== 'all' && !TEMPLATES.some(template => template.category === state.category);
    $('#empty-title').textContent = upcoming ? `تصاميم ${category.name} قيد التجهيز` : state.collection === 'favorites' && !favorites.size ? 'مفضّلتك تنتظر أول تصميم' : 'ما لقينا تصميماً مطابقاً';
    $('#empty-copy').textContent = upcoming ? 'نضيف تصاميم هذه الفئة قريباً. وتكدر تتواصل ويانا إذا عندك فكرة لمناسبتك.' : state.collection === 'favorites' && !favorites.size ? 'اضغط علامة القلب على التصميم اللي يعجبك حتى ترجع له بسهولة.' : 'جرّب اختيار فئة أخرى.';
  }
}

function resetFilters() {
  Object.assign(state, { category:'all', collection:'all' });
  renderGallery();
}

function jumpCollection(collection) {
  resetFilters();
  state.collection = collection;
  renderGallery();
  $('#gallery').scrollIntoView({ behavior:'smooth' });
}

function toggleFavorite(id) {
  if (!TEMPLATES.some(template => template.id === id)) return;
  const added = !favorites.has(id);
  if (added) favorites.add(id); else favorites.delete(id);
  try { localStorage.setItem(storageKey, JSON.stringify([...favorites])); } catch { /* تكمل المفضلة بدون حفظ. */ }
  renderGallery();
  ($(`[data-favorite="${id}"]`) || $('#favorite-nav'))?.focus({ preventScroll:true });
  toast(added ? 'حفظنا التصميم بالمفضلة.' : 'أزلنا التصميم من المفضلة.');
}

function openDetails(id) {
  const template = TEMPLATES.find(item => item.id === id);
  if (!template) return;
  const dialog = $('#preview-dialog');
  previousFocus = document.activeElement;
  $('#preview-content').innerHTML = `<div class="preview-layout">
    <div class="preview-art"><img src="${template.image}" alt="لقطة من دعوة ${escapeHTML(template.name)}" width="640" height="640"></div>
    <div class="preview-details">
      <p class="eyebrow">${categoryName(template.category)} · ${template.id}</p>
      <h2 id="preview-title">${escapeHTML(template.name)}</h2>
      <p class="preview-english" lang="en" dir="ltr">${escapeHTML(template.englishName)}</p>
      <p>${escapeHTML(template.description)}</p>
      <h3>تفاصيل موجودة في الدعوة</h3>
      <ul>${template.features.map(feature => `<li>${FEATURES[feature]}</li>`).join('')}</ul>
      <p class="preview-note">الدعوة تفتح من موقعها الأصلي بكل التفاصيل والصوت إن كان موجوداً. بعدها تقدر ترجع هنا وتتواصل ويانا.</p>
      <div class="preview-actions"><a class="button" href="${previewLink(template)}" target="_blank" rel="noopener noreferrer">افتح الدعوة كاملة ↗</a><button type="button" class="button secondary" data-contact="${template.id}">تواصل بشأن هذا التصميم</button></div>
    </div>
  </div>`;
  dialog.showModal();
  document.body.classList.add('modal-open');
}

function chooseForContact(id) {
  const template = TEMPLATES.find(item => item.id === id);
  if (!template) return;
  selectedTemplate = template;
  const selected = $('#selected-template');
  selected.hidden = false;
  selected.textContent = `التصميم اللي شدّك: ${template.name} · ${template.id}. اذكر اسمه أو رمزه من تراسلنا.`;
  if ($('#preview-dialog').open) $('#preview-dialog').close();
  renderSocials();
  $('#contact').scrollIntoView({ behavior:'smooth' });
}

function safeSocialURL(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function whatsappNumber() {
  const digits = SITE_CONFIG.socials.whatsapp.replace(/\D/g, '');
  return /^\d{8,15}$/.test(digits) ? digits : '';
}

function renderSocials() {
  const whatsapp = whatsappNumber();
  const message = selectedTemplate
    ? `مرحباً Inviteus، عجبني تصميم ${selectedTemplate.name} (${selectedTemplate.id}) وأحب أستفسر عنه.`
    : 'مرحباً Inviteus، أحب أستفسر عن تصاميم الدعوات.';
  const social = [
    { key:'whatsapp', name:'واتساب', icon:'icons/whatsapp.svg', url:whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : '' },
    { key:'instagram', name:'إنستغرام', icon:'icons/instagram.svg', url:safeSocialURL(SITE_CONFIG.socials.instagram) },
    { key:'facebook', name:'فيسبوك', icon:'icons/facebook.svg', url:safeSocialURL(SITE_CONFIG.socials.facebook) }
  ];
  $('#social-links').innerHTML = social.map(item => item.url
    ? `<a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer"><img class="social-symbol" src="${item.icon}" alt="" aria-hidden="true" width="26" height="26">${item.name}<span aria-hidden="true">↗</span></a>`
    : `<span class="social-pending"><img class="social-symbol" src="${item.icon}" alt="" aria-hidden="true" width="26" height="26">${item.name} · قريباً</span>`).join('');
  $('#contact-status').textContent = social.some(item => !item.url) ? 'نجهّز روابط التواصل الرسمية ونضيفها هنا قريباً.' : '';
  const floating = $('#floating-whatsapp');
  if (whatsapp) {
    floating.href = social[0].url;
    floating.target = '_blank';
    floating.rel = 'noopener noreferrer';
    floating.setAttribute('aria-label', 'التواصل عبر واتساب');
  } else {
    floating.href = '#contact';
    floating.removeAttribute('target');
    floating.setAttribute('aria-label', 'الانتقال إلى وسائل التواصل');
  }
}

function closeMenu() {
  $('#main-nav').classList.remove('is-open');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', 'فتح القائمة');
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.category) {
    state.category = button.dataset.category;
    renderGallery();
    $(`[data-category="${state.category}"]`)?.focus({ preventScroll:true });
  } else if (button.dataset.favorite) {
    toggleFavorite(button.dataset.favorite);
  } else if (button.dataset.preview) {
    openDetails(button.dataset.preview);
  } else if (button.dataset.contact) {
    chooseForContact(button.dataset.contact);
  } else if (button.dataset.close) {
    document.getElementById(button.dataset.close)?.close();
  }
});

$('#reset-filters').addEventListener('click', resetFilters);
$('#empty-reset').addEventListener('click', () => { resetFilters(); $('#gallery').scrollIntoView({ behavior:'smooth' }); });
$('#favorite-nav').addEventListener('click', () => jumpCollection('favorites'));
$('#menu-toggle').addEventListener('click', () => {
  const opened = $('#main-nav').classList.toggle('is-open');
  $('#menu-toggle').setAttribute('aria-expanded', String(opened));
  $('#menu-toggle').setAttribute('aria-label', opened ? 'إغلاق القائمة' : 'فتح القائمة');
});
$$('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
$('#preview-dialog').addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  previousFocus?.isConnected && previousFocus.focus({ preventScroll:true });
});
$('#preview-dialog').addEventListener('click', event => { if (event.target === $('#preview-dialog')) $('#preview-dialog').close(); });
window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  try {
    const saved = JSON.parse(event.newValue || '[]');
    favorites = new Set(Array.isArray(saved) ? saved.filter(id => TEMPLATES.some(template => template.id === id)) : []);
    renderGallery();
  } catch { /* لا حاجة للتعامل مع بيانات خارجية غير صالحة. */ }
});

renderGallery();
renderSocials();
$('#year').textContent = new Intl.NumberFormat('ar-IQ', { useGrouping:false }).format(new Date().getFullYear());
