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
  const event=core.buildEvent({mode:'ecl',consent:{ad_user_data:'granted'},gclid:'',prepared,conversionValue:250,transactionId:'OFFLINE-ECL12345678',eventTimestamp:'2026-10-15T12:00:00Z'});
  assert.equal(event.userData.userIdentifiers.length,2);
  assert.equal(event.userData.userIdentifiers[0].emailAddress,'A'.repeat(64));
  assert.equal(event.adIdentifiers,undefined);
});

test('OCI rejects missing GCLID',()=>{
  assert.throws(()=>core.buildEvent({mode:'oci',gclid:'',conversionValue:10,transactionId:'OFFLINE-NOCLICK1234'}),/GCLID/);
});

test('Data Manager preview is validateOnly and uses HEX when UserData exists',()=>{
  const event=core.buildEvent({mode:'ecl',consent:{ad_user_data:'granted'},prepared,conversionValue:99.9,transactionId:'OFFLINE-REQUEST1234',eventTimestamp:'2026-10-15T12:00:00Z'});
  const request=core.buildRequest({event,customerId:'1234567890',conversionActionId:'987654321',consent:{ad_user_data:'granted',ad_personalization:'denied'}});
  assert.equal(request.validateOnly,true);
  assert.equal(request.encoding,'HEX');
  assert.equal(request.destinations[0].operatingAccount.accountType,'GOOGLE_ADS');
  assert.equal(request.consent.adUserData,'CONSENT_GRANTED');
  assert.deepEqual(core.localValidation(request).matchKeys,{gclid:false,userData:true});
});

test('ECL core rejects denied or missing consent and malformed hashes',()=>{
 const args={mode:'ecl',prepared,conversionValue:10,transactionId:'OFFLINE-TEST123456'};
 assert.throws(()=>core.buildEvent(args),/ad_user_data/);
 assert.throws(()=>core.buildEvent({...args,consent:{ad_user_data:'denied'}}),/ad_user_data/);
 assert.throws(()=>core.buildEvent({...args,consent:{ad_user_data:'granted'},prepared:{hashed:{sha256_email_address:'not-a-hash'}}}),/SHA-256/);
 const event=core.buildEvent({...args,consent:{ad_user_data:'granted'}});
 assert.throws(()=>core.buildRequest({event,customerId:'1234567890',conversionActionId:'987654321',consent:{ad_user_data:'denied'}}),/ad_user_data/);
});

test('money rejects fractions that round to zero and non-finite values',()=>{
 for(const value of [0,-10,0.001,NaN,Infinity,'invalid'])assert.throws(()=>core.positiveMoney(value));
 assert.equal(core.positiveMoney('0.01'),0.01);
});
