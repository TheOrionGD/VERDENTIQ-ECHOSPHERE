import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.io.File;

public class ReadPdf {
    public static void main(String[] args) {
        try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(new File("test.pdf"))) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            System.out.println("--- PDF TEXT START ---");
            System.out.println(text);
            System.out.println("--- PDF TEXT END ---");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
