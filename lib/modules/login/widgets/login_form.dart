import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/core/provider/provider.dart';
import 'package:garage_admin/routes/router.dart';
import 'package:garage_admin/shared/shared.dart';
import 'package:garage_admin/theme/app_colors.dart';

class LoginForm extends ConsumerStatefulWidget {
  const LoginForm({super.key});

  @override
  ConsumerState<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends ConsumerState<LoginForm> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final notifier = ref.read(loginProvider.notifier);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Title
        const Text(
          'Login to your account',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Color(0xFF2d3748),
          ),
          textAlign: TextAlign.center,
        ),

        const SizedBox(height: 32),

        // Email TextField
        CustomTextField(
          controller: _emailController,
          label: 'Email',
          hintText: 'Enter your email',
          prefixIcon: Icons.email_outlined,
          keyboardType: TextInputType.emailAddress,
        ),

        const SizedBox(height: 16),

        // Password TextField
        CustomTextField(
          controller: _passwordController,
          label: 'Password',
          hintText: 'Enter your password',
          prefixIcon: Icons.lock_outlined,
          isPassword: true,
        ),

        const SizedBox(height: 24),

        // Login Button
        ProviderSelector(
          provider: loginProvider,
          selector: (value) => value.status,
          builder: (context, status) {
            return CustomButton(
              text: 'Login',
              isLoading: status.isLoading,
              onPressed: () => notifier.login(
                _emailController.text.trim(),
                _passwordController.text.trim(),
              ),
            );
          },
        ),

        const SizedBox(height: 24),

        // Sign up link
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "Don't have an account? ",
              style: TextStyle(color: Color(0xFF718096), fontSize: 14),
            ),
            GestureDetector(
              onTap: () => context.go(RouteNames.signUp.asPath),
              child: const Text(
                'Get Started',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
