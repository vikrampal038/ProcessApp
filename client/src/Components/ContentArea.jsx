import { useEffect, useMemo, useState } from "react";
import AddContent from "./AddContent";
import ContentAccordion from "./ContentAccodion";
import {
  createItem,
  fetchItemsByFolder,
  fetchItemsGlobal,
} from "../services/authService";

export default function ContentArea({
  folders,
  setFolders,
  selectedId,
  search,
  showAdd,
  setShowAdd,
}) {
  const [globalResults, setGlobalResults] = useState([]);
  const searchQuery = search.trim();
  const normalizedSearch = searchQuery.toLowerCase();

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
    const removeFromTree = (items) =>
      items.map((it) => {
        const updatedContents = (it.contents || []).filter((c) => c.id !== contentId);
        if (it.children) return { ...it, contents: updatedContents, children: removeFromTree(it.children) };
        return { ...it, contents: updatedContents };
      });

    setFolders((prev) => removeFromTree(prev));
    setGlobalResults((prev) => prev.filter((c) => c.id !== contentId));
  };

  const mapItemToContent = (item) => ({
    id: item._id,
    title: item.name,
    description: item.description || "",
    file: item.file?.data ? item.file : null,
  });

  useEffect(() => {
    const collectFolderIds = (items) => {
      const ids = [];
      const walk = (nodes) => {
        nodes.forEach((node) => {
          ids.push(node.id);
          if (node.children?.length) walk(node.children);
        });
      };
      walk(items || []);
      return ids;
    };

    const loadItemsFromAllFolders = async (token) => {
      const folderIds = collectFolderIds(folders);
      if (!folderIds.length) return [];

      const allItemsByFolder = await Promise.all(
        folderIds.map(async (folderId) => {
          try {
            const folderItems = await fetchItemsByFolder(token, folderId);
            return folderItems.map(mapItemToContent);
          } catch {
            return [];
          }
        })
      );

      return allItemsByFolder.flat();
    };

    const loadGlobalSearch = async () => {
      if (!searchQuery) {
        setGlobalResults([]);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
          const items = await fetchItemsGlobal(token, searchQuery);
          setGlobalResults(items.map(mapItemToContent));
          return;
        } catch {
          // Fallback for older backend without global /items search route.
        }

        const allItems = await loadItemsFromAllFolders(token);
        const filtered = allItems.filter(
          (item) =>
            item.title.toLowerCase().includes(normalizedSearch) ||
            item.description.toLowerCase().includes(normalizedSearch)
        );
        setGlobalResults(filtered);
      } catch (err) {
        console.error("Global search failed", err);
      }
    };

    const timeout = setTimeout(() => {
      loadGlobalSearch();
    }, 250);

    return () => clearTimeout(timeout);
  }, [folders, normalizedSearch, searchQuery]);

  const addContent = async (content) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const created = await createItem(token, {
        name: content.title,
        folderId: selectedId,
        description: content.description || "",
        file: content.file || null,
      });

      const itemId = created?._id || created?.item?._id || Date.now();

      const update = (items) =>
        items.map((it) => {
          if (it.id === selectedId) {
            return {
              ...it,
              contents: [...(it.contents || []), { ...content, id: itemId }],
            };
          }
          if (it.children) return { ...it, children: update(it.children) };
          return it;
        });

      setFolders(update(folders));
      setShowAdd(false);
    } catch (err) {
      console.error("Create item failed", err);
      throw err;
    }
  };

  useEffect(() => {
    const loadItems = async () => {
      if (!selectedId) return;

      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const items = await fetchItemsByFolder(token, selectedId);

        const update = (list) =>
          list.map((it) => {
            if (it.id === selectedId) {
              return {
                ...it,
                contents: items.map(mapItemToContent),
              };
            }
            if (it.children?.length)
              return { ...it, children: update(it.children) };
            return it;
          });

        setFolders((prev) => update(prev));
      } catch (err) {
        console.error("Fetch items failed", err);
      }
    };

    loadItems();
  }, [selectedId, setFolders]);

  const folder = selectedId ? findFolderById(folders, selectedId) : null;
  const contents = useMemo(() => {
    if (searchQuery) return globalResults;
    return folder?.contents || [];
  }, [searchQuery, globalResults, folder]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {showAdd && selectedId && <AddContent onAdd={addContent} />}

      <div className="flex-1 overflow-y-auto w-full p-2 sm:p-4">
        {!selectedId && !searchQuery ? (
          <div className="h-full flex items-center justify-center text-white text-center">
            <h1 className="bg-zinc-600 border rounded-2xl px-6 py-3 text-sm sm:text-lg font-semibold tracking-wide">
              Select a subfolder from the left panel to view its contents.
            </h1>
          </div>
        ) : searchQuery && contents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white text-center">
            <h1 className="bg-zinc-600 border rounded-2xl px-6 py-3 text-sm sm:text-lg font-semibold tracking-wide">
              No matching content found for "{searchQuery}".
            </h1>
          </div>
        ) : (
          <ContentAccordion onDelete={deleteContent} contents={contents} />
        )}
      </div>
    </div>
  );
}
