# EJM Services Email Form

A functional email sender built with Next.js and Resend API, featuring a rich text editor and file attachments.

## Features

- **Rich Text Editor**: Format emails with bold, italic, underline, bullets, numbered lists, and hyperlinks
- **Multiple Recipients**: Send to multiple email addresses (comma-separated)
- **File Attachments**: Support for multiple file attachments
- **Live Preview**: See exactly how your email will look before sending
- **Modern UI**: Clean, dark-themed interface with responsive design
- **Custom Sender**: Configurable sender email (defaults to info@ejm.services)

## Setup

1. Clone the repository and install dependencies:

```sh
npm install
```

2. Set up environment variables:

```sh
cp .env.example .env
```

Edit `.env` and add your Resend API key:

```env
RESEND_API_KEY=your_resend_api_key_here
```

3. Run the development server:

```sh
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Fill in the email form:
   - **From**: Your sender email address
   - **To**: Recipient email addresses (comma-separated for multiple)
   - **Subject**: Email subject line
   - **Body**: Use the rich text editor to format your message
   - **Attachments**: Select files to attach (optional)

2. Click **Send Email** to deliver your message

## API Endpoints

### POST /api/send

Sends an email with the provided data.

**Request**: `multipart/form-data`

- `to` (string, required): Recipient email addresses (comma-separated)
- `subject` (string, required): Email subject
- `body` (string, required): HTML email content
- `from` (string, optional): Sender email (defaults to info@ejm.services)
- `attachments` (file, optional): File attachments (multiple)

## Technical Details

- **Framework**: Next.js (App Router)
- **Email Service**: Resend
- **Styling**: Custom CSS with modern dark theme
- **Rich Text**: Built using contentEditable with execCommand

## License

MIT License
