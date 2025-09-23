import 'package:equatable/equatable.dart';
import 'package:garage_admin/data/models/user.dart';

class AppState extends Equatable {
  const AppState({
    this.accessToken,
    this.user,
  });

  final String? accessToken;
  final User? user;

  AppState copyWith({
    String? accessToken,
    User? user,
  }) {
    return AppState(
      accessToken: accessToken ?? this.accessToken,
      user: user ?? this.user,
    );
  }

  @override
  List<Object?> get props => [
    accessToken,
    user,
  ];
}
