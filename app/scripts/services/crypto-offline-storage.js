/* globals JSON, CryptoJS */
'use strict';

/**
 * Provide a service for Crypt/Decrypt offline storage (localStorage/sessionStorage) data in application
 * @class CryptoOfflineStorage
 * @module services
 * @main CryptoOfflineStorage
 * @class CryptoOfflineStorage
 * @static
 */
angular.module('keepr.ngOfflineModel')
  .service('CryptoOfflineStorage', function CryptoOfflineStorage() {
    var loadCrypto = typeof CryptoJS !== 'undefined';

    return {

      /**
       * Application secret key string
       * @property secret
       * @type {String}
       */
      secret : '',

      /**
       * Type of offline storage (localStorage/sessionStorage)
       * @type {String}
       */
      storageType : 'localStorage',

      /**
       * Initialyze service
       * @param  {String} secret Application secret key value
       * @method init
       */
      init: function(opts){
        angular.extend(this, opts);
      },

      /**
       * Encrypt object values
       * @param  {Object} object Object for encrypt
       * @param  {String} secret Secret key for encrypt
       * @return {String}        String with encrypted values
       * @method encrypt
       */
      encrypt: function(object, secret) {
        var message = JSON.stringify(object);
        return loadCrypto ? CryptoJS.TripleDES.encrypt(message, secret) : message;
      },

      /**
       * Decrypt object values
       * @param  {Object} object Object for decrypt
       * @param  {String} secret Secret key for encrypt
       * @return {String}           Decrypted string
       * @method decrypt
       */
      decrypt: function(encrypted, secret) {
        if (typeof encrypted === 'undefined') {
          return '';
        }
        var decrypted = loadCrypto ? CryptoJS.TripleDES.decrypt(encrypted, secret) : JSON.parse(encrypted);
        return loadCrypto ? JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)) : decrypted;
      },

      /**
       * Get element values in offline storage (localStorage/sessionStorage)
       * @param  {String} secret Secret key for encrypt
       * @return {String}           Decrypted string
       * @method get
       */
      get: function(key) {
        var encrypted = window[this.storageType].getItem(key);
        return encrypted && this.decrypt(encrypted, this.secret);
      },

      /**
       * Set element values in offline storage (localStorage/sessionStorage)
       * @param  {String} secret Secret key for encrypt
       * @param  {Object} object Object for encrypt
       * @return {Boolean}
       * @method set
       */
      set: function(key, object) {
        if (!object) {
          this.remove(key);
          return false;
        }

        var encrypted = this.encrypt(object, this.secret);
        window[this.storageType].setItem(key, encrypted);
        return true;
      },

      /**
       * Remove element of offline storage (localStorage/sessionStorage)
       * @param  {String} secret Secret key for element
       * @return {Boolean}
       * @method remove
       */
      remove: function(key) {
        window[this.storageType].removeItem(key);
        return true;
      },

      /**
       * Remove all elements element of offline storage (localStorage/sessionStorage)
       * @return {Boolean}
       * @method clearAll
       */
      clearAll: function() {
        window[this.storageType].clear();
        return true;
      }
    };
  });
