import { useState, useEffect } from 'react';
import { fetchAllData } from "@/app/actions/db";

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

  const defaultTitles = {
    skills: "Skills",
    roles: "Experience",
    educations: "Education"
  }

  const subitemsKey = {
    roles: "roleitems",
    educations: "educationitems"
  }

  // customsectionitems

  console.log(persistedData);
  console.log(loadedResume);

  useEffect(() => {
    setActiveResume(loadedResume);
    setData(persistedData);
  }, [loadedResume, persistedData]);

  return (
    <div className="flex-1 w-full flex flex-col gap-3 mb-4">
      {activeResume?.fields?.positions.map((item, index) => {
        console.log(item);
        let sectionData = data[item];

        let sectionTitle = undefined;
        // if sectionData contains name, use that
        if (sectionData.name) {
          sectionTitle = sectionData.name;
        // else if loadedResume.titles contains name, use that
        } else if (activeResume?.fields?.titles?.hasOwnProperty(item)) {
          sectionTitle = activeResume.fields.titles[item];
        // else use default
        } else if (defaultTitles.hasOwnProperty(item)) {
          sectionTitle = defaultTitles[item];
        }

        let classnames = [];
        // if sectionData contains classnames, use that
        if (sectionData.classnames) {
          classnames = sectionData.classnames;
        // else if loadedResume.classnames contains item, use that
        } else if (activeResume.fields?.classnames?.hasOwnProperty(item)) {
          classnames = activeResume.fields.classnames[item];
          console.log(classnames);
        }

        let subitemKey = undefined;
        let subitems = [];

        if (sectionData.hasOwnProperty("customsectionitems")) {
          subitems = sectionData.customsectionitems?.filter(subitem => subitem.include);
        } else {
          subitems = sectionData;
        }

        subitems = subitems.map(subitem => {
          let subClassnames = subitem.classnames || [];
          let subSubitems = [];
          if (item === "roles") {
            subSubitems = subitem.roleitems;
          } else if (item === "educations") {
            subSubitems = subitem.educationitems;
          }
          subSubitems = subSubitems.filter(subSubitem => subSubitem.include);
          return (
            <div>
              <div className="flex flex-row justify-start items-center">
                {subClassnames.indexOf("bullet") > -1 && (
                  <span className={subClassnames.join(" ")}>&#8226;&nbsp;</span>
                )}
                {subClassnames.indexOf("numbered") > -1 && (
                  <span className={subClassnames.join(" ")}>{index+1}.&nbsp;</span>
                )}
                <p 
                  className={subClassnames.join(" ")}
                  dangerouslySetInnerHTML={{ __html: subitem.value }}
                />
              </div>
              {subSubitems.map(subSubitem => {
                return (
                  <div className="flex flex-row justify-start items-center">
                    {subSubitem.classnames?.indexOf("bullet") > -1 && (
                      <span className={subSubitem.classnames?.join(" ")}>&#8226;&nbsp;</span>
                    )}
                    {subSubitem.classnames?.indexOf("numbered") > -1 && (
                      <span className={subSubitem.classnames?.join(" ")}>{index+1}.&nbsp;</span>
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
          <div className="mt-3">
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
