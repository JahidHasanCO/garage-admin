import 'package:dio/dio.dart';
import 'package:garage_admin/core/config/app_config.dart';
import 'package:garage_admin/shared/services/network/app_interceptors.dart';
import 'package:garage_admin/utils/extension/object.dart';

class ApiClient {
  factory ApiClient({String? accessToken, bool isNewIns = false}) {
    if (isNewIns) {
      _instance._newInst(accessToken, isNewIns: isNewIns);
    }
    return _instance;
  }

  ApiClient._internal();

  static final ApiClient _instance = ApiClient._internal();

  late Dio dio;
  late Dio dioWithoutBase;
  late String token;


  void _newInst(String? token, {bool isNewIns = false}) {
    'New Instance of ApiClient created'.doPrint();
    final headers = token != null && token.isNotEmpty
        ? {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    }
        : null;

    dio = _createDio(headers);
    dioWithoutBase = _createDioWithoutBase();
    this.token = token ?? '';
  }

  static Dio _createDio(Map<String, String>? headers) {
    final dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        headers: headers,
        // receiveTimeout: const Duration(milliseconds: 30000),
        // connectTimeout: const Duration(milliseconds: 30000),
        // sendTimeout: const Duration(milliseconds: 30000),
      ),
    );

    dio.interceptors.add(AppInterceptors(dio));
    return dio;
  }

  static Dio _createDioWithoutBase() {
    final dio_ = Dio();

    dio_.interceptors.add(AppInterceptors(dio_));
    return dio_;
  }
}
