Write-Host "Deploying Final Model..."

# Copy the final ONNX model from the v23 folder
$Source = "bovine_lens_ai/indian_bovine_classifier_v23/weights/best.onnx"
$Dest = "public/models/bovine_classifier.onnx"

if (Test-Path $Source) {
    Copy-Item $Source -Destination $Dest -Force
    Write-Host "SUCCESS: Final model deployed to $Dest"
} else {
    Write-Host "ERROR: Model not found at $Source"
    Write-Host "Training might not be finished yet. Check again later."
}
