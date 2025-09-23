import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/core/provider/provider.dart';
import 'package:garage_admin/routes/router.dart';
import 'package:garage_admin/shared/services/network/api_client.dart';
import 'package:garage_admin/theme/app_themes.dart';
import 'package:garage_admin/utils/extension/ref.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends ConsumerStatefulWidget {
  const MyApp({super.key});

  @override
  ConsumerState<MyApp> createState() => _MyAppState();
}

class _MyAppState extends ConsumerState<MyApp> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await ref.read(appProvider.notifier).onInit();
    });
  }

  @override
  Widget build(BuildContext context) {
    final accessToken = ref.select(appProvider, (s) => s.accessToken);
    final initialLocation = accessToken != null && accessToken.isNotEmpty
        ? RouteNames.dashboard.asPath
        : RouteNames.login.asPath;

    final router = AppRouter(initialLocation: initialLocation);
    ApiClient(accessToken: accessToken, isNewIns: true);
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'Garage Admin',
      routerConfig: router.config,
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        scrollbars: false,
      ),
      theme: appTheme(),
    );
  }
}
