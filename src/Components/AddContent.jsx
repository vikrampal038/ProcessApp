import { useState } from "react";

export default function AddContent({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); // ✅ raw File object
  };

  const submit = async () => {
    if (!title.trim()) return alert("Title likho");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (file) formData.append("file", file);

    try {
      setLoading(true);

      // 👉 Future backend API call
      // const res = await fetch("http://localhost:4000/api/content", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await res.json();

      // 👉 Abhi ke liye mock callback
      onAdd({
        id: Date.now(),
        title,
        description: desc,
        file: file ? { name: file.name } : null,
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
        {/* Title */}
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

        {/* Description */}
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-sm sm:text-base md:text-lg font-bold tracking-wider">
            Description
          </label>
          <textarea
            rows={4}
            className="border py-2 px-3 rounded-md w-full outline-none focus:border-2 focus:border-blue-500 resize-none"
            placeholder="Write Your Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {/* Upload File */}
        <div className="w-full flex flex-col items-start gap-2">
          <label className="text-sm sm:text-base md:text-lg font-bold tracking-wider">
            Upload File
          </label>
          <input
            className="border py-2 px-3 rounded-md w-full outline-none focus:border-2 focus:border-blue-500"
            type="file"
            onChange={handleFile}
          />

          {file && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {file.name}
            </p>
          )}
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
