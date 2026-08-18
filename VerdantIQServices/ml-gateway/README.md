# VerdantIQ ML Gateway

This is the FastAPI-based ML and OCR service for VerdantIQ.
It handles machine learning ops, inference, and Optical Character Recognition (OCR).

## Requirements

### Python
- Python 3.11 is required.

### Dependency Manager
- [uv](https://github.com/astral-sh/uv) is used for dependency management.

### System-Level Dependencies

**IMPORTANT: Tesseract OCR Binary is Required**

Since this service handles OCR using `pytesseract`, you **MUST** have the Tesseract OCR binary installed on the system running this service. This is a system-level dependency and will *not* be installed via `uv` or `pip`.

If Tesseract is not installed, you will receive runtime import or execution errors when hitting OCR endpoints.

* **Ubuntu/Debian:** `sudo apt-get install tesseract-ocr`
* **macOS:** `brew install tesseract`
* **Windows:** Download the installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki) and ensure the executable is in your system PATH.

## Setup

1. Install `uv` if you haven't already:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   # or on Windows: powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```
2. Sync dependencies:
   ```bash
   uv sync
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `INTERNAL_SERVICE_KEY` matches the one configured in the Spring Boot gateway.*

## Running the Service

Start the application with standard Uvicorn commands via uv:
```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The service will be accessible at http://localhost:8000.
Swagger UI documentation will be available at http://localhost:8000/docs.
