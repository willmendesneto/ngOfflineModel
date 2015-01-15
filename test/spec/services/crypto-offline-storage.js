'use strict';

describe('Service: CryptoOfflineStorage', function () {

  // load the service's module
  beforeEach(module('keepr.ngOfflineModel'));

  // instantiate service
  var CryptoOfflineStorage,
    secret,
    storageType,
    key,
    string;

  describe('using "localStorage"', function(){

    beforeEach(inject(function (_CryptoOfflineStorage_) {
      CryptoOfflineStorage = _CryptoOfflineStorage_;
      secret = 'secret';
      key = 'key';
      string = 'test';
    }));

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
        expect(typeof CryptoOfflineStorage.encrypt(string, secret) === 'string').toBe(true);
      });
    });

    /*describe('decrypt', function(){
      it('should returns a string decrypted', function () {
        expect(CryptoOfflineStorage.decrypt(string, secret)).toBe(string);
      });
    });*/

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(CryptoOfflineStorage.set(key, string)).toBe(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(CryptoOfflineStorage.set(key)).toBe(false);
      });
    });

    describe('get', function(){
      it('should returns the original string', function () {
        CryptoOfflineStorage.set(key, string);
        expect(CryptoOfflineStorage.get(key)).toBe(string);
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        CryptoOfflineStorage.set(key, string);
        expect(CryptoOfflineStorage.remove(key)).toBe(true);
      });
    });
  });

  describe('using "sessionStorage"', function(){

    beforeEach(inject(function (_CryptoOfflineStorage_) {
      CryptoOfflineStorage = _CryptoOfflineStorage_;
      secret = 'secret';
      storageType = 'sessionStorage';
      key = 'key';
      string = 'test';
    }));

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
        expect(typeof CryptoOfflineStorage.encrypt(string, secret) === 'string').toBe(true);
      });
    });

    /*describe('decrypt', function(){
      it('should returns a string decrypted', function () {
        expect(CryptoOfflineStorage.decrypt(string, secret)).toBe(string);
      });
    });*/

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(CryptoOfflineStorage.set(key, string)).toBe(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(CryptoOfflineStorage.set(key)).toBe(false);
      });
    });

    describe('get', function(){
      it('should returns the original string', function () {
        CryptoOfflineStorage.set(key, string);
        expect(CryptoOfflineStorage.get(key)).toBe(string);
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        CryptoOfflineStorage.set(key, string);
        expect(CryptoOfflineStorage.remove(key)).toBe(true);
      });
    });

    describe('clearAll', function(){
      it('should remove all items with success', function () {
        CryptoOfflineStorage.set(key, string);
        expect(CryptoOfflineStorage.clearAll()).toBe(true);
        expect(CryptoOfflineStorage.get(key)).toBe(null);
      });
    });
  });
});
