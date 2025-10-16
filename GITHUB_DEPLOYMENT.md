# GitHub Deployment Guide

This guide will help you push the Aether Weather app to GitHub and use GitHub Actions to build your APK and AAB files automatically.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `AetherWeatherMobile` (or your preferred name)
3. Description: "Professional React Native weather app with AdMob and IAP"
4. Choose **Public** (for free GitHub Actions minutes) or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Push Code to GitHub

```bash
cd /path/to/AetherWeatherMobile

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Aether Weather Mobile app with AdMob and IAP"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/AetherWeatherMobile.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If Using Personal Access Token

If you need authentication:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing:

```bash
git push -u origin main
# Username: YOUR_USERNAME
# Password: YOUR_PERSONAL_ACCESS_TOKEN
```

## Step 3: Verify GitHub Actions Workflow

1. Go to your repository on GitHub
2. Click **Actions** tab
3. You should see "Build Android APK & AAB" workflow
4. The workflow will automatically run on push to main/master

## Step 4: Trigger Manual Build

### Option A: Automatic Build (on every push)

Simply push any changes:

```bash
git add .
git commit -m "Update app"
git push
```

The workflow will automatically start building.

### Option B: Manual Trigger

1. Go to **Actions** tab
2. Click **Build Android APK & AAB** workflow
3. Click **Run workflow** button
4. Select branch (usually `main`)
5. Optionally check "Create a GitHub release"
6. Click **Run workflow**

## Step 5: Download Build Artifacts

### From Workflow Run:

1. Go to **Actions** tab
2. Click on the completed workflow run
3. Scroll down to **Artifacts** section
4. Download:
   - `app-debug-apk` (for testing)
   - `app-release-apk` (for distribution)
   - `app-release-aab` (for Play Store)

Artifacts are available for 90 days.

### From Releases (if created):

1. Go to **Releases** section (right sidebar)
2. Click on the latest release
3. Download APK or AAB from **Assets**

## Step 6: Install and Test APK

### On Physical Device:

1. Download `app-release.apk` to your computer
2. Transfer to Android device via USB or cloud
3. Enable "Install from Unknown Sources" in device settings
4. Tap the APK file to install
5. Grant location permissions when prompted

### Using ADB:

```bash
adb install path/to/app-release.apk
```

## GitHub Actions Workflow Details

The workflow (`android-build.yml`) does the following:

1. **Checkout code** from repository
2. **Setup Node.js 18** with npm caching
3. **Setup JDK 17** with Gradle caching
4. **Setup Android SDK** automatically
5. **Install npm dependencies**
6. **Build Debug APK** for testing
7. **Build Release APK** for distribution
8. **Build Release AAB** for Play Store
9. **Upload artifacts** (available for 90 days)
10. **Create GitHub Release** (if manually triggered with option)

### Build Time:

- First build: ~5-8 minutes
- Subsequent builds: ~3-5 minutes (with caching)

### GitHub Actions Minutes:

- **Public repos**: Unlimited free minutes
- **Private repos**: 2,000 free minutes/month

## Troubleshooting

### Issue: Workflow fails with "npm install" error

**Solution**: Check `package.json` and `package-lock.json` are committed

```bash
git add package.json package-lock.json
git commit -m "Add package files"
git push
```

### Issue: Gradle build fails

**Solution**: Check the workflow logs in Actions tab for specific error. Common issues:
- Missing dependencies in `package.json`
- Android configuration errors
- Out of memory (rare on GitHub runners)

### Issue: Can't download artifacts

**Solution**: 
- Artifacts expire after 90 days
- Re-run the workflow to generate new artifacts
- Or create a Release for permanent storage

### Issue: Workflow doesn't appear

**Solution**: 
- Ensure `.github/workflows/android-build.yml` is committed
- Check file is in correct directory
- Workflow must be on default branch (main/master)

## Advanced: Automatic Releases

To automatically create releases on every push to main:

1. Edit `.github/workflows/android-build.yml`
2. Change this line:

```yaml
if: github.event.inputs.create_release == 'true' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
```

To:

```yaml
if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
```

3. Commit and push

Now every push to main will create a new release with APK/AAB attached.

## Next Steps After Successful Build

1. ✅ Download and test APK on multiple devices
2. ✅ Replace test AdMob IDs with production IDs
3. ✅ Configure in-app purchases in Google Play Console
4. ✅ Set up app signing for Play Store
5. ✅ Create app listing in Play Console
6. ✅ Submit for review

## Security Notes

⚠️ **Never commit**:
- Production keystore files (`.keystore`)
- Keystore passwords
- API keys or secrets
- `google-services.json` with production keys

Use GitHub Secrets for sensitive data:
1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets like `KEYSTORE_PASSWORD`, `ADMOB_APP_ID`, etc.
3. Reference in workflow: `${{ secrets.KEYSTORE_PASSWORD }}`

## Support

If you encounter issues:
1. Check workflow logs in Actions tab
2. Review error messages carefully
3. Consult [BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)
4. Check [MIGRATION_NOTES.md](./MIGRATION_NOTES.md)

---

**Ready to deploy!** Follow the steps above to get your app building automatically on GitHub.

