import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button, Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface QRCodeGeneratorProps {
  uuid: string;
  open: boolean;
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ uuid, open, onClose }) => {
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  const handlePrint = () => {
    if (qrRef.current) {
      const dataUrl = qrRef.current.toDataURL("image/png");
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Imprimir QR Code</title></head>
            <body style="display: flex; justify-content: center; align-items: center; height: 100vh;">
              <img src="${dataUrl}" style="width: 200px; height: 200px;" />
              <script>window.onload = function() { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-qrcode">
      <Box 
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center"
        }}
      >
        <IconButton 
          onClick={onClose} 
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography variant="h6" gutterBottom>
          QR Code
        </Typography>
        
        <QRCodeCanvas value={uuid} size={150} ref={qrRef} />
        
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Imprimir QR Code
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default QRCodeGenerator;
