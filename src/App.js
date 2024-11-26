import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/index";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";
import Google from "./containers/Google";
import UserProfile from "./pages/UserProfile/userprofile";
import "./global.css";
import { Provider } from "react-redux";
import store from "./store";
import Layout from "./hocs/Layout";
import image1 from "./images/image1.jpg";
import Privateroute from "./pages/PrivateRoute/privateroute";
import Pricing from "./pages/Pricing/index";
import Features from "./pages/Features/features";
import "./global.css";
import WordDocx from "./documentCycle/mainPages/docx/Worddocx";
import SendDoc from "./sideBarPages/sendDoc/SendDoc";
import ReceiveDoc from "./sideBarPages/receiveDoc/RecieveDoc";
import SignedDocuments from "./sideBarPages/signedDoc/SignedDocuments";
import Inbox from "./sideBarPages/Inbox/Inbox";
import Iframe from "./documentCycle/mainPages/Iframe";
import Signed from "./documentCycle/mainPages/signed";
import AfterSigning from "./documentCycle/mainPages/AfterSigning";
import DocuSignComponent from "./documentCycle/mainPages/DocuSignComponent";
import { Toaster, toast } from "sonner";
import QuillEditor from "./documentCycle/mainPages/docx/generate";
import EmailSender from "./documentCycle/mainPages/test";
import CreateEditLabel from "./documentCycle/labelCycle/CreateEditLabel";
import Folder from "./documentCycle/folderCycle/folderDropdown/Folder";
import SubFolder from "./documentCycle/folderCycle/subfolderCycle/Subfolder/SubFolder";
import Upload from "./documentCycle/mainPages/Upload";
import DisplayFolder from "./documentCycle/folderCycle/DisplayFolder";
import DisplaySubFolder from "./documentCycle/folderCycle/subfolderCycle/DisplaySubfolder";
import CreateFolder from "./documentCycle/folderCycle/createFolder/CreateFolder";
import Dashboard from "./sideBarPages/dashoard/Dashboard";
import FileListView from "./sideBarPages/fileListView/FileListView";
import OutlookEmail from "./sideBarPages/outlookEmail/OutlookEmail";
import OutlookInbox from "./outlook/outlookinbox/OutlookInbox";
import MicrosoftWord from "./microsoftWord/MicrosoftWord";
import WordIframe from "./microsoftWord/wordIframe/WordIframe";
import EmailSending from "./documentCycle/document/signedDoc/PrepareDocument";
import AskMe from "./sideBarPages/fileListView/AskMe";
import Docx from "./documentCycle/doceditor/docx/Docx";
import PdfViewReceiver from "./documentCycle/doceditor/pdfView/PdfViewReceiver";
import DocumentEditorWithExport from "./documentCycle/doceditor/DocEditor";
import Inboxed from "./sideBarPages/inboxed";
import Folders from "./documentCycle/folderCycle/Folders";
import { Department } from "./sideBarPages/department/Department";
import PdfViewSender from "./documentCycle/doceditor/pdfView/PdfViewSender";
import DisplayEmployee from "./sideBarPages/department/employeeCycle/DisplayEmployee";
import PdfView from "./documentCycle/doceditor/pdfView/PdfView";
import DocxViewReceiver from "./documentCycle/doceditor/docx/DocxViewReceiver";
import DocxViewSender from "./documentCycle/doceditor/docx/DocxViewSender";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="dashboard"
            element={
              <Privateroute>
                <Dashboard />
              </Privateroute>
            }
          />
          <Route
            path="/upload"
            element={
              <Privateroute>
                <Upload />
              </Privateroute>
            }
          />
          <Route
            path="/Userprofile"
            element={
              <Privateroute>
                <UserProfile />
              </Privateroute>
            }
          />
          <Route
            path="/wordDocx"
            element={
              <Privateroute>
                <WordDocx />
              </Privateroute>
            }
          />
          <Route
            path="/file-list"
            element={
              <Privateroute>
                <FileListView />
              </Privateroute>
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/create-label"
            element={
              <Privateroute>
                <CreateEditLabel />
              </Privateroute>
            }
          />
          <Route
            path="/create-folder"
            element={
              <Privateroute>
                <CreateFolder />
              </Privateroute>
            }
          />
          <Route
            path="/display-folders"
            element={
              <Privateroute>
                <DisplayFolder />
              </Privateroute>
            }
          />
          <Route
            path="/folder"
            element={
              <Privateroute>
                <Folder />
              </Privateroute>
            }
          />
          <Route
            path="/add-subfolder/:folderId"
            element={
              <Privateroute>
                <DisplaySubFolder />
              </Privateroute>
            }
          />
          <Route path="/home" element={<Home />} />
          <Route index element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/google"
            element={
              <Privateroute>
                <Google />
              </Privateroute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPasswordConfirm />}
          />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route
            path="/send-doc"
            element={
              <Privateroute>
                <SendDoc />
              </Privateroute>
            }
          />
          <Route
            path="/receive-doc"
            element={
              <Privateroute>
                <ReceiveDoc />
              </Privateroute>
            }
          />
          <Route path="/sign" element={<Iframe />} />
          <Route
            path="/aftersigning"
            element={
              <Privateroute>
                <AfterSigning />
              </Privateroute>
            }
          />
          <Route
            path="/signed"
            element={
              <Privateroute>
                <Signed />
              </Privateroute>
            }
          />
          <Route path="/generate" element={<QuillEditor />} />
          <Route path="/hello" element={<EmailSender />} />
          <Route
            path="/inbox"
            element={
              <Privateroute>
                <Inbox />
              </Privateroute>
            }
          />
          <Route
            path="/signed-doc"
            element={
              <Privateroute>
                <SignedDocuments />
              </Privateroute>
            }
          />
          <Route
            path="/outlook-emails"
            element={
              <Privateroute>
                <OutlookEmail />
              </Privateroute>
            }
          />
          <Route
            path="/outlook-inbox"
            element={
              <Privateroute>
                <OutlookInbox />
              </Privateroute>
            }
          />
          <Route
            path="/subfolder/:folderId/:subfolderId"
            element={
              <Privateroute>
                <SubFolder />
              </Privateroute>
            }
          />
          <Route path="/create-doc" element={<MicrosoftWord />} />
          <Route path="/doc" element={<WordIframe />} />
          <Route path="/document" element={<EmailSending />} />
          <Route
            path="/ask-me"
            element={
              <Privateroute>
                <AskMe />
              </Privateroute>
            }
          />
          <Route path="docx-view-sender" element={<DocxViewSender />} />
          <Route path="docx-view-receiver" element={<DocxViewReceiver />} />
          <Route path="/word-view" element={<Docx />} />{" "}
          <Route path="/pdf-view" element={<PdfView />} />
          <Route path="/pdf-view-receiver" element={<PdfViewReceiver />} />
          <Route path="/pdf-view-sender" element={<PdfViewSender />} />
          <Route path="/editor" element={<DocumentEditorWithExport />} />
          <Route
            path="/inboxed"
            element={
              <Privateroute>
                {" "}
                <Inboxed />{" "}
              </Privateroute>
            }
          />
          <Route
            path="/folders"
            element={
              <Privateroute>
                {" "}
                <Folders />{" "}
              </Privateroute>
            }
          />
          <Route
            path="/departments"
            element={
              <Privateroute>
                {" "}
                <Department />{" "}
              </Privateroute>
            }
          />
          <Route
            path="/departments/:departmentId"
            element={
              <Privateroute>
                <DisplayEmployee />
              </Privateroute>
            }
          />
          <Route
            path="/employees"
            element={
              <Privateroute>
                {" "}
                <DisplayEmployee />{" "}
              </Privateroute>
            }
          />
        </Routes>
      </Router>
      <Toaster richColors position="top-center" />
    </Provider>
  );
};
export default App;
