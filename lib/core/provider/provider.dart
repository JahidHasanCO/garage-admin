import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/app/app.dart';
import 'package:garage_admin/modules/login/providers/login_provider.dart';
import 'package:garage_admin/modules/login/providers/login_state.dart';
import 'package:garage_admin/modules/service_catalog/service_catalog.dart';


final appProvider = NotifierProvider<AppProvider, AppState>(
  AppProvider.new,
);

final loginProvider = NotifierProvider<LoginProvider, LoginState>(
  LoginProvider.new,
);

final serviceCatalogProvider = NotifierProvider<
    ServiceCatalogProvider,
    ServiceCatalogState>(
  ServiceCatalogProvider.new,
);
