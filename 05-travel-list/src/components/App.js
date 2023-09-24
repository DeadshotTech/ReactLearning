import { useState } from "react";
import Logo from "./Logo";
import Form from "./Form";
import PackingList from "./PackingList";
import Stats from "./Stats";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: true },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Markers", quantity: 22, packed: true },
// ];

export default function App() {
  // const [items, setItems] = useState(initialItems);

  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((currItem) => [...currItem, item]);
  }

  function handleDeleteItem(id) {
    setItems((currItem) => currItem.filter((item) => item.id !== id));
  }

  function handlePackedItem(id) {
    setItems((currItem) =>
      currItem.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onPackedItem={handlePackedItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}
