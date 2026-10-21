import React, { Suspense } from 'react';
import OrderConfirmationClient from './OrderConfirmationClient';

export async function generateStaticParams() {
  return [{ orderId: 'TS-SAMPLE' }];
}

export const metadata = {
  title: 'Order Confirmed — TEESOULZ',
  description: 'Thank you for your order. Live tracking and details.',
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs">Loading order...</div>}>
      <OrderConfirmationClient orderId={orderId} />
    </Suspense>
  );
}
