import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/misc.dart';

extension RefSelectorExtension on WidgetRef {
  T select<P, T>(ProviderListenable<P> provider, T Function(P value) selector) {
    return watch(provider.select(selector));
  }
}
