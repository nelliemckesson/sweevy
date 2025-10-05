"use client";

import { Button } from "@/components/ui/button";
import { Document, Packer, Paragraph, TextRun } from "docx";

export function DownloadButton(props) {
  const handleDownload = async () => {
    let downloadName = "sweevy-resume.html";

    if (props.fileType === "docx") {
      downloadName = "sweevy-resume.docx";
      // create the .docx document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("This is placeholder text for your resume."),
              ],
            }),
          ],
        }],
      });
    }

    const blob = await Packer.toBlob(doc);

    // create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    link.click();

    // clean up
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="secondary" onClick={handleDownload}>{props.fileType}</Button>
  );
}
