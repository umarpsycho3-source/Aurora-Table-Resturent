const enabled = String(process.env.EMAIL_ENABLED || 'false') === 'true';
const from = process.env.EMAIL_FROM || 'Aurora Table <hello@auroratable.local>';

export const buildOrderEmail = (order) => ({
  to: order.email,
  subject: `Aurora Table order #${order.id} received`,
  text: [
    `Hi ${order.customer_name},`,
    `We received your order #${order.id}.`,
    `Total: $${Number(order.total).toFixed(2)}`,
    `Status: ${order.status}`
  ].join('\n')
});

export const buildBookingEmail = (booking) => ({
  to: booking.email,
  subject: `Aurora Table booking request #${booking.id}`,
  text: [
    `Hi ${booking.name},`,
    `Your table request is in our queue.`,
    `Date: ${booking.booking_date}`,
    `Time: ${booking.booking_time}`,
    `Guests: ${booking.guests}`,
    `Table: ${booking.table_type || 'Chef Table'}`,
    `Service: ${booking.service_style || 'A la carte'}`
  ].join('\n')
});

export const queueEmail = async (email) => {
  if (!email.to) return { skipped: true, reason: 'No recipient email supplied.' };
  if (!enabled) {
    console.log('[email:preview]', { from, ...email });
    return { preview: true };
  }
  // Replace this block with Nodemailer, Resend, SendGrid, or your SMTP provider.
  console.log('[email:queued]', { from, ...email });
  return { queued: true };
};
