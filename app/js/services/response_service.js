function ResponseService($window) {
  'ngInject';

  return {
      alertResponseError(message, err) {
          const errorMsg = err && err.data && err.data.error ? err.data.error : '';
          $window.alert(message + ' ' + errorMsg);
      }
  };

}

export default {
  name: 'ResponseService',
  fn: ResponseService
};
