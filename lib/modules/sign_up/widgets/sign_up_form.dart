import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:garage_admin/routes/router.dart';

import 'package:garage_admin/shared/shared.dart';
import 'package:garage_admin/theme/app_colors.dart';

class SignupForm extends StatefulWidget {
  const SignupForm({super.key});

  @override
  State<SignupForm> createState() => _SignupFormState();
}

class _SignupFormState extends State<SignupForm> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool _agreedToTerms = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Title
        const Text(
          'Create your account',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Color(0xFF2d3748),
          ),
          textAlign: TextAlign.center,
        ),

        const SizedBox(height: 32),

        // First Name and Last Name in row
        Row(
          children: [
            Expanded(
              child: CustomTextField(
                controller: _firstNameController,
                label: 'First Name',
                hintText: 'Enter your first name',
                prefixIcon: Icons.person_outlined,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: CustomTextField(
                controller: _lastNameController,
                label: 'Last Name',
                hintText: 'Enter your last name',
                prefixIcon: Icons.person_outlined,
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

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

        const SizedBox(height: 16),

        // Confirm Password TextField
        CustomTextField(
          controller: _confirmPasswordController,
          label: 'Confirm Password',
          hintText: 'Confirm your password',
          prefixIcon: Icons.lock_outlined,
          isPassword: true,
        ),

        const SizedBox(height: 20),

        Row(
          children: [
            Checkbox(
              value: _agreedToTerms,
              onChanged: (value) {
                setState(() {
                  _agreedToTerms = value ?? false;
                });
              },
              activeColor: AppColors.primary,
              visualDensity: VisualDensity.compact,
            ),
            Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _agreedToTerms = !_agreedToTerms;
                  });
                },
                child: RichText(
                  text: TextSpan(
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.textSubtitleColor,
                    ),
                    children: [
                      const TextSpan(
                        text: 'By proceeding, you agree to the ',
                      ),
                      TextSpan(
                        text: 'Terms and Conditions',
                        style: const TextStyle(
                          color: AppColors.primary,
                          decoration: TextDecoration.underline,
                        ),
                        recognizer: TapGestureRecognizer()..onTap = () {},
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 24),

        // Signup Button
        CustomButton(
          text: 'Sign up with email',
          onPressed: _agreedToTerms
              ? () {
                  // Handle signup logic here
                  print('First Name: ${_firstNameController.text}');
                  print('Last Name: ${_lastNameController.text}');
                  print('Email: ${_emailController.text}');
                  print('Password: ${_passwordController.text}');
                  print('Confirm Password: ${_confirmPasswordController.text}');
                  print('Agreed to Terms: $_agreedToTerms');
                }
              : null,
        ),

        const SizedBox(height: 24),

        // Login link
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Already have an account? ',
              style: TextStyle(color: Color(0xFF718096), fontSize: 14),
            ),
            GestureDetector(
              onTap: () => context.go(RouteNames.login.asPath),
              child: const Text(
                'Login Now',
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

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
