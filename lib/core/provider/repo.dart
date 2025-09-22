import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/shared/repo/auth_repo.dart';

final authRepoProvider = Provider<AuthRepo>((ref) => AuthRepo());
