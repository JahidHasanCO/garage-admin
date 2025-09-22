import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:garage_admin/theme/theme.dart';

ThemeData appTheme() {
  return ThemeData(
    fontFamily: 'Roboto',
    scaffoldBackgroundColor: AppColors.whiteColor,
    primaryColor: AppColors.primary,
    colorScheme: const ColorScheme(
      brightness: Brightness.light,
      primary: AppColors.primary,
      onPrimary: AppColors.whiteColor,
      secondary: AppColors.primary,
      onSecondary: AppColors.textSubtitleColor,
      error: AppColors.errorColor,
      onError: AppColors.errorColor,
      surface: AppColors.backgroundColor,
      onSurface: AppColors.textTitleColor,
    ),
    outlinedButtonTheme: outlinedButtonTheme(),
    dividerColor: AppColors.dividerColor,
    appBarTheme: appBarTheme(),
    dialogTheme: const DialogThemeData(backgroundColor: AppColors.whiteColor),
  );
}

AppBarTheme appBarTheme() {
  return const AppBarTheme(
    color: AppColors.backgroundColor,
    elevation: 0,
    centerTitle: false,
    systemOverlayStyle: SystemUiOverlayStyle(
      statusBarColor: AppColors.backgroundColor, // Status bar
      statusBarBrightness: Brightness.dark,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: AppColors.backgroundColor,
    ),
    iconTheme: IconThemeData(color: AppColors.textTitleColor),
    titleTextStyle: TextStyle(
      color: AppColors.textTitleColor,
      fontSize: 16,
      fontFamily: 'Roboto',
      fontWeight: FontWeight.w600,
    ),
  );
}

OutlinedButtonThemeData outlinedButtonTheme() {
  return OutlinedButtonThemeData(
    style: ButtonStyle(
      minimumSize: WidgetStateProperty.all(const Size(double.infinity, 48)),
      shape: WidgetStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      side: WidgetStateProperty.all(
        const BorderSide(color: AppColors.outline, width: .5),
      ),
      padding: WidgetStateProperty.all(
        const EdgeInsets.symmetric(
          vertical: 12,
          horizontal: 24,
        ),
      ),
      textStyle: WidgetStateProperty.all(
        const TextStyle(
          fontSize: 16,
          fontFamily: 'Roboto',
          fontWeight: FontWeight.w500,
        ),
      ),
      foregroundColor: WidgetStateProperty.all(AppColors.outline),
      overlayColor: WidgetStateProperty.all(AppColors.outline.withAlpha(10)),
    ),
  );
}
