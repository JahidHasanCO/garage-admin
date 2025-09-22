import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  AppConfig._();
  static bool envProd = true;
  static String baseUrl = dotenv.env['PRODUCTION']!;
}