import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/core/provider/provider.dart';
import 'package:garage_admin/modules/service_catalog/service_catalog.dart';
import 'package:garage_admin/shared/shared.dart';
import 'package:garage_admin/theme/app_colors.dart';
import 'package:garage_admin/utils/extension/ref.dart';

class ServiceCatalogScreen extends ConsumerStatefulWidget {
  const ServiceCatalogScreen({super.key});

  @override
  ServiceCatalogScreenState createState() => ServiceCatalogScreenState();
}

class ServiceCatalogScreenState extends ConsumerState<ServiceCatalogScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(serviceCatalogProvider.notifier).loadServices();
    });
  }

  @override
  Widget build(BuildContext context) {
    final notifier = ref.read(serviceCatalogProvider.notifier);

    final status = ref.select(serviceCatalogProvider, (state) => state.status);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Table
          Expanded(
            child: status.isLoading
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minWidth: MediaQuery.of(
                          context,
                        ).size.width, // horizontal bound
                        maxWidth: MediaQuery.of(context).size.width,
                      ),
                      child: SizedBox(
                        height:
                            MediaQuery.of(context).size.height *
                            0.6, // give vertical bound
                        child: SingleChildScrollView(
                          child: ProviderSelector(
                            provider: serviceCatalogProvider,
                            selector: (state) => state.serviceList,
                            builder: (context, serviceList) {
                              if (serviceList.isEmpty) {
                                return const Center(
                                  child: Text('No services available.'),
                                );
                              }
                              return ServiceCatalogTable(
                                serviceList: serviceList,
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                  ),
          ),

          const SizedBox(height: 16),

          // Pagination
          if (!status.isLoading)
            Builder(
              builder: (context) {
                final totalPages = ref.select(
                  serviceCatalogProvider,
                  (state) => state.totalPages,
                );
                final currentPage = ref.select(
                  serviceCatalogProvider,
                  (state) => state.currentPage,
                );
                return Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(totalPages, (index) {
                    final pageNumber = index + 1;
                    final isCurrent = pageNumber == currentPage;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isCurrent
                              ? AppColors.primaryDeep
                              : Colors.grey[300],
                          foregroundColor: isCurrent
                              ? Colors.white
                              : Colors.black,
                          minimumSize: const Size(40, 40),
                        ),
                        onPressed: () {
                          notifier.loadServices(page: pageNumber);
                        },
                        child: Text('$pageNumber'),
                      ),
                    );
                  }),
                );
              },
            ),
        ],
      ),
    );
  }
}
