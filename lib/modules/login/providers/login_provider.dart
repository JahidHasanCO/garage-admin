import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/core/provider/repo.dart';
import 'package:garage_admin/data/enums/state_status.dart';
import 'package:garage_admin/modules/login/providers/login_state.dart';
import 'package:garage_admin/shared/repo/auth_repo.dart';

class LoginProvider extends Notifier<LoginState> {
  late AuthRepo _repo;

  @override
  LoginState build() {
    _repo = ref.read(authRepoProvider);
    return const LoginState();
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(status: StateStatus.loading);
    final result = await _repo.login(email: email, password: password);
    if (result) {
      state = state.copyWith(
        status: StateStatus.success,
        message: 'Login successful',
      );
    } else {
      state = state.copyWith(
        status: StateStatus.error,
        message: 'Login failed. Please check your credentials.',
      );
    }
  }
}
