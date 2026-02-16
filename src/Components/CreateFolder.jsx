import { useState } from "react";

const [show, setShow] = useState(false);
const [loading, setLoading] = useState(false);

return (
  <>
    <button
      onClick={() => setShow(true)}
      className="border ml-2 px-2 rounded hover:bg-white/10 transition"
    >
      +
    </button>

    {show && (
      <InlineModal
        title="New Folder"
        onClose={() => setShow(false)}
        onSubmit={async (name) => {
          if (!name.trim()) return;

          try {
            setLoading(true);

            // 👉 Future backend API
            // const res = await fetch("http://localhost:4000/api/folders", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ name, parentId }),
            // });
            // const newFolder = await res.json();

            // 👉 Abhi ke liye mock
            const newFolder = {
              id: Date.now(), // ❗ backend me ye id server dega
              name,
              children: [],
              contents: [],
            };

            onAdd(parentId, newFolder);
            setShow(false);
          } catch (err) {
            alert("Folder create nahi hua");
            console.error(err);
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
      />
    )}
  </>
);
