from fastapi import APIRouter, UploadFile, File, HTTPException, status
import pytesseract
from PIL import Image
import io

router = APIRouter()

@router.post("/extract")
async def extract_text_from_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Perform OCR
        extracted_text = pytesseract.image_to_string(image)
        
        return {
            "status": "success",
            "extracted_text": extracted_text.strip()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {str(e)}"
        )
