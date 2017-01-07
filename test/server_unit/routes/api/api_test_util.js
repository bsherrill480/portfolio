function errIfErrElseDone(done) {
    return function (err) {
        if(err) {
            done.fail(err)
        } else {
            done();
        }
    }
}

module.exports = {
    expectedUserResponse(user, target) {
        expect(user).toBeTruthy();
        expect(user.email).toBe(target.email);
        expect(user.password).toBeUndefined();
        expect(user.facebook).toBeUndefined();
        expect(user.updatedAt).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user._id).toBeDefined();
    },

    badParams: 'Bad Params',

    expectFailsIfNotLoggedIn(request, done) {
        request
            .expect(401)
            .expect(function (res) {
                expect(res.body.error).toBe('Not Logged In');
            })
            .end(errIfErrElseDone(done))
    },
    
    expectFailsIfNotOwner(request, done) {
        request
            .expect(403)
            .expect(function (res) {
                expect(res.body.error).toBe('Forbidden');
            })
            .end(errIfErrElseDone(done))
    },
    
    errIfErrElseDone
};
