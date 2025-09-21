import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/routes/router.dart';
import 'package:garage_admin/theme/app_themes.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends ConsumerStatefulWidget {
  const MyApp({super.key});

  @override
  ConsumerState<MyApp> createState() => _MyAppState();
}

class _MyAppState extends ConsumerState<MyApp> {
  @override
  Widget build(BuildContext context) {
    final initialLocation = RouteNames.login.asPath;

    final router = AppRouter(initialLocation: initialLocation);

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'Garage Admin',
      routerConfig: router.config,
      theme: appTheme(),
    );
  }
}
