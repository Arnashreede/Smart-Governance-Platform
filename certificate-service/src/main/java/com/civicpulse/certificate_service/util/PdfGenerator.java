package com.civicpulse.certificateservice.util;

import com.civicpulse.certificateservice.entity.Certificate;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import com.lowagie.text.Image;
public class PdfGenerator {

    public static byte[] generateCertificate(Certificate certificate) throws Exception {

        Document document = new Document(PageSize.A4, 50, 50, 50, 50);

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        PdfWriter writer = PdfWriter.getInstance(document, output);

        document.open();
        InputStream inputStream = PdfGenerator.class.getResourceAsStream("/images/logo.png");

if (inputStream != null) {
    byte[] imageBytes = inputStream.readAllBytes();

    Image logo = Image.getInstance(imageBytes);

    logo.scaleToFit(70, 70);
    logo.setAlignment(Image.ALIGN_CENTER);

    document.add(logo);
}

        // Border
        PdfContentByte canvas = writer.getDirectContent();
        Rectangle border = new Rectangle(30, 30,
                PageSize.A4.getWidth() - 30,
                PageSize.A4.getHeight() - 30);
        border.setBorder(Rectangle.BOX);
        border.setBorderWidth(2);
        canvas.rectangle(border);

        // Fonts
        Font title = new Font(Font.HELVETICA, 22, Font.BOLD);
        Font heading = new Font(Font.HELVETICA, 16, Font.BOLD);
        Font body = new Font(Font.HELVETICA, 12);
        Font bold = new Font(Font.HELVETICA, 12, Font.BOLD);

        // Header
        Paragraph gov = new Paragraph("GOVERNMENT OF INDIA", title);
        gov.setAlignment(Element.ALIGN_CENTER);
        document.add(gov);

        Paragraph civic = new Paragraph("Smart Goverance Platform for Administrative Operations with Citizen Assistance Group2", heading);
        civic.setAlignment(Element.ALIGN_CENTER);
        document.add(civic);

        Paragraph portal = new Paragraph("Digital Citizen Service Portal", body);
        portal.setAlignment(Element.ALIGN_CENTER);
        document.add(portal);

        document.add(new Paragraph(" "));

        Paragraph certTitle = new Paragraph("DIGITAL SERVICE CERTIFICATE", heading);
        certTitle.setAlignment(Element.ALIGN_CENTER);
        document.add(certTitle);

        document.add(new Paragraph(" "));

        // Certificate Details

        Paragraph certNo = new Paragraph();
        certNo.add(new Chunk("Certificate Number : ", bold));
        certNo.add(new Chunk(certificate.getCertificateNumber(), body));
        document.add(certNo);

        Paragraph citizen = new Paragraph();
        citizen.add(new Chunk("Citizen Name : ", bold));
        citizen.add(new Chunk(certificate.getCitizenName(), body));
        document.add(citizen);

        Paragraph citizenId = new Paragraph();
        citizenId.add(new Chunk("Citizen ID : ", bold));
        citizenId.add(new Chunk(String.valueOf(certificate.getCitizenId()), body));
        document.add(citizenId);

        Paragraph service = new Paragraph();
        service.add(new Chunk("Service : ", bold));
        service.add(new Chunk(certificate.getServiceName(), body));
        document.add(service);

        Paragraph department = new Paragraph();
        department.add(new Chunk("Department : ", bold));
        department.add(new Chunk(certificate.getDepartmentName(), body));
        document.add(department);

        Paragraph officer = new Paragraph();
        officer.add(new Chunk("Officer : ", bold));
        officer.add(new Chunk(certificate.getOfficerName(), body));
        document.add(officer);

        Paragraph issueDate = new Paragraph();
        issueDate.add(new Chunk("Issue Date : ", bold));
        issueDate.add(new Chunk(String.valueOf(certificate.getIssueDate()), body));
        document.add(issueDate);

        document.add(new Paragraph(" "));
Paragraph valid = new Paragraph();
valid.add(new Chunk("Valid Till : ", bold));
valid.add(new Chunk(String.valueOf(certificate.getValidTill()), body));

document.add(valid);
Paragraph ref = new Paragraph();
ref.add(new Chunk("Reference No : ", bold));
ref.add(new Chunk(certificate.getReferenceNumber(), body));

document.add(ref);
Paragraph code = new Paragraph();
code.add(new Chunk("Verification Code : ", bold));
code.add(new Chunk(certificate.getVerificationCode(), body));

document.add(code);
        // Footer
        Paragraph footer = new Paragraph(
                "This certificate is digitally generated and does not require a handwritten signature.",
                body);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.add(new Paragraph(" "));

        // QR Code

        String verificationUrl =
                "http://localhost:8089/certificates/verify/"
                        + certificate.getCertificateNumber();

        byte[] qrBytes = QrCodeGenerator.generateQRCode(verificationUrl);

        Image qrImage = Image.getInstance(qrBytes);

        qrImage.scaleAbsolute(100, 100);
        qrImage.setAlignment(Image.ALIGN_RIGHT);

        Paragraph scan = new Paragraph("Scan QR Code to Verify", bold);
        scan.setAlignment(Element.ALIGN_RIGHT);

        document.add(scan);
        document.add(qrImage);

        document.add(new Paragraph(" "));
        Paragraph verify = new Paragraph(
        "Verify this certificate at:",
        bold);

verify.setAlignment(Element.ALIGN_RIGHT);

document.add(verify);

Paragraph url = new Paragraph(
        verificationUrl,
        body);

url.setAlignment(Element.ALIGN_RIGHT);

document.add(url);

        // Signature

        Paragraph signature = new Paragraph();
        signature.setAlignment(Element.ALIGN_RIGHT);
        signature.add(new Chunk("Authorized Officer\n", bold));
        signature.add(new Chunk("Revenue Department\n", body));
        signature.add(new Chunk("Smart Goverance Platform for Administrative Operations with Citizen Assistance Group2", body));

        document.add(signature);

        document.close();

        return output.toByteArray();
    }
}