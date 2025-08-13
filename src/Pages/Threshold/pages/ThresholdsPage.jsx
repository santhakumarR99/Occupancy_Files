import React, { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import SearchBar from '../components/SearchBar';
import ThresholdsTable from '../components/ThresholdsTable';
import ThresholdForm from '../components/ThresholdForm';
import DeleteThresholdModal from '../components/DeleteThresholdModal';

const initialThresholds = [
  { name: 'Thershold-1', start: 80, end: 90, duration: 120 },
  { name: 'Thershold-2', start: 225, end: 240, duration: 90 },
  { name: 'Thershold-3', start: 470, end: 480, duration: 60 },
  { name: 'Thershold-4', start: 950, end: 990, duration: 150 },
  { name: 'Thershold-5', start: 720, end: 740, duration: 120 },
  { name: 'Thershold-6', start: 180, end: 190, duration: 90 },
];

const STORAGE_KEY = 'thresholds:list';

export default function ThresholdsPage() {
  const [thresholds, setThresholds] = useState(initialThresholds);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length) setThresholds(list);
      }
    } catch {}
  }, []);

  // Persist to localStorage whenever list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds));
    } catch {}
  }, [thresholds]);

  const filtered = thresholds.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    if (!selectedRow) return;
    setEditData(selectedRow);
    setShowForm(true);
  };

  const handleDelete = () => setShowDelete(true);

  const handleSave = (data) => {
    if (editData) {
      setThresholds(thresholds.map(t => (t === editData ? data : t)));
    } else {
      setThresholds([...thresholds, data]);
    }
    setShowForm(false);
    setEditData(null);
    setSelectedRow(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedRow) return;
    setThresholds(thresholds.filter(t => t !== selectedRow));
    setShowDelete(false);
    setSelectedRow(null);
  };

  return (
    <MainLayout
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      disableEdit={!selectedRow}
      disableDelete={!selectedRow}
    >
      <div className="card">
        <SearchBar value={search} onChange={setSearch} />
        <ThresholdsTable
          thresholds={filtered}
          selectedRow={selectedRow}
          onSelectedChange={setSelectedRow}
        />
      </div>
      <ThresholdForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        initialData={editData}
      />
      <DeleteThresholdModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={handleDeleteConfirm}
      />
    </MainLayout>
  );
}
