/* Pure UPD preparation and dispatch rules; no automatic collection. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TagLabUPD = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function normalizeEmail(input) {
    let email = String(input || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('E-mail inválido. Use um endereço fictício @example.com.');
    const parts = email.split('@');
    if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') parts[0] = parts[0].replace(/\./g, '');
    return parts.join('@');
  }
  function normalizePhone(input) {
    const raw = String(input || '').trim();
    if (!raw) return '';
    if (!/^[+\d\s().-]+$/.test(raw)) throw Error('Telefone contém caracteres inválidos.');
    const phone = raw.replace(/[\s().-]/g, '');
    if (!/^\+[1-9]\d{10,14}$/.test(phone)) throw Error('Use telefone E.164 com + e código do país. Exemplo fictício: +1 202 555 0123.');
    return phone;
  }
  function validateSynthetic(email, phone) {
    if (!/^[a-z0-9._+-]+@(example\.(com|org|net)|test\.invalid)$/.test(email)) throw Error('Este laboratório aceita apenas e-mails em example.com, example.org, example.net ou test.invalid.');
    if (phone && !/^\+120255501\d{2}$/.test(phone)) throw Error('Use um telefone fictício entre +12025550100 e +12025550199, ou deixe vazio.');
  }
  async function sha256(value) {
    if (!globalThis.crypto?.subtle) throw Error('SHA-256 exige HTTPS ou localhost e um navegador compatível.');
    const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  async function prepare(emailInput, phoneInput) {
    const email = normalizeEmail(emailInput), phone = normalizePhone(phoneInput);
    validateSynthetic(email, phone);
    const normalized = {email};
    const hashed = {sha256_email_address: await sha256(email)};
    if (phone) { normalized.phone_number = phone; hashed.sha256_phone_number = await sha256(phone); }
    return {normalized, hashed};
  }
  function consentAllowed(consent) {
    return consent.analytics_storage === 'granted' && consent.ad_user_data === 'granted';
  }
  function payload({kind, prepared, format, consent, runId, transactionId}) {
    if (!['lead', 'purchase'].includes(kind)) throw Error('Cenário inválido.');
    if (!['raw', 'hashed'].includes(format)) throw Error('Formato inválido.');
    const allowed = consentAllowed(consent);
    const result = {
      event: kind === 'lead' ? 'lab_upd_lead' : 'lab_ec_purchase',
      lab_case: kind, lab_run_id: runId, lab_data_format: format,
      lab_upd_allowed: allowed, lab_user_data: allowed ? structuredClone(format === 'hashed' ? prepared.hashed : prepared.normalized) : null,
      lab_consent: {...consent}, debug_mode: true,
      currency: 'BRL', value: kind === 'lead' ? 0 : 49.9
    };
    if (kind === 'purchase') {
      if (!transactionId || !transactionId.startsWith('LAB-')) throw Error('Transação de teste inválida.');
      result.transaction_id = transactionId;
      result.ecommerce = {transaction_id:transactionId, currency:'BRL',value:49.9, items:[{item_id:'LAB-EC-001',item_name:'Produto fictício EC',price:49.9,quantity:1}]};
    }
    return result;
  }
  function dispatch(dataLayer, data) {
    // Clear prior object before the event; clear again after GTM processes its message.
    dataLayer.push({lab_user_data:null,lab_consent:null,ecommerce:null});
    try { dataLayer.push(structuredClone(data)); }
    finally { dataLayer.push({lab_user_data:null,lab_consent:null,ecommerce:null}); }
  }
  return Object.freeze({normalizeEmail,normalizePhone,validateSynthetic,sha256,prepare,consentAllowed,payload,dispatch});
});
