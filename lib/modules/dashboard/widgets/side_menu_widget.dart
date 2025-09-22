import 'package:flutter/material.dart';
import 'package:garage_admin/data/models/menu_item.dart';
import 'package:garage_admin/modules/dashboard/dashboard.dart';

class SideMenuWidget extends StatelessWidget {
  const SideMenuWidget({
    required this.selectedIndex,
    required this.items,
    required this.onItemSelected,
    super.key,
  });

  final int selectedIndex;
  final List<MenuItem> items;
  final ValueChanged<int> onItemSelected;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      width:220 ,
      color: Colors.white,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 10, 10, 20),
            child: Image.asset(
              'assets/images/logo.png',
              width: 100,
              height: 100,
              fit: BoxFit.scaleDown,
            ),
          ),
          /// Menu Items
          Expanded(
            child: ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                return SideMenuItem(
                  icon: item.icon,
                  text: item.title,
                  isSelected: selectedIndex == index,
                  onTap: () => onItemSelected(index),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
