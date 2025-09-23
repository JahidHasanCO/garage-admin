import 'package:dio/dio.dart';
import 'package:garage_admin/core/const/app_url.dart';
import 'package:garage_admin/data/response/service_catalog_response.dart';
import 'package:garage_admin/shared/services/network/api_client.dart';
import 'package:garage_admin/utils/extension/object.dart';

class ServiceRepo {
  final _client = ApiClient();

  Future<ServiceCatalogResponse?> getServices({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.dio.get<Map<String, dynamic>>(
        AppUrl.services,
        queryParameters: {
          'page': page,
          'limit': limit,
        },
      );

      if (response.statusCode == 200 && response.data != null) {
        return ServiceCatalogResponse.fromJson(response.data!);
      } else {
        'Failed to load services'.doPrint(level: 3);
      }
    } on DioException catch (e) {
      'DioError: ${e.message}'.doPrint(level: 3);
    }
    return null;
  }
}
