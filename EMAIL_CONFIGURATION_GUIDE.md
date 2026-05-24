# 📧 Email Configuration Guide - Change OTP Sender Email

This guide will help you change the email address used to send OTP (One-Time Password) codes in your SmartFix system.

---

## 📍 Current Configuration

**Current Email**: `ishimwedidace@gmail.com`  
**Current App Password**: `rkratdyxpjeqaevk`  
**SMTP Server**: Gmail (smtp.gmail.com)  
**Port**: 587 (TLS)

---

## 🔧 How to Change Email Configuration

### Step 1: Prepare Your New Email Account

#### Option A: Using Gmail (Recommended)

1. **Create or use an existing Gmail account**
   - Example: `yournewemail@gmail.com`

2. **Enable 2-Factor Authentication (2FA)**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

3. **Generate App Password** (IMPORTANT!)
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "SmartFix OTP System"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
   - Remove spaces: `abcdefghijklmnop`

#### Option B: Using Other Email Providers

**Outlook/Hotmail:**
- SMTP Host: `smtp-mail.outlook.com`
- Port: `587`
- Username: Your full email address
- Password: Your account password (or app password if 2FA enabled)

**Yahoo Mail:**
- SMTP Host: `smtp.mail.yahoo.com`
- Port: `587`
- Username: Your full email address
- Password: Generate app password at https://login.yahoo.com/account/security

**Custom Domain (e.g., company email):**
- Contact your email provider for SMTP settings
- Usually requires: host, port, username, password

---

### Step 2: Update Configuration File

**File Location**: `smartfix/src/main/resources/application.properties`

**Find these lines** (around line 23-27):

```properties
# EMAIL (SMTP - GMAIL)
# ==============================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=ishimwedidace@gmail.com
spring.mail.password=rkratdyxpjeqaevk
```

**Replace with your new email:**

```properties
# EMAIL (SMTP - GMAIL)
# ==============================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_NEW_EMAIL@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
```

**Example:**
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=smartfix.system@gmail.com
spring.mail.password=abcdefghijklmnop
```

---

### Step 3: For Non-Gmail Providers

If using **Outlook**, change to:
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password-here
```

If using **Yahoo**, change to:
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password-here
```

If using **Custom SMTP Server**:
```properties
spring.mail.host=mail.yourdomain.com
spring.mail.port=587
spring.mail.username=noreply@yourdomain.com
spring.mail.password=your-password-here
```

---

### Step 4: Restart the Backend

After changing the configuration:

1. **Stop the backend** (if running)
   - Press `Ctrl+C` in the terminal

2. **Rebuild and restart**:
   ```bash
   cd smartfix
   mvn clean package -DskipTests
   mvn spring-boot:run
   ```

3. **Verify startup logs** - Look for:
   ```
   Started SmartfixApplication in X.XXX seconds
   ```

---

## 🧪 Testing the New Email Configuration

### Test 1: Login with OTP

1. Go to login page: `http://localhost:3000/login`
2. Enter a user email
3. Click "Send OTP"
4. Check the inbox of the user's email
5. Verify OTP email arrives from your new sender email

### Test 2: Check Email Content

The OTP email should look like:

```
From: YOUR_NEW_EMAIL@gmail.com
To: user@example.com
Subject: SmartFix — Login Verification Code

Hello,

Your one-time verification code for SmartFix is:

        123456

This code expires in 5 minutes.
Do not share it with anyone.

If you did not request this, please ignore this email.

— SmartFix Security Team
```

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use a dedicated email account for the system (e.g., `noreply@yourdomain.com`)
- ✅ Always use App Passwords (never your main account password)
- ✅ Enable 2-Factor Authentication on the email account
- ✅ Keep the app password secure (don't commit to public repositories)
- ✅ Use environment variables for production (see below)

### ❌ DON'T:
- ❌ Use your personal email account
- ❌ Share the app password publicly
- ❌ Commit passwords to Git (add to .gitignore)
- ❌ Use the same password for multiple services

---

## 🌍 Production Deployment (Environment Variables)

For production, use environment variables instead of hardcoding:

### Option 1: Environment Variables

**In application.properties**, change to:
```properties
spring.mail.host=${MAIL_HOST:smtp.gmail.com}
spring.mail.port=${MAIL_PORT:587}
spring.mail.username=${MAIL_USERNAME:default@gmail.com}
spring.mail.password=${MAIL_PASSWORD:defaultpassword}
```

**Then set environment variables:**

**Windows:**
```cmd
set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set MAIL_USERNAME=your-email@gmail.com
set MAIL_PASSWORD=your-app-password
```

**Linux/Mac:**
```bash
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### Option 2: External Configuration File

Create `application-prod.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=production-email@gmail.com
spring.mail.password=production-app-password
```

Run with:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## 🐛 Troubleshooting

### Problem: "Authentication failed"
**Solution**: 
- Verify you're using an App Password (not your regular password)
- Check 2FA is enabled on Gmail
- Regenerate the app password

### Problem: "Connection timeout"
**Solution**:
- Check your internet connection
- Verify SMTP host and port are correct
- Check firewall settings (port 587 must be open)

### Problem: "Email not received"
**Solution**:
- Check spam/junk folder
- Verify recipient email is correct
- Check Gmail "Sent" folder to confirm email was sent
- Wait a few minutes (sometimes delayed)

### Problem: "Username and Password not accepted"
**Solution**:
- For Gmail: Must use App Password (16 characters, no spaces)
- For Outlook: May need to enable "Less secure app access"
- Verify username is the full email address

### Problem: "535-5.7.8 Username and Password not accepted"
**Solution**:
- This is a Gmail-specific error
- You MUST use an App Password
- Regular Gmail password will NOT work
- Follow Step 1 to generate App Password

---

## 📝 Quick Change Checklist

- [ ] Choose new email account (Gmail recommended)
- [ ] Enable 2-Factor Authentication
- [ ] Generate App Password (16 characters)
- [ ] Open `application.properties` file
- [ ] Update `spring.mail.username` with new email
- [ ] Update `spring.mail.password` with app password
- [ ] Update `spring.mail.host` if not using Gmail
- [ ] Update `spring.mail.port` if needed
- [ ] Save the file
- [ ] Restart backend server
- [ ] Test OTP login
- [ ] Verify email arrives in inbox
- [ ] Check email content is correct

---

## 📂 Files Involved

1. **Configuration File**:
   - `smartfix/src/main/resources/application.properties`
   - Lines 23-36 (Email configuration)

2. **Email Service** (No changes needed):
   - `smartfix/src/main/java/com/aidevice/smartfix/service/EmailService.java`
   - Automatically uses the configuration from application.properties

3. **Dependencies** (Already configured):
   - `pom.xml` includes `spring-boot-starter-mail`

---

## 🎯 Example: Complete Configuration Change

### Before:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=ishimwedidace@gmail.com
spring.mail.password=rkratdyxpjeqaevk
```

### After (Example with new Gmail):
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=smartfix.noreply@gmail.com
spring.mail.password=xyzw abcd efgh ijkl
```

### After (Example with Outlook):
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=smartfix@outlook.com
spring.mail.password=MySecurePassword123
```

---

## 💡 Recommendations

### For Development:
- Use a test Gmail account
- Keep configuration in `application.properties`

### For Production:
- Use a professional email (e.g., `noreply@smartfix.com`)
- Use environment variables
- Consider using a dedicated email service (SendGrid, AWS SES, Mailgun)

### For Final Year Project Demo:
- Create a dedicated Gmail: `smartfix.demo@gmail.com`
- Use a clear, professional sender name
- Test thoroughly before presentation

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your email provider's SMTP settings
3. Check backend logs for detailed error messages
4. Test with a simple Gmail account first

---

**Last Updated**: May 24, 2026  
**System**: SmartFix (Intelligent Corex)  
**Component**: Email OTP System
