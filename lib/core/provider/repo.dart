import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/shared/repo/auth_repo.dart';
import 'package:garage_admin/shared/repo/service_repo.dart';

final authRepoProvider = Provider<AuthRepo>((ref) => AuthRepo());
final serviceRepoProvider = Provider<ServiceRepo>((ref) => ServiceRepo());
