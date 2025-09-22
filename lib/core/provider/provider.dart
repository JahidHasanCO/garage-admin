import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/modules/login/providers/login_provider.dart';
import 'package:garage_admin/modules/login/providers/login_state.dart';

final loginProvider = NotifierProvider<LoginProvider, LoginState>(
  LoginProvider.new,
);
