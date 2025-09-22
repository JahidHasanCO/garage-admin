import 'package:flutter/material.dart';

class MenuItem {
  const MenuItem(this.title, this.icon, this.screen);

  final String title;
  final IconData icon;
  final Widget screen;
}
