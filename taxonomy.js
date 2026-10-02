'use strict';

const InviteusTaxonomy = (() => {
  const defaults = [
    { id:'invitations', name:'تصميم الدعوات', categories:[
      {id:'engagement',name:'خطوبة',code:'ENG',symbol:'◇'},
      {id:'henna',name:'حنة',code:'HEN',symbol:'❋'},
      {id:'wedding',name:'زفاف',code:'WED',symbol:'∞'},
      {id:'conferences',name:'مؤتمرات',code:'CON',symbol:'▤'},
      {id:'openings',name:'افتتاحيات',code:'OPN',symbol:'⌑'}
    ]},
    { id:'commerce', name:'التجارة الإلكترونية', categories:[
      {id:'stores',name:'متاجر',code:'STR',symbol:'▥'},
      {id:'food-menus',name:'قوائم الطعام',code:'FOD',symbol:'☷'},
      {id:'drink-menus',name:'قوائم المشروبات',code:'DRK',symbol:'♧'}
    ]}
  ];
  function read(catalog = {}) {
    const groups = catalog.groups === undefined ? defaults : catalog.groups;
    const groupIds = new Set(), categoryIds = new Set(), codes = new Set();
    const validId = value => typeof value === 'string' && /^[a-z][a-z0-9-]{0,59}$/.test(value);
    const validName = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 80;
    if (!Array.isArray(groups) || !groups.length) throw new Error('قائمة الأصناف غير صالحة.');
    const result = groups.map(group => {
      if (!group || !validId(group.id) || groupIds.has(group.id) || !validName(group.name) || !Array.isArray(group.categories)) throw new Error('بيانات الصنف غير صالحة.');
      groupIds.add(group.id);
      return { id:group.id, name:group.name.trim(), categories:group.categories.map(category => {
        if (!category || !validId(category.id) || categoryIds.has(category.id) || !validName(category.name) || !/^[A-Z]{3}$/.test(category.code) || codes.has(category.code)) throw new Error('بيانات القسم غير صالحة.');
        categoryIds.add(category.id); codes.add(category.code);
        return { id:category.id, name:category.name.trim(), code:category.code, symbol:typeof category.symbol === 'string' ? category.symbol.slice(0,8) : '◇' };
      }) };
    });
    if (Array.isArray(catalog.templates) && catalog.templates.some(template => !categoryIds.has(template.category))) throw new Error('يوجد تصميم مرتبط بقسم غير موجود.');
    return result;
  }
  function nextCode(groups) {
    const used = new Set(groups.flatMap(group => group.categories.map(category => category.code)));
    const ids = new Set(groups.flatMap(group => group.categories.map(category => category.id)));
    for (let n = 0; n < 26 ** 3; n++) {
      const code = String.fromCharCode(65 + Math.floor(n / 676), 65 + Math.floor(n / 26) % 26, 65 + n % 26);
      if (!used.has(code) && !ids.has(`category-${code.toLowerCase()}`)) return code;
    }
    throw new Error('وصلت إلى الحد الأقصى للأقسام.');
  }
  return { read, nextCode };
})();
