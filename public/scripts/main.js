(function(window) {
  'use strict';
  var $ = window.jQuery;

  var FORM_SELECTOR = "[data-signup='form']";
  var FORM_SELECTOR_1 = "[data-login='form']";
  var FORM_SELECTOR_2 = "[data-submission='form']";
  var FORM_SELECTOR_3 = "[data-editsubmission='form']";

  var ELEMENT_SELECTOR = "[data-logout='logout']";
  var PHOTO_ELEMENT = $('#imageUpload');
  var PHOTO_ELEMENT_1 = $('#imageUpload1');

  var SERVER_URL = 'http://localhost:2403/';
  var App = window.App;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var AccountMgmt = App.AccountMgmt;

  var remoteDS = new RemoteDataStore(SERVER_URL);

  // Signup form handling
  var formHandler = new FormHandler(FORM_SELECTOR);
  formHandler.addSubmitHandler(remoteDS);
  formHandler.addInputHandler();

  // Login form handling
  var formHandler1 = new FormHandler(FORM_SELECTOR_1);
  formHandler1.addSubmitHandler1(remoteDS);

  // Submission form handling
  var formHandler2 = new FormHandler(FORM_SELECTOR_2);
  formHandler2.addSubmitHandler2(remoteDS);
  formHandler2.addMainImageHandler(PHOTO_ELEMENT);

  // Edit submission form handling
  var formHandler3 = new FormHandler(FORM_SELECTOR_3);
  formHandler3.addSubmitHandler3(remoteDS);
  formHandler3.addMainImageHandler1(PHOTO_ELEMENT_1);

  // Logout button handling
  var elementLogout = new AccountMgmt(ELEMENT_SELECTOR);
  elementLogout.addLogoutHandler();

  // Initial load handler
  var accountManagement = new AccountMgmt();
  accountManagement.addInititalLoadHandler();

  $("#submissionModal").on('shown.bs.modal', function() {
    $("#uid")[0].value = localStorage.uid;
  });

})(window);
