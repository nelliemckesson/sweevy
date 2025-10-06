"use client";

import { Document, Packer, Paragraph, TextRun } from "docx";
import { Button } from "@/components/ui/button";
import { fetchAllData } from "@/app/actions/db";

export function DownloadButton(props) {

  const handleDownload = async () => {
    let html, blob;
    // get all resume data
    const data = await fetchAllData(props.userId);
    console.log(data);

    let downloadName = "sweevy-resume.html";

    if (data) {
      // TO DO: Get docx export working
      // if (props.fileType === "docx") {
      //   downloadName = "sweevy-resume.docx";
      //   // create the .docx document
      //   const doc = new Document({
      //     sections: [{
      //       properties: {},
      //       children: [
      //         new Paragraph({
      //           children: [
      //             new TextRun("This is placeholder text for your resume."),
      //           ],
      //         }),
      //       ],
      //     }],
      //   });
      //   const blob = await Packer.toBlob(doc);
      // } else

      // we don't need to do any transforms on the HTML,
      // so we can just create strings instead of a dom
      if (props.fileType === "html") {
        html = ["<html>", "<body>"];
        data.contactInfo.map(item => {
          if (item.label === "Name") {
            html.push(`<h1>${item.value}</h1>`);
          } else {
            html.push(`<p className="contact">${item.value}</p>`);
          }
        });
        html.push(`<h2>Skills</h2>`);
        data.skills.map(item => {
          html.push(`<p className="skills">${item.value}</p>`);
        });
        html.push(`</body>`);
        html.push(`</html>`);
        blob = new Blob(html);
      }

      // create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName;
      link.click();

      // clean up
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload}>{props.fileType}</Button>
  );
}
