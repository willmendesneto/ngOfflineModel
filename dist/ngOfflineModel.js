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
        var message = loadCrypto ? JSON.stringify(object) : object;
        return loadCrypto ? CryptoJS.TripleDES.encrypt(message, secret) : JSON.stringify(object);
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



angular.module('keepr.ngOfflineModel')
  .factory('ngOfflineModel', function ngOfflineModel(CryptoOfflineStorage) {

    // Service logic
    // ...

    var maxListItems = function (input, elementKey) {
      var out;
      if (!input) {
        return;
      }
      if (elementKey === undefined || elementKey === null) {
        elementKey = false;
      }
      for (var i in input) {
        if (!elementKey) {
          if (input[i] > out || out === undefined || out === null) {
            out = input[i];
          }
        } else {
          if (typeof input[i][elementKey] !== 'undefined' && (input[i][elementKey] > out || out === undefined || out === null)) {
            out = input[i][elementKey];
          }
        }
      }
      return out;
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

        var self = this;
        params = params || {};
        angular.extend(self, params);

        CryptoOfflineStorage.storageType = _storageType;
        CryptoOfflineStorage.init({secret: this.secret});
        var _itemsCached = CryptoOfflineStorage.get(this.key);

        if(_itemsCached !== null) {
          _items = _itemsCached;
        } else if (!angular.isArray(_items)) {
          _items = [];
        }

        if (this.fields !== null){
          var _itemsLength = _items.length;
          var i = 0;
          for ( ; _itemsLength > i; i++) {
            _items[i] = this.createValueObject(_items[i]);
          }
        }
        CryptoOfflineStorage.set(this.key, _items);
        self.setListItems(_items, params);

        //  Extend params for create a factory in service
        return self;
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
        return (maxListItems(items, this.primaryKey) || 0) + 1;
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
        var _id = db.filter( function (element, pos) {
          if ( element[self.primaryKey] === index){
            element.pos = pos;
            return element;
          }
        });

        if (_id.length > 0) {
          var item = db.splice(_id[0].pos, 1);
          if (typeof item[0] ===  'object') {
            this.setListItems(db);
            CryptoOfflineStorage.set(this.key, db);
            return item[0];
          }
        }
        return false;
      },
      clearAll: function() {
        _items = [];
        return CryptoOfflineStorage.clearAll();
      }
    };

  });
})(window, window.angular);