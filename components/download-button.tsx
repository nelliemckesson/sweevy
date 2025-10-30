"use client";

import { Document, Packer, Paragraph, TextRun } from "docx";
import { Field, ResumeField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { fetchAllData } from "@/app/actions/db";

// these type interfaces are only used once
interface ResumeData {
  contactinfo: Field[];
  skills: Field[];
  roles: Field[];
  educations: Field[];
}

interface DownloadButtonProps {
  userId: string;
  fileType: "html" | "docx";
  loadedResume: ResumeField;
}

export function DownloadButton({ userId, fileType, loadedResume }: DownloadButtonProps): JSX.Element {
  const handleDownload = async (): Promise<void> => {
    try {
      const data = await fetchAllData(userId) as ResumeData | null;

      if (!data) return;

      let blob: Blob;
      let downloadName: string;

      const d = new Date();
      const suffix = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      console.log(suffix);

      if (loadedResume.name !== "default") {
        const sanitizedName = loadedResume.name.replace(/[^a-z0-9A-Z_-]/gim).trim();
        suffix = `${sanitizedName}-${suffix}`;
      }

      // TO DO: Get docx export working
      // if (fileType === "docx") {
      //   downloadName = "sweevy-resume.docx";
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
      //   blob = await Packer.toBlob(doc);
      // } else

      if (fileType === "html") {
        downloadName = `resume-${suffix}.html`;
        // since we don't need to transform the html,
        // we can just use simple strings.
        const html: string[] = ["<html>", "<body>"];

        data.contactinfo.forEach(item => {
          if (item.label === "Name") {
            html.push(`<h1>${item.value}</h1>`);
          } else {
            html.push(`<p class="contact">${item.value}</p>`);
          }
        });

        html.push("<h2>Skills</h2>");

        data.skills.forEach(item => {
          html.push(`<p class="skills">${item.value}</p>`);
        });

        html.push("</body>", "</html>");
        blob = new Blob(html, { type: "text/html" });
      } else {
        return; // unsupported file type
      }

      // create download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName;
      link.click();

      // clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload}>
      {fileType}
    </Button>
  );
}
