import { mapOrder } from "../helper/orders.mapper";
import { updateOrderPaymentFromMidtrans } from "../repo/orders.repo";
import { mapMidtransPaymentStatus, verifyMidtransNotification } from "./midtrans.service";

export async function handleMidtransNotification(body: unknown) {
  const notification = verifyMidtransNotification(body as Parameters<typeof verifyMidtransNotification>[0]);
  const paymentStatus = mapMidtransPaymentStatus(notification.transactionStatus, notification.fraudStatus);
  const order = await updateOrderPaymentFromMidtrans(notification.orderId, {
    paymentStatus,
    transactionStatus: notification.transactionStatus,
    fraudStatus: notification.fraudStatus,
    paymentType: notification.paymentType,
    transactionId: notification.transactionId,
    transactionTime: notification.transactionTime,
    settlementTime: notification.settlementTime,
  });

  return mapOrder(order);
}
