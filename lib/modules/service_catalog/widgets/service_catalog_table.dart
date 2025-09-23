import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:garage_admin/data/response/service_catalog_response.dart';
import 'package:garage_admin/theme/app_colors.dart';
import 'package:intl/intl.dart';

class ServiceCatalogTable extends ConsumerWidget {
  const ServiceCatalogTable({required this.serviceList, super.key});

  final List<ServiceCatalog> serviceList;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dateFormatter = DateFormat('yyyy-MM-dd HH:mm');

    return DataTable(
      headingRowColor: WidgetStateProperty.all(Colors.white),
      dataRowColor: WidgetStateProperty.resolveWith<Color?>(
            (Set<WidgetState> states) {
          if (states.contains(WidgetState.selected)) {
            return Theme.of(context).colorScheme.primary.withValues(alpha: 0.05);
          }
          return null;
        },
      ),
      dividerThickness: 1,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
      ),
      columnSpacing: 20,
      horizontalMargin: 12,
      headingTextStyle: const TextStyle(
        fontWeight: FontWeight.w600,
        color: AppColors.textGrayColor,
      ),
      columns: const [
        DataColumn(label: Text('Name')),
        DataColumn(label: Text('Description')),
        DataColumn(label: Text('Price')),
        DataColumn(label: Text('Estimated Time')),
        DataColumn(label: Text('Discount')),
        DataColumn(label: Text('Created At')),
        DataColumn(label: Text('Updated At')),
        DataColumn(label: Text('Actions')), // ✅ new actions column
      ],
      rows: serviceList.map((service) {
        return DataRow(
          cells: [
            DataCell(
              Text(
                service.name ?? '-',
                style: const TextStyle(fontWeight: FontWeight.w500),
              ),
            ),
            DataCell(
              SizedBox(
                width: 200,
                child: Text(
                  service.description ?? '-',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: Colors.black54),
                ),
              ),
            ),
            DataCell(Text('\$${service.price?.toStringAsFixed(2) ?? '0.00'}')),
            DataCell(Text('${service.estimatedTime ?? 0} mins')),
            DataCell(Text('${service.discount ?? 0} %')),
            DataCell(
              Text(
                service.createdAt != null
                    ? dateFormatter.format(service.createdAt!)
                    : '-',
                style: const TextStyle(fontSize: 12, color: Colors.black87),
              ),
            ),
            DataCell(
              Text(
                service.updatedAt != null
                    ? dateFormatter.format(service.updatedAt!)
                    : '-',
                style: const TextStyle(fontSize: 12, color: Colors.black54),
              ),
            ),
            DataCell(
              ElevatedButton(
                onPressed: () {
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey[200],
                  foregroundColor: Colors.black87,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                ),
                child: Icon(
                  Icons.more_vert,
                  size: 20,
                  color: Colors.grey[700],
                ),
              ),
            ),
          ],
        );
      }).toList(),
    );
  }
}
