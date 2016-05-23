'use strict';

describe('Service: ngOfflineModel', function () {

  // load the service's module
  beforeEach(module('keepr.ngOfflineModel'));

  // instantiate service
  var ngOfflineModel, myMock, MyNgOfflineModel, params;

  describe('ngOfflineModel: localStorage', function () {

    beforeEach(inject(function (_ngOfflineModel_) {
      ngOfflineModel = _ngOfflineModel_;
      myMock = [
        {_id: 1, name: 'Allan Benjamin', address: 'St. Claire Avenue, Nº 101', phone: '557188339933'},
        {_id: 2, name: 'Georgia Smith', address: 'St. Claire Avenue, Nº 102', phone: '557188339933'},
        {_id: 3, name: 'Gregory Levinsky', address: 'St. Claire Avenue, Nº 103', phone: '557188339933'},
        {_id: 4, name: 'Jackeline Macfly', address: 'St. Claire Avenue, Nº 104', phone: '557188339933'},
        {_id: 5, name: 'Joseph Climber', address: 'St. Claire Avenue, Nº 105', phone: '557188339933'},
        {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
      ];
      params = {
        key: 'myMock',
        primaryKey: '_id',
        fields: ['_id', 'name', 'address', 'phone']
      };

      MyNgOfflineModel = ngOfflineModel.setStorageType('localStorage')
                                        .init(myMock, params);
    }));

    it('ngOfflineModel should be created', function () {
      expect(!!MyNgOfflineModel).toBe(true);
    });

    it('#init', function () {
      expect(MyNgOfflineModel.getListItems().length).toBe(6);
      expect(MyNgOfflineModel.getKey()).toBe('myMock');
      expect(MyNgOfflineModel.getListItems()).toEqual(myMock);
    });

    it('#countTotalItems', function(){
      expect(MyNgOfflineModel.countTotalItems(myMock)).toEqual(7);
    });

    it('#create', function(){
      var contact = [
        {
          name: 'This is a test',
          address: 'Adress test',
          phone: '557188998877'
        }
      ];
      expect(MyNgOfflineModel.create(contact).length).toEqual(7);
    });

    it('#update', function(){
      var contact = {
          name: 'This is a test',
          address: 'Adress test',
          phone: '557188998877',
          _id: 1
        };

      var filterSelect = function(opts){
        return opts.el.filter( function (element) {
          if ( element[opts.elKey] === opts.compareKey){
            return element;
          }
        });
      };

      expect(MyNgOfflineModel.update(contact).length).toEqual(7);

      expect(myMock[0].name).toEqual('Allan Benjamin');
      expect(myMock[0].address).toEqual('St. Claire Avenue, Nº 101');
      expect(myMock[0]._id).toEqual(1);
      expect(myMock[0].phone).toEqual('557188339933');

      var listItems = MyNgOfflineModel.getListItems();
      var opt = {
        el: listItems,
        compare: contact,
        elKey: '_id',
        compareKey: 1
      };

      var item = filterSelect(opt)[0];

      expect(item.name).toEqual(contact.name);
      expect(item.address).toEqual(contact.address);
      expect(item._id).toEqual(contact._id);
      expect(item.phone).toEqual(contact.phone);

      expect(item.name !== myMock[0].name).toEqual(true);
      expect(item.address !== myMock[0].address).toEqual(true);
      expect(item.phone !==myMock[0].phone).toEqual(true);
      expect(item._id === myMock[0]._id).toEqual(true);
    });

    it('#delete', function(){
      expect(typeof MyNgOfflineModel.delete(1) === 'object').toBe(true);
      expect(MyNgOfflineModel.delete(5000)).toBe(false);
    });

    it('_key params validation', function () {
      var key = 'key-verification';
      expect(typeof MyNgOfflineModel.setKey(key) === 'object').toBe(true);
      expect(MyNgOfflineModel.getKey()).toBe(key);
    });

    it('_items params validation', function () {
      var listItems = [
        {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
      ];
      expect(typeof MyNgOfflineModel.setListItems(listItems) === 'object').toBe(true);
      expect(MyNgOfflineModel.getListItems()).toEqual(listItems);
      expect(MyNgOfflineModel.getListItems().length).toEqual(1);
    });

    it('#setFields', function () {
      MyNgOfflineModel.setFields(['_id', 'name', 'address']);

      var contact = [
        {
          _id: '098340984093',
          name: 'This is a test',
          address: 'Adress test',
          phone: '557188998877',
          country: 'Brazil'
        }
      ];
      var listItems = MyNgOfflineModel.getListItems();
      var listItemsLength = listItems.length;
      var i = 0;

      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyNgOfflineModel.createValueObject(listItems[i]);
      }

      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone === 'undefined').toBe(true);
      }

      MyNgOfflineModel.setListItems(myMock)
                    .setFields(['_id', 'name', 'address', 'phone']);

      i = 0;
      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyNgOfflineModel.createValueObject(listItems[i]);
      }

      listItems = MyNgOfflineModel.create(contact);
      listItemsLength = listItems.length;
      i = 0;
      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone !== 'undefined').toBe(true);
      }

    });

    it('#clearAll', function () {
      MyNgOfflineModel = ngOfflineModel.setStorageType('localStorage')
                                        .init(myMock, params);

      expect(MyNgOfflineModel.getListItems().length).toEqual(7);

      MyNgOfflineModel.clearAll();
      expect(MyNgOfflineModel.getListItems().length).toEqual(0);
    });

  });


  describe('ngOfflineModel: sessionStorage', function () {

    beforeEach(inject(function (_ngOfflineModel_) {
      ngOfflineModel = _ngOfflineModel_;
      myMock = [
        {_id: 1, name: 'Allan Benjamin', address: 'St. Claire Avenue, Nº 101', phone: '557188339933'},
        {_id: 2, name: 'Georgia Smith', address: 'St. Claire Avenue, Nº 102', phone: '557188339933'},
        {_id: 3, name: 'Gregory Levinsky', address: 'St. Claire Avenue, Nº 103', phone: '557188339933'},
        {_id: 4, name: 'Jackeline Macfly', address: 'St. Claire Avenue, Nº 104', phone: '557188339933'},
        {_id: 5, name: 'Joseph Climber', address: 'St. Claire Avenue, Nº 105', phone: '557188339933'},
        {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
      ];
      var params = {
        key: 'myMock',
        primaryKey: '_id',
        fields: ['_id', 'name', 'address', 'phone']
      };

      MyNgOfflineModel = ngOfflineModel.setStorageType('sessionStorage')
                                        .init(myMock, params);
    }));

    it('ngOfflineModel should be created', function () {
      expect(!!MyNgOfflineModel).toBe(true);
    });

    it('#init', function () {
      expect(MyNgOfflineModel.getListItems().length).toBe(6);
      expect(MyNgOfflineModel.getKey()).toBe('myMock');
      expect(MyNgOfflineModel.getListItems()).toEqual(myMock);
    });

    it('#countTotalItems', function(){
      expect(MyNgOfflineModel.countTotalItems(myMock)).toEqual(7);
    });

    it('#create', function(){
      var contact = [
        {
          name: 'This is a test',
          address: 'Adress test',
          phone: '557188998877'
        }
      ];
      expect(MyNgOfflineModel.create(contact).length).toEqual(7);
    });

    it('#update', function(){
      var contact = {
          name: 'This is a test',
          address: 'Adress test',
          phone: '557188998877',
          _id: 1
        };

      var filterSelect = function(opts){
        return opts.el.filter( function (element) {
          if ( element[opts.elKey] === opts.compareKey){
            return element;
          }
        });
      };

      expect(MyNgOfflineModel.update(contact).length).toEqual(7);

      expect(myMock[0].name).toEqual('Allan Benjamin');
      expect(myMock[0].address).toEqual('St. Claire Avenue, Nº 101');
      expect(myMock[0]._id).toEqual(1);
      expect(myMock[0].phone).toEqual('557188339933');

      var listItems = MyNgOfflineModel.getListItems();
      var opt = {
        el: listItems,
        compare: contact,
        elKey: '_id',
        compareKey: 1
      };

      var item = filterSelect(opt)[0];

      expect(item.name).toEqual(contact.name);
      expect(item.address).toEqual(contact.address);
      expect(item._id).toEqual(contact._id);
      expect(item.phone).toEqual(contact.phone);

      expect(item.name !== myMock[0].name).toEqual(true);
      expect(item.address !== myMock[0].address).toEqual(true);
      expect(item.phone !==myMock[0].phone).toEqual(true);
      expect(item._id === myMock[0]._id).toEqual(true);
    });

    it('#delete', function(){
      expect(typeof MyNgOfflineModel.delete(1) === 'object').toBe(true);
      expect(MyNgOfflineModel.delete(5000)).toBe(false);
    });

    it('_key params validation', function () {
      var key = 'key-verification';
      expect(typeof MyNgOfflineModel.setKey(key) === 'object').toBe(true);
      expect(MyNgOfflineModel.getKey()).toBe(key);
    });

    it('_items params validation', function () {
      var listItems = [
        {_id: 6, name: 'Joshua Jackson', address: 'St. Claire Avenue, Nº 106', phone: '557188339933'}
      ];
      expect(typeof MyNgOfflineModel.setListItems(listItems) === 'object').toBe(true);
      expect(MyNgOfflineModel.getListItems()).toEqual(listItems);
      expect(MyNgOfflineModel.getListItems().length).toEqual(1);
    });

    it('#setFields', function () {
      MyNgOfflineModel.setFields(['_id', 'name', 'address']);

      var contact = [
        {
          _id: '098340984093',
          name: 'This is a test',
          address: 'Adress test',
          phone: '557188998877',
          country: 'Brazil'
        }
      ];
      var listItems = MyNgOfflineModel.getListItems();
      var listItemsLength = listItems.length;
      var i = 0;

      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyNgOfflineModel.createValueObject(listItems[i]);
      }

      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone === 'undefined').toBe(true);
      }

      MyNgOfflineModel.setListItems(myMock)
                    .setFields(['_id', 'name', 'address', 'phone']);

      i = 0;
      for ( ; listItemsLength > i; i++) {
        listItems[i] = MyNgOfflineModel.createValueObject(listItems[i]);
      }

      listItems = MyNgOfflineModel.create(contact);
      listItemsLength = listItems.length;
      i = 0;
      for ( ; listItemsLength > i; i++) {
        expect(typeof listItems[i].phone !== 'undefined').toBe(true);
      }

    });

    it('#clearAll', function () {
      expect(MyNgOfflineModel.getListItems().length).toEqual(7);

      MyNgOfflineModel.clearAll();
      expect(MyNgOfflineModel.getListItems().length).toEqual(0);
    });

  });

});
