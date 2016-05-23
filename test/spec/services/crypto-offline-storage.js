'use strict';

describe('Service: CryptoOfflineStorage', function () {

  // load the service's module
  beforeEach(module('keepr.ngOfflineModel'));

  // instantiate service
  var CryptoOfflineStorage,
    secret,
    storageType,
    key,
    dataString;


  beforeEach(inject(function (_CryptoOfflineStorage_) {
    CryptoOfflineStorage = _CryptoOfflineStorage_;
    secret = 'secret';
    key = 'key';
    dataString = { testValue: 'test'};
  }));

  describe('using "localStorage"', function(){

    beforeEach(function () {
      storageType = 'localStorage';
    });

    describe('init', function(){
      it('service should be initialyzeds with internal variables configurateds', function () {
        CryptoOfflineStorage.init({secret: secret});

        expect(CryptoOfflineStorage.JSON !== null).toBe(true);
        expect(CryptoOfflineStorage.storageType === 'localStorage').toBe(true);
        expect(CryptoOfflineStorage.CryptoJS !== null).toBe(true);
        expect(CryptoOfflineStorage.secret !== '').toBe(true);
      });
    });

    describe('encrypt', function(){
      it('should returns a string with informations', function () {
        expect(typeof CryptoOfflineStorage.encrypt(dataString, secret) === 'string').toBe(true);
      });
    });

    describe('decrypt', function(){
      it('should returns a json object decrypted', function () {
        expect(CryptoOfflineStorage.decrypt(JSON.stringify(dataString), secret)).toEqual(dataString);
      });
    });

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(CryptoOfflineStorage.set(key, dataString)).toBe(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(CryptoOfflineStorage.set(key)).toBe(false);
      });
    });

    describe('get', function(){
      it('should returns the original json object', function () {
        CryptoOfflineStorage.set(key, dataString);
        expect(CryptoOfflineStorage.get(key)).toEqual(dataString);
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        CryptoOfflineStorage.set(key, dataString);
        expect(CryptoOfflineStorage.remove(key)).toBe(true);
      });
    });
  });

  describe('using "sessionStorage"', function(){

    beforeEach(function () {
      storageType = 'sessionStorage';
    });

    describe('init', function(){
      it('service should be initialyzeds with internal variables configurateds', function () {
        CryptoOfflineStorage.init({secret: secret, storageType: storageType});

        expect(CryptoOfflineStorage.JSON !== null).toBe(true);
        expect(CryptoOfflineStorage.storageType === storageType).toBe(true);
        expect(CryptoOfflineStorage.CryptoJS !== null).toBe(true);
        expect(CryptoOfflineStorage.secret !== '').toBe(true);
      });
    });

    describe('encrypt', function(){
      it('should returns a string with informations', function () {
        expect(typeof CryptoOfflineStorage.encrypt(dataString, secret) === 'string').toBe(true);
      });
    });

    describe('decrypt', function(){
      it('should returns a json object decrypted', function () {
        expect(CryptoOfflineStorage.decrypt(JSON.stringify(dataString), secret)).toEqual(dataString);
      });
    });

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(CryptoOfflineStorage.set(key, dataString)).toBe(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(CryptoOfflineStorage.set(key)).toBe(false);
      });
    });

    describe('get', function(){
      it('should returns the original json object', function () {
        CryptoOfflineStorage.set(key, dataString);
        expect(CryptoOfflineStorage.get(key)).toEqual(dataString);
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        CryptoOfflineStorage.set(key, dataString);
        expect(CryptoOfflineStorage.remove(key)).toBe(true);
      });
    });

    describe('clearAll', function(){
      it('should remove all items with success', function () {
        CryptoOfflineStorage.set(key, dataString);
        expect(CryptoOfflineStorage.clearAll()).toBe(true);
        expect(CryptoOfflineStorage.get(key)).toBe(null);
      });
    });
  });
});
