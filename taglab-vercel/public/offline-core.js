/* Pure helpers for the Week 3 offline conversion lab. No network requests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TagLabOffline = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function text(value) { return String(value == null ? '' : value).trim(); }

  function syntheticGclid(input) {
    const value = text(input);
    if (!/^TEST_GCLID_[A-Z0-9_-]{8,}$/i.test(value)) {
      throw Error('Use um GCLID fictício iniciado por TEST_GCLID_.');
    }
    return value;
  }

  function positiveMoney(input) {
    const value = Number(input);
    if (!Number.isFinite(value) || value <= 0) throw Error('Informe um valor de conversão maior que zero.');
    const rounded = Math.round(value * 100) / 100;
    if (rounded <= 0) throw Error('Informe um valor de pelo menos R$ 0,01.');
    return rounded;
  }

  function transactionId(input) {
    const value = text(input);
    if (!/^OFFLINE-[A-Z0-9-]{8,}$/i.test(value)) throw Error('transaction_id de teste inválido.');
    return value;
  }

  function timestamp(input) {
    const date = input instanceof Date ? input : new Date(input || Date.now());
    if (Number.isNaN(date.getTime())) throw Error('Data/hora de conversão inválida.');
    return date.toISOString();
  }

  function userIdentifiers(prepared) {
    const hashed = prepared && prepared.hashed ? prepared.hashed : {};
    const ids = [];
    for (const [source, target] of [['sha256_email_address','emailAddress'], ['sha256_phone_number','phoneNumber']]) {
      if (!hashed[source]) continue;
      if (typeof hashed[source] !== 'string' || !/^[a-f0-9]{64}$/i.test(hashed[source])) throw Error('Identificador ECL inválido: prepare um SHA-256 hexadecimal de 64 caracteres.');
      ids.push({[target]:hashed[source].toUpperCase()});
    }
    return ids;
  }

  function buildEvent(options) {
    const mode = options && options.mode;
    if (!['oci','ecl'].includes(mode)) throw Error('Escolha OCI ou ECL.');
    const event = {
      conversionValue: positiveMoney(options.conversionValue),
      currency: 'BRL',
      eventTimestamp: timestamp(options.eventTimestamp),
      transactionId: transactionId(options.transactionId),
      eventSource: 'WEB'
    };

    const gclid = text(options.gclid);
    if (gclid) event.adIdentifiers = {gclid: syntheticGclid(gclid)};

    if (mode === 'oci') {
      if (!event.adIdentifiers) throw Error('No laboratório OCI, informe o GCLID fictício capturado no lead.');
      return event;
    }

    if (options.consent?.ad_user_data !== 'granted') throw Error('ECL bloqueado: ad_user_data está negado. Revise o consentimento e tente novamente.');
    const ids = userIdentifiers(options.prepared);
    if (!ids.length) throw Error('ECL precisa de pelo menos um identificador de usuário preparado.');
    event.userData = {userIdentifiers: ids};
    return event;
  }

  function consentValue(value) {
    return value === 'granted' ? 'CONSENT_GRANTED' : 'CONSENT_DENIED';
  }

  function numericId(input, label) {
    const value = text(input);
    if (!/^\d{6,20}$/.test(value)) throw Error(label + ' deve conter somente números.');
    return value;
  }

  function buildRequest(options) {
    if (!options || !options.event) throw Error('Gere o evento antes da requisição.');
    const destination = {
      operatingAccount: {
        accountType: 'GOOGLE_ADS',
        accountId: numericId(options.customerId, 'Customer ID')
      },
      productDestinationId: numericId(options.conversionActionId, 'Conversion Action ID')
    };
    const request = {
      destinations: [destination],
      events: [structuredClone(options.event)],
      consent: {
        adUserData: consentValue(options.consent && options.consent.ad_user_data),
        adPersonalization: consentValue(options.consent && options.consent.ad_personalization)
      },
      validateOnly: true
    };
    if (options.event.userData) {
      if (request.consent.adUserData !== 'CONSENT_GRANTED') throw Error('ECL bloqueado: ad_user_data precisa estar concedido para incluir UserData.');
      request.encoding = 'HEX';
    }
    return request;
  }

  function localValidation(request) {
    if (!request || !Array.isArray(request.events) || request.events.length !== 1) {
      throw Error('A prévia deve conter exatamente um evento.');
    }
    const event = request.events[0];
    const hasAdId = !!(event.adIdentifiers && (event.adIdentifiers.gclid || event.adIdentifiers.gbraid || event.adIdentifiers.wbraid));
    const hasUserData = !!(event.userData && Array.isArray(event.userData.userIdentifiers) && event.userData.userIdentifiers.length);
    if (!hasAdId && !hasUserData) throw Error('Nenhum identificador de atribuição foi incluído.');
    if (!event.eventTimestamp || !event.eventSource) throw Error('Campos obrigatórios do evento estão ausentes.');
    if (hasUserData && request.consent?.adUserData !== 'CONSENT_GRANTED') throw Error('UserData bloqueado pelo consentimento atual.');
    if (hasUserData && request.encoding !== 'HEX') throw Error('Uploads com UserData precisam indicar o encoding.');
    return {valid:true, matchKeys:{gclid:hasAdId,userData:hasUserData}, transactionId:event.transactionId};
  }

  return Object.freeze({syntheticGclid,positiveMoney,transactionId,timestamp,userIdentifiers,buildEvent,buildRequest,localValidation});
});
