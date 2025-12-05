import { 
	Document, 
	Packer, 
	Paragraph, 
	TextRun, 
	AlignmentType, 
	HeadingLevel, 
	convertInchesToTwip 
} from "docx";

export function preformatData(item, data, activeResume) {
	const defaultTitles = {
    skills: "Skills",
    roles: "Experience",
    educations: "Education"
  }

	let sectionData = data[item];

	if (item.startsWith("customsection")) {
		if (data.hasOwnProperty(item) && data[item].length > 0) {
			sectionData = data[item][0];
		} else {
			sectionData = {};
		}
	}

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

  activeResume?.fields?.positions.map((item, index) => {
    
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

function flattenSpans(value: string): string[] {
	// resolve nested spans into a flat structure:
  // Find <span class="bold">this <span class="italic">text</span> here</span>. => Find <span class="bold">this </span><span class="bold italic">text</span><span class="bold"> here</span>.

  interface SpanSegment {
    text: string;
    classes: string[];
  }

  // Helper to extract class names from a span tag
  function extractClasses(spanTag: string): string[] {
    const classMatch = spanTag.match(/class=["']([^"']*)["']/);
    if (!classMatch) return [];
    return classMatch[1].split(/\s+/).filter(c => c.length > 0);
  }

  // Recursive function to parse and flatten spans
  function parseSpans(html: string, parentClasses: string[] = []): SpanSegment[] {
    const segments: SpanSegment[] = [];
    let pos = 0;

    while (pos < html.length) {
      const nextSpanStart = html.indexOf('<span', pos);

      if (nextSpanStart === -1) {
        // No more spans, add remaining text
        const remainingText = html.substring(pos);
        if (remainingText.length > 0) {
          segments.push({ text: remainingText, classes: parentClasses });
        }
        break;
      }

      // Add text before the span
      if (nextSpanStart > pos) {
        const textBefore = html.substring(pos, nextSpanStart);
        segments.push({ text: textBefore, classes: parentClasses });
      }

      // Find the end of the opening span tag
      const spanTagEnd = html.indexOf('>', nextSpanStart);
      if (spanTagEnd === -1) break;

      const spanTag = html.substring(nextSpanStart, spanTagEnd + 1);
      const spanClasses = extractClasses(spanTag);
      const combinedClasses = [...parentClasses, ...spanClasses];

      // Find the matching closing tag
      let depth = 1;
      let searchPos = spanTagEnd + 1;
      let closingTagPos = -1;

      while (searchPos < html.length && depth > 0) {
        const nextOpen = html.indexOf('<span', searchPos);
        const nextClose = html.indexOf('</span>', searchPos);

        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          searchPos = nextOpen + 5;
        } else {
          depth--;
          if (depth === 0) {
            closingTagPos = nextClose;
          }
          searchPos = nextClose + 7;
        }
      }

      if (closingTagPos === -1) {
        // Malformed HTML, treat rest as text
        segments.push({ text: html.substring(nextSpanStart), classes: parentClasses });
        break;
      }

      // Parse the content inside the span recursively
      const spanContent = html.substring(spanTagEnd + 1, closingTagPos);
      const innerSegments = parseSpans(spanContent, combinedClasses);
      segments.push(...innerSegments);

      pos = closingTagPos + 7; // Move past </span>
    }

    return segments;
  }

  // Parse the HTML into segments
  const segments = parseSpans(value);

  return segments;
}

interface DocxObject {
  text?: string;
  italic?: boolean;
  bold?: boolean;
  underline?: object;
  alignment?: any;
  fontsize7?: number;
  fontsize8?: number;
  fontsize9?: number;
  fontsize10?: number;
  fontsize11?: number;
  fontsize12?: number;
  fontsize14?: number;
  fontsize18?: number;
  fontsize24?: number;
  fontsize30?: number;
  fontsize36?: number;
  fontsize48?: number;
  fontsize60?: number;
  fontsize72?: number;
  fontsize96?: number;
}

function buildDocxObject(value: string, classes: string[], base: DocxObject): DocxObject {
	let obj = { ...base };
	if (value) {
		obj.text = value;
	}
	classes.map(c => {
		switch (c) {
  		case "italic":
  			obj.italics = true;
  			break;
  		case "bold":
  			obj.bold = true;
  			break;
  		case "underline":
  			obj.underline = {type: "single", color: "000000"};
  			break;
  		case "uppercase":
  			obj.allCaps = true;
  			break;
  		case "alignleft":
  			obj.alignment = AlignmentType.LEFT;
  			break;
  		case "aligncenter":
  			obj.alignment = AlignmentType.CENTER;
  			break;
  		case "alignright":
  			obj.alignment = AlignmentType.RIGHT;
  			break;
  		case "alignjustify":
  			obj.alignment = AlignmentType.JUSTIFIED;
  			break;
  		case "fontsize7":
  			obj.size = 14;
  			break;
  		case "fontsize8":
  			obj.size = 16;
  			break;
  		case "fontsize9":
  			obj.size = 18;
  			break;
  		case "fontsize10":
  			obj.size = 20;
  			break;
  		case "fontsize11":
  			obj.size = 22;
  			break;
  		case "fontsize12":
  			obj.size = 24;
  			break;
  		case "fontsize14":
  			obj.size = 28;
  			break;
  		case "fontsize18":
  			obj.size = 36;
  			break;
  		case "fontsize24":
  			obj.size = 48;
  			break;
  		case "fontsize30":
  			obj.size = 60;
  			break;
  		case "fontsize36":
  			obj.size = 72;
  			break;
  		case "fontsize48":
  			obj.size = 96;
  			break;
  		case "fontsize60":
  			obj.size = 120;
  			break;
  		case "fontsize72":
  			obj.size = 144;
  			break;
  		case "fontsize96":
  			obj.size = 192;
  			break;
  		default:
  			break;
  	}
  });
	return obj;
}

function makeParagraph(item: any[], index: number, classnames: string[], level: number) {
	let obj = {};

  // If it's the name, set it as a heading
  if (item.label === "Name") {
  	obj.heading = HeadingLevel.HEADING_1;
  }

  // use real bullets
  if (classnames.indexOf("bullet") > -1) {
  	obj.bullet = {level};
  }

  // add spacing if required (first item in section only)
  if (index === 0 && classnames.indexOf("spaceBefore") > -1) {
  	obj.spacing = {before: convertInchesToTwip(0.25)};
  }

	let paraStyles = {};
	if (classnames.length > 0) {
		paraStyles = buildDocxObject("", classnames, {});
	}

	let paraSegments = flattenSpans(item.value);

	// manually insert numbers for now
	if (classnames.indexOf("numbered") > -1) {
		paraSegments.unshift({text: `${index+1}. `, classes: []});
	}

	let runs = paraSegments.map(seg => {
  	let span = buildDocxObject(seg.text, seg.classes, paraStyles);
    return new TextRun(span);
  });

  const para = new Paragraph({
  	...obj, 
  	...paraStyles, 
  	children: runs
  });

  return para;
}

export async function createDocxDownload(data, activeResume) {
	let paras = [];

	activeResume?.fields?.positions.map((item, index) => {
		let shouldAddSpaceBefore = true;
    
    let {sectionTitle, classnames, subitems} = preformatData(item, data, activeResume);

    // Create a heading paragraph for the section title
    if (sectionTitle) {
    	shouldAddSpaceBefore = false;
    	let sectionTitleSegments = flattenSpans(sectionTitle);
    	let paraStyles = {};
    	if (classnames.length > 0) {
    		paraStyles = buildDocxObject("", classnames, {});
    	}
    	let runs = sectionTitleSegments.map(seg => {
      	let span = buildDocxObject(seg.text, seg.classes, paraStyles);
        return new TextRun(span);
      });
    	const titlePara = new Paragraph({
    		...paraStyles,
    		spacing: {before: convertInchesToTwip(0.25)},
    		heading: HeadingLevel.HEADING_1,
        children: runs,
      })
      paras.push(titlePara);
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

      if (shouldAddSpaceBefore) {
      	subClassnames.push("spaceBefore");
      }

      const para = makeParagraph(subitem, subindex, subClassnames, 0);
      paras.push(para);

      subSubitems.map((subSubitem, subSubindex) => {
      	// only increase bullet level if parent is also bulleted
      	let level = 0;
      	if (subClassnames.indexOf("bullet") > -1) {
      		level = 1;
      	}
      	let subSubClassnames = subSubitem.classnames || [];
      	const para = makeParagraph(subSubitem, subSubindex, subSubClassnames, level);
      	paras.push(para);
	    })
	  });

  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: paras,
    }],
  });

  let blob = await Packer.toBlob(doc);
	return blob;
}