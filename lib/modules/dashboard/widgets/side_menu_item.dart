import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:garage_admin/theme/app_colors.dart';

class SideMenuItem extends StatelessWidget {
  const SideMenuItem({
    required this.icon,
    required this.text,
    required this.isSelected,
    required this.onTap,
    super.key,
  });

  final String icon;
  final String text;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).primaryColor;
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8),
        decoration: BoxDecoration(
          color: isSelected ? primary : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        child: Row(
          children: [
            SvgPicture.asset(
              icon,
              width: 20,
              height: 20,
              colorFilter: ColorFilter.mode(
                isSelected ? AppColors.textTitleColor : AppColors.primary,
                BlendMode.srcIn,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                text,
                style: TextStyle(
                  color: AppColors.textTitleColor,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
