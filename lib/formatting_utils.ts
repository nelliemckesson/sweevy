export function preformatData(item, data, activeResume) {
	const defaultTitles = {
    skills: "Skills",
    roles: "Experience",
    educations: "Education"
  }

  console.log(data);

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
  }

  let subitems = sectionData;

  if (sectionData.hasOwnProperty("customsectionitems")) {
    subitems = sectionData.customsectionitems;
  }

  subitems = subitems.filter(subitem => subitem.include)
	return {sectionTitle, classnames, subitems};
}

export function createHtmlDownload(data, activeResume) {
	const css = `
	h2 {
		margin-bottom: 5px;
	}

	p {
		margin-top: 0px;
		margin-bottom: 0px;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.section-wrapper {
		margin-top: 16px;
	}

  .italic {
    font-style: italic;
  }

  .bold {
    font-weight: bold;
  }

  .underline {
    text-decoration: underline;
  }

  .alignleft {
    text-align: left;
    text-align-last: left;
  }

  .aligncenter {
    text-align: center;
    text-align-last: center;
  }

  .alignright {
    text-align: right;
    text-align-last: right;
  }

  .alignjustify {
    text-align: justify;
    text-align-last: left;
  }

  .bordertop {
    border-top: 1px solid black;
  }

  .borderright {
    border-right: 1px solid black;
  }

  .borderbottom {
    border-bottom: 1px solid black;
  }

  .borderleft {
    border-left: 1px solid black;
  }

  .fontsize7 {
    font-size: 7pt;
  }

  .fontsize8 {
    font-size: 8pt;
  }

  .fontsize9 {
    font-size: 9pt;
  }

  .fontsize10 {
    font-size: 10pt;
  }

  .fontsize11 {
    font-size: 11pt;
  }

  .fontsize12 {
    font-size: 12pt;
  }

  .fontsize14 {
    font-size: 14pt;
  }

  .fontsize18 {
    font-size: 18pt;
  }

  .fontsize24 {
    font-size: 24pt;
  }

  .fontsize30 {
    font-size: 30pt;
  }

  .fontsize36 {
    font-size: 36pt;
  }

  .fontsize48 {
    font-size: 48px;
  }

  .fontsize60 {
    font-size: 60pt;
  }

  .fontsize72 {
    font-size: 72pt;
  }

  .fontsize96 {
    font-size: 96pt;
  }
  `;

  const styles = `<style>${css}</style>`;
  const html: string[] = [
  	"<html>", 
  	"<head>", 
  	styles, 
  	"</head>", 
  	"<body>"
  ];

  console.log(data);

  activeResume?.fields?.positions.map((item, index) => {
    console.log(item);
    
    let {sectionTitle, classnames, subitems} = preformatData(item, data, activeResume);

    // create a new section
    html.push(`<div class="section-wrapper">`);
    if (sectionTitle) {
    	html.push(`<h2 class="${classnames.join(" ")}">${sectionTitle}</h2>`);
    }

    subitems = subitems.map((subitem, subindex) => {
      let subClassnames = subitem.classnames || [];
      let subSubitems = [];
      if (item === "roles") {
        subSubitems = subitem.roleitems;
      } else if (item === "educations") {
        subSubitems = subitem.educationitems;
      }
      subSubitems = subSubitems.filter(subSubitem => subSubitem.include);

      let bullet = subClassnames.indexOf("bullet") > -1
      	? `<span class="${subClassnames.join(" ")}">&#8226;&nbsp;</span>`
      	: "";

      let number = subClassnames.indexOf("numbered") > -1
      	? `<span class="${subClassnames.join(" ")}">${subindex+1}.&nbsp;</span>`
      	: "";

      let para = `<p class="${subClassnames.join(" ")}">${subitem.value}</p>`;

      html.push(`<div class="flex-row">${bullet}${number}${para}</div>`);

      subSubitems.map((subSubitem, subSubindex) => {
      	let subBullet = subSubitem.classnames?.indexOf("bullet") > -1
	      	? `<span class=${subSubitem.classnames?.join(" ")}>&#8226;&nbsp;</span>`
	      	: "";

	      let subNumber = subSubitem.classnames?.indexOf("numbered") > -1
	      	? `<span class=${subSubitem.classnames?.join(" ")}>${subSubindex+1}.&nbsp;</span>`
	      	: "";

	      let subPara = `<p class=${subSubitem.classnames?.join(" ")}>${subSubitem.value}</p>`;

	      html.push(`<div class="flex-row">${subBullet}${subNumber}${subPara}</div>`);
	    })
	  });

	  // wrap up the section
	  html.push(`</div>`);
	});

  html.push("</body>", "</html>");
  return html;
}