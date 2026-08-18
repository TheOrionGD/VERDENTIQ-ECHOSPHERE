import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.File;

public class TestPdf {
    public static void main(String[] args) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);
            contentStream.newLineAtOffset(100, 700);
            contentStream.showText("Institution Sustainability Report");
            contentStream.endText();
            
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
            contentStream.newLineAtOffset(100, 650);
            contentStream.setLeading(14.5f);
            
            contentStream.showText("Total Energy Saved (kWh): " + 150000.5);
            contentStream.newLine();
            contentStream.showText("Total Carbon Offset (kg): " + 45000.2);
            contentStream.newLine();
            contentStream.showText("Active Students: " + 1200);
            contentStream.newLine();
            contentStream.showText("Total Departments: " + 15);
            
            contentStream.endText();
            contentStream.close();

            document.save(new File("test.pdf"));
            System.out.println("Success!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
