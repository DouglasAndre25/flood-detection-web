import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomModal = ({ content, open, onClose, title = "" }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div style={{
        backgroundColor: 'white'
      }}>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          variant="h6"
          paddingRight={5}
          paddingTop={2}
          paddingLeft={2}
        >
          {title}
        </Typography>
        <DialogContent>{content}</DialogContent>
      </div>
    </Dialog>
  );
};

export default CustomModal;
