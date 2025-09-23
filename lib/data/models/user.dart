import 'dart:convert';

import 'package:equatable/equatable.dart';

class User extends Equatable {
  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.password,
    required this.refreshToken,
    required this.roleId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(String source) =>
      User.fromMap(jsonDecode(source) as Map<String, dynamic>);

  factory User.fromMap(Map<String, dynamic> map) => User(
    id: map['id'] as String? ?? '',
    name: map['name'] as String? ?? '',
    email: map['email'] as String? ?? '',
    password: map['password'] as String? ?? '',
    refreshToken: map['refresh_token'] as String? ?? '',
    roleId: map['role_id'] as String? ?? '',
    createdAt:
        DateTime.tryParse(map['created_at'] as String? ?? '') ?? DateTime.now(),
    updatedAt:
        DateTime.tryParse(map['updated_at'] as String? ?? '') ?? DateTime.now(),
  );

  final String id;
  final String name;
  final String email;
  final String password;
  final String refreshToken;
  final String roleId;
  final DateTime createdAt;
  final DateTime updatedAt;

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? password,
    String? refreshToken,
    String? roleId,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      password: password ?? this.password,
      refreshToken: refreshToken ?? this.refreshToken,
      roleId: roleId ?? this.roleId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'email': email,
    'password': password,
    'refresh_token': refreshToken,
    'role_id': roleId,
    'created_at': createdAt.toIso8601String(),
    'updated_at': updatedAt.toIso8601String(),
  };

  String toJson() => jsonEncode(toMap());

  @override
  List<Object?> get props => [
    id,
    name,
    email,
    password,
    refreshToken,
    roleId,
    createdAt,
    updatedAt,
  ];
}
