'use client';

import { useState } from 'react';
import mammoth from 'mammoth';
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";

// --------
// DESCRIPTION: 
// Import a docx resume file
// --------
export function DocxImport() {
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<string[] | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selectedParas, setSelectedParas] = useState({});

  const toggleImporting = () => {
    setImporting(prev => !prev);
  }

  const cancelImporting = () => {
    setSelectedFile(null);
    setData(null);
    setSelectedParas({});
    setImporting(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.docx')) {
      setSelectedFile(file);
    }
  }

  const selectParagraph = (index) => {
    setSelectedParas(prev => {
      const updated = { ...prev };
      if (updated.hasOwnProperty(index)) {
        delete updated[index];
      } else {
        updated[index] = {type: "roleitem"};
      }
      return updated;
    });
  }

  const selectAll = () => {
    if (!data) return;
    const allSelected = {};
    data.forEach((_, index) => {
      allSelected[index] = {type: "roleitem"};
    });
    setSelectedParas(allSelected);
  }

  const setParagraphType = (index, paraType) => {
    setSelectedParas(prev => {
      const updated = { ...prev };
      if (updated.hasOwnProperty(index)) {
        updated[index].type = paraType;
      } else {
        updated[index] = {type: paraType};
      }
      return updated;
    });
  }

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
          const text = result.value; // The extracted plain text
          let textArr = text.split("\n");
          textArr = textArr.filter(item => item.match(/\S/));
          setData(textArr);
          setSelecting(true);
        } catch (error) {
          console.error("Error extracting text:", error);
        }
      };
      reader.readAsArrayBuffer(selectedFile);

      // Reset and close
      // setSelectedFile(null);
      // setImporting(false);
    } catch (error) {
      console.error('Error parsing DOCX:', error);
    } finally {
      setIsProcessing(false);
    }
  }

  const options = [
    ["role", "Role"],
    ["roleitem", "Role Description"],
    ["education", "Education"],
    ["educationitem", "Education Description"],
    ["skill", "Skill"],
    ["contactname", "Contact Info: Name"],
    ["contactinfo", "Contact Info"],
  ];

  return (
    <div className="mb-3">
      <Button onClick={toggleImporting}>Import a Resumé</Button>

      <Modal isOpen={importing} onClose={cancelImporting}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Import a Resumé</h2>
          {(data && selecting) ? (
            <div className="flex flex-col gap-4">
              <div>
                <Button
                  onClick={selectAll}
                  variant="outline"
                  className="mb-3"
                >
                  Select All
                </Button>
                {data.map((item, i) => {
                  return (
                    <div key={i}>
                      <input
                        type="checkbox"
                        id={`select${i}`}
                        name={`select${i}`}
                        aria-label="Import paragraph"
                        checked={selectedParas.hasOwnProperty(i)}
                        onChange={e => selectParagraph(i)}
                      />
                      <select 
                        value={selectedParas.hasOwnProperty(i) ? selectedParas[i].type : "roleitem"} 
                        onChange={e => setParagraphType(i, e.target.value)} 
                        className="border text-sm p-1 rounded-sm"
                      >
                        <option value="roleitem">Paragraph Type...</option>
                        {options.map(item => {
                          return <option key={item[0]} value={item[0]}>{item[1]}</option>
                        })}      
                      </select>
                      <p>{item}</p>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={cancelImporting}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || isProcessing}
                >
                  Import Selected Items
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="docx-upload"
                  className="block text-sm font-medium mb-2"
                >
                  Select a DOCX file
                </label>
                <input
                  id="docx-upload"
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  onClick={cancelImporting}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Load File...'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}