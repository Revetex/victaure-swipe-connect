import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export function MenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: newItem.name,
          price: parseFloat(newItem.price),
          category: newItem.category || "Général"
        }
      ]);
      setNewItem({ name: "", price: "", category: "" });
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <Card className="p-6 h-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Nom de l'item</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Ex: Café"
              />
            </div>
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="Ex: 2.50"
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                placeholder="Ex: Boissons"
              />
            </div>
          </div>
          <Button onClick={handleAddItem} className="w-full">
            Ajouter l'item
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border"
                    >
                      <span>{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {item.price.toFixed(2)} $
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </Card>
  );
}