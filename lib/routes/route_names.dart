part of 'router.dart';

sealed class RouteNames {
  static String get login => 'login';
  static String get signUp => 'sign_up';
}

extension AsPathExt on String {
  String get asPath => '/$this';
}
