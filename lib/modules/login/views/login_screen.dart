import 'package:flutter/material.dart';
import 'package:garage_admin/modules/login/login.dart';
import 'package:garage_admin/theme/app_colors.dart';
import 'package:garage_admin/theme/app_gaps.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary.withValues(alpha: 0.35),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: Image.asset(
                  'assets/images/logo_black.png',
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
