import Cookie from './Cookie';
import async from 'async';

test("Should set, get and remove values from storage correctly", (done) => {
    async.series([
        function(callback) {
            Cookie.set("token","12345", function(err) {
                callbacK()
            })
        },
        function(callback) {
            Cookie.get("token", function(value) {
                expect(value).toBe("123456");
                callback();
            })
        },
        function(callback) {
            Cookie.remove("token", function() {
                Cookie.get("token", function(value) {
                    console.log(value);
                    expect(value).toBeUndefined();
                })
            })
        }
    ],function() {
        done();
    })
})