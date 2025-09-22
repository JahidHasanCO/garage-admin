import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/core/provider/provider.dart';
import 'package:garage_admin/data/enums/state_status.dart';
import 'package:garage_admin/modules/login/login.dart';
import 'package:garage_admin/modules/login/providers/login_state.dart';
import 'package:garage_admin/routes/router.dart';
import 'package:garage_admin/theme/app_colors.dart';
import 'package:garage_admin/theme/app_gaps.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  void _listenMessage(BuildContext context, WidgetRef ref) {
    ref.listen<LoginState>(loginProvider, (previous, next) {
      if (next.status == StateStatus.error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.message),
            backgroundColor: Colors.red,
          ),
        );
      } else if (next.status == StateStatus.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.message),
            backgroundColor: Colors.green,
          ),
        );
        context.go(RouteNames.dashboard.asPath);
      }
    });
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    _listenMessage(context, ref);
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 150,
                  height: 150,
                  fit: BoxFit.contain,
                ),
              ),
              // White container with login form
              Container(
                width: 400,
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 20,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const LoginForm(),
              ),
              AppGaps.gap20,
            ],
          ),
        ),
      ),
    );
  }
}
