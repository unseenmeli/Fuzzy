# TestFlight Deployment Guide for LongVibe

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com

2. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo Account**
   ```bash
   eas login
   ```

## Step 1: Configure Your Project

1. **Initialize EAS Build**
   ```bash
   eas build:configure
   ```
   This will create a project ID and update your app.json

2. **Update eas.json** with your Apple credentials:
   - Replace `YOUR_APPLE_ID@example.com` with your Apple ID
   - Replace `YOUR_ASC_APP_ID` with your App Store Connect App ID
   - Replace `YOUR_TEAM_ID` with your Apple Team ID

## Step 2: Create App Icons and Splash Screen

Create the following images in the `/assets` folder:
- `icon.png` (1024x1024px) - App icon
- `splash.png` (1242x2436px) - Splash screen
- `adaptive-icon.png` (1024x1024px) - Android adaptive icon
- `favicon.png` (48x48px) - Web favicon

## Step 3: Configure Apple Developer Account

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Create an App ID with bundle identifier: `com.unseenmeli.longvibe`
3. Create a provisioning profile for distribution

## Step 4: Build for iOS

```bash
# Build for TestFlight/App Store
eas build --platform ios --profile production

# Or build for internal testing first
eas build --platform ios --profile preview
```

## Step 5: Submit to TestFlight

```bash
# Automatic submission after build
eas submit --platform ios --latest

# Or manual submission with specific build
eas submit --platform ios --id=BUILD_ID
```

## Step 6: Configure TestFlight

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to TestFlight tab
4. Add internal testers (your team)
5. Add external testers (beta users)
6. Fill in test information:
   - What to test
   - App description
   - Contact information

## Important Configuration Updates Needed

Before building, update these files:

### 1. Update Bundle Identifier (if needed)
In `app.json`, change:
```json
"ios": {
  "bundleIdentifier": "com.yourcompany.longvibe"
}
```

### 2. Set Environment Variables
Create `.env.production` file:
```
EXPO_PUBLIC_INSTANT_APP_ID=your-production-instant-db-id
```

### 3. Update EAS Project ID
After running `eas build:configure`, your project ID will be generated.

## Build Commands Reference

```bash
# Check your EAS account
eas whoami

# List all builds
eas build:list

# Check build status
eas build:view

# Download build artifact
eas build:download

# Submit specific build to App Store
eas submit -p ios --id=BUILD_ID

# Cancel running build
eas build:cancel
```

## Troubleshooting

### Common Issues:

1. **"Missing Distribution Certificate"**
   - Run: `eas credentials`
   - Select iOS → Production → Generate new

2. **"Bundle Identifier Already Exists"**
   - Change bundle identifier in app.json
   - Must be unique across all App Store apps

3. **"Build Failed - Missing Assets"**
   - Ensure all image assets exist in /assets folder
   - Check image dimensions match requirements

4. **"Provisioning Profile Invalid"**
   - Regenerate via: `eas credentials`
   - Or manually in Apple Developer Portal

## Testing Checklist

Before submitting to TestFlight:

- [ ] Test on physical iOS device
- [ ] Verify all features work
- [ ] Check for crashes
- [ ] Test in airplane mode
- [ ] Test push notifications
- [ ] Verify deep links work
- [ ] Test on different iOS versions
- [ ] Check memory usage
- [ ] Verify proper permissions

## App Store Requirements

When ready for App Store release:

1. **Screenshots** (required sizes):
   - 6.5" (iPhone 14 Pro Max): 1290 x 2796
   - 5.5" (iPhone 8 Plus): 1242 x 2208
   - 12.9" (iPad Pro): 2048 x 2732

2. **App Information**:
   - App description (up to 4000 characters)
   - Keywords (100 characters)
   - Support URL
   - Privacy Policy URL
   - Age rating

3. **Review Information**:
   - Demo account credentials
   - Notes for reviewer
   - Contact information

## Timeline

- **Build Time**: ~15-30 minutes
- **Processing**: ~5-30 minutes after upload
- **TestFlight Review**: 24-48 hours (usually faster)
- **App Store Review**: 24-72 hours

## Next Steps

1. Run `npm install -g eas-cli` if not installed
2. Run `eas login` with your Expo account
3. Run `eas build:configure` to initialize
4. Update credentials in eas.json
5. Run `eas build --platform ios --profile production`
6. Submit to TestFlight!

Good luck with your TestFlight deployment! 🚀