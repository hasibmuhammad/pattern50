// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const PageContainer = ({ text }) => {
//   const [pageChunks, setPageChunks] = useState([]);

//   useEffect(() => {
//     const container = document.createElement("div");
//     container.style.position = "absolute";
//     container.style.visibility = "hidden";
//     container.style.width = "300px"; // Adjust this to match your actual container's width
//     document.body.appendChild(container);

//     let startIndex = 0;
//     let chunks = [];

//     // Loop through the text and split into chunks that fit in the container
//     while (startIndex < text.length) {
//       let chunkSize = 1;
//       let visibleText = text.slice(startIndex, startIndex + chunkSize);

//       // Add characters one by one until we exceed the container height
//       while (startIndex + chunkSize <= text.length) {
//         container.textContent = visibleText;
//         if (container.scrollHeight > 1000) {
//           // Adjust based on your container height
//           break;
//         }
//         chunkSize++;
//         visibleText = text.slice(startIndex, startIndex + chunkSize - 1);
//       }

//       chunks.push(visibleText.trim());
//       startIndex += chunkSize - 1;
//     }

//     setPageChunks(chunks);
//     document.body.removeChild(container); // Cleanup hidden container
//   }, [text]);

//   return (
//     <div>
//       <h1>Paginated Content</h1>
//       {pageChunks.map((page, index) => (
//         <div
//           key={index}
//           style={{
//             border: "1px solid black",
//             height: "300px", // Example page height
//             marginBottom: "20px",
//             overflow: "hidden",
//           }}
//         >
//           {page}
//         </div>
//       ))}
//     </div>
//   );
// };

// const TestPage = () => {
//   const content = `this is the content to be overflowed!`;

//   return (
//     <div>
//       <PageContainer text={content} />
//     </div>
//   );
// };

// export default TestPage;

"use client";
import dynamic from "next/dynamic";
import React, { useRef, useState, useEffect } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Dynamically import react-quill to ensure SSR compatibility
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // Quill editor's CSS
import Image from "next/image";

const PageContainer = ({ text }) => {
  const [pageChunks, setPageChunks] = useState([]);

  useEffect(() => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.visibility = "hidden";
    container.style.width = "300px"; // Adjust this to match your actual container's width
    document.body.appendChild(container);

    let startIndex = 0;
    let chunks = [];

    while (startIndex < text.length) {
      let chunkSize = 1;
      let visibleText = text.slice(startIndex, startIndex + chunkSize);

      // Loop until the content exceeds the container's height
      while (startIndex + chunkSize <= text.length) {
        container.textContent = visibleText;

        console.log("🚀 ~ useEffect ~ container:", container.scrollHeight);
        if (container.scrollHeight > 900) {
          // If the content exceeds the container height, we stop adding characters
          break;
        }

        chunkSize++;
        visibleText = text.slice(startIndex, startIndex + chunkSize);
      }

      // Ensure we don't break words
      const lastSpaceIndex = visibleText.lastIndexOf(" ");
      if (lastSpaceIndex > -1 && startIndex + chunkSize < text.length) {
        visibleText = visibleText.slice(0, lastSpaceIndex);
        chunkSize = lastSpaceIndex + 1;
      }

      chunks.push(visibleText.trim());
      startIndex += chunkSize;
    }

    setPageChunks(chunks);
    document.body.removeChild(container); // Cleanup the hidden container
  }, [text]);

  return (
    <div>
      <h1>Paginated Content</h1>
      {pageChunks.map((page, index) => (
        <div
          key={index}
          style={{
            border: "1px solid black",
            width: "600px",
            height: "100%",
            marginBottom: "20px",
            overflow: "auto",
            padding: "5px",
          }}
        >
          <div className="my-2 flex justify-center">
            <Image src={"/logo.svg"} alt="Logo" width={150} height={50} />
          </div>
          <hr />

          <div className="my-2">
            <Markdown
              className="prose"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {page}
            </Markdown>
          </div>
        </div>
      ))}
    </div>
  );
};

const TestPage = () => {
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content) => {
    setEditorContent(content); // Update state when the editor content changes
  };

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }, "bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ];

  const modules = {
    toolbar: {
      container: toolbarOptions,
    },
  };
  return (
    <div>
      <div className="px-8 py-4">
        <ReactQuill
          modules={modules}
          theme="snow"
          value={editorContent}
          onChange={handleEditorChange}
          style={{ width: "600px", marginBottom: "20px" }}
        />

        <PageContainer text={editorContent} />
      </div>
    </div>
  );
};

export default TestPage;
