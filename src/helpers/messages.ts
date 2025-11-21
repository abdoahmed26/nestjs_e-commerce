

export const afterRegister = (name: string)=>{
    return `
        <h2>Welcome to Our Store 🎉</h2>
        <p>Hi ${name},</p>

        <p>We're excited to have you join our community! Your account has been successfully created.</p>

        <p>From now on, you can:</p>
        <ul>
            <li>Browse hundreds of products</li>
            <li>Save items to your wishlist</li>
            <li>Place orders quickly</li>
            <li>Track your orders anytime</li>
        </ul>

        <p>If you ever need help, we're always here for you ❤️</p>

        <p>Enjoy your shopping!</p>

        <p><strong>– The Store Team</strong></p>
    `
}

export const afterOrder = (name: string, orderId: string, total: number, items: {name: string, quantity: number, price: number}[])=>{
    const all = items.map(item => {
        return `
            <li>${item.name} ==>  ${item.quantity * item.price} EGP</li>
        `
    }).join('')
    return `
        <h2>Your Order Has Been Received ✔️</h2>

        <p>Hi ${name},</p>

        <p>Thank you for shopping with us! We have received your order and it's now being processed.</p>

        <p><strong>Order Details:</strong></p>
        <p>Order ID: <strong>${orderId}</strong></p>
        <p>Total Amount: <strong>${total} EGP</strong></p>

        <h3>Items:</h3>
        <ul>
            ${all}
        </ul>

        <p>We’ll notify you again once your order has been shipped 🚚</p>

        <p>Thank you for choosing us ❤️</p>

        <p><strong>– The Store Team</strong></p>
    `
}

export const afterForgetPass = (name: string, link: string)=>{
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Reset Your Password</h2>

                <p style="font-size: 15px; color: #555;">
                    Hello ${name},
                    <br><br>
                    We received a request to reset your password.  
                    Click the button below to reset it:
                </p>

                <a href=${link} target="_blank"
                style="display: inline-block; margin: 20px 0; background: #007bff; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                    Reset Password
                </a>

                <p style="font-size: 14px; color: #777;">
                    This link is valid for <strong>5 minutes</strong>.  
                    If you did not request this, you can safely ignore this email.
                </p>

                <p style="margin-top: 30px; font-size: 12px; color: #aaa;">
                    <strong>– The Store Team</strong>
                </p>
            </div>
        </div>
    `
}