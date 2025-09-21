import 'package:flutter/material.dart';
import 'package:garage_admin/modules/sign_up/sign_up.dart';
import 'package:garage_admin/routes/router.dart';

class SignUpPage extends StatelessWidget {
  const SignUpPage({super.key});

  static final route = GoRoute(
    path: RouteNames.signUp.asPath,
    name: RouteNames.signUp,
    builder: (context, state) => const SignUpPage(),
  );

  @override
  Widget build(BuildContext context) {
    return const SignupScreen();
  }
}
