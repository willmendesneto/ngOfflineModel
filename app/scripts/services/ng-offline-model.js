'use strict';

angular.module('keepr.ngOfflineModel')
  .factory('ngOfflineModel', function ngOfflineModel(CryptoOfflineStorage) {

    // Service logic
    // ...

    var maxListItems = function (input, elementKey) {
      return input.map(function(item) {
        return item[elementKey];
      }).reduce(function(previous, current) {
        return Math.max( previous, current );
      });
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
