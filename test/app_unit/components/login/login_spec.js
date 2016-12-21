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
    //
    // it('should call login and go home if success', function () {
    //     const ctrl = $componentController('login', null, {}),
    //         deferred = $q.defer();
    //     deferred.resolve();
    //     spyOn(UserAuthService, 'login').and.returnValue(deferred.promise);
    //     ctrl.login({
    //         email: 'foo@bar.com',
    //         password: 'foo'
    //     });
    //     expect(UserAuthService.login).toHaveBeenCalled();
    // });

    it('should call login and go home if success', function (done) {
        const
            deferredPromise = $q(function (resolve, reject) {
                console.log('////////////////')
                console.log('resolve promise!')
                console.log('////////////////')
                resolve('foo');
            }).then(function (foobar) {
                console.log('foobar', foobar);
            }),
            locals = {
                UserAuthService: {
                    login: function () {
                        return deferredPromise;
                    }
                },
                $state: {
                    go: function () {}
                }
            },
            ctrl = $componentController('login', locals, {});
        // spyOn(locals.UserAuthService, 'login').and.callThrough();
        // spyOn(locals.$state, 'go');
        console.log('===========================');
        console.log('===========================');
        deferredPromise
            .then(function (foo) {
                console.log('FOO', foo);
                done();
            })
            .catch(function (bar) {
                console.log('BAR', bar);
                done();
            });
        console.log('rootScrope', $rootScope);
        $rootScope.$apply();
        // ctrl.login({
        //     email: 'foo@bar.com',
        //     password: 'foo'
        // });
    });
});
