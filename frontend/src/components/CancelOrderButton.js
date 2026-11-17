import { useCallback } from 'react';
import { Alert } from 'react-native';
import { AppButton } from '../shared/AppButton';

const CANCELLABLE_STATUSES = ['PENDIENTE', 'CONFIRMADO', 'EN_REVISION'];

function isCancellable(order) {
  return CANCELLABLE_STATUSES.includes(order?.status);
}

export function CancelOrderButton({
  order,
  currentUser,
  onCancel,
  loading = false,
  adminMode = false,
}) {
  const canCancel =
    order &&
    !loading &&
    isCancellable(order) &&
    (adminMode || currentUser?.id === order.buyer?.id || currentUser?.id === order.buyer);

  const handlePress = useCallback(() => {
    const title = adminMode ? 'Cancelar pedido como administrador' : 'Cancelar pedido';
    const message = adminMode
      ? '¿Estás seguro de que querés cancelar este pedido en nombre del cliente? Esta acción no se puede deshacer.'
      : '¿Estás seguro de que querés cancelar este pedido? Esta acción no se puede deshacer.';

    Alert.alert(title, message, [
      { text: 'No cancelar', style: 'cancel' },
      {
        text: adminMode ? 'Sí, cancelar como admin' : 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          const result = await onCancel();
          if (result.success) {
            const refundMsg = result.order?.reembolso
              ? ` Se inició un reembolso de $${result.order.reembolso.monto.toLocaleString('es-AR')}.`
              : '';
            Alert.alert('Pedido cancelado', `El pedido fue cancelado.${refundMsg}`);
          } else {
            Alert.alert('No se pudo cancelar', result.error || 'Intentá de nuevo más tarde.');
          }
        },
      },
    ]);
  }, [adminMode, onCancel]);

  if (!canCancel) {
    return null;
  }

  return (
    <AppButton
      title={adminMode ? 'Cancelar pedido (admin)' : 'Cancelar pedido'}
      onPress={handlePress}
      variant="secondary"
      loading={loading}
      disabled={loading}
    />
  );
}
