import { useState } from "react";
import AddContent from "./AddContent";
import ContentAccordion from "./ContentAccodion";

export default function ContentArea({
  folders,
  setFolders,
  selectedId,
  search,
  showAdd,
  setShowAdd,
}) {
  const findFolderById = (items, id) => {
    for (let it of items) {
      if (it.id === id) return it;
      if (it.children) {
        const found = findFolderById(it.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const deleteContent = (contentId) => {
    const update = (items) =>
      items.map((it) => {
        if (it.id === selectedId) {
          return {
            ...it,
            contents: it.contents.filter((c) => c.id !== contentId),
          };
        }
        if (it.children) return { ...it, children: update(it.children) };
        return it;
      });

    setFolders(update(folders));
  };

  const addContent = (content) => {
    const update = (items) =>
      items.map((it) => {
        if (it.id === selectedId) {
          return { ...it, contents: [...(it.contents || []), content] };
        }
        if (it.children) return { ...it, children: update(it.children) };
        return it;
      });

    setFolders(update(folders));
    setShowAdd(false);
  };

  const folder = selectedId ? findFolderById(folders, selectedId) : null;

  const contents = (folder?.contents || []).filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {showAdd && selectedId && <AddContent onAdd={addContent} />}

      <div className="flex-1 overflow-y-auto w-full p-2 sm:p-4">
        {!selectedId ? (
          <div className="h-full flex items-center justify-center text-white text-center">
            <h1 className="bg-zinc-600 border rounded-2xl px-6 py-3 text-sm sm:text-lg font-semibold tracking-wide">
              Select a subfolder from the left panel to view its contents.
            </h1>
          </div>
        ) : (
          <ContentAccordion onDelete={deleteContent} contents={contents} />
        )}
      </div>
    </div>
  );
}
