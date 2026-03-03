import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function AddContent({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
  };

  const toDataUrl = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const inferMimeType = (f) => {
    if (f.type) return f.type;

    const ext = (f.name?.split(".").pop() || "").toLowerCase();
    if (ext === "pdf") return "application/pdf";
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "webp") return "image/webp";
    if (ext === "gif") return "image/gif";
    if (ext === "svg") return "image/svg+xml";
    return "application/octet-stream";
  };

  const normalizeDataUrlMime = (dataUrl, mimeType) => {
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
      return dataUrl;
    }

    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex === -1) return dataUrl;

    const base64Payload = dataUrl.slice(commaIndex + 1);
    return `data:${mimeType};base64,${base64Payload}`;
  };

  const submit = async () => {
    if (!title.trim()) return alert("Title likho");

    try {
      setLoading(true);

      const mimeType = file ? inferMimeType(file) : "";
      const filePayload = file
        ? {
            name: file.name,
            mimeType,
            data: normalizeDataUrlMime(await toDataUrl(file), mimeType),
          }
        : null;

      await onAdd({
        id: Date.now(),
        title,
        description: desc,
        file: filePayload,
      });

      setTitle("");
      setDesc("");
      setFile(null);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mt-10 justify-center items-center gap-5 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6 bg-white rounded-2xl shadow-xl mx-auto">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-center">
        Add Content
      </h3>

      <div className="flex flex-col justify-center items-center gap-4 sm:gap-5 w-full">
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-sm sm:text-base md:text-lg font-bold tracking-wider">
            Title
          </label>
          <input
            className="border py-2 px-3 rounded-md w-full outline-none focus:border-2 focus:border-blue-500"
            placeholder="Your Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-sm sm:text-base md:text-lg font-bold tracking-wider">
            Description
          </label>
          <div className="w-full">
            <CKEditor
              editor={ClassicEditor}
              data={desc}
              config={{
                placeholder: "Write Your Description",
              }}
              onChange={(_, editor) => {
                setDesc(editor.getData());
              }}
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-sm sm:text-base md:text-lg font-bold tracking-wider">
            Upload File
          </label>
          <input
            className="border py-2 px-3 rounded-md w-full outline-none focus:border-2 focus:border-blue-500"
            type="file"
            onChange={handleFile}
          />

          {file && <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>}
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-widest border py-2 px-6 rounded-md w-full sm:w-auto transition-all duration-300 disabled:opacity-60"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
