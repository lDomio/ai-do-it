import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { AppButton } from '../shared/AppButton';
import StatusBadge from '../components/StatusBadge';
import OrderStepper from '../components/OrderStepper';
import { CancelOrderButton } from '../components/CancelOrderButton';
import { useOrder } from '../hooks/useOrders';
import { useOrderChat } from '../hooks/useOrderChat';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ReviewForm } from '../components/ReviewForm';
import { useCreateReview } from '../hooks/useCreateReview';
import { colors, typography, spacing, borderRadius } from '../theme';

const MAX_MESSAGE_LENGTH = 2000;

export function OrderDetailScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { user } = useAuth();
  const { order, loading: orderLoading, cancelOrder, cancelling, cancelError } = useOrder(orderId);
  const { user: appUser } = useApp();
  const {
    createReview,
    loading: reviewLoading,
    error: reviewError,
    resetError: resetReviewError,
  } = useCreateReview();
  const [isFocused, setIsFocused] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const {
    messages,
    unreadCount,
    loading: chatLoading,
    error,
    sending,
    sendMessage,
    retryMessage,
    validateContent,
  } = useOrderChat(orderId, isFocused);
  const [newMessage, setNewMessage] = useState('');
  const [sendError, setSendError] = useState(null);

  const handleSendMessage = useCallback(async () => {
    setSendError(null);
    const validation = validateContent(newMessage);
    if (!validation.valid) {
      setSendError(validation.error);
      return;
    }

    const result = await sendMessage(newMessage);
    if (result.success) {
      setNewMessage('');
    } else if (result.error) {
      setSendError(result.error);
    }
  }, [newMessage, sendMessage, validateContent]);

  const handleRetry = useCallback(
    async (optimisticId) => {
      setSendError(null);
      const result = await retryMessage(optimisticId);
      if (result.error) {
        setSendError(result.error);
      }
    },
    [retryMessage]
  );

  const handleApprove = () => {
    Alert.alert('Aprobar entrega', '¿Confirmas que el trabajo cumple con lo acordado?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aprobar', onPress: () => Alert.alert('Éxito', 'Trabajo aprobado.') },
    ]);
  };

  const handleRequestRevision = () => {
    Alert.alert('Solicitar revisión', 'Describe los cambios necesarios:', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Enviar', onPress: () => Alert.log('Revisión solicitada') },
    ]);
  };

  const handleStartReview = useCallback(() => {
    setShowReviewForm(true);
    resetReviewError();
  }, [resetReviewError]);

  const handleCancelReview = useCallback(() => {
    setShowReviewForm(false);
    resetReviewError();
  }, [resetReviewError]);

  const handleSubmitReview = useCallback(
    async ({ rating, comment }) => {
      if (!order || !user) return;
      const result = await createReview({
        cliente: user.id || order.buyer?.id,
        gig: order.gig?.id || order.gig,
        pedido: order.id,
        puntuacion: rating,
        detalle: comment,
      });
      if (result.success) {
        setHasReviewed(true);
        setShowReviewForm(false);
        Alert.alert('Éxito', 'Tu reseña ha sido publicada.');
      }
    },
    [createReview, order, user]
  );

  const handleCancelOrder = useCallback(() => cancelOrder(), [cancelOrder]);
  const isAdmin = appUser?.role === 'ADMIN' || user?.role === 'ADMIN';

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => setIsFocused(true));
    const unsubscribeBlur = navigation.addListener('blur', () => setIsFocused(false));
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  if (orderLoading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <AppText variant="body">Cargando...</AppText>
      </View>
    );
  }

  const isOverLimit = newMessage.length > MAX_MESSAGE_LENGTH;
  const canSend = newMessage.trim().length > 0 && !isOverLimit && !sending;

  const renderMessage = (msg) => {
    const isBuyer = msg.senderType === 'BUYER' || msg.senderType === 'CLIENTE';
    const isFailed = msg.status === 'FALLIDO';
    return (
      <View
        key={msg.id}
        style={[
          styles.message,
          isBuyer ? styles.messageBuyer : styles.messageSeller,
          isFailed && styles.messageFailed,
        ]}
      >
        <AppText variant="body" style={styles.messageText}>
          {msg.content}
        </AppText>
        <AppText variant="small" style={styles.messageTime}>
          {new Date(msg.createdAt).toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </AppText>
        {isFailed && (
          <View style={styles.retryRow}>
            <AppText variant="small" style={styles.errorText}>
              No se pudo enviar
            </AppText>
            <TouchableOpacity onPress={() => handleRetry(msg.id)}>
              <AppText variant="small" style={styles.retryText}>
                Reintentar
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={{ uri: order.gig?.images?.[0] }} style={styles.gigImage} />
          <View style={styles.gigInfo}>
            <AppText variant="bodyBold">{order.gig?.title}</AppText>
            <View style={styles.sellerRow}>
              <Image source={{ uri: order.seller?.avatar }} style={styles.sellerAvatar} />
              <AppText variant="caption" style={styles.sellerName}>
                {order.seller?.name}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.statusSection}>
          <StatusBadge status={order.status} />
          <AppText variant="subheading" style={styles.price}>
            ${order.totalPrice?.toLocaleString('es-AR')}
          </AppText>
        </View>

        <View style={styles.stepperContainer}>
          <OrderStepper status={order.status} />
        </View>

        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <AppText variant="caption" style={styles.deliveryLabel}>
              Pedido:
            </AppText>
            <AppText variant="caption">
              {new Date(order.createdAt).toLocaleDateString('es-AR')}
            </AppText>
          </View>
          <View style={styles.deliveryRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <AppText variant="caption" style={styles.deliveryLabel}>
              Entrega:
            </AppText>
            <AppText variant="caption">
              {new Date(order.deliveryDeadline).toLocaleDateString('es-AR')}
            </AppText>
          </View>
          {order.daysRemaining > 0 && (
            <View style={styles.deliveryRow}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
              <AppText variant="caption" style={[styles.deliveryLabel, { color: colors.warning }]}>
                {order.daysRemaining} días restantes
              </AppText>
            </View>
          )}
        </View>

        {order.status === 'ENTREGADO' && !showReviewForm && !hasReviewed && (
          <View style={styles.actionsSection}>
            <AppButton
              title="Calificar servicio"
              onPress={handleStartReview}
              style={styles.actionBtn}
            />
            <AppButton title="Aprobar entrega" onPress={handleApprove} style={styles.actionBtn} />
            <AppButton
              title="Solicitar revisión"
              onPress={handleRequestRevision}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
        )}

        {order.status === 'ENTREGADO' && showReviewForm && !hasReviewed && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={handleCancelReview}
            loading={reviewLoading}
            error={reviewError}
          />
        )}

        {(isAdmin || order.status !== 'CANCELADO') && (
          <View style={styles.actionsSection}>
            <CancelOrderButton
              order={order}
              currentUser={appUser || user}
              onCancel={handleCancelOrder}
              loading={cancelling}
              adminMode={isAdmin}
            />
          </View>
        )}

        {order.status === 'CANCELADO' && (
          <View style={styles.cancelledSection}>
            <Ionicons name="close-circle-outline" size={18} color={colors.error} />
            <View style={styles.cancelledInfo}>
              <AppText variant="caption" style={styles.cancelledText}>
                Pedido cancelado
                {order.canceladoPorRol === 'admin' ? ' por un administrador' : ''}
              </AppText>
              {order.canceladoAt && (
                <AppText variant="small" style={styles.cancelledMeta}>
                  {new Date(order.canceladoAt).toLocaleDateString('es-AR')}
                </AppText>
              )}
            </View>
          </View>
        )}

        {order.status === 'CANCELADO' && order.reembolso && (
          <View style={styles.refundSection}>
            <Ionicons name="cash-outline" size={18} color={colors.success} />
            <AppText variant="caption" style={styles.refundText}>
              Reembolso iniciado: ${order.reembolso.monto.toLocaleString('es-AR')} (
              {order.reembolso.estado})
            </AppText>
          </View>
        )}

        {cancelError && (
          <View style={styles.errorSection}>
            <AppText variant="small" style={styles.errorBanner}>
              {cancelError}
            </AppText>
          </View>
        )}

        <View style={styles.chatSection}>
          <View style={styles.chatHeader}>
            <AppText variant="subheading" style={styles.sectionTitle}>
              Mensajes
            </AppText>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <AppText variant="small" style={styles.unreadText}>
                  {unreadCount}
                </AppText>
              </View>
            )}
          </View>

          {chatLoading && messages.length === 0 ? (
            <AppText variant="caption" style={styles.emptyText}>
              Cargando mensajes...
            </AppText>
          ) : messages.length === 0 ? (
            <AppText variant="caption" style={styles.emptyText}>
              Aún no hay mensajes. Escribe el primero para empezar la conversación.
            </AppText>
          ) : (
            <View style={styles.chatContainer}>{messages.map(renderMessage)}</View>
          )}

          {(error || sendError) && (
            <AppText variant="small" style={styles.errorBanner}>
              {error || sendError}
            </AppText>
          )}

          <View style={styles.messageInput}>
            <TextInput
              style={[styles.input, (isOverLimit || sendError) && styles.inputError]}
              placeholder="Escribe un mensaje..."
              placeholderTextColor={colors.textLight}
              value={newMessage}
              onChangeText={(text) => {
                setNewMessage(text);
                setSendError(null);
              }}
              multiline
              maxLength={MAX_MESSAGE_LENGTH + 1}
              editable={!sending}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
              onPress={handleSendMessage}
              disabled={!canSend}
            >
              {sending ? (
                <Ionicons name="refresh" size={20} color={colors.surface} />
              ) : (
                <Ionicons name="send" size={20} color={colors.surface} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.counterRow}>
            <AppText
              variant="small"
              style={[styles.charCounter, isOverLimit && styles.charCounterError]}
            >
              {newMessage.length}/{MAX_MESSAGE_LENGTH}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gigImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.border,
  },
  gigInfo: {
    flex: 1,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.xs,
    backgroundColor: colors.border,
  },
  sellerName: {
    color: colors.textSecondary,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  price: {
    color: colors.primary,
  },
  stepperContainer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },
  deliveryInfo: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  deliveryLabel: {
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  actionsSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },
  actionBtn: {
    marginBottom: spacing.sm,
  },
  cancelBtn: {
    borderColor: colors.error,
  },
  cancelledSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.errorBg,
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  cancelledInfo: {
    flex: 1,
  },
  cancelledText: {
    color: colors.error,
    fontWeight: '600',
  },
  cancelledMeta: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  refundSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.successBg,
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  refundText: {
    color: colors.success,
    fontWeight: '600',
  },
  errorSection: {
    padding: spacing.md,
    backgroundColor: colors.errorBg,
    marginTop: spacing.xs,
  },
  chatSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginRight: spacing.sm,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  chatContainer: {
    marginBottom: spacing.md,
  },
  message: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  messageBuyer: {
    backgroundColor: colors.primary + '10',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageSeller: {
    backgroundColor: colors.border,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageFailed: {
    borderWidth: 1,
    borderColor: colors.error || '#EF4444',
  },
  messageText: {
    color: colors.text,
  },
  messageTime: {
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.error || '#EF4444',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendBtnDisabled: {
    backgroundColor: colors.textLight,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  charCounter: {
    color: colors.textLight,
  },
  charCounterError: {
    color: colors.error || '#EF4444',
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  errorBanner: {
    color: colors.error || '#EF4444',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  retryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error || '#EF4444',
  },
  retryText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
