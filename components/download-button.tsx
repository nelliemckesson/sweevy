"use client";

import { Field, ResumeField } from "@/lib/types";
import { createHtmlDownload } from "@/lib/formatting_utils";
import { Button } from "@/components/ui/button";
import { fetchAllData } from "@/app/actions/db";

// these type interfaces are only used once
interface ResumeData {
  contactinfo: Field[];
  skills: Field[];
  roles: Field[];
  educations: Field[];
  customsections: ResumeField[];
}

interface DownloadButtonProps {
  userId: string;
  fileType: "html" | "docx";
  data: any[];
  loadedResume: ResumeField;
}

export function DownloadButton({ userId, fileType, data, loadedResume }: DownloadButtonProps): JSX.Element {
  const handleDownload = async (): Promise<void> => {
    try {
      let blob: Blob;
      let downloadName: string;

      const d = new Date();
      let suffix = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

      if (loadedResume.name !== "default") {
        const sanitizedName = loadedResume.name.replace(/[^a-z0-9A-Z_-]/gim).trim();
        suffix = `${sanitizedName}-${suffix}`;
      }

      //   downloadName = "sweevy-resume.docx";

      // if (fileType === "docx") {
      if (fileType === "html") {
        downloadName = `resume-${suffix}.html`;
        // since we don't need to transform the html,
        // we can just use simple strings.
        const html = createHtmlDownload(data, loadedResume);
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
