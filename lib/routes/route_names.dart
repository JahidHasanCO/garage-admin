part of 'router.dart';

sealed class RouteNames {
  static String get login => 'login';
}

extension AsPathExt on String {
  String get asPath => '/$this';
}
