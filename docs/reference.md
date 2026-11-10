# مرجع pey.document-export

## هدف

افزونه پی: خروجی فارسی — رندر Markdown (استاندارد + GFM + پارس‌نشان) روی `pey.markdown.service` و اسمبل سند مستقل راست‌به‌چپ با تم، به‌علاوه بسته zip چندسندی مارک‌داون.

## ساختار

- `manifest.json` — قرارداد معتبر افزونه.
- `index.js` — نقطه‌های ورود `prepare` و `activate` بنیان (فقط سیم‌کشی).
- `lib/export-service.js` — پیاده‌سازی سرویس.
- `lib/file-names.js` — قاعده مشترک نام فایل (جداکننده‌های مسیر به `-`، عنوان پیش‌فرض).
- `lib/export-zip.js` — ساخت آرشیو zip از سندهای متنی (`@zip.js/zip.js`، بدون worker با CompressionStream بومی).
- `lib/persian-extensions.js` — ساخت افزونه‌های micromark پارس‌نشان (اندرزها، لیست فارسی، شعر) و آپشن پاورقی فارسی؛ تنها نقطه تماس با پکیج `parsneshan`.
- `lib/mark-extension.js` — اکستنشن محلی `==هایلایت==` به `<mark>` (نه CommonMark، نه GFM، نه پارس‌نشان) با مکانیزم attention؛ واگرایی‌های شناخته‌شده: ران سه‌تایی کاملاً literal می‌ماند و فاصله چسبیده به جداکننده تابع flanking است.
- `lib/assemble-document.js` — اسمبل خالص سند کامل (`lang="fa" dir="rtl"`) با CSS inline سه تم؛ fragment ورودی از قبل sanitizeشده و خام جاسازی می‌شود، فقط عنوان escape می‌شود.
- `tests/` — تست‌های افزونه آینه فایل‌های سورس؛ دو استثنا: `export-parity.test.js` (قرارداد خط‌لوله روی خروجی واقعی pey.markdown) و `persian-extensions.js` که فقط رفتاری در همان parity پوشش دارد.
- `docs/reference.md` — همین فایل.
- `CHANGELOG.md` — تاریخچه نسخه‌های این افزونه.

## وابستگی‌ها

- **لازم:** `pey.markdown.service` — رندر fragment؛ همه متدها بدون آن با `EXPORT_MARKDOWN_UNAVAILABLE` صریح fail می‌شوند.
- **اختیاری:** هیچ‌کدام.

## API عمومی

**سرویس:** `pey.document-export.service`.

### `exportHtml({ markdown, title?, theme? })`

Markdown را با افزونه‌های فارسی رندر و سند مستقل می‌سازد: `{ html, filename, mime: 'text/html' }`. `title` گمشده/خالی می‌شود `بدون عنوان` (آینه رکوردها)؛ `theme` گمشده می‌شود `light` و نامعتبر با `EXPORT_INVALID_THEME` رد می‌شود؛ خرابی رندر با `EXPORT_RENDER_FAILED` (کد اصلی در `detail.cause`)؛ filename با همان قاعده دانلود `.md` sanitize می‌شود (`/` و `\` به `-`).

```js
const { html, filename } = await service.exportHtml({ markdown: '# سلام', title: 'یادداشت', theme: 'dark' });
// => { html: '<!DOCTYPE html>…', filename: 'یادداشت.html', mime: 'text/html' }
```

### `exportZip({ documents })`

سندهای متنی را با مسیر پوشه‌شان در یک آرشیو `.md` می‌بندد: `{ blob, filename, mime: 'application/zip' }`. هر رکورد `{ markdown, title?, path? }` است (`path` خالی یعنی ریشه)؛ عنوان گمشده/خالی می‌شود `بدون عنوان` و هر سگمنت مسیر با همان قاعده نام فایل sanitize می‌شود (سگمنت‌های `..` خنثی می‌شوند)؛ مسیر کامل تکراری پسوند شمارشی `(2)` می‌گیرد. `documents` نا-آرایه با `EXPORT_INVALID_INPUT` و خرابی ساخت با `EXPORT_ZIP_FAILED` رد می‌شود. نام آرشیو ثابت است: `pey-documents.zip`.

```js
const { blob, filename } = await service.exportZip({ documents: [{ markdown: '# سلام', title: 'یادداشت', path: 'آموزش' }] });
// => { blob: Blob(application/zip), filename: 'pey-documents.zip', mime: 'application/zip' }
```

## ایونت‌ها

هیچ رویداد دامنه‌ای منتشر نمی‌شود — خروجی محاسبه خالص است. اما در `prepare` به رویداد سیستمی `core:service-unavailable` گوش داده می‌شود تا از دست رفتن `pey.markdown.service` با گزارش critical اعلام شود؛ اشتراک در خاموشی/غیرفعال‌سازی و prepare تکراری آزاد می‌شود.

## نکته‌های مرزی

- `==` به `<mark>` رندر می‌شود؛ sanitizer بالادستی pey.markdown از نسخه 1.2.0 تگ `mark` را allowlist کرده و هایلایت در خروجی نهایی زنده است (آزمون parity آن را می‌بندد).
- شناسه‌های پاورقی (`user-content-*`) از sanitizer می‌گذرند، پس ناوبری پاورقی در فایل خروجی کار می‌کند.
- تصاویر راه‌دور همان URL را نگه می‌دارند (فایل مستقل، بدون embed)؛ `data:` غیرتصویری می‌افتد و alt می‌ماند.
- کد حصاردار بدون هایلایت سینتکس می‌آید (`<pre><code class="language-x">`) — آگاهانه بیرون اسکوپ.

## واگرایی‌های ثبت‌شده با ادیتور

- **پاورقی:** ادیتور `[^۱]` را ارجاع پیوندی می‌فهمد، خروجی سکشن پاورقی GFM می‌سازد (تست پین شده).
- **شعر شل:** ادیتور lenient رندر می‌کند، پارس‌نشان strict fallback به متن می‌دهد (تست پین شده).
- **شماره نامرتب لیست فارسی:** خروجی از `<ol start>` می‌شمارد (مرورگر ۲/۳ نشان می‌دهد)، ادیتور ارقام سورس را نگه می‌دارد تا بازشماره (تست رفتار خروجی پین شده).

## خطاهای راه‌اندازی

علاوه بر کدهای عملیاتی متدها، شکست‌های زمان `prepare` با کد اختصاصی `EXPORT_EVENT_BUS_INVALID` (type `startup`) گزارش می‌شوند: نبود Event Bus (`detail.reason: 'missing-event-bus'`) و برنگشتن تابع unsubscribe از `subscribe` (`detail.reason: 'missing-unsubscribe'`) — نقض قرارداد میزبان است، نه ورودی نامعتبر متد. در شاخهٔ دوم، شنونده‌ای که میزبان پیش از نقض قراردادش ثبت کرده بدون تابع unsubscribe رهایشدنی است — افزونه زمینهٔ ذخیره‌شده را خنثی می‌کند تا آن شنوندهٔ یتیم هرگز گزارش critical ندهد. شاخهٔ سوم (پرتاب خود `subscribe` حین ثبت) هم همین رفتار را دارد و خطای خام میزبان با `detail.cause` در همان کد ساخت‌یافته می‌ماند.
