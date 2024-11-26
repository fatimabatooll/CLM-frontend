// Filename - components/Footer.js

import React from "react";
import {
	Box,
	FooterContainer,
	Row,
	Column,
	FooterLink,
	Heading,
} from "./FooterStyles";
import logo from '../../../images/logo.png';

const Footer = () => {
	return (
		<Box>
			<div style={{
display:'flex',
flexDirection:'row',
justifyContent: 'left',
// margin:'-3rem',

width:'15%'
			}} className="font-body">
           
			</div>
			<FooterContainer className="font-body">
				<Row >
					<Column>
						<Heading>About Us</Heading>
						<FooterLink href="#">
							Aim
						</FooterLink>
						<FooterLink href="#">
							Vision
						</FooterLink>
						<FooterLink href="#">
							Testimonials
						</FooterLink>
					</Column>
					<Column>
						<Heading>Services</Heading>
						<FooterLink href="#">
							Writing
						</FooterLink>
						<FooterLink href="#">
							Internships
						</FooterLink>
						<FooterLink href="#">
							Coding
						</FooterLink>
						<FooterLink href="#">
							Teaching
						</FooterLink>
					</Column>
					<Column>
						<Heading>Contact Us</Heading>
						<FooterLink href="#">
							Karachi
						</FooterLink>
						<FooterLink href="#">
							Islamabad
						</FooterLink>
						<FooterLink href="#">
							Lahore
						</FooterLink>
						<FooterLink href="#">
							Peshawar
						</FooterLink>
					</Column>
					<Column>
						<Heading>Social Media</Heading>
						<FooterLink href="#">
							<i className="fab fa-facebook-f">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Facebook
								</span>
							</i>
						</FooterLink>
						<FooterLink href="#">
							<i className="fab fa-instagram">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Instagram
								</span>
							</i>
						</FooterLink>
						<FooterLink href="#">
							<i className="fab fa-twitter">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Twitter
								</span>
							</i>
						</FooterLink>
						<FooterLink href="#">
							<i className="fab fa-youtube">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Youtube
								</span>
							</i>
						</FooterLink>
					</Column>
				</Row>
			</FooterContainer>
		</Box>
	);
};
export default Footer;