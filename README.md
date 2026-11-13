# Jhenuk.com — React + Vite ডেমো ই-কমার্স

ডেমো স্টোর + অ্যাডমিন প্যানেল। সব ডেটা ব্রাউজারের LocalStorage-এ থাকে; পেমেন্ট, লগইন ও ডাউনলোড সিমুলেটেড (ডেমো)।

## লোকালি চালানো
    npm install
    npm run dev      # ডেভেলপমেন্ট
    npm run build    # আউটপুট: dist/

## GitHub-এ আপলোড
1. github.com-এ নতুন Repository খুলুন (যেমন `jhenuk`)।
2. ZIP Extract করে ভেতরের সব ফাইল (`src`, `public`, `package.json`, `index.html` ইত্যাদি) Repository-র রুটে আপলোড করুন। `.gitignore` ফাইলটিও আপলোড করুন।
3. অথবা টার্মিনালে:

       git init && git add . && git commit -m "Jhenuk.com"
       git branch -M main
       git remote add origin https://github.com/<username>/jhenuk.git
       git push -u origin main

## Cloudflare Pages-এ Deploy
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git।
2. GitHub Repository সিলেক্ট করুন।
3. Build settings:
   - Framework preset: **Vite** (বা None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable (ঐচ্ছিক): `NODE_VERSION` = `20`
4. Save and Deploy চাপুন।

`public/_redirects` ফাইলটি (`/*  /index.html  200`) থাকায় যেকোনো পেজে রিফ্রেশ করলে 404 আসবে না।

## ডেমো লগইন
- Admin: `/admin` → ইউজারনেম `admin`, পাসওয়ার্ড `admin123`
- Customer: `/login` পেজে রেজিস্টার করুন
- কুপন: `WELCOME10` (১০%, ন্যূনতম ৳৫০০), `SAVE100` (৳১০০ ছাড়, ন্যূনতম ৳১৫০০)

## প্রোডাকশনের জন্য মনে রাখুন
- অথেনটিকেশন, অর্ডার ও পেমেন্টের জন্য ব্যাকএন্ড লাগবে (Cloudflare Workers + D1)। LocalStorage লগইন নিরাপদ নয়।
- bKash: পেমেন্ট তৈরি/এক্সিকিউট Worker থেকে করুন; ক্রেডেনশিয়াল Worker secrets-এ রাখুন, ফ্রন্টএন্ডে কখনো নয়।
- ডিজিটাল ফাইল: প্রাইভেট R2-তে রাখুন; অর্ডার যাচাই করে Worker থেকে স্বল্পমেয়াদি ডাউনলোড লিংক দিন।
