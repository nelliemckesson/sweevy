import { useState, useEffect } from 'react';
import { fetchAllData } from "@/app/actions/db";
import { preformatData } from "@/lib/formatting_utils";

// --------
// DESCRIPTION: 
// Preview the loaded resume
// --------

interface ResumeData {
  contactinfo: Field[];
  skills: Field[];
  roles: Field[];
  educations: Field[];
  customsections: ResumeField[];
}

export function Preview({persistedData, loadedResume}): Promise<JSX.Element> {
  const [activeResume, setActiveResume] = useState({});
  const [data, setData] = useState({});

  console.log(persistedData);
  console.log(loadedResume);

  useEffect(() => {
    setActiveResume(loadedResume);
    setData(persistedData);
  }, [loadedResume, persistedData]);

  return (
    <div className="flex-1 w-full flex flex-col gap-3 mb-4">
      {activeResume?.fields?.positions.map((item, index) => {
        console.log("DATA");
        console.log(data);
        let {sectionTitle, classnames, subitems} = preformatData(item, data, activeResume);

        subitems = subitems.map((subitem, subindex) => {
          let subClassnames = subitem.classnames || [];
          let subSubitems = [];
          if (item === "roles") {
            subSubitems = subitem.roleitems;
          } else if (item === "educations") {
            subSubitems = subitem.educationitems;
          }
          subSubitems = subSubitems.filter(subSubitem => subSubitem.include);
          return (
            <div key={`sub${subindex}`}>
              <div className="font-serif flex flex-row justify-start items-center">
                {subClassnames.indexOf("bullet") > -1 && (
                  <span className={subClassnames.join(" ")}>&#8226;&nbsp;</span>
                )}
                {subClassnames.indexOf("numbered") > -1 && (
                  <span className={subClassnames.join(" ")}>{subindex+1}.&nbsp;</span>
                )}
                <p 
                  className={subClassnames.join(" ")}
                  dangerouslySetInnerHTML={{ __html: subitem.value }}
                />
              </div>
              {subSubitems.map((subSubitem, subSubindex) => {
                return (
                  <div key={`subsub${subSubindex}`} className="font-serif flex flex-row justify-start items-center">
                    {subSubitem.classnames?.indexOf("bullet") > -1 && (
                      <span className={subSubitem.classnames?.join(" ")}>&#8226;&nbsp;</span>
                    )}
                    {subSubitem.classnames?.indexOf("numbered") > -1 && (
                      <span className={subSubitem.classnames?.join(" ")}>{subSubindex+1}.&nbsp;</span>
                    )}
                    <p 
                      className={subSubitem.classnames?.join(" ")}
                      dangerouslySetInnerHTML={{ __html: subSubitem.value }}
                    />
                  </div>
                );
              })}
            </div>
          );
        });

        return (
          <div key={index} className="font-serif mt-3">
          {sectionTitle && (
            <h2 
              className={`text-xl ${classnames.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          )}
          {subitems}
          </div>
        )

      })}
    </div>
  );
}
