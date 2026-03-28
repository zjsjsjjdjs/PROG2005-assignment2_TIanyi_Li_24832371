import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { InventoryItem } from '../models/item.model';   // 

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm = '';
  filteredItems: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService, private router: Router) {
    this.showAll();
  }

  search(): void {
    this.filteredItems = this.inventoryService.searchByName(this.searchTerm);
  }

  showAll(): void {
    this.filteredItems = this.inventoryService.getItems();
    this.searchTerm = '';
  }

  showPopular(): void {
    this.filteredItems = this.inventoryService.getPopularItems();
    this.searchTerm = '';
  }

  editItem(id: string): void {
    this.router.navigate(['/form', id]);
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(id);
      this.showAll(); // refresh list
    }
  }
}