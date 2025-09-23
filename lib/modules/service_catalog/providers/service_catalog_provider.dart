import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/core/provider/repo.dart';
import 'package:garage_admin/data/enums/state_status.dart';
import 'package:garage_admin/data/response/service_catalog_response.dart';
import 'package:garage_admin/modules/service_catalog/service_catalog.dart';
import 'package:garage_admin/shared/repo/service_repo.dart';

class ServiceCatalogProvider extends Notifier<ServiceCatalogState> {
  late ServiceRepo _repo;

  @override
  ServiceCatalogState build() {
    _repo = ref.read(serviceRepoProvider);
    return const ServiceCatalogState();
  }

  Future<void> loadServices({int page = 1}) async {
    state = state.copyWith(status: StateStatus.loading);
    final response = await _repo.getServices(page: page, limit: 20);

    final allServices = page == 1
        ? response?.services ?? <ServiceCatalog>[]
        : [...state.serviceList, ...(response?.services ?? <ServiceCatalog>[])];

    state = state.copyWith(
      serviceList: allServices,
      currentPage: response?.page ?? page,
      totalPages: response?.pages ?? 1,
      status: StateStatus.success,
    );
  }

  Future<void> loadNextPage() async {
    if (state.currentPage >= state.totalPages) return;
    await loadServices(page: state.currentPage + 1);
  }
}
