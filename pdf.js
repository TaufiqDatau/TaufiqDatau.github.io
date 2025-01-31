function handlePdf(action, pdfUrl) {
    if (!pdfUrl) {
        console.error("PDF URL is required");
        return;
    }
    
    if (action === "download") {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = pdfUrl.split("/").pop(); // Extract filename from URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (action === "open") {
        window.open(pdfUrl, "_blank");
    } else {
        console.error("Invalid action. Use 'download' or 'open'");
    }
}
