"use client";

import { Download } from 'lucide-react';
import { Field, ResumeField } from "@/lib/types";
import { createHtmlDownload, createDocxDownload } from "@/lib/formatting_utils";
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

      if (fileType === "docx") {
        downloadName = `resume-${suffix}.docx`;
        blob = await createDocxDownload(data, loadedResume)
      } else if (fileType === "html") {
        downloadName = `resume-${suffix}.html`;
        const html = createHtmlDownload(data, loadedResume);
        blob = new Blob(html, { type: "text/html" });
      } else {
        return; // unsupported file type
      }

      console.log(blob);

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
    <Button variant="ghost" className="text-blue-600" onClick={handleDownload}>
      <Download size={18}/> {fileType}
    </Button>
  );
}
