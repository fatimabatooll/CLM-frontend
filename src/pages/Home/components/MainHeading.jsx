import React, {useState} from "react";
import { styled} from "@mui/system";
import { Button, Container, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

import UploadFileIcon from "@mui/icons-material/UploadFile";
import BG from "../../../images/bg.png";

const RootContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  
  justifyContent: "center",
  alignItems: "center",
  height: "95vh",
  backgroundImage: `url(${BG})`,
  backgroundSize: "inherit",
  backgroundPosition: "center",
  color: "black",
  textAlign: "center",
  '@media (max-width: 768px)': {
    height: "98vh",
  },
  
});
const Heading = styled(Typography)({
  marginTop: "10rem", ///
  fontSize: "3rem",
  textAlign:'center',
  marginBottom: '1rem',
  '@media (max-width: 768px)': {
    fontSize: '1.5rem',
  textAlign:'justify',
  },
});

const Description = styled(Typography)({
  fontSize: "1.25rem",
  paddingTop: "1rem",
  marginBottom: "1.3rem",
  '@media (max-width: 768px)': {
    fontSize: '0.7rem',
    textAlign:'justify',
  },
});

const BoxDescription = styled(Typography)({
  fontSize: "0.8rem",
  color: "#cccc",
  paddingTop: "1rem",
  marginBottom: "1.3rem",
});

const BoxContainer = styled(Container)({


  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px dashed #ccc',
  padding: '20px',
  textAlign: 'center',
  borderRadius: '8px',
  maxWidth: '600px', // Set a maximum width to prevent overlapping
  backgroundColor: 'rgba(255, 255, 255, 0.4)', 
  '@media (max-width: 768px)': {
    maxWidth: '90%',
    textAlign:'justify',
  },
});

const IconContainer = styled("div")({
  fontSize: "60px",
  color: "#ccc",
});

const UploadButton = styled(Button)({
  marginTop: "10px",
});

const SecondHeading = styled(Typography)({
  paddingTop: "2rem",
  fontSize: "2rem",
  fontFamily: "sans-serif",
  // fontWeight: "bolder",
  '@media (max-width: 768px)': {
    fontSize: '1rem',
    textAlign:'justify',
  },
});

const SecondDescription = styled(Typography)({
  fontSize: "1.25rem",
  paddingTop: "1rem",
  marginBottom: "1.3rem",
  '@media (max-width: 768px)': {
    fontSize: '0.7rem',
    textAlign:'justify',
  },
});



 export default function MainHeading(){
  // const [selectedFile, setSelectedFile] = useState(null);
  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     console.log(`Selected file: ${file.name}`);
  //   }
  // };

  return (
    <RootContainer>
      
         <Heading className="font-body">
        Getting documents done has <br /> never been this easy
      </Heading>

      <BoxContainer>
        <IconContainer>
          <UploadFileIcon style={{ fontSize: '64px' }} />
        </IconContainer>
        <label htmlFor="file-input" style={{ cursor: 'pointer' }} className="font-body">
          <Typography variant="h5" className="font-body">
            Drag and drop document here to upload
          </Typography>
        </label>
     


      <UploadButton
  component={Link}
  to="/signup"
  // color="primary"
  variant="contained"
  style={{ backgroundColor: '#6254B6', fontWeight: 'bold', color:'white'}} className="font-body"
>
  Select a document
</UploadButton>
        <BoxDescription className="font-body"> 
          Upload documents of up to 31 MB in PDF, DOC, DOCX, RTF, PPT, PPTX,
          JPEG, PNG, or TXT
        </BoxDescription>
      </BoxContainer>

      
      {/* </BoxContainer> */}

      <SecondHeading className="font-body">
        Over 87 million DocVault users worldwide. <br />
        More than 500 million documents done
      </SecondHeading>

      <SecondDescription className="font-body">
        People from these companies use Docvault.
      </SecondDescription>
    </RootContainer>
  );
};