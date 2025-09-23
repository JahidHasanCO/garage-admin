class ServiceCatalogResponse {
  ServiceCatalogResponse({
    this.services,
    this.total,
    this.page,
    this.pages,
  });

  factory ServiceCatalogResponse.fromJson(Map<String, dynamic> json) =>
      ServiceCatalogResponse(
        services:
            (json['services'] as List<dynamic>?)
                ?.map((x) => ServiceCatalog.fromJson(x as Map<String, dynamic>))
                .toList() ??
            [],
        total: json['total'] as int?,
        page: json['page'] as int?,
        pages: json['pages'] as int?,
      );

  final List<ServiceCatalog>? services;
  final int? total;
  final int? page;
  final int? pages;
}

class ServiceCatalog {
  ServiceCatalog({
    this.id,
    this.name,
    this.description,
    this.price,
    this.estimatedTime,
    this.image,
    this.discount,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory ServiceCatalog.fromJson(Map<String, dynamic> json) => ServiceCatalog(
    id: json['_id'] as String?,
    name: json['name'] as String?,
    description: json['description'] as String?,
    price: json['price'] as int?,
    estimatedTime: json['estimated_time'] as int?,
    image: json['image'] as String?,
    discount: json['discount'] as int?,
    createdAt: json['createdAt'] == null
        ? null
        : DateTime.parse(json['createdAt'] as String),
    updatedAt: json['updatedAt'] == null
        ? null
        : DateTime.parse(json['updatedAt'] as String),
    v: json['__v'] as int?,
  );

  final String? id;
  final String? name;
  final String? description;
  final int? price;
  final int? estimatedTime;
  final String? image;
  final int? discount;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final int? v;
}
