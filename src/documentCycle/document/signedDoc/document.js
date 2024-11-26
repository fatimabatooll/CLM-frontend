import {
  DocumentFieldType,
  DocumentStatus,
  SignerVerificationType,
} from "./Graphql";

export const createDocument = (responseData, postData) => {
  console.log(responseData)
  if (!responseData || !Array.isArray(responseData.pages) || !postData ) {
    console.error("Invalid responseData:", responseData);
    return null;
  }

  const recipients = postData.recipients.map(recipient => ({
    email: recipient.email,
    id: recipient.id,
    name: recipient.name,
    phone: '',
    verification: SignerVerificationType.None,
  }));


  console.log("Recipient details:", recipients);
  console.log("post Data in document is:" , postData);
  
  const recipientNames = postData.recipients.map(recipient => recipient.name);
  const recipientEmails = postData.recipients.map(recipient => recipient.email);
  const recipientId = postData.recipients.map(recipient => recipient.id);


console.log(recipientNames, recipientEmails, recipientId);

  const { id, fields, meta } = responseData;
  const documentId = id;
  console.log(documentId)
  const pages = responseData.pages.map((page, index) => ({
    height: 1684,
    number: index + 1,
    url: page.url,
    width: 1190,
  }));

  return {
    fields: fields || [],
    id: documentId,
    pages,
    recipients,
    status: DocumentStatus.Draft,
    meta: meta || []
  };
};

export const document = createDocument();