
var should = require("should");
var request = require("request");
var expect = require("chai").expect;
var baseURL = "http://localhost:3000";
var util = require("util");


describe("log in", function () {
    it("log in", function (done) {
        request.post({url: baseURL + '/login', form: {email: 'mocha2@test.com', password: "test", type: "regularUser"}},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log("here"+body);
                done();
            })
    })
});

describe("register", function () {
    it("register", function (done) {
        request.post({url: baseURL + '/register', form: {email: 'mocha2@test.com', password: "test", type: "regularUser"}},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            })
    })
});

describe("create expense", function () {
    it("create expense", function (done) {
        request.post({url: baseURL + '/create', form: {amount: '50000', description: "fees", date: new Date()}},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            })
    })
});

describe("get All Expense", function () {
    it("get All Expense", function (done) {
        request.get({url: baseURL + '/retrieve'},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            })
    })
});

describe("Update expense", function (done) {
    it("Update expense", function () {
        request.post({url: baseURL + '/edit', form: {id:12, amount: '5000', description: "5000 dollar", date: new Date()}},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            })
    })
});

describe("deleteExpense", function () {
    it("deleteExpense", function () {
        request.del({url: baseURL + '/delete/12'},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log(body);
            })
    })
});

describe("View Expense", function () {
    it("View Expense", function (done) {
        var end_date = new Date();
        var start_date = new Date(end_date.getTime() - (7 * 24 * 60 * 60 * 1000));

        request.post({url: baseURL + '/viewExpenses', form: {start_date: start_date, end_date: end_date}},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            })
    })
});

describe("log out", function () {
    it("log out", function (done) {
        request.get({url: baseURL + '/logout'},
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            })
    })
});
