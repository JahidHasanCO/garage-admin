class LoginResponse {
  LoginResponse({
    this.accessToken,
    this.user,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) => LoginResponse(
    accessToken: json['accessToken'] as String?,
    user: json['user'] == null
        ? null
        : User.fromJson(json['user'] as Map<String, dynamic>),
  );

  final String? accessToken;
  final User? user;
}

class User {
  User({
    this.id,
    this.name,
    this.email,
    this.password,
    this.refreshToken,
    this.roleId,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['_id'] as String?,
    name: json['name'] as String?,
    email: json['email'] as String?,
    password: json['password'] as String?,
    refreshToken: json['refresh_token'] as String?,
    roleId: json['role_id'] as String?,
    createdAt: json['createdAt'] == null
        ? null
        : DateTime.parse(json['createdAt'] as String),
    updatedAt: json['updatedAt'] == null
        ? null
        : DateTime.parse(json['updatedAt'] as String),
    v: json['__v'] as int?,
  );

  final String? id;
  final String? name;
  final String? email;
  final String? password;
  final String? refreshToken;
  final String? roleId;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final int? v;

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'password': password,
      'refreshToken': refreshToken,
      'roleId': roleId,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'v': v,
    };
  }
}
