(function(window, angular, undefined){ "use strict";

angular.module('keepr.ngOfflineModel', []);

/* globals JSON, CryptoJS */


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



angular.module('keepr.ngOfflineModel')
  .factory('ngOfflineModel', function ngOfflineModel(CryptoOfflineStorage) {

    // Service logic
    // ...

    var maxListItems = function (input, elementKey) {
      return input.map(function(item) {
        return item[elementKey];
      }).reduce(function(previous, current) {
        return Math.max( previous, current );
      }, 0);
    };


    var _items = null,
        _storageType = 'localStorage';

    // Public API here
    return {
      primaryKey: '_id',
      fields: null,
      key: null,
      secret: 'my-awesome-key',
      init: function (_items, params) {
        params = params || {};
        angular.extend(this, params);

        CryptoOfflineStorage.storageType = _storageType;
        CryptoOfflineStorage.init({secret: this.secret});
        var _itemsCached = CryptoOfflineStorage.get(this.key);

        if(angular.isArray(_itemsCached)) {
          _items = _itemsCached;
        }

        if (angular.isArray(this.fields)){
          _items = this.createValueObjects(_items);
        }

        CryptoOfflineStorage.set(this.key, _items);
        this.setListItems(_items, params);

        //  Extend params for create a factory in service
        return this;
      },
      createValueObjects: function(items) {
        var self = this;
        items = items.map(function(item) {
          return self.createValueObject(item);
        });
        return items;
      },
      createValueObject: function(item) {
        var obj = {};
        angular.forEach( this.fields, function( field ) {
          obj[field] = item[field] || '';
        });
        return obj;
      },
      setStorageType: function(storageType) {
        _storageType = storageType;
        return this;
      },
      setKey: function(key){
        this.key = key;
        return this;
      },
      getKey: function(){
        return this.key;
      },
      setListItems: function(items){
        _items = items;
        return this;
      },
      getListItems: function(){
        return _items;
      },
      setFields: function(fields){
        this.fields = fields;
        return this;
      },
      countTotalItems: function(items) {
        return (maxListItems(items, this.primaryKey)) + 1;
      },
      create: function (item) {
        item = this.createValueObject(item);
        item[this.primaryKey] = this.countTotalItems(_items);
        _items.push(item);
        CryptoOfflineStorage.set(this.key, _items);
        return _items;
      },
      update: function (item) {
        var self = this;
        _items = _items.map( function (element) {
          if ( element[self.primaryKey] === item[self.primaryKey]){
            element = self.createValueObject(item);
          }
          return element;
        });
        CryptoOfflineStorage.set(this.key, _items);
        return _items;
      },
      delete: function(index) {
        var db = this.getListItems();
        var self = this;
        var firstItem = db.filter( function (element) {
          return element[self.primaryKey] === index;
        })[0];

        if (!firstItem) {
          return !!firstItem;
        }

        db = db.filter( function (element) {
          return element[self.primaryKey] !== firstItem[self.primaryKey];
        });

        this.setListItems(db);
        CryptoOfflineStorage.set(this.key, db);
        return firstItem;
      },
      clearAll: function() {
        _items = [];
        return CryptoOfflineStorage.clearAll();
      }
    };

  });
})(window, window.angular);