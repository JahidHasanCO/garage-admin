import 'package:flutter/material.dart';
import 'package:garage_admin/modules/dashboard/dashboard.dart';
import 'package:garage_admin/routes/router.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  static final route = GoRoute(
    path: RouteNames.dashboard.asPath,
    name: RouteNames.dashboard,
    builder: (context, state) => const DashboardPage(),
  );


  @override
  Widget build(BuildContext context) {
    return const DashboardLayout();
  }
}
