import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/app/providers/app/app_state.dart';
import 'package:garage_admin/data/models/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppProvider extends Notifier<AppState> {
  SharedPreferences? _prefs;

  @override
  AppState build() => const AppState();

  Future<void> onInit() async {
    _prefs = await SharedPreferences.getInstance();
    final token = _prefs?.getString('accessToken');
    final userJson = _prefs?.getString('user');
    if (token != null && userJson != null) {
      final user = User.fromJson(userJson);
      state = state.copyWith(accessToken: token, user: user);
    }
  }

  Future<void> setUser(String token, User user, {bool remember = true}) async {
    if (remember) {
      _prefs ??= await SharedPreferences.getInstance();
      await _prefs?.setString('accessToken', token);
      await _prefs?.setString('user', user.toJson());
    }
    state = state.copyWith(accessToken: token, user: user);
  }
}
