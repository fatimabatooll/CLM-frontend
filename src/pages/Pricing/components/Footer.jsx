import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardHeader from "@mui/material/CardHeader";
// import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Header from '../../Home/components/Header.jsx';




function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

const footers = [
{
  title: "Company",
  description: ["Team", "History", "Contact us", "Locations"],
},
{
  title: "Features",
  description: [
    "Cool stuff",
    "Random feature",
    "Team feature",
    "Developer stuff",
    "Another one",
  ],
},
{
  title: "Resources",
  description: [
    "Resource",
    "Resource name",
    "Another resource",
    "Final resource",
  ],
},
{
  title: "Legal",
  description: ["Privacy policy", "Terms of use"],
},
];

const Footer = () => {


    
  return (
    <>
    
    <Container
        maxWidth="100%"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        
        }}
        style={{
            backgroundColor:'black',
            width:'100%',
            color:'white'
        }}
      >
        <Grid container spacing={0} justifyContent="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={26} sm={3} key={footer.title}>
              <Typography variant="h6" color="white" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="#ffff" cursor='pointer' >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      
    </>
  )
}

export default Footer


