import { Injectable } from '@angular/core';
import { InventoryItem } from './models/item.model';   // 

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private items: InventoryItem[] = [];

  constructor() {
    this.loadSampleData();
  }

  private loadSampleData(): void {
    this.items.push({
      id: '1',
      name: 'Laptop',
      category: 'Electronics',
      quantity: 10,
      price: 999.99,
      supplier: 'TechCorp',
      stockStatus: 'In Stock',
      popular: 'Yes',
      comment: 'High performance'
    });
    this.items.push({
      id: '2',
      name: 'Desk Chair',
      category: 'Furniture',
      quantity: 3,
      price: 199.99,
      supplier: 'OfficeWorld',
      stockStatus: 'Low Stock',
      popular: 'No'
    });
  }

  getItems(): InventoryItem[] {
    return [...this.items];
  }

  getItemById(id: string): InventoryItem | undefined {
    return this.items.find(i => i.id === id);
  }

  addItem(item: InventoryItem): boolean {
    if (this.items.some(i => i.id === item.id)) return false;
    this.items.push(item);
    return true;
  }

  updateItem(updatedItem: InventoryItem): boolean {
    const index = this.items.findIndex(i => i.id === updatedItem.id);
    if (index === -1) return false;
    this.items[index] = updatedItem;
    return true;
  }

  deleteItem(id: string): boolean {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  searchByName(term: string): InventoryItem[] {
    if (!term) return this.getItems();
    return this.items.filter(i => i.name.toLowerCase().includes(term.toLowerCase()));
  }

  getPopularItems(): InventoryItem[] {
    return this.items.filter(i => i.popular === 'Yes');
  }
}