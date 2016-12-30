describe('Unit: Login Component', function() {

    let $componentController,
        $q,
        $rootScope;

    beforeEach(function() {
        // instantiate the app module
        angular.mock.module('app');

        angular.mock.inject((_$componentController_, _UserAuthService_, _$q_, _$rootScope_) => {

            $componentController = _$componentController_;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });
    });


    it('should exist', function() {
        const ctrl = $componentController('login', null, {});
        expect(ctrl).toBeDefined();
    });

    it('should have a user', function() {
        const ctrl = $componentController('login', null, {});
        expect(ctrl.user).toEqual({
            email: '',
            password: ''
        });
    });

    it('should have a errors', function() {
        const ctrl = $componentController('login', null, {});
        expect(ctrl.errors).toEqual({
            email: '',
            password: ''
        });
    });

    it('should call login and go home if success', function () {
        const
            locals = {
                UserAuthService: {
                    login: function () {
                        return $q(function (resolve) {
                            resolve('foo');
                        });
                    }
                },
                $state: {
                    go: function () {}
                }
            },
            ctrl = $componentController('login', locals, {});
        spyOn(locals.UserAuthService, 'login').and.callThrough();
        spyOn(locals.$state, 'go');
        ctrl.login({
            email: 'foo@bar.com',
            password: 'foo'
        });
        $rootScope.$apply(); // force $q promise to evaluate
        expect(locals.UserAuthService.login).toHaveBeenCalled();
        expect(locals.$state.go).toHaveBeenCalledWith('Home');
    });

    it('should call alert if login failed', function () {
        const
            locals = {
                UserAuthService: {
                    login: function () {
                        return $q(function (resolve, reject) {
                            reject('foo');
                        });
                    }
                },
                ResponseService: {
                    alertResponseError: function () {}
                }
            },
            ctrl = $componentController('login', locals, {});
        spyOn(locals.UserAuthService, 'login').and.callThrough();
        spyOn(locals.ResponseService, 'alertResponseError');
        ctrl.login({
            email: 'foo@bar.com',
            password: 'foo'
        });
        $rootScope.$apply(); // force $q promise to evaluate
        expect(locals.UserAuthService.login).toHaveBeenCalled();
        expect(locals.ResponseService.alertResponseError).toHaveBeenCalled();
    });
});
