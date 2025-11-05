
/**
 * Apps Script Web App (Deploy as web app: anyone with link can access)
 * Spreadsheet must have a sheet named 'Pedidos' with headers:
 * Timestamp, Name, Email, Phone, Plan, Cohort, Count, Total, Raw
 * Replace REEMPLAZA_SHEET_ID with your Sheet ID.
 */
function doPost(e){
  try{
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById('REEMPLAZA_SHEET_ID');
    var sh = ss.getSheetByName('Pedidos') || ss.insertSheet('Pedidos');
    if(sh.getLastRow() === 0){
      sh.appendRow(['Timestamp','Name','Email','Phone','Plan','Cohort','Count','Total','Raw']);
    }
    sh.appendRow([new Date(), data.name, data.email, data.phone, data.plan, data.cohort, data.count, data.total, JSON.stringify(data)]);

    // Build onboarding email to parent
    var html = HtmlService.createTemplateFromFile('email_template');
    html.data = data;
    var body = html.evaluate().getContent();

    // Notify platform inbox
    MailApp.sendEmail({
      to: 'contacto@educacioninmversiva.cl',
      subject: 'Nuevo pedido Exámenes Libres (' + (data.cohort||'sin cohorte') + ')',
      htmlBody: '<p><b>Nombre:</b> '+data.name+'<br><b>Email:</b> '+data.email+'<br><b>Tel:</b> '+data.phone+'<br><b>Plan:</b> '+data.plan+'<br><b>Cohorte:</b> '+data.cohort+'<br><b>Cantidad:</b> '+data.count+'<br><b>Total:</b> $'+data.total.toLocaleString('es-CL')+'</p>'
    });

    // Send onboarding email to parent (if email provided)
    if(data.email){
      MailApp.sendEmail({
        to: data.email,
        subject: 'Bienvenido a Educación Inmversiva — Exámenes Libres (' + (data.cohort||'sin cohorte') + ')',
        htmlBody: body,
        name: 'Educación Inmversiva'
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

/** Optional: serve a simple info page */
function doGet(){ return HtmlService.createHtmlOutput('<h3>Web App OK</h3>'); }
