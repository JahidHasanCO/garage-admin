import 'package:garage_admin/core/const/app_url.dart';
import 'package:garage_admin/data/response/login_response.dart';
import 'package:garage_admin/shared/services/network/api_client.dart';
import 'package:garage_admin/utils/extension/object.dart';

class AuthRepo {
  final _client = ApiClient();

  Future<LoginResponse?> login({
    required String email,
    required String password,
  }) async {
    try {
      // Make the POST request
      final response = await _client.dio.postUri<Map<String, dynamic>>(
        Uri.parse(AppUrl.adminLogin),
        data: {
          'email': email,
          'password': password,
        },
      );
      if (response.data != null &&
          response.statusCode != null &&
          response.statusCode! >= 200 &&
          response.statusCode! < 300) {
        return LoginResponse.fromJson(response.data!);
      } else {
        response.statusCode?.doPrint(prefix: 'Login failed: ');
        return null;
      }
    } on Exception catch (e) {
      e.doPrint(prefix: 'Login failed: ');
      return null;
    }
  }
}
