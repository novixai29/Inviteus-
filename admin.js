'use strict';

const REPO_OWNER = 'novixai29';
const REPO_NAME = 'Inviteus-';
const API_ROOT = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;
const CATEGORY_NAMES = { engagement:'خطوبة', henna:'حنة', wedding:'زفاف', conferences:'مؤتمرات', openings:'افتتاحيات', stores:'متاجر', 'food-menus':'قوائم الطعام', 'drink-menus':'قوائم المشروبات' };
const CATEGORY_CODES = { engagement:'ENG', henna:'HEN', wedding:'WED', conferences:'CON', openings:'OPN', stores:'STR', 'food-menus':'FOD', 'drink-menus':'DRK' };
const STYLES = { luxury:'فاخر', classic:'كلاسيكي', romantic:'رومانسي', minimal:'بسيط', creative:'مبتكر', modern:'عصري' };
const FEATURES = { photos:'معرض صور', bilingual:'عربي / إنجليزي', countdown:'عدّ تنازلي', maps:'رابط الموقع على الخريطة', calendar:'إضافة الموعد للتقويم', darkMode:'وضع داكن', audio:'صوت ضمن التصميم الأصلي' };
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const number = value => new Intl.NumberFormat('ar-IQ').format(value);
let token = '';
let catalog = null;
let catalogSha = '';
let busy = false;
const PAGE_SIZE = 8;
let adminPage = 1;
const TOKEN_SESSION_KEY = 'inviteus-admin-token-v1';
const DRAFT_SESSION_KEY = 'inviteus-admin-draft-v1';
const draftFields = ['template-id', 'template-name', 'template-english', 'template-category', 'template-url', 'template-mockup', 'template-mockup-video', 'template-description'];

function sessionRead(key) { try { return sessionStorage.getItem(key) || ''; } catch { return ''; } }
function sessionWrite(key, value) { try { sessionStorage.setItem(key, value); } catch { /* تظل اللوحة شغالة إذا منع المتصفح التخزين. */ } }
function sessionRemove(key) { try { sessionStorage.removeItem(key); } catch { /* لا حاجة لأي إجراء. */ } }
function saveDraft() {
  const values = Object.fromEntries(draftFields.map(id => [id, $(`#${id}`).value]));
  values.styles = [...document.querySelectorAll('[name="styles"]:checked')].map(input => input.value);
  values.features = [...document.querySelectorAll('[name="features"]:checked')].map(input => input.value);
  sessionWrite(DRAFT_SESSION_KEY, JSON.stringify(values));
}
function restoreDraft() {
  try {
    const draft = JSON.parse(sessionRead(DRAFT_SESSION_KEY));
    if (!draft || typeof draft !== 'object') return false;
    for (const id of draftFields) if (typeof draft[id] === 'string') $(`#${id}`).value = draft[id];
    document.querySelectorAll('[name="styles"]').forEach(input => { input.checked = draft.styles?.includes(input.value) || false; });
    document.querySelectorAll('[name="features"]').forEach(input => { input.checked = draft.features?.includes(input.value) || false; });
    if (draft['template-id'] && catalog.templates.some(item => item.id === draft['template-id'])) {
      $('#editor-title').textContent = 'إكمال تعديل التصميم';
      $('#save-template').textContent = 'حفظ التعديلات';
    }
    return true;
  } catch { return false; }
}

function status(message, error = false) {
  const element = $('#admin-status');
  element.textContent = message;
  element.classList.toggle('error', error);
}
function setBusy(value) {
  busy = value;
  $('#save-template').disabled = value;
  $('#reload-catalog').disabled = value;
  $('#new-template').disabled = value;
}
function encodeBase64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return btoa(binary);
}
function decodeBase64(value) {
  return new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g, '')), char => char.charCodeAt(0)));
}
async function api(path, options = {}) {
  const response = await fetch(`https://api.github.com/${path}`, {
    ...options,
    cache:'no-store',
    headers:{ Accept:'application/vnd.github+json', Authorization:`Bearer ${token}`, 'X-GitHub-Api-Version':'2022-11-28', ...options.headers }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const rateLimited = response.status === 403 && response.headers?.get?.('x-ratelimit-remaining') === '0';
    const detail = response.status === 401 ? 'رمز الوصول غير صحيح أو انتهت صلاحيته.'
      : rateLimited ? 'وصلنا مؤقتاً إلى حد طلبات GitHub. انتظر قليلاً ثم جرّب مرة ثانية؛ الرمز والمسودة محفوظان بهذا التبويب.'
      : response.status === 403 ? 'GitHub رفض هذا الطلب. تأكد من صلاحية الرمز لهذا المستودع، ثم جرّب مجدداً.'
      : response.status === 409 ? 'تغيّرت القائمة أثناء التعديل. حدّث القائمة وجرّب مرة ثانية.'
      : payload.message || `تعذّر الاتصال بـ GitHub (${response.status}).`;
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }
  return payload;
}
async function readCatalog() {
  const file = await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/catalog.json?ref=main&v=${Date.now()}`);
  const data = JSON.parse(decodeBase64(file.content));
  if (!Array.isArray(data.templates)) throw new Error('ملف التصاميم في المستودع غير صالح.');
  return { data, sha:file.sha };
}
function styleChoices() {
  $('#style-options').innerHTML = Object.entries(STYLES).map(([key, label]) => `<label><input type="checkbox" name="styles" value="${key}">${label}</label>`).join('');
  $('#feature-options').innerHTML = Object.entries(FEATURES).map(([key, label]) => `<label><input type="checkbox" name="features" value="${key}">${label}</label>`).join('');
}
function renderCards() {
  const templates = [...catalog.templates].reverse(); // التخزين بترتيب الإضافة، والعرض من الأحدث للأقدم.
  const pages = Math.max(1, Math.ceil(templates.length / PAGE_SIZE));
  adminPage = Math.min(Math.max(adminPage, 1), pages);
  const visible = templates.slice((adminPage - 1) * PAGE_SIZE, adminPage * PAGE_SIZE);
  const pagination = templates.length ? `<span class="page-summary">صفحة ${number(adminPage)} من ${number(pages)}</span><div class="page-buttons"><button type="button" data-admin-page="${adminPage - 1}" ${adminPage === 1 ? 'disabled' : ''} aria-label="الصفحة السابقة">‹</button>${Array.from({ length:pages }, (_, index) => `<button type="button" data-admin-page="${index + 1}" aria-label="صفحة ${number(index + 1)}" ${index + 1 === adminPage ? 'aria-current="page"' : ''}>${number(index + 1)}</button>`).join('')}<button type="button" data-admin-page="${adminPage + 1}" ${adminPage === pages ? 'disabled' : ''} aria-label="الصفحة التالية">›</button></div>` : '';
  $('#admin-pages-top').innerHTML = pagination;
  $('#admin-pages-bottom').innerHTML = pagination;
  $('#catalog-count').textContent = `${number(templates.length)} تصاميم في المعرض`;
  $('#admin-cards').innerHTML = templates.length ? visible.map(template => `<article class="admin-card">
    <div class="admin-card-preview" aria-hidden="true"><span>✦</span></div>
    <div class="admin-card-body"><strong>${escapeHTML(template.name)}</strong><small>${escapeHTML(CATEGORY_NAMES[template.category] || template.category)} · ${escapeHTML(template.id)}</small>
      <div class="admin-card-actions"><button type="button" data-edit="${escapeHTML(template.id)}">تعديل</button><a href="${escapeHTML(template.previewUrl)}" target="_blank" rel="noopener noreferrer">شاهد التصميم ↗</a><button type="button" class="danger" data-delete="${escapeHTML(template.id)}">حذف</button></div>
    </div></article>`).join('') : '<p>ماكو تصاميم حالياً. أضف أول تصميم من النموذج.</p>';
}
function newId(category) {
  const prefix = CATEGORY_CODES[category];
  const numbers = catalog.templates.filter(item => item.id.startsWith(`${prefix}-`)).map(item => Number(item.id.split('-')[1]) || 0);
  const next = Math.max(catalog.nextIds?.[category] || 1, Math.max(0, ...numbers) + 1);
  return `${prefix}-${String(next).padStart(3, '0')}`;
}
function resetForm() {
  $('#template-form').reset();
  $('#template-id').value = '';
  $('#editor-title').textContent = 'إضافة تصميم';
  $('#save-template').textContent = 'حفظ التصميم';
  sessionRemove(DRAFT_SESSION_KEY);
}
function editTemplate(id) {
  const template = catalog.templates.find(item => item.id === id);
  if (!template) return;
  resetForm();
  $('#template-id').value = template.id;
  $('#template-name').value = template.name;
  $('#template-english').value = template.englishName || '';
  $('#template-category').value = template.category;
  $('#template-url').value = template.previewUrl;
  $('#template-mockup').value = template.mockupUrl || '';
  $('#template-mockup-video').value = template.mockupVideoUrl || '';
  $('#template-description').value = template.description;
  document.querySelectorAll('[name="styles"]').forEach(input => { input.checked = template.styles.includes(input.value); });
  document.querySelectorAll('[name="features"]').forEach(input => { input.checked = template.features.includes(input.value); });
  $('#editor-title').textContent = `تعديل ${template.name}`;
  $('#save-template').textContent = 'حفظ التعديلات';
  saveDraft();
  $('#template-form').scrollIntoView({ behavior:'smooth', block:'start' });
}
function validatedUrl(value, kind) {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:') throw new Error(`${kind} لازم يبدأ بـ https://`);
  return url.href;
}
function ownedPreviewPath(template) {
  const prefix = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/previews/`;
  if (!template?.image?.startsWith(prefix)) return '';
  const file = template.image.slice(prefix.length);
  return new RegExp(`^${template.id.toLowerCase()}-\\d+\\.(png|jpg|webp)$`).test(file) ? `previews/${file}` : '';
}
async function removeUnusedPreview(template) {
  const path = ownedPreviewPath(template);
  if (!path || catalog.templates.some(item => item.image === template.image)) return;
  const file = await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=main`);
  await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method:'DELETE', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ message:`Remove unused preview for ${template.id}`, sha:file.sha, branch:'main' })
  });
}
async function saveCatalog(nextCatalog, message) {
  const latest = await readCatalog();
  if (latest.sha !== catalogSha) throw new Error('تغيّرت القائمة من مكان آخر. اضغط «تحديث القائمة» قبل الحفظ.');
  // روابط المستودعات القديمة ليست جزءاً من بيانات العرض أو من التصاميم الجديدة.
  nextCatalog = { ...nextCatalog, updatedAt:new Date().toISOString(), templates:nextCatalog.templates.map(({ repoUrl, ...template }) => template) };
  const bytes = new TextEncoder().encode(`${JSON.stringify(nextCatalog, null, 2)}\n`);
  const result = await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/catalog.json`, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ message, content:encodeBase64(bytes), sha:catalogSha, branch:'main' })
  });
  if (!result.content?.sha) throw new Error('GitHub ما أكّد حفظ التصميم. حدّث القائمة وتأكد قبل إعادة المحاولة.');
  catalog = nextCatalog;
  catalogSha = result.content.sha;
  adminPage = 1;
  renderCards();
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('inviteus-catalog');
    channel.postMessage('updated');
    channel.close();
  }
}

async function connect(candidate, resumed = false) {
  token = candidate;
  const profile = await api('user');
  if (profile.login?.toLowerCase() !== REPO_OWNER.toLowerCase()) {
    const error = new Error(`هذا الرمز لحساب ${profile.login || 'آخر'}؛ يحتاج حساب ${REPO_OWNER}.`);
    error.code = 'WRONG_ACCOUNT';
    throw error;
  }
  // ثبت الرمز بمجرد التحقق من الحساب؛ فشل قراءة القائمة المؤقت لا يعني انتهاء صلاحيته.
  sessionWrite(TOKEN_SESSION_KEY, candidate);
  const latest = await readCatalog();
  catalog = latest.data;
  catalogSha = latest.sha;
  adminPage = 1;
  $('#access-token').value = '';
  $('#connected-user').textContent = `متصل بحساب ${profile.login}`;
  $('#login-panel').hidden = true;
  $('#admin-workspace').hidden = false;
  renderCards();
  if (!restoreDraft()) resetForm();
  status(resumed ? 'رجعنا اللوحة والمسودة بعد إعادة تحميل الصفحة.' : 'اللوحة جاهزة.');
}
$('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const candidate = $('#access-token').value.trim();
  if (!candidate) return;
  status('نتأكد من صلاحية الرمز…');
  try { await connect(candidate); }
  catch (error) {
    token = '';
    if (error.status === 401 || error.code === 'WRONG_ACCOUNT') sessionRemove(TOKEN_SESSION_KEY);
    status(error.message, true);
  }
});
$('#template-form').addEventListener('input', saveDraft);
$('#template-form').addEventListener('change', saveDraft);
$('#template-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !catalog) return;
  setBusy(true);
  status('نحفظ التصميم…');
  try {
    const latest = await readCatalog();
    catalog = latest.data;
    catalogSha = latest.sha;
    const originalId = $('#template-id').value;
    const category = $('#template-category').value;
    if (!Object.hasOwn(CATEGORY_NAMES, category)) throw new Error('اختر قسماً صالحاً للتصميم.');
    const id = originalId || newId(category);
    const previewUrl = validatedUrl($('#template-url').value, 'رابط التصميم المنشور');
    const mockupValue = $('#template-mockup').value.trim();
    const mockupUrl = mockupValue ? validatedUrl(mockupValue, 'رابط عرض البطاقة') : '';
    const videoValue = $('#template-mockup-video').value.trim();
    const mockupVideoUrl = videoValue ? validatedUrl(videoValue, 'رابط فيديو المعاينة') : '';
    if (mockupVideoUrl && !/\.(mp4|webm)(?:\?|#|$)/i.test(mockupVideoUrl)) throw new Error('رابط فيديو المعاينة لازم يشير إلى ملف MP4 أو WebM مباشر.');
    const original = catalog.templates.find(item => item.id === originalId);
    if (originalId && !original) throw new Error('التصميم تغير أو انحذف من مكان آخر. حدّث القائمة قبل تعديل التصميم.');
    const template = {
      id, name:$('#template-name').value.trim(), englishName:$('#template-english').value.trim(), category,
      styles:[...document.querySelectorAll('[name="styles"]:checked')].map(input => input.value),
      description:$('#template-description').value.trim(),
      features:[...document.querySelectorAll('[name="features"]:checked')].map(input => input.value),
      previewUrl, ...(mockupUrl ? { mockupUrl } : {}), ...(mockupVideoUrl ? { mockupVideoUrl } : {}),
      ...(original?.previewPath && original.previewUrl === previewUrl ? { previewPath:original.previewPath } : {}),
      ...(original?.image ? { image:original.image } : {}),
      trending:original?.trending || false, newArrival:original?.newArrival ?? true
    };
    if (!template.name || !template.description) throw new Error('اكتب اسم التصميم وتفاصيله.');
    const templates = original ? catalog.templates.map(item => item.id === originalId ? template : item) : [...catalog.templates, template];
    const nextIds = original ? catalog.nextIds : { ...catalog.nextIds, [category]:Number(id.split('-')[1]) + 1 };
    await saveCatalog({ ...catalog, nextIds, templates }, `${original ? 'Update' : 'Add'} design ${id}`);
    resetForm();
    status(`انحفظ تصميم «${template.name}» بنجاح. افتح الموقع أو حدّثه حتى تشوفه.`);
    $('#admin-cards').scrollIntoView({ behavior:'smooth', block:'start' });
  } catch (error) {
    if (error.status === 401) {
      token = '';
      sessionRemove(TOKEN_SESSION_KEY);
      $('#login-panel').hidden = false;
      status('انتهت صلاحية رمز GitHub. أدخله مجدداً؛ تفاصيل التصميم محفوظة في هذا التبويب.', true);
      $('#login-panel').scrollIntoView({ behavior:'smooth', block:'start' });
    } else status(error.message, true);
  }
  finally { setBusy(false); }
});
$('#admin-cards').addEventListener('click', async event => {
  const edit = event.target.closest('[data-edit]');
  if (edit) { editTemplate(edit.dataset.edit); return; }
  const remove = event.target.closest('[data-delete]');
  if (!remove || busy) return;
  const template = catalog.templates.find(item => item.id === remove.dataset.delete);
  if (!template || !confirm(`تحذف «${template.name}» من معرض Inviteus؟`)) return;
  setBusy(true);
  status('نحذف البطاقة من المعرض…');
  try {
    await saveCatalog({ ...catalog, templates:catalog.templates.filter(item => item.id !== template.id) }, `Remove design ${template.id}`);
    if ($('#template-id').value === template.id) resetForm();
    try { await removeUnusedPreview(template); }
    catch { status(`انحذفت البطاقة، لكن تعذّر تنظيف صورة عرضها.`, true); return; }
    status(`انحذفت بطاقة «${template.name}» من المعرض.`);
  } catch (error) { status(error.message, true); }
  finally { setBusy(false); }
});
document.querySelectorAll('#admin-pages-top, #admin-pages-bottom').forEach(nav => nav.addEventListener('click', event => {
  const button = event.target.closest('[data-admin-page]');
  if (!button || !catalog) return;
  const page = Number(button.dataset.adminPage);
  if (!Number.isInteger(page) || page < 1 || page > Math.ceil(catalog.templates.length / PAGE_SIZE)) return;
  adminPage = page;
  renderCards();
  $('#admin-pages-top').scrollIntoView({ behavior:'smooth', block:'start' });
}));
$('#new-template').addEventListener('click', () => { resetForm(); $('#template-form').scrollIntoView({ behavior:'smooth', block:'start' }); });
$('#cancel-edit').addEventListener('click', resetForm);
$('#reload-catalog').addEventListener('click', async () => {
  if (busy) return;
  setBusy(true);
  try { const latest = await readCatalog(); catalog = latest.data; catalogSha = latest.sha; renderCards(); resetForm(); status('القائمة محدثة.'); }
  catch (error) { status(error.message, true); }
  finally { setBusy(false); }
});
$('#logout').addEventListener('click', () => {
  token = ''; catalog = null; catalogSha = '';
  sessionRemove(TOKEN_SESSION_KEY);
  sessionRemove(DRAFT_SESSION_KEY);
  $('#admin-workspace').hidden = true;
  $('#login-panel').hidden = false;
  $('#login-form').reset();
  status('طلعت من لوحة الإدارة.');
});
styleChoices();
const rememberedToken = sessionRead(TOKEN_SESSION_KEY);
if (rememberedToken) {
  status('نرجّع جلسة لوحة الإدارة…');
  connect(rememberedToken, true).catch(error => {
    token = '';
    if (error.status === 401 || error.code === 'WRONG_ACCOUNT') sessionRemove(TOKEN_SESSION_KEY);
    status(`تعذّر استرجاع الجلسة: ${error.message} ${error.status === 401 || error.code === 'WRONG_ACCOUNT' ? 'أدخل رمزاً صالحاً.' : 'حدّث الصفحة بعد قليل؛ الرمز والمسودة محفوظان بهذا التبويب.'}`, true);
  });
}
