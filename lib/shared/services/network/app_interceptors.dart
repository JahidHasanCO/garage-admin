import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:garage_admin/utils/extension/object.dart';

class AppInterceptors extends Interceptor {
  AppInterceptors(this.dio);

  final Dio dio;

  String _prettyJson(dynamic data) {
    try {
      if (data is String) {
        final decoded = jsonDecode(data);
        return const JsonEncoder.withIndent('  ').convert(decoded);
      } else if (data is Map || data is List) {
        return const JsonEncoder.withIndent('  ').convert(data);
      }
      return data.toString();
    } on Exception catch (_) {
      return data.toString();
    }
  }

  void _logDivider([String label = '']) {
    '==================== $label ===================='.doPrint();
  }

  @override
  Future<void> onRequest(
      RequestOptions options,
      RequestInterceptorHandler handler,
      ) async {
    _logDivider('REQUEST');
    'URL: ${options.baseUrl}${options.path}'.doPrint();
    'Method: ${options.method}'.doPrint();
    'Headers: ${options.headers}'.doPrint();
    'Query Parameters: ${options.queryParameters}'.doPrint();
    if (options.data != null) {
      'Body:\n${_prettyJson(options.data)}'.doPrint();
    }
    _logDivider();
    return handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    _logDivider('ERROR');
    'URL: ${err.requestOptions.baseUrl}${err.requestOptions.path}'.doPrint();
    'Method: ${err.requestOptions.method}'.doPrint();
    'Status: ${err.response?.statusCode}'.doPrint();
    'Message: ${err.message}'.doPrint();
    if (err.response?.data != null) {
      'Response:\n${_prettyJson(err.response?.data)}'.doPrint();
    }
    _logDivider();
    return handler.next(err);
  }

  @override
  Future<void> onResponse(
      Response<dynamic> response,
      ResponseInterceptorHandler handler,
      ) async {
    _logDivider('RESPONSE');
    'URL: ${response.requestOptions.baseUrl}${response.requestOptions.path}'
        .doPrint();
    'Method: ${response.requestOptions.method}'.doPrint();
    'Status: ${response.statusCode}'.doPrint();
    if (response.data != null) {
      'Body:\n${_prettyJson(response.data)}'.doPrint();
    }
    _logDivider();
    return handler.next(response);
  }
}