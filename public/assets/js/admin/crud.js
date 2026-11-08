/**
 * Generic admin manager: list + search + add / edit / delete for one Firestore collection
 * খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া আদর্শ ফাজিল (ডিগ্রি) মাদ্রাসা
 *
 * Field types: text | textarea | number | url | email | select | checkbox | date | list
 *   - list:   string array, edited one item per line
 *   - upload: 'image' | 'raw' on a url field adds a Cloudinary upload button
 *             (shown when Cloudinary is configured in Admin → Settings)
 */

import {
  db, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp
} from '../firebase/config.js';
import { showAlert } from '../components/alert.js';
import { esc } from '../utils/escape.js';
import { formatBengaliDate, toBengaliNumber, toMillis } from '../utils/date.js';
import { getUploadConfig, uploadToCloudinary } from './upload.js';
import { SITE } from '../site.js';

const ICON_EDIT = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m16.9 4.1 3 3L8 19H5v-3L16.9 4.1z"/></svg>';
const ICON_DELETE = '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';

function toDateInput(value) {
  const ms = toMillis(value);
  if (!ms) return '';
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fieldHtml(f, value) {
  const id = `f-${f.name}`;
  const req = f.required ? 'required' : '';
  const ph = f.placeholder ? `placeholder="${esc(f.placeholder)}"` : '';
  const span = f.full || ['textarea', 'list'].includes(f.type) ? 'sm:col-span-2' : '';
  const label = `<span class="field-label">${f.label}${f.required ? ' *' : ''}</span>`;
  const help = f.help ? `<span class="mt-1 block text-xs text-stone-400">${f.help}</span>` : '';

  switch (f.type) {
    case 'photo':
      return `<div class="${span || 'sm:col-span-2'}">${label}${value
        ? `<img src="${esc(value)}" alt="" class="h-36 w-28 rounded-lg border border-stone-200 object-cover" />`
        : '<p class="text-sm text-stone-400">ছবি নেই</p>'}</div>`;
    case 'heading':
      return `<h3 class="sm:col-span-2 border-t border-stone-100 pt-4 text-sm font-semibold text-brand-800">${f.label}</h3>`;
    case 'textarea':
      return `<label class="block ${span}">${label}<textarea id="${id}" name="${f.name}" rows="${f.rows || 5}" class="field" ${req} ${ph}>${esc(value ?? '')}</textarea>${help}</label>`;
    case 'list':
      return `<label class="block ${span}">${label}<textarea id="${id}" name="${f.name}" rows="4" class="field" ${ph}>${esc(Array.isArray(value) ? value.join('\n') : '')}</textarea><span class="mt-1 block text-xs text-stone-400">প্রতি লাইনে একটি করে লিখুন</span></label>`;
    case 'select':
      return `<label class="block ${span}">${label}<select id="${id}" name="${f.name}" class="field" ${req}>
        ${f.required ? '' : '<option value="">—</option>'}
        ${f.options.map(o => `<option value="${esc(o.value)}" ${String(value ?? f.default ?? '') === String(o.value) ? 'selected' : ''}>${o.label}</option>`).join('')}
      </select>${help}</label>`;
    case 'checkbox':
      return `<label class="flex items-center gap-3 ${span} sm:col-span-2 rounded-lg border border-stone-200 px-4 py-3">
        <input type="checkbox" id="${id}" name="${f.name}" class="h-4 w-4 accent-brand-700" ${(value ?? f.default) ? 'checked' : ''} />
        <span class="text-sm text-stone-700">${f.label}</span></label>`;
    case 'date':
      return `<label class="block ${span}">${label}<input type="date" id="${id}" name="${f.name}" class="field" value="${toDateInput(value)}" ${req} />${help}</label>`;
    case 'number':
      return `<label class="block ${span}">${label}<input type="number" id="${id}" name="${f.name}" class="field" value="${esc(value ?? f.default ?? '')}" ${req} ${ph} />${help}</label>`;
    default: {
      const type = ['url', 'email'].includes(f.type) ? f.type : 'text';
      const upload = f.upload ? `<button type="button" data-upload="${f.name}" data-kind="${f.upload}" class="btn btn-outline hidden flex-shrink-0 px-3 text-xs">আপলোড</button>` : '';
      const preview = f.upload === 'image' ? `<img data-preview="${f.name}" src="${esc(value || '')}" alt="" class="mt-2 h-20 w-20 rounded-lg border border-stone-200 object-cover ${value ? '' : 'hidden'}" />` : '';
      return `<label class="block ${span}">${label}<span class="flex gap-2"><input type="${type}" id="${id}" name="${f.name}" class="field" value="${esc(value ?? '')}" maxlength="${f.maxlength || 1000}" ${req} ${ph} />${upload}</span>${help}${preview}</label>`;
    }
  }
}

function readForm(form, fields) {
  const data = {};
  for (const f of fields) {
    if (f.type === 'photo' || f.type === 'heading') continue;
    const el = form.elements[f.name];
    if (!el) continue;
    if (f.type === 'checkbox') data[f.name] = el.checked;
    else if (f.type === 'number') data[f.name] = el.value === '' ? 0 : Number(el.value);
    else if (f.type === 'list') data[f.name] = el.value.split('\n').map(s => s.trim()).filter(Boolean);
    else if (f.type === 'date') data[f.name] = el.value ? new Date(`${el.value}T00:00:00`) : null;
    else data[f.name] = el.value.trim();
  }
  return data;
}

/**
 * @param {object} cfg
 * @param {string} cfg.collection
 * @param {string} cfg.title
 * @param {string} cfg.subtitle
 * @param {string} cfg.itemLabel           e.g. 'নোটিশ'
 * @param {Array}  cfg.fields
 * @param {(item)=>string} cfg.primary    main line in the list (escaped HTML)
 * @param {(item)=>string} [cfg.secondary] small meta line (escaped HTML)
 * @param {string} [cfg.thumbField]       image field shown as a thumbnail
 * @param {string} [cfg.sortField]        default 'createdAt'
 * @param {'asc'|'desc'} [cfg.sortDir]    default 'desc'
 * @param {boolean} [cfg.allowCreate=true]
 * @param {(item)=>string} [cfg.rowLink]   optional extra link per row (e.g. print view)
 * @param {string[]} [cfg.searchFields]
 * @param {(data, isNew)=>object} [cfg.beforeSave]
 */
export function mountCrud(cfg) {
  const root = document.getElementById('crud-root');
  const {
    fields, itemLabel = 'তথ্য', sortField = 'createdAt', sortDir = 'desc',
    allowCreate = true, searchFields = ['title', 'name']
  } = cfg;

  let items = [];
  let term = '';
  let editing = null; // null = closed, {} = new, item = edit

  root.innerHTML = `
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-brand-900">${cfg.title}</h1>
        <p class="mt-1 text-sm text-stone-500">${cfg.subtitle || ''}</p>
      </div>
      ${allowCreate ? `<button type="button" id="crud-add" class="btn btn-primary">+ নতুন ${itemLabel}</button>` : ''}
    </div>

    <div class="card">
      <div class="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input type="search" id="crud-search" class="field sm:max-w-xs" placeholder="খুঁজুন..." aria-label="খুঁজুন" />
        <p class="text-xs text-stone-500">মোট <span id="crud-count" class="font-semibold text-brand-800">০</span>টি</p>
      </div>
      <div id="crud-list" class="divide-y divide-stone-100">
        <p class="py-12 text-center text-sm text-stone-400">লোড হচ্ছে...</p>
      </div>
    </div>

    <dialog id="crud-dialog" class="m-auto w-[min(42rem,calc(100%-2rem))] rounded-2xl border border-stone-200 p-0 shadow-2xl backdrop:bg-stone-900/40">
      <form id="crud-form" method="dialog" class="flex max-h-[90vh] flex-col">
        <div class="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 id="crud-form-title" class="text-lg font-semibold text-brand-900"></h2>
          <button type="button" data-close class="h-9 w-9 rounded-lg text-stone-400 hover:bg-stone-100" aria-label="বন্ধ করুন">✕</button>
        </div>
        <div id="crud-fields" class="grid flex-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2"></div>
        <div class="flex justify-end gap-2 border-t border-stone-100 px-6 py-4">
          <button type="button" data-close class="btn btn-outline">বাতিল</button>
          <button type="submit" id="crud-save" class="btn btn-primary">সংরক্ষণ</button>
        </div>
      </form>
    </dialog>
  `;

  const list = document.getElementById('crud-list');
  const dialog = document.getElementById('crud-dialog');
  const form = document.getElementById('crud-form');
  const saveBtn = document.getElementById('crud-save');

  async function load() {
    try {
      const snap = await getDocs(collection(db, cfg.collection));
      items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => {
        const av = a[sortField], bv = b[sortField];
        const cmp = typeof av === 'number' || typeof bv === 'number'
          ? (av ?? 0) - (bv ?? 0)
          : toMillis(av) - toMillis(bv);
        return sortDir === 'asc' ? cmp : -cmp;
      });
      render();
    } catch (e) {
      list.innerHTML = `<p class="px-5 py-10 text-center text-sm text-rose-700">তথ্য লোড করা যায়নি: ${esc(e.message)}<br><span class="text-stone-500">Firestore rules ডেপ্লয় করা হয়েছে কি না দেখুন।</span></p>`;
    }
  }

  function render() {
    const visible = items.filter(it => !term || searchFields.some(f => String(it[f] || '').toLowerCase().includes(term)));
    document.getElementById('crud-count').textContent = toBengaliNumber(visible.length);

    if (visible.length === 0) {
      list.innerHTML = `<div class="px-5 py-14 text-center">
        <p class="text-sm text-stone-500">${items.length ? 'কিছু পাওয়া যায়নি।' : `এখনও কোনো ${itemLabel} যুক্ত করা হয়নি।`}</p>
        ${!items.length && allowCreate ? `<button type="button" data-add class="btn btn-outline mt-4">প্রথম ${itemLabel} যুক্ত করুন</button>` : ''}
      </div>`;
      list.querySelector('[data-add]')?.addEventListener('click', () => open({}));
      return;
    }

    list.innerHTML = visible.map(it => `
      <div class="flex items-center gap-4 px-5 py-3.5">
        ${cfg.thumbField ? `<img src="${esc(it[cfg.thumbField] || SITE.logoUrl)}" alt="" class="h-11 w-11 flex-shrink-0 rounded-lg border border-stone-200 bg-stone-50 object-cover" loading="lazy" />` : ''}
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium text-stone-800">${cfg.primary(it)}</p>
          ${cfg.secondary ? `<p class="mt-0.5 truncate text-xs text-stone-500">${cfg.secondary(it)}</p>` : ''}
        </div>
        <div class="flex flex-shrink-0 gap-1">
          ${cfg.rowLink ? `<a href="${cfg.rowLink(it)}" target="_blank" rel="noopener" class="inline-flex h-9 items-center rounded-lg px-2.5 text-xs font-medium text-stone-500 hover:bg-brand-50 hover:text-brand-700">${cfg.rowLinkLabel || 'দেখুন'}</a>` : ''}
          <button type="button" data-edit="${esc(it.id)}" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-brand-50 hover:text-brand-700" title="সম্পাদনা" aria-label="সম্পাদনা">${ICON_EDIT}</button>
          <button type="button" data-delete="${esc(it.id)}" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-700" title="মুছুন" aria-label="মুছুন">${ICON_DELETE}</button>
        </div>
      </div>
    `).join('');
  }

  async function open(item) {
    editing = item;
    const isNew = !item.id;
    document.getElementById('crud-form-title').textContent = isNew ? `নতুন ${itemLabel}` : `${itemLabel} সম্পাদনা`;
    document.getElementById('crud-fields').innerHTML = fields.map(f => fieldHtml(f, isNew ? f.default : item[f.name])).join('');
    dialog.showModal();

    // Cloudinary upload buttons
    const uploadCfg = await getUploadConfig();
    form.querySelectorAll('[data-upload]').forEach(btn => {
      if (!uploadCfg) return;
      btn.classList.remove('hidden');
      btn.addEventListener('click', () => {
        const picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = btn.dataset.kind === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,image/*';
        picker.onchange = async () => {
          const file = picker.files?.[0];
          if (!file) return;
          btn.disabled = true;
          btn.textContent = '...';
          try {
            const url = await uploadToCloudinary(file, btn.dataset.kind, uploadCfg);
            form.elements[btn.dataset.upload].value = url;
            const prev = form.querySelector(`[data-preview="${btn.dataset.upload}"]`);
            if (prev) { prev.src = url; prev.classList.remove('hidden'); }
            showAlert({ type: 'success', message: 'ফাইল আপলোড হয়েছে।' });
          } catch (e) {
            showAlert({ type: 'error', message: 'আপলোড ব্যর্থ: ' + e.message });
          } finally {
            btn.disabled = false;
            btn.textContent = 'আপলোড';
          }
        };
        picker.click();
      });
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const isNew = !editing?.id;
    let data = readForm(form, fields);
    if (cfg.beforeSave) data = cfg.beforeSave(data, isNew, editing) || data;
    data.updatedAt = serverTimestamp();
    if (isNew) data.createdAt = serverTimestamp();

    saveBtn.disabled = true;
    saveBtn.textContent = 'সংরক্ষণ হচ্ছে...';
    try {
      if (isNew) await addDoc(collection(db, cfg.collection), data);
      else await updateDoc(doc(db, cfg.collection, editing.id), data);
      dialog.close();
      showAlert({ type: 'success', message: `${itemLabel} সংরক্ষিত হয়েছে।` });
      await load();
    } catch (err) {
      showAlert({ type: 'error', message: 'সংরক্ষণ ব্যর্থ: ' + err.message });
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'সংরক্ষণ';
    }
  });

  dialog.addEventListener('click', e => {
    if (e.target.closest('[data-close]') || e.target === dialog) dialog.close();
  });

  list.addEventListener('click', async e => {
    const editId = e.target.closest('[data-edit]')?.dataset.edit;
    const delId = e.target.closest('[data-delete]')?.dataset.delete;
    if (editId) open(items.find(i => i.id === editId));
    if (delId) {
      const it = items.find(i => i.id === delId);
      if (!confirm(`"${it?.title || it?.name || it?.studentName || itemLabel}" স্থায়ীভাবে মুছে ফেলবেন?`)) return;
      try {
        await deleteDoc(doc(db, cfg.collection, delId));
        showAlert({ type: 'success', message: 'মুছে ফেলা হয়েছে।' });
        await load();
      } catch (err) {
        showAlert({ type: 'error', message: 'মুছতে ব্যর্থ: ' + err.message });
      }
    }
  });

  document.getElementById('crud-add')?.addEventListener('click', () => open({}));
  document.getElementById('crud-search').addEventListener('input', e => {
    term = e.target.value.trim().toLowerCase();
    render();
  });

  load();
}

/** Small helpers for list rows */
export const fmt = {
  date: v => (v ? formatBengaliDate(v) : ''),
  status: published => published
    ? '<span class="text-brand-700">● প্রকাশিত</span>'
    : '<span class="text-stone-400">○ খসড়া</span>'
};
