import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppUrl {
  AppUrl._();
  static String adminLogin = '${dotenv.env['ADMIN_LOGIN']}';
  static String services = '${dotenv.env['SERVICES']}';
}
