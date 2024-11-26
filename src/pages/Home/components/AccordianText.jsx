
import * as React from "react";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import TabPanel from "@mui/joy/TabPanel";
import Groups3TwoToneIcon from "@mui/icons-material/Groups3TwoTone";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import IosShareTwoToneIcon from "@mui/icons-material/IosShareTwoTone";
import CloudDoneTwoToneIcon from "@mui/icons-material/CloudDoneTwoTone";
import FileCopyTwoToneIcon from "@mui/icons-material/FileCopyTwoTone";
import PictureAsPdfTwoToneIcon from "@mui/icons-material/PictureAsPdfTwoTone";
import slider1 from "../../../images/slider1.webp";
import slider2 from "../../../images/slider2.webp";
import slider3 from "../../../images/slider3.webp";
import slider4 from "../../../images/slider4.webp";
import FAQs from "./FAQs";

const Heading = styled(Typography)({
  
  marginTop: "4rem",
  fontSize: "2.5rem",
  // fontWeight: "bolder",
  textAlign: 'center',
 
});

// const Description = styled(Typography)({
//   marginBottom: "1rem 0", 
// });


export default function TabsVertical() {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // const descriptions = [
  //   "In this section, we will provide you with the complete uses of PDF editing and annotation tools.",
  //   "This section is about templates.",
  //   "Learn about PDF forms and their uses.",
  //   "Discover how to streamline workflows with multiple signers.",
  //   "Collaborate on documents seamlessly with this feature.",
  //   "Share your documents with ease.",
  // ];
  const icons = [
    <Groups3TwoToneIcon />,
    <ImportContactsTwoToneIcon />,
    <IosShareTwoToneIcon />,
    <CloudDoneTwoToneIcon />,
    <FileCopyTwoToneIcon />,
    <PictureAsPdfTwoToneIcon />,
    
    
  ];

  return (
    <>
      <Heading className="font-body" > 
        DocVault features to speed up and <br /> simplify your document workflows
      </Heading>

      <div className="font-body"
        style={{
          
          padding: "5rem",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column", 
          alignItems: "center",
          // marginLeft: "15rem",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Vertical tabs"
          orientation="vertical"
          sx={{ minWidth: 300, width: "80rem", height: 160 }} className="font-body"
        >
          <TabList
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "40%",
              margin:'4rem',
             
            }} className="font-body"
          >
            {[
              "PDF editing and annotation tools",
              "Templates",
              "PDF Forms",
              "Multiple signers workflow",
              "Document collaboration",
              "Document sharing",
            ].map((label, index) => (
              <Tab key={index}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "10px",
                    '&:hover': {
                      color: '#9C8DE4' // or theme.palette.purple[100] if available
                    }
                  }} className="font-body"
                >
                  <p style={{ margin: "10px" }} className="font-body" > {icons[index]} </p>
                  <div>
                    <h3 style={{ margin:'rem 0 5rem 0'}} className="font-body"> 
                      
                      {label}
                    {/* {selectedTab === index && (
                      <Description style={{margin:'0 0 1rem 0'}}>{descriptions[index]}</Description>
                      
                    )} */}
                    </h3>
                  </div>
                </div>
              </Tab>
            ))}
          </TabList>
          {[
            slider1,
            slider3,
            slider2,
            slider3,
            slider1,
            slider2,
            slider3,
            slider4,
          ].map((image, index) => (
            <TabPanel key={index} value={index}>
              <img src={image} alt="" style={{ width: "80%"}} />
            </TabPanel>
          ))}
        </Tabs>
      </div>

<div style={{
  width:'50%',
  height:'auto',
  textAlign:'left',
  fontSize:'1.8rem',
  
  color: '#fff',
  backgroundColor: '#6254B6',
  borderRadius: '10px',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px',
  display: 'flex',
  
  alignItems: 'center',
  justifyContent: 'space-around',
  margin: "8rem auto ",
 
  alignSelf:'center'

  
}} className="font-body" >
  <FAQs />
</div>

    </>
  );
}