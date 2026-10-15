const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../public/offline-core.js');

const prepared={hashed:{
  sha256_email_address:'a'.repeat(64),
  sha256_phone_number:'b'.repeat(64)
}};

test('OCI requires and keeps a synthetic GCLID',()=>{
  const event=core.buildEvent({mode:'oci',gclid:'TEST_GCLID_ABCDEF123456',conversionValue:120.5,transactionId:'OFFLINE-ABCDEF123456',eventTimestamp:'2026-10-15T12:00:00Z'});
  assert.equal(event.adIdentifiers.gclid,'TEST_GCLID_ABCDEF123456');
  assert.equal(event.userData,undefined);
  assert.equal(event.eventSource,'WEB');
});

test('ECL builds hashed user identifiers and can work without GCLID',()=>{
  const event=core.buildEvent({mode:'ecl',gclid:'',prepared,conversionValue:250,transactionId:'OFFLINE-ECL12345678',eventTimestamp:'2026-10-15T12:00:00Z'});
  assert.equal(event.userData.userIdentifiers.length,2);
  assert.equal(event.userData.userIdentifiers[0].emailAddress,'A'.repeat(64));
  assert.equal(event.adIdentifiers,undefined);
});

test('OCI rejects missing GCLID',()=>{
  assert.throws(()=>core.buildEvent({mode:'oci',gclid:'',conversionValue:10,transactionId:'OFFLINE-NOCLICK1234'}),/GCLID/);
});

test('Data Manager preview is validateOnly and uses HEX when UserData exists',()=>{
  const event=core.buildEvent({mode:'ecl',prepared,conversionValue:99.9,transactionId:'OFFLINE-REQUEST1234',eventTimestamp:'2026-10-15T12:00:00Z'});
  const request=core.buildRequest({event,customerId:'1234567890',conversionActionId:'987654321',consent:{ad_user_data:'granted',ad_personalization:'denied'}});
  assert.equal(request.validateOnly,true);
  assert.equal(request.encoding,'HEX');
  assert.equal(request.destinations[0].operatingAccount.accountType,'GOOGLE_ADS');
  assert.equal(request.consent.adUserData,'CONSENT_GRANTED');
  assert.deepEqual(core.localValidation(request).matchKeys,{gclid:false,userData:true});
});
