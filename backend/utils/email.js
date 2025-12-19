import nodemailer from "nodemailer";

// Create email transporter
const createTransporter = () => {
    // For development, use ethereal email (fake SMTP service)
    // For production, use real SMTP service like Gmail, SendGrid, etc.

    if (process.env.NODE_ENV === "production") {
        return nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else {
        // Development - log emails to console
        return nodemailer.createTransporter({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: process.env.SMTP_USER || "test@ethereal.email",
                pass: process.env.SMTP_PASS || "test123"
            }
        });
    }
};

// Send email function
export const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `${process.env.FROM_NAME || "Aquarium Commerce"} <${process.env.FROM_EMAIL || "noreply@aquariumcommerce.com"}>`,
            to: options.to,
            subject: options.subject,
            html: options.html || options.text
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.messageId);

        if (process.env.NODE_ENV !== "production") {
            console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error("Email error:", error);
        throw new Error("Failed to send email");
    }
};

// Email templates
export const emailTemplates = {
    // Welcome email
    welcome: (name, role) => ({
        subject: "Welcome to Aquarium Commerce!",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Aquarium Commerce!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for registering as a <strong>${role}</strong>.</p>
        ${role === "customer"
                ? "<p>You can now start browsing and purchasing aquarium products from our retailers.</p>"
                : "<p>Your account is pending admin approval. You'll receive an email once your account is approved.</p>"
            }
        <p>Best regards,<br>Aquarium Commerce Team</p>
      </div>
    `
    }),

    // Account approved
    accountApproved: (name, role) => ({
        subject: "Your Account Has Been Approved!",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Account Approved! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Great news! Your <strong>${role}</strong> account has been approved.</p>
        <p>You can now log in and start ${role === "retailer" ? "ordering from wholesalers and selling to customers" : "adding products and selling to retailers"}.</p>
        <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Login Now</a>
        <p>Best regards,<br>Aquarium Commerce Team</p>
      </div>
    `
    }),

    // Account rejected
    accountRejected: (name, role, reason) => ({
        subject: "Account Application Update",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">Account Application Status</h1>
        <p>Hi ${name},</p>
        <p>We regret to inform you that your <strong>${role}</strong> account application has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>Aquarium Commerce Team</p>
      </div>
    `
    }),

    // Order confirmation
    orderConfirmation: (orderNumber, totalAmount, items) => ({
        subject: `Order Confirmation - #${orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Order Confirmed! 🎉</h1>
        <p>Your order has been placed successfully.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order #${orderNumber}</h2>
          <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
          <h3>Items:</h3>
          <ul>
            ${items.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.subtotal.toFixed(2)}</li>`).join("")}
          </ul>
        </div>
        <p>You'll receive another email when your order is shipped.</p>
        <p>Best regards,<br>Aquarium Commerce Team</p>
      </div>
    `
    }),

    // Order shipped
    orderShipped: (orderNumber, trackingNumber) => ({
        subject: `Your Order Has Been Shipped - #${orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Order Shipped! 📦</h1>
        <p>Your order #${orderNumber} has been shipped.</p>
        ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ""}
        <p>You should receive your order within 5-7 business days.</p>
        <p>Best regards,<br>Aquarium Commerce Team</p>
      </div>
    `
    }),

    // New order notification (for seller)
    newOrderNotification: (orderNumber, buyerName, totalAmount) => ({
        subject: `New Order Received - #${orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Order Received! 🛒</h1>
        <p>You have received a new order from <strong>${buyerName}</strong>.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order Number:</strong> #${orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
        </div>
        <p>Please log in to your dashboard to process this order.</p>
        <a href="${process.env.FRONTEND_URL}/orders/${orderNumber}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">View Order</a>
        <p>Best regards,<br>Aquarium Commerce Team</p>
      </div>
    `
    })
};

// Send welcome email
export const sendWelcomeEmail = async (email, name, role) => {
    const template = emailTemplates.welcome(name, role);
    await sendEmail({
        to: email,
        ...template
    });
};

// Send account approved email
export const sendAccountApprovedEmail = async (email, name, role) => {
    const template = emailTemplates.accountApproved(name, role);
    await sendEmail({
        to: email,
        ...template
    });
};

// Send account rejected email
export const sendAccountRejectedEmail = async (email, name, role, reason) => {
    const template = emailTemplates.accountRejected(name, role, reason);
    await sendEmail({
        to: email,
        ...template
    });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, orderNumber, totalAmount, items) => {
    const template = emailTemplates.orderConfirmation(orderNumber, totalAmount, items);
    await sendEmail({
        to: email,
        ...template
    });
};

// Send order shipped email
export const sendOrderShippedEmail = async (email, orderNumber, trackingNumber) => {
    const template = emailTemplates.orderShipped(orderNumber, trackingNumber);
    await sendEmail({
        to: email,
        ...template
    });
};

// Send new order notification to seller
export const sendNewOrderNotification = async (email, orderNumber, buyerName, totalAmount) => {
    const template = emailTemplates.newOrderNotification(orderNumber, buyerName, totalAmount);
    await sendEmail({
        to: email,
        ...template
    });
};

export default {
    sendEmail,
    sendWelcomeEmail,
    sendAccountApprovedEmail,
    sendAccountRejectedEmail,
    sendOrderConfirmationEmail,
    sendOrderShippedEmail,
    sendNewOrderNotification
};
