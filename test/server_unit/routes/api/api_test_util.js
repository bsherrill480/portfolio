/**
 * Created by brian on 12/4/16.
 */

module.exports = {
    expectedUserResponse(user, target) {
        expect(user).toBeTruthy();
        expect(user.username).toBe(target.username);
        expect(user.password).toBeUndefined();
        expect(user.firstName).toBe(target.firstName);
        expect(user.lastName).toBe(target.lastName);
        expect(user.email).toBe(target.email);
        expect(user.facebook).toBeUndefined();
        expect(user.updatedAt).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user._id).toBeDefined();
    }
};
