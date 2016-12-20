describe('Unit: Login Component', function() {

    let ctrl;

    // beforeEach(function() {
    //   // instantiate the app module
    //   angular.mock.module('app');
    //
    //   angular.mock.inject(($componentController) => {
    //     ctrl = $componentController('Login');
    //   });
    // });
    //   beforeEach(module('app'));
    //   beforeEach(inject(function(_$componentController_) {
    //       const $componentController = _$componentController_;
    //       ctrl = $componentController('login', null, {})
    //   }));

    beforeEach(function() {
        // instantiate the app module
        angular.mock.module('app');

        angular.mock.inject((_$componentController_) => {
            console.log('==========================================');
            console.log('_$componentController', _$componentController_);
            // const $componentController = _$componentController_('Login');
            ctrl = _$componentController_('login', null, {});
            console.log('ctrl', ctrl);
            console.log('==========================================');
        });
    });


    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });
    //
    // it('should have a EMAIL_REQUIRED_MSG', function() {
    //   expect(ctrl.EMAIL_REQUIRED_MSG).toBe('Valid email required.');
    // });
});
