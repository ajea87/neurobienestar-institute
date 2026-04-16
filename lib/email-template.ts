export function emailTemplate({
  title,
  body,
  ctaText,
  ctaUrl,
  footerNote,
}: {
  title: string
  body: string
  ctaText?: string
  ctaUrl?: string
  footerNote?: string
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4EFE6;font-family:Georgia,serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">

    <!-- HEADER -->
    <div style="background:#1C3D50;padding:24px 32px;
                border-radius:8px 8px 0 0;text-align:center">
      <div style="color:#F4EFE6;font-size:22px;
                  letter-spacing:0.14em;font-family:Georgia,serif">
        IEN
      </div>
      <div style="color:rgba(244,239,230,0.45);font-size:10px;
                  letter-spacing:0.14em;text-transform:uppercase;
                  margin-top:4px;font-family:Arial,sans-serif">
        neurobienestar.institute
      </div>
    </div>

    <!-- BODY -->
    <div style="background:white;padding:40px 32px">
      <h1 style="font-size:26px;color:#1C3D50;font-weight:400;
                 line-height:1.2;margin:0 0 20px;font-family:Georgia,serif">
        ${title}
      </h1>

      <div style="font-size:16px;color:#1A2326;line-height:1.8;
                  margin:0 0 28px;font-family:Georgia,serif">
        ${body}
      </div>

      ${ctaText && ctaUrl ? `
      <div style="text-align:center;margin:32px 0">
        <a href="${ctaUrl}"
           style="background:#B8722E;color:#F4EFE6;
                  padding:16px 40px;border-radius:6px;
                  text-decoration:none;font-size:15px;
                  display:inline-block;font-family:Arial,sans-serif;
                  font-weight:500">
          ${ctaText}
        </a>
      </div>
      ` : ''}

      ${footerNote ? `
      <p style="font-size:12px;color:#8E9CA3;text-align:center;
                margin:0;font-family:Arial,sans-serif">
        ${footerNote}
      </p>
      ` : ''}
    </div>

    <!-- FOOTER -->
    <div style="background:#1C3D50;padding:20px 32px;
                border-radius:0 0 8px 8px;text-align:center">
      <p style="color:rgba(244,239,230,0.4);font-size:11px;
                margin:0;line-height:1.6;font-family:Arial,sans-serif">
        © 2025 Instituto Español de Neurobienestar · Método MAV<br>
        neurobienestar.institute
      </p>
    </div>

  </div>
</body>
</html>`
}
