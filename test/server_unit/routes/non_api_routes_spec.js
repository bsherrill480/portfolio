const request = require('supertest'),
    app = require('../test_util/test_server_app');

function expectRespondsWithAppHtml(url, done) {
    request(app)
        .get(url)
        .expect(200)
        .expect(function (res) {
            expect(res.text.startsWith('<!doctype html>')).toBeTruthy();
            expect(res.text).toMatch(/.*<script src="js\/main\.js".*/);
            expect(res.text).toMatch(/.*<link.*href="css\/main\.css".*/);
        })
        .end(function (err) {
            if(err) {
                done.fail(err);
            } else {
                done()
            }
        });   
}

describe('request to non /api url', function () {
    it('/ should responds with app html', function (done) {
        expectRespondsWithAppHtml('/', done);
    });
    it('/foobar should responds with app html', function (done) {
        expectRespondsWithAppHtml('/foobar', done);
    });
});
