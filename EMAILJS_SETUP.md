# EmailJS Setup Instructions

This portfolio uses EmailJS to send contact form messages directly to your Gmail.

## Setup Steps:

1. **Create a free EmailJS account**:
   - Go to https://www.emailjs.com/
   - Sign up for a free account (200 emails/month free)

2. **Create an Email Service**:
   - Go to Email Services in the dashboard
   - Click "Add New Service"
   - Choose "Gmail" (or your preferred email provider)
   - Connect your Gmail account
   - Copy the **Service ID** (e.g., `service_xxxxxxx`)

3. **Create an Email Template**:
   - Go to Email Templates in the dashboard
   - Click "Create New Template"
   - Use this template structure:
     ```
     Subject: {{subject}}
     
     From: {{from_name}} ({{from_email}})
     
     Message:
     {{message}}
     ```
   - Set "To Email" to your Gmail address: `goutamsahu602@gmail.com`
   - Copy the **Template ID** (e.g., `template_xxxxxxx`)

4. **Get your Public Key**:
   - Go to Account → General in the dashboard
   - Copy your **Public Key** (e.g., `xxxxxxxxxxxxx`)

5. **Add credentials to your project**:
   - Create a `.env` file in the root directory (if it doesn't exist)
   - Add these variables:
     ```
     VITE_EMAILJS_SERVICE_ID=your_service_id_here
     VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
     VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
     ```
   - Replace the placeholder values with your actual credentials

6. **Restart your development server**:
   ```bash
   npm run dev
   ```

## Testing:

1. Fill out the contact form on your website
2. Submit the form
3. Check your Gmail inbox - you should receive the message!

## Important Notes:

- The `.env` file is already in `.gitignore`, so your credentials won't be committed to GitHub
- For production deployment, add these environment variables in your hosting platform (Vercel/Netlify)
- The free tier allows 200 emails per month

## Troubleshooting:

- If emails aren't sending, check the browser console for errors
- Make sure all three environment variables are set correctly
- Verify your EmailJS service is connected and active
- Check that your template has the correct variable names: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
