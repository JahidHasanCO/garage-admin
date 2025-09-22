import 'package:equatable/equatable.dart';
import 'package:garage_admin/data/enums/state_status.dart';

class LoginState extends Equatable {
  const LoginState({
    this.status = StateStatus.initial,
    this.message = '',
  });

  final StateStatus status;
  final String message;

  LoginState copyWith({
    StateStatus? status,
    String? message,
  }) {
    return LoginState(
      status: status ?? this.status,
      message: message ?? this.message,
    );
  }

  @override
  List<Object?> get props => [status, message];
}
