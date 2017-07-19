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
var core_1 = require("@angular/core");
var user_1 = require("../entites/user");
var angular2_jwt_1 = require("angular2-jwt");
require("rxjs/add/operator/map");
var auth_service_1 = require("./auth.service");
var core_service_1 = require("./core/core.service");
var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService(authHttp) {
        var _this = _super.call(this) || this;
        _this.authHttp = authHttp;
        _this.user = new user_1.User();
        _this.authData = new core_1.EventEmitter();
        if (auth_service_1.AuthService.loggedIn()) {
            _this.getCurrentUser().subscribe(function (data) {
                _this.user = data;
                _this.authData.emit(_this.user);
            });
        }
        return _this;
    }
    UserService.prototype.getAuthUser = function () {
        var user = new user_1.User();
        user.about = this.user.about;
        user.lastName = this.user.lastName;
        user.firstName = this.user.firstName;
        user.sex = this.user.sex;
        user.login = this.user.login;
        user.enabled = this.user.enabled;
        user.email = this.user.email;
        user.id = this.user.id;
        user.image = this.user.image;
        user.role = this.user.role;
        return user;
    };
    UserService.prototype.updateAuthUser = function (user) {
        this.user = user;
        var newUser = this.getAuthUser();
        this.authData.emit(newUser);
    };
    UserService.prototype.getUser1 = function () {
        console.log("User Service. getUser1");
        return this.authHttp.get(this.webServiceEndpoint + "/test")
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.changeImage = function (uploadDTO) {
        return this.authHttp.post(this.webServiceEndpoint + "/protected/user/update/image", uploadDTO)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.getById = function (id) {
        return this.authHttp.get(this.webServiceEndpoint + "/user/" + id)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.create = function (user) {
        return this.authHttp.post(this.webServiceEndpoint + "/user", user)
            .map(function (response) { return response; });
    };
    UserService.prototype.validateCaptcha = function (key) {
        return this.authHttp.post(this.webServiceEndpoint + "/user/captcha", key)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.update = function (user) {
        var _this = this;
        return this.authHttp.put(this.webServiceEndpoint + "/protected/user", user).map(function (response) {
            if (response.json() && response.json().username == _this.user.login) {
                _this.updateAuthUser(response.json());
            }
            response.json();
        });
    };
    UserService.prototype.recoverPassword = function (email) {
        return this.authHttp.post(this.webServiceEndpoint + "/user/recover", email)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.delete = function (id) {
        return this.authHttp.delete(this.webServiceEndpoint + "/protected/user/" + id)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.getCurrentUser = function () {
        return this.authHttp.get(this.webServiceEndpoint + "/protected/user/me")
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.checkUsername = function (username) {
        return this.authHttp.get(this.webServiceEndpoint + "/user/check/" + username)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.checkEmail = function (email) {
        return this.authHttp.post(this.webServiceEndpoint + "/user/check/email", email)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.updatePassword = function (oldPassword, newPassword) {
        return this.authHttp.post(this.webServiceEndpoint + "/protected/user/password", { "old": oldPassword, "new": newPassword }).map(function (response) { return response.json(); });
    };
    return UserService;
}(core_service_1.CoreService));
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [angular2_jwt_1.AuthHttp])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map