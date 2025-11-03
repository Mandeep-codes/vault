"use client";

import { useEffect, useState } from "react";
import { encryptData, decryptData } from "@/lib/crypto";

interface VaultItem {
  _id: string;
  title: string;
  username?: string;
  password: string; // encrypted in DB
  url?: string;
  notes?: string;
}

export default function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("demoUser"); // replace with auth derived id
  const [newItem, setNewItem] = useState({ title: "", username: "", password: "", url: "", notes: "" });
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // edit modal
  const [editItem, setEditItem] = useState<VaultItem | null>(null);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/vault/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error("fetch items:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleAdd() {
    if (!newItem.title || !newItem.password) return alert("Title and password required");
    const encrypted = encryptData(newItem.password, "temp_demo_key");
    try {
      const res = await fetch("/api/vault/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItem, password: encrypted, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((p) => [data.data, ...p]);
        setNewItem({ title: "", username: "", password: "", url: "", notes: "" });
      } else {
        alert("Add failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleCopy = (ciphertext: string, id: string) => {
    // decrypt locally (client has key)
    const plain = decryptData(ciphertext, "temp_demo_key");
    navigator.clipboard.writeText(plain);
    setCopiedId(id);
    setTimeout(() => {
      navigator.clipboard.writeText("");
      setCopiedId(null);
    }, 15000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch("/api/vault/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) setItems((p) => p.filter((it) => it._id !== id));
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    // if password was changed in the edit UI and appears unencrypted (we'll assume user edits plaintext),
    // you must encrypt before sending. For simplicity, check if it looks like ciphertext (not enforced).
    // We'll encrypt regardless:
    const encrypted = encryptData(editItem.password, "temp_demo_key");
    const payload = { ...editItem, password: encrypted };
    try {
      const res = await fetch("/api/vault/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setItems((p) => p.map((it) => (it._id === data.data._id ? data.data : it)));
        setEditItem(null);
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("update error", err);
    }
  };

  const filtered = items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || (i.username || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🔐 Password Vault (MVP)</h1>

        {/* Add form */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="grid gap-2">
            <input placeholder="Title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Username" value={newItem.username} onChange={(e) => setNewItem({ ...newItem, username: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Password" type="password" value={newItem.password} onChange={(e) => setNewItem({ ...newItem, password: e.target.value })} className="border p-2 rounded" />
            <input placeholder="URL" value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} className="border p-2 rounded" />
            <textarea placeholder="Notes" value={newItem.notes} onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} className="border p-2 rounded" />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
              <button onClick={() => { setNewItem({ title: "", username: "", password: "", url: "", notes: "" }); }} className="bg-gray-200 px-4 py-2 rounded">Clear</button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input placeholder="Search by title or username..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading && <p>Loading...</p>}
          {!loading && filtered.length === 0 && <p className="text-gray-500">No entries</p>}
          {filtered.map((it) => (
            <div key={it._id} className="bg-white p-4 rounded shadow flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-gray-600">User: {it.username}</div>
                {it.url && <div className="text-sm text-blue-600"><a href={it.url} target="_blank" rel="noreferrer">{it.url}</a></div>}
                {it.notes && <div className="mt-1 text-sm text-gray-700">Notes: {it.notes}</div>}
                <div className="mt-2 text-sm">
                  <strong>Decrypted:</strong> {decryptData(it.password, "temp_demo_key")}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => handleCopy(it.password, it._id)} className={`px-3 py-1 rounded ${copiedId === it._id ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
                  {copiedId === it._id ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => setEditItem(it)} className="px-3 py-1 rounded bg-yellow-500 text-white">Edit</button>
                <button onClick={() => handleDelete(it._id)} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit modal */}
        {editItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h3 className="text-lg font-semibold mb-3">Edit Entry</h3>
              <input value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <input value={editItem.username || ""} onChange={(e) => setEditItem({ ...editItem, username: e.target.value })} className="w-full p-2 border rounded mb-2" />
              {/* show decrypted for easier editing */}
              <input value={decryptData(editItem.password, "temp_demo_key")} onChange={(e) => setEditItem({ ...editItem, password: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <input value={editItem.url || ""} onChange={(e) => setEditItem({ ...editItem, url: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <textarea value={editItem.notes || ""} onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })} className="w-full p-2 border rounded mb-2" />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditItem(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleSaveEdit} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
