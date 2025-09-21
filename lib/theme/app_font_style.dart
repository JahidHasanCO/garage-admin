import 'package:flutter/material.dart';
import 'package:garage_admin/theme/theme.dart';

class AppFontStyles {
  /// title text style
  static const titleLarge = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textTitleColor,
    fontSize: 20,
    fontWeight: FontWeight.w600,
  );

  static const titleMedium = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textTitleColor,
    fontSize: 16,
    fontWeight: FontWeight.w500,
  );

  static const titleNormal = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textTitleColor,
    fontSize: 14,
    fontWeight: FontWeight.w400,
  );

  static const titleSmall = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textTitleColor,
    fontSize: 12,
    fontWeight: FontWeight.w400,
  );

  /// subtitle text style
  static const subTitleNormal = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textSubtitleColor,
    fontSize: 14,
    fontWeight: FontWeight.w400,
  );

  static const subTitleMedium = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textSubtitleColor,
    fontSize: 14,
    fontWeight: FontWeight.w500,
  );

  static const labelText = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textGrayColor,
    fontSize: 12,
    fontWeight: FontWeight.w400,
  );

  static const textNormal = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textTitleColor,
    fontSize: 12,
    fontWeight: FontWeight.w400,
  );

  static const textSmall = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.textTitleColor,
    fontSize: 10,
    fontWeight: FontWeight.w400,
  );

  /// button text style
  static const buttonText = TextStyle(
    fontFamily: 'Inter',
    color: AppColors.whiteColor,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    fontStyle: FontStyle.normal,
  );
}
