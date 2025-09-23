import 'package:equatable/equatable.dart';
import 'package:garage_admin/data/enums/state_status.dart';
import 'package:garage_admin/data/response/service_catalog_response.dart';

class ServiceCatalogState extends Equatable {
  const ServiceCatalogState({
    this.status = StateStatus.initial,
    this.message = '',
    this.serviceList = const [],
    this.totalPages = 0,
    this.totalItems = 0,
    this.currentPage = 1,
  });

  final StateStatus status;
  final String message;
  final List<ServiceCatalog> serviceList;
  final int totalPages;
  final int totalItems;
  final int currentPage;

  ServiceCatalogState copyWith({
    StateStatus? status,
    String? message,
    List<ServiceCatalog>? serviceList,
    int? totalPages,
    int? totalItems,
    int? currentPage,
  }) {
    return ServiceCatalogState(
      status: status ?? this.status,
      message: message ?? this.message,
      serviceList: serviceList ?? this.serviceList,
      totalPages: totalPages ?? this.totalPages,
      totalItems: totalItems ?? this.totalItems,
      currentPage: currentPage ?? this.currentPage,
    );
  }

  @override
  List<Object> get props => [
    status,
    message,
    serviceList,
    totalPages,
    totalItems,
    currentPage,
  ];
}
