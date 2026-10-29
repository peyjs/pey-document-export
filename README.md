# pey.document-export

افزونه پی: خروجی گرفتن از اسناد متنی — سند HTML مستقل فارسیِ راست‌به‌چپ با تم (رندر Markdown روی `pey.markdown.service`) و آرشیو zip چندسندی از فایل‌های Markdown. برای خروجی داده عمومی (CSV، اکسل، Word و…) نیست.

## ساختار

- `docs/requirements.md` — نیازمندی‌ها؛ منبع حقیقت ساخت افزونه.
- `manifest.json` — قرارداد معتبر افزونه.
- `index.js` — نقطه‌های ورود `prepare` و `activate` بنیان (فقط سیم‌کشی).
- `lib/export-service.js` — پیاده‌سازی سرویس.
- `lib/persian-extensions.js` — افزونه‌های micromark پارس‌نشان.
- `lib/mark-extension.js` — اکستنشن محلی `==هایلایت==`.
- `lib/assemble-document.js` — اسمبل سند کامل با CSS سه تم.
- `tests/export.test.js` + `tests/export-service.test.js` + `tests/export-parity.test.js` — تست‌های افزونه.
- `docs/reference.md` — مرجع کامل خودکفا.
- `CHANGELOG.md` — تاریخچه نسخه‌های این افزونه.

## وابستگی‌ها

- **لازم:** `pey.markdown.service` — رندر fragment؛ همه متدها بدون آن صریح fail می‌شوند.
- **اختیاری:** هیچ‌کدام.

## همچنین ببینید

- `docs/requirements.md` برای «چه چیزی و چرا»؛ سندِ پیش از پیاده‌سازی.
- `docs/reference.md` برای قرارداد کامل متد و خطاها.
- `pey.markdown` (رپوی جدا) برای پایپ‌لاین رندر و sanitize.
