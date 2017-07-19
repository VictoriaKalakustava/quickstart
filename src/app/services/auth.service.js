"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_service_1 = require("./core/core.service");
var core_1 = require("@angular/core");
var angular2_jwt_1 = require("angular2-jwt");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/http");
var user_service_1 = require("./user.service");
var AuthService = AuthService_1 = (function (_super) {
    __extends(AuthService, _super);
    function AuthService(http, authHttp, jwtHelper, userService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.authHttp = authHttp;
        _this.jwtHelper = jwtHelper;
        _this.userService = userService;
        _this.isLoggedIn = new core_1.EventEmitter();
        return _this;
    }
    AuthService.loggedIn = function () {
        var jwt = new angular2_jwt_1.JwtHelper();
        return localStorage.getItem('token') !== null && !jwt.isTokenExpired(localStorage.getItem('token'));
    };
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this.http.post(this.webServiceEndpoint + "/", JSON.stringify({ username: username, password: password }))
            .map(function (response) {
            var token = response.json() && response.json().token;
            var refresh = response.json() && response.json().refreshToken;
            if (token) {
                localStorage.setItem('token', token);
            }
            if (refresh) {
                localStorage.setItem('refresh', refresh);
            }
            if (response.status == 200) {
                _this.initAuthUser();
                _this.startupTokenRefresh();
            }
        });
    };
    AuthService.prototype.initAuthUser = function () {
        var _this = this;
        this.userService.getCurrentUser().subscribe(function (data) {
            _this.userService.updateAuthUser(data);
            _this.isLoggedIn.emit(true);
        });
    };
    AuthService.prototype.startupTokenRefresh = function () {
        var _this = this;
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        if (AuthService_1.canBeRefreshed()) {
            var source = this.authHttp.tokenStream.flatMap(function (token) {
                // Get the expiry time to generate
                // a delay in milliseconds
                var now = new Date().valueOf();
                var jwtExp = _this.jwtHelper.decodeToken(token).exp;
                var exp = new Date(0);
                exp.setUTCSeconds(jwtExp);
                var delay = (exp.valueOf() - now) * 0.95;
                // Use the delay in a timer to
                // run the refresh at the proper time
                return rxjs_1.Observable.timer(delay < 0 ? 1 : delay);
            });
            // Once the delay time from above is
            // reached, get a new JWT and schedule
            // additional refreshes
            source.subscribe(function () {
                _this.refreshToken();
            });
        }
    };
    AuthService.canBeRefreshed = function () {
        var jwt = new angular2_jwt_1.JwtHelper();
        return localStorage.getItem('refresh') !== null && !jwt.isTokenExpired(localStorage.getItem('refresh'));
    };
    AuthService.prototype.scheduleRefresh = function () {
        var _this = this;
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        var source = this.authHttp.tokenStream.flatMap(function (token) {
            // The delay to generate in this case is the difference
            // between the expiry time and the issued at time
            var jwtIat = _this.jwtHelper.decodeToken(token).iat;
            var jwtExp = _this.jwtHelper.decodeToken(token).exp;
            var iat = new Date(0);
            var exp = new Date(0);
            var delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat)) * 0.95;
            return rxjs_1.Observable.interval(delay);
        });
        this.refreshSubscription = source.subscribe(function () {
            _this.refreshToken();
        });
    };
    AuthService.prototype.refreshToken = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('X-Authorization', 'Bearer ' + localStorage.getItem('refresh'));
        var source = this.http.get(this.webServiceEndpoint + "/", { headers: headers })
            .map(function (response) { return response.json(); });
        source.subscribe(function (data) {
            var token = data && data.token;
            console.log('refreshed token: ', token);
            if (token) {
                localStorage.setItem('token', token);
                _this.isLoggedIn.emit(true);
                _this.userService.getCurrentUser().subscribe(function (item) {
                    _this.userService.updateAuthUser(item);
                });
            }
            if (_this.refreshSubscription == null && AuthService_1.canBeRefreshed()) {
                _this.scheduleRefresh();
            }
        });
    };
    return AuthService;
}(core_service_1.CoreService));
AuthService = AuthService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        angular2_jwt_1.AuthHttp,
        angular2_jwt_1.JwtHelper,
        user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
var AuthService_1;
//# sourceMappingURL=auth.service.js.map