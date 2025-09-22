import 'package:flutter/material.dart';
import 'package:garage_admin/data/models/menu_item.dart';
import 'package:garage_admin/modules/dashboard/dashboard.dart';

class DashboardLayout extends StatefulWidget {
  const DashboardLayout({super.key});

  @override
  State<DashboardLayout> createState() => _DashboardLayoutState();
}

class _DashboardLayoutState extends State<DashboardLayout> {
  int selectedIndex = 0;

  final List<MenuItem> menuItems = [
    const MenuItem('Dashboard', Icons.dashboard, DashboardScreen()),
    const MenuItem('Inventory', Icons.inventory_2, DashboardScreen()),
    const MenuItem('Repair Tracker', Icons.build, DashboardScreen()),
    const MenuItem('Customers', Icons.people, DashboardScreen()),
    const MenuItem('Bookings', Icons.calendar_today, DashboardScreen()),
    const MenuItem('Diagnostics', Icons.analytics, DashboardScreen()),
    const MenuItem('Staff Management', Icons.manage_accounts, DashboardScreen()),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          SideMenuWidget(
            selectedIndex: selectedIndex,
            items: menuItems,
            onItemSelected: (index) {
              setState(() => selectedIndex = index);
            },
          ),
          Expanded(
            child: Container(
              color: Colors.grey[100],
              child: menuItems[selectedIndex].screen,
            ),
          ),
        ],
      ),
    );
  }
}
